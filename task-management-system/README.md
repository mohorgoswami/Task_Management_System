# Task Management System with AI Integration

A comprehensive project and task management system built with the MERN stack, featuring an AI-powered assistant using Google's Gemini AI for task summarization and intelligent Q&A.

![Task Management System](https://img.shields.io/badge/MERN-Stack-brightgreen) ![AI Powered](https://img.shields.io/badge/AI-Powered-purple) ![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Features

### Project Management
- ✅ Create, read, update, and delete projects
- ✅ Project overview with statistics and progress tracking
- ✅ Search and filter projects
- ✅ Responsive design for all devices

### Task Management
- ✅ Full CRUD operations for tasks
- ✅ Kanban board interface with drag-and-drop functionality
- ✅ Task prioritization (Low, Medium, High)
- ✅ Due date tracking with overdue indicators
- ✅ Task tagging system
- ✅ Status tracking (To Do, In Progress, Done)

### AI Features (Gemini Integration)
- 🤖 **AI Summarization**: Get intelligent summaries of project tasks
- 🤖 **Smart Q&A**: Ask questions about your projects and get AI-powered responses
- 🤖 **Task Suggestions**: Receive AI recommendations for task improvement
- 🤖 **Project Insights**: Get analytical insights about project progress

### Technical Features
- 🔄 Real-time drag-and-drop task management
- 📱 Fully responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔒 Input validation and error handling
- ⚡ Optimized performance
- 🌐 RESTful API architecture

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Google Generative AI** - Gemini AI integration
- **Joi** - Data validation
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - Frontend library
- **React Router DOM** - Routing
- **React Beautiful DnD** - Drag and drop
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **Date-fns** - Date utilities

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (v4.4 or higher)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Configure Environment Variables

Edit the `.env` file in the backend directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/task-management

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 4. Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key and paste it in your `.env` file

### 5. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 6. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB service (varies by OS)
# Windows (if installed as service):
net start MongoDB

# macOS (with Homebrew):
brew services start mongodb/brew/mongodb-community

# Linux (systemd):
sudo systemctl start mongod
```

## 🎯 Running the Application

### 1. Start the Backend Server

```bash
# From the backend directory
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

### 2. Start the Frontend Application

```bash
# From the frontend directory (new terminal)
cd frontend
npm start
```

The React app will start on `http://localhost:3000`

### 3. Access the Application

Open your browser and navigate to `http://localhost:3000`

## 📖 Usage Guide

### Creating Your First Project

1. Click "New Project" on the homepage
2. Enter project name and description
3. Click "Create Project"

### Managing Tasks

1. Click on a project to open the Kanban board
2. Use "Add Task" to create new tasks
3. Drag and drop tasks between columns
4. Click on task cards to edit or delete them

### Using AI Features

1. Click "AI Assistant" in the project board
2. **Summarize Tab**: Generate project summaries
3. **Q&A Chat Tab**: Ask questions about your project
4. **Suggestions Tab**: Get AI recommendations

### Example AI Questions

- "What tasks are overdue?"
- "Which tasks have high priority?"
- "What's the overall project progress?"
- "What should I focus on next?"

## 🔧 API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/stats` - Get project statistics

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `GET /api/tasks/project/:projectId` - Get tasks by project
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/status` - Update task status
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/bulk-update-order` - Bulk update task orders

### AI
- `POST /api/ai/summarize` - Summarize project tasks
- `POST /api/ai/question` - Ask AI questions
- `POST /api/ai/suggestions` - Get AI suggestions

## 🏗️ Project Structure

```
task-management-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── aiController.js
│   ├── models/
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── ai.js
│   ├── middleware/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── ProjectCard.js
│   │   │   ├── TaskCard.js
│   │   │   ├── CreateProjectModal.js
│   │   │   ├── CreateTaskModal.js
│   │   │   ├── AIAssistant.js
│   │   │   └── LoadingSpinner.js
│   │   ├── pages/
│   │   │   ├── ProjectsPage.js
│   │   │   └── ProjectBoard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── ProjectContext.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🔍 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB is accessible

2. **Gemini AI Not Working**
   - Verify your API key is correct
   - Check if you have credits/quota remaining
   - Ensure the API key has proper permissions

3. **CORS Errors**
   - Check if `CLIENT_URL` in backend `.env` matches frontend URL
   - Ensure both servers are running

4. **Drag and Drop Not Working**
   - Clear browser cache
   - Check if JavaScript is enabled
   - Try a different browser

### Environment Issues

```bash
# Clear npm cache
npm cache clean --force

# Reinstall node_modules
rm -rf node_modules package-lock.json
npm install

# Reset MongoDB database (if needed)
mongo
use task-management
db.dropDatabase()
```

## 🚀 Deployment

### Backend Deployment (Example with Heroku)

1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Connect to MongoDB Atlas
4. Deploy using Git or GitHub integration

### Frontend Deployment (Example with Vercel)

1. Build the frontend: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update `REACT_APP_API_URL` to point to deployed backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent features
- React Beautiful DnD for drag-and-drop functionality
- Tailwind CSS for styling
- All the open-source libraries used in this project

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section
2. Search existing issues on GitHub
3. Create a new issue with detailed information

---

**Built with ❤️ using the MERN Stack and AI**