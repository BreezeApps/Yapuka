const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const path = require("path");
const fs = require("fs");
const { ipcRenderer } = require("electron");

let language;

export default class I18n {
  lang: string;
  static list_lang: string[];
  static lang: any;
  constructor() {
    this.lang = "system"
  }

  // Initialisation de i18next avec un backend de fichiers
  static async init() {
    this.list_lang = ["fr", "en", "es", "de"]
    this.lang = await this.getCurrentLanguage()
    i18next.use(Backend).init(
      {
        lng: this.lang,
        fallbackLng: this.list_lang,
        backend: {
          loadPath: "./locales/{{lng}}.json", // Chemin des fichiers de traduction
        },
        initImmediate: true,
      },
      (err, t) => {
        if (err) return console.error(err);
        this.updateContent(); // Mise à jour du contenu au démarrage
      },
    );
    setTimeout(() => {
      this.updateContent()
    }, 500)
  }

  static async getCurrentLanguage() {
    let lang = await ipcRenderer.invoke("get-config-variable", "languages");
    if (lang.value === "system") {
      lang = navigator.language;
    } else {
      lang = lang.value;
    }
    this.lang = lang;
    return lang;
  }

  // Fonction pour mettre à jour tout le contenu de la page en fonction des traductions
  static updateContent() {
    let finalVal = {};
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const v = el.getAttribute("data-i18n-var");
      if (v !== null) {
        let value = v.split("/");
        for (let i = 0; i < value.length; i++) {
          finalVal[i] = value[i];
        }
        el.innerHTML = i18next.t(key, finalVal); // Remplace le texte de l'élément par la traduction
      } else {
        el.innerHTML = i18next.t(key); // Remplace le texte de l'élément par la traduction
      }
    });
  }

  static getTranslation(key) {
    return i18next.t(key);
  }

  static getTranslationWithVar(key, variable) {
    return i18next.t(key, variable);
  }

  static getLanguages() {
    const lang_response = [];
    this.list_lang.forEach((element) => {
      const file = fs.readFileSync(
        path.join(__dirname, "locales/" + element + ".json"),
      );
      const name = JSON.parse(file).Language_Name;
      lang_response.push({ short: element, full: name });
    });
    return lang_response;
  }

  static changeLanguage(language) {
    if (language === "system") {
      language = navigator.language;
    }
    i18next.changeLanguage(language, async (err, t) => {
      if (err) return console.error(err);
      await ipcRenderer.invoke("set-config-variable", "languages", language);
      this.updateContent(); // Met à jour le contenu après changement de langue
    });
  }
}

module.exports = I18n

// module.exports = {
//   updateContent,
//   getLanguages,
//   changesLanguage,
//   getTranslation,
//   getTranslationWithVar,
// };

// Changement de langue au clic
// document.getElementById("switch-lang").addEventListener("click", () => {
//   const newLang = i18next.language === "en" ? "fr" : "en";
//   i18next.changeLanguage(newLang, (err, t) => {
//     if (err) return console.error(err);
//     updateContent(); // Met à jour le contenu après changement de langue
//   });
// });
