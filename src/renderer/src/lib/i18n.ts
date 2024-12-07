export async function translate(key: string) {
  return await window.i18n.i18nTranslate(key);
}

export async function getCurrentLanguage() {
  let langElement = await window.ipc.getLanguage();
  let lang: string;
  if (langElement?.value === "system") {
    lang = navigator.language;
  } else {
    lang = langElement?.value;
  }
  lang = lang;
  return lang;
}

export async function updateContent() {
  let finalVal = {};
  document.querySelectorAll("[data-i18n]").forEach(async (el) => {
    const key = el.getAttribute("data-i18n");
    const v = el.getAttribute("data-i18n-var");
    if (v !== null) {
      let value = v.split("/");
      for (let i = 0; i < value.length; i++) {
        finalVal[i] = value[i];
      }
      el.innerHTML = await window.i18n.i18nTranslateWithVar(key!, finalVal); // Remplace le texte de l'élément par la traduction
    } else {
      el.innerHTML = await window.i18n.i18nTranslate(key!); // Remplace le texte de l'élément par la traduction
    }
  });
}

export async function getTranslation(key: string) {
  return await window.i18n.i18nTranslate(key);
}

export async function getTranslationWithVar(key, variable) {
  return await window.i18n.i18nTranslateWithVar(key, variable);
}

export async function changeLanguage(language: string) {
  if (language === "system") {
    language = navigator.language;
  }
  await window.i18n.changeLanguage(language)
  updateContent()
}

// export function getLanguages() {
//   const lang_response = [];
//   list_lang.forEach((element) => {
//     const file = fs.readFileSync(
//       path.join(__dirname, "locales/" + element + ".json"),
//     );
//     console.log(path.join(__dirname, "locales/" + element + ".json"));
//     const name = JSON.parse(file.toString()).Language_Name;
//     lang_response.push({ short: element, full: name });
//   });
//   return lang_response;
// }

// import i18next from "i18next";
// import Backend from "i18next-fs-backend";
// import { initReactI18next } from "react-i18next"
// import path from "path";
// import fs from "fs";
// import { getOption } from "./database";

// export default class I18n {
//   lang: string;
//   static list_lang: string[];
//   static lang: any;
//   constructor() {
//     this.lang = "system"
//   }

//   // Initialisation de i18next avec un backend de fichiers
//   static async init() {
//     this.list_lang = ["fr", "en", "es", "de"]
//     this.lang = await this.getCurrentLanguage()
//     i18next.use(Backend).init(
//       {
//         lng: this.lang,
//         fallbackLng: this.list_lang,
//         backend: {
//           loadPath: "./locales/{{lng}}.json", // Chemin des fichiers de traduction
//         },
//         initImmediate: true,
//       },
//       (err, _t) => {
//         if (err) return console.error(err);
//         this.updateContent(); // Mise à jour du contenu au démarrage
//       },
//     );
//     setTimeout(() => {
//       this.updateContent()
//     }, 500)
//   }

//   static async getCurrentLanguage() {
//     let langElement = await getOption("languages")
//     let lang;
//     if (langElement?.value === "system") {
//       lang = navigator.language;
//     } else {
//       lang = langElement?.value;
//     }
//     this.lang = lang;
//     return lang;
//   }

//   // Fonction pour mettre à jour tout le contenu de la page en fonction des traductions
//   static updateContent() {
//     let finalVal = {};
//     document.querySelectorAll("[data-i18n]").forEach((el) => {
//       const key = el.getAttribute("data-i18n");
//       const v = el.getAttribute("data-i18n-var");
//       if (v !== null) {
//         let value = v.split("/");
//         for (let i = 0; i < value.length; i++) {
//           finalVal[i] = value[i];
//         }
//         el.innerHTML = i18next.t(key!, finalVal); // Remplace le texte de l'élément par la traduction
//       } else {
//         el.innerHTML = i18next.t(key!); // Remplace le texte de l'élément par la traduction
//       }
//     });
//   }

//   static getTranslation(key) {
//     return i18next.t(key);
//   }

//   static getTranslationWithVar(key, variable) {
//     return i18next.t(key, variable);
//   }

//   static getLanguages() {
//     const lang_response = [];
//     this.list_lang.forEach((element) => {
//       const file = fs.readFileSync(
//         path.join(__dirname, "locales/" + element + ".json"),
//       );
//       console.log(path.join(__dirname, "locales/" + element + ".json"))
//       const name = JSON.parse(file.toString()).Language_Name;
//       lang_response.push({ short: element, full: name });
//     });
//     return lang_response;
//   }

//   static changeLanguage(language) {
//     if (language === "system") {
//       language = navigator.language;
//     }
//     i18next.changeLanguage(language, async (err, _t) => {
//       if (err) return console.error(err);
//       await await getOption("language")
//       this.updateContent(); // Met à jour le contenu après changement de langue
//     });
//   }
// }
