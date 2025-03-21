import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

// Add color constants at the top
const COLORS = {
  GREEN: '#00ff00',
  RED: '#ff5f56',
  WHITE: '#ffffff',
  BACKGROUND: '#1e1e1e',
  TERMINAL_BG: '#2d2d2d',
  HEADER_BG: '#3d3d3d',
  BUTTON_RED: '#ff5f56',
  BUTTON_YELLOW: '#ffbd2e',
  BUTTON_GREEN: '#27c93f'
};

const TerminalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${COLORS.BACKGROUND};
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  margin: 0;
`;

const TerminalWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${COLORS.TERMINAL_BG};
  display: flex;
  flex-direction: column;
`;

const TerminalHeader = styled.div`
  background-color: ${COLORS.HEADER_BG};
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TerminalButton = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const TerminalContent = styled.div`
  padding: 16px;
  height: calc(100% - 40px);
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  color: ${COLORS.WHITE};
  font-size: 16px;
  line-height: 1.6;
  text-align: left;
`;

const TerminalLine = styled.div`
  margin-bottom: 8px;
  white-space: pre-wrap;
  text-align: left;

  a {
    color: ${COLORS.GREEN};
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const TerminalInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
`;

const Prompt = styled.span`
  color: ${COLORS.GREEN};
  font-weight: bold;
`;

const Input = styled.input`
  background: none;
  border: none;
  color: ${COLORS.GREEN};
  font-family: 'Courier New', monospace;
  font-size: 16px;
  flex: 1;
  outline: none;
  text-align: left;
`;

const INITIAL_LINES = [
  'Welcome to Justin\'s Portfolio Website!',
  'Type "help" to see available commands.',
  '',
];

const AVAILABLE_COMMANDS = [
  'about',
  'clear',
  'contact',
  'help',
  'projects',
  'resume'
];

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<string[]>(INITIAL_LINES);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines]);

  const handleCommand = (command: string) => {
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    }

    const newLines: string[] = [];
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'clear') {
      setLines(INITIAL_LINES);
      setInput('');
      return;
    }

    switch (cmd) {
      case 'help':
        newLines.push(
          'Available commands:',
          '  help     - Show this help message',
          '  about    - Learn more about me',
          '  projects - View my projects',
          '  contact  - Get my contact information',
          '  resume   - View my resume',
          '  clear    - Clear the terminal',
          '',
          'Keyboard shortcuts:',
          '  Enter    - Execute command',
          '  Escape   - Clear current input',
          '  ↑        - Previous command',
          '  ↓        - Next command',
          '  Tab      - Auto-complete command'
        );
        break;
      case 'about':
        newLines.push(
          'Hi, I\'m Justin!',
          'I\'m a student at Georgia Institute of Technology and an incoming Software Engineer Intern at Amazon.'
        );
        break;
      case 'projects':
        newLines.push(
          'My Projects:',
          '🚧 Work in Progress 🚧',
          'I only create the best, so my projects are still in development.',
          'Check back soon for some amazing work!'
        );
        break;
      case 'contact':
        newLines.push(
          'Contact Information:',
          'Email: jzheng394@gatech.edu',
          'GitHub: <a href="https://github.com/justin5764" target="_blank" rel="noopener noreferrer">github.com/justin5764</a>',
          'LinkedIn: <a href="https://linkedin.com/in/justinzheng9398" target="_blank" rel="noopener noreferrer">linkedin.com/in/justinzheng9398</a>'
        );
        break;
      case 'resume':
        const currentDomain = window.location.hostname;
        const protocol = window.location.protocol;
        const port = window.location.port;
        const resumePath = `${protocol}//${currentDomain}${port ? ':' + port : ''}/resume/Justin_Zheng_Resume.pdf`;
        newLines.push('Downloading resume...');
        setLines(prev => [...prev, `$ ${command}`, ...newLines]);
        const newWindow = window.open(resumePath, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          setLines(prev => [...prev, '<span style="color: #ff5f56">Error: Could not open resume in a new tab. Please check your popup blocker.</span>']);
        }
        setInput('');
        return;
      default:
        newLines.push(`Command not found: ${cmd}. Type "help" for available commands.`);
    }

    setLines(prev => [...prev, ...newLines.map(line => {
      if (line.startsWith('Available commands:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
      if (line.startsWith('Contact Information:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
      if (line.startsWith('My Projects:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
      if (line.startsWith('Keyboard shortcuts:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
      if (line.startsWith('Error:')) return `<span style="color: ${COLORS.RED}">${line}</span>`;
      if (line.startsWith('Command not found:')) return `<span style="color: ${COLORS.RED}">${line}</span>`;
      return line;
    })]);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Enter':
        handleCommand(input);
        break;
      case 'Escape':
        setInput('');
        break;
      case 'Tab':
        e.preventDefault();
        const currentInput = input.toLowerCase().trim();
        const matchingCommands = AVAILABLE_COMMANDS.filter(cmd => 
          cmd.startsWith(currentInput)
        );
        
        if (matchingCommands.length === 1) {
          setInput(matchingCommands[0]);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        } else {
          setHistoryIndex(-1);
          setInput('');
        }
        break;
    }
  };

  return (
    <TerminalContainer>
      <TerminalWrapper>
        <TerminalHeader>
          <TerminalButton color={COLORS.BUTTON_RED} />
          <TerminalButton color={COLORS.BUTTON_YELLOW} />
          <TerminalButton color={COLORS.BUTTON_GREEN} />
        </TerminalHeader>
        <TerminalContent ref={contentRef}>
          {lines.map((line, index) => (
            <TerminalLine 
              key={index} 
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
          <TerminalInput>
            <Prompt>$</Prompt>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
            />
          </TerminalInput>
        </TerminalContent>
      </TerminalWrapper>
    </TerminalContainer>
  );
};

export default Terminal; 