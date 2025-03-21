import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const TerminalContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #1e1e1e;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0;
  margin: 0;
`;

const TerminalWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #2d2d2d;
  display: flex;
  flex-direction: column;
`;

const TerminalHeader = styled.div`
  background-color: #3d3d3d;
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
  color: #ffffff;
  font-size: 16px;
  line-height: 1.6;
  text-align: left;
`;

const TerminalLine = styled.div`
  margin-bottom: 8px;
  white-space: pre-wrap;
  text-align: left;

  a {
    color: #00ff00;
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
  color: #00ff00;
  font-weight: bold;
`;

const Input = styled.input`
  background: none;
  border: none;
  color: #00ff00;
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
  'help',
  'about',
  'projects',
  'contact',
  'resume',
  'clear'
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
          '  clear    - Clear the terminal'
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
        const resumePath = process.env.PUBLIC_URL + '/resume/Justin_Zheng_Resume.pdf';
        const newWindow = window.open(resumePath, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          newLines.push('Error: Could not open resume. Please check if the file exists.');
          break;
        }
        return;
      default:
        newLines.push(`Command not found: ${cmd}. Type "help" for available commands.`);
    }

    setLines(prev => [...prev, `$ ${command}`, ...newLines.map(line => {
      if (line.startsWith('Available commands:')) return `<span style="color: #00ff00">${line}</span>`;
      if (line.startsWith('Contact Information:')) return `<span style="color: #00ff00">${line}</span>`;
      if (line.startsWith('My Projects:')) return `<span style="color: #00ff00">${line}</span>`;
      if (line.startsWith('Error:')) return `<span style="color: #ff5f56">${line}</span>`;
      if (line.startsWith('Command not found:')) return `<span style="color: #ff5f56">${line}</span>`;
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
        } else if (matchingCommands.length > 1) {
          setLines(prev => [...prev, 'Available completions:', ...matchingCommands]);
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
          <TerminalButton color="#ff5f56" />
          <TerminalButton color="#ffbd2e" />
          <TerminalButton color="#27c93f" />
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