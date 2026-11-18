/**
 * Active-Recall Flashcard & Spaced-Repetition Drill Arena
 */

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderDrillView(container, { reactions, mastery, onUpdateMastery, onInspectReaction }) {
  let drillMode = 'product'; // 'product' | 'reagent' | 'exception'
  let filterPool = 'all'; // 'all' | 'focus' (unseen + review + tricky)
  let currentIndex = 0;
  let revealed = false;

  function getDeck() {
    if (filterPool === 'focus') {
      const subset = reactions.filter((r) => (mastery[r.id] || 'unseen') !== 'mastered');
      return subset.length > 0 ? subset : reactions;
    }
    return reactions;
  }

  function render() {
    const deck = getDeck();
    if (deck.length === 0) {
      container.innerHTML = `<div class="card" style="padding:24px;">No reaction cards found for this subject yet. Add cards in the Custom Subjects tab!</div>`;
      return;
    }

    if (currentIndex >= deck.length) currentIndex = 0;
    const rxn = deck[currentIndex];
    const status = mastery[rxn.id] || 'unseen';
    const masteredCount = reactions.filter((r) => mastery[r.id] === 'mastered').length;
    const pct = reactions.length ? Math.round((masteredCount / reactions.length) * 100) : 0;

    const showProduct = drillMode !== 'product' || revealed;
    const showReagent = drillMode !== 'reagent' || revealed;
    const showException = drillMode !== 'exception' || revealed;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>Active-Recall Reaction Drills</h1>
          <p class="section-subtitle">Test your reflex on NEET products, reagents, and NCERT exceptions, then grade mastery to build your spaced-repetition queue.</p>
        </div>
        <div style="min-width:220px;">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; margin-bottom:4px;">
            <span>Deck Mastery</span>
            <span>${masteredCount} / ${reactions.length} (${pct}%)</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
      </div>

      <div class="flashcard-stage">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
          <div class="mode-tabs">
            <button type="button" class="mode-tab-btn ${drillMode === 'product' ? 'active' : ''}" data-drill-mode="product">Predict Product</button>
            <button type="button" class="mode-tab-btn ${drillMode === 'reagent' ? 'active' : ''}" data-drill-mode="reagent">Identify Reagent</button>
            <button type="button" class="mode-tab-btn ${drillMode === 'exception' ? 'active' : ''}" data-drill-mode="exception">Recall Exception &amp; RDS</button>
          </div>

          <div style="display:flex; gap:8px; align-items:center;">
            <button type="button" class="btn-sm ${filterPool === 'focus' ? 'btn-primary' : 'btn-outline'}" id="toggle-focus-pool">
              ${filterPool === 'focus' ? 'Focusing: Unmastered Only' : 'Filter: Unmastered Only'}
            </button>
            <button type="button" class="btn-outline btn-sm" id="shuffle-deck-btn">↻ Random Card</button>
          </div>
        </div>

        <article class="card flashcard-box">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="pill-badge accent">Card ${currentIndex + 1} of ${deck.length}</span>
            <div style="display:flex; gap:6px; align-items:center;">
              <span class="pill-badge">${escapeHtml(rxn.category)}</span>
              <span class="pill-badge ${status === 'mastered' ? 'lg' : status === 'tricky' ? 'danger' : status === 'review' ? 'warn' : ''}">
                Status: ${escapeHtml(status.toUpperCase())}
              </span>
            </div>
          </div>

          <div>
            <h2 style="margin:0 0 6px; font-size:1.3rem;">
              ${drillMode === 'exception' && !revealed ? 'What reaction & NCERT trap does this equation represent?' : escapeHtml(rxn.title)}
            </h2>
            <p class="muted-note">Mechanism: ${escapeHtml(rxn.mechanismType)}</p>
          </div>

          <div class="equation-box" style="padding:18px;">
            <div class="eq-part">
              <span class="eq-label">Reactant / Substrate</span>
              <span style="font-weight:700;">${escapeHtml(rxn.reactants)}</span>
            </div>

            <div class="eq-reagent-arrow" style="min-width:160px;">
              <span class="eq-reagent-text">
                ${showReagent ? escapeHtml(rxn.reagents) : '<span class="pill-badge warn">??? Missing Reagent ???</span>'}
              </span>
              <span class="eq-cond-text">${showReagent ? escapeHtml(rxn.conditions || '') : 'Tap Reveal Answer below'}</span>
            </div>

            <div class="eq-part">
              <span class="eq-label">Major Product(s)</span>
              <span style="font-weight:700; color:var(--chem-lg);">
                ${showProduct ? escapeHtml(rxn.products) : '<span class="pill-badge warn">??? Predict Product ???</span>'}
              </span>
            </div>
          </div>

          ${
            showException
              ? `<div class="callout-list">
                   <div class="callout-row"><span class="callout-key">RDS / Rate:</span><span>${escapeHtml(rxn.rds)}</span></div>
                   <div class="callout-row"><span class="callout-key">Stereochemistry:</span><span>${escapeHtml(rxn.stereochemistry)}</span></div>
                   ${rxn.rearrangementAlert ? `<div class="callout-row alert-warn"><span class="callout-key">Alert:</span><span>${escapeHtml(rxn.rearrangementAlert)}</span></div>` : ''}
                   ${rxn.ncertExceptions ? `<div class="callout-row alert-exception"><span class="callout-key">NCERT Exception:</span><span>${escapeHtml(rxn.ncertExceptions)}</span></div>` : ''}
                 </div>`
              : `<div class="callout-row" style="justify-content:center; padding:16px; color:var(--text-muted);">
                   Recall the RDS, stereochemistry, and NCERT traps before clicking Reveal.
                 </div>`
          }

          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-top:auto; padding-top:10px; border-top:1px solid var(--border-subtle);">
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn-outline" id="drill-prev-btn">← Prev</button>
              <button type="button" class="btn-primary" id="drill-reveal-btn">
                ${revealed ? 'Hide Answer' : 'Reveal Answer'}
              </button>
              <button type="button" class="btn-outline" id="drill-next-btn">Next →</button>
            </div>

            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn-outline btn-sm grade-btn" data-grade="mastered" style="border-color:var(--chem-lg); color:var(--chem-lg);">✓ Mastered</button>
              <button type="button" class="btn-outline btn-sm grade-btn" data-grade="review" style="border-color:var(--chem-warn); color:var(--chem-warn);">↻ Review Soon</button>
              <button type="button" class="btn-outline btn-sm grade-btn" data-grade="tricky" style="border-color:var(--chem-danger); color:var(--chem-danger);">★ Tricky</button>
              <button type="button" class="btn-ghost btn-sm" id="drill-inspect-mech-btn">Inspect SVG Mechanism</button>
            </div>
          </div>
        </article>
      </div>
    `;

    container.querySelectorAll('[data-drill-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        drillMode = btn.dataset.drillMode;
        revealed = false;
        render();
      });
    });

    container.querySelector('#toggle-focus-pool').addEventListener('click', () => {
      filterPool = filterPool === 'all' ? 'focus' : 'all';
      currentIndex = 0;
      revealed = false;
      render();
    });

    container.querySelector('#shuffle-deck-btn').addEventListener('click', () => {
      currentIndex = Math.floor(Math.random() * deck.length);
      revealed = false;
      render();
    });

    container.querySelector('#drill-reveal-btn').addEventListener('click', () => {
      revealed = !revealed;
      render();
    });

    container.querySelector('#drill-prev-btn').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + deck.length) % deck.length;
      revealed = false;
      render();
    });

    container.querySelector('#drill-next-btn').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % deck.length;
      revealed = false;
      render();
    });

    container.querySelectorAll('.grade-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        onUpdateMastery(rxn.id, btn.dataset.grade);
        currentIndex = (currentIndex + 1) % deck.length;
        revealed = false;
        render();
      });
    });

    container.querySelector('#drill-inspect-mech-btn').addEventListener('click', () => {
      onInspectReaction(rxn);
    });
  }

  render();
}
