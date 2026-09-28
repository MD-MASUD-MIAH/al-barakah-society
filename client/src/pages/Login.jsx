import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPendingStatus, setIsPendingStatus] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsPendingStatus(false);

    if (!emailOrPhone.trim() || !password) {
      setError('ইমেইল/ফোন নম্বর এবং পাসওয়ার্ড প্রদান করুন');
      return;
    }

    try {
      setLoading(true);
      const res = await login(emailOrPhone.trim(), password);

      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message);
        if (res.status === 'pending') {
          setIsPendingStatus(true);
        }
      }
    } catch (err) {
      setError('লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // Demo one-click login helper
  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmailOrPhone('admin@albarakah.org');
      setPassword('password123');
    } else if (role === 'member') {
      setEmailOrPhone('mamun@albarakah.org');
      setPassword('password123');
    } else if (role === 'pending') {
      setEmailOrPhone('sakib@example.com');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Islamic Background Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 z-10">
        <div className="bg-white py-7 px-6 sm:px-8 rounded-[6px] border border-slate-200 shadow-none">
          {/* Brand Logo inside Card (Original Colors) */}
          <div className="flex flex-col items-center justify-center mb-6">
            <img
              src="/logo-al-barakah.png"
              alt="আল-বারাকাহ সোসাইটি"
              className="h-24 sm:h-28 w-auto object-contain transition-transform hover:scale-105"
            />
            <p className="text-xs font-semibold text-slate-500 mt-1">
              লগইন পোর্টাল
            </p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[6px] flex items-center gap-2 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                ইমেইল অথবা মোবাইল নম্বর
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="admin@albarakah.org অথবা 01811000002"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  required
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-[6px] shadow-none bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs transition-all disabled:opacity-50"
            >
              <span>{loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400 text-center uppercase tracking-wider mb-2">
              দ্রুত টেস্টিং ডেমো অ্যাকাউন্ট
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-[4px] text-xs font-semibold border border-emerald-200 transition-colors text-center"
              >
                অ্যাডমিন
              </button>
              <button
                type="button"
                onClick={() => fillDemo('member')}
                className="px-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-[4px] text-xs font-semibold border border-blue-200 transition-colors text-center"
              >
                অনুমোদিত সদস্য
              </button>
              <button
                type="button"
                onClick={() => fillDemo('pending')}
                className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-[4px] text-xs font-semibold border border-amber-200 transition-colors text-center"
              >
                সাধারণ ইউজার
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-5 text-center text-xs text-slate-600">
            এখনও কোনো একাউন্ট নেই?{' '}
            <Link
              to="/register"
              className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
            >
              নতুন একাউন্ট নিবন্ধন করুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
