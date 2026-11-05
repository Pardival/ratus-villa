/* ==========================================================================
   RATUS VILLA — Interactions
   Le contenu (textes en 4 langues, photos, services…) est dans content/content.json
   et se modifie depuis la page /admin.
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  const LANGS = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "id", label: "Bahasa Indonesia" }
  ];
  const DAYS = {
    en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    fr: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
    es: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    id: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
  };

  // Mode aperçu (utilisé par /admin) : ?preview=1[&lang=xx]
  const params = new URLSearchParams(location.search);
  const PREVIEW = params.has("preview");

  let C = null; // contenu chargé
  let lang = "en"; // anglais par défaut ; le choix du visiteur est mémorisé
  try { const saved = localStorage.getItem("ratus-lang"); if (saved && LANGS.some((l) => l.code === saved)) lang = saved; } catch (e) {}
  if (PREVIEW && LANGS.some((l) => l.code === params.get("lang"))) lang = params.get("lang");

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // *mot* = italique coloré, retour à la ligne = <br>
  const md = (s) => esc(s).replace(/\*([^*]+)\*/g, "<em>$1</em>").replace(/\n/g, "<br>");
  const pick = (o) => (o && typeof o === "object") ? (o[lang] || o.en || o.fr || "") : (o == null ? "" : String(o));
  const t = (k) => { const v = C.texts && C.texts[k]; return v ? pick(v) : ""; };
  const tPlain = (k) => t(k).replace(/\*/g, "");
  const L = (o) => esc(pick(o));
  const icon = (id, cls = "ico") => `<svg class="${cls}"><use href="#${id}"/></svg>`;
  const ico = (name) => icon("i-" + (name || "wave"));
  const IS_IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const gDir = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
  const aDir = (q) => `https://maps.apple.com/?daddr=${encodeURIComponent(q)}`;
  const villaDest = () => { const m = C.location || {}; return (m.lat != null && m.lng != null && m.lat !== "" && m.lng !== "") ? `${m.lat},${m.lng}` : (m.query || "Ratus Villa, Kuta, Lombok"); };
  const goButtons = (q) => `<div class="go">
      <a class="go__btn" href="${esc(gDir(q))}" target="_blank" rel="noopener">${icon("i-route")}<span>${esc(tPlain("go"))}</span></a>
      ${IS_IOS ? `<a class="go__btn go__btn--alt" href="${esc(aDir(q))}" target="_blank" rel="noopener">${esc(tPlain("go.apple"))}</a>` : ""}
    </div>`;
  const cleanNum = (n) => String(n || "").replace(/[^\d]/g, "");
  const waLink = (num, msg) => `https://wa.me/${cleanNum(num)}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;

  /* ---------------- Médias : image si présente, sinon placeholder ---------------- */
  let toneCounter = 0;
  function hydrateMedia(el) {
    if (el.dataset.hydrated) return;
    el.dataset.hydrated = "1";
    if (!el.dataset.tone) el.dataset.tone = String(toneCounter++ % 5);
    if (!el.dataset.label) el.dataset.label = tPlain("photo");
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
  const altOf = (p) => (typeof p === "string" ? "" : pick(p && p.alt));
  const mediaHTML = (p, extra = "", cls = "") => `<div class="media ${cls}" data-src="${esc(srcOf(p))}" data-alt="${esc(altOf(p))}" ${extra}></div>`;
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
    $$("[data-i18n]").forEach((el) => { el.textContent = tPlain(el.dataset.i18n); });
    $$("[data-i18n-html]").forEach((el) => { el.innerHTML = md(t(el.dataset.i18nHtml)); });
    const cur = $("#langCur"); if (cur) cur.textContent = lang.toUpperCase();
    $$("#langMenu [data-lang]").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.lang === lang)));
  }

  function bindBooking() {
    const b = C.booking;
    const href = waLink(b.whatsapp, pick(b.message));
    $$(".js-wa-booking").forEach((a) => (a.href = href));
    $("#bookingQr").innerHTML = qrSvg(href);


  }

  function villaHTML(v) {
    const s = v.stats;
    const photosK = v.photos.length;
    return `
      <article class="villa">
        <div class="villa__gallery">
          <div class="villa__mainwrap">
            ${mediaHTML(v.photos[0] || "", `data-tone="1" data-label="${esc(tPlain("photo"))}"`, "villa__main")}
            <button class="villa__count" type="button">${icon("i-size")}<span>1 / ${photosK}</span></button>
          </div>
          <div class="villa__thumbs" style="--n:${Math.min(photosK, 8)}">
            ${v.photos.map((p, k) => mediaHTML(p, `data-k="${k}" data-tone="${k % 5}"`, k === 0 ? "is-active" : "")).join("")}
          </div>
        </div>
        <div class="villa__info">
          <span class="tag">${L(v.tagline)}</span>
          <h3 class="villa__name">${esc(v.name)}</h3>
          <p class="villa__desc">${L(v.description)}</p>
          <p class="villa__per">${esc(tPlain("villa.per"))}</p>
          <div class="villa__facts">
            <div class="fact">${icon("i-bed")}<strong>${esc(s.bedrooms)}</strong><span>${esc(tPlain("villa.bedrooms"))}</span></div>
            <div class="fact">${icon("i-bath")}<strong>${esc(s.bathrooms)}</strong><span>${esc(tPlain("villa.bathrooms"))}</span></div>
            <div class="fact">${icon("i-guests")}<strong>${esc(s.guests)}</strong><span>${esc(tPlain("villa.guests"))}</span></div>
            <div class="fact">${icon("i-size")}<strong>${esc(s.size)}</strong><span>${esc(tPlain("villa.size"))}</span></div>
          </div>
          <ul class="amenities">
            ${(v.amenities || []).map((a) => `<li>${ico(a.icon)}${L(a.label)}</li>`).join("")}
          </ul>
          <div class="formula">
            <div class="formula__item"><b>${esc(tPlain("villa.one"))}</b><span>${esc(tPlain("villa.upto").replace("{n}", s.guests))}</span></div>
            <div class="formula__plus">+</div>
            <div class="formula__item formula__item--hl"><b>${esc(tPlain("villa.both"))}</b><span>${esc(tPlain("villa.upto").replace("{n}", (+s.guests || 0) * (+v.count || 1)))}</span></div>
          </div>
          <p class="villa__note">${L(v.groupNote)}</p>
          <div class="villa__foot">
            <a class="btn btn--dark js-wa-booking" href="#" target="_blank" rel="noopener">${icon("i-whatsapp")}<span>${esc(tPlain("villa.book"))}</span></a>
          </div>
        </div>
      </article>`;
  }

  function mountVilla() {
    const stage = $("#villaStage");
    const v = C.villa;
    if (!v.photos || !v.photos.length) v.photos = [{ src: "" }];
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
    rail.innerHTML = (C.gallery || []).map((p, i) => mediaHTML(p, `data-i="${i}"`, "gallery__item reveal")).join("");
    $$(".gallery__item", rail).forEach((el, i) => { el.style.setProperty("--d", i % 4); });
    hydrateAll(rail);
  }

  function renderServices() {
    const grid = $("#servicesGrid");
    grid.innerHTML = C.services.map((s, i) => {
      const actions = s.whatsapp
        ? `<div class="service__actions">
             <a class="btn btn--light" href="${waLink(s.whatsapp, pick(s.message))}" target="_blank" rel="noopener">${icon("i-whatsapp")}<span>${esc(tPlain("services.write"))}</span></a>
             <button class="btn-qr" data-qr="${i}" aria-label="QR code">${icon("i-qr")}</button>
           </div>`
        : "";
      return `<article class="service reveal" style="--d:${i % 2}">
          <div class="service__head"><div class="service__icon">${ico(s.icon)}</div>
          <h3>${L(s.title)}</h3></div>
          <p>${L(s.text)}</p>
          ${actions}
        </article>`;
    }).join("");
    $$(".btn-qr", grid).forEach((b) => b.addEventListener("click", () => {
      const s = C.services[+b.dataset.qr];
      openQr(pick(s.title), waLink(s.whatsapp, pick(s.message)));
    }));
  }

  function renderGuide() {
    const g = C.guide;
    $("#spotList").innerHTML = g.surf.map((s, i) => `<div class="spot" style="--i:${i}"><span class="spot__level">${L(s.level)}</span><h4>${esc(s.name)}</h4><p>${L(s.text)}</p>${s.place ? goButtons(s.place) : ""}</div>`).join("");
    const today = ((new Date().getDay() + 6) % 7) + 1; // 1 = lundi
    const days = DAYS[lang] || DAYS.en;
    const list = g.nightlife.slice().sort((a, b) => ((a.day - today + 7) % 7) - ((b.day - today + 7) % 7));
    $("#agendaList").innerHTML = list.map((n, i) => `<li class="${n.day === today ? "is-today" : ""}" style="--i:${i}">
        <div class="agenda__day"><b>${days[n.day - 1]}</b>${n.day === today ? `<em>${esc(tPlain("night.tonight"))}</em>` : ""}</div>
        <div class="agenda__venue"><strong>${esc(n.venue)}</strong><span>${L(n.time)}</span></div>
        ${n.place ? goButtons(n.place) : ""}
      </li>`).join("");
    $("#groceryList").innerHTML = g.groceries.map((s, i) => `<div class="spot" style="--i:${i}"><h4>${L(s.name)}</h4><p>${L(s.text)}</p>${s.place ? goButtons(s.place) : ""}</div>`).join("");
  }

  function renderStats() {
    $("#statsRow").innerHTML = (C.stats || []).map((st, i) => `<div class="stat reveal" data-delay="${i}"><strong data-count="${+st.value || 0}">0</strong><span>${L(st.label)}</span></div>`).join("");
  }

  function renderIntro() {
    const m = $("#introMedia");
    m.className = "media media--tall"; m.removeAttribute("data-hydrated"); m.innerHTML = "";
    m.dataset.src = (C.intro && C.intro.image) || ""; m.dataset.alt = "Ratus Villa";
    hydrateMedia(m);
  }

  function renderDistances() {
    $("#distanceList").innerHTML = ((C.location && C.location.distances) || []).map((d) => `<li><span>${L(d.label)}</span><b>${esc(d.time)}</b></li>`).join("");
  }

  function renderMap() {
    const dest = villaDest();
    const frame = $("#mapFrame"), loc = C.location || {};
    if (frame && loc.embed) frame.src = loc.embed; else if (frame) frame.remove();
    const img = $("#mapImage"); if (img && loc.image) img.src = loc.image;
    $$(".js-directions").forEach((a) => (a.href = gDir(dest)));
    const apple = $(".js-apple-villa");
    if (apple && IS_IOS) { apple.href = aDir(dest); apple.hidden = false; }
  }

  function renderAll(animate) {
    applyI18n();
    mountVilla();
    bindBooking();
    renderStats();
    renderDistances();
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
    const box = $("#lang"), btn = $("#langBtn"), menu = $("#langMenu");
    menu.innerHTML = LANGS.map((l) => `<li><button type="button" role="option" data-lang="${l.code}"><b>${l.code.toUpperCase()}</b>${l.label}</button></li>`).join("");
    const close = () => { box.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", (e) => { e.stopPropagation(); const o = box.classList.toggle("is-open"); btn.setAttribute("aria-expanded", String(o)); });
    document.addEventListener("click", (e) => { if (!box.contains(e.target)) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
    $$("[data-lang]", menu).forEach((b) => b.addEventListener("click", () => {
      close();
      if (b.dataset.lang === lang) return;
      lang = b.dataset.lang;
      try { localStorage.setItem("ratus-lang", lang); } catch (e) {}
      document.body.animate([{ opacity: 1 }, { opacity: .25 }, { opacity: 1 }], { duration: 700, easing: "ease-in-out" });
      setTimeout(() => { renderAll(true); $$(".reveal").forEach((el) => el.classList.add("is-in")); }, 300);
    }));
    applyI18n();
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
    box.dataset.label = tPlain("photo");
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
  async function loadContent() {
    if (PREVIEW) {
      try { const d = localStorage.getItem("ratus-draft"); if (d) return JSON.parse(d); } catch (e) {}
    }
    const res = await fetch("content/content.json?v=" + Date.now(), { cache: "no-store" });
    return res.json();
  }

  async function init() {
    try { C = await loadContent(); }
    catch (e) { console.error("content/content.json introuvable", e); document.body.classList.add("is-loaded"); document.body.classList.remove("is-loading"); return; }
    $("#year").textContent = new Date().getFullYear();
    splitText();
    renderIntro();
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
    const minDelay = new Promise((r) => setTimeout(r, PREVIEW ? 0 : 1500));
    const loaded = new Promise((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", r)));
    Promise.race([Promise.all([minDelay, loaded]), new Promise((r) => setTimeout(r, 3500))]).then(finish);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
