
import { validatePasswordStrength, sanitizeInput } from '@/lib/security';

// Mock NextRequest for rate limiting tests
const createMockRequest = (ip: string = '127.0.0.1', pathname: string = '/api/auth/login') => {
  return {
    ip,
    headers: { get: (name: string) => name === 'x-forwarded-for' ? ip : null },
    nextUrl: { pathname },
  };
};

describe('Security Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Password Strength Validation', () => {
    it('should accept strong passwords', () => {
      const result = validatePasswordStrength('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = validatePasswordStrength('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should require minimum length', () => {
      const result = validatePasswordStrength('Sh0rt!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should require uppercase letter', () => {
      const result = validatePasswordStrength('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should require lowercase letter', () => {
      const result = validatePasswordStrength('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should require number', () => {
      const result = validatePasswordStrength('NoNumbers!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should require special character', () => {
      const result = validatePasswordStrength('NoSpecial123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });

  describe('Input Sanitization', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>username';
      const result = sanitizeInput(input);
      expect(result).toBe('alert("xss")username');
    });

    it('should remove javascript protocol', () => {
      const input = 'javascript:alert("xss")';
      const result = sanitizeInput(input);
      expect(result).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      const input = 'username onclick=alert("xss")';
      const result = sanitizeInput(input);
      expect(result).toBe('username');
    });

    it('should trim whitespace', () => {
      const input = '  username  ';
      const result = sanitizeInput(input);
      expect(result).toBe('username');
    });

    it('should handle normal input correctly', () => {
      const input = 'normal_username123';
      const result = sanitizeInput(input);
      expect(result).toBe('normal_username123');
    });
  });
});
