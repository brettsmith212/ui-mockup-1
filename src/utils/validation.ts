export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export const validateRepoUrl = (url: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!url.trim()) {
    errors.push('Repository URL is required');
    return { isValid: false, errors };
  }

  // GitHub URL patterns
  const githubHttpsPattern = /^https:\/\/github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\.git)?$/;
  const githubSshPattern = /^git@github\.com:[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\.git)?$/;
  
  // GitLab URL patterns
  const gitlabHttpsPattern = /^https:\/\/gitlab\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\.git)?$/;
  const gitlabSshPattern = /^git@gitlab\.com:[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\.git)?$/;
  
  // Bitbucket URL patterns
  const bitbucketHttpsPattern = /^https:\/\/bitbucket\.org\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\.git)?$/;
  const bitbucketSshPattern = /^git@bitbucket\.org:[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\.git)?$/;

  const isValidUrl = 
    githubHttpsPattern.test(url) ||
    githubSshPattern.test(url) ||
    gitlabHttpsPattern.test(url) ||
    gitlabSshPattern.test(url) ||
    bitbucketHttpsPattern.test(url) ||
    bitbucketSshPattern.test(url);

  if (!isValidUrl) {
    errors.push('Invalid repository URL. Supported formats: GitHub, GitLab, Bitbucket (HTTPS or SSH)');
  }

  return { isValid: errors.length === 0, errors };
};

export const validatePrompt = (prompt: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!prompt.trim()) {
    errors.push('Prompt is required');
    return { isValid: false, errors };
  }

  if (prompt.trim().length < 10) {
    errors.push('Prompt must be at least 10 characters long');
  }

  if (prompt.length > 2000) {
    errors.push('Prompt must be less than 2000 characters');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateTaskForm = (data: {
  repoUrl: string;
  prompt: string;
}): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  
  const repoValidation = validateRepoUrl(data.repoUrl);
  if (!repoValidation.isValid) {
    errors.repoUrl = repoValidation.errors[0];
  }

  const promptValidation = validatePrompt(data.prompt);
  if (!promptValidation.isValid) {
    errors.prompt = promptValidation.errors[0];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

export const extractRepoInfo = (url: string) => {
  const patterns = [
    /https:\/\/github\.com\/([^\/]+)\/([^\/\.]+)/,
    /git@github\.com:([^\/]+)\/([^\/\.]+)/,
    /https:\/\/gitlab\.com\/([^\/]+)\/([^\/\.]+)/,
    /git@gitlab\.com:([^\/]+)\/([^\/\.]+)/,
    /https:\/\/bitbucket\.org\/([^\/]+)\/([^\/\.]+)/,
    /git@bitbucket\.org:([^\/]+)\/([^\/\.]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        name: match[2],
        fullName: `${match[1]}/${match[2]}`
      };
    }
  }

  return null;
};
