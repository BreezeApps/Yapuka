import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en.json";
import frTranslation from "./locales/fr.json";
import deTranslation from "./locales/de.json";
import esTranslation from "./locales/es.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      de: { translation: deTranslation },
      es: { translation: esTranslation },
    },
    lng: "fr", // Langue par défaut
    supportedLngs: ["fr", "en", "de", "es"],
    load: "all",
    fallbackLng: "en",
    saveMissing: true,
    interpolation: { escapeValue: false },
  });

export function getCurrentLanguage() {
  return i18n.language
}

export function getLanguages() {
  const languages = Object.keys(i18n.options.resources || {});
  let response: { key: number; value: string; label: string; }[] = []
  languages.forEach(lang => {
    let name = i18n.t("Language_Name", { lng: lang })
    let lan = { key: response.length + 1 , value: lang, label: name }
    response.push(lan)
  });
  return response
}

export function changeLanguage(language: string) {
  i18n.changeLanguage(language)
}

export default i18n;