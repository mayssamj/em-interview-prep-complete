
# EM Interview Prep - Engineering Manager Interview Preparation Platform

A comprehensive platform for Engineering Manager interview preparation featuring behavioral questions, system design challenges, company-specific insights, and progress tracking.

## 🚀 Features

### Core Functionality
- **Authentication System**: Secure login with JWT tokens
- **Behavioral Questions**: Curated questions with STAR method guidance
- **System Design Questions**: 22+ questions with detailed frameworks
- **Company Profiles**: Company-specific values, tips, and strategies
- **Progress Tracking**: Monitor your preparation across different areas
- **Story Templates**: STAR method story creation and management

### System Design Focus
- **6 Framework Categories**: Data Consistency, Architecture Patterns, Scalability, Performance, Security
- **Interactive Practice**: Detailed question breakdowns with leadership aspects
- **Real-world Examples**: Industry-standard patterns and tradeoffs
- **EM-Specific Guidance**: Leadership considerations for technical decisions

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: JWT with secure cookie storage
- **Testing**: Jest, React Testing Library

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd em-interview-prep
   npm install --legacy-peer-deps
   ```

2. **Database Setup**
   ```bash
   # Set up your PostgreSQL database
   # Update DATABASE_URL in .env file
   npx prisma generate
   npx prisma db push
   ```

3. **Seed Data**
   ```bash
   # Seed basic data
   curl -X POST http://localhost:3000/api/seed
   
   # Seed system design content
   curl -X POST http://localhost:3000/api/seed-system-design
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Access Application**
   - Open http://localhost:3000
   - Login with demo credentials:
     - Admin: `admin` / `adminadmin`
     - User: `mayasam` / `password123`

## 🧪 Testing

The application includes comprehensive testing:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Integration tests only
npm run test:integration
```

### Test Coverage
- ✅ Authentication functions and flows
- ✅ Component rendering and interactions  
- ✅ API endpoint functionality
- ✅ System design framework loading
- ✅ Navigation and responsive behavior

## 📱 Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Responsive Navigation**: Collapsible menu for smaller screens
- **Touch-Friendly**: Proper touch targets and interactions
- **Performance**: Optimized loading and rendering

## 🔐 Authentication

- **JWT Tokens**: Secure authentication with 24-hour expiry
- **Protected Routes**: Server-side authentication checks
- **Session Management**: Automatic token refresh and logout
- **Admin Features**: Role-based access control

## 📊 System Design Features

### Question Categories (Max 5)
1. **Data Consistency** - CAP Theorem, ACID, BASE
2. **Architecture Patterns** - Microservices, distributed systems  
3. **Scalability** - Load balancing, scaling strategies
4. **Performance** - Caching, optimization techniques
5. **Security** - Authentication, data protection

### Framework Examples
- CAP Theorem with real-world tradeoffs
- Microservices architecture patterns
- Load balancing strategies
- Caching techniques and invalidation
- ACID vs BASE principles

## 🏢 Company Profiles

Pre-configured profiles for major tech companies:
- Meta (Facebook)
- Amazon  
- Google
- Microsoft
- Netflix
- Uber
- Airbnb

Each profile includes:
- Company values and culture
- Interview format and process
- Success tips and strategies
- Common red flags to avoid

## 📈 Progress Tracking

- **Question Completion**: Track answered questions by category
- **Company Focus**: Monitor preparation for specific companies
- **Story Bank**: Manage your STAR method stories
- **Activity Timeline**: View recent preparation activity

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (pages)/           # Application pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── __tests__/            # Test files
```

### Key Components
- `Header`: Responsive navigation with authentication
- `SystemDesignStrategyClient`: Framework exploration
- `SystemDesignQuestionBankClient`: Question practice
- `ProgressTracker`: Preparation monitoring

## 🚀 Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Environment Variables**
   ```bash
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   NEXTAUTH_SECRET=your-nextauth-secret
   ```

3. **Database Migration**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the FIXES_SUMMARY.md for recent changes
2. Run the test suite to verify functionality
3. Check server logs for detailed error information

## 🔄 Recent Updates

- ✅ Fixed authentication issues on all protected routes
- ✅ Resolved system design framework loading errors
- ✅ Improved responsive navigation design
- ✅ Added comprehensive testing framework
- ✅ Standardized database field naming (snake_case)
- ✅ Enhanced mobile user experience

The application is now fully functional with all critical issues resolved.
