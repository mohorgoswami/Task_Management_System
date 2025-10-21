# Task Management System - Development Scripts

This document provides helpful scripts and commands for development, testing, and deployment.

## 🚀 Quick Start Scripts

### Development Setup (Windows)

```powershell
# Clone and setup project
git clone <repository-url>
cd task-management-system

# Setup backend
cd backend
npm install
copy .env.example .env
# Edit .env file with your configurations
cd ..

# Setup frontend
cd frontend
npm install
cd ..

# Start development servers (run in separate terminals)
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Development Setup (macOS/Linux)

```bash
# Clone and setup project
git clone <repository-url>
cd task-management-system

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env file with your configurations
cd ..

# Setup frontend
cd frontend
npm install
cd ..

# Start development servers (run in separate terminals)
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📦 Package Scripts

### Backend Scripts

```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# Install dependencies
npm install

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### Frontend Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (use with caution)
npm run eject

# Install dependencies
npm install

# Check bundle size
npm run build && npx bundlesize
```

## 🗄️ Database Management

### MongoDB Commands

```bash
# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (macOS with Homebrew)
brew services start mongodb/brew/mongodb-community

# Start MongoDB service (Linux)
sudo systemctl start mongod

# Connect to MongoDB shell
mongo

# Show databases
show dbs

# Use task management database
use task-management

# Show collections
show collections

# View all projects
db.projects.find().pretty()

# View all tasks
db.tasks.find().pretty()

# Delete all data (use with caution)
db.projects.deleteMany({})
db.tasks.deleteMany({})

# Drop database (use with caution)
db.dropDatabase()
```

### Sample Data Creation

```javascript
// Run in MongoDB shell to create sample data

// Create sample projects
db.projects.insertMany([
  {
    name: "Website Redesign",
    description: "Complete redesign of company website with modern UI/UX",
    createdDate: new Date(),
    updatedDate: new Date(),
    taskCount: 0
  },
  {
    name: "Mobile App Development",
    description: "Develop iOS and Android mobile application",
    createdDate: new Date(),
    updatedDate: new Date(),
    taskCount: 0
  }
]);

// Get project IDs for tasks
var projects = db.projects.find().toArray();
var websiteProject = projects[0]._id;
var mobileProject = projects[1]._id;

// Create sample tasks
db.tasks.insertMany([
  {
    title: "Design Homepage",
    description: "Create wireframes and mockups for the new homepage",
    status: "To Do",
    project: websiteProject,
    priority: "High",
    order: 0,
    createdDate: new Date(),
    updatedDate: new Date(),
    tags: ["design", "ui"]
  },
  {
    title: "Implement User Authentication",
    description: "Set up login and registration functionality",
    status: "In Progress",
    project: websiteProject,
    priority: "Medium",
    order: 0,
    createdDate: new Date(),
    updatedDate: new Date(),
    tags: ["backend", "auth"]
  },
  {
    title: "Setup Development Environment",
    description: "Configure React Native development environment",
    status: "Done",
    project: mobileProject,
    priority: "High",
    order: 0,
    createdDate: new Date(),
    updatedDate: new Date(),
    tags: ["setup", "react-native"]
  }
]);
```

## 🧪 Testing Scripts

### API Testing with curl

```bash
# Health check
curl http://localhost:5000/api/health

# Get all projects
curl http://localhost:5000/api/projects

# Create new project
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "A test project created via API"
  }'

# Get project tasks
curl http://localhost:5000/api/tasks/project/PROJECT_ID_HERE

# Create new task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "A test task created via API",
    "project": "PROJECT_ID_HERE",
    "status": "To Do",
    "priority": "Medium"
  }'
```

### Frontend Testing

```bash
# Run React tests
cd frontend
npm test

# Run tests with coverage
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- TaskCard.test.js

# Run tests in CI mode
CI=true npm test
```

## 🔧 Build & Deployment

### Production Build

```bash
# Build frontend for production
cd frontend
npm run build

# The build folder contains optimized production files
ls build/

# Serve production build locally for testing
npx serve -s build -l 3000
```

### Docker Scripts (Optional)

Create `Dockerfile` for backend:

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:5.0
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/task-management
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

Docker commands:

```bash
# Build and start services
docker-compose up --build

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend
```

## 🔍 Debug Scripts

### Backend Debugging

```bash
# Debug with Node.js inspector
node --inspect server.js

# Debug with Chrome DevTools
node --inspect-brk server.js

# Verbose logging
DEBUG=* npm run dev

# Check environment variables
printenv | grep -E "(MONGODB|GEMINI|NODE_ENV)"
```

### Frontend Debugging

```bash
# Start with debug information
REACT_APP_DEBUG=true npm start

# Build with source maps
npm run build

# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

### Log Management

```bash
# View backend logs (if using PM2)
pm2 logs task-management-backend

# Clear logs
pm2 flush

# Monitor logs in real-time
tail -f server.log
```

## 🚀 Performance Optimization

### Frontend Optimization

```bash
# Analyze bundle size
cd frontend
npm run build
npx bundlesize

# Check for unused dependencies
npx depcheck

# Update dependencies
npx npm-check-updates -u
npm install
```

### Backend Optimization

```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check outdated packages
npm outdated

# Profile memory usage
node --prof server.js
```

## 🔄 Maintenance Scripts

### Regular Maintenance

```bash
# Update all dependencies
cd backend && npm update && cd ../frontend && npm update

# Clear all caches
npm cache clean --force

# Reset node_modules
rm -rf node_modules package-lock.json && npm install

# Check disk usage
du -sh node_modules/
```

### Database Maintenance

```javascript
// MongoDB maintenance commands

// Create indexes for better performance
db.tasks.createIndex({ "project": 1, "status": 1 })
db.tasks.createIndex({ "project": 1, "order": 1 })
db.projects.createIndex({ "createdDate": -1 })

// Check database statistics
db.stats()

// Check collection statistics
db.projects.stats()
db.tasks.stats()

// Compact database (reduces file size)
db.runCommand({ compact: "projects" })
db.runCommand({ compact: "tasks" })
```

## 📊 Monitoring Scripts

### Health Check Script

```bash
#!/bin/bash
# health-check.sh

echo "Checking backend health..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/health)
if [ $response = "200" ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
fi

echo "Checking frontend..."
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ $response = "200" ]; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding"
fi

echo "Checking MongoDB..."
if mongo --eval "db.adminCommand('ismaster')" >/dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running"
fi
```

Make it executable and run:

```bash
chmod +x health-check.sh
./health-check.sh
```

---

These scripts should help you with development, testing, and maintenance of the Task Management System. Adjust them according to your specific environment and requirements.