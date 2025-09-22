// App configuration
export const APP_CONFIG = {
  name: 'Portfolio Oracle',
  description: 'AI-powered portfolio project ideas for developers',
  version: '1.0.0',
  author: 'Portfolio Oracle Team',
  website: 'https://portfolio-oracle.com',
  supportEmail: 'support@portfolio-oracle.com',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  auth: {
    signup: '/api/auth/signup',
    login: '/api/auth/login',
    verifyEmail: '/api/auth/verify-email',
    confirmEmail: '/api/auth/confirm-email',
  },
  email: {
    send: '/api/send-email',
  },
  projects: {
    generate: '/api/projects/generate',
    list: '/api/projects',
    create: '/api/projects',
    update: '/api/projects/:id',
    delete: '/api/projects/:id',
  },
  insights: {
    market: '/api/insights/market',
    trends: '/api/insights/trends',
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  userProjects: 'userProjects',
  githubConnected: 'githubConnected',
  userPreferences: 'userPreferences',
  authToken: 'authToken',
  theme: 'theme',
  language: 'language',
} as const;

// Validation rules
export const VALIDATION_RULES = {
  email: {
    minLength: 5,
    maxLength: 254,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  name: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
  },
  projectTitle: {
    minLength: 3,
    maxLength: 100,
  },
  projectDescription: {
    minLength: 10,
    maxLength: 1000,
  },
} as const;

// UI constants
export const UI_CONSTANTS = {
  // Animation durations
  animations: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 1000,
  },
  
  // Breakpoints (matching Tailwind)
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  
  // Z-index layers
  zIndex: {
    dropdown: 50,
    modal: 100,
    tooltip: 200,
    notification: 300,
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
} as const;

// Project categories
export const PROJECT_CATEGORIES = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'devops', label: 'DevOps' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'game-development', label: 'Game Development' },
  { value: 'ai', label: 'Artificial Intelligence' },
] as const;

// Skill levels
export const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', description: '0-1 years experience' },
  { value: 'intermediate', label: 'Intermediate', description: '1-3 years experience' },
  { value: 'advanced', label: 'Advanced', description: '3+ years experience' },
] as const;

// Tech stacks
export const TECH_STACKS = [
  { value: 'frontend', label: 'Frontend', description: 'React, Vue, Angular, etc.' },
  { value: 'backend', label: 'Backend', description: 'Node.js, Python, Java, etc.' },
  { value: 'fullstack', label: 'Full Stack', description: 'Both frontend and backend' },
  { value: 'mobile', label: 'Mobile', description: 'React Native, Flutter, etc.' },
  { value: 'devops', label: 'DevOps', description: 'Docker, Kubernetes, AWS, etc.' },
  { value: 'data', label: 'Data Science', description: 'Python, ML, Analytics, etc.' },
] as const;

// Project goals
export const PROJECT_GOALS = [
  { value: 'portfolio', label: 'Portfolio Project', description: 'Showcase my skills' },
  { value: 'learning', label: 'Learning New Tech', description: 'Explore new technologies' },
  { value: 'job-application', label: 'Job Application', description: 'Target specific roles' },
  { value: 'freelance', label: 'Freelance Work', description: 'Client projects' },
  { value: 'startup', label: 'Startup Idea', description: 'Build a business' },
] as const;

// Interest areas
export const INTEREST_AREAS = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'devops', label: 'DevOps' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'game-development', label: 'Game Development' },
  { value: 'ai', label: 'Artificial Intelligence' },
  { value: 'cybersecurity', label: 'Cybersecurity' },
  { value: 'cloud-computing', label: 'Cloud Computing' },
] as const;

// Industries
export const INDUSTRIES = [
  { value: 'general', label: 'General' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'social-media', label: 'Social Media' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'travel', label: 'Travel' },
  { value: 'real-estate', label: 'Real Estate' },
] as const;

// Error messages
export const ERROR_MESSAGES = {
  auth: {
    invalidCredentials: 'Invalid email or password',
    emailNotConfirmed: 'Please check your email and click the verification link',
    userNotFound: 'User not found',
    emailAlreadyExists: 'An account with this email already exists',
    weakPassword: 'Password is too weak',
    networkError: 'Network error. Please check your connection',
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    passwordTooShort: 'Password must be at least 8 characters',
    passwordTooWeak: 'Password must contain uppercase, lowercase, number, and special character',
    nameTooShort: 'Name must be at least 2 characters',
    nameTooLong: 'Name must be less than 50 characters',
    invalidName: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  },
  general: {
    somethingWentWrong: 'Something went wrong. Please try again.',
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    unauthorized: 'You are not authorized to perform this action.',
    forbidden: 'Access denied.',
    notFound: 'Resource not found.',
  },
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  auth: {
    signupSuccess: 'Account created successfully! Please check your email to verify your account.',
    loginSuccess: 'Login successful! Welcome back.',
    emailVerified: 'Email verified successfully! You can now sign in.',
    logoutSuccess: 'Logged out successfully.',
  },
  projects: {
    created: 'Project created successfully!',
    updated: 'Project updated successfully!',
    deleted: 'Project deleted successfully!',
    added: 'Project added to your dashboard!',
  },
  general: {
    saved: 'Changes saved successfully!',
    updated: 'Updated successfully!',
    deleted: 'Deleted successfully!',
  },
} as const; 