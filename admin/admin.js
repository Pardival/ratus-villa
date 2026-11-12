/* ==========================================================================
   RATUS VILLA — Administration
   Le site est hébergé sur GitHub Pages : les changements sont enregistrés
   directement dans le dépôt GitHub (voir "ENREGISTREMENT SUR GITHUB").
   ========================================================================== */
(() => {
  "use strict";

  const LANGS = ["en", "fr", "es", "id", "de"];
  const LANG_NAMES = { en: "English", fr: "Français", es: "Español", id: "Indonesia", de: "Deutsch" };
  const I18 = window.ADMIN_I18N;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };

  let ui = store.get("ratus-admin-ui") || (navigator.language || "en").slice(0, 2);
  if (!I18[ui]) ui = "en";
  const T = (k, vars) => { let s = (I18[ui] && I18[ui][k]) ?? I18.en[k] ?? k; if (vars) Object.keys(vars).forEach((v) => (s = s.replace("{" + v + "}", vars[v]))); return s; };

  /* ---------------- petits utilitaires DOM ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k === "value") el.value = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat(Infinity)) if (kid != null && kid !== false) el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    return el;
  }
  const svg = (id, cls = "ico") => { const s = document.createElementNS("http://www.w3.org/2000/svg", "svg"); s.setAttribute("class", cls); const u = document.createElementNS("http://www.w3.org/2000/svg", "use"); u.setAttribute("href", "#" + id); s.append(u); return s; };
  const fmtSize = (b) => b > 1048576 ? (b / 1048576).toFixed(1) + " MB" : Math.round(b / 1024) + " KB";
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const slug = (s) => (s || "file").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "file";

  function toast(msg, kind = "") {
    let box = $(".toasts"); if (!box) { box = h("div", { class: "toasts" }); document.body.append(box); }
    const el = h("div", { class: "toast" + (kind ? " toast--" + kind : "") }, msg);
    box.append(el); setTimeout(() => { el.style.transition = "opacity .4s"; el.style.opacity = "0"; setTimeout(() => el.remove(), 400); }, 3200);
  }
  function modal(build) {
    const m = h("div", { class: "modal" }); const card = h("div", { class: "modal__card" });
    m.append(card); document.body.append(m);
    const close = () => m.remove();
    build(card, close);
    return close;
  }
  function confirmBox(msg, okLabel = T("yes"), danger = false) {
    return new Promise((res) => modal((card, close) => {
      card.append(h("p", { style: "color:var(--ink);font-size:1.02rem" }, msg), h("div", { class: "modal__btns" },
        h("button", { class: "btn btn--ghost", onclick: () => { close(); res(false); } }, T("cancel")),
        h("button", { class: "btn " + (danger ? "btn--danger" : "btn--dark"), onclick: () => { close(); res(true); } }, okLabel)));
    }));
  }

  /* ==========================================================================
     ENREGISTREMENT SUR GITHUB
     Le site est hébergé sur GitHub Pages. L'admin enregistre les changements
     directement dans le dépôt via l'API GitHub. La clé d'accès GitHub est
     chiffrée avec le mot de passe de l'admin et stockée dans admin/access.json :
     l'équipe de la villa n'a besoin que du mot de passe.
     ========================================================================== */
  async function readJson(res) { const txt = await res.text(); try { return JSON.parse(txt); } catch (e) { return null; } }
  const MAX_VIDEO = 45 * 1048576;
  const MAX_IMAGE = 20 * 1048576;
  const PBKDF2_ITER = 600000;

  function ghError(e) {
    if (e && e.status === 401) return T("ghExpired");
    if (e && e.status === 403) return T("ghNoWrite");
    if (e && e.status === 404) return T("ghNotFound");
    if (e && (e.status === 409 || e.status === 422)) return T("ghConflict");
    return (e && e.message) || T("networkError");
  }

  const Gh = {
    kind: "github", cfg: null,
    defaults() {
      const meta = document.querySelector('meta[name="ratus-repo"]');
      const m = meta && meta.content.trim().match(/^([\w.-]+)\/([\w.-]+)$/);
      if (m) return { owner: m[1], repo: m[2], branch: "main", token: "" };
      const host = location.hostname, parts = location.pathname.split("/").filter(Boolean);
      const owner = host.endsWith(".github.io") ? host.split(".")[0] : "";
      const repo = host.endsWith(".github.io") && parts.length > 1 ? parts[0] : (owner ? owner + ".github.io" : "");
      return { owner, repo, branch: "main", token: "" };
    },
    loadSession() {
      try { const raw = sessionStorage.getItem("ratus-admin-gh") || store.get("ratus-admin-gh"); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
    },
    saveSession(remember) {
      const raw = JSON.stringify(this.cfg);
      try { sessionStorage.setItem("ratus-admin-gh", raw); } catch (e) {}
      if (remember) store.set("ratus-admin-gh", raw); else store.del("ratus-admin-gh");
    },
    clearSession() { try { sessionStorage.removeItem("ratus-admin-gh"); } catch (e) {} store.del("ratus-admin-gh"); },
    async api(path, opts = {}) {
      let res;
      try {
        res = await fetch("https://api.github.com" + path, Object.assign({ cache: "no-store" }, opts, { headers: Object.assign({ Authorization: "Bearer " + this.cfg.token, Accept: "application/vnd.github+json" }, opts.body ? { "Content-Type": "application/json" } : {}) }));
      } catch (e) { throw new Error(T("networkError")); }
      const data = await readJson(res);
      if (!res.ok) { const err = new Error((data && data.message) || ("GitHub " + res.status)); err.status = res.status; throw err; }
      return data;
    },
    repoPath() { return `/repos/${encodeURIComponent(this.cfg.owner)}/${encodeURIComponent(this.cfg.repo)}`; },
    // Vérifie que la clé ouvre bien le dépôt (le droit d'écriture est vérifié à la publication)
    async verify() {
      const r = await this.api(this.repoPath());
      if (r.permissions && r.permissions.push === false) { const e = new Error(T("ghNoWrite")); e.status = 403; throw e; }
      if (!this.cfg.branch) this.cfg.branch = r.default_branch || "main";
      return r;
    },
    maxUpload(kind) { return kind === "video" ? MAX_VIDEO : MAX_IMAGE; },
    async readFile(path, ref) {
      const r = await this.api(`${this.repoPath()}/contents/${path}?ref=${encodeURIComponent(ref || this.cfg.branch)}&t=${Date.now()}`);
      let b64 = r.content;
      if (!b64) b64 = (await this.api(`${this.repoPath()}/git/blobs/${r.sha}`)).content;
      const bin = atob(b64.replace(/\n/g, "")); const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    },
    async load(ref) { return JSON.parse(await this.readFile("content/content.json", ref)); },
    // Crée un commit contenant plusieurs fichiers (texte ou binaire), avec une nouvelle tentative en cas de conflit
    async commit(files, message, step) {
      const P = this.repoPath(), br = encodeURIComponent(this.cfg.branch);
      const blobs = [];
      const bin = files.filter((f) => f.blob);
      if (bin.length && step) step("upload", 0, bin.length);
      let n = 0;
      for (const f of files) {
        const body = f.blob ? { content: await blobToBase64(f.blob), encoding: "base64" } : { content: f.text, encoding: "utf-8" };
        if (!f.blob && step) step("save");
        const blob = await this.api(`${P}/git/blobs`, { method: "POST", body: JSON.stringify(body) });
        blobs.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
        if (f.blob && step) step("upload", ++n, bin.length);
      }
      for (let attempt = 0; ; attempt++) {
        const ref = await this.api(`${P}/git/ref/heads/${br}`);
        const base = await this.api(`${P}/git/commits/${ref.object.sha}`);
        const tree = await this.api(`${P}/git/trees`, { method: "POST", body: JSON.stringify({ base_tree: base.tree.sha, tree: blobs }) });
        const commit = await this.api(`${P}/git/commits`, { method: "POST", body: JSON.stringify({ message, tree: tree.sha, parents: [ref.object.sha] }) });
        try { await this.api(`${P}/git/refs/heads/${br}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) }); return commit.sha; }
        catch (e) { if (attempt < 2 && (e.status === 409 || e.status === 422)) continue; throw e; }
      }
    },
    async publish(content, files, step) {
      const list = files.map((f) => ({ path: f.path, blob: f.blob }));
      list.push({ path: "content/content.json", text: JSON.stringify(content, null, 2) + "\n" });
      await this.commit(list, "Update site content (admin)", step);
      return content;
    },
    async history() {
      return this.api(`${this.repoPath()}/commits?path=content/content.json&sha=${encodeURIComponent(this.cfg.branch)}&per_page=20`);
    }
  };
  const backend = Gh;

  /* ---------- Clé GitHub chiffrée par mot de passe (admin/access.json) ---------- */
  const b64e = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const b64d = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function deriveKey(password, salt, iter) {
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: iter, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  }
  async function sealAccess(token, password, cfg) {
    const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt, PBKDF2_ITER);
    const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(token));
    return { v: 1, owner: cfg.owner, repo: cfg.repo, branch: cfg.branch, kdf: "PBKDF2-SHA256", iter: PBKDF2_ITER, salt: b64e(salt), iv: b64e(iv), data: b64e(data) };
  }
  async function openAccess(acc, password) {
    const key = await deriveKey(password, b64d(acc.salt), acc.iter || PBKDF2_ITER);
    try { return new TextDecoder().decode(await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64d(acc.iv) }, key, b64d(acc.data))); }
    catch (e) { const err = new Error(T("wrongPassword")); err.code = "wrong_password"; throw err; }
  }
  async function fetchAccess() {
    try {
      const local = store.get("ratus-admin-access");
      const res = await fetch("access.json?t=" + Date.now(), { cache: "no-store" });
      const remote = res.ok ? await readJson(res) : null;
      // juste après une configuration, GitHub Pages peut servir l'ancienne version quelques minutes
      if (local) { const l = JSON.parse(local); if (!remote || remote.data !== l.data) { if (remote && Date.now() - (l.savedAt || 0) > 15 * 60000) { store.del("ratus-admin-access"); return remote; } return l; } }
      return remote && remote.data ? remote : null;
    } catch (e) { return null; }
  }
  async function saveAccess(password, message) {
    const acc = await sealAccess(Gh.cfg.token, password, Gh.cfg);
    await Gh.commit([{ path: "admin/access.json", text: JSON.stringify(acc, null, 2) + "\n" }], message);
    store.set("ratus-admin-access", JSON.stringify(Object.assign({ savedAt: Date.now() }, acc)));
    return acc;
  }

  function blobToBase64(blob) {
    return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1]); r.onerror = rej; r.readAsDataURL(blob); });
  }

  /* ==========================================================================
     ÉTAT
     ========================================================================== */
  let content = null;          // brouillon en cours
  let published = "";          // JSON de la version en ligne
  const pending = new Map();   // chemin -> { blob, url, name, path, type }
  let editLang = store.get("ratus-admin-edit") || "en";
  if (!LANGS.includes(editLang)) editLang = "en";
  let section = store.get("ratus-admin-section") || "home";
  let previewOpen = false;

  const isDirty = () => JSON.stringify(content) !== published;

  function walk(o, fn) {
    if (Array.isArray(o)) return o.map((v) => walk(v, fn));
    if (o && typeof o === "object") { const r = {}; for (const k of Object.keys(o)) r[k] = walk(o[k], fn); return r; }
    return fn(o);
  }
  const replacePaths = (c, map) => walk(c, (v) => (typeof v === "string" && map[v] ? map[v] : v));
  const usedPendingFiles = () => { const json = JSON.stringify(content); return [...pending.values()].filter((f) => json.includes(JSON.stringify(f.path))); };
  const srcUrl = (p) => !p ? "" : pending.has(p) ? pending.get(p).url : /^(https?:|blob:|data:)/.test(p) ? p : "../" + p;

  function getP(path) { return path.reduce((o, k) => (o == null ? undefined : o[k]), content); }
  function setP(path, val) {
    let o = content;
    for (let i = 0; i < path.length - 1; i++) { if (o[path[i]] == null || typeof o[path[i]] !== "object") o[path[i]] = typeof path[i + 1] === "number" ? [] : {}; o = o[path[i]]; }
    o[path[path.length - 1]] = val;
    changed();
  }
  function ensureML(path) {
    let v = getP(path);
    if (!v || typeof v !== "object") { const base = typeof v === "string" ? v : ""; v = { en: base, fr: base, es: base, id: base, de: base }; setP(path, v); }
    LANGS.forEach((l) => { if (typeof v[l] !== "string") v[l] = ""; });
    return v;
  }

  const saveDraft = debounce(() => {
    if (isDirty()) store.set("ratus-admin-draft", JSON.stringify({ content, base: published }));
    else store.del("ratus-admin-draft");
  }, 600);
  function changed() {
    updateStatus();
    saveDraft();
    refreshPreview();
    updateMeters();
  }

  /* ==========================================================================
     TRADUCTION AUTOMATIQUE (service gratuit, sans clé)
     ========================================================================== */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function translateLine(text, from, to) {
    if (!text.trim()) return text;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const url = "https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=" + from + "&tl=" + to + "&q=" + encodeURIComponent(text);
        const res = await fetch(url);
        if (res.ok) { const d = await res.json(); return d[0].map((x) => x[0]).join(""); }
      } catch (e) {}
      await sleep(600 * (attempt + 1));
    }
    try { // secours
      const res = await fetch("https://api.mymemory.translated.net/get?langpair=" + from + "|" + to + "&q=" + encodeURIComponent(text));
      const d = await res.json(); if (d && d.responseData && d.responseData.translatedText) return d.responseData.translatedText;
    } catch (e) {}
    throw new Error("translate");
  }
  async function translateText(text, from, to) {
    const lines = text.split("\n"); const out = [];
    for (const line of lines) out.push(await translateLine(line, from, to));
    return out.join("\n").replace(/\* ([^*]+?) \*/g, "*$1*").replace(/\{ ?n ?\}/gi, "{n}");
  }

  /* ==========================================================================
     IMAGES / VIDÉOS
     ========================================================================== */
  function pickFiles(accept, multiple) {
    return new Promise((res) => {
      const inp = h("input", { type: "file", accept, multiple: multiple || null, style: "display:none" });
      inp.addEventListener("change", () => { res([...inp.files]); inp.remove(); });
      document.body.append(inp); inp.click();
    });
  }
  async function processImage(file) {
    if (!file.type.startsWith("image/")) throw new Error(T("notImage"));
    const url = URL.createObjectURL(file);
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error(T("notImage"))); i.src = url; });
    const max = 2000, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    let blob = await new Promise((r) => c.toBlob(r, "image/webp", 0.82));
    let ext = "webp";
    if (!blob || blob.type !== "image/webp") { blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.85)); ext = "jpg"; }
    if (blob.size > backend.maxUpload("image")) throw new Error(T("tooBig", { size: fmtSize(blob.size), max: fmtSize(backend.maxUpload("image")) }));
    return addPending(blob, slug(file.name) + "-" + Date.now().toString(36) + "." + ext);
  }
  function processVideo(file) {
    if (!/^video\/(mp4|webm|quicktime)$/.test(file.type)) throw new Error(T("notVideo"));
    if (file.size > backend.maxUpload("video")) throw new Error(T("tooBig", { size: fmtSize(file.size), max: fmtSize(backend.maxUpload("video")) }));
    const ext = file.type === "video/webm" ? "webm" : file.type === "video/quicktime" ? "mov" : "mp4";
    return addPending(file, slug(file.name) + "-" + Date.now().toString(36) + "." + ext);
  }
  function addPending(blob, name) {
    const path = "assets/uploads/" + name;
    pending.set(path, { blob, name, path, url: URL.createObjectURL(blob), type: blob.type });
    return path;
  }

  /* ==========================================================================
     CHAMPS
     ========================================================================== */
  function fieldWrap(label, control, opts = {}) {
    return h("div", { class: "field" },
      h("div", { class: "field__top" }, h("label", { class: "lbl" }, label), opts.right || null),
      control, opts.hint ? h("div", { class: "field__hint" }, opts.hint) : null);
  }

  // Texte multilingue
  function ML(path, label, opts = {}) {
    const v = ensureML(path);
    const multiline = opts.multiline;
    const input = multiline
      ? h("textarea", { class: "textarea", rows: opts.rows || 3, value: v[editLang] })
      : h("input", { class: "input", type: "text", value: v[editLang] });
    if (multiline) input.value = v[editLang];
    const chips = h("div", { class: "chips" });
    const drawChips = () => {
      chips.innerHTML = "";
      LANGS.forEach((l) => chips.append(h("button", {
        type: "button", class: "chip" + (l === editLang ? " is-on" : "") + (!(v[l] || "").trim() ? " is-empty" : ""),
        title: LANG_NAMES[l] + (!(v[l] || "").trim() ? " — " + T("empty") : "") + ((v[l] || "").trim() ? "\n" + v[l] : ""),
        onclick: () => setEditLang(l)
      }, l.toUpperCase())));
    };
    drawChips();
    const trBtn = h("button", { type: "button", class: "tr-btn", disabled: !(v[editLang] || "").trim() || null }, svg("a-translate"), T("translate"));
    input.addEventListener("input", () => { v[editLang] = input.value; trBtn.disabled = !input.value.trim(); drawChips(); changed(); });
    trBtn.addEventListener("click", async () => {
      const src = v[editLang]; if (!src.trim()) return;
      trBtn.classList.add("is-busy"); trBtn.disabled = true; trBtn.lastChild.textContent = T("translating");
      try {
        for (const l of LANGS) if (l !== editLang) v[l] = await translateText(src, editLang, l);
        drawChips(); changed(); toast(T("translated"), "ok"); input.classList.add("flash"); setTimeout(() => input.classList.remove("flash"), 1300);
      } catch (e) { toast(T("translateFail"), "err"); }
      trBtn.classList.remove("is-busy"); trBtn.disabled = false; trBtn.lastChild.textContent = T("translate");
    });
    return h("div", { class: "field" },
      h("div", { class: "field__top" }, h("label", { class: "lbl" }, label), chips),
      input,
      h("div", { class: "field__foot" }, h("span", { class: "field__hint", style: "margin:0" }, opts.hint || (opts.md ? T("emHint") : "")), trBtn));
  }

  function TXT(path, label, opts = {}) {
    const input = h("input", { class: "input", type: opts.type || "text", value: getP(path) ?? "", placeholder: opts.placeholder || null, inputmode: opts.inputmode || null, step: opts.step || null });
    input.addEventListener("input", () => setP(path, opts.type === "number" ? (input.value === "" ? "" : +input.value) : input.value));
    return fieldWrap(label, input, opts);
  }

  function WA(path, label) {
    const input = h("input", { class: "input", type: "tel", inputmode: "numeric", value: getP(path) || "", placeholder: "6281234567890" });
    const check = () => { const d = input.value.replace(/[^\d]/g, ""); input.classList.toggle("input--invalid", !!input.value && (d.length < 8 || d.length > 15)); };
    input.addEventListener("input", () => { setP(path, input.value.replace(/[^\d]/g, "")); check(); });
    input.addEventListener("blur", () => { input.value = input.value.replace(/[^\d]/g, ""); check(); });
    check();
    const test = h("a", { class: "btn btn--soft btn--sm", target: "_blank", rel: "noopener", onclick: (e) => { e.currentTarget.href = "https://wa.me/" + (getP(path) || ""); } }, svg("i-whatsapp"), T("testWa"));
    return fieldWrap(label, h("div", { class: "wa-row" }, input, test), { hint: T("whatsappHint") });
  }

  function SELECT(path, label, options, o = {}) {
    const sel = h("select", { class: "select" }, options.map(([v, l]) => h("option", { value: v }, l)));
    sel.value = String(getP(path) ?? options[0][0]);
    sel.addEventListener("change", () => { setP(path, isNaN(+sel.value) ? sel.value : +sel.value); if (o.rerender) render(); });
    return fieldWrap(label, sel);
  }

  let SITE_ICONS = [];
  const ICON_SKIP = new Set(["whatsapp", "qr", "share", "mail", "route", "globe", "chev", "pin", "compass", "size", "guests"]);
  function ICON(path, label) {
    const cur = () => getP(path) || "wave";
    const sw = h("span", { class: "sw" }, svg("i-" + cur()));
    const pop = h("div", { class: "ipop", hidden: true });
    const btn = h("button", { type: "button", class: "ipick", onclick: () => { pop.hidden = !pop.hidden; } }, sw, T("change"));
    SITE_ICONS.filter((n) => !ICON_SKIP.has(n)).forEach((n) => pop.append(h("button", {
      type: "button", class: n === cur() ? "is-on" : "", title: n,
      onclick: () => { setP(path, n); sw.innerHTML = ""; sw.append(svg("i-" + n)); $$("button", pop).forEach((b) => b.classList.toggle("is-on", b.title === n)); pop.hidden = true; }
    }, svg("i-" + n))));
    return h("div", { class: "field" }, h("label", { class: "lbl" }, label), btn, pop);
  }

  function MEDIA(path, label, opts = {}) {
    const kind = opts.kind || "image";
    const wrap = h("div", { class: "field" });
    const draw = () => {
      wrap.innerHTML = "";
      const p = getP(path);
      const thumb = h("div", { class: "thumb" + (pending.has(p) ? " thumb--new" : "") });
      if (p) thumb.append(kind === "video" ? h("video", { src: srcUrl(p), muted: true, loop: true, autoplay: true, playsinline: true }) : h("img", { src: srcUrl(p), alt: "" }));
      else thumb.append(svg(kind === "video" ? "a-images" : "a-images"));
      const choose = h("button", { type: "button", class: "btn btn--dark btn--sm" }, svg("a-upload"), p ? T("change") : T("choose"));
      choose.addEventListener("click", async () => {
        const [file] = await pickFiles(kind === "video" ? "video/mp4,video/webm,video/quicktime" : "image/*");
        if (!file) return;
        try { setP(path, kind === "video" ? processVideo(file) : await processImage(file)); draw(); } catch (e) { toast(e.message, "err"); }
      });
      const remove = opts.removable && p ? h("button", { type: "button", class: "btn btn--danger btn--sm", onclick: () => { setP(path, ""); draw(); } }, svg("a-trash"), T("remove")) : null;
      wrap.append(h("label", { class: "lbl" }, label), h("div", { class: "media-field" }, thumb, h("div", { class: "media-field__btns" }, choose, remove)), opts.hint ? h("div", { class: "field__hint" }, opts.hint) : "");
    };
    draw();
    return wrap;
  }

  // Grille de photos : ajout multiple, glisser-déposer, flèches, description
  function PHOTOS(path) {
    const box = h("div");
    const draw = () => {
      box.innerHTML = "";
      const arr = getP(path) || [];
      const grid = h("div", { class: "pgrid" });
      let dragFrom = null;
      arr.forEach((ph, i) => {
        const alt = ph.alt || {};
        const tile = h("div", { class: "ptile" + (!(alt[editLang] || "").trim() ? " ptile--alt-missing" : ""), draggable: "true" },
          h("img", { src: srcUrl(ph.src), alt: "", loading: "lazy" }),
          h("span", { class: "ptile__n" }, String(i + 1)),
          h("div", { class: "ptile__bar" },
            h("button", { type: "button", class: "iconbtn", title: T("moveUp"), disabled: i === 0 || null, onclick: () => move(i, i - 1) }, svg("a-left")),
            h("button", { type: "button", class: "iconbtn", title: T("altText"), onclick: () => editAlt(i) }, svg("a-edit")),
            h("button", { type: "button", class: "iconbtn", title: T("moveDown"), disabled: i === arr.length - 1 || null, onclick: () => move(i, i + 1) }, svg("a-right")),
            h("button", { type: "button", class: "iconbtn iconbtn--danger", title: T("delete"), onclick: async () => { if (await confirmBox(T("confirmDelete"), T("delete"), true)) { arr.splice(i, 1); changed(); draw(); } } }, svg("a-trash"))));
        tile.addEventListener("dragstart", (e) => { dragFrom = i; tile.classList.add("is-drag"); e.dataTransfer.effectAllowed = "move"; });
        tile.addEventListener("dragend", () => tile.classList.remove("is-drag"));
        tile.addEventListener("dragover", (e) => { e.preventDefault(); tile.classList.add("is-over"); });
        tile.addEventListener("dragleave", () => tile.classList.remove("is-over"));
        tile.addEventListener("drop", (e) => { e.preventDefault(); tile.classList.remove("is-over"); if (dragFrom != null && dragFrom !== i) move(dragFrom, i); });
        grid.append(tile);
      });
      const add = h("button", { type: "button", class: "ptile ptile--add" }, svg("a-plus"), T("addPhotos"));
      add.addEventListener("click", async () => {
        const files = await pickFiles("image/*", true);
        for (const f of files) {
          try { const p = await processImage(f); arr.push({ src: p, alt: { en: "", fr: "", es: "", id: "", de: "" } }); } catch (e) { toast(e.message, "err"); }
        }
        if (files.length) { setP(path, arr); draw(); }
      });
      grid.append(add);
      box.append(grid);
    };
    const move = (a, b) => { const arr = getP(path); const [x] = arr.splice(a, 1); arr.splice(b, 0, x); changed(); draw(); };
    const editAlt = (i) => modal((card, close) => {
      const ph = getP(path)[i];
      card.append(h("img", { src: srcUrl(ph.src), style: "width:100%;border-radius:14px;margin-bottom:16px;aspect-ratio:4/3;object-fit:cover" }),
        ML([...path, i, "alt"], T("altText")),
        h("div", { class: "modal__btns", style: "margin-top:16px" }, h("button", { class: "btn btn--dark", onclick: () => { close(); draw(); } }, T("ok"))));
    });
    draw();
    return box;
  }

  // Liste d'éléments repliables
  function LIST(path, opts) {
    const box = h("div");
    const openSet = new Set();
    if (opts.openWhere) (getP(path) || []).forEach((it) => { if (opts.openWhere(it)) openSet.add(it); });
    const draw = () => {
      box.innerHTML = "";
      const arr = getP(path) || [];
      const list = h("div", { class: "list" });
      arr.forEach((item, i) => {
        const el = h("div", { class: "item" + (openSet.has(item) ? " is-open" : "") });
        const titleInfo = opts.title(item, i);
        const tools = (cls) => h("div", { class: cls },
            h("button", { type: "button", class: "iconbtn", title: T("moveUp"), "aria-label": T("moveUp"), disabled: i === 0 || null, onclick: (e) => { e.stopPropagation(); move(i, i - 1); } }, svg("a-up")),
            h("button", { type: "button", class: "iconbtn", title: T("moveDown"), "aria-label": T("moveDown"), disabled: i === arr.length - 1 || null, onclick: (e) => { e.stopPropagation(); move(i, i + 1); } }, svg("a-down")),
            h("button", { type: "button", class: "iconbtn", title: T("duplicate"), "aria-label": T("duplicate"), onclick: (e) => { e.stopPropagation(); arr.splice(i + 1, 0, clone(item)); changed(); draw(); } }, svg("a-copy")),
            h("button", { type: "button", class: "iconbtn iconbtn--danger", title: T("delete"), "aria-label": T("delete"), onclick: async (e) => { e.stopPropagation(); if (await confirmBox(T("confirmDelete"), T("delete"), true)) { arr.splice(i, 1); changed(); draw(); } } }, svg("a-trash")));
        const head = h("div", { class: "item__head", role: "button", tabindex: "0" },
          h("span", { class: "item__icon" }, svg(opts.icon ? opts.icon(item) : "a-edit")),
          h("div", { class: "item__title" }, titleInfo[0] || "—", titleInfo[1] ? h("small", null, titleInfo[1]) : null),
          tools("item__tools"),
          svg("a-down", "ico item__caret"));
        const toggle = () => { if (openSet.has(item)) openSet.delete(item); else openSet.add(item); if (opts.onToggle) opts.onToggle(item, openSet.has(item)); draw(); };
        head.addEventListener("click", toggle);
        head.addEventListener("keydown", (e) => { if (e.target === head && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggle(); } });
        el.append(head);
        if (openSet.has(item)) el.append(h("div", { class: "item__body" }, tools("item__tools item__tools--body"), opts.render([...path, i], item)));
        list.append(el);
      });
      box.append(list, opts.create() === null ? h("button", { type: "button", class: "btn btn--ghost add-btn", onclick: addSectionDialog }, svg("a-plus"), T("addSection")) : h("button", { type: "button", class: "btn btn--ghost add-btn", onclick: () => { const n = opts.create(); arr.push(n); setP(path, arr); openSet.add(n); draw(); } }, svg("a-plus"), T("add") + " — " + opts.itemName));
    };
    const move = (a, b) => { const arr = getP(path); const [x] = arr.splice(a, 1); arr.splice(b, 0, x); changed(); draw(); };
    draw();
    return box;
  }

  function villaFields(base, withPhotos) {
    const P = (...k) => [...base, ...k];
    return [
      card(T("description"), TXT(P("name"), T("villaName")), ML(P("tagline"), T("tagline")),
        ML(P("description"), T("description"), { multiline: true, rows: 5 }), ML(P("groupNote"), T("groupNote"), { multiline: true })),
      card(T("perVilla"),
        h("div", { class: "grid4" },
          TXT(P("stats", "bedrooms"), T("bedrooms"), { type: "number", inputmode: "numeric" }),
          TXT(P("stats", "bathrooms"), T("bathrooms"), { type: "number", inputmode: "numeric" }),
          TXT(P("stats", "guests"), T("guests"), { type: "number", inputmode: "numeric" }),
          TXT(P("stats", "size"), T("size"), { placeholder: "120 m²" })),
        TXT(P("count"), T("villaCount"), { type: "number", inputmode: "numeric", hint: T("villaCountHint") })),
      card(T("amenities"), LIST(P("amenities"), {
        itemName: T("amenity"), icon: (a) => "i-" + (a.icon || "wave"), title: (a) => [first(a.label)],
        create: () => ({ icon: "pool", label: ml0() }),
        render: (p) => [ICON([...p, "icon"], T("icon")), ML([...p, "label"], T("label"))]
      })),
      withPhotos ? card(T("s_photos"), PHOTOS(P("photos"))) : null
    ];
  }

  /* ---------- Sections ajoutées ---------- */
  let openSection = null;
  const SEC_TYPES = {
    villa: { icon: "a-villa" },
    text: { icon: "a-edit" },
    features: { icon: "a-grid" },
    photos: { icon: "a-images" }
  };
  const AFTER = ["intro", "villas", "gallery", "services", "guide", "location"];
  const mlText = (txt) => { const o = ml0(); o[editLang] = txt; return o; };
  function newSection(type) {
    const base = { id: Math.random().toString(36).slice(2, 8), type, visible: true, after: "villas", bg: "light", menu: false, menuLabel: ml0(), eyebrow: ml0(), title: ml0(), lead: ml0() };
    if (type === "villa") return Object.assign(base, { bg: "sand", eyebrow: mlText(T("secType_villa")), villa: { name: T("newVillaName"), count: 1, tagline: ml0(), description: ml0(), groupNote: ml0(), stats: { bedrooms: 1, bathrooms: 1, guests: 2, size: "" }, amenities: clone((content.villa && content.villa.amenities) || []), photos: [] } });
    if (type === "text") return Object.assign(base, { title: mlText(T("secNewTitle")), text: ml0(), image: "", imageAlt: ml0(), imageSide: "right", button: { type: "none", label: ml0(), url: "", place: "", whatsapp: "", message: ml0() } });
    if (type === "features") return Object.assign(base, { bg: "sand", title: mlText(T("secNewTitle")), items: [{ icon: "pool", title: ml0(), text: ml0() }, { icon: "garden", title: ml0(), text: ml0() }, { icon: "wifi", title: ml0(), text: ml0() }], button: { type: "none", label: ml0(), url: "", place: "", whatsapp: "", message: ml0() } });
    return Object.assign(base, { title: mlText(T("secNewTitle")), photos: [] });
  }
  function addSectionDialog() {
    modal((box, close) => {
      box.append(h("h3", null, T("addSectionTitle")), h("p", null, T("addSectionSub")),
        h("div", { class: "typegrid" }, Object.keys(SEC_TYPES).map((tp) => h("button", { type: "button", class: "typecard", onclick: () => {
          const sec = newSection(tp); content.sections = content.sections || []; content.sections.push(sec);
          openSection = sec.id; changed(); close(); section = "sections"; render(); toast(T("secAdded"), "ok");
          setTimeout(() => { const el = document.querySelector(".item.is-open"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 150);
        } }, h("span", { class: "typecard__icon" }, svg(SEC_TYPES[tp].icon)), h("b", null, T("secType_" + tp)), h("small", null, T("secTypeDesc_" + tp))))),
        h("div", { class: "modal__btns" }, h("button", { class: "btn btn--ghost", onclick: close }, T("cancel"))));
    });
  }
  function CHECK(path, label, hint) {
    const cb = h("input", { type: "checkbox", checked: getP(path) !== false || null });
    cb.addEventListener("change", () => { setP(path, cb.checked); render(); });
    return h("div", { class: "field" }, h("label", { class: "check" }, cb, label), hint ? h("div", { class: "field__hint" }, hint) : null);
  }
  function buttonFields(p) {
    const bt = getP([...p, "button"]) || {};
    const type = bt.type || "none";
    const out = [SELECT([...p, "button", "type"], T("btnType"), ["none", "whatsapp", "link", "map"].map((x) => [x, T("btn_" + x)]), { rerender: true })];
    if (type !== "none") out.push(ML([...p, "button", "label"], T("btnLabel")));
    if (type === "whatsapp") out.push(WA([...p, "button", "whatsapp"], T("whatsapp") + " — " + T("btnWaHint")), ML([...p, "button", "message"], T("waMessage"), { multiline: true, rows: 2 }));
    if (type === "link") out.push(TXT([...p, "button", "url"], T("btnUrl"), { placeholder: "https://…", inputmode: "url" }));
    if (type === "map") out.push(TXT([...p, "button", "place"], T("place"), { hint: T("placeHint") }));
    return card(T("button"), ...out);
  }
  function sectionFields(p, sec) {
    const out = [
      card(T("secDisplay"),
        CHECK([...p, "visible"], T("secVisible"), T("secVisibleHint")),
        h("div", { class: "grid2" },
          SELECT([...p, "after"], T("secAfter"), AFTER.map((x) => [x, T("after_" + x)])),
          SELECT([...p, "bg"], T("secBg"), ["light", "sand", "ocean"].map((x) => [x, T("bg_" + x)]))),
        CHECK([...p, "menu"], T("secMenu")),
        sec.menu ? ML([...p, "menuLabel"], T("secMenuLabel"), { hint: T("secMenuLabelHint") }) : null),
      card(T("title"), ML([...p, "eyebrow"], T("eyebrow")), ML([...p, "title"], T("title"), { multiline: true, rows: 2, md: true }), ML([...p, "lead"], T("subtitle"), { multiline: true, rows: 2 }))
    ];
    if (sec.type === "villa") out.push(...villaFields([...p, "villa"], true));
    if (sec.type === "text") out.push(card(T("text"), ML([...p, "text"], T("text"), { multiline: true, rows: 7, md: true, hint: T("secTextHint") }),
      MEDIA([...p, "image"], T("photo"), { removable: true }),
      SELECT([...p, "imageSide"], T("imageSide"), [["right", T("side_right")], ["left", T("side_left")]])), buttonFields(p, sec));
    if (sec.type === "features") out.push(card(T("featItems"), LIST([...p, "items"], {
      itemName: T("featItem"), icon: (it) => "i-" + (it.icon || "wave"), title: (it) => [first(it.title), first(it.text)],
      create: () => ({ icon: "wave", title: ml0(), text: ml0() }),
      render: (q) => [ICON([...q, "icon"], T("icon")), ML([...q, "title"], T("title")), ML([...q, "text"], T("text"), { multiline: true, rows: 2 })]
    })), buttonFields(p, sec));
    if (sec.type === "photos") out.push(card(T("s_photos"), PHOTOS([...p, "photos"])));
    return out;
  }

  const card = (title, ...kids) => h("section", { class: "card" }, title ? h("h3", { class: "card__title" }, title) : null, kids);
  const tx = (key, label, opts) => ML(["texts", key], label, opts);
  const ml0 = () => ({ en: "", fr: "", es: "", id: "", de: "" });
  const first = (o) => (o && (o[editLang] || o.en || o.fr)) || "";
  const dayOptions = () => T("days").map((d, i) => [String(i + 1), d]);

  /* ==========================================================================
     RUBRIQUES
     ========================================================================== */
  const SECTIONS = [
    { id: "home", icon: "a-home", anchor: "#top", render: () => [
      card(T("photo") + " / " + T("video"),
        MEDIA(["hero", "poster"], T("heroPhoto")),
        MEDIA(["hero", "video"], T("heroVideo"), { kind: "video", removable: true, hint: T("heroVideoHint") })),
      card(T("text"),
        h("div", { class: "grid2" }, TXT(["hero", "titleA"], T("title") + " (1)"), TXT(["hero", "titleB"], T("title") + " (2)")),
        tx("hero.eyebrow", T("eyebrow")), tx("hero.lead", T("subtitle"), { multiline: true }),
        h("div", { class: "grid2" }, tx("hero.discover", T("button")), tx("hero.whatsapp", T("button2"))),
        tx("hero.scroll", T("scrollHint")))
    ] },
    { id: "welcome", icon: "a-hand", anchor: "#intro", render: () => [
      card(T("text"), tx("intro.eyebrow", T("eyebrow")), tx("intro.title", T("title"), { multiline: true, rows: 2, md: true }),
        tx("intro.p1", T("text") + " 1", { multiline: true }), tx("intro.p2", T("text") + " 2", { multiline: true }),
        MEDIA(["intro", "image"], T("introPhoto"))),
      card(T("keyFigures"), LIST(["stats"], {
        itemName: T("figure"), icon: () => "a-grid", title: (s) => [String(s.value ?? ""), first(s.label)],
        create: () => ({ value: 1, label: ml0() }),
        render: (p) => [TXT([...p, "value"], T("value"), { type: "number", inputmode: "numeric" }), ML([...p, "label"], T("label"))]
      }))
    ] },
    { id: "villa", icon: "a-villa", anchor: "#villas", render: () => [
      card(T("title"), tx("villas.eyebrow", T("eyebrow")), tx("villas.title", T("title"), { multiline: true, rows: 2, md: true })),
      ...villaFields(["villa"], false),
      card(T("labels"),
        h("div", { class: "grid2" }, tx("villa.bedrooms", T("bedrooms")), tx("villa.bathrooms", T("bathrooms")), tx("villa.guests", T("guests")), tx("villa.size", T("size"))),
        tx("villa.per", T("perVilla")),
        h("div", { class: "grid2" }, tx("villa.one", "1 villa"), tx("villa.both", "2 villas")),
        tx("villa.upto", T("guests"), { hint: "{n} = " + T("guests") }), tx("villa.book", T("button")))
    ] },
    { id: "photos", icon: "a-images", anchor: "#villas", render: () => [card(null, PHOTOS(["villa", "photos"]))] },
    { id: "gallery", icon: "a-grid", anchor: "#gallery", render: () => [
      card(null, PHOTOS(["gallery"])),
      card(T("text"), tx("gallery.eyebrow", T("eyebrow")), tx("gallery.title", T("title"), { md: true }), tx("gallery.aside", T("subtitle")))
    ] },
    { id: "services", icon: "a-chat", anchor: "#services", render: () => [
      card(T("text"), tx("services.eyebrow", T("eyebrow")), tx("services.title", T("title"), { md: true }), tx("services.lead", T("subtitle"), { multiline: true }), tx("services.write", T("button"))),
      card(T("s_services"), LIST(["services"], {
        itemName: T("service"), icon: (s) => "i-" + (s.icon || "wave"), title: (s) => [first(s.title), s.whatsapp ? "+" + s.whatsapp : ""],
        create: () => ({ icon: "wave", title: ml0(), text: ml0(), whatsapp: "", message: ml0() }),
        render: (p) => [ICON([...p, "icon"], T("icon")), ML([...p, "title"], T("title")), ML([...p, "text"], T("text"), { multiline: true }), WA([...p, "whatsapp"], T("whatsapp")), ML([...p, "message"], T("waMessage"), { multiline: true, rows: 2 })]
      }))
    ] },
    { id: "surf", icon: "i-wave", anchor: "#guide", render: () => [
      card(T("text"), tx("guide.eyebrow", T("eyebrow")), tx("guide.title", T("title"), { md: true }), tx("guide.surf", T("tabs"))),
      card(T("s_surf"), LIST(["guide", "surf"], {
        itemName: T("spot"), icon: () => "i-wave", title: (s) => [s.name, first(s.level)],
        create: () => ({ name: "", place: "", level: ml0(), text: ml0() }),
        render: (p) => [TXT([...p, "name"], T("name")), ML([...p, "level"], T("level")), ML([...p, "text"], T("text"), { multiline: true })]
      }))
    ] },
    { id: "night", icon: "a-moon", anchor: "#guide", render: () => [
      card(T("text"), tx("guide.night", T("tabs")), tx("night.tonight", "“Tonight”")),
      card(T("s_night"), LIST(["guide", "nightlife"], {
        itemName: T("party"), icon: () => "i-music", title: (n) => [T("days")[(n.day || 1) - 1] + " — " + (n.venue || ""), first(n.time)],
        create: () => ({ day: 1, venue: "", place: "", time: ml0() }),
        render: (p) => [SELECT([...p, "day"], T("day"), dayOptions()), TXT([...p, "venue"], T("venue")), ML([...p, "time"], T("time"))]
      }))
    ] },
    { id: "groceries", icon: "a-cart", anchor: "#guide", render: () => [
      card(T("text"), tx("guide.food", T("tabs"))),
      card(T("s_groceries"), LIST(["guide", "groceries"], {
        itemName: T("shop"), icon: () => "i-basket", title: (g) => [g.name],
        create: () => ({ name: "", place: "", text: ml0() }),
        render: (p) => [TXT([...p, "name"], T("name")), ML([...p, "text"], T("text"), { multiline: true })]
      }))
    ] },
    { id: "location", icon: "i-pin", anchor: "#location", render: () => [
      card(T("text"), tx("location.eyebrow", T("eyebrow")), tx("location.title", T("title"), { md: true }),
        h("div", { class: "grid2" }, tx("location.cta", T("button")), tx("location.apple", T("button2")))),
      card(T("mapImage"), MEDIA(["location", "image"], T("mapImage"), { hint: T("mapImageHint") }),
        TXT(["location", "query"], T("mapQuery"), { hint: T("placeHint") }),
        h("div", { class: "grid2" }, TXT(["location", "lat"], T("lat"), { inputmode: "decimal" }), TXT(["location", "lng"], T("lng"), { inputmode: "decimal" })),
        TXT(["location", "embed"], T("embed"), { hint: T("embedHint") })),
      card(T("distances"), LIST(["location", "distances"], {
        itemName: T("distance"), icon: () => "i-route", title: (d) => [first(d.label), d.time],
        create: () => ({ label: ml0(), time: "~ 10 min" }),
        render: (p) => [ML([...p, "label"], T("distance")), TXT([...p, "time"], T("time"))]
      }))
    ] },
    { id: "booking", icon: "i-whatsapp", anchor: "#contact", render: () => [
      card("WhatsApp", WA(["booking", "whatsapp"], T("whatsapp")), ML(["booking", "message"], T("waMessage"), { multiline: true, rows: 2 })),
      card(T("text"), tx("cta.eyebrow", T("eyebrow")), tx("cta.title", T("title"), { multiline: true, rows: 2, md: true }), tx("cta.lead", T("subtitle"), { multiline: true }),
        tx("cta.whatsapp", T("button")))
    ] },
    { id: "sections", icon: "a-plus", anchor: "#villas", render: () => {
      content.sections = content.sections || [];
      const list = LIST(["sections"], {
        itemName: T("secOne"), icon: (x) => (SEC_TYPES[x.type] || SEC_TYPES.text).icon,
        title: (x) => [(first(x.title) || (x.type === "villa" && x.villa && x.villa.name) || T("untitled")).replace(/\*/g, "").split("\n")[0],
          T("secType_" + x.type) + " · " + T("after_" + (x.after || "villas")) + (x.visible === false ? " · " + T("secHidden") : "")],
        openWhere: (x) => x.id === openSection,
        onToggle: (x, isOpen) => { openSection = isOpen ? x.id : null; if (previewOpen) refreshPreview(true); },
        create: () => null,
        render: (q, x) => sectionFields(q, x)
      });
      return [
        card(null, h("p", { class: "note", style: "margin:0 0 14px" }, T("secIntro")),
          h("button", { class: "btn btn--primary", onclick: addSectionDialog }, svg("a-plus"), T("addSection"))),
        content.sections.length ? list : card(null, h("p", { class: "note", style: "margin:0" }, T("noSections")))
      ];
    } },
    { id: "menus", icon: "a-menu", anchor: "#top", render: () => [
      card(T("navigation"), h("div", { class: "grid2" }, tx("nav.villas", "1"), tx("nav.gallery", "2"), tx("nav.services", "3"), tx("nav.guide", "4"), tx("nav.contact", "5"), tx("nav.book", T("button")))),
      card(T("bottomBar"), h("div", { class: "grid2" }, tx("mbar.book", "1"), tx("mbar.guide", "2"), tx("mbar.go", "3"))),
      card(T("labels"), h("div", { class: "grid2" }, tx("location.open", T("mapImage")), tx("photo", T("photoPlaceholder")), tx("lang.label", T("langLabel"))))
    ] },
    { id: "settings", icon: "a-gear", anchor: "#top", render: renderSettings }
  ];

  function renderSettings() {
    const out = [];
    // Traduire tout ce qui manque
    const trBtn = h("button", { class: "btn btn--dark" }, svg("a-translate"), T("translateMissing"));
    trBtn.addEventListener("click", async () => {
      const todo = [];
      walkML(content, [], (path, v) => { if ((v[editLang] || "").trim()) LANGS.forEach((l) => { if (l !== editLang && !(v[l] || "").trim()) todo.push([v, l]); }); });
      if (!todo.length) { toast("✓", "ok"); return; }
      if (!(await confirmBox(T("translateAllConfirm", { n: todo.length, lang: LANG_NAMES[editLang] }), T("yes")))) return;
      trBtn.disabled = true; let done = 0, failed = 0;
      for (const [v, l] of todo) {
        try { v[l] = await translateText(v[editLang], editLang, l); } catch (e) { failed++; }
        done++; trBtn.lastChild.textContent = `${T("translating")} ${done}/${todo.length}`;
      }
      trBtn.disabled = false; trBtn.lastChild.textContent = T("translateMissing");
      changed(); toast(failed ? T("translateFail") : T("translated"), failed ? "err" : "ok");
    });
    out.push(card(T("translateMissing"), h("p", { class: "note" }, T("translateMissingSub")), trBtn));

    if (!authed()) {
      out.push(card(T("ghAccessTitle"), h("p", { class: "note" }, T("ghAccessSub")),
        h("button", { class: "btn btn--dark", onclick: async () => { if (await ensureAuth()) render(); } }, svg("a-rocket"), T("connect"))));
    } else {
      // Accès : mot de passe et clé GitHub
      const np1 = h("input", { class: "input", type: "password", autocomplete: "new-password" });
      const np2 = h("input", { class: "input", type: "password", autocomplete: "new-password" });
      const pwBtn = h("button", { class: "btn btn--dark" }, T("save"));
      pwBtn.addEventListener("click", async () => {
        if (np1.value.length < 10) return toast(T("pwShort"), "err");
        if (np1.value !== np2.value) return toast(T("pwMismatch"), "err");
        pwBtn.disabled = true;
        try { await saveAccess(np1.value, "Change admin password"); np1.value = np2.value = ""; toast(T("passwordChanged"), "ok"); }
        catch (e) { toast(ghError(e), "err"); }
        pwBtn.disabled = false;
      });
      out.push(card(T("changePassword"), fieldWrap(T("newPassword"), np1, { hint: T("pwShort") }), fieldWrap(T("passwordRepeat"), np2), pwBtn));

      const nk = h("input", { class: "input", type: "password", autocomplete: "off", placeholder: "github_pat_…" });
      const kp = h("input", { class: "input", type: "password", autocomplete: "current-password" });
      const kBtn = h("button", { class: "btn btn--dark" }, T("save"));
      kBtn.addEventListener("click", async () => {
        if (!nk.value.trim()) return;
        if (kp.value.length < 10) return toast(T("pwShort"), "err");
        kBtn.disabled = true;
        const old = Gh.cfg.token;
        try { Gh.cfg.token = nk.value.trim(); await Gh.verify(); await saveAccess(kp.value, "Replace admin GitHub key"); Gh.saveSession(!!store.get("ratus-admin-gh")); nk.value = kp.value = ""; toast(T("keyChanged"), "ok"); }
        catch (e) { Gh.cfg.token = old; toast(ghError(e), "err"); }
        kBtn.disabled = false;
      });
      out.push(card(T("changeKey"), h("p", { class: "note" }, T("changeKeySub")), fieldWrap(T("newKey"), nk), fieldWrap(T("password"), kp, { hint: T("keyPwHint") }), kBtn));

      // Versions précédentes (historique GitHub)
      const bl = h("div", { class: "rowlist" }, T("loading"));
      Gh.history().then((list) => {
        bl.innerHTML = "";
        if (!list.length) bl.append(h("div", { class: "field__hint" }, T("noBackups")));
        list.forEach((c, i) => {
          const d = new Date(c.commit.author.date);
          const label = d.toLocaleDateString(ui) + " " + d.toLocaleTimeString(ui, { hour: "2-digit", minute: "2-digit" });
          bl.append(h("div", { class: "rowlist__item" }, h("span", null, label, i === 0 ? h("small", { style: "color:var(--ok);font-weight:700;margin-left:8px" }, "● " + T("allSaved")) : null),
            i === 0 ? null : h("button", { class: "btn btn--soft btn--sm", onclick: async () => {
              if (!(await confirmBox(T("restoreConfirm"), T("restore")))) return;
              try { content = await Gh.load(c.sha); changed(); render(); toast(T("restoredDraft"), "ok"); } catch (e) { toast(ghError(e), "err"); }
            } }, T("restore"))));
        });
      }).catch((e) => (bl.textContent = ghError(e)));
      out.push(card(T("backups"), h("p", { class: "note" }, T("backupsSub")), bl));
      out.push(card(T("ghConnected"), h("p", { class: "note" }, T("ghConnectedSub")),
        h("button", { class: "btn btn--danger", onclick: logout }, svg("a-out"), T("logoutGh"))));
    }

    const exp = h("button", { class: "btn btn--ghost", onclick: () => {
      const a = h("a", { href: URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: "application/json" })), download: "ratus-villa-content-" + new Date().toISOString().slice(0, 10) + ".json" });
      document.body.append(a); a.click(); a.remove();
    } }, svg("a-down"), T("exportBtn"));
    const imp = h("button", { class: "btn btn--ghost", onclick: async () => {
      const [f] = await pickFiles("application/json,.json"); if (!f) return;
      try { const c = normalize(JSON.parse(await f.text())); if (!c || !c.texts || !c.villa) throw 0; content = c; changed(); render(); toast(T("imported"), "ok"); }
      catch (e) { toast(T("badFile"), "err"); }
    } }, svg("a-upload"), T("importBtn"));
    out.push(card(T("exportTitle"), h("p", { class: "note" }, T("exportSub")), h("div", { class: "media-field__btns" }, exp, imp)));

    out.push(card(T("discardTitle"), h("p", { class: "note" }, T("discardSub")),
      h("button", { class: "btn btn--danger", onclick: async () => { if (!isDirty()) return; if (await confirmBox(T("discardConfirm"), T("discard"), true)) { content = JSON.parse(published); store.del("ratus-admin-draft"); changed(); render(); } } }, T("discard"))));
    return out;
  }

  const isML = (o) => typeof o.en === "string" && Object.keys(o).length > 0 && Object.keys(o).every((k) => LANGS.includes(k));
  function walkML(o, path, fn) {
    if (Array.isArray(o)) return o.forEach((v, i) => walkML(v, [...path, i], fn));
    if (o && typeof o === "object") {
      if (isML(o)) { LANGS.forEach((l) => { if (typeof o[l] !== "string") o[l] = ""; }); return fn(path, o); }
      Object.keys(o).forEach((k) => walkML(o[k], [...path, k], fn));
    }
  }

  /* ==========================================================================
     INTERFACE PRINCIPALE
     ========================================================================== */
  const app = () => $("#app");

  function render() {
    document.documentElement.lang = ui;
    const sec = SECTIONS.find((s) => s.id === section) || SECTIONS[0];
    section = sec.id; store.set("ratus-admin-section", section);
    const scrollY = window.scrollY;
    app().className = "";
    app().innerHTML = "";
    const pubBtn = h("button", { class: "btn btn--primary publish", onclick: publish }, svg("a-rocket"), h("span", { class: "hide-sm" }, T("publish")), h("span", { class: "dot", hidden: true }));
    const head = h("header", { class: "head" },
      h("button", { class: "iconbtn head__menu", onclick: () => document.body.classList.add("menu-open"), "aria-label": T("sections") }, svg("a-menu")),
      h("div", { class: "head__brand" }, h("span", { class: "head__mark" }, "R"), h("span", { class: "head__title" }, "Ratus Villa")),
      h("div", { class: "head__spacer" }),
      h("div", { class: "head__status", id: "status" }, h("i"), h("span")),
      h("button", { class: "btn btn--ghost", onclick: togglePreview }, svg("a-eye"), h("span", { class: "hide-sm" }, T("preview"))),
      pubBtn);
    const langbar = h("div", { class: "langbar" }, h("span", { class: "langbar__lbl" }, T("editing")),
      LANGS.map((l) => h("button", { class: "lpill" + (l === editLang ? " is-on" : ""), "data-l": l, onclick: () => setEditLang(l) },
        h("b", null, l.toUpperCase()), LANG_NAMES[l], h("span", { class: "meter" }, h("span")), h("small"))));
    const nav = h("nav", { class: "side" },
      SECTIONS.map((s, i) => [s.id === "settings" ? h("div", { class: "nav__sep" }) : null,
        h("button", { class: "nav__item" + (s.id === section ? " is-on" : ""), onclick: () => go(s.id) }, svg(s.icon), T("s_" + s.id))]),
      h("div", { class: "nav__sep" }),
      h("div", { class: "nav__foot" },
        h("a", { class: "btn btn--ghost btn--sm", href: "../", target: "_blank" }, svg("a-ext"), T("openSite")),
        h("div", { class: "media-field__btns" }, LANGS.map((l) => h("button", { class: "btn btn--sm " + (l === ui ? "btn--dark" : "btn--soft"), onclick: () => { ui = l; store.set("ratus-admin-ui", l); render(); } }, l.toUpperCase()))),
        authed() ? h("button", { class: "btn btn--soft btn--sm", onclick: logout }, svg("a-out"), T("logoutGh")) : null));
    const main = h("main", { class: "main" },
      h("div", { class: "sec-head" }, h("h2", null, T("s_" + sec.id)), h("p", null, T("d_" + sec.id))),
      sec.render());
    app().append(head, langbar, h("div", { class: "body" }, nav, main), h("div", { class: "drawer-backdrop", onclick: () => document.body.classList.remove("menu-open") }), buildPreview());
    updateStatus(); updateMeters();
    window.scrollTo(0, scrollY);
  }

  function go(id) {
    section = id; document.body.classList.remove("menu-open");
    render(); window.scrollTo({ top: 0, behavior: "smooth" });
    if (previewOpen) refreshPreview(true);
  }
  function setEditLang(l) { editLang = l; store.set("ratus-admin-edit", l); render(); if (previewOpen) refreshPreview(true); }

  function updateStatus() {
    const st = $("#status"); if (!st) return;
    const dirty = isDirty();
    st.classList.toggle("is-dirty", dirty);
    st.lastChild.textContent = dirty ? T("unpublished") : T("allSaved");
    const dot = $(".publish .dot"); if (dot) dot.hidden = !dirty;
  }
  function updateMeters() {
    const tot = {}, filled = {}; LANGS.forEach((l) => { tot[l] = 0; filled[l] = 0; });
    walkML(content, [], (p, v) => LANGS.forEach((l) => { tot[l]++; if ((v[l] || "").trim()) filled[l]++; }));
    $$(".lpill").forEach((b) => {
      const l = b.dataset.l, pct = tot[l] ? Math.round(100 * filled[l] / tot[l]) : 100;
      b.querySelector(".meter span").style.width = pct + "%";
      b.querySelector("small").textContent = pct + "%";
      b.title = pct < 100 ? `${T("missingIn")} ${LANG_NAMES[l]} : ${tot[l] - filled[l]}` : "100%";
    });
  }

  /* ---------------- Aperçu ---------------- */
  function buildPreview() {
    const box = h("aside", { class: "preview" + (previewOpen ? " is-open" : ""), id: "preview" },
      h("div", { class: "preview__bar" }, h("b", null, T("preview")),
        h("div", { class: "preview__langs" }, LANGS.map((l) => h("button", { class: l === editLang ? "is-on" : "", onclick: () => setEditLang(l) }, l.toUpperCase()))),
        h("button", { class: "iconbtn", onclick: togglePreview, "aria-label": T("close") }, svg("a-x"))),
      h("div", { class: "preview__frame" }, h("iframe", { id: "previewFrame", title: T("preview") })));
    if (previewOpen) setTimeout(() => refreshPreview(true), 50);
    return box;
  }
  function togglePreview() {
    previewOpen = !previewOpen;
    document.body.classList.toggle("has-preview", previewOpen);
    $("#preview").classList.toggle("is-open", previewOpen);
    if (previewOpen) refreshPreview(true);
  }
  const refreshPreview = debounce((now) => {
    if (!previewOpen) return;
    const draft = replacePaths(content, Object.fromEntries([...pending.values()].map((f) => [f.path, f.url])));
    store.set("ratus-draft", JSON.stringify(draft));
    const fr = $("#previewFrame"); if (!fr) return;
    const sec = SECTIONS.find((s) => s.id === section) || SECTIONS[0];
    fr.src = "../index.html?preview=1&lang=" + editLang + "&t=" + Date.now() + (sec.id === "sections" && openSection ? "#s-" + openSection : sec.anchor);
  }, 900);

  /* ---------------- Publication ---------------- */
  async function publish() {
    if (!isDirty()) { toast(T("nothingToPublish")); return; }
    if (!(await ensureAuth())) return;
    // le site a-t-il été modifié ailleurs depuis l'ouverture de l'admin ?
    try {
      const remote = JSON.stringify(normalize(await Gh.load()));
      if (remote !== published && !(await confirmBox(T("remoteChanged"), T("publish"), true))) return;
    } catch (e) { toast(ghError(e), "err"); return; }
    const files = usedPendingFiles();
    modal(async (box, close) => {
      box.append(h("h3", null, T("publishing")));
      const steps = h("div", { class: "steps" });
      const sUp = h("div", { class: "step", hidden: !files.length || null }, h("i"), h("span", null, T("uploading")));
      const sSave = h("div", { class: "step" }, h("i"), h("span", null, T("savingContent")));
      steps.append(sUp, sSave); box.append(steps);
      const step = (what, n, total) => {
        if (what === "upload") { sUp.className = "step is-run"; sUp.lastChild.textContent = `${T("uploading")} ${n}/${total}`; }
        if (what === "save") { if (files.length) { sUp.className = "step is-done"; sUp.firstChild.replaceChildren(svg("a-check")); } sSave.className = "step is-run"; }
      };
      try {
        const final = await backend.publish(content, files, step);
        content = final; published = JSON.stringify(content);
        files.forEach((f) => pending.delete(f.path));
        store.del("ratus-admin-draft");
        box.innerHTML = "";
        box.append(h("div", { class: "big-ok" }, svg("a-check")), h("h3", { style: "text-align:center" }, T("published")),
          h("p", { style: "text-align:center" }, T("publishedGh")),
          h("div", { class: "modal__btns", style: "justify-content:center" },
            h("a", { class: "btn btn--ghost", href: "../", target: "_blank" }, svg("a-ext"), T("openSite")),
            h("button", { class: "btn btn--dark", onclick: () => { close(); render(); } }, T("close"))));
      } catch (e) {
        [sUp, sSave].forEach((s) => { if (s.classList.contains("is-run")) { s.className = "step is-err"; s.firstChild.textContent = "!"; } });
        box.append(h("p", { style: "color:var(--danger)" }, T("publishError") + " : " + ghError(e)),
          h("div", { class: "modal__btns" }, h("button", { class: "btn btn--dark", onclick: close }, T("close"))));
      }
    });
  }

  async function logout() {
    if (!(await confirmBox(T("logoutGh") + " ?", T("yes"), true))) return;
    Gh.clearSession(); Gh.cfg = null; render();
  }

  /* ==========================================================================
     CONNEXION — demandée uniquement pour publier (une fois par appareil)
     ========================================================================== */
  let ACCESS = null;
  const authed = () => !!(Gh.cfg && Gh.cfg.token);

  async function ensureAuth() {
    if (authed()) return true;
    if (!window.crypto || !crypto.subtle) { toast("HTTPS required", "err"); return false; }
    ACCESS = await fetchAccess();
    return new Promise((res) => modal((box, close) => {
      const done = (ok) => { close(); res(ok); };
      ACCESS ? loginForm(box, done) : setupForm(box, done);
    }));
  }

  function formHead(box, title, sub) {
    box.innerHTML = "";
    box.append(h("div", { class: "login__mark" }, "R"), h("h3", null, title), h("p", null, sub));
  }

  // Mot de passe de l'équipe
  function loginForm(box, done, msg) {
    formHead(box, T("publishLoginTitle"), T("publishLoginSub"));
    const pw = h("input", { class: "input", type: "password", autocomplete: "current-password" });
    const rem = h("input", { type: "checkbox", checked: true });
    const err = h("p", { class: "err" }, msg || "");
    const btn = h("button", { class: "btn btn--primary", type: "submit" }, T("signIn"));
    const form = h("form", { class: "authform" }, fieldWrap(T("password"), pw), h("label", { class: "check" }, rem, T("rememberMe")), err,
      h("div", { class: "modal__btns" }, h("button", { type: "button", class: "btn btn--ghost", onclick: () => done(false) }, T("cancel")), btn),
      h("details", null, h("summary", null, T("ownerZone")), h("p", null, T("ownerZoneText")),
        h("button", { type: "button", class: "btn btn--ghost btn--sm", onclick: () => setupForm(box, done, "", true) }, T("reconfigure"))));
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); err.textContent = ""; btn.disabled = true; btn.textContent = T("loading");
      try {
        const token = await openAccess(ACCESS, pw.value);
        Gh.cfg = Object.assign(Gh.defaults(), { owner: ACCESS.owner, repo: ACCESS.repo, branch: ACCESS.branch || "main", token });
        await Gh.verify();
        Gh.saveSession(rem.checked);
        done(true); return;
      } catch (ex) { Gh.cfg = null; err.textContent = ex.code === "wrong_password" ? T("wrongPassword") : ghError(ex); pw.select(); }
      btn.disabled = false; btn.textContent = T("signIn");
    });
    box.append(form);
    setTimeout(() => pw.focus(), 250);
  }

  // Première configuration par le propriétaire : clé GitHub + mot de passe de l'équipe
  function setupForm(box, done, msg, isReset) {
    formHead(box, T("setupTitle"), T("setupSub"));
    const d = Gh.defaults();
    const tok = h("input", { class: "input", type: "password", autocomplete: "off", placeholder: "github_pat_…" });
    const p1 = h("input", { class: "input", type: "password", autocomplete: "new-password" });
    const p2 = h("input", { class: "input", type: "password", autocomplete: "new-password" });
    const owner = h("input", { class: "input", value: d.owner }), repo = h("input", { class: "input", value: d.repo }), branch = h("input", { class: "input", value: d.branch });
    const err = h("p", { class: "err" }, msg || "");
    const btn = h("button", { class: "btn btn--primary", type: "submit" }, T("setupBtn"));
    const form = h("form", { class: "authform" },
      fieldWrap(T("ghToken"), tok, { hint: T("ghKeyHint") }),
      h("details", null, h("summary", null, T("ghHelp")), h("p", null, T("ghHelpText"))),
      fieldWrap(T("password"), p1, { hint: T("pwShort") }), fieldWrap(T("passwordRepeat"), p2),
      h("details", { open: !d.owner || null }, h("summary", null, T("ghAdvanced")), fieldWrap(T("ghOwner"), owner), fieldWrap(T("ghRepo"), repo), fieldWrap(T("ghBranch"), branch)),
      err,
      h("div", { class: "modal__btns" }, h("button", { type: "button", class: "btn btn--ghost", onclick: () => (isReset && ACCESS ? loginForm(box, done) : done(false)) }, T("cancel")), btn));
    form.addEventListener("submit", async (e) => {
      e.preventDefault(); err.textContent = "";
      if (!tok.value.trim()) return (err.textContent = T("ghToken") + " ?");
      if (p1.value.length < 10) return (err.textContent = T("pwShort"));
      if (p1.value !== p2.value) return (err.textContent = T("pwMismatch"));
      btn.disabled = true; btn.textContent = T("loading");
      Gh.cfg = { owner: owner.value.trim(), repo: repo.value.trim(), branch: branch.value.trim() || "main", token: tok.value.trim() };
      try {
        await Gh.verify();
        ACCESS = await saveAccess(p1.value, "Set up admin access");   // premier enregistrement = test du droit d'écriture
        Gh.saveSession(true);
        box.innerHTML = "";
        box.append(h("div", { class: "big-ok" }, svg("a-check")), h("h3", { style: "text-align:center" }, T("setupDoneTitle")), h("p", { style: "text-align:center" }, T("setupDone")),
          h("div", { class: "modal__btns", style: "justify-content:center" }, h("button", { class: "btn btn--dark", onclick: () => done(true) }, T("ok"))));
        return;
      } catch (ex) { Gh.cfg = null; err.textContent = ghError(ex); }
      btn.disabled = false; btn.textContent = T("setupBtn");
    });
    box.append(form);
    setTimeout(() => tok.focus(), 250);
  }

  // Anciennes versions du contenu (une seule villa) -> liste de villas
  function normalize(c) {
    if (!c || typeof c !== "object") return c;
    if (!c.villa && Array.isArray(c.villas) && c.villas.length) {
      c.villa = c.villas[0];
      c.sections = (c.sections || []).concat(c.villas.slice(1).map((v) => Object.assign(newSection("villa"), { villa: v })));
    }
    delete c.villas;
    if (!Array.isArray(c.sections)) c.sections = [];
    c.hero = c.hero || {};
    if (c.hero.titleA == null) { c.hero.titleA = "Ratus"; c.hero.titleB = "Villa"; }
    walkML(c, [], () => {});
    return c;
  }


  async function loadIcons() {
    try {
      const html = await (await fetch("../index.html", { cache: "no-store" })).text();
      const doc = new DOMParser().parseFromString(html, "text/html");
      const sprite = doc.querySelector("svg symbol") && doc.querySelector("svg symbol").parentElement;
      if (sprite) { sprite.setAttribute("style", "position:absolute;width:0;height:0"); document.body.append(document.importNode(sprite, true)); }
      SITE_ICONS = $$("symbol[id^='i-']").map((s) => s.id.slice(2)).filter((v, i, a) => a.indexOf(v) === i);
    } catch (e) {}
  }

  async function start() {
    app().className = "app-loading"; app().innerHTML = '<div class="splash"><span class="splash__mark">R</span><span class="splash__bar"></span></div>';
    content = null;
    if (authed()) { try { content = await Gh.load(); } catch (e) { Gh.clearSession(); Gh.cfg = null; } }
    if (!content) {
      try { content = await (await fetch("../content/content.json?t=" + Date.now(), { cache: "no-store" })).json(); }
      catch (e) { app().className = ""; app().innerHTML = ""; app().append(h("p", { style: "padding:24px" }, T("networkError"))); return; }
    }
    content = normalize(content);
    published = JSON.stringify(content);
    // brouillon d'une visite précédente ?
    try {
      const d = JSON.parse(store.get("ratus-admin-draft") || "null");
      if (d && d.content && JSON.stringify(d.content) !== published) {
        const resume = await new Promise((res) => modal((card, close) => {
          card.append(h("h3", null, "✏️"), h("p", null, T("resumeDraft")), h("div", { class: "modal__btns" },
            h("button", { class: "btn btn--ghost", onclick: () => { close(); res(false); } }, T("startOver")),
            h("button", { class: "btn btn--dark", onclick: () => { close(); res(true); } }, T("resume"))));
        }));
        if (resume) {
          // les fichiers non envoyés de la dernière visite sont perdus : on retire leurs références
          content = walk(d.content, (v) => (typeof v === "string" && v.startsWith("assets/uploads/") && !published.includes(JSON.stringify(v)) ? "" : v));
          content = normalize(content);
          [content.gallery, content.villa && content.villa.photos, ...content.sections.map((x) => x.photos || (x.villa && x.villa.photos))].forEach((arr) => { if (Array.isArray(arr)) for (let i = arr.length - 1; i >= 0; i--) if (!arr[i].src) arr.splice(i, 1); });
        } else store.del("ratus-admin-draft");
      }
    } catch (e) {}
    render();
  }

  async function boot() {
    document.documentElement.lang = ui;
    if (!SITE_ICONS.length) await loadIcons();
    // pas de mot de passe pour ouvrir l'admin : il est demandé seulement au moment de publier
    const saved = Gh.loadSession();
    if (saved && saved.token) {
      Gh.cfg = Object.assign(Gh.defaults(), saved);
      try { await Gh.verify(); } catch (e) { Gh.clearSession(); Gh.cfg = null; }
    }
    start();
  }

  window.addEventListener("beforeunload", (e) => { if (content && isDirty()) { e.preventDefault(); e.returnValue = T("leaveWarning"); } });
  boot();
})();
