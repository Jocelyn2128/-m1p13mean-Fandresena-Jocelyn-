const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const PasswordResetRequest = require('../models/PasswordResetRequest');

// Middleware to verify JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token, authorization denied' 
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// @route   POST /api/auth/forgot-password
// @desc    Request password reset (user enters new password directly)
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { email, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Aucun compte trouvé avec cet email' 
      });
    }

    // Check if there's already a pending request
    const existingRequest = await PasswordResetRequest.findOne({
      userId: user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ 
        success: false, 
        message: 'Une demande de changement de mot de passe est déjà en attente de validation' 
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Create password reset request
    const resetRequest = new PasswordResetRequest({
      userId: user._id,
      email: user.email,
      newPasswordHash: hashedPassword
    });

    await resetRequest.save();

    res.json({
      success: true,
      message: 'Demande de changement de mot de passe soumise. En attente de validation par un administrateur.'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/auth/password-reset-requests
// @desc    Get all pending password reset requests
// @access  Private (Admin)
router.get('/password-reset-requests', authMiddleware, async (req, res) => {
  try {
    const requests = await PasswordResetRequest.find({ status: 'pending' })
      .populate('userId', 'firstName lastName email phone')
      .sort({ requestedAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get password reset requests error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/auth/password-reset-requests/:id/approve
// @desc    Approve password reset request and change password
// @access  Private (Admin)
router.put('/password-reset-requests/:id/approve', authMiddleware, async (req, res) => {
  try {
    const request = await PasswordResetRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Demande non trouvée' 
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cette demande a déjà été traitée' 
      });
    }

    // Update user's password
    const user = await User.findById(request.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    user.password = request.newPasswordHash;
    await user.save();

    // Update request status
    request.status = 'approved';
    request.processedAt = new Date();
    request.processedBy = req.user.userId;
    await request.save();

    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    console.error('Approve password reset error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/auth/password-reset-requests/:id/reject
// @desc    Reject password reset request
// @access  Private (Admin)
router.put('/password-reset-requests/:id/reject', authMiddleware, async (req, res) => {
  try {
    const request = await PasswordResetRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ 
        success: false, 
        message: 'Demande non trouvée' 
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cette demande a déjà été traitée' 
      });
    }

    // Update request status
    request.status = 'rejected';
    request.processedAt = new Date();
    request.processedBy = req.user.userId;
    await request.save();

    res.json({
      success: true,
      message: 'Demande rejetée'
    });
  } catch (error) {
    console.error('Reject password reset error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
