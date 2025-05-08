const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const Payment = require('../models/Payment');

// Get all students
router.get('/students', protect, restrictTo('admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .populate('studentDetails.roomId')
      .select('-password');
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update student details
router.patch('/students/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        studentDetails: req.body.studentDetails
      },
      { new: true }
    ).populate('studentDetails.roomId');

    // Update room occupancy if room number changed
    if (req.body.studentDetails?.roomNumber) {
      const room = await Room.findOne({ roomNumber: req.body.studentDetails.roomNumber });
      if (room) {
        student.studentDetails.roomId = room._id;
        await student.save();
      }
    }

    res.json({ success: true, student });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all rooms
router.get('/rooms', protect, restrictTo('admin'), async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json({ success: true, rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new room
router.post('/rooms', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { roomNumber, floor, type, capacity, price } = req.body;

    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({ 
        success: false, 
        message: 'Room number already exists' 
      });
    }

    const room = await Room.create({
      roomNumber,
      floor,
      type,
      capacity,
      price,
      status: 'Available'
    });

    res.status(201).json({ success: true, room });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update room status
router.patch('/rooms/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get pending bookings
router.get('/bookings/pending', protect, restrictTo('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'pending' })
      .populate('userId')
      .populate('roomId');
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update booking status
router.patch('/bookings/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    booking.status = req.body.status;

    if (req.body.status === 'approved') {
      const room = await Room.findById(booking.roomId);
      if (!room) {
        throw new Error('Room not found');
      }
      room.status = 'Occupied';
      room.occupiedBy.push(booking.userId);
      await room.save();
    } else if (req.body.status === 'rejected') {
      const room = await Room.findById(booking.roomId);
      if (!room) {
        throw new Error('Room not found');
      }
      room.status = 'Available';
      await room.save();
    }

    await booking.save();

    // Create notification
    await Notification.create({
      userId: booking.userId,
      title: 'Room Request Update',
      message: `Your room request has been ${req.body.status}`,
      type: req.body.status === 'approved' ? 'success' : 'warning'
    });

    res.json({ 
      success: true, 
      message: `Booking ${req.body.status} successfully`,
      booking 
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Error updating booking status'
    });
  }
});

// Get all complaints
router.get('/complaints', protect, restrictTo('admin'), async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update complaint status and response
router.patch('/complaints/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { status, response } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, response },
      { new: true }
    ).populate('userId');
    
    // Create notification for student
    await Notification.create({
      userId: complaint.userId._id,
      title: 'Complaint Update',
      message: `Your complaint has been ${status.toLowerCase()}`,
      type: status === 'Resolved' ? 'success' : 'info'
    });

    res.json({ success: true, complaint });
  } catch (error) {
    console.error('Error updating complaint:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get admin stats
router.get('/stats', protect, restrictTo('admin'), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pendingRequests = await Booking.countDocuments({ status: 'pending' });
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });

    res.json({
      success: true,
      stats: {
        totalStudents,
        pendingRequests,
        occupiedRooms,
        availableRooms
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark attendance
router.post('/attendance', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { date, records } = req.body;
    const attendance = await Attendance.create({
      date,
      records,
      markedBy: req.user._id
    });
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get student payment status
router.get('/students/:id/payments', protect, restrictTo('admin'), async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.id })
      .sort('-createdAt');
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add payment stats endpoint
router.get('/payments/stats', protect, restrictTo('admin'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const stats = await Payment.aggregate([
      {
        $facet: {
          totalPayments: [
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ],
          pendingPayments: [
            { $match: { status: 'Pending' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ],
          monthlyRevenue: [
            { 
              $match: { 
                status: 'Paid',
                paidDate: { $gte: monthStart, $lte: today }
              }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalPayments: stats[0]?.totalPayments[0]?.total || 0,
        pendingPayments: stats[0]?.pendingPayments[0]?.total || 0,
        monthlyRevenue: stats[0]?.monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    console.error('Payment stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment stats' });
  }
});

module.exports = router;
