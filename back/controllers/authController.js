const User = require('../models/User');
const Volunteer = require('../models/Volunteer');
const Association = require('../models/Association');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    console.log('=== REGISTRATION STARTED ===');
    console.log('Registration request body:', req.body);
    console.log('Registration request file:', req.file);

    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      console.log('Missing required fields');
      await session.abortTransaction();
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email, password, and role' 
      });
    }

    // Check if user exists
    console.log('Checking if user exists...');
    const userExists = await User.findOne({ email }).session(session);
    if (userExists) {
      console.log('User already exists');
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    console.log('Hashing password...');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create user within transaction
    console.log('Creating user...');
    const [user] = await User.create([{
      email,
      password: hashedPassword,
      role,
      profilePhoto: req.file ? req.file.path : null // Cloudinary URL
    }], { session });

    console.log('User created successfully:', user._id);

    // Create profile based on role within transaction
    if (role === 'volunteer') {
      // Validate volunteer required fields
      if (!req.body.firstName || !req.body.lastName) {
        await session.abortTransaction();
        return res.status(400).json({ 
          success: false, 
          message: 'First name and last name are required for volunteers' 
        });
      }

      // Parse skills and interests
      let skills = [];
      let interests = [];
      try {
        if (req.body.skills) {
          skills = typeof req.body.skills === 'string' ? JSON.parse(req.body.skills) : req.body.skills;
        }
        if (req.body.interests) {
          interests = typeof req.body.interests === 'string' ? JSON.parse(req.body.interests) : req.body.interests;
        }
      } catch (parseError) {
        console.error('Error parsing skills/interests:', parseError);
      }

      const volunteerData = {
        userId: user._id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone || '',
        bio: req.body.bio || '',
        wilaya: req.body.wilaya || '',
        skills: skills,
        interests: interests
      };
      
      console.log('Creating volunteer profile with data:', volunteerData);
      await Volunteer.create([volunteerData], { session });
      console.log('Volunteer profile created');
      
    } else if (role === 'association') {
      // Validate association required fields
      if (!req.body.associationName || !req.body.phone || !req.body.wilaya || !req.body.address || !req.body.description) {
        await session.abortTransaction();
        return res.status(400).json({ 
          success: false, 
          message: 'Association name, phone, wilaya, address, and description are required' 
        });
      }

      const associationData = {
        userId: user._id,
        name: req.body.associationName,
        email: email,
        phone: req.body.phone,
        wilaya: req.body.wilaya,
        address: req.body.address,
        description: req.body.description,
        website: req.body.website || ''
      };
      
      console.log('Creating association profile with data:', associationData);
      await Association.create([associationData], { session });
      console.log('Association profile created');
    }

    // Commit transaction - everything succeeded
    await session.commitTransaction();
    console.log('Transaction committed successfully');

    const token = generateToken(user._id);
    console.log('Token generated successfully');
    console.log('=== REGISTRATION COMPLETED ===');

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    console.error('=== REGISTRATION ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Registration failed' 
    });
  } finally {
    // End session
    session.endSession();
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please provide email, password and role' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if role matches
    if (user.role !== role) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or wrong account type' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    let profile;
    if (user.role === 'volunteer') {
      profile = await Volunteer.findOne({ userId: user._id });
    } else {
      profile = await Association.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
