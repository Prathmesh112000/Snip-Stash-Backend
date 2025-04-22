const Snippet = require('../models/Snippet');
const { autoTagSnippet } = require('../utils/snippetTagger');

// @desc    Create a new snippet
// @route   POST /api/snippets
// @access  Private
const createSnippet = async (req, res) => {
  try {
    const { title, code, language, tags } = req.body;
    const snippet = await Snippet.create({
      user: req.user._id,
      title,
      code,
      language,
      tags: tags || [],
    });
    res.status(201).json(snippet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all snippets with optional filtering
// @route   GET /api/snippets
// @access  Private
const getAll = async (req, res) => {
  try {
    const { title, language, tags } = req.query;
    
    // Build filter object
    const filter = { user: req.user._id };
    
    // Title filter (case-insensitive search)
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    
    // Language filter
    if (language) {
      filter.language = language;
    }
    
    // Tags filter
    if (tags) {
      const tagArray = typeof tags === 'string' ? tags.split(',') : tags;
      filter.tags = { $all: tagArray };
    }
    
    // Get all unique languages for filter options
    const languages = await Snippet.distinct('language', { user: req.user._id });
    
    // Get filtered snippets
    const snippets = await Snippet.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({
      snippets,
      filters: {
        languages
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a single snippet
// @route   GET /api/snippets/:id
// @access  Private
const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    // Check if snippet exists
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Check if user owns the snippet
    if (snippet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(snippet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a snippet
// @route   PUT /api/snippets/:id
// @access  Private
const updateSnippet = async (req, res) => {
  try {
    const { title, code, language, tags } = req.body;

    const snippet = await Snippet.findById(req.params.id);

    // Check if snippet exists
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Check if user owns the snippet
    if (snippet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update snippet
    snippet.title = title || snippet.title;
    snippet.code = code || snippet.code;
    snippet.language = language || snippet.language;
    snippet.tags = tags || snippet.tags;
    snippet.updatedAt = Date.now();

    const updatedSnippet = await snippet.save();
    res.json(updatedSnippet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a snippet
// @route   DELETE /api/snippets/:id
// @access  Private
const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    // Check if snippet exists
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Check if user owns the snippet
    if (snippet.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Snippet.deleteOne({ _id: req.params.id });
    res.json({ message: 'Snippet removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search snippets
// @route   GET /api/snippets/search
// @access  Private
const searchSnippets = async (req, res) => {
  try {
    const { query, language, tag } = req.query;
    
    // Build search criteria
    const searchCriteria = { user: req.user._id };
    
    // Add text search if query provided
    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }
    
    // Filter by language if provided
    if (language) {
      searchCriteria.language = language;
    }
    
    // Filter by tag if provided
    if (tag) {
      searchCriteria.tags = tag;
    }
    
    const snippets = await Snippet.find(searchCriteria).sort({ updatedAt: -1 });
    res.json(snippets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSnippet,
  getAll,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  searchSnippets
};