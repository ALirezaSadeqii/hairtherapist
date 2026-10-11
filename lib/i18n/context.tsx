'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { Language, Direction, Translations } from '@/types/language';
import { tr } from './tr';
import { fa } from './fa';

interface LanguageContextValue {
  language: Language;
  direction: Direction;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = 'app_language_preference';

function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

function getStoredLanguageSnapshot(): Language | null {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === 'tr' || val === 'fa' ? val : null;
  } catch {
    return null;
  }
}

function getServerLanguageSnapshot(): Language | null {
  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const persistedLanguage = useSyncExternalStore(
    subscribeToStorage,
    getStoredLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  const [overrideLanguage, setOverrideLanguage] = useState<Language | null>(null);

  const language: Language = overrideLanguage ?? persistedLanguage ?? 'tr';

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
    } catch {
      // Ignore storage write issues
    }
  }, [language]);

  const setLanguage = React.useCallback((newLang: Language) => {
    setOverrideLanguage(newLang);
  }, []);

  const toggleLanguage = React.useCallback(() => {
    setOverrideLanguage((prev) => (prev === 'fa' ? 'tr' : 'fa'));
  }, []);

  const direction: Direction = language === 'fa' ? 'rtl' : 'ltr';
  const t = useMemo(() => (language === 'fa' ? fa : tr), [language]);

  const value = useMemo(
    () => ({
      language,
      direction,
      t,
      setLanguage,
      toggleLanguage,
    }),
    [language, direction, t, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
