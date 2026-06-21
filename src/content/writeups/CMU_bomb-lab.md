---
title: "CMU: Binary Bomb Lab"
description: "6 phases of increasing assembly debugging challenges in increasing difficulty. Strictly done using GDB with pwndbg and GEF."
date: 2026-06-20
category: ctf
tags: ["c", "x86-64 asm", "debugging"]
difficulty: insane
event: "CMU Lab Assignments"
featured: true
---

## Overview
There are 6 phases in the binary bomb lab. To be honest, this is just a laboratory exercise from **Carnegie Mellon University**, but it is such a good reverse engineering exercise that I improved my debugging skills, reading assembly, mapping them out to a higher-level logic, and even how datas are structured according to endianness and their placements in the virtual memory. 

## Phase 1
Dump of assembler code for function phase_1:

```asm
sub    rsp,0x8
mov    esi,0x402400
call   0x401338 <strings_not_equal>
test   eax,eax
je     0x400ef7 <phase_1+23>
call   0x40143a <explode_bomb>
add    rsp,0x8
ret
```

This one is pretty easy. According to the **System V x86-64 Calling Convention**:

> Parameters to functions are passed in via the registers rdi, rsi, rdx, rcx, r8, and r9.

So as the value inside 0x402400 is being passed to esi (32-bit form of rsi), it's safe to assume 0x402400 contains the string which will be passed in `strings_not_equal(<0x402400)`

We execute x/s 0x402400 to get the value inside that memory, because obviously, it's a string.
## Phase 2
Dump of assembler code for function phase_2:
```asm
=> push   rbp
   push   rbx
   sub    rsp,0x28
   mov    rsi,rsp
   call   0x40145c <read_six_numbers>
   cmp    DWORD PTR [rsp],0x1
   je     0x400f30 <phase_2+52>
   call   0x40143a <explode_bomb>
   jmp    0x400f30 <phase_2+52>
   mov    eax,DWORD PTR [rbx-0x4]
   add    eax,eax
   cmp    DWORD PTR [rbx],eax
   je     0x400f25 <phase_2+41>
   call   0x40143a <explode_bomb>
   add    rbx,0x4
   cmp    rbx,rbp
   jne    0x400f17 <phase_2+27>
   jmp    0x400f3c <phase_2+64>
   lea    rbx,[rsp+0x4]
   lea    rbp,[rsp+0x18]
   jmp    0x400f17 <phase_2+27>
   add    rsp,0x28
   pop    rbx
   pop    rbp
   ret
```
Upon inspection of the assembly dump, we can see that this phase accepts 6 numbers. If we try to keep stepping just before the `read_six_numbers` function, these are the registers:

```asm
 RAX  0x6037d0 (input_strings+80)
 RBX  0x7fffffffe0f8 —▸ 0x7fffffffe3d9 ◂— '/home/rei/bomb/bomb'
 RCX  0xb
 RDX  2
 RDI  0x6037d0 (input_strings+80)
*RSI  0x7fffffffdf90 ◂— 0
```
`rdi` holds our input string. `rsi` holds the address before the read_six_numbers function creates a new stack frame.
```asm
sub    rsp,0x18
mov    rdx,rsi
lea    rcx,[rsi+0x4]
lea    rax,[rsi+0x14]
mov    QWORD PTR [rsp+0x8],rax
lea    rax,[rsi+0x10]
mov    QWORD PTR [rsp],rax
lea    r9,[rsi+0xc]
lea    r8,[rsi+0x8]
mov    esi,0x4025c3
mov    eax,0x0
call   0x400bf0 <__isoc99_sscanf@plt>
cmp    eax,0x5
jg     0x401499 <read_six_numbers+61>
call   0x40143a <explode_bomb>
add    rsp,0x18
ret
```
`scanf` is called after a bunch of `lea`s in here. Actually, we don't need to overthink about what it is going to do as this is essentially just putting the values in registers, and the excess parameter (?) (I forgot whether the correct term is parameter or argument) in the stack. Based on the disassembly, the format of how the inputs are read are "%d %d %d %d %d %d". So in C it must be something like:
```c
scanf("%d %d %d %d %d %d", &a, &b, &c, &d, &e, &f);
```
And the numbers are stored in `0x7fffffffdf90` to `0x7fffffffdfa4`, 4 bytes each integer.

