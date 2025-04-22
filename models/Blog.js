const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  url: {
    type: String,
    required: [true, 'Please provide a URL'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ['article', 'tutorial', 'documentation', 'other'],
    default: 'article',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for faster searches
blogSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Blog', blogSchema); 