/**
 * Prompt input validation utilities
 * Validates user input for task prompts and provides helpful feedback
 */

export interface PromptValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export interface PromptValidationOptions {
  minLength?: number;
  maxLength?: number;
  requiresContext?: boolean;
  allowEmptyForContinue?: boolean;
}

const DEFAULT_OPTIONS: Required<PromptValidationOptions> = {
  minLength: 3,
  maxLength: 5000,
  requiresContext: false,
  allowEmptyForContinue: true,
};

/**
 * Validates a prompt input string
 */
export const validatePrompt = (
  prompt: string,
  options: PromptValidationOptions = {}
): PromptValidationResult => {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const trimmedPrompt = prompt.trim();
  
  const result: PromptValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    suggestions: [],
  };

  // Check minimum length
  if (trimmedPrompt.length < opts.minLength) {
    result.isValid = false;
    result.errors.push(`Prompt must be at least ${opts.minLength} characters long`);
  }

  // Check maximum length
  if (trimmedPrompt.length > opts.maxLength) {
    result.isValid = false;
    result.errors.push(`Prompt must be less than ${opts.maxLength} characters`);
  }

  // Check for empty input (allowed for continue actions)
  if (trimmedPrompt.length === 0) {
    if (opts.allowEmptyForContinue) {
      result.warnings.push('Empty prompt will continue with previous context');
    } else {
      result.isValid = false;
      result.errors.push('Prompt cannot be empty');
    }
  }

  // Check for context requirements
  if (opts.requiresContext && !hasContextualInformation(trimmedPrompt)) {
    result.warnings.push('Consider adding more context about what you want to achieve');
  }

  // Add suggestions based on content analysis
  const suggestions = generateSuggestions(trimmedPrompt);
  result.suggestions.push(...suggestions);

  return result;
};

/**
 * Checks if prompt contains contextual information
 */
const hasContextualInformation = (prompt: string): boolean => {
  const contextKeywords = [
    'fix', 'add', 'update', 'remove', 'refactor', 'implement', 'create',
    'bug', 'error', 'issue', 'feature', 'test', 'documentation',
    'performance', 'security', 'ui', 'api', 'database'
  ];
  
  const lowerPrompt = prompt.toLowerCase();
  return contextKeywords.some(keyword => lowerPrompt.includes(keyword));
};

/**
 * Generates helpful suggestions for improving the prompt
 */
const generateSuggestions = (prompt: string): string[] => {
  const suggestions: string[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Suggest being more specific
  if (prompt.length < 20) {
    suggestions.push('Consider providing more specific details about what you want to achieve');
  }

  // Suggest adding file context
  if (!lowerPrompt.includes('file') && !lowerPrompt.includes('.') && prompt.length > 50) {
    suggestions.push('Consider mentioning specific files or directories if relevant');
  }

  // Suggest breaking down complex requests
  if (prompt.length > 500) {
    suggestions.push('Consider breaking this into smaller, more focused tasks');
  }

  // Suggest adding acceptance criteria
  if (lowerPrompt.includes('implement') || lowerPrompt.includes('add') || lowerPrompt.includes('create')) {
    if (!lowerPrompt.includes('should') && !lowerPrompt.includes('test')) {
      suggestions.push('Consider adding acceptance criteria or testing requirements');
    }
  }

  return suggestions;
};

/**
 * Validates prompt for specific action types
 */
export const validatePromptForAction = (
  prompt: string,
  actionType: 'send' | 'continue' | 'interrupt'
): PromptValidationResult => {
  switch (actionType) {
    case 'send':
      return validatePrompt(prompt, {
        minLength: 3,
        requiresContext: true,
        allowEmptyForContinue: false,
      });
    
    case 'continue':
      return validatePrompt(prompt, {
        minLength: 0,
        requiresContext: false,
        allowEmptyForContinue: true,
      });
    
    case 'interrupt':
      return validatePrompt(prompt, {
        minLength: 0,
        requiresContext: false,
        allowEmptyForContinue: true,
      });
    
    default:
      return validatePrompt(prompt);
  }
};

/**
 * Sanitizes prompt input to prevent XSS and clean up formatting
 */
export const sanitizePrompt = (prompt: string): string => {
  return prompt
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 5000); // Enforce max length
};

/**
 * Checks if a prompt appears to be asking for help or guidance
 */
export const isHelpRequest = (prompt: string): boolean => {
  const helpKeywords = ['help', 'how to', 'what is', 'explain', 'guide', 'tutorial', '?'];
  const lowerPrompt = prompt.toLowerCase();
  return helpKeywords.some(keyword => lowerPrompt.includes(keyword));
};

/**
 * Estimates the complexity of a prompt based on content analysis
 */
export const estimatePromptComplexity = (prompt: string): 'simple' | 'moderate' | 'complex' => {
  const words = prompt.trim().split(/\s+/).length;
  const hasMultipleTasks = prompt.includes(' and ') || prompt.includes(' also ') || prompt.includes(' then ');
  const hasFileReferences = /\.(js|ts|tsx|jsx|py|java|cpp|html|css)/.test(prompt);
  const hasCodeBlocks = prompt.includes('```') || prompt.includes('`');

  if (words < 10 && !hasMultipleTasks) {
    return 'simple';
  }
  
  if (words > 50 || hasMultipleTasks || (hasFileReferences && hasCodeBlocks)) {
    return 'complex';
  }
  
  return 'moderate';
};
