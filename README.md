
# EM Interview Prep - Engineering Manager Interview Preparation Platform

A comprehensive web application designed to help engineering managers prepare for technical and behavioral interviews.

## 🚀 Features

### 🔐 Authentication System
- User registration and login
- Admin dashboard with user management
- Role-based access control
- Secure JWT-based sessions

### 📚 Interview Content
- **200+ Behavioral Questions** organized by company and category
- **100+ System Design Questions** with detailed answers and solutions
- **Company-specific Interview Strategies** for top tech companies
- **STAR Story Templates** for behavioral interview preparation

### 👨‍💼 Admin Dashboard
- User management and role assignment
- System statistics and analytics
- Content management tools
- Activity monitoring

### 🎨 Modern UI/UX
- Responsive design for all devices
- Dark/light theme support
- Intuitive navigation
- Accessible components

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Zod schemas
- **Testing**: Jest, Playwright

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd em-interview-prep
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   DATABASE_URL="mysql://username:password@localhost:3306/em_interview_prep"
   JWT_SECRET="your-secure-32-character-secret-key"
   NODE_ENV="development"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed the database
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🔑 Default Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `adminadmin`

### Demo User Account
- **Username**: `demo`
- **Password**: `demodemo`

## 📖 Usage

### For Interview Candidates

1. **Register/Login** to access the platform
2. **Browse Question Banks** to practice behavioral and system design questions
3. **Create STAR Stories** using the story templates
4. **Track Progress** with the built-in progress tracker
5. **Study Company-specific** strategies and values

### For Administrators

1. **Login with admin credentials**
2. **Access Admin Dashboard** to manage users and content
3. **Monitor System Statistics** and user activity
4. **Manage User Roles** and permissions

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

### API Testing
```bash
./scripts/test-api-endpoints.sh
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=<production-database-url>
JWT_SECRET=<secure-production-secret>
```

### Docker Deployment (Optional)
```bash
docker build -t em-interview-prep .
docker run -p 3000:3000 em-interview-prep
```

## 📊 Database Schema

### Core Tables
- **users**: User accounts and authentication
- **companies**: Company profiles and information
- **questions**: Behavioral interview questions
- **system_design_questions**: Technical system design questions
- **stories**: User-created STAR stories
- **interview_notes**: Interview preparation notes

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Comprehensive Zod schema validation
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **XSS Protection**: React built-in protections
- **CSRF Protection**: HTTP-only cookies

## 📈 Performance

- **Page Load Time**: < 2 seconds
- **API Response Time**: < 500ms
- **Database Queries**: Optimized with indexing
- **Bundle Size**: Optimized with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Content Endpoints
- `GET /api/companies` - Get all companies
- `GET /api/questions` - Get behavioral questions
- `GET /api/system-design-questions` - Get system design questions
- `GET /api/stories` - Get user stories
- `POST /api/stories` - Create new story

### Admin Endpoints
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `PATCH /api/admin/users` - Update user roles

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check DATABASE_URL in .env.local
   - Ensure database exists

2. **Authentication Issues**
   - Clear browser cookies
   - Check JWT_SECRET configuration
   - Verify user exists in database

3. **Build Errors**
   - Clear .next directory
   - Reinstall node_modules
   - Check TypeScript errors

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- Tailwind CSS for utility-first styling
- Prisma for the excellent ORM

---

**Version**: 1.0.0  
**Last Updated**: June 17, 2025  
**Status**: Production Ready ✅
