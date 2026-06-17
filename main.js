(function () {
  "use strict";

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     Project cards
     ---------------------------------------------------------- */
  const grid = document.getElementById("project-grid");
  const projects = window.PORTFOLIO_PROJECTS || [];

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s == null ? "" : s;
    return d.innerHTML;
  }

  function padIndex(n) {
    return String(n).padStart(2, "0");
  }

  function thumbAspectStyle(p) {
    const raw = p.thumbAspect;
    if (typeof raw !== "string") return "";
    const compact = raw.replace(/\s+/g, "");
    if (!/^\d+\/\d+$/.test(compact)) return "";
    return ` style="aspect-ratio:${compact}"`;
  }

  if (grid) {
    if (projects.length === 0) {
      grid.innerHTML =
        '<p class="project-empty mono">No projects listed - add entries in <code>projects.js</code>.</p>';
    }

    projects.forEach((p, i) => {
      const href = p.url || "";
      const thumb = (p.thumb || "").trim();
      const Tag = href ? "a" : "div";
      const el = document.createElement(Tag);
      el.className = "project-card reveal-card";
      el.style.setProperty("--row-accent", p.accent || "#c9f73a");

      if (href) {
        el.href = href;
        el.target = "_blank";
        el.rel = "noopener noreferrer";
      } else {
        el.setAttribute("role", "article");
      }

      el.style.transitionDelay = prefersReduced ? "0ms" : `${(i % 3) * 70}ms`;

      const idx = padIndex(i + 1);
      const tags = (p.tags || [])
        .map((t) => `<span class="tag mono">${escapeHtml(t)}</span>`)
        .join("");

      const thumbAttrs =
        i < 3 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
      const iw = Number.isFinite(p.thumbImgWidth) ? p.thumbImgWidth : 400;
      const ih = Number.isFinite(p.thumbImgHeight) ? p.thumbImgHeight : 225;

      const thumbBlock = thumb
        ? `<div class="project-thumb"${thumbAspectStyle(
            p
          )}><img src="${escapeHtml(
            thumb
          )}" alt="Screenshot of ${escapeHtml(
            p.title
          )}" ${thumbAttrs} decoding="async" width="${iw}" height="${ih}" /></div>`
        : `<div class="project-thumb project-thumb--placeholder" aria-hidden="true">${escapeHtml(
            (p.title || "?").charAt(0)
          )}</div>`;

      el.innerHTML = `
        ${thumbBlock}
        <div class="project-body">
          <div class="project-top">
            <span class="project-idx mono">${idx}</span>
            <span class="project-year mono">${escapeHtml(p.year || "—")}</span>
          </div>
          <h3 class="project-title">${escapeHtml(p.title)}</h3>
          <p class="project-tagline">${escapeHtml(p.tagline)}</p>
          <div class="project-tags">${tags}</div>
          ${
            href
              ? '<div class="project-foot mono">open it <span class="row-glyph" aria-hidden="true">↗</span></div>'
              : '<div class="project-foot mono">source only</div>'
          }
        </div>
        <span class="project-accent-bar" aria-hidden="true"></span>
      `;

      grid.appendChild(el);
    });
  }

  /* ----------------------------------------------------------
     RAF throttle helper
     ---------------------------------------------------------- */
  function rafThrottle(el, fn) {
    if (el._rtPending) return;
    el._rtPending = true;
    requestAnimationFrame(() => {
      el._rtPending = false;
      fn();
    });
  }

  /* ----------------------------------------------------------
     Custom cursor + hero parallax
     ---------------------------------------------------------- */
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const hero = document.querySelector("[data-parallax]");
  const useCustomCursor =
    dot &&
    ring &&
    !prefersReduced &&
    window.matchMedia("(hover: hover)").matches &&
    window.matchMedia("(pointer: fine)").matches;

  function setCursorPos(x, y) {
    const t = `translate3d(${x}px, ${y}px, 0)`;
    if (dot) dot.style.transform = t;
    if (ring) ring.style.transform = t;
  }

  if (useCustomCursor) {
    document.body.classList.add("cursor-on");
    setCursorPos(window.innerWidth / 2, window.innerHeight / 2);

    window.addEventListener(
      "pointermove",
      (e) => {
        setCursorPos(e.clientX, e.clientY);
        if (hero) {
          const x = (e.clientX / window.innerWidth - 0.5) * 8;
          const y = (e.clientY / window.innerHeight - 0.5) * 5;
          hero.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      },
      { passive: true }
    );

    window.addEventListener(
      "pointerdown",
      () => document.body.classList.add("is-pointer-down"),
      { passive: true }
    );
    window.addEventListener(
      "pointerup",
      () => document.body.classList.remove("is-pointer-down"),
      { passive: true }
    );

    document.addEventListener(
      "mouseover",
      (e) => {
        const t = e.target;
        if (t.closest && t.closest("a, button")) {
          document.body.classList.add("is-hovering-link");
        } else {
          document.body.classList.remove("is-hovering-link");
        }
      },
      true
    );
  } else if (hero && !prefersReduced) {
    window.addEventListener(
      "pointermove",
      (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 8;
        const y = (e.clientY / window.innerHeight - 0.5) * 5;
        hero.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      },
      { passive: true }
    );
  }

  /* ----------------------------------------------------------
     Magnetic buttons
     ---------------------------------------------------------- */
  const magnetics = document.querySelectorAll(".magnetic");
  magnetics.forEach((el) => {
    el.addEventListener(
      "pointermove",
      (e) => {
        if (prefersReduced) return;
        el._lx = e.clientX;
        el._ly = e.clientY;
        rafThrottle(el, () => {
          const r = el.getBoundingClientRect();
          const dx = el._lx - (r.left + r.width / 2);
          const dy = el._ly - (r.top + r.height / 2);
          el.style.transform = `translate3d(${dx * 0.18}px, ${dy * 0.18}px, 0)`;
        });
      },
      { passive: true }
    );
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });

  /* ----------------------------------------------------------
     Reveal on scroll
     ---------------------------------------------------------- */
  const toReveal = document.querySelectorAll(".reveal, .reveal-card");
  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 }
    );
    toReveal.forEach((el) => io.observe(el));
  } else {
    toReveal.forEach((el) => el.classList.add("is-visible"));
  }

  /* ----------------------------------------------------------
     Stat counters (count up when visible)
     ---------------------------------------------------------- */
  const counters = document.querySelectorAll("[data-count-to]");
  function animateCount(el) {
    const target = Number(el.getAttribute("data-count-to")) || 0;
    if (prefersReduced || target === 0) {
      el.textContent = String(target);
      return;
    }
    const dur = 1100;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            animateCount(en.target);
            cio.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) =>
      el.classList ? animateCount(el) : null
    );
  }

  /* ----------------------------------------------------------
     Rotating hero tagline (goofy)
     ---------------------------------------------------------- */
  const rotateEl = document.querySelector("[data-rotate-tagline]");
  if (rotateEl && !prefersReduced) {
    const lines = [
      "// developer-ish",
      "// professional googler",
      "// CSS whisperer",
      "// it works, don't touch",
      "// 99 bugs fixed, 117 left",
      "// ctrl+z enthusiast",
    ];
    let li = 0;
    setInterval(() => {
      li = (li + 1) % lines.length;
      rotateEl.style.opacity = "0";
      setTimeout(() => {
        rotateEl.textContent = lines[li];
        rotateEl.style.opacity = "1";
      }, 220);
    }, 3200);
    rotateEl.style.transition = "opacity 0.22s ease";
  }

  /* ----------------------------------------------------------
     Footer clock
     ---------------------------------------------------------- */
  const ft = document.getElementById("footer-time");
  function tick() {
    if (!ft) return;
    const now = new Date();
    ft.textContent = now.toLocaleString(undefined, {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  tick();
  setInterval(tick, 30000);

  /* ----------------------------------------------------------
     Easter eggs: Konami code + console greeting
     ---------------------------------------------------------- */
  const seq = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];
  let pos = 0;
  window.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    pos = key === seq[pos] ? pos + 1 : key === seq[0] ? 1 : 0;
    if (pos === seq.length) {
      pos = 0;
      document.body.animate(
        [
          { filter: "hue-rotate(0deg)" },
          { filter: "hue-rotate(360deg)" },
        ],
        { duration: 1400, iterations: 1 }
      );
      window.dispatchEvent(new CustomEvent("konami:party"));
    }
  });

  try {
    console.log(
      "%c↳ hey, you opened devtools. respect.",
      "color:#c9f73a;font-family:monospace;font-size:13px"
    );
    console.log(
      "%cbuilt by hand. no framework. bugs are artisanal. — RS",
      "color:#ff5c47;font-family:monospace"
    );
  } catch (_) {}
})();
