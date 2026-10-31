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
    video: "assets/hero/hero.mp4",     // vidéo de fond (mp4, muette, ~10-20 s)
    poster: "assets/hero/hero.jpg"     // image affichée avant/à la place de la vidéo
  },

  /* ---------- Localisation (carte) ---------- */
  map: {
    query: "Kuta, Lombok, Indonesia",  // ← remplacer par l'adresse / coordonnées exactes
    googleMapsLink: "https://maps.google.com/?q=Kuta+Lombok"
  },

  /* ---------- Les villas ---------- */
  villas: [
    {
      id: "villa-1",
      name: "Villa Ratus I",
      tagline: { fr: "Lumineuse, ouverte, piscine privée", en: "Bright, open-plan, private pool" },
      description: {
        fr: "Une villa pensée pour ralentir : grands espaces ouverts sur la piscine, matériaux naturels, lumière douce du matin au coucher du soleil. À quelques minutes des plus belles plages du sud de Lombok.",
        en: "A villa designed for slowing down: open living spaces facing the pool, natural materials and soft light from sunrise to sunset. Minutes away from South Lombok's most beautiful beaches."
      },
      stats: { bedrooms: 2, bathrooms: 2, guests: 4, size: "— m²" },
      price: { fr: "Prix sur demande", en: "Price on request" },
      amenities: ["pool", "ac", "wifi", "kitchen", "parking", "garden", "cleaning", "towels"],
      photos: [
        "assets/villa-1/1.jpg",
        "assets/villa-1/2.jpg",
        "assets/villa-1/3.jpg",
        "assets/villa-1/4.jpg",
        "assets/villa-1/5.jpg"
      ]
    },
    {
      id: "villa-2",
      name: "Villa Ratus II",
      tagline: { fr: "Intimiste, tropicale, au calme", en: "Intimate, tropical, peaceful" },
      description: {
        fr: "Nichée dans la verdure, la seconde villa offre une atmosphère plus intimiste : chambres spacieuses, salle de bain semi-ouverte, terrasse face à la piscine. Idéale pour les couples, amis ou surfeurs.",
        en: "Tucked into the greenery, the second villa has a more intimate feel: spacious bedrooms, semi-open bathroom, terrace facing the pool. Ideal for couples, friends or surfers."
      },
      stats: { bedrooms: 2, bathrooms: 2, guests: 4, size: "— m²" },
      price: { fr: "Prix sur demande", en: "Price on request" },
      amenities: ["pool", "ac", "wifi", "kitchen", "parking", "terrace", "cleaning", "surfrack"],
      photos: [
        "assets/villa-2/1.jpg",
        "assets/villa-2/2.jpg",
        "assets/villa-2/3.jpg",
        "assets/villa-2/4.jpg",
        "assets/villa-2/5.jpg"
      ]
    }
  ],

  /* ---------- Galerie générale ---------- */
  gallery: [
    "assets/gallery/1.jpg", "assets/gallery/2.jpg", "assets/gallery/3.jpg",
    "assets/gallery/4.jpg", "assets/gallery/5.jpg", "assets/gallery/6.jpg",
    "assets/gallery/7.jpg", "assets/gallery/8.jpg"
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
      id: "party",
      icon: "music",
      title: { fr: "Soirées & parties", en: "Parties & nightlife" },
      text: {
        fr: "Beach bars, live music, sunset sessions et soirées chaque semaine. On vous partage le programme du moment.",
        en: "Beach bars, live music, sunset sessions and weekly parties. We'll share what's on this week."
      },
      contact: "Contact soirées",
      whatsapp: "620000000003",
      message: { fr: "Bonjour, quelles sont les soirées cette semaine à Kuta ?", en: "Hi, what parties are on this week in Kuta?" }
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
    },
    {
      id: "food",
      icon: "basket",
      title: { fr: "Courses & livraison", en: "Groceries & delivery" },
      text: {
        fr: "Supérettes, marché local et livraison de courses à la villa. Voir le guide ci-dessous pour les adresses.",
        en: "Mini-markets, local market and grocery delivery to the villa. See the guide below for addresses."
      },
      contact: "",
      whatsapp: "",
      message: { fr: "", en: "" }
    }
  ],

  /* ---------- Guide de Kuta Lombok ---------- */
  guide: {
    surf: [
      { name: "Gerupuk", level: { fr: "Tous niveaux", en: "All levels" }, text: { fr: "Baie protégée accessible en bateau, plusieurs pics pour débutants comme confirmés.", en: "Sheltered bay reached by boat, several peaks for beginners and pros alike." } },
      { name: "Selong Belanak", level: { fr: "Débutant", en: "Beginner" }, text: { fr: "Longue plage de sable blanc, vagues douces : parfait pour une première session.", en: "Long white-sand beach with gentle waves: perfect for a first session." } },
      { name: "Mawi", level: { fr: "Confirmé", en: "Advanced" }, text: { fr: "Une gauche/droite puissante sur récif, réservée aux surfeurs expérimentés.", en: "A powerful reef break for experienced surfers." } },
      { name: "Tanjung Aan", level: { fr: "Plage & baignade", en: "Beach & swim" }, text: { fr: "Eau turquoise et coucher de soleil depuis la colline de Bukit Merese.", en: "Turquoise water and sunsets from Bukit Merese hill." } }
    ],
    nightlife: [
      { day: { fr: "Lundi", en: "Monday" }, text: { fr: "À compléter", en: "To be completed" } },
      { day: { fr: "Mercredi", en: "Wednesday" }, text: { fr: "À compléter", en: "To be completed" } },
      { day: { fr: "Vendredi", en: "Friday" }, text: { fr: "À compléter", en: "To be completed" } },
      { day: { fr: "Samedi", en: "Saturday" }, text: { fr: "À compléter", en: "To be completed" } }
    ],
    groceries: [
      { name: { fr: "Supérettes (Indomaret / Alfamart)", en: "Mini-markets (Indomaret / Alfamart)" }, text: { fr: "Produits du quotidien, eau, snacks — ouvertes tard.", en: "Everyday essentials, water, snacks — open late." } },
      { name: { fr: "Épiceries internationales", en: "International grocery stores" }, text: { fr: "Produits importés, fromages, vins, produits frais.", en: "Imported goods, cheese, wine, fresh produce." } },
      { name: { fr: "Marché local", en: "Local market" }, text: { fr: "Fruits tropicaux, poisson et légumes frais, à petits prix.", en: "Tropical fruit, fresh fish and vegetables at local prices." } }
    ]
  }
};
