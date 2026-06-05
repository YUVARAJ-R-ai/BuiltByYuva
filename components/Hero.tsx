import React, { useState, useEffect, useRef } from 'react';
import './Hero.css';
import AsciiResume from './AsciiResume';

interface TerminalHistoryItem {
  command: string;
  output: React.ReactNode;
}

const getOutput = (cmd: string): React.ReactNode | null => {
  const now = new Date();
  const dateStr = now.toUTCString();

  switch (cmd) {
    case 'whoami':
      return 'yuvaraj-r';

    case 'uname -a':
      return 'Linux nixos 6.6.32-zen1 #1-NixOS SMP x86_64 GNU/Linux';

    case 'neofetch':
      return (
        <div className="neofetch-output">
          <div className="nf-logo">
            <span className="nf-c1">   \\  \\ //</span><br/>
            <span className="nf-c1">  ==\\__\\/ //</span><br/>
            <span className="nf-c2">    //   \\//</span><br/>
            <span className="nf-c2">   //    //</span><br/>
            <span className="nf-c1">  //    //</span><br/>
            <span className="nf-c1"> // \\ // </span>
          </div>
          <div className="nf-info">
            <span className="nf-user">yuvaraj@nixos</span><br/>
            <span className="nf-sep">──────────────</span><br/>
            <span className="nf-key">OS</span>: NixOS 24.11 (Vicuna)<br/>
            <span className="nf-key">WM</span>: Hyprland<br/>
            <span className="nf-key">Shell</span>: zsh 5.9<br/>
            <span className="nf-key">Terminal</span>: kitty<br/>
            <span className="nf-key">CPU</span>: AMD Ryzen (8) @ 3.8GHz<br/>
            <span className="nf-key">Memory</span>: 4.2GiB / 16GiB<br/>
            <span className="nf-key">Focus</span>: AI · Edge · Backend
          </div>
        </div>
      );

    case 'ls':
      return (
        <span>
          <span className="ls-dir">about/</span>{'  '}
          <span className="ls-dir">projects/</span>{'  '}
          <span className="ls-dir">skills/</span>{'  '}
          <span className="ls-file">contact.txt</span>{'  '}
          <span className="ls-file">resume.pdf</span>
        </span>
      );

    case 'ls projects/':
      return (
        <div>
          <span className="ls-file">mechsight-ai/</span>{'   '}
          <span className="ls-file">bhoominode/</span>{'   '}
          <span className="ls-file">hunter-system/</span><br/>
          <span className="ls-file">atlas-finance/</span>{'  '}
          <span className="ls-file">wayline/</span>{'       '}
          <span className="ls-file">vidora-ai/</span><br/>
          <span className="ls-file">noteweave-api/</span>{'  '}
          <span className="ls-file">miltz/</span>
        </div>
      );

    case 'cat contact.txt':
      return (
        <div>
          email   → yuvaraj28022005@gmail.com<br/>
          github  → github.com/YUVARAJ-R-ai<br/>
          linkedin→ linkedin.com/in/yuvarajr<br/>
          web     → built-by-yuva.vercel.app
        </div>
      );

    case 'git log --oneline':
      return (
        <div>
          <span className="git-hash">a3f2c1d</span> feat: add BhoomiNode blockchain AgriTech platform<br/>
          <span className="git-hash">b9e4a7f</span> feat: hunter-system RPG gamification app<br/>
          <span className="git-hash">c1d8b3e</span> feat: vidora-ai video analysis platform<br/>
          <span className="git-hash">f2a9c6b</span> feat: mechsight YOLOv8 defect detection<br/>
          <span className="git-hash">d7e3f1a</span> feat: atlas finance local LLM integration<br/>
          <span className="git-hash">e4b2d9c</span> init: portfolio site · NixOS · Hyprland
        </div>
      );

    case 'date':
      return dateStr;

    case 'ping built-by-yuva.vercel.app':
      return (
        <div>
          PING built-by-yuva.vercel.app (76.76.21.21)<br/>
          64 bytes: icmp_seq=1 ttl=55 time=<span style={{color:'var(--accent-primary)'}}>12.4 ms</span><br/>
          64 bytes: icmp_seq=2 ttl=55 time=<span style={{color:'var(--accent-primary)'}}>11.8 ms</span><br/>
          64 bytes: icmp_seq=3 ttl=55 time=<span style={{color:'var(--accent-primary)'}}>12.1 ms</span><br/>
          --- 3 packets transmitted, 3 received, <span style={{color:'#22c55e'}}>0% packet loss</span>
        </div>
      );

    case 'cat skills/stack.txt':
      return (
        <div>
          <span className="nf-key">Languages</span>  : Python · TypeScript · C++ · SQL · Solidity<br/>
          <span className="nf-key">AI/ML</span>      : YOLOv8 · Whisper · Groq · Scikit-learn<br/>
          <span className="nf-key">Frontend</span>   : React · Next.js · Three.js · Flutter<br/>
          <span className="nf-key">Backend</span>    : FastAPI · Node.js · PostgreSQL · Redis<br/>
          <span className="nf-key">DevOps</span>     : Docker · NixOS · Raspberry Pi · ESP8266<br/>
          <span className="nf-key">Blockchain</span> : Solidity · Polygon · IPFS
        </div>
      );

    case 'sudo rm -rf /':
      return <span style={{color:'#ef4444'}}>Permission denied. Nice try.</span>;

    case 'sudo':
    case 'sudo !!':
      return 'yuvaraj-r is not in the sudoers file. This incident will be reported.';

    case 'man yuvaraj':
      return (
        <div>
          <span className="nf-key">NAME</span><br/>
          {'       '}yuvaraj-r — ML Engineer, Systems Builder<br/><br/>
          <span className="nf-key">SYNOPSIS</span><br/>
          {'       '}yuvaraj [--build ai-system] [--deploy edge] [--hack]<br/><br/>
          <span className="nf-key">DESCRIPTION</span><br/>
          {'       '}CS student @ VIT Chennai. Builds end-to-end AI systems,<br/>
          {'       '}self-hosted infra on NixOS, and edge deployments on RPi.<br/><br/>
          <span className="nf-key">EXIT STATUS</span><br/>
          {'       '}Always 0. Ships working code.
        </div>
      );

    case 'uptime':
      return '19 years · always on · 0 downtime';

    case 'pwd':
      return '/home/yuvaraj/portfolio';

    case 'resume':
      return <AsciiResume />;

    case 'clear':
      return null;

    case 'help':
      return (
        <div>
          <span className="nf-key">Available commands:</span><br/>
          {'  '}whoami{'                 '}— who am I<br/>
          {'  '}uname -a{'              '}— system info<br/>
          {'  '}neofetch{'              '}— system stats<br/>
          {'  '}ls{'                    '}— list sections<br/>
          {'  '}ls projects/{'          '}— show all projects<br/>
          {'  '}cat contact.txt{'       '}— contact info<br/>
          {'  '}cat skills/stack.txt{'  '}— full tech stack<br/>
          {'  '}git log --oneline{'     '}— recent work<br/>
          {'  '}ping built-by-yuva...{'  '}— ping this site<br/>
          {'  '}man yuvaraj{'           '}— the manual<br/>
          {'  '}resume{'                 '}— 3D ASCII interactive resume<br/>
          {'  '}date{'                  '}— current time<br/>
          {'  '}clear{'                 '}— clear terminal
        </div>
      );

    default:
      return <span style={{color:'#ef4444'}}>bash: command not found: {cmd}{'  '}(try <span style={{color:'var(--accent-primary)'}}>help</span>)</span>;
  }
};

