
import { authSchemas, questionSchemas, storySchemas } from '@/lib/security';

describe('Validation Schemas', () => {
  describe('Auth Schemas', () => {
    describe('Login Schema', () => {
      it('should accept valid login data', () => {
        const validData = {
          username: 'testuser',
          password: 'password123',
        };

        const result = authSchemas.login.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject empty username', () => {
        const invalidData = {
          username: '',
          password: 'password123',
        };

        const result = authSchemas.login.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Username is required');
      });

      it('should reject empty password', () => {
        const invalidData = {
          username: 'testuser',
          password: '',
        };

        const result = authSchemas.login.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Password is required');
      });

      it('should reject username longer than 50 characters', () => {
        const invalidData = {
          username: 'a'.repeat(51),
          password: 'password123',
        };

        const result = authSchemas.login.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('Register Schema', () => {
      it('should accept valid registration data', () => {
        const validData = {
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
        };

        const result = authSchemas.register.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should accept registration without email', () => {
        const validData = {
          username: 'testuser',
          password: 'password123',
        };

        const result = authSchemas.register.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject short username', () => {
        const invalidData = {
          username: 'ab',
          password: 'password123',
        };

        const result = authSchemas.register.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Username must be at least 3 characters');
      });

      it('should reject short password', () => {
        const invalidData = {
          username: 'testuser',
          password: '12345',
        };

        const result = authSchemas.register.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Password must be at least 6 characters');
      });

      it('should reject invalid email format', () => {
        const invalidData = {
          username: 'testuser',
          email: 'invalid-email',
          password: 'password123',
        };

        const result = authSchemas.register.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Invalid email format');
      });
    });
  });

  describe('Question Schemas', () => {
    describe('Create Question Schema', () => {
      it('should accept valid question data', () => {
        const validData = {
          question_text: 'Tell me about a time when you had to overcome a challenge.',
          category: 'Problem Solving',
          difficulty: 'Medium',
          company_id: '123e4567-e89b-12d3-a456-426614174000',
          tags: ['problem-solving', 'challenges'],
          is_critical: true,
        };

        const result = questionSchemas.create.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject short question text', () => {
        const invalidData = {
          question_text: 'Short',
          category: 'Problem Solving',
          difficulty: 'Medium',
        };

        const result = questionSchemas.create.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Question must be at least 10 characters');
      });

      it('should reject invalid difficulty', () => {
        const invalidData = {
          question_text: 'Tell me about a time when you had to overcome a challenge.',
          category: 'Problem Solving',
          difficulty: 'Invalid',
        };

        const result = questionSchemas.create.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should accept valid difficulty values', () => {
        const difficulties = ['Easy', 'Medium', 'Hard'];
        
        difficulties.forEach(difficulty => {
          const validData = {
            question_text: 'Tell me about a time when you had to overcome a challenge.',
            category: 'Problem Solving',
            difficulty,
          };

          const result = questionSchemas.create.safeParse(validData);
          expect(result.success).toBe(true);
        });
      });
    });
  });

  describe('Story Schemas', () => {
    describe('Create Story Schema', () => {
      it('should accept valid story data', () => {
        const validData = {
          title: 'Project Leadership Challenge',
          situation: 'I was leading a cross-functional team on a critical project with tight deadlines.',
          task: 'I needed to coordinate between different departments and ensure timely delivery.',
          action: 'I implemented daily standups and created a shared tracking system.',
          result: 'We delivered the project on time and improved team communication.',
          reflection: 'I learned the importance of clear communication in leadership.',
          tags: ['leadership', 'project-management'],
          categories: ['Leadership', 'Project Management'],
        };

        const result = storySchemas.create.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject empty title', () => {
        const invalidData = {
          title: '',
          situation: 'I was leading a cross-functional team on a critical project with tight deadlines.',
          task: 'I needed to coordinate between different departments and ensure timely delivery.',
          action: 'I implemented daily standups and created a shared tracking system.',
          result: 'We delivered the project on time and improved team communication.',
        };

        const result = storySchemas.create.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error?.errors[0].message).toBe('Title is required');
      });

      it('should reject short STAR components', () => {
        const shortComponents = ['situation', 'task', 'action', 'result'];
        
        shortComponents.forEach(component => {
          const invalidData = {
            title: 'Test Story',
            situation: component === 'situation' ? 'Short' : 'Valid situation description that is long enough.',
            task: component === 'task' ? 'Short' : 'Valid task description that is long enough.',
            action: component === 'action' ? 'Short' : 'Valid action description that is long enough.',
            result: component === 'result' ? 'Short' : 'Valid result description that is long enough.',
          };

          const result = storySchemas.create.safeParse(invalidData);
          expect(result.success).toBe(false);
          expect(result.error?.errors[0].message).toContain('must be at least 10 characters');
        });
      });

      it('should accept story without optional fields', () => {
        const validData = {
          title: 'Project Leadership Challenge',
          situation: 'I was leading a cross-functional team on a critical project with tight deadlines.',
          task: 'I needed to coordinate between different departments and ensure timely delivery.',
          action: 'I implemented daily standups and created a shared tracking system.',
          result: 'We delivered the project on time and improved team communication.',
        };

        const result = storySchemas.create.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });
});
