(function () {
  "use strict";

  var LANGS = ["ru", "en", "ua"];
  var LABELS = {
    ru: "Русский",
    en: "English",
    ua: "Українська"
  };

  var TEXT = {
    ru: {
      "brand.title": "Мысли думающего человека",
      "brand.tag": "Сборник рассказов Горизонт событий.",
      "intro.cta": "Подписаться на Telegram",
      "about.cardBadge": "Спецтекст",
      "about.cardTitle": "О проекте",
      "about.cardDesc": "Несколько слов о том, откуда берутся эти тексты, почему «Рой» — не просто старый ник из интернета, и как один камуфляжный спальник стал почти святыней.",
      "about.cardPill1": "Рой",
      "about.cardPill2": "Истоки",
      "contact.title": "Контакты",
      "contact.text": "Telegram: <a href=\"https://t.me/aleksey_Ivakhnenko\" target=\"_blank\" rel=\"noopener noreferrer\">@aleksey_Ivakhnenko</a><br>Facebook: <a href=\"https://www.facebook.com/aleksej.ivahnenko\" target=\"_blank\" rel=\"noopener noreferrer\">Алексей Ивахненко</a>",
      "contact.write": "Написать",
      "contact.facebook": "Facebook",
      "nav.about": "О проекте",
      "nav.contacts": "Контакты",
      "nav.stories": "Рассказы",
      "nav.language": "Язык",
      "fab.language": "Язык",
      "modal.eyebrow": "Выбор голоса",
      "modal.title": "Один сайт. Три двери. Один человеческий голос.",
      "modal.text": "Выберите язык библиотеки. Здесь показываются только настоящие тексты: если рассказ ещё не переведён, он не притворяется существующим.",
      "modal.enNote": "Литературный перевод, без машинной шелухи.",
      "modal.uaNote": "Полка ждёт свой первый честный голос.",
      "modal.ruNote": "Основная живая библиотека.",
      "modal.foot": "Никакого автоперевода. Никакой картонной литературы. Только текст, которому дали дышать.",
      "world.kicker": "Многоязычная библиотека",
      "world.title": "Один автор. Несколько языков. Ни одного бездушного перевода.",
      "world.text": "Сайт открывает только те полки, где уже есть живые тексты. Русская библиотека полная, английская уже начала дышать, украинская готовится к своему первому честному голосу.",
      "manifesto.kicker": "Принцип перевода",
      "manifesto.title": "Рассказ не чемодан. Его нельзя просто перенести из одного языка в другой.",
      "manifesto.item1Title": "Сначала голос",
      "manifesto.item1Text": "Ритм, ирония и пауза автора важны не меньше, чем прямой смысл слов.",
      "manifesto.item2Title": "Без фальшивых полок",
      "manifesto.item2Text": "Если рассказ ещё не готов на языке, он скрыт, а не притворяется переводом.",
      "manifesto.item3Title": "Медленно значит честно",
      "manifesto.item3Text": "Переводы будут появляться по одному, потому что литературу нельзя прогонять через мясорубку скорости.",
      "card.translationReady": "Доступна английская версия",
      "intro.quote": "«Это не рассказы. Это попытка понять, зачем вообще жить.<br>Это не книга. Это разговор.<br>Если тебе кажется, что ты всё понял — тебе не сюда.»",
      "about.title": "О проекте",
      "about.sub": "История о том, как появился Рой, почему вещи иногда становятся почти святыми и как из жизни собирается улей рассказов.",
      "stories.title": "Рассказы",
      "stories.sub": "Нажми на карточку — откроется отдельная страница рассказа.",
      "gate.eyebrow": "Выбор языка",
      "gate.title": "Истории умеют говорить на разных языках.",
      "gate.text": "Выберите язык, на котором хотите читать. Сайт не делает машинную кашу из живого текста: он показывает только те рассказы, которые уже существуют на выбранном языке.",
      "gate.note": "Переводы будут появляться постепенно. Здесь лучше честная тишина, чем быстрый бездушный пересказ.",
      "status.kicker": "Текущий язык",
      "status.link": "К рассказам",
      statusTitle: "Русская библиотека",
      statusText: "Сейчас показаны рассказы, доступные на русском языке.",
      emptyTitle: "На русском рассказы доступны.",
      emptyText: "Если вы видите это сообщение, значит карточки временно скрыты или ещё не подключены.",
      emptyBack: "Показать русскую библиотеку"
    },
    en: {
      "brand.title": "Stories of a Thinking Person",
      "brand.tag": "Event Horizon. A collection of stories.",
      "intro.cta": "Subscribe on Telegram",
      "about.cardBadge": "Special text",
      "about.cardTitle": "About the project",
      "about.cardDesc": "A few words about where these texts come from, why Roy is more than an old internet nickname, and how life gathers itself into a hive of stories.",
      "about.cardPill1": "Roy",
      "about.cardPill2": "Origins",
      "contact.title": "Contacts",
      "contact.text": "Telegram: <a href=\"https://t.me/aleksey_Ivakhnenko\" target=\"_blank\" rel=\"noopener noreferrer\">@aleksey_Ivakhnenko</a><br>Facebook: <a href=\"https://www.facebook.com/aleksej.ivahnenko\" target=\"_blank\" rel=\"noopener noreferrer\">Aleksey Ivakhnenko</a>",
      "contact.write": "Write",
      "contact.facebook": "Facebook",
      "nav.about": "About",
      "nav.contacts": "Contacts",
      "nav.stories": "Stories",
      "nav.language": "Language",
      "fab.language": "Language",
      "modal.eyebrow": "Choose the voice",
      "modal.title": "One site. Three doors. One human voice.",
      "modal.text": "Select the language of the library. Only real texts are shown here: if a story has not yet been translated, it does not pretend to exist.",
      "modal.enNote": "Translated with literary care.",
      "modal.uaNote": "The shelf is waiting for its first voice.",
      "modal.ruNote": "The main living library.",
      "modal.foot": "No automatic translation. No cardboard literature. Only a text that has been allowed to breathe.",
      "world.kicker": "Multilingual library",
      "world.title": "One author. Several languages. Not a single soulless translation.",
      "world.text": "The site opens only the shelves where living texts already exist. The Russian library is full, the English one has begun to breathe, and the Ukrainian shelf is preparing for its first honest voice.",
      "manifesto.kicker": "Translation manifesto",
      "manifesto.title": "A story is not a suitcase. It cannot simply be moved from one language to another.",
      "manifesto.item1Title": "Voice first",
      "manifesto.item1Text": "The rhythm, irony and silence of the author matter as much as the meaning of the words.",
      "manifesto.item2Title": "No fake shelves",
      "manifesto.item2Text": "If a story is not ready in a language, it stays hidden instead of pretending.",
      "manifesto.item3Title": "Slow is honest",
      "manifesto.item3Text": "Translations will appear one by one, because literature should not be rushed through a machine.",
      "card.translationReady": "English version available",
      "intro.quote": "These are not just stories. This is an attempt to understand why we live at all.<br>This is not a book. This is a conversation.<br>If you think you already understand everything, this place is probably not for you.",
      "about.title": "About the project",
      "about.sub": "A living archive of stories, memory, irony and quiet questions that do not let a thinking person sleep too easily.",
      "stories.title": "Stories",
      "stories.sub": "Only stories already available in English are shown here.",
      "gate.eyebrow": "Choose your language",
      "gate.title": "Stories can cross borders without losing their soul.",
      "gate.text": "Choose the language you want to read in. The site shows only the stories that already exist in that language. No machine fog. No cheap imitation of literature.",
      "gate.note": "Translations will appear gradually. A story deserves a human voice, not a hurried mechanical shadow.",
      "status.kicker": "Current language",
      "status.link": "To stories",
      statusTitle: "English library",
      statusText: "Only stories available in English are shown. New translations will be added carefully, one by one.",
      emptyTitle: "The English shelf is being prepared.",
      emptyText: "The library will open here only when a story has a real English version. Not an automatic translation. Not a cardboard copy. A living text.",
      emptyBack: "Read in Russian for now"
    },
    ua: {
      "brand.title": "Думки мислячої людини",
      "brand.tag": "Горизонт подій. Збірка оповідань.",
      "intro.cta": "Підписатися на Telegram",
      "about.cardBadge": "Спецтекст",
      "about.cardTitle": "Про проєкт",
      "about.cardDesc": "Кілька слів про те, звідки беруться ці тексти, чому «Рой» — не просто старий нік з інтернету, і як із життя збирається вулик історій.",
      "about.cardPill1": "Рой",
      "about.cardPill2": "Витоки",
      "contact.title": "Контакти",
      "contact.text": "Telegram: <a href=\"https://t.me/aleksey_Ivakhnenko\" target=\"_blank\" rel=\"noopener noreferrer\">@aleksey_Ivakhnenko</a><br>Facebook: <a href=\"https://www.facebook.com/aleksej.ivahnenko\" target=\"_blank\" rel=\"noopener noreferrer\">Олексій Івахненко</a>",
      "contact.write": "Написати",
      "contact.facebook": "Facebook",
      "nav.about": "Про проєкт",
      "nav.contacts": "Контакти",
      "nav.stories": "Оповідання",
      "nav.language": "Мова",
      "fab.language": "Мова",
      "modal.eyebrow": "Вибір голосу",
      "modal.title": "Один сайт. Троє дверей. Один людський голос.",
      "modal.text": "Оберіть мову бібліотеки. Тут показані тільки справжні тексти: якщо оповідання ще не перекладене, воно не вдає, ніби вже існує.",
      "modal.enNote": "Літературний переклад, без машинного лушпиння.",
      "modal.uaNote": "Полиця чекає на свій перший чесний голос.",
      "modal.ruNote": "Основна жива бібліотека.",
      "modal.foot": "Жодного автоперекладу. Жодної картонної літератури. Тільки текст, якому дали дихати.",
      "world.kicker": "Багатомовна бібліотека",
      "world.title": "Один автор. Кілька мов. Жодного бездушного перекладу.",
      "world.text": "Сайт відкриває тільки ті полиці, де вже є живі тексти. Російська бібліотека повна, англійська вже почала дихати, українська готується до свого першого чесного голосу.",
      "manifesto.kicker": "Принцип перекладу",
      "manifesto.title": "Оповідання не валіза. Його не можна просто перенести з однієї мови в іншу.",
      "manifesto.item1Title": "Спершу голос",
      "manifesto.item1Text": "Ритм, іронія і пауза автора важать не менше, ніж прямий зміст слів.",
      "manifesto.item2Title": "Без фальшивих полиць",
      "manifesto.item2Text": "Якщо оповідання ще не готове певною мовою, воно приховане, а не прикидається перекладом.",
      "manifesto.item3Title": "Повільно означає чесно",
      "manifesto.item3Text": "Переклади з’являтимуться по одному, бо літературу не можна проганяти крізь м’ясорубку швидкості.",
      "card.translationReady": "Доступна англійська версія",
      "intro.quote": "Це не просто оповідання. Це спроба зрозуміти, навіщо взагалі жити.<br>Це не книжка. Це розмова.<br>Якщо тобі здається, що ти вже все зрозумів, тобі, мабуть, не сюди.",
      "about.title": "Про проєкт",
      "about.sub": "Живий архів історій, пам’яті, іронії та тихих запитань, які не дають мислячій людині спати надто спокійно.",
      "stories.title": "Оповідання",
      "stories.sub": "Тут показані лише ті оповідання, які вже доступні українською.",
      "gate.eyebrow": "Вибір мови",
      "gate.title": "Історії можуть звучати різними мовами, не втрачаючи душі.",
      "gate.text": "Оберіть мову, якою хочете читати. Сайт показує тільки ті оповідання, які вже справді існують обраною мовою. Без машинного туману. Без імітації живого тексту.",
      "gate.note": "Переклади з’являтимуться поступово. Історія заслуговує на людський голос, а не на поспішну механічну тінь.",
      "status.kicker": "Поточна мова",
      "status.link": "До оповідань",
      statusTitle: "Українська полиця",
      statusText: "Тут будуть показані лише оповідання, які вже доступні українською мовою.",
      emptyTitle: "Українська версія готується.",
      emptyText: "Ми не хочемо просто перекласти слова. Ми хочемо зберегти інтонацію, біль, іронію і дихання кожної історії. Перші оповідання українською з’являться тут окремо, чесно і без поспіху.",
      emptyBack: "Поки читати російською"
    }
  };

  function normalizeLang(value) {
    value = String(value || "").toLowerCase();
    if (value === "uk") return "ua";
    return LANGS.indexOf(value) >= 0 ? value : "ru";
  }

  function getInitialLang() {
    var params = new URLSearchParams(window.location.search || "");
    var fromUrl = normalizeLang(params.get("lang"));
    if (params.has("lang")) return fromUrl;
    try {
      var saved = localStorage.getItem("rm.site.lang");
      if (saved) return normalizeLang(saved);
    } catch (e) {}
    return "ru";
  }

  function cardLangs(card) {
    var raw = card.getAttribute("data-lang") || "ru";
    return raw.split(/[\s,|]+/).filter(Boolean).map(normalizeLang);
  }

  function plural(count, forms) {
    var n = Math.abs(count) % 100;
    var n1 = n % 10;
    if (n > 10 && n < 20) return forms[2];
    if (n1 > 1 && n1 < 5) return forms[1];
    if (n1 === 1) return forms[0];
    return forms[2];
  }

  function countLabel(lang, count) {
    if (lang === "en") return count + " " + (count === 1 ? "story" : "stories");
    if (lang === "ua") return count + " " + plural(count, ["оповідання", "оповідання", "оповідань"]);
    return count + " " + plural(count, ["рассказ", "рассказа", "рассказов"]);
  }

  function aboutUrl(lang) {
    lang = normalizeLang(lang);
    if (lang === "en") return "about-project-en.html";
    if (lang === "ua") return "about-project-ua.html";
    return "about-project.html";
  }

  function updateAboutLinks(lang) {
    document.querySelectorAll("[data-about-link]").forEach(function (el) {
      el.setAttribute("href", aboutUrl(lang));
    });
  }


  function ensureEmptyState(grid) {
    var empty = document.getElementById("languageEmptyState");
    if (empty) return empty;
    empty = document.createElement("div");
    empty.id = "languageEmptyState";
    empty.className = "language-empty panel";
    empty.innerHTML = '' +
      '<div class="language-empty__icon" aria-hidden="true">✦</div>' +
      '<h3 class="language-empty__title"></h3>' +
      '<p class="language-empty__text"></p>' +
      '<button class="btn btn--primary" type="button" data-lang-switch="ru"></button>';
    grid.appendChild(empty);
    return empty;
  }

  function applyI18n(lang) {
    var dict = TEXT[lang] || TEXT.ru;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (!dict[key]) return;
      el.innerHTML = dict[key];
    });
    var statusTitle = document.getElementById("statusTitle");
    var statusText = document.getElementById("statusText");
    if (statusTitle) statusTitle.textContent = dict.statusTitle;
    if (statusText) statusText.textContent = dict.statusText;
  }

  function updateUrl(lang) {
    if (!window.history || !window.history.replaceState) return;
    var url = new URL(window.location.href);
    if (lang === "ru") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", lang);
    }
    window.history.replaceState({}, "", url.pathname + url.search + url.hash);
  }

  function applyLanguage(lang, opts) {
    lang = normalizeLang(lang);
    opts = opts || {};
    var dict = TEXT[lang] || TEXT.ru;
    document.documentElement.lang = lang === "ua" ? "uk" : lang;
    document.body.setAttribute("data-site-lang", lang);

    applyI18n(lang);
    updateAboutLinks(lang);

    var cards = Array.prototype.slice.call(document.querySelectorAll("#stories .grid > a.card"));
    var counts = { ru: 0, en: 0, ua: 0 };
    cards.forEach(function (card) {
      if (!card.getAttribute("data-story-id")) return;
      cardLangs(card).forEach(function (l) {
        if (counts.hasOwnProperty(l)) counts[l] += 1;
      });
    });

    LANGS.forEach(function (l) {
      document.querySelectorAll('[data-lang-count="' + l + '"]').forEach(function (el) {
        el.textContent = countLabel(l, counts[l] || 0);
      });
    });

    var shown = 0;
    cards.forEach(function (card) {
      var ok = cardLangs(card).indexOf(lang) >= 0;
      card.classList.toggle("story-card--hidden", !ok);
      card.setAttribute("aria-hidden", ok ? "false" : "true");
      if (ok) shown += 1;
    });

    var grid = document.querySelector("#stories .grid");
    if (grid) {
      var empty = ensureEmptyState(grid);
      empty.hidden = shown !== 0;
      var title = empty.querySelector(".language-empty__title");
      var text = empty.querySelector(".language-empty__text");
      var back = empty.querySelector("button");
      if (title) title.textContent = dict.emptyTitle;
      if (text) text.textContent = dict.emptyText;
      if (back) back.textContent = dict.emptyBack;
    }

    document.querySelectorAll("[data-lang-switch]").forEach(function (control) {
      var active = normalizeLang(control.getAttribute("data-lang-switch")) === lang;
      control.classList.toggle("is-active", active);
      control.setAttribute("aria-pressed", active ? "true" : "false");
    });

    try { localStorage.setItem("rm.site.lang", lang); } catch (e) {}
    if (!opts.silentUrl) updateUrl(lang);
  }

  function openLanguageModal() {
    var modal = document.getElementById("languageModal");
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("language-modal-open");
    var active = modal.querySelector(".language-card.is-active") || modal.querySelector(".language-card");
    setTimeout(function () { if (active) active.focus(); }, 30);
  }

  function closeLanguageModal() {
    var modal = document.getElementById("languageModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("language-modal-open");
    try { sessionStorage.setItem("rm.language.modal.seen", "1"); } catch (e) {}
  }

  function maybeOpenLanguageModal() {
    try {
      if (sessionStorage.getItem("rm.language.modal.seen") === "1") return;
    } catch (e) {}
    openLanguageModal();
  }

  document.addEventListener("click", function (event) {
    var opener = event.target.closest("[data-open-language-modal]");
    if (opener) {
      event.preventDefault();
      openLanguageModal();
      return;
    }
    var closer = event.target.closest("[data-close-language-modal]");
    if (closer) {
      event.preventDefault();
      closeLanguageModal();
      return;
    }
    var control = event.target.closest("[data-lang-switch]");
    if (!control) return;
    var lang = normalizeLang(control.getAttribute("data-lang-switch"));
    applyLanguage(lang);
    if (control.closest("#languageModal") || control.hasAttribute("data-modal-select")) {
      closeLanguageModal();
      var stories = document.getElementById("stories");
      if (stories) setTimeout(function () { stories.scrollIntoView({ behavior: "smooth", block: "start" }); }, 120);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLanguageModal();
  });

  document.addEventListener("DOMContentLoaded", function () {
    applyLanguage(getInitialLang(), { silentUrl: true });
    setTimeout(maybeOpenLanguageModal, 450);
  });
})();
