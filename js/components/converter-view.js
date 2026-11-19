/**
 * Functional Group Interconversion Finder (Convert Group X -> Group Y)
 * Uses BFS across NCERT reactions and core interconversion bridges to find
 * 1-step, 2-step, and 3-step synthesis pathways, plus an optional Gemini AI route planner.
 */

import { callGeminiApi } from '../services/gemini.js';
import { renderMarkdown } from '../services/markdown.js';

const CANONICAL_GROUPS = [
  'Alkane',
  'Alkene',
  'Alkyne',
  'Haloalkane',
  'Alcohol',
  'Phenol',
  'Ether',
  'Aldehyde',
  'Ketone',
  'Carboxylic Acid',
  'Acyl Chloride',
  'Amide',
  'Nitrile',
  'Amine',
  'Arene',
  'Haloarene',
  'Nitroarene',
  'Diazonium Salt',
  'Alkylarene'
];

// High-yield NCERT conversion edges supplementing the detailed reaction cards
const NCERT_BRIDGE_EDGES = [
  { from: 'Alkane', to: 'Haloalkane', reagent: 'Cl2 / hν or Br2 / hν', label: 'Free-Radical Halogenation' },
  { from: 'Haloalkane', to: 'Alcohol', reagent: 'aq. KOH (SN2) or moist Ag2O', label: 'Hydrolysis of Haloalkane' },
  { from: 'Haloalkane', to: 'Nitrile', reagent: 'alc. KCN / Δ', label: 'Chain Step-Up (+1 C)' },
  { from: 'Haloalkane', to: 'Amine', reagent: 'NH3 (excess) or Gabriel Phthalimide', label: 'Ammonolysis / Gabriel' },
  { from: 'Haloalkane', to: 'Ether', reagent: 'R’ONa (Williamson SN2)', label: 'Williamson Ether Synthesis' },
  { from: 'Alcohol', to: 'Aldehyde', reagent: 'PCC / CH2Cl2 or Cu / 573 K (1°)', label: 'Controlled Oxidation (1°)' },
  { from: 'Alcohol', to: 'Ketone', reagent: 'PCC or CrO3 or Cu / 573 K (2°)', label: '2° Alcohol Oxidation' },
  { from: 'Alcohol', to: 'Carboxylic Acid', reagent: 'KMnO4 / H⁺ or Jones CrO3/H2SO4', label: 'Vigorous 1° Oxidation' },
  { from: 'Aldehyde', to: 'Alcohol', reagent: 'NaBH4 or LiAlH4', label: 'Carbonyl Reduction (→ 1°)' },
  { from: 'Ketone', to: 'Alcohol', reagent: 'NaBH4 or LiAlH4', label: 'Ketone Reduction (→ 2°)' },
  { from: 'Aldehyde', to: 'Carboxylic Acid', reagent: "Tollens' / Fehling's / KMnO4", label: 'Aldehyde Oxidation' },
  { from: 'Carboxylic Acid', to: 'Alcohol', reagent: '1) LiAlH4 / Dry Ether  2) H3O⁺ (or B2H6)', label: 'Acid Reduction (→ 1° ROH)' },
  { from: 'Carboxylic Acid', to: 'Acyl Chloride', reagent: 'SOCl2 or PCl5 or PCl3', label: 'Acyl Chloride Prep' },
  { from: 'Carboxylic Acid', to: 'Amide', reagent: 'NH3, then strong Δ', label: 'Amide Formation' },
  { from: 'Carboxylic Acid', to: 'Alkane', reagent: 'NaOH + CaO, Δ (or Kolbe)', label: 'Decarboxylation (−1 C)' },
  { from: 'Nitrile', to: 'Carboxylic Acid', reagent: 'H3O⁺, Δ (Complete Hydrolysis)', label: 'Nitrile Hydrolysis' },
  { from: 'Nitrile', to: 'Amide', reagent: 'Conc. HCl / H2O2 (Partial)', label: 'Partial Hydrolysis' },
  { from: 'Nitrile', to: 'Amine', reagent: 'LiAlH4 or H2/Ni or Na/EtOH', label: 'Mendius Reduction' },
  { from: 'Amide', to: 'Amine', reagent: 'Br2 + 4 NaOH (Hofmann −1 C) | LiAlH4 (same C)', label: 'Hofmann / LAH' },
  { from: 'Arene', to: 'Nitroarene', reagent: 'Conc. HNO3 + Conc. H2SO4', label: 'Aromatic Nitration' },
  { from: 'Arene', to: 'Haloarene', reagent: 'Cl2 or Br2 / Anhyd. FeX3', label: 'Aromatic Halogenation' },
  { from: 'Arene', to: 'Alkylarene', reagent: 'R–X / Anhyd. AlCl3', label: 'Friedel–Crafts Alkylation' },
  { from: 'Nitroarene', to: 'Amine', reagent: 'Sn/HCl or Fe/HCl or H2/Pd', label: 'Reduction to Aniline' },
  { from: 'Amine', to: 'Diazonium Salt', reagent: 'NaNO2 + HCl (273–278 K)', label: 'Diazotization (1° Aryl)' },
  { from: 'Diazonium Salt', to: 'Phenol', reagent: 'Warm H2O (283 K)', label: 'Hydrolysis of ArN2⁺' },
  { from: 'Diazonium Salt', to: 'Haloarene', reagent: 'Cu2X2/HX (Sandmeyer) or KI or HBF4/Δ', label: 'Sandmeyer / Balz-Schiemann' },
  { from: 'Diazonium Salt', to: 'Arene', reagent: 'H3PO2 + H2O or CH3CH2OH', label: 'Deamination' },
  { from: 'Phenol', to: 'Arene', reagent: 'Zn dust, Δ', label: 'Phenol Reduction' },
  { from: 'Alkylarene', to: 'Carboxylic Acid', reagent: 'KMnO4 / KOH, Δ then H3O⁺', label: 'Side-chain Oxidation (→ PhCOOH)' },
  { from: 'Alkylarene', to: 'Aldehyde', reagent: 'CrO2Cl2 / CS2 then H3O⁺ (Etard)', label: 'Etard Reaction (→ PhCHO)' },
  { from: 'Haloarene', to: 'Phenol', reagent: 'aq. NaOH, 623 K, 300 atm then H⁺', label: "Dow's Process" }
];

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function normalizeTokens(groupStr) {
  if (!groupStr) return [];
  const rawParts = String(groupStr)
    .split(/[\/,+]+/)
    .map((s) => s.replace(/\(.*?\)/g, '').trim().toLowerCase())
    .filter(Boolean);

  const aliasMap = new Map([
    ['acid', 'Carboxylic Acid'],
    ['carboxylic acid salt', 'Carboxylic Acid'],
    ['alkyl iodide', 'Haloalkane'],
    ['alkyl bromide', 'Haloalkane'],
    ['halophenol', 'Phenol'],
    ['nitrophenol', 'Phenol'],
    ['salicylic acid', 'Phenol'],
    ['salicylaldehyde', 'Aldehyde'],
    ['isocyanide', 'Nitrile'],
    ['nitroalkane', 'Nitroarene'],
    ['amine', 'Amine'],
    ['aniline', 'Amine']
  ]);

  const matched = new Set();
  for (const part of rawParts) {
    const exactCanonical = CANONICAL_GROUPS.find((g) => g.toLowerCase() === part);
    if (exactCanonical) {
      matched.add(exactCanonical);
      continue;
    }
    if (aliasMap.has(part)) {
      matched.add(aliasMap.get(part));
      continue;
    }
    // Boundary-safe fallback: check longest canonical groups first without partial word bleed
    const sorted = [...CANONICAL_GROUPS].sort((a, b) => b.length - a.length);
    for (const g of sorted) {
      const escaped = g.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (new RegExp(`(^|\\s)${escaped}(\\s|$)`).test(part)) {
        matched.add(g);
        break;
      }
    }
  }
  return [...matched];
}

