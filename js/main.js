/* ==========================================================================
   RATUS VILLA — Interactions
   (Le contenu se modifie dans js/config.js, pas ici.)
   ========================================================================== */
(function () {
  "use strict";

  const C = window.RATUS;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------------- Textes fixes (FR / EN) ---------------- */
  const I18N = {
    fr: {
      "nav.villas": "Les villas", "nav.gallery": "Galerie", "nav.services": "Services", "nav.guide": "Guide Kuta", "nav.contact": "Contact", "nav.book": "Réserver",
      "hero.eyebrow": "Kuta · Lombok · Indonésie",
      "hero.lead": "Deux villas jumelles avec piscine privée, à quelques minutes des plus belles plages et spots de surf du sud de Lombok.",
      "hero.discover": "Découvrir les villas", "hero.whatsapp": "Disponibilités", "hero.scroll": "Défiler",
      "intro.eyebrow": "Bienvenue",
      "intro.title": "Un refuge au cœur de Lombok,<br><em>entre océan et collines.</em>",
      "intro.p1": "Ratus Villa, ce sont deux villas dans un coin calme de Kuta, au sud de Lombok. Des espaces lumineux et une piscine privée pour se rafraîchir.",
      "intro.p2": "Sur place, on vous facilite tout : surf, scooter, chauffeur, massage, soirées et bonnes adresses…",
      "stats.villas": "Villas privées", "stats.bedrooms": "Chambres", "stats.beach": "Min de la plage", "stats.airport": "Min de l'aéroport",
      "villas.eyebrow": "Les villas", "villas.title": "Deux villas jumelles, <em>à votre disposition.</em>",
      "villa.bedrooms": "Chambres", "villa.bathrooms": "Sdb", "villa.guests": "Voyageurs", "villa.size": "Surface", "villa.book": "Demander les disponibilités",
      "villa.twin": "villas identiques", "villa.per": "Par villa", "villa.one": "1 villa", "villa.both": "Les 2 villas", "villa.upto": "jusqu'à {n} voyageurs",
      "villa.photos": "Voir les photos",
      "gallery.eyebrow": "Galerie", "gallery.title": "Instants <em>Ratus.</em>", "gallery.aside": "Faites glisser · touchez une photo pour l'agrandir.",
      "services.eyebrow": "Services & contacts", "services.title": "Tout à portée <em>d'un message.</em>",
      "services.lead": "Nos contacts de confiance sur place. Un clic pour leur écrire sur WhatsApp.",
      "services.write": "Écrire sur WhatsApp",
      "guide.eyebrow": "Guide local", "guide.title": "Vivre Kuta <em>comme un local.</em>",
      "guide.surf": "Surf & plages", "guide.night": "Soirées", "guide.move": "Se déplacer", "guide.food": "Courses",
      "guide.surf.title": "Le paradis des surfeurs",
      "guide.surf.text": "La côte sud de Lombok aligne des dizaines de spots, des baies abritées pour débuter aux récifs mythiques. La meilleure saison va d'avril à octobre, mais on surfe toute l'année.",
      "guide.night.title": "Sunsets & soirées",
      "guide.night.text": "À Kuta, la fête tourne de bar en bar selon le jour de la semaine. Voici où sortir chaque soir, et à quelle heure y aller.",
      "night.tonight": "Ce soir", "days": ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
      "go": "Y aller", "go.apple": "Plans",
      "guide.move.title": "Le scooter, la liberté",
      "guide.move.text": "À Kuta, tout se fait en scooter. Comptez quelques euros par jour, livraison à la villa possible. Permis international recommandé, casque obligatoire.",
      "guide.move.t1": "Livraison & récupération à la villa", "guide.move.t2": "Porte-planche de surf disponible", "guide.move.t3": "Chauffeur privé pour les longues distances",
      "guide.move.cta": "Louer un scooter",
      "guide.food.title": "Faire ses courses",
      "guide.food.text": "Toutes les villas sont équipées d'une cuisine. Voici où trouver de quoi la remplir — des produits locaux aux produits importés.",
      "location.eyebrow": "Localisation", "location.title": "Au cœur du <em>sud de Lombok.</em>",
      "location.d1": "Plage de Kuta", "location.d5": "Aéroport international", "location.cta": "Itinéraire vers la villa", "location.apple": "Ouvrir dans Plans", "location.open": "Voir l'itinéraire",
      "mbar.book": "Réserver", "mbar.guide": "Guide", "mbar.go": "Y aller",
      "cta.eyebrow": "Réservation", "cta.title": "Votre séjour à Lombok<br><em>commence ici.</em>",
      "cta.lead": "Écrivez-nous sur WhatsApp pour les disponibilités, les tarifs et toutes vos questions. Réponse rapide.",
      "cta.scan": "Scannez pour nous écrire", "cta.whatsapp": "Écrire sur WhatsApp", "cta.share": "Partager le site", "cta.copied": "Lien copié !",
      "footer.made": "Fait avec amour sous le soleil de Lombok.",
      "qr.hint": "Scannez avec l'appareil photo de votre téléphone.", "qr.open": "Ouvrir WhatsApp",
      "photo": "Photo à venir",
      "am.pool": "Piscine privée", "am.ac": "Climatisation", "am.wifi": "Wi-Fi", "am.kitchen": "Cuisine équipée", "am.parking": "Parking scooter",
      "am.garden": "Jardin tropical", "am.cleaning": "Ménage", "am.towels": "Linge & serviettes", "am.terrace": "Terrasse", "am.surfrack": "Rack à surf", "am.tv": "Smart TV", "am.bathtub": "Baignoire", "am.balcony": "Balcon"
    },
    en: {
      "nav.villas": "Villas", "nav.gallery": "Gallery", "nav.services": "Services", "nav.guide": "Kuta guide", "nav.contact": "Contact", "nav.book": "Book",
      "hero.eyebrow": "Kuta · Lombok · Indonesia",
      "hero.lead": "Two twin private-pool villas, minutes from South Lombok's most beautiful beaches and surf spots.",
      "hero.discover": "Discover the villas", "hero.whatsapp": "Availability", "hero.scroll": "Scroll",
      "intro.eyebrow": "Welcome",
      "intro.title": "A hideaway in the heart of Lombok,<br><em>between ocean and hills.</em>",
      "intro.p1": "Ratus Villa is two villas in a quiet corner of Kuta, South Lombok. Bright living spaces and a private pool to cool off.",
      "intro.p2": "On the ground, we make everything easy: surf, scooter, driver, massage, parties and local tips…",
      "stats.villas": "Private villas", "stats.bedrooms": "Bedrooms", "stats.beach": "Min to the beach", "stats.airport": "Min to the airport",
      "villas.eyebrow": "The villas", "villas.title": "Twin villas, <em>at your disposal.</em>",
      "villa.bedrooms": "Bedrooms", "villa.bathrooms": "Baths", "villa.guests": "Guests", "villa.size": "Size", "villa.book": "Check availability",
      "villa.twin": "identical villas", "villa.per": "Per villa", "villa.one": "1 villa", "villa.both": "Both villas", "villa.upto": "up to {n} guests",
      "villa.photos": "See photos",
      "gallery.eyebrow": "Gallery", "gallery.title": "Ratus <em>moments.</em>", "gallery.aside": "Swipe · tap a photo to enlarge.",
      "services.eyebrow": "Services & contacts", "services.title": "Everything is <em>one message away.</em>",
      "services.lead": "Our trusted local contacts. One tap to message them on WhatsApp.",
      "services.write": "Message on WhatsApp",
      "guide.eyebrow": "Local guide", "guide.title": "Live Kuta <em>like a local.</em>",
      "guide.surf": "Surf & beaches", "guide.night": "Nightlife", "guide.move": "Getting around", "guide.food": "Groceries",
      "guide.surf.title": "A surfer's paradise",
      "guide.surf.text": "Lombok's south coast lines up dozens of spots, from sheltered bays for beginners to legendary reefs. Best season is April to October, but you can surf all year round.",
      "guide.night.title": "Sunsets & parties",
      "guide.night.text": "In Kuta, the party moves from bar to bar depending on the day. Here's where to go each night, and what time to show up.",
      "night.tonight": "Tonight", "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "go": "Go there", "go.apple": "Apple Maps",
      "guide.move.title": "Scooter = freedom",
      "guide.move.text": "In Kuta, everything happens by scooter. A few euros a day, delivery to the villa available. International licence recommended, helmet mandatory.",
      "guide.move.t1": "Delivery & pick-up at the villa", "guide.move.t2": "Surfboard rack available", "guide.move.t3": "Private driver for longer trips",
      "guide.move.cta": "Rent a scooter",
      "guide.food.title": "Grocery shopping",
      "guide.food.text": "Every villa has a fully equipped kitchen. Here's where to fill it up — from local produce to imported goods.",
      "location.eyebrow": "Location", "location.title": "In the heart of <em>South Lombok.</em>",
      "location.d1": "Kuta beach", "location.d5": "International airport", "location.cta": "Directions to the villa", "location.apple": "Open in Apple Maps", "location.open": "Get directions",
      "mbar.book": "Book", "mbar.guide": "Guide", "mbar.go": "Directions",
      "cta.eyebrow": "Booking", "cta.title": "Your Lombok stay<br><em>starts here.</em>",
      "cta.lead": "Message us on WhatsApp for availability, rates and any question. Quick reply.",
      "cta.scan": "Scan to message us", "cta.whatsapp": "Message on WhatsApp", "cta.share": "Share this site", "cta.copied": "Link copied!",
      "footer.made": "Made with love under the Lombok sun.",
      "qr.hint": "Scan with your phone camera.", "qr.open": "Open WhatsApp",
      "photo": "Photo coming soon",
      "am.pool": "Private pool", "am.ac": "Air conditioning", "am.wifi": "Wi-Fi", "am.kitchen": "Equipped kitchen", "am.parking": "Scooter parking",
      "am.garden": "Tropical garden", "am.cleaning": "Housekeeping", "am.towels": "Linen & towels", "am.terrace": "Terrace", "am.surfrack": "Surf rack", "am.tv": "Smart TV", "am.bathtub": "Bathtub", "am.balcony": "Balcony"
    }
  };

  const AMENITY_ICONS = { pool: "i-pool", ac: "i-ac", wifi: "i-wifi", kitchen: "i-kitchen", parking: "i-parking", garden: "i-garden", cleaning: "i-clean", towels: "i-towel", terrace: "i-terrace", surfrack: "i-surfrack", tv: "i-tv", bathtub: "i-bath", balcony: "i-terrace" };
  const SERVICE_ICONS = { wave: "i-wave", scooter: "i-scooter", music: "i-music", car: "i-car", lotus: "i-lotus", basket: "i-basket" };

  let lang = "fr";
  try { lang = localStorage.getItem("ratus-lang") || (navigator.language || "fr").slice(0, 2); } catch (e) {}
  if (!I18N[lang]) lang = "en";

  const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.fr[k] || k;
  const L = (obj) => (obj && typeof obj === "object") ? (obj[lang] || obj.fr || "") : (obj || "");
  const icon = (id, cls = "ico") => `<svg class="${cls}"><use href="#${id}"/></svg>`;
  const IS_IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const gDir = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
  const aDir = (q) => `https://maps.apple.com/?daddr=${encodeURIComponent(q)}`;
  const villaDest = () => (C.map.lat != null && C.map.lng != null) ? `${C.map.lat},${C.map.lng}` : C.map.query;
  const goButtons = (q) => `<div class="go">
      <a class="go__btn" href="${gDir(q)}" target="_blank" rel="noopener">${icon("i-route")}<span>${t("go")}</span></a>
      ${IS_IOS ? `<a class="go__btn go__btn--alt" href="${aDir(q)}" target="_blank" rel="noopener">${t("go.apple")}</a>` : ""}
    </div>`;
  const waLink = (num, msg) => `https://wa.me/${num}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;

  /* ---------------- Médias : image si présente, sinon placeholder ---------------- */
  let toneCounter = 0;
  function hydrateMedia(el) {
    if (el.dataset.hydrated) return;
    el.dataset.hydrated = "1";
    if (!el.dataset.tone) el.dataset.tone = String(toneCounter++ % 5);
    if (!el.dataset.label) el.dataset.label = t("photo");
    const src = el.dataset.src;
    if (!src) return;
    const img = new Image();
    img.alt = el.dataset.alt || "";
    img.decoding = "async";
    img.loading = "lazy";
    img.onload = () => { el.classList.add("has-img"); requestAnimationFrame(() => img.classList.add("is-loaded")); };
    img.onerror = () => img.remove();
    img.src = src;
    el.appendChild(img);
  }
  const srcOf = (p) => (typeof p === "string" ? p : (p && p.src) || "");
  const altOf = (p) => (typeof p === "string" ? "" : L(p && p.alt));
  const mediaHTML = (src, extra = "", cls = "") => `<div class="media ${cls}" data-src="${srcOf(src)}" data-alt="${altOf(src).replace(/"/g, "&quot;")}" ${extra}></div>`;
  const hydrateAll = (root = document) => $$(".media", root).forEach(hydrateMedia);

  /* ---------------- QR ---------------- */
  function qrSvg(text) {
    if (typeof qrcode !== "function") return "";
    const q = qrcode(0, "M");
    q.addData(text);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  }

  /* ---------------- Rendus dynamiques ---------------- */
  function applyI18n() {
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    $$("#langToggle [data-lang]").forEach((s) => s.classList.toggle("is-active", s.dataset.lang === lang));
  }

  function bindBooking() {
    const b = C.booking;
    const href = waLink(b.whatsapp, L(b.message));
    $$(".js-wa-booking").forEach((a) => (a.href = href));
    $("#bookingQr").innerHTML = qrSvg(href);

    const st = $$(".stat [data-count]");
    if (st.length >= 2) { st[0].dataset.count = C.villa.count; st[1].dataset.count = C.villa.count * C.villa.stats.bedrooms; }

    $$(".js-wa-service").forEach((a) => {
      const s = C.services.find((x) => x.id === a.dataset.service);
      if (s && s.whatsapp) a.href = waLink(s.whatsapp, L(s.message)); else a.hidden = true;
    });
  }

  function villaHTML(v) {
    const s = v.stats;
    const photosK = v.photos.length;
    return `
      <article class="villa">
        <div class="villa__gallery">
          <div class="villa__mainwrap">
            ${mediaHTML(v.photos[0] || "", `data-tone="1" data-label="${t("photo")}"`, "villa__main")}
            <button class="villa__count" type="button">${icon("i-size")}<span>1 / ${photosK}</span></button>
          </div>
          <div class="villa__thumbs" style="--n:${Math.min(photosK, 7)}">
            ${v.photos.map((p, k) => mediaHTML(p, `data-k="${k}" data-tone="${k % 5}"`, k === 0 ? "is-active" : "")).join("")}
          </div>
        </div>
        <div class="villa__info">
          <span class="tag">${L(v.tagline)}</span>
          <h3 class="villa__name">${v.name}</h3>
          <p class="villa__desc">${L(v.description)}</p>
          <p class="villa__per">${t("villa.per")}</p>
          <div class="villa__facts">
            <div class="fact">${icon("i-bed")}<strong>${s.bedrooms}</strong><span>${t("villa.bedrooms")}</span></div>
            <div class="fact">${icon("i-bath")}<strong>${s.bathrooms}</strong><span>${t("villa.bathrooms")}</span></div>
            <div class="fact">${icon("i-guests")}<strong>${s.guests}</strong><span>${t("villa.guests")}</span></div>
            <div class="fact">${icon("i-size")}<strong>${s.size}</strong><span>${t("villa.size")}</span></div>
          </div>
          <ul class="amenities">
            ${v.amenities.map((a) => `<li>${icon(AMENITY_ICONS[a] || "i-clean")}${t("am." + a)}</li>`).join("")}
          </ul>
          <div class="formula">
            <div class="formula__item"><b>${t("villa.one")}</b><span>${t("villa.upto").replace("{n}", s.guests)}</span></div>
            <div class="formula__plus">+</div>
            <div class="formula__item formula__item--hl"><b>${t("villa.both")}</b><span>${t("villa.upto").replace("{n}", s.guests * v.count)}</span></div>
          </div>
          <p class="villa__note">${L(v.groupNote)}</p>
          <div class="villa__foot">
            <a class="btn btn--dark js-wa-booking" href="#" target="_blank" rel="noopener">${icon("i-whatsapp")}<span>${t("villa.book")}</span></a>
          </div>
        </div>
      </article>`;
  }

  function mountVilla() {
    const stage = $("#villaStage");
    const v = C.villa;
    stage.innerHTML = villaHTML(v);
    const el = $(".villa", stage);
    hydrateAll(el);

    const main = $(".villa__main", el), counter = $(".villa__count span", el);
    let idx = 0;
    const show = (k) => {
      idx = (k + v.photos.length) % v.photos.length;
      const th = $$(".villa__thumbs .media", el)[idx];
      $$(".villa__thumbs .media", el).forEach((x) => x.classList.toggle("is-active", x === th));
      th.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      main.classList.remove("has-img", "is-swapping");
      main.removeAttribute("data-hydrated");
      $$("img", main).forEach((im) => im.remove());
      main.dataset.src = srcOf(v.photos[idx]);
      main.dataset.alt = altOf(v.photos[idx]);
      main.dataset.tone = th.dataset.tone;
      void main.offsetWidth;
      main.classList.add("is-swapping");
      hydrateMedia(main);
      counter.textContent = `${idx + 1} / ${v.photos.length}`;
    };
    $$(".villa__thumbs .media", el).forEach((th) => th.addEventListener("click", () => show(+th.dataset.k)));
    // swipe sur la photo principale (mobile)
    let sx = 0, sy = 0, swiped = false;
    main.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiped = false; }, { passive: true });
    main.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped = true; show(idx + (dx < 0 ? 1 : -1)); }
    });
    const srcs = v.photos.map(srcOf);
    main.addEventListener("click", () => { if (!swiped) openLightbox(srcs, idx); });
    $(".villa__count", el).addEventListener("click", () => openLightbox(srcs, idx));
  }

  function renderGallery() {
    const rail = $("#galleryRail");
    rail.innerHTML = C.gallery.map((src, i) => mediaHTML(src, `data-i="${i}"`, "gallery__item reveal")).join("");
    $$(".gallery__item", rail).forEach((el, i) => { el.style.setProperty("--d", i % 4); });
    hydrateAll(rail);
  }

  function renderServices() {
    const grid = $("#servicesGrid");
    grid.innerHTML = C.services.map((s, i) => {
      const actions = s.whatsapp
        ? `<div class="service__actions">
             <a class="btn btn--light" href="${waLink(s.whatsapp, L(s.message))}" target="_blank" rel="noopener">${icon("i-whatsapp")}<span>${t("services.write")}</span></a>
           </div>`
        : "";
      return `<article class="service reveal" style="--d:${i % 2}">
          <div class="service__head"><div class="service__icon">${icon(SERVICE_ICONS[s.icon] || "i-wave")}</div>
          <h3>${L(s.title)}</h3></div>
          <p>${L(s.text)}</p>
          ${actions}
        </article>`;
    }).join("");
    $$(".btn-qr", grid).forEach((b) => b.addEventListener("click", () => {
      const s = C.services[+b.dataset.qr];
      openQr(L(s.title) + (s.contact ? " · " + s.contact : ""), waLink(s.whatsapp, L(s.message)));
    }));
  }

  function renderGuide() {
    const g = C.guide;
    $("#spotList").innerHTML = g.surf.map((s, i) => `<div class="spot" style="--i:${i}"><span class="spot__level">${L(s.level)}</span><h4>${s.name}</h4><p>${L(s.text)}</p>${s.place ? goButtons(s.place) : ""}</div>`).join("");
    const today = ((new Date().getDay() + 6) % 7) + 1; // 1 = lundi
    const days = t("days");
    const list = g.nightlife.slice().sort((a, b) => ((a.day - today + 7) % 7) - ((b.day - today + 7) % 7));
    $("#agendaList").innerHTML = list.map((n, i) => `<li class="${n.day === today ? "is-today" : ""}" style="--i:${i}">
        <div class="agenda__day"><b>${days[n.day - 1]}</b>${n.day === today ? `<em>${t("night.tonight")}</em>` : ""}</div>
        <div class="agenda__venue"><strong>${n.venue}</strong><span>${L(n.time)}</span></div>
        ${n.place ? goButtons(n.place) : ""}
      </li>`).join("");
    $("#groceryList").innerHTML = g.groceries.map((s, i) => `<div class="spot" style="--i:${i}"><h4>${L(s.name)}</h4><p>${L(s.text)}</p>${s.place ? goButtons(s.place) : ""}</div>`).join("");
  }

  function renderMap() {
    const dest = villaDest();
    const frame = $("#mapFrame");
    if (frame && C.map.embed) frame.src = C.map.embed; else if (frame) frame.remove();
    $$(".js-directions").forEach((a) => (a.href = gDir(dest)));
    const apple = $(".js-apple-villa");
    if (apple && IS_IOS) { apple.href = aDir(dest); apple.hidden = false; }
  }

  function renderAll(animate) {
    applyI18n();
    mountVilla();
    bindBooking();
    renderServices();
    renderGuide();
    hydrateAll();
    observeReveals();
  }

  /* ---------------- Hero média ---------------- */
  function setupHero() {
    const poster = $("#heroPoster"), video = $("#heroVideo"), scene = $(".hero__scene");
    if (C.hero.poster) {
      const img = new Image();
      img.onload = () => { poster.src = C.hero.poster; poster.hidden = false; scene.style.opacity = 0; };
      img.src = C.hero.poster;
    }
    if (C.hero.video && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.src = C.hero.video;
      video.hidden = false;
      video.addEventListener("canplay", () => { video.classList.add("is-ready"); video.play().catch(() => {}); }, { once: true });
      video.addEventListener("error", () => (video.hidden = true));
    }
  }

  /* ---------------- Split letters ---------------- */
  function splitText() {
    $$("[data-split]").forEach((el, n) => {
      const text = el.textContent;
      el.innerHTML = [...text].map((c, i) => `<span class="char" style="--i:${i + n * 5}">${c === " " ? "&nbsp;" : c}</span>`).join("");
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  let io;
  function observeReveals() {
    if (!io) {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    }
    $$(".reveal:not(.is-in)").forEach((el) => {
      if (el.dataset.delay) el.style.setProperty("--d", el.dataset.delay);
      io.observe(el);
    });
  }

  /* ---------------- Compteurs ---------------- */
  function setupCounters() {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target, end = +el.dataset.count, suf = el.dataset.suffix || "";
        const t0 = performance.now(), dur = 1600;
        const tick = (now) => {
          const p = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - p, 4);
          el.textContent = Math.round(end * eased) + suf;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    $$("[data-count]").forEach((el) => co.observe(el));
  }

  /* ---------------- Nav, parallax, scroll ---------------- */
  function setupScroll() {
    const nav = $("#nav"), fab = $(".fab"), hero = $("#hero");
    const parallax = $$("[data-parallax]");
    const sections = $$("main section[id]");
    const links = $$("#navLinks a");
    let lastY = 0, ticking = false;

    const onScroll = () => {
      const y = window.scrollY, vh = window.innerHeight;
      nav.classList.toggle("is-scrolled", y > 40);
      nav.classList.toggle("is-hidden", y > vh && y > lastY + 4 && !document.body.classList.contains("menu-open"));
      if (y < lastY - 4) nav.classList.remove("is-hidden");
      fab.classList.toggle("is-visible", y > vh * 0.6);
      document.body.classList.toggle("show-mbar", y > vh * 0.5);

      parallax.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        el.style.transform = `translate3d(0, ${(-r.top * +el.dataset.parallax).toFixed(1)}px, 0)`;
      });
      if (y < vh) {
        const c = $(".hero__content", hero);
        c.style.opacity = String(Math.max(0, 1 - y / (vh * 0.75)));
        c.style.transform = `translateY(${y * 0.18}px)`;
      }

      let current = "";
      sections.forEach((s) => { if (s.getBoundingClientRect().top < vh * 0.4) current = s.id; });
      links.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + current));
      lastY = y; ticking = false;
    };
    window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
    onScroll();
  }

  function setupMenu() {
    const toggle = () => { document.body.classList.toggle("menu-open"); document.body.classList.toggle("no-scroll", document.body.classList.contains("menu-open")); };
    $("#burger").addEventListener("click", toggle);
    $$("#navLinks a").forEach((a) => a.addEventListener("click", () => { if (document.body.classList.contains("menu-open")) toggle(); }));
  }

  function setupLang() {
    $("#langToggle").addEventListener("click", () => {
      lang = lang === "fr" ? "en" : "fr";
      try { localStorage.setItem("ratus-lang", lang); } catch (e) {}
      document.body.animate([{ opacity: 1 }, { opacity: .25 }, { opacity: 1 }], { duration: 700, easing: "ease-in-out" });
      setTimeout(() => { renderAll(true); $$(".reveal").forEach((el) => el.classList.add("is-in")); }, 300);
    });
  }

  function setupGuide() {
    $$("#guideNav .chip").forEach((chip) => chip.addEventListener("click", () => {
      $$("#guideNav .chip").forEach((c) => c.classList.toggle("is-active", c === chip));
      $$(".panel").forEach((p) => p.classList.toggle("is-active", p.id === chip.dataset.target));
    }));
  }

  /* ---------------- Galerie : drag horizontal ---------------- */
  function setupRail() {
    const rail = $("#galleryRail");
    let down = false, startX = 0, startScroll = 0, moved = false;
    rail.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") return; down = true; moved = false; startX = e.clientX; startScroll = rail.scrollLeft; });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 5) { moved = true; rail.classList.add("is-dragging"); }
      rail.scrollLeft = startScroll - dx;
    });
    window.addEventListener("pointerup", () => { down = false; rail.classList.remove("is-dragging"); });
    rail.addEventListener("click", (e) => {
      const item = e.target.closest(".gallery__item");
      if (!item || moved) return;
      openLightbox(C.gallery.map(srcOf), +item.dataset.i);
    });
  }

  /* ---------------- Lightbox ---------------- */
  const lb = { list: [], i: 0 };
  function showLb() {
    const box = $("#lightboxImg");
    box.className = "lightbox__img media";
    box.removeAttribute("data-hydrated");
    box.innerHTML = "";
    box.dataset.src = lb.list[lb.i];
    box.dataset.tone = String(lb.i % 5);
    box.dataset.label = t("photo");
    hydrateMedia(box);
    box.animate([{ opacity: 0, transform: "scale(.97)" }, { opacity: 1, transform: "none" }], { duration: 600, easing: "cubic-bezier(.22,.8,.24,1)" });
    $("#lightboxCount").textContent = `${lb.i + 1} / ${lb.list.length}`;
  }
  function openLightbox(list, i) { lb.list = list; lb.i = i; showLb(); $("#lightbox").classList.add("is-open"); document.body.classList.add("no-scroll"); }
  function closeLightbox() { $("#lightbox").classList.remove("is-open"); document.body.classList.remove("no-scroll"); }
  function stepLb(d) { lb.i = (lb.i + d + lb.list.length) % lb.list.length; showLb(); }
  function setupLightbox() {
    const box = $("#lightbox");
    $(".lightbox__close", box).addEventListener("click", closeLightbox);
    $(".lightbox__prev", box).addEventListener("click", () => stepLb(-1));
    $(".lightbox__next", box).addEventListener("click", () => stepLb(1));
    box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lightbox__stage")) closeLightbox(); });
    let sx = 0;
    box.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
    box.addEventListener("touchend", (e) => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) stepLb(dx < 0 ? 1 : -1); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeLightbox(); closeQr(); }
      if (!box.classList.contains("is-open")) return;
      if (e.key === "ArrowRight") stepLb(1);
      if (e.key === "ArrowLeft") stepLb(-1);
    });
  }

  /* ---------------- QR modal ---------------- */
  function openQr(title, href) {
    $("#qrModalTitle").textContent = title;
    $("#qrModalCode").innerHTML = qrSvg(href);
    $("#qrModalLink").href = href;
    $("#qrModal").classList.add("is-open");
  }
  function closeQr() { $("#qrModal").classList.remove("is-open"); }
  function setupQr() {
    const m = $("#qrModal");
    $(".modal__close", m).addEventListener("click", closeQr);
    m.addEventListener("click", (e) => { if (e.target === m) closeQr(); });
  }

  /* ---------------- Partage ---------------- */


  /* ---------------- Init ---------------- */
  function init() {
    $("#year").textContent = new Date().getFullYear();
    splitText();
    renderGallery();
    renderMap();
    renderAll(false);
    setupHero();
    setupCounters();
    setupScroll();
    setupMenu();
    setupLang();
    setupGuide();
    setupRail();
    setupLightbox();
    setupQr();

    const finish = () => {
      document.body.classList.add("is-loaded");
      setTimeout(() => document.body.classList.remove("is-loading"), 900);
    };
    const minDelay = new Promise((r) => setTimeout(r, 1500));
    const loaded = new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r)));
    Promise.race([Promise.all([minDelay, loaded]), new Promise((r) => setTimeout(r, 3500))]).then(finish);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
