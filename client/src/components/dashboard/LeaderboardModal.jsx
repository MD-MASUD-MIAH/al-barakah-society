import React from 'react';
import { X, Trophy, Award } from 'lucide-react';
import { Leaderboard } from './Leaderboard';

export const LeaderboardModal = ({ isOpen, onClose, topMembers = [], onMemberClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[6px] bg-amber-400 text-emerald-950 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">শীর্ষ সঞ্চয়কারী লিডারবোর্ড</h3>
              <p className="text-[11px] text-gold-300">সোসাইটির সর্বোচ্চ তহবিল জমাকারী সদস্যগণ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-white/80 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 flex-1 overflow-y-auto">
          <Leaderboard topMembers={topMembers} onMemberClick={onMemberClick} />
        </div>
      </div>
    </div>
  );
};
