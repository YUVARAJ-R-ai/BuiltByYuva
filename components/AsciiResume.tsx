import React, { useState, useEffect } from 'react';
import './AsciiResume.css';

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
  [0, 1], [1, 2], [2, 3], [3, 0], // Back
  [4, 5], [5, 6], [6, 7], [7, 4], // Front
  [0, 4], [1, 5], [2, 6], [3, 7]  // Connectors
];

const R1 = 1;
const R2 = 2;
const K2 = 5;

const AsciiResume: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'skills' | 'projects' | 'contact'>('about');
  const [modelType, setModelType] = useState<'cube' | 'torus'>('cube');
  const [frame, setFrame] = useState('');

  // Rotation angles
  const angleRef = React.useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    let animId: number;

    const tick = () => {
      // Update angles
      angleRef.current.x += 0.02;
      angleRef.current.y += 0.03;
      angleRef.current.z += 0.01;

      const { x: ax, y: ay, z: az } = angleRef.current;
      const height = 18;
      const width = 32;
      
      // Initialize character buffer
      const buffer = Array(height).fill(null).map(() => Array(width).fill(' '));

      if (modelType === 'cube') {
        const projected = cubeVertices.map(([x, y, z]) => {
          // Rotate X
          let y1 = y * Math.cos(ax) - z * Math.sin(ax);
          let z1 = y * Math.sin(ax) + z * Math.cos(ax);
          let x1 = x;

          // Rotate Y
          let x2 = x1 * Math.cos(ay) + z1 * Math.sin(ay);
          let z2 = -x1 * Math.sin(ay) + z1 * Math.cos(ay);
          let y2 = y1;

          // Rotate Z
          let x3 = x2 * Math.cos(az) - y2 * Math.sin(az);
          let y3 = x2 * Math.sin(az) + y2 * Math.cos(az);
          let z3 = z2;

          const distance = 2.4;
          const scaleX = 12;
          const scaleY = 6;
          const ooz = 1.0 / (z3 + distance);

          const xp = Math.round(width / 2 + x3 * scaleX * ooz);
          const yp = Math.round(height / 2 + y3 * scaleY * ooz);

          return { x: xp, y: yp, z: z3 };
        });

        const density = '.:-=+*#%@';

        cubeEdges.forEach(([i, j]) => {
          const p1 = projected[i];
          const p2 = projected[j];

          const steps = Math.max(Math.abs(p2.x - p1.x), Math.abs(p2.y - p1.y)) * 2;
          for (let k = 0; k <= steps; k++) {
            const t = steps === 0 ? 0 : k / steps;
            const px = Math.round(p1.x + (p2.x - p1.x) * t);
            const py = Math.round(p1.y + (p2.y - p1.y) * t);
            const pz = p1.z + (p2.z - p1.z) * t;

            if (px >= 0 && px < width && py >= 0 && py < height) {
              const val = Math.floor((pz + 1.8) / 3.6 * density.length);
              const idx = Math.max(0, Math.min(density.length - 1, val));
              buffer[py][px] = density[idx];
            }
          }
        });
      } else {
        // Torus
        const K1 = 12;
        const K1_y = 6;
        const zBuffer = Array(height).fill(null).map(() => Array(width).fill(0));

        for (let theta = 0; theta < 2 * Math.PI; theta += 0.15) {
          const costheta = Math.cos(theta);
          const sintheta = Math.sin(theta);

          for (let phi = 0; phi < 2 * Math.PI; phi += 0.06) {
            const cosphi = Math.cos(phi);
            const sinphi = Math.sin(phi);

            const circleX = R2 + R1 * costheta;
            const circleY = R1 * sintheta;

            const x = circleX * (Math.cos(ay) * cosphi + Math.sin(ax) * Math.sin(ay) * sinphi) - circleY * Math.cos(ax) * Math.sin(ay);
            const y = circleX * (Math.sin(ay) * cosphi - Math.sin(ax) * Math.cos(ay) * sinphi) + circleY * Math.cos(ax) * Math.cos(ay);
            const z = K2 + circleX * Math.cos(ax) * sinphi + circleY * Math.sin(ax);
            const ooz = 1.0 / z;

            const xp = Math.floor(width / 2 + K1 * x * ooz);
            const yp = Math.floor(height / 2 + K1_y * y * ooz);

            const L = cosphi * costheta * Math.sin(ay) - Math.cos(ax) * costheta * sinphi - Math.sin(ax) * sintheta + Math.cos(ay) * (Math.cos(ax) * sintheta - costheta * Math.sin(ax) * sinphi);

            if (xp >= 0 && xp < width && yp >= 0 && yp < height) {
              if (ooz > zBuffer[yp][xp]) {
                zBuffer[yp][xp] = ooz;
                const chars = '.,-~:;=!*#$@';
                const luminanceIndex = Math.floor((L + 1.4) / 2.8 * 12);
                const char = chars[Math.max(0, Math.min(11, luminanceIndex))];
                buffer[yp][xp] = char;
              }
            }
          }
        }
      }

      setFrame(buffer.map(row => row.join('')).join('\n'));
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [modelType]);

  return (
    <div className="ascii-resume-container">
      <div className="ascii-resume-layout">
        {/* Left Column: 3D Animation */}
        <div className="ascii-left-panel">
          <pre className={`ascii-art-pre ${modelType}`}>{frame}</pre>
          <div className="ascii-model-toggle">
            <button 
              className={`toggle-btn ${modelType === 'cube' ? 'active' : ''}`}
              onClick={() => setModelType('cube')}
            >
              Cube
            </button>
            <button 
              className={`toggle-btn ${modelType === 'torus' ? 'active' : ''}`}
              onClick={() => setModelType('torus')}
            >
              Torus
            </button>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="ascii-divider"></div>

        {/* Right Column: Resume Details */}
        <div className="ascii-right-panel">
          <div className="ascii-resume-header">
            <h3>Yuvaraj R</h3>
            <span className="ascii-resume-title">ML Engineer & Systems Builder</span>
          </div>

          <div className="ascii-tabs">
            <button 
              className={`ascii-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => setActiveTab('about')}
            >
              whoami
            </button>
            <button 
              className={`ascii-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              skills
            </button>
            <button 
              className={`ascii-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveTab('projects')}
            >
              projects
            </button>
            <button 
              className={`ascii-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              contact
            </button>
          </div>

          <div className="ascii-tab-content">
            {activeTab === 'about' && (
              <div className="tab-pane">
                <p className="tab-intro">I build robust, agentic AI systems that bridge the gap between complex models and real-world execution. Linux native, I favor minimal, highly performant architectures over bloated abstractions.</p>
                <div className="details-grid">
                  <div className="details-row"><span className="details-label">Focus:</span> <span>Agentic AI & Edge Compute</span></div>
                  <div className="details-row"><span className="details-label">OS:</span> <span>NixOS (Vicuna)</span></div>
                  <div className="details-row"><span className="details-label">WM:</span> <span>Hyprland</span></div>
                  <div className="details-row"><span className="details-label">Hardware:</span> <span>Raspberry Pi & ESP8266</span></div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="tab-pane">
                <div className="skills-section">
                  <strong>Languages:</strong>
                  <p>Python · TypeScript · C++ · Go · Rust · Bash</p>
                </div>
                <div className="skills-section">
                  <strong>AI & ML:</strong>
                  <p>PyTorch · YOLOv8 · Ollama · Whisper · OpenCV</p>
                </div>
                <div className="skills-section">
                  <strong>Backend & DevOps:</strong>
                  <p>FastAPI · Node.js · Docker · NixOS · PostgreSQL</p>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="tab-pane projects-list">
                <div className="project-item">
                  <strong>MechSight AI <span className="project-tag">AI/ML</span></strong>
                  <p>YOLOv8 defect detection on RPi edge hardware.</p>
                </div>
                <div className="project-item">
                  <strong>BhoomiNode <span className="project-tag">Web3</span></strong>
                  <p>Land registration + Groq + Polygon smart contracts.</p>
                </div>
                <div className="project-item">
                  <strong>Hunter System <span className="project-tag">Full Stack</span></strong>
                  <p>Solo Leveling RPG built on PostgreSQL.</p>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="tab-pane contact-pane">
                <p>Feel free to reach out for collaborations or opportunities:</p>
                <div className="contact-methods">
                  <div><strong>Email:</strong> <a href="mailto:yuvaraj28022005@gmail.com">yuvaraj28022005@gmail.com</a></div>
                  <div><strong>GitHub:</strong> <a href="https://github.com/YUVARAJ-R-ai" target="_blank" rel="noreferrer">github.com/YUVARAJ-R-ai</a></div>
                  <div><strong>LinkedIn:</strong> <a href="https://linkedin.com/in/yuvarajr" target="_blank" rel="noreferrer">linkedin.com/in/yuvarajr</a></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="ascii-resume-footer">
        <span>Click on the tabs or toggle models to interact with the 3D art!</span>
      </div>
    </div>
  );
};

export default AsciiResume;
