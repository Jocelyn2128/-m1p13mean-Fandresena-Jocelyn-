const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const mongoose = require('mongoose');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

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

// @route   GET /api/stores/my/stores
// @desc    Get stores owned by the authenticated user (all statuses)
// @access  Private (Boutique)
router.get('/my/stores', authMiddleware, async (req, res) => {
  try {
    const stores = await Store.find({ ownerId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    console.error('Get my stores error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/stores/pending/all
// @desc    Get all pending stores
// @access  Private (Admin)
router.get('/pending/all', async (req, res) => {
  try {
    const stores = await Store.find({ status: 'pending_approval', isApproved: false })
      .populate('ownerId', 'firstName lastName email phone createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    console.error('Get pending stores error:', error);
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
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid store ID'
      });
    }

    const store = await Store.findById(id)
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
router.post('/', authMiddleware, async (req, res) => {
  try {
    const store = new Store({
      ...req.body,
      ownerId: req.user.userId, // Get ownerId from authenticated user
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

// @route   PUT /api/stores/:id/approve
// @desc    Approve a store and activate owner account
// @access  Private (Admin)
router.put('/:id/approve', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Update store status
    store.status = 'active';
    store.isApproved = true;
    await store.save();

    // Activate owner account
    const User = require('../models/User');
    await User.findByIdAndUpdate(store.ownerId, { isActive: true });

    res.json({
      success: true,
      message: 'Store approved successfully',
      data: store
    });
  } catch (error) {
    console.error('Approve store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/stores/:id/reject
// @desc    Reject a store
// @access  Private (Admin)
router.put('/:id/reject', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Update store status to suspended (rejected)
    store.status = 'suspended';
    store.isApproved = false;
    await store.save();

    res.json({
      success: true,
      message: 'Store rejected successfully',
      data: store
    });
  } catch (error) {
    console.error('Reject store error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/stores/:id
// @desc    Update store details
// @access  Private (Boutique owner or Admin)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid store ID' });
    }

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found' });
    }

    // Seul le propriétaire ou un admin peut modifier
    if (req.user.role !== 'ADMIN_MALL' && store.ownerId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    // Ne pas permettre de changer ownerId, status ou isApproved via cette route
    const { ownerId, status, isApproved, ...updateData } = req.body;

    const updatedStore = await Store.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: false }
    );

    res.json({
      success: true,
      message: 'Boutique mise à jour avec succès',
      data: updatedStore
    });
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
