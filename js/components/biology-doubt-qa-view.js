/**
 * Biology NCERT Doubt Tutor, Saved Doubt Notebook & Multi-Source Q&A Hub
 * - Context-aware NCERT Doubt Tutor (accepts anchored NCERT lines or Concept Setup stages)
 * - Persistent Saved Doubt Notebook (pinned/filtered/searchable in localStorage)
 * - Multi-Source Q&A Practice Arena:
 *     1. Curated "Between-the-Lines" NCERT Traps
 *     2. Official NEET PYQs + NTA Abhyas Botany & Zoology Bank
 *     3. Fresh Gemini AI "Between-the-Lines" Passage Question Generator
 */

import {
  BIOLOGY_CHAPTER_CATALOG,
  NCERT_CHAPTER_MODULES,
  BETWEEN_THE_LINES_QUESTIONS
} from '../data/biology-ncert-data.js';
import { PYQ_BANK } from '../data/pyq-bank.js';
import { ABHYAS_BANK } from '../data/abhyas-bank.js';
import { askBiologyNcertDoubt, generateBiologyBetweenTheLinesQuestions } from '../services/gemini.js';
import { renderMarkdown, renderInlineMarkdown, renderMathRichText, escapeHtml } from '../services/markdown.js';
import { getResolvedApiKey } from '../services/storage.js';

function renderBioQuestionText(text, isPyqOrAbhyas) {
  return isPyqOrAbhyas ? renderMathRichText(text) : renderMarkdown(text);
}

function renderBioOptionText(text, isPyqOrAbhyas) {
  return isPyqOrAbhyas ? renderMathRichText(text, { inline: true }) : renderInlineMarkdown(text);
}

