const mongoose = require('mongoose');

const cashRegisterSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store ID is required']
  },
  registerName: {
    type: String,
    required: [true, 'Register name is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['ouvert', 'ferme'],
    default: 'ferme'
  },
  currentBalance: {
    type: Number,
    default: 0,
    min: [0, 'Balance cannot be negative']
  },
  openedAt: {
    type: Date
  },
  closedAt: {
    type: Date
  },
  openedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dailyReport: {
    totalSales: {
      type: Number,
      default: 0
    },
    paymentMethods: {
      'Espèces': { type: Number, default: 0 },
      'MVola': { type: Number, default: 0 },
      'Orange Money': { type: Number, default: 0 },
      'Carte Bancaire': { type: Number, default: 0 },
      'Airtel Money': { type: Number, default: 0 }
    }
  }
}, {
  timestamps: true
});

cashRegisterSchema.index({ storeId: 1 });
cashRegisterSchema.index({ status: 1 });

// Method to open cash register
cashRegisterSchema.methods.open = function(userId, initialBalance = 0) {
  this.status = 'ouvert';
  this.openedAt = new Date();
  this.openedBy = userId;
  this.currentBalance = initialBalance;
  this.dailyReport.totalSales = 0;
  this.dailyReport.paymentMethods = {
    'Espèces': 0,
    'MVola': 0,
    'Orange Money': 0,
    'Carte Bancaire': 0,
    'Airtel Money': 0
  };
  return this.save();
};

// Method to close cash register and generate report
cashRegisterSchema.methods.close = function() {
  this.status = 'ferme';
  this.closedAt = new Date();
  return this.save();
};

// Method to add sale to register
cashRegisterSchema.methods.addSale = function(amount, paymentMethod) {
  this.currentBalance += amount;
  this.dailyReport.totalSales += amount;
  if (this.dailyReport.paymentMethods[paymentMethod] !== undefined) {
    this.dailyReport.paymentMethods[paymentMethod] += amount;
  }
  return this.save();
};

module.exports = mongoose.model('CashRegister', cashRegisterSchema);
