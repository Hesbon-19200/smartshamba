import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, translations, Translations } from '../services/i18n.ts';
import { offlineStorageService } from '../services/offlineStorageService.ts';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations) => string;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  lastSavedText: string;
  refreshLastSaved: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'mkulima_language';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'en' || saved === 'sw') return saved;
    // Default to Kiswahili for Kenya/East Africa locale or English as preferred
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    const next = language === 'en' ? 'sw' : 'en';
    setLanguage(next);
  };

  const t = useCallback(
    (key: keyof Translations): string => {
      const current = translations[language];
      if (current && current[key]) {
        return current[key];
      }
      return translations.en[key] || String(key);
    },
    [language]
  );

  // 2. Connectivity state (always active online mode)
  const isOffline = false;
  const setIsOffline = () => {};

  const [lastSavedText, setLastSavedText] = useState<string>(() => {
    return offlineStorageService.formatLastSaved();
  });

  const refreshLastSaved = useCallback(() => {
    setLastSavedText(offlineStorageService.formatLastSaved());
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isOffline,
        setIsOffline,
        lastSavedText,
        refreshLastSaved,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
