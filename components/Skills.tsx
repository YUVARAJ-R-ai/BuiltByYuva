import React from 'react';
import './Skills.css';

const skillCategories = [
  {
    title: 'Languages',
    skills: ['Python', 'TypeScript', 'C++', 'Go', 'Bash', 'Rust'],
  },
  {
    title: 'AI & ML',
    skills: ['PyTorch', 'TensorFlow', 'Ollama', 'Whisper', 'Computer Vision', 'LangChain'],
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'PostgreSQL', 'FastAPI', 'Redis', 'PostGIS'],
  },
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'Vite', 'Three.js', 'WebRTC'],
  },
  {
    title: 'DevOps',
    skills: ['Docker', 'NixOS', 'Tailscale', 'CI/CD', 'Linux'],
  },
  {
    title: 'Embedded',
    skills: ['ESP8266', 'Raspberry Pi', 'Edge Computing', 'IoT'],
  },
];

const Skills: React.FC = () => {
  return (
    <section id="skills" className="skills section-padding">
      <div className="container">
        <h2 className="section-title mono fade-in delay-1">Technical Stack</h2>
        
        <div className="skills-grid fade-in delay-2">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-category">
              <h3 className="category-title mono">{category.title}</h3>
              <div className="skill-chips">
                {category.skills.map((skill, sIndex) => (
                  <span key={sIndex} className="skill-chip mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
