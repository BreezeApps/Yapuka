const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const path = require("path");
const fs = require('fs');
const { ipcRenderer } = require("electron");

ipcRenderer.invoke("set-config-variable", "languages", "system")
let lang = ipcRenderer.invoke("get-config-variable", "languages")
console.log(lang)
if(lang[0].value === "system") {
  lang = navigator.language
} else {
  lang = lang[0].value
}
console.log(lang)

// Initialisation de i18next avec un backend de fichiers
i18next.use(Backend).init(
  {
    lng: lang,
    fallbackLng: ["fr", "en", "es", "de"],
    backend: {
      loadPath: path.join(__dirname, "locales/{{lng}}.json"), // Chemin des fichiers de traduction
    },
  },
  (err, t) => {
    if (err) return console.error(err);
    updateContent(); // Mise à jour du contenu au démarrage
  },
);
// Fonction pour mettre à jour tout le contenu de la page en fonction des traductions
function updateContent() {
  // window.location.reload()
  let finalVal = {}
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const v = el.getAttribute("data-i18n-var")
    if (v !== null) {
      let value = v.split("/")
      for (let i = 0; i < value.length; i++) {
        finalVal[i] = value[i];
      }
      el.innerHTML = i18next.t(key, finalVal); // Remplace le texte de l'élément par la traduction
    } else {
      el.innerHTML = i18next.t(key); // Remplace le texte de l'élément par la traduction
    }
  });
}

function getTranslation(key) {
  return i18next.t(key)
}
function getTranslationWithVar(key, variable) {
  return i18next.t(key, variable)
}

function getLanguages() {
  const languages = i18next.languages
  const lang_response = []
  languages.forEach(element => {
    const file = fs.readFileSync(path.join(__dirname, "locales/" + element + ".json"));
    const name = JSON.parse(file).Language_Name
    lang_response.push({ short: element, full: name})
  });
  return lang_response;
}

function changesLanguage(language) {
  if (language === "system") {
    language = navigator.language
  }
  i18next.changeLanguage(language, (err, t) => {
    if (err) return console.error(err);
    ipcRenderer.invoke("set-config-variable", "languages", language)
    updateContent(); // Met à jour le contenu après changement de langue
  });
}

module.exports = { updateContent, getLanguages, changesLanguage, getTranslation, getTranslationWithVar}

// Changement de langue au clic
// document.getElementById("switch-lang").addEventListener("click", () => {
//   const newLang = i18next.language === "en" ? "fr" : "en";
//   i18next.changeLanguage(newLang, (err, t) => {
//     if (err) return console.error(err);
//     updateContent(); // Met à jour le contenu après changement de langue
//   });
// });