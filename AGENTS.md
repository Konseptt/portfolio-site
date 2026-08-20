# AGENTS.md

## Cursor Cloud specific instructions

This repo is a **static** HTML/CSS/JS portfolio (no `package.json`, no build step, no test suite, no linter config).

### Run locally

Serve the repo root (required so relative asset paths resolve):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Node is also fine: `npx --yes serve -l 8000`.

### What to exercise

- Custom ink cursor (desktop fine pointer only): hand-drawn SVG nib + canvas trail in `main.js` / `styles.css`. Hidden when `prefers-reduced-motion` or coarse/touch pointers.
- Project grid from `projects.js` (ordered hardest / most relevant first).
- Joke deck from `jokes.js` — Lab notes section: Next joke / Reveal punchline.

### Notes

- Do not expect `npm test`, `npm run lint`, or a framework build.
- Prefer editing content in `projects.js` / `jokes.js` over inventing new tooling.
