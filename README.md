# portfolio-site

My portfolio. Plain HTML, CSS, and JS. No build step, no framework, no
`node_modules`. Open `index.html` or run `python3 -m http.server` and go.

Live: https://projects.ranjansharma.info.np/

## Files

- `index.html` - the page. Meta, hero, project list, footer.
- `styles.css` - all styling. Long on purpose, one file.
- `main.js` - project rendering, cursor trail, status line, TL;DR bubble, footer clock.
- `galaxy.js` - the spiral on the right. Canvas, pointer-reactive on desktop.
- `lyang-demo.js` - a tiny LyangLang subset so people can poke it without installing Rust.
- `projects.js` - project data. Edit this, not the HTML.
- `now.js` - one line about what I'm up to. Shows at `/now/`.
- `llms.txt` - plain-text summary of the site for LLM crawlers. Keep in step with `projects.js`.
- `assets/` - thumbs, favicon, OG card, self-hosted fonts, Clarity loader.

## Editing

Projects: add an object to `projects.js`. Fields: `title`, `tagline`, `tags`,
`year`, `url`, `accent`, `thumb`, optional `built` (one line on how it's made)
and `demo: "lyang"` for the in-row toy.

Now line: edit `text` and `updated` in `now.js`.

Status quips: `QUIPS` array near the top of `main.js`.

## Notes

- Fonts are self-hosted in `assets/fonts/` (JetBrains Mono + Anton).
- CSP is a `<meta>` tag on each page. Clarity is allowlisted; nothing else external except the Mixkit background clip.
- Cursor trail and galaxy interaction only turn on for fine pointers with motion allowed.
