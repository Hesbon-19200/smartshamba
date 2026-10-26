import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  Type,
  Sun,
  Volume2,
  VolumeX,
  X,
  Check,
  Sparkles,
  Info,
} from 'lucide-react';
import { useAccessibility, FontSize } from '../context/AccessibilityContext.tsx';
import { useApp } from '../context/AppContext.tsx';

interface AccessibilityToolbarProps {
  variant?: 'header-button' | 'full-panel';
  className?: string;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({
  variant = 'header-button',
  className = '',
}) => {
  const { fontSize, setFontSize, highContrast, toggleHighContrast, isSpeaking, speakText, stopSpeaking } =
    useAccessibility();
  const { t, language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleTestSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      const demoText =
        language === 'sw'
          ? 'Habari mkulima. Hii ni sauti ya MkulimaAI. Inaweza kusoma tahadhari za hali ya hewa, utambuzi wa magonjwa ya mimea, na mahesabu ya faida ya shamba lako.'
          : 'Hello farmer. This is the MkulimaAI voice assistant. It can read weather alerts, crop disease diagnoses, and farm profit estimations aloud for you.';
      speakText(demoText, language);
    }
  };

  const fontOptions: Array<{ size: FontSize; label: string; sublabel: string }> = [
    { size: 'normal', label: 'A', sublabel: t('a11yNormal') },
    { size: 'large', label: 'A+', sublabel: t('a11yLarge') },
    { size: 'xlarge', label: 'A++', sublabel: t('a11yXLarge') },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={panelRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer min-h-[40px] border ${
          highContrast
            ? 'bg-black text-white border-white shadow-md'
            : isOpen
            ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
        }`}
        aria-label="Open accessibility and vision settings"
        aria-expanded={isOpen}
      >
        <Eye className={`w-4 h-4 ${highContrast ? 'text-amber-300' : 'text-emerald-700'}`} />
        <span className="hidden sm:inline font-bold">
          {language === 'sw' ? 'Uwezo wa Kuona' : 'Accessibility'}
        </span>
        {(fontSize !== 'normal' || highContrast) && (
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        )}
      </button>

      {/* Accessibility Flyout Modal / Card */}
      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 ${
            highContrast
              ? 'bg-slate-950/95 border-2 border-white text-white backdrop-blur-xl'
              : 'bg-white/85 backdrop-blur-xl border-white/60 text-slate-900'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={t('a11yTitle')}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-3 mb-4 border-slate-200">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-sm leading-none">{t('a11yTitle')}</h3>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                  {t('a11yVisionAids')}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* 1. Font Size Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-emerald-600" />
                  {t('a11yTextSize')}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '115%' : '130%'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {fontOptions.map((opt) => {
                  const isActive = fontSize === opt.size;
                  return (
                    <button
                      key={opt.size}
                      onClick={() => setFontSize(opt.size)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer min-h-[48px] ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-700 font-bold shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 font-medium'
                      }`}
                    >
                      <span className="text-sm font-extrabold leading-none">{opt.label}</span>
                      <span className="text-[9px] mt-1 truncate max-w-full opacity-90">{opt.sublabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. High Contrast Mode Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-600" />
                    {t('a11yContrast')}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {t('a11yContrastHigh')}
                  </p>
                </div>

                <button
                  onClick={toggleHighContrast}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer border ${
                    highContrast ? 'bg-black border-white' : 'bg-slate-300 border-transparent'
                  }`}
                  role="switch"
                  aria-checked={highContrast}
                  aria-label="Toggle high contrast"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* 3. Voice Read-Aloud Assistant */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                  {t('a11yVoice')}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">
                {t('a11yVoiceDisclaimer')}
              </p>

              <button
                onClick={handleTestSpeech}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
                  isSpeaking
                    ? 'bg-rose-600 text-white animate-pulse shadow-sm'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>{t('a11yStopAudio')}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{t('a11yListen')} (Voice Demo)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
