import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBR from './locales/pt-BR/common.json';
import en from './locales/en/common.json';
import es from './locales/es/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { common: ptBR },
      en: { common: en },
      es: { common: es },
    },
    defaultNS: 'common',
    fallbackLng: 'pt-BR',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'jh_lang',
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
