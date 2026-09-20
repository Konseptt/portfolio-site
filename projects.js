window.PORTFOLIO_PROJECTS = [
  {
    title: "LyangLang",
    tagline:
      "Nepali-keyword language in Rust: tree-walking interpreter and bytecode VM. On crates.io as lyanglyang.",
    built:
      "Two backends on one AST so the interpreter and VM stay honest with each other.",
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
      "Search public trial registries from patient notes, rank matches, and estimate when eligibility may open.",
    built:
      "LLM parses the notes, a plain API does the registry search and ranking. The model never talks to the database.",
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
      "Photo in, species guess and care notes out. Identification and guides stream in-browser.",
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
      "Autonomous vehicle sim in Rust: pathfinding, obstacle avoidance, egui front end.",
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
      "Sudoku with a DLX solver, hint system, themes, and offline PWA support.",
    built:
      "DLX for instant solves; hints follow human techniques instead of dumping the full grid.",
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
      "Plain-English PubMed search with an evidence-ranked overview, then optional deeper synthesis.",
    built:
      "PubMed fetch, dedupe, and evidence ranking on the server; the model only writes the summary it is handed.",
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
      "Classic psychology paradigms as timed rooms with trial-level logging. Offline-first.",
    built:
      "Trial logs stay local until you opt into a database; museum kiosk and classroom both work.",
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
      "Deterministic passwords from a master secret and a site name via Argon2. No storage, no sync.",
    built:
      "Argon2 in the browser so the same seed+site always yields the same password, nothing written down.",
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
      "Interactive page-replacement visualizer: frames, faults, and algorithm comparison.",
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
      "Scheduling simulator with live Gantt charts and timing metrics for common OS algorithms.",
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
      "Syllabus PDF in, calendar .ics out. Dates stay in memory for the session.",
    built:
      "PDF parsed in memory and turned into .ics; no syllabus files kept on the server.",
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
      "Scan a terms URL, PDF, or paste and surface the riskiest clauses in plain English.",
    tags: ["AI", "LegalTech", "Parsing"],
    year: "2026",
    url: "https://tos.ranjansharma.info.np/",
    accent: "#b7c2cc",
    thumb: "assets/thumbs/prismclause.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Gap Sheet",
    tagline:
      "Compare a job posting to a resume (text or PDF) and list skill gaps plus wording fixes.",
    tags: ["AI", "Career", "PDF"],
    year: "2026",
    url: "https://resume.ranjansharma.info.np/",
    accent: "#a8b4c0",
    thumb: "assets/thumbs/gap-sheet.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
  {
    title: "Interview Forecaster",
    tagline:
      "From a job description: likely questions, answer frames, and red flags. Optional streaming.",
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
      "Look up professors, compare sections, and read ratings before you register.",
    tags: ["TypeScript", "Education", "Web"],
    year: "2026",
    url: "https://faculty.ranjansharma.info.np/",
    accent: "#b7c2cc",
    thumb: "assets/thumbs/faculty.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
];
