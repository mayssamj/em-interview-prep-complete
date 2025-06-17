// Database types and interfaces

// Utility functions for type casting
export function castToStringArray(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  return [];
}

export function castToUserPreferences(value: any): UserPreferences | undefined {
  if (typeof value === 'object' && value !== null) return value as UserPreferences;
  return undefined;
}

export function castToCompanyValues(value: any): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'object' && value?.core_values) return value.core_values;
  return [];
}

// Database conversion helpers
export function convertRawCompany(raw: CompanyRaw): Company {
  return {
    id: raw.id,
    name: raw.name,
    values: castToStringArray(raw.values),
    evaluation_criteria: castToStringArray(raw.evaluation_criteria),
    interview_format: raw.interview_format,
    success_tips: castToStringArray(raw.success_tips),
    red_flags: castToStringArray(raw.red_flags),
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export function convertRawQuestion(raw: any): Question {
  return {
    id: raw.id,
    company_id: raw.company_id,
    category: raw.category,
    question_text: raw.question_text,
    difficulty: raw.difficulty,
    tags: castToStringArray(raw.tags),
    is_critical: raw.is_critical,
    usage_count: raw.usage_count,
    question_type: raw.question_type,
    categories: castToStringArray(raw.categories),
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

export function convertRawStory(raw: any): Story {
  return {
    id: raw.id,
    user_id: raw.user_id,
    title: raw.title,
    situation: raw.situation,
    task: raw.task,
    action: raw.action,
    result: raw.result,
    reflection: raw.reflection,
    tags: castToStringArray(raw.tags),
    categories: castToStringArray(raw.categories),
    created_at: raw.created_at,
    updated_at: raw.updated_at,
  };
}

// JSON field type definitions
export interface UserPreferences {
  email?: string;
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

export interface CompanyValues {
  core_values: string[];
  leadership_principles?: string[];
  cultural_attributes?: string[];
}

export interface EvaluationCriteria {
  technical_skills: string[];
  behavioral_competencies: string[];
  leadership_qualities?: string[];
  cultural_fit_indicators: string[];
}

export interface SuccessTips {
  preparation_strategies: string[];
  interview_day_tips: string[];
  follow_up_actions: string[];
}

export interface RedFlags {
  behavioral_warning_signs: string[];
  technical_concerns: string[];
  cultural_misalignment: string[];
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  preferences?: UserPreferences;
  created_at: Date;
  updated_at: Date;
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

// Raw database company interface
export interface CompanyRaw {
  id: string;
  name: string;
  values: any;
  evaluation_criteria: any;
  interview_format: string;
  success_tips: any;
  red_flags: any;
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