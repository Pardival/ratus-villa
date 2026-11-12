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

## 2. Hébergement : GitHub Pages

Le site est hébergé sur GitHub Pages. La page `/admin` enregistre les modifications directement
dans ce dépôt GitHub ; GitHub Pages remet le site à jour environ 1 minute après chaque publication.

### Mise en service (une seule fois, par le propriétaire du site)

1. **Créer une clé GitHub** — github.com → *Settings* → *Developer settings* →
   *Personal access tokens* → **Fine-grained tokens** → *Generate new token* :
   - *Expiration* : la plus longue possible ;
   - *Repository access* : **Only select repositories** → `ratus-villa` ;
   - *Permissions* → *Repository permissions* → **Contents : Read and write** ;
   - copier la clé (`github_pat_…`).
2. Ouvrir **`https://pardival.github.io/ratus-villa/admin/`** → écran *Première configuration* :
   coller la clé, choisir le **mot de passe** de l'équipe (10 caractères minimum).
3. Donner à l'équipe de la villa **l'adresse `/admin` et le mot de passe**. C'est tout :
   ils n'ont jamais à voir la clé GitHub.

La clé est enregistrée **chiffrée avec le mot de passe** (AES-256, PBKDF2 600 000 itérations)
dans `admin/access.json`. Sans le mot de passe, ce fichier est inutilisable — choisir un mot de
passe long et non devinable.

### Quand la clé expire (ou mot de passe perdu)

L'admin affiche « La clé GitHub a expiré ». Créer une nouvelle clé (étape 1), puis sur la page de
connexion : *Propriétaire du site* → *Refaire la configuration*. Si l'équipe est encore connectée,
*Réglages* → *Remplacer la clé GitHub* permet aussi de la changer sans changer le mot de passe.

### Bon à savoir

- Photos : redimensionnées et compressées automatiquement (WebP, 2000 px max).
- Vidéos : MP4, **45 Mo maximum** par fichier (limite liée à GitHub) — compresser les vidéos plus
  lourdes avant (ex. HandBrake, ou l'export « 720p » du téléphone).
- *Réglages* → *Versions précédentes* : chaque publication est conservée par GitHub et peut être
  rechargée puis republiée.
- Si le site passe un jour sur un nom de domaine personnalisé, rien à changer : le dépôt est
  indiqué dans `admin/index.html` (`<meta name="ratus-repo">`).

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
  access.json            Clé GitHub chiffrée par le mot de passe (créé à la 1re configuration)
js/vendor/qrcode.js      Générateur de QR code (MIT, Kazuhiko Arase)
```

Dans les textes, `*mot*` s'affiche en italique coloré et un retour à la ligne crée un saut de ligne.
Les numéros WhatsApp s'écrivent au format international, chiffres uniquement (ex. `6281234567890`).
