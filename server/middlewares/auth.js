const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'al_barakah_super_secret_jwt_key_2026_islamic_society';

// Verify JWT Token
const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'অননুমোদিত প্রবেশাধিকার! অনুগ্রহ করে লগইন করুন (Access denied. No token provided).',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি (User not found).',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ টোকেন (Invalid or expired token).',
      error: error.message,
    });
  }
};

// Check if user is approved
const isApproved = (req, res, next) => {
  if (req.user && (req.user.status === 'approved' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'আপনার অ্যাকাউন্টটি এখনও অনুমোদিত নয় (Account is not approved yet).',
    status: req.user ? req.user.status : 'unknown',
  });
};

// Check if user is Admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'অ্যাডমিন অনুমতি প্রয়োজন (Admin privileges required).',
  });
};

module.exports = {
  verifyToken,
  isApproved,
  isAdmin,
};
