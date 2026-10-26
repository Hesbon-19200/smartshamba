import React, { useState } from 'react';
import { Download, Check, Share, PlusSquare, X, ArrowLeft } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { useApp } from '../context/AppContext.tsx';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'button' | 'compact';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'button',
}) => {
  const { isInstallable, isInstalled, isIOS, installApp } = usePWAInstall();
  const { t, language } = useApp();
  const [showIosGuide, setShowIosGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await installApp();
    } else if (isIOS) {
      setShowIosGuide(true);
    }
  };

  if (!isInstallable && !isIOS) {
    return null;
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
          variant === 'compact'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            : 'bg-emerald-700 text-white hover:bg-emerald-800'
        } ${className}`}
        title={language === 'sw' ? 'Sakinisha MkulimaAI kwenye simu' : 'Install MkulimaAI on your device'}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t('installApp')}</span>
      </button>

      {/* iOS Safari Guided Install Sheet (Full Page) */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 w-full h-full bg-slate-50 flex flex-col overflow-hidden animate-in fade-in duration-150">
          <div className="bg-gradient-to-r from-[#2E7D32] via-[#246B28] to-[#1B5E20] text-white px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-2 rounded-full hover:bg-white/20 text-white cursor-pointer transition-all active:scale-95"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-white">
                  {language === 'sw' ? 'Sakinisha MkulimaAI' : 'Install MkulimaAI'}
                </h3>
                <p className="text-xs text-emerald-100">
                  {language === 'sw' ? 'Tumia bila intaneti shambani' : 'Work completely offline on your farm'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="p-2 rounded-full hover:bg-white/20 text-white cursor-pointer transition-all active:scale-95"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50 flex items-center justify-center">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#2E7D32] text-white font-black flex items-center justify-center text-xl shadow-xs">
                  🌾
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {language === 'sw' ? 'Sakinisha MkulimaAI' : 'Install MkulimaAI'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'sw' ? 'Hifadhi kwenye skrini ya simu yako' : 'Save to your device home screen'}
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-700">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    1
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    {language === 'sw' ? 'Bonyeza kitufe cha Share' : 'Tap the Share icon'}
                    <Share className="w-4 h-4 text-blue-600 inline" />
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    2
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    {language === 'sw' ? 'Chagua "Add to Home Screen"' : 'Select "Add to Home Screen"'}
                    <PlusSquare className="w-4 h-4 text-slate-700 inline" />
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                    3
                  </span>
                  <span className="font-medium">
                    {language === 'sw' ? 'Bonyeza "Add" juu kulia' : 'Tap "Add" in the top right corner'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {language === 'sw' ? 'Nimeelewa' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
