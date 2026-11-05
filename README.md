# Kralnu Games

The home page for Kralnu Games: free indie games you play in your browser.

## [▶ kralnugames.com](https://kralnugames.com/)

- [Fairway Tales](https://kralnugames.com/Fairway-Tales/): a golf RPG you play with one thumb
- [Solaris Gambit](https://kralnugames.com/Solaris-Gambit/): a tactical card game
- [Tight Lines](https://kralnugames.com/tight-lines/): a survival fishing adventure

☕ [Support on Ko-fi](https://ko-fi.com/kralnu90)

© 2026 kralnu90. All rights reserved.

## Site layout

- `index.html` — front page: three doorways, all news, about
- `play/` — fun games (Fairway Tales, Tight Lines, Solaris Gambit, Metropolitan Misadventure)
- `learn/` — learn-to-code games (Python Kitchen, Garage Code)
- `kids/` — games for young children (coming soon)
- `site.css` — shared styles; each section sets its own theme with a body class (`play`, `learn`, `kids`)
- `news.js` + `news.json` — news on every page. A section's `<section id="news" data-games="...">` only shows posts about its games.
