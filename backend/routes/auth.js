const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Store = require('../models/Store');

// @route   POST /api/auth/register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('phone').trim().notEmpty(),
  body('role').isIn(['ADMIN_MALL', 'BOUTIQUE', 'ACHETEUR'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, role, store } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const isActive = role === 'BOUTIQUE' ? false : true;
    
    user = new User({ email, password: hashedPassword, firstName, lastName, phone, role, isActive });
    await user.save();

    // Si boutique, créer la boutique liée
    if (role === 'BOUTIQUE' && store) {
      const newStore = new Store({
        ownerId: user._id,
        name: store.name,
        description: store.description,
        category: store.category,
        location: store.location,
        openingHours: store.openingHours || '08:00 - 18:00',
        acceptedPaymentMethods: store.acceptedPaymentMethods || ['Espèces'],
        status: 'pending_approval'
      });
      await newStore.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 28800 }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role }
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isActive = user.isActive !== false;
    if (!isActive) {
      if (user.role === 'BOUTIQUE') {
        return res.status(403).json({ 
          success: false, 
          message: 'Votre compte est en attente de validation par un administrateur',
          isPending: true 
        });
      }
      return res.status(403).json({ success: false, message: "Votre compte a été désactivé. Contactez l'administrateur." });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 28800 }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, phone: user.phone }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;