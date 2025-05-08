const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// Get all rooms
router.get('/', protect, async (req, res) => {
  try {
    const rooms = await Room.find().populate('occupiedBy', 'name email');
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Book a room
router.post('/book/:roomId', protect, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Create booking
    const booking = await Booking.create({
      roomId: room._id,
      userId: req.user._id,
      bookingDetails: req.body
    });

    // Create notification
    await Notification.create({
      userId: req.user._id,
      title: 'Room Booking Request',
      message: `Your booking request for room ${room.roomNumber} has been submitted.`,
      type: 'info'
    });

    res.json({ 
      success: true, 
      message: 'Booking request submitted successfully',
      booking 
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