---
Now we are back onto the main phase, and the next instruction after the six numbers are read is that the value inside the memory being pointed by the stack pointer is being compared by 1. `cmp    DWORD PTR [rsp],0x1`. 

Wait! Looking at this specific code:
```asm
  mov    eax, dword ptr [rbx - 4]     EAX, [0x7fffffffdf90] => 1
  add    eax, eax                     EAX => 2 (1 + 1)
  cmp    dword ptr [rbx], eax         2 - 2     EFLAGS => 0x246 [ cf PF af ZF sf IF df of ac ]
✔ je     phase_2+41                  <phase_2+41>
```
This one keeps looping. But the logic of this is that after the first number, it gets put into the eax/rax register, add it to itself, and increase the base address by 4 (through `rbx`), so we are going to the next input number. And then it keeps looping by itself until we reach the last number.

That means in this case, this is an arithmetic sequence of 6 numbers. So the answer is most likely 1 2 4 8 16 32.
## Phase 3
```asm
 sub    rsp,0x18
 lea    rcx,[rsp+0xc]
 lea    rdx,[rsp+0x8]
 mov    esi,0x4025cf
 mov    eax,0x0
 call   0x400bf0 <__isoc99_sscanf@plt>
 cmp    eax,0x1
 jg     0x400f6a <phase_3+39>
 call   0x40143a <explode_bomb>
 cmp    DWORD PTR [rsp+0x8],0x7
 ja     0x400fad <phase_3+106>
 mov    eax,DWORD PTR [rsp+0x8]
 jmp    QWORD PTR [rax*8+0x402470]
 mov    eax,0xcf
 jmp    0x400fbe <phase_3+123>
 mov    eax,0x2c3
 jmp    0x400fbe <phase_3+123>
 mov    eax,0x100
 jmp    0x400fbe <phase_3+123>
 mov    eax,0x185
 jmp    0x400fbe <phase_3+123>
 mov    eax,0xce
 jmp    0x400fbe <phase_3+123>
 mov    eax,0x2aa
 jmp    0x400fbe <phase_3+123>
 mov    eax,0x147
 jmp    0x400fbe <phase_3+123>
 call   0x40143a <explode_bomb>
 mov    eax,0x0
 jmp    0x400fbe <phase_3+123>
 mov    eax,0x137
 cmp    eax,DWORD PTR [rsp+0xc]
 je     0x400fc9 <phase_3+134>
 call   0x40143a <explode_bomb>
 add    rsp,0x18
 ret
```
Oh thank goodness there are no other functions! But looking at this disassembly, it "might" actually look daunting at first (especially when I read this the first time), because there are a lot of `jmp`s. But let's take a closer look first before we start debugging.
```asm
 mov    esi,0x4025cf
 mov    eax,0x0
 call   0x400bf0 <__isoc99_sscanf@plt>
```
This line means something inside 0x4025cf is being read by scanf:
```c
0x4025cf:       "%d %d"
```
Then that's a huge clue! It means it is just reading two numbers. AFter that though, now it's an inspection of a lot of jumps.
We can also see that after scanf, we do a `cmp eax, 1`. Looking at the registers:
```asm
*RAX  2
 RBX  0x7fffffffe0f8 —▸ 0x7fffffffe3d9 ◂— '/home/rei/bomb/bomb'
*RCX  0
*RDX  0
*RDI  0x7fffffffd950 —▸ 0x7ffff7c00032 ◂— 0xe003800400000
*RSI  2
*R8   0xffffffff
*R9   0
*R10  0x7ffff7db1fc0 (_nl_C_LC_CTYPE_toupper+512) ◂— 0x100000000
*R11  0x7fffffffddd0 ◂— 0xfbad8001
```
A lot of them changed, but we don't have to delve in the nitty-gritty details of it, only what looks like useful information. We can see that `rax` changed to two. Contextually, we put 2 decimals as the input, so it must be counting how many numbers we have inputted. Add the next instruction:
```asm
=> cmp    eax,0x1
   jg     0x400f6a <phase_3+39>
   call   0x40143a <explode_bomb>
   cmp    DWORD PTR [rsp+0x8],0x7
```
We can easily tell that this must be an if-else statement that checks if the input is greater than 1, then it will explode the bomb, else proceed to the `cmp    DWORD PTR [rsp+0x8],0x7` instruction. 

