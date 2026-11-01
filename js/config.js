/* ==========================================================================
   RATUS VILLA — FICHIER DE CONFIGURATION
   --------------------------------------------------------------------------
   👉 C'est le SEUL fichier à modifier pour remplir le site :
      numéros WhatsApp, villas, photos, services, contacts.
   Les textes sont bilingues : { fr: "...", en: "..." }.
   Les numéros WhatsApp s'écrivent au format international SANS "+" ni espaces
   (ex : Indonésie 62812xxxxxxx, France 336xxxxxxxx).
   ========================================================================== */

window.RATUS = {

  /* ---------- Contact principal (réservation) ---------- */
  booking: {
    name: "Ratus Villa",
    whatsapp: "620000000000",          // ← À REMPLACER
    email: "hello@ratusvilla.com",     // ← À REMPLACER (ou laisser vide "")
    instagram: "",                     // ex: "https://instagram.com/ratusvilla"
    message: {
      fr: "Bonjour ! Je suis intéressé(e) par Ratus Villa à Kuta Lombok. Pouvez-vous me donner les disponibilités ?",
      en: "Hi! I'm interested in Ratus Villa in Kuta Lombok. Could you share the availability?"
    }
  },

  /* ---------- Médias du hero (vidéo d'accueil) ---------- */
  hero: {
    video: "assets/hero/hero.mp4",       // vidéo de fond (mp4, muette, ~10-20 s) — à ajouter
    poster: "assets/villa/piscine-cascade.webp"  // image affichée avant/à la place de la vidéo
  },

  /* ---------- Localisation (carte) ---------- */
  map: {
    // Recherche utilisée pour la carte et l'itinéraire (même résultat que de taper "Ratus Villa" dans Google Maps).
    query: "Ratus Villa, Kuta, Lombok",
    // Optionnel : coordonnées GPS exactes pour un repère précis (ex: lat: -8.8955, lng: 116.2840).
    // Si renseignées, elles sont prioritaires sur la recherche ci-dessus.
    lat: null,
    lng: null,
    // Carte Google interactive (optionnelle). Laisser vide "" pour afficher l'image assets/villa/plan-acces.webp.
    // Pour la réactiver, coller ici le lien "src" de Google Maps > Partager > Intégrer une carte.
    embed: "",
    embedDisabled: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14263.750229242929!2d116.26466493009977!3d-8.884611764073984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dcda9000f83c567%3A0x2b5aae675413cf86!2sRatus%20villa!5e1!3m2!1sfr!2sid!4v1793509560123!5m2!1sfr!2sid"
  },

  /* ---------- Les villas (2 villas identiques) ---------- */
  villa: {
    count: 2,
    name: "Ratus Villa",
    tagline: { fr: "2 villas identiques · piscine privée", en: "2 identical villas · private pool" },
    description: {
      fr: "Deux villas jumelles, côte à côte. Chacune a son salon, sa cuisine équipée et sa piscine privée, deux chambres climatisées, un balcon et deux salles de bain. Le tout au calme, à quelques minutes des plages et des spots de surf.",
      en: "Two twin villas, side by side. Each has its own living room, equipped kitchen and private pool, two air-conditioned bedrooms, a balcony and two bathrooms. All in a quiet spot, minutes from the beaches and surf spots."
    },
    groupNote: {
      fr: "En couple ou entre amis, louez une villa. En famille ou en groupe, réservez les deux et partagez le même coin de paradis.",
      en: "As a couple or with friends, rent one villa. With family or a group, book both and share the same little corner of paradise."
    },
    // Caractéristiques PAR villa
    stats: { bedrooms: 2, bathrooms: 2, guests: 4, size: "— m²" },
    amenities: ["pool", "bathtub", "ac", "wifi", "tv", "kitchen", "balcony", "parking", "towels", "surfrack"],
    photos: [
      { src: "assets/villa/piscine-cascade.webp", alt: { fr: "Piscine privée et sa cascade", en: "Private pool and waterfall" } },
      { src: "assets/villa/chambre-elephant.webp", alt: { fr: "Chambre sous charpente en bois", en: "Bedroom under the wooden roof" } },
      { src: "assets/villa/salle-de-bain-baignoire.webp", alt: { fr: "Salle de bain en marbre avec baignoire", en: "Marble bathroom with bathtub" } },
      { src: "assets/villa/salon-cuisine.webp", alt: { fr: "Salon ouvert sur la cuisine équipée", en: "Living room opening onto the kitchen" } },
      { src: "assets/villa/balcon.webp", alt: { fr: "Balcon en bois à l'étage", en: "Upstairs wooden balcony" } },
      { src: "assets/villa/salle-de-bain-douche.webp", alt: { fr: "Douche à l'italienne, robinetterie dorée", en: "Walk-in shower with gold fittings" } },
      { src: "assets/villa/salon-tv.webp", alt: { fr: "Salon avec TV et escalier en teck", en: "Living room with TV and teak staircase" } },
      { src: "assets/villa/chambre-lanternes.webp", alt: { fr: "Chambre climatisée aux lampes en rotin", en: "Air-conditioned bedroom with rattan lamps" } },
      { src: "assets/villa/piscine.webp", alt: { fr: "La piscine vue d'en haut", en: "The pool from above" } },
      { src: "assets/villa/mezzanine-nuit.webp", alt: { fr: "La mezzanine en bois, de nuit", en: "The wooden mezzanine at night" } },
      { src: "assets/villa/chambre-rhinoceros.webp", alt: { fr: "Chambre en mezzanine", en: "Mezzanine bedroom" } },
      { src: "assets/villa/salon.webp", alt: { fr: "Salon en teck", en: "Teak living room" } },
      { src: "assets/villa/salon-escalier.webp", alt: { fr: "Salon et escalier vers la chambre", en: "Living room and stairs to the bedroom" } }
    ]
  },

  /* ---------- Galerie générale ---------- */
  gallery: [
    "assets/villa/piscine-cascade.webp",
    "assets/villa/salle-de-bain-baignoire.webp",
    "assets/villa/balcon.webp",
    "assets/villa/chambre-elephant.webp",
    "assets/villa/salon-cuisine.webp",
    "assets/villa/salle-de-bain-douche.webp",
    "assets/villa/mezzanine-nuit.webp",
    "assets/villa/chambre-lanternes.webp",
    "assets/villa/piscine.webp",
    "assets/villa/salon-tv.webp"
  ],

  /* ---------- Services & contacts locaux ----------
     Chaque service peut avoir un contact WhatsApp → bouton + QR code automatiques.
     Laisser whatsapp: "" pour masquer le bouton.                                   */
  services: [
    {
      id: "surf",
      icon: "wave",
      title: { fr: "Surf", en: "Surf" },
      text: {
        fr: "Cours tous niveaux, location de planches et sorties en bateau vers les meilleurs spots de Gerupuk et alentours.",
        en: "Lessons for all levels, board rental and boat trips to the best spots around Gerupuk."
      },
      contact: "Contact surf",
      whatsapp: "620000000001",
      message: { fr: "Bonjour, je séjourne à Ratus Villa et j'aimerais des infos sur le surf.", en: "Hi, I'm staying at Ratus Villa and would like info about surfing." }
    },
    {
      id: "scooter",
      icon: "scooter",
      title: { fr: "Location de scooter", en: "Scooter rental" },
      text: {
        fr: "Livraison du scooter directement à la villa, avec casques et porte-planche. Le moyen idéal pour explorer la côte.",
        en: "Scooter delivered straight to the villa, with helmets and surf rack. The best way to explore the coast."
      },
      contact: "Contact scooter",
      whatsapp: "620000000002",
      message: { fr: "Bonjour, je séjourne à Ratus Villa et j'aimerais louer un scooter.", en: "Hi, I'm staying at Ratus Villa and would like to rent a scooter." }
    },
    {
      id: "transfer",
      icon: "car",
      title: { fr: "Transfert aéroport", en: "Airport transfer" },
      text: {
        fr: "Chauffeur privé depuis l'aéroport international de Lombok (environ 30 min) ou pour vos excursions sur l'île.",
        en: "Private driver from Lombok International Airport (about 30 min) or for your island day trips."
      },
      contact: "Chauffeur",
      whatsapp: "620000000004",
      message: { fr: "Bonjour, j'ai besoin d'un transfert pour Ratus Villa.", en: "Hi, I need a transfer to Ratus Villa." }
    },
    {
      id: "massage",
      icon: "lotus",
      title: { fr: "Massage à la villa", en: "In-villa massage" },
      text: {
        fr: "Massages balinais et soins relaxants directement à la villa, après une session de surf.",
        en: "Balinese massage and relaxing treatments right at the villa, after a surf session."
      },
      contact: "Massage",
      whatsapp: "620000000005",
      message: { fr: "Bonjour, j'aimerais réserver un massage à Ratus Villa.", en: "Hi, I'd like to book a massage at Ratus Villa." }
    }
  ],

  /* ---------- Guide de Kuta Lombok ----------
     "place" = ce qui est recherché dans Google Maps / Plans pour le bouton "Y aller".  */
  guide: {
    surf: [
      { name: "Gerupuk", place: "Gerupuk Beach, Lombok", level: { fr: "Tous niveaux", en: "All levels" }, text: { fr: "Baie protégée accessible en bateau, plusieurs pics pour débutants comme confirmés.", en: "Sheltered bay reached by boat, several peaks for beginners and pros alike." } },
      { name: "Selong Belanak", place: "Selong Belanak Beach, Lombok", level: { fr: "Débutant", en: "Beginner" }, text: { fr: "Longue plage de sable blanc, vagues douces : parfait pour une première session.", en: "Long white-sand beach with gentle waves: perfect for a first session." } },
      { name: "Mawi", place: "Mawi Beach, Lombok", level: { fr: "Confirmé", en: "Advanced" }, text: { fr: "Une vague puissante sur récif, réservée aux surfeurs expérimentés.", en: "A powerful reef break for experienced surfers." } },
      { name: "Tanjung Aan", place: "Tanjung Aan Beach, Lombok", level: { fr: "Plage & baignade", en: "Beach & swim" }, text: { fr: "Eau turquoise, sable blanc et coucher de soleil depuis la colline de Bukit Merese.", en: "Turquoise water, white sand and sunsets from Bukit Merese hill." } }
    ],
    // Programme des soirées (day: 1 = lundi … 7 = dimanche)
    nightlife: [
      { day: 1, venue: "Surfers Bar",  place: "Surfers Bar, Kuta, Lombok",  time: { fr: "Après minuit", en: "After midnight" } },
      { day: 2, venue: "The Local",    place: "The Local, Kuta, Lombok",    time: { fr: "Dès 21 h", en: "Busy from 9 pm" } },
      { day: 3, venue: "Pizza Shack",  place: "Pizza Shack, Kuta, Lombok",  time: { fr: "Dès 21 h", en: "Busy from 9 pm" } },
      { day: 4, venue: "The Local",    place: "The Local, Kuta, Lombok",    time: { fr: "Dès 21 h", en: "Busy from 9 pm" } },
      { day: 5, venue: "Surfers Bar",  place: "Surfers Bar, Kuta, Lombok",  time: { fr: "Après minuit", en: "After midnight" } },
      { day: 6, venue: "Rasta Bar",    place: "Rasta Bar, Kuta, Lombok",    time: { fr: "Après minuit", en: "After midnight" } },
      { day: 7, venue: "The Local",    place: "The Local, Kuta, Lombok",    time: { fr: "Dès 21 h", en: "Busy from 9 pm" } }
    ],
    groceries: [
      { name: { fr: "Pepito Market", en: "Pepito Market" }, place: "Pepito Market Kuta Lombok",
        text: { fr: "Le supermarché de Kuta pour faire toutes vos courses : produits frais, fruits et légumes, viande, boissons, épicerie et produits du quotidien, locaux comme importés.",
                en: "Kuta's supermarket for all your grocery shopping: fresh produce, fruit and veg, meat, drinks, pantry and everyday essentials, both local and imported." } }
    ]
  }
};
