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
  _isApproved,
  _isAdmin,
}) => {
  const primaryServices = [
    { id: 'balance', label: '??????? ?????', icon: Wallet, iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', onClick: onOpenBalance },
    { id: 'record-deposit', label: '??? ??????', icon: PlusCircle, iconBg: 'bg-gold-50 text-amber-700 border-amber-200/60', onClick: onOpenDepositModal },
    { id: 'ledger', label: '????? ???????', icon: Receipt, iconBg: 'bg-teal-50 text-teal-700 border-teal-200/60', onClick: onOpenLedger },
    { id: 'my-deposits', label: '???? ???', icon: TrendingUp, iconBg: 'bg-blue-50 text-blue-700 border-blue-200/60', onClick: onOpenMyDeposits },
  ];

  const secondaryServices = [
    { id: 'active-members', label: '????? ??????', icon: Users, iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60', onClick: onOpenActiveMembers },
    { id: 'this-month', label: '???? ???', icon: CalendarCheck, iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', onClick: onOpenThisMonth },
    { id: 'leaderboard', label: '???? ???????', icon: Award, iconBg: 'bg-amber-50 text-amber-700 border-amber-200/60', onClick: onOpenLeaderboard },
    { id: 'receipt-finder', label: '???? ???????', icon: Printer, iconBg: 'bg-cyan-50 text-cyan-700 border-cyan-200/60', onClick: onOpenReceiptFinder },
    { id: 'membership-apply', label: '????? ????', icon: FileCheck2, iconBg: 'bg-sky-50 text-sky-700 border-sky-200/60', onClick: onOpenApplyMembership },
    { id: 'notice-board', label: '????? ?????', icon: Megaphone, iconBg: 'bg-purple-50 text-purple-700 border-purple-200/60', onClick: onOpenNoticeBoard },
    { id: 'community', label: '????????', icon: MessageSquareText, iconBg: 'bg-pink-50 text-pink-700 border-pink-200/60', onClick: onOpenCommunity },
    { id: 'shariah', label: '??????? ????', icon: ShieldCheck, iconBg: 'bg-emerald-50 text-emerald-800 border-emerald-300/60', onClick: onOpenShariahPolicy },
  ];

  const ServiceCard = ({ item }) => {
    const Icon = item.icon;
    return (
      <button
        type="button"
        onClick={item.onClick}
        className="group flex flex-col items-center justify-start gap-1 p-1 sm:p-3 rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-all duration-150 cursor-pointer focus:outline-none w-full"
      >
        <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center border flex-shrink-0 transition-transform duration-200 group-hover:scale-105 group-active:scale-95 shadow-2xs ${item.iconBg}`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
        </div>
        <span className="text-[9px] leading-tight sm:text-xs font-semibold text-slate-700 group-hover:text-emerald-900 transition-colors text-center w-full line-clamp-2">
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-3 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">?????? ???? ? ?????????</span>
          <span className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">????? ? ??????</span>
        </div>
        <div className="grid grid-cols-4 gap-1 sm:gap-4">
          {primaryServices.map((item) => (<ServiceCard key={item.id} item={item} />))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-3 sm:p-6 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">??????? ??????? ? ?????????</span>
          <span className="text-[11px] text-slate-500 font-medium">????? ????</span>
        </div>
        <div className="grid grid-cols-4 gap-1 sm:gap-4">
          {secondaryServices.map((item) => (<ServiceCard key={item.id} item={item} />))}
        </div>
      </div>
    </div>
  );
};
