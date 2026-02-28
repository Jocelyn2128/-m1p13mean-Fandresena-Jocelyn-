const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  reason: {
    type: String,
    required: [true, 'Reason is required']
  },
  details: {
    type: String
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved'],
    default: 'new'
  },
  handledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

reportSchema.index({ productId: 1 });
reportSchema.index({ storeId: 1 });
reportSchema.index({ status: 1 });

module.exports = mongoose.model('Report', reportSchema);
