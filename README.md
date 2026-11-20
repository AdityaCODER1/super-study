# Super Study — NEET Organic Chemistry & Multi-Subject Mastery Platform

A zero-build, static **GitHub Pages** study platform designed for customizable multi-subject mastery, launching with complete **NEET Organic Chemistry (NCERT Class 11 & 12)** coverage.

## Key Features

1. **Multi-View Reaction & Mechanism Explorer**
   - Browse every NCERT Class 11 & 12 organic reaction by **NCERT Chapter**, **Mechanism Family**, **Named Reactions**, or **Bookmarked Tricky Cards**.
   - Instant global search (`/`) across reaction titles, reagents (`PCC`, `DIBAL-H`, `O3`, `Lindlar`), and NCERT exceptions.
   - Built-in **Hide Product / Hide Reagent** active-recall masking directly on every card.

2. **Interactive Step-by-Step SVG Mechanism Player**
   - Animated curved-arrow electron flow (`2e⁻` full arrows & `1e⁻` radical fishhook arrows), intermediates, and `[TS]‡` transition states.
   - Dedicated **NEET Exam Callouts**: Rate Law / RDS, Stereochemistry, Carbocation Rearrangement Alerts, and NCERT Textbook Exceptions.
   - Inline **"Ask Gemini What-If Tutor"** powered by your `GEMINI_API_KEY`.

3. **4-Pillar Trends, Leaving Groups & Reagents Engine**
   - **Leaving Groups & Solvent Nucleophilicity**: Ranked leaving groups with conjugate acid $pK_a$ and an interactive **$S_N1 / S_N2 / E1 / E2$ Outcome Predictor**.
   - **Selective Reagent Master Matrix**: Chemoselectivity comparison across functional groups (`LiAlH4`, `NaBH4`, `DIBAL-H`, `B2H6`, `PCC`, `MnO2`, `KMnO4`, `O3`, `Clemmensen` vs `Wolff-Kishner`, etc.).
   - **GOC Electronic, Stability & Acidity/Basicity Orders**: Includes Ortho effect, SIR effect, and aqueous vs gas-phase amine basicity traps.
   - **Distinguishing Chemical Tests Lab**: Lucas, Victor Meyer, Iodoform, Tollens', Fehling's, Hinsberg's, Carbylamine, Neutral $\text{FeCl}_3$, 2,4-DNP, and Compound Pair comparisons.

4. **Functional Group Interconversion Finder (`X → Y`)**
   - Finds 1-step, 2-step, and 3-step NCERT synthesis pathways between functional groups, plus a Gemini Custom Molecule Synthesis Planner.

5. **Gemini AI Custom Question Lab (`GEMINI_API_KEY`) & Offline Bank**
   - Generate custom **Single-Choice NEET MCQs**, **Assertion–Reason**, **Statement I & II**, and **Multi-Step $\text{A} \rightarrow \text{B} \rightarrow \text{C}$ Roadmaps** tailored to your selected chapters or tricky reactions.
   - Includes a 42-question **Built-in Offline NEET Bank** that works without any API key.

6. **Multi-Subject, Quick Dark Mode & Standalone PWA (Home Screen App)**
   - Pre-configured subject switcher (Organic Chemistry, Inorganic Chemistry, Physical Chemistry, Biology, Physics) + create new custom subjects and cards manually or with Gemini, with full JSON Export/Import backup.
   - **Global Quick Dark Mode**: One-click **🌙 Dark / ☀ Light** toggle in the header (`D` keyboard shortcut on desktop) plus automatic OS dark/light detection on first visit.
   - **Installable Standalone Progressive Web App (PWA)**: Click **Install App** in the top navigation bar to install Super Study directly to your Android, iOS/iPadOS, or Desktop Home Screen / Dock. Launches in a dedicated full-screen window (`display: "standalone"`) without the browser address bar or tabs, backed by an offline-first Service Worker (`sw.js`).

7. **NEET 2027 NTA CBT Test Center (Full-Screen TCS iON Interface, PYQs, Abhyas & PDF Cropper)**
   - **Authentic NTA / TCS iON Test Portal**: Official General Instructions & Declaration screen, live countdown timer (`HH:MM:SS`), **Physics / Chemistry / Botany / Zoology** (or combined Biology) tabs, `Save & Next`, `Clear`, `Save & Mark for Review`, `Mark for Review & Next`, Question Paper preview, and the **5-state shaped Question Palette** (`Not Visited`, `Not Answered`, `Answered`, `Marked for Review`, and `Answered & Marked for Review` evaluated per NTA rules).
   - **Portal Dark Mode & Diagram Contrast**: One-click **🌙 Portal Dark Mode / ☀ Classic NTA Light** toggle directly inside the test portal (plus a bright diagram backing toggle for crisp circuit and chemical structure readability).
   - **Offline PYQs, Official 2024–2026 Exam Papers & NTA Abhyas Bank**: Includes **1,258+ chapter-tagged NEET PYQs (2016–2024)**, **560 official image-based exam questions (NEET 2024 Code T3, 2025 Code 45, 2026 Code 13)**, and a curated **NTA Abhyas & NCERT Trap Bank** across Physics, Chemistry, Botany, and Zoology.
   - **Custom Part / Full Test Builder**: Mix and match NCERT Class 11 & 12 chapters, blend PYQ + NTA Abhyas + PDF + **`gemini-3.1-flash-lite`** AI-generated questions, and set custom question counts and time limits.
   - **PDF Question & Diagram Cropper Studio**: Upload any PDF test paper, extract questions & diagram bounding boxes automatically via `pdf.js` + `gemini-3.1-flash-lite` Vision (or offline text extraction), and drag-to-crop diagrams or whole questions directly onto any test card.
   - **IndexedDB Crash Recovery & Post-Test Analytics**: Auto-saves active exam sessions every few seconds, stores test history & PDF images in `IndexedDB`, and provides subject-wise NTA scorecards, Solution Review with inline **"Ask Gemini Tutor"**, and **1-Click "Re-Test Mistakes"**.

## Live Website (GitHub Pages)

- **URL**: `https://adityacoder1.github.io/super-study/` (deployed from `main`, or via GitHub Actions `.github/workflows/deploy-pages.yml` when **Settings → Pages → Source** is set to **GitHub Actions** to inject the `GEMINI_API_KEY` secret runtime fallback).

## Configuring `GEMINI_API_KEY` Safely

- Click **Gemini API** in the top navigation bar.
- Paste your `GEMINI_API_KEY` from Google AI Studio and pick your Gemini model (`gemini-3.1-flash-lite` default for both Question Generation & Multimodal PDF Vision, `gemini-3.5-flash-lite`, `gemini-3.8-flash`, `gemini-3.1-pro-preview`, or a custom model ID).
- Your key is stored **only in your browser's `localStorage`** and never committed to GitHub.
- You can also run the manual **Expand NEET 2027 Question Bank** GitHub Action (`.github/workflows/expand-neet-bank.yml`) using your repository's `GEMINI_API_KEY` secret.