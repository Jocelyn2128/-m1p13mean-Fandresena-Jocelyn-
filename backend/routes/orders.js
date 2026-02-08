const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const CashRegister = require('../models/CashRegister');

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { 
      storeId, 
      buyerId, 
      status, 
      orderType,
      page = 1, 
      limit = 20 
    } = req.query;

    const filter = {};
    
    if (storeId) filter.storeId = storeId;
    if (buyerId) filter.buyerId = buyerId;
    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;

    const orders = await Order.find(filter)
      .populate('storeId', 'name')
      .populate('buyerId', 'firstName lastName phone')
      .populate('items.productId', 'images')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Order.countDocuments(filter);

    res.json({
      success: true,
      count: orders.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('storeId', 'name location')
      .populate('buyerId', 'firstName lastName phone email')
      .populate('cashRegisterId', 'registerName')
      .populate('items.productId');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order (Sale, Reservation, or Online Order)
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { 
      storeId, 
      buyerId, 
      cashRegisterId, 
      items, 
      orderType, 
      paymentMethod,
      notes 
    } = req.body;

    // Validate items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product not found: ${item.productId}` 
        });
      }

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for product: ${product.name}` 
        });
      }

      const unitPrice = product.getCurrentPrice();
      const subTotal = unitPrice * item.quantity;
      totalAmount += subTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        unitPrice,
        subTotal
      });

      // Decrease stock for direct sales
      if (orderType === 'VENTE_DIRECTE') {
        product.stockQuantity -= item.quantity;
        await product.save();
      }
    }

    // Generate receipt number
    const date = new Date();
    const prefix = 'REC';
    const timestamp = date.getFullYear() + 
                     String(date.getMonth() + 1).padStart(2, '0') + 
                     String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    const receiptNumber = `${prefix}-${timestamp}-${random}`;

    // Create order
    const order = new Order({
      storeId,
      buyerId: buyerId || null,
      cashRegisterId,
      items: orderItems,
      totalAmount,
      orderType: orderType || 'VENTE_DIRECTE',
      paymentMethod: paymentMethod || 'non_paye',
      status: (orderType || 'VENTE_DIRECTE') === 'VENTE_DIRECTE' && paymentMethod ? 'paye' : 'en_attente',
      receiptNumber,
      notes
    });

    await order.save();

    // Update cash register for direct sales
    if (orderType === 'VENTE_DIRECTE' && cashRegisterId && paymentMethod) {
      const cashRegister = await CashRegister.findById(cashRegisterId);
      if (cashRegister) {
        await cashRegister.addSale(totalAmount, paymentMethod);
      }
    }

    // TODO: Generate QR Code for receipt

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/orders/receipt/:receiptNumber
// @desc    Get order by receipt number
// @access  Public
router.get('/receipt/:receiptNumber', async (req, res) => {
  try {
    const order = await Order.findOne({ receiptNumber: req.params.receiptNumber })
      .populate('storeId', 'name location')
      .populate('items.productId', 'images');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Receipt not found' 
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get receipt error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
