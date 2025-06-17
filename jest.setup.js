
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

// Mock Web APIs for Next.js server components
global.Request = class Request {
  constructor(input, init) {
    this.url = input;
    this.method = init?.method || 'GET';
    this.headers = new Map(Object.entries(init?.headers || {}));
  }
};

global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.status = init?.status || 200;
    this.headers = new Map(Object.entries(init?.headers || {}));
  }
};

global.Headers = class Headers extends Map {
  constructor(init) {
    super();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.set(key, value);
      });
    }
  }
  
  get(name) {
    return super.get(name.toLowerCase());
  }
  
  set(name, value) {
    return super.set(name.toLowerCase(), value);
  }
};

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
  Users: () => 'Users',
  BookOpen: () => 'BookOpen',
  Building: () => 'Building',
  MessageSquare: () => 'MessageSquare',
  Shield: () => 'Shield',
  LogIn: () => 'LogIn',
  UserPlus: () => 'UserPlus',
  Mail: () => 'Mail',
  User: () => 'User',
  Lock: () => 'Lock',
  Search: () => 'Search',
  UserCheck: () => 'UserCheck',
  UserX: () => 'UserX',
  Activity: () => 'Activity',
  TrendingUp: () => 'TrendingUp',
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
