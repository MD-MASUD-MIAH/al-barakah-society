const Message = require('../models/Message');

// @desc    Get all messages (latest 100)
// @route   GET /api/messages
// @access  Private (Approved Members & Admin)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('senderId', 'name avatar role')
      .sort({ createdAt: 1 })
      .limit(150);

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'মেসেজগুলো লোড করা যায়নি (Failed to load messages).',
      error: error.message,
    });
  }
};

// @desc    Post a message / notice
// @route   POST /api/messages
// @access  Private (Approved Members & Admin)
exports.createMessage = async (req, res) => {
  try {
    const { message, isNotice } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'মেসেজ ফাঁকা হতে পারে না (Message cannot be empty).',
      });
    }

    // Only Admin can mark a message as an official Notice
    const noticeFlag = req.user.role === 'admin' ? Boolean(isNotice) : false;

    const newMessage = await Message.create({
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      senderAvatar: req.user.avatar || '',
      message: message.trim(),
      isNotice: noticeFlag,
    });

    const populatedMessage = await Message.findById(newMessage._id).populate(
      'senderId',
      'name avatar role'
    );

    // If socket.io is accessible from req.app.get('io')
    const io = req.app.get('io');
    if (io) {
      io.emit('new_message', populatedMessage);
    }

    res.status(201).json({
      success: true,
      message: 'মেসেজ সফলভাবে পাঠানো হয়েছে (Message posted).',
      data: populatedMessage,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'মেসেজ পাঠানো যায়নি (Failed to send message).',
      error: error.message,
    });
  }
};

// @desc    Delete message (Admin only or message owner)
// @route   DELETE /api/messages/:id
// @access  Private (Admin or sender)
exports.deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'মেসেজটি পাওয়া যায়নি (Message not found).',
      });
    }

    // Only admin or the sender can delete
    if (req.user.role !== 'admin' && msg.senderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'মেসেজটি মোছার অনুমতি আপনার নেই (Cannot delete this message).',
      });
    }

    await Message.findByIdAndDelete(req.params.id);

    const io = req.app.get('io');
    if (io) {
      io.emit('message_deleted', req.params.id);
    }

    res.status(200).json({
      success: true,
      message: 'মেসেজটি মুছে ফেলা হয়েছে (Message deleted).',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'মেসেজ মোছা যায়নি (Failed to delete message).',
      error: error.message,
    });
  }
};