function buildConversionGraph(reactions) {
  const adj = new Map();
  for (const g of CANONICAL_GROUPS) adj.set(g, []);

  const addEdge = (from, to, meta) => {
    if (!adj.has(from)) adj.set(from, []);
    if (from === to) return;
    const list = adj.get(from);
    // Avoid adding duplicate bridge edge if an identical-target reaction card already covers it
    const existingIdx = list.findIndex((e) => e.to === to && e.label === meta.label);
    if (existingIdx >= 0) {
      if (meta.reaction && !list[existingIdx].reaction) list[existingIdx] = { to, ...meta };
      return;
    }
    list.push({ to, ...meta });
  };

  for (const rxn of reactions) {
    const froms = normalizeTokens(rxn.fromGroup);
    const tos = normalizeTokens(rxn.toGroup);
    for (const f of froms) {
      for (const t of tos) {
        addEdge(f, t, {
          reagent: rxn.reagents,
          label: rxn.namedReaction || rxn.title,
          reaction: rxn
        });
      }
    }
  }

  for (const edge of NCERT_BRIDGE_EDGES) {
    const list = adj.get(edge.from) || [];
    const hasCardForPair = list.some((e) => e.to === edge.to && e.reaction);
    if (!hasCardForPair) {
      addEdge(edge.from, edge.to, {
        reagent: edge.reagent,
        label: edge.label,
        reaction: null
      });
    }
  }

  return adj;
}

