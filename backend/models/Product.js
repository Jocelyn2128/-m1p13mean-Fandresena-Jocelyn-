const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Store ID is required']
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'MGA'
  },
  images: [{
    type: String
  }],
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  stockStatus: {
    type: String,
    enum: ['disponible', 'rupture', 'precommande'],
    default: 'disponible'
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  promotion: {
    isOnSale: {
      type: Boolean,
      default: false
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative']
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ storeId: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ 'promotion.isOnSale': 1 });

// Pre-save middleware to update stock status
productSchema.pre('save', function(next) {
  if (this.stockQuantity === 0) {
    this.stockStatus = 'rupture';
  } else if (this.stockQuantity > 0) {
    this.stockStatus = 'disponible';
  }
  
  // Check if promotion has expired
  if (this.promotion.isOnSale && this.promotion.endDate && new Date() > this.promotion.endDate) {
    this.promotion.isOnSale = false;
  }
  
  next();
});

// Method to check if stock is low
productSchema.methods.isLowStock = function() {
  return this.stockQuantity <= this.lowStockThreshold && this.stockQuantity > 0;
};

// Method to get current price
productSchema.methods.getCurrentPrice = function() {
  if (this.promotion.isOnSale && this.promotion.discountPrice) {
    return this.promotion.discountPrice;
  }
  return this.price;
};

module.exports = mongoose.model('Product', productSchema);
