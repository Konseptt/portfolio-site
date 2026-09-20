window.PORTFOLIO_PROJECTS = [
  {
    title: "LyangLang",
    tagline:
      "A toy programming language with Romanized Nepali keywords. Write `.nbh` files, run them with lyangpiler, and learn programming in words you already think in.",
    built:
      "Rust. One lexer and parser feed a shared AST; the default backend is a tree-walking interpreter, and `--vm` runs a bytecode VM that must produce the same results. CLI covers `run`, `check`, and `new`; install via curl script, crates.io (`lyanglyang`), or prebuilt binaries. Topics: compiler, interpreter, Nepali, education.",
    demo: "lyang",
    tags: ["Rust", "Compiler", "VM"],
    year: "2026",
    url: "https://crates.io/crates/lyanglyang",
    accent: "#b7c2cc",
    thumb: "assets/thumbs/lyanglang.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Clinical Trial Matcher",
    tagline:
      "Search international clinical trial registries from patient notes or clinician chart notes. Unlike most matchers, it also forecasts when you could become eligible, not only what fits today.",
    built:
      "TypeScript. Supports patient narrative input and clinician chart notes, ranked across multiple public registries. Eligibility Forecast is the unique path: washout windows and blockers from registry text against the patient's timeline, with projected dates. Production hardening and deterministic fallbacks for patient summary and eligibility panel. Live: clinicaltrial.ranjansharma.info.np.",
    tags: ["AI", "Backend", "TypeScript"],
    year: "2026",
    url: "https://clinicaltrial.ranjansharma.info.np/",
    accent: "#a8b4c0",
    thumb: "assets/thumbs/clinical-trial.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Plant Field Journal",
    tagline:
      "A retro botanical field journal: upload a plant photo, get species and botanical classification, then a care guide that streams in while you wait.",
    built:
      "JavaScript / Express. JPEG or PNG upload for identification (species, classification, common names), then AI-driven care guide streaming. Built as a hardened public app: identification and streaming care guides on plant.ranjansharma.info.np. Topics: plant identification, streaming, Express, retro design.",
    tags: ["AI", "Vision", "Streaming"],
    year: "2026",
    url: "https://plant.ranjansharma.info.np/",
    accent: "#b7c2cc",
    thumb: "assets/thumbs/plant.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Rust Car Sim",
    tagline:
      "A simple simulation of an AI-controlled car: pathfinding, decision-making, and obstacle avoidance in a small environment you can watch.",
    built:
      "Rust with an egui front end. Focus is basic autonomous-vehicle concepts: pathfinding, local decisions, and obstacle avoidance. Runs as a native sim and ships a GitHub Pages demo. Topics: autonomous vehicle, pathfinding, simulation, egui.",
    tags: ["Rust", "Simulation", "Pathfinding"],
    year: "2026",
    url: "https://konseptt.github.io/Rust-Autonomous-Vehicle-Simulation/",
    accent: "#a8b4c0",
    thumb: "assets/thumbs/rust-car.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "RetroSudoku",
    tagline:
      "Sudoku with retro computing aesthetics: multiple grid sizes and difficulties, a fast solver, human-style hints, and local high scores.",
    built:
      "TypeScript / React on Vite. Flexible grids (4x4 through 16x16), difficulties Easy through Evil, lightning-fast DLX solver, generator for unique puzzles, and a human-style hint system. Topics: DLX, solver, generator, puzzle-game. Live: sudoku.ranjansharma.info.np.",
    tags: ["React", "TypeScript", "Games"],
    year: "2025",
    url: "https://sudoku.ranjansharma.info.np/",
    accent: "#9eabb8",
    thumb: "assets/thumbs/retrosudoku.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Synapse Research",
    tagline:
      "Ask a health question in plain English. Synapse searches PubMed, returns an evidence-ranked overview in under a second, then optionally deepens with fuller AI synthesis or follow-up chat.",
    built:
      "TypeScript. Biomedical research intelligence: PubMed search, instant evidence overviews, then optional fuller summary and paper Q&A. Fast path is ranking and extractive overview; slower LLM synthesis is a separate tier. Live: synapse-research.vercel.app.",
    tags: ["AI", "Backend", "PubMed"],
    year: "2026",
    url: "https://synapse-research.vercel.app",
    accent: "#9eabb8",
    thumb: "assets/thumbs/synapse.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Lab Escape",
    tagline:
      "Landmark psychology paradigms (Stroop, Simons & Chabris, Asch, Milgram, and more) rebuilt as measurable escape rooms with trial-level logging. Personal gym, classroom lab, or museum kiosk.",
    built:
      "TypeScript. Offline-first play loop with no database required; add Postgres when you need accounts, cohort export, and admin tooling. Measured rooms with trial-level logging, not just a final score. MIT licensed. Live: lab-escape-beta.vercel.app.",
    tags: ["Backend", "Research", "TypeScript"],
    year: "2026",
    url: "https://lab-escape-beta.vercel.app",
    accent: "#b7c2cc",
    thumb: "assets/thumbs/lab-escape.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Hashpass",
    tagline:
      "A password calculator for daily use: enter a master password and a site name, get the same strong 16-character password every time for that pair.",
    built:
      "TypeScript web app. Deterministic derivation from master password + site name (Argon2 family); nothing stored, nothing synced. Companion Rust CLI (Hashpass-Rust) for terminal use with Argon2 and clipboard output. Topics: argon2, cryptography, deterministic passwords. Live: hashpass.ranjansharma.info.np.",
    tags: ["Argon2", "Security", "Web"],
    year: "2026",
    url: "https://hashpass.ranjansharma.info.np/",
    accent: "#a8b4c0",
    thumb: "assets/thumbs/hashpass.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Page Fault Simulator",
    tagline:
      "Visual interactive simulator for page replacement: watch frames fill, faults happen, and algorithms compete on the same reference string.",
    built:
      "TypeScript / Next.js. Interactive visualization of page replacement algorithms with step animation, comparative charts, and educational explanations. Topics: memory management, FIFO / LRU / Optimal / Clock-style strategies, operating systems. Live: page-fault-simulator.vercel.app.",
    tags: ["TypeScript", "OS", "Education"],
    year: "2026",
    url: "https://page-fault-simulator.vercel.app",
    accent: "#9eabb8",
    thumb: "assets/thumbs/page-fault.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "CPU Scheduler",
    tagline:
      "Add process inputs, pick a scheduling algorithm, and instantly see the Gantt chart plus waiting, turnaround, and related timing metrics.",
    built:
      "Vanilla JavaScript. Interactive CPU scheduling simulator for OS practice: visual Gantt charts and timing metrics from process inputs. Topics: algorithms, FCFS / SJF / Round Robin / Priority-style scheduling, education. Live: cpu.ranjansharma.info.np.",
    tags: ["JavaScript", "OS", "Education"],
    year: "2026",
    url: "https://cpu.ranjansharma.info.np/",
    accent: "#b7c2cc",
    thumb: "assets/thumbs/cpu-scheduler.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "SyllabusCal",
    tagline:
      "Turn a class syllabus PDF into a clean `.ics` calendar file you can import into Google Calendar, without typing every deadline by hand.",
    built:
      "JavaScript: React / Vite front end, Express backend. Client-side PDF extract, LLM-assisted event structuring (NVIDIA), RFC 5545 `.ics` export. Topics: calendar, PDF, syllabus, LLM. Live: syllabuscal.ranjansharma.info.np.",
    tags: ["Backend", "PDF", "Parsing"],
    year: "2026",
    url: "https://syllabuscal.ranjansharma.info.np/",
    accent: "#9eabb8",
    thumb: "assets/thumbs/syllabuscal.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "PrismClause",
    tagline:
      "Paste a Terms of Service or privacy policy URL, PDF, or text and get the five most concerning clauses with severity, plain-English explanation, and impact.",
    built:
      "Node / Express policy scanner (tos-red-flag-scanner). One input at a time: URL, PDF, or paste. Returns five red flags with quote, clause type, severity, and human explanation; topics: legal-tech, risk analysis, AI. Live: tos-red-flag-scanner.vercel.app.",
    tags: ["AI", "LegalTech", "Parsing"],
    year: "2026",
    url: "https://tos-red-flag-scanner.vercel.app",
    accent: "#b7c2cc",
    thumb: "assets/thumbs/prismclause.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Gap Sheet",
    tagline:
      "Compare a job posting to a résumé (pasted text or PDF) and get missing skills, keywords to strengthen, and prioritized fixes.",
    built:
      "Flask on Python, deployed to Vercel. Calls NVIDIA NIM (`meta/llama-4-maverick-17b-128e-instruct`) for structured JSON. Uploads processed in memory only; nothing written to disk for persistence. Topics: resume, job description, LLM, career. Live: gap-sheet.vercel.app.",
    tags: ["AI", "Career", "PDF"],
    year: "2026",
    url: "https://gap-sheet.vercel.app",
    accent: "#a8b4c0",
    thumb: "assets/thumbs/gap-sheet.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Interview Forecaster",
    tagline:
      "Paste a job description and get the 15 most likely interview questions, with answer frameworks and red flags to avoid. Free, no sign-up, streaming responses.",
    built:
      "Next.js + TypeScript + NVIDIA API. Retro-styled interview prep: standard and streaming generation modes, answer frameworks, red-flag callouts. Topics: interview-prep, LLM, streaming, career. Live: interview.ranjansharma.info.np.",
    tags: ["AI", "Streaming", "Next.js"],
    year: "2026",
    url: "https://interview.ranjansharma.info.np/",
    accent: "#9eabb8",
    thumb: "assets/thumbs/interview.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "The Faculty Ledger",
    tagline:
      "Independent desk for course research: look up professors, compare sections, and read Rate My Professors data before you register. Paste a syllabus to find the instructor.",
    built:
      "TypeScript. Search by name, paste syllabus text to extract the instructor, or run side-by-side comparison. Clean editorial layout over RMP data; not affiliated with Rate My Professors. Live: faculty.ranjansharma.info.np.",
    tags: ["TypeScript", "Education", "Web"],
    year: "2026",
    url: "https://faculty.ranjansharma.info.np/",
    accent: "#b7c2cc",
    thumb: "assets/thumbs/faculty.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
];
