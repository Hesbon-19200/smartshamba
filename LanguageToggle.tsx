import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  variant?: 'header' | 'mobile-top' | 'drawer';
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ variant = 'header' }) => {
  const { language, setLanguage, toggleLanguage, t } = useApp();

  if (variant === 'drawer') {
    return (
      <div className="w-full rounded-xl bg-slate-100 p-2.5">
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800">
              {language === 'sw' ? 'Chagua Lugha' : 'Select Language'}
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {language === 'sw' ? 'Kiswahili' : 'English'}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setLanguage('en')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <span>🇬🇧</span>
            <span>English</span>
          </button>
          <button
            onClick={() => setLanguage('sw')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              language === 'sw'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <span>🇰🇪</span>
            <span>Kiswahili</span>
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'mobile-top') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition-colors cursor-pointer"
        title={language === 'en' ? 'Badilisha hadi Kiswahili' : 'Switch to English'}
        aria-label="Toggle language"
      >
        <span className="text-xs">{language === 'en' ? '🇬🇧' : '🇰🇪'}</span>
        <span className="uppercase">{language}</span>
      </button>
    );
  }

  // Default desktop header toggle
  return (
    <div className="inline-flex items-center rounded-full bg-slate-100 p-0.5 border border-slate-200 shadow-2xs">
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-white text-emerald-800 shadow-xs'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="text-xs">🇬🇧</span>
        <span>EN</span>
      </button>
      <button
        onClick={() => setLanguage('sw')}
        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
          language === 'sw'
            ? 'bg-white text-emerald-800 shadow-xs'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <span className="text-xs">🇰🇪</span>
        <span>SW</span>
      </button>
    </div>
  );
};
