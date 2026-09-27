const express = require('express');
const router = express.Router();
const {
  getStats,
  getAllDeposits,
  getMyDeposits,
  createDeposit,
  deleteDeposit,
  getReceipt,
} = require('../controllers/depositController');
const { verifyToken, isApproved, isAdmin } = require('../middlewares/auth');

// All deposit routes require logged-in and approved status
router.use(verifyToken);
router.use(isApproved);

// Aggregate stats (accessible to all approved members and admins)
router.get('/stats', getStats);

// Filterable ledger (approved members and admins)
router.get('/', getAllDeposits);

// Member personal deposit history
router.get('/my-deposits', getMyDeposits);

// Single receipt data
router.get('/:id/receipt', getReceipt);

// Admin-only deposit management
router.post('/', isAdmin, createDeposit);
router.delete('/:id', isAdmin, deleteDeposit);

module.exports = router;
