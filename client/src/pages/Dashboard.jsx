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
  Receipt,
  Sparkles,
  ChevronRight,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { ServiceHubGrid } from '../components/dashboard/ServiceHubGrid';
import { TransactionDrawerModal } from '../components/common/TransactionDrawerModal';
import { ReceiptModal } from '../components/common/ReceiptModal';
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
  const [userDeposits, setUserDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transaction Drawer & Receipt Modal state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchUserDeposits();
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

  const fetchUserDeposits = async () => {
    try {
      const { data } = await api.get('/deposits/my-deposits');
      if (data.success) {
        setUserDeposits(data.deposits || []);
      }
    } catch (err) {
      console.error('Failed to load user deposits for drawer:', err);
    }
  };

  const handleOpenReceipt = (receipt) => {
    setSelectedReceipt(receipt);
    setReceiptModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner inspired by Cellfin: Greeting, Brand Badge & Balance Pill Button */}
      <div className="relative rounded-xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-5 sm:p-6 text-white border border-gold-500/30 shadow-sm overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded-full bg-gold-400 text-emerald-950 text-[11px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                আল-বারাকাহ সোসাইটি
              </span>
              <span className="text-[11px] text-emerald-200">
                {isAdmin
                  ? 'অ্যাডমিন ড্যাশবোর্ড'
                  : isApproved
                  ? 'সদস্য পোর্টাল'
                  : 'সাধারণ পোর্টাল'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {user?.name || 'সম্মানিত সদস্য'}
              </h1>

              {/* Cellfin-style Interactive Balance Pill Button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="group inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 font-bold text-xs rounded-full shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="লেনদেন বিবরণী দেখতে ক্লিক করুন"
              >
                <span className="w-4 h-4 rounded-full bg-emerald-950 text-gold-300 flex items-center justify-center text-[10px] font-bold">
                  ৳
                </span>
                <span>ব্যালেন্স</span>
                <span className="text-[11px] text-emerald-950/70 font-semibold group-hover:text-emerald-950">
                  {formatCurrency(user?.totalDeposited || 0)}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Actions (Less Clutter) */}
          <div className="flex flex-wrap items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => navigate('/add-deposit')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-gold-400 to-amber-500 hover:bg-gold-300 text-emerald-950 font-bold text-xs rounded-lg transition-all shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-emerald-950" />
                <span>জমা রেকর্ড</span>
              </button>
            )}

            {isApproved || isAdmin ? (
              <Link
                to="/ledger"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-850 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg border border-gold-500/30 transition-all"
              >
                <Receipt className="w-4 h-4 text-gold-400" />
                <span>লেজার</span>
              </Link>
            ) : (
              <Link
                to="/apply-membership"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gold-400 hover:bg-gold-300 text-emerald-950 font-bold text-xs rounded-lg transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>সদস্যপদ আবেদন</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Minimal Membership Callout for non-approved users */}
      {!isApproved && !isAdmin && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                {user?.status === 'pending'
                  ? 'আপনার সদস্যপদ আবেদন প্রক্রিয়াধীন রয়েছে'
                  : 'সোসাইটির পূর্ণাঙ্গ সদস্য হতে আবেদন করুন'}
              </h3>
              <p className="text-[11px] text-slate-600">
                অনুমোদন পাওয়ার পর আর্থিক হিসাব ও সকল সুবিধা দেখতে পারবেন।
              </p>
            </div>
          </div>

          <Link
            to="/apply-membership"
            className="shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-lg transition-all"
          >
            <span>{user?.status === 'pending' ? 'আবেদনের বিবরণ' : 'আবেদন ফরম'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
          </Link>
        </div>
      )}

      {/* Cellfin-style Service Hub Grid */}
      <ServiceHubGrid
        onOpenBalance={() => navigate('/fund')}
        onOpenActiveMembers={() => navigate('/members')}
        onOpenThisMonth={() => navigate('/monthly-report')}
        onOpenDepositModal={() => {
          if (isAdmin) {
            navigate('/add-deposit');
          } else {
            setDrawerOpen(true);
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
        onOpenMyDeposits={() => setDrawerOpen(true)}
        isApproved={isApproved}
        isAdmin={isAdmin}
      />

      {/* Summary Stat Cards Grid (Positioned at bottom above footer - 2 columns on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-1">
        {/* 1. Total Society Balance */}
        <StatCard
          title="সোসাইটি ফান্ড"
          value={formatCurrency(stats.totalBalance)}
          subtitle="সর্বমোট সংগৃহীত সঞ্চয়"
          icon={Wallet}
          colorTheme="emerald"
          onClick={() => navigate('/fund')}
        />

        {/* 2. Active Members */}
        <StatCard
          title="অনুমোদিত সদস্য"
          value={`${stats.activeMembersCount} জন`}
          subtitle="যাচাইকৃত সক্রিয় সদস্য"
          icon={Users}
          colorTheme="blue"
          onClick={() => navigate('/members')}
        />

        {/* 3. This Month's Collection */}
        <StatCard
          title="চলতি মাসের জমা"
          value={formatCurrency(stats.thisMonthTotal)}
          subtitle="বর্তমান মাসের মোট আদায়"
          icon={CalendarCheck}
          colorTheme="gold"
          onClick={() => navigate('/monthly-report')}
        />

        {/* 4. Dynamic Fourth Card -> Triggers Transaction Drawer on Click */}
        {isAdmin ? (
          <StatCard
            title="অনুরোধ অপেক্ষমাণ"
            value={`${(pendingCount !== undefined && pendingCount !== null) ? pendingCount : (stats.pendingMembersCount || 0)} জন`}
            subtitle="নতুন সদস্য নিবন্ধন"
            icon={UserCheck}
            colorTheme={((pendingCount || stats.pendingMembersCount || 0) > 0) ? 'purple' : 'emerald'}
            badgeText={((pendingCount || stats.pendingMembersCount || 0) > 0) ? 'যাচাই প্রয়োজন' : 'অনুমোদিত'}
            onClick={() => navigate('/admin/approvals')}
          />
        ) : (
          <StatCard
            title="আপনার মোট জমা"
            value={formatCurrency(user?.totalDeposited || 0)}
            subtitle="লেনদেন বিবরণী দেখুন"
            icon={TrendingUp}
            colorTheme="emerald"
            onClick={() => setDrawerOpen(true)}
          />
        )}
      </div>

      {/* Slide-over Transaction Drawer Modal */}
      <TransactionDrawerModal
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        deposits={userDeposits}
        totalBalance={user?.totalDeposited || 0}
        userName={user?.name}
        onViewReceipt={handleOpenReceipt}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receiptData={selectedReceipt}
      />
    </div>
  );
};
