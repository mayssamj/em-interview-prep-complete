// Database types and interfaces

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

export interface Question {
  id: string;
  company_id?: string;
  category: string;
  question_text: string;
  difficulty: string;
  tags: string[];
  is_critical: boolean;
  usage_count: number;
  question_type: string;
  categories: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Company {
  id: string;
  name: string;
  values: string[];
  evaluation_criteria: string[];
  interview_format: string;
  success_tips: string[];
  red_flags: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Story {
  id: string;
  user_id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  reflection?: string;
  tags: string[];
  categories: string[];
  created_at: Date;
  updated_at: Date;
}

export interface Answer {
  id: string;
  user_id: string;
  question_id: string;
  answer_text: string;
  story_references: string[];
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Progress {
  id: string;
  user_id: string;
  question_id: string;
  status: string;
  last_reviewed?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SystemDesignQuestion {
  id: string;
  question_id: string;
  architecture_focus: string[];
  complexity_level: string;
  leadership_aspects: string[];
  frameworks: string[];
  evaluation_criteria: string[];
  resources: string[];
  estimated_time_minutes?: number;
  follow_up_questions: string[];
  common_mistakes: string[];
  key_tradeoffs: string[];
  created_at: Date;
  updated_at: Date;
}

export interface SystemDesignAnswer {
  id: string;
  user_id: string;
  question_id: string;
  high_level_design: string;
  detailed_components?: DetailedComponents;
  scalability_approach?: string;
  data_storage_strategy?: string;
  tradeoffs_discussed: string[];
  frameworks_used: string[];
  estimated_scale?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// JSON field type definitions
export interface DetailedComponents {
  frontend?: {
    technologies: string[];
    architecture: string;
    considerations: string[];
  };
  backend?: {
    services: string[];
    apis: string[];
    architecture_pattern: string;
  };
  database?: {
    type: string;
    schema_design: string[];
    indexing_strategy: string[];
  };
  infrastructure?: {
    deployment: string;
    monitoring: string[];
    scaling_strategy: string[];
  };
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  study_goals?: {
    daily_questions: number;
    target_companies: string[];
    focus_areas: string[];
  };
}

export interface BackOfEnvelopeCalculations {
  assumptions: {
    [key: string]: string | number;
  };
  calculations: {
    step: string;
    formula: string;
    result: string | number;
  }[];
  final_estimates: {
    [metric: string]: string | number;
  };
}

export interface CoreSolution {
  high_level_architecture: {
    components: string[];
    data_flow: string[];
    key_services: string[];
  };
  detailed_design: {
    [component: string]: {
      purpose: string;
      technologies: string[];
      interfaces: string[];
    };
  };
  data_model: {
    entities: string[];
    relationships: string[];
    storage_considerations: string[];
  };
}

export interface TechnologyStack {
  frontend: {
    frameworks: string[];
    libraries: string[];
    tools: string[];
  };
  backend: {
    languages: string[];
    frameworks: string[];
    databases: string[];
    caching: string[];
    message_queues: string[];
  };
  infrastructure: {
    cloud_provider: string;
    deployment: string[];
    monitoring: string[];
    security: string[];
  };
}

export interface Tradeoffs {
  [decision: string]: {
    options: {
      name: string;
      pros: string[];
      cons: string[];
      use_cases: string[];
    }[];
    recommendation: string;
    reasoning: string;
  };
}