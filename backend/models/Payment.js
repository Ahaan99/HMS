const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  paidDate: Date,
  dueDate: Date,
  transactionId: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
