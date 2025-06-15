# Deployment Guide

## Overview

This guide covers various deployment options for the EM Interview Prep application.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Environment variables configured

## Vercel Deployment (Recommended)

### 1. Prepare Repository
Ensure your repository is pushed to GitHub and configure environment variables in Vercel dashboard.

### 2. Environment Variables
Add these in Vercel dashboard:
- DATABASE_URL
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- GOOGLE_CLIENT_ID (optional)
- GOOGLE_CLIENT_SECRET (optional)

### 3. Deploy
Vercel will automatically deploy on every push to main branch.

## Docker Deployment

Use the included docker-compose.yml:

```bash
docker-compose up -d
docker-compose exec app ./scripts/setup.sh
docker-compose exec app ./scripts/seed.sh
```

## Manual Server Deployment

1. Install Node.js 18+, PostgreSQL, and PM2
2. Clone repository and install dependencies
3. Configure environment variables
4. Build and start with PM2
5. Configure reverse proxy (Nginx recommended)

For detailed instructions, see the full deployment documentation.
