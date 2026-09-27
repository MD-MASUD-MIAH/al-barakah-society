import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, RefreshCw, LogOut, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PendingApproval = () => {
  const { user, refreshUser, logout } = useAuth();
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const handleCheckStatus = async () => {
    setChecking(true);
    await refreshUser();
    setTimeout(() => {
      setChecking(false);
      const updatedUser = JSON.parse(localStorage.getItem('al_barakah_user') || '{}');
      if (updatedUser.status === 'approved') {
        navigate('/dashboard');
      }
    }, 800);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[6px] p-8 border border-slate-200 shadow-none text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-[6px] bg-white p-1.5 shadow-none border border-slate-200 overflow-hidden">
            <img
              src="/logo-al-barakah.png"
              alt="আল-বারাকাহ সোসাইটি"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="w-10 h-10 rounded-[6px] bg-amber-100 text-amber-800 flex items-center justify-center shadow-none">
            <Clock className="w-5 h-5 text-amber-600 animate-spin" />
          </div>
        </div>

        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-[6px] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-3">
            <ShieldAlert className="w-3.5 h-3.5" />
            অনুমোদনাধীন একাউন্ট
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            আসসালামু আলাইকুম, {user?.name || 'সম্মানিত সদস্য'}!
          </h2>
          <p className="text-xs text-amber-900 font-medium mt-1">
            "আপনার অ্যাকাউন্টটি অ্যাডমিন অনুমোদনের অপেক্ষায় রয়েছে"
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-[6px] border border-slate-200 text-xs text-slate-600 text-left space-y-2 leading-relaxed">
          <p>
            আল-বারাকাহ সোসাইটির আর্থিক নিরাপত্তা ও পারস্পরিক আস্থা বজায় রাখার স্বার্থে সোসাইটি অ্যাডমিন আপনার পরিচিতি ও যোগাযোগের তথ্য পর্যালোচনা করছেন।
          </p>
          <p className="font-semibold text-emerald-900">
            অ্যাকাউন্ট অনুমোদিত হলে আপনি সরাসরি আর্থিক লেজার, জমা স্টেটমেন্ট ও কমিউনিটি বোর্ড ব্যবহার করতে পারবেন।
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] shadow-none transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'যাচাই করা হচ্ছে...' : 'স্ট্যাটাস পুনরায় যাচাই করুন'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-[6px] transition-all"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>লগআউট করুন</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          আল-বারাকাহ সোসাইটি (বিশ্বাসের বন্ধন)
        </p>
      </div>
    </div>
  );
};
