import React from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';

export default function App() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <div className="section-divider"></div>
        <About />
        <div className="section-divider"></div>
        <Skills />
        <div className="section-divider"></div>
        <Projects />
        <div className="section-divider"></div>
        <Contact />
      </main>
    </>
  );
}