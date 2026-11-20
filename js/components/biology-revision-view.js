/**
 * Biology Active Revision & Recall Arena
 * 4 specialized NCERT revision modes:
 *  1. NCERT Line-by-Line Cloze Flashcards (with Spaced-Repetition Grading)
 *  2. "Spot the NCERT Word-Swap" Rapid-Fire Trap Drill
 *  3. Pathway & Cycle Step-Sequencer (Interactive Order Verification)
 *  4. High-Yield Chapter Revision Snapshot (Numbers, Scientists, Locations & Traps)
 */

import {
  BIOLOGY_CHAPTER_CATALOG,
  NCERT_CHAPTER_MODULES,
  WORD_SWAP_DRILLS,
  PATHWAY_SEQUENCES,
  CHAPTER_REVISION_SNAPSHOTS
} from '../data/biology-ncert-data.js';
import { renderInlineMarkdown, escapeHtml } from '../services/markdown.js';

function renderClozePrompt(clozeText, revealed) {
  const src = clozeText || '';
  const parts = [];
  const re = /\{\{(.*?)\}\}/g;
  let last = 0;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) {
      parts.push(renderInlineMarkdown(src.slice(last, m.index)));
    }
    const answer = m[1];
    parts.push(
      revealed
        ? `<span class="bio-cloze-revealed">${renderInlineMarkdown(answer)}</span>`
        : `<span class="bio-cloze-blank">_____</span>`
    );
    last = re.lastIndex;
  }
  if (last < src.length) {
    parts.push(renderInlineMarkdown(src.slice(last)));
  }
  return parts.join('');
}

