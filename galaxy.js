/*
  Right-side spiral galaxy - cinematic 3D particle animation.
  Vanilla canvas 2D with perspective projection, no libraries.
  Thousands of additive-blended stardust particles (white, light blue,
  subtle orange) spiral inward along the arms toward a radiant core.
*/
(function () {
  const canvas = document.getElementById("galaxy-canvas");
  if (!canvas) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  if (connection && connection.saveData) return;

  const wide = window.matchMedia("(min-width: 900px)");
  const ctx = canvas.getContext("2d");

  /* --- tuning --- */
  const COUNT = 3400;
  const ARMS = 3;
  const TWIST = 5.4; // how far the arms curl between rim and core (radians)
  const CORE_R = 0.06; // respawn radius, as a fraction of the galaxy radius
  const TILT = (47 * Math.PI) / 180; // inclination toward the viewer
  const FOV = 2.6; // perspective strength, as a fraction of the radius
  const SPIN = 0.07; // whole-disc rotation, rad/s
  const DRIFT = 0.0125; // inward drift, fraction of the radius per second

  const PALETTE = [
    { r: 255, g: 255, b: 255 }, // white-hot
    { r: 168, g: 208, b: 255 }, // light blue
    { r: 255, g: 190, b: 128 }, // subtle orange
  ];

  function gauss() {
    return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  }

  /* Pre-rendered glow sprites, one per colour - far cheaper than a
     radial gradient per particle per frame. */
  const SPRITE = 64;
  const sprites = PALETTE.map((c) => {
    const s = document.createElement("canvas");
    s.width = s.height = SPRITE;
    const g = s.getContext("2d");
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, `rgba(${c.r},${c.g},${c.b},1)`);
    grad.addColorStop(0.22, `rgba(${c.r},${c.g},${c.b},0.5)`);
    grad.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, SPRITE, SPRITE);
    return s;
  });

  /* Radiant core: white centre bleeding into a warm halo. */
  const coreSprite = document.createElement("canvas");
  coreSprite.width = coreSprite.height = 512;
  {
    const g = coreSprite.getContext("2d");
    const grad = g.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.07, "rgba(255,246,228,0.95)");
    grad.addColorStop(0.16, "rgba(255,214,160,0.55)");
    grad.addColorStop(0.34, "rgba(255,178,110,0.2)");
    grad.addColorStop(0.62, "rgba(190,180,255,0.06)");
    grad.addColorStop(1, "rgba(120,140,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 512);
  }

  function makeParticle(initial) {
    const halo = Math.random() < 0.14;
    const p = {
      halo,
      arm: Math.floor(Math.random() * ARMS),
      /* Halo/bulge stars scatter all around; arm stars hug the arm centre. */
      scatter: halo ? Math.random() * Math.PI * 2 : gauss() * 0.34,
      h: gauss() * (halo ? 0.15 : 0.045),
      speed: 0.7 + Math.random() * 0.6,
      size: 0.5 + Math.random() * 1.6,
      tw: 1.5 + Math.random() * 4,
      ph: Math.random() * Math.PI * 2,
    };
    if (halo) {
      p.r = CORE_R + Math.pow(Math.random(), 2.2) * 0.5;
    } else if (initial) {
      /* Uniform in r matches the steady state of a constant inward drift. */
      p.r = CORE_R + Math.random() * (1 - CORE_R);
    } else {
      p.r = 0.86 + Math.random() * 0.14;
    }
    const roll = Math.random();
    p.c = halo ? (roll < 0.5 ? 2 : 0) : roll < 0.52 ? 0 : roll < 0.86 ? 1 : 2;
    if (Math.random() < 0.03) p.size += 1.5 + Math.random() * 1.5;
    return p;
  }

  const particles = [];
  for (let i = 0; i < COUNT; i++) particles.push(makeParticle(true));

  let W = 0;
  let H = 0;
  let RAD = 0;
  let cx = 0;
  let cy = 0;
  let focal = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    if (!W || !H) return;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    RAD = Math.min(W, H) * 0.44;
    cx = W * 0.56;
    cy = H * 0.44;
    focal = FOV * RAD;
  }

  const cosT = Math.cos(TILT);
  const sinT = Math.sin(TILT);
  const ARM_STEP = (Math.PI * 2) / ARMS;

  function paint(t) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    /* Core halo, squashed by the disc tilt, with a slow breathing pulse. */
    const pulse = 1 + 0.045 * Math.sin(t * 0.7);
    const coreW = RAD * 1.15 * pulse;
    const coreH = coreW * (0.55 + 0.45 * sinT);
    ctx.globalAlpha = 0.9;
    ctx.drawImage(coreSprite, cx - coreW / 2, cy - coreH / 2, coreW, coreH);
    const blaze = RAD * 0.34 * pulse;
    ctx.globalAlpha = 0.75;
    ctx.drawImage(coreSprite, cx - blaze / 2, cy - blaze / 2, blaze, blaze);

    const rot = t * SPIN;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      /* Angle follows the arm's spiral, so drifting inward (r shrinking)
         curls the particle along the arm toward the core. */
      const theta =
        p.arm * ARM_STEP + p.scatter + TWIST * (1 - p.r) + rot;
      const R = p.r * RAD;
      const x = Math.cos(theta) * R;
      const z = Math.sin(theta) * R;
      const y = p.h * RAD * (1.5 - p.r * 0.7);

      const y1 = y * cosT - z * sinT;
      const z1 = y * sinT + z * cosT;
      const s = focal / (focal + z1);
      const sx = cx + x * s;
      const sy = cy + y1 * s;

      const twinkle = 0.72 + 0.28 * Math.sin(t * p.tw + p.ph);
      /* Brighten toward the core; fade just before respawning so nothing pops. */
      const nearCore = Math.min(1, (p.r - CORE_R) / 0.05);
      const alpha =
        twinkle * nearCore * (0.28 + 0.72 * (1 - p.r)) * (0.6 + 0.4 * s);
      if (alpha > 0.02) {
        const d = p.size * 3 * s;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(sprites[p.c], sx - d, sy - d, d * 2, d * 2);
      }
    }

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function step(dt, t) {
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.r -= DRIFT * p.speed * dt;
      if (p.r <= CORE_R) particles[i] = makeParticle(false);
    }
    paint(t);
  }

  let rafId = 0;
  let lastT = 0;

  function loop(now) {
    const t = now / 1000;
    const dt = Math.min(0.05, t - lastT || 0.016);
    lastT = t;
    step(dt, t);
    rafId = requestAnimationFrame(loop);
  }

  function start() {
    if (rafId || document.hidden) return;
    resize();
    if (!W || !H) return;
    if (prefersReduced) {
      /* Still art, no motion: paint one frame and stop. */
      paint(12);
      return;
    }
    lastT = performance.now() / 1000;
    rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  window.addEventListener(
    "resize",
    () => {
      if (!wide.matches) return;
      resize();
      if (prefersReduced) paint(12);
    },
    { passive: true }
  );

  const onWideChange = () => {
    if (wide.matches) start();
    else stop();
  };
  if (wide.addEventListener) wide.addEventListener("change", onWideChange);
  else wide.addListener(onWideChange);

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) stop();
      else if (wide.matches) start();
    },
    { passive: true }
  );

  if (wide.matches) start();
})();
