import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';

const resources = {
  es: {
    translation: esTranslations
  },
  en: {
    translation: enTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    }
  });

// Sync with settings store on initialization
if (typeof window !== 'undefined') {
  try {
    const settingsStorage = localStorage.getItem('settings-storage');
    if (settingsStorage) {
      const settings = JSON.parse(settingsStorage);
      if (settings?.state?.language) {
        i18n.changeLanguage(settings.state.language);
      }
    }
  } catch (e) {
    console.error('Failed to sync language from settings store:', e);
  }
}

export default i18n;