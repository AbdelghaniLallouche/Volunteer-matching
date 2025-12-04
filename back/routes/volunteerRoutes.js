const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getHistory,
  getApplications
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middlewares/auth');

router.use(protect);
router.use(authorize('volunteer'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/history', getHistory);
router.get('/applications', getApplications);

module.exports = router;
