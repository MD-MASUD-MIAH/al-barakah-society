import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Trash2,
  Megaphone,
  Sparkles,
  ShieldCheck,
  User as UserIcon,
  Smile,
  BellRing,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from '../../utils/alerts';
import { formatTime, formatDate } from '../../utils/formatters';

export const NoticeBoard = ({ fullHeight = false }) => {
  const { user, isAdmin, socket } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isNotice, setIsNotice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch initial messages
  useEffect(() => {
    fetchMessages();
  }, []);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      setMessages((prev) => {
        // Prevent duplicate if already added locally
        if (prev.some((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });
      scrollToBottom();
    };

    const handleMessageDeleted = (deletedId) => {
      setMessages((prev) => prev.filter((m) => m._id !== deletedId));
    };

    const handleUserTyping = (data) => {
      setTypingUser(data.name);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 2500);
    };

    const handleUserStopTyping = () => {
      setTypingUser(null);
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [socket]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/messages');
      if (data.success) {
        setMessages(data.messages);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (socket && user) {
      socket.emit('typing', { name: user.name });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending) return;

    try {
      setSending(true);
      const payload = {
        message: inputMessage.trim(),
        isNotice: isAdmin ? isNotice : false,
      };

      const { data } = await api.post('/messages', payload);

      if (data.success) {
        // Fallback add if socket didn't emit back
        setMessages((prev) => {
          if (prev.some((m) => m._id === data.data._id)) return prev;
          return [...prev, data.data];
        });
        setInputMessage('');
        setIsNotice(false);
        if (socket) socket.emit('stop_typing');
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to post message:', err);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    const confirmed = await showConfirmAlert(
      'মেসেজ মুছবেন?',
      'আপনি কি নিশ্চিতভাবে এই মেসেজটি মুছে ফেলতে চান?'
    );
    if (!confirmed) return;

    try {
      await api.delete(`/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (socket) socket.emit('delete_message', id);
    } catch (err) {
      showErrorAlert('ব্যর্থ হয়েছে', 'মেসেজটি মুছতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div
      className={`bg-white rounded-[6px] border border-slate-200 shadow-none flex flex-col overflow-hidden ${
        fullHeight ? 'h-[calc(100vh-140px)]' : 'h-[620px]'
      }`}
    >
      {/* Noticeboard Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 px-5 py-3.5 text-white flex items-center justify-between border-b-2 border-gold-500/40">
        <div>
          <h3 className="font-bold text-sm sm:text-base text-white">কমিউনিটি নোটিশ ও বার্তা বোর্ড</h3>
          <p className="text-[11px] text-gold-300/90 font-medium">
            সোসাইটির সদস্য ও প্রশাসনের উন্মুক্ত আলোচনা
          </p>
        </div>

        <button
          onClick={fetchMessages}
          title="রিফ্রেশ করুন"
          className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-[6px] transition-colors text-xs flex items-center gap-1.5"
        >
          <BellRing className="w-4 h-4 text-gold-400" />
          <span className="hidden sm:inline">আপডেট</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <div className="w-8 h-8 border-3 border-emerald-900 border-t-gold-500 rounded-full animate-spin"></div>
            <p className="text-xs">মেসেজ লোড হচ্ছে...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 text-center p-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Megaphone className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">কোনো নোটিশ বা মেসেজ নেই</p>
            <p className="text-xs text-slate-500">প্রথম মেসেজটি আপনিই পোস্ট করুন!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId?._id === user?.id || msg.senderId === user?.id;
            const isMsgAdmin = msg.senderRole === 'admin' || msg.senderId?.role === 'admin';
            const isNoticeMsg = msg.isNotice;

            return (
              <div
                key={msg._id}
                className={`flex gap-3 group animate-in fade-in slide-in-from-bottom-2 ${
                  isMe ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                {msg.senderAvatar || msg.senderId?.avatar ? (
                  <img
                    src={msg.senderAvatar || msg.senderId?.avatar}
                    alt={msg.senderName}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-gold-400/40 shrink-0 self-start shadow-sm"
                  />
                ) : (
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 self-start shadow-sm ${
                      isMsgAdmin
                        ? 'bg-gold-500 text-emerald-950 font-serif font-extrabold'
                        : 'bg-emerald-800 text-white'
                    }`}
                  >
                    {msg.senderName?.charAt(0) || 'U'}
                  </div>
                )}

                {/* Message Bubble Container */}
                <div className={`max-w-[80%] sm:max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  {/* Sender Name and Role Badge */}
                  <div className="flex items-center gap-2 mb-1 px-1 text-xs">
                    <span className="font-semibold text-slate-800">
                      {isMe ? 'আপনি' : msg.senderName}
                    </span>
                    {isMsgAdmin && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-400/20 text-amber-900 border border-gold-400/40">
                        <ShieldCheck className="w-2.5 h-2.5 text-amber-800" />
                        অ্যাডমিন
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400">{formatTime(msg.createdAt)}</span>
                  </div>

                  {/* Bubble Content */}
                  <div
                    className={`relative p-3 rounded-[6px] text-xs leading-relaxed ${
                      isNoticeMsg
                        ? 'bg-gradient-to-r from-amber-500/15 via-gold-500/10 to-amber-500/20 border border-gold-500 text-slate-900'
                        : isMe
                        ? 'bg-emerald-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-800'
                    }`}
                  >
                    {isNoticeMsg && (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wide mb-1 pb-1 border-b border-gold-400/30">
                        <Megaphone className="w-3.5 h-3.5 text-amber-700" />
                        <span>অফিসিয়াল সোসাইটি নোটিশ</span>
                      </div>
                    )}

                    <p className="whitespace-pre-wrap break-words">{msg.message}</p>

                    {/* Delete button (Admin or Sender) */}
                    {(isAdmin || isMe) && (
                      <button
                        onClick={() => handleDeleteMessage(msg._id)}
                        title="মেসেজ মুছুন"
                        className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2 p-1 bg-white rounded-full text-slate-400 hover:text-red-600 border border-slate-200"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUser && (
        <div className="px-6 py-1.5 bg-slate-50 text-[11px] text-slate-500 italic flex items-center gap-2 border-t border-slate-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
          <span>{typingUser} লিখছেন...</span>
        </div>
      )}

      {/* Input Box Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 flex flex-col gap-2.5"
      >
        {/* Admin official notice toggle checkbox */}
        {isAdmin && (
          <label className="flex items-center gap-2 text-xs font-semibold text-amber-900 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isNotice}
              onChange={(e) => setIsNotice(e.target.checked)}
              className="rounded-[4px] text-emerald-800 focus:ring-emerald-700 w-4 h-4 border-slate-300"
            />
            <span className="flex items-center gap-1">
              <Megaphone className="w-3.5 h-3.5 text-amber-600" />
              অফিসিয়াল সাধারণ নোটিশ হিসেবে হাইলাইট করুন (Notice Pin)
            </span>
          </label>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="আপনার বক্তব্য বা মন্তব্য লিখুন (সবাই দেখতে পাবে)..."
            value={inputMessage}
            onChange={handleInputChange}
            maxLength={1000}
            className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || sending}
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-semibold text-xs rounded-[6px] shadow-none transition-all disabled:opacity-50 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">পাঠান</span>
          </button>
        </div>
      </form>
    </div>
  );
};
