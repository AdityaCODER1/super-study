/**
 * 4-Pillar NEET Trends, Leaving Groups, Reagents & Distinguishing Tests View
 */

import { TRENDS_DATA } from '../data/trends-reagents.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function predictSubstitutionElimination({ substrate, nucleophile, solvent, temp }) {
  // Handle special non-reactive / SNAr substrates first
  if (substrate === 'aryl-vinyl') {
    return {
      major: 'No SN1 / No SN2 / No E1 (Unless strong –NO2 groups ortho/para → SNAr)',
      minor: 'Requires extreme conditions (e.g. Dow’s 623 K, 300 atm) or strong E2 base (NaNH2 → Benzyne)',
      stereo: 'Aromaticity preserved (or sp² C–X bond resists cleavage)',
      rearrangement: 'None',
      reason:
        'Aryl and Vinyl halides possess partial double-bond character from lone-pair resonance and stronger sp² C–X bonds, blocking both backside SN2 and carbocation SN1.'
    };
  }

  if (substrate === 'methyl') {
    if (nucleophile === 'weak-protic') {
      return {
        major: 'Very Slow SN2 (MeOH/H2O)',
        minor: 'No E1/E2 possible (only 1 carbon — no β-H!)',
        stereo: 'Walden Inversion (if chiral CHDTOs)',
        rearrangement: 'Impossible',
        reason: 'Methyl substrates lack β-hydrogens so elimination is impossible; unhindered backside makes SN2 rapid with strong nucleophiles.'
      };
    }
    return {
      major: 'SN2 (100% Exclusively)',
      minor: 'None (No β-carbon exists for E1/E2)',
      stereo: '100% Inversion of Configuration',
      rearrangement: 'None',
      reason: 'Zero steric hindrance + no β-H ensures clean SN2 substitution.'
    };
  }

  if (substrate === 'primary') {
    if (nucleophile === 'bulky-base') {
      return {
        major: 'E2 Elimination (Hofmann / Terminal Alkene)',
        minor: 'Trace SN2',
        stereo: 'Anti-periplanar β-H abstraction',
        rearrangement: 'None (concerted E2)',
        reason: 'Bulky tert-butoxide (t-BuO⁻) is too sterically hindered for backside SN2 attack even on a 1° carbon, so it cleanly abstracts an accessible β-proton via E2.'
      };
    }
    if (nucleophile === 'weak-protic') {
      return {
        major: 'Very Slow SN2 (or No Reaction at room temp)',
        minor: 'Only Allylic/Benzylic 1° forms C⁺ for SN1!',
        stereo: 'Inversion (SN2) or Racemic (if benzylic/allylic SN1)',
        rearrangement: 'Only if allylic/benzylic shift occurs',
        reason: '1° alkyl carbocations are too unstable for SN1; only 1° allylic/benzylic halides undergo fast SN1!'
      };
    }
    if (temp === 'high' && nucleophile === 'strong-base-nu') {
      return {
        major: 'E2 competes strongly with SN2 (Heat favors ΔS > 0 elimination)',
        minor: 'SN2 (R–OR / R–OH)',
        stereo: 'E2 anti-periplanar / SN2 inversion',
        rearrangement: 'None',
        reason: 'High temperature increases TΔS‡, favoring 2→3 molecule E2 elimination even on 1° halides with strong bases like alc. KOH / EtO⁻.'
      };
    }
    return {
      major: 'SN2 (Clean Substitution)',
      minor: 'Minor E2 if strong base + heat',
      stereo: '100% Walden Inversion',
      rearrangement: 'None',
      reason: '1° substrate + unhindered strong nucleophile (CN⁻, I⁻, SH⁻, RCOO⁻, OH⁻/aprotic) favors rapid bimolecular SN2.'
    };
  }

  if (substrate === 'secondary') {
    if (nucleophile === 'bulky-base' || (nucleophile === 'strong-base-nu' && (temp === 'high' || solvent === 'protic-alc'))) {
      return {
        major: nucleophile === 'bulky-base' ? 'E2 (Hofmann less-substituted alkene)' : 'E2 (Zaitsev more-substituted alkene)',
        minor: 'Minor SN2 (with unhindered strong base)',
        stereo: 'Anti-periplanar 180° H–C–C–X geometry',
        rearrangement: 'None (concerted)',
        reason: 'With 2° halides, strong bases (especially alc. KOH, EtO⁻/Δ, or bulky t-BuO⁻) push the equilibrium predominantly toward E2 elimination.'
      };
    }
    if (nucleophile === 'good-nu-weak-base' || (nucleophile === 'strong-base-nu' && solvent === 'aprotic' && temp === 'low')) {
      return {
        major: 'SN2 Substitution',
        minor: 'Minor E2',
        stereo: '100% Walden Inversion',
        rearrangement: 'None',
        reason: 'Good nucleophiles that are weak bases (I⁻, Br⁻, CN⁻, RS⁻, N3⁻, CH3COO⁻) or polar aprotic solvents (DMSO/DMF/Acetone) supercharge SN2 without triggering E2.'
      };
    }
    // weak-protic
    return {
      major: temp === 'high' ? 'E1 Elimination (Zaitsev Alkene)' : 'SN1 + E1 Competition (Solvolysis)',
      minor: temp === 'high' ? 'SN1' : 'E1',
      stereo: 'Racemization (+ slight excess inversion from tight ion pair)',
      rearrangement: 'YES — Check 1,2-H⁻ / CH3⁻ shifts & ring expansion!',
      reason: 'Weak nucleophile/base in polar protic solvent (H2O, ROH, Ag⁺) ionizes slowly to a 2° carbocation (check rearrangement!), giving SN1 at low temp and E1 on heating.'
    };
  }

  // Tertiary / Resonance 3°
  if (substrate === 'tertiary') {
    if (nucleophile === 'strong-base-nu' || nucleophile === 'bulky-base') {
      return {
        major: nucleophile === 'bulky-base' ? 'E2 (Hofmann Alkene)' : 'E2 (Zaitsev Alkene)',
        minor: '0% SN2 (Completely blocked backside!)',
        stereo: 'Anti-periplanar elimination',
        rearrangement: 'None (concerted E2)',
        reason: '3° substrates CANNOT undergo SN2. Any strong base (OH⁻, RO⁻, t-BuO⁻, NH2⁻) immediately abstracts a β-proton via E2.'
      };
    }
    if (nucleophile === 'good-nu-weak-base' && solvent === 'aprotic') {
      return {
        major: 'Slow SN1 / E1 or No SN2',
        minor: 'E2 if mild basicity + heat',
        stereo: 'Racemic if ionized',
        rearrangement: 'Possible if carbocation shifts',
        reason: '3° halides reject backside SN2 completely; polar aprotic solvent cannot stabilize leaving X⁻ well for SN1.'
      };
    }
    return {
      major: temp === 'high' ? 'E1 (Zaitsev Alkene)' : 'SN1 Solvolysis',
      minor: temp === 'high' ? 'SN1' : 'E1 (~10–20%)',
      stereo: 'Racemization at chiral center',
      rearrangement: 'Possible if adjacent ring strain / aryl stabilization exists',
      reason: '3° carbocation forms rapidly in polar protic solvent (H2O/EtOH); weak nucleophile captures C⁺ at low temp (SN1), while heating favors E1.'
    };
  }

  // Allylic / Benzylic 1°
  return {
    major: nucleophile === 'weak-protic' ? 'Fast SN1 Solvolysis (Resonance-stabilized C⁺!)' : 'Very Fast SN2 (Transition state π-stabilized!)',
    minor: 'E1/E2 minimal unless strong base + β-H present',
    stereo: 'SN2: Inversion | SN1: Racemic',
    rearrangement: 'Allylic resonance shift possible (check symmetry!)',
    reason: 'Allylic & Benzylic halides are uniquely hyper-reactive in BOTH SN2 (π-orbital stabilizes pentacoordinate TS) AND SN1 (resonance-stabilized carbocation, gives immediate AgNO3 ppt!).'
  };
}

