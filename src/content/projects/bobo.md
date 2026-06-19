---
title: "bobo - Mutation Algorithm Visualizer"
description: "Python-based grid-based algorithm visualizer (works best for matrix algorithms where there is actual mutation)."
date: 2026-20-06
tags: ["tui-development", "low level-esque", "project-management"]
stack: ["Python", "Git", "systrace"]
github: "https://github.com/ardnyx/bobo"
featured: true
---
# TAKE NOTE 
Do take note that for algorithms like BFS where the grid itself never changes (uses a separate visited set (I'm not sure if you can code a BFS where the grid itself changes)), bobo only shows 1 frame (the initial grid). The tracer only visualizes actual grid mutations.

---
## Overview
This "algorithm visualizer" which is built on Python (I know, gets pretty slow on maybe larger stuff), relies heavily on Python's sys.settrace. Basically what this does it on every line of code, it inspects local variables for 2D lists (grids/matrices) and bobo does the following:

1. Detects the grid automatically (no annotations needed)
2. Diffs the new state against the previous snapshot
3. Highlights which cells just changed (reverse video)
4. Renders the frame with auto-assigned colors
5. Without touching the source code itself.

## Examples
Some of the examples where bobo works best are given below:
![tetromino](/images/bobo-gifs/rotate_tetromino.gif)
![knight](/images/bobo-gifs/knight_tour.gif)
![maze](/images/bobo-gifs/maze_generation.gif)
