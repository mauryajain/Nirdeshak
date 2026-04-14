import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, getTranslation } from './i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  lang: ReturnType<typeof getTranslation>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('हि');

  useEffect(() => {
    const saved = localStorage.getItem('nirdeshak-language') as Language;
    if (saved === 'हि' || saved === 'Bho' || saved === 'বাং') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nirdeshak-language', lang);
  };

  const langProps = getTranslation(language);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, lang: langProps }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
