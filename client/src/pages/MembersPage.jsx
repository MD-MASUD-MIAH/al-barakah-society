import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

export const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/approved');
      const list = res.data.members || res.data.users || [];
      if (res.data.success) {
        setMembers(list);
      }
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-[6px] text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-800" />
              <span>অনুমোদিত সোসাইটি সদস্যবৃন্দ (Active Members)</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              আল-বারাকাহ সোসাইটির সক্রিয় ও যাচাইকৃত সদস্য তালিকা
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-[6px]">
            মোট: {members.length} জন
          </span>
          <button
            onClick={fetchMembers}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-[6px] border border-slate-300 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200 shadow-none">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="সদস্যের নাম, মোবাইল নম্বর বা ইমেইল দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">সদস্যদের তথ্য লোড হচ্ছে...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-500 bg-white rounded-[6px] border border-slate-200">
          কোনো সদস্য পাওয়া যায়নি
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div
              key={m._id}
              className="bg-white rounded-[6px] p-5 border border-slate-200 shadow-none space-y-3 hover:border-emerald-600/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=047857&color=fff`}
                  alt={m.name}
                  className="w-12 h-12 rounded-full aspect-square object-cover border border-emerald-700/30"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 truncate">{m.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{m.email}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>মোবাইল:</span>
                  </span>
                  <span className="font-semibold text-slate-900">{m.phone}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>মোট জমাকৃত তহবিল:</span>
                  <span className="font-bold text-emerald-900 font-sans">
                    {formatCurrency(m.totalDeposited || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>সদস্যপদ যোগদানের তারিখ:</span>
                  <span className="text-[11px] text-slate-500">{formatDate(m.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
