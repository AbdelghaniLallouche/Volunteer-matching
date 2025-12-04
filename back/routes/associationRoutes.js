const express = require('express');
const router = express.Router();
const {
  getAssociations,
  getAssociation,
  getProfile,
  updateProfile,
  getDashboard
} = require('../controllers/associationController');
const { protect, authorize } = require('../middlewares/auth');

router.get('/search', getAssociations);
router.get('/:id', getAssociation);

// Protected routes
router.get('/profile/me', protect, authorize('association'), getProfile);
router.put('/profile/me', protect, authorize('association'), updateProfile);
router.get('/dashboard/stats', protect, authorize('association'), getDashboard);

module.exports = router;
