const express = require('express');
const router = express.Router();
const CreditNote = require('../models/CreditNote');

// @route   GET /api/credit-notes
// @desc    Get available (active) credit notes for a store
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { storeId } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required'
      });
    }

    const creditNotes = await CreditNote.find({
      storeId,
      status: 'actif',
      remainingAmount: { $gt: 0 }
    })
    .populate('orderId', 'receiptNumber')
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