const initialHistory: TerminalHistoryItem[] = [
  { command: 'whoami', output: 'yuvaraj-r' },
  { command: 'uname -a', output: 'Linux nixos 6.6.32-zen1 #1-NixOS SMP x86_64 GNU/Linux' },
  { command: 'cat skills/stack.txt', output: getOutput('cat skills/stack.txt') },
];

const Hero: React.FC = () => {
  const [cursorBlink, setCursorBlink] = useState(true);
  const [history, setHistory] = useState<TerminalHistoryItem[]>(initialHistory);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => setCursorBlink((p) => !p), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCmdHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);

    if (trimmed === 'clear') {
      setHistory([]);
      return;
    }

    const output = getOutput(trimmed.toLowerCase());
    setHistory((prev) => [...prev, { command: trimmed, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(next);
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = historyIdx - 1;
      setHistoryIdx(next);
      setInput(next < 0 ? '' : cmdHistory[next] ?? '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const completions = ['help', 'whoami', 'neofetch', 'ls', 'ls projects/', 'cat contact.txt', 'cat skills/stack.txt', 'git log --oneline', 'ping built-by-yuva.vercel.app', 'man yuvaraj', 'resume', 'uname -a', 'date', 'uptime', 'pwd', 'clear'];
      const match = completions.find((c) => c.startsWith(input) && c !== input);
      if (match) setInput(match);
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="container grid-12 hero-grid">
        <div className="hero-content fade-in delay-1">
          <p className="hero-eyebrow mono"><span className="comment">$</span> yuvaraj-r --init</p>
          <h1 className="hero-title">Yuvaraj R</h1>
          <p className="hero-subtitle mono">
            ML Engineer · Systems Builder · Linux Native
          </p>
          <div className="hero-ctas">
            <a href="#projects" className="btn btn-primary">View Work</a>
            <a href="/resume.pdf" className="btn btn-ghost" target="_blank" rel="noopener noreferrer">Resume ↓</a>
          </div>
        </div>

        <div className="hero-terminal fade-in delay-2">
          <div className="terminal-window" onClick={() => inputRef.current?.focus()}>
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot dot-close"></span>
                <span className="dot dot-min"></span>
                <span className="dot dot-max"></span>
              </div>
              <span className="terminal-title mono">yuvaraj@nixos: ~/portfolio</span>
            </div>
            <div className="terminal-body mono" ref={terminalBodyRef}>
              {history.map((item, i) => (
                <div key={i} className="history-item">
                  <div className="terminal-line mt-2">
                    <span className="prompt">yuvaraj@nixos</span>
                    <span className="prompt-sep">:</span>
                    <span className="prompt-path">~/portfolio</span>
                    <span className="prompt-dollar"> $ </span>
                    <span className="cmd">{item.command}</span>
                  </div>
                  {item.output && (
                    <div className="terminal-output" style={{ whiteSpace: 'pre-wrap' }}>{item.output}</div>
                  )}
                </div>
              ))}

              <div className="terminal-line mt-2 active-line">
                <span className="prompt">yuvaraj@nixos</span>
                <span className="prompt-sep">:</span>
                <span className="prompt-path">~/portfolio</span>
                <span className="prompt-dollar"> $ </span>
                <span className="active-cmd">
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
                  spellCheck={false}
                  autoFocus
                />
              </div>
            </div>
          </div>
          <p className="terminal-hint mono">type <span className="hint-cmd">help</span> · tab to autocomplete · ↑↓ history</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
