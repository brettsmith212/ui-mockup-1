import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

export interface TerminalConfig {
  fontSize?: number;
  fontFamily?: string;
  theme?: {
    background?: string;
    foreground?: string;
    cursor?: string;
    selection?: string;
  };
  scrollback?: number;
  allowTransparency?: boolean;
}

export const defaultTerminalConfig: TerminalConfig = {
  fontSize: 13,
  fontFamily: 'Monaco, "Cascadia Code", "SF Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace',
  theme: {
    background: '#1a1b23',
    foreground: '#d1d5db',
    cursor: '#10b981',
    selection: '#374151',
  },
  scrollback: 10000,
  allowTransparency: false,
};

export const createTerminal = (config: TerminalConfig = defaultTerminalConfig): { terminal: Terminal; fitAddon: FitAddon } => {
  const terminal = new Terminal({
    fontSize: config.fontSize,
    fontFamily: config.fontFamily,
    theme: config.theme,
    scrollback: config.scrollback,
    allowTransparency: config.allowTransparency,
    cursorBlink: true,
    cursorStyle: 'block',
    disableStdin: true, // Read-only terminal for logs
    convertEol: true,
  });

  const fitAddon = new FitAddon();
  terminal.loadAddon(fitAddon);

  return { terminal, fitAddon };
};

export const writeToTerminal = (terminal: Terminal, message: string, type: 'debug' | 'info' | 'warn' | 'error' = 'info') => {
  const colorCodes = {
    debug: '\x1b[90m',    // gray
    info: '\x1b[37m',     // white
    warn: '\x1b[33m',     // yellow
    error: '\x1b[31m',    // red
  };

  const resetCode = '\x1b[0m';
  const colorCode = colorCodes[type];
  
  const timestamp = new Date().toLocaleTimeString();
  const formattedMessage = `${colorCode}[${timestamp}] ${message}${resetCode}\r\n`;
  
  terminal.write(formattedMessage);
};

export const clearTerminal = (terminal: Terminal) => {
  terminal.clear();
};

export const scrollToBottom = (terminal: Terminal) => {
  terminal.scrollToBottom();
};

export const resizeTerminal = (_terminal: Terminal, fitAddon: FitAddon) => {
  fitAddon.fit();
};

export const formatLogMessage = (level: string, message: string, timestamp?: string) => {
  const time = timestamp || new Date().toISOString();
  return `[${time}] ${level.toUpperCase()}: ${message}`;
};
