import React from 'react';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-300/80 border-t border-gold-500/30 py-6 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <img
              src="/logo-al-barakah.png"
              alt="আল-বারাকাহ সোসাইটি"
              className="h-8 w-auto brightness-0 invert opacity-90"
            />
            <div>
              <p className="font-bold text-white text-sm leading-tight">
                আল-বারাকাহ সোসাইটি
              </p>
              <p className="text-[11px] text-gold-400 font-medium">
                বিশ্বাসের বন্ধন • সঞ্চয় ও কল্যাণ তহবিল
              </p>
            </div>
          </div>

          {/* Minimal Quick Links */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link to="/dashboard" className="hover:text-gold-300 transition-colors">
              ড্যাশবোর্ড
            </Link>
            <Link to="/ledger" className="hover:text-gold-300 transition-colors">
              লেজার
            </Link>
            <Link to="/profile" className="hover:text-gold-300 transition-colors">
              প্রোফাইল
            </Link>
            <Link to="/shariah-policy" className="hover:text-gold-300 transition-colors">
              নীতিমালা
            </Link>
          </div>

          {/* Hotline & Copyright */}
          <div className="text-center sm:text-right text-[11px] text-emerald-400/70">
            <p className="text-gold-300 font-semibold flex items-center justify-center sm:justify-end gap-1">
              <Phone className="w-3 h-3 text-gold-400" />
              <span>01752803726</span>
            </p>
            <p className="mt-0.5">
              © {new Date().getFullYear()} Al-Barakah Society. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
