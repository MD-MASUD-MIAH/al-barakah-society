import React from 'react';
import { Heart, Sparkles, Shield, Coins } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-200/80 border-t-2 border-gold-500/40 mt-16 sm:mt-24 pt-10 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-emerald-800/60">
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-md ring-1 ring-gold-400/40 overflow-hidden shrink-0">
                <img
                  src="/logo-al-barakah.png"
                  alt="আল-বারাকাহ সোসাইটি"
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-white font-bold text-base">আল-বারাকাহ সোসাইটি</h3>
            </div>
            <p className="text-xs text-gold-400 font-medium">"বিশ্বাসের বন্ধন"</p>
            <p className="text-xs text-emerald-300/70 leading-relaxed">
              স্বচ্ছ, সুদমুক্ত এবং আধুনিক প্রযুক্তিনির্ভর কমিউনিটি সঞ্চয় ও কল্যাণ তহবিল ব্যবস্থাপনা সিস্টেম।
            </p>
          </div>

          {/* Core Values */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">আমাদের অঙ্গীকার</h4>
            <ul className="space-y-1.5 text-xs text-emerald-200/70">
              <li className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-gold-400" />
                <span>১০০% আমানতদারিতা ও স্বচ্ছ হিসাব</span>
              </li>
              <li className="flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 text-gold-400" />
                <span>সহজ ও ডিজিটাল কিস্তি আদায়</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>পারস্পরিক সহযোগিতা ও ঐক্য</span>
              </li>
            </ul>
          </div>

          {/* Society Notice */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">জরুরী যোগাযোগ ও সহায়তা</h4>
            <p className="text-xs text-emerald-200/70 leading-relaxed">
              যেকোনো আর্থিক এন্ট্রি যাচাই বা অ্যাকাউন্ট সংক্রান্ত তথ্যের জন্য সোসাইটি ম্যানেজমেন্টের সাথে যোগাযোগ করুন।
            </p>
            <p className="text-xs text-gold-300 font-semibold">
              হটলাইন: +880 1711-000001 • ইমেইল: support@albarakah.org
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/60 gap-3">
          <p>© {new Date().getFullYear()} Al-Barakah Society (আল-বারাকাহ সোসাইটি). সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-1">
            <span>বিশ্বাসের সাথে গড়ে তোলা</span>
            <Heart className="w-3 h-3 text-red-400 fill-current inline mx-0.5" />
            <span>কমিউনিটি প্ল্যাটফর্ম</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
