/*
  Chromatic spiral galaxy: desktop + phone.
  Mobile: fewer particles, DPR 1, ambient motion, scroll-safe
  (layer doesn't steal pan); optional poke control for bursts.
*/
(function () {
  const canvas = document.getElementById("galaxy-canvas");
  const layer = document.querySelector(".galaxy-layer");
  if (!canvas || !layer) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  if (connection && connection.saveData) return;

  const finePointer =
    window.matchMedia("(hover: hover)").matches &&
    window.matchMedia("(pointer: fine)").matches;
  const narrow = window.matchMedia("(max-width: 900px)");
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });

  const cores = navigator.hardwareConcurrency || 4;
  // "low" = phone, weak CPU, little RAM, or slow network. Fewer particles, lower DPR, slower idle.
  const low =
    narrow.matches ||
    !finePointer ||
    cores <= 4 ||
    (navigator.deviceMemory || 4) <= 4 ||
    (connection && /^(2g|slow-2g|3g)$/i.test(connection.effectiveType || ""));

  // Top count per tier; the frame-budget loop below trims it if paint runs long.
  const COUNT = low ? 1700 : cores >= 8 ? 4600 : 2800;
  const BUDGET_MS = low ? 7 : 6;
  const ARMS = 5;
  const TWIST_BASE = 6.2;
  const CORE_R = 0.05;
  const BASE_TILT = (50 * Math.PI) / 180;
  const FOV = 2.9;
  const SPIN = 0.052;
  const DRIFT = 0.011;
  const ARM_STEP = (Math.PI * 2) / ARMS;
  const IDLE_FPS = low ? 24 : 30;
  const STILL_T = 14; // arbitrary t that happens to give a nice frozen frame for reduced-motion

  /* Saturated rainbow arms - cyan, magenta, gold, lime, violet */
  const ARM_RGB = [
    [70, 235, 255],
    [255, 70, 175],
    [255, 195, 55],
    [110, 255, 130],
    [185, 115, 255],
  ];

  // Square offscreen canvas. Everything below is pre-rendered once and blitted.
  function offscreen(size) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    return c;
  }

  // Radial gradient filling a canvas; stops = [[offset, "rgba(...)"], ...]
  function radial(c, x, y, r, stops) {
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    for (const [o, color] of stops) grad.addColorStop(o, color);
    g.fillStyle = grad;
    g.fillRect(0, 0, c.width, c.height);
  }

  const rgba = (r, g, b, a) => `rgba(${r},${g},${b},${a})`;
  const lift = (c, n) => Math.min(255, c + n);

  // One soft dot per arm colour. "lift" brightens the core so dots read as lit, not flat.
  function makeSprite(r, g, b, boost) {
    const s = offscreen(56);
    const [R, G, B] = [lift(r, boost), lift(g, boost), lift(b, boost)];
    radial(s, 28, 28, 28, [
      [0, rgba(lift(R, 40), lift(G, 40), lift(B, 40), 1)],
      [0.22, rgba(R, G, B, 0.95)],
      [0.5, rgba(R, G, B, 0.4)],
      [0.78, rgba(R, G, B, 0.1)],
      [1, rgba(R, G, B, 0)],
    ]);
    return s;
  }

  const armSprites = ARM_RGB.map(([r, g, b]) => makeSprite(r, g, b, 0));
  const hotSprites = ARM_RGB.map(([r, g, b]) => makeSprite(r, g, b, 60));
  const whiteSprite = makeSprite(255, 248, 255, 0);
  // Dust is drawn as tiny fillRects (≈10x cheaper than a scaled drawImage), so it can be most of the field.
  const dustFill = ARM_RGB.map(([r, g, b]) => rgba(lift(r, 30), lift(g, 30), lift(b, 30), 1));

  const coreSprite = offscreen(320);
  radial(coreSprite, 160, 160, 160, [
    [0, "rgba(255,255,255,1)"],
    [0.08, "rgba(255,240,210,0.95)"],
    [0.18, "rgba(255,160,220,0.75)"],
    [0.32, "rgba(90,220,255,0.45)"],
    [0.48, "rgba(160,100,255,0.22)"],
    [0.68, "rgba(255,90,160,0.1)"],
    [1, "rgba(30,10,60,0)"],
  ]);

  // Nebula: one coloured blob per arm, offset around centre, plus a soft bloom to blend them.
  const nebula = offscreen(640);
  ARM_RGB.forEach(([r, g, b], a) => {
    const ang = a * ARM_STEP + 0.35;
    radial(nebula, 320 + Math.cos(ang) * 120, 320 + Math.sin(ang) * 95, 220, [
      [0, rgba(r, g, b, 0.38)],
      [0.4, rgba(r, g, b, 0.14)],
      [1, rgba(r, g, b, 0)],
    ]);
  });
  radial(nebula, 320, 320, 200, [
    [0, "rgba(255,200,240,0.18)"],
    [0.5, "rgba(100,180,255,0.08)"],
    [1, "rgba(0,0,0,0)"],
  ]);

  function gauss() {
    return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  }

  function makeParticle(initial) {
    const halo = Math.random() < 0.12;
    const dust = !halo && Math.random() < 0.5;
    const spark = !halo && !dust && Math.random() < 0.055;
    const p = {
      halo,
      dust,
      spark,
      arm: Math.floor(Math.random() * ARMS),
      scatter: halo
        ? Math.random() * Math.PI * 2
        : dust
          ? gauss() * 0.55
          : gauss() * 0.26,
      h: gauss() * (halo ? 0.18 : dust ? 0.025 : 0.05),
      speed: 0.65 + Math.random() * 0.7,
      size: spark
        ? 1.2 + Math.random() * 1.5
        : dust
          ? 0.35 + Math.random() * 0.7
          : 0.45 + Math.random() * 1.6,
      tw: 1.2 + Math.random() * 3.8,
      ph: Math.random() * Math.PI * 2,
    };
    if (halo) p.r = CORE_R + Math.pow(Math.random(), 2.1) * 0.5;
    else if (initial) p.r = CORE_R + Math.random() * (1 - CORE_R);
    else p.r = 0.88 + Math.random() * 0.12;
    return p;
  }

  const particles = Array.from({ length: COUNT }, () => makeParticle(true));
  // How many of `particles` get stepped + drawn this frame. Adaptive, see step().
  let active = COUNT;
  let paintEma = 0;

  let W = 0;
  let H = 0;
  let RAD = 0;
  let cx = 0;
  let cy = 0;
  let focal = 0;

  const ptr = {
    x: 0.5,
    y: 0.45,
    tx: 0.5,
    ty: 0.45,
    down: false,
    lastX: 0,
    spinBoost: 0,
    grav: 0,
    twistExtra: 0,
  };

  const bursts = [];
  const MAX_BURSTS = low ? 24 : 36;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, low ? 1 : 1.5);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    if (!W || !H) return;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    RAD = Math.min(W, H) * (narrow.matches ? 0.58 : 0.5);
    cx = W * (narrow.matches ? 0.62 : 0.52);
    cy = H * (narrow.matches ? 0.38 : 0.46);
    focal = FOV * RAD;
  }

  function spawnBurst(nx, ny) {
    const n = low ? 16 : 24;
    for (let i = 0; i < n && bursts.length < MAX_BURSTS; i++) {
      const ang = (i / n) * Math.PI * 2 + Math.random() * 0.15;
      bursts.push({
        x: nx,
        y: ny,
        vx: Math.cos(ang) * (0.4 + Math.random() * 0.8),
        vy: Math.sin(ang) * (0.4 + Math.random() * 0.8),
        life: 1,
        arm: i % ARMS,
        size: 1.1 + Math.random() * 1.8,
      });
    }
  }

  function paint(t) {
    // Pointer offset from centre drives parallax, tilt, and the gravity pull direction.
    const px = ptr.x - 0.5;
    const py = ptr.y - 0.5;
    const tilt = BASE_TILT + py * 0.28;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const ox = cx + px * RAD * 0.22;
    const oy = cy + py * RAD * 0.14;
    const twist = TWIST_BASE + ptr.twistExtra;
    const rot = t * (SPIN + ptr.spinBoost);
    const gx = px * RAD * 0.35;
    const gy = py * RAD * 0.24;
    const grav = ptr.grav;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    const nebR = RAD * 1.5;
    ctx.save();
    ctx.translate(ox, oy);
    ctx.rotate(t * 0.018);
    ctx.globalAlpha = narrow.matches ? 0.52 : 0.72;
    ctx.drawImage(nebula, -nebR / 2, -nebR / 2, nebR, nebR);
    ctx.restore();

    const pulse = 1 + 0.055 * Math.sin(t * 0.7);
    const coreW = RAD * 1.22 * pulse;
    const coreH = coreW * (0.48 + 0.4 * sinT);
    ctx.globalAlpha = 0.95;
    ctx.drawImage(coreSprite, ox - coreW / 2, oy - coreH / 2, coreW, coreH);

    for (let i = 0; i < active; i++) {
      const p = particles[i];
      const theta = p.arm * ARM_STEP + p.scatter + twist * (1 - p.r) + rot;
      const R = p.r * RAD;
      let x = Math.cos(theta) * R;
      let z = Math.sin(theta) * R;
      let y = p.h * RAD * (1.5 - p.r * 0.7);

      if (grav > 0.02) {
        const pull = grav * (0.1 + 0.25 * (1 - p.r));
        x += gx * pull;
        y += gy * pull * 0.7;
      }

      const y1 = y * cosT - z * sinT;
      const z1 = y * sinT + z * cosT;
      const s = focal / (focal + z1);
      const sx = ox + x * s;
      const sy = oy + y1 * s;

      const twinkle = 0.72 + 0.28 * Math.sin(t * p.tw + p.ph);
      const nearCore = Math.min(1, (p.r - CORE_R) / 0.04);
      const alpha =
        twinkle *
        nearCore *
        (p.dust ? 0.55 : 1) *
        (0.22 + 0.78 * (1 - p.r)) *
        (0.55 + 0.45 * s);
      if (alpha < 0.02) continue;
      ctx.globalAlpha = alpha > 1 ? 1 : alpha;

      if (p.dust) {
        const q = p.size * 2.2 * s;
        ctx.fillStyle = dustFill[p.arm];
        ctx.fillRect(sx - q / 2, sy - q / 2, q, q);
        continue;
      }

      const d = p.size * (p.spark ? 3.8 : 3.2) * s;
      const spr = p.halo
        ? whiteSprite
        : p.spark || p.r < 0.16
          ? hotSprites[p.arm]
          : armSprites[p.arm];
      ctx.drawImage(spr, sx - d, sy - d, d * 2, d * 2);
    }

    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.x += b.vx * 5.5;
      b.y += b.vy * 5.5;
      b.vx *= 0.95;
      b.vy *= 0.95;
      b.life -= 0.028;
      if (b.life <= 0) {
        bursts[i] = bursts[bursts.length - 1];
        bursts.pop();
        continue;
      }
      const d = b.size * (0.5 + b.life);
      ctx.globalAlpha = b.life * 0.85;
      ctx.drawImage(hotSprites[b.arm], ox + b.x - d, oy + b.y - d, d * 2, d * 2);
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function step(dt, t) {
    ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 5);
    ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 5);
    ptr.spinBoost *= Math.pow(0.12, dt);
    ptr.twistExtra *= Math.pow(0.25, dt);
    if (!ptr.down) ptr.grav += (0 - ptr.grav) * Math.min(1, dt * 1.8);

    /* Soft ambient drift on phone so it stays alive without a cursor */
    if (!finePointer && !ptr.down) {
      ptr.tx = 0.5 + Math.sin(t * 0.22) * 0.12;
      ptr.ty = 0.42 + Math.cos(t * 0.17) * 0.08;
      ptr.spinBoost = Math.max(ptr.spinBoost, 0.02);
    }

    const drift = DRIFT * dt * (1 + ptr.spinBoost * 2.5);
    for (let i = 0; i < active; i++) {
      const p = particles[i];
      p.r -= drift * p.speed;
      if (p.r <= CORE_R) particles[i] = makeParticle(false);
    }

    const t0 = performance.now();
    paint(t);
    // Frame budget: trim the live count when paint runs long, grow it back when there's headroom.
    const ms = performance.now() - t0;
    paintEma = paintEma ? paintEma * 0.9 + ms * 0.1 : ms;
    if (paintEma > BUDGET_MS && active > COUNT * 0.4) {
      active = Math.floor(active * 0.92);
    } else if (paintEma < BUDGET_MS * 0.6 && active < COUNT) {
      active = Math.min(COUNT, Math.floor(active * 1.03) + 8);
    }
  }

  let rafId = 0;
  let lastT = 0;
  let acc = 0;
  let frozen = false;
  const IDLE_STEP = 1 / IDLE_FPS;

  function loop(now) {
    const t = now / 1000;
    const dt = Math.min(0.05, t - lastT || 0.016);
    lastT = t;
    if (!frozen) {
      /* Desktop steps every frame while you drag/spin; otherwise idle at IDLE_FPS */
      const interacting =
        ptr.down || ptr.grav > 0.08 || Math.abs(ptr.spinBoost) > 0.02;
      if (interacting && finePointer) {
        step(dt, t);
      } else {
        acc += dt;
        if (acc >= IDLE_STEP) {
          step(acc, t);
          acc = 0;
        }
      }
    }
    rafId = requestAnimationFrame(loop);
  }

  function setFrozen(next) {
    frozen = Boolean(next);
    if (frozen) {
      ptr.down = false;
      ptr.grav = 0;
      ptr.spinBoost = 0;
      layer.classList.remove("is-grabbing", "is-live");
      paint(performance.now() / 1000);
    } else if (!prefersReduced && finePointer) {
      layer.classList.add("is-live");
    }
  }

  window.addEventListener("site-motion", (e) => {
    if (prefersReduced) return;
    setFrozen(Boolean(e.detail && e.detail.still));
  });

  function setPointerFromEvent(e) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    ptr.tx = (e.clientX - rect.left) / rect.width;
    ptr.ty = (e.clientY - rect.top) / rect.height;
  }

  function onPointerMove(e) {
    if (prefersReduced || frozen) return;
    if (!finePointer) return; /* phone uses ambient + poke */
    setPointerFromEvent(e);
    if (ptr.down) {
      const dx = e.clientX - ptr.lastX;
      ptr.lastX = e.clientX;
      ptr.spinBoost = Math.max(-0.55, Math.min(0.9, ptr.spinBoost + dx * 0.0035));
      ptr.grav = Math.min(1, ptr.grav + 0.08);
    } else {
      ptr.grav = Math.min(0.5, ptr.grav + 0.02);
    }
  }

  function onPointerDown(e) {
    if (prefersReduced || frozen || !finePointer) return;
    ptr.down = true;
    ptr.lastX = e.clientX;
    setPointerFromEvent(e);
    ptr.grav = 0.75;
    layer.classList.add("is-grabbing");
    const rect = canvas.getBoundingClientRect();
    spawnBurst(
      ((e.clientX - rect.left) / rect.width - 0.5) * RAD,
      ((e.clientY - rect.top) / rect.height - 0.5) * RAD * 0.85
    );
  }

  function onPointerUp() {
    ptr.down = false;
    layer.classList.remove("is-grabbing");
  }

  function onWheel(e) {
    if (prefersReduced || frozen || !finePointer) return;
    e.preventDefault();
    ptr.twistExtra = Math.max(
      -1.5,
      Math.min(2, ptr.twistExtra - e.deltaY * 0.002)
    );
    ptr.spinBoost = Math.max(
      -0.35,
      Math.min(0.55, ptr.spinBoost + (e.deltaY > 0 ? -0.03 : 0.04))
    );
  }

  function onScroll() {
    if (prefersReduced || frozen || finePointer) return;
    const y = window.scrollY || 0;
    ptr.twistExtra = Math.sin(y * 0.004) * 0.35;
    ptr.spinBoost = 0.04 + Math.min(0.12, y * 0.00008);
  }

  function poke() {
    if (prefersReduced || frozen) return;
    ptr.grav = 0.9;
    ptr.spinBoost = Math.min(0.8, ptr.spinBoost + 0.35);
    spawnBurst((Math.random() - 0.5) * RAD * 0.4, (Math.random() - 0.5) * RAD * 0.3);
  }

  function ensurePokeControl() {
    if (finePointer || prefersReduced) return;
    let btn = document.getElementById("galaxy-poke");
    if (btn) return;
    btn = document.createElement("button");
    btn.id = "galaxy-poke";
    btn.type = "button";
    btn.className = "galaxy-poke mono";
    btn.textContent = "poke spiral";
    btn.setAttribute("aria-label", "Poke the galaxy spiral");
    btn.addEventListener("click", poke);
    document.body.appendChild(btn);
  }

  function start() {
    if (rafId || document.hidden) return;
    resize();
    if (!W || !H) return;
    frozen = document.documentElement.classList.contains("is-still");
    layer.classList.toggle("is-live", finePointer && !prefersReduced && !frozen);
    layer.classList.toggle("is-phone", !finePointer);
    ensurePokeControl();
    if (prefersReduced) {
      paint(STILL_T);
      return;
    }
    lastT = performance.now() / 1000;
    if (frozen) paint(lastT);
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
    layer.classList.remove("is-live", "is-grabbing");
  }

  window.addEventListener(
    "resize",
    () => {
      resize();
      if (prefersReduced) paint(STILL_T);
    },
    { passive: true }
  );

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) stop();
      else start();
    },
    { passive: true }
  );

  window.addEventListener("scroll", onScroll, { passive: true });

  if (finePointer) {
    layer.addEventListener("pointermove", onPointerMove, { passive: true });
    layer.addEventListener("pointerdown", onPointerDown, { passive: true });
    layer.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });
  }

  /* Device tilt on phones that support it */
  if (
    !finePointer &&
    window.DeviceOrientationEvent &&
    typeof DeviceOrientationEvent.requestPermission !== "function"
  ) {
    window.addEventListener(
      "deviceorientation",
      (e) => {
        if (frozen) return;
        if (e.gamma == null || e.beta == null) return;
        ptr.tx = 0.5 + Math.max(-0.2, Math.min(0.2, e.gamma / 45));
        ptr.ty = 0.45 + Math.max(-0.15, Math.min(0.15, (e.beta - 45) / 60));
      },
      { passive: true }
    );
  }

  start();
})();
