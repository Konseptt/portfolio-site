(function () {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const bgVideo = document.querySelector(".bg-video");
  if (bgVideo && prefersReduced) {
    bgVideo.pause();
    bgVideo.removeAttribute("autoplay");
  }

  if (bgVideo && !prefersReduced) {
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          bgVideo.pause();
        } else {
          bgVideo.play().catch(() => {});
        }
      },
      { passive: true }
    );
  }

  const grid = document.getElementById("project-grid");
  const projects = window.PORTFOLIO_PROJECTS || [];

  if (projects.length === 0) {
    grid.innerHTML =
      '<p class="project-empty mono">Nothing here yet — add entries in <code>projects.js</code> when you’re ready.</p>';
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function padIndex(n) {
    return String(n).padStart(2, "0");
  }

  projects.forEach((p, i) => {
    const href = p.url || "";
    const thumb = (p.thumb || "").trim();
    const Tag = href ? "a" : "div";
    const el = document.createElement(Tag);
    el.className = "project-row reveal-card";
    if (thumb) el.classList.add("has-thumb");
    el.style.setProperty("--row-accent", p.accent || "#ff4d00");
    el.dataset.href = href;
    if (href) {
      el.href = href;
      el.target = "_blank";
      el.rel = "noopener noreferrer";
    } else {
      el.classList.add("is-static");
      el.setAttribute("role", "article");
    }

    el.style.transitionDelay = prefersReduced ? "0ms" : `${i * 45}ms`;

    const idx = padIndex(i + 1);
    const tags = (p.tags || [])
      .map((t) => `<span class="tag mono">${escapeHtml(t)}</span>`)
      .join("");

    const thumbBlock = thumb
      ? `<div class="project-thumb"><img src="${escapeHtml(thumb)}" alt="" loading="lazy" decoding="async" width="400" height="225" /></div>`
      : "";

    el.innerHTML = `
      <span class="project-idx mono">${idx}</span>
      ${thumbBlock}
      <div class="project-block">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-tagline">${escapeHtml(p.tagline)}</p>
      </div>
      <span class="project-year mono">${escapeHtml(p.year || "—")}</span>
      <div class="project-tags">${tags}</div>
      ${href ? '<span class="row-glyph" aria-hidden="true">↗</span>' : ""}
    `;

    grid.appendChild(el);
  });

  function rafThrottle(el, fn) {
    if (el._rtPending) return;
    el._rtPending = true;
    requestAnimationFrame(() => {
      el._rtPending = false;
      fn();
    });
  }

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
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setCursorPos(cx, cy);

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
        if (t.closest("a, button")) {
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
          el.style.transform = `translate3d(${dx * 0.08}px, ${dy * 0.08}px, 0)`;
        });
      },
      { passive: true }
    );
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });

  const toReveal = document.querySelectorAll(".reveal, .reveal-card");
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
})();
