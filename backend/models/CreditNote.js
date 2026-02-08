const mongoose = require('mongoose');

const creditNoteSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store ID is required']
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order ID is required']
  },
  receiptNumber: {
    type: String,
    required: [true, 'Receipt number is required']
  },
  originalAmount: {
    type: Number,
    required: [true, 'Original amount is required']
  },
  remainingAmount: {
    type: Number,
    required: [true, 'Remaining amount is required']
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    }
  }],
  reason: {
    type: String,
    enum: ['annulation', 'avoir_partiel', 'retour'],
    required: true
  },
  status: {
    type: String,
    enum: ['actif', 'utilise', 'expire'],
    default: 'actif'
  },
  usedAmount: {
    type: Number,
    default: 0
  },
  usedInOrders: [{
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    amount: Number,
    usedAt: {
      type: Date,
      default: Date.now
    }
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
creditNoteSchema.index({ storeId: 1 });
creditNoteSchema.index({ orderId: 1 });
creditNoteSchema.index({ receiptNumber: 1 }, { unique: true });
creditNoteSchema.index({ status: 1 });
creditNoteSchema.index({ createdAt: -1 });

// Pre-save middleware to generate receipt number
creditNoteSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const date = new Date();
    const prefix = 'AV';
    const timestamp = date.getFullYear() + 
                     String(date.getMonth() + 1).padStart(2, '0') + 
                     String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.receiptNumber = `${prefix}-${timestamp}-${random}`;
  }
  next();
});

module.exports = mongoose.model('CreditNote', creditNoteSchema);
