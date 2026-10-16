# Creator Hub — Professional YouTube Website

A responsive, polished creator website built with **HTML, CSS, and vanilla JavaScript**. No framework or build tools are required.

## Files
- `index.html` — semantic page structure and YouTube embeds/links
- `style.css` — responsive design system, themes, motion, cards, navigation and accessibility states
- `script.js` — mobile navigation, persistent theme switcher, scroll progress, reveal animations, pointer highlights, back-to-top control, smooth anchors, and live copyright year

## Run locally
1. Extract the ZIP.
2. Keep all three files in the same folder.
3. Open `index.html` in a modern browser. For local hosting, use VS Code Live Server or any static web server.

## Customize
- Replace **CREATOR HUB** with your channel/brand name in `index.html`.
- The YouTube channel link is set to `UC72bhJUkOY94BxoiuTTlYIQ`.
- Change colors in the `:root` variables at the top of `style.css`.
- The theme toggle remembers the visitor's choice where browser storage is available.

## Notes
- The page uses Google Fonts when internet access is available and falls back to system fonts otherwise.
- The YouTube playlist embed requires internet access and may be affected by browser privacy settings.
- Motion respects the visitor's `prefers-reduced-motion` accessibility preference.
