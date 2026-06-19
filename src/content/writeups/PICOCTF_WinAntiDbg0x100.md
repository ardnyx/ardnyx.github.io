---
title: "Pico CTF: WinAntiDbg0x100"
description: "Level 1 of bypassing anti-debugging techniques. Solved this challenge by inverting the 'jump' instructions to execute the code that will give the flag."
date: 2026-05-05
category: ctf
tags: ["c", "x86-64 asm", "anti-debugging"]
difficulty: medium
event: "picoCTF"
featured: true
---

## WinAntiDbg0x100

**Category:** Reverse Engineering - Medium  
**Author:** Nandan Desai

## Introduction

This challenge introduces **Anti-Debugging** techniques.

Malware developers don't like it when you debug their executable files because debugging can reveal many of their secrets. That's why they often include logic specifically designed to interfere with debugging.

The challenge is to debug a Windows executable.

This binary is a Windows console application and can be started from `cmd` on Windows.

## Initial Output

When the program starts, it displays a welcome message:

```text
_             _____  _______  ______
(_)           / ____|__    __|   ____|
_  __ _ ___ ___ | | | | | |__
| '_ \| |/ __/ _ \| | | | | __|
| |_) | | (_| (_) | |____ | | | |
| .__/|_|\___\___/ \_____| |_| |_|
| |
|_|

Welcome to the Anti-Debug challenge!

### To start the challenge, you'll need to first launch this program using a debugger!
```

## Loading the Binary

The executable was opened in **IDA**.

- It is a Portable Executable (PE)
- Architecture: 80386 (32-bit)
- No processor changes were necessary

The binary appears mostly stripped, so the analysis proceeds directly to the `main` function.

## Key Discovery

At a deeper level of the assembly:

```asm
loc_4015E7:
push offset aLevel1WhyDidTh
call ds:OutputDebugStringW
push 7
call sub_401440
add esp, 4
call ds:IsDebuggerPresent
test eax, eax
jz short loc_40161B
```

The associated string is:

```text
### Level 1: Why did the clever programmer become a
gardener? Because they discovered their talent for
growing a 'patch' of roses!
```

The keyword **patch** is an important clue.

## Anti-Debugging Check

The binary calls:

```c
IsDebuggerPresent()
```

which checks whether the process is currently being debugged.

If a debugger is detected, execution reaches:

```asm
.text:002E1606 push offset aOopsTheDebugge
.text:002E160B call ds:OutputDebugStringW
.text:002E1611 jmp loc_2E16A2
```

## Solution

Reverse the conditional jump instruction:

```asm
jz
```

so execution follows the opposite branch.

After patching this jump and stepping through a few more instructions, the program reveals the flag.
