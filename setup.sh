#!/bin/bash

# Logistics Backend Setup Script
echo "🚀 Setting up Logistics & Courier Tracking Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL v12 or higher."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env file with your database credentials before continuing."
    echo "   Edit .env file and set your PostgreSQL connection details."
    read -p "Press Enter when you've updated the .env file..."
fi

# Load environment variables
source .env

# Create database if it doesn't exist
echo "🗄️  Setting up database..."
createdb $DB_NAME 2>/dev/null || echo "Database $DB_NAME already exists"

# Run migrations
echo "🔄 Running database migrations..."
npm run migrate

# Seed database
echo "🌱 Seeding database with sample data..."
npm run seed

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Start the server: npm run dev"
echo "   2. Visit API docs: http://localhost:3000/api-docs"
echo "   3. Test with Postman collection: postman_collection.json"
echo ""
echo "👤 Sample login credentials:"
echo "   Admin: admin@logistics.com / admin123"
echo "   Customer: john.doe@email.com / customer123"
echo ""
echo "🔗 API Base URL: http://localhost:3000/api"
echo "📚 Documentation: http://localhost:3000/api-docs"
echo "🏥 Health Check: http://localhost:3000/health"