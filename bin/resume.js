#!/usr/bin/env node

import readline from 'readline';

// Setup input stream
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
} else {
  // When stdin is a pipe (e.g. streamed over an SSH channel rather than a
  // local TTY) it starts paused — resume it so keypress events still fire.
  process.stdin.resume();
}

// Global state
let activeSection = 0;
let modelType = 'cube'; // 'cube' or 'torus'
let angleX = 0;
let angleY = 0;
let angleZ = 0;

// Screen dimensions
const HEIGHT = 24;
const WIDTH = 80;
const LEFT_PANEL_WIDTH = 35;

// Screen buffer double-buffering
const screen = Array(HEIGHT).fill(null).map(() => 
  Array(WIDTH).fill(null).map(() => ({ char: ' ', color: '' }))
);

// Colors
const COLOR = {
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
  CYAN: '\x1b[36m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  MAGENTA: '\x1b[35m',
  GRAY: '\x1b[90m',
  RED: '\x1b[31m',
  BLUE: '\x1b[34m',
  WHITE: '\x1b[37m'
};

const menuItems = [
  '1. About Me',
  '2. Tech Stack',
  '3. Projects',
  '4. Experience',
  '5. Contact'
];

function clearScreenBuffer() {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      screen[y][x].char = ' ';
      screen[y][x].color = '';
    }
  }
}

function writeString(str, x, y, color = '') {
  for (let i = 0; i < str.length; i++) {
    const curX = x + i;
    if (curX >= 0 && curX < WIDTH && y >= 0 && y < HEIGHT) {
      screen[y][curX].char = str[i];
      screen[y][curX].color = color;
    }
  }
}

function drawPanels() {
  // Draw vertical separator
  for (let y = 0; y < HEIGHT; y++) {
    screen[y][LEFT_PANEL_WIDTH].char = '│';
    screen[y][LEFT_PANEL_WIDTH].color = COLOR.GRAY;
  }
}

// 3D Cube Math
const cubeVertices = [
  [-1, -1, -1],
  [ 1, -1, -1],
  [ 1,  1, -1],
  [-1,  1, -1],
  [-1, -1,  1],
  [ 1, -1,  1],
  [ 1,  1,  1],
  [-1,  1,  1]
];

const cubeEdges = [
  [0, 1], [1, 2], [2, 3], [3, 0], // Back face
  [4, 5], [5, 6], [6, 7], [7, 4], // Front face
  [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
];

function renderCube() {
  const projected = cubeVertices.map(([x, y, z]) => {
    // Rotate around X
    let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
    let z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
    let x1 = x;

    // Rotate around Y
    let x2 = x1 * Math.cos(angleY) + z1 * Math.sin(angleY);
    let z2 = -x1 * Math.sin(angleY) + z1 * Math.cos(angleY);
    let y2 = y1;

    // Rotate around Z
    let x3 = x2 * Math.cos(angleZ) - y2 * Math.sin(angleZ);
    let y3 = x2 * Math.sin(angleZ) + y2 * Math.cos(angleZ);
    let z3 = z2;

    // Perspective Projection
    const distance = 2.4;
    const scaleX = 13;
    const scaleY = 6.5; // Comp for font aspect ratio
    const ooz = 1.0 / (z3 + distance);

    const xp = Math.round(LEFT_PANEL_WIDTH / 2 + x3 * scaleX * ooz);
    const yp = Math.round(HEIGHT / 2 - 1 + y3 * scaleY * ooz);

    return { x: xp, y: yp, z: z3 };
  });

  const density = '.:-=+*#%@';

  cubeEdges.forEach(([i, j]) => {
    const p1 = projected[i];
    const p2 = projected[j];

    const steps = Math.max(Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y)) * 2;
    for (let k = 0; k <= steps; k++) {
      const t = steps === 0 ? 0 : k / steps;
      const x = Math.round(p1.x + (p2.x - p1.x) * t);
      const y = Math.round(p1.y + (p2.y - p1.y) * t);
      const z = p1.z + (p2.z - p1.z) * t;

      if (x >= 0 && x < LEFT_PANEL_WIDTH && y >= 0 && y < HEIGHT) {
        // Shading index mapping depth (-1.73 to 1.73)
        const val = Math.floor((z + 1.8) / 3.6 * density.length);
        const idx = Math.max(0, Math.min(density.length - 1, val));
        
        screen[y][x].char = density[idx];
        screen[y][x].color = COLOR.CYAN;
      }
    }
  });

  // Label inside/near center
  writeString(" NIXOS ", Math.round(LEFT_PANEL_WIDTH / 2 - 4), HEIGHT - 2, COLOR.GRAY);
}

