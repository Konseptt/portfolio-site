// three-scene.js — floating "dev junk" hero scene
// Loaded as an ES module (see importmap in index.html). No build step.
// Graceful fallback: if WebGL is unavailable, reduced-motion is on, or
// save-data is requested, the canvas stays hidden and the CSS gradient shows.

import * as THREE from "three";

(function () {
  const canvas = document.getElementById("scene-canvas");
  if (!canvas) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);

  if (prefersReduced || saveData) return;

  // Bail if WebGL isn't available.
  try {
    const test = document.createElement("canvas");
    const ok =
      test.getContext("webgl2") ||
      test.getContext("webgl") ||
      test.getContext("experimental-webgl");
    if (!ok) return;
  } catch (_) {
    return;
  }

  const COLORS = {
    lime: 0xc9f73a,
    coral: 0xff5c47,
    cream: 0xf4f5f3,
    slate: 0x2b2f3a,
    deep: 0x14161c,
  };

  let renderer, scene, camera, group;
  let raf = 0;
  let running = true;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const junk = [];

  const DPR = Math.min(window.devicePixelRatio || 1, 1.6);

  function size() {
    return { w: window.innerWidth, h: window.innerHeight };
  }

  function init() {
    const { w, h } = size();

    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(DPR);
    renderer.setSize(w, h, false);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.set(0, 0, 14);

    group = new THREE.Group();
    scene.add(group);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    const key = new THREE.DirectionalLight(COLORS.lime, 1.5);
    key.position.set(6, 8, 8);
    scene.add(key);

    const fill = new THREE.DirectionalLight(COLORS.coral, 0.9);
    fill.position.set(-8, -4, 4);
    scene.add(fill);

    const rim = new THREE.PointLight(0xffffff, 0.6, 60);
    rim.position.set(0, 0, 16);
    scene.add(rim);

    buildJunk();

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility, {
      passive: true,
    });
    window.addEventListener("konami:party", party);

    canvas.classList.add("is-ready");
    animate();
  }

  // ---- Material helpers ----
  function mat(color, opts) {
    return new THREE.MeshStandardMaterial(
      Object.assign(
        { color, roughness: 0.45, metalness: 0.15 },
        opts || {}
      )
    );
  }

  // ---- Dev-junk factories (low-poly, cheap) ----

  function makeMug() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 0.62, 1.2, 24, 1, true),
      mat(COLORS.cream, { side: THREE.DoubleSide, roughness: 0.6 })
    );
    g.add(body);
    const bottom = new THREE.Mesh(
      new THREE.CircleGeometry(0.62, 24),
      mat(COLORS.cream, { roughness: 0.6 })
    );
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.y = -0.6;
    g.add(bottom);
    const coffee = new THREE.Mesh(
      new THREE.CircleGeometry(0.62, 24),
      mat(0x3a2418, { roughness: 0.2 })
    );
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = 0.42;
    g.add(coffee);
    const handle = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.1, 12, 24, Math.PI * 1.1),
      mat(COLORS.cream, { roughness: 0.6 })
    );
    handle.position.set(0.78, 0, 0);
    handle.rotation.z = Math.PI / 2;
    g.add(handle);
    return g;
  }

  function makeBug() {
    const g = new THREE.Group();
    const bodyMat = mat(COLORS.coral, { roughness: 0.35 });
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 16), bodyMat);
    body.scale.set(1, 0.8, 1.25);
    g.add(body);
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 16, 12),
      mat(0x222530, { roughness: 0.5 })
    );
    head.position.set(0, 0.1, 0.95);
    g.add(head);
    // eyes
    [-0.16, 0.16].forEach((x) => {
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 10, 8),
        mat(COLORS.lime, { emissive: COLORS.lime, emissiveIntensity: 0.5 })
      );
      eye.position.set(x, 0.2, 1.22);
      g.add(eye);
    });
    // legs
    const legMat = mat(0x222530);
    for (let i = 0; i < 3; i++) {
      [-1, 1].forEach((s) => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 1, 6),
          legMat
        );
        leg.position.set(s * 0.7, -0.1, -0.4 + i * 0.45);
        leg.rotation.z = (s * Math.PI) / 3;
        g.add(leg);
      });
    }
    return g;
  }

  function makeSemicolon() {
    const g = new THREE.Group();
    const m = mat(COLORS.lime, {
      emissive: COLORS.lime,
      emissiveIntensity: 0.25,
      roughness: 0.3,
    });
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), m);
    dot.position.y = 0.5;
    g.add(dot);
    const comma = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), m);
    comma.position.y = -0.4;
    g.add(comma);
    const tail = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.6, 12),
      m
    );
    tail.position.set(-0.12, -0.85, 0);
    tail.rotation.z = Math.PI / 5;
    g.add(tail);
    return g;
  }

  function makeBracket(open) {
    const g = new THREE.Group();
    const m = mat(COLORS.cream, { roughness: 0.4, metalness: 0.3 });
    const r = 0.12;
    const seg = (len, x, y, rot) => {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(r, len, r),
        m
      );
      bar.position.set(x, y, 0);
      if (rot) bar.rotation.z = rot;
      g.add(bar);
    };
    const dir = open ? 1 : -1;
    seg(1.6, 0, 0, 0);
    seg(0.5, dir * 0.22, 0.78, Math.PI / 4);
    seg(0.5, dir * 0.22, -0.78, -Math.PI / 4);
    return g;
  }

  function makeFloppy() {
    const g = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.3, 0.16),
      mat(COLORS.slate, { roughness: 0.6 })
    );
    g.add(body);
    const label = new THREE.Mesh(
      new THREE.BoxGeometry(0.95, 0.7, 0.02),
      mat(COLORS.cream, { roughness: 0.8 })
    );
    label.position.set(0, -0.22, 0.09);
    g.add(label);
    const shutter = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.5, 0.04),
      mat(0x9aa0ad, { metalness: 0.6, roughness: 0.3 })
    );
    shutter.position.set(0.05, 0.42, 0.09);
    g.add(shutter);
    return g;
  }

  function makeCaret() {
    const g = new THREE.Group();
    const m = mat(COLORS.coral, {
      emissive: COLORS.coral,
      emissiveIntensity: 0.25,
    });
    const a = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.95, 0.16), m);
    a.position.x = -0.32;
    a.rotation.z = -Math.PI / 5;
    g.add(a);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.95, 0.16), m);
    b.position.x = 0.32;
    b.rotation.z = Math.PI / 5;
    g.add(b);
    return g;
  }

  function buildJunk() {
    const factories = [
      makeMug,
      makeBug,
      makeSemicolon,
      () => makeBracket(true),
      () => makeBracket(false),
      makeFloppy,
      makeCaret,
      makeSemicolon,
      makeBug,
    ];

    // Spread the junk across a wide volume.
    const positions = [
      [-5.5, 2.6, 0],
      [5.2, 1.8, -2],
      [-3.2, -2.6, -1],
      [3.6, -2.2, 0.5],
      [6.2, -1.2, -3],
      [-6.4, -0.6, -2.5],
      [1.2, 3.0, -1.5],
      [-1.6, -3.2, 0],
      [4.4, 3.0, -3.5],
    ];

    const isMobile = window.innerWidth < 760;
    const count = isMobile ? 5 : factories.length;

    for (let i = 0; i < count; i++) {
      const obj = factories[i]();
      const [x, y, z] = positions[i];
      obj.position.set(x, y, z);
      const s = isMobile ? 0.7 : 0.92;
      obj.scale.setScalar(s);

      obj.userData = {
        baseX: x,
        baseY: y,
        baseZ: z,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.4,
          y: (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.3,
        },
        floatPhase: Math.random() * Math.PI * 2,
        floatAmp: 0.3 + Math.random() * 0.4,
        parallax: 0.4 + Math.random() * 0.8,
      };

      group.add(obj);
      junk.push(obj);
    }
  }

  // ---- Events ----
  function onResize() {
    if (!renderer) return;
    const { w, h } = size();
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function onPointer(e) {
    pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function onVisibility() {
    running = !document.hidden;
    if (running && !raf) animate();
  }

  let partyUntil = 0;
  function party() {
    partyUntil = performance.now() + 1600;
  }

  // ---- Animation loop ----
  const clock = new THREE.Clock();
  function animate() {
    if (!running) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Smooth the pointer.
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    const boost = performance.now() < partyUntil ? 4 : 1;

    junk.forEach((obj) => {
      const d = obj.userData;
      obj.rotation.x += d.rotSpeed.x * 0.01 * boost;
      obj.rotation.y += d.rotSpeed.y * 0.01 * boost;
      obj.rotation.z += d.rotSpeed.z * 0.01 * boost;

      // Float + gentle drift toward cursor.
      const floatY = Math.sin(t * 0.8 + d.floatPhase) * d.floatAmp;
      obj.position.x =
        d.baseX + pointer.x * d.parallax * 1.4;
      obj.position.y =
        d.baseY + floatY - pointer.y * d.parallax * 1.1;
    });

    // Whole group tilts subtly with the cursor.
    group.rotation.y += ((pointer.x * 0.25) - group.rotation.y) * 0.04;
    group.rotation.x += ((pointer.y * 0.18) - group.rotation.x) * 0.04;

    renderer.render(scene, camera);
  }

  // Defer init to idle so it doesn't block first paint.
  if ("requestIdleCallback" in window) {
    requestIdleCallback(init, { timeout: 1200 });
  } else {
    setTimeout(init, 200);
  }
})();
