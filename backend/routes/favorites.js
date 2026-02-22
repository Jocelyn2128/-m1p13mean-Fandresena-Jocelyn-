const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const mongoose = require('mongoose');

// @route   GET /api/favorites
// @desc    Get user's favorites
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { userId, type } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    const filter = { userId };
    if (type) filter.type = type;

    const favorites = await Favorite.find(filter)
      .populate('targetId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: favorites.length,
      data: favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/favorites
// @desc    Add to favorites
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { userId, targetId, type } = req.body;

    if (!userId || !targetId || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'userId, targetId and type are required' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid target ID' 
      });
    }

    // Check if already favorited
    const existing = await Favorite.findOne({ userId, targetId, type });
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already in favorites' 
      });
    }

    const favorite = new Favorite({
      userId,
      targetId,
      type
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: 'Added to favorites',
      data: favorite
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/favorites
// @desc    Remove from favorites
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const { userId, targetId, type } = req.body;

    if (!userId || !targetId || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'userId, targetId and type are required' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid target ID' 
      });
    }

    const favorite = await Favorite.findOneAndDelete({ 
      userId, 
      targetId, 
      type 
    });

    if (!favorite) {
      return res.status(404).json({ 
        success: false, 
        message: 'Favorite not found' 
      });
    }

    res.json({
      success: true,
      message: 'Removed from favorites'
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/favorites/check
// @desc    Check if item is in favorites
// @access  Private
router.get('/check', async (req, res) => {
  try {
    const { userId, targetId, type } = req.query;

    if (!userId || !targetId || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'userId, targetId and type are required' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID' 
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid target ID' 
      });
    }

    const favorite = await Favorite.findOne({ userId, targetId, type });

    res.json({
      success: true,
      isFavorite: !!favorite
    });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
