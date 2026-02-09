(() => {
  "use strict";

  // ===== helpers =====
  const $ = (id) => document.getElementById(id);

  function safeOn(el, evt, fn, opts) {
    if (el) el.addEventListener(evt, fn, opts);
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function getBodyDataset(key, fallback = "") {
    return (document.body?.dataset?.[key] ?? fallback);
  }

  // ===== env detect (Telegram WebView, iOS etc.) =====
  const UA = navigator.userAgent || "";
  const IS_TG = /Telegram|Tg/i.test(UA);

  // ===== year =====
  const y = $("y");
  if (y) y.textContent = new Date().getFullYear();

  // ===== mild copy protection =====
  document.addEventListener("contextmenu", (e) => e.preventDefault());
  document.addEventListener("copy", (e) => e.preventDefault());
  document.addEventListener("cut", (e) => e.preventDefault());

  document.addEventListener("selectstart", (e) => {
    const allow = e.target.closest(".controls, .topbar, .pagination, .footer, .toast");
    if (!allow) e.preventDefault();
  });

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey;
    if (ctrl && (key === "c" || key === "x" || key === "u" || key === "s" || key === "p")) {
      e.preventDefault();
    }
  });

  // ===== readbar + toTop =====
  const readFill = $("readbarFill");
  const toTop = $("toTop");

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const p = max <= 0 ? 0 : (doc.scrollTop / max);
    if (readFill) readFill.style.transform = `scaleX(${clamp(p, 0, 1)})`;

    if (toTop) {
      if (doc.scrollTop > 500) toTop.classList.add("totop--show");
      else toTop.classList.remove("totop--show");
    }
  }

  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  safeOn(toTop, "click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // ===== toast =====
  let toastTimer = null;
  function toast(msg) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("toast--show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("toast--show"), 1400);
  }

  // ===== story meta =====
  const storyId = getBodyDataset("storyId", "story");
  const storyTitle = getBodyDataset("storyTitle", document.title);
  const storyAuthor = getBodyDataset("storyAuthor", "");
  const storyDate = getBodyDataset("storyDate", "");

  const titleEl = $("storyTitle");
  const authorEl = $("storyAuthor");
  const dateEl = $("storyDate");

  if (titleEl) titleEl.textContent = storyTitle;
  if (authorEl) authorEl.textContent = storyAuthor;
  if (dateEl) dateEl.textContent = storyDate;

  // ===== font scale =====
  const keyFont = `${storyId}_font`;
  let fontStep = Number(localStorage.getItem(keyFont) || 0);

  function applyFont() {
    fontStep = clamp(fontStep, -2, 4);
    localStorage.setItem(keyFont, String(fontStep));
    document.body.style.setProperty("--reader-font-scale", (1 + fontStep * 0.06).toFixed(2));
  }

  applyFont();

  // ===== theme (ink -> sepia -> light) =====
  const keyTheme = `${storyId}_theme`;
  const savedTheme = localStorage.getItem(keyTheme);
  if (savedTheme) document.body.setAttribute("data-theme", savedTheme);

  const THEMES = ["ink", "sepia", "light"];

  function cycleTheme() {
    const current = document.body.getAttribute("data-theme") || "ink";
    const idx = THEMES.indexOf(current);
    const next = THEMES[(idx + 1 + THEMES.length) % THEMES.length] || "ink";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem(keyTheme, next);
    toast(next === "ink" ? "Тема: тёмная" : next === "sepia" ? "Тема: сепия" : "Тема: светлая");
  }

  safeOn($("btnTheme"), "click", cycleTheme);


  // ===== focus mode =====
  const keyFocus = `${storyId}_focus`;
  const savedFocus = localStorage.getItem(keyFocus) === "1";
  if (savedFocus) document.body.classList.add("focus-mode");

  safeOn($("btnFocus"), "click", () => {
    document.body.classList.toggle("focus-mode");
    localStorage.setItem(keyFocus, document.body.classList.contains("focus-mode") ? "1" : "0");
  });

  // ===== back =====
  safeOn($("btnBack"), "click", () => {
    window.location.href = "index.html#stories";
  });

  // ===== share/copy link =====
  const shareData = {
    title: `${storyTitle} — Рассказы моего отца`,
    text: `Рассказ: «${storyTitle}».`,
    url: window.location.href
  };

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Ссылка скопирована");
    } catch {
      const tmp = document.createElement("textarea");
      tmp.value = window.location.href;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand("copy");
      tmp.remove();
      toast("Ссылка скопирована");
    }
  }

  safeOn($("btnCopyLink"), "click", copyLink);

  safeOn($("btnShare"), "click", async () => {
    try {
      if (navigator.share) await navigator.share(shareData);
      else await copyLink();
    } catch {
      // user cancelled
    }
  });

  // ===== reading time =====
  function countWords(text) {
    const t = (text || "").replace(/\s+/g, " ").trim();
    if (!t) return 0;
    return t.split(" ").filter(Boolean).length;
  }

  // ===== auto pagination =====
  const tpl = $("storyText");
  const contentHost = $("pageContent");

  if (!tpl || !contentHost) {
    console.warn("story.js: missing template or pageContent");
    return;
  }

  const blocks = Array.from(tpl.content.querySelectorAll("p, h2"));

  const totalWords = countWords(blocks.map(b => b.textContent).join(" "));
  const wpm = 190;
  const mins = Math.max(1, Math.round(totalWords / wpm));
  const readingEl = $("readingTime");
  if (readingEl) readingEl.textContent = `~${mins} мин`;

  // ===== NEW: bigger pages + "merge tiny last page" =====
  function wordsPerPage() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Было слишком мало на телефонах, из-за этого "страница 2 = 2 абзаца".
    let base = 900;

    if (w < 520) base = 560;       // phone
    else if (w < 800) base = 720;  // small tablet
    else if (w < 1100) base = 860; // laptop
    else base = 980;              // large

    if (h < 720) base -= 80;

    const scale =
      Number(getComputedStyle(document.body).getPropertyValue("--reader-font-scale")) || 1;
    base = Math.round(base / scale);

    return Math.max(420, base);
  }

  function paginateBlocks() {
    const pages = [];
    let current = [];
    let words = 0;
    const limit = wordsPerPage();

    const wordCountEl = (el) => countWords(el.textContent);

    for (const el of blocks) {
      const w = wordCountEl(el);

      // H2 начинает новую страницу (если уже есть контент)
      if (el.tagName === "H2" && current.length > 0) {
        pages.push(current);
        current = [];
        words = 0;
      }

      // переполнение — закрываем страницу
      if (words + w > limit && current.length > 0) {
        pages.push(current);
        current = [];
        words = 0;
      }

      current.push(el);
      words += w;
    }

    if (current.length) pages.push(current);

    // FIX 1: если последняя страница "огрызок" — приклеиваем к предыдущей
    if (pages.length >= 2) {
      const last = pages[pages.length - 1];
      const prev = pages[pages.length - 2];

      const lastWords = last.reduce((sum, el) => sum + wordCountEl(el), 0);
      const minTail = Math.min(220, Math.round(limit * 0.35));

      if (lastWords < minTail) {
        pages[pages.length - 2] = prev.concat(last);
        pages.pop();
      }
    }

    // FIX 2: если осталось 2 страницы и вторая короткая — делаем одну
    if (pages.length === 2) {
      const secondWords = pages[1].reduce((sum, el) => sum + wordCountEl(el), 0);
      if (secondWords < 420) {
        pages[0] = pages[0].concat(pages[1]);
        pages.pop();
      }
    }

    return pages;
  }

  let pages = [];
  let pageIndex = 0;

  const keyPage = `${storyId}_page`;

  function loadSavedPage() {
    const s = localStorage.getItem(keyPage);
    if (s !== null && !isNaN(Number(s))) pageIndex = Number(s);
  }

  loadSavedPage();

  const pageLabel = $("pageLabel");
  const pageCounter = $("pageCounter");
  const pagePill = $("pagePill");
  const prevBtn = $("prevBtn");
  const nextBtn = $("nextBtn");

  function renderPage({ scrollTop = true } = {}) {
    pages = pages.length ? pages : paginateBlocks();
    pageIndex = clamp(pageIndex, 0, pages.length - 1);

    // animate
    contentHost.classList.remove("animate-in");
    void contentHost.offsetWidth;
    contentHost.classList.add("animate-in");

    contentHost.innerHTML = "";
    pages[pageIndex].forEach(el => contentHost.appendChild(el.cloneNode(true)));

    const human = pageIndex + 1;

    if (pageLabel) pageLabel.textContent = `Страница ${human}`;

    if (pageCounter) pageCounter.textContent = `${human} / ${pages.length}`;
    if (pagePill) pagePill.textContent = `${human} / ${pages.length}`;

    if (prevBtn) prevBtn.disabled = (pageIndex === 0);
    if (nextBtn) nextBtn.disabled = (pageIndex === pages.length - 1);

    localStorage.setItem(keyPage, String(pageIndex));

    if (scrollTop && !IS_TG) {
      const readerTop = document.querySelector(".reader");
      if (readerTop) readerTop.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function go(delta) {
    pageIndex = clamp(pageIndex + delta, 0, pages.length - 1);
    renderPage({ scrollTop: true });
  }

  safeOn(prevBtn, "click", () => go(-1));
  safeOn(nextBtn, "click", () => go(+1));

  // ===== controls: font +/- =====
  safeOn($("btnMinus"), "click", () => {
    fontStep--;
    applyFont();
    paginateAndRender(true);
  });

  safeOn($("btnPlus"), "click", () => {
    fontStep++;
    applyFont();
    paginateAndRender(true);
  });

  // keyboard paging
  document.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
    if (tag === "input" || tag === "textarea" || e.target?.isContentEditable) return;

    if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(+1); }
    if (e.key === "Escape") { window.location.href = "index.html#stories"; }
  });

  // ===== mobile swipe paging (safe: ignores vertical scroll) =====
  let tStartX = 0, tStartY = 0, tMoved = false;

  document.addEventListener("touchstart", (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    tStartX = t.clientX;
    tStartY = t.clientY;
    tMoved = false;
  }, { passive: true });

  document.addEventListener("touchmove", (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    const dy = t.clientY - tStartY;
    if (Math.abs(dy) > 14) tMoved = true;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    if (tMoved) return;
    const t = e.changedTouches?.[0];
    if (!t) return;

    const dx = t.clientX - tStartX;
    const dy = t.clientY - tStartY;

    if (Math.abs(dx) < 80) return;
    if (Math.abs(dy) > 30) return;

    if (dx > 0) go(-1);
    else go(+1);
  }, { passive: true });

  // ===== resize repagination =====
  if (!IS_TG) {
    let resizeTimer = null;
    let lastWidth = window.innerWidth;

    window.addEventListener("resize", () => {
      const newWidth = window.innerWidth;
      if (Math.abs(newWidth - lastWidth) < 50) return;
      lastWidth = newWidth;

      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => paginateAndRender(true), 200);
    });
  }

  function paginateAndRender(keepIndex) {
    const oldIdx = pageIndex;
    pages = paginateBlocks();
    if (keepIndex) pageIndex = clamp(oldIdx, 0, pages.length - 1);
    renderPage({ scrollTop: true });
  }

  // start
  pages = paginateBlocks();
  pageIndex = clamp(pageIndex, 0, pages.length - 1);
  renderPage({ scrollTop: false });
})();
