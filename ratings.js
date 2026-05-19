/* =========================
   RM feedback widget: ratings + private comments
   Работает на страницах рассказов с body.story-body
   ========================= */
(function () {
  "use strict";

  const API_URL = (window.RM_RATINGS_API || "").trim();
  const API_IS_READY = API_URL && !API_URL.includes("PASTE_GOOGLE_APPS_SCRIPT");
  const body = document.body;

  if (!body || !body.classList.contains("story-body")) return;

  const storyId = getStoryId();
  const storyTitle = getStoryTitle();
  if (!storyId || !storyTitle) return;

  const startedAt = Date.now();
  const userKey = getReaderId();
  const ratingStorageKey = `rm_story_rating_${storyId}`;
  const commentStorageKey = `rm_story_comment_${storyId}`;

  const widget = document.createElement("section");
  widget.className = "rm-feedback";
  widget.setAttribute("aria-label", "Оценка и комментарий к рассказу");
  widget.innerHTML = `
    <div class="rm-feedback__inner">
      <div class="rm-feedback__eyebrow">После прочтения</div>
      <h3 class="rm-feedback__title">Оцените рассказ</h3>
      <p class="rm-feedback__text">
        Одна оценка с одного браузера. Если передумали, можно нажать другую звезду — оценка обновится.
        Комментарий увидит только автор на служебной странице.
      </p>

      <div class="rm-feedback__stars" role="radiogroup" aria-label="Оцените рассказ от 1 до 5">
        ${[1, 2, 3, 4, 5].map((n) => `<button class="rm-feedback__star" type="button" data-rating="${n}" role="radio" aria-checked="false" aria-label="${n} из 5">★</button>`).join("")}
      </div>
      <div class="rm-feedback__message" id="rmRatingMessage" aria-live="polite"></div>

      <details class="rm-comment">
        <summary class="rm-comment__summary">Оставить комментарий автору</summary>

        <div class="rm-comment__body">
          <div class="rm-comment__chips" aria-label="Быстрая реакция">
            ${[
              "Зацепило",
              "До мурашек",
              "Смешно",
              "Глубоко",
              "Спорно",
              "Слишком длинно",
              "Хочу продолжение"
            ].map((label) => `<button class="rm-comment__chip" type="button" data-reaction="${escapeAttr(label)}">${escapeHtml(label)}</button>`).join("")}
          </div>

          <label class="rm-comment__label">
            Ваше имя <span>(необязательно)</span>
            <input class="rm-comment__input" id="rmCommentName" type="text" maxlength="80" placeholder="Можно оставить пустым">
          </label>

          <label class="rm-comment__label">
            Комментарий <span>(необязательно, до 1200 знаков)</span>
            <textarea class="rm-comment__textarea" id="rmCommentText" maxlength="1200" rows="5" placeholder="Напишите пару слов, если хочется. Например: что зацепило, где было смешно, где стало спорно..."></textarea>
          </label>

          <input class="rm-comment__trap" id="rmCommentTrap" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">

          <div class="rm-comment__actions">
            <button class="rm-comment__send" id="rmCommentSend" type="button">Отправить автору</button>
            <span class="rm-comment__counter" id="rmCommentCounter">0 / 1200</span>
          </div>
          <div class="rm-comment__message" id="rmCommentMessage" aria-live="polite"></div>
        </div>
      </details>
    </div>
  `;

  const pagination = document.querySelector(".pagination");
  const paper = document.querySelector(".reader__paper") || document.querySelector(".reader") || document.querySelector(".story");

  if (pagination) {
    pagination.insertAdjacentElement("afterend", widget);
  } else if (paper) {
    paper.appendChild(widget);
  } else {
    document.body.appendChild(widget);
  }

  const stars = Array.from(widget.querySelectorAll(".rm-feedback__star"));
  const ratingMessage = widget.querySelector("#rmRatingMessage");
  const commentMessage = widget.querySelector("#rmCommentMessage");
  const commentText = widget.querySelector("#rmCommentText");
  const commentName = widget.querySelector("#rmCommentName");
  const commentTrap = widget.querySelector("#rmCommentTrap");
  const commentSend = widget.querySelector("#rmCommentSend");
  const commentCounter = widget.querySelector("#rmCommentCounter");
  const reactionButtons = Array.from(widget.querySelectorAll(".rm-comment__chip"));

  const savedRating = Number(localStorage.getItem(ratingStorageKey) || 0);
  if (savedRating) {
    paintStars(savedRating);
    setMessage(ratingMessage, `Вы уже поставили ${savedRating} из 5. Можно изменить оценку.`, "soft");
  } else if (!API_IS_READY) {
    setMessage(ratingMessage, "Система ещё не подключена к Google Таблице. Нужно вставить URL в ratings-config.js.", "warn");
  }

  if (localStorage.getItem(commentStorageKey)) {
    setMessage(commentMessage, "Комментарий уже был отправлен. Можно отправить новый вариант — он обновит старый.", "soft");
  }

  stars.forEach((btn) => {
    const value = Number(btn.dataset.rating);

    btn.addEventListener("mouseenter", () => paintStars(value, true));
    btn.addEventListener("focus", () => paintStars(value, true));

    btn.addEventListener("click", () => {
      localStorage.setItem(ratingStorageKey, String(value));
      paintStars(value);

      if (!API_IS_READY) {
        setMessage(ratingMessage, "Оценка сохранена только в этом браузере. Для общей статистики проверь ratings-config.js.", "warn");
        return;
      }

      setMessage(ratingMessage, "Сохраняем оценку…", "soft");
      sendRating(value);
      setMessage(ratingMessage, "Спасибо. Оценка принята.", "ok");
    });
  });

  const starsBox = widget.querySelector(".rm-feedback__stars");
  if (starsBox) {
    starsBox.addEventListener("mouseleave", () => {
      paintStars(Number(localStorage.getItem(ratingStorageKey) || 0));
    });
  }

  reactionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("is-active");
    });
  });

  if (commentText && commentCounter) {
    commentText.addEventListener("input", () => {
      commentCounter.textContent = `${commentText.value.length} / 1200`;
    });
  }

  if (commentSend) {
    commentSend.addEventListener("click", () => {
      const name = cleanText(commentName && commentName.value, 80);
      const text = cleanText(commentText && commentText.value, 1200);
      const reactions = getReactions();

      if (commentTrap && commentTrap.value) {
        setMessage(commentMessage, "Спасибо. Комментарий отправлен.", "ok");
        return;
      }

      if (!text && !reactions.length) {
        setMessage(commentMessage, "Напишите комментарий или выберите быструю реакцию.", "warn");
        return;
      }

      if (!API_IS_READY) {
        setMessage(commentMessage, "Комментарий не ушёл в таблицу: проверь URL в ratings-config.js.", "warn");
        return;
      }

      commentSend.disabled = true;
      setMessage(commentMessage, "Отправляем комментарий…", "soft");
      sendComment({ name, text, reactions });

      localStorage.setItem(commentStorageKey, "1");
      setMessage(commentMessage, "Спасибо. Комментарий отправлен автору.", "ok");
      commentSend.disabled = false;
    });
  }

  setupLastPageVisibility();

  function getStoryId() {
    const fromBody = body.dataset.storyId || "";
    const fromPath = location.pathname.match(/story-(\d+)/i);
    return String(fromBody || (fromPath && fromPath[1]) || "")
      .replace(/^story-/i, "")
      .trim();
  }

  function getStoryTitle() {
    return String(
      body.dataset.storyTitle ||
      (document.getElementById("storyTitle") && document.getElementById("storyTitle").textContent) ||
      (document.querySelector(".story__title") && document.querySelector(".story__title").textContent) ||
      document.title ||
      "Без названия"
    ).replace(/\s+—.*$/, "").trim();
  }

  function getReaderId() {
    const key = "rm_reader_id";
    let id = localStorage.getItem(key);
    if (!id) {
      id = `reader_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(key, id);
    }
    return id;
  }

  function paintStars(value, isPreview) {
    stars.forEach((btn) => {
      const n = Number(btn.dataset.rating);
      btn.classList.toggle("is-active", n <= value);
      btn.classList.toggle("is-preview", Boolean(isPreview && n <= value));
      btn.setAttribute("aria-checked", n === value ? "true" : "false");
    });
  }

  function setMessage(el, text, type) {
    if (!el) return;
    el.textContent = text || "";
    el.dataset.type = type || "";
  }

  function basePayload(action) {
    const payload = new URLSearchParams();
    payload.set("action", action);
    payload.set("storyId", storyId);
    payload.set("storyTitle", storyTitle);
    payload.set("page", location.pathname.split("/").pop() || location.pathname);
    payload.set("url", location.href);
    payload.set("userKey", userKey);
    payload.set("userAgent", navigator.userAgent.slice(0, 180));
    payload.set("referrer", document.referrer || "");
    payload.set("readSeconds", String(Math.max(0, Math.round((Date.now() - startedAt) / 1000))));
    payload.set("viewport", `${window.innerWidth || 0}x${window.innerHeight || 0}`);
    return payload;
  }

  function sendRating(value) {
    const payload = basePayload("rate");
    payload.set("rating", String(value));

    fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: payload
    }).catch(() => {
      setMessage(ratingMessage, "Оценка сохранена в браузере, но не ушла в таблицу. Проверь Apps Script.", "warn");
    });
  }

  function sendComment(data) {
    const payload = basePayload("comment");
    payload.set("name", data.name || "");
    payload.set("comment", data.text || "");
    payload.set("reactions", data.reactions.join(", "));
    payload.set("rating", String(Number(localStorage.getItem(ratingStorageKey) || 0)));

    fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      body: payload
    }).catch(() => {
      setMessage(commentMessage, "Комментарий не ушёл в таблицу. Проверь Apps Script.", "warn");
    });
  }

  function getReactions() {
    return reactionButtons
      .filter((btn) => btn.classList.contains("is-active"))
      .map((btn) => cleanText(btn.dataset.reaction, 60))
      .filter(Boolean);
  }

  function cleanText(value, max) {
    return String(value || "").replace(/\s+/g, " ").trim().slice(0, max || 500);
  }

  function setupLastPageVisibility() {
    const pagePill = document.getElementById("pagePill") || document.getElementById("pageCounter");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    function parsePage() {
      if (!pagePill) return null;
      const txt = pagePill.textContent || "";
      const m = txt.match(/(\d+)\s*\/\s*(\d+)/);
      if (!m) return null;
      return { current: Number(m[1]), total: Number(m[2]) };
    }

    function updateVisibility() {
      const p = parsePage();
      if (!p || p.total <= 1) {
        widget.classList.add("is-visible");
        return;
      }
      widget.classList.toggle("is-visible", p.current >= p.total);
    }

    updateVisibility();
    [nextBtn, prevBtn].forEach((btn) => {
      if (btn) btn.addEventListener("click", () => setTimeout(updateVisibility, 80));
    });

    if (pagePill && "MutationObserver" in window) {
      new MutationObserver(updateVisibility).observe(pagePill, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>\"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[ch];
    });
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, "&#39;");
  }
})();
