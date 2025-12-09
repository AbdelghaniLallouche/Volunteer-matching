const Association = require('../models/Association');
const Mission = require('../models/Mission');

// @desc    Search associations by name
// @route   GET /api/associations/search?name=searchTerm
// @access  Public
exports.getAssociations = async (req, res) => {
  try {
    const { name, wilaya, category } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (wilaya) {
      query.wilaya = wilaya;
    }

    if (category) {
      query.category = category;
    }

    const associations = await Association.find(query).populate('userId', 'profilePhoto');

    // Add mission count for each association
    const associationsWithCount = await Promise.all(
      associations.map(async (assoc) => {
        const missionCount = await Mission.countDocuments({ 
          associationId: assoc._id, 
          status: 'open' 
        });
        return {
          ...assoc.toObject(),
          logo: assoc.userId?.profilePhoto || null,
          missionCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: associationsWithCount.length,
      data: associationsWithCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single association
// @route   GET /api/associations/:id
// @access  Public
exports.getAssociation = async (req, res) => {
  try {
    const association = await Association.findById(req.params.id).populate('userId', 'profilePhoto');

    if (!association) {
      return res.status(404).json({ success: false, message: 'Association not found' });
    }

    const missions = await Mission.find({ 
      associationId: association._id, 
      status: 'open' 
    });

    res.status(200).json({
      success: true,
      data: {
        association: {
          ...association.toObject(),
          logo: association.userId?.profilePhoto || null
        },
        missions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get association profile
// @route   GET /api/associations/profile/me
// @access  Private (Association only)
exports.getProfile = async (req, res) => {
  try {
    const association = await Association.findOne({ userId: req.user.id }).populate('userId', 'profilePhoto email');

    if (!association) {
      return res.status(404).json({ success: false, message: 'Association profile not found' });
    }

    const missions = await Mission.find({ associationId: association._id });

    res.status(200).json({
      success: true,
      data: {
        association: {
          ...association.toObject(),
          logo: association.userId?.profilePhoto || null
        },
        missions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update association profile
// @route   PUT /api/associations/profile
// @access  Private (Association only)
exports.updateProfile = async (req, res) => {
  try {
    const association = await Association.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!association) {
      return res.status(404).json({ success: false, message: 'Association profile not found' });
    }

    res.status(200).json({
      success: true,
      data: association
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get association dashboard stats
// @route   GET /api/associations/dashboard
// @access  Private (Association only)
exports.getDashboard = async (req, res) => {
  try {
    const association = await Association.findOne({ userId: req.user.id });

    if (!association) {
      return res.status(404).json({ success: false, message: 'Association profile not found' });
    }

    const totalMissions = await Mission.countDocuments({ associationId: association._id });
    const activeMissions = await Mission.countDocuments({ 
      associationId: association._id, 
      status: 'open' 
    });
    const completedMissions = await Mission.countDocuments({ 
      associationId: association._id, 
      status: 'completed' 
    });

    const missions = await Mission.find({ associationId: association._id });
    let totalApplicants = 0;
    let totalAccepted = 0;

    missions.forEach(mission => {
      totalApplicants += mission.applicants.length;
      totalAccepted += mission.acceptedVolunteers.length;
    });

    res.status(200).json({
      success: true,
      data: {
        totalMissions,
        activeMissions,
        completedMissions,
        totalApplicants,
        totalAccepted
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
