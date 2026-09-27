import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  MessageSquareText,
  UserCheck,
  Users,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';

export const Navbar = () => {
  const { user, logout, isAdmin, isApproved, onlineCount, pendingCount } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'ড্যাশবোর্ড', path: '/dashboard', icon: LayoutDashboard },
  ];

  if (isApproved || isAdmin) {
    navLinks.push({ name: 'আর্থিক লেজার', path: '/ledger', icon: Receipt });
    navLinks.push({ name: 'কমিউনিটি চ্যাট', path: '/community', icon: MessageSquareText });
  } else {
    navLinks.push({
      name: 'সদস্যপদ আবেদন',
      path: '/apply-membership',
      icon: Sparkles,
      highlight: true,
    });
  }

  if (isAdmin) {
    navLinks.push({
      name: 'অনুমোদন অনুরোধ',
      path: '/admin/approvals',
      icon: UserCheck,
      badge: pendingCount,
    });
    navLinks.push({
      name: 'সদস্য তালিকা',
      path: '/admin/members',
      icon: Users,
    });
  }

  return (
    <nav className="bg-emerald-900 border-b-2 border-gold-500 shadow-none sticky top-0 z-40 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* 1. Mobile Left: Hamburger menu button */}
          <div className="flex lg:hidden items-center w-10 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 -ml-1 text-emerald-100 hover:text-white hover:bg-emerald-800/80 rounded-[6px] focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* 2. Logo: Centered on Mobile, Left-aligned on Desktop with large size */}
          <div className="flex-1 flex justify-center lg:justify-start lg:flex-initial shrink-0">
            <Link
              to="/dashboard"
              className="flex items-center shrink-0 group focus:outline-none bg-transparent border-0"
              title="আল-বারাকাহ সোসাইটি"
            >
              <div className="h-12 sm:h-16 lg:h-20 flex items-center justify-center bg-transparent border-0 p-0 shrink-0">
                <img
                  src="/logo-al-barakah.png"
                  alt="আল-বারাকাহ সোসাইটি লোগো"
                  className="h-11 sm:h-14 lg:h-20 w-auto object-contain brightness-0 invert logo-white transition-transform group-hover:scale-105"
                />
              </div>
            </Link>
          </div>

          {/* 3. Desktop Nav Links (Active indicator is beautiful bottom underline, NO BOX) */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6 mx-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 py-1.5 text-xs xl:text-sm font-medium transition-colors ${
                    active
                      ? 'text-gold-300 font-bold after:content-[""] after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-[3px] after:bg-gold-400 after:rounded-full'
                      : link.highlight
                      ? 'text-gold-400 hover:text-gold-300 font-bold'
                      : 'text-emerald-100 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-gold-400' : link.highlight ? 'text-gold-400' : 'text-emerald-300'}`} />
                  <span className="whitespace-nowrap">{link.name}</span>
                  {link.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-emerald-950 text-[11px] font-bold rounded-full animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* 4. Right side: Live status (desktop) & User Profile (Mobile Right & Desktop Right) */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 w-10 lg:w-auto shrink-0">
            {/* Real-time online indicator (Desktop only) */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 rounded-[6px] border border-emerald-800/80 text-xs text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="w-2 h-2 -ml-3.5 rounded-full bg-emerald-400"></span>
              <span className="font-semibold text-white">{onlineCount}</span>
              <span className="text-emerald-300/80">অনলাইন</span>
            </div>

            {/* User Profile dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 sm:p-1.5 rounded-[6px] hover:bg-emerald-800/80 transition-colors border border-transparent hover:border-gold-500/30 focus:outline-none"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full aspect-square object-cover ring-2 ring-gold-400 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full aspect-square bg-gold-500 text-emerald-950 font-bold flex items-center justify-center text-sm shrink-0">
                      {user.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs sm:text-sm font-semibold leading-tight text-white max-w-[110px] xl:max-w-[140px] truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gold-300 capitalize flex items-center gap-1">
                      {isAdmin ? (
                        <>
                          <ShieldCheck className="w-3 h-3 text-gold-300" /> অ্যাডমিন
                        </>
                      ) : isApproved ? (
                        'সম্মানিত সদস্য'
                      ) : user.status === 'pending' ? (
                        'আবেদন অপেক্ষমাণ'
                      ) : (
                        'সাধারণ ব্যবহারকারী'
                      )}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-[6px] shadow-none py-2 border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/70">
                      <p className="text-xs text-slate-500 font-medium">লগইন করা হয়েছে:</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.phone} • {user.email}</p>
                      {isApproved && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
                          <span className="text-slate-600">আপনার মোট সঞ্চয়:</span>
                          <span className="font-bold text-emerald-800">
                            {formatCurrency(user.totalDeposited || 0)}
                          </span>
                        </div>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-700" />
                      <span>আমার প্রোফাইল</span>
                    </Link>

                    {!isApproved && !isAdmin && (
                      <Link
                        to="/apply-membership"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-gold-600" />
                        <span>সদস্যপদ আবেদন ফরম</span>
                      </Link>
                    )}

                    {isAdmin && (
                      <Link
                        to="/admin/approvals"
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <UserCheck className="w-4 h-4 text-amber-600" />
                          <span>অনুমোদন অনুরোধ</span>
                        </div>
                        {pendingCount > 0 && (
                          <span className="px-1.5 py-0.5 text-xs bg-amber-500 text-white font-bold rounded-full">
                            {pendingCount}
                          </span>
                        )}
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট করুন</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-t border-emerald-800 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-colors ${active
                  ? 'text-gold-300 font-bold border-b-2 border-gold-400 pb-2'
                  : link.highlight
                    ? 'text-gold-400 font-bold'
                    : 'text-emerald-100 hover:text-white'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${link.highlight ? 'text-emerald-950' : 'text-gold-400'}`} />
                  <span>{link.name}</span>
                </div>
                {link.badge > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500 text-emerald-950 text-xs font-bold rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-emerald-800/80 space-y-1">
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-emerald-100 hover:bg-emerald-900 rounded-[6px]"
            >
              <UserIcon className="w-5 h-5 text-gold-400" />
              <span>আমার প্রোফাইল</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-300 hover:bg-red-950/40 rounded-[6px]"
            >
              <LogOut className="w-5 h-5 text-red-400" />
              <span>লগআউট করুন</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
