# FastFlyerExp Repository Setup Guide

This guide will help you add the logistics backend to your existing FastFlyerExp repository.

## 🎯 Adding Backend to FastFlyerExp Repository

### Option 1: Quick Setup (Recommended)

Run the automated setup script:

```bash
./setup-fastflyer.sh
```

Then follow the prompts to update the remote URL with your actual GitHub username.

### Option 2: Manual Setup

#### Step 1: Initialize Git and Commit

```bash
# Initialize git repository
git init

# Add all backend files
git add .

# Create initial commit
git commit -m "Add complete logistics backend API

- PostgreSQL database schema with all required tables
- JWT authentication and role-based access control  
- Complete CRUD APIs for shipments, tracking, branches, support
- Admin dashboard with analytics and reporting
- Real-time tracking system
- Swagger documentation and Postman collection
- Docker configuration for deployment
- Comprehensive testing and setup scripts

Backend ready for integration with FastFlyerExp frontend"
```

#### Step 2: Connect to FastFlyerExp Repository

```bash
# Add your FastFlyerExp repository as remote
git remote add origin https://github.com/YOUR_USERNAME/FastFlyerExp.git

# Verify the remote
git remote -v
```

#### Step 3: Push to Repository

```bash
# Set main branch
git branch -M main

# Push to FastFlyerExp repository
git push -u origin main
```

## 🏗️ Repository Structure After Setup

Your FastFlyerExp repository will have:

```
FastFlyerExp/
├── 📁 backend/              # New backend directory
│   ├── 📁 config/           # Database configuration
│   ├── 📁 middleware/       # Authentication, validation, rate limiting
│   ├── 📁 migrations/       # Database migration files
│   ├── 📁 routes/          # API route handlers
│   ├── 📁 seeds/           # Database seed data
│   ├── 📄 server.js        # Main application file
│   ├── 📄 package.json     # Backend dependencies
│   ├── 📄 README.md        # Backend documentation
│   ├── 📄 postman_collection.json
│   ├── 📄 Dockerfile       # Docker configuration
│   ├── 📄 docker-compose.yml
│   └── 📄 .env.example     # Environment template
├── 📁 frontend/            # Your existing frontend code
│   └── ... (existing files)
├── 📄 README.md            # Updated main README
└── 📄 .gitignore           # Updated gitignore
```

## 🔄 If Repository Already Has Content

If your FastFlyerExp repository already has files, you might need to handle conflicts:

```bash
# Pull existing content first
git pull origin main --allow-unrelated-histories

# Resolve any conflicts if they occur
# Then push your changes
git push origin main
```

## 🌿 Alternative: Use a Backend Branch

If you prefer to keep backend code in a separate branch:

```bash
# Create and switch to backend branch
git checkout -b backend

# Push backend branch
git push -u origin backend
```

## 🔧 Environment Configuration

After pushing to GitHub, update your environment:

1. **Backend Environment** (`.env`):
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=logistics_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   FRONTEND_URL=https://v0-fast-flyer-exp-fawn.vercel.app
   ```

2. **Frontend Environment**: Update your frontend to point to the backend API:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   # or for production:
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
   ```

## 🚀 Deployment Options

### Option 1: Separate Deployments
- **Frontend**: Continue using Vercel (https://v0-fast-flyer-exp-fawn.vercel.app)
- **Backend**: Deploy to Railway, Render, or Heroku

### Option 2: Full-Stack Deployment
- Deploy both frontend and backend together using Docker Compose
- Use platforms like Railway, Render, or DigitalOcean App Platform

### Option 3: Monorepo Deployment
- Use Vercel for full-stack deployment with separate build commands
- Configure `vercel.json` for both frontend and backend

## 📋 Integration Checklist

After adding backend to FastFlyerExp:

- [ ] Backend code pushed to repository
- [ ] Environment variables configured
- [ ] Database set up and migrated
- [ ] Frontend updated to use backend APIs
- [ ] CORS configured for frontend domain
- [ ] Authentication flow integrated
- [ ] API endpoints tested
- [ ] Documentation updated

## 🔗 API Integration Points

Your frontend should integrate with these backend endpoints:

```javascript
// Base API URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Key endpoints for frontend integration
const endpoints = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    profile: `${API_BASE}/auth/profile`
  },
  shipments: {
    create: `${API_BASE}/shipments`,
    list: `${API_BASE}/shipments`,
    get: (id) => `${API_BASE}/shipments/${id}`,
    update: (id) => `${API_BASE}/shipments/${id}`,
    cancel: (id) => `${API_BASE}/shipments/${id}`
  },
  tracking: {
    history: (id) => `${API_BASE}/tracking/${id}`,
    status: (id) => `${API_BASE}/tracking/${id}/status`
  },
  branches: {
    list: `${API_BASE}/branches`,
    search: `${API_BASE}/branches/search/location`
  },
  support: {
    create: `${API_BASE}/support`,
    list: `${API_BASE}/support/my-tickets`
  }
};
```

## 🎉 Next Steps

1. **Push backend to FastFlyerExp repository**
2. **Set up database and run migrations**
3. **Update frontend to use backend APIs**
4. **Test the complete integration**
5. **Deploy both frontend and backend**

Your FastFlyerExp project will now have a complete full-stack logistics and courier tracking system! 🚀