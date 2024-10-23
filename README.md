# <p align="center">Gestionnaire de listes de tâches</p>

# <p align="center">Yapuka</p>

# Interface

## Visuel

### Visuel de référence

Celui de To Do, utilitaire Gnome pour Ubuntu, et le Deck de Nextcloud.

Dans la fenêtre, on voit les listes de tâches sur un \"tableau\" (le
fond où se trouvent les listes), l\'une à côté de l\'autre. On peut
éventuellement modifier la couleur de fond de chaque liste.

### Améliorations :

~~Il serait préférable que le nom de chaque liste soit situé dans un bandeau propre à chaque tâche au lieu d\'être écrit en dessous.~~

~~Inutile d\'afficher autre chose sur le tableau.~~

**Plus tard :** on peut imaginer un deuxième (troisième, \...n<sup>ième</sup>)
tableau de listes accessible par onglet en haut de la fenêtre.

## Commandes

Interface via la souris 

**Référence complémentaire** : fonctionnement du Deck de Nextcloud pour
les \"glisser-déposer\" et la création de tâches.

- ~~**Bouton** de création de nouvelle liste \"Nouvelle liste\"~~ (ou clic droit sur le fond du tableau)

- **Bouton** d\'accès au menu des actions : Imprimer (tableau /liste) */ Rechercher ?*.

- ~~Un **clic gauche** sur une liste ouvre un écran pour :~~
  - ~~paramétrer la liste : saisie du nom, choix de la couleur.~~

- ~~Un **clic gauche** sur une icône dans la barre de titre de la liste permet de créer des tâches.~~

- un **clic droit** dans la liste permet de :
  - renommer la liste
    - supprimer la liste

- ~~un **glisser-déposer** permet de déplacer une tâche d\'une liste à l\'autre.~~

# Fonctions

~~Enregistrement automatique de toutes les modifications~~

## Création de liste :

~~Le bouton \"Nouvelle liste\" ouvre une fenêtre de paramétrage pour :~~

1. ~~lui donner un nom, un champ texte éditable~~

2. ~~choisir une couleur de fond~~

## Création de tâche

Un clic gauche sur le fond d\'une liste ouvre la liste en détail et
permet d\'ajouter/ modifier/réordonner/supprimer les tâches.

~~Une tâche est décrite par :~~

1. ~~son intitulé simple (ex : \"peindre le mur de l\'escalier\") champ texte éditable.~~

2. ~~une description précise, facultative : zone de texte.~~

3. ~~une date de fin facultative : champ date à remplir via un calendrier ou directement au format jj/mm/aaaa~~

## Modifier / supprimer listes et tâches : 

Clic droit sur une liste ou sur une tâche rouvre l\'écran de paramétrage
de la liste ou de la tâche.

## Déplacer une tâche

### En vue tableau : 

~~Glisser-déposer permet de déplacer une tâche d\'une liste à l\'autre~~

### En vue liste, 

~~Glisser-déposer permet de déplacer une tâche dans la liste (vers le haut ou le bas).~~

## Impression des listes

### L\'option \"Imprimer\" du menu d\'actions

permet d\'imprimer toutes les listes, l\'une derrière l\'autre → menu
système d\'impression.

Après ouverture d\'une liste, une icône dans la barre de titre de la
liste permet d\'ouvrir le menu système pour imprimer la liste en cours
uniquement.

### Option de l\'impression : 

Imprimer seulement les titres des tâches ou imprimer tous les détails
(nom, description et date de fin).

# Environnement

## Exécution

~~Comme To Do, cet utilitaire doit fonctionner en local (pas sur serveur).~~

## Programmation : 

~~Python ou Java ?~~

Code commenté == facile à modifier par papi ;-))

Avec une BD type Mysql, facile à sauvegarder/restaurer.

~~Utiliser les variables d\'environnement (fenêtres, chemins, \...)~~

## Licence

~~Gnu Linux - Creative common :~~

~~[CC BY-NC](https://creativecommons.org/licenses/by-nc/4.0/)~~

~~This license enables reusers to distribute, remix, adapt, and build upon~~
~~the material in any medium or format for noncommercial purposes only,~~
~~and only so long as attribution is given to the creator. CC BY-NC~~
~~includes the following elements:~~

## Partage 

~~Sur Github bien sûr.~~
