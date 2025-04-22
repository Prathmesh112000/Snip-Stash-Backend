const Blog = require('../models/Blog');
const asyncHandler = require('express-async-handler');

// @desc    Create a new blog
// @route   POST /api/blogs
// @access  Private
const createBlog = asyncHandler(async (req, res) => {
  const { title, url, description, category, tags, notes } = req.body;

  const blog = await Blog.create({
    title,
    url,
    description,
    category,
    tags,
    notes,
    user: req.user._id,
  });

  res.status(201).json(blog);
});

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Private
const getAllBlogs = asyncHandler(async (req, res) => {
  const { category, isRead, search } = req.query;
  const filter = { user: req.user._id };

  if (category) {
    filter.category = category;
  }

  if (isRead !== undefined) {
    filter.isRead = isRead === 'true';
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
  }

  const blogs = await Blog.find(filter).sort('-createdAt');
  res.json(blogs);
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Private
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(blog);
});

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
const updateBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.json(updatedBlog);
});

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await blog.remove();
  res.json({ message: 'Blog removed' });
});

// @desc    Toggle read status
// @route   PUT /api/blogs/:id/toggle-read
// @access  Private
const toggleReadStatus = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }

  if (blog.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  blog.isRead = !blog.isRead;
  await blog.save();

  res.json(blog);
});

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  toggleReadStatus,
}; 