# <p align="center">Gestionnaire de listes de tâches</p>

# <p align="center">Yapuka</p>

![Electron](https://img.shields.io/badge/Electron-%5E21.0.1-blue?style=flat-square&logo=electron)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-lightgrey?style=flat-square)
![Release](https://img.shields.io/github/v/release/Marvideo2009/Yapuka?style=flat-square)
![Website](https://img.shields.io/badge/Website-Yapuka-0a0a0a?style=flat-square&logo=google-chrome&link=https://yapuka.marvideo.fr)
![GitHub Downloads](https://img.shields.io/github/downloads/Marvideo2009/Yapuka/total?label=Number%20of%20downloads)

**Yapuka** est une application développée en **Electron** qui permet de créer et gérer simplement des listes de tâches. L’application est disponible pour Windows et Linux.

## 📥 Installation

Pour utiliser l'application, rendez-vous directement sur [yapuka.marvideo.fr](https://yapuka.marvideo.fr) pour télécharger la version adaptée à votre système.

## 🤝 Contribuer

Nous accueillons les contributions ! Suivez les étapes ci-dessous pour mettre en place le projet en local, explorer le code et proposer des améliorations.

### Cloner le projet

Assurez-vous d’avoir [Git](https://git-scm.com) et [Node.js](https://nodejs.org/fr/) installés.

```bash
# Cloner le dépôt
git clone https://github.com/Marvideo/Yapuka.git

# Aller dans le répertoire du projet
cd Yapuka

# Installer les dépendances
pnpm install
```

### Démarrer en mode développement

```bash
# Lancer l'application en mode développement
pnpm run dev
# OR
pnpm start
```

### Créer des builds de développement

Pour générer des builds de l'application pour différentes plateformes en local :

```bash
# Build pour Windows
pnpm run build:

# Build pour MacOS
pnpm run build:macOS

# Build pour Linux
pnpm run build:Linux
```

Les builds seront créés dans le dossier `dist`.

## 🚀 Fonctionnalités

- **Gestion de listes de tâches :**
Sécurité : Yapuka est une application qui fonctionne sur votre ordinateur, pas sur un serveur externe. Pas d'inscription, pas de données en balade. 
Simplicité : Yapuka se concentre sur les fonctions essentielles ; pas de gadget inutile.
 Yapuka permet de : 
 Créer, supprimer et mettre à jour des listes de tâches regroupées dans un onglet.
 Créer, supprimer et mettre à jour les onglets. 
 Créer, supprimer et mettre à jour les tâches dans chaque liste.
 Chaque tâche est décrite par un titre (obligatoire), et facultativement par un court texte et une date d’échéance.
 Déplacer, avec la souris, les tâches d'une liste à l'autre au sein d'un onglet.
 Déplacer, avec la souris, les tâches au sein d'une liste.
 
 Toute modification est enregistrée automatiquement.
 On peut exporter en pdf les listes d'un onglet et les tâches d'une liste.
 Données :
 Les données sont gérées dans une base de données au format SQlite. Vous pouvez :
    Choisir l'emplacement de la base de données.
    Sauvegarder la base de données.
Version : surveillance de l'existence d'une version plus récente de l'application Yapuka. Yapuka vous propose une mise à jour automatique de l'application directement depuis le site Github. 

- **Multi-plateforme :** Compatible avec Windows, MacOS et Linux.

## 🖼️ Aperçu

<img src="https://yapuka.marvideo.fr/assets/screenshots.png" width="1000"/>

## 🔗 Liens utiles

- **Site web :** [https://yapuka.marvideo.fr](https://yapuka.marvideo.fr)
- **Documentation :** [https://github.com/Marvideo2009/Yapuka/wiki](https://github.com/Marvideo2009/Yapuka/wiki)
- **Communauté :** [https://github.com/Marvideo2009/Yapuka/discussions](https://github.com/Marvideo2009/Yapuka/discussions)

## 🛠️ Technologies utilisées

![JavaScript](https://img.shields.io/badge/JavaScript-%23F7DF1E.svg?style=flat-square&logo=javascript&logoColor=black)
![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=flat-square&logo=css3&logoColor=white)

## 📝 Licence

Ce projet est sous licence Creative Commons BY-NC-SA- voir le fichier [LICENSE](LICENSE) pour plus de détails.