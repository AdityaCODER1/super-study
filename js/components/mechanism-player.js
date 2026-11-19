/**
 * Interactive Step-by-Step SVG Mechanism Player Modal
 * Renders animated curved-arrow electron flow (2e- full vs 1e- fishhook),
 * transition state markers, intermediates, NEET exam callouts, and an inline Gemini Tutor.
 */

import { askMechanismTutor } from '../services/gemini.js';
import { renderMarkdown, renderInlineMarkdown } from '../services/markdown.js';

let autoPlayTimer = null;

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildStepSvg(step, stepIndex, totalSteps) {
  const arrows = Array.isArray(step.arrows) ? step.arrows : [];
  const primaryArrow = arrows[0] || { type: 'full', from: 'left', to: 'right', label: 'Reaction step' };
  const isFishhook = primaryArrow.type === 'fishhook';
  const isRightToLeft = primaryArrow.from === 'right' && primaryArrow.to === 'left';

  const arrowPath = isRightToLeft
    ? 'M 470 86 Q 340 24 210 86'
    : 'M 210 86 Q 340 24 470 86';

  const markerId = isFishhook ? 'arrow-fishhook' : 'arrow-full';

  return `
    <svg class="mech-svg-canvas" viewBox="0 0 680 260" role="img" aria-label="Mechanism Step ${stepIndex + 1} of ${totalSteps}">
      <defs>
        <marker id="arrow-full" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 1 1 L 11 6 L 1 11 z" fill="var(--chem-nuc)" />
        </marker>
        <marker id="arrow-fishhook" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M 1 2 L 11 6 L 5 6 z" fill="var(--chem-elec)" />
        </marker>
      </defs>

      <!-- Step Counter Pill -->
      <rect x="16" y="14" width="122" height="26" rx="13" fill="var(--accent-primary-soft)" />
      <text x="77" y="31" text-anchor="middle" font-family="var(--font-mono)" font-size="11.5" font-weight="700" fill="var(--accent-primary)">
        STEP ${stepIndex + 1} / ${totalSteps}
      </text>

      <!-- Electron-Flow Legend -->
      <text x="664" y="31" text-anchor="end" font-family="var(--font-sans)" font-size="11" font-weight="600" fill="var(--text-muted)">
        ${isFishhook ? 'Single-e⁻ Fishhook Arrow (Radical)' : 'Double-e⁻ Curved Arrow (Polar / Concerted)'}
      </text>

      <!-- Curved Electron-Pushing Arrow -->
      <path
        d="${arrowPath}"
        fill="none"
        stroke="${isFishhook ? 'var(--chem-elec)' : 'var(--chem-nuc)'}"
        stroke-width="2.8"
        stroke-linecap="round"
        marker-end="url(#${markerId})"
        class="curved-arrow-path"
      />
      <rect x="255" y="34" width="170" height="22" rx="6" fill="var(--bg-surface)" stroke="var(--border-subtle)" />
      <text x="340" y="49" text-anchor="middle" font-family="var(--font-mono)" font-size="11" font-weight="700" fill="${isFishhook ? 'var(--chem-elec)' : 'var(--chem-nuc)'}">
        ${escapeHtml(primaryArrow.label || 'Electron Flow')}
      </text>

      <!-- Left Species Node -->
      <g transform="translate(24, 92)">
        <rect width="225" height="92" rx="12" fill="var(--bg-surface)" stroke="var(--chem-nuc)" stroke-width="1.6" />
        <text x="112" y="25" text-anchor="middle" font-family="var(--font-sans)" font-size="10.5" font-weight="700" fill="var(--chem-nuc)">
          ${escapeHtml(step.leftCharge || 'REACTANT / DONOR')}
        </text>
        <text x="112" y="57" text-anchor="middle" font-family="var(--font-mono)" font-size="13.5" font-weight="700" fill="var(--text-primary)">
          ${escapeHtml(truncateSvgText(step.leftSpecies, 26))}
        </text>
        <text x="112" y="77" text-anchor="middle" font-family="var(--font-mono)" font-size="10.5" fill="var(--text-muted)">
          ${step.leftSpecies && step.leftSpecies.length > 26 ? escapeHtml(step.leftSpecies.slice(26, 54)) : ''}
        </text>
      </g>

      <!-- Center Reaction Arrow / Action -->
      <g transform="translate(262, 110)">
        <line x1="8" y1="30" x2="148" y2="30" stroke="var(--text-secondary)" stroke-width="2.2" />
        <polygon points="146,24 157,30 146,36" fill="var(--text-secondary)" />
        <text x="80" y="20" text-anchor="middle" font-family="var(--font-mono)" font-size="11.5" font-weight="700" fill="var(--accent-primary)">
          ${escapeHtml(truncateSvgText(step.centerAction || '→', 22))}
        </text>
        ${
          step.transitionState
            ? `<text x="80" y="50" text-anchor="middle" font-family="var(--font-mono)" font-size="10" font-weight="600" fill="var(--chem-warn)">‡ ${escapeHtml(truncateSvgText(step.transitionState, 24))}</text>`
            : ''
        }
      </g>

      <!-- Right Species / Intermediate Node -->
      <g transform="translate(431, 92)">
        <rect width="225" height="92" rx="12" fill="var(--bg-surface)" stroke="var(--chem-elec)" stroke-width="1.6" />
        <text x="112" y="25" text-anchor="middle" font-family="var(--font-sans)" font-size="10.5" font-weight="700" fill="var(--chem-elec)">
          ${escapeHtml(step.rightCharge || 'INTERMEDIATE / PRODUCT')}
        </text>
        <text x="112" y="57" text-anchor="middle" font-family="var(--font-mono)" font-size="13.5" font-weight="700" fill="var(--text-primary)">
          ${escapeHtml(truncateSvgText(step.rightSpecies, 26))}
        </text>
        <text x="112" y="77" text-anchor="middle" font-family="var(--font-mono)" font-size="10.5" fill="var(--text-muted)">
          ${step.rightSpecies && step.rightSpecies.length > 26 ? escapeHtml(step.rightSpecies.slice(26, 54)) : ''}
        </text>
      </g>

      <!-- Bottom Intermediate / Key Insight Banner -->
      ${
        step.intermediate || step.transitionState
          ? `<g transform="translate(24, 204)">
               <rect width="632" height="38" rx="8" fill="var(--chem-lg-soft)" stroke="var(--chem-lg)" stroke-opacity="0.35" />
               <text x="316" y="24" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="600" fill="var(--chem-lg)">
                 ${escapeHtml(step.intermediate || step.transitionState)}
               </text>
             </g>`
          : ''
      }
    </svg>
  `;
}

