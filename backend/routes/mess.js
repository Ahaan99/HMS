const express = require('express');
const router = express.Router();
const MessMenu = require('../models/MessMenu');
const { protect, restrictTo } = require('../middleware/auth');

// Get today's menu
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const menu = await MessMenu.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });
    
    res.json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add/Update menu (admin only)
router.post('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { breakfast, lunch, dinner } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const menu = await MessMenu.findOneAndUpdate(
      { date: today },
      { 
        breakfast, 
        lunch, 
        dinner,
        createdBy: req.user._id 
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
