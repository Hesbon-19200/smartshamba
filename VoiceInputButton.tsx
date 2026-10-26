import React from 'react';
import { Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { useVoiceToText } from '../hooks/useVoiceToText.ts';

interface VoiceInputButtonProps {
  onTranscript: (transcript: string) => void;
  lang?: 'sw' | 'en' | string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  showLiveBadge?: boolean;
  className?: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  lang = 'sw',
  size = 'md',
  label,
  showLiveBadge = true,
  className = '',
}) => {
  const safeLang: 'sw' | 'en' = lang === 'en' ? 'en' : 'sw';

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    toggleListening,
  } = useVoiceToText({
    lang: safeLang,
    onResult: (text, isFinal) => {
      if (isFinal) {
        onTranscript(text);
      }
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleListening({
      lang: safeLang,
      onResult: (text, isFinal) => {
        if (isFinal) {
          onTranscript(text);
        }
      },
    });
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2.5 text-xs sm:text-sm',
    lg: 'p-3.5 text-sm sm:text-base font-bold',
  }[size];

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size];

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleClick}
        title={
          !isSupported
            ? 'Web Speech API is not supported in this browser. Use Chrome, Safari, or Edge.'
            : isListening
            ? lang === 'sw' ? 'Inasikiliza... Bonyeza kusimamisha' : 'Listening... Click to stop'
            : lang === 'sw' ? 'Ongea kwa sauti (Hands-free Voice Input)' : 'Click to speak (Voice Input)'
        }
        className={`inline-flex items-center justify-center gap-1.5 rounded-2xl font-bold transition-all cursor-pointer active:scale-95 shadow-xs ${sizeClasses} ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 text-white ring-4 ring-red-400/40 animate-pulse'
            : 'bg-emerald-50 hover:bg-emerald-100 text-[#15532E] border border-emerald-300'
        } ${className}`}
      >
        {isListening ? (
          <>
            <MicOff className={`${iconSizes} text-white animate-bounce`} />
            {label ? <span>{lang === 'sw' ? 'Inasikiliza...' : 'Listening...'}</span> : null}
          </>
        ) : (
          <>
            <Mic className={`${iconSizes} text-emerald-700`} />
            {label ? <span>{label}</span> : null}
          </>
        )}
      </button>

      {/* Floating active listening toast badge */}
      {isListening && showLiveBadge && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 whitespace-nowrap border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>
            {interimTranscript
              ? `"${interimTranscript}"`
              : lang === 'sw'
              ? 'Ongea sasa kwa Kiswahili au Kiingereza...'
              : 'Listening... speak your crop details now'}
          </span>
        </div>
      )}

      {/* Error alert toast */}
      {error && !isListening && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-red-100 text-red-900 text-[10px] font-semibold px-2 py-1 rounded-lg border border-red-200 whitespace-nowrap shadow-md">
          {error}
        </div>
      )}
    </div>
  );
};
