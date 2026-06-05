# 3D ASCII Resume — Local and Web Guide

This guide covers the features, architecture, and usage of your custom interactive 3D ASCII resume implemented in this project.

The system features:
1. **Interactive Terminal CLI Tool** (`bin/resume.js`)
2. **Web Terminal Integration** (`components/AsciiResume.tsx`)

---

## Part 1: Interactive Terminal CLI Utility

The local command-line script is located at [resume.js](file:///home/yuvaraj/Drive1/projects/resume-1/bin/resume.js).

### Features
* **Double-buffered character canvas** rendering at ~20 FPS.
* **3D Shaded Wireframe Cube** rendering using depth/perspective projection.
* **3D Shaded Torus (Donut)** using normal-based light source rendering (Andy Sloane math).
* **Keyboard navigation**:
  * Use **Up / Down Arrow Keys** to browse resume sections.
  * Use **Number Keys (1-5)** to jump directly to sections.
  * Press **`t`** to toggle between the 3D Cube and 3D Torus.
  * Press **`q`**, **`Escape`**, or **`Ctrl + C`** to quit and cleanly restore the terminal settings.

### How to Run it Locally

Run this command in your project workspace:
```bash
npm run resume
```
Or run the executable script directly:
```bash
node bin/resume.js
```

---

## Part 2: Web Terminal Integration

The 3D ASCII Resume is built directly into your website's simulated hero terminal. 

### Key Files
* **Component Code**: [AsciiResume.tsx](file:///home/yuvaraj/Drive1/projects/resume-1/components/AsciiResume.tsx) – Handles the React rendering loop using `requestAnimationFrame` and projects the 3D objects onto an HTML `<pre>` block.
* **Styling**: [AsciiResume.css](file:///home/yuvaraj/Drive1/projects/resume-1/components/AsciiResume.css) – Handles layout and terminal colors (cyan glow for the cube, magenta glow for the torus).
* **Terminal Router**: [Hero.tsx](file:///home/yuvaraj/Drive1/projects/resume-1/components/Hero.tsx) – Maps the `resume` command to the new component and adds it to the autocomplete and `help` commands.

### How to Use on the Web
1. Open your web app (e.g. running `npm run dev`).
2. Focus the hero terminal window.
3. Type **`resume`** and press **Enter** (or type `res` and press **Tab** to autocomplete!).
4. The terminal will mount the interactive component showing the spinning 3D art on the left and the resume section tabs on the right.
5. You can click on the tabs (**whoami**, **skills**, **projects**, **contact**) and toggle the 3D models (**Cube** or **Torus**) directly on the screen.

---

## 3D ASCII Engine Details

The rendering engine works by allocating a virtual character grid, projecting 3D geometry coordinates using Euler rotation matrices, and applying perspective transformations:

$$x_{\text{proj}} = x_{\text{rotated}} \cdot \frac{\text{scale}_x}{z_{\text{rotated}} + \text{distance}} + \text{center}_x$$
$$y_{\text{proj}} = y_{\text{rotated}} \cdot \frac{\text{scale}_y}{z_{\text{rotated}} + \text{distance}} + \text{center}_y$$

For the cube, Bresenham-style interpolation connects vertices, selecting character shading density based on the Z-coordinate. For the torus, normal dot product calculations map individual surface points to lighting levels (`.,-~:;=!*#$@`), creating realistic volume shading.
