(function () {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const bgVideo = document.querySelector(".bg-video");
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const narrow =
    window.matchMedia && window.matchMedia("(max-width: 768px)").matches;

  if (bgVideo) {
    const bgSource = bgVideo.querySelector("source[data-src]");
    /* Phones get the clip too (muted + playsinline). Skip only for reduced motion / Save-Data. */
    const shouldLoadVideo = !prefersReduced && !saveData;

    if (!shouldLoadVideo) {
      bgVideo.pause();
      bgVideo.removeAttribute("autoplay");
    } else {
      const activateVideo = () => {
        if (document.documentElement.classList.contains("is-still")) return;
        if (bgSource && bgSource.dataset.src && !bgSource.src) {
          bgSource.src = bgSource.dataset.src;
          bgVideo.load();
        }
        bgVideo.play().catch(() => {});
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(activateVideo, { timeout: narrow ? 2800 : 2000 });
      } else {
        setTimeout(activateVideo, narrow ? 700 : 400);
      }

      document.addEventListener(
        "visibilitychange",
        () => {
          if (document.hidden || document.documentElement.classList.contains("is-still")) {
            bgVideo.pause();
          } else {
            bgVideo.play().catch(() => {});
          }
        },
        { passive: true }
      );
    }
  }

  /* Seasonal rail slug - falls back to localhost when no window matches */
  const railSlug = document.querySelector(".rail-slug");
  if (railSlug) {
    const day = new Date().toISOString().slice(0, 10);
    const windows = [
      { from: "2026-09-15", to: "2026-09-28", slug: "equinox-week" },
      { from: "2026-10-27", to: "2026-11-02", slug: "almost-halloween" },
      { from: "2026-12-22", to: "2026-12-31", slug: "year-end-build" },
      { from: "2027-01-01", to: "2027-01-07", slug: "new-year-localhost" },
    ];
    const hit = windows.find((w) => day >= w.from && day <= w.to);
    railSlug.textContent = hit ? hit.slug : "127.0.0.1";
  }

  /* Optional still / spin - freezes galaxy + background video */
  (function motionToggle() {
    if (prefersReduced) return;
    if (!document.getElementById("galaxy-canvas") && !bgVideo) return;
    let still = false;
    try {
      still = localStorage.getItem("site-motion") === "still";
    } catch (_) {}

    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "motion-toggle";
    btn.className = "motion-toggle mono";
    document.body.appendChild(btn);

    function apply() {
      document.documentElement.classList.toggle("is-still", still);
      btn.textContent = still ? "spin" : "still";
      btn.setAttribute(
        "aria-label",
        still ? "Resume galaxy and video motion" : "Pause galaxy and video motion"
      );
      try {
        localStorage.setItem("site-motion", still ? "still" : "spin");
      } catch (_) {}
      window.dispatchEvent(
        new CustomEvent("site-motion", { detail: { still } })
      );
      if (bgVideo && !saveData) {
        if (still) bgVideo.pause();
        else bgVideo.play().catch(() => {});
      }
    }

    btn.addEventListener("click", () => {
      still = !still;
      apply();
    });
    apply();
  })();

  /* Quiet hallway asides - shop-talk, not a joke dump */
  const QUIPS = [
    "Compiled on the first try. Suspicious.",
    "rustc: helpful. linker: has beef.",
    "localhost said yes. production is thinking about it.",
    "Ship the laptop, they said. Docker shrugged.",
    "Caching is hard. I forgot what I was saying.",
    "Off-by-one. The classic. The eternal.",
    "UDP would have skipped this line.",
    "docs/ agrees. runtime has notes.",
    "Please don't ask me to rewrite this in Go.",
    "I left a TODO in production once. We're still friends.",
    "rm -rf node_modules is a personality trait.",
    "The bug vanished after a restart. We don't talk about it.",
    "Idempotency keys, because the client will retry twice.",
    "p99 is where the real code lives.",
    "It's not a race condition if you only run it once.",
    "git blame says it was me. git blame is a liar.",
    "Two hard problems: cache invalidation, naming, and off-by-one.",
    "The migration is reversible. In theory.",
    "Works in staging. Staging is a lie we agreed on.",
    "sudo !! is a lifestyle.",
    "Cargo said 0 warnings. I don't trust it either.",
    "The regex worked. Nobody knows why. Nobody touches it.",
    "Unsafe block. Comment says 'trust me'. Author: me, 2am.",
    "Merged on Friday. Learned nothing.",
    "It's not tech debt if you never plan to pay it.",
    "Context window full. Same as my tabs.",
    "The model was confident. So was the segfault.",
    "Asked the LLM for tests. Got tests that pass. For a different function.",
    "Prompt said 'be concise'. Got 400 lines and a poem.",
    "Temperature 0. Still creative about the API that doesn't exist.",
    "RAG pulled the right doc. Wrong paragraph. Perfect confidence.",
    "Agent fixed the bug by deleting the test. Technically green.",
    "LyangLang has a browser toy. The real one still needs Rust.",
    "// not the real lyangpiler. open if you are nosy.",
    "Yes, the cursor is weird on purpose.",
    "The spiral is decorative. Mostly.",
    "If this status line is rotating, the page is alive.",
  ];

  const statusLine = document.getElementById("status-line");
  let quipIndex = Math.floor(Math.random() * QUIPS.length);

  function paintQuip() {
    const text = QUIPS[quipIndex % QUIPS.length];
    if (statusLine) statusLine.textContent = text;
    quipIndex += 1;
  }
  paintQuip();
  if (!prefersReduced) {
    setInterval(paintQuip, 9000);
  }

  /* /now page - CSP blocks inline scripts, so paint from here */
  (function paintNow() {
    const line = document.getElementById("now-line");
    if (!line) return;
    const data = window.SITE_NOW || {};
    line.textContent = data.text || "nothing written yet";
    const updated = document.getElementById("now-updated");
    if (updated && data.updated) updated.textContent = "updated " + data.updated;
  })();

  const grid = document.getElementById("project-grid");
  const projects = window.PORTFOLIO_PROJECTS || [];

  if (grid && projects.length === 0) {
    grid.innerHTML =
      "<p class=\"project-empty mono\">No projects listed. Add entries in <code>projects.js</code>.</p>";
  }

  function escapeHtml(s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  // projects.js is ours, but keep the sinks strict anyway: https links, local thumbs only
  const HTTPS = /^https:\/\/\S+$/;
  const THUMB = /^assets\/[\w-]+(\/[\w-]+)*\.\w+$/;
  const HEX = /^#[0-9a-f]{3,8}$/i;

  if (grid) {
    projects.forEach((p, i) => {
      const href = HTTPS.test(p.url || "") ? p.url : "";
      const thumb = THUMB.test(p.thumb || "") ? p.thumb : "";
      const built = (p.built || "").trim();
      const demo = (p.demo || "").trim();
      const el = document.createElement("article");
      el.className = "project-row";
      if (thumb) el.classList.add("has-thumb");
      if (demo) el.classList.add("has-demo");
      if (!href) el.classList.add("is-static");
      el.style.setProperty("--row-accent", HEX.test(p.accent || "") ? p.accent : "#b7c2cc");
      el.dataset.href = href;

      const idx = String(i + 1).padStart(2, "0");
      const tags = (p.tags || [])
        .map((t) => escapeHtml(t))
        .join('<span class="tag-sep" aria-hidden="true"> - </span>');

      /* First handful eager so fast scrolls don't wait on lazy decode */
      const thumbAttrs =
        i === 0
          ? 'loading="eager" fetchpriority="high" decoding="async"'
          : i < 6
            ? 'loading="eager" decoding="async"'
            : 'loading="lazy" decoding="async"';
      const iw = Number.isFinite(p.thumbImgWidth) ? p.thumbImgWidth : 400;
      const ih = Number.isFinite(p.thumbImgHeight) ? p.thumbImgHeight : 225;
      const thumbBlock = thumb
        ? `<div class="project-thumb"><img src="${escapeHtml(thumb)}" alt="" ${thumbAttrs} width="${iw}" height="${ih}" /></div>`
        : "";

      const titleHtml = href
        ? `<a class="project-title" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.title)}</a>`
        : `<h3 class="project-title">${escapeHtml(p.title)}</h3>`;

      const builtHtml = built
        ? `<details class="project-built">
        <summary class="mono">how it's built</summary>
        <p>${escapeHtml(built)}</p>
      </details>`
        : "";

      const demoHtml =
        demo === "lyang"
          ? `<details class="lyang-demo-shell" data-lyang-demo>
        <summary class="lyang-demo-sum mono">
          <span class="lyang-demo-comment">// not the real lyangpiler. open if you are nosy.</span>
        </summary>
        <div class="lyang-demo-panel">
          <p class="lyang-demo-hint mono">
            subset only: bol mug / oi mug / mug jod|ghata|guna|bhag
          </p>
          <label class="lyang-demo-label mono" for="lyang-src">scratch.nbh</label>
          <textarea
            id="lyang-src"
            class="lyang-demo-src mono"
            data-lyang-src
            rows="7"
            spellcheck="false"
            aria-label="LyangLang source"
          ></textarea>
          <p class="lyang-demo-actions mono">
            <button type="button" class="lyang-demo-cmd" data-lyang-run>$ run</button>
            <span class="lyang-demo-sep" aria-hidden="true">-</span>
            <button type="button" class="lyang-demo-cmd" data-lyang-reset>$ reset</button>
          </p>
          <pre class="lyang-demo-out mono" data-lyang-out aria-live="polite"></pre>
          <p class="lyang-demo-nudge" data-lyang-nudge hidden></p>
        </div>
      </details>`
          : "";

      el.innerHTML = `
      <span class="project-idx mono">${idx}</span>
      ${thumbBlock}
      <div class="project-block">
        ${titleHtml}
        <p class="project-tagline">${escapeHtml(p.tagline)}</p>
        ${builtHtml}
      </div>
      <span class="project-year mono">${escapeHtml(p.year || "-")}</span>
      <div class="project-tags">${tags}</div>
      ${demoHtml}
      ${
        href
          ? `<a class="row-glyph" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" aria-label="Open ${escapeHtml(p.title)}">↗</a>`
          : ""
      }
    `;

      grid.appendChild(el);
    });
  }

  /* Hero parallax follows the pointer */
  const hero = document.querySelector("[data-parallax]");
  if (hero && !prefersReduced) {
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

  /* Colour ribbon trailing the native cursor. Hue follows speed, width follows speed, fades fast. */
  const inkCanvas = document.querySelector(".cursor-ink");
  if (
    inkCanvas &&
    !prefersReduced &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  ) {
    const ctx = inkCanvas.getContext("2d");
    const trail = [];
    const MAX_TRAIL = 40;
    let last = { x: 0, y: 0, t: performance.now() };
    let hue = 200;
    let idle = true;

    function resizeInk() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      inkCanvas.width = Math.floor(window.innerWidth * dpr);
      inkCanvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resizeInk();
    window.addEventListener("resize", resizeInk, { passive: true });

    window.addEventListener(
      "pointermove",
      (e) => {
        const now = performance.now();
        const dt = Math.max(8, now - last.t);
        const speed = Math.min(40, Math.hypot(e.clientX - last.x, e.clientY - last.y) * (16 / dt));
        last = { x: e.clientX, y: e.clientY, t: now };
        hue = (hue + 0.6 + speed * 0.25) % 360; // slow drift, faster when you move faster
        trail.push({ x: e.clientX, y: e.clientY, w: 1.6 + speed * 0.45, hue, life: 1 });
        if (trail.length > MAX_TRAIL) trail.shift();
        if (idle) {
          idle = false;
          requestAnimationFrame(paintInk);
        }
      },
      { passive: true }
    );

    function paintInk() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        a.life *= 0.94;
        if (a.life < 0.03) continue;
        const mx = (a.x + b.x) / 2;
        const my = (a.y + b.y) / 2;
        // soft halo, then bright core
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(a.x, a.y, mx, my);
        ctx.strokeStyle = `hsla(${a.hue}, 95%, 60%, ${a.life * 0.28})`;
        ctx.lineWidth = a.w * a.life * 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(a.x, a.y, mx, my);
        ctx.strokeStyle = `hsla(${a.hue + 10}, 100%, 78%, ${a.life * 0.9})`;
        ctx.lineWidth = a.w * a.life;
        ctx.stroke();
      }
      while (trail.length && trail[0].life < 0.04) trail.shift();
      if (trail.length > 1) requestAnimationFrame(paintInk);
      else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        idle = true; // stop the loop until the pointer moves again
      }
    }
  }

  const magnetics = document.querySelectorAll(".magnetic");
  magnetics.forEach((el) => {
    el.addEventListener(
      "pointermove",
      (e) => {
        if (prefersReduced) return;
        el._lx = e.clientX;
        el._ly = e.clientY;
        if (el._rtPending) return;
        el._rtPending = true;
        requestAnimationFrame(() => {
          el._rtPending = false;
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

  const toReveal = document.querySelectorAll(".reveal");
  if (toReveal.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        });
      },
      { rootMargin: "12% 0px 18% 0px", threshold: 0 }
    );
    toReveal.forEach((el) => io.observe(el));
  }
  /* Footer clock: visitor's time vs mine */
  const ft = document.getElementById("footer-time");
  if (ft) {
    const clock = (tz) =>
      new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date());
    const tick = () => {
      const yours = clock();
      const mine = clock("America/New_York");
      ft.textContent =
        yours === mine ? `you ${yours} - same zone as me` : `you ${yours} - me ${mine}`;
    };
    tick();
    setInterval(tick, 30000);
  }

  /* Job-hunt toast - once per tab, after the hero has had its moment */
  (function hireToast() {
    const toast = document.getElementById("hire-toast");
    const close = document.getElementById("hire-toast-close");
    if (!toast || sessionStorage.getItem("hire-toast") === "seen") return;

    const hide = () => {
      toast.classList.remove("is-on");
      sessionStorage.setItem("hire-toast", "seen");
      window.setTimeout(() => (toast.hidden = true), 260);
    };

    window.setTimeout(() => {
      toast.hidden = false;
      requestAnimationFrame(() => toast.classList.add("is-on"));
    }, 7000);

    if (close) close.addEventListener("click", hide);
    toast.addEventListener("click", (e) => {
      if (e.target.closest(".hire-toast-mail")) hide();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !toast.hidden) hide();
    });
  })();

  /* TL;DR - message bubble anchored to nav control */
  (function tldr() {
    const wrap = document.querySelector(".tldr-wrap");
    const panel = document.getElementById("tldr-dialog");
    const openBtn = document.getElementById("tldr-open");
    const closeBtn = document.getElementById("tldr-close");
    if (!wrap || !panel || !openBtn) return;

    let open = false;
    let closeTimer = 0;

    const readout = panel.querySelector("[data-tldr-readout]");
    const LINES = [
      "whoami",
      "Konsept",
      "AI · backend · one compiler",
      "open to hire mail",
    ];
    let lineIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let typeTimer = 0;

    function stopReadout() {
      window.clearTimeout(typeTimer);
      if (readout) readout.textContent = "";
      lineIdx = 0;
      charIdx = 0;
      deleting = false;
    }

    function tickReadout() {
      if (!open || !readout || prefersReduced) return;
      const full = LINES[lineIdx];
      if (!deleting) {
        charIdx += 1;
        readout.textContent = full.slice(0, charIdx);
        if (charIdx >= full.length) {
          deleting = true;
          typeTimer = window.setTimeout(tickReadout, 1100);
          return;
        }
        typeTimer = window.setTimeout(tickReadout, 38 + Math.random() * 28);
      } else {
        charIdx -= 1;
        readout.textContent = full.slice(0, Math.max(0, charIdx));
        if (charIdx <= 0) {
          deleting = false;
          lineIdx = (lineIdx + 1) % LINES.length;
          typeTimer = window.setTimeout(tickReadout, 280);
          return;
        }
        typeTimer = window.setTimeout(tickReadout, 22);
      }
    }

    function startReadout() {
      stopReadout();
      if (!readout) return;
      if (prefersReduced) {
        readout.textContent = LINES[0];
        return;
      }
      typeTimer = window.setTimeout(tickReadout, 180);
    }

    function setOpen(next) {
      open = next;
      openBtn.setAttribute("aria-expanded", open ? "true" : "false");
      panel.setAttribute("aria-hidden", open ? "false" : "true");
      window.clearTimeout(closeTimer);

      if (open) {
        panel.hidden = false;
        requestAnimationFrame(() => {
          wrap.classList.add("is-open");
          startReadout();
        });
      } else {
        wrap.classList.remove("is-open");
        stopReadout();
        closeTimer = window.setTimeout(() => {
          if (!open) panel.hidden = true;
        }, 280);
      }
    }

    openBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setOpen(!open);
    });
    if (closeBtn) {
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        setOpen(false);
        openBtn.focus();
      });
    }
    document.addEventListener("click", (e) => {
      if (!open) return;
      if (!wrap.contains(e.target)) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        openBtn.focus();
      }
    });
  })();
})();