function findPathways(adj, startGroup, targetGroup, maxDepth = 3) {
  if (startGroup === targetGroup) return [];
  const results = [];
  const seenSignatures = new Set();
  const queue = [[{ node: startGroup, edge: null }]];

  while (queue.length > 0 && results.length < 24) {
    const path = queue.shift();
    const current = path[path.length - 1].node;
    const stepsTaken = path.length - 1;

    if (stepsTaken >= maxDepth) continue;

    const neighbors = adj.get(current) || [];
    for (const edge of neighbors) {
      if (path.some((p) => p.node === edge.to)) continue;
      const nextPath = [...path, { node: edge.to, edge }];
      if (edge.to === targetGroup) {
        const sig = nextPath.map((s) => `${s.node}:${s.edge?.label || ''}`).join('->');
        if (!seenSignatures.has(sig)) {
          seenSignatures.add(sig);
          results.push(nextPath);
        }
      } else if (nextPath.length - 1 < maxDepth) {
        queue.push(nextPath);
      }
    }
  }

  // Sort shortest first, preferring paths backed by full mechanism cards
  return results.sort((a, b) => a.length - b.length).slice(0, 8);
}

export function renderConverterView(container, { reactions, onInspectReaction }) {
  let fromGroup = 'Arene';
  let toGroup = 'Phenol';
  let customAiResponse = '';
  let customLoading = false;

  const adj = buildConversionGraph(reactions);

  function render() {
    const pathways = findPathways(adj, fromGroup, toGroup, 3);

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>Functional Group Interconversion Finder (X → Y)</h1>
          <p class="section-subtitle">Discover 1-step, 2-step, and 3-step NCERT synthetic pathways between organic functional groups, or ask Gemini for a custom molecule conversion.</p>
        </div>
      </div>

      <div class="card predictor-card" style="margin-bottom:20px;">
        <div class="form-grid" style="align-items:end;">
          <div class="form-field">
            <label for="conv-from-select">Starting Functional Group (X)</label>
            <select id="conv-from-select">
              ${CANONICAL_GROUPS.map((g) => `<option value="${escapeHtml(g)}" ${g === fromGroup ? 'selected' : ''}>${escapeHtml(g)}</option>`).join('')}
            </select>
          </div>

          <div class="form-field">
            <label for="conv-to-select">Target Functional Group (Y)</label>
            <select id="conv-to-select">
              ${CANONICAL_GROUPS.map((g) => `<option value="${escapeHtml(g)}" ${g === toGroup ? 'selected' : ''}>${escapeHtml(g)}</option>`).join('')}
            </select>
          </div>

          <div style="display:flex; gap:8px;">
            <button type="button" class="btn-outline" id="conv-swap-btn">⇄ Swap X / Y</button>
          </div>
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
          <span style="font-size:0.8rem; color:var(--text-muted); font-weight:600;">Popular NEET Conversions:</span>
          <button type="button" class="btn-outline btn-sm preset-conv-btn" data-from="Arene" data-to="Phenol">Benzene → Phenol</button>
          <button type="button" class="btn-outline btn-sm preset-conv-btn" data-from="Nitroarene" data-to="Haloarene">Nitrobenzene → Fluorobenzene</button>
          <button type="button" class="btn-outline btn-sm preset-conv-btn" data-from="Carboxylic Acid" data-to="Amine">Carboxylic Acid → Amine (−1 C)</button>
          <button type="button" class="btn-outline btn-sm preset-conv-btn" data-from="Alkene" data-to="Aldehyde">Alkene → Aldehyde</button>
          <button type="button" class="btn-outline btn-sm preset-conv-btn" data-from="Alcohol" data-to="Ether">Alcohol → Ether</button>
        </div>
      </div>

      <h2 style="margin:0 0 12px; font-size:1.15rem;">
        NCERT Pathways Found: <span style="color:var(--accent-primary);">${escapeHtml(fromGroup)} → ${escapeHtml(toGroup)}</span> (${pathways.length})
      </h2>

      ${
        fromGroup === toGroup
          ? `<div class="card" style="padding:20px;">Select two different functional groups to calculate conversion pathways.</div>`
          : pathways.length === 0
            ? `<div class="card" style="padding:20px;">No direct 1–3 step NCERT pathway matched in the local graph. Try the Gemini Specific Compound Converter below!</div>`
            : `<div style="display:grid; gap:14px; margin-bottom:24px;">
                ${pathways
                  .map(
                    (path, pIdx) => `
                    <div class="card pathway-card">
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                        <span class="pill-badge ${path.length - 1 === 1 ? 'lg' : 'accent'}">${path.length - 1}-Step Route #${pIdx + 1}</span>
                        <div style="display:flex; gap:6px; flex-wrap:wrap;">
                          ${path
                            .filter((step) => step.edge?.reaction)
                            .map(
                              (step) =>
                                `<button type="button" class="btn-outline btn-sm inspect-path-rxn" data-rxn-id="${escapeHtml(step.edge.reaction.id)}">Inspect: ${escapeHtml(step.edge.reaction.namedReaction || step.edge.label)}</button>`
                            )
                            .join('')}
                        </div>
                      </div>
                      <div class="pathway-steps">
                        ${path
                          .map((step, idx) => {
                            if (idx === 0) {
                              return `<span class="pathway-node">${escapeHtml(step.node)}</span>`;
                            }
                            return `
                              <div class="pathway-arrow">
                                <span>${escapeHtml(step.edge.reagent)}</span>
                                <span style="color:var(--text-muted); font-size:0.7rem;">──(${escapeHtml(step.edge.label)})──▶</span>
                              </div>
                              <span class="pathway-node">${escapeHtml(step.node)}</span>
                            `;
                          })
                          .join('')}
                      </div>
                    </div>`
                  )
                  .join('')}
              </div>`
      }

      <div class="card predictor-card">
        <div>
          <span class="pill-badge accent">Gemini Custom Synthesis Planner</span>
          <h3 style="margin:6px 0 4px;">Need a Specific Molecule Conversion (e.g., Ethanol → But-2-yne or Aniline → Benzoic Acid)?</h3>
          <p class="muted-note">Ask Gemini using your <code>GEMINI_API_KEY</code> for exact step-by-step NCERT reagents, carbon count changes, and exam traps.</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <input type="text" id="custom-conv-input" placeholder="e.g. Convert Propene to Propan-1-ol, or Aniline to p-Bromoaniline" style="flex:1; min-width:260px; padding:9px 12px; border-radius:8px; border:1px solid var(--border-strong); background:var(--bg-surface);" />
          <button type="button" class="btn-primary" id="custom-conv-btn" ${customLoading ? 'disabled' : ''}>
            ${customLoading ? 'Planning...' : 'Plan Conversion with Gemini'}
          </button>
        </div>
        ${
          customAiResponse
            ? `<div class="tutor-reply md-content" style="margin-top:8px;">${renderMarkdown(customAiResponse)}</div>`
            : ''
        }
      </div>
    `;

    container.querySelector('#conv-from-select').addEventListener('change', (e) => {
      fromGroup = e.target.value;
      render();
    });
    container.querySelector('#conv-to-select').addEventListener('change', (e) => {
      toGroup = e.target.value;
      render();
    });
    container.querySelector('#conv-swap-btn').addEventListener('click', () => {
      [fromGroup, toGroup] = [toGroup, fromGroup];
      render();
    });

    container.querySelectorAll('.preset-conv-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        fromGroup = btn.dataset.from;
        toGroup = btn.dataset.to;
        render();
      });
    });

    container.querySelectorAll('.inspect-path-rxn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rxn = reactions.find((r) => r.id === btn.dataset.rxnId);
        if (rxn) onInspectReaction(rxn);
      });
    });

    const customBtn = container.querySelector('#custom-conv-btn');
    const customInput = container.querySelector('#custom-conv-input');
    customBtn.addEventListener('click', async () => {
      const q = customInput.value.trim();
      if (!q) return;
      customLoading = true;
      customAiResponse = 'Generating NCERT-aligned synthesis pathway...';
      render();
      try {
        const reply = await callGeminiApi({
          systemInstruction:
            'You are an expert NEET NCERT Organic Chemistry teacher. Give the cleanest, shortest multi-step NCERT conversion with exact reagents, temperatures, and one NEET caution tip.',
          prompt: `Provide the step-by-step NCERT organic synthesis for: ${q}`
        });
        customAiResponse = reply;
      } catch (err) {
        customAiResponse = `⚠ ${err.message}`;
      } finally {
        customLoading = false;
        render();
      }
    });
  }

  render();
}
