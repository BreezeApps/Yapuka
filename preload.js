const { contextBridge } = require("electron");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const LanguageDetector = require("i18next-browser-languagedetector");
const path = require("path");

// i18next
//   .use(Backend)
//   .use(LanguageDetector)
//   .init({
//     fallbackLng: "en",
//     backend: {
//       loadPath: path.join(__dirname, "locales/{{lng}}.json"),
//     },
//   });

// window.myAPI = {
//   i18n: () =>
//     i18next
//       .use(Backend)
//       .use(LanguageDetector)
//       .init({
//         fallbackLng: "en",
//         backend: {
//           loadPath: path.join(__dirname, "locales/{{lng}}.json"),
//         },
//       }),
// };
