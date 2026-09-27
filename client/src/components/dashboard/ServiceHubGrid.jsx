import React from 'react';
import {
  Wallet,
  Users,
  CalendarCheck,
  PlusCircle,
  Receipt,
  Award,
  FileCheck2,
  Megaphone,
  Printer,
  MessageSquareText,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const ServiceHubGrid = ({
  onOpenBalance,
  onOpenActiveMembers,
  onOpenThisMonth,
  onOpenDepositModal,
  onOpenLedger,
  onOpenLeaderboard,
  onOpenApplyMembership,
  onOpenNoticeBoard,
  onOpenReceiptFinder,
  onOpenCommunity,
  onOpenShariahPolicy,
  onOpenMyDeposits,
  isApproved,
  isAdmin,
}) => {
  const cards = [
    {
      id: 'balance',
      title: 'সোসাইটি ফান্ড হিসাব',
      subtitle: 'সোসাইটির মোট ব্যালেন্স',
      icon: Wallet,
      iconBg: 'bg-emerald-500/15 text-emerald-700 border-emerald-400/40',
      badgeColor: 'text-emerald-800',
      onClick: onOpenBalance,
    },
    {
      id: 'active-members',
      title: 'সক্রিয় সদস্য তালিকা',
      subtitle: 'অনুমোদিত সদস্য ডিরেক্টরি',
      icon: Users,
      iconBg: 'bg-blue-500/15 text-blue-700 border-blue-400/40',
      badgeColor: 'text-blue-800',
      onClick: onOpenActiveMembers,
    },
    {
      id: 'this-month',
      title: 'চলতি মাসের জমা',
      subtitle: 'বর্তমান মাসের মোট আদায়',
      icon: CalendarCheck,
      iconBg: 'bg-amber-500/15 text-amber-700 border-amber-400/40',
      badgeColor: 'text-amber-800',
      onClick: onOpenThisMonth,
    },
    {
      id: 'record-deposit',
      title: 'নতুন জমা রেকর্ড',
      subtitle: 'তহবিলে অর্থ এন্ট্রি করুন',
      icon: PlusCircle,
      iconBg: 'bg-rose-500/15 text-rose-700 border-rose-400/40',
      badgeColor: 'text-rose-800',
      onClick: onOpenDepositModal,
    },
    {
      id: 'ledger',
      title: 'আর্থিক লেজার খতিয়ান',
      subtitle: 'সকল জমার পুঙ্খানুপুঙ্খ বিবরণ',
      icon: Receipt,
      iconBg: 'bg-teal-500/15 text-teal-700 border-teal-400/40',
      badgeColor: 'text-teal-800',
      onClick: onOpenLedger,
    },
    {
      id: 'leaderboard',
      title: 'শীর্ষ সঞ্চয়কারী',
      subtitle: 'সর্বোচ্চ তহবিল জমাকারী তালিকা',
      icon: Award,
      iconBg: 'bg-yellow-500/15 text-yellow-700 border-yellow-400/40',
      badgeColor: 'text-yellow-800',
      onClick: onOpenLeaderboard,
    },
    {
      id: 'membership-apply',
      title: 'সদস্যপদ আবেদন',
      subtitle: 'নতুন মেম্বারশিপ নিবন্ধন ফরম',
      icon: FileCheck2,
      iconBg: 'bg-indigo-500/15 text-indigo-700 border-indigo-400/40',
      badgeColor: 'text-indigo-800',
      onClick: onOpenApplyMembership,
    },
    {
      id: 'notice-board',
      title: 'নোটিশ ও ঘোষণা',
      subtitle: 'সোসাইটির জরুরি আপডেট',
      icon: Megaphone,
      iconBg: 'bg-purple-500/15 text-purple-700 border-purple-400/40',
      badgeColor: 'text-purple-800',
      onClick: onOpenNoticeBoard,
    },
    {
      id: 'receipt-finder',
      title: 'ডিজিটাল রসিদ প্রিন্ট',
      subtitle: 'মানি রিসিট অনুসন্ধান ও প্রিন্ট',
      icon: Printer,
      iconBg: 'bg-cyan-500/15 text-cyan-700 border-cyan-400/40',
      badgeColor: 'text-cyan-800',
      onClick: onOpenReceiptFinder,
    },
    {
      id: 'community',
      title: 'কমিউনিটি চ্যাট',
      subtitle: 'সদস্যদের উন্মুক্ত আলোচনা ফোরাম',
      icon: MessageSquareText,
      iconBg: 'bg-pink-500/15 text-pink-700 border-pink-400/40',
      badgeColor: 'text-pink-800',
      onClick: onOpenCommunity,
    },
    {
      id: 'shariah',
      title: 'শরীয়াহ ও নীতিমালা',
      subtitle: 'সুদমুক্ত আমানতের শর্তাবলী',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/40',
      badgeColor: 'text-emerald-900',
      onClick: onOpenShariahPolicy,
    },
    {
      id: 'my-deposits',
      title: 'আমার জমার স্টেটমেন্ট',
      subtitle: 'ব্যক্তিগত জমার স্থিতি ও হিসাব',
      icon: TrendingUp,
      iconBg: 'bg-violet-500/15 text-violet-700 border-violet-400/40',
      badgeColor: 'text-violet-800',
      onClick: onOpenMyDeposits,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
            <span>সোসাইটি সার্ভিস ও অ্যাকশন হাব (Interactive Service Hub)</span>
          </h2>
          <p className="text-[11px] text-slate-500 font-medium">
            যে তথ্যটি বা সেবাটি দেখতে চান সরাসরি সেই কার্ডে ক্লিক করুন
          </p>
        </div>
        <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-100/70 px-2.5 py-1 rounded-[6px]">
          ১২ টি ফিচার
        </span>
      </div>

      {/* Grid of Reference-Style Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              style={{ animationDelay: `${index * 35}ms` }}
              className="aos-card-item group relative flex flex-col items-center justify-center p-4 sm:p-5 bg-white hover:bg-slate-50/80 border border-slate-200/90 hover:border-emerald-700/60 rounded-[6px] shadow-none transition-all duration-200 hover:-translate-y-0.5 text-center focus:outline-none focus:ring-2 focus:ring-emerald-700/30 cursor-pointer min-h-[125px] sm:min-h-[140px]"
            >
              {/* Centered Colored Icon Badge (Matching User Reference) */}
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 rounded-[6px] flex items-center justify-center border mb-2.5 transition-transform duration-200 group-hover:scale-110 ${item.iconBg}`}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              </div>

              {/* Title Underneath */}
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-950 transition-colors leading-tight">
                {item.title}
              </span>

              {/* Subtitle */}
              <span className="text-[10px] text-slate-400 group-hover:text-slate-600 mt-1 line-clamp-1 transition-colors">
                {item.subtitle}
              </span>

              {/* Subtle hover indicator */}
              <span className="absolute bottom-1.5 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-emerald-700 font-semibold transition-opacity">
                →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
