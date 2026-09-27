import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, colorTheme = 'emerald', badgeText, onClick }) => {
  const getThemeStyles = () => {
    switch (colorTheme) {
      case 'gold':
        return {
          cardBg: 'bg-gradient-to-br from-amber-50 to-amber-100/60 border-amber-200/80',
          iconBg: 'bg-gradient-to-br from-gold-400 to-amber-500 text-emerald-950',
          textColor: 'text-amber-950',
          valueColor: 'text-amber-900',
        };
      case 'blue':
        return {
          cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-50/60 border-blue-200/80',
          iconBg: 'bg-blue-600 text-white',
          textColor: 'text-blue-950',
          valueColor: 'text-blue-900',
        };
      case 'purple':
        return {
          cardBg: 'bg-gradient-to-br from-purple-50 to-pink-50/60 border-purple-200/80',
          iconBg: 'bg-purple-600 text-white',
          textColor: 'text-purple-950',
          valueColor: 'text-purple-900',
        };
      case 'emerald':
      default:
        return {
          cardBg: 'bg-gradient-to-br from-emerald-50 to-teal-50/50 border-emerald-200/80',
          iconBg: 'bg-emerald-900 text-gold-300',
          textColor: 'text-emerald-950',
          valueColor: 'text-emerald-900',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <div
      onClick={onClick}
      className={`rounded-[6px] p-5 sm:p-6 border shadow-none transition-all duration-200 relative overflow-hidden group ${
        onClick
          ? 'cursor-pointer hover:border-emerald-600/60 active:scale-[0.99]'
          : ''
      } ${theme.cardBg}`}
      title={onClick ? 'বিস্তারিত তথ্য দেখতে ক্লিক করুন' : undefined}
    >
      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1 min-w-0 pr-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 truncate">
            {title}
          </p>
          <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold font-sans tracking-tight ${theme.valueColor} truncate`}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs font-medium text-slate-600 mt-2 flex items-center gap-1.5 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className={`w-11 h-11 rounded-[6px] flex items-center justify-center ${theme.iconBg} group-hover:scale-105 transition-transform duration-200`}>
            {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6" />}
          </div>
          {badgeText && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-white/90 border border-slate-200 text-slate-700">
              {badgeText}
            </span>
          )}
        </div>
      </div>

      {onClick && (
        <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500 group-hover:text-emerald-800 transition-colors">
          <span>বিস্তারিত দেখতে ক্লিক করুন</span>
          <span className="font-bold transform group-hover:translate-x-1 transition-transform">→</span>
        </div>
      )}
    </div>
  );
};
