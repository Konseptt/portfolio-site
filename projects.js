window.PORTFOLIO_PROJECTS = [
  {
    title: "LyangLang",
    tagline:
      "A small programming language where the keywords are Romanized Nepali. Write `bol mug \"Namaste\"` and it prints. Made so friends back home could learn programming in words they already think in.",
    built:
      "Rust. One lexer and parser feed a shared AST; a tree-walking interpreter runs by default and a stack-based bytecode VM runs with --vm, both kept in lockstep by the same test corpus. Ships as the lyangpiler CLI with run / check / new, prebuilt binaries for five targets, and on crates.io as lyanglyang.",
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
      "Paste a patient's notes and it finds clinical trials they could join, ranks them, and says when they'd become eligible if they aren't yet. Built after watching how long that search takes by hand.",
    built:
      "Next.js + TypeScript. Patient narrative goes through an LLM (NVIDIA NIM) for structured extraction; clinician chart notes use rule-based extraction instead. Queries ClinicalTrials.gov, EU-CTR, WHO ICTRP and ISRCTN, scores on diagnosis, biomarker, stage, location and treatment history. The eligibility forecast parses washout windows from registry text against the patient's timeline and exports projected dates as .ics. Optional multi-agent review panel merges per-domain verdicts into a consensus.",
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
      "Take a photo of a plant, get its name and a care guide that types itself out while you wait. Styled like an old botanist's notebook because that's more fun than a dashboard.",
    built:
      "Express on Node with a vanilla HTML/CSS/JS front. Image goes to Pl@ntNet for identification, then a care guide streams from an NVIDIA chat model over SSE. Hardened for public use: magic-byte file validation, httpOnly CSRF token cookie, Helmet, per-route rate limits, and a response whitelist so nothing from upstream leaks through unfiltered.",
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
      "A little car that drives itself around a track full of obstacles. Watch it plan a path, hit something, and try again.",
    built:
      "Rust with an egui front end. Grid pathfinding plus local obstacle avoidance on a simple decision loop; the car re-plans when its sensor cone sees a blocker. Compiles to WASM for the GitHub Pages demo and runs natively with cargo run.",
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
      "Sudoku that looks like it runs on a 1989 computer. Five difficulty levels, hints that explain their reasoning like a patient friend would, and it works offline.",
    built:
      "React 18 + TypeScript on Vite. Solver is Knuth's Dancing Links (DLX) exact cover, around 12 ms for a 9x9; generator uses it to guarantee unique solutions across 4x4 to 16x16 grids. A separate human-technique solver (singles, pairs, pointing, etc.) powers the hint system so hints teach instead of reveal. IndexedDB persistence, Web Audio for sound, PWA for offline.",
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
      "Ask a medical question in plain English and get the research papers that answer it, ranked by how trustworthy the studies are, with a short summary. Fast enough to use mid-conversation.",
    built:
      "Next.js + TypeScript, PostgreSQL, optional Redis. Plain-English query is rewritten to PubMed syntax, hits NCBI E-utilities, then RER (Research Evidence Rank) scores each paper on study design, sample size, recency and rigor without a model call, under 1 ms per result set. ECS builds a cited overview from abstract lead sentences in ~5 ms. The slow LLM synthesis (NVIDIA Llama 3.1) is a separate tier, warmed in the background and cached. Repeat queries return in ~20 ms.",
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
      "The famous psychology experiments, Stroop, Asch, Milgram and more, rebuilt as short escape rooms that actually measure how you did. Works in a classroom, a museum kiosk, or alone on your laptop.",
    built:
      "Next.js + TypeScript. Ten rooms across five wings; every trial is seeded so a sequence is reproducible, and reaction time, accuracy and seed are logged per trial, not just a final score. Offline-first with guest mode in localStorage; Prisma + PostgreSQL only when you want accounts, cohorts and CSV/JSON export. NextAuth for credentials and OAuth. No paid APIs anywhere.",
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
      "Type your one master password and a website name, get the same strong 16-character password every time. Nothing is saved anywhere, so there's nothing to leak.",
    built:
      "TypeScript, runs fully client-side. Master secret + site name go through Argon2id via argon2-browser (WASM), output is normalized to a 16-char password with guaranteed character classes. No storage, no sync, no server; the same inputs on any machine produce the same result. A Rust CLI twin exists for the terminal.",
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
      "See how a computer decides which memory to throw out when it runs low. Step through it frame by frame and compare the classic strategies side by side.",
    built:
      "Next.js + TypeScript. Implements FIFO, LRU, Optimal (Belady) and Second Chance / Clock over a user-defined reference string and 1-10 frames. Each step is animated and the run is charted against the other algorithms so you can see where Belady's anomaly bites.",
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
      "Type in a few processes, pick how the CPU should schedule them, and watch the Gantt chart draw itself with all the timing numbers underneath.",
    built:
      "Vanilla JavaScript, no build step. FCFS, non-preemptive SJF, Round Robin with quantum, and Priority in both preemptive and non-preemptive forms. Computes waiting, turnaround and response time per process plus averages; idle gaps show up in the chart when nothing is ready. Theme persists in localStorage.",
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
      "Drop in a course syllabus PDF and get every deadline as a calendar file you can import into Google Calendar. No more typing dates by hand in week one.",
    built:
      "React 19 on Vite, Express 5 backend. PDF text is extracted in the browser with pdfjs-dist so only text leaves the client; the server sends it to NVIDIA NIM (Llama 4 Maverick) for structured event extraction and returns RFC 5545 .ics. Input is regex-screened for SSN/card patterns before any model call, rate limited, Helmet + CORS, and nothing is written to disk.",
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
      "Paste a link to any Terms of Service or privacy policy and get the five scariest clauses explained in normal English, with a score for how much legalese you'd have had to wade through.",
    built:
      "Node + Express. Accepts URL, PDF or pasted text, exactly one at a time. URL path validates and blocks private/loopback targets (SSRF guard), PDF is parsed in memory, text is capped. NVIDIA model returns five flags with quote, clause type, severity and impact; output is normalized and schema-validated before it reaches the UI. A readability score is computed from the extracted text. Broad and strict analysis modes.",
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
      "Put a job posting next to your resume and it tells you what's missing, which words to strengthen, and what to fix first.",
    built:
      "Flask on Python 3.12, deployed to Vercel. Resume arrives as text or PDF and is parsed in memory only. NVIDIA NIM (Llama 4 Maverick) returns structured JSON: missing skills, keywords to strengthen, prioritized fixes. CSRF-protected API, security headers including CSP, rate-limited routes, and a per-deployment derived secret so serverless instances agree on sessions.",
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
      "Paste a job description and get the fifteen questions they'll probably ask, with a way to frame each answer and the red flags that lose people the offer.",
    built:
      "Next.js + TypeScript. Job description goes to NVIDIA's API with a fixed output schema; standard and streaming generation modes, the latter over SSE so questions appear as they're produced. Request size and timeout guards on the upstream call, copy and export actions on the result. Free, no sign-up.",
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
      "Look up a professor before you register. See the rating, what students actually said, and compare up to three side by side. Paste a syllabus and it finds the instructor for you.",
    built:
      "Next.js App Router with React 19. Two API routes: professor-search wraps a Rate My Professors client and summarizes reviews into pros, cons and verbatim quotes; extract-professor pulls the instructor name out of pasted course text. Faculty photos fall back university page → Wikipedia → monogram. Favorites in localStorage, shareable ?name= & ?university= links. Not affiliated with RMP.",
    tags: ["TypeScript", "Education", "Web"],
    year: "2026",
    url: "https://faculty.ranjansharma.info.np/",
    accent: "#b7c2cc",
    thumb: "assets/thumbs/faculty.png",
    thumbImgWidth: 1200,
    thumbImgHeight: 750,
  },
];
