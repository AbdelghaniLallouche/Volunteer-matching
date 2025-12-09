const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

// @desc    Get volunteer profile
// @route   GET /api/volunteers/profile
// @access  Private (Volunteer only)
exports.getProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user.id })
      .populate('userId', 'profilePhoto email')
      .populate('history', 'title startDate endDate associationId')
      .populate('appliedMissions.missionId', 'title startDate endDate');

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        ...volunteer.toObject(),
        profilePhoto: volunteer.userId?.profilePhoto || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update volunteer profile
// @route   PUT /api/volunteers/profile
// @access  Private (Volunteer only)
exports.updateProfile = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }

    res.status(200).json({
      success: true,
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get volunteer history
// @route   GET /api/volunteers/history
// @access  Private (Volunteer only)
exports.getHistory = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user.id })
      .populate({
        path: 'history',
        populate: { 
          path: 'associationId', 
          select: 'name userId',
          populate: { path: 'userId', select: 'profilePhoto' }
        }
      });

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }

    // Filter to only show missions that have ended (endDate < today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const completedMissions = volunteer.history.filter(mission => {
      return mission && new Date(mission.endDate) < today;
    });

    res.status(200).json({
      success: true,
      data: completedMissions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get volunteer applications
// @route   GET /api/volunteers/applications
// @access  Private (Volunteer only)
exports.getApplications = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user.id })
      .populate({
        path: 'appliedMissions.missionId',
        populate: { 
          path: 'associationId', 
          select: 'name userId',
          populate: { path: 'userId', select: 'profilePhoto' }
        }
      });

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }

    // Filter to only show missions that haven't ended yet and are pending or accepted
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const activeApplications = volunteer.appliedMissions.filter(app => {
      return app.missionId && 
             new Date(app.missionId.endDate) >= today &&
             (app.status === 'pending' || app.status === 'accepted');
    });

    res.status(200).json({
      success: true,
      data: activeApplications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
