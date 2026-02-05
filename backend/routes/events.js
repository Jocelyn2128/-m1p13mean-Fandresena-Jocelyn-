const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// @route   GET /api/events
// @desc    Get all active events
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { active = 'true' } = req.query;
    
    let filter = {};
    if (active === 'true') {
      const now = new Date();
      filter = {
        isActive: true,
        startDate: { $lte: now },
        endDate: { $gte: now }
      };
    }

    const events = await Event.find(filter)
      .sort({ priority: -1, startDate: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin)
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin)
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
