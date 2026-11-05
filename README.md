# Ratus Villa — Kuta, Lombok

Site vitrine (HTML / CSS / JS) en 4 langues (anglais par défaut, français, espagnol, indonésien),
avec une **page d'administration** pour tout modifier sans toucher au code : **`/admin`**.

---

## 1. Modifier le site : `/admin`

Ouvrir `https://<adresse-du-site>/admin/` sur téléphone ou ordinateur.

Tout le contenu se modifie depuis cette page :

| Rubrique | Contenu |
|---|---|
| Accueil | Photo et vidéo de fond, titre, sous-titre, boutons |
| Bienvenue | Texte de présentation, photo, chiffres clés |
| La villa | Description, chambres / sdb / voyageurs / surface, équipements |
| Photos de la villa · Galerie | Ajouter, supprimer, réordonner (glisser ou flèches), décrire les photos |
| Services | Surf, scooter, chauffeur, massage… avec leur numéro WhatsApp (ajout/suppression libres) |
| Surf & plages · Soirées · Courses | Le guide local, avec le lieu utilisé par le bouton « Y aller » |
| Localisation | Image de la carte, adresse pour l'itinéraire, temps de trajet |
| Réservation & WhatsApp | Numéro de réservation, message pré-rempli, dernière section |
| Menus & boutons | Tous les petits libellés du site |
| Réglages | Mot de passe, versions précédentes, traduction en masse, sauvegarde |

**Langues** — la barre « Langue modifiée » choisit la langue en cours d'écriture.
Chaque texte a un bouton **« Traduire dans les autres langues »** (traduction automatique gratuite,
à relire) ; on peut aussi écrire chaque langue soi-même. Les pastilles EN/FR/ES/ID montrent les
langues remplies (vert) ou vides (orange).

**Aperçu** — le bouton 👁 affiche le site avec les modifications, avant publication.
**Publier** — met les modifications en ligne. Tant qu'on ne publie pas, rien ne change sur le site
(le brouillon est gardé sur l'appareil).

L'interface de l'admin existe en anglais, français, espagnol et indonésien (boutons en bas du menu).

---

## 2. Hébergement

L'admin choisit automatiquement le bon mode d'enregistrement.

### A. Hébergeur classique avec PHP (recommandé pour la suite — ex. Niagahoster, Hostinger, Rumahweb, cPanel)

1. Copier **tous les fichiers** du site dans le dossier public de l'hébergement (`public_html`).
2. Ouvrir `https://<domaine>/admin/` → l'admin demande de **créer le mot de passe** (1re visite).
3. Donner au client : l'adresse `/admin` + ce mot de passe. C'est tout.

- PHP 7.4 ou plus récent requis (standard chez tous les hébergeurs).
- Les dossiers `content/` et `assets/uploads/` doivent être modifiables par PHP (c'est le cas par défaut).
- À chaque publication, une copie de l'ancienne version est gardée (`content/backups/`, 30 dernières)
  et restaurable depuis *Réglages*.
- **Mot de passe oublié** : dans le gestionnaire de fichiers de l'hébergeur, supprimer
  `admin/data/auth.php`, puis retourner sur `/admin` pour en créer un nouveau.
- Taille maximale des fichiers envoyés : fixée par l'hébergeur (`upload_max_filesize`). Les photos
  sont automatiquement redimensionnées et compressées avant l'envoi.

### B. GitHub Pages (hébergement actuel)

GitHub Pages n'exécute pas de PHP : l'admin enregistre directement dans le dépôt GitHub, avec une
**clé d'accès** collée une seule fois sur l'appareil du client.

Créer la clé (une fois, par le propriétaire du dépôt) :
1. github.com → *Settings* → *Developer settings* → *Personal access tokens* → **Fine-grained tokens** → *Generate new token*.
2. *Repository access* : **Only select repositories** → `ratus-villa`.
3. *Permissions* → *Repository permissions* → **Contents : Read and write**.
4. Expiration : la plus longue possible (ou « No expiration »).
5. Copier la clé (`github_pat_…`) et la donner au client avec l'adresse `/admin`.

Le site se met à jour environ 1 minute après chaque publication.

### Déménager de GitHub vers un hébergeur PHP

Copier tous les fichiers du dépôt sur le nouvel hébergement (A). Le contenu, les photos et les
textes suivent tels quels.

---

## 3. Structure

```
index.html               Page unique du site
css/style.css            Design & animations
js/main.js               Affichage du site (lit content/content.json)
content/content.json     ← TOUT le contenu (textes en 4 langues, photos, contacts…)
assets/villa/            Photos d'origine
assets/uploads/          Photos et vidéos ajoutées depuis /admin
admin/                   Page d'administration
  index.html, admin.js, admin.css, admin-i18n.js
  api.php                Enregistrement sur hébergeur PHP
  data/                  Mot de passe (privé, protégé)
js/vendor/qrcode.js      Générateur de QR code (MIT, Kazuhiko Arase)
```

Dans les textes, `*mot*` s'affiche en italique coloré et un retour à la ligne crée un saut de ligne.
Les numéros WhatsApp s'écrivent au format international, chiffres uniquement (ex. `6281234567890`).