// 3D Torus Math
const R1 = 1;
const R2 = 2;
const K2 = 5;

function renderTorus() {
  const K1 = 14;
  const K1_y = 7;
  const zBuffer = Array(HEIGHT).fill(null).map(() => Array(LEFT_PANEL_WIDTH).fill(0));

  for (let theta = 0; theta < 2 * Math.PI; theta += 0.08) {
    const costheta = Math.cos(theta);
    const sintheta = Math.sin(theta);

    for (let phi = 0; phi < 2 * Math.PI; phi += 0.03) {
      const cosphi = Math.cos(phi);
      const sinphi = Math.sin(phi);

      const circleX = R2 + R1 * costheta;
      const circleY = R1 * sintheta;

      // Rotations
      const x = circleX * (Math.cos(angleY) * cosphi + Math.sin(angleX) * Math.sin(angleY) * sinphi) - circleY * Math.cos(angleX) * Math.sin(angleY);
      const y = circleX * (Math.sin(angleY) * cosphi - Math.sin(angleX) * Math.cos(angleY) * sinphi) + circleY * Math.cos(angleX) * Math.cos(angleY);
      const z = K2 + circleX * Math.cos(angleX) * sinphi + circleY * Math.sin(angleX);
      const ooz = 1.0 / z;

      const xp = Math.floor(LEFT_PANEL_WIDTH / 2 + K1 * x * ooz);
      const yp = Math.floor(HEIGHT / 2 - 1 + K1_y * y * ooz);

      // Light direction: (0, 1, -1) normalized
      const L = cosphi * costheta * Math.sin(angleY) - Math.cos(angleX) * costheta * sinphi - Math.sin(angleX) * sintheta + Math.cos(angleY) * (Math.cos(angleX) * sintheta - costheta * Math.sin(angleX) * sinphi);

      if (xp >= 0 && xp < LEFT_PANEL_WIDTH && yp >= 0 && yp < HEIGHT) {
        if (ooz > zBuffer[yp][xp]) {
          zBuffer[yp][xp] = ooz;
          const chars = '.,-~:;=!*#$@';
          const luminanceIndex = Math.floor((L + 1.4) / 2.8 * 12);
          const char = chars[Math.max(0, Math.min(11, luminanceIndex))];
          screen[yp][xp].char = char;
          screen[yp][xp].color = COLOR.MAGENTA;
        }
      }
    }
  }
  
  writeString(" HYPRLAND ", Math.round(LEFT_PANEL_WIDTH / 2 - 5), HEIGHT - 2, COLOR.GRAY);
}

