import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';

interface TerminalHistoryItem {
  command: string;
  output: React.ReactNode;
}

const initialHistory: TerminalHistoryItem[] = [
  { command: 'whoami', output: 'yuvaraj-r' },
  { command: 'cat stack.txt', output: 'ai-systems · edge-computing · backend · computer-vision' },
  { command: 'uptime', output: '19 years · always learning' }
];

const Hero: React.FC = () => {
  const [cursorBlink, setCursorBlink] = useState(true);
  const [history, setHistory] = useState<TerminalHistoryItem[]>(initialHistory);
  const [input, setInput] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorBlink((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom when history changes
  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    let output: React.ReactNode = '';
    const lowerCmd = trimmedCmd.toLowerCase();

    switch (lowerCmd) {
      case 'help':
        output = (
          <div>
            Available commands:<br/>
            &nbsp;&nbsp;whoami&nbsp;&nbsp;&nbsp;&nbsp;- Print user information<br/>
            &nbsp;&nbsp;skills&nbsp;&nbsp;&nbsp;&nbsp;- List technical stack<br/>
            &nbsp;&nbsp;projects&nbsp;&nbsp;- Show selected projects<br/>
            &nbsp;&nbsp;clear&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Clear the terminal window<br/>
            &nbsp;&nbsp;help&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Show this help message
          </div>
        );
        break;
      case 'whoami':
        output = 'yuvaraj-r - ML Engineer · Systems Builder · Linux Native';
        break;
      case 'skills':
        output = 'Languages: Python, TS, C++, Go, Rust\nAI/ML: PyTorch, local LLMs, Whisper, CV\nBackend: Node.js, Postgres, FastAPI\nDevOps: NixOS, Docker, Edge Computing';
        break;
      case 'projects':
        output = '1. MechSight AI\n2. Atlas Finance\n3. Wayline\n4. NoteWeave API\n5. Power Fault Detection\n6. Miltz';
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'sudo':
        output = 'yuvaraj-r is not in the sudoers file. This incident will be reported.';
        break;
      default:
        output = `bash: command not found: ${trimmedCmd}`;
    }

    setHistory((prev) => [...prev, { command: trimmedCmd, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="container grid-12 hero-grid">
        <div className="hero-content fade-in delay-1">
          <h1 className="hero-title">Yuvaraj R</h1>
          <p className="hero-subtitle mono">
            <span className="comment">// </span>ML Engineer · Systems Builder · Linux Native
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">View Work</a>
            <a href="/resume.pdf" className="btn btn-ghost" target="_blank" rel="noopener noreferrer">Resume &darr;</a>
          </div>
        </div>
        
        <div className="hero-terminal fade-in delay-2">
          <div className="terminal-window" onClick={handleTerminalClick}>
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-close"></span>
                <span className="dot dot-min"></span>
                <span className="dot dot-max"></span>
              </div>
            </div>
            <div className="terminal-body mono" ref={terminalBodyRef}>
              {history.map((item, i) => (
                <div key={i} className="history-item">
                  <div className="terminal-line mt-2">
                    <span className="prompt">$</span> <span className="cmd">{item.command}</span>
                  </div>
                  <div className="terminal-output" style={{ whiteSpace: 'pre-wrap' }}>{item.output}</div>
                </div>
              ))}
              
              <div className="terminal-line mt-2 active-line">
                <span className="prompt">$</span> 
                <span className="cmd active-cmd">
                  {input}
                  <span className={`cursor ${cursorBlink ? 'visible' : 'hidden'}`}>_</span>
                </span>
                <input 
                  type="text" 
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="hidden-input"
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
