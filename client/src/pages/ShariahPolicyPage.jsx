import React from 'react';
import { ShieldCheck, Scale, BookOpen, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShariahPolicyPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
        <Link
          to="/dashboard"
          className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-[6px] text-slate-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-800" />
            <span>শরীয়াহ নীতিমালা ও আমানত শর্তাবলী (Shariah Policy)</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            আল-বারাকাহ সোসাইটির সুদমুক্ত আর্থিক কাঠামোর মূলনীতি
          </p>
        </div>
      </div>

      {/* Main Principle */}
      <div className="p-6 bg-emerald-50 rounded-[6px] border border-emerald-200 text-emerald-950 space-y-2">
        <h2 className="font-bold text-base flex items-center gap-2">
          <Scale className="w-5 h-5 text-emerald-800" />
          <span>সম্পূর্ণ সুদমুক্ত ও শরীয়াহসম্মত আমানত ব্যবস্থা</span>
        </h2>
        <p className="text-xs text-emerald-900 leading-relaxed">
          আল-বারাকাহ সোসাইটি সকল প্রকার সুদ (রিবা), অনিশ্চয়তা (গারার) ও ফটকাবাজি থেকে সম্পূর্ণ মুক্ত। সদস্যদের জমাকৃত অর্থ আমানত হিসেবে সর্বোচ্চ নিষ্ঠা ও স্বচ্ছতার সাথে সংরক্ষিত থাকে।
        </p>
      </div>

      {/* Policies */}
      <div className="bg-white rounded-[6px] p-6 border border-slate-200 shadow-none space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-800" />
          <span>সোসাইটির মূল নীতিমালাসমূহ:</span>
        </h3>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-[6px] border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">১. শতভাগ আর্থিক স্বচ্ছতা:</h4>
              <p>প্রতিটি জমার বিপরীতে অটোমেটিক ডিজিটাল রসিদ ইস্যু হয় এবং কেন্দ্রীয় অডিট লেজারে তাৎক্ষণিক এন্ট্রি হয়।</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-[6px] border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">২. আমানতের সুরক্ষা ও তদারকি:</h4>
              <p>সোসাইটির তহবিল অনুমোদিত সদস্যবৃন্দের যৌথ তদারকি ও নিরীক্ষার অধীনে সংরক্ষিত থাকে। কোনো ব্যক্তিগত ব্যবসায় এই অর্থ বিনিয়োগ নিষিদ্ধ।</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-[6px] border border-slate-200 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 mb-0.5">৩. পারস্পরিক সহযোগিতা ও কল্যাণ:</h4>
              <p>তহবিলের প্রধান উদ্দেশ্য সদস্যদের নিয়মিত সঞ্চয় অভ্যাস গড়ে তোলা এবং প্রয়োজনে পারস্পরিক বিপদে কর্জে হাসানা বা সুদমুক্ত সহযোগিতা প্রদান।</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