function drawResumeContent() {
  const rightX = LEFT_PANEL_WIDTH + 3;

  // Header
  writeString("YUVARAJ R — RESUME PORTFOLIO", rightX, 1, COLOR.BOLD + COLOR.CYAN);
  writeString("────────────────────────────", rightX, 2, COLOR.GRAY);

  switch (activeSection) {
    case 0: // About
      writeString("whoami // ML & Agentic Systems", rightX, 4, COLOR.BOLD + COLOR.YELLOW);
      writeString("────────────────────────────────", rightX, 5, COLOR.GRAY);
      writeString("I build robust, agentic AI systems that", rightX, 7, COLOR.WHITE);
      writeString("bridge the gap between complex models and", rightX, 8, COLOR.WHITE);
      writeString("real-world execution. Linux native, I", rightX, 9, COLOR.WHITE);
      writeString("favor performant architectures over", rightX, 10, COLOR.WHITE);
      writeString("bloated frameworks.", rightX, 11, COLOR.WHITE);
      
      writeString("Status : Building", rightX, 13, COLOR.GREEN);
      writeString("Focus  : AI, Edge, Backend", rightX, 14, COLOR.CYAN);
      writeString("OS     : NixOS 24.11 (Vicuna)", rightX, 15, COLOR.WHITE);
      writeString("WM     : Hyprland (Wayland)", rightX, 16, COLOR.WHITE);
      break;

    case 1: // Stack
      writeString("skills // Technical Stack", rightX, 4, COLOR.BOLD + COLOR.YELLOW);
      writeString("────────────────────────────────", rightX, 5, COLOR.GRAY);
      
      writeString("LANGUAGES", rightX, 7, COLOR.CYAN);
      writeString("▸ Python · TypeScript · C++ · Go · Rust", rightX, 8, COLOR.WHITE);
      
      writeString("AI & ML", rightX, 10, COLOR.CYAN);
      writeString("▸ YOLOv8 · PyTorch · Ollama · Whisper", rightX, 11, COLOR.WHITE);
      
      writeString("BACKEND & DEVOPS", rightX, 13, COLOR.CYAN);
      writeString("▸ FastAPI · Node.js · Docker · NixOS", rightX, 14, COLOR.WHITE);
      
      writeString("EMBEDDED", rightX, 16, COLOR.CYAN);
      writeString("▸ ESP8266 · Raspberry Pi · Edge Compute", rightX, 17, COLOR.WHITE);
      break;

    case 2: // Projects
      writeString("projects // Featured Work", rightX, 4, COLOR.BOLD + COLOR.YELLOW);
      writeString("────────────────────────────────", rightX, 5, COLOR.GRAY);
      
      writeString("1. MechSight AI (AI/ML · RPi)", rightX, 7, COLOR.GREEN);
      writeString("   YOLOv8 industrial defect detection on", rightX, 8, COLOR.WHITE);
      writeString("   Raspberry Pi edge hardware.", rightX, 9, COLOR.WHITE);

      writeString("2. BhoomiNode (Web3 · AI)", rightX, 11, COLOR.GREEN);
      writeString("   Farmer land registration + Groq Llama 3", rightX, 12, COLOR.WHITE);
      writeString("   + Polygon smart contracts.", rightX, 13, COLOR.WHITE);

      writeString("3. Hunter System (Full Stack)", rightX, 15, COLOR.GREEN);
      writeString("   Solo Leveling RPG quest system built", rightX, 16, COLOR.WHITE);
      writeString("   on PostgreSQL.", rightX, 17, COLOR.WHITE);
      break;

    case 3: // Experience
      writeString("experience // Education & Roles", rightX, 4, COLOR.BOLD + COLOR.YELLOW);
      writeString("────────────────────────────────", rightX, 5, COLOR.GRAY);
      
      writeString("VIT CHENNAI (B.Tech Computer Science)", rightX, 7, COLOR.CYAN);
      writeString("▸ AI Research & Systems Architecture Focus", rightX, 8, COLOR.WHITE);
      
      writeString("SYSADMIN & HOMELAB (Self-Hosted)", rightX, 10, COLOR.CYAN);
      writeString("▸ Docker orchestration, Tailscale VPN grid,", rightX, 11, COLOR.WHITE);
      writeString("  and NixOS declarative configurations.", rightX, 12, COLOR.WHITE);

      writeString("INDEPENDENT OPEN SOURCE CONTRIBUTOR", rightX, 14, COLOR.CYAN);
      writeString("▸ Built 8+ comprehensive systems at the", rightX, 15, COLOR.WHITE);
      writeString("  intersection of AI and edge networks.", rightX, 16, COLOR.WHITE);
      break;

    case 4: // Contact
      writeString("contact // Connect with me", rightX, 4, COLOR.BOLD + COLOR.YELLOW);
      writeString("────────────────────────────────", rightX, 5, COLOR.GRAY);
      
      writeString("EMAIL    :", rightX, 7, COLOR.CYAN);
      writeString("yuvaraj28022005@gmail.com", rightX + 11, COLOR.WHITE);
      
      writeString("GITHUB   :", rightX, 9, COLOR.CYAN);
      writeString("github.com/YUVARAJ-R-ai", rightX + 11, COLOR.WHITE);
      
      writeString("LINKEDIN :", rightX, 11, COLOR.CYAN);
      writeString("linkedin.com/in/yuvarajr", rightX + 11, COLOR.WHITE);

      writeString("PORTFOLIO:", rightX, 13, COLOR.CYAN);
      writeString("built-by-yuva.vercel.app", rightX + 11, COLOR.WHITE);
      break;
  }

  // Footer navigation menu
  writeString("───────────────────────────────────────────", rightX, 18, COLOR.GRAY);
  for (let i = 0; i < menuItems.length; i++) {
    const isSelected = activeSection === i;
    const color = isSelected ? COLOR.BOLD + COLOR.CYAN : COLOR.GRAY;
    const prefix = isSelected ? '● ' : '  ';
    writeString(prefix + menuItems[i], rightX + 2, 19 + i, color);
  }
}

