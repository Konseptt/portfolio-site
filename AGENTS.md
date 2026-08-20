# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static** HTML/CSS/JS portfolio (no `package.json`, no build step, no test suite, no linter config).

### Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

### What matters

- Ink cursor: SVG nib + canvas trail in `main.js` / `styles.css` (desktop fine pointer only).
- Projects: `projects.js` (hardest / most relevant first; taglines are intentionally humorous).
- Site-wide quips: rotating status line + footer in `main.js` (`QUIPS`) — hallway / ProgrammerHumor classics, not a separate jokes page.
- Background is CSS atmosphere (no stock video).

### Notes

- No `npm test` / lint / framework build.
- Prefer editing `projects.js` and copy in `index.html` over adding tooling.
