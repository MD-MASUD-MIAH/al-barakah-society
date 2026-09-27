const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user (status defaults to pending)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, avatar } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন (Name, email, phone, and password are required).',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'পাসওয়ার্ডটি কমপক্ষে ৬ অক্ষরের হতে হবে (Password must be at least 6 characters).',
      });
    }

    // Check if email or phone already registered
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'এই ইমেইলটি দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে (Email is already registered).',
      });
    }

    const existingPhone = await User.findOne({ phone: phone.trim() });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'এই মোবাইল নম্বরটি দিয়ে ইতিমধ্যে নিবন্ধন করা হয়েছে (Phone number is already registered).',
      });
    }

    // Create user with default not_applied status and user role
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      avatar: avatar || '',
      role: 'user',
      status: 'not_applied',
      totalDeposited: 0,
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'নিবন্ধন সফল হয়েছে! আপনি এখন লগইন অবস্থায় আছেন। সদস্য হতে আলাদা ফরমটি পূরণ করুন।',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        membershipDetails: user.membershipDetails,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'সার্ভার ত্রুটি: নিবন্ধন সম্পন্ন করা যায়নি (Registration failed).',
      error: error.message,
    });
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({
        success: false,
        message: 'ইমেইল/ফোন নম্বর এবং পাসওয়ার্ড প্রদান করুন (Please provide email/phone and password).',
      });
    }

    const cleanInput = emailOrPhone.trim();
    // Search user by email or phone and include password
    const user = await User.findOne({
      $or: [
        { email: cleanInput.toLowerCase() },
        { phone: cleanInput },
      ],
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ভুল ইমেইল/ফোন বা পাসওয়ার্ড (Invalid credentials).',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'ভুল ইমেইল/ফোন বা পাসওয়ার্ড (Invalid credentials).',
      });
    }

    // Only block suspended users
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        status: 'suspended',
        message: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত রয়েছে (Your account is suspended).',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'সফলভাবে লগইন হয়েছে (Logged in successfully).',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        membershipDetails: user.membershipDetails,
        totalDeposited: user.totalDeposited,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'সার্ভার ত্রুটি: লগইন সম্পন্ন করা যায়নি (Login failed).',
      error: error.message,
    });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private (verifyToken)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি (User not found).',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        membershipDetails: user.membershipDetails,
        totalDeposited: user.totalDeposited,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'প্রোফাইল লোড করা যায়নি (Failed to load profile).',
      error: error.message,
    });
  }
};
