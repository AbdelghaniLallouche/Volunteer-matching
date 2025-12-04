const express = require('express');
const router = express.Router();
const {
  createMission,
  getMissions,
  getRecommendedMissions,
  getMission,
  updateMission,
  deleteMission,
  applyToMission,
  withdrawApplication,
  handleApplication,
  getMissionsByAssociation,
  closeMission
} = require('../controllers/missionController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../config/multer');

router.get('/', getMissions);
router.get('/recommended', protect, authorize('volunteer'), getRecommendedMissions);
router.get('/association/:id', getMissionsByAssociation);
router.get('/:id', getMission);
router.post('/', protect, authorize('association'), upload.array('images', 6), createMission);
router.put('/:id', protect, authorize('association'), updateMission);
router.delete('/:id', protect, authorize('association'), deleteMission);
router.post('/:id/apply', protect, authorize('volunteer'), applyToMission);
router.delete('/:id/withdraw', protect, authorize('volunteer'), withdrawApplication);
router.put('/:id/applicants/:volunteerId', protect, authorize('association'), handleApplication);
router.put('/:id/close', protect, authorize('association'), closeMission);

module.exports = router;
