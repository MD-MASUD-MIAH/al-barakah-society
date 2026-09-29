import React from 'react';
import { ChevronRight } from 'lucide-react';

export const StatCard = ({ title, value, subtitle, icon: Icon, colorTheme = 'emerald', badgeText, onClick }) => {
  const getThemeStyles = () => {
    switch (colorTheme) {
      case 'gold':
        return {
          cardBg: 'bg-white hover:bg-amber-50/40 border-amber-200/80',
          iconBg: 'bg-amber-100 text-amber-800',
          textColor: 'text-amber-950',
          valueColor: 'text-slate-900',
        };
      case 'blue':
        return {
          cardBg: 'bg-white hover:bg-blue-50/40 border-blue-200/80',
          iconBg: 'bg-blue-100 text-blue-800',
          textColor: 'text-blue-950',
          valueColor: 'text-slate-900',
        };
      case 'purple':
        return {
          cardBg: 'bg-white hover:bg-purple-50/40 border-purple-200/80',
          iconBg: 'bg-purple-100 text-purple-800',
          textColor: 'text-purple-950',
          valueColor: 'text-slate-900',
        };
      case 'emerald':
      default:
        return {
          cardBg: 'bg-white hover:bg-emerald-50/40 border-emerald-200/80',
          iconBg: 'bg-emerald-100 text-emerald-800',
          textColor: 'text-emerald-950',
          valueColor: 'text-slate-900',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 sm:p-5 border shadow-2xs transition-all duration-200 relative overflow-hidden group ${
        onClick
          ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-xs active:scale-[0.99]'
          : ''
      } ${theme.cardBg}`}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 truncate">
            {title}
          </p>
          <h3 className={`text-xl sm:text-2xl font-bold font-sans tracking-tight ${theme.valueColor} truncate`}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${theme.iconBg} group-hover:scale-105 transition-transform duration-200`}>
            {Icon && <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />}
          </div>
          {badgeText && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {badgeText}
            </span>
          )}
        </div>
      </div>

      {onClick && (
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-emerald-700 transition-colors">
          <span>বিস্তারিত</span>
          <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      )}
    </div>
  );
};