function flushBuffer() {
  let output = '\x1b[H';
  for (let y = 0; y < HEIGHT; y++) {
    let rowStr = '';
    let currentColor = '';
    for (let x = 0; x < WIDTH; x++) {
      const cell = screen[y][x];
      if (cell.color !== currentColor) {
        rowStr += cell.color || COLOR.RESET;
        currentColor = cell.color;
      }
      rowStr += cell.char;
    }
    if (currentColor !== '') {
      rowStr += COLOR.RESET;
    }
    output += rowStr + '\n';
  }
  process.stdout.write(output);
}

function render() {
  clearScreenBuffer();
  drawPanels();
  
  if (modelType === 'cube') {
    renderCube();
  } else {
    renderTorus();
  }
  
  drawResumeContent();
  flushBuffer();
}

// Update rotation angles
function tick() {
  angleX += 0.03;
  angleY += 0.04;
  angleZ += 0.01;
  render();
}

// Initial draw and loop
process.stdout.write('\x1b[?25l'); // Hide cursor
process.stdout.write('\x1b[2J');   // Clear screen once
render();
const intervalId = setInterval(tick, 50);

// Key listeners
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c' || key.name === 'q' || key.name === 'escape') {
    clearInterval(intervalId);
    process.stdout.write('\x1b[?25h'); // Show cursor
    process.stdout.write('\x1b[2J\x1b[H'); // Clear and return home
    process.exit();
  }

  if (key.name === 'up') {
    activeSection = (activeSection - 1 + menuItems.length) % menuItems.length;
    render();
  } else if (key.name === 'down') {
    activeSection = (activeSection + 1) % menuItems.length;
    render();
  } else if (key.name === 't') {
    modelType = modelType === 'cube' ? 'torus' : 'cube';
    render();
  } else {
    // Number keys 1-5
    const num = parseInt(str);
    if (num >= 1 && num <= 5) {
      activeSection = num - 1;
      render();
    }
  }
});

// Handling resizing/sigint properly
process.on('SIGINT', () => {
  clearInterval(intervalId);
  process.stdout.write('\x1b[?25h');
  process.stdout.write('\x1b[2J\x1b[H');
  process.exit();
});
