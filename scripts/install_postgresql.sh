#!/bin/bash
set -e

echo "Installing PostgreSQL..."

# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database user and database
sudo -u postgres psql << PSQL_EOF
CREATE USER em_user WITH PASSWORD 'em_password';
CREATE DATABASE em_interview_prep OWNER em_user;
GRANT ALL PRIVILEGES ON DATABASE em_interview_prep TO em_user;
\q
PSQL_EOF

echo "PostgreSQL installation completed!"
echo "Database: em_interview_prep"
echo "User: em_user"
echo "Password: em_password"
