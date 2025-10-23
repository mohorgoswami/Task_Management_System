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

    // Get project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get tasks for analysis
    const tasks = await Task.find({ project: projectId });
    
    // Intelligent fallback responses based on question content
    const questionLower = question.toLowerCase();
    let fallbackAnswer = '';

    if (questionLower.includes('overdue') || questionLower.includes('late')) {
      const overdueTasks = tasks.filter(task => 
        task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done'
      );
      fallbackAnswer = overdueTasks.length > 0 
        ? `You have ${overdueTasks.length} overdue task(s): ${overdueTasks.map(t => t.title).join(', ')}`
        : 'No tasks are currently overdue. Great job staying on track!';
        
    } else if (questionLower.includes('progress') || questionLower.includes('complete')) {
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'Done').length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      fallbackAnswer = `Project "${project.name}" is ${progress}% complete (${completed}/${total} tasks finished).`;
      
    } else if (questionLower.includes('high priority') || questionLower.includes('urgent') || questionLower.includes('high')) {
      const highPriorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'Done');
      fallbackAnswer = highPriorityTasks.length > 0
        ? `You have ${highPriorityTasks.length} high priority task(s): ${highPriorityTasks.map(t => t.title).join(', ')}`
        : 'No high priority tasks are pending. Well done!';
        
    } else if (questionLower.includes('medium priority') || questionLower.includes('medium')) {
      const mediumPriorityTasks = tasks.filter(t => t.priority === 'Medium' && t.status !== 'Done');
      fallbackAnswer = mediumPriorityTasks.length > 0
        ? `You have ${mediumPriorityTasks.length} medium priority task(s): ${mediumPriorityTasks.map(t => t.title).join(', ')}`
        : 'No medium priority tasks are pending.';
        
    } else if (questionLower.includes('low priority') || questionLower.includes('low')) {
      const lowPriorityTasks = tasks.filter(t => t.priority === 'Low' && t.status !== 'Done');
      fallbackAnswer = lowPriorityTasks.length > 0
        ? `You have ${lowPriorityTasks.length} low priority task(s): ${lowPriorityTasks.map(t => t.title).join(', ')}`
        : 'No low priority tasks are pending.';
        
    } else if (questionLower.includes('priority')) {
      const priorities = {
        High: tasks.filter(t => t.priority === 'High' && t.status !== 'Done').length,
        Medium: tasks.filter(t => t.priority === 'Medium' && t.status !== 'Done').length,
        Low: tasks.filter(t => t.priority === 'Low' && t.status !== 'Done').length
      };
      fallbackAnswer = `Priority breakdown: ${priorities.High} high priority, ${priorities.Medium} medium priority, ${priorities.Low} low priority tasks pending.`;
        
    } else if (questionLower.includes('in progress') || questionLower.includes('working')) {
      const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
      fallbackAnswer = inProgressTasks.length > 0
        ? `Currently ${inProgressTasks.length} task(s) in progress: ${inProgressTasks.map(t => t.title).join(', ')}`
        : 'No tasks are currently in progress. Consider moving some tasks from "To Do"!';
        
    } else if (questionLower.includes('todo') || questionLower.includes('to do') || questionLower.includes('pending')) {
      const todoTasks = tasks.filter(t => t.status === 'To Do');
      fallbackAnswer = todoTasks.length > 0
        ? `You have ${todoTasks.length} task(s) to start: ${todoTasks.slice(0, 5).map(t => t.title).join(', ')}${todoTasks.length > 5 ? '...' : ''}`
        : 'No pending tasks! All tasks are either in progress or completed.';
        
    } else if (questionLower.includes('done') || questionLower.includes('finished') || questionLower.includes('completed')) {
      const doneTasks = tasks.filter(t => t.status === 'Done');
      fallbackAnswer = doneTasks.length > 0
        ? `You have completed ${doneTasks.length} task(s): ${doneTasks.slice(0, 5).map(t => t.title).join(', ')}${doneTasks.length > 5 ? '...' : ''}`
        : 'No tasks completed yet. Time to get started!';
        
    } else if (questionLower.includes('count') || questionLower.includes('how many')) {
      fallbackAnswer = `Project "${project.name}" has ${tasks.length} total tasks: ${tasks.filter(t => t.status === 'To Do').length} to do, ${tasks.filter(t => t.status === 'In Progress').length} in progress, ${tasks.filter(t => t.status === 'Done').length} completed.`;
      
    } else if (questionLower.includes('which') || questionLower.includes('what tasks') || questionLower.includes('show me')) {
      // Handle questions like "which one is medium", "what tasks are high priority", etc.
      if (questionLower.includes('medium')) {
        const mediumTasks = tasks.filter(t => t.priority === 'Medium');
        fallbackAnswer = mediumTasks.length > 0
          ? `Medium priority tasks: ${mediumTasks.map(t => `"${t.title}" (${t.status})`).join(', ')}`
          : 'No medium priority tasks found.';
      } else if (questionLower.includes('high')) {
        const highTasks = tasks.filter(t => t.priority === 'High');
        fallbackAnswer = highTasks.length > 0
          ? `High priority tasks: ${highTasks.map(t => `"${t.title}" (${t.status})`).join(', ')}`
          : 'No high priority tasks found.';
      } else if (questionLower.includes('low')) {
        const lowTasks = tasks.filter(t => t.priority === 'Low');
        fallbackAnswer = lowTasks.length > 0
          ? `Low priority tasks: ${lowTasks.map(t => `"${t.title}" (${t.status})`).join(', ')}`
          : 'No low priority tasks found.';
      } else {
        fallbackAnswer = `Here are all tasks: ${tasks.map(t => `"${t.title}" (${t.status}, ${t.priority} priority)`).slice(0, 10).join(', ')}${tasks.length > 10 ? '...' : ''}`;
      }
      
    } else {
      fallbackAnswer = `I can help analyze your project "${project.name}" with ${tasks.length} tasks. Try asking about: project progress, overdue tasks, high priority items, task counts, or specific task statuses. AI services are temporarily unavailable, but I can provide intelligent insights based on your data!`;
    }
    
    res.json({
      success: true,
      data: {
        question,
        answer: fallbackAnswer,
        projectName: project.name,
        context: taskId ? 'specific-task' : 'all-tasks',
        aiStatus: 'intelligent_fallback'
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
