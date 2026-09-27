import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, adminOnly = false, memberOnly = false }) => {
  const { user, token, loading, isAdmin, isApproved } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-900 border-t-gold-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-emerald-900">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If route is restricted to admins only
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If route is restricted to approved members only
  if (memberOnly && !isApproved && !isAdmin) {
    return <Navigate to="/apply-membership" replace />;
  }

  return children;
};
