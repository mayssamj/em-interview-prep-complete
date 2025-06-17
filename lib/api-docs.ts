
// API Documentation Generator
export interface APIEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  requestBody?: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
      required?: boolean;
    }>;
  };
  responses: {
    status: number;
    description: string;
    example?: any;
  }[];
  authentication?: boolean;
  adminOnly?: boolean;
}

export const apiEndpoints: APIEndpoint[] = [
  // Authentication Endpoints
  {
    method: 'POST',
    path: '/api/auth/login',
    description: 'Authenticate user and create session',
    requestBody: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'User username', required: true },
        password: { type: 'string', description: 'User password', required: true },
      },
    },
    responses: [
      {
        status: 200,
        description: 'Login successful',
        example: {
          message: 'Login successful',
          user: { id: 'user-123', username: 'demo', isAdmin: false },
        },
      },
      {
        status: 401,
        description: 'Invalid credentials',
        example: { error: 'Invalid credentials' },
      },
      {
        status: 429,
        description: 'Too many requests',
        example: { error: 'Too Many Requests' },
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    description: 'Register new user account',
    requestBody: {
      type: 'object',
      properties: {
        username: { type: 'string', description: 'Desired username (3-50 chars)', required: true },
        email: { type: 'string', description: 'Email address (optional)' },
        password: { type: 'string', description: 'Password (min 6 chars)', required: true },
      },
    },
    responses: [
      {
        status: 200,
        description: 'Registration successful',
        example: {
          message: 'Registration successful',
          user: { id: 'user-456', username: 'newuser', isAdmin: false },
        },
      },
      {
        status: 400,
        description: 'Invalid input',
        example: { error: 'Invalid input', details: ['Username must be at least 3 characters'] },
      },
      {
        status: 409,
        description: 'Username already exists',
        example: { error: 'Username already exists' },
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    description: 'Logout user and clear session',
    authentication: true,
    responses: [
      {
        status: 200,
        description: 'Logout successful',
        example: { message: 'Logout successful' },
      },
    ],
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    description: 'Get current user information',
    authentication: true,
    responses: [
      {
        status: 200,
        description: 'User information',
        example: {
          user: { id: 'user-123', username: 'demo', isAdmin: false, email: 'demo@example.com' },
        },
      },
      {
        status: 401,
        description: 'Not authenticated',
        example: { error: 'Authentication required' },
      },
    ],
  },

  // Question Endpoints
  {
    method: 'GET',
    path: '/api/questions',
    description: 'Get behavioral interview questions',
    parameters: [
      { name: 'company', type: 'string', required: false, description: 'Filter by company ID' },
      { name: 'category', type: 'string', required: false, description: 'Filter by category' },
      { name: 'difficulty', type: 'string', required: false, description: 'Filter by difficulty (Easy, Medium, Hard)' },
      { name: 'limit', type: 'number', required: false, description: 'Number of questions to return' },
    ],
    responses: [
      {
        status: 200,
        description: 'List of questions',
        example: {
          questions: [
            {
              id: 'q-123',
              question_text: 'Tell me about a time when you had to overcome a challenge.',
              category: 'Problem Solving',
              difficulty: 'Medium',
              tags: ['problem-solving', 'challenges'],
              is_critical: true,
            },
          ],
        },
      },
    ],
  },

  // Company Endpoints
  {
    method: 'GET',
    path: '/api/companies',
    description: 'Get list of companies',
    responses: [
      {
        status: 200,
        description: 'List of companies',
        example: {
          companies: [
            {
              id: 'comp-123',
              name: 'Google',
              values: ['Innovation', 'Collaboration', 'Excellence'],
              evaluation_criteria: ['Technical Skills', 'Cultural Fit', 'Leadership'],
            },
          ],
        },
      },
    ],
  },

  // Story Endpoints
  {
    method: 'GET',
    path: '/api/stories',
    description: 'Get user STAR stories',
    authentication: true,
    responses: [
      {
        status: 200,
        description: 'List of user stories',
        example: {
          stories: [
            {
              id: 'story-123',
              title: 'Project Leadership Challenge',
              situation: 'Leading a cross-functional team...',
              task: 'Coordinate between departments...',
              action: 'Implemented daily standups...',
              result: 'Delivered on time...',
              tags: ['leadership', 'project-management'],
            },
          ],
        },
      },
    ],
  },
  {
    method: 'POST',
    path: '/api/stories',
    description: 'Create new STAR story',
    authentication: true,
    requestBody: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Story title', required: true },
        situation: { type: 'string', description: 'Situation description (min 10 chars)', required: true },
        task: { type: 'string', description: 'Task description (min 10 chars)', required: true },
        action: { type: 'string', description: 'Action taken (min 10 chars)', required: true },
        result: { type: 'string', description: 'Result achieved (min 10 chars)', required: true },
        reflection: { type: 'string', description: 'Reflection on experience' },
        tags: { type: 'array', description: 'Story tags' },
        categories: { type: 'array', description: 'Story categories' },
      },
    },
    responses: [
      {
        status: 201,
        description: 'Story created successfully',
        example: {
          message: 'Story created successfully',
          story: { id: 'story-456', title: 'New Story', /* ... */ },
        },
      },
      {
        status: 400,
        description: 'Invalid input',
        example: { error: 'Invalid input', details: ['Title is required'] },
      },
    ],
  },

  // System Design Endpoints
  {
    method: 'GET',
    path: '/api/system-design-questions',
    description: 'Get system design questions',
    parameters: [
      { name: 'complexity', type: 'string', required: false, description: 'Filter by complexity level' },
      { name: 'category', type: 'string', required: false, description: 'Filter by category' },
    ],
    responses: [
      {
        status: 200,
        description: 'List of system design questions',
        example: {
          questions: [
            {
              id: 'sd-123',
              question_text: 'Design a URL shortening service like bit.ly',
              complexity_level: 'Medium',
              architecture_focus: ['Scalability', 'Database Design'],
              frameworks: ['Microservices', 'Load Balancing'],
            },
          ],
        },
      },
    ],
  },

  // Admin Endpoints
  {
    method: 'GET',
    path: '/api/admin/users',
    description: 'Get all users (admin only)',
    authentication: true,
    adminOnly: true,
    parameters: [
      { name: 'page', type: 'number', required: false, description: 'Page number' },
      { name: 'limit', type: 'number', required: false, description: 'Users per page' },
    ],
    responses: [
      {
        status: 200,
        description: 'List of users',
        example: {
          users: [
            {
              id: 'user-123',
              username: 'demo',
              isAdmin: false,
              email: 'demo@example.com',
              createdAt: '2025-06-17T00:00:00Z',
            },
          ],
          pagination: { page: 1, limit: 10, total: 25, totalPages: 3 },
        },
      },
      {
        status: 403,
        description: 'Admin access required',
        example: { error: 'Admin access required' },
      },
    ],
  },
  {
    method: 'GET',
    path: '/api/admin/stats',
    description: 'Get system statistics (admin only)',
    authentication: true,
    adminOnly: true,
    responses: [
      {
        status: 200,
        description: 'System statistics',
        example: {
          stats: {
            totalUsers: 150,
            totalQuestions: 500,
            totalStories: 300,
            totalCompanies: 25,
            activeUsers: 45,
          },
        },
      },
    ],
  },
];

