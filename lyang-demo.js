/**
 * Tiny LyangLang subset for the portfolio demo.
 * Not the real lyangpiler - just enough to try bol mug / oi mug / arithmetic.
 */
(function () {
  const CRATE = "https://crates.io/crates/lyanglyang";
  const SAMPLE = [
    'oi mug naam = "Konsept"',
    'bol mug "Namaste, " + naam + "!"',
    "oi mug a = 6",
    "oi mug b = 7",
    "mug guna a, b lai prod",
    'bol mug "6 guna 7 = " + prod',
  ].join("\n");

  const root = document.querySelector("[data-lyang-demo]");
  if (!root) return;

  const editor = root.querySelector("[data-lyang-src]");
  const out = root.querySelector("[data-lyang-out]");
  const nudge = root.querySelector("[data-lyang-nudge]");
  const runBtn = root.querySelector("[data-lyang-run]");
  const resetBtn = root.querySelector("[data-lyang-reset]");
  if (!editor || !out || !runBtn) return;

  editor.value = SAMPLE;

  root.addEventListener("toggle", () => {
    if (root.open) editor.focus();
  });

  function stripComment(line) {
    const i = line.indexOf("//");
    return i >= 0 ? line.slice(0, i) : line;
  }

  function tokenizeExpr(src) {
    const tokens = [];
    let i = 0;
    while (i < src.length) {
      const c = src[i];
      if (/\s/.test(c)) {
        i += 1;
        continue;
      }
      if (c === '"') {
        let j = i + 1;
        let s = "";
        while (j < src.length && src[j] !== '"') {
          if (src[j] === "\\" && j + 1 < src.length) {
            s += src[j + 1];
            j += 2;
            continue;
          }
          s += src[j];
          j += 1;
        }
        if (src[j] !== '"') throw new Error("Unterminated string");
        tokens.push({ type: "str", value: s });
        i = j + 1;
        continue;
      }
      if (c === "+") {
        tokens.push({ type: "plus" });
        i += 1;
        continue;
      }
      if (/[0-9]/.test(c) || (c === "-" && /[0-9]/.test(src[i + 1] || ""))) {
        let j = i + (c === "-" ? 1 : 0);
        while (j < src.length && /[0-9.]/.test(src[j])) j += 1;
        const raw = src.slice(i, j);
        const n = Number(raw);
        if (!Number.isFinite(n)) throw new Error("Bad number: " + raw);
        tokens.push({ type: "num", value: n });
        i = j;
        continue;
      }
      if (/[A-Za-z_]/.test(c)) {
        let j = i + 1;
        while (j < src.length && /[A-Za-z0-9_]/.test(src[j])) j += 1;
        tokens.push({ type: "id", value: src.slice(i, j) });
        i = j;
        continue;
      }
      throw new Error("Unexpected character: " + c);
    }
    return tokens;
  }

  function evalExpr(src, env) {
    const tokens = tokenizeExpr(src.trim());
    if (!tokens.length) throw new Error("Empty expression");
    let value = null;
    let expectPlus = false;
    for (const tok of tokens) {
      if (expectPlus) {
        if (tok.type !== "plus") throw new Error("Expected + between parts");
        expectPlus = false;
        continue;
      }
      let part;
      if (tok.type === "str") part = tok.value;
      else if (tok.type === "num") part = tok.value;
      else if (tok.type === "id") {
        if (!(tok.value in env)) throw new Error("Unknown name: " + tok.value);
        part = env[tok.value];
      } else throw new Error("Bad expression");
      if (value === null) value = part;
      else value = String(value) + String(part);
      expectPlus = true;
    }
    if (!expectPlus) throw new Error("Trailing +");
    return value;
  }

  function run(source) {
    const env = Object.create(null);
    const lines = [];
    const rawLines = String(source || "").split(/\r?\n/);
    let printed = 0;

    for (let li = 0; li < rawLines.length; li++) {
      const lineNo = li + 1;
      const line = stripComment(rawLines[li]).trim();
      if (!line) continue;

      try {
        if (/^bol\s+mug\b/i.test(line)) {
          const expr = line.replace(/^bol\s+mug\b/i, "").trim();
          if (!expr) throw new Error("bol mug needs something to print");
          const v = evalExpr(expr, env);
          lines.push(String(v));
          printed += 1;
          continue;
        }

        if (/^oi\s+mug\b/i.test(line)) {
          const rest = line.replace(/^oi\s+mug\b/i, "").trim();
          if (/^bhan\b/i.test(rest)) {
            throw new Error(
              "oi mug bhan needs a real terminal. Try oi mug naam = \"Ram\" here."
            );
          }
          const m = rest.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$/);
          if (!m) throw new Error('Expected: oi mug name = value');
          env[m[1]] = evalExpr(m[2], env);
          continue;
        }

        const arith = line.match(
          /^mug\s+(jod|ghata|guna|bhag)\s+([A-Za-z_][A-Za-z0-9_]*)\s*,\s*([A-Za-z_][A-Za-z0-9_]*)\s+lai\s+([A-Za-z_][A-Za-z0-9_]*)$/i
        );
        if (arith) {
          const op = arith[1].toLowerCase();
          const aName = arith[2];
          const bName = arith[3];
          const dest = arith[4];
          if (!(aName in env) || !(bName in env)) {
            throw new Error("Both operands must be declared first");
          }
          const a = Number(env[aName]);
          const b = Number(env[bName]);
          if (!Number.isFinite(a) || !Number.isFinite(b)) {
            throw new Error("Arithmetic needs numbers");
          }
          let r;
          if (op === "jod") r = a + b;
          else if (op === "ghata") r = a - b;
          else if (op === "guna") r = a * b;
          else {
            if (b === 0) throw new Error("Division by zero");
            r = a / b;
          }
          if (!Number.isFinite(r)) throw new Error("Overflow");
          env[dest] = r;
          continue;
        }

        throw new Error(
          "This demo only knows bol mug, oi mug, and mug jod/ghata/guna/bhag"
        );
      } catch (err) {
        throw new Error("Line " + lineNo + ": " + (err.message || err));
      }
    }

    return { lines, printed };
  }

  function showNudge(ok) {
    if (!nudge) return;
    nudge.hidden = !ok;
    if (ok) {
      nudge.innerHTML =
        'That ran here. The real <code>lyangpiler</code> (interpreter + VM) is on ' +
        '<a href="' +
        CRATE +
        '" target="_blank" rel="noopener noreferrer">crates.io/crates/lyanglyang</a>. Same language, fewer jokes.';
    }
  }

  function paintResult(text, isError) {
    out.textContent = text;
    out.classList.toggle("is-error", Boolean(isError));
  }

  runBtn.addEventListener("click", () => {
    try {
      const result = run(editor.value);
      paintResult(result.lines.length ? result.lines.join("\n") : "(no output)", false);
      showNudge(result.printed > 0);
    } catch (err) {
      paintResult(String(err.message || err), true);
      showNudge(false);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      editor.value = SAMPLE;
      paintResult("", false);
      showNudge(false);
      editor.focus();
    });
  }
})();
