const express = require('express');
const router = express.Router();
const {
  summarizeTasks,
  askQuestion,
  getTaskSuggestions
} = require('../controllers/aiController');

// @route   POST /api/ai/summarize
// @desc    Summarize all tasks in a project using AI
// @access  Public
router.post('/summarize', summarizeTasks);

// @route   POST /api/ai/question
// @desc    Ask AI questions about tasks/project
// @access  Public
router.post('/question', askQuestion);

// @route   POST /api/ai/suggestions
// @desc    Get AI suggestions for task improvement
// @access  Public
router.post('/suggestions', getTaskSuggestions);

module.exports = router;