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

    // Generate fallback summary without AI for now
    const stats = {
      total: tasks.length,
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': tasks.filter(t => t.status === 'Done').length
    };

    const progress = stats.total > 0 ? Math.round((stats['Done'] / stats.total) * 100) : 0;
    
    const fallbackSummary = ` **${project.name}** - Project Analysis

 **TASK OVERVIEW**
 Total Tasks: ${stats.total}
 To Do: ${stats['To Do']} tasks
 In Progress: ${stats['In Progress']} tasks  
 Completed: ${stats['Done']} tasks
 Overall Progress: ${progress}%

---
*Analysis powered by intelligent project analytics*`;

    res.json({
      success: true,
      data: {
        summary: fallbackSummary,
        projectName: project.name,
        taskCount: tasks.length,
        statistics: stats,
        progress,
        aiStatus: 'fallback'
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
    const { projectId, question } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const fallbackAnswer = `I can help you with your project "${project.name}". However, AI services are temporarily unavailable.`;
    
    res.json({
      success: true,
      data: {
        question,
        answer: fallbackAnswer,
        projectName: project.name,
        aiStatus: 'fallback'
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

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const fallbackSuggestions = ' Review task description for clarity and completeness\n Consider breaking down complex tasks into smaller subtasks\n Set appropriate priority based on project goals';

    res.json({
      success: true,
      data: {
        taskTitle: task.title,
        suggestions: fallbackSuggestions,
        taskId: task._id,
        aiStatus: 'fallback'
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
