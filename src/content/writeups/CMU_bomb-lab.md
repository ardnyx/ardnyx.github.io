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
There are 6 phases in the binary bomb lab.

## Phase 1
Dump of assembler code for function phase_1:

```nasm
   0x0000000000400ee0 <+0>:     sub    rsp,0x8
   0x0000000000400ee4 <+4>:     mov    esi,0x402400
   0x0000000000400ee9 <+9>:     call   0x401338 <strings_not_equal>
   0x0000000000400eee <+14>:    test   eax,eax
   0x0000000000400ef0 <+16>:    je     0x400ef7 <phase_1+23>
   0x0000000000400ef2 <+18>:    call   0x40143a <explode_bomb>
   0x0000000000400ef7 <+23>:    add    rsp,0x8
   0x0000000000400efb <+27>:    ret
```

This one is pretty easy. According to the **System V x86-64 Calling Convention**:

> Parameters to functions are passed in via the registers rdi, rsi, rdx, rcx, r8, and r9.

So as the value inside 0x402400 is being passed to esi (32-bit form of rsi), it's safe to assume 0x402400 contains the string which will be passed in `strings_not_equal(<0x402400)`

We execute x/s 0x402400 to get the value inside that memory, because obviously, it's a string.
## Phase 2
Dump of assembler code for function phase_2:
```nasm
=> 0x0000000000400efc <+0>:     push   rbp
   0x0000000000400efd <+1>:     push   rbx
   0x0000000000400efe <+2>:     sub    rsp,0x28
   0x0000000000400f02 <+6>:     mov    rsi,rsp
   0x0000000000400f05 <+9>:     call   0x40145c <read_six_numbers>
   0x0000000000400f0a <+14>:    cmp    DWORD PTR [rsp],0x1
   0x0000000000400f0e <+18>:    je     0x400f30 <phase_2+52>
   0x0000000000400f10 <+20>:    call   0x40143a <explode_bomb>
   0x0000000000400f15 <+25>:    jmp    0x400f30 <phase_2+52>
   0x0000000000400f17 <+27>:    mov    eax,DWORD PTR [rbx-0x4]
   0x0000000000400f1a <+30>:    add    eax,eax
   0x0000000000400f1c <+32>:    cmp    DWORD PTR [rbx],eax
   0x0000000000400f1e <+34>:    je     0x400f25 <phase_2+41>
   0x0000000000400f20 <+36>:    call   0x40143a <explode_bomb>
   0x0000000000400f25 <+41>:    add    rbx,0x4
   0x0000000000400f29 <+45>:    cmp    rbx,rbp
   0x0000000000400f2c <+48>:    jne    0x400f17 <phase_2+27>
   0x0000000000400f2e <+50>:    jmp    0x400f3c <phase_2+64>
   0x0000000000400f30 <+52>:    lea    rbx,[rsp+0x4]
   0x0000000000400f35 <+57>:    lea    rbp,[rsp+0x18]
   0x0000000000400f3a <+62>:    jmp    0x400f17 <phase_2+27>
   0x0000000000400f3c <+64>:    add    rsp,0x28
   0x0000000000400f40 <+68>:    pop    rbx
   0x0000000000400f41 <+69>:    pop    rbp
   0x0000000000400f42 <+70>:    ret
```
Upon inspection of the assembly dump, we can see that this phase accepts 6 numbers. If we try to keep stepping just before the `read_six_numbers` function, these are the registers:

```nasm
 RAX  0x6037d0 (input_strings+80)
 RBX  0x7fffffffe0f8 —▸ 0x7fffffffe3d9 ◂— '/home/rei/bomb/bomb'
 RCX  0xb
 RDX  2
 RDI  0x6037d0 (input_strings+80)
*RSI  0x7fffffffdf90 ◂— 0
```
`rdi` holds our input string. `rsi` holds the address before the read_six_numbers function creates a new stack frame.
```nasm
   0x000000000040145c <+0>:     sub    rsp,0x18
   0x0000000000401460 <+4>:     mov    rdx,rsi
   0x0000000000401463 <+7>:     lea    rcx,[rsi+0x4]
   0x0000000000401467 <+11>:    lea    rax,[rsi+0x14]
   0x000000000040146b <+15>:    mov    QWORD PTR [rsp+0x8],rax
   0x0000000000401470 <+20>:    lea    rax,[rsi+0x10]
   0x0000000000401474 <+24>:    mov    QWORD PTR [rsp],rax
   0x0000000000401478 <+28>:    lea    r9,[rsi+0xc]
   0x000000000040147c <+32>:    lea    r8,[rsi+0x8]
   0x0000000000401480 <+36>:    mov    esi,0x4025c3
   0x0000000000401485 <+41>:    mov    eax,0x0
   0x000000000040148a <+46>:    call   0x400bf0 <__isoc99_sscanf@plt>
   0x000000000040148f <+51>:    cmp    eax,0x5
   0x0000000000401492 <+54>:    jg     0x401499 <read_six_numbers+61>
   0x0000000000401494 <+56>:    call   0x40143a <explode_bomb>
   0x0000000000401499 <+61>:    add    rsp,0x18
   0x000000000040149d <+65>:    ret
```
`scanf` is called after a bunch of `lea`s in here. Actually, we don't need to overthink about what it is going to do as this is essentially just putting the values in registers, and the excess parameter (?) (I forgot whether the correct term is parameter or argument) in the stack. Based on the disassembly, the format of how the inputs are read are "%d %d %d %d %d %d". So in C it must be something like:
```c
scanf("%d %d %d %d %d %d", &a, &b, &c, &d, &e, &f);
```
And the numbers are stored in `0x7fffffffdf90` to `0x7fffffffdfa4`, 4 bytes each integer.

