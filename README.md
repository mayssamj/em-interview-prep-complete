# EM Interview Prep - Complete Application

A comprehensive Engineering Manager interview preparation platform with behavioral questions, STAR method stories, and company-specific interview guides.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mayssamj/em-interview-prep-complete.git
   cd em-interview-prep-complete
   ```

2. **Run the setup script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and authentication details
   ```

4. **Seed the database**
   ```bash
   chmod +x scripts/seed.sh
   ./scripts/seed.sh
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or use the helper script
   ./scripts/dev.sh
   ```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## 📁 Project Structure

```
em-interview-prep-complete/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── companies/         # Company-specific pages
│   ├── questions/         # Question management
│   └── stories/           # STAR stories management
├── components/            # Reusable React components
│   ├── ui/               # UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility libraries
├── prisma/               # Database schema and migrations
├── public/               # Static assets
├── backup/               # Database exports and backups
├── scripts/              # Setup and utility scripts
├── docs/                 # Documentation
└── styles/               # Global styles
```

## 🗄️ Database

### Schema Overview

The application uses PostgreSQL with Prisma ORM. Key entities:

- **Companies**: Tech companies with interview information
- **Questions**: Behavioral and technical interview questions
- **Stories**: STAR method stories for behavioral questions
- **Users**: User accounts and profiles
- **Interviews**: Interview sessions and feedback
- **Notes**: Interview preparation notes

### Database Management

**Setup database:**
```bash
./scripts/setup.sh
```

**Seed with data:**
```bash
./scripts/seed.sh
```

**Reset database:**
```bash
./scripts/reset.sh
```

**Manual Prisma commands:**
```bash
npx prisma generate    # Generate Prisma client
npx prisma db push     # Push schema changes
npx prisma studio      # Open database browser
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/em_interview_prep"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Application
NODE_ENV="development"
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Start services:**
   ```bash
   docker-compose up -d
   ```

2. **Setup database:**
   ```bash
   docker-compose exec app ./scripts/setup.sh
   ```

3. **Seed database:**
   ```bash
   docker-compose exec app ./scripts/seed.sh
   ```

### Manual Docker Build

```bash
docker build -t em-interview-prep .
docker run -p 3000:3000 em-interview-prep
```

## 📚 Features

### Core Features

- **Company Profiles**: Detailed information about tech companies
- **Question Bank**: Curated behavioral and technical questions
- **STAR Stories**: Structured storytelling for behavioral interviews
- **Interview Tracking**: Track interview progress and feedback
- **Notes System**: Comprehensive note-taking capabilities

### User Management

- Authentication with NextAuth.js
- User profiles and preferences
- Progress tracking
- Personal story library

### Interview Preparation

- Company-specific question sets
- STAR method story builder
- Practice interview sessions
- Performance analytics

## 🔌 API Documentation

### Authentication Endpoints

- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signout` - User sign out
- `GET /api/auth/session` - Get current session

### Companies API

- `GET /api/companies` - List all companies
- `GET /api/companies/[id]` - Get company details
- `POST /api/companies` - Create new company
- `PUT /api/companies/[id]` - Update company
- `DELETE /api/companies/[id]` - Delete company

### Questions API

- `GET /api/questions` - List questions with filters
- `GET /api/questions/[id]` - Get question details
- `POST /api/questions` - Create new question
- `PUT /api/questions/[id]` - Update question
- `DELETE /api/questions/[id]` - Delete question

### Stories API

- `GET /api/stories` - List user stories
- `GET /api/stories/[id]` - Get story details
- `POST /api/stories` - Create new story
- `PUT /api/stories/[id]` - Update story
- `DELETE /api/stories/[id]` - Delete story

### Interviews API

- `GET /api/interviews` - List interviews
- `GET /api/interviews/[id]` - Get interview details
- `POST /api/interviews` - Create interview session
- `PUT /api/interviews/[id]` - Update interview
- `DELETE /api/interviews/[id]` - Delete interview

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure environment variables in Vercel dashboard**

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Railway Deployment

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy:**
   ```bash
   railway login
   railway init
   railway up
   ```

### Manual Server Deployment

1. **Build application:**
   ```bash
   npm run build
   ```

2. **Start production server:**
   ```bash
   npm start
   ```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Development Workflow

1. **Create feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test:**
   ```bash
   npm run dev
   ```

3. **Run tests and linting:**
   ```bash
   npm run lint
   npm run type-check
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Add your feature"
   git push origin feature/your-feature-name
   ```

## 🔍 Troubleshooting

### Common Issues

**Database Connection Issues:**
- Verify DATABASE_URL in .env file
- Ensure PostgreSQL is running
- Check database credentials and permissions

**Build Errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Next.js cache: `rm -rf .next`
- Regenerate Prisma client: `npx prisma generate`

**Authentication Issues:**
- Verify NEXTAUTH_SECRET is set
- Check OAuth provider configuration
- Ensure NEXTAUTH_URL matches your domain

**Port Already in Use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Issues

**Reset database completely:**
```bash
./scripts/reset.sh
```

**Manual database reset:**
```bash
npx prisma db push --force-reset --accept-data-loss
npx prisma db push
./scripts/seed.sh
```

### Performance Issues

**Optimize database queries:**
- Use Prisma query optimization
- Add database indexes
- Implement pagination

**Frontend optimization:**
- Use Next.js Image component
- Implement code splitting
- Add loading states

## 📊 Backup and Restore

### Creating Backups

The `backup/` directory contains:
- `database-export.json` - Complete database export
- `database-inserts.sql` - SQL insert statements

### Restoring from Backup

1. **Reset database:**
   ```bash
   ./scripts/reset.sh
   ```

2. **Restore from backup:**
   ```bash
   ./scripts/seed.sh
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

## 🔄 Version History

- **v1.0.0** - Initial complete backup release
- Includes full application code
- Database export and import scripts
- Comprehensive documentation
- Docker support
- Deployment guides

---

**Repository**: https://github.com/mayssamj/em-interview-prep-complete
**Author**: mayssamj
**Created**: $(date +%Y-%m-%d)
