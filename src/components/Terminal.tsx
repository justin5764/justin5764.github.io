import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import '@fontsource/jetbrains-mono';
import 'hack-font/build/web/hack.css';

const COLORS = {
  GREEN: '#98c379',
  RED: '#ff5f56',
  WHITE: '#ffffff',
  BACKGROUND: '#1e1e1e',
  TERMINAL_BG: '#2d2d2d',
  HEADER_BG: '#3d3d3d',
  BUTTON_RED: '#ff5f56',
  BUTTON_YELLOW: '#ffbd2e',
  BUTTON_GREEN: '#27c93f',
  LINK: '#00bfff',
  COMMAND_NAME: '#d4c5a1',
  KEY: '#b4befe'
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
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  color: ${COLORS.WHITE};
  font-size: 16px;
  line-height: 1.6;
  text-align: left;
`;

const TerminalLine = styled.div<{ isCommand?: boolean }>`
  margin-bottom: ${props => props.isCommand ? '12px' : '2px'};
  white-space: pre-wrap;
  text-align: left;
  opacity: 0;
  animation: fadeIn 0.3s ease-in forwards;

  &:last-child {
    margin-bottom: 12px;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  a {
    color: ${COLORS.LINK};
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
  margin-top: 12px;
`;

const Prompt = styled.span`
  color: ${COLORS.GREEN};
  font-weight: bold;
`;

const PromptText = styled.span`
  color: ${COLORS.GREEN};
  font-weight: normal;
`;

const DollarSign = styled.span`
  margin: 0 4px;
`;

const Input = styled.input`
  background: none;
  border: none;
  color: ${COLORS.WHITE};
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 16px;
  flex: 1;
  outline: none;
  text-align: left;
`;

const INITIAL_LINES = [
  'Welcome to justinzheng.me v1.0.0',
  `Type <span style="color: ${COLORS.COMMAND_NAME}">"help"</span> to see available commands.`,
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
  const [isProcessing, setIsProcessing] = useState(false);
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

  const addLinesSequentially = async (newLines: string[]) => {
    setIsProcessing(true);
    for (const line of newLines) {
      setLines(prev => [...prev, line]);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    setIsProcessing(false);
  };

  const handleCommand = async (command: string) => {
    setInput('');
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
    }

    const newLines: string[] = [];
    const cmd = command.toLowerCase().trim();
    
    if (cmd === 'clear') {
      setLines(INITIAL_LINES);
      return;
    }

    newLines.push(`<div style="margin-top: 12px"><span style="color: ${COLORS.GREEN}">visitor@justinzheng.me:~$</span> ${command}</div>`);

    switch (cmd) {
      case 'help':
        newLines.push(
          'Available commands:',
          `  <span style="color: ${COLORS.COMMAND_NAME}">help</span>     - Show this help message`,
          `  <span style="color: ${COLORS.COMMAND_NAME}">about</span>    - Learn more about me`,
          `  <span style="color: ${COLORS.COMMAND_NAME}">projects</span> - View my projects`,
          `  <span style="color: ${COLORS.COMMAND_NAME}">contact</span>  - Get my contact information`,
          `  <span style="color: ${COLORS.COMMAND_NAME}">resume</span>   - View my resume`,
          `  <span style="color: ${COLORS.COMMAND_NAME}">clear</span>    - Clear the terminal`,
          '',
          `Use <span style="color: ${COLORS.KEY}">[Tab]</span> to auto-complete commands`,
          `Use <span style="color: ${COLORS.KEY}">[Esc]</span> to clear input`,
          `Use <span style="color: ${COLORS.KEY}">[↑]</span><span style="color: ${COLORS.KEY}">[↓]</span> to navigate command history`
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
          `Email: <a href="mailto:jzheng394@gatech.edu" target="_blank" rel="noopener noreferrer">jzheng394@gatech.edu</a>`,
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
        setLines(prev => [...prev, ...newLines.map(line => {
          if (line.startsWith('Available commands:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
          if (line.startsWith('Contact Information:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
          if (line.startsWith('My Projects:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
          if (line.startsWith('Error:')) return `<span style="color: ${COLORS.RED}">${line}</span>`;
          if (line.startsWith('Command not found:')) return `<span style="color: ${COLORS.RED}">${line}</span>`;
          return line;
        })]);
        const newWindow = window.open(resumePath, '_blank', 'noopener,noreferrer');
        if (!newWindow) {
          setLines(prev => [...prev, '<span style="color: #ff5f56">Error: Could not open resume in a new tab. Please check your popup blocker.</span>']);
        }
        return;
      default:
        newLines.push(`Command not found: ${cmd}. Type "help" for available commands.`);
    }

    const processedLines = newLines.map(line => {
      if (line.startsWith('Available commands:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
      if (line.startsWith('Contact Information:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
      if (line.startsWith('My Projects:')) return `<span style="color: ${COLORS.GREEN}">${line}</span>`;
      if (line.startsWith('Error:')) return `<span style="color: ${COLORS.RED}">${line}</span>`;
      if (line.startsWith('Command not found:')) return `<span style="color: ${COLORS.RED}">${line}</span>`;
      return line;
    });

    await addLinesSequentially(processedLines);
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
              isCommand={line.includes('visitor@justinzheng.me:~$')}
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ))}
          <TerminalInput>
            <Prompt>
              <PromptText>visitor@justinzheng.me</PromptText>:~<DollarSign>$</DollarSign>
            </Prompt>
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