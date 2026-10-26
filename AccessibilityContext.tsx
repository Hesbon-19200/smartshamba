import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type FontSize = 'normal' | 'large' | 'xlarge';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  cycleFontSize: () => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  isSpeaking: boolean;
  speakText: (text: string, lang?: 'en' | 'sw') => void;
  stopSpeaking: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const FONT_STORAGE_KEY = 'mkulima_a11y_font';
const CONTRAST_STORAGE_KEY = 'mkulima_a11y_contrast';

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    if (typeof window === 'undefined') return 'normal';
    const saved = localStorage.getItem(FONT_STORAGE_KEY);
    return (saved === 'large' || saved === 'xlarge' || saved === 'normal') ? saved : 'normal';
  });

  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(CONTRAST_STORAGE_KEY) === 'true';
  });

  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size);
    localStorage.setItem(FONT_STORAGE_KEY, size);
  };

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  const setHighContrast = (enabled: boolean) => {
    setHighContrastState(enabled);
    localStorage.setItem(CONTRAST_STORAGE_KEY, enabled ? 'true' : 'false');
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
  };

  // Synchronize CSS class modifiers on document root for high contrast and font scaling
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('a11y-font-normal', 'a11y-font-large', 'a11y-font-xlarge');
    root.classList.add(`a11y-font-${fontSize}`);

    if (highContrast) {
      root.classList.add('a11y-high-contrast');
    } else {
      root.classList.remove('a11y-high-contrast');
    }
  }, [fontSize, highContrast]);

  // Voice Narration via Web Speech Synthesis API
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const speakText = useCallback((rawText: string, lang: 'en' | 'sw' = 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Web Speech Synthesis API not available in this browser.');
      return;
    }

    // Stop current speech before starting new utterance
    window.speechSynthesis.cancel();

    // Strip markdown formatting, emojis, bullet points for clean, natural speech
    const cleanText = rawText
      .replace(/[*#_~`>]/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/(\d+)\.\s+/g, 'Hatua $1: ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Set voice language
    utterance.lang = lang === 'sw' ? 'sw-KE' : 'en-US';
    utterance.rate = 0.92; // Slightly measured pace for utmost clarity for elderly farmers
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        cycleFontSize,
        highContrast,
        setHighContrast,
        toggleHighContrast,
        isSpeaking,
        speakText,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
