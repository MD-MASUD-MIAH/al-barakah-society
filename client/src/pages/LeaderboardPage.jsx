import React, { useState, useEffect } from 'react';
import { Award, Trophy, ArrowLeft, RefreshCw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

export const LeaderboardPage = () => {
  const [topMembers, setTopMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/deposits/stats');
      if (res.data.success) {
        setTopMembers(res.data.stats.topMembers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-sm shrink-0">
            ১
          </div>
        );
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-sm shrink-0">
            ২
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
            ৩
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-semibold flex items-center justify-center text-sm shrink-0">
            {index + 1}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Link
                to="/dashboard"
                className="text-slate-500 hover:text-emerald-800 transition-colors"
                title="ড্যাশবোর্ডে ফিরে যান"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <span>শীর্ষ সঞ্চয়কারী লিডারবোর্ড (Top Savers Leaderboard)</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              সোসাইটির সর্বোচ্চ তহবিল জমাকারী সম্মানিত সদস্যবৃন্দের তালিকা
            </p>
          </div>
        </div>

        <button
          onClick={fetchLeaderboard}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-[6px] border border-slate-300 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">র‍্যাংকিং তালিকা</h3>
          <span className="text-xs text-slate-500">{topMembers.length} জন সদস্য</span>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">লিডারবোর্ড লোড হচ্ছে...</div>
          ) : topMembers.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">কোনো তথ্য পাওয়া যায়নি</div>
          ) : (
            topMembers.map((member, index) => (
              <div
                key={member._id}
                className="p-4 hover:bg-slate-50/80 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getRankBadge(index)}
                  <img
                    src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=047857&color=fff`}
                    alt={member.name}
                    className="w-12 h-12 rounded-full aspect-square object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{member.name}</h4>
                    <p className="text-xs text-slate-500">{member.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold text-base text-emerald-900 font-sans block">
                    {formatCurrency(member.totalDeposited)}
                  </span>
                  <span className="text-[11px] text-slate-400">মোট সঞ্চয়</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
