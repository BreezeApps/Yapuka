import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
// import { app } from 'electron';
// import path from 'path';

export const initializeI18n = () => {
  i18n
    .use(Backend)
    .init({
      lng: 'en', // Langue par défaut
      fallbackLng: 'en',
      debug: false,
      backend: {
        // Chemin absolu pour charger les fichiers de traduction
        // loadPath: path.join(app.getAppPath(), 'locales/{{lng}}.json'),
        loadPath: './locales/{{lng}}.json',
      },
      interpolation: {
        escapeValue: false,
      },
    });
};

export default i18n;
