const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  bannerImage: {
    type: String,
    required: [true, 'Banner image is required']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ isActive: 1 });

// Check if event is currently active
eventSchema.methods.isCurrentlyActive = function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
};

module.exports = mongoose.model('Event', eventSchema);
