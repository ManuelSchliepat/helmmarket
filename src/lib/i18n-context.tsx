'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from './i18n';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ 
  children, 
  initialLanguage = 'en' 
}: { 
  children: React.ReactNode, 
  initialLanguage?: Language 
}) {
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    // 1. Check localStorage
    const savedLang = localStorage.getItem('helm-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'de')) {
      setLanguage(savedLang);
      return;
    }

    // 2. Check browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang === 'de') {
      setLanguage('de');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('helm-language', lang);
    // Optionally sync with DB if needed, but the settings page handles that via API
  };

  const t = (key: keyof typeof translations['en']) => {
    const translationSet = translations[language] || translations['en'];
    return translationSet[key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      <div className={language === 'de' ? 'lang-de' : 'lang-en'}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