---
Now we are back onto the main phase, and the next instruction after the six numbers are read is that the value inside the memory being pointed by the stack pointer is being compared by 1. `cmp    DWORD PTR [rsp],0x1`. 

Wait! Looking at this specific code:
```nasm
   0x400f17 <phase_2+27>    mov    eax, dword ptr [rbx - 4]     EAX, [0x7fffffffdf90] => 1
   0x400f1a <phase_2+30>    add    eax, eax                     EAX => 2 (1 + 1)
   0x400f1c <phase_2+32>    cmp    dword ptr [rbx], eax         2 - 2     EFLAGS => 0x246 [ cf PF af ZF sf IF df of ac ]
   0x400f1e <phase_2+34>  ✔ je     phase_2+41                  <phase_2+41>
```
This one keeps looping. But the logic of this is that after the first number, it gets put into the eax/rax register, add it to itself, and increase the base address by 4 (through `rbx`), so we are going to the next input number. And then it keeps looping by itself until we reach the last number.

That means in this case, this is an arithmetic sequence of 6 numbers. So the answer is most likely 1 2 4 8 16 32.
## Phase 3
```nasm
   0x0000000000400f43 <+0>:     sub    rsp,0x18
   0x0000000000400f47 <+4>:     lea    rcx,[rsp+0xc]
   0x0000000000400f4c <+9>:     lea    rdx,[rsp+0x8]
   0x0000000000400f51 <+14>:    mov    esi,0x4025cf
   0x0000000000400f56 <+19>:    mov    eax,0x0
   0x0000000000400f5b <+24>:    call   0x400bf0 <__isoc99_sscanf@plt>
   0x0000000000400f60 <+29>:    cmp    eax,0x1
   0x0000000000400f63 <+32>:    jg     0x400f6a <phase_3+39>
   0x0000000000400f65 <+34>:    call   0x40143a <explode_bomb>
   0x0000000000400f6a <+39>:    cmp    DWORD PTR [rsp+0x8],0x7
   0x0000000000400f6f <+44>:    ja     0x400fad <phase_3+106>
   0x0000000000400f71 <+46>:    mov    eax,DWORD PTR [rsp+0x8]
   0x0000000000400f75 <+50>:    jmp    QWORD PTR [rax*8+0x402470]
   0x0000000000400f7c <+57>:    mov    eax,0xcf
   0x0000000000400f81 <+62>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f83 <+64>:    mov    eax,0x2c3
   0x0000000000400f88 <+69>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f8a <+71>:    mov    eax,0x100
   0x0000000000400f8f <+76>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f91 <+78>:    mov    eax,0x185
   0x0000000000400f96 <+83>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f98 <+85>:    mov    eax,0xce
   0x0000000000400f9d <+90>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400f9f <+92>:    mov    eax,0x2aa
   0x0000000000400fa4 <+97>:    jmp    0x400fbe <phase_3+123>
   0x0000000000400fa6 <+99>:    mov    eax,0x147
   0x0000000000400fab <+104>:   jmp    0x400fbe <phase_3+123>
   0x0000000000400fad <+106>:   call   0x40143a <explode_bomb>
   0x0000000000400fb2 <+111>:   mov    eax,0x0
   0x0000000000400fb7 <+116>:   jmp    0x400fbe <phase_3+123>
   0x0000000000400fb9 <+118>:   mov    eax,0x137
   0x0000000000400fbe <+123>:   cmp    eax,DWORD PTR [rsp+0xc]
   0x0000000000400fc2 <+127>:   je     0x400fc9 <phase_3+134>
   0x0000000000400fc4 <+129>:   call   0x40143a <explode_bomb>
   0x0000000000400fc9 <+134>:   add    rsp,0x18
   0x0000000000400fcd <+138>:   ret
```
Oh thank goodness there are no other functions! But looking at this disassembly, it "might" actually look daunting at first (especially when I read this the first time), because there are a lot of `jmp`s. But let's take a closer look first before we start debugging.
```nasm
   0x0000000000400f51 <+14>:    mov    esi,0x4025cf
   0x0000000000400f56 <+19>:    mov    eax,0x0
   0x0000000000400f5b <+24>:    call   0x400bf0 <__isoc99_sscanf@plt>
```
This line means something inside 0x4025cf is being read by scanf:
```c
0x4025cf:       "%d %d"
```
Then that's a huge clue! It means it is just reading two numbers. AFter that though, now it's an inspection of a lot of jumps.
We can also see that after scanf, we do a `cmp eax, 1`. Looking at the registers:
```nasm
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
```nasm
=> 0x0000000000400f60 <+29>:    cmp    eax,0x1
   0x0000000000400f63 <+32>:    jg     0x400f6a <phase_3+39>
   0x0000000000400f65 <+34>:    call   0x40143a <explode_bomb>
   0x0000000000400f6a <+39>:    cmp    DWORD PTR [rsp+0x8],0x7
