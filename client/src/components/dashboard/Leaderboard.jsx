import React from 'react';
import { Award, Trophy, Medal, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const Leaderboard = ({ topMembers = [], onMemberClick }) => {
  const getRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <div className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-xs shrink-0">
            ১
          </div>
        );
      case 1:
        return (
          <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-xs shrink-0">
            ২
          </div>
        );
      case 2:
        return (
          <div className="w-6 h-6 rounded-full bg-amber-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
            ৩
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-semibold flex items-center justify-center text-xs shrink-0">
            {index + 1}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-[6px] p-5 border border-slate-200 shadow-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[6px] bg-amber-100 text-amber-800 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">শীর্ষ সঞ্চয়কারী সদস্য</h4>
            <p className="text-[10px] text-slate-500 font-medium">সর্বোচ্চ তহবিল জমাদানকারী</p>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-[4px] border border-emerald-200">
          লিডারবোর্ড
        </span>
      </div>

      <div className="space-y-2">
        {topMembers.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">তথ্য পাওয়া যায়নি</p>
        ) : (
          topMembers.map((member, index) => (
            <div
              key={member._id}
              onClick={() => onMemberClick && onMemberClick(member, index)}
              className="flex items-center justify-between p-2 rounded-[6px] hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 cursor-pointer group"
              title="সদস্যের বিস্তারিত দেখতে ক্লিক করুন"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {getRankBadge(index)}
                {/* 100% Round Avatar */}
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full aspect-square object-cover ring-1 ring-slate-200 shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full aspect-square bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs shrink-0">
                    {member.name?.charAt(0) || 'M'}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-xs text-slate-900 leading-tight truncate group-hover:text-emerald-800">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">{member.phone}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-bold text-xs text-emerald-900 font-sans">
                  {formatCurrency(member.totalDeposited)}
                </p>
                <span className="text-[9px] text-slate-400 uppercase">মোট ফান্ড</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