export function generateOpenAPISpec() {
  return {
    openapi: '3.0.0',
    info: {
      title: 'EM Interview Prep API',
      version: '1.0.0',
      description: 'API for the Engineering Manager Interview Preparation application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
        },
      },
    },
    paths: apiEndpoints.reduce((paths, endpoint) => {
      const pathKey = endpoint.path;
      const methodKey = endpoint.method.toLowerCase();
      
      if (!paths[pathKey]) {
        paths[pathKey] = {};
      }
      
      paths[pathKey][methodKey] = {
        summary: endpoint.description,
        parameters: endpoint.parameters?.map(param => ({
          name: param.name,
          in: 'query',
          required: param.required,
          schema: { type: param.type },
          description: param.description,
        })),
        requestBody: endpoint.requestBody ? {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: endpoint.requestBody.type,
                properties: endpoint.requestBody.properties,
                required: Object.entries(endpoint.requestBody.properties)
                  .filter(([_, prop]) => prop.required)
                  .map(([name]) => name),
              },
            },
          },
        } : undefined,
        responses: endpoint.responses.reduce((responses, response) => {
          responses[response.status] = {
            description: response.description,
            content: response.example ? {
              'application/json': {
                example: response.example,
              },
            } : undefined,
          };
          return responses;
        }, {}),
        security: endpoint.authentication ? [{ cookieAuth: [] }] : undefined,
        tags: endpoint.adminOnly ? ['Admin'] : ['Public'],
      };
      
      return paths;
    }, {}),
  };
}
