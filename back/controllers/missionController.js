const Mission = require('../models/Mission');
const Association = require('../models/Association');
const Volunteer = require('../models/Volunteer');

// @desc    Create mission
// @route   POST /api/missions
// @access  Private (Association only)
exports.createMission = async (req, res) => {
  try {
    const association = await Association.findOne({ userId: req.user.id });
    
    if (!association) {
      return res.status(404).json({ success: false, message: 'Association profile not found' });
    }

    // Parse skills and interests if they are JSON strings
    let requiredSkills = [];
    let interests = [];

    try {
      if (req.body.requiredSkills) {
        requiredSkills = typeof req.body.requiredSkills === 'string' 
          ? JSON.parse(req.body.requiredSkills) 
          : req.body.requiredSkills;
      }
      if (req.body.interests) {
        interests = typeof req.body.interests === 'string' 
          ? JSON.parse(req.body.interests) 
          : req.body.interests;
      }
    } catch (parseError) {
      console.error('Error parsing skills/interests:', parseError);
    }

    const missionData = {
      title: req.body.title,
      description: req.body.description,
      wilaya: req.body.wilaya,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      maxVolunteers: req.body.maxVolunteers,
      associationId: association._id,
      requiredSkills: requiredSkills,
      interests: interests,
      images: req.files ? req.files.map(file => file.path) : []
    };

    console.log('Creating mission with data:', missionData);

    const mission = await Mission.create(missionData);

    res.status(201).json({
      success: true,
      data: mission
    });
  } catch (error) {
    console.error('Create mission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all missions with filters
// @route   GET /api/missions
// @access  Public
exports.getMissions = async (req, res) => {
  try {
    const { wilaya, date, search } = req.query;
    let query = { status: 'open' };

    // Filter by wilaya
    if (wilaya) {
      query.wilaya = wilaya;
    }

    // Filter by date - find missions where the date falls within mission's date range
    if (date) {
      const searchDate = new Date(date);
      query.startDate = { $lte: searchDate };
      query.endDate = { $gte: searchDate };
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const missions = await Mission.find(query)
      .populate({
        path: 'associationId',
        select: 'name userId',
        populate: { path: 'userId', select: 'profilePhoto' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recommended missions for volunteer
// @route   GET /api/missions/recommended
// @access  Private (Volunteer only)
exports.getRecommendedMissions = async (req, res) => {
  try {
    const volunteer = await Volunteer.findOne({ userId: req.user.id });
    
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer profile not found' });
    }

    const missions = await Mission.find({ status: 'open' })
      .populate({
        path: 'associationId',
        select: 'name userId',
        populate: { path: 'userId', select: 'profilePhoto' }
      });

    // Calculate recommendation score
    const scoredMissions = missions.map(mission => {
      let score = 0;
      
      // Match skills (higher weight)
      mission.requiredSkills.forEach(skill => {
        if (volunteer.skills.includes(skill)) score += 2;
      });

      // Match interests
      mission.interests.forEach(interest => {
        if (volunteer.interests.includes(interest)) score += 1;
      });

      // Match wilaya
      if (mission.wilaya === volunteer.wilaya) score += 1;

      return {
        ...mission.toObject(),
        recommendationScore: score
      };
    });

    // Sort by score
    scoredMissions.sort((a, b) => b.recommendationScore - a.recommendationScore);

    res.status(200).json({
      success: true,
      data: scoredMissions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single mission
// @route   GET /api/missions/:id
// @access  Public
exports.getMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id)
      .populate({
        path: 'associationId',
        select: 'name email phone wilaya address description website userId',
        populate: { path: 'userId', select: 'profilePhoto' }
      })
      .populate({
        path: 'applicants.volunteerId',
        select: 'firstName lastName phone bio wilaya skills interests userId',
        populate: { path: 'userId', select: 'email' }
      });

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update mission
// @route   PUT /api/missions/:id
// @access  Private (Association only)
exports.updateMission = async (req, res) => {
  try {
    let mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    const association = await Association.findOne({ userId: req.user.id });
    
    if (mission.associationId.toString() !== association._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this mission' });
    }

    mission = await Mission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete mission
// @route   DELETE /api/missions/:id
// @access  Private (Association only)
exports.deleteMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    const association = await Association.findOne({ userId: req.user.id });
    
    if (mission.associationId.toString() !== association._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this mission' });
    }

    // Use document method to trigger cascade delete middleware
    await mission.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: 'Mission and all related data deleted successfully'
    });
  } catch (error) {
    console.error('Delete mission error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Apply to mission
// @route   POST /api/missions/:id/apply
// @access  Private (Volunteer only)
exports.applyToMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    if (mission.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Mission is not open for applications' });
    }

    const volunteer = await Volunteer.findOne({ userId: req.user.id });

    // Check if already applied
    const alreadyApplied = mission.applicants.some(
      app => app.volunteerId.toString() === volunteer._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'Already applied to this mission' });
    }

    mission.applicants.push({
      volunteerId: volunteer._id,
      status: 'pending'
    });

    await mission.save();

    // Add to volunteer's applied missions
    volunteer.appliedMissions.push({
      missionId: mission._id,
      status: 'pending'
    });
    await volunteer.save();

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Withdraw application
// @route   DELETE /api/missions/:id/withdraw
// @access  Private (Volunteer only)
exports.withdrawApplication = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    const volunteer = await Volunteer.findOne({ userId: req.user.id });

    mission.applicants = mission.applicants.filter(
      app => app.volunteerId.toString() !== volunteer._id.toString()
    );
    await mission.save();

    volunteer.appliedMissions = volunteer.appliedMissions.filter(
      app => app.missionId.toString() !== mission._id.toString()
    );
    await volunteer.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept/Reject volunteer application
// @route   PUT /api/missions/:id/applicants/:volunteerId
// @access  Private (Association only)
exports.handleApplication = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    const association = await Association.findOne({ userId: req.user.id });
    
    if (mission.associationId.toString() !== association._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applicant = mission.applicants.find(
      app => app.volunteerId.toString() === req.params.volunteerId
    );

    if (!applicant) {
      return res.status(404).json({ success: false, message: 'Applicant not found' });
    }

    applicant.status = status;

    if (status === 'accepted') {
      mission.acceptedVolunteers.push(req.params.volunteerId);
    }

    await mission.save();

    // Update volunteer's applied missions
    const volunteer = await Volunteer.findById(req.params.volunteerId);
    const appliedMission = volunteer.appliedMissions.find(
      app => app.missionId.toString() === mission._id.toString()
    );
    if (appliedMission) {
      appliedMission.status = status;
      await volunteer.save();
    }

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get missions by association
// @route   GET /api/missions/association/:id
// @access  Public
exports.getMissionsByAssociation = async (req, res) => {
  try {
    const missions = await Mission.find({ associationId: req.params.id })
      .populate({
        path: 'associationId',
        select: 'name userId',
        populate: { path: 'userId', select: 'profilePhoto' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: missions.length,
      data: missions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Close mission
// @route   PUT /api/missions/:id/close
// @access  Private (Association only)
exports.closeMission = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    const association = await Association.findOne({ userId: req.user.id });
    
    if (mission.associationId.toString() !== association._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    mission.status = 'closed';
    await mission.save();

    // Add to accepted volunteers' history
    for (const volunteerId of mission.acceptedVolunteers) {
      const volunteer = await Volunteer.findById(volunteerId);
      if (volunteer && !volunteer.history.includes(mission._id)) {
        volunteer.history.push(mission._id);
        await volunteer.save();
      }
    }

    res.status(200).json({
      success: true,
      data: mission
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
