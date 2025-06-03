import React from 'react';
import Button from '@/components/ui/Button';
import { 
  PlayIcon, 
  StopIcon, 
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import type { Task } from '@/types/task';

interface ActionButtonsProps {
  task: Task;
  promptValue: string;
  isPromptValid: boolean;
  onSendMessage: (prompt: string) => void;
  onContinue: (prompt: string) => void;
  onInterrupt: (prompt: string) => void;
  onAbort: (reason?: string) => void;
  onRetry: () => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Determines the primary action based on task status
 */
const getPrimaryAction = (status: Task['status']): 'send' | 'continue' | 'interrupt' | 'retry' => {
  switch (status) {
    case 'running':
      return 'interrupt';
    case 'paused':
    case 'waiting_for_input':
      return 'continue';
    case 'error':
      return 'retry';
    default:
      return 'send';
  }
};

/**
 * Gets the appropriate button text based on task status and prompt content
 */
const getButtonText = (
  action: 'send' | 'continue' | 'interrupt' | 'retry',
  hasPrompt: boolean
): string => {
  switch (action) {
    case 'send':
      return 'Send';
    case 'continue':
      return hasPrompt ? 'Continue with Input' : 'Continue';
    case 'interrupt':
      return hasPrompt ? 'Interrupt with Input' : 'Interrupt';
    case 'retry':
      return 'Retry Task';
    default:
      return 'Send';
  }
};

/**
 * Gets the appropriate icon for the action
 */
const getActionIcon = (action: 'send' | 'continue' | 'interrupt' | 'retry') => {
  switch (action) {
    case 'send':
      return PaperAirplaneIcon;
    case 'continue':
      return PlayIcon;
    case 'interrupt':
      return StopIcon;
    case 'retry':
      return ArrowPathIcon;
    default:
      return PaperAirplaneIcon;
  }
};

/**
 * Gets the appropriate button variant for the action
 */
const getButtonVariant = (action: 'send' | 'continue' | 'interrupt' | 'retry'): 'primary' | 'danger' | 'outline' => {
  switch (action) {
    case 'send':
    case 'continue':
      return 'primary';
    case 'interrupt':
      return 'danger';
    case 'retry':
      return 'outline';
    default:
      return 'primary';
  }
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  task,
  promptValue,
  isPromptValid,
  onSendMessage,
  onContinue,
  onInterrupt,
  onAbort,
  onRetry,
  isLoading = false,
  className = '',
}) => {
  const primaryAction = getPrimaryAction(task.status);
  const hasPrompt = promptValue.trim().length > 0;
  const buttonText = getButtonText(primaryAction, hasPrompt);
  const ButtonIcon = getActionIcon(primaryAction);
  const buttonVariant = getButtonVariant(primaryAction);

  const handlePrimaryAction = () => {
    const prompt = promptValue.trim();
    
    switch (primaryAction) {
      case 'send':
        if (isPromptValid && prompt) {
          onSendMessage(prompt);
        }
        break;
      case 'continue':
        onContinue(prompt);
        break;
      case 'interrupt':
        onInterrupt(prompt);
        break;
      case 'retry':
        onRetry();
        break;
    }
  };

  const canExecutePrimary = () => {
    switch (primaryAction) {
      case 'send':
        return isPromptValid && hasPrompt;
      case 'continue':
      case 'interrupt':
        return true; // These can work with or without prompts
      case 'retry':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Primary Action Button */}
      <Button
        variant={buttonVariant}
        size="md"
        onClick={handlePrimaryAction}
        disabled={!canExecutePrimary() || isLoading}
        loading={isLoading}
        icon={<ButtonIcon className="h-4 w-4" />}
        iconPosition="left"
        className="flex-shrink-0"
      >
        {buttonText}
      </Button>

      {/* Secondary Actions based on task status */}
      {task.status === 'running' && (
        <>
          {/* Allow continuing with input even while running */}
          {hasPrompt && (
            <Button
              variant="outline"
              size="md"
              onClick={() => onContinue(promptValue.trim())}
              disabled={isLoading}
              icon={<PlayIcon className="h-4 w-4" />}
              className="flex-shrink-0"
            >
              Continue
            </Button>
          )}
          
          {/* Abort button for running tasks */}
          <Button
            variant="ghost"
            size="md"
            onClick={() => onAbort('User requested abort')}
            disabled={isLoading}
            icon={<ExclamationTriangleIcon className="h-4 w-4" />}
            className="flex-shrink-0 text-red-600 hover:text-red-700"
          >
            Abort
          </Button>
        </>
      )}

      {/* For paused/waiting tasks, show interrupt option */}
      {(task.status === 'paused' || task.status === 'waiting_for_input') && (
        <Button
          variant="outline"
          size="md"
          onClick={() => onInterrupt(promptValue.trim())}
          disabled={isLoading}
          icon={<StopIcon className="h-4 w-4" />}
          className="flex-shrink-0"
        >
          Interrupt
        </Button>
      )}

      {/* For error tasks, show send option if user has new input */}
      {task.status === 'error' && hasPrompt && isPromptValid && (
        <Button
          variant="outline"
          size="md"
          onClick={() => onSendMessage(promptValue.trim())}
          disabled={isLoading}
          icon={<PaperAirplaneIcon className="h-4 w-4" />}
          className="flex-shrink-0"
        >
          Send New
        </Button>
      )}

      {/* Keyboard shortcut indicator */}
      <div className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
        {primaryAction === 'send' && '⌘+Enter'}
        {primaryAction === 'continue' && '⌘+Enter'}
        {primaryAction === 'interrupt' && 'Esc'}
      </div>
    </div>
  );
};
