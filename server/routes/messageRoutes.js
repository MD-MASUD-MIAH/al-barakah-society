const express = require('express');
const router = express.Router();
const {
  getMessages,
  createMessage,
  deleteMessage,
} = require('../controllers/messageController');
const { verifyToken, isApproved } = require('../middlewares/auth');

router.use(verifyToken);
router.use(isApproved);

router.get('/', getMessages);
router.post('/', createMessage);
router.delete('/:id', deleteMessage);

module.exports = router;
