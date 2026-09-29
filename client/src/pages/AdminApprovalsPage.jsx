import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  CheckCircle,
  XCircle,
  Trash2,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from '../utils/alerts';
import { formatDate } from '../utils/formatters';

export const AdminApprovalsPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const { fetchPendingCount } = useAuth();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/pending');
      if (data.success) {
        setPendingUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load pending users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (user) => {
    try {
      setProcessingId(user._id);
      const { data } = await api.put(`/users/${user._id}/approve`);
      if (data.success) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0F5132', '#D4AF37', '#166534'],
        });

        await showSuccessAlert(
          'অনুমোদিত হয়েছে!',
          `"${user.name}" সফলভাবে অনুমোদিত সদস্য হিসেবে তালিকাভুক্ত হয়েছেন।`
        );
        setPendingUsers((prev) => prev.filter((u) => u._id !== user._id));
        fetchPendingCount();
      }
    } catch (err) {
      showErrorAlert('ব্যর্থ হয়েছে', err.response?.data?.message || 'অনুমোদন করতে ব্যর্থ হয়েছে।');
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectOrDelete = async (user, actionType = 'delete') => {
    const title = actionType === 'delete' ? 'নিবন্ধন মুছে ফেলবেন?' : 'আবেদন বাতিল করবেন?';
    const text =
      actionType === 'delete'
        ? `আপনি কি নিশ্চিতভাবে "${user.name}" এর রেজিস্ট্রেশন সম্পূর্ণ মুছে ফেলতে চান?`
        : `আপনি কি "${user.name}" এর আবেদন বাতিল করতে চান?`;

    const confirmed = await showConfirmAlert(title, text);
    if (!confirmed) return;

    try {
      setProcessingId(user._id);
      if (actionType === 'delete') {
        await api.delete(`/users/${user._id}`);
      } else {
        await api.put(`/users/${user._id}/reject`);
      }

      await showSuccessAlert(
        'সম্পন্ন হয়েছে',
        `"${user.name}" এর আবেদন ${actionType === 'delete' ? 'মুছে ফেলা' : 'বাতিল করা'} হয়েছে।`
      );

      setPendingUsers((prev) => prev.filter((u) => u._id !== user._id));
      fetchPendingCount();
    } catch (err) {
      showErrorAlert('ব্যর্থ হয়েছে', 'অনুরোধটি সম্পন্ন করা যায়নি।');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-800" />
            <span>সদস্য নিবন্ধন অনুমোদন রিকোয়েস্ট (Approval Requests)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            নতুন সদস্যের রেজিস্ট্রেশন যাচাই ও তাৎক্ষণিক অনুমোদন বা বাতিলের নিয়ন্ত্রণ
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold self-start sm:self-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
          <span>অপেক্ষমাণ: {pendingUsers.length} জন</span>
        </span>
      </div>

      {/* Feedback Alert */}
      {feedback.message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-blue-50 text-blue-900 border border-blue-200'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            onClick={() => setFeedback({ type: '', message: '' })}
            className="text-slate-400 hover:text-slate-700 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Pending List Cards or Table */}
      {loading ? (
        <div className="bg-white rounded-[6px] p-12 text-center border border-slate-200 shadow-none">
          <div className="w-10 h-10 border-4 border-emerald-900 border-t-gold-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-600">অনুমোদনের তালিকা লোড হচ্ছে...</p>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="bg-white rounded-[6px] p-12 text-center border border-slate-200 shadow-none space-y-3">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-800">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">কোনো অপেক্ষমাণ অনুমোদন নেই</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            এই মুহূর্তে নতুন কোনো সদস্যের রেজিস্ট্রেশন আবেদন পেন্ডিং নেই। সকল আবেদন পর্যালোচনা সম্পন্ন হয়েছে।
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-[6px] p-5 border border-slate-200 shadow-none space-y-3.5 relative overflow-hidden"
            >
              <div className="flex items-center gap-3">
                {/* 100% Round Avatar */}
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full aspect-square object-cover ring-2 ring-gold-400 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full aspect-square bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-lg shrink-0">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">
                    {user.name}
                  </h4>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-[4px] border border-amber-200 inline-block mt-0.5">
                    সদস্যপদ আবেদন অপেক্ষমাণ
                  </span>
                </div>
              </div>

              {/* User details */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-[6px] border border-slate-200">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <span className="font-medium text-slate-900">{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>

                {user.membershipDetails?.nid && (
                  <div className="text-[11px] pt-1 border-t border-slate-200 text-slate-700">
                    <span className="text-slate-500">NID:</span> {user.membershipDetails.nid}
                  </div>
                )}
                {user.membershipDetails?.occupation && (
                  <div className="text-[11px] text-slate-700">
                    <span className="text-slate-500">পেশা:</span> {user.membershipDetails.occupation}
                  </div>
                )}
                {user.membershipDetails?.currentAddress && (
                  <div className="text-[11px] text-slate-700">
                    <span className="text-slate-500">ঠিকানা:</span> {user.membershipDetails.currentAddress}
                  </div>
                )}
                {user.membershipDetails?.nomineeName && (
                  <div className="text-[11px] text-slate-700">
                    <span className="text-slate-500">নমিনি:</span> {user.membershipDetails.nomineeName} ({user.membershipDetails.nomineeRelation || 'সম্পর্ক'})
                  </div>
                )}
                {user.membershipDetails?.monthlyPledge > 0 && (
                  <div className="text-[11px] text-slate-700">
                    <span className="text-slate-500">মাসিক সঞ্চয় অঙ্গীকার:</span>{' '}
                    <span className="font-bold text-emerald-800 font-sans">
                      ৳{user.membershipDetails.monthlyPledge.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="pt-1 flex items-center gap-2">
                {/* Approve Button */}
                <button
                  onClick={() => handleApprove(user)}
                  disabled={processingId === user._id}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] shadow-none transition-all disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4 text-gold-400" />
                  <span>অনুমোদন করুন</span>
                </button>

                {/* Reject / Delete Button */}
                <button
                  onClick={() => handleRejectOrDelete(user, 'delete')}
                  disabled={processingId === user._id}
                  title="আবেদন মুছে ফেলুন"
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-[6px] border border-red-200 transition-colors disabled:opacity-50 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