```c
00:0000│ rsp 0x7fffffffdfb0 —▸ 0x7fffffffe0f8 —▸ 0x7fffffffe3d9 ◂— '/home/rei/bomb/bomb'
01:0008│-0b8 0x7fffffffdfb8 ◂— 0x200000001
```
Upon viewing the stack, the next instruction says whatever is the value stored at the rsp+8 memory location, compare that to 7 by doing DWORD PTR [rsp+0x8], and we can see at the view of the stack above that if we inspect that memory location using:
```c
pwndbg> x/1xb $rsp+8
0x7fffffffdfb8: 0x01
```
We see our first input, which is 1 (and for reference, I put 1 2 as my input). `int`s are typically 4 bytes so that means our second number is stored 4 bytes after that..
```c
pwndbg> x/1xb $rsp+0xc
0x7fffffffdfbc: 0x02
```
Yes! I am finally getting the hang of this `examine` command and memory placements HAHAH, this is fun. Anyways, according to the x86-64 assembly cheatsheet I have, `ja` means unsigned >, so we can tell that our first number should not be greater than 7 because it explodes the bomb. After these, we are moving the first input to `eax`.

```asm
 ► 0x400f75 <phase_3+50>     jmp    qword ptr [rax*8 + 0x402470] <phase_3+118>
    ↓
   0x400fb9 <phase_3+118>    mov    eax, 0x137                     EAX => 0x137
   0x400fbe <phase_3+123>    cmp    eax, dword ptr [rsp + 0xc]     0x137 - 0x2     EFLAGS => 0x206 [ cf PF af zf sf IF df of ac ]
   0x400fc2 <phase_3+127>  ✘ je     phase_3+134                 <phase_3+134>

   0x400fc4 <phase_3+129>    call   explode_bomb                <explode_bomb>
```
Looks like we're hitting that explode_bomb with our inputs `1 2`. But wait, it looks like it is using our first number to "jump somewhere" and then it moves a value into `eax`, and compares it to the second number. `0x137` in decimal is 311. `<phase_3+134>` is collapsing the stack frame and bypasses the `explode_bomb`. 
```asm
call   0x40143a <explode_bomb>
add    rsp,0x18
ret
```
Okay.. but what about the other jumps then? Let's try `2 3` as the input and advance to `=> 0x0000000000400f75 <+50>:    jmp    QWORD PTR [rax*8+0x402470]`. Let's see what happens. 

---
```asm
0x400f75 <phase_3+50>     jmp    qword ptr [rax*8 + 0x402470] <phase_3+64>
```
Oh, this time we're jumping to `<phase_3+64>`. And it `mov`s 0x2c3, compares that to our second number, explodes the bomb if unequal. I think I am getting the hang of this. That means if we put 3 as the first input, I suspect we will be going to this line: ` 0x0000000000400f8a <+71>:    mov    eax,0x100`. Let's try.

