import React, { useState, useRef, useEffect } from 'react';
import { ActionButtons } from './ActionButtons';
import { 
  validatePromptForAction, 
  sanitizePrompt, 
  estimatePromptComplexity,
  type PromptValidationResult 
} from '@/utils/prompt-validation';
import type { Task } from '@/types/task';
import { ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface PromptBarProps {
  task: Task;
  onSendMessage: (prompt: string) => void;
  onContinue: (prompt: string) => void;
  onInterrupt: (prompt: string) => void;
  onAbort: (reason?: string) => void;
  onRetry: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  task,
  onSendMessage,
  onContinue,
  onInterrupt,
  onAbort,
  onRetry,
  isLoading = false,
  placeholder,
  className = '',
}) => {
  const [prompt, setPrompt] = useState('');
  const [showValidation, setShowValidation] = useState(false);
  const [validation, setValidation] = useState<PromptValidationResult | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [prompt]);

  // Validate prompt on change
  useEffect(() => {
    if (prompt.trim()) {
      const primaryAction = getPrimaryActionType(task.status);
      const result = validatePromptForAction(prompt, primaryAction);
      setValidation(result);
    } else {
      setValidation(null);
    }
  }, [prompt, task.status]);

  const getPrimaryActionType = (status: Task['status']): 'send' | 'continue' | 'interrupt' => {
    switch (status) {
      case 'running':
        return 'interrupt';
      case 'paused':
      case 'waiting_for_input':
        return 'continue';
      default:
        return 'send';
    }
  };

  const handleInputChange = (value: string) => {
    const sanitized = sanitizePrompt(value);
    setPrompt(sanitized);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl/Cmd + Enter for sending
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      const primaryAction = getPrimaryActionType(task.status);
      
      switch (primaryAction) {
        case 'send':
          if (validation?.isValid && prompt.trim()) {
            onSendMessage(prompt.trim());
            setPrompt('');
          }
          break;
        case 'continue':
          onContinue(prompt.trim());
          setPrompt('');
          break;
        case 'interrupt':
          onInterrupt(prompt.trim());
          setPrompt('');
          break;
      }
    }

    // Handle Escape for interrupt
    if (e.key === 'Escape' && task.status === 'running') {
      onInterrupt(prompt.trim());
      setPrompt('');
    }

    // Handle Shift + Enter for new line (default behavior)
    if (e.shiftKey && e.key === 'Enter') {
      // Allow default behavior
    }
  };

  const getPlaceholderText = (): string => {
    if (placeholder) return placeholder;
    
    switch (task.status) {
      case 'running':
        return 'Type a message to interrupt the task...';
      case 'paused':
      case 'waiting_for_input':
        return 'Continue the task with additional instructions...';
      case 'error':
        return 'Describe what you want to try differently...';
      default:
        return 'Describe what you want Amp to do...';
    }
  };

  const complexity = prompt.trim() ? estimatePromptComplexity(prompt) : null;

  return (
    <div className={`sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Validation Messages */}
      {showValidation && validation && (validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          {validation.errors.map((error, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400 mb-1">
              <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
          {validation.warnings.map((warning, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400 mb-1">
              <InformationCircleIcon className="h-4 w-4 flex-shrink-0" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Input Area */}
      <div className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Task Status Indicator */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600 dark:text-gray-400">Task Status:</span>
              <span className={`font-medium ${
                task.status === 'running' ? 'text-blue-600 dark:text-blue-400' :
                task.status === 'error' ? 'text-red-600 dark:text-red-400' :
                task.status === 'success' ? 'text-green-600 dark:text-green-400' :
                'text-yellow-600 dark:text-yellow-400'
              }`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
              </span>
            </div>
            
            {complexity && (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>Complexity:</span>
                <span className={`font-medium ${
                  complexity === 'simple' ? 'text-green-600' :
                  complexity === 'moderate' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {complexity}
                </span>
              </div>
            )}
          </div>

          {/* Input and Actions Container */}
          <div className="flex space-x-3">
            {/* Textarea Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowValidation(true)}
                onBlur={() => setShowValidation(false)}
                placeholder={getPlaceholderText()}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${
                  validation?.errors.length ? 
                    'border-red-300 focus:ring-red-500 focus:border-red-500' :
                  validation?.warnings.length ?
                    'border-yellow-300 focus:ring-yellow-500 focus:border-yellow-500' :
                    'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                } dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
                rows={1}
                style={{ 
                  minHeight: '44px',
                  maxHeight: '200px'
                }}
              />
              
              {/* Character Count */}
              {prompt.length > 100 && (
                <div className="absolute bottom-1 right-2 text-xs text-gray-400">
                  {prompt.length}/5000
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <ActionButtons
              task={task}
              promptValue={prompt}
              isPromptValid={validation?.isValid ?? true}
              onSendMessage={(msg) => {
                onSendMessage(msg);
                setPrompt('');
              }}
              onContinue={(msg) => {
                onContinue(msg);
                setPrompt('');
              }}
              onInterrupt={(msg) => {
                onInterrupt(msg);
                setPrompt('');
              }}
              onAbort={onAbort}
              onRetry={onRetry}
              isLoading={isLoading}
              className="flex-shrink-0"
            />
          </div>

          {/* Suggestions */}
          {validation?.suggestions && validation.suggestions.length > 0 && showValidation && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div className="font-medium mb-1">Suggestions:</div>
              <ul className="list-disc list-inside space-y-1">
                {validation.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
