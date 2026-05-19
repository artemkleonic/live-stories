RM Ratings — простая система оценок рассказов

Файлы, которые нужно положить в корень сайта:
- ratings-config.js
- ratings.js
- ratings.css
- rm-otsenki-rasskazov-7q4m9x2p.html

Адрес скрытой страницы будет примерно:
https://roy.in.ua/rm-otsenki-rasskazov-7q4m9x2p.html

Это НЕ парольная защита. Страница просто не будет видна в меню и имеет сложное имя.

Порядок установки:
1. Создай Google Таблицу.
2. Открой Extensions / Расширения → Apps Script.
3. Вставь код из google-apps-script.txt.
4. Deploy → New deployment → Web app.
5. Execute as: Me.
6. Who has access: Anyone.
7. Скопируй Web app URL, который заканчивается на /exec.
8. Вставь этот URL в ratings-config.js вместо PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE.
9. В самый низ story.js вставь код из install-snippet-for-story-js.txt.
10. Залей файлы на сайт.

Как работает:
- В конце последней страницы каждого рассказа появится блок оценки.
- Человек ставит 1-5 звезд.
- Оценка улетает в Google Таблицу.
- Если человек с того же браузера изменит оценку, в таблице обновится старая оценка, а не добавится дубль.
- Страница rm-otsenki-rasskazov-7q4m9x2p.html показывает средние оценки.