export function renderBiologyDoubtQaView(
  container,
  {
    initialChapterId = 'bot-respiration',
    anchoredLine = null,
    anchoredSetupText = '',
    bioCustomModules = {},
    bioDoubtNotebook = [],
    quizStats = { attempted: 0, correct: 0, streak: 0 },
    onClearAnchor,
    onSaveDoubt,
    onTogglePinDoubt,
    onDeleteDoubt,
    onRecordAnswer,
    onOpenSettings,
    onToast
  }
) {
  let activeChapterId = initialChapterId || 'bot-respiration';
  let qaSource = 'btl'; // 'btl' | 'pyq-abhyas' | 'gemini'
  let qaChapterScope = initialChapterId || 'all';
  let aiQType = 'Assertion-Reason';
  let aiQCount = 5;
  let aiGenerating = false;
  let aiError = '';
  let aiQuestions = [];

  // Doubt Tutor chat state
  let doubtInput = '';
  let doubtLoading = false;
  let doubtError = '';
  let doubtThread = []; // [{ id, chapterId, ncertLineRef, question, answer, saved }]
  let notebookFilter = '';

  // Q&A interactive state
  let answers = {}; // { [qId]: selectedIndex }
  let eliminated = {}; // { [qId]: Set<number> }
  let qFollowUps = {}; // { [qId]: { loading, answer, question, saved } }

  const BIO_PYQ_ABHYAS = [...ABHYAS_BANK, ...PYQ_BANK]
    .filter((q) => q.subject === 'botany' || q.subject === 'zoology')
    .sort((a, b) => {
      if (a.source === 'ABHYAS' && b.source !== 'ABHYAS') return -1;
      if (b.source === 'ABHYAS' && a.source !== 'ABHYAS') return 1;
      return (Number(b.year) || 0) - (Number(a.year) || 0);
    });

  function getChapterLabel(chapId) {
    return BIOLOGY_CHAPTER_CATALOG.find((c) => c.id === chapId)?.label || chapId || 'NCERT Biology';
  }

  function getActiveChapterObj() {
    return BIOLOGY_CHAPTER_CATALOG.find((c) => c.id === activeChapterId) || BIOLOGY_CHAPTER_CATALOG[11];
  }

  function getChapterNcertContext(chapId) {
    const builtIn = NCERT_CHAPTER_MODULES[chapId] || [];
    const custom = Array.isArray(bioCustomModules[chapId]) ? bioCustomModules[chapId] : [];
    const all = [...builtIn, ...custom];
    return all.map((l) => `${l.ncertRef}: "${l.ncertText}" [Trap: ${l.betweenTheLines?.neetTrap || ''}]`).join('\n');
  }

  function getCurrentQuestionDeck() {
    if (qaSource === 'gemini') return aiQuestions;
    if (qaSource === 'pyq-abhyas') {
      const filtered = BIO_PYQ_ABHYAS.filter(
        (q) => qaChapterScope === 'all' || q.chapterId === qaChapterScope
      );
      return filtered.slice(0, 15);
    }
    const btlFiltered = BETWEEN_THE_LINES_QUESTIONS.filter(
      (q) => qaChapterScope === 'all' || q.chapterId === qaChapterScope
    );
    return btlFiltered.length > 0 ? btlFiltered : BETWEEN_THE_LINES_QUESTIONS;
  }

  function render() {
    const hasKey = Boolean(getResolvedApiKey());
    const chapObj = getActiveChapterObj();
    const deck = getCurrentQuestionDeck();
    const isPyqSource = qaSource === 'pyq-abhyas';

    const answeredCount = deck.filter((q) => answers[q.id] !== undefined).length;
    const correctCount = deck.filter((q) => answers[q.id] === q.correctIndex).length;

    const nbQuery = notebookFilter.trim().toLowerCase();
    const filteredNotebook = [...bioDoubtNotebook]
      .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))
      .filter((entry) => {
        if (!nbQuery) return true;
        return [entry.question, entry.answer, entry.ncertLineRef, entry.chapterId]
          .join(' ')
          .toLowerCase()
          .includes(nbQuery);
      });

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>NCERT Biology Doubt Notebook &amp; Q&amp;A Hub</h1>
          <p class="section-subtitle">
            Resolve "why" and "between-the-lines" doubts anchored in NCERT, save them to your revision notebook, and practice curated traps + ${BIO_PYQ_ABHYAS.length} NEET Biology PYQs &amp; Abhyas Qs.
          </p>
        </div>
        <div class="stats-strip">
          <span class="pill-badge accent">Saved Doubts: ${bioDoubtNotebook.length}</span>
          <span class="pill-badge lg">Lifetime Quiz Accuracy: ${quizStats.attempted ? Math.round((quizStats.correct / quizStats.attempted) * 100) : 0}%</span>
          <button type="button" class="btn-outline btn-sm" id="bio-qa-key-btn">${hasKey ? 'Gemini Key Ready' : 'Set GEMINI_API_KEY'}</button>
        </div>
      </div>

      <div class="bio-doubt-qa-layout">
        <!-- LEFT COLUMN: Doubt Solver + Saved Doubt Notebook -->
        <section class="bio-doubt-col">
          <div class="card predictor-card">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
              <div>
                <span class="pill-badge accent">NCERT Mentor</span>
                <h2 style="margin:4px 0 0; font-size:1.15rem;">Ask Any Biology NCERT Doubt</h2>
              </div>
              <select id="bio-doubt-chap-sel" class="subject-select" style="max-width:240px;">
                ${BIOLOGY_CHAPTER_CATALOG.map(
                  (c) => `<option value="${escapeHtml(c.id)}" ${c.id === activeChapterId ? 'selected' : ''}>${escapeHtml(c.label)}</option>`
                ).join('')}
              </select>
            </div>

            ${
              anchoredLine
                ? `<div class="callout-row alert-warn" style="justify-content:space-between; align-items:flex-start;">
                     <div>
                       <div class="callout-key">Anchored NCERT Line (${escapeHtml(anchoredLine.ncertRef)}):</div>
                       <div style="font-size:0.84rem; margin-top:4px;">"${renderInlineMarkdown(anchoredLine.ncertText)}"</div>
                     </div>
                     <button type="button" class="btn-ghost btn-sm" id="bio-clear-anchor-btn" title="Clear line context">✕</button>
                   </div>`
                : anchoredSetupText
                  ? `<div class="callout-row alert-warn" style="justify-content:space-between; align-items:flex-start;">
                       <div>
                         <div class="callout-key">Anchored Concept Setup Stage:</div>
                         <div style="font-size:0.84rem; margin-top:4px;">${renderInlineMarkdown(anchoredSetupText)}</div>
                       </div>
                       <button type="button" class="btn-ghost btn-sm" id="bio-clear-anchor-btn" title="Clear setup context">✕</button>
                     </div>`
                  : ''
            }

            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn-outline btn-sm bio-quick-doubt-chip" data-chip="Explain what NCERT means 'between the lines' here and WHY this mechanism happens.">Explain "Between the Lines"</button>
              <button type="button" class="btn-outline btn-sm bio-quick-doubt-chip" data-chip="What exact word-swap or Assertion-Reason traps can NTA make from this topic?">NTA Traps &amp; A/R</button>
              <button type="button" class="btn-outline btn-sm bio-quick-doubt-chip" data-chip="Give a crystal-clear comparison / memory hook strictly accurate to NCERT.">Compare &amp; Memory Hook</button>
            </div>

            <div class="form-field">
              <textarea id="bio-doubt-input" rows="3" placeholder="Type your doubt (e.g. 'Why does NCERT say Krebs cycle is aerobic even though O2 is not used in any TCA step?' or 'Why is RQ of fat 0.7?')...">${escapeHtml(doubtInput)}</textarea>
            </div>

            ${doubtError ? `<div class="settings-feedback err">${escapeHtml(doubtError)}</div>` : ''}

            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
              <span class="muted-note" style="font-size:0.78rem;">Grounded in ${escapeHtml(chapObj.label)}</span>
              <button type="button" class="btn-primary" id="bio-submit-doubt-btn" ${doubtLoading ? 'disabled' : ''}>
                ${doubtLoading ? 'Solving with NCERT Anchor...' : 'Solve Doubt with Gemini'}
              </button>
            </div>

            ${
              doubtThread.length > 0
                ? `<div class="bio-doubt-thread">
                     ${doubtThread
                       .map(
                         (item) => `
                         <div class="bio-doubt-msg">
                           <div style="font-weight:700; font-size:0.86rem; margin-bottom:6px; color:var(--accent-primary);">
                             Q: ${escapeHtml(item.question)}
                           </div>
                           <div class="md-content" style="font-size:0.86rem;">${renderMarkdown(item.answer)}</div>
                           <div style="display:flex; justify-content:flex-end; margin-top:8px;">
                             <button type="button" class="btn-outline btn-sm bio-save-thread-btn" data-thread-id="${escapeHtml(item.id)}" ${item.saved ? 'disabled' : ''}>
                               ${item.saved ? '✓ Saved in Doubt Notebook' : '📌 Save to Doubt Notebook'}
                             </button>
                           </div>
                         </div>`
                       )
                       .join('')}
                   </div>`
                : ''
            }
          </div>

          <!-- Persistent Saved Doubt Notebook -->
          <div class="card predictor-card">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
              <h2 style="margin:0; font-size:1.1rem;">📓 Saved Doubt Notebook (${bioDoubtNotebook.length})</h2>
              <input type="search" id="bio-nb-search" value="${escapeHtml(notebookFilter)}" placeholder="Search saved doubts..." style="padding:6px 10px; border-radius:8px; border:1px solid var(--border-strong); background:var(--bg-subtle); font-size:0.82rem; min-width:180px;" />
            </div>

            ${
              filteredNotebook.length === 0
                ? `<p class="muted-note">No saved doubts yet. Solve a doubt above (or on any MCQ below) and click <strong>Save to Doubt Notebook</strong> to keep your personalized NCERT mistake &amp; doubt log here.</p>`
                : `<div class="bio-notebook-list">
                     ${filteredNotebook
                       .map(
                         (d) => `
                         <article class="bio-notebook-item ${d.pinned ? 'is-pinned' : ''}">
                           <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                             <span class="pill-badge accent">${escapeHtml(d.ncertLineRef || d.chapterId || 'NCERT')}</span>
                             <div style="display:flex; gap:4px;">
                               <button type="button" class="btn-ghost btn-sm bio-pin-doubt-btn" data-doubt-id="${escapeHtml(d.id)}" title="Pin important doubt">${d.pinned ? '📌 Pinned' : 'Pin'}</button>
                               <button type="button" class="btn-danger-ghost btn-sm bio-del-doubt-btn" data-doubt-id="${escapeHtml(d.id)}" title="Delete doubt">✕</button>
                             </div>
                           </div>
                           <div style="font-weight:700; font-size:0.88rem; margin:6px 0;">${escapeHtml(d.question)}</div>
                           <div class="md-content" style="font-size:0.84rem; color:var(--text-secondary);">${renderMarkdown(d.answer)}</div>
                         </article>`
                       )
                       .join('')}
                   </div>`
            }
          </div>
        </section>

        <!-- RIGHT COLUMN: Multi-Source NCERT Q&A Arena -->
        <section class="bio-qa-col">
          <div class="card predictor-card">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
              <div>
                <span class="pill-badge lg">NCERT Practice Arena</span>
                <h2 style="margin:4px 0 0; font-size:1.15rem;">Chapter Q&amp;A (Between-the-Lines + NEET PYQs + AI)</h2>
              </div>
              <div style="font-size:0.86rem; font-weight:700;">
                Session Score: <span style="color:var(--chem-lg);">${correctCount} / ${answeredCount}</span>
              </div>
            </div>

            <div class="mode-tabs" style="width:100%; display:grid; grid-template-columns:repeat(3, minmax(0, 1fr));">
              <button type="button" class="mode-tab-btn ${qaSource === 'btl' ? 'active' : ''}" data-qa-src="btl">Between-the-Lines Traps (${BETWEEN_THE_LINES_QUESTIONS.length})</button>
              <button type="button" class="mode-tab-btn ${qaSource === 'pyq-abhyas' ? 'active' : ''}" data-qa-src="pyq-abhyas">NEET PYQ + Abhyas (${BIO_PYQ_ABHYAS.length})</button>
              <button type="button" class="mode-tab-btn ${qaSource === 'gemini' ? 'active' : ''}" data-qa-src="gemini">Generate AI Questions</button>
            </div>

            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
              <select id="bio-qa-chap-scope" class="subject-select" style="flex:1; min-width:220px;">
                <option value="all" ${qaChapterScope === 'all' ? 'selected' : ''}>All Biology Chapters</option>
                ${BIOLOGY_CHAPTER_CATALOG.map(
                  (c) => `<option value="${escapeHtml(c.id)}" ${qaChapterScope === c.id ? 'selected' : ''}>${escapeHtml(c.label)}</option>`
                ).join('')}
              </select>

              ${
                qaSource === 'gemini'
                  ? `<select id="bio-qa-ai-type" class="subject-select">
                       <option value="Assertion-Reason" ${aiQType === 'Assertion-Reason' ? 'selected' : ''}>Assertion – Reason</option>
                       <option value="Statement I & II" ${aiQType === 'Statement I & II' ? 'selected' : ''}>Statement I &amp; II</option>
                       <option value="Pathway / What-If Perturbation" ${aiQType === 'Pathway / What-If Perturbation' ? 'selected' : ''}>What-If Perturbation</option>
                       <option value="How Many Statements" ${aiQType === 'How Many Statements' ? 'selected' : ''}>How Many Statements Correct</option>
                     </select>
                     <select id="bio-qa-ai-count" class="subject-select">
                       <option value="3" ${aiQCount === 3 ? 'selected' : ''}>3 Qs</option>
                       <option value="5" ${aiQCount === 5 ? 'selected' : ''}>5 Qs</option>
                       <option value="8" ${aiQCount === 8 ? 'selected' : ''}>8 Qs</option>
                     </select>
                     <button type="button" class="btn-primary btn-sm" id="bio-qa-gen-btn" ${aiGenerating ? 'disabled' : ''}>
                       ${aiGenerating ? 'Generating...' : 'Generate BTL Set'}
                     </button>`
                  : ''
              }
            </div>

            ${aiError ? `<div class="settings-feedback err">${escapeHtml(aiError)}</div>` : ''}
          </div>

          <!-- Questions Stack -->
          ${
            deck.length === 0
              ? `<div class="card" style="padding:28px; text-align:center;">
                   <h3 style="margin:0 0 8px;">${qaSource === 'gemini' ? 'Generate a fresh "Between-the-Lines" NCERT quiz above' : 'No questions found in this chapter filter'}</h3>
                   <p class="muted-note">Select a specific chapter (or "All Biology Chapters") and click Generate BTL Set or switch to NEET PYQ + Abhyas.</p>
                 </div>`
              : `<div style="display:flex; flex-direction:column; gap:14px;">
                   ${deck
                     .map((q, qIdx) => {
                       const chosen = answers[q.id];
                       const isAnswered = chosen !== undefined;
                       const elimSet = eliminated[q.id] || new Set();
                       const follow = qFollowUps[q.id];
                       const tagText = q.examTag || q.type || q.source || 'NCERT';

                       return `
                         <article class="card question-card">
                           <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                             <span class="pill-badge accent">Q${qIdx + 1} · ${escapeHtml(tagText)}</span>
                             <span class="pill-badge">${escapeHtml(q.ncertRef || getChapterLabel(q.chapterId))}</span>
                           </div>

                           <div class="question-stem md-content" style="font-size:0.96rem; font-weight:600; line-height:1.55;">
                             ${renderBioQuestionText(q.question, isPyqSource)}
                           </div>

                           <div class="option-list">
                             ${(q.options || [])
                               .map((opt, oIdx) => {
                                 const letter = ['A', 'B', 'C', 'D'][oIdx];
                                 let cls = 'option-btn';
                                 if (isAnswered) {
                                   if (oIdx === q.correctIndex) cls += ' correct';
                                   else if (oIdx === chosen) cls += ' incorrect';
                                 } else if (elimSet.has(oIdx)) {
                                   cls += ' eliminated';
                                 }

                                 return `
                                   <div style="display:flex; gap:6px; align-items:stretch;">
                                     <button type="button" class="${cls}" data-bio-qid="${escapeHtml(q.id)}" data-bio-oidx="${oIdx}" ${isAnswered ? 'disabled' : ''}>
                                       <span class="option-letter">${letter}</span>
                                       <span style="flex:1;">${renderBioOptionText(opt, isPyqSource)}</span>
                                     </button>
                                     ${
                                       !isAnswered
                                         ? `<button type="button" class="btn-ghost btn-sm bio-elim-btn" data-bio-qid="${escapeHtml(q.id)}" data-bio-oidx="${oIdx}" title="Eliminate option">✕</button>`
                                         : ''
                                     }
                                   </div>`;
                               })
                               .join('')}
                           </div>

                           ${
                             isAnswered
                               ? `<div class="callout-list" style="margin-top:4px;">
                                    <div class="callout-row ${chosen === q.correctIndex ? '' : 'alert-exception'}" style="${chosen === q.correctIndex ? 'background:var(--chem-lg-soft);' : ''}">
                                      <span class="callout-key">${chosen === q.correctIndex ? '✓ Correct:' : '✕ Incorrect:'}</span>
                                      <div class="md-content" style="flex:1;">${renderBioQuestionText(q.explanation || 'Check NCERT explanation.', isPyqSource)}</div>
                                    </div>

                                    <div style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;">
                                      <input type="text" class="bio-q-followup-input" data-bio-qid="${escapeHtml(q.id)}" placeholder="Ask Gemini a follow-up doubt on this question..." style="flex:1; min-width:200px; padding:7px 10px; border-radius:8px; border:1px solid var(--border-strong); background:var(--bg-surface); font-size:0.84rem;" />
                                      <button type="button" class="btn-outline btn-sm bio-q-followup-btn" data-bio-qid="${escapeHtml(q.id)}">Ask Doubt</button>
                                    </div>

                                    ${
                                      follow
                                        ? `<div class="tutor-reply md-content">
                                             ${renderMarkdown(follow.answer)}
                                             ${
                                               !follow.loading
                                                 ? `<div style="display:flex; justify-content:flex-end; margin-top:8px;">
                                                      <button type="button" class="btn-outline btn-sm bio-save-qfollow-btn" data-bio-qid="${escapeHtml(q.id)}" ${follow.saved ? 'disabled' : ''}>
                                                        ${follow.saved ? '✓ Saved to Doubt Notebook' : '📌 Save to Doubt Notebook'}
                                                      </button>
                                                    </div>`
                                                 : ''
                                             }
                                           </div>`
                                        : ''
                                    }
                                  </div>`
                               : ''
                           }
                         </article>`;
                     })
                     .join('')}
                 </div>`
          }
        </section>
      </div>
    `;

    // Wire Left Column (Doubt Solver & Notebook)
    container.querySelector('#bio-qa-key-btn')?.addEventListener('click', onOpenSettings);
    container.querySelector('#bio-doubt-chap-sel')?.addEventListener('change', (e) => {
      activeChapterId = e.target.value;
      render();
    });
    container.querySelector('#bio-clear-anchor-btn')?.addEventListener('click', () => {
      onClearAnchor();
    });
    container.querySelector('#bio-doubt-input')?.addEventListener('input', (e) => {
      doubtInput = e.target.value;
    });

    const submitDoubt = async (questionText) => {
      const qTxt = String(questionText || '').trim();
      if (!qTxt) return;
      if (!getResolvedApiKey()) {
        doubtError = 'Please configure your GEMINI_API_KEY first.';
        render();
        return;
      }
      doubtError = '';
      doubtLoading = true;
      render();

      try {
        const lineCtx = anchoredLine
          ? `${anchoredLine.ncertRef}: "${anchoredLine.ncertText}"\nHidden Inference: ${anchoredLine.betweenTheLines?.inference}\nTrap: ${anchoredLine.betweenTheLines?.neetTrap}`
          : getChapterNcertContext(activeChapterId);
        const answer = await askBiologyNcertDoubt({
          chapterLabel: chapObj.label,
          ncertLineContext: lineCtx,
          setupContext: anchoredSetupText,
          userDoubt: qTxt,
          history: doubtThread
        });
        doubtThread.push({
          id: `dbt-${Date.now().toString(36)}`,
          chapterId: activeChapterId,
          ncertLineRef: anchoredLine?.ncertRef || chapObj.label,
          question: qTxt,
          answer,
          saved: false
        });
        doubtInput = '';
      } catch (err) {
        doubtError = err.message;
      } finally {
        doubtLoading = false;
        render();
      }
    };

    container.querySelectorAll('.bio-quick-doubt-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        submitDoubt(btn.dataset.chip);
      });
    });

    container.querySelector('#bio-submit-doubt-btn')?.addEventListener('click', () => {
      submitDoubt(doubtInput);
    });

    container.querySelectorAll('.bio-save-thread-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const entry = doubtThread.find((t) => t.id === btn.dataset.threadId);
        if (entry && !entry.saved) {
          entry.saved = true;
          onSaveDoubt({
            id: `nb-${Date.now().toString(36)}`,
            chapterId: entry.chapterId,
            ncertLineRef: entry.ncertLineRef,
            question: entry.question,
            answer: entry.answer,
            createdAt: new Date().toISOString(),
            pinned: false
          });
          if (onToast) onToast('Saved to Doubt Notebook!');
          render();
        }
      });
    });

    container.querySelector('#bio-nb-search')?.addEventListener('input', (e) => {
      notebookFilter = e.target.value;
      render();
    });

    container.querySelectorAll('.bio-pin-doubt-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        onTogglePinDoubt(btn.dataset.doubtId);
      });
    });

    container.querySelectorAll('.bio-del-doubt-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        onDeleteDoubt(btn.dataset.doubtId);
      });
    });

    // Wire Right Column (Q&A Arena)
    container.querySelectorAll('[data-qa-src]').forEach((btn) => {
      btn.addEventListener('click', () => {
        qaSource = btn.dataset.qaSrc;
        aiError = '';
        render();
      });
    });

    container.querySelector('#bio-qa-chap-scope')?.addEventListener('change', (e) => {
      qaChapterScope = e.target.value;
      render();
    });

    container.querySelector('#bio-qa-ai-type')?.addEventListener('change', (e) => {
      aiQType = e.target.value;
    });
    container.querySelector('#bio-qa-ai-count')?.addEventListener('change', (e) => {
      aiQCount = Number(e.target.value);
    });

    container.querySelector('#bio-qa-gen-btn')?.addEventListener('click', async () => {
      if (!getResolvedApiKey()) {
        aiError = 'Please configure your GEMINI_API_KEY first (or switch to Between-the-Lines Traps / PYQs).';
        render();
        return;
      }
      const targetChapId = qaChapterScope === 'all' ? activeChapterId : qaChapterScope;
      const targetChap = BIOLOGY_CHAPTER_CATALOG.find((c) => c.id === targetChapId) || chapObj;
      aiGenerating = true;
      aiError = '';
      render();
      try {
        aiQuestions = await generateBiologyBetweenTheLinesQuestions({
          chapterId: targetChap.id,
          chapterLabel: targetChap.label,
          ncertPassageContext: getChapterNcertContext(targetChap.id),
          questionType: aiQType,
          count: aiQCount
        });
      } catch (err) {
        aiError = err.message;
      } finally {
        aiGenerating = false;
        render();
      }
    });

    container.querySelectorAll('.option-btn[data-bio-qid]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.bioQid;
        const oidx = Number(btn.dataset.bioOidx);
        if (answers[qid] !== undefined) return;
        answers[qid] = oidx;
        const q = deck.find((item) => item.id === qid);
        if (q) onRecordAnswer(oidx === q.correctIndex);
        render();
      });
    });

    container.querySelectorAll('.bio-elim-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.bioQid;
        const oidx = Number(btn.dataset.bioOidx);
        if (!eliminated[qid]) eliminated[qid] = new Set();
        if (eliminated[qid].has(oidx)) eliminated[qid].delete(oidx);
        else eliminated[qid].add(oidx);
        render();
      });
    });

    container.querySelectorAll('.bio-q-followup-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const qid = btn.dataset.bioQid;
        const q = deck.find((item) => item.id === qid);
        const inp = container.querySelector(`.bio-q-followup-input[data-bio-qid="${qid}"]`);
        const promptText = inp?.value?.trim();
        if (!q || !promptText) return;

        qFollowUps[qid] = { loading: true, question: promptText, answer: 'Asking Gemini NCERT tutor...', saved: false };
        render();
        try {
          const reply = await askBiologyNcertDoubt({
            chapterLabel: q.ncertRef || q.chapterId || chapObj.label,
            ncertLineContext: `Question:\n${q.question}\nOptions:\n${(q.options || []).join('\n')}\nOfficial Explanation: ${q.explanation}`,
            userDoubt: promptText
          });
          qFollowUps[qid] = { loading: false, question: promptText, answer: reply, saved: false };
        } catch (err) {
          qFollowUps[qid] = { loading: false, question: promptText, answer: `⚠ ${err.message}`, saved: false };
        }
        render();
      });
    });

    container.querySelectorAll('.bio-save-qfollow-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.bioQid;
        const q = deck.find((item) => item.id === qid);
        const follow = qFollowUps[qid];
        if (follow && !follow.saved) {
          follow.saved = true;
          onSaveDoubt({
            id: `nb-${Date.now().toString(36)}`,
            chapterId: q?.chapterId || activeChapterId,
            ncertLineRef: q?.ncertRef || chapObj.label,
            question: follow.question,
            answer: follow.answer,
            createdAt: new Date().toISOString(),
            pinned: false
          });
          if (onToast) onToast('Saved question doubt to Doubt Notebook!');
          render();
        }
      });
    });
  }

  render();
}
