import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Trash2,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import api from '../services/api';
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from '../utils/alerts';
import { formatCurrency, formatDate } from '../utils/formatters';

export const AdminMembersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (search) params.append('search', search);

      const { data } = await api.get(`/users?${params.toString()}`);
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleUpdateStatusOrRole = async (userId, updatePayload) => {
    try {
      const { data } = await api.patch(`/users/${userId}/manage`, updatePayload);
      if (data.success) {
        showSuccessAlert('সফল', 'সদস্যের তথ্য সফলভাবে আপডেট হয়েছে।');
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...updatePayload } : u))
        );
      }
    } catch (err) {
      showErrorAlert('ব্যর্থ হয়েছে', err.response?.data?.message || 'আপডেট করতে ব্যর্থ হয়েছে।');
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = await showConfirmAlert(
      'অ্যাকাউন্ট মুছে ফেলবেন?',
      `সতর্কতা: "${user.name}" এর অ্যাকাউন্ট ও সকল জমার রেকর্ড স্থায়ীভাবে মুছে যাবে। আপনি কি নিশ্চিত?`
    );
    if (!confirmed) return;

    try {
      const { data } = await api.delete(`/users/${user._id}`);
      if (data.success) {
        await showSuccessAlert('মুছে ফেলা হয়েছে', 'অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে।');
        setUsers((prev) => prev.filter((u) => u._id !== user._id));
      }
    } catch (err) {
      showErrorAlert('ব্যর্থ হয়েছে', err.response?.data?.message || 'অ্যাকাউন্ট মুছতে ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-800" />
          <span>সোসাইটি সদস্য ও রোল ব্যবস্থাপনা (Member Directory)</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          সকল সদস্যের তালিকা, পদবী ও অ্যাকাউন্ট স্ট্যাটাস (অনুমোদিত/স্থগিত) নিয়ন্ত্রণ
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200 shadow-none flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="নাম, ফোন বা ইমেইল দিয়ে সদস্য খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-emerald-900 text-white rounded-[6px] text-xs font-semibold hover:bg-emerald-950 transition-colors shadow-none"
          >
            সার্চ
          </button>
        </form>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="approved">অনুমোদিত (Approved)</option>
            <option value="pending">অপেক্ষমাণ (Pending)</option>
            <option value="suspended">স্থগিত (Suspended)</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          >
            <option value="all">সকল পদবী</option>
            <option value="member">সাধারণ সদস্য</option>
            <option value="admin">অ্যাডমিন</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      {loading ? (
        <div className="bg-white rounded-[6px] p-12 text-center border border-slate-200 shadow-none">
          <div className="w-10 h-10 border-4 border-emerald-900 border-t-gold-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-600">সদস্য তালিকা লোড হচ্ছে...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[6px] border border-slate-200 shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">সদস্যের নাম ও তথ্য</th>
                  <th className="py-3 px-4">যোগাযোগ</th>
                  <th className="py-3 px-4">মোট জমা</th>
                  <th className="py-3 px-4">রোল / পদবী</th>
                  <th className="py-3 px-4">অ্যাকাউন্ট স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-center">মুছুন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {item.avatar ? (
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-9 h-9 rounded-full aspect-square object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full aspect-square bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs shrink-0">
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            যোগদান: {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">{item.phone}</p>
                      <p className="text-slate-500">{item.email}</p>
                    </td>

                    {/* Total Deposited */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-sm text-emerald-900 font-sans">
                        {formatCurrency(item.totalDeposited || 0)}
                      </span>
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={item.role}
                        onChange={(e) =>
                          handleUpdateStatusOrRole(item._id, { role: e.target.value })
                        }
                        className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-800"
                      >
                        <option value="member">সদস্য (Member)</option>
                        <option value="admin">অ্যাডমিন (Admin)</option>
                      </select>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleUpdateStatusOrRole(item._id, { status: e.target.value })
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none ${
                          item.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : item.status === 'pending'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-red-50 text-red-800 border-red-200'
                        }`}
                      >
                        <option value="approved">অনুমোদিত (Approved)</option>
                        <option value="pending">অপেক্ষমাণ (Pending)</option>
                        <option value="suspended">স্থগিত (Suspended)</option>
                        <option value="rejected">বাতিল (Rejected)</option>
                      </select>
                    </td>

                    {/* Delete Action */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteUser(item)}
                        title="অ্যাকাউন্ট মুছে ফেলুন"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
