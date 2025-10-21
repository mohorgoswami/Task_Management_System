const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  getTasksByProject,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  bulkUpdateTaskOrder
} = require('../controllers/taskController');

// @route   GET /api/tasks
// @desc    Get all tasks (with optional filters)
// @access  Public
router.get('/', getTasks);

// @route   GET /api/tasks/project/:projectId
// @desc    Get all tasks for a project (grouped by status)
// @access  Public
router.get('/project/:projectId', getTasksByProject);

// @route   PATCH /api/tasks/bulk-update-order
// @desc    Bulk update task orders (for drag and drop)
// @access  Public
router.patch('/bulk-update-order', bulkUpdateTaskOrder);

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Public
router.get('/:id', getTask);

// @route   POST /api/tasks
// @desc    Create new task
// @access  Public
router.post('/', createTask);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Public
router.put('/:id', updateTask);

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status (for drag and drop)
// @access  Public
router.patch('/:id/status', updateTaskStatus);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Public
router.delete('/:id', deleteTask);

module.exports = router;