/**
 * Interactive PDF Question & Diagram Cropper Studio Modal.
 * Supports:
 *  - Rendering multi-page PDFs via pdf.js
 *  - Gemini 3.1 Vision auto-extraction + normalized bounding-box diagram auto-cropping
 *  - Offline column-aware text extraction fallback
 *  - Interactive mouse/touch drag-to-crop on any PDF page (attach diagram to stem, option, or slice whole question)
 *  - Saving permanently to IndexedDB and/or immediately launching an NTA CBT test
 */

import { CBT_SECTIONS, NEET_SYLLABUS } from '../data/neet-syllabus.js';
import { extractQuestionsFromPdfPages } from '../services/gemini.js';
import { getResolvedApiKey, getResolvedModelId } from '../services/storage.js';
import {
  loadPdfDocument,
  renderPdfPage,
  cropNormalizedBoxFromCanvas,
  cropPixelRectFromCanvas,
  extractQuestionsOfflineFromPages,
  parseAnswerKeyText
} from '../services/pdf-parser.js';
import { saveCustomQuestions } from '../services/cbt-storage.js';

function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function openPdfCropStudio({
  onSaved,
  onStartTestWithQuestions,
  onToast = () => {}
}) {
  const existing = document.getElementById('pdf-crop-studio-backdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'pdf-crop-studio-backdrop';
  backdrop.className = 'modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', 'PDF Question & Diagram Cropper Studio');
  document.body.appendChild(backdrop);

  const state = {
    file: null,
    fileName: '',
    pdf: null,
    numPages: 0,
    pageFrom: 1,
    pageTo: 5,
    defaultSubject: '',
    answerKeyText: '',
    customInstructions: '',
    renderedPages: [], // { pageNumber, pageIndex, canvas, dataUrl, base64, mimeType, width, height, textLines }
    activePageIdx: 0,
    questions: [],
    cropTarget: { mode: 'new-image-question' }, // { mode: 'new-image-question' | 'stem-diagram' | 'option-image', qIndex?: number, optIndex?: number }
    isBusy: false,
    statusText: '',
    errorText: '',
    batchName: '',
    launchMinutes: 45
  };

  let dragRect = null; // { startX, startY, curX, curY } in CSS px relative to overlay

  function close() {
    backdrop.remove();
  }

  function applyAnswerKeyToQuestions(qs) {
    const keyMap = parseAnswerKeyText(state.answerKeyText);
    if (!keyMap.size) return qs;
    return qs.map((q, idx) => {
      const qNo = q.qNo || idx + 1;
      if (q.correctIndex == null && keyMap.has(qNo)) {
        return { ...q, correctIndex: keyMap.get(qNo) };
      }
      return q;
    });
  }

  async function handleFileSelect(file) {
    if (!file) return;
    state.isBusy = true;
    state.errorText = '';
    state.statusText = `Loading "${file.name}"...`;
    render();
    try {
      const doc = await loadPdfDocument(file);
      state.file = file;
      state.fileName = doc.fileName;
      state.pdf = doc.pdf;
      state.numPages = doc.numPages;
      state.pageFrom = 1;
      state.pageTo = Math.min(5, doc.numPages);
      state.batchName = doc.fileName.replace(/\.pdf$/i, '');
      state.renderedPages = [];
      state.questions = [];
      state.activePageIdx = 0;
      await renderSelectedPageRange();
    } catch (err) {
      state.errorText = `Failed to load PDF: ${err.message}`;
    } finally {
      state.isBusy = false;
      state.statusText = '';
      render();
    }
  }

  async function renderSelectedPageRange() {
    if (!state.pdf) return;
    const from = Math.max(1, Math.min(state.numPages, Number(state.pageFrom) || 1));
    const to = Math.max(from, Math.min(state.numPages, Number(state.pageTo) || from));
    state.pageFrom = from;
    state.pageTo = to;

    const pages = [];
    for (let p = from; p <= to; p++) {
      state.statusText = `Rendering PDF page ${p} of ${to}...`;
      updateStatusOnly();
      const rendered = await renderPdfPage(state.pdf, p, 1.85);
      pages.push(rendered);
    }
    state.renderedPages = pages;
    state.activePageIdx = 0;
  }

  function updateStatusOnly() {
    const el = backdrop.querySelector('#pdf-studio-status');
    if (el) el.textContent = state.statusText;
  }

  async function runGeminiExtraction() {
    if (!state.pdf) {
      state.errorText = 'Please upload a PDF file first.';
      render();
      return;
    }
    if (!getResolvedApiKey()) {
      state.errorText = 'No GEMINI_API_KEY configured. Add one in "Gemini API" or use Offline Text Extract / Quick Page-Slice.';
      render();
      return;
    }

    state.isBusy = true;
    state.errorText = '';
    render();
    try {
      await renderSelectedPageRange();
      const pages = state.renderedPages;
      const extracted = [];
      const batchSize = 2; // 2 pages per Gemini call prevents JSON truncation on dense exam papers

      for (let i = 0; i < pages.length; i += batchSize) {
        const chunk = pages.slice(i, i + batchSize);
        const pageNums = chunk.map((p) => p.pageNumber).join(', ');
        state.statusText = `Analyzing PDF page(s) ${pageNums} with ${getResolvedModelId()} Vision...`;
        updateStatusOnly();

        const chunkQs = await extractQuestionsFromPdfPages({
          pageImages: chunk.map((p) => ({ index: p.pageIndex, base64: p.base64, mimeType: p.mimeType })),
          defaultSubject: state.defaultSubject,
          customInstructions: state.customInstructions,
          answerKeyText: state.answerKeyText
        });

        for (const q of chunkQs) {
          // Auto-crop diagram if Gemini returned a normalized bounding box
          if (q.diagramBox && q.pageIndex != null) {
            const pageObj = pages.find((p) => p.pageIndex === q.pageIndex) || chunk[0];
            if (pageObj?.canvas) {
              q.questionImage = cropNormalizedBoxFromCanvas(pageObj.canvas, q.diagramBox);
            }
          }
          delete q.diagramBox;
          extracted.push(q);
        }
      }

      state.questions = applyAnswerKeyToQuestions(extracted);
      state.launchMinutes = Math.max(5, state.questions.length);
      if (state.questions.length === 0) {
        state.errorText = 'No MCQs were detected on the selected pages. Try Manual Page-Slice mode to crop questions directly.';
      } else {
        onToast(`Extracted ${state.questions.length} question(s) from PDF!`);
      }
    } catch (err) {
      state.errorText = `AI extraction error: ${err.message}`;
    } finally {
      state.isBusy = false;
      state.statusText = '';
      render();
    }
  }

  async function runOfflineExtraction() {
    if (!state.pdf) {
      state.errorText = 'Please upload a PDF file first.';
      render();
      return;
    }
    state.isBusy = true;
    state.errorText = '';
    render();
    try {
      await renderSelectedPageRange();
      const extracted = extractQuestionsOfflineFromPages(state.renderedPages, {
        defaultSubject: state.defaultSubject,
        answerKeyText: state.answerKeyText
      });
      state.questions = applyAnswerKeyToQuestions(extracted);
      state.launchMinutes = Math.max(5, state.questions.length);
      if (state.questions.length === 0) {
        state.errorText = 'No numbered text questions detected (this PDF may be scanned images). Use AI Vision Extract or Drag-to-Crop Whole Question!';
      } else {
        onToast(`Offline extracted ${state.questions.length} question(s). Crop any diagrams on the left!`);
      }
    } catch (err) {
      state.errorText = `Offline extraction failed: ${err.message}`;
    } finally {
      state.isBusy = false;
      state.statusText = '';
      render();
    }
  }

  function handleCropComplete(cssRect) {
    const activePage = state.renderedPages[state.activePageIdx];
    const imgEl = backdrop.querySelector('#pdf-preview-img');
    if (!activePage || !imgEl) return;

    const dispW = imgEl.clientWidth;
    const dispH = imgEl.clientHeight;
    if (!dispW || !dispH) return;

    const scaleX = activePage.canvas.width / dispW;
    const scaleY = activePage.canvas.height / dispH;

    const croppedUrl = cropPixelRectFromCanvas(activePage.canvas, {
      x: cssRect.x * scaleX,
      y: cssRect.y * scaleY,
      w: cssRect.w * scaleX,
      h: cssRect.h * scaleY
    });
    if (!croppedUrl) return;

    const t = state.cropTarget;
    if (t.mode === 'stem-diagram' && state.questions[t.qIndex]) {
      state.questions[t.qIndex].questionImage = croppedUrl;
      onToast(`Attached diagram to Q${t.qIndex + 1}`);
      state.cropTarget = { mode: 'new-image-question' };
    } else if (t.mode === 'option-image' && state.questions[t.qIndex]) {
      const q = state.questions[t.qIndex];
      if (!Array.isArray(q.optionImages)) q.optionImages = [null, null, null, null];
      q.optionImages[t.optIndex] = croppedUrl;
      onToast(`Attached Option (${t.optIndex + 1}) image to Q${t.qIndex + 1}`);
      state.cropTarget = { mode: 'new-image-question' };
    } else {
      const idx = state.questions.length + 1;
      state.questions.push({
        id: `pdf-crop-${Date.now().toString(36)}-${idx}`,
        subject: state.defaultSubject || 'physics',
        chapterId: null,
        classLevel: null,
        source: 'PDF',
        examTag: state.batchName || 'PDF Image Slice',
        year: null,
        qNo: idx,
        section: null,
        question: `PDF Question #${idx} (Page ${activePage.pageNumber})`,
        questionImage: croppedUrl,
        imageOnly: true,
        options: ['Option (1)', 'Option (2)', 'Option (3)', 'Option (4)'],
        optionImages: [null, null, null, null],
        correctIndex: null,
        explanation: '',
        pageIndex: activePage.pageIndex
      });
      state.launchMinutes = Math.max(5, state.questions.length);
      onToast(`Created Image Question #${idx} from Page ${activePage.pageNumber}`);
    }
    render();
  }

  async function saveQuestionsToBank(andLaunch = false) {
    if (state.questions.length === 0) {
      state.errorText = 'Extract or crop at least 1 question first.';
      render();
      return;
    }
    const clean = state.questions.map((q, idx) => ({
      ...q,
      examTag: state.batchName.trim() || q.examTag || 'PDF Upload',
      qNo: q.qNo || idx + 1
    }));
    const saved = await saveCustomQuestions(clean, {
      batchName: state.batchName.trim() || state.fileName || 'PDF Question Set'
    });
    onSaved?.(saved);
    if (andLaunch) {
      close();
      onStartTestWithQuestions?.({
        title: state.batchName.trim() || 'PDF Custom CBT Test',
        questions: saved.questions,
        durationMin: Math.max(1, Number(state.launchMinutes) || saved.questions.length)
      });
    } else {
      onToast(`Saved ${saved.count} question(s) to your IndexedDB Question Bank!`);
      close();
    }
  }

  function getCropBannerText() {
    const t = state.cropTarget;
    if (t.mode === 'stem-diagram') {
      return `Crop Mode Active: Drag a rectangle on the PDF page to attach a Diagram to Q${t.qIndex + 1}`;
    }
    if (t.mode === 'option-image') {
      return `Crop Mode Active: Drag a rectangle on the PDF page to attach Image to Q${t.qIndex + 1} Option (${t.optIndex + 1})`;
    }
    return 'Quick Slice Mode: Drag a box on the PDF page to add a whole Question Image Card (or click ✂️ on any question on the right to attach a diagram).';
  }

  function render() {
    const activePage = state.renderedPages[state.activePageIdx];
    const hasKey = Boolean(getResolvedApiKey());

    backdrop.innerHTML = `
      <div class="modal-dialog modal-xxl pdf-studio-dialog">
        <div class="modal-header">
          <div class="modal-title-group">
            <div class="modal-eyebrow">PDF.js + ${esc(getResolvedModelId())} Vision &amp; Manual Diagram Cropper</div>
            <h2>PDF Question &amp; Diagram Importer Studio</h2>
          </div>
          <button type="button" class="modal-close-btn" id="close-pdf-studio-btn" aria-label="Close PDF studio">✕</button>
        </div>

        <div class="modal-body pdf-studio-body">
          <!-- Controls Strip -->
          <div class="pdf-controls-card">
            <div class="pdf-controls-grid">
              <div class="form-field">
                <label for="pdf-file-input">1. Select PDF Question Paper</label>
                <input type="file" id="pdf-file-input" accept="application/pdf" />
                ${state.fileName ? `<div class="muted-note" style="margin-top:4px;">Loaded: <strong>${esc(state.fileName)}</strong> (${state.numPages} pages)</div>` : ''}
              </div>

              <div class="form-field">
                <label>2. Page Range</label>
                <div style="display:flex; gap:8px; align-items:center;">
                  <input type="number" id="pdf-page-from" min="1" max="${Math.max(1, state.numPages)}" value="${state.pageFrom}" style="width:76px;" />
                  <span>to</span>
                  <input type="number" id="pdf-page-to" min="1" max="${Math.max(1, state.numPages)}" value="${state.pageTo}" style="width:76px;" />
                  <button type="button" class="btn-outline btn-sm" id="pdf-render-pages-btn" ${!state.pdf || state.isBusy ? 'disabled' : ''}>Load Pages</button>
                </div>
              </div>

              <div class="form-field">
                <label for="pdf-default-subject">3. Default Subject</label>
                <select id="pdf-default-subject">
                  <option value="" ${state.defaultSubject === '' ? 'selected' : ''}>Auto-detect per question</option>
                  ${CBT_SECTIONS.map((s) => `<option value="${s.id}" ${state.defaultSubject === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}
                </select>
              </div>

              <div class="form-field">
                <label for="pdf-answer-key">4. Answer Key (Optional)</label>
                <input type="text" id="pdf-answer-key" value="${esc(state.answerKeyText)}" placeholder="e.g. 1:A 2:C 3:2 4:D" />
              </div>
            </div>

            <div class="pdf-action-strip">
              <button type="button" class="btn-primary" id="pdf-ai-extract-btn" ${!state.pdf || state.isBusy ? 'disabled' : ''}>
                ✨ AI Vision Extract + Auto-Crop Diagrams (${esc(getResolvedModelId())})
              </button>
              <button type="button" class="btn-outline" id="pdf-offline-extract-btn" ${!state.pdf || state.isBusy ? 'disabled' : ''}>
                📄 Offline Text Extract (No API Key)
              </button>
              <button type="button" class="btn-outline" id="pdf-add-blank-q-btn">
                + Add Empty Question
              </button>
              ${!hasKey ? `<span class="muted-note">Tip: No Gemini key active — Offline Text Extract &amp; Drag-to-Crop work 100% offline.</span>` : ''}
            </div>

            <div id="pdf-studio-status" class="pdf-status-line" ${!state.statusText ? 'hidden' : ''}>${esc(state.statusText)}</div>
            ${state.errorText ? `<div class="settings-feedback err" style="margin-top:8px;">${esc(state.errorText)}</div>` : ''}
          </div>

          <!-- Split Viewer & Editor -->
          <div class="pdf-split-workspace">
            <!-- Left: PDF Canvas & Drag Cropper -->
            <div class="pdf-viewer-pane">
              <div class="pdf-pane-toolbar">
                <div style="display:flex; gap:6px; align-items:center;">
                  <button type="button" class="btn-outline btn-sm" id="pdf-prev-page-btn" ${state.activePageIdx <= 0 ? 'disabled' : ''}>◀ Prev</button>
                  <span style="font-size:0.84rem; font-weight:600;">
                    ${activePage ? `Page ${activePage.pageNumber} (${state.activePageIdx + 1}/${state.renderedPages.length})` : 'No pages loaded'}
                  </span>
                  <button type="button" class="btn-outline btn-sm" id="pdf-next-page-btn" ${state.activePageIdx >= state.renderedPages.length - 1 ? 'disabled' : ''}>Next ▶</button>
                </div>
                ${
                  state.cropTarget.mode !== 'new-image-question'
                    ? `<button type="button" class="btn-outline btn-sm" id="pdf-cancel-crop-target-btn">Cancel Target</button>`
                    : ''
                }
              </div>

              <div class="pdf-crop-target-banner ${state.cropTarget.mode !== 'new-image-question' ? 'targeting' : ''}">
                ${esc(getCropBannerText())}
              </div>

              <div class="pdf-canvas-scroll">
                ${
                  activePage
                    ? `<div class="pdf-crop-stage" id="pdf-crop-stage">
                         <img src="${activePage.dataUrl}" id="pdf-preview-img" alt="PDF Page ${activePage.pageNumber}" draggable="false" />
                         <div class="pdf-crop-overlay" id="pdf-crop-overlay"></div>
                         <div class="pdf-crop-selection" id="pdf-crop-selection" hidden></div>
                       </div>`
                    : `<div class="pdf-empty-stage">
                         <p>Upload a NEET / NTA Abhyas / Coaching PDF above to preview pages, auto-extract questions with diagrams, or drag-crop figures manually.</p>
                       </div>`
                }
              </div>
            </div>

            <!-- Right: Extracted Questions List -->
            <div class="pdf-questions-pane">
              <div class="pdf-pane-toolbar">
                <strong>Extracted Questions (${state.questions.length})</strong>
                <span class="muted-note">Verify text, diagrams, subject &amp; answer key</span>
              </div>

              <div class="pdf-questions-list">
                ${
                  state.questions.length === 0
                    ? `<div class="pdf-empty-stage" style="padding:24px;">
                         No questions yet. Run <strong>AI Vision Extract</strong>, <strong>Offline Text Extract</strong>, or drag a rectangle on any loaded PDF page to slice an image question.
                       </div>`
                    : state.questions
                        .map((q, qIdx) => {
                          const chapters = NEET_SYLLABUS[q.subject] || [];
                          return `
                            <div class="pdf-q-card" data-qidx="${qIdx}">
                              <div class="pdf-q-head">
                                <strong>Q${qIdx + 1}</strong>
                                <select class="pdf-q-subject" data-qidx="${qIdx}" aria-label="Subject for question ${qIdx + 1}">
                                  ${CBT_SECTIONS.map((s) => `<option value="${s.id}" ${q.subject === s.id ? 'selected' : ''}>${s.label}</option>`).join('')}
                                </select>
                                <select class="pdf-q-chapter" data-qidx="${qIdx}" aria-label="Chapter for question ${qIdx + 1}">
                                  <option value="">(Untagged chapter)</option>
                                  ${chapters.map((c) => `<option value="${c.id}" ${q.chapterId === c.id ? 'selected' : ''}>${esc(c.label)}</option>`).join('')}
                                </select>
                                <button type="button" class="btn-danger-ghost btn-sm pdf-q-del-btn" data-qidx="${qIdx}" title="Delete question">✕</button>
                              </div>

                              <textarea class="pdf-q-stem" data-qidx="${qIdx}" rows="3" placeholder="Question text...">${esc(q.question)}</textarea>

                              <div class="pdf-q-diagram-row">
                                ${
                                  q.questionImage
                                    ? `<div class="pdf-diagram-thumb-wrap">
                                         <img src="${q.questionImage}" alt="Question diagram" class="pdf-diagram-thumb" />
                                         <button type="button" class="btn-outline btn-sm pdf-q-rm-img" data-qidx="${qIdx}">Remove Diagram</button>
                                       </div>`
                                    : ''
                                }
                                <button type="button" class="btn-outline btn-sm pdf-q-crop-stem" data-qidx="${qIdx}">
                                  ✂️ ${q.questionImage ? 'Re-Crop' : 'Crop'} Diagram from PDF
                                </button>
                                <label style="font-size:0.78rem; display:inline-flex; align-items:center; gap:5px; cursor:pointer;">
                                  <input type="checkbox" class="pdf-q-imageonly" data-qidx="${qIdx}" ${q.imageOnly ? 'checked' : ''} />
                                  Image contains options
                                </label>
                              </div>

                              <div class="pdf-q-options-grid">
                                ${[0, 1, 2, 3]
                                  .map(
                                    (optIdx) => `
                                      <div class="pdf-opt-edit-row">
                                        <label class="pdf-opt-radio">
                                          <input type="radio" name="pdf-ans-${qIdx}" class="pdf-q-ans" data-qidx="${qIdx}" value="${optIdx}" ${q.correctIndex === optIdx ? 'checked' : ''} />
                                          <span>(${optIdx + 1})</span>
                                        </label>
                                        <input type="text" class="pdf-q-opt-input" data-qidx="${qIdx}" data-optidx="${optIdx}" value="${esc(q.options[optIdx] || '')}" placeholder="Option (${optIdx + 1})" />
                                        <button type="button" class="btn-ghost btn-sm pdf-q-crop-opt" data-qidx="${qIdx}" data-optidx="${optIdx}" title="Crop option image from PDF">✂️</button>
                                      </div>
                                      ${
                                        q.optionImages?.[optIdx]
                                          ? `<div style="padding-left:44px;"><img src="${q.optionImages[optIdx]}" alt="Option ${optIdx + 1}" class="pdf-opt-thumb" /></div>`
                                          : ''
                                      }
                                    `
                                  )
                                  .join('')}
                              </div>
                            </div>
                          `;
                        })
                        .join('')
                }
              </div>
            </div>
          </div>

          <!-- Footer Save / Launch -->
          <div class="pdf-studio-footer">
            <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
              <label style="font-size:0.82rem; font-weight:600;">
                Set Name:
                <input type="text" id="pdf-batch-name" value="${esc(state.batchName)}" placeholder="e.g. Allen Mock #5" style="margin-left:6px; width:210px;" />
              </label>
              <label style="font-size:0.82rem; font-weight:600;">
                Test Time (min):
                <input type="number" id="pdf-launch-minutes" min="1" max="300" value="${state.launchMinutes}" style="margin-left:6px; width:72px;" />
              </label>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
              <button type="button" class="btn-outline" id="pdf-save-bank-btn" ${state.questions.length === 0 || state.isBusy ? 'disabled' : ''}>
                💾 Save to My Bank (${state.questions.length})
              </button>
              <button type="button" class="btn-primary" id="pdf-save-launch-btn" ${state.questions.length === 0 || state.isBusy ? 'disabled' : ''}>
                🚀 Save &amp; Launch NTA CBT Test
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    wireEvents();
  }

  function wireEvents() {
    backdrop.querySelector('#close-pdf-studio-btn')?.addEventListener('click', close);
    backdrop.querySelector('#pdf-file-input')?.addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (f) handleFileSelect(f);
    });
    backdrop.querySelector('#pdf-page-from')?.addEventListener('change', (e) => {
      state.pageFrom = Number(e.target.value) || 1;
    });
    backdrop.querySelector('#pdf-page-to')?.addEventListener('change', (e) => {
      state.pageTo = Number(e.target.value) || state.pageFrom;
    });
    backdrop.querySelector('#pdf-render-pages-btn')?.addEventListener('click', async () => {
      state.isBusy = true;
      state.errorText = '';
      render();
      try {
        await renderSelectedPageRange();
      } catch (err) {
        state.errorText = err.message;
      } finally {
        state.isBusy = false;
        state.statusText = '';
        render();
      }
    });
    backdrop.querySelector('#pdf-default-subject')?.addEventListener('change', (e) => {
      state.defaultSubject = e.target.value;
    });
    backdrop.querySelector('#pdf-answer-key')?.addEventListener('input', (e) => {
      state.answerKeyText = e.target.value;
    });
    backdrop.querySelector('#pdf-ai-extract-btn')?.addEventListener('click', runGeminiExtraction);
    backdrop.querySelector('#pdf-offline-extract-btn')?.addEventListener('click', runOfflineExtraction);

    backdrop.querySelector('#pdf-add-blank-q-btn')?.addEventListener('click', () => {
      const idx = state.questions.length + 1;
      state.questions.push({
        id: `pdf-man-${Date.now().toString(36)}-${idx}`,
        subject: state.defaultSubject || 'physics',
        chapterId: null,
        classLevel: null,
        source: 'PDF',
        examTag: state.batchName || 'PDF Upload',
        year: null,
        qNo: idx,
        section: null,
        question: '',
        questionImage: null,
        imageOnly: false,
        options: ['', '', '', ''],
        optionImages: [null, null, null, null],
        correctIndex: null,
        explanation: ''
      });
      render();
    });

    backdrop.querySelector('#pdf-prev-page-btn')?.addEventListener('click', () => {
      if (state.activePageIdx > 0) {
        state.activePageIdx -= 1;
        render();
      }
    });
    backdrop.querySelector('#pdf-next-page-btn')?.addEventListener('click', () => {
      if (state.activePageIdx < state.renderedPages.length - 1) {
        state.activePageIdx += 1;
        render();
      }
    });
    backdrop.querySelector('#pdf-cancel-crop-target-btn')?.addEventListener('click', () => {
      state.cropTarget = { mode: 'new-image-question' };
      render();
    });

    // Drag-to-crop overlay events
    const overlay = backdrop.querySelector('#pdf-crop-overlay');
    const selBox = backdrop.querySelector('#pdf-crop-selection');
    if (overlay && selBox) {
      const getLocalPoint = (ev) => {
        const rect = overlay.getBoundingClientRect();
        const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
        const clientY = ev.touches ? ev.touches[0].clientY : ev.clientY;
        return {
          x: Math.max(0, Math.min(rect.width, clientX - rect.left)),
          y: Math.max(0, Math.min(rect.height, clientY - rect.top))
        };
      };

      const startDrag = (ev) => {
        ev.preventDefault();
        const pt = getLocalPoint(ev);
        dragRect = { startX: pt.x, startY: pt.y, curX: pt.x, curY: pt.y };
        selBox.hidden = false;
        selBox.style.left = `${pt.x}px`;
        selBox.style.top = `${pt.y}px`;
        selBox.style.width = '0px';
        selBox.style.height = '0px';
      };

      const moveDrag = (ev) => {
        if (!dragRect) return;
        const pt = getLocalPoint(ev);
        dragRect.curX = pt.x;
        dragRect.curY = pt.y;
        const x = Math.min(dragRect.startX, dragRect.curX);
        const y = Math.min(dragRect.startY, dragRect.curY);
        const w = Math.abs(dragRect.curX - dragRect.startX);
        const h = Math.abs(dragRect.curY - dragRect.startY);
        selBox.style.left = `${x}px`;
        selBox.style.top = `${y}px`;
        selBox.style.width = `${w}px`;
        selBox.style.height = `${h}px`;
      };

      const endDrag = () => {
        if (!dragRect) return;
        const x = Math.min(dragRect.startX, dragRect.curX);
        const y = Math.min(dragRect.startY, dragRect.curY);
        const w = Math.abs(dragRect.curX - dragRect.startX);
        const h = Math.abs(dragRect.curY - dragRect.startY);
        dragRect = null;
        selBox.hidden = true;
        if (w >= 14 && h >= 14) {
          handleCropComplete({ x, y, w, h });
        }
      };

      overlay.addEventListener('mousedown', startDrag);
      overlay.addEventListener('mousemove', moveDrag);
      overlay.addEventListener('mouseup', endDrag);
      overlay.addEventListener('mouseleave', endDrag);
      overlay.addEventListener('touchstart', startDrag, { passive: false });
      overlay.addEventListener('touchmove', moveDrag, { passive: false });
      overlay.addEventListener('touchend', endDrag);
    }

    // Question card editors
    backdrop.querySelectorAll('.pdf-q-subject').forEach((el) => {
      el.addEventListener('change', () => {
        const q = state.questions[Number(el.dataset.qidx)];
        if (q) {
          q.subject = el.value;
          q.chapterId = null;
          render();
        }
      });
    });
    backdrop.querySelectorAll('.pdf-q-chapter').forEach((el) => {
      el.addEventListener('change', () => {
        const q = state.questions[Number(el.dataset.qidx)];
        if (q) q.chapterId = el.value || null;
      });
    });
    backdrop.querySelectorAll('.pdf-q-stem').forEach((el) => {
      el.addEventListener('input', () => {
        const q = state.questions[Number(el.dataset.qidx)];
        if (q) q.question = el.value;
      });
    });
    backdrop.querySelectorAll('.pdf-q-del-btn').forEach((el) => {
      el.addEventListener('click', () => {
        state.questions.splice(Number(el.dataset.qidx), 1);
        state.cropTarget = { mode: 'new-image-question' };
        render();
      });
    });
    backdrop.querySelectorAll('.pdf-q-rm-img').forEach((el) => {
      el.addEventListener('click', () => {
        const q = state.questions[Number(el.dataset.qidx)];
        if (q) {
          q.questionImage = null;
          render();
        }
      });
    });
    backdrop.querySelectorAll('.pdf-q-crop-stem').forEach((el) => {
      el.addEventListener('click', () => {
        const qIdx = Number(el.dataset.qidx);
        const q = state.questions[qIdx];
        if (q && q.pageIndex != null) {
          const foundPage = state.renderedPages.findIndex((p) => p.pageIndex === q.pageIndex);
          if (foundPage >= 0) state.activePageIdx = foundPage;
        }
        state.cropTarget = { mode: 'stem-diagram', qIndex: qIdx };
        render();
      });
    });
    backdrop.querySelectorAll('.pdf-q-imageonly').forEach((el) => {
      el.addEventListener('change', () => {
        const q = state.questions[Number(el.dataset.qidx)];
        if (q) q.imageOnly = el.checked;
      });
    });
    backdrop.querySelectorAll('.pdf-q-ans').forEach((el) => {
      el.addEventListener('change', () => {
        const q = state.questions[Number(el.dataset.qidx)];
        if (q) q.correctIndex = Number(el.value);
      });
    });
    backdrop.querySelectorAll('.pdf-q-opt-input').forEach((el) => {
      el.addEventListener('input', () => {
        const q = state.questions[Number(el.dataset.qidx)];
        if (q) q.options[Number(el.dataset.optidx)] = el.value;
      });
    });
    backdrop.querySelectorAll('.pdf-q-crop-opt').forEach((el) => {
      el.addEventListener('click', () => {
        state.cropTarget = {
          mode: 'option-image',
          qIndex: Number(el.dataset.qidx),
          optIndex: Number(el.dataset.optidx)
        };
        render();
      });
    });

    backdrop.querySelector('#pdf-batch-name')?.addEventListener('input', (e) => {
      state.batchName = e.target.value;
    });
    backdrop.querySelector('#pdf-launch-minutes')?.addEventListener('input', (e) => {
      state.launchMinutes = Number(e.target.value) || 45;
    });
    backdrop.querySelector('#pdf-save-bank-btn')?.addEventListener('click', () => saveQuestionsToBank(false));
    backdrop.querySelector('#pdf-save-launch-btn')?.addEventListener('click', () => saveQuestionsToBank(true));
  }

  render();
}
