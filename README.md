# <p align="center">Gestionnaire de listes de tâches</p>
# <p align="center">Yfokon</p>

![Tauri](https://img.shields.io/badge/Tauri-47848F?style=flat-square&logo=tauri&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-lightgrey?style=flat-square)
![Release](https://img.shields.io/github/v/release/BreezeApps/Yapuka?style=flat-square)
![Website](https://img.shields.io/badge/Website-https://breezeapps.marvideo.fr/Yapuka-0a0a0a?style=flat-square&logo=google-chrome&link=https://breezeapps.github.io/Yapuka/)
![GitHub Downloads](https://img.shields.io/github/downloads/BreezeApps/Yapuka/total?label=Number%20of%20downloads)

**Yfokon** est une application développée en **Tauri** qui permet de créer et gérer simplement des listes de tâches. L’application est disponible pour Windows et Linux.

## 📥 Installation
Pour utiliser l'application, rendez-vous directement sur [https://breezeapps.marvideo.fr/yfokon/](https://breezeapps.marvideo.fr/yfokon/) ou sur [Github Release](https://github.com/BreezeApps/Yfokon/releases/latest) pour télécharger la version adaptée à votre système.

## 🤝 Contribuer
Nous accueillons les contributions ! Suivez les étapes ci-dessous pour mettre en place le projet en local, explorer le code et proposer des améliorations.

### Cloner le projet
Assurez-vous d’avoir [Git](https://git-scm.com) et [Node.js](https://nodejs.org/fr/) ainsi que [Tauri](https://tauri.app/v1/guides/getting-started/prerequisites/) installés.
Et les [prerequis](https://tauri.app/v1/guides/getting-started/prerequisites/#setting-up-mobile) pour mobile si vous le souhaitez.

```bash
# Cloner le dépôt
git clone https://github.com/BreezeApps/Yfokon.git
# Aller dans le répertoire du projet
cd Yapuka
# Installer les dépendances
pnpm install
```

### Démarrer en mode développement
```bash
# Lancer l'application en mode développement
pnpm tauri dev
# Pour Mobile
pnpm tauri android dev
# OU
pnpm tauri ios dev
```

### Créer des builds de développement
Pour générer des builds de l'application pour différentes plateformes en local :
```bash
# Build pour votre Système :
pnpm tauri build
# Build pour mobile :
pnpm tauri android build
# OU
pnpm tauri ios build
```

Les builds seront créés dans le dossier `src-tauri/target/release/bundle`.

## 🚀 Fonctionnalités
- **Gestion de listes de tâches :**
- Sécurité : Yfokon est une application qui fonctionne sur votre ordinateur, pas sur un serveur externe. Pas d'inscription, pas de données en balade.
- Simplicité : Yfokon se concentre sur les fonctions essentielles ; pas de gadget inutile.
- Yapuka permet de :
  - Créer, supprimer et mettre à jour des listes de tâches regroupées dans un onglet.
  - Créer, supprimer et mettre à jour les onglets.
  - Créer, supprimer et mettre à jour les tâches dans chaque liste.
  - Chaque tâche est décrite par un titre (obligatoire), et facultativement par un court texte et une date d’échéance.
  - Déplacer, avec la souris, les tâches d'une liste à l'autre au sein d'un onglet.
  - Déplacer, avec la souris, les tâches au sein d'une liste.

- Toute modification est enregistrée automatiquement.
- On peut exporter en pdf les listes d'un onglet et les tâches d'une liste.
- Données :
 Les données sont gérées dans une base de données au format SQLite. Vous pouvez :
    - Choisir l'emplacement de la base de données.
    - Sauvegarder la base de données.
- Version : surveillance de l'existence d'une version plus récente de l'application Yapuka. Yapuka vous propose une mise à jour automatique de l'application directement depuis le site Github.
- **Multi-plateforme :** Compatible avec Windows et Linux.

## 🖼️ Aperçu
<img src="https://breezeapps.marvideo.fr/yfokon/assets/screenshots.png" width="1000"/>

## 🔗 Liens utiles
- **Site web :** [https://breezeapps.marvideo.fr/yapuka/](https://breezeapps.marvideo.fr/yfokon/)
- **Documentation :** [https://github.com/BreezeApps/Yfokon/wiki](https://github.com/BreezeApps/Yfokon/wiki)
- **Communauté :** [https://github.com/BreezeApps/Yfokon/discussions](https://github.com/BreezeApps/Yfokon/discussions)

## 🛠️ Technologies utilisées
![TypeScriptTauri](https://img.shields.io/badge/TypeScript-white?style=flat-square&logo=typescript&logoColor=black)
![Tauri](https://img.shields.io/badge/Tauri-47848F?style=flat-square&logo=tauri&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white)

## 📝 Licence
Ce projet est sous licence Creative Commons BY-NC-SA- voir le fichier [LICENSE](LICENSE) pour plus de détails.