---
```asm
 ► 0x400f75 <phase_3+50>     jmp    qword ptr [rax*8 + 0x402470] <phase_3+71>
    ↓
   0x400f8a <phase_3+71>     mov    eax, 0x100                   EAX => 0x100
   0x400f8f <phase_3+76>     jmp    phase_3+123                 <phase_3+123>
    ↓
   0x400fbe <phase_3+123>    cmp    eax, dword ptr [rsp + 0xc]     0x100 - 0x4     EFLAGS => 0x216 [ cf PF AF zf sf IF df of ac ]
   0x400fc2 <phase_3+127>  ✘ je     phase_3+134                 <phase_3+134>

   0x400fc4 <phase_3+129>    call   explode_bomb                <explode_bomb>
```
YES I AM CORRECT! I THINK THIS IS A SERIES OF SWITCH STATEMENTS? Well, that means I can choose numbers 1-7 (or I think I can choose 0 as well), then the second number is just converting the hexadecimals of those getting `mov`ed into rax depending on the block of switch statements. 
```asm
   0x400fbe <phase_3+123>    cmp    eax, dword ptr [rsp + 0xc]     0xcf - 0xcf     EFLAGS => 0x246 [ cf PF af ZF sf IF df of ac ]
 ► 0x400fc2 <phase_3+127>  ✔ je     phase_3+134                 <phase_3+134>
    ↓
   0x400fc9 <phase_3+134>    add    rsp, 0x18                      RSP => 0x7fffffffdfc8 (0x7fffffffdfb0 + 0x18)
   0x400fcd <phase_3+138>    ret                                <main+215>
    ↓
   0x400e77 <main+215>       call   phase_defused               <phase_defused>
```
Eyy! Let's go!
## Phase 4
This one accepts two decimals with the same formatting as `phase_3`. The new challenge in this phase is that there is a `func4` function in here. But before that, we can see that our first number is being compared with `0xe` (14), and checks if it is less than or equal, else `explode_bomb`. Okay, let's run this phase and put 14 14 as our inputs then.
```c
cmp    DWORD PTR [rsp+0x8],0xe
jbe    0x40103a <phase_4+46>
call   0x40143a <explode_bomb>
```
Next part, we are putting three arguments (according to the calling convention) before calling `func4`.
```c
=> mov    edx,0xe // arg 3
   mov    esi,0x0 // arg 2
   mov    edi,DWORD PTR [rsp+0x8] // arg 1
   call   0x400fce <func4>
```
So technically the C code for that looks like this:
```c
func4 (<input>, 0, 14) // we have to remember that arg 2 and 3 are hardcoded. 14 is currently the 1st num.
```
---
`func4` is interesting. We are now delving within bitwise shifting. And there is looping involved. Anyways, to start with:
```c
mov    eax, edx             EAX => 0xe
sub    eax, esi             EAX => 0xe (0xe - 0x0)
mov    ecx, eax             ECX => 0xe
shr    ecx, 0x1f
```
We are subtracting the 3rd arg with the 2nd arg. And then doing >> 31. It seems like whatever we do `ecx` is going to be zeroed out (or maybe that's just how it is since this is the first time). The next few instructions are:
```c
  add    eax, ecx             EAX => 0xe (0xe + 0x0)
  sar    eax, 1
  lea    ecx, [rax + rsi]     ECX => 7
  cmp    ecx, edi             0x7 - 0xe     EFLAGS => 0x297 [ CF PF AF zf SF IF df of ac ]
✔ jle    func4+36                    <func4+36>
```
Ohh, we are dividing 14 by 2 so we get 7, and then we perform fast maths with `lea` and store it in `rcx`, then subtract it with our input (14). After stepping a bit more, we end with a `lea    esi, [rcx + 1]` instruction, our 2nd arg is storing the halved `edx` into `esi`. This feels like a recursion.

> To be continued.
## Phase 5
> Finished but not yet documented.
## Phase 6
> Not yet finished, took a break.
