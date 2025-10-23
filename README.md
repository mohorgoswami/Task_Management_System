# 🎯 Task Management System with AI Integration

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![React](https://img.shields.io/badge/React-18.x-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)
![AI Integration](https://img.shields.io/badge/AI-Gemini%20Powered-orange.svg)

A modern, full-stack task management application built with the MERN stack, featuring intelligent AI-powered insights and intuitive Kanban board functionality. Perfect for teams and individuals looking to streamline their project workflows with cutting-edge technology.

## 🌟 **Key Features**

### 📋 **Core Functionality**
- **Intuitive Kanban Board**: Drag-and-drop task management with real-time updates
- **Project Management**: Create, organize, and track multiple projects
- **Task Lifecycle**: Complete task CRUD operations with status tracking
- **Priority Management**: High, Medium, Low priority levels with visual indicators
- **Due Date Tracking**: Smart deadline management with overdue detection

### 🤖 **AI-Powered Intelligence**
- **Smart Project Summarization**: AI-generated project insights and progress analysis
- **Natural Language Q&A**: Ask questions about your projects in plain English
- **Intelligent Task Analysis**: Get AI-powered suggestions for task optimization
- **Progress Insights**: Automated progress tracking and completion metrics
- **Fallback Intelligence**: Smart responses even when AI services are unavailable

### 🎨 **User Experience**
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Real-time Updates**: Instant synchronization across all connected clients
- **Dark/Light Theme**: User preference-based theme switching
- **Intuitive Interface**: Clean, modern UI inspired by leading productivity tools
- **Performance Optimized**: Fast loading times and smooth interactions

## 🛠 **Technology Stack**

### **Frontend**
- **React.js 18.x**: Modern React with hooks and functional components
- **React Router**: Client-side routing and navigation
- **React Beautiful DnD**: Smooth drag-and-drop functionality
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Lucide React**: Beautiful, customizable icons
- **React Hot Toast**: Elegant notification system

### **Backend**
- **Node.js**: JavaScript runtime for server-side development
- **Express.js**: Fast, minimalist web framework
- **MongoDB**: NoSQL database for flexible data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **Joi**: Data validation library
- **Helmet**: Security middleware for Express applications
- **CORS**: Cross-origin resource sharing support

### **AI Integration**
- **Google Generative AI (Gemini)**: Advanced AI capabilities for intelligent insights
- **Natural Language Processing**: Understand and respond to user queries
- **Intelligent Fallback System**: Maintain functionality without AI dependency

### **Development & Deployment**
- **npm**: Package management
- **dotenv**: Environment variable management
- **Express Rate Limiting**: API protection and throttling
- **Professional Error Handling**: Comprehensive error management system

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18.x or higher
- MongoDB Atlas account (or local MongoDB installation)
- Google AI API key (optional, for AI features)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/mohorgoswami/Task_Management_System.git
cd Task_Management_System
```

2. **Install backend dependencies**
```bash
cd task-management-system/backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Environment Setup**
Create a `.env` file in the backend directory:
```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# AI Integration (Optional)
GEMINI_API_KEY=your_google_ai_api_key

# Application Settings
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

5. **Start the application**

Backend server:
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

Frontend application:
```bash
cd frontend
npm start
# Application runs on http://localhost:3000
```

## 📊 **Project Structure**

```
task-management-system/
├── backend/
│   ├── controllers/          # Business logic controllers
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   └── aiController.js
│   ├── models/              # MongoDB data models
│   │   ├── Project.js
│   │   └── Task.js
│   ├── routes/              # API route definitions
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   └── ai.js
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── server.js            # Express server setup
│   └── package.json
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── Navbar.js
│   │   │   ├── TaskCard.js
│   │   │   ├── CreateTaskModal.js
│   │   │   └── AIAssistant.js
│   │   ├── pages/           # Page components
│   │   │   ├── ProjectsPage.js
│   │   │   └── ProjectBoard.js
│   │   ├── context/         # React Context for state management
│   │   │   └── ProjectContext.js
│   │   ├── services/        # API communication
│   │   │   └── api.js
│   │   ├── styles/          # Global styles
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🎯 **API Documentation**

### **Project Endpoints**
```http
GET    /api/projects          # Get all projects
POST   /api/projects          # Create new project
GET    /api/projects/:id      # Get project by ID
PUT    /api/projects/:id      # Update project
DELETE /api/projects/:id      # Delete project
```

### **Task Endpoints**
```http
GET    /api/tasks/project/:id # Get tasks by project
POST   /api/tasks            # Create new task
PUT    /api/tasks/:id         # Update task
DELETE /api/tasks/:id         # Delete task
PUT    /api/tasks/:id/status  # Update task status
POST   /api/tasks/bulk-update # Bulk update task order
```

### **AI Endpoints**
```http
POST   /api/ai/summarize      # Generate project summary
POST   /api/ai/question       # Ask AI questions
POST   /api/ai/suggestions    # Get task suggestions
```

## 💡 **Usage Examples**

### **AI Q&A Examples**
```
"What's the project progress?"
→ "Project 'Website Development' is 75% complete (6/8 tasks finished)."

"Which tasks have high priority?"
→ "You have 2 high priority tasks: Security Implementation, Homepage Design"

"Any overdue tasks?"
→ "You have 1 overdue task: API Documentation (due 2 days ago)"
```

### **Task Management**
- Create projects with descriptions and track overall progress
- Add tasks with priorities, due dates, and detailed descriptions
- Drag tasks between "To Do", "In Progress", and "Done" columns
- Real-time updates ensure team synchronization

## 🔧 **Configuration**

### **Database Setup**
1. Create a MongoDB Atlas cluster or set up local MongoDB
2. Add your connection string to the `.env` file
3. The application will automatically create required collections

### **AI Configuration**
1. Obtain a Google AI API key from Google AI Studio
2. Add the key to your `.env` file as `GEMINI_API_KEY`
3. AI features will activate automatically when configured

## 🛡 **Security Features**

- **Helmet.js**: Security headers and protection
- **Rate Limiting**: API endpoint protection
- **Input Validation**: Joi schema validation for all inputs
- **Error Handling**: Secure error responses without sensitive data exposure
- **CORS Configuration**: Controlled cross-origin access

## 🚀 **Deployment**

### **Backend Deployment (Heroku/Railway)**
```bash
# Set environment variables
MONGODB_URI=your_production_mongodb_uri
GEMINI_API_KEY=your_api_key
NODE_ENV=production
```

### **Frontend Deployment (Vercel/Netlify)**
```bash
# Build the production version
npm run build

# Configure API base URL for production
REACT_APP_API_URL=your_backend_url
```

## 🧪 **Testing**

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📈 **Performance Optimizations**

- **MongoDB Indexing**: Optimized database queries
- **React Optimization**: Memoization and efficient re-renders
- **API Caching**: Intelligent caching strategies
- **Bundle Optimization**: Code splitting and lazy loading
- **Image Optimization**: Compressed and responsive images

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **React Team**: For the amazing React framework
- **MongoDB**: For the flexible NoSQL database
- **Google AI**: For the powerful Generative AI capabilities
- **Tailwind CSS**: For the utility-first CSS framework
- **Open Source Community**: For the incredible tools and libraries

## 📞 **Contact & Support**

- **Developer**: [Mohor Goswami](https://github.com/mohorgoswami)
- **Project Repository**: [Task Management System](https://github.com/mohorgoswami/Task_Management_System)
- **Issues**: [Report Bug or Request Feature](https://github.com/mohorgoswami/Task_Management_System/issues)

---

### 🌟 **Star this repository if you found it helpful!**

Built with ❤️ using the MERN Stack and AI Integration
