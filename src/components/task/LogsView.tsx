import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { 
  createTerminal, 
  writeToTerminal, 
  clearTerminal, 
  resizeTerminal,
  formatLogMessage 
} from '@/utils/terminal';
import { useTaskLogs } from '@/hooks/useTaskLogs';
import Button from '@/components/ui/Button';
import { PlayIcon, PauseIcon, TrashIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import '@xterm/xterm/css/xterm.css';

interface LogsViewProps {
  taskId: string;
  className?: string;
}

export const LogsView: React.FC<LogsViewProps> = ({ taskId, className = '' }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminalInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const [isStreaming, setIsStreaming] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const prevLogsRef = useRef<string[]>([]);

  const { data: logs, isLoading, error } = useTaskLogs(taskId, isStreaming);

  // Initialize terminal
  useEffect(() => {
    if (!terminalRef.current) return;

    const { terminal, fitAddon: fit } = createTerminal();
    terminalInstance.current = terminal;
    fitAddon.current = fit;

    terminal.open(terminalRef.current);
    fit.fit();

    // Handle resize
    const handleResize = () => {
      if (terminalInstance.current && fitAddon.current) {
        resizeTerminal(terminalInstance.current, fitAddon.current);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      terminal.dispose();
    };
  }, []);

  // Update terminal with new logs
  useEffect(() => {
    if (!terminalInstance.current || !logs?.logs) return;

    const currentLogs = logs.logs.map((log: any) => 
      formatLogMessage(log.level, log.message, log.timestamp)
    );

    const newLogs = currentLogs.slice(prevLogsRef.current.length);
    
    if (newLogs.length > 0) {
      newLogs.forEach((logMessage: any) => {
        // Extract level from formatted message for color coding
        const level = logMessage.includes('ERROR') ? 'error' :
                     logMessage.includes('WARN') ? 'warn' :
                     logMessage.includes('DEBUG') ? 'debug' : 'info';
        
        writeToTerminal(terminalInstance.current!, logMessage, level);
      });

      if (autoScroll) {
        terminalInstance.current.scrollToBottom();
      }
    }

    prevLogsRef.current = currentLogs;
  }, [logs, autoScroll]);

  const handleClear = () => {
    if (terminalInstance.current) {
      clearTerminal(terminalInstance.current);
      prevLogsRef.current = [];
    }
  };

  const handleScrollToBottom = () => {
    if (terminalInstance.current) {
      terminalInstance.current.scrollToBottom();
      setAutoScroll(true);
    }
  };

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming);
  };

  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  if (isLoading && !logs) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="flex items-center space-x-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span>Loading logs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">Failed to load logs</div>
          <p className="text-gray-500 text-sm">
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Controls Bar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleStreaming}
            className="flex items-center space-x-1"
          >
            {isStreaming ? (
              <>
                <PauseIcon className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4" />
                <span>Resume</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="flex items-center space-x-1"
          >
            <TrashIcon className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={toggleAutoScroll}
              className="rounded"
            />
            <span>Auto-scroll</span>
          </label>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleScrollToBottom}
            className="flex items-center space-x-1"
          >
            <ArrowDownIcon className="h-4 w-4" />
            <span>Bottom</span>
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>Lines: {logs?.totalLines || 0}</span>
            <span className={`flex items-center space-x-1 ${isStreaming ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span>{isStreaming ? 'Streaming' : 'Paused'}</span>
            </span>
          </div>
          <div>
            Last updated: {logs?.logs?.[logs.logs.length - 1]?.timestamp 
              ? new Date(logs.logs[logs.logs.length - 1].timestamp).toLocaleTimeString()
              : 'Never'
            }
          </div>
        </div>
      </div>

      {/* Terminal Container */}
      <div className="flex-1 relative">
        <div 
          ref={terminalRef} 
          className="absolute inset-0"
          style={{ fontFamily: 'Monaco, "Cascadia Code", "SF Mono", Consolas, monospace' }}
        />
      </div>
    </div>
  );
};
