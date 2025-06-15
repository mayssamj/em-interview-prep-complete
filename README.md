# EM Interview Prep - Complete Setup

A comprehensive interview preparation platform for Engineering Managers, featuring behavioral questions, system design scenarios, and STAR method story tracking.

## 🚀 Quick Start

### Option 1: Complete Automated Setup (Ubuntu/Debian)
```bash
git clone https://github.com/mayssamj/em-interview-prep-complete.git
cd em-interview-prep-complete
chmod +x scripts/complete_setup.sh
./scripts/complete_setup.sh
```

### Option 2: Manual Setup

#### Prerequisites
- Ubuntu 20.04+ or Debian 10+
- sudo access
- Internet connection

#### Step 1: Install PostgreSQL
```bash
chmod +x scripts/install_postgresql.sh
./scripts/install_postgresql.sh
```

#### Step 2: Install Node.js
```bash
chmod +x scripts/install_nodejs.sh
./scripts/install_nodejs.sh
```

#### Step 3: Setup Environment
```bash
cp .env.example .env
# Edit .env with your database credentials
nano .env
```

#### Step 4: Setup Database
```bash
chmod +x scripts/setup_database.sh
./scripts/setup_database.sh
```

#### Step 5: Start Application
```bash
chmod +x scripts/start_app.sh
./scripts/start_app.sh
```

## 📊 Database Content

The application comes pre-loaded with:
- **15 Companies**: Meta, Google, Amazon, Microsoft, Apple, Netflix, Uber, Airbnb, Stripe, Spotify, LinkedIn, Twitter, Dropbox, Slack, Zoom
- **334+ Questions**: Comprehensive behavioral and system design questions
- **Sample Stories**: 21 pre-written STAR method examples
- **User Accounts**: Demo accounts for testing

## 🛠 Manual Database Setup

If you prefer to set up the database manually:

### PostgreSQL Setup
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE USER em_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE em_interview_prep OWNER em_user;
GRANT ALL PRIVILEGES ON DATABASE em_interview_prep TO em_user;
\q
```

### Environment Configuration
Create `.env` file:
```env
DATABASE_URL="postgresql://em_user:your_secure_password@localhost:5432/em_interview_prep"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Application Setup
```bash
# Install dependencies
yarn install

# Generate Prisma client
npx prisma generate

# Setup database schema
npx prisma db push

# Seed with data
node seed-simple.js

# Build and start
yarn build
yarn start
```

## 🔧 Development

### Running in Development Mode
```bash
yarn dev
```

### Database Management
```bash
# View database
npx prisma studio

# Reset database
npx prisma db push --force-reset
node seed-simple.js
```

### Building for Production
```bash
yarn build
yarn start
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                   # Utility libraries
├── prisma/                # Database schema
├── scripts/               # Setup scripts
├── dump/                  # Database exports
├── docs/                  # Documentation
├── seed-simple.js         # Database seeding
└── package.json           # Dependencies
```

## 🐳 Docker Setup

### Using Docker Compose
```bash
docker-compose up -d
```

### Manual Docker Build
```bash
docker build -t em-interview-prep .
docker run -p 3000:3000 em-interview-prep
```

## 🔍 API Documentation

### Authentication Endpoints
- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `GET /api/auth/session` - Get current session

### Questions API
- `GET /api/questions` - Get all questions
- `GET /api/questions/[id]` - Get specific question
- `POST /api/questions` - Create new question
- `PUT /api/questions/[id]` - Update question
- `DELETE /api/questions/[id]` - Delete question

### Stories API
- `GET /api/stories` - Get user stories
- `POST /api/stories` - Create new story
- `PUT /api/stories/[id]` - Update story
- `DELETE /api/stories/[id]` - Delete story

### Companies API
- `GET /api/companies` - Get all companies
- `POST /api/companies` - Create new company

## 🚨 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check database exists
sudo -u postgres psql -l
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Permission Errors
```bash
# Fix file permissions
chmod +x scripts/*.sh

# Fix ownership
sudo chown -R $USER:$USER .
```

#### Node.js Version Issues
```bash
# Install specific Node.js version
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Database Issues

#### Reset Database
```bash
npx prisma db push --force-reset
node seed-simple.js
```

#### Import Data Manually
```bash
chmod +x scripts/import_data.sh
./scripts/import_data.sh
```

#### Check Database Content
```bash
npx prisma studio
# Opens web interface at http://localhost:5555
```

## 🔐 Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Enable SSL for database connections in production
- Regularly update dependencies

## 📝 Environment Variables

Required environment variables:
```env
DATABASE_URL=postgresql://username:password@host:port/database
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review the logs: `tail -f .logs/app.log`
3. Open an issue on GitHub
4. Contact support

## 🎯 Features

- **Behavioral Questions**: 200+ curated behavioral interview questions
- **System Design**: 134+ system design scenarios and frameworks
- **STAR Method**: Built-in story tracking using Situation, Task, Action, Result
- **Company Profiles**: Detailed information for top tech companies
- **Progress Tracking**: Monitor your preparation progress
- **Notes System**: Take and organize interview notes
- **Responsive Design**: Works on desktop and mobile devices

## 🔄 Updates

To update the application:
```bash
git pull origin main
yarn install
npx prisma generate
npx prisma db push
yarn build
```

---

**Happy Interview Prep! 🚀**
