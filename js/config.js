/* ==========================================================================
   RATUS VILLA — FICHIER DE CONFIGURATION
   --------------------------------------------------------------------------
   👉 C'est le SEUL fichier à modifier pour remplir le site :
      numéros WhatsApp, villas, photos, services, contacts.
   Les textes sont en 4 langues : { fr, en, es, id } (anglais par défaut).
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
      en: "Hi! I'm interested in Ratus Villa in Kuta Lombok. Could you share the availability?", es: "¡Hola! Me interesa Ratus Villa en Kuta Lombok. ¿Me podéis indicar la disponibilidad?", id: "Halo! Saya tertarik dengan Ratus Villa di Kuta Lombok. Bisakah Anda menginformasikan ketersediaannya?"
    }
  },

  /* ---------- Médias du hero (vidéo d'accueil) ---------- */
  hero: {
    video: "assets/hero/hero.mp4",       // vidéo de fond (mp4, muette, ~10-20 s) — à ajouter
    poster: "assets/villa/piscine-surf.webp"  // image affichée avant/à la place de la vidéo
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
    tagline: { fr: "2 villas identiques · piscine privée", en: "2 identical villas · private pool", es: "2 villas idénticas · piscina privada", id: "2 vila identik · kolam renang pribadi" },
    description: {
      fr: "Deux villas jumelles, côte à côte. Chacune a son salon, sa cuisine équipée et sa piscine privée, deux chambres climatisées, un balcon et deux salles de bain. Le tout au calme, à quelques minutes des plages et des spots de surf.",
      en: "Two twin villas, side by side. Each has its own living room, equipped kitchen and private pool, two air-conditioned bedrooms, a balcony and two bathrooms. All in a quiet spot, minutes from the beaches and surf spots.", es: "Dos villas gemelas, una al lado de la otra. Cada una tiene su salón, su cocina equipada y su piscina privada, dos habitaciones con aire acondicionado, un balcón y dos baños. Todo en un lugar tranquilo, a pocos minutos de las playas y los spots de surf.", id: "Dua vila kembar yang bersebelahan. Masing-masing memiliki ruang tamu, dapur lengkap, dan kolam renang pribadi, dua kamar tidur ber-AC, balkon, serta dua kamar mandi. Semuanya di lokasi yang tenang, hanya beberapa menit dari pantai dan spot selancar."
    },
    groupNote: {
      fr: "En couple ou entre amis, louez une villa. En famille ou en groupe, réservez les deux et partagez le même coin de paradis.",
      en: "As a couple or with friends, rent one villa. With family or a group, book both and share the same little corner of paradise.", es: "En pareja o con amigos, alquila una villa. En familia o en grupo, reserva las dos y compartid el mismo rincón de paraíso.", id: "Berdua atau bersama teman, sewa satu vila. Bersama keluarga atau rombongan, pesan keduanya dan nikmati sudut surga yang sama."
    },
    // Caractéristiques PAR villa
    stats: { bedrooms: 2, bathrooms: 2, guests: 4, size: "— m²" },
    amenities: ["pool", "bathtub", "ac", "wifi", "tv", "kitchen", "balcony", "parking", "towels"],
    photos: [
      { src: "assets/villa/piscine-surf.webp", alt: { fr: "Piscine privée, planche de surf et skate", en: "Private pool with surfboard and skateboard", es: "Piscina privada con tabla de surf y skate", id: "Kolam renang pribadi dengan papan selancar dan skateboard" } },
      { src: "assets/villa/chambre-mezzanine-vue.webp", alt: { fr: "Chambre en mezzanine avec vue sur le balcon", en: "Mezzanine bedroom opening onto the balcony", es: "Habitación en altillo con vistas al balcón", id: "Kamar mezanin yang terbuka ke balkon" } },
      { src: "assets/villa/salle-de-bain-baignoire.webp", alt: { fr: "Salle de bain en marbre avec baignoire", en: "Marble bathroom with bathtub", es: "Baño de mármol con bañera", id: "Kamar mandi marmer dengan bathtub" } },
      { src: "assets/villa/salon-cuisine.webp", alt: { fr: "Salon ouvert sur la cuisine équipée", en: "Living room opening onto the kitchen", es: "Salón abierto a la cocina equipada", id: "Ruang tamu yang terbuka ke dapur" } },
      { src: "assets/villa/piscine-cascade.webp", alt: { fr: "Piscine privée et sa cascade", en: "Private pool and waterfall", es: "Piscina privada con cascada", id: "Kolam renang pribadi dengan air terjun" } },
      { src: "assets/villa/chambre-elephant.webp", alt: { fr: "Chambre sous charpente en bois", en: "Bedroom under the wooden roof", es: "Habitación bajo el techo de madera", id: "Kamar di bawah atap kayu" } },
      { src: "assets/villa/balcon.webp", alt: { fr: "Balcon en bois à l'étage", en: "Upstairs wooden balcony", es: "Balcón de madera en la planta alta", id: "Balkon kayu di lantai atas" } },
      { src: "assets/villa/salle-de-bain-douche.webp", alt: { fr: "Douche à l'italienne, robinetterie dorée", en: "Walk-in shower with gold fittings", es: "Ducha a ras de suelo con grifería dorada", id: "Shower walk-in dengan keran emas" } },
      { src: "assets/villa/piscine-nuit.webp", alt: { fr: "La piscine éclairée, de nuit", en: "The pool lit up at night", es: "La piscina iluminada de noche", id: "Kolam renang yang diterangi di malam hari" } },
      { src: "assets/villa/salon-tv.webp", alt: { fr: "Salon avec TV et escalier en teck", en: "Living room with TV and teak staircase", es: "Salón con TV y escalera de teca", id: "Ruang tamu dengan TV dan tangga jati" } },
      { src: "assets/villa/chambre-lanternes.webp", alt: { fr: "Chambre climatisée aux lampes en rotin", en: "Air-conditioned bedroom with rattan lamps", es: "Habitación con aire acondicionado y lámparas de ratán", id: "Kamar ber-AC dengan lampu rotan" } },
      { src: "assets/villa/chambre-rhinoceros.webp", alt: { fr: "Chambre en mezzanine", en: "Mezzanine bedroom", es: "Habitación en altillo", id: "Kamar mezanin" } },
      { src: "assets/villa/salon-escalier.webp", alt: { fr: "Salon et escalier vers la chambre", en: "Living room and stairs to the bedroom", es: "Salón y escalera hacia la habitación", id: "Ruang tamu dan tangga ke kamar" } },
      { src: "assets/villa/mezzanine-nuit.webp", alt: { fr: "La mezzanine en bois, de nuit", en: "The wooden mezzanine at night", es: "El altillo de madera de noche", id: "Mezanin kayu di malam hari" } },
      { src: "assets/villa/salon.webp", alt: { fr: "Salon en teck", en: "Teak living room", es: "Salón de teca", id: "Ruang tamu jati" } }
    ]
  },

  /* ---------- Galerie générale ---------- */
  gallery: [
    "assets/villa/piscine-nuit.webp",
    "assets/villa/piscine-surf.webp",
    "assets/villa/chambre-mezzanine-vue.webp",
    "assets/villa/salle-de-bain-baignoire.webp",
    "assets/villa/balcon.webp",
    "assets/villa/piscine-cascade.webp",
    "assets/villa/salon-cuisine.webp",
    "assets/villa/chambre-elephant.webp",
    "assets/villa/serviettes.webp",
    "assets/villa/piscine.webp"
  ],

  /* ---------- Services & contacts locaux ----------
     Chaque service peut avoir un contact WhatsApp → bouton + QR code automatiques.
     Laisser whatsapp: "" pour masquer le bouton.                                   */
  services: [
    {
      id: "surf",
      icon: "wave",
      title: { fr: "Surf", en: "Surf", es: "Surf", id: "Selancar" },
      text: {
        fr: "Cours tous niveaux, location de planches et sorties en bateau vers les meilleurs spots de Gerupuk et alentours.",
        en: "Lessons for all levels, board rental and boat trips to the best spots around Gerupuk.", es: "Clases para todos los niveles, alquiler de tablas y salidas en barco a los mejores spots de Gerupuk y alrededores.", id: "Kursus untuk semua level, sewa papan, dan perjalanan perahu ke spot terbaik di sekitar Gerupuk."
      },
      contact: "Contact surf",
      whatsapp: "620000000001",
      message: { fr: "Bonjour, je séjourne à Ratus Villa et j'aimerais des infos sur le surf.", en: "Hi, I'm staying at Ratus Villa and would like info about surfing.", es: "Hola, me alojo en Ratus Villa y me gustaría información sobre el surf.", id: "Halo, saya menginap di Ratus Villa dan ingin info tentang selancar." }
    },
    {
      id: "scooter",
      icon: "scooter",
      title: { fr: "Location de scooter", en: "Scooter rental", es: "Alquiler de scooter", id: "Sewa motor" },
      text: {
        fr: "Location de scooter avec casques et porte-planche. Le moyen idéal pour explorer la côte.",
        en: "Scooter rental with helmets and surf rack. The best way to explore the coast.", es: "Alquiler de scooter con cascos y portatablas. La mejor forma de explorar la costa.", id: "Sewa motor lengkap dengan helm dan rak papan selancar. Cara terbaik menjelajahi pesisir."
      },
      contact: "Contact scooter",
      whatsapp: "620000000002",
      message: { fr: "Bonjour, je séjourne à Ratus Villa et j'aimerais louer un scooter.", en: "Hi, I'm staying at Ratus Villa and would like to rent a scooter.", es: "Hola, me alojo en Ratus Villa y me gustaría alquilar un scooter.", id: "Halo, saya menginap di Ratus Villa dan ingin menyewa motor." }
    },
    {
      id: "transfer",
      icon: "car",
      title: { fr: "Transfert aéroport", en: "Airport transfer", es: "Traslado al aeropuerto", id: "Antar-jemput bandara" },
      text: {
        fr: "Chauffeur privé depuis l'aéroport international de Lombok (environ 30 min) ou pour vos excursions sur l'île.",
        en: "Private driver from Lombok International Airport (about 30 min) or for your island day trips.", es: "Chófer privado desde el aeropuerto internacional de Lombok (unos 30 min) o para tus excursiones por la isla.", id: "Sopir pribadi dari Bandara Internasional Lombok (sekitar 30 menit) atau untuk jalan-jalan keliling pulau."
      },
      contact: "Chauffeur",
      whatsapp: "620000000004",
      message: { fr: "Bonjour, j'ai besoin d'un transfert pour Ratus Villa.", en: "Hi, I need a transfer to Ratus Villa.", es: "Hola, necesito un traslado a Ratus Villa.", id: "Halo, saya butuh antar-jemput ke Ratus Villa." }
    },
    {
      id: "massage",
      icon: "lotus",
      title: { fr: "Massage", en: "Massage", es: "Masaje", id: "Pijat" },
      text: {
        fr: "Massages et soins relaxants, à votre disposition.",
        en: "Massages and relaxing treatments, at your disposal.", es: "Masajes y tratamientos relajantes, a tu disposición.", id: "Pijat dan perawatan relaksasi, siap untuk Anda."
      },
      contact: "Massage",
      whatsapp: "620000000005",
      message: { fr: "Bonjour, j'aimerais réserver un massage à Ratus Villa.", en: "Hi, I'd like to book a massage at Ratus Villa.", es: "Hola, me gustaría reservar un masaje en Ratus Villa.", id: "Halo, saya ingin memesan pijat di Ratus Villa." }
    }
  ],

  /* ---------- Guide de Kuta Lombok ----------
     "place" = ce qui est recherché dans Google Maps / Plans pour le bouton "Y aller".  */
  guide: {
    surf: [
      { name: "Gerupuk", place: "Gerupuk Beach, Lombok", level: { fr: "Tous niveaux", en: "All levels", es: "Todos los niveles", id: "Semua level" }, text: { fr: "Baie protégée accessible en bateau, plusieurs pics pour débutants comme confirmés.", en: "Sheltered bay reached by boat, several peaks for beginners and pros alike.", es: "Bahía protegida a la que se llega en barco, con varios picos para principiantes y expertos.", id: "Teluk terlindung yang dicapai dengan perahu, dengan beberapa titik ombak untuk pemula maupun mahir." } },
      { name: "Selong Belanak", place: "Selong Belanak Beach, Lombok", level: { fr: "Débutant", en: "Beginner", es: "Principiante", id: "Pemula" }, text: { fr: "Longue plage de sable blanc, vagues douces : parfait pour une première session.", en: "Long white-sand beach with gentle waves: perfect for a first session.", es: "Larga playa de arena blanca con olas suaves: perfecta para una primera sesión.", id: "Pantai pasir putih yang panjang dengan ombak lembut: cocok untuk pertama kali berselancar." } },
      { name: "Mawi", place: "Mawi Beach, Lombok", level: { fr: "Confirmé", en: "Advanced", es: "Avanzado", id: "Mahir" }, text: { fr: "Une vague puissante sur récif, réservée aux surfeurs expérimentés.", en: "A powerful reef break for experienced surfers.", es: "Una ola potente sobre arrecife, para surfistas con experiencia.", id: "Ombak karang yang kuat untuk peselancar berpengalaman." } },
      { name: "Tanjung Aan", place: "Tanjung Aan Beach, Lombok", level: { fr: "Plage & baignade", en: "Beach & swim", es: "Playa y baño", id: "Pantai & berenang" }, text: { fr: "Eau turquoise, sable blanc et coucher de soleil depuis la colline de Bukit Merese.", en: "Turquoise water, white sand and sunsets from Bukit Merese hill.", es: "Agua turquesa, arena blanca y atardeceres desde la colina de Bukit Merese.", id: "Air biru toska, pasir putih, dan matahari terbenam dari Bukit Merese." } }
    ],
    // Programme des soirées (day: 1 = lundi … 7 = dimanche)
    nightlife: [
      { day: 1, venue: "Surfers Bar",  place: "Surfers Bar, Kuta, Lombok",  time: { fr: "Après minuit", en: "After midnight", es: "Después de medianoche", id: "Setelah tengah malam" } },
      { day: 2, venue: "The Local",    place: "The Local, Kuta, Lombok",    time: { fr: "Dès 21 h", en: "Busy from 9 pm", es: "Desde las 21 h", id: "Ramai mulai pukul 21.00" } },
      { day: 3, venue: "Pizza Shack",  place: "Pizza Shack, Kuta, Lombok",  time: { fr: "Dès 21 h", en: "Busy from 9 pm", es: "Desde las 21 h", id: "Ramai mulai pukul 21.00" } },
      { day: 4, venue: "The Local",    place: "The Local, Kuta, Lombok",    time: { fr: "Dès 21 h", en: "Busy from 9 pm", es: "Desde las 21 h", id: "Ramai mulai pukul 21.00" } },
      { day: 5, venue: "Surfers Bar",  place: "Surfers Bar, Kuta, Lombok",  time: { fr: "Après minuit", en: "After midnight", es: "Después de medianoche", id: "Setelah tengah malam" } },
      { day: 6, venue: "Rasta Bar",    place: "Rasta Bar, Kuta, Lombok",    time: { fr: "Après minuit", en: "After midnight", es: "Después de medianoche", id: "Setelah tengah malam" } },
      { day: 7, venue: "The Local",    place: "The Local, Kuta, Lombok",    time: { fr: "Dès 21 h", en: "Busy from 9 pm", es: "Desde las 21 h", id: "Ramai mulai pukul 21.00" } }
    ],
    groceries: [
      { name: { fr: "Pepito Market", en: "Pepito Market", es: "Pepito Market", id: "Pepito Market" }, place: "Pepito Market Kuta Lombok",
        text: { fr: "Le supermarché de Kuta pour faire toutes vos courses : produits frais, fruits et légumes, viande, boissons, épicerie et produits du quotidien, locaux comme importés.",
                en: "Kuta's supermarket for all your grocery shopping: fresh produce, fruit and veg, meat, drinks, pantry and everyday essentials, both local and imported.", es: "El supermercado de Kuta para hacer toda la compra: productos frescos, frutas y verduras, carne, bebidas, despensa y productos del día a día, locales e importados.", id: "Supermarket di Kuta untuk semua kebutuhan belanja Anda: produk segar, buah dan sayur, daging, minuman, bahan makanan, dan kebutuhan sehari-hari, baik lokal maupun impor." } }
    ]
  }
};
