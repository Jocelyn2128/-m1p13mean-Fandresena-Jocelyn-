const express = require('express');
const router = express.Router();
const Store = require('../models/Store');

// @route   GET /api/stores
// @desc    Get all stores
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, floor, status, search } = req.query;
    const filter = { isApproved: true };
    
    if (category) filter.category = category;
    if (floor) filter['location.floor'] = floor;
    if (status) filter.status = status;
    if (search) {
      filter.$text = { $search: search };
    }

    const stores = await Store.find(filter)
      .populate('ownerId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/stores/:id
// @desc    Get store by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('ownerId', 'firstName lastName email phone');

    if (!store) {
      return res.status(404).json({ 
        success: false, 
        message: 'Store not found' 
      });
    }

    // Increment visit count
    store.metrics.totalVisits += 1;
    await store.save();

    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/stores
// @desc    Create new store
// @access  Private (Boutique)
router.post('/', async (req, res) => {
  try {
    const store = new Store({
      ...req.body,
      status: 'pending_approval',
      isApproved: false
    });

    await store.save();

    res.status(201).json({
      success: true,
      message: 'Store created successfully. Waiting for approval.',
      data: store
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
