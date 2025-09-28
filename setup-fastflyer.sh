#!/bin/bash

# FastFlyerExp Repository Setup Script

echo "🚀 Setting up FastFlyerExp repository with Logistics Backend..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
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

# Set up remote for FastFlyerExp repository
echo "🔗 Setting up FastFlyerExp remote..."
git remote add origin https://github.com/YOUR_USERNAME/FastFlyerExp.git

# Set main branch
git branch -M main

echo ""
echo "✅ Git repository configured for FastFlyerExp!"
echo ""
echo "📋 Next steps:"
echo "1. Update the remote URL with your actual GitHub username:"
echo "   git remote set-url origin https://github.com/YOUR_ACTUAL_USERNAME/FastFlyerExp.git"
echo ""
echo "2. Push to FastFlyerExp repository:"
echo "   git push -u origin main"
echo ""
echo "3. If the repository already exists and has content, you might need to:"
echo "   git pull origin main --allow-unrelated-histories"
echo "   git push origin main"
echo ""
echo "🔧 Alternative: If you want to push to a specific branch for backend:"
echo "   git checkout -b backend"
echo "   git push -u origin backend"
echo ""
echo "📁 Your backend code will be added to the FastFlyerExp repository!"
echo "   Frontend: https://v0-fast-flyer-exp-fawn.vercel.app/"
echo "   Backend: Will be available in the same repository"