const Task = require('../models/Task');
const Project = require('../models/Project');
const Joi = require('joi');

// Validation schemas
const taskValidationSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().trim().min(1).max(1000).required(),
  status: Joi.string().valid('To Do', 'In Progress', 'Done').default('To Do'),
  project: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
  priority: Joi.string().valid('Low', 'Medium', 'High').default('Medium'),
  order: Joi.number().integer().min(0),
  dueDate: Joi.date(),
  tags: Joi.array().items(Joi.string().trim().max(30))
});

const updateTaskValidationSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100),
  description: Joi.string().trim().min(1).max(1000),
  status: Joi.string().valid('To Do', 'In Progress', 'Done'),
  priority: Joi.string().valid('Low', 'Medium', 'High'),
  order: Joi.number().integer().min(0),
  dueDate: Joi.date().allow(null),
  tags: Joi.array().items(Joi.string().trim().max(30))
});

// @desc    Get all tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Public
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const tasks = await Task.getTasksGroupedByStatus(projectId);

    res.json({
      success: true,
      data: tasks,
      project: project.name
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    const { status, project, priority } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (project) filter.project = project;
    if (priority) filter.priority = priority;

    const tasks = await Task.find(filter)
      .populate('project', 'name')
      .sort({ order: 1, createdDate: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project', 'name description');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching task',
      error: error.message
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    // Validate input
    const { error } = taskValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    // Verify project exists
    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // If no order specified, set it to the highest order + 1 for the status
    if (!req.body.order) {
      const lastTask = await Task.findOne({
        project: req.body.project,
        status: req.body.status || 'To Do'
      }).sort({ order: -1 });
      
      req.body.order = lastTask ? lastTask.order + 1 : 0;
    }

    const task = await Task.create(req.body);
    await task.populate('project', 'name');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    // Validate input
    const { error } = updateTaskValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('project', 'name');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

// @desc    Update task status (for drag and drop)
// @route   PATCH /api/tasks/:id/status
// @access  Public
const updateTaskStatus = async (req, res) => {
  try {
    const { status, order } = req.body;

    if (!status || !['To Do', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required'
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update task status and order
    task.status = status;
    if (order !== undefined) {
      task.order = order;
    }

    await task.save();
    await task.populate('project', 'name');

    res.json({
      success: true,
      message: 'Task status updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task status',
      error: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

// @desc    Bulk update task orders (for drag and drop reordering)
// @route   PATCH /api/tasks/bulk-update-order
// @access  Public
const bulkUpdateTaskOrder = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: 'Tasks array is required'
      });
    }

    const updatePromises = tasks.map(({ id, status, order }) =>
      Task.findByIdAndUpdate(id, { status, order }, { new: true })
    );

    const updatedTasks = await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Task orders updated successfully',
      data: updatedTasks
    });
  } catch (error) {
    console.error('Error updating task orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task orders',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTask,
  getTasksByProject,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  bulkUpdateTaskOrder
};