const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

// Apply protect middleware to all routes
router.use(protect);

// Blog routes
router.route('/')
  .get(blogController.getAllBlogs)
  .post(blogController.createBlog);

router.route('/:id')
  .get(blogController.getBlogById)
  .put(blogController.updateBlog)
  .delete(blogController.deleteBlog);

router.put('/:id/toggle-read', blogController.toggleReadStatus);

module.exports = router; 