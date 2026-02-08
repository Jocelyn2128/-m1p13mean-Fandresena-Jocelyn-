const mongoose = require('mongoose');

const passwordResetRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  newPasswordHash: {
    type: String,
    required: [true, 'New password hash is required']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

passwordResetRequestSchema.index({ userId: 1 });
passwordResetRequestSchema.index({ status: 1 });
passwordResetRequestSchema.index({ email: 1 });

module.exports = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);
