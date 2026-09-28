const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getPendingUsers,
  getApprovedMembers,
  approveUser,
  rejectUser,
  updateUserRoleOrStatus,
  deleteUser,
  updateProfile,
  applyMembership,
} = require('../controllers/userController');
const { verifyToken, isApproved, isAdmin } = require('../middlewares/auth');

router.use(verifyToken);

// Update own profile
router.put('/profile', updateProfile);

// Apply for membership (registered user)
router.post('/apply-membership', applyMembership);

// Get list of approved members for directory & forms
router.get('/approved', isApproved, getApprovedMembers);
router.get('/members', isApproved, getApprovedMembers);

// Admin-only user management routes
router.get('/', isAdmin, getAllUsers);
router.get('/pending', isAdmin, getPendingUsers);
router.put('/:id/approve', isAdmin, approveUser);
router.put('/:id/reject', isAdmin, rejectUser);
router.patch('/:id/manage', isAdmin, updateUserRoleOrStatus);
router.delete('/:id', isAdmin, deleteUser);

module.exports = router;
