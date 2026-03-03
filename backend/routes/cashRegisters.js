const express = require('express');
const router = express.Router();
const CashRegister = require('../models/CashRegister');

// @route   GET /api/cash-registers
// @desc    Get all cash registers for a store
// @access  Private (Boutique)
router.get('/', async (req, res) => {
  try {
    const { storeId, status } = req.query;

    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required'
      });
    }

    const query = { storeId };
    if (status) {
      query.status = status;
    }

    const registers = await CashRegister.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registers.length,
      data: registers
    });
  } catch (error) {
    console.error('Get cash registers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/cash-registers/:id
// @desc    Get cash register by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const register = await CashRegister.findById(req.params.id);

    if (!register) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cash register not found' 
      });
    }

    res.json({
      success: true,
      data: register
    });
  } catch (error) {
    console.error('Get cash register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/cash-registers
// @desc    Create new cash register
// @access  Private (Boutique)
router.post('/', async (req, res) => {
  try {
    const { storeId, registerName, openingAmount = 0 } = req.body;

    const register = new CashRegister({
      storeId,
      registerName,
      status: 'ferme',
      currentBalance: 0
    });

    await register.save();

    // If opening amount is provided, open the register immediately
    if (openingAmount > 0) {
      await register.open(null, openingAmount);
    }

    res.status(201).json({
      success: true,
      message: openingAmount > 0 ? 'Cash register created and opened successfully' : 'Cash register created successfully',
      data: register
    });
  } catch (error) {
    console.error('Create cash register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/cash-registers/:id/open
// @desc    Open cash register
// @access  Private (Boutique)
router.post('/:id/open', async (req, res) => {
  try {
    const { userId, initialBalance = 0 } = req.body;
    
    const register = await CashRegister.findById(req.params.id);
    if (!register) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cash register not found' 
      });
    }

    if (register.status === 'ouvert') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cash register is already open' 
      });
    }

    await register.open(userId, initialBalance);

    res.json({
      success: true,
      message: 'Cash register opened successfully',
      data: register
    });
  } catch (error) {
    console.error('Open cash register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/cash-registers/:id/close
// @desc    Close cash register and generate report
// @access  Private (Boutique)
router.post('/:id/close', async (req, res) => {
  try {
    const register = await CashRegister.findById(req.params.id);
    if (!register) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cash register not found' 
      });
    }

    if (register.status === 'ferme') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cash register is already closed' 
      });
    }

    await register.close();

    res.json({
      success: true,
      message: 'Cash register closed successfully',
      data: {
        register,
        dailyReport: register.dailyReport
      }
    });
  } catch (error) {
    console.error('Close cash register error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/cash-registers/:id/report
// @desc    Get daily report for cash register
// @access  Private (Boutique)
router.get('/:id/report', async (req, res) => {
  try {
    const register = await CashRegister.findById(req.params.id);
    if (!register) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cash register not found' 
      });
    }

    res.json({
      success: true,
      data: {
        registerName: register.registerName,
        status: register.status,
        openedAt: register.openedAt,
        closedAt: register.closedAt,
        currentBalance: register.currentBalance,
        dailyReport: register.dailyReport
      }
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
