const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

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

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      storeId, 
      category, 
      search, 
      onSale, 
      inStock,
      page = 1, 
      limit = 20 
    } = req.query;

    const filter = { isActive: true };
    
    if (storeId) filter.storeId = storeId;
    if (category) filter.category = category;
    if (onSale === 'true') filter['promotion.isOnSale'] = true;
    if (inStock === 'true') filter.stockStatus = 'disponible';
    if (search) {
      filter.$text = { $search: search };
    }

    const products = await Product.find(filter)
      .populate('storeId', 'name location')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Product.countDocuments(filter);

    res.json({
      success: true,
      count: products.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('storeId', 'name location acceptedPaymentMethods');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private (Boutique)
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Get storeId from request body
    const { storeId } = req.body;
    
    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required'
      });
    }
    
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Boutique)
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (soft delete for boutiques, hard delete for admins)
// @access  Private (Boutique or Admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Admin — hard delete
    if (req.user && req.user.role === 'ADMIN_MALL') {
      const deleted = await Product.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: 'Product not found' });
      return res.json({ success: true, message: 'Product permanently deleted' });
    }

    // Non-admin — perform soft delete
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted (soft) successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});


// @route   PUT /api/products/:id/moderate
// @desc    Moderate product (admin actions: approve | block | delete)
// @access  Private (Admin)
router.put('/:id/moderate', authMiddleware, async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN_MALL') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { action, reason, notifyOwner } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (action === 'approve') {
      product.isActive = true;
      await product.save();
      return res.json({ success: true, message: 'Product marked as safe (approved)' });
    }

    if (action === 'block') {
      product.isActive = false;
      await product.save();
      return res.json({ success: true, message: 'Product blocked (soft-deleted)' });
    }

    if (action === 'delete') {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Product permanently deleted by admin' });
    }

    res.status(400).json({ success: false, message: 'Unknown action' });
  } catch (error) {
    console.error('Moderate product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
