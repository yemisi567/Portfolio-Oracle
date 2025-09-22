/* eslint-disable @typescript-eslint/no-explicit-any */
// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryStack: 'frontend-development' | 'backend-development' | 'full-stack-development' | 'mobile-development' | 'devops-cloud' | 'data-science-ai' | 'ui-ux-design' | 'product-management' | 'project-management' | 'digital-marketing' | 'cybersecurity' | 'game-development' | 'blockchain-development' | 'quality-assurance' | 'technical-writing' | 'sales-engineering' | 'customer-success' | 'business-analytics';
  goals: string[];
  interests: string[];
  additionalSkills: string;
  targetIndustry: string;
  createdAt: Date;
  updatedAt: Date;
}

// Project types
export interface Project {
  id: string;
  userId: string;
  title: string;
  summary: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  techStack: string[];
  requirements: string[];
  milestones: Milestone[];
  status: 'planned' | 'in-progress' | 'completed';
  repositoryName?: string;
  notes?: string[];
  createdAt: Date;
  updatedAt: Date;
  // Additional properties for the UI
  liveUrl?: string;
  progress?: number;
  lastUpdated?: string;
  estimatedCompletion?: string;
  challenges?: string[];
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  detectionHint: string;
  completed: boolean;
  completedAt?: Date;
  // Additional property for the UI
  status?: 'completed' | 'in-progress' | 'planned';
}

export interface GeneratedProject {
  title: string;
  summary: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  techStack: string[];
  requirements: string[];
  milestones: Milestone[];
  challenges: string[];
  resources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  notes: string[];
}

// Market insights types
export interface MarketInsight {
  id: string;
  skill: string;
  popularityScore: number;
  growthRate: number;
  averageSalary: number;
  country: string;
  category: string;
  timestamp: Date;
}

export interface JobTrend {
  id: string;
  role: string;
  demand: 'high' | 'medium' | 'low';
  growthRate: number;
  averageSalary: number;
  requiredSkills: string[];
  country: string;
  timestamp: Date;
}

// Form types
export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface UserPreferences {
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  primaryStack: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'devops' | 'data';
  goals: string[];
  interests: string[];
  additionalSkills: string;
  targetIndustry: string;
  projectContext?: string;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  session: any;
}

export interface EmailResponse {
  id: string;
  from: string;
  to: string;
  subject: string;
  status: 'sent' | 'delivered' | 'failed';
}

// UI component types
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Notification types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Theme types
export interface Theme {
  name: 'light' | 'dark' | 'system';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
    border: {
      light: string;
      medium: string;
      dark: string;
    };
  };
}


// Analytics types
export interface ProjectAnalytics {
  projectId: string;
  views: number;
  likes: number;
  shares: number;
  completionRate: number;
  timeSpent: number;
  lastActivity: Date;
}

export interface UserAnalytics {
  userId: string;
  totalProjects: number;
  completedProjects: number;
  averageCompletionTime: number;
  mostUsedTech: string[];
  skillGrowth: {
    skill: string;
    improvement: number;
  }[];
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  difficulty?: string;
  techStack?: string[];
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
  label: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationParams;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Event types
export interface AppEvent {
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
}

// Configuration types
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    [key: string]: boolean;
  };
  limits: {
    maxProjects: number;
    maxFileSize: number;
    maxApiCalls: number;
  };
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type ValueOf<T> = T[keyof T];

export type AsyncReturnType<T extends (...args: any) => Promise<any>> = Awaited<ReturnType<T>>; 