
import { z } from 'zod';

// User validation schemas
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username too long'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  username: z.string().min(1, 'Username is required').max(50, 'Username too long'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password too long'),
});

// Story validation schemas
export const storySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  situation: z.string().min(1, 'Situation is required').max(2000, 'Situation too long'),
  task: z.string().min(1, 'Task is required').max(2000, 'Task too long'),
  action: z.string().min(1, 'Action is required').max(2000, 'Action too long'),
  result: z.string().min(1, 'Result is required').max(2000, 'Result too long'),
  tags: z.array(z.string()).optional(),
});

// Interview notes validation
export const interviewNotesSchema = z.object({
  company: z.string().min(1, 'Company is required').max(100, 'Company name too long'),
  position: z.string().min(1, 'Position is required').max(100, 'Position too long'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().min(1, 'Notes are required').max(5000, 'Notes too long'),
  outcome: z.enum(['pending', 'passed', 'failed', 'cancelled']).optional(),
});

// Admin validation schemas
export const adminUserUpdateSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  isAdmin: z.boolean(),
});

// API response schemas
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
  data: z.any().optional(),
});

// Environment validation
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  DATABASE_URL: z.string().url('Invalid database URL'),
});

// Validate environment variables
export function validateEnv() {
  try {
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV,
      JWT_SECRET: process.env.JWT_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
    });
  } catch (error) {
    console.error('Environment validation failed:', error);
    throw new Error('Invalid environment configuration');
  }
}

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type StoryInput = z.infer<typeof storySchema>;
export type InterviewNotesInput = z.infer<typeof interviewNotesSchema>;
export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
