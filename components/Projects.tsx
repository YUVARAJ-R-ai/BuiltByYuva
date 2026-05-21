import React from 'react';
import './Projects.css';

const projects = [
  {
    title: 'MechSight AI',
    description: 'YOLOv8 industrial defect detection system',
    tags: ['Computer Vision', 'PyTorch', 'Python'],
    featured: true,
    link: 'https://github.com/YUVARAJ-R-ai/MechSight-AI',
  },
  {
    title: 'Atlas Finance',
    description: 'Privacy-first AI finance, local LLMs via Ollama',
    tags: ['Local LLM', 'Finance', 'React'],
    featured: false,
    link: 'https://github.com/yuvarajr/atlas-finance',
  },
  {
    title: 'Wayline',
    description: 'Self-hosted routing API, OSRM + PostGIS',
    tags: ['GIS', 'OSRM', 'PostGIS'],
    featured: false,
    link: 'https://github.com/yuvarajr/wayline',
  },
  {
    title: 'NoteWeave API',
    description: 'Whisper + NLP async lecture pipeline',
    tags: ['Whisper', 'NLP', 'FastAPI'],
    featured: false,
    link: 'https://github.com/yuvarajr/noteweave-api',
  },
  {
    title: 'Miltz',
    description: 'React Three Fiber 3D marketing site',
    tags: ['Three.js', 'React', 'WebGL'],
    featured: false,
    link: 'https://github.com/yuvarajr/miltz',
  },
  {
    title: 'Power Fault Detection',
    description: '100% accuracy Random Forest classifier',
    tags: ['ML', 'Random Forest', 'ESP8266'],
    featured: false,
    link: 'https://github.com/yuvarajr/power-fault-detection',
  },
];

const Projects: React.FC = () => {
  const featuredProject = projects[0];
  const stackedProjects = projects.slice(1, 3);
  const remainingProjects = projects.slice(3);

  return (
    <section id="projects" className="projects section-padding">
      <div className="container">
        <h2 className="section-title mono fade-in delay-1">
          Projects <span className="comment">// selected work</span>
        </h2>

        <div className="projects-grid fade-in delay-2">
          {/* Master-stack tiling layout */}
          <div className="tiling-master">
            <a href={featuredProject.link} target="_blank" rel="noopener noreferrer" className="project-card featured block-link">
              <div className="card-top-border"></div>
              <h3 className="project-title">{featuredProject.title}</h3>
              <p className="project-desc mono">{featuredProject.description}</p>
              <div className="project-tags">
                {featuredProject.tags.map((tag, i) => (
                  <span key={i} className="tag mono">{tag}</span>
                ))}
              </div>
              <span className="hover-arrow mono">&#x2197; View on GitHub</span>
            </a>
          </div>
          
          <div className="tiling-stack">
            {stackedProjects.map((project, index) => (
              <a key={index} href={project.link} target="_blank" rel="noopener noreferrer" className="project-card block-link">
                <div className="card-top-border"></div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc mono">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, i) => (
                    <span key={i} className="tag mono">{tag}</span>
                  ))}
                </div>
                <span className="hover-arrow mono">&#x2197; View on GitHub</span>
              </a>
            ))}
          </div>
        </div>

        <div className="projects-grid-3 fade-in delay-3 mt-4">
          {remainingProjects.map((project, index) => (
            <a key={index} href={project.link} target="_blank" rel="noopener noreferrer" className="project-card block-link">
              <div className="card-top-border"></div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc mono">{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag, i) => (
                  <span key={i} className="tag mono">{tag}</span>
                ))}
              </div>
              <span className="hover-arrow mono">&#x2197; View on GitHub</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
