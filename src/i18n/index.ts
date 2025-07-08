import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { ro, en, de, it, hu, zh } from './locales';

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      ro,
      en,
      de,
      it,
      hu,
      zh
    },
    lng: 'ro', // Force Romanian language
    fallbackLng: 'ro',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;