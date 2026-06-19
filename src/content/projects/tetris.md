---
title: "(Modded Custom) Tetris"
description: "A custom-made tetris with different game modes; chromatic cascade, reversed flex, time trial, flashlight, and classic. A project for the course Application Development."
date: 2023-23-05
tags: ["web-development", "app-development"]
stack: ["HTML", "Git", "GitHub", "CSS", "Javascript"]
github: "https://github.com/ardnyx/tetris"
featured: true
---

## Overview

Play here: https://ardnyx.github.io/tetris/

Note: If one of the game modes load really slow, try restarting the page, loading a different game mode, or playing classic first.

A custom-made classic tetris + 4 different complex gamemodes. Currently, the website is not available for mobile and it is not meant to be played in it (for now).

![Tetris](/public/images/tetris.png)

## Missing Features
Hold
The hold feature proved to be a challenge. We actually "did" manage to implement the hold feature, but one of the challeneges in implementing this feature was clearing out the current tetromino from the place where the hold was initiated. When the "C" key was clicked, it would hold the tetromino, but at the same time, that same tetromino would be stuck at the position where we started the hold, and it would only disappear once a tetromino got into its way. It was weird and we cannot fix it, possibly due to the structure of the tetris gameplay itself not being friendly to feature addition.

Next Tetrominoes
In the recent versions of tetris, you can see what the current tetrominoes are upcoming next. Due to the nature of the Math.random method, we could not formulate the logic to show the upcoming "n" tetrominoes using the method.

Responsiveness and Movement Snap
If you've observed in tetr.io and jstris, when you move a tetromino left or right, the key immediately "responds", like there's a snap. In our version of tetris, you need to hold the left/right keys for about ~~ a second before it registers as a hold. Again, limited by our knowledge as beginners. Because of this, fast and quick plays aren't possible, and you will have a hard time in the Chromatic Cascade mode at higher levels, where the tetrominoes drop faster.

## Status

Not regularly maintained. We ended our development and didn't improve it much anymore due to various school commitments.
