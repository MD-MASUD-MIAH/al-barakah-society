import React from 'react';
import { NoticeBoard } from '../components/chat/NoticeBoard';
import { Megaphone, Users, Shield, Sparkles, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CommunityPage = () => {
  const { onlineCount, user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-emerald-800" />
          <span>কমিউনিটি যোগাযোগ ও সাধারণ নোটিশবোর্ড</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          আল-বারাকাহ সোসাইটির সকল অনুমোদিত সদস্যদের উন্মুক্ত আলোচনা ও অফিসিয়াল নোটিশ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat/Notice Column (3 cols) */}
        <div className="lg:col-span-3">
          <NoticeBoard fullHeight={true} />
        </div>

        {/* Sidebar Info & Guidelines (1 col) */}
        <div className="space-y-6">
          {/* Online active card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">অনলাইন উপস্থিতি</p>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{onlineCount} জন সক্রিয়</span>
                </h4>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              রিয়েল-টাইমে নোটিশ ও চ্যাট সিঙ্ক হচ্ছে (Socket.io চালিত)।
            </p>
          </div>

          {/* Ethics & Guidelines */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-3xl p-5 text-white border border-gold-500/30 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-gold-400 font-bold text-xs">
              <Shield className="w-4 h-4" />
              <span>কমিউনিটি শিষ্টাচার ও নিয়মাবলী</span>
            </div>

            <ul className="text-xs text-emerald-200/80 space-y-2 leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-gold-400 font-bold">•</span>
                <span>সোসাইটির পারস্পরিক সৌহার্দ্য ও ইসলামী আদব বজায় রেখে মন্তব্য করুন।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-gold-400 font-bold">•</span>
                <span>কোনো অনাকাঙ্ক্ষিত বা অসংলগ্ন বার্তা দেওয়া থেকে বিরত থাকুন।</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-gold-400 font-bold">•</span>
                <span>অ্যাডমিনের পোস্ট করা জরুরি নোটিশগুলো মনোযোগ দিয়ে পড়ুন।</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
