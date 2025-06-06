import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en-US.json";
import frTranslation from "./locales/fr-FR.json";
import deTranslation from "./locales/de.json";
import esTranslation from "./locales/es.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': { translation: enTranslation },
      'fr-FR': { translation: frTranslation },
      'de': { translation: deTranslation },
      'es': { translation: esTranslation },
    },
    lng: "fr-FR", // Langue par défaut
    supportedLngs: ["fr-FR", "en-US", "de", "es"],
    load: "all",
    fallbackLng: "en",
    saveMissing: true,
    interpolation: { escapeValue: false },
  });

export function getCurrentLanguage() {
  return i18n.language
}

export function getDate(date: Date) {
  date = new Date(date)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  const formatteur = new Intl.DateTimeFormat(i18n.language, options);
  return formatteur.format(date);
}

export function getRelativeTime(targetDate: Date) {
  const now = new Date();
  targetDate = new Date(targetDate)
  const diffMs = targetDate.getTime() - now.getTime();

  const seconds = Math.round(diffMs / 1000);
  const minutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.round(diffMs / (1000 * 60 * 60));
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' });

  if (Math.abs(seconds) < 60) {
    return rtf.format(Math.round(seconds), 'second');
  } else if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, 'minute');
  } else if (Math.abs(hours) < 24) {
    return rtf.format(hours, 'hour');
  } else {
    return rtf.format(days, 'day');
  }
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