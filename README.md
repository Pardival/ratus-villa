# Ratus Villa — Kuta, Lombok

Site vitrine statique (HTML / CSS / JS, sans dépendance ni build), hébergeable directement sur **GitHub Pages**.

## Mettre le site en ligne (GitHub Pages)

1. Sur GitHub : **Settings → Pages**
2. *Source* : **Deploy from a branch**
3. Branche : `main` (ou la branche de travail), dossier **/ (root)** → **Save**
4. Après ~1 minute, le site est disponible à l'adresse `https://<utilisateur>.github.io/ratus-villa/`
   → c'est ce lien qu'il faut mettre dans le QR code / les groupes Facebook.

## Remplir le contenu

Tout le contenu modifiable est dans **`js/config.js`** :

| Élément | Où |
|---|---|
| Numéro WhatsApp de réservation, e-mail | `booking` |
| Vidéo / image d'accueil | `hero` |
| La villa (2 villas identiques : description, chambres, sdb, voyageurs, surface, prix, équipements, photos) | `villa` |
| Galerie | `gallery` |
| Services + contacts WhatsApp (surf, scooter, chauffeur, massage…) | `services` |
| Spots de surf, programme des soirées, courses (+ lieu pour le bouton « Y aller ») | `guide` |
| Localisation de la villa (recherche « Ratus Villa » ou coordonnées GPS) | `map` |

Les numéros WhatsApp s'écrivent au format international **sans `+` ni espaces** (ex. `6281234567890`).
Les QR codes sont générés automatiquement à partir de ces numéros.

## Ajouter les photos et vidéos

Il suffit de déposer les fichiers avec ces noms — tant qu'une photo est absente, un dégradé « Photo à venir » s'affiche à sa place.

```
assets/
├── hero/      hero.mp4 (vidéo d'accueil, muette, 10-20 s, < 10 Mo) · hero.jpg (image de secours + partage Facebook)
├── villa/     photos de la villa en .webp (noms descriptifs : piscine-surf, chambre-mezzanine-vue…) · plan-acces.webp (carte) (+ piscine-partage.jpg pour Facebook)
├── gallery/   1.jpg … 8.jpg
└── guide/     surf.jpg · party.jpg · scooter.jpg · food.jpg
```

Conseil : photos en JPG, ~2000 px de large max, compressées (ex. avec squoosh.app) pour un chargement rapide sur mobile.

## Structure

```
index.html          Page unique
css/style.css       Design & animations
js/config.js        ← CONTENU À MODIFIER
js/main.js          Interactions (FR/EN, onglets, galerie, lightbox, QR, parallax…)
js/vendor/qrcode.js Générateur de QR code (MIT, Kazuhiko Arase)
```
