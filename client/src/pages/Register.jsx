import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Image,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    avatar: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('পাসওয়ার্ডটি কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    try {
      setLoading(true);
      const res = await register(formData);

      if (res.success) {
        setIsSubmitted(true);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('নিবন্ধন সম্পন্ন করা যায়নি। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gold-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[6px] bg-white p-1.5 border border-gold-400 mb-3 overflow-hidden">
          <img
            src="/logo-al-barakah.png"
            alt="আল-বারাকাহ সোসাইটি"
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          আল-বারাকাহ সোসাইটি
        </h2>
        <p className="mt-1 text-xs font-semibold text-gold-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>বিশ্বাসের বন্ধন</span>
          <Sparkles className="w-3.5 h-3.5" />
        </p>
        <p className="mt-1 text-xs text-emerald-200/80">
          নতুন একাউন্ট নিবন্ধন ফরম
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 z-10">
        <div className="bg-white py-7 px-6 sm:px-8 rounded-[6px] border border-slate-200 shadow-none">
          {/* Success State */}
          {isSubmitted ? (
            <div className="text-center py-2 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-700" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                নিবন্ধন সফল হয়েছে!
              </h3>
              <div className="p-4 bg-emerald-50 rounded-[6px] border border-emerald-200 text-xs text-emerald-950 leading-relaxed text-left space-y-2">
                <p className="font-bold text-emerald-900">
                  আপনার প্রাথমিক একাউন্ট সক্রিয় হয়েছে।
                </p>
                <p>
                  আল-বারাকাহ সোসাইটির নীতিমালা অনুসারে সাধারণ রেজিস্ট্রেশনের পর সদস্যপদের জন্য আলাদা আবেদন ফরম পূরণ করতে হয়।
                </p>
                <p className="font-semibold text-slate-700 pt-1 border-t border-emerald-200">
                  সদস্যপদ অনুমোদিত হলে আপনি পূর্ণাঙ্গ লেজার ও কমিউনিটি সেবা ব্যবহার করতে পারবেন।
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/apply-membership"
                  className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] shadow-none transition-all block text-center"
                >
                  সদস্যপদের জন্য আবেদন ফরম পূরণ করুন →
                </Link>
                <Link
                  to="/dashboard"
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-[6px] transition-all block text-center"
                >
                  ড্যাশবোর্ডে প্রবেশ করুন
                </Link>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[6px] flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    পূর্ণ নাম *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="যেমন: মাওলানা কামরুল হাসান"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    ইমেইল ঠিকানা *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="user@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    মোবাইল নম্বর *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      placeholder="017xxxxxxxx"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                {/* Optional Avatar URL */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    প্রোফাইল ছবি লিংক (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Image className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      name="avatar"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.avatar}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-900"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-[6px] border border-emerald-200/80 text-[11px] text-emerald-900 leading-normal">
                  📌 <strong>নোট:</strong> একাউন্ট তৈরি করলেই সদস্যপদ নিশ্চিত হবে না। সোসাইটির পূর্ণ সুবিধা ও আর্থিক তথ্য দেখতে একাউন্ট তৈরির পর সদস্যপদ আবেদন ফরমটি পূরণ করতে হবে।
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-[6px] shadow-none bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs transition-all disabled:opacity-50"
                >
                  <span>{loading ? 'নিবন্ধন করা হচ্ছে...' : 'নিবন্ধন সম্পন্ন করুন'}</span>
                  <ArrowRight className="w-4 h-4 text-gold-400" />
                </button>
              </form>

              <div className="mt-5 text-center text-xs text-slate-600">
                ইতিমধ্যে একাউন্ট আছে?{' '}
                <Link
                  to="/login"
                  className="font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                >
                  লগইন করুন
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
