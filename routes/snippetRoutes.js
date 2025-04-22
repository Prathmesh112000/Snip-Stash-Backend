const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const snippetController = require('../controllers/snippetController');

// All routes are protected
router.use(protect);

// Get all snippets with optional filtering
router.get('/', snippetController.getAll);

// Create a new snippet
router.post('/', snippetController.createSnippet);

// Get a single snippet
router.get('/:id', snippetController.getSnippetById);

// Update a snippet
router.put('/:id', snippetController.updateSnippet);

// Delete a snippet
router.delete('/:id', snippetController.deleteSnippet);

module.exports = router;