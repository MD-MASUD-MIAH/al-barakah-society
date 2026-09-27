const Message = require('../models/Message');

const socketHandler = (io) => {
  let onlineUsers = new Map();

  io.on('connection', (socket) => {
    try {
      // Member joins with their user data
      socket.on('user_connected', (userData) => {
        if (userData && userData.id) {
          onlineUsers.set(socket.id, {
            userId: userData.id,
            name: userData.name,
            role: userData.role,
          });
          io.emit('online_count', onlineUsers.size);
        }
      });

      // Real-time message sent via socket
      socket.on('send_message', async (data) => {
        try {
          const { senderId, senderName, senderRole, senderAvatar, message, isNotice } = data;
          if (!message || !message.trim()) return;

          const newMessage = await Message.create({
            senderId,
            senderName,
            senderRole: senderRole || 'member',
            senderAvatar: senderAvatar || '',
            message: message.trim(),
            isNotice: Boolean(isNotice && senderRole === 'admin'),
          });

          const populated = await Message.findById(newMessage._id).populate(
            'senderId',
            'name avatar role'
          );

          io.emit('new_message', populated);
        } catch (err) {
          console.error('Socket send_message error:', err);
        }
      });

      // Message deleted event
      socket.on('delete_message', (messageId) => {
        io.emit('message_deleted', messageId);
      });

      // Member typing indicator
      socket.on('typing', (data) => {
        socket.broadcast.emit('user_typing', data);
      });

      socket.on('stop_typing', () => {
        socket.broadcast.emit('user_stop_typing');
      });

      // Disconnect
      socket.on('disconnect', () => {
        onlineUsers.delete(socket.id);
        io.emit('online_count', onlineUsers.size);
      });
    } catch (error) {
      console.error('Socket connection error:', error);
    }
  });
};

module.exports = socketHandler;

