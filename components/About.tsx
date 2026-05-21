import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about section-padding">
      <div className="container grid-12">
        <div className="about-bio fade-in delay-1">
          <h2 className="section-title mono">
            <span className="comment">// </span>whoami
          </h2>
          <p className="bio-text">
            I build robust, agentic AI systems that bridge the gap between complex models and real-world execution. With deep roots in the Linux ecosystem, my approach favors minimal, highly performant architectures over bloated abstractions. I write code meant for production, from embedded edge devices to scalable backend services.
          </p>
        </div>
        
        <div className="about-stats fade-in delay-2">
          <div className="neofetch-card mono">
            <div className="neofetch-line">
              <span className="neofetch-label">OS</span>
              <span className="neofetch-value">NixOS</span>
            </div>
            <div className="neofetch-line">
              <span className="neofetch-label">WM</span>
              <span className="neofetch-value">Hyprland</span>
            </div>
            <div className="neofetch-line">
              <span className="neofetch-label">Focus</span>
              <span className="neofetch-value">Agentic AI</span>
            </div>
            <div className="neofetch-line">
              <span className="neofetch-label">Edge</span>
              <span className="neofetch-value">ESP8266 &middot; RPi</span>
            </div>
            <div className="neofetch-line">
              <span className="neofetch-label">Status</span>
              <span className="neofetch-value">Building</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
