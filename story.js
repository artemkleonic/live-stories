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

  // ===== theme =====
  const keyTheme = `${storyId}_theme`;
  const savedTheme = localStorage.getItem(keyTheme);
  if (savedTheme) document.body.setAttribute("data-theme", savedTheme);

  safeOn($("btnTheme"), "click", () => {
    const current = document.body.getAttribute("data-theme") || "ink";
    const next = current === "ink" ? "sepia" : "ink";
    document.body.setAttribute("data-theme", next);
    localStorage.setItem(keyTheme, next);
  });

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

  function wordsPerPage() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    let base = 520;
    if (w < 520) base = 260;
    else if (w < 800) base = 360;
    else if (w < 1100) base = 460;

    if (h < 720) base -= 60;

    const scale =
      Number(getComputedStyle(document.body).getPropertyValue("--reader-font-scale")) || 1;
    base = Math.round(base / scale);

    return Math.max(180, base);
  }

  function paginateBlocks() {
    const pages = [];
    let current = [];
    let words = 0;
    const limit = wordsPerPage();

    for (const el of blocks) {
      const w = countWords(el.textContent);

      if (el.tagName === "H2" && current.length > 0) {
        pages.push(current);
        current = [];
        words = 0;
      }

      if (words + w > limit && current.length > 0) {
        pages.push(current);
        current = [];
        words = 0;
      }

      current.push(el);
      words += w;
    }

    if (current.length) pages.push(current);
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

  // IMPORTANT:
  // Telegram WebView can "jump to top" on programmatic scroll & on resize events.
  // So: in TG we DO NOT auto-scroll after rendering.
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
    if (Math.abs(dy) > 14) tMoved = true; // vertical scroll in progress
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    if (tMoved) return; // user was scrolling vertically, not swiping
    const t = e.changedTouches?.[0];
    if (!t) return;

    const dx = t.clientX - tStartX;
    const dy = t.clientY - tStartY;

    if (Math.abs(dx) < 80) return;   // not enough horizontal intent
    if (Math.abs(dy) > 30) return;   // too diagonal

    if (dx > 0) go(-1);
    else go(+1);
  }, { passive: true });

  // ===== resize repagination =====
  // Telegram WebView can emit resize during scroll because UI bars show/hide.
  // We disable resize repagination in TG to prevent jumps.
  if (!IS_TG) {
    let resizeTimer = null;
    let lastWidth = window.innerWidth;

    window.addEventListener("resize", () => {
      const newWidth = window.innerWidth;
      // ignore tiny jitter
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
    // after font change we DO want to be at top (except TG)
    renderPage({ scrollTop: true });
  }

  // start
  pages = paginateBlocks();
  pageIndex = clamp(pageIndex, 0, pages.length - 1);
  renderPage({ scrollTop: false }); // initial render: no forced scroll

})();
