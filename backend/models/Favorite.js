const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Target ID is required'],
    refPath: 'type'
  },
  type: {
    type: String,
    enum: ['Product', 'Store'],
    required: [true, 'Type is required']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicates
favoriteSchema.index({ userId: 1, targetId: 1, type: 1 }, { unique: true });
favoriteSchema.index({ userId: 1 });
favoriteSchema.index({ type: 1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
