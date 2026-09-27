import React from 'react';
import { X, ShieldCheck, CheckCircle2, BookOpen, Scale, HeartHandshake } from 'lucide-react';

export const ShariahPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-gold-500 text-emerald-950 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">শরীয়াহ নীতিমালা ও আমানত শর্ত</h3>
              <p className="text-xs text-gold-300">স্বচ্ছ ও সুদমুক্ত আর্থিক কাঠামোর মূলনীতি</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-white/80 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-3.5 bg-emerald-50 rounded-[6px] border border-emerald-200 text-emerald-900">
            <p className="font-semibold text-sm mb-1 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-800" />
              <span>সম্পূর্ণ সুদমুক্ত ও শরীয়াহসম্মত আমানত</span>
            </p>
            <p>
              আল-বারাকাহ সোসাইটি সকল প্রকার সুদ, অনিশ্চয়তা (গারার) ও ফটকাবাজি থেকে সম্পূর্ণ মুক্ত। সদস্যদের জমাকৃত অর্থ আমানত হিসেবে সংরক্ষিত থাকে।
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-800" />
              <span>মূল নীতিমালাসমূহ:</span>
            </h4>

            <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-[6px] border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">১. শতভাগ আর্থিক স্বচ্ছতা:</span>
                <span>প্রতিটি জমার বিপরীতে অটোমেটিক ডিজিটাল রসিদ ইস্যু ও কেন্দ্রীয় লেজারে তাৎক্ষণিক এন্ট্রি হয়।</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-[6px] border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">২. আমানতের সুরক্ষা ও জবাবদিহিতা:</span>
                <span>সোসাইটির প্রতিটি পাই-পয়সা অনুমোদিত সদস্যবৃন্দের যৌথ তদারকি ও নিরীক্ষার অধীনে রক্ষিত।</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-[6px] border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">৩. কল্যাণ ও পারস্পরিক সহযোগিতা:</span>
                <span>তহবিলের উদ্দেশ্য সদস্যদের সঞ্চয় অভ্যাস বৃদ্ধি এবং পারস্পরিক বিপদে সুদমুক্ত সহায়তা প্রদান।</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-emerald-900 text-gold-300 font-bold text-xs rounded-[6px] hover:bg-emerald-950 transition-colors"
            >
              বুঝেছি ও একমত
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
