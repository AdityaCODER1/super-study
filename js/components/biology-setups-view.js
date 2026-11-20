/**
 * Pre-Configured Interactive Biology Understanding Setups
 * - 5 rich NCERT teaching labs: Respiration in Plants, Photosynthesis, Lac Operon & Polarity,
 *   Human Physiology (Cardiac/ECG, Nephron, Nerve/Sarcomere), and Cell Cycle (2n/4C).
 * - Animated compartment SVGs + Live Quantitative Ledgers + What-If Perturbation Toggles
 * - Interactive Respiration ATP & RQ Calculator + Guided Socratic "Teach-Me" Checkpoints
 */

import { PRECONFIGURED_SETUPS, NCERT_CHAPTER_MODULES } from '../data/biology-ncert-data.js';
import { askBiologyNcertDoubt } from '../services/gemini.js';
import { renderMarkdown, renderInlineMarkdown, escapeHtml } from '../services/markdown.js';

let setupAutoPlayTimer = null;

export function stopBiologySetupAutoPlay() {
  if (setupAutoPlayTimer) {
    clearInterval(setupAutoPlayTimer);
    setupAutoPlayTimer = null;
  }
}

function truncateSvg(str, max) {
  const s = String(str ?? '');
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

function buildSetupStageSvg(setup, subMod, step, stepIdx, totalSteps, activePerturbation) {
  const isBlocked =
    activePerturbation &&
    ['anaerobic', 'cyanide', 'dcmu', 'super-repressor', 'adh-absent', 'colchicine'].includes(activePerturbation.id) &&
    activePerturbation.id !== 'normal';
  const isLeak = activePerturbation && activePerturbation.id === 'uncoupler';

  const arrowColor = isBlocked ? 'var(--chem-danger)' : isLeak ? 'var(--chem-warn)' : 'var(--chem-lg)';
  const centerLabel = isBlocked
    ? `⛔ ${truncateSvg(activePerturbation.badge, 22)}`
    : isLeak
      ? '⚠ Proton Leak (Heat)'
      : truncateSvg(step.centerAction, 26);

  return `
    <svg class="mech-svg-canvas bio-setup-svg" viewBox="0 0 700 280" role="img" aria-label="${escapeHtml(step.stepTitle)}">
      <defs>
        <marker id="bio-arrow" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 1 1 L 11 6 L 1 11 z" fill="${arrowColor}" />
        </marker>
      </defs>

      <!-- Compartment Boundary Frame -->
      <rect x="10" y="10" width="680" height="260" rx="14" fill="var(--bg-code)" stroke="var(--border-subtle)" stroke-width="1.5" stroke-dasharray="6 4" />

      <!-- Compartment Badge -->
      <rect x="22" y="20" width="320" height="26" rx="13" fill="var(--accent-primary-soft)" />
      <text x="34" y="37" font-family="var(--font-sans)" font-size="11.5" font-weight="700" fill="var(--accent-primary)">
        COMPARTMENT: ${escapeHtml(truncateSvg(subMod.compartment, 38))}
      </text>

      <!-- Step & Carbon/Track Pill -->
      <rect x="528" y="20" width="150" height="26" rx="13" fill="var(--chem-lg-soft)" />
      <text x="603" y="37" text-anchor="middle" font-family="var(--font-mono)" font-size="11" font-weight="700" fill="var(--chem-lg)">
        STEP ${stepIdx + 1}/${totalSteps}
      </text>

      <!-- Curved Process Flow Arc -->
      <path
        d="M 215 95 Q 350 42 485 95"
        fill="none"
        stroke="${arrowColor}"
        stroke-width="2.6"
        stroke-dasharray="${isBlocked || isLeak ? '6 4' : 'none'}"
        marker-end="url(#bio-arrow)"
        class="curved-arrow-path"
      />

      <!-- Process / Carbon Track Tag -->
      <rect x="235" y="48" width="230" height="22" rx="6" fill="var(--bg-surface)" stroke="var(--border-subtle)" />
      <text x="350" y="63" text-anchor="middle" font-family="var(--font-mono)" font-size="10.8" font-weight="700" fill="${arrowColor}">
        ${escapeHtml(truncateSvg(step.carbonTrack || setup.title, 32))}
      </text>

      <!-- Left Input Node -->
      <g transform="translate(24, 102)">
        <rect width="225" height="96" rx="12" fill="var(--bg-surface)" stroke="var(--chem-nuc)" stroke-width="1.8" />
        <text x="112" y="24" text-anchor="middle" font-family="var(--font-sans)" font-size="10.5" font-weight="700" fill="var(--chem-nuc)">
          INPUT / INITIAL STATE
        </text>
        <text x="112" y="53" text-anchor="middle" font-family="var(--font-mono)" font-size="12.5" font-weight="700" fill="var(--text-primary)">
          ${escapeHtml(truncateSvg(step.leftNode, 27))}
        </text>
        <text x="112" y="76" text-anchor="middle" font-family="var(--font-sans)" font-size="10.5" fill="var(--text-muted)">
          ${escapeHtml(truncateSvg(step.leftSub || '', 34))}
        </text>
      </g>

      <!-- Center Transformation Arrow -->
      <g transform="translate(262, 120)">
        <line x1="8" y1="30" x2="164" y2="30" stroke="${arrowColor}" stroke-width="2.4" stroke-dasharray="${isBlocked ? '5 4' : 'none'}" />
        <polygon points="162,24 174,30 162,36" fill="${arrowColor}" />
        <text x="88" y="20" text-anchor="middle" font-family="var(--font-mono)" font-size="10.8" font-weight="700" fill="${arrowColor}">
          ${escapeHtml(centerLabel)}
        </text>
      </g>

      <!-- Right Output Node -->
      <g transform="translate(451, 102)">
        <rect width="225" height="96" rx="12" fill="var(--bg-surface)" stroke="${isBlocked ? 'var(--chem-danger)' : 'var(--chem-lg)'}" stroke-width="1.8" />
        <text x="112" y="24" text-anchor="middle" font-family="var(--font-sans)" font-size="10.5" font-weight="700" fill="${isBlocked ? 'var(--chem-danger)' : 'var(--chem-lg)'}">
          ${isBlocked ? 'PERTURBED OUTCOME' : 'RESULT / OUTPUT STATE'}
        </text>
        <text x="112" y="53" text-anchor="middle" font-family="var(--font-mono)" font-size="12.5" font-weight="700" fill="var(--text-primary)">
          ${escapeHtml(truncateSvg(step.rightNode, 27))}
        </text>
        <text x="112" y="76" text-anchor="middle" font-family="var(--font-sans)" font-size="10.5" fill="var(--text-muted)">
          ${escapeHtml(truncateSvg(step.rightSub || '', 34))}
        </text>
      </g>

      <!-- Bottom NCERT Highlight Banner -->
      <g transform="translate(24, 214)">
        <rect width="652" height="40" rx="8" fill="${isBlocked ? 'var(--chem-danger-soft)' : isLeak ? 'var(--chem-warn-soft)' : 'var(--chem-lg-soft)'}" stroke="${isBlocked ? 'var(--chem-danger)' : isLeak ? 'var(--chem-warn)' : 'var(--chem-lg)'}" stroke-opacity="0.35" />
        <text x="326" y="25" text-anchor="middle" font-family="var(--font-sans)" font-size="11.6" font-weight="700" fill="${isBlocked ? 'var(--chem-danger)' : isLeak ? 'var(--chem-warn)' : 'var(--chem-lg)'}">
          ${escapeHtml(truncateSvg(isBlocked || isLeak ? activePerturbation.effectTitle : step.highlightBanner, 84))}
        </text>
      </g>
    </svg>
  `;
}

function computeRespirationCalc({ substrate, count, condition, shuttle }) {
  const n = Math.max(1, Math.min(20, Number(count) || 1));
  if (substrate === 'tripalmitin') {
    const o2 = 72.5 * n;
    const co2 = 51 * n;
    return {
      label: `${n} × Tripalmitin (Fat)`,
      directAtp: 'Uses 2 ATP activation',
      nadh: 'Beta-oxidation + Krebs',
      fadh2: 'High FADH2 yield',
      netAtp: `~${Math.round(400 * n)} ATP (very high)`,
      co2: `${co2}`,
      o2: `${o2}`,
      rq: '0.70 (102/145)',
      hPlus: 'Massive H+ gradient'
    };
  }

  if (condition === 'anaerobic') {
    if (substrate === 'pyruvate' || substrate === 'acetyl') {
      return {
        label: `${n} × ${substrate === 'pyruvate' ? 'Pyruvate' : 'Acetyl-CoA'} (No O2)`,
        directAtp: 0,
        nadh: 0,
        fadh2: 0,
        netAtp: 0,
        co2: substrate === 'pyruvate' ? `${n} (Yeast) / 0 (Muscle)` : 'Blocked',
        o2: 0,
        rq: '∞ (Anaerobic)',
        hPlus: '0 (ETS Halted)'
      };
    }
    const hexoses = substrate === 'sucrose' ? 2 * n : n;
    return {
      label: `${n} × ${substrate === 'sucrose' ? 'Sucrose' : 'Glucose'} (Fermentation)`,
      directAtp: 2 * hexoses,
      nadh: '0 net (2 NADH re-oxidised to NAD+)',
      fadh2: 0,
      netAtp: 2 * hexoses,
      co2: `${2 * hexoses} (Yeast) / 0 (Lactic Acid)`,
      o2: 0,
      rq: '∞ (CO2 / 0 O2)',
      hPlus: '0 (Mitochondria bypassed)'
    };
  }

  // Aerobic
  const nadhFactor = shuttle === 'glycerol' ? 2 : 3; // cytosolic NADH yields 2 ATP via glycerol-3-P shuttle or 3 ATP via malate-aspartate (NCERT 38 ATP)
  let directAtp = 0;
  let cytoNadh = 0;
  let mitoNadh = 0;
  let fadh2 = 0;
  let co2 = 0;
  let o2 = 0;

  if (substrate === 'glucose' || substrate === 'sucrose') {
    const hex = substrate === 'sucrose' ? 2 * n : n;
    directAtp = 4 * hex;
    cytoNadh = 2 * hex;
    mitoNadh = 8 * hex; // 2 Link + 6 Krebs
    fadh2 = 2 * hex;
    co2 = 6 * hex;
    o2 = 6 * hex;
  } else if (substrate === 'pyruvate') {
    directAtp = 1 * n;
    mitoNadh = 4 * n; // 1 Link + 3 Krebs
    fadh2 = 1 * n;
    co2 = 3 * n;
    o2 = 2.5 * n;
  } else if (substrate === 'acetyl') {
    directAtp = 1 * n;
    mitoNadh = 3 * n;
    fadh2 = 1 * n;
    co2 = 2 * n;
    o2 = 2 * n;
  }

  const oxidativeAtp = cytoNadh * nadhFactor + mitoNadh * 3 + fadh2 * 2;
  const netAtp = directAtp + oxidativeAtp;
  const hPlus = oxidativeAtp * 4;
  const rqVal = o2 > 0 ? (co2 / o2).toFixed(2) : '—';

  return {
    label: `${n} × ${substrate.toUpperCase()} (Aerobic)`,
    directAtp,
    nadh: cytoNadh + mitoNadh,
    fadh2,
    oxidativeAtp,
    netAtp,
    co2,
    o2,
    rq: rqVal,
    hPlus: `${hPlus} H+ via F0 (4 H+/ATP)`
  };
}

function formatLedgerEntries(ledger, activePerturbation) {
  const merged = { ...(ledger || {}), ...(activePerturbation?.overrideLedger || {}) };
  const labelMap = {
    carbon: 'Remaining Carbons',
    atpDirect: 'Direct ATP / GTP',
    nadh: 'NADH + H⁺',
    fadh2: 'FADH₂',
    co2: 'CO₂ Released',
    hPlusPumped: 'H⁺ Gradient',
    oxidativeAtp: 'Oxidative ATP',
    netAtp: 'Total Net ATP',
    rq: 'RQ Ratio',
    psActive: 'Active Photosystem',
    atp: 'ATP Output',
    nadph: 'NADPH Output',
    o2: 'O₂ Status',
    lumenPh: 'Thylakoid Lumen',
    repressorState: 'Repressor State',
    rnaPol: 'RNA Polymerase',
    operon: 'Operon Status',
    enzymes: 'Structural Enzymes',
    duration: 'Phase / Metric',
    valves: 'Valves / Permeability',
    ecgWave: 'ECG / Transport',
    sound: 'Heart Sound / Band',
    output: 'Physiological Output',
    chromosomes: 'Chromosome Count',
    dnaContent: 'DNA Content (C)',
    chromatidsPerChr: 'Chromatids / Chr',
    centromereSplit: 'Centromere Split?',
    stagePloidy: 'Cell Ploidy'
  };
  return Object.entries(merged).map(([k, v]) => ({
    key: labelMap[k] || k,
    val: v
  }));
}

export function renderBiologySetupsView(
  container,
  {
    initialSetupId = 'setup-respiration',
    initialStageId = '',
    bioSetupProgress = {},
    onCompleteCheckpoint,
    onJumpToReader,
    onAskDoubtOnSetup,
    onToast
  }
) {
  let activeSetupId = initialSetupId || 'setup-respiration';
  let activeSubId = initialStageId || '';
  let currentStepIdx = 0;
  let activePerturbationId = 'normal';
  let socraticRevealed = false;
  let tutorInput = '';
  let tutorReply = '';
  let tutorLoading = false;

  // Respiration Calculator local state
  let calcSubstrate = 'glucose';
  let calcCount = 1;
  let calcCondition = 'aerobic';
  let calcShuttle = 'malate';

  function getActiveSetup() {
    return PRECONFIGURED_SETUPS.find((s) => s.id === activeSetupId) || PRECONFIGURED_SETUPS[0];
  }

  function getActiveSubModule(setup) {
    const found = setup.subModules.find((m) => m.id === activeSubId);
    if (found) return found;
    activeSubId = setup.subModules[0].id;
    return setup.subModules[0];
  }

  function render() {
    const setup = getActiveSetup();
    const subMod = getActiveSubModule(setup);
    if (currentStepIdx >= subMod.steps.length) currentStepIdx = 0;
    const step = subMod.steps[currentStepIdx];
    const activePerturbation =
      (setup.perturbations || []).find((p) => p.id === activePerturbationId) ||
      setup.perturbations?.[0] ||
      null;

    const ledgerItems = formatLedgerEntries(step.ledger, activePerturbation);
    const completedSet = new Set(bioSetupProgress[setup.id]?.completedCheckpoints || []);
    const checkpointKey = `${subMod.id}-step-${currentStepIdx}`;
    const isCheckpointDone = completedSet.has(checkpointKey);

    const linkedLines = (NCERT_CHAPTER_MODULES[setup.chapterId] || []).filter(
      (l) => !l.linkedSetupStage || l.linkedSetupStage === subMod.id
    );

    const calcResult = setup.hasRespirationCalculator
      ? computeRespirationCalc({
          substrate: calcSubstrate,
          count: calcCount,
          condition: calcCondition,
          shuttle: calcShuttle
        })
      : null;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>Pre-Configured Biology Understanding Labs</h1>
          <p class="section-subtitle">
            Interactive NCERT concept simulators with compartment visuals, live Carbon/ATP/Ploidy ledgers, What-If perturbations, and guided Socratic checks.
          </p>
        </div>
        <div class="stats-strip">
          <span class="pill-badge accent">5 Concept Labs Ready</span>
          <span class="pill-badge lg">Checkpoints Mastered: ${completedSet.size}</span>
        </div>
      </div>

      <!-- Setup Switcher Cards -->
      <div class="bio-setup-switcher-grid">
        ${PRECONFIGURED_SETUPS.map(
          (s) => `
          <button type="button" class="bio-setup-pill-card ${s.id === setup.id ? 'active' : ''}" data-select-setup="${escapeHtml(s.id)}">
            <span class="bio-setup-pill-eyebrow">${escapeHtml(s.eyebrow)}</span>
            <strong>${escapeHtml(s.title)}</strong>
          </button>`
        ).join('')}
      </div>

      <!-- Active Setup Workbench -->
      <div class="card bio-setup-workbench">
        <div class="bio-setup-header">
          <div>
            <span class="pill-badge accent">${escapeHtml(setup.eyebrow)}</span>
            <h2 style="margin:6px 0 4px;">${escapeHtml(setup.title)}</h2>
            <p class="muted-note" style="margin:0;">${escapeHtml(setup.description)}</p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="btn-outline btn-sm" id="bio-setup-to-reader-btn">📖 Read Chapter NCERT Lines</button>
            <button type="button" class="btn-primary btn-sm" id="bio-setup-open-doubt-btn">💬 Send Stage to Doubt Hub</button>
          </div>
        </div>

        <!-- Sub-module tabs (e.g., Glycolysis | Link & Krebs | ETS | Amphibolic & RQ) -->
        <div class="explorer-toolbar" style="margin:14px 0 12px;">
          <div class="mode-tabs" role="tablist">
            ${setup.subModules
              .map(
                (m) => `
                <button type="button" class="mode-tab-btn ${m.id === subMod.id ? 'active' : ''}" data-select-sub="${escapeHtml(m.id)}">
                  ${escapeHtml(m.label)}
                </button>`
              )
              .join('')}
          </div>
        </div>

        <div class="bio-setup-grid">
          <!-- Left: Interactive SVG Stage + Step Controls + Socratic Checkpoint -->
          <div class="bio-setup-stage-col">
            <div class="svg-stage-card">
              ${buildSetupStageSvg(setup, subMod, step, currentStepIdx, subMod.steps.length, activePerturbation)}

              <div class="mech-controls-bar">
                <div class="step-pills">
                  ${subMod.steps
                    .map(
                      (_, idx) => `
                      <button type="button" class="step-pill-btn ${idx === currentStepIdx ? 'active' : ''}" data-setup-step="${idx}">
                        Step ${idx + 1}
                      </button>`
                    )
                    .join('')}
                </div>

                <div style="display:flex; gap:6px; align-items:center;">
                  <button type="button" class="btn-outline btn-sm" id="bio-setup-prev-btn" ${currentStepIdx === 0 ? 'disabled' : ''}>← Prev</button>
                  <button type="button" class="btn-outline btn-sm" id="bio-setup-play-btn">${setupAutoPlayTimer ? '⏸ Pause' : '▶ Auto-Walk'}</button>
                  <button type="button" class="btn-outline btn-sm" id="bio-setup-next-btn" ${currentStepIdx === subMod.steps.length - 1 ? 'disabled' : ''}>Next →</button>
                </div>
              </div>

              <div class="mech-step-notes">
                <h4>${renderInlineMarkdown(step.stepTitle)}</h4>
                <p>${renderInlineMarkdown(step.description)}</p>
              </div>
            </div>

            <!-- Guided "Teach-Me" Socratic Checkpoint -->
            <div class="bio-socratic-box">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                <span class="pill-badge warn">🧠 Guided "Teach-Me" Socratic Check</span>
                ${isCheckpointDone ? '<span class="pill-badge lg">✓ Concept Checked</span>' : ''}
              </div>
              <p style="margin:8px 0; font-weight:700; font-size:0.94rem;">${renderInlineMarkdown(step.socraticPrompt)}</p>
              ${
                socraticRevealed
                  ? `<div class="callout-row" style="background:var(--chem-lg-soft);">
                       <span class="callout-key">Logic:</span>
                       <span>${renderInlineMarkdown(step.socraticAnswer)}</span>
                     </div>`
                  : `<button type="button" class="btn-primary btn-sm" id="bio-reveal-socratic-btn">Think &amp; Reveal Answer</button>`
              }
            </div>

            <!-- Linked NCERT Lines for this stage -->
            ${
              linkedLines.length > 0
                ? `<div class="neet-callout-box">
                     <h4>Exact NCERT Lines Anchoring This Stage (${linkedLines.length})</h4>
                     <div style="display:flex; flex-direction:column; gap:8px;">
                       ${linkedLines
                         .slice(0, 3)
                         .map(
                           (l) => `
                           <div style="padding:8px 10px; border-radius:8px; background:var(--bg-subtle); font-size:0.84rem;">
                             <div style="font-weight:700; color:var(--accent-primary); font-size:0.75rem; margin-bottom:2px;">${escapeHtml(l.ncertRef)}</div>
                             <div>"${renderInlineMarkdown(l.ncertText)}"</div>
                           </div>`
                         )
                         .join('')}
                     </div>
                   </div>`
                : ''
            }
          </div>

          <!-- Right: Live Quantitative Ledger + What-If Toggles + Quick Gemini Tutor -->
          <aside class="bio-setup-side-col">
            <!-- Live Ledger -->
            <div class="neet-callout-box bio-ledger-card">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <h4 style="margin:0;">📊 Live Quantitative Ledger</h4>
                ${
                  activePerturbation && activePerturbation.id !== 'normal'
                    ? `<span class="pill-badge danger">${escapeHtml(activePerturbation.badge)}</span>`
                    : '<span class="pill-badge lg">Normal State</span>'
                }
              </div>

              <div class="bio-ledger-grid">
                ${ledgerItems
                  .map(
                    (item) => `
                    <div class="bio-ledger-tile">
                      <span class="bio-ledger-key">${escapeHtml(item.key)}</span>
                      <strong class="bio-ledger-val">${escapeHtml(String(item.val))}</strong>
                    </div>`
                  )
                  .join('')}
              </div>
            </div>

            <!-- What-If Perturbation Toggles -->
            ${
              setup.perturbations?.length
                ? `<div class="neet-callout-box">
                     <h4>🔬 "What-If" Experimental Condition Toggles</h4>
                     <p class="muted-note" style="margin:0 0 8px;">Flip a condition to see how the pathway, SVG state, and ledger respond:</p>
                     <div class="bio-perturb-list">
                       ${setup.perturbations
                         .map(
                           (p) => `
                           <button type="button" class="bio-perturb-btn ${p.id === activePerturbationId ? 'active' : ''}" data-perturb-id="${escapeHtml(p.id)}">
                             <span>${escapeHtml(p.label)}</span>
                             <span class="pill-badge ${p.id === activePerturbationId ? 'accent' : ''}">${escapeHtml(p.badge)}</span>
                           </button>`
                         )
                         .join('')}
                     </div>
                     ${
                       activePerturbation
                         ? `<div class="callout-row ${activePerturbation.id === 'normal' ? '' : 'alert-warn'}" style="margin-top:8px;">
                              <span class="callout-key">Effect:</span>
                              <span>${renderInlineMarkdown(activePerturbation.effectDetail)}</span>
                            </div>`
                         : ''
                     }
                   </div>`
                : ''
            }

            <!-- Interactive Respiration Energetics & RQ Calculator -->
            ${
              calcResult
                ? `<div class="neet-callout-box bio-calc-card">
                     <h4>🧮 Interactive Respiration ATP &amp; RQ Calculator</h4>
                     <div class="form-grid" style="gap:8px;">
                       <div class="form-field">
                         <label for="resp-calc-sub">Substrate</label>
                         <select id="resp-calc-sub">
                           <option value="glucose" ${calcSubstrate === 'glucose' ? 'selected' : ''}>Glucose (6C)</option>
                           <option value="sucrose" ${calcSubstrate === 'sucrose' ? 'selected' : ''}>Sucrose (12C Disaccharide)</option>
                           <option value="pyruvate" ${calcSubstrate === 'pyruvate' ? 'selected' : ''}>Pyruvic Acid (3C)</option>
                           <option value="acetyl" ${calcSubstrate === 'acetyl' ? 'selected' : ''}>Acetyl-CoA (2C)</option>
                           <option value="tripalmitin" ${calcSubstrate === 'tripalmitin' ? 'selected' : ''}>Tripalmitin Fat</option>
                         </select>
                       </div>
                       <div class="form-field">
                         <label for="resp-calc-cnt">Molecules (1–20)</label>
                         <input type="number" id="resp-calc-cnt" min="1" max="20" value="${calcCount}" />
                       </div>
                     </div>

                     <div class="form-grid" style="gap:8px; margin-top:6px;">
                       <div class="form-field">
                         <label for="resp-calc-cond">Oxygen Condition</label>
                         <select id="resp-calc-cond">
                           <option value="aerobic" ${calcCondition === 'aerobic' ? 'selected' : ''}>Aerobic (O2 Present)</option>
                           <option value="anaerobic" ${calcCondition === 'anaerobic' ? 'selected' : ''}>Anaerobic (Fermentation)</option>
                         </select>
                       </div>
                       <div class="form-field">
                         <label for="resp-calc-shuttle">Cytosolic NADH Shuttle</label>
                         <select id="resp-calc-shuttle">
                           <option value="malate" ${calcShuttle === 'malate' ? 'selected' : ''}>NCERT Standard (38 ATP/Glc)</option>
                           <option value="glycerol" ${calcShuttle === 'glycerol' ? 'selected' : ''}>Glycerol-3-P Shuttle (36 ATP/Glc)</option>
                         </select>
                       </div>
                     </div>

                     <div class="bio-calc-summary">
                       <div><strong>${escapeHtml(calcResult.label)}</strong></div>
                       <div class="bio-calc-row"><span>Net ATP Yield:</span><strong style="color:var(--chem-lg);">${escapeHtml(String(calcResult.netAtp))}</strong></div>
                       <div class="bio-calc-row"><span>Direct / Oxidative ATP:</span><span>${escapeHtml(String(calcResult.directAtp))} / ${escapeHtml(String(calcResult.oxidativeAtp ?? 0))}</span></div>
                       <div class="bio-calc-row"><span>CO₂ Released / O₂ Used:</span><span>${escapeHtml(String(calcResult.co2))} / ${escapeHtml(String(calcResult.o2))}</span></div>
                       <div class="bio-calc-row"><span>H⁺ via F₀ (Latest NCERT):</span><span>${escapeHtml(String(calcResult.hPlus))}</span></div>
                       <div class="bio-calc-row"><span>Respiratory Quotient (RQ):</span><strong>${escapeHtml(String(calcResult.rq))}</strong></div>
                     </div>
                   </div>`
                : ''
            }

            <!-- Quick Stage Tutor -->
            <div class="tutor-box">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <strong style="font-size:0.86rem;">Ask Gemini About This Stage</strong>
                <span class="pill-badge accent">NCERT Tutor</span>
              </div>
              <div style="display:flex; gap:6px;">
                <input type="text" id="setup-tutor-input" value="${escapeHtml(tutorInput)}" placeholder="e.g. Why doesn't Krebs run without O2?" style="flex:1; padding:7px 10px; border-radius:8px; border:1px solid var(--border-strong); background:var(--bg-surface); font-size:0.84rem;" />
                <button type="button" class="btn-primary btn-sm" id="setup-tutor-ask-btn" ${tutorLoading ? 'disabled' : ''}>Ask</button>
              </div>
              ${tutorReply ? `<div class="tutor-reply md-content">${renderMarkdown(tutorReply)}</div>` : ''}
            </div>
          </aside>
        </div>
      </div>
    `;

    // Wire Setup Switcher
    container.querySelectorAll('[data-select-setup]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopBiologySetupAutoPlay();
        activeSetupId = btn.dataset.selectSetup;
        activeSubId = '';
        currentStepIdx = 0;
        activePerturbationId = 'normal';
        socraticRevealed = false;
        tutorReply = '';
        render();
      });
    });

    container.querySelectorAll('[data-select-sub]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopBiologySetupAutoPlay();
        activeSubId = btn.dataset.selectSub;
        currentStepIdx = 0;
        socraticRevealed = false;
        tutorReply = '';
        render();
      });
    });

    container.querySelectorAll('[data-setup-step]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopBiologySetupAutoPlay();
        currentStepIdx = Number(btn.dataset.setupStep);
        socraticRevealed = false;
        render();
      });
    });

    container.querySelector('#bio-setup-prev-btn')?.addEventListener('click', () => {
      stopBiologySetupAutoPlay();
      if (currentStepIdx > 0) {
        currentStepIdx--;
        socraticRevealed = false;
        render();
      }
    });

    container.querySelector('#bio-setup-next-btn')?.addEventListener('click', () => {
      stopBiologySetupAutoPlay();
      if (currentStepIdx < subMod.steps.length - 1) {
        currentStepIdx++;
        socraticRevealed = false;
        render();
      }
    });

    container.querySelector('#bio-setup-play-btn')?.addEventListener('click', () => {
      if (setupAutoPlayTimer) {
        stopBiologySetupAutoPlay();
        render();
        return;
      }
      setupAutoPlayTimer = setInterval(() => {
        currentStepIdx = (currentStepIdx + 1) % subMod.steps.length;
        socraticRevealed = false;
        render();
      }, 3200);
      render();
    });

    container.querySelector('#bio-reveal-socratic-btn')?.addEventListener('click', () => {
      socraticRevealed = true;
      onCompleteCheckpoint(setup.id, checkpointKey);
      render();
    });

    container.querySelectorAll('[data-perturb-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePerturbationId = btn.dataset.perturbId;
        render();
      });
    });

    // Calculator listeners
    container.querySelector('#resp-calc-sub')?.addEventListener('change', (e) => {
      calcSubstrate = e.target.value;
      render();
    });
    container.querySelector('#resp-calc-cnt')?.addEventListener('change', (e) => {
      calcCount = Number(e.target.value) || 1;
      render();
    });
    container.querySelector('#resp-calc-cond')?.addEventListener('change', (e) => {
      calcCondition = e.target.value;
      render();
    });
    container.querySelector('#resp-calc-shuttle')?.addEventListener('change', (e) => {
      calcShuttle = e.target.value;
      render();
    });

    // Cross-view jumps
    container.querySelector('#bio-setup-to-reader-btn')?.addEventListener('click', () => {
      stopBiologySetupAutoPlay();
      onJumpToReader(setup.chapterId);
    });

    container.querySelector('#bio-setup-open-doubt-btn')?.addEventListener('click', () => {
      stopBiologySetupAutoPlay();
      onAskDoubtOnSetup(setup.chapterId, `${setup.title} — ${step.stepTitle}: ${step.description}`);
    });

    // Inline Tutor
    const askField = container.querySelector('#setup-tutor-input');
    askField?.addEventListener('input', (e) => {
      tutorInput = e.target.value;
    });
    const runSetupTutor = async () => {
      if (!tutorInput.trim()) return;
      tutorLoading = true;
      tutorReply = 'Asking Gemini NCERT Tutor...';
      render();
      try {
        const reply = await askBiologyNcertDoubt({
          chapterLabel: setup.title,
          setupContext: `Submodule: ${subMod.label}\nStep: ${step.stepTitle}\nDescription: ${step.description}\nPerturbation: ${activePerturbation?.label || 'Normal'}`,
          userDoubt: tutorInput.trim()
        });
        tutorReply = reply;
      } catch (err) {
        tutorReply = `⚠ ${err.message}`;
      } finally {
        tutorLoading = false;
        render();
      }
    };
    container.querySelector('#setup-tutor-ask-btn')?.addEventListener('click', runSetupTutor);
    askField?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runSetupTutor();
      }
    });
  }

  render();
}
