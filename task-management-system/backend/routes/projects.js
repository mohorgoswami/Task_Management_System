const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
} = require('../controllers/projectController');

// @route   GET /api/projects
// @desc    Get all projects
// @access  Public
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Public
router.get('/:id', getProject);

// @route   POST /api/projects
// @desc    Create new project
// @access  Public
router.post('/', createProject);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Public
router.put('/:id', updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Public
router.delete('/:id', deleteProject);

// @route   GET /api/projects/:id/stats
// @desc    Get project statistics
// @access  Public
router.get('/:id/stats', getProjectStats);

module.exports = router;