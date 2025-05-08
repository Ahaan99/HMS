const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  bookingDetails: {
    name: String,
    age: Number,
    course: String,
    batch: String,
    year: String,
    seater: String,
    ac: String,
    gender: String,
    address: String,
    phoneNumber: String,
    rollNumber: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
