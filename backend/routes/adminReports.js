const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const Product = require('../models/Product');

// Middleware to verify JWT (copied style from other routes)
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

// Helper: ensure admin
const ensureAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN_MALL') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// @route GET /api/admin/reports
// @desc  List reports (product reports by default)
// @access Private (Admin)
router.get('/', authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const { status, productId, storeId, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (productId) filter.productId = productId;
    if (storeId) filter.storeId = storeId;
    if (search) filter.$text = { $search: search };

    const reports = await Report.find(filter)
      .populate('reporterId', 'firstName lastName email')
      .populate('productId', 'name images storeId')
      .populate('storeId', 'name')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const count = await Report.countDocuments(filter);

    res.json({ success: true, data: reports, total: count, currentPage: parseInt(page) });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route PUT /api/admin/reports/:id
// @desc  Update report (status, assign admin, add note)
// @access Private (Admin)
router.put('/:id', authMiddleware, ensureAdmin, async (req, res) => {
  try {
    const { status, handledBy } = req.body;

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    if (status) report.status = status;
    if (handledBy) report.handledBy = handledBy;
    else report.handledBy = req.user.userId;

    await report.save();

    res.json({ success: true, message: 'Report updated', data: report });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Export
module.exports = router;
