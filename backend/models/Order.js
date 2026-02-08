const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store ID is required']
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  payments: [{
    cashRegisterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CashRegister',
      required: true
    },
    cashRegisterName: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    }
  }],
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
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    unitPrice: {
      type: Number,
      required: true
    },
    subTotal: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  },
  orderType: {
    type: String,
    enum: ['VENTE_DIRECTE', 'RESERVATION', 'COMMANDE_LIGNE'],
    required: [true, 'Order type is required']
  },
  status: {
    type: String,
    enum: ['en_attente', 'paye', 'annule', 'pret_pour_retrait', 'retire'],
    default: 'en_attente'
  },
  paymentMethod: {
    type: String,
    enum: ['Espèces', 'MVola', 'Orange Money', 'Carte Bancaire', 'Airtel Money', 'non_paye']
  },
  receiptNumber: {
    type: String,
    unique: true,
    required: [true, 'Receipt number is required']
  },
  qrCode: {
    type: String
  },
  reservationExpiry: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ receiptNumber: 1 }, { unique: true });
orderSchema.index({ storeId: 1 });
orderSchema.index({ buyerId: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderType: 1 });

// Pre-save middleware to generate receipt number
orderSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const date = new Date();
    const prefix = 'REC';
    const timestamp = date.getFullYear() + 
                     String(date.getMonth() + 1).padStart(2, '0') + 
                     String(date.getDate()).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.receiptNumber = `${prefix}-${timestamp}-${random}`;
  }
  
  // Set reservation expiry (24 hours from now)
  if (this.orderType === 'RESERVATION' && !this.reservationExpiry) {
    this.reservationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  
  next();
});

module.exports = mongoose.model('Order', orderSchema);
