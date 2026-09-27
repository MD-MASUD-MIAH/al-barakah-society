import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  User,
  Phone,
  Mail,
  Home,
  Briefcase,
  Users2,
  Coins,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { showSuccessAlert, showErrorAlert } from '../utils/alerts';
import { formatCurrency } from '../utils/formatters';

export const ApplyMembershipPage = () => {
  const { user, refreshUser, isApproved } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nid: user?.membershipDetails?.nid || '',
    fatherOrHusbandName: user?.membershipDetails?.fatherOrHusbandName || '',
    occupation: user?.membershipDetails?.occupation || '',
    currentAddress: user?.membershipDetails?.currentAddress || '',
    permanentAddress: user?.membershipDetails?.permanentAddress || '',
    nomineeName: user?.membershipDetails?.nomineeName || '',
    nomineeRelation: user?.membershipDetails?.nomineeRelation || '',
    nomineePhone: user?.membershipDetails?.nomineePhone || '',
    monthlyPledge: user?.membershipDetails?.monthlyPledge || 1000,
    joinReason: user?.membershipDetails?.joinReason || '',
  });

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.nid.trim()) {
      setError('অনুগ্রহ করে জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং প্রদান করুন');
      return;
    }
    if (!formData.fatherOrHusbandName.trim()) {
      setError('অনুগ্রহ করে পিতা / স্বামীর নাম প্রদান করুন');
      return;
    }
    if (!formData.occupation.trim()) {
      setError('অনুগ্রহ করে পেশা উল্লেখ করুন');
      return;
    }
    if (!formData.currentAddress.trim()) {
      setError('অনুগ্রহ করে বর্তমান ঠিকানা প্রদান করুন');
      return;
    }
    if (!formData.nomineeName.trim() || !formData.nomineePhone.trim()) {
      setError('অনুগ্রহ করে নমিনির নাম ও যোগাযোগ নম্বর প্রদান করুন');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/users/apply-membership', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        await showSuccessAlert(
          'আবেদন সফলভাবে দাখিল হয়েছে!',
          'আপনার সদস্যপদ আবেদনটি অ্যাডমিন অনুমোদনের অপেক্ষায় রয়েছে।'
        );
        await refreshUser();
      } else {
        setError(res.data.message);
        showErrorAlert('ব্যর্থ হয়েছে', res.data.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'আবেদন জমা করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।';
      setError(msg);
      showErrorAlert('ব্যর্থ হয়েছে', msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    try {
      setChecking(true);
      await refreshUser();
    } finally {
      setChecking(false);
    }
  };

  // If already approved member
  if (isApproved) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-[6px] border border-slate-200 p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            অভিনন্দন, {user?.name}!
          </h2>
          <p className="text-sm text-slate-600">
            আপনি আল-বারাকাহ সোসাইটির একজন অনুমোদিত সদস্য। আপনার একাউন্টে আর্থিক লেজার, জমা স্টেটমেন্ট ও কমিউনিটি চ্যাটসহ সকল ফিচার সক্রিয় রয়েছে।
          </p>
          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-white font-bold text-xs rounded-[6px] transition-all"
            >
              ড্যাশবোর্ডে যান
            </button>
            <button
              onClick={() => navigate('/ledger')}
              className="px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-emerald-950 font-bold text-xs rounded-[6px] transition-all"
            >
              আর্থিক লেজার দেখুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If pending approval
  if (user?.status === 'pending') {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-[6px] border border-amber-300 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
            <div className="w-12 h-12 rounded-[6px] bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                আবেদন প্রক্রিয়াধীন (Pending Approval)
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                আপনার সদস্যপদ আবেদনটি পর্যালোচনায় রয়েছে
              </h2>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-[6px] border border-amber-200 text-xs text-amber-950 leading-relaxed">
            আল-বারাকাহ সোসাইটির অ্যাডমিন প্যানেল আপনার আবেদন ও তথ্যাদি যাচাই করছেন। অ্যাডমিন অনুমোদন প্রদান করার পরপরই আপনি সকল আর্থিক তথ্য, লেজার ও সোসাইটির অন্যান্য সুবিধাসমূহ উপভোগ করতে পারবেন।
          </div>

          {/* Submitted Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              আপনার দাখিলকৃত তথ্যাদি:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200">
                <span className="text-slate-500">নাম:</span>
                <p className="font-bold text-slate-900 mt-0.5">{user.name}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200">
                <span className="text-slate-500">মোবাইল:</span>
                <p className="font-bold text-slate-900 mt-0.5">{user.phone}</p>
              </div>
              {user.membershipDetails?.nid && (
                <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200">
                  <span className="text-slate-500">জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{user.membershipDetails.nid}</p>
                </div>
              )}
              {user.membershipDetails?.occupation && (
                <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200">
                  <span className="text-slate-500">পেশা:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{user.membershipDetails.occupation}</p>
                </div>
              )}
              {user.membershipDetails?.monthlyPledge > 0 && (
                <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200">
                  <span className="text-slate-500">মাসিক সঞ্চয় অঙ্গীকার:</span>
                  <p className="font-bold text-emerald-800 font-sans mt-0.5">
                    {formatCurrency(user.membershipDetails.monthlyPledge)}
                  </p>
                </div>
              )}
              {user.membershipDetails?.nomineeName && (
                <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200">
                  <span className="text-slate-500">মনোনীত নমিনি:</span>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {user.membershipDetails.nomineeName} ({user.membershipDetails.nomineeRelation || 'সম্পর্ক'})
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleCheckStatus}
              disabled={checking}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'যাচাই করা হচ্ছে...' : 'স্ট্যাটাস রিলোড করুন'}</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-[6px] transition-all"
            >
              ড্যাশবোর্ডে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not applied or rejected state - Show Membership Application Form
  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-[6px] p-6 text-white border border-gold-500/40">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2 py-0.5 rounded-[4px] bg-gold-400 text-emerald-950 text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            সদস্যপদ ফরম
          </span>
          <span className="text-xs text-gold-300">আল-বারাকাহ সোসাইটি</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          সোসাইটির সদস্যপদ পেতে আবেদন করুন
        </h1>
        <p className="mt-1 text-xs text-emerald-200/90 leading-relaxed max-w-xl">
          সাধারণ একাউন্ট তৈরি সম্পন্ন হয়েছে। সোসাইটির সকল আর্থিক লেজার, আমানত সঞ্চয় ও কমিউনিটি সুযোগ-সুবিধা উপভোগ করতে নিচের তথ্যগুলো নির্ভুলভাবে পূরণ করে সদস্যপদের জন্য আবেদন দাখিল করুন।
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-[6px] border border-slate-200 p-6 sm:p-8">
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-[6px] text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-[6px] text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Pre-filled Identity */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-800" />
              <span>১. প্রাথমিক পরিচয় (একাউন্ট তথ্য)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 text-xs">
                <span className="text-slate-500">পূর্ণ নাম:</span>
                <p className="font-bold text-slate-900 mt-0.5">{user?.name}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 text-xs">
                <span className="text-slate-500">মোবাইল নম্বর:</span>
                <p className="font-bold text-slate-900 mt-0.5">{user?.phone}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 text-xs">
                <span className="text-slate-500">ইমেইল:</span>
                <p className="font-bold text-slate-900 mt-0.5">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-800" />
              <span>২. সদস্য ব্যক্তিগত তথ্য</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nid"
                  required
                  placeholder="যেমন: 19901234567890"
                  value={formData.nid}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  পিতা / স্বামীর নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fatherOrHusbandName"
                  required
                  placeholder="পিতা অথবা স্বামীর নাম লিখুন"
                  value={formData.fatherOrHusbandName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বর্তমান পেশা <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="occupation"
                  required
                  placeholder="যেমন: ব্যবসা / চাকরিজীবী / শিক্ষক"
                  value={formData.occupation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  বর্তমান ঠিকানা <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="currentAddress"
                  required
                  placeholder="বাড়ি, রাস্তা, থানা, জেলা"
                  value={formData.currentAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  স্থায়ী ঠিকানা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  name="permanentAddress"
                  placeholder="গ্রাম, ডাকঘর, থানা, জেলা"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Nominee Details */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Users2 className="w-4 h-4 text-emerald-800" />
              <span>৩. মনোনীত নমিনির তথ্য</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  নমিনির নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nomineeName"
                  required
                  placeholder="নমিনির পূর্ণ নাম"
                  value={formData.nomineeName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সম্পর্ক <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nomineeRelation"
                  required
                  placeholder="যেমন: পিতা / মাতা / স্ত্রী / ভাই"
                  value={formData.nomineeRelation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  নমিনির মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="nomineePhone"
                  required
                  placeholder="01XXXXXXXXX"
                  value={formData.nomineePhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Pledge & Reason */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-800" />
              <span>৪. মাসিক সঞ্চয় অঙ্গীকার ও মন্তব্য</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  প্রস্তাবিত মাসিক সঞ্চয় কিস্তি (টাকা)
                </label>
                <input
                  type="number"
                  name="monthlyPledge"
                  min="100"
                  step="100"
                  placeholder="1000"
                  value={formData.monthlyPledge}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  সোসাইটিতে যোগদানের কারণ / মন্তব্য
                </label>
                <input
                  type="text"
                  name="joinReason"
                  placeholder="যেমন: পারস্পরিক সঞ্চয় ও তহবিল গঠন"
                  value={formData.joinReason}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-[6px] focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              পরে আবেদন করব
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] transition-all disabled:opacity-50"
            >
              <span>{loading ? 'জমা হচ্ছে...' : 'সদস্যপদ আবেদন দাখিল করুন'}</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
