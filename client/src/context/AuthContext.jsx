import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('al_barakah_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('al_barakah_token'));
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [onlineCount, setOnlineCount] = useState(1);
  const [pendingCount, setPendingCount] = useState(0);

  // Initialize socket connection when user is logged in & approved
  useEffect(() => {
    let newSocket = null;
    if (token && user && user.status === 'approved') {
      let socketServerUrl = import.meta.env.VITE_SOCKET_URL;
      if (!socketServerUrl && import.meta.env.VITE_API_URL) {
        try {
          socketServerUrl = new URL(import.meta.env.VITE_API_URL).origin;
        } catch (_) {}
      }
      if (!socketServerUrl) {
        socketServerUrl = import.meta.env.PROD ? 'https://al-barakah-server.vercel.app' : 'http://localhost:5000';
      }
      newSocket = io(socketServerUrl, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        timeout: 5000,
      });

      newSocket.on('connect', () => {
        newSocket.emit('user_connected', {
          id: user.id || user._id,
          name: user.name,
          role: user.role,
        });
      });

      newSocket.on('online_count', (count) => {
        setOnlineCount(count);
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [token, user?.id, user?.status]);

  // Load current user profile from server on mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('al_barakah_user', JSON.stringify(data.user));

          // If admin, fetch pending approvals count
          if (data.user.role === 'admin') {
            fetchPendingCount();
          }
        }
      } catch (err) {
        console.error('Failed to restore user session:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, [token]);

  const fetchPendingCount = async () => {
    try {
      const { data } = await api.get('/users/pending');
      if (data.success) {
        setPendingCount(data.count || 0);
      }
    } catch (err) {
      // Ignore if not admin
    }
  };

  const login = async (emailOrPhone, password) => {
    try {
      const response = await api.post('/auth/login', { emailOrPhone, password });
      if (response.data.success) {
        const { token: receivedToken, user: receivedUser } = response.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('al_barakah_token', receivedToken);
        localStorage.setItem('al_barakah_user', JSON.stringify(receivedUser));

        if (receivedUser.role === 'admin') {
          fetchPendingCount();
        }
        return { success: true, user: receivedUser };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।';
      const status = error.response?.data?.status;
      return { success: false, message: errorMsg, status };
    }
  };

  const register = async (formData) => {
    try {
      const response = await api.post('/auth/register', formData);
      if (response.data.success && response.data.token) {
        const { token: receivedToken, user: receivedUser } = response.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('al_barakah_token', receivedToken);
        localStorage.setItem('al_barakah_user', JSON.stringify(receivedUser));
      }
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || 'নিবন্ধন সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।';
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setPendingCount(0);
    localStorage.removeItem('al_barakah_token');
    localStorage.removeItem('al_barakah_user');
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('al_barakah_user', JSON.stringify(data.user));
      }
      if (data.user?.role === 'admin') {
        fetchPendingCount();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        socket,
        onlineCount,
        pendingCount,
        login,
        register,
        logout,
        refreshUser,
        fetchPendingCount,
        isAdmin: user?.role === 'admin',
        isApproved: user?.status === 'approved',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
