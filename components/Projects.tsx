import React, { useState } from 'react';
import './Projects.css';

const projects = [
  {
    title: 'MechSight AI',
    description: 'YOLOv8 industrial defect detection on Raspberry Pi edge hardware with centralized Flask inference server.',
    tags: ['Computer Vision', 'YOLOv8', 'Flask', 'RPi'],
    category: 'AI/ML',
    featured: true,
    link: 'https://github.com/YUVARAJ-R-ai/MechSight-AI',
  },
  {
    title: 'BhoomiNode',
    description: 'Blockchain AgriTech — voice-first farmer land registration with Groq Llama 3, NDVI satellite verification, and Polygon smart contracts.',
    tags: ['Blockchain', 'FastAPI', 'Groq', 'Polygon'],
    category: 'Blockchain',
    featured: false,
    link: 'https://github.com/YUVARAJ-R-ai',
  },
  {
    title: 'Hunter System',
    description: 'Solo Leveling-inspired life RPG — turns real tasks into quests with XP, boss raids, and a 12-table PostgreSQL schema.',
    tags: ['React 19', 'Node.js', 'PostgreSQL', 'Docker'],
    category: 'Full Stack',
    featured: false,
    link: 'https://github.com/YUVARAJ-R-ai',
  },
  {
    title: 'Atlas Finance',
    description: 'Privacy-first financial platform with local LLMs via Ollama, dual Next.js + Flutter frontend.',
    tags: ['Local LLM', 'FastAPI', 'Flutter', 'Next.js'],
    category: 'AI/ML',
    featured: false,
    link: 'https://github.com/YUVARAJ-R-ai',
  },
  {
    title: 'Vidora AI',
    description: 'Hybrid local + cloud AI video analysis platform. Full-stack monorepo with Next.js and FastAPI.',
    tags: ['Next.js', 'FastAPI', 'Docker', 'AI'],
    category: 'AI/ML',
    featured: false,
    link: 'https://github.com/YUVARAJ-R-ai',
  },
  {
    title: 'Wayline',
    description: 'Self-hosted routing and geocoding API using OSRM and PostGIS — zero cloud dependency.',
    tags: ['OSRM', 'PostGIS', 'Docker', 'GIS'],
    category: 'Backend',
    featured: false,
    link: 'https://github.com/YUVARAJ-R-ai',
  },
  {
    title: 'NoteWeave API',
    description: 'Async lecture-to-knowledge-graph pipeline: Whisper speech-to-text + NLP extraction via Celery workers.',
    tags: ['Whisper', 'NLP', 'FastAPI', 'Redis'],
    category: 'Backend',
    featured: false,
    link: 'https://github.com/YUVARAJ-R-ai',
  },
  {
    title: 'Miltz',
    description: 'Cinematic 3D marketing site with scroll-linked React Three Fiber animations and WebGL product visuals.',
    tags: ['Three.js', 'R3F', 'Next.js', 'WebGL'],
    category: 'Frontend',
    featured: false,
    link: 'https://github.com/YUVARAJ-R-ai',
  },
  {
    title: 'DevOrchestrator',
    description: 'Multi-agent orchestration system that automates the SDLC pipeline — from planning and coding to testing and deployment.',
    tags: ['Python', 'Multi-Agent', 'SDLC', 'Automation'],
    category: 'AI/ML',
    featured: false,
    link: 'https://github.com/YUVARAJ-R-ai/DevOrchestrator',
  },
];

const CATEGORIES = ['All', 'AI/ML', 'Full Stack', 'Backend', 'Frontend', 'Blockchain'];

const Projects: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <section id="projects" className="projects section-padding">
      <div className="container">
        <div className="projects-header fade-in delay-1">
          <h2 className="section-title mono">
            Projects <span className="comment">// selected work</span>
          </h2>

          <div className="filter-bar mono">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {featured && (
          <div className="projects-featured fade-in delay-2">
            <a
              href={featured.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`project-card featured block-link ${hoveredIndex === 0 ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="card-accent-line"></div>
              <div className="featured-inner">
                <div>
                  <span className="project-category mono">{featured.category}</span>
                  <h3 className="project-title featured-title">{featured.title}</h3>
                  <p className="project-desc mono">{featured.description}</p>
                </div>
                <div className="featured-footer">
                  <div className="project-tags">
                    {featured.tags.map((tag, i) => <span key={i} className="tag mono">{tag}</span>)}
                  </div>
                  <span className="hover-arrow mono">↗ GitHub</span>
                </div>
              </div>
            </a>
          </div>
        )}

        <div className={`projects-grid fade-in delay-3 ${rest.length > 0 ? '' : 'empty'}`}>
          {rest.map((project, index) => (
            <a
              key={`${project.title}-${index}`}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`project-card block-link ${hoveredIndex === index + 1 ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(index + 1)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="card-accent-line"></div>
              <span className="project-category mono">{project.category}</span>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-desc mono">{project.description}</p>
              <div className="project-footer">
                <div className="project-tags">
                  {project.tags.map((tag, i) => <span key={i} className="tag mono">{tag}</span>)}
                </div>
                <span className="hover-arrow mono">↗</span>
              </div>
            </a>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="no-results mono">No projects in this category yet.</p>
        )}
      </div>
    </section>
  );
};

export default Projects;
