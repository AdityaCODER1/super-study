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

6. **Multi-Subject, Quick Dark Mode & Phone-Ready Study Studio**
   - Pre-configured subject switcher (Organic Chemistry, Inorganic Chemistry, Physical Chemistry, Biology, Physics) + create new custom subjects and cards manually or with Gemini, with full JSON Export/Import backup.
   - **Global Quick Dark Mode**: One-click **🌙 Dark / ☀ Light** toggle in the header (`D` keyboard shortcut on desktop) plus automatic OS dark/light detection on first visit.
   - **Phone & Tablet Friendly**: Responsive single-column mobile cards, swipe-scrollable tabs, `16px` zoom-free inputs, and bookmarkable on iOS/Android Home Screen.

## Live Website (GitHub Pages)

- **URL**: `https://adityacoder1.github.io/super-study/` (deployed directly from the `main` branch via Repository **Settings → Pages**).

## Configuring `GEMINI_API_KEY` Safely

- Click **Gemini API** in the top navigation bar.
- Paste your `GEMINI_API_KEY` from Google AI Studio and pick your Gemini model (`gemini-2.5-flash` default, `gemini-2.5-pro`, `gemini-2.0-flash`, or a custom/experimental model ID).
- Your key is stored **only in your browser's `localStorage`** and never committed to GitHub.