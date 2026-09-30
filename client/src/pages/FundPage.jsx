import React, { useState, useEffect } from 'react';
import { Wallet, Smartphone, Landmark, Banknote, ArrowLeft, RefreshCw, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

export const FundPage = () => {
  const [stats, setStats] = useState({ totalBalance: 0 });
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFundData();
  }, []);

  const fetchFundData = async () => {
    try {
      setLoading(true);
      const [statsRes, depRes] = await Promise.all([
        api.get('/deposits/stats'),
        api.get('/deposits?limit=100'),
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (depRes.data.success) setDeposits(depRes.data.deposits);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const channelBreakdown = deposits.reduce(
    (acc, item) => {
      const method = item.paymentMethod || 'cash';
      if (!acc[method]) acc[method] = { amount: 0, count: 0 };
      acc[method].amount += Number(item.amount || 0);
      acc[method].count += 1;
      return acc;
    },
    {
      bkash: { amount: 0, count: 0 },
      nagad: { amount: 0, count: 0 },
      bank: { amount: 0, count: 0 },
      cash: { amount: 0, count: 0 },
    }
  );

  const channels = [
    {
      id: 'bkash',
      name: 'বিকাশ (bKash)',
      amount: channelBreakdown.bkash?.amount || 0,
      count: channelBreakdown.bkash?.count || 0,
      icon: Smartphone,
      color: 'bg-pink-50 text-pink-700 border-pink-200',
    },
    {
      id: 'nagad',
      name: 'নগদ (Nagad)',
      amount: channelBreakdown.nagad?.amount || 0,
      count: channelBreakdown.nagad?.count || 0,
      icon: Smartphone,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
    },
    {
      id: 'bank',
      name: 'ব্যাংক হিসাব (Bank)',
      amount: channelBreakdown.bank?.amount || 0,
      count: channelBreakdown.bank?.count || 0,
      icon: Landmark,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'cash',
      name: 'নগদ ক্যাশ (Office Cash)',
      amount: channelBreakdown.cash?.amount || 0,
      count: channelBreakdown.cash?.count || 0,
      icon: Banknote,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
  ];

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
              <span>সোসাইটি ফান্ড হিসাব (Society Fund Details)</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              সোসাইটির সংগৃহীত সকল তহবিলের মাধ্যমভিত্তিক পূর্ণাঙ্গ হিসাব
            </p>
          </div>
        </div>

        <button
          onClick={fetchFundData}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-[6px] border border-slate-300 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ করুন</span>
        </button>
      </div>

      {/* Main Balance Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-emerald-900 rounded-[6px] p-6 text-white border border-gold-500/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
          সোসাইটির সর্বমোট সংগৃহীত সঞ্চয় তহবিল
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gold-300 font-sans mt-1">
          {formatCurrency(stats.totalBalance || 0)}
        </h2>
        <p className="text-xs text-emerald-200/80 mt-2">
          শতভাগ আমানতদারিতা ও সুদমুক্ত নীতিমালার ভিত্তিতে সংরক্ষিত। মোট সফল এন্ট্রি: {deposits.length} টি।
        </p>
      </div>

      {/* Channel Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((ch) => {
          const Icon = ch.icon;
          const percentage = stats.totalBalance > 0 ? ((ch.amount / stats.totalBalance) * 100).toFixed(1) : 0;
          return (
            <div
              key={ch.id}
              className="bg-white rounded-[6px] p-5 border border-slate-200 shadow-none space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-[6px] flex items-center justify-center border ${ch.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-500">{percentage}%</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase">{ch.name}</h3>
                <p className="text-xl font-bold text-slate-900 font-sans mt-0.5">
                  {formatCurrency(ch.amount)}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
                <span>মোট লেনদেন:</span>
                <span className="font-semibold text-slate-800">{ch.count} টি</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
