import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, ArrowLeft, RefreshCw, CheckCircle2, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { MemberApplicationModal } from '../components/members/MemberApplicationModal';

export const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/approved');
      const list = res.data.members || res.data.users || [];
      if (res.data.success) {
        setMembers(list);
      }
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const filtered = members.filter(
    (m) =>
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            অনুমোদিত সোসাইটি সদস্যবৃন্দ (Active Members)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            আল-বারাকাহ সোসাইটির সক্রিয় ও যাচাইকৃত সদস্য তালিকা (ফরম দেখতে কার্ডে ক্লিক করুন)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-[6px]">
            মোট: {members.length} জন
          </span>
          <button
            onClick={fetchMembers}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-[6px] border border-slate-300 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-[6px] border border-emerald-700 transition-all shadow-sm"
            title="ড্যাশবোর্ডে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ফিরে যান</span>
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200 shadow-none">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="সদস্যের নাম, মোবাইল নম্বর বা ইমেইল দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">সদস্যদের তথ্য লোড হচ্ছে...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-500 bg-white rounded-[6px] border border-slate-200">
          কোনো সদস্য পাওয়া যায়নি
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <div
              key={m._id}
              onClick={() => handleCardClick(m)}
              className="bg-white rounded-[6px] p-5 border border-slate-200 shadow-none space-y-3 hover:border-emerald-700 hover:shadow-md transition-all cursor-pointer group relative"
              title="আবেদন ফরম দেখতে ক্লিক করুন"
            >
              <div className="flex items-center gap-3">
                <img
                  src={m.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=047857&color=fff`}
                  alt={m.name}
                  className="w-12 h-12 rounded-full aspect-square object-cover border border-emerald-700/30 ring-2 ring-transparent group-hover:ring-emerald-600/30 transition-all"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-emerald-900 transition-colors">
                      {m.name}
                    </h3>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{m.email}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>মোবাইল:</span>
                  </span>
                  <span className="font-semibold text-slate-900">{m.phone}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>মোট জমাকৃত তহবিল:</span>
                  <span className="font-bold text-emerald-900 font-sans">
                    {formatCurrency(m.totalDeposited || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>সদস্যপদ যোগদানের তারিখ:</span>
                  <span className="text-[11px] text-slate-500">{formatDate(m.createdAt)}</span>
                </div>
              </div>

              {/* View Application Form Prompt */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-bold group-hover:text-emerald-950 flex items-center gap-1.5 transition-colors">
                  <FileText className="w-3.5 h-3.5 text-emerald-700" />
                  <span>আবেদন ফরম দেখুন</span>
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-emerald-700 font-semibold transition-colors">
                  ক্লিক করুন &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Member Application Form Modal */}
      <MemberApplicationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
      />
    </div>
  );
};
