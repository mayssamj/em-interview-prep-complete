
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
}));

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    users: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      upsert: jest.fn(),
    },
    companies: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    questions: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    stories: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    system_design_questions: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    system_design_frameworks: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
    $queryRaw: jest.fn(),
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

// Mock toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    h1: 'h1',
    h2: 'h2',
    p: 'p',
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Users: () => <div data-testid="users-icon" />,
  BookOpen: () => <div data-testid="bookopen-icon" />,
  Building: () => <div data-testid="building-icon" />,
  MessageSquare: () => <div data-testid="messagesquare-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  LogIn: () => <div data-testid="login-icon" />,
  UserPlus: () => <div data-testid="userplus-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  User: () => <div data-testid="user-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  Search: () => <div data-testid="search-icon" />,
  UserCheck: () => <div data-testid="usercheck-icon" />,
  UserX: () => <div data-testid="userx-icon" />,
  Activity: () => <div data-testid="activity-icon" />,
  TrendingUp: () => <div data-testid="trendingup-icon" />,
}));

// Suppress console errors during tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