function truncateSvgText(text, max) {
  const s = String(text ?? '');
  return s.length > max ? s.slice(0, max - 1) + '…' : s;
}

export function stopMechanismAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
}

export function openMechanismPlayer({ reaction, isBookmarked, onToggleBookmark }) {
  stopMechanismAutoPlay();

  const backdrop = document.getElementById('mechanism-modal-backdrop');
  const eyebrow = document.getElementById('mech-modal-eyebrow');
  const title = document.getElementById('mech-modal-title');
  const body = document.getElementById('mech-modal-body');
  const bookmarkBtn = document.getElementById('mech-bookmark-btn');

  if (!backdrop || !body) return;

  const steps =
    Array.isArray(reaction.svgSteps) && reaction.svgSteps.length > 0
      ? reaction.svgSteps
      : [
          {
            stepTitle: 'Overall Transformation',
            description: `${reaction.reactants} reacts with ${reaction.reagents} (${reaction.conditions}) to produce ${reaction.products}.`,
            leftSpecies: reaction.reactants,
            leftCharge: 'Substrate',
            centerAction: reaction.reagents,
            rightSpecies: reaction.products,
            rightCharge: 'Major Product',
            arrows: [{ type: 'full', from: 'left', to: 'right', label: reaction.mechanismType }]
          }
        ];

  let currentStep = 0;

  eyebrow.textContent = `${reaction.namedReaction || reaction.category} • ${reaction.mechanismType}`;
  title.textContent = reaction.title;

  const syncBookmarkUi = (bookmarked) => {
    bookmarkBtn.textContent = bookmarked ? '★ Bookmarked' : '☆ Bookmark Tricky';
    bookmarkBtn.classList.toggle('btn-primary', bookmarked);
    bookmarkBtn.classList.toggle('btn-outline', !bookmarked);
  };
  syncBookmarkUi(isBookmarked);

  bookmarkBtn.onclick = () => {
    const nextState = onToggleBookmark(reaction.id);
    syncBookmarkUi(nextState);
  };

  function renderPlayerBody() {
    const step = steps[currentStep];
    body.innerHTML = `
      <div class="mech-player-grid">
        <div class="svg-stage-card">
          ${buildStepSvg(step, currentStep, steps.length)}

          <div class="mech-controls-bar">
            <div class="step-pills">
              ${steps
                .map(
                  (s, idx) => `
                  <button type="button" class="step-pill-btn ${idx === currentStep ? 'active' : ''}" data-step-idx="${idx}">
                    Step ${idx + 1}
                  </button>`
                )
                .join('')}
            </div>

            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="btn-outline btn-sm" id="mech-prev-btn" ${currentStep === 0 ? 'disabled' : ''}>← Prev</button>
              <button type="button" class="btn-outline btn-sm" id="mech-play-btn">${autoPlayTimer ? '⏸ Pause' : '▶ Auto-Walk'}</button>
              <button type="button" class="btn-outline btn-sm" id="mech-next-btn" ${currentStep === steps.length - 1 ? 'disabled' : ''}>Next →</button>
            </div>
          </div>

          <div class="mech-step-notes">
            <h4>${renderInlineMarkdown(step.stepTitle)}</h4>
            <p>${renderInlineMarkdown(step.description)}</p>
          </div>
        </div>

        <aside class="mech-sidebar-panel">
          <div class="neet-callout-box">
            <h4>Equation &amp; Conditions</h4>
            <div class="mono" style="font-size:0.84rem; line-height:1.6;">
              <div><strong>Substrate:</strong> ${escapeHtml(reaction.reactants)}</div>
              <div><strong>Reagent:</strong> <span style="color:var(--chem-nuc)">${escapeHtml(reaction.reagents)}</span> (${escapeHtml(reaction.conditions || 'Standard')})</div>
              <div><strong>Product:</strong> <span style="color:var(--chem-lg)">${escapeHtml(reaction.products)}</span></div>
            </div>
          </div>

          <div class="neet-callout-box">
            <h4>NEET Exam Callouts</h4>
            <div class="callout-list">
              <div class="callout-row">
                <span class="callout-key">RDS / Rate:</span>
                <span>${renderInlineMarkdown(reaction.rds || 'Check step annotations')}</span>
              </div>
              <div class="callout-row">
                <span class="callout-key">Stereo:</span>
                <span>${renderInlineMarkdown(reaction.stereochemistry || 'Standard')}</span>
              </div>
              ${
                reaction.rearrangementAlert
                  ? `<div class="callout-row alert-warn">
                       <span class="callout-key">Alert:</span>
                       <span>${renderInlineMarkdown(reaction.rearrangementAlert)}</span>
                     </div>`
                  : ''
              }
              ${
                reaction.ncertExceptions
                  ? `<div class="callout-row alert-exception">
                       <span class="callout-key">NCERT Trap:</span>
                       <span>${renderInlineMarkdown(reaction.ncertExceptions)}</span>
                     </div>`
                  : ''
              }
            </div>
          </div>

          <div class="tutor-box">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size:0.86rem;">Ask Gemini "What-If" Tutor</strong>
              <span class="pill-badge accent">GEMINI_API_KEY</span>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn-outline btn-sm quick-tutor-btn" data-q="What happens if the substrate or reagent is changed to a tricky NEET variant?">What-if variant?</button>
              <button type="button" class="btn-outline btn-sm quick-tutor-btn" data-q="Explain the rate-determining step and stereochemistry in simple steps.">Explain RDS &amp; Stereo</button>
            </div>
            <div style="display:flex; gap:6px;">
              <input type="text" id="tutor-question-input" placeholder="Ask a custom what-if question..." style="flex:1; padding:7px 10px; border-radius:8px; border:1px solid var(--border-strong); background:var(--bg-surface); font-size:0.84rem;" />
              <button type="button" class="btn-primary btn-sm" id="tutor-ask-btn">Ask</button>
            </div>
            <div id="tutor-reply-box" class="tutor-reply md-content" hidden></div>
          </div>
        </aside>
      </div>
    `;

    // Wire step controls
    body.querySelectorAll('[data-step-idx]').forEach((btn) => {
      btn.addEventListener('click', () => {
        stopMechanismAutoPlay();
        currentStep = Number(btn.dataset.stepIdx);
        renderPlayerBody();
      });
    });

    const prevBtn = body.querySelector('#mech-prev-btn');
    const nextBtn = body.querySelector('#mech-next-btn');
    const playBtn = body.querySelector('#mech-play-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopMechanismAutoPlay();
        if (currentStep > 0) {
          currentStep--;
          renderPlayerBody();
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopMechanismAutoPlay();
        if (currentStep < steps.length - 1) {
          currentStep++;
          renderPlayerBody();
        }
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        if (autoPlayTimer) {
          stopMechanismAutoPlay();
          renderPlayerBody();
          return;
        }
        autoPlayTimer = setInterval(() => {
          currentStep = (currentStep + 1) % steps.length;
          renderPlayerBody();
        }, 2800);
        renderPlayerBody();
      });
    }

    // Wire Gemini Tutor
    const askInput = body.querySelector('#tutor-question-input');
    const askBtn = body.querySelector('#tutor-ask-btn');
    const replyBox = body.querySelector('#tutor-reply-box');

    async function runTutorQuery(questionText) {
      if (!questionText.trim()) return;
      replyBox.hidden = false;
      replyBox.textContent = 'Asking Gemini mechanism tutor...';
      askBtn.disabled = true;
      try {
        const answer = await askMechanismTutor({ reaction, userQuestion: questionText.trim() });
        replyBox.innerHTML = renderMarkdown(answer);
      } catch (err) {
        replyBox.textContent = `⚠ ${err.message}`;
      } finally {
        askBtn.disabled = false;
      }
    }

    body.querySelectorAll('.quick-tutor-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        askInput.value = btn.dataset.q;
        runTutorQuery(btn.dataset.q);
      });
    });

    askBtn.addEventListener('click', () => runTutorQuery(askInput.value));
    askInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runTutorQuery(askInput.value);
      }
    });
  }

  renderPlayerBody();
  backdrop.hidden = false;
}
