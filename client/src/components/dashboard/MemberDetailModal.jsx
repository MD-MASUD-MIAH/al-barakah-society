import React from 'react';
import { X, Award, Phone, Mail, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const MemberDetailModal = ({ isOpen, onClose, member, rank }) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-sm w-full overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-sm text-white">সদস্য প্রোফাইল ও বিবরণ</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-white/80 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center space-y-4">
          {/* Strictly Circular Avatar */}
          <div className="relative inline-block">
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-20 h-20 rounded-full aspect-square object-cover ring-4 ring-gold-400 shadow-none mx-auto"
              />
            ) : (
              <div className="w-20 h-20 rounded-full aspect-square bg-emerald-900 text-gold-400 font-bold text-2xl flex items-center justify-center ring-4 ring-gold-400 mx-auto">
                {member.name?.charAt(0) || 'M'}
              </div>
            )}
            {rank && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold-500 text-emerald-950 font-bold text-xs flex items-center justify-center ring-2 ring-white">
                #{rank}
              </span>
            )}
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
            <div className="mt-1 flex items-center justify-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                অনুমোদিত সদস্য
              </span>
              {member.role === 'admin' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gold-100 text-gold-900 border border-gold-300">
                  <ShieldCheck className="w-3 h-3 text-gold-700" />
                  অ্যাডমিন
                </span>
              )}
            </div>
          </div>

          {/* Savings Box */}
          <div className="p-4 bg-emerald-50 rounded-[6px] border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
              সোসাইটি তহবিলে মোট সঞ্চয়
            </span>
            <p className="text-2xl font-extrabold text-emerald-950 font-sans mt-0.5">
              {formatCurrency(member.totalDeposited || 0)}
            </p>
          </div>

          {/* Contact Details */}
          <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 text-xs text-left space-y-2">
            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>মোবাইল: {member.phone || 'দেওয়া নেই'}</span>
            </div>
            {member.email && (
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>ইমেইল: {member.email}</span>
              </div>
            )}
            {member.createdAt && (
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>যোগদানের তারিখ: {formatDate(member.createdAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-[6px] transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
