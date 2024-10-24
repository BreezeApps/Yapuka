const { ipcRenderer } = require('electron')

process.once('loaded', () => {
    window.addEventListener('message', evt => {
      if (evt.data.type === 'select-dirs') {
        ipcRenderer.send('select-dirs')
      }
    })
  })

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
