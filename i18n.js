const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const path = require('path');

// Initialisation de i18next avec un backend de fichiers
i18next.use(Backend).init({
  lng: 'fr', // Langue par défaut
  backend: {
    loadPath: path.join(__dirname, 'locales/{{lng}}.json') // Chemin des fichiers de traduction
  }
}, (err, t) => {
  if (err) return console.error(err);
  updateContent(); // Mise à jour du contenu au démarrage
});

// Fonction pour mettre à jour tout le contenu de la page en fonction des traductions
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerHTML = i18next.t(key); // Remplace le texte de l'élément par la traduction
  });
}

// Changement de langue au clic
document.getElementById('switch-lang').addEventListener('click', () => {
  const newLang = i18next.language === 'en' ? 'fr' : 'en';
  i18next.changeLanguage(newLang, (err, t) => {
    if (err) return console.error(err);
    updateContent(); // Met à jour le contenu après changement de langue
  });
});