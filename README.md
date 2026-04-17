# Portfolio site

This is my personal portfolio — a single-page site with a video background, a project list, and a contact block. Nothing fancy under the hood: plain HTML, CSS, and a little JavaScript. No React, no build step. You can open `index.html` locally and it works.

**Live site:** [konseptt.github.io/portfolio-site](https://konseptt.github.io/portfolio-site/)

---

### What’s in here

- **`index.html`** — layout, hero, project section, contact  
- **`styles.css`** — all the styling  
- **`main.js`** — fills the project list from data, cursor + small interactions, pauses the background video when the tab is hidden  
- **`projects.js`** — the actual list of projects (titles, links, taglines, thumbnail paths). Edit this when you add or remove work  
- **`assets/thumbs/`** — screenshot PNGs for each project row  

The background video is loaded from Mixkit’s CDN; the poster image is set in the `<video>` tag if you want to swap the mood later.

---

### Run it on your machine

From this folder:

```bash
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080). A local server avoids some browsers being picky about `file://` and external video.

---

### Adding or changing a project

Open **`projects.js`** and add an object to the `PORTFOLIO_PROJECTS` array (or edit an existing one). Each entry can have:

- `title`, `tagline`, `tags`, `year`  
- `url` — link when someone clicks the row (omit if there’s no URL)  
- `accent` — a hex color for the hover wash  
- `thumb` — path to an image, e.g. `assets/thumbs/my-project.png` (or `null` if you don’t want a thumbnail)  

Drop new images into **`assets/thumbs/`** and reference them in `thumb`.

---

### Deploy

It’s set up for **GitHub Pages** from the `main` branch. Push to `main` and the site updates after a short build. Repo: [github.com/Konseptt/portfolio-site](https://github.com/Konseptt/portfolio-site).

---

If something breaks or looks wrong on mobile, open an issue or fix it in CSS — most layout quirks are fixable without touching the JS.
