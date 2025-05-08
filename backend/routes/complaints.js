const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');

router.post('/', protect, async (req, res) => {
  try {
    const complaint = await Complaint.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .sort('-createdAt');
    res.json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
