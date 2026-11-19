/**
 * Gemini AI Custom Question Lab & Offline NEET Question Bank Runner
 * Generates custom Single-Choice MCQs, Assertion-Reason, Statement I/II, and
 * Multi-Step A -> B -> C Synthesis Roadmaps via GEMINI_API_KEY, plus offline fallback.
 */

import { OFFLINE_QUESTIONS } from '../data/offline-questions.js';
import { generateCustomQuestions, callGeminiApi } from '../services/gemini.js';
import { renderMarkdown, renderInlineMarkdown } from '../services/markdown.js';
import { loadGeminiConfig, getResolvedModelId } from '../services/storage.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderGeminiQuizView(
  container,
  { subject, reactions, mastery, quizStats, onRecordAnswer, onOpenSettings }
) {
  const cfg = loadGeminiConfig();
  let sourceMode = cfg.apiKey ? 'gemini' : 'offline';
  let selectedChapter = 'all';
  let questionType = 'Mixed NEET Pattern';
  let difficulty = 'NEET Tricky Exception';
  let count = 5;
  let focusWeak = true;
  let customTopicPrompt = '';
  let isGenerating = false;
  let errorMsg = '';

  // Active quiz state
  let questions = [...OFFLINE_QUESTIONS].slice(0, 5);
  let answers = {}; // { [qId]: selectedOptionIdx }
  let eliminated = {}; // { [qId]: Set<number> }
  let followUps = {}; // { [qId]: { loading: boolean, answer: string } }

  function filterOfflineQuestions() {
    let pool = [...OFFLINE_QUESTIONS];
    if (selectedChapter !== 'all') {
      const filtered = pool.filter((q) => q.chapter === selectedChapter);
      if (filtered.length > 0) pool = filtered;
    }
    if (questionType !== 'Mixed NEET Pattern') {
      const typed = pool.filter((q) => q.type.toLowerCase().includes(questionType.toLowerCase().split(' ')[0]));
      if (typed.length > 0) pool = typed;
    }
    // Shuffle
    pool.sort(() => Math.random() - 0.5);
    return pool.slice(0, Math.min(count, pool.length));
  }

  function render() {
    const liveCfg = loadGeminiConfig();
    const hasKey = Boolean(liveCfg.apiKey);
    const modelId = getResolvedModelId(liveCfg);

    const chapters = subject.chapters || [];
    const totalAnswered = Object.keys(answers).length;
    const sessionCorrect = questions.filter((q) => answers[q.id] === q.correctIndex).length;

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>Gemini AI Custom Question Lab</h1>
          <p class="section-subtitle">
            Generate fresh NEET MCQs, Assertion-Reason, Statement I/II, and Multi-Step A→B→C Roadmaps using your <code>GEMINI_API_KEY</code>, or practice offline anytime.
          </p>
        </div>

        <div class="stats-strip">
          <span class="pill-badge accent">Model: ${escapeHtml(modelId)}</span>
          <span class="pill-badge lg">Lifetime Accuracy: ${quizStats.attempted ? Math.round((quizStats.correct / quizStats.attempted) * 100) : 0}% (${quizStats.correct}/${quizStats.attempted})</span>
          <span class="pill-badge warn">Streak: ${quizStats.streak}</span>
        </div>
      </div>

      <div class="quiz-layout">
        <aside class="card quiz-config-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2 style="margin:0; font-size:1.05rem;">Quiz Generator Setup</h2>
            <button type="button" class="btn-outline btn-sm" id="quiz-open-key-btn">${hasKey ? 'Key Connected' : 'Set API Key'}</button>
          </div>

          <div class="form-field">
            <label for="quiz-source-select">Question Source</label>
            <select id="quiz-source-select">
              <option value="gemini" ${sourceMode === 'gemini' ? 'selected' : ''}>Generate Fresh via Gemini API</option>
              <option value="offline" ${sourceMode === 'offline' ? 'selected' : ''}>Built-in Offline NEET Bank (${OFFLINE_QUESTIONS.length} Qs)</option>
            </select>
          </div>

          <div class="form-field">
            <label for="quiz-chapter-select">Syllabus / Chapter Scope</label>
            <select id="quiz-chapter-select">
              <option value="all" ${selectedChapter === 'all' ? 'selected' : ''}>All Chapters in ${escapeHtml(subject.shortName)}</option>
              ${chapters
                .map(
                  (c) => `<option value="${escapeHtml(c.id)}" ${selectedChapter === c.id ? 'selected' : ''}>${escapeHtml(c.label)}</option>`
                )
                .join('')}
            </select>
          </div>

          <div class="form-field">
            <label for="quiz-type-select">Question Format</label>
            <select id="quiz-type-select">
              <option value="Mixed NEET Pattern" ${questionType === 'Mixed NEET Pattern' ? 'selected' : ''}>Mixed NEET Pattern</option>
              <option value="MCQ" ${questionType === 'MCQ' ? 'selected' : ''}>Single-Choice NEET MCQ</option>
              <option value="Assertion-Reason" ${questionType === 'Assertion-Reason' ? 'selected' : ''}>Assertion – Reason</option>
              <option value="Statement I & II" ${questionType === 'Statement I & II' ? 'selected' : ''}>Statement I &amp; II</option>
              <option value="Multi-Step Roadmap" ${questionType === 'Multi-Step Roadmap' ? 'selected' : ''}>Multi-Step A → B → C Roadmap</option>
            </select>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label for="quiz-diff-select">Difficulty</label>
              <select id="quiz-diff-select">
                <option value="NCERT Direct" ${difficulty === 'NCERT Direct' ? 'selected' : ''}>NCERT Direct</option>
                <option value="NEET Tricky Exception" ${difficulty === 'NEET Tricky Exception' ? 'selected' : ''}>NEET Tricky Exception</option>
                <option value="Multi-Concept Rank Booster" ${difficulty === 'Multi-Concept Rank Booster' ? 'selected' : ''}>Rank Booster</option>
              </select>
            </div>
            <div class="form-field">
              <label for="quiz-count-select">Questions</label>
              <select id="quiz-count-select">
                <option value="3" ${count === 3 ? 'selected' : ''}>3 Questions</option>
                <option value="5" ${count === 5 ? 'selected' : ''}>5 Questions</option>
                <option value="8" ${count === 8 ? 'selected' : ''}>8 Questions</option>
                <option value="10" ${count === 10 ? 'selected' : ''}>10 Questions</option>
              </select>
            </div>
          </div>

          <div class="form-field">
            <label for="quiz-custom-prompt">Custom Focus Topic (Optional)</label>
            <textarea id="quiz-custom-prompt" rows="2" placeholder="e.g. Leaving groups + SN1 carbocation shifts + Phenol bromination traps">${escapeHtml(customTopicPrompt)}</textarea>
          </div>

          <label style="display:flex; align-items:center; gap:8px; font-size:0.84rem; cursor:pointer;">
            <input type="checkbox" id="quiz-focus-weak" ${focusWeak ? 'checked' : ''} />
            <span>Prioritize my Tricky / Needs Review reactions</span>
          </label>

          ${errorMsg ? `<div class="settings-feedback err">${escapeHtml(errorMsg)}</div>` : ''}

          <button type="button" class="btn-primary" id="start-generate-quiz-btn" ${isGenerating ? 'disabled' : ''}>
            ${
              isGenerating
                ? 'Generating with Gemini...'
                : sourceMode === 'gemini'
                  ? 'Generate Custom AI Quiz'
                  : 'Load Offline NEET Quiz'
            }
          </button>
        </aside>

        <section style="display:flex; flex-direction:column; gap:16px;">
          <div class="card" style="padding:14px 18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <strong>Current Session:</strong> ${questions.length} Questions
              ${questions[0]?.isAiGenerated ? '<span class="pill-badge accent" style="margin-left:8px;">Fresh Gemini AI Set</span>' : '<span class="pill-badge" style="margin-left:8px;">Offline NEET Bank</span>'}
            </div>
            <div style="font-size:0.88rem; font-weight:700;">
              Score: <span style="color:var(--chem-lg);">${sessionCorrect} / ${totalAnswered}</span> answered
            </div>
          </div>

          ${questions
            .map((q, qIdx) => {
              const chosen = answers[q.id];
              const isAnswered = chosen !== undefined;
              const elimSet = eliminated[q.id] || new Set();
              const follow = followUps[q.id];

              return `
                <article class="card question-card">
                  <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span class="pill-badge accent">Q${qIdx + 1} • ${escapeHtml(q.type)}</span>
                    <div style="display:flex; gap:6px; align-items:center;">
                      <span class="pill-badge">${escapeHtml(q.difficulty)}</span>
                      <span style="font-size:0.74rem; color:var(--text-muted);">Tip: click ✕ to strike out options</span>
                    </div>
                  </div>

                  <div class="question-stem md-content" style="font-size:0.98rem; font-weight:600; line-height:1.55;">${renderMarkdown(q.question)}</div>

                  <div class="option-list">
                    ${q.options
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
                            <button type="button" class="${cls}" data-qid="${escapeHtml(q.id)}" data-oidx="${oIdx}" ${isAnswered ? 'disabled' : ''}>
                              <span class="option-letter">${letter}</span>
                              <span style="flex:1;">${renderInlineMarkdown(opt)}</span>
                            </button>
                            ${
                              !isAnswered
                                ? `<button type="button" class="btn-ghost btn-sm elim-btn" data-qid="${escapeHtml(q.id)}" data-oidx="${oIdx}" title="Eliminate / strike out option">✕</button>`
                                : ''
                            }
                          </div>`;
                      })
                      .join('')}
                  </div>

                  ${
                    isAnswered
                      ? `<div class="callout-list" style="margin-top:4px;">
                           <div class="callout-row ${chosen === q.correctIndex ? 'alert-warn' : 'alert-exception'}" style="${chosen === q.correctIndex ? 'background:var(--chem-lg-soft);' : ''}">
                             <span class="callout-key">${chosen === q.correctIndex ? '✓ Correct:' : '✕ Incorrect:'}</span>
                             <div class="md-content" style="flex:1;">${renderMarkdown(q.explanation)}</div>
                           </div>

                           <div style="display:flex; gap:8px; margin-top:6px; flex-wrap:wrap;">
                             <input type="text" class="followup-input" data-qid="${escapeHtml(q.id)}" placeholder="Ask Gemini why another option is wrong or a follow-up doubt..." style="flex:1; min-width:220px; padding:7px 10px; border-radius:8px; border:1px solid var(--border-strong); background:var(--bg-surface); font-size:0.84rem;" />
                             <button type="button" class="btn-outline btn-sm followup-ask-btn" data-qid="${escapeHtml(q.id)}">Ask Gemini</button>
                           </div>
                           ${follow ? `<div class="tutor-reply md-content">${renderMarkdown(follow.answer)}</div>` : ''}
                         </div>`
                      : ''
                  }
                </article>`;
            })
            .join('')}
        </section>
      </div>
    `;

    // Event wiring
    container.querySelector('#quiz-open-key-btn').addEventListener('click', onOpenSettings);
    container.querySelector('#quiz-source-select').addEventListener('change', (e) => {
      sourceMode = e.target.value;
      errorMsg = '';
      render();
    });
    container.querySelector('#quiz-chapter-select').addEventListener('change', (e) => {
      selectedChapter = e.target.value;
    });
    container.querySelector('#quiz-type-select').addEventListener('change', (e) => {
      questionType = e.target.value;
    });
    container.querySelector('#quiz-diff-select').addEventListener('change', (e) => {
      difficulty = e.target.value;
    });
    container.querySelector('#quiz-count-select').addEventListener('change', (e) => {
      count = Number(e.target.value);
    });
    container.querySelector('#quiz-custom-prompt').addEventListener('input', (e) => {
      customTopicPrompt = e.target.value;
    });
    container.querySelector('#quiz-focus-weak').addEventListener('change', (e) => {
      focusWeak = e.target.checked;
    });

    container.querySelector('#start-generate-quiz-btn').addEventListener('click', async () => {
      errorMsg = '';
      if (sourceMode === 'offline') {
        questions = filterOfflineQuestions();
        answers = {};
        eliminated = {};
        followUps = {};
        render();
        return;
      }

      if (!loadGeminiConfig().apiKey) {
        errorMsg = 'Please configure your GEMINI_API_KEY first (or switch to Built-in Offline NEET Bank).';
        render();
        return;
      }

      isGenerating = true;
      render();
      try {
        const chapterObj = chapters.find((c) => c.id === selectedChapter);
        const chaptersText =
          selectedChapter === 'all'
            ? chapters.map((c) => c.label).join('; ') || subject.name
            : chapterObj?.label || selectedChapter;

        const weakTitles = focusWeak
          ? reactions
              .filter((r) => mastery[r.id] === 'tricky' || mastery[r.id] === 'review')
              .slice(0, 8)
              .map((r) => r.title)
          : [];

        const generated = await generateCustomQuestions({
          subjectName: subject.name,
          chaptersText,
          questionType,
          difficulty,
          count,
          weakReactionTitles: weakTitles,
          customTopicPrompt
        });

        questions = generated;
        answers = {};
        eliminated = {};
        followUps = {};
      } catch (err) {
        errorMsg = err.message;
      } finally {
        isGenerating = false;
        render();
      }
    });

    // Option selection
    container.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const oidx = Number(btn.dataset.oidx);
        if (answers[qid] !== undefined) return;
        answers[qid] = oidx;
        const q = questions.find((item) => item.id === qid);
        if (q) onRecordAnswer(oidx === q.correctIndex);
        render();
      });
    });

    // Option elimination
    container.querySelectorAll('.elim-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const oidx = Number(btn.dataset.oidx);
        if (!eliminated[qid]) eliminated[qid] = new Set();
        if (eliminated[qid].has(oidx)) eliminated[qid].delete(oidx);
        else eliminated[qid].add(oidx);
        render();
      });
    });

    // Inline Gemini follow-up
    container.querySelectorAll('.followup-ask-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const qid = btn.dataset.qid;
        const q = questions.find((item) => item.id === qid);
        const input = container.querySelector(`.followup-input[data-qid="${qid}"]`);
        const promptText = input?.value?.trim();
        if (!q || !promptText) return;

        followUps[qid] = { loading: true, answer: 'Asking Gemini...' };
        render();
        try {
          const reply = await callGeminiApi({
            systemInstruction: 'You are a concise NEET Organic Chemistry tutor. Clarify the student’s question about this MCQ directly.',
            prompt: `Question:\n${q.question}\nOptions:\n${q.options.join('\n')}\nOfficial Explanation: ${q.explanation}\n\nStudent Doubt: ${promptText}`
          });
          followUps[qid] = { loading: false, answer: reply };
        } catch (err) {
          followUps[qid] = { loading: false, answer: `⚠ ${err.message}` };
        }
        render();
      });
    });
  }

  render();
}
