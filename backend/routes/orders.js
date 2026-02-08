const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const CashRegister = require('../models/CashRegister');
const CreditNote = require('../models/CreditNote');

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
      payments,
      items, 
      orderType,
      notes 
    } = req.body;

    // Validate payments array
    if (!payments || !Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one payment is required'
      });
    }

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

    // Calculate total payments
    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    // Determine status based on payment
    let orderStatus = 'paye';
    if (totalPayments === 0) {
      orderStatus = 'en_attente';
    } else if (totalPayments < totalAmount) {
      orderStatus = 'acompte';
    }

    // Get cash register names and validate
    const paymentDetails = [];
    for (const payment of payments) {
      const cashRegister = await CashRegister.findById(payment.cashierId);
      if (!cashRegister) {
        return res.status(404).json({
          success: false,
          message: `Cash register not found: ${payment.cashierId}`
        });
      }
      
      paymentDetails.push({
        cashRegisterId: payment.cashierId,
        cashRegisterName: cashRegister.registerName,
        amount: payment.amount
      });
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
      payments: paymentDetails,
      items: orderItems,
      totalAmount,
      paidAmount: totalPayments,
      orderType: orderType || 'VENTE_DIRECTE',
      status: orderStatus,
      receiptNumber,
      notes
    });

    await order.save();

    // Update all cash registers for direct sales
    if (orderType === 'VENTE_DIRECTE' || !orderType) {
      for (const payment of paymentDetails) {
        const cashRegister = await CashRegister.findById(payment.cashRegisterId);
        if (cashRegister) {
          await cashRegister.addSale(payment.amount, 'Espèces');
        }
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

// @route   POST /api/orders/:id/pay
// @desc    Pay remaining amount for an order (acompte -> paye)
// @access  Private
router.post('/:id/pay', async (req, res) => {
  try {
    const { payments } = req.body;
    
    if (!payments || !Array.isArray(payments) || payments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Payments array is required'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (order.status !== 'acompte' && order.status !== 'en_attente') {
      return res.status(400).json({
        success: false,
        message: 'Order is not in a payable state'
      });
    }

    const remainingAmount = order.totalAmount - order.paidAmount;
    const totalPayments = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    if (totalPayments > remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment exceeds remaining amount. Remaining: ${remainingAmount}, Received: ${totalPayments}`
      });
    }

    // Get cash register details and validate
    const paymentDetails = [];
    for (const payment of payments) {
      const cashRegister = await CashRegister.findById(payment.cashierId);
      if (!cashRegister) {
        return res.status(404).json({
          success: false,
          message: `Cash register not found: ${payment.cashierId}`
        });
      }
      
      paymentDetails.push({
        cashRegisterId: payment.cashierId,
        cashRegisterName: cashRegister.registerName,
        amount: payment.amount
      });

      // Update cash register
      await cashRegister.addSale(payment.amount, 'Espèces');
    }

    // Update order
    order.payments.push(...paymentDetails);
    order.paidAmount += totalPayments;
    
    // Update status if fully paid
    if (order.paidAmount >= order.totalAmount) {
      order.status = 'paye';
    }

    await order.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      data: order
    });
  } catch (error) {
    console.error('Pay order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/orders/:id/cancel
// @desc    Cancel order and create credit note
// @access  Private
router.post('/:id/cancel', async (req, res) => {
  try {
    const { reason, returnToStock, decaisser } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (order.status === 'annule' || order.status === 'avoir') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled or has credit note'
      });
    }

    // Return products to stock if requested
    if (returnToStock) {
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stockQuantity += item.quantity;
          await product.save();
        }
      }
    }

    // Decaisser (remove from cash registers) if requested and order was paid
    if (decaisser && order.paidAmount > 0) {
      for (const payment of order.payments) {
        const cashRegister = await CashRegister.findById(payment.cashRegisterId);
        if (cashRegister) {
          cashRegister.currentBalance -= payment.amount;
          cashRegister.totalSales -= payment.amount;
          await cashRegister.save();
        }
      }
    }

    // Create credit note for paid amount
    let creditNote = null;
    if (order.paidAmount > 0) {
      creditNote = new CreditNote({
        storeId: order.storeId,
        orderId: order._id,
        originalAmount: order.paidAmount,
        remainingAmount: order.paidAmount,
        items: order.items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        reason: 'annulation',
        status: 'actif'
      });
      await creditNote.save();
      order.creditNoteId = creditNote._id;
    }

    order.status = 'annule';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order,
        creditNote
      }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/orders/:id/partial-credit
// @desc    Create partial credit note for specific items
// @access  Private
router.post('/:id/partial-credit', async (req, res) => {
  try {
    const { items, returnToStock } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    if (order.status !== 'paye') {
      return res.status(400).json({
        success: false,
        message: 'Only paid orders can have partial credit'
      });
    }

    // Validate items and calculate credit amount
    let creditAmount = 0;
    const creditItems = [];

    for (const creditItem of items) {
      const orderItem = order.items.find(i => 
        i.productId.toString() === creditItem.productId
      );
      
      if (!orderItem) {
        return res.status(404).json({
          success: false,
          message: `Product not found in order: ${creditItem.productId}`
        });
      }

      if (creditItem.quantity > orderItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot credit more than purchased quantity for ${orderItem.name}`
        });
      }

      const itemCredit = orderItem.unitPrice * creditItem.quantity;
      creditAmount += itemCredit;

      creditItems.push({
        productId: orderItem.productId,
        name: orderItem.name,
        quantity: creditItem.quantity,
        unitPrice: orderItem.unitPrice
      });

      // Return to stock if requested
      if (returnToStock) {
        const product = await Product.findById(orderItem.productId);
        if (product) {
          product.stockQuantity += creditItem.quantity;
          await product.save();
        }
      }
    }

    // Create credit note
    const creditNote = new CreditNote({
      storeId: order.storeId,
      orderId: order._id,
      originalAmount: creditAmount,
      remainingAmount: creditAmount,
      items: creditItems,
      reason: 'avoir_partiel',
      status: 'actif'
    });
    await creditNote.save();

    // Update order status
    order.status = 'avoir';
    order.creditNoteId = creditNote._id;
    await order.save();

    res.json({
      success: true,
      message: 'Partial credit created successfully',
      data: {
        order,
        creditNote
      }
    });
  } catch (error) {
    console.error('Partial credit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/orders/:id/pay-with-credit
// @desc    Pay order using credit notes
// @access  Private
router.post('/:id/pay-with-credit', async (req, res) => {
  try {
    const { creditNotes } = req.body;

    if (!creditNotes || !Array.isArray(creditNotes) || creditNotes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Credit notes array is required'
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    const remainingAmount = order.totalAmount - order.paidAmount;
    let totalCreditUsed = 0;

    for (const creditNoteData of creditNotes) {
      const creditNote = await CreditNote.findById(creditNoteData.creditNoteId);
      
      if (!creditNote) {
        return res.status(404).json({
          success: false,
          message: `Credit note not found: ${creditNoteData.creditNoteId}`
        });
      }

      if (creditNote.status !== 'actif') {
        return res.status(400).json({
          success: false,
          message: `Credit note is not active: ${creditNote.receiptNumber}`
        });
      }

      const useAmount = Math.min(creditNote.remainingAmount, remainingAmount - totalCreditUsed);
      
      if (useAmount > 0) {
        creditNote.remainingAmount -= useAmount;
        creditNote.usedAmount += useAmount;
        creditNote.usedInOrders.push({
          orderId: order._id,
          amount: useAmount
        });

        if (creditNote.remainingAmount <= 0) {
          creditNote.status = 'utilise';
        }

        await creditNote.save();
        totalCreditUsed += useAmount;
      }
    }

    // Update order
    order.paidAmount += totalCreditUsed;
    
    if (order.paidAmount >= order.totalAmount) {
      order.status = 'paye';
    } else if (order.paidAmount > 0) {
      order.status = 'acompte';
    }

    await order.save();

    res.json({
      success: true,
      message: `Payment of ${totalCreditUsed} processed using credit notes`,
      data: order
    });
  } catch (error) {
    console.error('Pay with credit error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
