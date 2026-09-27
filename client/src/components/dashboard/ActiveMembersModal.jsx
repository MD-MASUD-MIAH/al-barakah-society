import React, { useState, useEffect } from 'react';
import { Users, X, Search, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const ActiveMembersModal = ({ isOpen, onClose }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/approved');
      if (res.data.success) {
        setMembers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load active members:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredMembers = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-blue-600 text-white flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">অনুমোদিত সোসাইটি সদস্যবৃন্দ</h3>
              <p className="text-xs text-emerald-200">
                মোট সক্রিয় সদস্য: {members.length} জন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-white/80 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="নাম অথবা মোবাইল নম্বর দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-[6px] text-xs focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* List of members */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-3 border-emerald-900 border-t-gold-500 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">সদস্য তালিকা লোড হচ্ছে...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">কোনো সদস্য পাওয়া যায়নি</p>
          ) : (
            filteredMembers.map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between p-3 rounded-[6px] border border-slate-200 hover:border-emerald-600/40 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Round Avatar (User Requirement: strictly circular) */}
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full aspect-square object-cover ring-1 ring-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full aspect-square bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-sm shrink-0">
                      {member.name?.charAt(0) || 'M'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <span>{member.name}</span>
                      {member.role === 'admin' && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-gold-100 text-gold-800 rounded-[4px] border border-gold-300 flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3 text-gold-700" /> অ্যাডমিন
                        </span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{member.phone || '-'}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <span className="text-[10px] text-slate-400 block">মোট জমা</span>
                  <span className="text-xs font-bold text-emerald-900 font-sans">
                    {formatCurrency(member.totalDeposited || 0)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-[6px]"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
