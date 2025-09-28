#!/bin/bash

# GitHub Repository Setup Script for Logistics Backend

echo "🚀 Setting up GitHub repository for Logistics Backend..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Complete logistics backend API

- PostgreSQL database schema with all required tables
- JWT authentication and role-based access control  
- Complete CRUD APIs for shipments, tracking, branches, support
- Admin dashboard with analytics and reporting
- Real-time tracking system
- Swagger documentation and Postman collection
- Docker configuration for deployment
- Comprehensive testing and setup scripts"

echo ""
echo "✅ Git repository initialized and files committed!"
echo ""
echo "📋 Next steps:"
echo "1. Create a new repository on GitHub:"
echo "   - Go to https://github.com/new"
echo "   - Repository name: logistics-backend (or your preferred name)"
echo "   - Description: Backend API for logistics and courier tracking system"
echo "   - Make it Public or Private as needed"
echo "   - DO NOT initialize with README, .gitignore, or license (we have them)"
echo ""
echo "2. Connect your local repository to GitHub:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
echo ""
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🔗 Or use GitHub CLI (if installed):"
echo "   gh repo create logistics-backend --public --description 'Backend API for logistics and courier tracking system' --source=. --remote=origin --push"
echo ""
echo "📚 See GITHUB_SETUP.md for detailed instructions!"