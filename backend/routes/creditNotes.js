const express = require('express');
const router = express.Router();
const CreditNote = require('../models/CreditNote');

// @route   GET /api/credit-notes
// @desc    Get credit notes (by storeId or buyerId)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { storeId, buyerId, status } = req.query;

    const filter = {};
    if (storeId) filter.storeId = storeId;

    // For buyer wallet: find credit notes linked to buyer's orders
    if (buyerId && !storeId) {
      const Order = require('../models/Order');
      const buyerOrders = await Order.find({ buyerId }).select('_id');
      const orderIds = buyerOrders.map(o => o._id);
      filter.orderId = { $in: orderIds };
    }

    if (status) {
      filter.status = status;
    }

    const creditNotes = await CreditNote.find(filter)
      .populate('orderId', 'receiptNumber totalAmount')
      .populate('storeId', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: creditNotes.length,
      data: creditNotes
    });
  } catch (error) {
    console.error('Get credit notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/credit-notes/all
// @desc    Get all credit notes for a store (including used/expired)
// @access  Private
router.get('/all', async (req, res) => {
  try {
    const { storeId, status } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required'
      });
    }

    const filter = { storeId };
    if (status) filter.status = status;

    const creditNotes = await CreditNote.find(filter)
      .populate('orderId', 'receiptNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: creditNotes.length,
      data: creditNotes
    });
  } catch (error) {
    console.error('Get all credit notes error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/credit-notes/:id
// @desc    Get credit note by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const creditNote = await CreditNote.findById(req.params.id)
      .populate('storeId', 'name')
      .populate('orderId', 'receiptNumber totalAmount')
      .populate('usedInOrders.orderId', 'receiptNumber');

    if (!creditNote) {
      return res.status(404).json({
        success: false,
        message: 'Credit note not found'
      });
    }

    res.json({
      success: true,
      data: creditNote
    });
  } catch (error) {
    console.error('Get credit note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
