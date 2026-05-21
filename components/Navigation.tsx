import React, { useState, useEffect } from 'react';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="nav-logo mono">
          <span className="nav-logo-bracket">&lt;</span>
          YR
          <span className="nav-logo-bracket">/&gt;</span>
        </div>
        <div className="nav-links mono">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