function shuffleList(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function renderBiologyRevisionView(
  container,
  {
    initialChapterId = 'all',
    bioLineMastery = {},
    bioCustomModules = {},
    onUpdateLineMastery,
    onJumpToReader,
    onToast
  }
) {
  let activeMode = 'cloze'; // 'cloze' | 'word-swap' | 'sequencer' | 'snapshot'
  let chapterFilter = initialChapterId || 'all';
  let focusUnmastered = false;

  // Cloze state
  let clozeIdx = 0;
  let clozeRevealed = false;

  // Word-Swap state
  let wsIdx = 0;
  let wsChoice = null; // true | false | null
  let wsScore = { attempts: 0, correct: 0, streak: 0 };

  // Sequencer state
  let activeSeqId = PATHWAY_SEQUENCES[0].id;
  let scrambledPool = [];
  let userOrder = [];
  let seqChecked = false;

  // Snapshot state
  let snapshotChapterId = 'bot-respiration';
  let snapshotMasked = false;

  function initSequence(seqId) {
    activeSeqId = seqId;
    const seq = PATHWAY_SEQUENCES.find((s) => s.id === seqId) || PATHWAY_SEQUENCES[0];
    scrambledPool = shuffleList(seq.steps.map((text, origIdx) => ({ origIdx, text })));
    userOrder = [];
    seqChecked = false;
  }
  initSequence(activeSeqId);

  function getAllLines() {
    const builtIn = Object.values(NCERT_CHAPTER_MODULES).flat();
    const custom = Object.values(bioCustomModules || {}).flat();
    return [...builtIn, ...custom];
  }

  function getAllWordSwaps() {
    const customSwaps = Object.values(bioCustomModules || {})
      .flat()
      .map((l) => l.wordSwapTrap)
      .filter(Boolean);
    return [...WORD_SWAP_DRILLS, ...customSwaps];
  }

  function render() {
    const allLines = getAllLines();
    const chaptersWithLines = BIOLOGY_CHAPTER_CATALOG.filter((c) =>
      allLines.some((l) => l.chapterId === c.id)
    );

    const masteredCount = allLines.filter((l) => bioLineMastery[l.id] === 'mastered').length;
    const pct = allLines.length ? Math.round((masteredCount / allLines.length) * 100) : 0;

    let bodyHtml = '';

    if (activeMode === 'cloze') {
      let deck = allLines.filter((l) => chapterFilter === 'all' || l.chapterId === chapterFilter);
      if (focusUnmastered) {
        const subset = deck.filter((l) => (bioLineMastery[l.id] || 'unseen') !== 'mastered');
        if (subset.length > 0) deck = subset;
      }
      if (clozeIdx >= deck.length) clozeIdx = 0;
      const line = deck[clozeIdx];
      const status = line ? bioLineMastery[line.id] || 'unseen' : 'unseen';

      bodyHtml = `
        <div class="flashcard-stage">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <select id="rev-cloze-chap" class="subject-select">
                <option value="all" ${chapterFilter === 'all' ? 'selected' : ''}>All Loaded Chapters (${allLines.length} lines)</option>
                ${chaptersWithLines
                  .map(
                    (c) => `<option value="${escapeHtml(c.id)}" ${chapterFilter === c.id ? 'selected' : ''}>${escapeHtml(c.label)}</option>`
                  )
                  .join('')}
              </select>
              <button type="button" class="btn-sm ${focusUnmastered ? 'btn-primary' : 'btn-outline'}" id="rev-focus-unmastered">
                ${focusUnmastered ? 'Focusing: Unmastered' : 'Filter: Unmastered Only'}
              </button>
            </div>
            <button type="button" class="btn-outline btn-sm" id="rev-cloze-shuffle">↻ Random Line</button>
          </div>

          ${
            !line
              ? `<div class="card" style="padding:24px;">No NCERT lines found for this filter.</div>`
              : `<article class="card flashcard-box">
                   <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                     <span class="pill-badge accent">Line ${clozeIdx + 1} of ${deck.length}</span>
                     <div style="display:flex; gap:6px; align-items:center;">
                       <span class="pill-badge">${escapeHtml(line.sectionTitle || 'NCERT')}</span>
                       <span class="pill-badge ${status === 'mastered' ? 'lg' : status === 'tricky' ? 'danger' : status === 'review' ? 'warn' : ''}">
                         ${escapeHtml(status.toUpperCase())}
                       </span>
                     </div>
                   </div>

                   <div class="bio-cloze-card-prompt">
                     ${renderClozePrompt(line.clozeText, clozeRevealed)}
                   </div>

                   ${
                     clozeRevealed
                       ? `<div class="callout-list">
                            <div class="callout-row"><span class="callout-key">Between the Lines:</span><span>${renderInlineMarkdown(line.betweenTheLines?.inference || '')}</span></div>
                            <div class="callout-row alert-exception"><span class="callout-key">NEET Trap:</span><span>${renderInlineMarkdown(line.betweenTheLines?.neetTrap || '')}</span></div>
                            <div class="callout-row"><span class="callout-key">Numbers:</span><span>${renderInlineMarkdown(line.betweenTheLines?.quantitative || '')}</span></div>
                          </div>`
                       : `<div class="callout-row" style="justify-content:center; color:var(--text-muted); padding:16px;">
                            Recall the missing NCERT terms and implied subtext before revealing.
                          </div>`
                   }

                   <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-top:auto; padding-top:12px; border-top:1px solid var(--border-subtle);">
                     <div style="display:flex; gap:8px;">
                       <button type="button" class="btn-outline" id="rev-cloze-prev">← Prev</button>
                       <button type="button" class="btn-primary" id="rev-cloze-reveal">${clozeRevealed ? 'Hide Answer' : 'Reveal Terms & Insights'}</button>
                       <button type="button" class="btn-outline" id="rev-cloze-next">Next →</button>
                     </div>
                     <div style="display:flex; gap:6px; flex-wrap:wrap;">
                       <button type="button" class="btn-outline btn-sm rev-grade-btn" data-grade="mastered" style="border-color:var(--chem-lg); color:var(--chem-lg);">✓ Mastered</button>
                       <button type="button" class="btn-outline btn-sm rev-grade-btn" data-grade="review" style="border-color:var(--chem-warn); color:var(--chem-warn);">↻ Review Soon</button>
                       <button type="button" class="btn-outline btn-sm rev-grade-btn" data-grade="tricky" style="border-color:var(--chem-danger); color:var(--chem-danger);">★ Tricky</button>
                     </div>
                   </div>
                 </article>`
          }
        </div>
      `;
    } else if (activeMode === 'word-swap') {
      const swaps = getAllWordSwaps().filter((w) => chapterFilter === 'all' || w.chapterId === chapterFilter);
      if (wsIdx >= swaps.length) wsIdx = 0;
      const item = swaps[wsIdx];
      const answered = wsChoice !== null;
      const isCorrect = answered && wsChoice === item?.isExactNcert;

      bodyHtml = `
        <div class="flashcard-stage">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
            <select id="rev-ws-chap" class="subject-select">
              <option value="all" ${chapterFilter === 'all' ? 'selected' : ''}>All Chapters (${getAllWordSwaps().length} Statements)</option>
              ${chaptersWithLines
                .map(
                  (c) => `<option value="${escapeHtml(c.id)}" ${chapterFilter === c.id ? 'selected' : ''}>${escapeHtml(c.label)}</option>`
                )
                .join('')}
            </select>
            <div style="display:flex; gap:8px; align-items:center;">
              <span class="pill-badge lg">Accuracy: ${wsScore.attempts ? Math.round((wsScore.correct / wsScore.attempts) * 100) : 0}% (${wsScore.correct}/${wsScore.attempts})</span>
              <span class="pill-badge warn">Streak: ${wsScore.streak}</span>
            </div>
          </div>

          ${
            !item
              ? `<div class="card" style="padding:24px;">No Word-Swap drills for this chapter filter yet.</div>`
              : `<article class="card flashcard-box">
                   <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                     <span class="pill-badge accent">Statement ${wsIdx + 1} of ${swaps.length}</span>
                     <span class="pill-badge">NTA Word-Swap Detector</span>
                   </div>

                   <div class="bio-wordswap-stem">
                     "${renderInlineMarkdown(item.statement)}"
                   </div>

                   <div style="display:flex; gap:12px; flex-wrap:wrap;">
                     <button type="button" class="btn-outline bio-ws-choice-btn ${answered && item.isExactNcert ? 'ws-ok' : ''}" data-ws-ans="true" ${answered ? 'disabled' : ''}>
                       ✓ 100% Exact NCERT (TRUE)
                     </button>
                     <button type="button" class="btn-outline bio-ws-choice-btn ${answered && !item.isExactNcert ? 'ws-ok' : ''}" data-ws-ans="false" ${answered ? 'disabled' : ''}>
                       ⚠ Contains NCERT Word-Swap Trap (FALSE)
                     </button>
                   </div>

                   ${
                     answered
                       ? `<div class="callout-list">
                            <div class="callout-row ${isCorrect ? '' : 'alert-exception'}" style="${isCorrect ? 'background:var(--chem-lg-soft);' : ''}">
                              <span class="callout-key">${isCorrect ? '✓ Spot On!' : '✕ Caught by Trap!'}</span>
                              <span>${renderInlineMarkdown(item.explanation)}</span>
                            </div>
                            ${
                              !item.isExactNcert
                                ? `<div class="bio-swap-diff">
                                     <span class="swap-bad">✕ Swapped: ${escapeHtml(item.swappedWord)}</span>
                                     <span class="swap-good">✓ True NCERT: ${escapeHtml(item.correctWord)}</span>
                                   </div>`
                                : ''
                            }
                          </div>`
                       : ''
                   }

                   <div style="display:flex; justify-content:space-between; margin-top:auto; padding-top:12px; border-top:1px solid var(--border-subtle);">
                     <button type="button" class="btn-outline" id="rev-ws-prev">← Prev Statement</button>
                     <button type="button" class="btn-primary" id="rev-ws-next">Next Statement →</button>
                   </div>
                 </article>`
          }
        </div>
      `;
    } else if (activeMode === 'sequencer') {
      const seq = PATHWAY_SEQUENCES.find((s) => s.id === activeSeqId) || PATHWAY_SEQUENCES[0];
      const isComplete = userOrder.length === seq.steps.length;
      const correctPositions = userOrder.filter((item, idx) => item.origIdx === idx).length;

      bodyHtml = `
        <div class="card" style="padding:20px; display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
            <div>
              <h2 style="margin:0 0 4px; font-size:1.15rem;">${escapeHtml(seq.title)}</h2>
              <p class="muted-note" style="margin:0;">${escapeHtml(seq.hint)}</p>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <select id="rev-seq-select" class="subject-select">
                ${PATHWAY_SEQUENCES.map(
                  (s) => `<option value="${escapeHtml(s.id)}" ${s.id === activeSeqId ? 'selected' : ''}>${escapeHtml(s.title)}</option>`
                ).join('')}
              </select>
              <button type="button" class="btn-outline btn-sm" id="rev-seq-reset">↻ Reshuffle</button>
            </div>
          </div>

          <div class="two-col-grid">
            <div class="bio-seq-col">
              <h3 style="margin:0 0 8px; font-size:0.95rem;">Scrambled Pathway Steps (Click in Order)</h3>
              <div class="bio-seq-list">
                ${
                  scrambledPool.length === 0
                    ? `<div class="muted-note" style="padding:14px;">All steps placed! Click "Verify Order" below.</div>`
                    : scrambledPool
                        .map(
                          (st, idx) => `
                          <button type="button" class="bio-seq-item" data-pick-pool="${idx}">
                            <span>+ ${renderInlineMarkdown(st.text)}</span>
                          </button>`
                        )
                        .join('')
                }
              </div>
            </div>

            <div class="bio-seq-col">
              <h3 style="margin:0 0 8px; font-size:0.95rem;">Your Ordered Sequence (${userOrder.length}/${seq.steps.length})</h3>
              <div class="bio-seq-list">
                ${
                  userOrder.length === 0
                    ? `<div class="muted-note" style="padding:14px;">Click steps on the left in biological order (1 → ${seq.steps.length}).</div>`
                    : userOrder
                        .map((st, idx) => {
                          const ok = seqChecked ? st.origIdx === idx : null;
                          return `
                            <button type="button" class="bio-seq-item placed ${ok === true ? 'seq-ok' : ok === false ? 'seq-err' : ''}" data-remove-placed="${idx}" title="Click to remove step">
                              <span class="option-letter">${idx + 1}</span>
                              <span style="flex:1;">${renderInlineMarkdown(st.text)}</span>
                              ${ok === false ? `<span class="pill-badge danger">Step #${st.origIdx + 1}</span>` : ''}
                            </button>`;
                        })
                        .join('')
                }
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; padding-top:8px; border-top:1px solid var(--border-subtle);">
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn-primary" id="rev-seq-check" ${!isComplete ? 'disabled' : ''}>
                Verify Pathway Order
              </button>
              <button type="button" class="btn-outline" id="rev-seq-show-ans">Reveal Correct Order</button>
            </div>
            ${
              seqChecked
                ? `<span class="pill-badge ${correctPositions === seq.steps.length ? 'lg' : 'warn'}">
                     Score: ${correctPositions} / ${seq.steps.length} steps in exact NCERT order
                   </span>`
                : ''
            }
          </div>
        </div>
      `;
    } else if (activeMode === 'snapshot') {
      const snapKeys = Object.keys(CHAPTER_REVISION_SNAPSHOTS);
      if (!CHAPTER_REVISION_SNAPSHOTS[snapshotChapterId]) snapshotChapterId = snapKeys[0];
      const snap = CHAPTER_REVISION_SNAPSHOTS[snapshotChapterId];

      bodyHtml = `
        <div class="card" style="padding:20px; display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
            <div>
              <h2 style="margin:0 0 4px; font-size:1.15rem;">${escapeHtml(snap.title)}</h2>
              <p class="muted-note" style="margin:0;">Every NCERT number, scientist, enzyme location, and NEET exam trap in one scannable sheet.</p>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <select id="rev-snap-select" class="subject-select">
                ${snapKeys
                  .map(
                    (k) => `<option value="${escapeHtml(k)}" ${k === snapshotChapterId ? 'selected' : ''}>${escapeHtml(CHAPTER_REVISION_SNAPSHOTS[k].title)}</option>`
                  )
                  .join('')}
              </select>
              <button type="button" class="btn-sm ${snapshotMasked ? 'btn-primary' : 'btn-outline'}" id="rev-snap-mask-btn">
                ${snapshotMasked ? '👁 Show All Values' : '🙈 Mask Values for Self-Test'}
              </button>
            </div>
          </div>

          <div class="bio-snapshot-grid">
            <div class="neet-callout-box">
              <h4>🔢 High-Yield NCERT Numbers &amp; Stoichiometry</h4>
              <div class="callout-list">
                ${snap.numbers
                  .map(
                    (item) => `
                    <div class="callout-row" style="justify-content:space-between; gap:12px;">
                      <span class="callout-key" style="white-space:normal;">${escapeHtml(item.label)}</span>
                      <span class="${snapshotMasked ? 'masked-token' : ''}" data-reveal-toggle style="text-align:right; font-weight:600;">${renderInlineMarkdown(item.value)}</span>
                    </div>`
                  )
                  .join('')}
              </div>
            </div>

            <div class="neet-callout-box">
              <h4>📍 Locations, Scientists &amp; NEET Traps</h4>
              <div class="callout-list">
                ${[...snap.scientists, ...snap.locationsAndTraps]
                  .map(
                    (item) => `
                    <div class="callout-row alert-warn" style="justify-content:space-between; gap:12px;">
                      <span class="callout-key" style="white-space:normal;">${escapeHtml(item.label)}</span>
                      <span class="${snapshotMasked ? 'masked-token' : ''}" data-reveal-toggle style="text-align:right; font-weight:600;">${renderInlineMarkdown(item.value)}</span>
                    </div>`
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>Biology Active Revision &amp; Recall Arena</h1>
          <p class="section-subtitle">
            Lock NCERT sentences into memory with Cloze active recall, NTA Word-Swap traps, Pathway Sequencers, and Chapter Cheat Sheets.
          </p>
        </div>
        <div style="min-width:220px;">
          <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; margin-bottom:4px;">
            <span>NCERT Line Mastery</span>
            <span>${masteredCount} / ${allLines.length} (${pct}%)</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
        </div>
      </div>

      <div class="explorer-toolbar" style="margin-bottom:16px;">
        <div class="mode-tabs" role="tablist">
          <button type="button" class="mode-tab-btn ${activeMode === 'cloze' ? 'active' : ''}" data-rev-mode="cloze">1. NCERT Line Cloze</button>
          <button type="button" class="mode-tab-btn ${activeMode === 'word-swap' ? 'active' : ''}" data-rev-mode="word-swap">2. Spot the Word-Swap Trap</button>
          <button type="button" class="mode-tab-btn ${activeMode === 'sequencer' ? 'active' : ''}" data-rev-mode="sequencer">3. Pathway Step-Sequencer</button>
          <button type="button" class="mode-tab-btn ${activeMode === 'snapshot' ? 'active' : ''}" data-rev-mode="snapshot">4. Chapter Revision Snapshot</button>
        </div>

        <button type="button" class="btn-outline btn-sm" id="rev-back-reader-btn">📖 Open NCERT Reader</button>
      </div>

      ${bodyHtml}
    `;

    // Wire mode switchers
    container.querySelectorAll('[data-rev-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeMode = btn.dataset.revMode;
        render();
      });
    });

    container.querySelector('#rev-back-reader-btn')?.addEventListener('click', () => {
      onJumpToReader(chapterFilter === 'all' ? 'bot-respiration' : chapterFilter);
    });

    // Cloze handlers
    if (activeMode === 'cloze') {
      const deck = allLines
        .filter((l) => chapterFilter === 'all' || l.chapterId === chapterFilter)
        .filter((l) => !focusUnmastered || (bioLineMastery[l.id] || 'unseen') !== 'mastered');
      const safeDeck = deck.length > 0 ? deck : allLines.filter((l) => chapterFilter === 'all' || l.chapterId === chapterFilter);
      const currentLine = safeDeck[clozeIdx];

      container.querySelector('#rev-cloze-chap')?.addEventListener('change', (e) => {
        chapterFilter = e.target.value;
        clozeIdx = 0;
        clozeRevealed = false;
        render();
      });
      container.querySelector('#rev-focus-unmastered')?.addEventListener('click', () => {
        focusUnmastered = !focusUnmastered;
        clozeIdx = 0;
        clozeRevealed = false;
        render();
      });
      container.querySelector('#rev-cloze-shuffle')?.addEventListener('click', () => {
        if (safeDeck.length > 0) {
          clozeIdx = Math.floor(Math.random() * safeDeck.length);
          clozeRevealed = false;
          render();
        }
      });
      container.querySelector('#rev-cloze-reveal')?.addEventListener('click', () => {
        clozeRevealed = !clozeRevealed;
        render();
      });
      container.querySelector('#rev-cloze-prev')?.addEventListener('click', () => {
        if (safeDeck.length > 0) {
          clozeIdx = (clozeIdx - 1 + safeDeck.length) % safeDeck.length;
          clozeRevealed = false;
          render();
        }
      });
      container.querySelector('#rev-cloze-next')?.addEventListener('click', () => {
        if (safeDeck.length > 0) {
          clozeIdx = (clozeIdx + 1) % safeDeck.length;
          clozeRevealed = false;
          render();
        }
      });
      container.querySelectorAll('.rev-grade-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (currentLine) {
            onUpdateLineMastery(currentLine.id, btn.dataset.grade);
            if (onToast) onToast(`Line marked as ${btn.dataset.grade}`);
            if (safeDeck.length > 0) clozeIdx = (clozeIdx + 1) % safeDeck.length;
            clozeRevealed = false;
            render();
          }
        });
      });
    }

    // Word-swap handlers
    if (activeMode === 'word-swap') {
      const swaps = getAllWordSwaps().filter((w) => chapterFilter === 'all' || w.chapterId === chapterFilter);
      const item = swaps[wsIdx];

      container.querySelector('#rev-ws-chap')?.addEventListener('change', (e) => {
        chapterFilter = e.target.value;
        wsIdx = 0;
        wsChoice = null;
        render();
      });
      container.querySelectorAll('[data-ws-ans]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (wsChoice !== null || !item) return;
          wsChoice = btn.dataset.wsAns === 'true';
          wsScore.attempts += 1;
          if (wsChoice === item.isExactNcert) {
            wsScore.correct += 1;
            wsScore.streak += 1;
          } else {
            wsScore.streak = 0;
          }
          render();
        });
      });
      container.querySelector('#rev-ws-prev')?.addEventListener('click', () => {
        if (swaps.length > 0) {
          wsIdx = (wsIdx - 1 + swaps.length) % swaps.length;
          wsChoice = null;
          render();
        }
      });
      container.querySelector('#rev-ws-next')?.addEventListener('click', () => {
        if (swaps.length > 0) {
          wsIdx = (wsIdx + 1) % swaps.length;
          wsChoice = null;
          render();
        }
      });
    }

    // Sequencer handlers
    if (activeMode === 'sequencer') {
      const seq = PATHWAY_SEQUENCES.find((s) => s.id === activeSeqId) || PATHWAY_SEQUENCES[0];

      container.querySelector('#rev-seq-select')?.addEventListener('change', (e) => {
        initSequence(e.target.value);
        render();
      });
      container.querySelector('#rev-seq-reset')?.addEventListener('click', () => {
        initSequence(activeSeqId);
        render();
      });
      container.querySelectorAll('[data-pick-pool]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.pickPool);
          const picked = scrambledPool.splice(idx, 1)[0];
          if (picked) userOrder.push(picked);
          seqChecked = false;
          render();
        });
      });
      container.querySelectorAll('[data-remove-placed]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.removePlaced);
          const removed = userOrder.splice(idx, 1)[0];
          if (removed) scrambledPool.push(removed);
          seqChecked = false;
          render();
        });
      });
      container.querySelector('#rev-seq-check')?.addEventListener('click', () => {
        seqChecked = true;
        render();
      });
      container.querySelector('#rev-seq-show-ans')?.addEventListener('click', () => {
        userOrder = seq.steps.map((text, origIdx) => ({ origIdx, text }));
        scrambledPool = [];
        seqChecked = true;
        render();
      });
    }

    // Snapshot handlers
    if (activeMode === 'snapshot') {
      container.querySelector('#rev-snap-select')?.addEventListener('change', (e) => {
        snapshotChapterId = e.target.value;
        render();
      });
      container.querySelector('#rev-snap-mask-btn')?.addEventListener('click', () => {
        snapshotMasked = !snapshotMasked;
        render();
      });
      container.querySelectorAll('[data-reveal-toggle]').forEach((el) => {
        el.addEventListener('click', () => {
          if (el.classList.contains('masked-token')) el.classList.toggle('revealed');
        });
      });
    }
  }

  render();
}
