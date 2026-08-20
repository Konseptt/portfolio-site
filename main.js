(function () {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Classic hallway / r/ProgrammerHumor staples — woven into chrome, not a joke page */
  const QUIPS = [
    "There are 10 types of people: those who get binary, and those who don't.",
    "Why do programmers mix up Halloween & Christmas? Oct 31 = Dec 25.",
    "An SQL query walks into a bar, sees two tables, asks: can I join you?",
    "I'd tell you a UDP joke, but you might not get it.",
    "It works on my machine.™",
    "Debugging: being the detective in a crime you committed.",
    "There's no place like 127.0.0.1.",
    "git commit -m \"final final FINAL version\"",
    "How many psychologists to change a lightbulb? One — if it wants to change.",
    "Freudian slip: when you say one thing and mean your mother.",
    "Does the name Pavlov ring a bell?",
    "Psychologists meet: \"You're fine, how am I?\"",
    "My code doesn't have bugs — it develops random features.",
    "I don't always test my code, but when I do, I do it in production.",
    "A programmer's favorite hangout: the foo bar.",
    "To understand recursion, you must first understand recursion.",
  ];

  const statusLine = document.getElementById("status-line");
  const footerQuip = document.getElementById("footer-quip");
  let quipIndex = Math.floor(Math.random() * QUIPS.length);

  function paintQuip() {
    const text = QUIPS[quipIndex % QUIPS.length];
    if (statusLine) statusLine.textContent = text;
    if (footerQuip) footerQuip.textContent = text;
    quipIndex += 1;
  }
  paintQuip();
  if (!prefersReduced) {
    setInterval(paintQuip, 9000);
  }

  const grid = document.getElementById("project-grid");
  const projects = window.PORTFOLIO_PROJECTS || [];

  if (projects.length === 0) {
    grid.innerHTML =
      "<p class=\"project-empty mono\">No projects listed — add entries in <code>projects.js</code>. Or dont. Chaos is also a strategy.</p>";
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
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

    const thumbAttrs =
      i === 0
        ? 'loading="eager" fetchpriority="high"'
        : 'loading="lazy"';
    const iw = Number.isFinite(p.thumbImgWidth) ? p.thumbImgWidth : 400;
    const ih = Number.isFinite(p.thumbImgHeight) ? p.thumbImgHeight : 225;
    const thumbBlock = thumb
      ? `<div class="project-thumb"${thumbAspectStyle(p)}><img src="${escapeHtml(thumb)}" alt="" ${thumbAttrs} decoding="async" width="${iw}" height="${ih}" /></div>`
      : "";

    el.innerHTML = `
      <span class="project-idx mono">${idx}</span>
      ${thumbBlock}
      <div class="project-block">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-tagline">${escapeHtml(p.tagline)}</p>
      </div>
      <span class="project-year mono">${escapeHtml(p.year || "-")}</span>
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

  /* Artistic ink-brush cursor */
  const inkCanvas = document.querySelector(".cursor-ink");
  const nibWrap = document.querySelector(".cursor-nib-wrap");
  const cursorChip = document.querySelector(".cursor-chip");
  const hero = document.querySelector("[data-parallax]");
  const useCustomCursor =
    inkCanvas &&
    nibWrap &&
    !prefersReduced &&
    window.matchMedia("(hover: hover)").matches &&
    window.matchMedia("(pointer: fine)").matches;

  function lerp(a, b, n) {
    return (1 - n) * a + n * b;
  }

  if (useCustomCursor) {
    const ctx = inkCanvas.getContext("2d");
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const nib = { x: mouse.x, y: mouse.y, angle: -28 };
    const trail = [];
    const splats = [];
    const MAX_TRAIL = 56;
    let hoveringLink = false;
    let lastT = performance.now();

    function resizeInk() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      inkCanvas.width = Math.floor(window.innerWidth * dpr);
      inkCanvas.height = Math.floor(window.innerHeight * dpr);
      inkCanvas.style.width = `${window.innerWidth}px`;
      inkCanvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeInk();
    window.addEventListener("resize", resizeInk, { passive: true });

    window.addEventListener(
      "pointermove",
      (e) => {
        const now = performance.now();
        const dt = Math.max(8, now - lastT);
        lastT = now;
        const dx = e.clientX - mouse.x;
        const dy = e.clientY - mouse.y;
        const speed = Math.min(48, Math.hypot(dx, dy) * (16 / dt));
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        trail.push({
          x: mouse.x,
          y: mouse.y,
          w: 2.4 + speed * 0.55,
          life: 1,
          hue: 18 + speed * 1.8,
        });
        if (trail.length > MAX_TRAIL) trail.shift();

        if (Math.abs(dx) + Math.abs(dy) > 0.4) {
          const target = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
          let diff = target - nib.angle;
          while (diff > 180) diff -= 360;
          while (diff < -180) diff += 360;
          nib.angle += diff * 0.12;
        }

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
      (e) => {
        document.body.classList.add("is-pointer-down");
        for (let i = 0; i < 10; i++) {
          const a = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
          const v = 1.4 + Math.random() * 3.2;
          splats.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v,
            r: 1.5 + Math.random() * 3.5,
            life: 1,
          });
        }
      },
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
        const link = e.target.closest("a, button");
        if (link) {
          if (!hoveringLink) {
            hoveringLink = true;
            document.body.classList.add("is-hovering-link");
          }
          const href = link.getAttribute("href") || "";
          const label =
            link.classList.contains("contact-email") || href.startsWith("mailto:")
              ? "mail"
              : link.classList.contains("project-row")
                ? "yeet"
                : "go";
          if (cursorChip) cursorChip.setAttribute("data-text", label);
        } else if (hoveringLink) {
          hoveringLink = false;
          document.body.classList.remove("is-hovering-link");
          if (cursorChip) cursorChip.removeAttribute("data-text");
        }
      },
      true
    );

    (function paint() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      nib.x = lerp(nib.x, mouse.x, 0.28);
      nib.y = lerp(nib.y, mouse.y, 0.28);
      nibWrap.style.transform = `translate3d(${nib.x - 10}px, ${nib.y - 8}px, 0)`;
      nibWrap.style.setProperty("--nib-angle", `${nib.angle}deg`);

      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        a.life *= 0.955;
        const alpha = a.life * 0.85;
        if (alpha < 0.03) continue;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(a.x, a.y, mx, my);
        ctx.strokeStyle = `hsla(${a.hue}, 95%, 58%, ${alpha * 0.35})`;
        ctx.lineWidth = a.w * a.life * 2.4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(a.x, a.y, mx, my);
        ctx.strokeStyle = `hsla(${a.hue + 8}, 100%, 72%, ${alpha})`;
        ctx.lineWidth = a.w * a.life;
        ctx.stroke();
      }
      while (trail.length && trail[0].life < 0.04) trail.shift();

      for (let i = splats.length - 1; i >= 0; i--) {
        const s = splats[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.92;
        s.vy *= 0.92;
        s.life *= 0.9;
        ctx.beginPath();
        ctx.fillStyle = `hsla(18, 100%, 62%, ${s.life * 0.9})`;
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
        ctx.fill();
        if (s.life < 0.05) splats.splice(i, 1);
      }

      requestAnimationFrame(paint);
    })();
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
