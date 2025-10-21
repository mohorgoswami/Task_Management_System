const { GoogleGenerativeAI } = require('@google/generative-ai');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Joi = require('joi');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Validation schemas
const summarizeValidationSchema = Joi.object({
  projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
});

const questionValidationSchema = Joi.object({
  projectId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  question: Joi.string().trim().min(5).max(500).required(),
  taskId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
});

// @desc    Summarize all tasks in a project using AI
// @route   POST /api/ai/summarize
// @access  Public
const summarizeTasks = async (req, res) => {
  try {
    // Validate input
    const { error } = summarizeValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    const { projectId } = req.body;

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        message: 'Gemini AI is not configured. Please set GEMINI_API_KEY in environment variables.'
      });
    }

    // Get project and tasks
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const tasks = await Task.find({ project: projectId }).populate('project', 'name');
    
    if (tasks.length === 0) {
      return res.json({
        success: true,
        data: {
          summary: 'This project currently has no tasks to summarize.',
          projectName: project.name,
          taskCount: 0
        }
      });
    }

    // Prepare data for AI
    const taskData = tasks.map(task => ({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      tags: task.tags,
      dueDate: task.dueDate
    }));

    const prompt = `
      You are an AI assistant helping with project management. Please provide a comprehensive summary of the following project tasks.

      Project: ${project.name}
      Project Description: ${project.description}
      
      Tasks:
      ${JSON.stringify(taskData, null, 2)}

      Please provide:
      1. An overall project summary
      2. Progress overview (how many tasks in each status)
      3. Key insights about the project
      4. Priority distribution
      5. Any recommendations or observations

      Format your response in a clear, professional manner.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    // Get task statistics
    const stats = {
      total: tasks.length,
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': tasks.filter(t => t.status === 'Done').length
    };

    res.json({
      success: true,
      data: {
        summary,
        projectName: project.name,
        taskCount: tasks.length,
        statistics: stats
      }
    });

  } catch (error) {
    console.error('Error generating AI summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating AI summary',
      error: error.message
    });
  }
};

// @desc    Ask AI questions about tasks/project
// @route   POST /api/ai/question
// @access  Public
const askQuestion = async (req, res) => {
  try {
    // Validate input
    const { error } = questionValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    const { projectId, question, taskId } = req.body;

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        message: 'Gemini AI is not configured. Please set GEMINI_API_KEY in environment variables.'
      });
    }

    // Get project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    let contextData = {
      project: {
        name: project.name,
        description: project.description
      }
    };

    // If asking about a specific task
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      contextData.specificTask = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        tags: task.tags,
        dueDate: task.dueDate
      };
    } else {
      // Get all tasks for context
      const tasks = await Task.find({ project: projectId });
      contextData.allTasks = tasks.map(task => ({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        tags: task.tags,
        dueDate: task.dueDate
      }));
    }

    const prompt = `
      You are an AI assistant helping with project management. Answer the following question about the project/tasks.

      Question: ${question}

      Context:
      ${JSON.stringify(contextData, null, 2)}

      Please provide a helpful, accurate response based on the project and task information provided. If the question cannot be answered with the available information, let the user know what additional information might be needed.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    res.json({
      success: true,
      data: {
        question,
        answer,
        projectName: project.name,
        context: taskId ? 'specific-task' : 'all-tasks'
      }
    });

  } catch (error) {
    console.error('Error processing AI question:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing AI question',
      error: error.message
    });
  }
};

// @desc    Get AI suggestions for task improvement
// @route   POST /api/ai/suggestions
// @access  Public
const getTaskSuggestions = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: 'Task ID is required'
      });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        message: 'Gemini AI is not configured. Please set GEMINI_API_KEY in environment variables.'
      });
    }

    const task = await Task.findById(taskId).populate('project', 'name description');
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const prompt = `
      You are an AI assistant helping with task management. Analyze the following task and provide suggestions for improvement.

      Task Details:
      Title: ${task.title}
      Description: ${task.description}
      Status: ${task.status}
      Priority: ${task.priority}
      Tags: ${task.tags.join(', ')}
      Project: ${task.project.name}
      Project Description: ${task.project.description}

      Please provide:
      1. Suggestions to improve the task description or clarity
      2. Recommendations for breaking down the task if it's too large
      3. Suggested tags or categorization
      4. Priority assessment
      5. Any potential dependencies or blockers to consider

      Format your response as actionable suggestions.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();

    res.json({
      success: true,
      data: {
        taskTitle: task.title,
        suggestions,
        taskId: task._id
      }
    });

  } catch (error) {
    console.error('Error generating task suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating task suggestions',
      error: error.message
    });
  }
};

module.exports = {
  summarizeTasks,
  askQuestion,
  getTaskSuggestions
};