const express = require('express');
const router = express.Router();
const { sendOTP, verifyOTP, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Send OTP
router.post('/send-otp', sendOTP);

// Verify OTP and login/register
router.post('/verify-otp', verifyOTP);

// Get user profile
router.get('/profile', protect, getUserProfile);

module.exports = router;