export function renderTrendsView(container) {
  let activePillar = 'pillar1';
  let reagentSearch = '';
  let gocFilter = 'All';
  let testSearch = '';

  // Predictor state
  const predState = {
    substrate: 'secondary',
    nucleophile: 'good-nu-weak-base',
    solvent: 'aprotic',
    temp: 'low'
  };

  function render() {
    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>4-Pillar NEET Trends, Leaving Groups &amp; Reagents</h1>
          <p class="section-subtitle">Master leaving group rankings, solvent nucleophilicity switches, chemoselective reagents, GOC stability orders, and distinguishing lab tests.</p>
        </div>
      </div>

      <div class="pillar-tabs" role="tablist">
        <button type="button" class="pillar-tab-btn ${activePillar === 'pillar1' ? 'active' : ''}" data-pillar="pillar1">
          1. Leaving Groups &amp; SN1/SN2/E1/E2 Matrix
        </button>
        <button type="button" class="pillar-tab-btn ${activePillar === 'pillar2' ? 'active' : ''}" data-pillar="pillar2">
          2. Selective Reagent Master Matrix
        </button>
        <button type="button" class="pillar-tab-btn ${activePillar === 'pillar3' ? 'active' : ''}" data-pillar="pillar3">
          3. GOC Effects, Stability &amp; Acidity/Basicity
        </button>
        <button type="button" class="pillar-tab-btn ${activePillar === 'pillar4' ? 'active' : ''}" data-pillar="pillar4">
          4. Distinguishing Chemical Tests Lab
        </button>
      </div>

      <div id="pillar-content"></div>
    `;

    const contentEl = container.querySelector('#pillar-content');
    if (activePillar === 'pillar1') renderPillar1(contentEl);
    if (activePillar === 'pillar2') renderPillar2(contentEl);
    if (activePillar === 'pillar3') renderPillar3(contentEl);
    if (activePillar === 'pillar4') renderPillar4(contentEl);

    container.querySelectorAll('[data-pillar]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activePillar = btn.dataset.pillar;
        render();
      });
    });
  }

  function renderPillar1(target) {
    const prediction = predictSubstitutionElimination(predState);
    target.innerHTML = `
      <div class="two-col-grid" style="margin-bottom: 22px;">
        <div class="card predictor-card">
          <div>
            <span class="pill-badge accent">Interactive Decision Calculator</span>
            <h2 style="margin:6px 0 4px; font-size:1.18rem;">SN1 / SN2 / E1 / E2 Outcome Predictor</h2>
            <p class="muted-note">Select substrate, nucleophile/base strength, solvent, and temperature to see the competing mechanism outcome.</p>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label for="pred-substrate">Substrate Class</label>
              <select id="pred-substrate">
                <option value="methyl" ${predState.substrate === 'methyl' ? 'selected' : ''}>Methyl (CH3–X)</option>
                <option value="primary" ${predState.substrate === 'primary' ? 'selected' : ''}>1° Alkyl (R–CH2–X)</option>
                <option value="secondary" ${predState.substrate === 'secondary' ? 'selected' : ''}>2° Alkyl (R2CH–X)</option>
                <option value="tertiary" ${predState.substrate === 'tertiary' ? 'selected' : ''}>3° Alkyl (R3C–X)</option>
                <option value="allylic-benzylic" ${predState.substrate === 'allylic-benzylic' ? 'selected' : ''}>1° Allylic / Benzylic</option>
                <option value="aryl-vinyl" ${predState.substrate === 'aryl-vinyl' ? 'selected' : ''}>Aryl / Vinyl (Ar–X / C=C–X)</option>
              </select>
            </div>

            <div class="form-field">
              <label for="pred-nu">Nucleophile / Base</label>
              <select id="pred-nu">
                <option value="good-nu-weak-base" ${predState.nucleophile === 'good-nu-weak-base' ? 'selected' : ''}>Good Nu⁻ / Weak Base (I⁻, Br⁻, CN⁻, RS⁻, N3⁻)</option>
                <option value="strong-base-nu" ${predState.nucleophile === 'strong-base-nu' ? 'selected' : ''}>Strong Unhindered Base &amp; Nu⁻ (OH⁻, EtO⁻, NH2⁻)</option>
                <option value="bulky-base" ${predState.nucleophile === 'bulky-base' ? 'selected' : ''}>Strong Bulky Base (t-BuO⁻K⁺, LDA)</option>
                <option value="weak-protic" ${predState.nucleophile === 'weak-protic' ? 'selected' : ''}>Weak Nu⁻ / Weak Base (H2O, EtOH, AcOH)</option>
              </select>
            </div>

            <div class="form-field">
              <label for="pred-solvent">Solvent Type</label>
              <select id="pred-solvent">
                <option value="aprotic" ${predState.solvent === 'aprotic' ? 'selected' : ''}>Polar Aprotic (DMSO, DMF, Acetone, CH3CN)</option>
                <option value="protic" ${predState.solvent === 'protic' ? 'selected' : ''}>Polar Protic (H2O, EtOH, RCOOH)</option>
                <option value="protic-alc" ${predState.solvent === 'protic-alc' ? 'selected' : ''}>Alcoholic Alkali (alc. KOH)</option>
              </select>
            </div>

            <div class="form-field">
              <label for="pred-temp">Temperature</label>
              <select id="pred-temp">
                <option value="low" ${predState.temp === 'low' ? 'selected' : ''}>Low / Room Temp (273–298 K)</option>
                <option value="high" ${predState.temp === 'high' ? 'selected' : ''}>Heated / Reflux (Δ)</option>
              </select>
            </div>
          </div>

          <div class="predictor-output">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
              <strong style="font-size:1rem; color:var(--chem-lg);">Major: ${escapeHtml(prediction.major)}</strong>
              <span class="pill-badge warn">Minor: ${escapeHtml(prediction.minor)}</span>
            </div>
            <div style="font-size:0.86rem; display:flex; flex-direction:column; gap:6px;">
              <div><strong>Stereochemistry:</strong> ${escapeHtml(prediction.stereo)}</div>
              <div><strong>Carbocation Rearrangement:</strong> ${escapeHtml(prediction.rearrangement)}</div>
              <div style="color:var(--text-secondary); margin-top:2px;">${escapeHtml(prediction.reason)}</div>
            </div>
          </div>
        </div>

        <div class="card predictor-card">
          <div>
            <span class="pill-badge nuc">Solvent Effects</span>
            <h2 style="margin:6px 0 4px; font-size:1.18rem;">Polar Protic vs Polar Aprotic Nucleophilicity</h2>
            <p class="muted-note">How H-bonding cages reverse halide nucleophilicity orders in NEET questions.</p>
          </div>
          ${TRENDS_DATA.solventNucleophilicity
            .map(
              (s) => `
              <div class="callout-list" style="padding:12px; border:1px solid var(--border-subtle); border-radius:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                  <strong>${escapeHtml(s.solventType)}</strong>
                  <span class="pill-badge accent">${escapeHtml(s.favoredMech)}</span>
                </div>
                <div style="font-size:0.84rem;"><strong>Examples:</strong> <span class="mono">${escapeHtml(s.examples)}</span></div>
                <div style="font-size:0.84rem;"><strong>Halide Nu⁻ Order:</strong> <span class="mono" style="color:var(--chem-nuc); font-weight:700;">${escapeHtml(s.halideOrder)}</span></div>
                <div style="font-size:0.82rem; color:var(--text-secondary);">${escapeHtml(s.generalTrend)}</div>
              </div>`
            )
            .join('')}
        </div>
      </div>

      <h2 style="margin:0 0 10px; font-size:1.2rem;">Leaving Group Ability Ranking (Best → Worst)</h2>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Leaving Group</th>
              <th>Conjugate Acid</th>
              <th>Acid pKa</th>
              <th>Ability Tier</th>
              <th>Relative Rate</th>
              <th>NEET Mechanism Notes &amp; Exceptions</th>
            </tr>
          </thead>
          <tbody>
            ${TRENDS_DATA.leavingGroups
              .map(
                (lg) => `
                <tr>
                  <td class="mono" style="font-weight:700; color:var(--chem-lg);">${escapeHtml(lg.group)}</td>
                  <td class="mono">${escapeHtml(lg.conjugateAcid)}</td>
                  <td class="mono">${escapeHtml(lg.pKa)}</td>
                  <td><span class="pill-badge">${escapeHtml(lg.ability)}</span></td>
                  <td class="mono">${escapeHtml(lg.relativeRate)}</td>
                  <td>${escapeHtml(lg.notes)}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    target.querySelector('#pred-substrate').addEventListener('change', (e) => {
      predState.substrate = e.target.value;
      renderPillar1(target);
    });
    target.querySelector('#pred-nu').addEventListener('change', (e) => {
      predState.nucleophile = e.target.value;
      renderPillar1(target);
    });
    target.querySelector('#pred-solvent').addEventListener('change', (e) => {
      predState.solvent = e.target.value;
      renderPillar1(target);
    });
    target.querySelector('#pred-temp').addEventListener('change', (e) => {
      predState.temp = e.target.value;
      renderPillar1(target);
    });
  }

  function renderPillar2(target) {
    const filtered = TRENDS_DATA.reagentMatrix.filter((row) => {
      if (!reagentSearch.trim()) return true;
      const q = reagentSearch.toLowerCase();
      return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
    });

    target.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:14px;">
        <p class="muted-note">Compare exact chemoselectivity of high-yield NEET reducing, oxidizing, and cleavage reagents across functional groups.</p>
        <input type="search" id="reagent-filter-input" value="${escapeHtml(reagentSearch)}" placeholder="Filter reagent or group (e.g. DIBAL, PCC, ester, alkyne)..." style="padding:8px 12px; border-radius:8px; border:1px solid var(--border-strong); background:var(--bg-surface); min-width:290px;" />
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Reagent</th>
              <th>Alkene / Alkyne</th>
              <th>Alkyl Halide</th>
              <th>Aldehyde / Ketone</th>
              <th>Acid / Ester / Alcohol</th>
              <th>Nitrile / Amide / Nitro</th>
              <th>NEET Chemoselectivity Trap</th>
            </tr>
          </thead>
          <tbody>
            ${filtered
              .map(
                (r) => `
                <tr>
                  <td>
                    <div class="mono" style="font-weight:700; color:var(--chem-nuc);">${escapeHtml(r.reagent)}</div>
                    <div style="font-size:0.74rem; color:var(--text-muted); margin-top:3px;">${escapeHtml(r.category)}</div>
                  </td>
                  <td>${escapeHtml(r.alkeneAlkyne)}</td>
                  <td>${escapeHtml(r.alkylHalide)}</td>
                  <td>${escapeHtml(r.aldehydeKetone)}</td>
                  <td>${escapeHtml(r.acidEster)}</td>
                  <td>${escapeHtml(r.nitrileAmideNitro)}</td>
                  <td><span class="pill-badge warn" style="white-space:normal; line-height:1.35;">${escapeHtml(r.neetTrap)}</span></td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    const input = target.querySelector('#reagent-filter-input');
    input.addEventListener('input', (e) => {
      reagentSearch = e.target.value;
      renderPillar2(target);
      const nextInput = target.querySelector('#reagent-filter-input');
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
      }
    });
  }

  function renderPillar3(target) {
    const categories = ['All', 'Electronic Effects', 'Intermediate Stability', 'Acidity & Basicity'];
    const items = TRENDS_DATA.gocTrends.filter((t) => gocFilter === 'All' || t.category === gocFilter);

    target.innerHTML = `
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
        ${categories
          .map(
            (cat) => `
            <button type="button" class="btn-sm ${gocFilter === cat ? 'btn-primary' : 'btn-outline'}" data-goc-cat="${escapeHtml(cat)}">
              ${escapeHtml(cat)}
            </button>`
          )
          .join('')}
      </div>

      <div style="display:grid; gap:16px;">
        ${items
          .map(
            (item) => `
            <article class="card trend-card">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                <h3 style="margin:0; font-size:1.1rem;">${escapeHtml(item.title)}</h3>
                <span class="pill-badge accent">${escapeHtml(item.category)}</span>
              </div>
              <div class="trend-chain">${escapeHtml(item.order)}</div>
              ${
                item.secondOrder
                  ? `<div class="trend-chain" style="background:var(--bg-subtle); font-size:0.82rem;">${escapeHtml(item.secondOrder)}</div>`
                  : ''
              }
              <p style="margin:0; font-size:0.88rem; color:var(--text-secondary);">${escapeHtml(item.explanation)}</p>
              <div class="callout-row alert-exception">
                <span class="callout-key">NCERT Exception:</span>
                <span>${escapeHtml(item.exceptionAlert)}</span>
              </div>
            </article>`
          )
          .join('')}
      </div>
    `;

    target.querySelectorAll('[data-goc-cat]').forEach((btn) => {
      btn.addEventListener('click', () => {
        gocFilter = btn.dataset.gocCat;
        renderPillar3(target);
      });
    });
  }

  function renderPillar4(target) {
    const q = testSearch.toLowerCase();
    const tests = TRENDS_DATA.distinguishingTests.filter(
      (t) =>
        !q ||
        t.testName.toLowerCase().includes(q) ||
        t.targets.toLowerCase().includes(q) ||
        t.reagent.toLowerCase().includes(q) ||
        t.exception.toLowerCase().includes(q)
    );
    const pairs = TRENDS_DATA.compoundPairComparisons.filter(
      (p) => !q || p.pair.toLowerCase().includes(q) || p.test.toLowerCase().includes(q)
    );

    target.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:16px;">
        <p class="muted-note">Master NCERT Qualitative Analysis tests and high-yield Compound Pair distinctions.</p>
        <input type="search" id="test-filter-input" value="${escapeHtml(testSearch)}" placeholder="Search test or compound (e.g. Tollens, Lucas, Aniline, Phenol)..." style="padding:8px 12px; border-radius:8px; border:1px solid var(--border-strong); background:var(--bg-surface); min-width:300px;" />
      </div>

      <h2 style="margin:0 0 10px; font-size:1.15rem;">Classic Compound Pair Distinctions (NEET Directs)</h2>
      <div class="table-wrap" style="margin-bottom:22px;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Compound Pair</th>
              <th>Distinguishing Test</th>
              <th>Compound A Result</th>
              <th>Compound B Result</th>
            </tr>
          </thead>
          <tbody>
            ${pairs
              .map(
                (p) => `
                <tr>
                  <td><strong>${escapeHtml(p.pair)}</strong></td>
                  <td><span class="pill-badge nuc">${escapeHtml(p.test)}</span></td>
                  <td style="color:var(--chem-lg); font-weight:500;">${escapeHtml(p.winnerA)}</td>
                  <td style="color:var(--chem-elec); font-weight:500;">${escapeHtml(p.winnerB)}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <h2 style="margin:0 0 10px; font-size:1.15rem;">NCERT Distinguishing Reagents Reference</h2>
      <div class="two-col-grid">
        ${tests
          .map(
            (t) => `
            <article class="card trend-card">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <h3 style="margin:0; font-size:1.04rem;">${escapeHtml(t.testName)}</h3>
                <span class="pill-badge accent">${escapeHtml(t.targets)}</span>
              </div>
              <div class="mono" style="font-size:0.82rem; color:var(--chem-nuc); font-weight:600;">Reagent: ${escapeHtml(t.reagent)}</div>
              <div style="font-size:0.86rem;"><strong>Observation:</strong> ${escapeHtml(t.observations)}</div>
              <div class="callout-row alert-exception">
                <span class="callout-key">Exam Trap:</span>
                <span>${escapeHtml(t.exception)}</span>
              </div>
            </article>`
          )
          .join('')}
      </div>
    `;

    const input = target.querySelector('#test-filter-input');
    input.addEventListener('input', (e) => {
      testSearch = e.target.value;
      renderPillar4(target);
      const nextInput = target.querySelector('#test-filter-input');
      if (nextInput) {
        nextInput.focus();
        nextInput.setSelectionRange(nextInput.value.length, nextInput.value.length);
      }
    });
  }

  render();
}
