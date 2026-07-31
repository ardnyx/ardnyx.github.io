---
title: "HackTheBox Cyber Apocalypse 2026: RINg The Bell"
description: "A simple binary exploitation problem that involves a stack-based buffer overflow"
date: 2026-07-24
category: ctf
tags: ["c", "pwn"]
difficulty: very easy
event: "HackTheBox"
featured: false
---

## Overview

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

----

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

