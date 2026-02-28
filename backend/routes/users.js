const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const updates = {};
    const allowed = ['firstName', 'lastName', 'phone', 'email'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user.userId, { ...updates, updatedAt: Date.now() }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Profile updated', data: user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/users/profile/avatar
// @desc    Upload avatar for current user
// @access  Private
router.post('/profile/avatar', authMiddleware, async (req, res) => {
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, '..', 'uploads', 'avatars');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const name = `${req.user.userId}-${Date.now()}${ext}`;
      cb(null, name);
    }
  });

  const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  };

  const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter }).single('avatar');

  upload(req, res, async function (err) {
    if (err) {
      console.error('Avatar upload error:', err);
      return res.status(400).json({ success: false, message: err.message || 'Upload error' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      // Remove old avatar if exists
      if (user.avatar) {
        const oldPath = path.join(__dirname, '..', 'uploads', 'avatars', user.avatar);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) { console.warn('Failed to remove old avatar', e); }
        }
      }

      user.avatar = req.file.filename;
      await user.save();

      res.json({ success: true, message: 'Avatar uploaded', data: { avatar: user.avatar, url: `/uploads/avatars/${user.avatar}` } });
    } catch (error) {
      console.error('Save avatar error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
});

// @route   GET /api/users/search
// @desc    Search user by phone (for cashier)
// @access  Private (Boutique only)
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    const user = await User.findOne({ 
      phone: { $regex: phone, $options: 'i' },
      role: 'ACHETEUR'
    }).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Search user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/pending-accounts
// @desc    Get all pending boutique user accounts (isActive: false)
// @access  Private (Admin)
router.get('/pending-accounts', authMiddleware, async (req, res) => {
  try {
    // Find BOUTIQUE users with isActive: false (pending account approval)
    const pendingUsers = await User.find({ 
      role: 'BOUTIQUE', 
      isActive: false 
    }).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    console.error('Get pending accounts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/pending-boutiques
// @desc    Get all pending boutique users with store info
// @access  Private (Admin)
router.get('/pending-boutiques', authMiddleware, async (req, res) => {
  try {
    // Find users with BOUTIQUE role who have pending stores
    const Store = require('../models/Store');
    const pendingStores = await Store.find({ status: 'pending_approval' })
      .populate('ownerId', 'firstName lastName email phone createdAt');
    
    // Format response
    const pendingUsers = pendingStores.map(store => ({
      _id: store.ownerId._id,
      firstName: store.ownerId.firstName,
      lastName: store.ownerId.lastName,
      email: store.ownerId.email,
      phone: store.ownerId.phone,
      createdAt: store.ownerId.createdAt,
      storeInfo: {
        storeId: store._id,
        storeName: store.name,
        category: store.category,
        description: store.description,
        floor: store.location.floor,
        shopNumber: store.location.shopNumber
      }
    }));

    res.json({
      success: true,
      count: pendingUsers.length,
      data: pendingUsers
    });
  } catch (error) {
    console.error('Get pending boutique users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/:id/approve
// @desc    Approve a boutique user and their store
// @access  Private (Admin)
router.put('/:id/approve', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Activate user account
    user.isActive = true;
    await user.save();

    // Approve the associated store
    const Store = require('../models/Store');
    await Store.findOneAndUpdate(
      { ownerId: user._id },
      { status: 'active', isApproved: true }
    );

    res.json({
      success: true,
      message: 'User approved successfully',
      data: user
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/:id/reject
// @desc    Reject a boutique user
// @access  Private (Admin)
router.put('/:id/reject', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Deactivate user account
    user.isActive = false;
    await user.save();

    // Reject the associated store
    const Store = require('../models/Store');
    await Store.findOneAndUpdate(
      { ownerId: user._id },
      { status: 'suspended', isApproved: false }
    );

    res.json({
      success: true,
      message: 'User rejected successfully',
      data: user
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
