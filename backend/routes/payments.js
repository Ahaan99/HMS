const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

// Get payment summary
router.get('/summary', protect, async (req, res) => {
  try {
    const totalPaid = await Payment.getTotalPaid(req.user._id);
    const currentSemester = await Payment.findOne({
      userId: req.user._id,
      status: 'Pending',
      dueDate: { $gte: new Date() }
    }).sort('dueDate');
    
    const recentPayments = await Payment.find({
      userId: req.user._id,
      status: 'Paid'
    })
    .sort('-paidDate')
    .limit(5);

    res.json({
      success: true,
      summary: {
        totalPaid,
        currentDue: currentSemester?.amount || 0,
        recentPayments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user payments
router.get('/', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user._id })
      .sort('-createdAt');
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark payment as paid (mock payment)
router.post('/:id/pay', protect, async (req, res) => {
  try {
    const payment = await Payment.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        status: 'Paid',
        paidDate: new Date(),
        transactionId: 'MOCK-' + Date.now()
      },
      { new: true }
    );

    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
