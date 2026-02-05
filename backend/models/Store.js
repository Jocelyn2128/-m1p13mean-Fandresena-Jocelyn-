const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner ID is required']
  },
  name: {
    type: String,
    required: [true, 'Store name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String
  },
  coverImage: {
    type: String
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  location: {
    floor: {
      type: String,
      required: [true, 'Floor is required']
    },
    shopNumber: {
      type: String,
      required: [true, 'Shop number is required']
    }
  },
  acceptedPaymentMethods: [{
    type: String,
    enum: ['Espèces', 'MVola', 'Orange Money', 'Carte Bancaire', 'Airtel Money']
  }],
  openingHours: {
    type: String,
    required: [true, 'Opening hours are required']
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'pending_approval'],
    default: 'pending_approval'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  metrics: {
    totalSales: {
      type: Number,
      default: 0
    },
    totalVisits: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Text index for search
storeSchema.index({ name: 'text', category: 'text', description: 'text' });
storeSchema.index({ ownerId: 1 });
storeSchema.index({ status: 1 });

module.exports = mongoose.model('Store', storeSchema);
