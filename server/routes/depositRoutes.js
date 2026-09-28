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

// All deposit routes require logged-in status
router.use(verifyToken);

// Aggregate stats (accessible to all authenticated users for transparency & dashboard)
router.get('/stats', getStats);

// Filterable ledger and sensitive personal records require approved status or admin
router.use(isApproved);

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
