const express = require('express');
const router = express.Router();
const { getUpcomingReminders, getExpiredPolicies } = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/upcoming').get(protect, getUpcomingReminders);
router.route('/expired').get(protect, getExpiredPolicies);

module.exports = router;
