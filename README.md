# 🗺️ TrekTracker

[![Live Demo](https://img.shields.io/badge/Demo-Live_Preview-brightgreen.svg)](#) <!-- Add your deployment link here -->
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**TrekTracker** is an interactive, multi-sensory web application built to visualize how different graph theory algorithms hunt for the shortest path. 

Moving beyond standard grid visualizers, TrekTracker pushes the boundaries of browser rendering and AI simulation. It features **3D Isometric rendering**, **Dynamic Heatmaps**, **Algorithm Sonification (Audio)**, and an **Analytics Dashboard** to compare the performance and memory usage of various search strategies in real-time.

<p align="center">
  <!-- 💡 TIP: Record a 10-second GIF of your project running in 3D mode with the heatmap and place it in your folder. Then update this image path! -->
  <img src="./public/demo.gif" alt="TrekTracker Demo GIF" width="800" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);">
</p>

---

## ✨ Standout Features

While most visualizers stop at flat 2D grids and basic coloring, TrekTracker introduces next-level UI/UX and DOM manipulation:

*   🏙️ **3D Isometric Engine:** Toggle the grid into a hardware-accelerated 3D plane using advanced CSS3 transforms. Walls physically extrude to form a "cityscape," and the algorithm's path weaves dynamically through the skyscrapers.
*   🌡️ **Thermal Heatmap Generation:** Explored nodes don't just change color—they dynamically map their distance from the start to an HSL color gradient. Watch the algorithm expand from cold blue, to green, and finally blazing red as it explores deeper.
*   🎵 **Algorithm Sonification:** Hooked into the Web Audio API, TrekTracker maps grid distances to a C-Major Pentatonic scale. You can actually *hear* the math as the algorithm searches—Breadth-First Search creates a chaotic symphony, while A* plays a targeted, climbing melody.
*   📊 **Real-Time Analytics Dashboard:** After an algorithm finishes, the dashboard displays Execution Time (ms), Nodes Explored (simulating memory footprint), and the Shortest Path Length, mathematically proving why heuristic algorithms outpace unweighted ones.
*   🦇 **Cellular Automata Caves:** Alongside standard Recursive Division mazes, TrekTracker uses Cellular Automata to generate organic, natural-looking cave systems.

---

## 🧠 Algorithms Implemented

### Weighted Algorithms (Accounts for terrain cost)
*   **A* Search:** Arguably the best pathfinding algorithm; uses heuristics to guarantee the shortest path much faster than Dijkstra.
*   **Dijkstra's Algorithm:** The father of pathfinding algorithms; guarantees the shortest path but blindly explores in all directions.
*   **Greedy Best-first Search:** A faster, heuristic-heavy version of A*; does not guarantee the shortest path.
*   **Swarm Algorithm:** A custom heuristic algorithm that acts as a blend of Dijkstra and A*.
*   **Bidirectional Swarm:** Two swarm algorithms that start from both sides and meet in the middle.

### Unweighted Algorithms (Ignores terrain cost)
*   **Breadth-first Search (BFS):** Explores all neighbors equally. Guarantees the shortest path on an unweighted grid.
*   **Depth-first Search (DFS):** Explores as deeply as possible before backtracking. A terrible algorithm for pathfinding, included for educational comparison.

---

## 🏗️ Architecture & Code Quality

TrekTracker was built with a strict adherence to **Object-Oriented Programming (OOP)** and the **Single Responsibility Principle (SRP)**. 

The monolithic board logic is broken down into highly modular, testable files:
*   `algorithmRunner.js`: Handles algorithm execution, timing, and dashboard updates.
*   `launchAnimations.js`: Manages the asynchronous animation queue and calculates the HSL Heatmap math.
*   `audioSymphony.js`: Isolates the Web Audio API synthesizer logic.
*   `clearPath.js` / `clearBoard.js`: Dedicated state-reset modules.

---

## 🛠️ Installation & Setup

To run TrekTracker locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/](https://github.com/)<your-username>/trektracker.git
   cd trektracker

