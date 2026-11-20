/**
 * NEET (UG) 2027 NTA / TCS iON CBT Test Center & Full-Screen Exam Portal.
 *
 * Includes:
 *  - Hub: Pre-Built Full & Part Mocks, Year-Wise Official Papers (2016–2026),
 *    Custom Part/Full Test Builder (Physics/Chemistry/Botany/Zoology or combined Biology),
 *    PDF Question & Diagram Cropper Studio launcher, and Past Attempts / Mistake Re-Tester.
 *  - Full-Screen Official NTA CBT Portal:
 *    - Built-in Portal Dark Mode toggle (🌙 Dark / ☀ Classic NTA Light) + Diagram Contrast Plate
 *    - Official NTA Instructions & Candidate Declaration Screen
 *    - Live Countdown Timer, Section Tabs, Question Paper Modal, 5-State Shaped Question Palette
 *    - Save & Next / Clear / Save & Mark for Review / Mark for Review & Next / Back / Next / Submit
 *    - Auto-Save Active Session in IndexedDB for crash/refresh recovery
 *    - Official NTA Scorecard (with Section B 10-of-15 & multi-key support) & Solution Review + Gemini Tutor
 */

import {
  CBT_SECTIONS,
  NEET_SYLLABUS,
  CHAPTER_INDEX,
  PREBUILT_TESTS,
  PAPER_REPLAYS,
  NEET_MARKING,
  getChapters
} from '../data/neet-syllabus.js';
import { PYQ_BANK } from '../data/pyq-bank.js';
import { ABHYAS_BANK } from '../data/abhyas-bank.js';
import { NEET_PAPERS } from '../data/neet-papers.js';
import { generateCbtQuestions, askCbtTutor } from '../services/gemini.js';
import { getResolvedApiKey, getResolvedModelId } from '../services/storage.js';
import { renderMathRichText, renderMarkdown } from '../services/markdown.js';
import {
  getCustomQuestions,
  deleteCustomBatch,
  getActiveSession,
  saveActiveSession,
  clearActiveSession,
  getTestAttempts,
  saveTestAttempt,
  deleteTestAttempt,
  exportCbtDataJson,
  importCbtQuestionsJson
} from '../services/cbt-storage.js';
import { openPdfCropStudio } from './pdf-crop-modal.js';

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtClock(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function fmtShortTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${String(rem).padStart(2, '0')}s`;
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function maybeShuffleQuestionOptions(q) {
  if (q.imageOnly || !Array.isArray(q.options) || q.options.length !== 4 || q.correctIndex == null) return q;
  if (Array.isArray(q.correctIndices) && q.correctIndices.length > 1) return q;
  if (Array.isArray(q.optionImages) && q.optionImages.some(Boolean)) return q;
  const joined = q.options.join(' ').toLowerCase();
  if (/(both \(?a\)? and \(?b\)?|both statement|all of the|none of the|\(1\) and \(2\)|only a and b|a-i,|a-ii,)/.test(joined)) {
    return q;
  }
  const indices = shuffleArray([0, 1, 2, 3]);
  const newOpts = indices.map((i) => q.options[i]);
  const newCorrect = indices.indexOf(q.correctIndex);
  return { ...q, options: newOpts, correctIndex: newCorrect };
}

function getDisplaySectionId(question, sectionMode) {
  if (sectionMode === '3tab' && (question.subject === 'botany' || question.subject === 'zoology')) {
    return 'biology';
  }
  if (question.mergedBiology) return 'biology';
  return question.subject;
}

function getSectionsForQuestions(questions, sectionMode) {
  const present = new Set(questions.map((q) => getDisplaySectionId(q, sectionMode)));
  if (sectionMode === '3tab' || present.has('biology')) {
    const defs = [
      { id: 'physics', label: 'Physics', short: 'PHY' },
      { id: 'chemistry', label: 'Chemistry', short: 'CHE' },
      { id: 'biology', label: 'Biology', short: 'BIO' }
    ];
    return defs.filter((s) => present.has(s.id));
  }
  return CBT_SECTIONS.filter((s) => present.has(s.id));
}

function isCorrectSelection(q, chosenIdx) {
  if (chosenIdx == null) return null;
  if (Array.isArray(q.correctIndices) && q.correctIndices.length > 0) {
    return q.correctIndices.includes(chosenIdx);
  }
  if (q.correctIndex == null) return null;
  return chosenIdx === q.correctIndex;
}

/** Official NTA evaluation: both 'answered' and 'answered-review' are evaluated. */
function isEvaluatedState(state) {
  return state === 'answered' || state === 'answered-review';
}

function evaluateAttempt({ questions, responses, states, perQuestionSec, marking, sectionMode }) {
  const secList = getSectionsForQuestions(questions, sectionMode);
  const bySection = Object.fromEntries(
    secList.map((s) => [
      s.id,
      { id: s.id, label: s.label, total: 0, attempted: 0, correct: 0, wrong: 0, unattempted: 0, keyMissing: 0, marks: 0, maxMarks: 0, timeSec: 0 }
    ])
  );

  // Track Section B attempt limit (max 10 attempted per subject if paper has Section B)
  const secBAttemptedCount = {};
  const questionOutcomes = [];

  questions.forEach((q, idx) => {
    const secKey = getDisplaySectionId(q, sectionMode);
    const bucket = bySection[secKey];
    const qState = states[q.id] || 'not-visited';
    const rawChosen = isEvaluatedState(qState) ? responses[q.id] : null;
    const secTime = perQuestionSec[q.id] || 0;
    bucket.total += 1;
    bucket.timeSec += secTime;

    const hasKey = (Array.isArray(q.correctIndices) && q.correctIndices.length > 0) || q.correctIndex != null;
    if (hasKey && q.section !== 'B') {
      bucket.maxMarks += marking.correct;
    }

    let status = 'unattempted'; // 'correct' | 'wrong' | 'unattempted' | 'ignored-secB' | 'key-missing'
    let marksAwarded = 0;

    if (rawChosen != null) {
      if (q.section === 'B') {
        secBAttemptedCount[q.subject] = (secBAttemptedCount[q.subject] || 0) + 1;
        if (secBAttemptedCount[q.subject] > 10) {
          status = 'ignored-secB';
        }
      }
      if (status !== 'ignored-secB') {
        bucket.attempted += 1;
        if (!hasKey) {
          status = 'key-missing';
          bucket.keyMissing += 1;
        } else if (isCorrectSelection(q, rawChosen)) {
          status = 'correct';
          marksAwarded = marking.correct;
          bucket.correct += 1;
          bucket.marks += marking.correct;
        } else {
          status = 'wrong';
          marksAwarded = marking.incorrect;
          bucket.wrong += 1;
          bucket.marks += marking.incorrect;
        }
      }
    } else {
      bucket.unattempted += 1;
    }

    questionOutcomes.push({
      index: idx,
      qId: q.id,
      sectionId: secKey,
      chosenIndex: rawChosen,
      qState,
      status,
      marksAwarded,
      timeSec: secTime
    });
  });

  // For Section B papers (15 Qs -> max 10 evaluated = 40 marks per subject)
  secList.forEach((s) => {
    const secBCount = questions.filter((q) => getDisplaySectionId(q, sectionMode) === s.id && q.section === 'B').length;
    if (secBCount > 0) {
      bySection[s.id].maxMarks += Math.min(10, secBCount) * marking.correct;
    }
  });

  const totals = Object.values(bySection).reduce(
    (acc, b) => ({
      total: acc.total + b.total,
      attempted: acc.attempted + b.attempted,
      correct: acc.correct + b.correct,
      wrong: acc.wrong + b.wrong,
      unattempted: acc.unattempted + b.unattempted,
      keyMissing: acc.keyMissing + b.keyMissing,
      marks: acc.marks + b.marks,
      maxMarks: acc.maxMarks + b.maxMarks,
      timeSec: acc.timeSec + b.timeSec
    }),
    { total: 0, attempted: 0, correct: 0, wrong: 0, unattempted: 0, keyMissing: 0, marks: 0, maxMarks: 0, timeSec: 0 }
  );

  return { bySection, totals, questionOutcomes };
}

/** SVG / CSS badge for the 5 official NTA Question Palette shapes. */
function renderPaletteShapeHtml(status, labelText = '') {
  return `<span class="nta-shape nta-shape-${esc(status)}" aria-hidden="true">${esc(labelText)}</span>`;
}

export function renderNtaCbtView(
  container,
  { initialCbtTheme = 'light', onChangeCbtTheme, onOpenSettings, onToast = () => {}, onPortalActiveChange = () => {} }
) {
  let hubTab = 'prebuilt'; // 'prebuilt' | 'builder' | 'pdf' | 'history'
  let customQuestions = [];
  let activeSavedSession = null;
  let pastAttempts = [];

  // Portal Theme ('light' | 'dark') & Diagram plate contrast mode
  let portalTheme = initialCbtTheme === 'dark' ? 'dark' : 'light';
  let brightDiagramsInDark = true;

  // Customize Modal State for Pre-built tests
  let customizeTemplate = null;

  // Custom Test Builder State
  const builder = {
    title: 'Custom NEET 2027 Part Test',
    sectionMode: '4tab', // '4tab' | '3tab'
    durationMin: 60,
    markingCorrect: 4,
    markingIncorrect: -1,
    perSubject: { physics: 15, chemistry: 15, botany: 15, zoology: 15 },
    biologyCount: 30,
    includeLegacy: false,
    shuffleQuestions: true,
    shuffleOptions: true,
    sources: { PYQ: true, ABHYAS: true, CUSTOM: true, AI: false },
    aiStyle: 'abhyas', // 'abhyas' | 'pyq' | 'new-pattern'
    aiDifficulty: 'NEET level',
    aiSaveToBank: true,
    expandedSubject: 'physics',
    selectedChapters: new Set(
      Object.values(NEET_SYLLABUS)
        .flat()
        .filter((c) => !c.legacy)
        .map((c) => c.id)
    ),
    isBuilding: false,
    buildError: '',
    buildStatus: ''
  };

  // Fullscreen NTA Portal State
  let portalState = null; // null | { phase: 'instructions' | 'active' | 'review', ... }
  let timerInterval = null;
  let lastAutoSaveTs = 0;
  let showPaperModal = false;
  let showSubmitModal = false;
  let showMobilePalette = false;
  let lightboxImageUrl = null;
  let reviewFilter = 'all'; // 'all' | 'wrong' | 'unattempted' | 'correct' | 'marked'
  let tutorResponses = {}; // { [qId]: { loading, text, error } }

  const portalRoot = document.getElementById('nta-cbt-fullscreen-root');

  async function refreshStorageData() {
    const [cust, sess, attempts] = await Promise.all([
      getCustomQuestions(),
      getActiveSession(),
      getTestAttempts()
    ]);
    customQuestions = cust;
    activeSavedSession = sess;
    pastAttempts = attempts;
    renderHub();
  }

  function getCombinedPool(sources, { yearMin = null } = {}) {
    const pool = [];
    if (sources.PYQ) {
      for (const q of PYQ_BANK) {
        if (yearMin && (q.year || 0) < yearMin) continue;
        pool.push(q);
      }
    }
    if (sources.ABHYAS) {
      pool.push(...ABHYAS_BANK);
    }
    if (sources.CUSTOM) {
      pool.push(...customQuestions);
    }
    return pool;
  }

  function getEligiblePoolForSubject(subject, { chaptersSet, includeLegacy, sources, yearMin = null }) {
    const all = getCombinedPool(sources, { yearMin });
    const targetSubs = subject === 'biology' ? ['botany', 'zoology'] : [subject];
    return all.filter((q) => {
      if (!targetSubs.includes(q.subject)) return false;
      if (q.chapterId) {
        const chMeta = CHAPTER_INDEX[q.chapterId];
        if (chMeta?.legacy && !includeLegacy) return false;
        if (chaptersSet && !chaptersSet.has(q.chapterId)) return false;
      } else if (chaptersSet) {
        // Include untagged PYQs/PDFs only when at least half of that subject's chapters are checked
        const avail = getChapters(q.subject, { includeLegacy }).map((c) => c.id);
        const selectedCnt = avail.filter((id) => chaptersSet.has(id)).length;
        if (selectedCnt < Math.max(1, Math.floor(avail.length * 0.5))) return false;
      }
      return true;
    });
  }

  function assembleQuestionsFromTemplate(tpl, customOverride = null) {
    const perSubj = customOverride?.perSubject || tpl.perSubject;
    const durationMin = customOverride?.durationMin || tpl.durationMin;
    const sourcesObj = {
      PYQ: tpl.sources.includes('PYQ'),
      ABHYAS: tpl.sources.includes('ABHYAS'),
      CUSTOM: tpl.sources.includes('CUSTOM')
    };

    let allowedChapters = null;
    if (tpl.scope === 'class11' || tpl.scope === 'class12') {
      const cls = tpl.scope === 'class11' ? 11 : 12;
      allowedChapters = new Set(
        Object.values(NEET_SYLLABUS)
          .flat()
          .filter((c) => !c.legacy && c.classLevel === cls)
          .map((c) => c.id)
      );
    } else if (tpl.scope && Array.isArray(tpl.scope.chapters)) {
      allowedChapters = new Set(tpl.scope.chapters);
    } else {
      allowedChapters = new Set(
        Object.values(NEET_SYLLABUS)
          .flat()
          .filter((c) => !c.legacy)
          .map((c) => c.id)
      );
    }

    const picked = [];
    for (const sec of CBT_SECTIONS) {
      const want = Number(perSubj[sec.id] || 0);
      if (want <= 0) continue;
      const pool = shuffleArray(
        getEligiblePoolForSubject(sec.id, {
          chaptersSet: allowedChapters,
          includeLegacy: false,
          sources: sourcesObj,
          yearMin: tpl.yearMin || null
        })
      );
      picked.push(...pool.slice(0, want).map(maybeShuffleQuestionOptions));
    }
    return {
      title: tpl.title,
      durationMin,
      sectionMode: '4tab',
      marking: { ...NEET_MARKING },
      questions: picked
    };
  }

  function assembleYearPaper(paperMeta) {
    if (paperMeta.kind === 'image') {
      const qs = [...(NEET_PAPERS[paperMeta.id] || [])];
      return {
        title: paperMeta.title,
        durationMin: paperMeta.durationMin,
        sectionMode: paperMeta.year === 2024 ? '4tab' : '3tab',
        marking: { ...NEET_MARKING },
        questions: qs
      };
    }
    const order = { physics: 0, chemistry: 1, botany: 2, zoology: 3 };
    const qs = PYQ_BANK.filter((q) => q.year === paperMeta.year).sort(
      (a, b) => (order[a.subject] ?? 9) - (order[b.subject] ?? 9) || (a.qNo || 0) - (b.qNo || 0)
    );
    return {
      title: paperMeta.title,
      durationMin: paperMeta.durationMin,
      sectionMode: '4tab',
      marking: { ...NEET_MARKING },
      questions: qs
    };
  }

  async function launchCustomBuilderTest() {
    builder.buildError = '';
    builder.buildStatus = '';
    const wantPerSubject =
      builder.sectionMode === '3tab'
        ? { physics: builder.perSubject.physics, chemistry: builder.perSubject.chemistry, biology: builder.biologyCount }
        : { ...builder.perSubject };

    const totalWanted = Object.values(wantPerSubject).reduce((a, b) => a + Number(b || 0), 0);
    if (totalWanted <= 0) {
      builder.buildError = 'Set at least 1 question across Physics, Chemistry, or Biology.';
      renderHub();
      return;
    }

    const useOfflineSources = builder.sources.PYQ || builder.sources.ABHYAS || builder.sources.CUSTOM;
    const useAi = builder.sources.AI;
    if (!useOfflineSources && !useAi) {
      builder.buildError = 'Select at least one Question Source (PYQs, NTA Abhyas, My Bank, or Gemini AI).';
      renderHub();
      return;
    }
    if (useAi && !getResolvedApiKey()) {
      builder.buildError = 'Gemini AI generation is checked, but no GEMINI_API_KEY is active. Add your key in "Gemini API" or uncheck Gemini AI.';
      renderHub();
      return;
    }

    builder.isBuilding = true;
    renderHub();

    try {
      const finalQuestions = [];
      const newlyGeneratedAi = [];

      const subjectKeys =
        builder.sectionMode === '3tab' ? ['physics', 'chemistry', 'biology'] : ['physics', 'chemistry', 'botany', 'zoology'];

      for (const sKey of subjectKeys) {
        const want = Number(wantPerSubject[sKey] || 0);
        if (want <= 0) continue;

        let localPicked = [];
        if (useOfflineSources) {
          const pool = getEligiblePoolForSubject(sKey, {
            chaptersSet: builder.selectedChapters,
            includeLegacy: builder.includeLegacy,
            sources: builder.sources
          });
          const ordered = builder.shuffleQuestions ? shuffleArray(pool) : pool;
          const takeLocal = useAi ? Math.max(0, Math.min(ordered.length, Math.floor(want * 0.55))) : Math.min(ordered.length, want);
          localPicked = ordered.slice(0, takeLocal);
        }

        const aiNeeded = useAi ? Math.max(0, want - localPicked.length) : 0;
        let aiPicked = [];
        if (aiNeeded > 0) {
          const targetSubj = sKey === 'biology' ? 'botany' : sKey;
          const chapterLabels = (sKey === 'biology'
            ? [...getChapters('botany', { includeLegacy: builder.includeLegacy }), ...getChapters('zoology', { includeLegacy: builder.includeLegacy })]
            : getChapters(targetSubj, { includeLegacy: builder.includeLegacy })
          )
            .filter((c) => builder.selectedChapters.has(c.id))
            .map((c) => c.label);

          // Generate in batches of up to 15 so JSON stays crisp and accurate
          let remaining = aiNeeded;
          while (remaining > 0) {
            const batchCnt = Math.min(15, remaining);
            builder.buildStatus = `Generating ${batchCnt} ${sKey.toUpperCase()} question(s) via ${getResolvedModelId()}...`;
            renderHub();
            const gen = await generateCbtQuestions({
              subject: sKey === 'biology' ? (remaining % 2 === 0 ? 'botany' : 'zoology') : sKey,
              chapterLabels,
              count: batchCnt,
              style: builder.aiStyle,
              difficulty: builder.aiDifficulty
            });
            aiPicked.push(...gen);
            newlyGeneratedAi.push(...gen);
            remaining -= batchCnt;
          }
        }

        let combinedSubj = [...localPicked, ...aiPicked];
        if (builder.shuffleQuestions) combinedSubj = shuffleArray(combinedSubj);
        if (builder.shuffleOptions) combinedSubj = combinedSubj.map(maybeShuffleQuestionOptions);
        finalQuestions.push(...combinedSubj);
      }

      if (newlyGeneratedAi.length > 0 && builder.aiSaveToBank) {
        const { saveCustomQuestions } = await import('../services/cbt-storage.js');
        await saveCustomQuestions(newlyGeneratedAi, {
          batchName: `${builder.title.trim() || 'AI Test'} (${newlyGeneratedAi.length} AI Qs)`
        });
        customQuestions = await getCustomQuestions();
      }

      if (finalQuestions.length === 0) {
        builder.buildError = 'No questions matched your selected chapters and sources. Select more chapters or enable Gemini AI.';
        builder.isBuilding = false;
        builder.buildStatus = '';
        renderHub();
        return;
      }

      builder.isBuilding = false;
      builder.buildStatus = '';
      openPortalWithTest({
        title: builder.title.trim() || 'Custom NEET 2027 Test',
        durationMin: Math.max(1, Number(builder.durationMin) || 60),
        sectionMode: builder.sectionMode,
        marking: {
          correct: Number(builder.markingCorrect) || 4,
          incorrect: Number(builder.markingIncorrect) ?? -1,
          unattempted: 0
        },
        questions: finalQuestions
      });
    } catch (err) {
      builder.buildError = `Could not build test: ${err.message}`;
      builder.isBuilding = false;
      builder.buildStatus = '';
      renderHub();
    }
  }

  /* ==================== FULL-SCREEN NTA PORTAL LIFECYCLE ==================== */

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      if (!portalState || portalState.phase !== 'active' || showSubmitModal) return;
      const curQ = portalState.questions[portalState.currentIndex];
      if (curQ) {
        portalState.perQuestionSec[curQ.id] = (portalState.perQuestionSec[curQ.id] || 0) + 1;
      }
      portalState.timeRemainingSec = Math.max(0, portalState.timeRemainingSec - 1);

      const clockEl = portalRoot.querySelector('#nta-timer-value');
      if (clockEl) {
        clockEl.textContent = fmtClock(portalState.timeRemainingSec);
        clockEl.classList.toggle('timer-warn', portalState.timeRemainingSec <= 900 && portalState.timeRemainingSec > 300);
        clockEl.classList.toggle('timer-crit', portalState.timeRemainingSec <= 300);
      }
      const qTimeEl = portalRoot.querySelector('#nta-q-timer');
      if (qTimeEl && curQ) {
        qTimeEl.textContent = fmtClock(portalState.perQuestionSec[curQ.id] || 0).slice(3);
      }

      // Persist session every 5 seconds
      const now = Date.now();
      if (now - lastAutoSaveTs >= 5000) {
        lastAutoSaveTs = now;
        persistActivePortalSession();
      }

      if (portalState.timeRemainingSec <= 0) {
        stopTimer();
        finalizeAndSubmitTest(true);
      }
    }, 1000);
  }

  function persistActivePortalSession() {
    if (!portalState || portalState.phase !== 'active') return;
    saveActiveSession({
      title: portalState.title,
      durationMin: portalState.durationMin,
      sectionMode: portalState.sectionMode,
      marking: portalState.marking,
      questions: portalState.questions,
      responses: portalState.responses,
      states: portalState.states,
      perQuestionSec: portalState.perQuestionSec,
      currentIndex: portalState.currentIndex,
      activeSectionId: portalState.activeSectionId,
      timeRemainingSec: portalState.timeRemainingSec,
      startedAt: portalState.startedAt
    }).catch(() => {});
  }

  function openPortalWithTest(testConfig) {
    if (!testConfig.questions || testConfig.questions.length === 0) {
      onToast('No questions available for this test configuration.');
      return;
    }
    const sections = getSectionsForQuestions(testConfig.questions, testConfig.sectionMode || '4tab');
    const states = {};
    testConfig.questions.forEach((q) => {
      states[q.id] = 'not-visited';
    });

    portalState = {
      phase: 'instructions',
      declarationChecked: false,
      title: testConfig.title,
      durationMin: testConfig.durationMin || 180,
      sectionMode: testConfig.sectionMode || '4tab',
      marking: testConfig.marking || { ...NEET_MARKING },
      questions: testConfig.questions,
      sections,
      responses: {},
      draftChoice: null,
      states,
      perQuestionSec: {},
      currentIndex: 0,
      activeSectionId: sections[0]?.id || 'physics',
      timeRemainingSec: (testConfig.durationMin || 180) * 60,
      startedAt: Date.now()
    };
    showPaperModal = false;
    showSubmitModal = false;
    showMobilePalette = false;
    onPortalActiveChange(true);
    renderPortal();
  }

  function resumeSavedSession(sess) {
    const sections = getSectionsForQuestions(sess.questions, sess.sectionMode || '4tab');
    portalState = {
      phase: 'active',
      declarationChecked: true,
      title: sess.title,
      durationMin: sess.durationMin,
      sectionMode: sess.sectionMode || '4tab',
      marking: sess.marking || { ...NEET_MARKING },
      questions: sess.questions,
      sections,
      responses: sess.responses || {},
      draftChoice: (sess.responses || {})[sess.questions[sess.currentIndex || 0]?.id] ?? null,
      states: sess.states || {},
      perQuestionSec: sess.perQuestionSec || {},
      currentIndex: sess.currentIndex || 0,
      activeSectionId: sess.activeSectionId || sections[0]?.id || 'physics',
      timeRemainingSec: sess.timeRemainingSec ?? sess.durationMin * 60,
      startedAt: sess.startedAt || Date.now()
    };
    onPortalActiveChange(true);
    renderPortal();
    startTimer();
  }

  function closePortal({ keepSessionSaved = true } = {}) {
    stopTimer();
    if (keepSessionSaved && portalState?.phase === 'active') {
      persistActivePortalSession();
      onToast('Test paused & saved. You can resume anytime from the Test Center!');
    }
    portalState = null;
    showPaperModal = false;
    showSubmitModal = false;
    lightboxImageUrl = null;
    if (portalRoot) {
      portalRoot.hidden = true;
      portalRoot.innerHTML = '';
    }
    onPortalActiveChange(false);
    refreshStorageData();
  }

  function beginActiveExamFromInstructions() {
    if (!portalState) return;
    portalState.phase = 'active';
    portalState.startedAt = Date.now();
    const firstQ = portalState.questions[0];
    if (firstQ) {
      portalState.states[firstQ.id] = 'not-answered';
      portalState.activeSectionId = getDisplaySectionId(firstQ, portalState.sectionMode);
      portalState.draftChoice = portalState.responses[firstQ.id] ?? null;
    }
    persistActivePortalSession();
    renderPortal();
    startTimer();
  }

  function goToQuestion(idx) {
    if (!portalState || idx < 0 || idx >= portalState.questions.length) return;
    portalState.currentIndex = idx;
    const q = portalState.questions[idx];
    portalState.activeSectionId = getDisplaySectionId(q, portalState.sectionMode);
    if (portalState.states[q.id] === 'not-visited') {
      portalState.states[q.id] = 'not-answered';
    }
    portalState.draftChoice = portalState.responses[q.id] ?? null;
    persistActivePortalSession();
    renderPortal();
  }

  function advanceToNextQuestion() {
    if (!portalState) return;
    const nextIdx = portalState.currentIndex + 1;
    if (nextIdx < portalState.questions.length) {
      goToQuestion(nextIdx);
    } else {
      persistActivePortalSession();
      renderPortal();
    }
  }

  function handleSaveAndNext() {
    if (!portalState) return;
    const q = portalState.questions[portalState.currentIndex];
    if (portalState.draftChoice != null) {
      portalState.responses[q.id] = portalState.draftChoice;
      portalState.states[q.id] = 'answered';
    } else {
      delete portalState.responses[q.id];
      portalState.states[q.id] = 'not-answered';
    }
    advanceToNextQuestion();
  }

  function handleSaveAndMarkReview() {
    if (!portalState) return;
    const q = portalState.questions[portalState.currentIndex];
    if (portalState.draftChoice != null) {
      portalState.responses[q.id] = portalState.draftChoice;
      portalState.states[q.id] = 'answered-review';
    } else {
      delete portalState.responses[q.id];
      portalState.states[q.id] = 'review';
    }
    advanceToNextQuestion();
  }

  function handleMarkForReviewAndNext() {
    if (!portalState) return;
    const q = portalState.questions[portalState.currentIndex];
    if (portalState.responses[q.id] != null) {
      portalState.states[q.id] = 'answered-review';
    } else {
      portalState.states[q.id] = 'review';
    }
    advanceToNextQuestion();
  }

  function handleClearResponse() {
    if (!portalState) return;
    const q = portalState.questions[portalState.currentIndex];
    delete portalState.responses[q.id];
    portalState.draftChoice = null;
    portalState.states[q.id] = 'not-answered';
    persistActivePortalSession();
    renderPortal();
  }

  async function finalizeAndSubmitTest(isAutoSubmit = false) {
    if (!portalState) return;
    stopTimer();
    showSubmitModal = false;
    showPaperModal = false;

    const evaluation = evaluateAttempt({
      questions: portalState.questions,
      responses: portalState.responses,
      states: portalState.states,
      perQuestionSec: portalState.perQuestionSec,
      marking: portalState.marking,
      sectionMode: portalState.sectionMode
    });

    const totalDurationSec = portalState.durationMin * 60;
    const timeSpentSec = Math.max(1, totalDurationSec - portalState.timeRemainingSec);

    const attempt = await saveTestAttempt({
      title: portalState.title,
      durationMin: portalState.durationMin,
      timeSpentSec,
      sectionMode: portalState.sectionMode,
      marking: portalState.marking,
      questions: portalState.questions,
      responses: portalState.responses,
      states: portalState.states,
      perQuestionSec: portalState.perQuestionSec,
      evaluation,
      autoSubmitted: isAutoSubmit
    });

    await clearActiveSession();
    activeSavedSession = null;
    reviewFilter = 'all';
    tutorResponses = {};

    portalState = {
      phase: 'review',
      attempt,
      title: attempt.title,
      questions: attempt.questions,
      responses: attempt.responses,
      states: attempt.states,
      perQuestionSec: attempt.perQuestionSec,
      marking: attempt.marking,
      sectionMode: attempt.sectionMode,
      evaluation: attempt.evaluation,
      sections: getSectionsForQuestions(attempt.questions, attempt.sectionMode)
    };
    renderPortal();
  }

  function togglePortalTheme() {
    portalTheme = portalTheme === 'dark' ? 'light' : 'dark';
    onChangeCbtTheme?.(portalTheme);
    renderPortal();
  }

  /* ==================== PORTAL RENDERING ==================== */

  function renderPortalHeader(rightControlsHtml = '') {
    return `
      <header class="nta-topbar">
        <div class="nta-brand-strip">
          <span class="nta-emblem" aria-hidden="true">NTA</span>
          <div>
            <div class="nta-brand-title">NATIONAL TESTING AGENCY · NEET (UG) 2027 CBT</div>
            <div class="nta-brand-sub">${esc(portalState.title)}</div>
          </div>
        </div>
        <div class="nta-top-actions">
          ${rightControlsHtml}
          ${
            portalTheme === 'dark'
              ? `<button type="button" class="nta-hdr-btn" id="nta-toggle-diagram-plate" title="Toggle bright paper backing behind diagrams in Dark Mode">
                   ${brightDiagramsInDark ? '🖼 Bright Diagrams: ON' : '🖼 Bright Diagrams: OFF'}
                 </button>`
              : ''
          }
          <button type="button" class="nta-hdr-btn" id="nta-theme-toggle-btn" title="Toggle Dark / Classic NTA Light Mode inside test portal">
            ${portalTheme === 'dark' ? '☀ Classic NTA Light' : '🌙 Portal Dark Mode'}
          </button>
        </div>
      </header>
    `;
  }

  function renderInstructionsPhase() {
    const p = portalState;
    const hasSecB = p.questions.some((q) => q.section === 'B');
    return `
      <div class="nta-shell" data-nta-theme="${portalTheme}" data-bright-diagrams="${brightDiagramsInDark}">
        ${renderPortalHeader('<button type="button" class="nta-hdr-btn" id="nta-exit-inst-btn">← Back to Test Center</button>')}
        <div class="nta-instructions-wrap">
          <div class="nta-inst-card">
            <div class="nta-inst-banner">
              <h1>General Instructions — Read Carefully Before Starting</h1>
              <div class="nta-inst-meta-pills">
                <span>Questions: <strong>${p.questions.length}</strong></span>
                <span>Duration: <strong>${p.durationMin} mins</strong></span>
                <span>Marking: <strong>+${p.marking.correct} / ${p.marking.incorrect}</strong></span>
                <span>Sections: <strong>${p.sections.map((s) => `${s.label} (${p.questions.filter((q) => getDisplaySectionId(q, p.sectionMode) === s.id).length})`).join(' · ')}</strong></span>
              </div>
            </div>

            <div class="nta-inst-body">
              <ol class="nta-inst-list">
                <li>Total duration of this examination is <strong>${p.durationMin} minutes</strong>. The clock will be set at the server and the countdown timer at the top right corner will display the remaining time available to you.</li>
                <li>When the timer reaches zero, the examination will end automatically and your responses will be submitted for evaluation.</li>
                <li>Each correct answer awards <strong>+${p.marking.correct} marks</strong>; each incorrect answer deducts <strong>${Math.abs(p.marking.incorrect)} mark</strong>. Unattempted questions carry <strong>0 marks</strong>.</li>
                ${
                  hasSecB
                    ? `<li><strong>Section B Rule (2024 Pattern):</strong> This paper includes Section B (15 questions per subject). Only the first <strong>10 attempted questions</strong> in Section B of each subject are evaluated.</li>`
                    : `<li><strong>NEET 2027 Compulsory Pattern:</strong> All questions across each section are compulsory.</li>`
                }
                <li>The Question Palette on the right of the screen shows the status of every question using one of the following five symbols:
                  <div class="nta-inst-legend">
                    <div class="nta-legend-row">${renderPaletteShapeHtml('not-visited', '1')} <span>You have <strong>not visited</strong> the question yet.</span></div>
                    <div class="nta-legend-row">${renderPaletteShapeHtml('not-answered', '2')} <span>You have <strong>not answered</strong> the question.</span></div>
                    <div class="nta-legend-row">${renderPaletteShapeHtml('answered', '3')} <span>You have <strong>answered</strong> the question.</span></div>
                    <div class="nta-legend-row">${renderPaletteShapeHtml('review', '4')} <span>You have <strong>NOT answered</strong> the question, but have <strong>marked it for review</strong>.</span></div>
                    <div class="nta-legend-row">${renderPaletteShapeHtml('answered-review', '5')} <span>The question is <strong>Answered &amp; Marked for Review</strong> — <em>Will be considered for evaluation</em> per official NTA rules.</span></div>
                  </div>
                </li>
                <li>To save an answer, you MUST click <strong>Save &amp; Next</strong> or <strong>Save &amp; Mark for Review</strong>. Clicking <strong>Clear</strong> deselects your chosen option.</li>
              </ol>

              <div class="nta-inst-declare">
                <label class="nta-declare-label">
                  <input type="checkbox" id="nta-declare-checkbox" ${p.declarationChecked ? 'checked' : ''} />
                  <span>I have read and understood the instructions. I agree that in case of not adhering to exam rules, my attempt can be evaluated strictly per NTA scoring rules.</span>
                </label>
                <div class="nta-inst-footer">
                  <button type="button" class="nta-btn nta-btn-default" id="nta-cancel-inst-btn">Cancel</button>
                  <button type="button" class="nta-btn nta-btn-primary nta-btn-proceed" id="nta-proceed-btn" ${p.declarationChecked ? '' : 'disabled'}>PROCEED</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function computePaletteCounts(questions, states, filterSectionId = null) {
    const counts = {
      'not-visited': 0,
      'not-answered': 0,
      answered: 0,
      review: 0,
      'answered-review': 0
    };
    questions.forEach((q) => {
      if (filterSectionId && getDisplaySectionId(q, portalState.sectionMode) !== filterSectionId) return;
      const st = states[q.id] || 'not-visited';
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }

  function renderActivePhase() {
    const p = portalState;
    const q = p.questions[p.currentIndex];
    const secQuestions = p.questions
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => getDisplaySectionId(item, p.sectionMode) === p.activeSectionId);

    const allCounts = computePaletteCounts(p.questions, p.states);
    const currentSecDef = p.sections.find((s) => s.id === p.activeSectionId) || p.sections[0];
    const hasSectionAAndB = secQuestions.some(({ item }) => item.section === 'B');
    const chLabel = q.chapterId && CHAPTER_INDEX[q.chapterId] ? CHAPTER_INDEX[q.chapterId].label : '';

    return `
      <div class="nta-shell" data-nta-theme="${portalTheme}" data-bright-diagrams="${brightDiagramsInDark}">
        ${renderPortalHeader(`
          <button type="button" class="nta-hdr-btn" id="nta-open-paper-btn">📄 Question Paper</button>
          <button type="button" class="nta-hdr-btn nta-hdr-mobile-pal" id="nta-toggle-mobile-palette">
            Grid (${allCounts.answered + allCounts['answered-review']}/${p.questions.length})
          </button>
          <button type="button" class="nta-hdr-btn" id="nta-pause-exit-btn">⏸ Pause &amp; Exit</button>
        `)}

        <!-- Sub-Header: Section Tabs & Candidate/Timer Strip -->
        <div class="nta-subbar">
          <div class="nta-sections-row" role="tablist" aria-label="Exam Subject Sections">
            ${p.sections
              .map((sec) => {
                const sc = computePaletteCounts(p.questions, p.states, sec.id);
                const secTotal = p.questions.filter((item) => getDisplaySectionId(item, p.sectionMode) === sec.id).length;
                const done = sc.answered + sc['answered-review'];
                return `
                  <button type="button" class="nta-sec-tab ${sec.id === p.activeSectionId ? 'active' : ''}" data-sec-id="${sec.id}" title="Answered: ${done}/${secTotal} · Not Visited: ${sc['not-visited']}">
                    <span>${esc(sec.label)}</span>
                    <span class="nta-sec-badge">${done}/${secTotal}</span>
                  </button>
                `;
              })
              .join('')}
          </div>

          <div class="nta-candidate-strip">
            <div class="nta-timer-box">
              <span class="nta-timer-label">Time Left:</span>
              <span id="nta-timer-value" class="nta-timer-value ${p.timeRemainingSec <= 300 ? 'timer-crit' : p.timeRemainingSec <= 900 ? 'timer-warn' : ''}">
                ${fmtClock(p.timeRemainingSec)}
              </span>
            </div>
            <div class="nta-candidate-mini">
              <span class="nta-avatar" aria-hidden="true">N</span>
              <div>
                <div class="nta-cand-name">NEET 2027 Candidate</div>
                <div class="nta-cand-meta">Marking: +${p.marking.correct}, ${p.marking.incorrect} · English</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Workspace + Right Palette -->
        <div class="nta-main-grid">
          <!-- Left: Question Area + NTA Bottom Bar -->
          <section class="nta-question-pane">
            <div class="nta-q-header">
              <div class="nta-q-number">
                Question No. ${p.currentIndex + 1}
                ${q.section ? `<span class="nta-q-tag">Section ${esc(q.section)}</span>` : ''}
                ${q.examTag ? `<span class="nta-q-tag muted">${esc(q.examTag)}</span>` : ''}
                ${chLabel ? `<span class="nta-q-tag muted">${esc(chLabel)}</span>` : ''}
              </div>
              <div class="nta-q-tools">
                <span class="nta-q-time-pill">⏱ <span id="nta-q-timer">${fmtClock(p.perQuestionSec[q.id] || 0).slice(3)}</span></span>
              </div>
            </div>

            <div class="nta-q-scroll">
              ${
                !q.imageOnly
                  ? `<div class="nta-q-stem">${renderMathRichText(q.question)}</div>`
                  : `<div class="nta-q-stem muted" style="font-size:0.84rem; margin-bottom:8px;">Read the official question image below and select the correct option (1)–(4):</div>`
              }

              ${
                q.questionImage
                  ? `<div class="nta-q-img-wrap">
                       <img src="${esc(q.questionImage)}" alt="Question ${p.currentIndex + 1} diagram" class="nta-q-img" id="nta-active-q-img" title="Click to zoom image" />
                     </div>`
                  : ''
              }

              <div class="nta-options-list" role="radiogroup" aria-label="Answer Options">
                ${[0, 1, 2, 3]
                  .map((optIdx) => {
                    const checked = p.draftChoice === optIdx;
                    const optImg = q.optionImages?.[optIdx];
                    const optText = q.options?.[optIdx] || `Option (${optIdx + 1})`;
                    return `
                      <label class="nta-option-row ${checked ? 'selected' : ''}">
                        <input type="radio" name="nta-active-opt" value="${optIdx}" ${checked ? 'checked' : ''} />
                        <span class="nta-opt-num">(${optIdx + 1})</span>
                        <span class="nta-opt-body">
                          ${!q.imageOnly ? `<span class="nta-opt-text">${renderMathRichText(optText, { inline: true })}</span>` : `<span class="nta-opt-text">Option (${optIdx + 1})</span>`}
                          ${optImg ? `<img src="${esc(optImg)}" alt="Option ${optIdx + 1}" class="nta-opt-img" />` : ''}
                        </span>
                      </label>
                    `;
                  })
                  .join('')}
              </div>
            </div>

            <!-- Official NTA Action Buttons -->
            <footer class="nta-action-footer">
              <div class="nta-action-primary-row">
                <button type="button" class="nta-btn nta-btn-save" id="nta-save-next-btn">SAVE &amp; NEXT</button>
                <button type="button" class="nta-btn nta-btn-default" id="nta-clear-btn">CLEAR</button>
                <button type="button" class="nta-btn nta-btn-save-review" id="nta-save-mark-btn">SAVE &amp; MARK FOR REVIEW</button>
                <button type="button" class="nta-btn nta-btn-review-next" id="nta-mark-next-btn">MARK FOR REVIEW &amp; NEXT</button>
              </div>
              <div class="nta-action-nav-row">
                <div style="display:flex; gap:8px;">
                  <button type="button" class="nta-btn nta-btn-default" id="nta-back-btn" ${p.currentIndex <= 0 ? 'disabled' : ''}>&lt;&lt; BACK</button>
                  <button type="button" class="nta-btn nta-btn-default" id="nta-next-btn" ${p.currentIndex >= p.questions.length - 1 ? 'disabled' : ''}>NEXT &gt;&gt;</button>
                </div>
                <button type="button" class="nta-btn nta-btn-submit" id="nta-submit-open-btn">SUBMIT</button>
              </div>
            </footer>
          </section>

          <!-- Right Sidebar: Official 5-State NTA Question Palette -->
          <aside class="nta-palette-pane ${showMobilePalette ? 'mobile-open' : ''}">
            <div class="nta-legend-grid">
              <div class="nta-legend-item">${renderPaletteShapeHtml('not-visited', String(allCounts['not-visited']))} <span>Not Visited</span></div>
              <div class="nta-legend-item">${renderPaletteShapeHtml('not-answered', String(allCounts['not-answered']))} <span>Not Answered</span></div>
              <div class="nta-legend-item">${renderPaletteShapeHtml('answered', String(allCounts.answered))} <span>Answered</span></div>
              <div class="nta-legend-item">${renderPaletteShapeHtml('review', String(allCounts.review))} <span>Marked for Review</span></div>
              <div class="nta-legend-item nta-legend-wide">${renderPaletteShapeHtml('answered-review', String(allCounts['answered-review']))} <span>Answered &amp; Marked for Review (evaluated)</span></div>
            </div>

            <div class="nta-palette-sec-banner">
              ${esc(currentSecDef?.label || 'Section')} · Choose a Question
            </div>

            <div class="nta-palette-grid-scroll">
              ${
                hasSectionAAndB
                  ? ['A', 'B']
                      .map((secLetter) => {
                        const group = secQuestions.filter(({ item }) => item.section === secLetter);
                        if (!group.length) return '';
                        return `
                          <div class="nta-pal-subhead">Section ${secLetter} ${secLetter === 'B' ? '(Attempt any 10)' : '(Compulsory)'}</div>
                          <div class="nta-palette-grid">
                            ${group
                              .map(({ item, idx }) => {
                                const st = p.states[item.id] || 'not-visited';
                                const cur = idx === p.currentIndex ? 'current' : '';
                                return `<button type="button" class="nta-pal-btn nta-shape-${st} ${cur}" data-qidx="${idx}">${idx + 1}</button>`;
                              })
                              .join('')}
                          </div>
                        `;
                      })
                      .join('')
                  : `<div class="nta-palette-grid">
                       ${secQuestions
                         .map(({ item, idx }) => {
                           const st = p.states[item.id] || 'not-visited';
                           const cur = idx === p.currentIndex ? 'current' : '';
                           return `<button type="button" class="nta-pal-btn nta-shape-${st} ${cur}" data-qidx="${idx}">${idx + 1}</button>`;
                         })
                         .join('')}
                     </div>`
              }
            </div>
          </aside>
        </div>

        ${showPaperModal ? renderQuestionPaperModalHtml() : ''}
        ${showSubmitModal ? renderSubmitSummaryModalHtml() : ''}
        ${lightboxImageUrl ? renderLightboxHtml() : ''}
      </div>
    `;
  }

  function renderQuestionPaperModalHtml() {
    const p = portalState;
    const secQs = p.questions
      .map((item, idx) => ({ item, idx }))
      .filter(({ item }) => getDisplaySectionId(item, p.sectionMode) === p.activeSectionId);
    const secLabel = p.sections.find((s) => s.id === p.activeSectionId)?.label || '';
    return `
      <div class="nta-modal-backdrop" id="nta-paper-backdrop">
        <div class="nta-modal-card nta-modal-lg">
          <div class="nta-modal-head">
            <h3>Question Paper — ${esc(secLabel)}</h3>
            <button type="button" class="nta-btn nta-btn-default" id="nta-close-paper-btn">Close</button>
          </div>
          <div class="nta-modal-body">
            ${secQs
              .map(
                ({ item, idx }) => `
                  <div class="nta-paper-item">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                      <strong>Q.${idx + 1}</strong>
                      <button type="button" class="nta-btn nta-btn-primary nta-jump-from-paper" data-qidx="${idx}">Go to Q.${idx + 1}</button>
                    </div>
                    ${!item.imageOnly ? `<div>${renderMathRichText(item.question)}</div>` : ''}
                    ${item.questionImage ? `<img src="${esc(item.questionImage)}" alt="Q.${idx + 1}" class="nta-q-img" style="max-height:240px; margin-top:6px;" />` : ''}
                  </div>
                `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderSubmitSummaryModalHtml() {
    const p = portalState;
    const totals = computePaletteCounts(p.questions, p.states);
    return `
      <div class="nta-modal-backdrop" id="nta-submit-backdrop">
        <div class="nta-modal-card nta-modal-lg">
          <div class="nta-modal-head">
            <h3>Exam Summary — Final Submission Confirmation</h3>
          </div>
          <div class="nta-modal-body">
            <p style="margin-top:0;">Please review your section-wise question summary before submitting for final NTA scoring:</p>
            <div class="nta-summary-table-wrap">
              <table class="nta-summary-table">
                <thead>
                  <tr>
                    <th>Section Name</th>
                    <th>No. of Qs</th>
                    <th>Answered</th>
                    <th>Not Answered</th>
                    <th>Marked for Review</th>
                    <th>Answered &amp; Marked (Evaluated)</th>
                    <th>Not Visited</th>
                  </tr>
                </thead>
                <tbody>
                  ${p.sections
                    .map((sec) => {
                      const c = computePaletteCounts(p.questions, p.states, sec.id);
                      const secTotal = p.questions.filter((q) => getDisplaySectionId(q, p.sectionMode) === sec.id).length;
                      return `
                        <tr>
                          <td><strong>${esc(sec.label)}</strong></td>
                          <td>${secTotal}</td>
                          <td class="c-green">${c.answered}</td>
                          <td class="c-red">${c['not-answered']}</td>
                          <td class="c-purple">${c.review}</td>
                          <td class="c-purple">${c['answered-review']}</td>
                          <td>${c['not-visited']}</td>
                        </tr>
                      `;
                    })
                    .join('')}
                  <tr class="nta-summary-total">
                    <td><strong>Total</strong></td>
                    <td><strong>${p.questions.length}</strong></td>
                    <td><strong>${totals.answered}</strong></td>
                    <td><strong>${totals['not-answered']}</strong></td>
                    <td><strong>${totals.review}</strong></td>
                    <td><strong>${totals['answered-review']}</strong></td>
                    <td><strong>${totals['not-visited']}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style="margin:14px 0 4px; font-weight:600;">Are you sure you want to submit this test for final marking?</p>
          </div>
          <div class="nta-modal-foot">
            <button type="button" class="nta-btn nta-btn-default" id="nta-cancel-submit-btn">No, Return to Test</button>
            <button type="button" class="nta-btn nta-btn-submit" id="nta-confirm-submit-btn">Yes, Submit Test</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderLightboxHtml() {
    return `
      <div class="nta-modal-backdrop" id="nta-lightbox-backdrop">
        <div class="nta-lightbox-card">
          <button type="button" class="nta-btn nta-btn-default" id="nta-close-lightbox-btn" style="align-self:flex-end;">✕ Close Zoom</button>
          <img src="${esc(lightboxImageUrl)}" alt="Zoomed diagram" class="nta-lightbox-img" />
        </div>
      </div>
    `;
  }

  function renderReviewPhase() {
    const p = portalState;
    const { bySection, totals, questionOutcomes } = p.evaluation;
    const attemptedScored = totals.correct + totals.wrong;
    const accuracy = attemptedScored ? Math.round((totals.correct / attemptedScored) * 100) : 0;
    const mistakeQuestions = questionOutcomes
      .filter((o) => o.status === 'wrong' || o.status === 'unattempted')
      .map((o) => p.questions[o.index]);

    const filteredOutcomes = questionOutcomes.filter((o) => {
      if (reviewFilter === 'wrong') return o.status === 'wrong';
      if (reviewFilter === 'unattempted') return o.status === 'unattempted';
      if (reviewFilter === 'correct') return o.status === 'correct';
      if (reviewFilter === 'marked') return o.qState === 'review' || o.qState === 'answered-review';
      return true;
    });

    return `
      <div class="nta-shell nta-review-shell" data-nta-theme="${portalTheme}" data-bright-diagrams="${brightDiagramsInDark}">
        ${renderPortalHeader(`
          ${
            mistakeQuestions.length > 0
              ? `<button type="button" class="nta-hdr-btn nta-hdr-accent" id="nta-retest-mistakes-btn">🔥 Re-Test Mistakes (${mistakeQuestions.length})</button>`
              : ''
          }
          <button type="button" class="nta-hdr-btn" id="nta-exit-review-btn">← Back to Test Center</button>
        `)}

        <div class="nta-review-wrap">
          <!-- Scorecard Hero -->
          <div class="nta-score-hero">
            <div class="nta-score-main">
              <div class="nta-score-eyebrow">${p.attempt?.autoSubmitted ? 'Auto-Submitted on Time Out · ' : ''}Official NTA Scorecard</div>
              <h1>${totals.marks} <span class="nta-score-max">/ ${totals.maxMarks}</span></h1>
              <div class="nta-score-sub">Accuracy: <strong>${accuracy}%</strong> · Total Time: <strong>${fmtShortTime(p.attempt?.timeSpentSec || totals.timeSec)}</strong></div>
            </div>
            <div class="nta-score-stats">
              <div class="nta-stat-tile ok"><span>Correct</span><strong>${totals.correct}</strong></div>
              <div class="nta-stat-tile err"><span>Incorrect</span><strong>${totals.wrong}</strong></div>
              <div class="nta-stat-tile"><span>Unattempted</span><strong>${totals.unattempted}</strong></div>
              <div class="nta-stat-tile"><span>Avg / Q</span><strong>${totals.total ? Math.round((p.attempt?.timeSpentSec || totals.timeSec) / totals.total) : 0}s</strong></div>
            </div>
          </div>

          <!-- Subject-wise Breakdown -->
          <div class="nta-review-card">
            <h2>Subject-Wise Performance Analysis</h2>
            <div class="nta-summary-table-wrap">
              <table class="nta-summary-table">
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Questions</th>
                    <th>Attempted</th>
                    <th>Correct</th>
                    <th>Incorrect</th>
                    <th>Accuracy</th>
                    <th>Marks</th>
                    <th>Time Spent</th>
                  </tr>
                </thead>
                <tbody>
                  ${Object.values(bySection)
                    .map((b) => {
                      const denom = b.correct + b.wrong;
                      const acc = denom ? Math.round((b.correct / denom) * 100) : 0;
                      return `
                        <tr>
                          <td><strong>${esc(b.label)}</strong></td>
                          <td>${b.total}</td>
                          <td>${b.attempted}</td>
                          <td class="c-green"><strong>${b.correct}</strong></td>
                          <td class="c-red"><strong>${b.wrong}</strong></td>
                          <td>${acc}%</td>
                          <td><strong>${b.marks} / ${b.maxMarks}</strong></td>
                          <td>${fmtShortTime(b.timeSec)}</td>
                        </tr>
                      `;
                    })
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Solution Review Filters -->
          <div class="nta-review-toolbar">
            <h2>Question-by-Question Solution Review</h2>
            <div class="nta-filter-pills">
              <button type="button" class="nta-filter-btn ${reviewFilter === 'all' ? 'active' : ''}" data-rfilter="all">All (${questionOutcomes.length})</button>
              <button type="button" class="nta-filter-btn ${reviewFilter === 'wrong' ? 'active' : ''}" data-rfilter="wrong">Incorrect (${totals.wrong})</button>
              <button type="button" class="nta-filter-btn ${reviewFilter === 'unattempted' ? 'active' : ''}" data-rfilter="unattempted">Unattempted (${totals.unattempted})</button>
              <button type="button" class="nta-filter-btn ${reviewFilter === 'correct' ? 'active' : ''}" data-rfilter="correct">Correct (${totals.correct})</button>
              <button type="button" class="nta-filter-btn ${reviewFilter === 'marked' ? 'active' : ''}" data-rfilter="marked">Marked for Review</button>
            </div>
          </div>

          <div class="nta-review-list">
            ${
              filteredOutcomes.length === 0
                ? `<div class="nta-review-card">No questions match this filter.</div>`
                : filteredOutcomes
                    .map((out) => {
                      const q = p.questions[out.index];
                      const correctSet = new Set(
                        Array.isArray(q.correctIndices) && q.correctIndices.length
                          ? q.correctIndices
                          : q.correctIndex != null
                          ? [q.correctIndex]
                          : []
                      );
                      const tutor = tutorResponses[q.id];
                      const chLabel = q.chapterId && CHAPTER_INDEX[q.chapterId] ? CHAPTER_INDEX[q.chapterId].label : '';
                      return `
                        <article class="nta-review-card nta-rev-item status-${out.status}">
                          <div class="nta-rev-head">
                            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                              <strong>Q.${out.index + 1} (${esc(q.subject.toUpperCase())})</strong>
                              <span class="nta-rev-badge badge-${out.status}">
                                ${out.status === 'correct' ? `+${out.marksAwarded} Correct` : out.status === 'wrong' ? `${out.marksAwarded} Wrong` : out.status === 'ignored-secB' ? 'Sec B Extra (>10)' : out.status === 'key-missing' ? 'No Answer Key' : '0 Unattempted'}
                              </span>
                              ${q.examTag ? `<span class="nta-q-tag muted">${esc(q.examTag)}</span>` : ''}
                              ${chLabel ? `<span class="nta-q-tag muted">${esc(chLabel)}</span>` : ''}
                            </div>
                            <span class="nta-q-time-pill">⏱ ${fmtShortTime(out.timeSec)}</span>
                          </div>

                          ${!q.imageOnly ? `<div class="nta-q-stem" style="margin-bottom:10px;">${renderMathRichText(q.question)}</div>` : ''}
                          ${q.questionImage ? `<div class="nta-q-img-wrap"><img src="${esc(q.questionImage)}" alt="Q.${out.index + 1}" class="nta-q-img" /></div>` : ''}

                          <div class="nta-rev-options">
                            ${[0, 1, 2, 3]
                              .map((optIdx) => {
                                const isRight = correctSet.has(optIdx);
                                const isChosen = out.chosenIndex === optIdx;
                                const cls = isRight ? 'opt-correct' : isChosen ? 'opt-wrong' : '';
                                return `
                                  <div class="nta-rev-opt ${cls}">
                                    <span class="nta-opt-num">(${optIdx + 1})</span>
                                    <span>${!q.imageOnly ? renderMathRichText(q.options?.[optIdx] || '', { inline: true }) : `Option (${optIdx + 1})`}</span>
                                    ${q.optionImages?.[optIdx] ? `<img src="${esc(q.optionImages[optIdx])}" alt="Option ${optIdx + 1}" class="nta-opt-img" />` : ''}
                                    ${isRight ? `<span class="nta-rev-tag ok">✓ Answer</span>` : ''}
                                    ${isChosen && !isRight ? `<span class="nta-rev-tag err">✗ Your Pick</span>` : ''}
                                    ${isChosen && isRight ? `<span class="nta-rev-tag ok">✓ Your Pick</span>` : ''}
                                  </div>
                                `;
                              })
                              .join('')}
                          </div>

                          <div class="nta-rev-expl">
                            <div><strong>Explanation:</strong> ${q.explanation ? renderMathRichText(q.explanation) : 'Refer to NCERT / official solution key.'}</div>
                            <div style="margin-top:10px; display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
                              <button type="button" class="nta-btn nta-btn-default nta-ask-tutor-btn" data-qidx="${out.index}" ${tutor?.loading ? 'disabled' : ''}>
                                ${tutor?.loading ? `Asking ${esc(getResolvedModelId())}...` : '✨ Ask Gemini 3.1 Tutor'}
                              </button>
                            </div>
                            ${
                              tutor?.error
                                ? `<div style="margin-top:8px; color:#dc2626; font-size:0.85rem;">${esc(tutor.error)}</div>`
                                : tutor?.text
                                ? `<div class="nta-tutor-box">${renderMarkdown(tutor.text)}</div>`
                                : ''
                            }
                          </div>
                        </article>
                      `;
                    })
                    .join('')
            }
          </div>
        </div>
        ${lightboxImageUrl ? renderLightboxHtml() : ''}
      </div>
    `;
  }

  function renderPortal() {
    if (!portalState || !portalRoot) return;
    portalRoot.hidden = false;

    if (portalState.phase === 'instructions') {
      portalRoot.innerHTML = renderInstructionsPhase();
    } else if (portalState.phase === 'active') {
      portalRoot.innerHTML = renderActivePhase();
    } else if (portalState.phase === 'review') {
      portalRoot.innerHTML = renderReviewPhase();
    }
    wirePortalEvents();
  }

  function wirePortalEvents() {
    portalRoot.querySelector('#nta-theme-toggle-btn')?.addEventListener('click', togglePortalTheme);
    portalRoot.querySelector('#nta-toggle-diagram-plate')?.addEventListener('click', () => {
      brightDiagramsInDark = !brightDiagramsInDark;
      renderPortal();
    });

    // Instructions Events
    portalRoot.querySelector('#nta-exit-inst-btn')?.addEventListener('click', () => closePortal({ keepSessionSaved: false }));
    portalRoot.querySelector('#nta-cancel-inst-btn')?.addEventListener('click', () => closePortal({ keepSessionSaved: false }));
    portalRoot.querySelector('#nta-declare-checkbox')?.addEventListener('change', (e) => {
      portalState.declarationChecked = e.target.checked;
      const btn = portalRoot.querySelector('#nta-proceed-btn');
      if (btn) btn.disabled = !portalState.declarationChecked;
    });
    portalRoot.querySelector('#nta-proceed-btn')?.addEventListener('click', beginActiveExamFromInstructions);

    // Active Exam Events
    portalRoot.querySelector('#nta-pause-exit-btn')?.addEventListener('click', () => closePortal({ keepSessionSaved: true }));
    portalRoot.querySelector('#nta-toggle-mobile-palette')?.addEventListener('click', () => {
      showMobilePalette = !showMobilePalette;
      renderPortal();
    });

    portalRoot.querySelectorAll('.nta-sec-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const secId = btn.dataset.secId;
        const firstIdx = portalState.questions.findIndex((q) => getDisplaySectionId(q, portalState.sectionMode) === secId);
        if (firstIdx >= 0) goToQuestion(firstIdx);
      });
    });

    portalRoot.querySelectorAll('input[name="nta-active-opt"]').forEach((radio) => {
      radio.addEventListener('change', (e) => {
        portalState.draftChoice = Number(e.target.value);
        portalRoot.querySelectorAll('.nta-option-row').forEach((row, idx) => {
          row.classList.toggle('selected', idx === portalState.draftChoice);
        });
      });
    });

    portalRoot.querySelector('#nta-save-next-btn')?.addEventListener('click', handleSaveAndNext);
    portalRoot.querySelector('#nta-clear-btn')?.addEventListener('click', handleClearResponse);
    portalRoot.querySelector('#nta-save-mark-btn')?.addEventListener('click', handleSaveAndMarkReview);
    portalRoot.querySelector('#nta-mark-next-btn')?.addEventListener('click', handleMarkForReviewAndNext);
    portalRoot.querySelector('#nta-back-btn')?.addEventListener('click', () => goToQuestion(portalState.currentIndex - 1));
    portalRoot.querySelector('#nta-next-btn')?.addEventListener('click', () => goToQuestion(portalState.currentIndex + 1));
    portalRoot.querySelectorAll('.nta-pal-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        showMobilePalette = false;
        goToQuestion(Number(btn.dataset.qidx));
      });
    });

    // Modals inside portal
    portalRoot.querySelector('#nta-open-paper-btn')?.addEventListener('click', () => {
      showPaperModal = true;
      renderPortal();
    });
    portalRoot.querySelector('#nta-close-paper-btn')?.addEventListener('click', () => {
      showPaperModal = false;
      renderPortal();
    });
    portalRoot.querySelectorAll('.nta-jump-from-paper').forEach((btn) => {
      btn.addEventListener('click', () => {
        showPaperModal = false;
        goToQuestion(Number(btn.dataset.qidx));
      });
    });

    portalRoot.querySelector('#nta-submit-open-btn')?.addEventListener('click', () => {
      showSubmitModal = true;
      renderPortal();
    });
    portalRoot.querySelector('#nta-cancel-submit-btn')?.addEventListener('click', () => {
      showSubmitModal = false;
      renderPortal();
    });
    portalRoot.querySelector('#nta-confirm-submit-btn')?.addEventListener('click', () => finalizeAndSubmitTest(false));

    // Image Zoom Lightbox
    portalRoot.querySelectorAll('.nta-q-img').forEach((img) => {
      img.addEventListener('click', () => {
        lightboxImageUrl = img.src;
        renderPortal();
      });
    });
    portalRoot.querySelector('#nta-close-lightbox-btn')?.addEventListener('click', () => {
      lightboxImageUrl = null;
      renderPortal();
    });
    portalRoot.querySelector('#nta-lightbox-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'nta-lightbox-backdrop') {
        lightboxImageUrl = null;
        renderPortal();
      }
    });

    // Review Phase Events
    portalRoot.querySelector('#nta-exit-review-btn')?.addEventListener('click', () => closePortal({ keepSessionSaved: false }));
    portalRoot.querySelectorAll('[data-rfilter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        reviewFilter = btn.dataset.rfilter;
        renderPortal();
      });
    });
    portalRoot.querySelector('#nta-retest-mistakes-btn')?.addEventListener('click', () => {
      const mistakes = portalState.evaluation.questionOutcomes
        .filter((o) => o.status === 'wrong' || o.status === 'unattempted')
        .map((o) => portalState.questions[o.index]);
      if (mistakes.length === 0) return;
      openPortalWithTest({
        title: `Mistake Re-Test — ${portalState.title}`,
        durationMin: Math.max(5, mistakes.length),
        sectionMode: portalState.sectionMode,
        marking: portalState.marking,
        questions: mistakes
      });
    });
    portalRoot.querySelectorAll('.nta-ask-tutor-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const qIdx = Number(btn.dataset.qidx);
        const q = portalState.questions[qIdx];
        if (!q) return;
        if (!getResolvedApiKey()) {
          tutorResponses[q.id] = { loading: false, error: 'Configure your GEMINI_API_KEY in the top bar first.' };
          renderPortal();
          return;
        }
        tutorResponses[q.id] = { loading: true };
        renderPortal();
        try {
          const out = portalState.evaluation.questionOutcomes.find((o) => o.index === qIdx);
          const ans = await askCbtTutor({
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            selectedIndex: out?.chosenIndex ?? null
          });
          tutorResponses[q.id] = { loading: false, text: ans };
        } catch (err) {
          tutorResponses[q.id] = { loading: false, error: err.message };
        }
        renderPortal();
      });
    });
  }

  /* ==================== HUB VIEW RENDERING ==================== */

  function renderPrebuiltTabHtml() {
    const groups = ['Full Syllabus Mocks', 'Part Syllabus Tests'];
    return `
      ${groups
        .map(
          (gName) => `
          <div style="margin-bottom:24px;">
            <h2 class="cbt-subheading">${esc(gName)}</h2>
            <div class="cbt-test-grid">
              ${PREBUILT_TESTS.filter((t) => t.group === gName)
                .map((tpl) => {
                  const totalQ = Object.values(tpl.perSubject).reduce((a, b) => a + b, 0);
                  return `
                    <article class="card cbt-test-card">
                      <div class="cbt-card-top">
                        <span class="pill-badge accent">${totalQ} Qs · ${tpl.durationMin} mins</span>
                        <span class="pill-badge">+4 / -1</span>
                      </div>
                      <h3>${esc(tpl.title)}</h3>
                      <p class="muted-note">${esc(tpl.description)}</p>
                      <div class="cbt-subj-chips">
                        <span>PHY ${tpl.perSubject.physics}</span>
                        <span>CHE ${tpl.perSubject.chemistry}</span>
                        <span>BOT ${tpl.perSubject.botany}</span>
                        <span>ZOO ${tpl.perSubject.zoology}</span>
                      </div>
                      <div class="cbt-card-actions">
                        <button type="button" class="btn-primary btn-sm cbt-launch-tpl" data-tpl-id="${esc(tpl.id)}">Start NTA CBT</button>
                        <button type="button" class="btn-outline btn-sm cbt-customize-tpl" data-tpl-id="${esc(tpl.id)}">Custom Time / Qs</button>
                      </div>
                    </article>
                  `;
                })
                .join('')}
            </div>
          </div>
        `
        )
        .join('')}

      <div style="margin-bottom:10px;">
        <h2 class="cbt-subheading">Official NEET (UG) Previous Year Papers (2016–2026)</h2>
        <p class="muted-note" style="margin-top:-6px; margin-bottom:14px;">
          2024–2026 papers display pixel-exact official NTA exam question images (diagrams &amp; circuits included). 2016–2023 run 100% offline.
        </p>
        <div class="cbt-test-grid">
          ${PAPER_REPLAYS.map((p) => {
            const count = p.kind === 'image' ? (NEET_PAPERS[p.id] || []).length : PYQ_BANK.filter((q) => q.year === p.year).length;
            return `
              <article class="card cbt-test-card">
                <div class="cbt-card-top">
                  <span class="pill-badge ${p.kind === 'image' ? 'lg' : 'accent'}">${p.kind === 'image' ? 'Official Exam Images' : 'Offline Text PYQs'}</span>
                  <span class="pill-badge">${count} Qs · ${p.durationMin}m</span>
                </div>
                <h3>${esc(p.title)}</h3>
                <div class="cbt-card-actions" style="margin-top:auto;">
                  <button type="button" class="btn-primary btn-sm cbt-launch-paper" data-paper-id="${esc(p.id)}">Take Paper in NTA Mode</button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function renderBuilderTabHtml() {
    const chList = getChapters(builder.expandedSubject, { includeLegacy: builder.includeLegacy });
    const availCounts = {};
    const subjPoolForCounts = getCombinedPool(builder.sources);
    subjPoolForCounts.forEach((q) => {
      if (q.chapterId) availCounts[q.chapterId] = (availCounts[q.chapterId] || 0) + 1;
    });

    const totalWanted =
      builder.sectionMode === '3tab'
        ? Number(builder.perSubject.physics) + Number(builder.perSubject.chemistry) + Number(builder.biologyCount)
        : Number(builder.perSubject.physics) +
          Number(builder.perSubject.chemistry) +
          Number(builder.perSubject.botany) +
          Number(builder.perSubject.zoology);

    return `
      <div class="cbt-builder-grid">
        <!-- Left Config Card -->
        <div class="card" style="padding:20px; display:flex; flex-direction:column; gap:14px;">
          <h2 style="margin:0; font-size:1.1rem;">Custom Part / Full Test Configuration</h2>

          <div class="form-field">
            <label for="b-test-title">Test Name</label>
            <input type="text" id="b-test-title" value="${esc(builder.title)}" />
          </div>

          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button type="button" class="btn-outline btn-sm b-preset-btn" data-preset="full">NEET 2027 Full (45×4, 180m)</button>
            <button type="button" class="btn-outline btn-sm b-preset-btn" data-preset="half">Half Mock (25×4, 90m)</button>
            <button type="button" class="btn-outline btn-sm b-preset-btn" data-preset="sprint">Sprint (10×4, 40m)</button>
          </div>

          <div class="form-field">
            <label>Subject Tab Layout</label>
            <div class="mode-tabs" style="display:grid; grid-template-columns:1fr 1fr;">
              <button type="button" class="mode-tab-btn ${builder.sectionMode === '4tab' ? 'active' : ''}" data-b-secmode="4tab">4 Tabs (PHY · CHE · BOT · ZOO)</button>
              <button type="button" class="mode-tab-btn ${builder.sectionMode === '3tab' ? 'active' : ''}" data-b-secmode="3tab">3 Tabs (PHY · CHE · BIO)</button>
            </div>
          </div>

          <div class="cbt-counts-grid">
            <div class="form-field">
              <label for="b-cnt-phy">Physics Qs</label>
              <input type="number" id="b-cnt-phy" min="0" max="200" value="${builder.perSubject.physics}" />
            </div>
            <div class="form-field">
              <label for="b-cnt-che">Chemistry Qs</label>
              <input type="number" id="b-cnt-che" min="0" max="200" value="${builder.perSubject.chemistry}" />
            </div>
            ${
              builder.sectionMode === '3tab'
                ? `<div class="form-field" style="grid-column: span 2;">
                     <label for="b-cnt-bio">Biology (Botany + Zoology) Qs</label>
                     <input type="number" id="b-cnt-bio" min="0" max="200" value="${builder.biologyCount}" />
                   </div>`
                : `<div class="form-field">
                     <label for="b-cnt-bot">Botany Qs</label>
                     <input type="number" id="b-cnt-bot" min="0" max="200" value="${builder.perSubject.botany}" />
                   </div>
                   <div class="form-field">
                     <label for="b-cnt-zoo">Zoology Qs</label>
                     <input type="number" id="b-cnt-zoo" min="0" max="200" value="${builder.perSubject.zoology}" />
                   </div>`
            }
          </div>

          <div class="cbt-counts-grid">
            <div class="form-field">
              <label for="b-duration">Time Limit (mins)</label>
              <input type="number" id="b-duration" min="1" max="360" value="${builder.durationMin}" />
            </div>
            <div class="form-field">
              <label for="b-mark-ok">Correct Marks</label>
              <input type="number" id="b-mark-ok" value="${builder.markingCorrect}" />
            </div>
            <div class="form-field">
              <label for="b-mark-err">Wrong Marks</label>
              <input type="number" id="b-mark-err" value="${builder.markingIncorrect}" />
            </div>
          </div>

          <div class="form-field">
            <label>Question Sources (Blend Multiple)</label>
            <div class="cbt-source-checks">
              <label><input type="checkbox" class="b-src-chk" data-src="PYQ" ${builder.sources.PYQ ? 'checked' : ''} /> Real NEET PYQs (${PYQ_BANK.length})</label>
              <label><input type="checkbox" class="b-src-chk" data-src="ABHYAS" ${builder.sources.ABHYAS ? 'checked' : ''} /> NTA Abhyas &amp; NCERT (${ABHYAS_BANK.length})</label>
              <label><input type="checkbox" class="b-src-chk" data-src="CUSTOM" ${builder.sources.CUSTOM ? 'checked' : ''} /> My PDF / Custom Bank (${customQuestions.length})</label>
              <label><input type="checkbox" class="b-src-chk" data-src="AI" ${builder.sources.AI ? 'checked' : ''} /> ✨ Generate Fresh AI Qs (${esc(getResolvedModelId())})</label>
            </div>
          </div>

          ${
            builder.sources.AI
              ? `<div class="cbt-ai-subbox">
                   <div class="form-field">
                     <label for="b-ai-style">AI Question Pattern</label>
                     <select id="b-ai-style">
                       <option value="abhyas" ${builder.aiStyle === 'abhyas' ? 'selected' : ''}>NTA Abhyas Style (NCERT Line-by-Line &amp; Numericals)</option>
                       <option value="pyq" ${builder.aiStyle === 'pyq' ? 'selected' : ''}>NEET PYQ Style</option>
                       <option value="new-pattern" ${builder.aiStyle === 'new-pattern' ? 'selected' : ''}>New Pattern (Assertion-Reason / Statement I&amp;II / Match)</option>
                     </select>
                   </div>
                   <label style="font-size:0.82rem; display:flex; align-items:center; gap:6px; cursor:pointer;">
                     <input type="checkbox" id="b-ai-save" ${builder.aiSaveToBank ? 'checked' : ''} />
                     Save newly generated AI questions to My Bank
                   </label>
                 </div>`
              : ''
          }

          <div style="display:flex; gap:14px; flex-wrap:wrap; font-size:0.82rem;">
            <label><input type="checkbox" id="b-shuf-q" ${builder.shuffleQuestions ? 'checked' : ''} /> Shuffle Questions</label>
            <label><input type="checkbox" id="b-shuf-opt" ${builder.shuffleOptions ? 'checked' : ''} /> Shuffle Options</label>
            <label><input type="checkbox" id="b-legacy" ${builder.includeLegacy ? 'checked' : ''} /> Include Legacy Deleted Chapters</label>
          </div>

          ${builder.buildStatus ? `<div class="settings-feedback" style="display:block;">${esc(builder.buildStatus)}</div>` : ''}
          ${builder.buildError ? `<div class="settings-feedback err">${esc(builder.buildError)}</div>` : ''}

          <button type="button" class="btn-primary" id="b-launch-btn" ${builder.isBuilding ? 'disabled' : ''}>
            ${builder.isBuilding ? 'Preparing Test...' : `🚀 Launch Custom NTA Test (${totalWanted} Qs · ${builder.durationMin}m)`}
          </button>
        </div>

        <!-- Right Chapter Selector -->
        <div class="card" style="padding:20px; display:flex; flex-direction:column; gap:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <h2 style="margin:0; font-size:1.1rem;">NCERT 2027 Chapter Scope (${builder.selectedChapters.size} selected)</h2>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn-outline btn-sm b-scope-global" data-scope="all">Select All</button>
              <button type="button" class="btn-outline btn-sm b-scope-global" data-scope="11">All Class 11</button>
              <button type="button" class="btn-outline btn-sm b-scope-global" data-scope="12">All Class 12</button>
              <button type="button" class="btn-outline btn-sm b-scope-global" data-scope="none">Clear All</button>
            </div>
          </div>

          <div class="mode-tabs" style="display:grid; grid-template-columns:repeat(4, 1fr);">
            ${CBT_SECTIONS.map((s) => {
              const sChs = getChapters(s.id, { includeLegacy: builder.includeLegacy });
              const sel = sChs.filter((c) => builder.selectedChapters.has(c.id)).length;
              return `<button type="button" class="mode-tab-btn ${builder.expandedSubject === s.id ? 'active' : ''}" data-b-subj="${s.id}">${s.label} (${sel}/${sChs.length})</button>`;
            }).join('')}
          </div>

          <div style="display:flex; gap:6px;">
            <button type="button" class="btn-outline btn-sm b-subj-sel" data-action="all">All ${esc(builder.expandedSubject)}</button>
            <button type="button" class="btn-outline btn-sm b-subj-sel" data-action="11">Class 11 Only</button>
            <button type="button" class="btn-outline btn-sm b-subj-sel" data-action="12">Class 12 Only</button>
            <button type="button" class="btn-outline btn-sm b-subj-sel" data-action="none">None</button>
          </div>

          <div class="cbt-chapter-checklist">
            ${chList
              .map((ch) => {
                const checked = builder.selectedChapters.has(ch.id);
                const cnt = availCounts[ch.id] || 0;
                return `
                  <label class="cbt-chapter-row">
                    <input type="checkbox" class="b-chap-chk" value="${esc(ch.id)}" ${checked ? 'checked' : ''} />
                    <span class="cbt-chap-cls">XI${ch.classLevel === 12 ? 'I' : ''}</span>
                    <span style="flex:1;">${esc(ch.label)} ${ch.legacy ? '<em class="muted-note">(Legacy)</em>' : ''}</span>
                    <span class="filter-count">${cnt}</span>
                  </label>
                `;
              })
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderPdfAndBankTabHtml() {
    const batches = new Map();
    customQuestions.forEach((q) => {
      const bid = q.batchId || 'default';
      if (!batches.has(bid)) {
        batches.set(bid, { id: bid, name: q.batchName || q.examTag || 'Custom Set', items: [], createdAt: q.createdAt || 0 });
      }
      batches.get(bid).items.push(q);
    });
    const batchList = Array.from(batches.values()).sort((a, b) => b.createdAt - a.createdAt);

    return `
      <div class="card cbt-pdf-hero">
        <div>
          <h2 style="margin:0 0 6px;">Upload NEET / NTA Abhyas / Coaching PDFs</h2>
          <p class="muted-note" style="margin:0;">
            Parse multi-page PDFs with <strong>${esc(getResolvedModelId())} Vision</strong> (auto-extracts text, formulas &amp; diagram bounding boxes), or extract offline &amp; drag-to-crop physics circuits, chemical structures, and biology diagrams manually.
          </p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button type="button" class="btn-primary" id="open-pdf-crop-studio-btn">📄 Open PDF Question &amp; Diagram Importer</button>
          <label class="btn-outline file-upload-label" for="cbt-import-json-input">
            Import Question JSON
            <input type="file" id="cbt-import-json-input" accept=".json,application/json" hidden />
          </label>
          <button type="button" class="btn-outline" id="cbt-export-json-btn">Export My Bank &amp; History</button>
        </div>
      </div>

      <h2 class="cbt-subheading" style="margin-top:24px;">Saved PDF, AI &amp; Imported Question Sets (${customQuestions.length} Questions)</h2>
      ${
        batchList.length === 0
          ? `<div class="card" style="padding:28px; text-align:center;">
               <p class="muted-note" style="margin:0;">No saved PDF or custom question sets yet. Click <strong>Open PDF Question &amp; Diagram Importer</strong> above to convert any PDF into an interactive NTA CBT test!</p>
             </div>`
          : `<div class="cbt-test-grid">
               ${batchList
                 .map((b) => {
                   const imgCnt = b.items.filter((q) => q.questionImage).length;
                   return `
                     <article class="card cbt-test-card">
                       <div class="cbt-card-top">
                         <span class="pill-badge accent">${b.items.length} Qs</span>
                         ${imgCnt > 0 ? `<span class="pill-badge lg">${imgCnt} Diagrams</span>` : ''}
                       </div>
                       <h3>${esc(b.name)}</h3>
                       <p class="muted-note">Saved ${b.createdAt ? new Date(b.createdAt).toLocaleString() : ''}</p>
                       <div class="cbt-card-actions" style="margin-top:auto;">
                         <button type="button" class="btn-primary btn-sm cbt-launch-batch" data-batch-id="${esc(b.id)}">Start NTA Test</button>
                         <button type="button" class="btn-danger-ghost btn-sm cbt-delete-batch" data-batch-id="${esc(b.id)}">Delete</button>
                       </div>
                     </article>
                   `;
                 })
                 .join('')}
             </div>`
      }
    `;
  }

  function renderHistoryTabHtml() {
    const allMistakes = [];
    const seenIds = new Set();
    pastAttempts.forEach((att) => {
      (att.evaluation?.questionOutcomes || []).forEach((o) => {
        if (o.status === 'wrong' || o.status === 'unattempted') {
          const q = att.questions?.[o.index];
          if (q && !seenIds.has(q.id)) {
            seenIds.add(q.id);
            allMistakes.push(q);
          }
        }
      });
    });

    return `
      <div class="card cbt-pdf-hero" style="margin-bottom:20px;">
        <div>
          <h2 style="margin:0 0 4px;">Mistake Bank &amp; Historical NTA Analytics</h2>
          <p class="muted-note" style="margin:0;">You currently have <strong>${allMistakes.length}</strong> unique wrong or unattempted question(s) across ${pastAttempts.length} completed test(s).</p>
        </div>
        <button type="button" class="btn-primary" id="hub-retest-all-mistakes" ${allMistakes.length === 0 ? 'disabled' : ''}>
          🔥 Re-Test All Mistakes (${allMistakes.length} Qs)
        </button>
      </div>

      ${
        pastAttempts.length === 0
          ? `<div class="card" style="padding:28px; text-align:center;"><p class="muted-note" style="margin:0;">Complete any Pre-Built, Custom, or PDF test to inspect subject-wise scorecards and time-per-question logs here.</p></div>`
          : `<div class="cbt-history-list">
               ${pastAttempts
                 .map((att) => {
                   const t = att.evaluation?.totals || { marks: 0, maxMarks: 0, correct: 0, wrong: 0 };
                   const acc = t.correct + t.wrong ? Math.round((t.correct / (t.correct + t.wrong)) * 100) : 0;
                   return `
                     <div class="card cbt-history-row">
                       <div>
                         <h3 style="margin:0 0 4px; font-size:1rem;">${esc(att.title)}</h3>
                         <div class="muted-note">${new Date(att.finishedAt).toLocaleString()} · Time Used: ${fmtShortTime(att.timeSpentSec || 0)} · Accuracy: ${acc}%</div>
                       </div>
                       <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                         <span class="pill-badge lg" style="font-size:0.95rem;"><strong>${t.marks} / ${t.maxMarks}</strong></span>
                         <button type="button" class="btn-primary btn-sm cbt-open-attempt-review" data-att-id="${esc(att.id)}">Review Solutions</button>
                         <button type="button" class="btn-outline btn-sm cbt-retake-attempt" data-att-id="${esc(att.id)}">Retake</button>
                         <button type="button" class="btn-danger-ghost btn-sm cbt-delete-attempt" data-att-id="${esc(att.id)}">✕</button>
                       </div>
                     </div>
                   `;
                 })
                 .join('')}
             </div>`
      }
    `;
  }

  function renderCustomizeTemplateModalHtml() {
    if (!customizeTemplate) return '';
    const t = customizeTemplate;
    return `
      <div class="modal-backdrop" id="cbt-customize-backdrop">
        <div class="modal-dialog modal-md">
          <div class="modal-header">
            <div class="modal-title-group">
              <div class="modal-eyebrow">Customize Test Limits</div>
              <h2>${esc(t.title)}</h2>
            </div>
            <button type="button" class="modal-close-btn" id="close-cbt-cust-btn">✕</button>
          </div>
          <div class="modal-body" style="display:flex; flex-direction:column; gap:14px;">
            <div class="cbt-counts-grid">
              <div class="form-field"><label>Physics Qs</label><input type="number" id="cust-phy" min="0" max="100" value="${t.perSubject.physics}" /></div>
              <div class="form-field"><label>Chemistry Qs</label><input type="number" id="cust-che" min="0" max="100" value="${t.perSubject.chemistry}" /></div>
              <div class="form-field"><label>Botany Qs</label><input type="number" id="cust-bot" min="0" max="100" value="${t.perSubject.botany}" /></div>
              <div class="form-field"><label>Zoology Qs</label><input type="number" id="cust-zoo" min="0" max="100" value="${t.perSubject.zoology}" /></div>
            </div>
            <div class="form-field">
              <label for="cust-dur">Custom Time Limit (minutes)</label>
              <input type="number" id="cust-dur" min="1" max="360" value="${t.durationMin}" />
            </div>
            <div class="form-actions">
              <button type="button" class="btn-outline" id="cancel-cbt-cust-btn">Cancel</button>
              <button type="button" class="btn-primary" id="launch-cbt-cust-btn">Start Custom NTA Test</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderHub() {
    const prevScroll = container.querySelector('.cbt-chapter-checklist')?.scrollTop || 0;
    const totalStatic = PYQ_BANK.length + ABHYAS_BANK.length + Object.values(NEET_PAPERS).reduce((a, b) => a + b.length, 0);

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>NTA CBT Test Center — NEET (UG) 2027</h1>
          <p class="section-subtitle">
            Authentic full-screen NTA / TCS iON testing interface with 5-state palette, Portal Dark Mode, official 2016–2026 PYQs, NTA Abhyas questions, custom time/question limits, and PDF diagram importing.
          </p>
        </div>
        <div class="stats-strip">
          <span class="pill-badge accent">Bank: ${totalStatic + customQuestions.length} Qs</span>
          <span class="pill-badge lg">Model: ${esc(getResolvedModelId())}</span>
          <button type="button" class="btn-outline btn-sm" id="hub-portal-theme-btn">
            Portal Theme: ${portalTheme === 'dark' ? '🌙 Dark' : '☀ Classic NTA Light'}
          </button>
        </div>
      </div>

      ${
        activeSavedSession
          ? `<div class="cbt-resume-banner">
               <div>
                 <strong>In-Progress Test Found:</strong> ${esc(activeSavedSession.title)}
                 <span class="muted-note">(${fmtClock(activeSavedSession.timeRemainingSec)} remaining)</span>
               </div>
               <div style="display:flex; gap:8px;">
                 <button type="button" class="btn-primary btn-sm" id="hub-resume-btn">▶ Resume Test</button>
                 <button type="button" class="btn-outline btn-sm" id="hub-discard-btn">Discard</button>
               </div>
             </div>`
          : ''
      }

      <div class="mode-tabs cbt-hub-tabs" role="tablist">
        <button type="button" class="mode-tab-btn ${hubTab === 'prebuilt' ? 'active' : ''}" data-cbt-tab="prebuilt">Pre-Built Mocks &amp; PYQ Papers</button>
        <button type="button" class="mode-tab-btn ${hubTab === 'builder' ? 'active' : ''}" data-cbt-tab="builder">Custom Part / Full Test Builder</button>
        <button type="button" class="mode-tab-btn ${hubTab === 'pdf' ? 'active' : ''}" data-cbt-tab="pdf">PDF Upload &amp; My Bank (${customQuestions.length})</button>
        <button type="button" class="mode-tab-btn ${hubTab === 'history' ? 'active' : ''}" data-cbt-tab="history">Attempts &amp; Mistake Re-Test (${pastAttempts.length})</button>
      </div>

      <div style="margin-top:18px;">
        ${
          hubTab === 'prebuilt'
            ? renderPrebuiltTabHtml()
            : hubTab === 'builder'
            ? renderBuilderTabHtml()
            : hubTab === 'pdf'
            ? renderPdfAndBankTabHtml()
            : renderHistoryTabHtml()
        }
      </div>

      ${renderCustomizeTemplateModalHtml()}
    `;

    const checklist = container.querySelector('.cbt-chapter-checklist');
    if (checklist && prevScroll > 0) checklist.scrollTop = prevScroll;
    wireHubEvents();
  }

  function wireHubEvents() {
    container.querySelector('#hub-portal-theme-btn')?.addEventListener('click', () => {
      portalTheme = portalTheme === 'dark' ? 'light' : 'dark';
      onChangeCbtTheme?.(portalTheme);
      renderHub();
    });

    container.querySelector('#hub-resume-btn')?.addEventListener('click', () => {
      if (activeSavedSession) resumeSavedSession(activeSavedSession);
    });
    container.querySelector('#hub-discard-btn')?.addEventListener('click', async () => {
      await clearActiveSession();
      activeSavedSession = null;
      renderHub();
    });

    container.querySelectorAll('[data-cbt-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        hubTab = btn.dataset.cbtTab;
        renderHub();
      });
    });

    // Prebuilt launches
    container.querySelectorAll('.cbt-launch-tpl').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tpl = PREBUILT_TESTS.find((t) => t.id === btn.dataset.tplId);
        if (tpl) openPortalWithTest(assembleQuestionsFromTemplate(tpl));
      });
    });
    container.querySelectorAll('.cbt-customize-tpl').forEach((btn) => {
      btn.addEventListener('click', () => {
        customizeTemplate = PREBUILT_TESTS.find((t) => t.id === btn.dataset.tplId) || null;
        renderHub();
      });
    });
    container.querySelectorAll('.cbt-launch-paper').forEach((btn) => {
      btn.addEventListener('click', () => {
        const paper = PAPER_REPLAYS.find((p) => p.id === btn.dataset.paperId);
        if (paper) openPortalWithTest(assembleYearPaper(paper));
      });
    });

    // Customize Template Modal
    container.querySelector('#close-cbt-cust-btn')?.addEventListener('click', () => {
      customizeTemplate = null;
      renderHub();
    });
    container.querySelector('#cancel-cbt-cust-btn')?.addEventListener('click', () => {
      customizeTemplate = null;
      renderHub();
    });
    container.querySelector('#launch-cbt-cust-btn')?.addEventListener('click', () => {
      if (!customizeTemplate) return;
      const tpl = customizeTemplate;
      const override = {
        perSubject: {
          physics: Math.max(0, Number(container.querySelector('#cust-phy')?.value) || 0),
          chemistry: Math.max(0, Number(container.querySelector('#cust-che')?.value) || 0),
          botany: Math.max(0, Number(container.querySelector('#cust-bot')?.value) || 0),
          zoology: Math.max(0, Number(container.querySelector('#cust-zoo')?.value) || 0)
        },
        durationMin: Math.max(1, Number(container.querySelector('#cust-dur')?.value) || tpl.durationMin)
      };
      customizeTemplate = null;
      openPortalWithTest(assembleQuestionsFromTemplate(tpl, override));
    });

    // Builder Events
    container.querySelector('#b-test-title')?.addEventListener('input', (e) => (builder.title = e.target.value));
    container.querySelectorAll('.b-preset-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const k = btn.dataset.preset;
        if (k === 'full') {
          builder.perSubject = { physics: 45, chemistry: 45, botany: 45, zoology: 45 };
          builder.biologyCount = 90;
          builder.durationMin = 180;
        } else if (k === 'half') {
          builder.perSubject = { physics: 25, chemistry: 25, botany: 25, zoology: 25 };
          builder.biologyCount = 50;
          builder.durationMin = 90;
        } else {
          builder.perSubject = { physics: 10, chemistry: 10, botany: 10, zoology: 10 };
          builder.biologyCount = 20;
          builder.durationMin = 40;
        }
        renderHub();
      });
    });
    container.querySelectorAll('[data-b-secmode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        builder.sectionMode = btn.dataset.bSecmode;
        renderHub();
      });
    });
    container.querySelector('#b-cnt-phy')?.addEventListener('change', (e) => (builder.perSubject.physics = Math.max(0, Number(e.target.value) || 0)));
    container.querySelector('#b-cnt-che')?.addEventListener('change', (e) => (builder.perSubject.chemistry = Math.max(0, Number(e.target.value) || 0)));
    container.querySelector('#b-cnt-bot')?.addEventListener('change', (e) => (builder.perSubject.botany = Math.max(0, Number(e.target.value) || 0)));
    container.querySelector('#b-cnt-zoo')?.addEventListener('change', (e) => (builder.perSubject.zoology = Math.max(0, Number(e.target.value) || 0)));
    container.querySelector('#b-cnt-bio')?.addEventListener('change', (e) => (builder.biologyCount = Math.max(0, Number(e.target.value) || 0)));
    container.querySelector('#b-duration')?.addEventListener('change', (e) => (builder.durationMin = Math.max(1, Number(e.target.value) || 60)));
    container.querySelector('#b-mark-ok')?.addEventListener('change', (e) => (builder.markingCorrect = Number(e.target.value) || 4));
    container.querySelector('#b-mark-err')?.addEventListener('change', (e) => (builder.markingIncorrect = Number(e.target.value) ?? -1));

    container.querySelectorAll('.b-src-chk').forEach((chk) => {
      chk.addEventListener('change', (e) => {
        builder.sources[chk.dataset.src] = e.target.checked;
        renderHub();
      });
    });
    container.querySelector('#b-ai-style')?.addEventListener('change', (e) => (builder.aiStyle = e.target.value));
    container.querySelector('#b-ai-save')?.addEventListener('change', (e) => (builder.aiSaveToBank = e.target.checked));
    container.querySelector('#b-shuf-q')?.addEventListener('change', (e) => (builder.shuffleQuestions = e.target.checked));
    container.querySelector('#b-shuf-opt')?.addEventListener('change', (e) => (builder.shuffleOptions = e.target.checked));
    container.querySelector('#b-legacy')?.addEventListener('change', (e) => {
      builder.includeLegacy = e.target.checked;
      renderHub();
    });

    container.querySelectorAll('[data-b-subj]').forEach((btn) => {
      btn.addEventListener('click', () => {
        builder.expandedSubject = btn.dataset.bSubj;
        renderHub();
      });
    });
    container.querySelectorAll('.b-scope-global').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.scope;
        builder.selectedChapters.clear();
        if (mode !== 'none') {
          Object.values(NEET_SYLLABUS)
            .flat()
            .filter((c) => (builder.includeLegacy || !c.legacy) && (mode === 'all' || String(c.classLevel) === mode))
            .forEach((c) => builder.selectedChapters.add(c.id));
        }
        renderHub();
      });
    });
    container.querySelectorAll('.b-subj-sel').forEach((btn) => {
      btn.addEventListener('click', () => {
        const act = btn.dataset.action;
        const chs = getChapters(builder.expandedSubject, { includeLegacy: builder.includeLegacy });
        chs.forEach((c) => builder.selectedChapters.delete(c.id));
        if (act !== 'none') {
          chs.filter((c) => act === 'all' || String(c.classLevel) === act).forEach((c) => builder.selectedChapters.add(c.id));
        }
        renderHub();
      });
    });
    container.querySelectorAll('.b-chap-chk').forEach((chk) => {
      chk.addEventListener('change', () => {
        if (chk.checked) builder.selectedChapters.add(chk.value);
        else builder.selectedChapters.delete(chk.value);
        renderHub();
      });
    });
    container.querySelector('#b-launch-btn')?.addEventListener('click', launchCustomBuilderTest);

    // PDF & Bank Tab Events
    container.querySelector('#open-pdf-crop-studio-btn')?.addEventListener('click', () => {
      openPdfCropStudio({
        onSaved: () => refreshStorageData(),
        onStartTestWithQuestions: ({ title, questions, durationMin }) => {
          openPortalWithTest({
            title,
            durationMin,
            sectionMode: '4tab',
            marking: { ...NEET_MARKING },
            questions
          });
        },
        onToast
      });
    });

    container.querySelector('#cbt-export-json-btn')?.addEventListener('click', async () => {
      const json = await exportCbtDataJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `super-study-cbt-bank-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      onToast('Exported CBT question bank & test attempts!');
    });

    container.querySelector('#cbt-import-json-input')?.addEventListener('change', async (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      try {
        const cnt = await importCbtQuestionsJson(await f.text());
        onToast(`Imported ${cnt} question(s) into My Bank!`);
        await refreshStorageData();
      } catch (err) {
        onToast(`Import failed: ${err.message}`);
      } finally {
        e.target.value = '';
      }
    });

    container.querySelectorAll('.cbt-launch-batch').forEach((btn) => {
      btn.addEventListener('click', () => {
        const qs = customQuestions.filter((q) => (q.batchId || 'default') === btn.dataset.batchId);
        if (qs.length) {
          openPortalWithTest({
            title: qs[0].batchName || 'Custom Question Set',
            durationMin: Math.max(5, qs.length),
            sectionMode: '4tab',
            marking: { ...NEET_MARKING },
            questions: qs
          });
        }
      });
    });
    container.querySelectorAll('.cbt-delete-batch').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await deleteCustomBatch(btn.dataset.batchId);
        onToast('Deleted question batch.');
        await refreshStorageData();
      });
    });

    // History Tab Events
    container.querySelector('#hub-retest-all-mistakes')?.addEventListener('click', () => {
      const seen = new Set();
      const mistakes = [];
      pastAttempts.forEach((att) => {
        (att.evaluation?.questionOutcomes || []).forEach((o) => {
          if (o.status === 'wrong' || o.status === 'unattempted') {
            const q = att.questions?.[o.index];
            if (q && !seen.has(q.id)) {
              seen.add(q.id);
              mistakes.push(q);
            }
          }
        });
      });
      if (mistakes.length) {
        openPortalWithTest({
          title: `Mistake Re-Test (${mistakes.length} Qs)`,
          durationMin: Math.max(5, mistakes.length),
          sectionMode: '4tab',
          marking: { ...NEET_MARKING },
          questions: mistakes
        });
      }
    });

    container.querySelectorAll('.cbt-open-attempt-review').forEach((btn) => {
      btn.addEventListener('click', () => {
        const att = pastAttempts.find((a) => a.id === btn.dataset.attId);
        if (!att) return;
        reviewFilter = 'all';
        tutorResponses = {};
        portalState = {
          phase: 'review',
          attempt: att,
          title: att.title,
          questions: att.questions,
          responses: att.responses,
          states: att.states,
          perQuestionSec: att.perQuestionSec,
          marking: att.marking,
          sectionMode: att.sectionMode,
          evaluation: att.evaluation,
          sections: getSectionsForQuestions(att.questions, att.sectionMode)
        };
        onPortalActiveChange(true);
        renderPortal();
      });
    });

    container.querySelectorAll('.cbt-retake-attempt').forEach((btn) => {
      btn.addEventListener('click', () => {
        const att = pastAttempts.find((a) => a.id === btn.dataset.attId);
        if (!att) return;
        openPortalWithTest({
          title: att.title,
          durationMin: att.durationMin,
          sectionMode: att.sectionMode,
          marking: att.marking,
          questions: att.questions
        });
      });
    });

    container.querySelectorAll('.cbt-delete-attempt').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await deleteTestAttempt(btn.dataset.attId);
        await refreshStorageData();
      });
    });
  }

  refreshStorageData();
}
