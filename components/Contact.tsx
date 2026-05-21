import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import './Contact.css';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="contact section-padding">
      <div className="container">
        <div className="contact-content fade-in delay-1">
          <h2 className="contact-title">Let's Build Something</h2>
          <p className="contact-subtext mono">
            <span className="comment">// </span>open to internships, research collabs, and interesting problems
          </p>
          
          <div className="contact-links fade-in delay-2">
            <a href="https://github.com/yuvaraj-r" target="_blank" rel="noopener noreferrer" className="contact-icon" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/yuvaraj-r" target="_blank" rel="noopener noreferrer" className="contact-icon" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="mailto:contact@yuvaraj-r.com" className="contact-icon" aria-label="Email">
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
