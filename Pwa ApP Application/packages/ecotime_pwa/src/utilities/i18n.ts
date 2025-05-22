import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../assets/locals/en-us/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation:
                    enTranslation,
      },
    },
    lng: 'en-us',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