```
We can easily tell that this must be an if-else statement that checks if the input is greater than 1, then it will explode the bomb, else proceed to the `cmp    DWORD PTR [rsp+0x8],0x7` instruction. 

```nasm
00:0000│ rsp 0x7fffffffdfb0 —▸ 0x7fffffffe0f8 —▸ 0x7fffffffe3d9 ◂— '/home/rei/bomb/bomb'
01:0008│-0b8 0x7fffffffdfb8 ◂— 0x200000001
```
Upon viewing the stack, the next instruction says whatever is the value stored at the rsp+8 memory location, compare that to 7 by doing DWORD PTR [rsp+0x8], and we can see at the view of the stack above that if we inspect that memory location using:
```nasm
pwndbg> x/1xb $rsp+8
0x7fffffffdfb8: 0x01
```
We see our first input, which is 1 (and for reference, I put 1 2 as my input). `int`s are typically 4 bytes so that means our second number is stored 4 bytes after that..
```nasm
pwndbg> x/1xb $rsp+0xc
0x7fffffffdfbc: 0x02
```
Yes! I am finally getting the hang of this `examine` command and memory placements HAHAH, this is fun. Anyways, according to the x86-64 assembly cheatsheet I have, `ja` means unsigned >, so we can tell that our first number should not be greater than 7 because it explodes the bomb. After these, we are moving the first input to `eax`.

```nasm
 ► 0x400f75 <phase_3+50>     jmp    qword ptr [rax*8 + 0x402470] <phase_3+118>
    ↓
   0x400fb9 <phase_3+118>    mov    eax, 0x137                     EAX => 0x137
   0x400fbe <phase_3+123>    cmp    eax, dword ptr [rsp + 0xc]     0x137 - 0x2     EFLAGS => 0x206 [ cf PF af zf sf IF df of ac ]
   0x400fc2 <phase_3+127>  ✘ je     phase_3+134                 <phase_3+134>

   0x400fc4 <phase_3+129>    call   explode_bomb                <explode_bomb>
```
Looks like we're hitting that explode_bomb with our inputs `1 2`. But wait, it looks like it is using our first number to "jump somewhere" and then it moves a value into `eax`, and compares it to the second number. `0x137` in decimal is 311. `<phase_3+134>` is collapsing the stack frame and bypasses the `explode_bomb`. 
```nasm
   0x0000000000400fc4 <+129>:   call   0x40143a <explode_bomb>
   0x0000000000400fc9 <+134>:   add    rsp,0x18
   0x0000000000400fcd <+138>:   ret
```
Okay.. but what about the other jumps then? Let's try `2 3` as the input and advance to `=> 0x0000000000400f75 <+50>:    jmp    QWORD PTR [rax*8+0x402470]`. Let's see what happens. 

---
```nasm
0x400f75 <phase_3+50>     jmp    qword ptr [rax*8 + 0x402470] <phase_3+64>
```
Oh, this time we're jumping to `<phase_3+64>`. And it `mov`s 0x2c3, compares that to our second number, explodes the bomb if unequal. I think I am getting the hang of this. That means if we put 3 as the first input, I suspect we will be going to this line: ` 0x0000000000400f8a <+71>:    mov    eax,0x100`. Let's try.

---
```nasm
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
```nasm
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

## Phase 5

## Phase 6

