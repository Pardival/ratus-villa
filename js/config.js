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
    poster: "assets/villa/piscine.webp"  // image affichée avant/à la place de la vidéo
  },

  /* ---------- Localisation (carte) ---------- */
  map: {
    // Recherche utilisée pour la carte et l'itinéraire (même résultat que de taper "Ratus Villa" dans Google Maps).
    query: "Ratus Villa, Kuta, Lombok",
    // Optionnel : coordonnées GPS exactes pour un repère précis (ex: lat: -8.8955, lng: 116.2840).
    // Si renseignées, elles sont prioritaires sur la recherche ci-dessus.
    lat: null,
    lng: null
  },

  /* ---------- Les villas (2 villas identiques) ---------- */
  villa: {
    count: 2,
    name: "Ratus Villa",
    tagline: { fr: "2 villas identiques · piscine privée", en: "2 identical villas · private pool" },
    description: {
      fr: "Deux villas jumelles, construites côte à côte et aménagées à l'identique. Chacune a sa propre piscine, son salon ouvert sur le jardin et sa cuisine équipée : on profite d'une vraie intimité, au calme, à quelques minutes des plages et des spots de surf.",
      en: "Two twin villas, built side by side and fitted out identically. Each has its own pool, an open living room facing the garden and a fully equipped kitchen: real privacy and peace, minutes from the beaches and surf spots."
    },
    groupNote: {
      fr: "En couple ou entre amis, louez une villa. En famille ou en groupe, réservez les deux et partagez le même coin de paradis.",
      en: "As a couple or with friends, rent one villa. With family or a group, book both and share the same little corner of paradise."
    },
    // Caractéristiques PAR villa
    stats: { bedrooms: 2, bathrooms: 2, guests: 4, size: "— m²" },
    price: { fr: "Prix sur demande", en: "Price on request" },
    amenities: ["pool", "ac", "wifi", "kitchen", "parking", "garden", "terrace", "cleaning", "towels", "surfrack"],
photos: [
      { src: "assets/villa/piscine.webp",            alt: { fr: "Piscine privée avec cascade", en: "Private pool with waterfall" } },
      { src: "assets/villa/chambre-elephant.webp",   alt: { fr: "Chambre sous charpente en bois", en: "Bedroom under the wooden roof" } },
      { src: "assets/villa/salon.webp",              alt: { fr: "Salon en teck", en: "Teak living room" } },
      { src: "assets/villa/chambre-rhinoceros.webp", alt: { fr: "Chambre en mezzanine", en: "Mezzanine bedroom" } },
      { src: "assets/villa/salon-escalier.webp",     alt: { fr: "Salon et escalier vers la chambre", en: "Living room and stairs to the bedroom" } }
    ]
  },

  /* ---------- Galerie générale ---------- */
  gallery: [
    "assets/villa/piscine.webp",
    "assets/villa/chambre-elephant.webp",
    "assets/villa/salon.webp",
    "assets/villa/chambre-rhinoceros.webp",
    "assets/villa/salon-escalier.webp"
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
      { name: { fr: "Supérettes Indomaret / Alfamart", en: "Indomaret / Alfamart mini-markets" }, place: "Indomaret Kuta Lombok", text: { fr: "Eau, snacks, produits du quotidien — ouvertes tard.", en: "Water, snacks, everyday essentials — open late." } },
      { name: { fr: "Supermarchés & épiceries", en: "Supermarkets & grocery stores" }, place: "supermarket Kuta Lombok", text: { fr: "Produits importés, frais, vins, fromages.", en: "Imported goods, fresh produce, wine, cheese." } },
      { name: { fr: "Marché local", en: "Local market" }, place: "Pasar Kuta Lombok", text: { fr: "Fruits tropicaux, poisson et légumes frais, à petits prix.", en: "Tropical fruit, fresh fish and vegetables at local prices." } }
    ]
  }
};
