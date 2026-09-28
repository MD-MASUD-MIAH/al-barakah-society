import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  Users,
  CalendarCheck,
  TrendingUp,
  PlusCircle,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Megaphone,
  Receipt,
  Sparkles,
  Award,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { ServiceHubGrid } from '../components/dashboard/ServiceHubGrid';
import { formatCurrency } from '../utils/formatters';

export const Dashboard = () => {
  const { user, isAdmin, isApproved, pendingCount } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBalance: 0,
    activeMembersCount: 0,
    thisMonthTotal: 0,
    topMembers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsRes = await api.get('/deposits/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner (User Requirement: border-radius 6px, no box shadow) */}
      <div className="relative rounded-[6px] bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-5 sm:p-7 text-white shadow-none overflow-hidden border border-gold-500/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-[4px] bg-gold-400 text-emerald-950 text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                বিশ্বাসের বন্ধন
              </span>
              <span className="text-xs text-emerald-200">
                {isAdmin
                  ? 'ম্যানেজমেন্ট কন্ট্রোল প্যানেল'
                  : isApproved
                  ? 'সদস্য ড্যাশবোর্ড'
                  : 'সাধারণ একাউন্ট পোর্টাল'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              আসসালামু আলাইকুম, {user?.name}!
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-emerald-200/90 max-w-xl leading-relaxed">
              আল-বারাকাহ সোসাইটির আর্থিক ফান্ড ও কমিউনিটি পোর্টাল। স্বচ্ছতা ও আমানতদারিতার সাথে প্রতিটি লেনদেন সংরক্ষিত।
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {isAdmin && (
              <button
                onClick={() => navigate('/add-deposit')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-400 to-amber-500 text-emerald-950 font-bold text-xs rounded-[6px] shadow-none hover:bg-gold-400 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-emerald-950" />
                <span>জমা রেকর্ড করুন</span>
              </button>
            )}

            {isApproved || isAdmin ? (
              <Link
                to="/ledger"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-xs rounded-[6px] border border-gold-500/40 transition-all"
              >
                <Receipt className="w-4 h-4 text-gold-400" />
                <span>সম্পূর্ণ লেজার দেখুন</span>
              </Link>
            ) : (
              <Link
                to="/apply-membership"
                className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-400 text-emerald-950 font-bold text-xs rounded-[6px] transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>সদস্যপদ আবেদন ফরম</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Membership Callout for non-approved users */}
      {!isApproved && !isAdmin && (
        <div className="rounded-[6px] border-2 border-gold-400 bg-amber-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {user?.status === 'pending'
                  ? 'আপনার সদস্যপদ আবেদন পর্যালোচনায় রয়েছে'
                  : 'সোসাইটির পূর্ণাঙ্গ সদস্য হতে আবেদন করুন'}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {user?.status === 'pending'
                  ? 'আপনার আবেদনটি অ্যাডমিন অনুমোদনের অপেক্ষায় রয়েছে। অনুমোদন পাওয়ার পর আর্থিক হিসাব ও সকল সুবিধা দেখতে পারবেন।'
                  : 'লগইন ও রেজিস্ট্রেশন সম্পন্ন হয়েছে। সোসাইটির সদস্যপদ পেতে আলাদা ফরমটি পূরণ করে আবেদন দাখিল করুন।'}
              </p>
            </div>
          </div>

          <Link
            to="/apply-membership"
            className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] transition-all"
          >
            <span>{user?.status === 'pending' ? 'আবেদনের বিবরণ দেখুন' : 'সদস্যপদ আবেদন ফরম'}</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </Link>
        </div>
      )}

      {/* Summary Stat Cards Grid (Navigates to dedicated pages on click) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Society Balance -> Navigates to /fund */}
        <StatCard
          title="মোট জমা ফান্ড (Society Balance)"
          value={formatCurrency(stats.totalBalance)}
          subtitle="সোসাইটির সর্বমোট সংগৃহীত সঞ্চয়"
          icon={Wallet}
          colorTheme="emerald"
          onClick={() => navigate('/fund')}
        />

        {/* 2. Active Members -> Navigates to /members */}
        <StatCard
          title="অনুমোদিত সদস্য (Active Members)"
          value={`${stats.activeMembersCount} জন`}
          subtitle="যাচাইকৃত সক্রিয় সোসাইটি সদস্য"
          icon={Users}
          colorTheme="blue"
          onClick={() => navigate('/members')}
        />

        {/* 3. This Month's Collection -> Navigates to /monthly-report */}
        <StatCard
          title="চলতি মাসের জমা (This Month)"
          value={formatCurrency(stats.thisMonthTotal)}
          subtitle="বর্তমান মাসের সর্বমোট আদায়"
          icon={CalendarCheck}
          colorTheme="gold"
          onClick={() => navigate('/monthly-report')}
        />

        {/* 4. Dynamic Fourth Card */}
        {isAdmin ? (
          <StatCard
            title="অনুমোদন অপেক্ষমাণ (Pending)"
            value={`${(pendingCount !== undefined && pendingCount !== null) ? pendingCount : (stats.pendingMembersCount || 0)} জন`}
            subtitle="নতুন সদস্য নিবন্ধন আবেদন"
            icon={UserCheck}
            colorTheme={((pendingCount || stats.pendingMembersCount || 0) > 0) ? 'purple' : 'emerald'}
            badgeText={((pendingCount || stats.pendingMembersCount || 0) > 0) ? 'পর্যালোচনা প্রয়োজন' : 'সব অনুমোদিত'}
            onClick={() => navigate('/admin/approvals')}
          />
        ) : (
          <StatCard
            title="আপনার মোট জমা (My Deposit)"
            value={formatCurrency(user?.totalDeposited || 0)}
            subtitle="আপনার তহবিলের বর্তমান ব্যালেন্স"
            icon={TrendingUp}
            colorTheme="emerald"
            onClick={() => navigate('/my-deposits')}
          />
        )}
      </div>

      {/* Reference-Style Action / Service Hub Grid (Navigates to dedicated pages on click) */}
      <ServiceHubGrid
        onOpenBalance={() => navigate('/fund')}
        onOpenActiveMembers={() => navigate('/members')}
        onOpenThisMonth={() => navigate('/monthly-report')}
        onOpenDepositModal={() => {
          if (isAdmin) {
            navigate('/add-deposit');
          } else {
            navigate('/my-deposits');
          }
        }}
        onOpenLedger={() => {
          if (isApproved || isAdmin) {
            navigate('/ledger');
          } else {
            navigate('/apply-membership');
          }
        }}
        onOpenLeaderboard={() => navigate('/leaderboard')}
        onOpenApplyMembership={() => navigate('/apply-membership')}
        onOpenNoticeBoard={() => navigate('/notices')}
        onOpenReceiptFinder={() => navigate('/receipts')}
        onOpenCommunity={() => {
          if (isApproved || isAdmin) {
            navigate('/community');
          } else {
            navigate('/apply-membership');
          }
        }}
        onOpenShariahPolicy={() => navigate('/shariah-policy')}
        onOpenMyDeposits={() => navigate('/my-deposits')}
        isApproved={isApproved}
        isAdmin={isAdmin}
      />

    </div>
  );
};

