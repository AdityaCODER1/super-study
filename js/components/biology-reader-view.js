/**
 * Biology NCERT Reader & "Between-the-Lines" Decoder
 * - Full 32-chapter Class 11 & 12 Botany & Zoology syllabus navigation
 * - Sentence-by-sentence NCERT passages with 4-layer "Between-the-Lines" breakdowns
 * - Integrated Active-Recall masking (Cloze key terms or hide subtext)
 * - Extendable via NCERT PDF upload (pdf-parser.js) or pasted text + Gemini AI decoder
 * - Direct deep-links to Interactive Concept Setups and Doubt Tutor
 */

import { BIOLOGY_CHAPTER_CATALOG, NCERT_CHAPTER_MODULES } from '../data/biology-ncert-data.js';
import { decodeNcertPassageBetweenTheLines } from '../services/gemini.js';
import { loadPdfDocument, renderPdfPage } from '../services/pdf-parser.js';
import { renderInlineMarkdown, escapeHtml } from '../services/markdown.js';
import { getResolvedApiKey } from '../services/storage.js';

function renderClozeHtml(clozeText, plainText, maskTerms) {
  if (!maskTerms) {
    return renderInlineMarkdown(plainText || clozeText.replace(/\{\{(.*?)\}\}/g, '$1'));
  }
  const source = clozeText || plainText || '';
  const parts = [];
  const re = /\{\{(.*?)\}\}/g;
  let lastIndex = 0;
  let match;
  while ((match = re.exec(source)) !== null) {
    if (match.index > lastIndex) {
      parts.push(renderInlineMarkdown(source.slice(lastIndex, match.index)));
    }
    const term = match[1];
    parts.push(
      `<button type="button" class="bio-cloze-token" data-cloze-reveal title="Click to reveal term">${renderInlineMarkdown(term)}</button>`
    );
    lastIndex = re.lastIndex;
  }
  if (lastIndex < source.length) {
    parts.push(renderInlineMarkdown(source.slice(lastIndex)));
  }
  return parts.join('');
}

export function renderBiologyReaderView(
  container,
  {
    activeChapterId = 'bot-respiration',
    maskMode = 'none', // 'none' | 'product' (mask key terms) | 'reagent' (hide subtext)
    searchQuery = '',
    bioLineMastery = {},
    bioCustomModules = {},
    bookmarks = [],
    onSelectChapter,
    onUpdateLineMastery,
    onToggleBookmark,
    onSaveCustomLines,
    onDeleteCustomLine,
    onOpenSetup,
    onAskDoubtOnLine,
    onOpenSettings,
    onToast
  }
) {
  let classFilter = 'all'; // 'all' | '11' | '12'
  let discFilter = 'all'; // 'all' | 'botany' | 'zoology'
  let sectionFilter = 'all';
  let readingStyle = 'deep'; // 'deep' | 'focused' | 'cloze'
  let expandedLineIds = new Set();
  let showImporter = false;
  let importerSectionTitle = 'NCERT Custom Passage';
  let importerRawText = '';
  let importerPdfStatus = '';
  let importerLoading = false;
  let importerError = '';
  let manualNcertLine = '';
  let manualInference = '';
  let manualTrap = '';

  function getChapterLines(chapterId) {
    const builtIn = NCERT_CHAPTER_MODULES[chapterId] || [];
    const custom = Array.isArray(bioCustomModules[chapterId]) ? bioCustomModules[chapterId] : [];
    return [...builtIn, ...custom];
  }

  function render() {
    const selectedChapter =
      BIOLOGY_CHAPTER_CATALOG.find((c) => c.id === activeChapterId) || BIOLOGY_CHAPTER_CATALOG[11];

    const filteredCatalog = BIOLOGY_CHAPTER_CATALOG.filter((ch) => {
      if (classFilter !== 'all' && String(ch.classLevel) !== classFilter) return false;
      if (discFilter !== 'all' && ch.discipline !== discFilter) return false;
      return true;
    });

    const allChapterLines = getChapterLines(selectedChapter.id);
    const sections = Array.from(new Set(allChapterLines.map((l) => l.sectionTitle).filter(Boolean)));
    if (sectionFilter !== 'all' && !sections.includes(sectionFilter)) {
      sectionFilter = 'all';
    }

    const q = searchQuery.trim().toLowerCase();
    // If global search is active, search across ALL chapters if current chapter has 0 matches or search spans globally
    let displayLines = allChapterLines;
    let isGlobalSearchMode = false;
    if (q) {
      const localMatches = allChapterLines.filter((l) =>
        [l.ncertText, l.sectionTitle, l.betweenTheLines?.inference, l.betweenTheLines?.mechanism, l.betweenTheLines?.neetTrap]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
      if (localMatches.length > 0) {
        displayLines = localMatches;
      } else {
        isGlobalSearchMode = true;
        const everyChapterLines = BIOLOGY_CHAPTER_CATALOG.flatMap((c) => getChapterLines(c.id));
        displayLines = everyChapterLines.filter((l) =>
          [l.ncertText, l.sectionTitle, l.betweenTheLines?.inference, l.betweenTheLines?.mechanism, l.betweenTheLines?.neetTrap]
            .join(' ')
            .toLowerCase()
            .includes(q)
        );
      }
    } else if (sectionFilter !== 'all') {
      displayLines = allChapterLines.filter((l) => l.sectionTitle === sectionFilter);
    }

    const totalLinesLoaded = BIOLOGY_CHAPTER_CATALOG.reduce((acc, c) => acc + getChapterLines(c.id).length, 0);
    const masteredLinesCount = Object.values(bioLineMastery).filter((v) => v === 'mastered').length;
    const trickyLinesCount = Object.values(bioLineMastery).filter((v) => v === 'tricky').length;

    const maskKeyTerms = readingStyle === 'cloze' || maskMode === 'product';
    const maskSubtext = maskMode === 'reagent';

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>NCERT Biology Line-by-Line &amp; "Between-the-Lines" Reader</h1>
          <p class="section-subtitle">
            Read NCERT sentences deeply—uncover implied mechanisms, NTA word-swap traps, and stoichiometric deductions, or decode any chapter PDF.
          </p>
        </div>
        <div class="stats-strip">
          <span class="pill-badge lg">Lines Mastered: ${masteredLinesCount}/${totalLinesLoaded}</span>
          <span class="pill-badge danger">Tricky Lines: ${trickyLinesCount}</span>
          <span class="pill-badge accent">32 NCERT Chapters</span>
        </div>
      </div>

      <div class="explorer-layout">
        <aside class="explorer-sidebar bio-reader-sidebar">
          <div>
            <h3 class="sidebar-group-title">Class &amp; Stream</h3>
            <div class="mode-tabs" style="width:100%; display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); margin-bottom:8px;">
              <button type="button" class="mode-tab-btn ${classFilter === 'all' ? 'active' : ''}" data-bio-cls="all">All</button>
              <button type="button" class="mode-tab-btn ${classFilter === '11' ? 'active' : ''}" data-bio-cls="11">Class 11</button>
              <button type="button" class="mode-tab-btn ${classFilter === '12' ? 'active' : ''}" data-bio-cls="12">Class 12</button>
            </div>
            <div class="mode-tabs" style="width:100%; display:grid; grid-template-columns:repeat(3, minmax(0, 1fr));">
              <button type="button" class="mode-tab-btn ${discFilter === 'all' ? 'active' : ''}" data-bio-disc="all">Both</button>
              <button type="button" class="mode-tab-btn ${discFilter === 'botany' ? 'active' : ''}" data-bio-disc="botany">Botany</button>
              <button type="button" class="mode-tab-btn ${discFilter === 'zoology' ? 'active' : ''}" data-bio-disc="zoology">Zoology</button>
            </div>
          </div>

          <div>
            <h3 class="sidebar-group-title">NCERT Chapters (${filteredCatalog.length})</h3>
            <div class="filter-list bio-chapter-list">
              ${filteredCatalog
                .map((ch) => {
                  const lines = getChapterLines(ch.id);
                  const hasSetup = ch.setupIds && ch.setupIds.length > 0;
                  return `
                    <button type="button" class="filter-item ${ch.id === selectedChapter.id ? 'active' : ''}" data-bio-chap="${escapeHtml(ch.id)}">
                      <span style="display:flex; align-items:center; gap:6px; min-width:0;">
                        <span style="overflow:hidden; text-overflow:ellipsis;">${escapeHtml(ch.label)}</span>
                        ${hasSetup ? '<span title="Has Pre-Configured Interactive Setup">🧬</span>' : ''}
                      </span>
                      <span class="filter-count">${lines.length > 0 ? `${lines.length}L` : 'AI/PDF'}</span>
                    </button>`;
                })
                .join('')}
            </div>
          </div>
        </aside>

        <div class="bio-reader-main">
          <!-- Chapter Hero & Controls -->
          <div class="card bio-chapter-banner">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
              <div>
                <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:6px;">
                  <span class="pill-badge accent">Class ${selectedChapter.classLevel} · ${escapeHtml(selectedChapter.discipline.toUpperCase())}</span>
                  <span class="pill-badge">${escapeHtml(selectedChapter.unit)}</span>
                  ${selectedChapter.highYield ? '<span class="pill-badge lg">High-Yield NEET</span>' : ''}
                </div>
                <h2 style="margin:0; font-size:1.25rem;">${escapeHtml(selectedChapter.label)}</h2>
              </div>

              <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${
                  selectedChapter.setupIds?.length
                    ? `<button type="button" class="btn-primary btn-sm" id="bio-open-chap-setup-btn" data-setup-id="${escapeHtml(selectedChapter.setupIds[0])}">
                         🧬 Open Interactive Concept Setup →
                       </button>`
                    : ''
                }
                <button type="button" class="btn-outline btn-sm" id="bio-toggle-importer-btn">
                  ${showImporter ? '✕ Close PDF / AI Decoder' : '+ Decode NCERT PDF / Text'}
                </button>
              </div>
            </div>

            <div class="explorer-toolbar" style="margin:12px 0 0;">
              <div class="mode-tabs" role="tablist">
                <button type="button" class="mode-tab-btn ${readingStyle === 'deep' ? 'active' : ''}" data-rstyle="deep">Full Deep View</button>
                <button type="button" class="mode-tab-btn ${readingStyle === 'focused' ? 'active' : ''}" data-rstyle="focused">Focused NCERT (Click to Reveal Insights)</button>
                <button type="button" class="mode-tab-btn ${readingStyle === 'cloze' ? 'active' : ''}" data-rstyle="cloze">Cloze Key-Term Recall</button>
              </div>

              ${
                sections.length > 1
                  ? `<div style="display:flex; gap:6px; flex-wrap:wrap;">
                       <button type="button" class="btn-sm ${sectionFilter === 'all' ? 'btn-primary' : 'btn-outline'}" data-sec="all">All Sections (${allChapterLines.length})</button>
                       ${sections
                         .map(
                           (sec) =>
                             `<button type="button" class="btn-sm ${sectionFilter === sec ? 'btn-primary' : 'btn-outline'}" data-sec="${escapeHtml(sec)}">${escapeHtml(sec)}</button>`
                         )
                         .join('')}
                     </div>`
                  : ''
              }
            </div>
          </div>

          <!-- Extendable PDF / AI Passage Decoder Drawer -->
          ${
            showImporter
              ? `<div class="card bio-importer-card">
                   <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
                     <div>
                       <span class="pill-badge accent">Extendable NCERT Decoder</span>
                       <h3 style="margin:4px 0 2px;">Import Any NCERT Page PDF or Paste Paragraph → Between-the-Lines Cards</h3>
                       <p class="muted-note">Extract text client-side from your NCERT PDF (or paste lines) and let Gemini decode hidden inferences, mechanisms, and NTA word-swap traps for <strong>${escapeHtml(selectedChapter.label)}</strong>.</p>
                     </div>
                     <button type="button" class="btn-outline btn-sm" id="bio-imp-key-btn">${getResolvedApiKey() ? 'Gemini Connected' : 'Set GEMINI_API_KEY'}</button>
                   </div>

                   <div class="form-grid">
                     <div class="form-field">
                       <label for="bio-imp-section">Section Heading</label>
                       <input type="text" id="bio-imp-section" value="${escapeHtml(importerSectionTitle)}" placeholder="e.g. 12.4 Aerobic Respiration" />
                     </div>
                     <div class="form-field">
                       <label for="bio-imp-pdf">Upload NCERT Chapter PDF (Optional)</label>
                       <input type="file" id="bio-imp-pdf" accept="application/pdf,.pdf" />
                       ${importerPdfStatus ? `<span class="muted-note">${escapeHtml(importerPdfStatus)}</span>` : ''}
                     </div>
                   </div>

                   <div class="form-field">
                     <label for="bio-imp-text">NCERT Text / Topic to Decode</label>
                     <textarea id="bio-imp-text" rows="4" placeholder="Paste an NCERT Biology paragraph here (or upload PDF above to auto-fill), or simply type a topic like 'Lac Operon regulation in NCERT Class 12'...">${escapeHtml(importerRawText)}</textarea>
                   </div>

                   ${importerError ? `<div class="settings-feedback err">${escapeHtml(importerError)}</div>` : ''}

                   <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                     <button type="button" class="btn-primary" id="bio-run-ai-decode-btn" ${importerLoading ? 'disabled' : ''}>
                       ${importerLoading ? 'Decoding Between the Lines...' : 'Decode with Gemini AI & Save to Chapter'}
                     </button>
                   </div>

                   <hr class="divider" style="margin:6px 0;" />

                   <details>
                     <summary style="cursor:pointer; font-weight:600; font-size:0.86rem;">Or Add a Manual NCERT Line Card (Works Offline / Zero API Key)</summary>
                     <div style="display:grid; gap:10px; margin-top:10px;">
                       <input type="text" id="bio-man-line" value="${escapeHtml(manualNcertLine)}" placeholder="Exact NCERT sentence (use {{term}} around words you want masked in Cloze mode)..." />
                       <div class="form-grid">
                         <input type="text" id="bio-man-inf" value="${escapeHtml(manualInference)}" placeholder="Between-the-Lines inference / why..." />
                         <input type="text" id="bio-man-trap" value="${escapeHtml(manualTrap)}" placeholder="NEET Word-Swap trap..." />
                       </div>
                       <div>
                         <button type="button" class="btn-outline btn-sm" id="bio-save-manual-line-btn">Save Manual NCERT Line</button>
                       </div>
                     </div>
                   </details>
                 </div>`
              : ''
          }

          ${
            isGlobalSearchMode
              ? `<div class="callout-row alert-warn">
                   <span class="callout-key">Global Search:</span>
                   <span>Showing <strong>${displayLines.length}</strong> matches across all NCERT Biology chapters for "<strong>${escapeHtml(searchQuery)}</strong>".</span>
                 </div>`
              : ''
          }

          <!-- Lines List -->
          ${
            displayLines.length === 0
              ? `<div class="card" style="padding:28px; text-align:center;">
                   <h3 style="margin:0 0 8px;">No pre-loaded NCERT lines in ${escapeHtml(selectedChapter.label)} yet</h3>
                   <p class="muted-note" style="max-width:580px; margin:0 auto 14px;">
                     Upload this chapter's NCERT PDF or paste paragraphs using the <strong>Decode NCERT PDF / Text</strong> tool above to build permanent "Between-the-Lines" cards—or generate chapter Q&amp;A directly in the Doubt &amp; Q&amp;A Hub!
                   </p>
                   <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                     <button type="button" class="btn-primary" id="bio-empty-open-importer-btn">+ Decode NCERT PDF / Text for This Chapter</button>
                     <button type="button" class="btn-outline" id="bio-empty-ask-doubt-btn">Ask Chapter Doubt / Generate Q&amp;A →</button>
                   </div>
                 </div>`
              : `<div class="bio-lines-stack">
                   ${displayLines
                     .map((line, idx) => {
                       const status = bioLineMastery[line.id] || 'unseen';
                       const isBookmarked = bookmarks.includes(line.id);
                       const showInsights = readingStyle !== 'focused' || expandedLineIds.has(line.id);

                       return `
                         <article class="card bio-line-card ${status === 'tricky' ? 'is-tricky' : ''}" data-line-id="${escapeHtml(line.id)}">
                           <div class="bio-line-header">
                             <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                               <span class="pill-badge accent">Line ${idx + 1}</span>
                               <span class="pill-badge">${escapeHtml(line.sectionTitle || 'NCERT')}</span>
                               <span class="muted-note" style="font-size:0.75rem;">${escapeHtml(line.ncertRef)}</span>
                               ${line.isCustomImported ? '<span class="pill-badge warn">Custom / PDF Decoded</span>' : ''}
                             </div>
                             <div style="display:flex; gap:6px; align-items:center;">
                               <button type="button" class="btn-ghost btn-sm bio-line-bookmark-btn" data-line-id="${escapeHtml(line.id)}" title="Bookmark tricky line">
                                 ${isBookmarked ? '★' : '☆'}
                               </button>
                               ${
                                 line.isCustomImported
                                   ? `<button type="button" class="btn-danger-ghost btn-sm bio-del-custom-line-btn" data-chap-id="${escapeHtml(line.chapterId)}" data-line-id="${escapeHtml(line.id)}" title="Delete custom line">✕</button>`
                                   : ''
                               }
                             </div>
                           </div>

                           <blockquote class="bio-ncert-quote">
                             ${renderClozeHtml(line.clozeText, line.ncertText, maskKeyTerms)}
                           </blockquote>

                           ${
                             readingStyle === 'focused'
                               ? `<div style="display:flex; justify-content:flex-start;">
                                    <button type="button" class="btn-outline btn-sm bio-toggle-insight-btn" data-line-id="${escapeHtml(line.id)}">
                                      ${showInsights ? 'Hide Between-the-Lines Insights ▲' : 'Reveal Between-the-Lines Insights ▼'}
                                    </button>
                                  </div>`
                               : ''
                           }

                           ${
                             showInsights
                               ? `<div class="bio-btl-grid">
                                    <div class="bio-btl-box btl-inference">
                                      <div class="bio-btl-label">🔍 Between the Lines (Hidden Inference)</div>
                                      <div class="bio-btl-body ${maskSubtext ? 'masked-token' : ''}" data-reveal-toggle>
                                        ${renderInlineMarkdown(line.betweenTheLines?.inference || '—')}
                                      </div>
                                    </div>

                                    <div class="bio-btl-box btl-mechanism">
                                      <div class="bio-btl-label">⚙️ Why &amp; Mechanism</div>
                                      <div class="bio-btl-body ${maskSubtext ? 'masked-token' : ''}" data-reveal-toggle>
                                        ${renderInlineMarkdown(line.betweenTheLines?.mechanism || '—')}
                                      </div>
                                    </div>

                                    <div class="bio-btl-box btl-trap">
                                      <div class="bio-btl-label">⚠️ NEET Word-Swap &amp; A/R Trap</div>
                                      <div class="bio-btl-body ${maskSubtext ? 'masked-token' : ''}" data-reveal-toggle>
                                        ${renderInlineMarkdown(line.betweenTheLines?.neetTrap || '—')}
                                      </div>
                                    </div>

                                    <div class="bio-btl-box btl-quant">
                                      <div class="bio-btl-label">🧮 Numbers &amp; Stoichiometry</div>
                                      <div class="bio-btl-body ${maskSubtext ? 'masked-token' : ''}" data-reveal-toggle>
                                        ${renderInlineMarkdown(line.betweenTheLines?.quantitative || 'Qualitative NCERT principle')}
                                      </div>
                                    </div>
                                  </div>`
                               : ''
                           }

                           <div class="reaction-card-footer">
                             <select class="mastery-select bio-line-mastery-sel" data-line-id="${escapeHtml(line.id)}" data-status="${escapeHtml(status)}" aria-label="Mastery status">
                               <option value="unseen" ${status === 'unseen' ? 'selected' : ''}>Status: Unseen</option>
                               <option value="mastered" ${status === 'mastered' ? 'selected' : ''}>✓ Mastered</option>
                               <option value="review" ${status === 'review' ? 'selected' : ''}>↻ Needs Review</option>
                               <option value="tricky" ${status === 'tricky' ? 'selected' : ''}>★ Tricky Trap</option>
                             </select>

                             <div style="display:flex; gap:8px; flex-wrap:wrap;">
                               ${
                                 line.linkedSetupId
                                   ? `<button type="button" class="btn-outline btn-sm bio-jump-setup-btn" data-setup-id="${escapeHtml(line.linkedSetupId)}" data-stage-id="${escapeHtml(line.linkedSetupStage || '')}">
                                        🧪 Open Interactive Setup
                                      </button>`
                                   : ''
                               }
                               <button type="button" class="btn-primary btn-sm bio-ask-line-doubt-btn" data-line-id="${escapeHtml(line.id)}">
                                 💬 Ask Doubt on This Line
                               </button>
                             </div>
                           </div>
                         </article>`;
                     })
                     .join('')}
                 </div>`
          }
        </div>
      </div>
    `;

    // Wire Sidebar & Filters
    container.querySelectorAll('[data-bio-cls]').forEach((btn) => {
      btn.addEventListener('click', () => {
        classFilter = btn.dataset.bioCls;
        render();
      });
    });

    container.querySelectorAll('[data-bio-disc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        discFilter = btn.dataset.bioDisc;
        render();
      });
    });

    container.querySelectorAll('[data-bio-chap]').forEach((btn) => {
      btn.addEventListener('click', () => {
        sectionFilter = 'all';
        onSelectChapter(btn.dataset.bioChap);
      });
    });

    container.querySelectorAll('[data-rstyle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        readingStyle = btn.dataset.rstyle;
        render();
      });
    });

    container.querySelectorAll('[data-sec]').forEach((btn) => {
      btn.addEventListener('click', () => {
        sectionFilter = btn.dataset.sec;
        render();
      });
    });

    // Cloze & Subtext Masking reveals
    container.querySelectorAll('[data-cloze-reveal]').forEach((el) => {
      el.addEventListener('click', () => {
        el.classList.toggle('revealed');
      });
    });

    container.querySelectorAll('[data-reveal-toggle]').forEach((el) => {
      el.addEventListener('click', () => {
        if (el.classList.contains('masked-token')) {
          el.classList.toggle('revealed');
        }
      });
    });

    container.querySelectorAll('.bio-toggle-insight-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lid = btn.dataset.lineId;
        if (expandedLineIds.has(lid)) expandedLineIds.delete(lid);
        else expandedLineIds.add(lid);
        render();
      });
    });

    // Mastery & Bookmark
    container.querySelectorAll('.bio-line-mastery-sel').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        onUpdateLineMastery(sel.dataset.lineId, e.target.value);
      });
    });

    container.querySelectorAll('.bio-line-bookmark-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        onToggleBookmark(btn.dataset.lineId);
      });
    });

    container.querySelectorAll('.bio-del-custom-line-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        onDeleteCustomLine(btn.dataset.chapId, btn.dataset.lineId);
      });
    });

    // Setup deep-links
    const chapSetupBtn = container.querySelector('#bio-open-chap-setup-btn');
    if (chapSetupBtn) {
      chapSetupBtn.addEventListener('click', () => {
        onOpenSetup(chapSetupBtn.dataset.setupId, '');
      });
    }

    container.querySelectorAll('.bio-jump-setup-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        onOpenSetup(btn.dataset.setupId, btn.dataset.stageId);
      });
    });

    // Doubt deep-links
    container.querySelectorAll('.bio-ask-line-doubt-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const line = displayLines.find((l) => l.id === btn.dataset.lineId);
        if (line) onAskDoubtOnLine(selectedChapter.id, line);
      });
    });

    const emptyAskBtn = container.querySelector('#bio-empty-ask-doubt-btn');
    if (emptyAskBtn) {
      emptyAskBtn.addEventListener('click', () => onAskDoubtOnLine(selectedChapter.id, null));
    }

    // Importer drawer controls
    const toggleImpBtn = container.querySelector('#bio-toggle-importer-btn');
    if (toggleImpBtn) {
      toggleImpBtn.addEventListener('click', () => {
        showImporter = !showImporter;
        render();
      });
    }

    const emptyImpBtn = container.querySelector('#bio-empty-open-importer-btn');
    if (emptyImpBtn) {
      emptyImpBtn.addEventListener('click', () => {
        showImporter = true;
        render();
      });
    }

    if (showImporter) {
      container.querySelector('#bio-imp-key-btn')?.addEventListener('click', onOpenSettings);
      container.querySelector('#bio-imp-section')?.addEventListener('input', (e) => {
        importerSectionTitle = e.target.value;
      });
      container.querySelector('#bio-imp-text')?.addEventListener('input', (e) => {
        importerRawText = e.target.value;
      });
      container.querySelector('#bio-man-line')?.addEventListener('input', (e) => {
        manualNcertLine = e.target.value;
      });
      container.querySelector('#bio-man-inf')?.addEventListener('input', (e) => {
        manualInference = e.target.value;
      });
      container.querySelector('#bio-man-trap')?.addEventListener('input', (e) => {
        manualTrap = e.target.value;
      });

      container.querySelector('#bio-imp-pdf')?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        importerPdfStatus = 'Extracting text from PDF...';
        importerError = '';
        render();
        try {
          const doc = await loadPdfDocument(file);
          const maxPages = Math.min(doc.numPages, 6);
          const extracted = [];
          for (let p = 1; p <= maxPages; p++) {
            const rendered = await renderPdfPage(doc.pdf, p, 1.4);
            if (rendered.textLines?.length) {
              extracted.push(rendered.textLines.join(' '));
            }
          }
          importerRawText = extracted.join('\n\n');
          importerPdfStatus = `Extracted text from ${maxPages} of ${doc.numPages} page(s) in "${doc.fileName}".`;
          if (!importerRawText.trim()) {
            importerError = 'This PDF appears to be scanned images without embedded text. You can paste text or ask Gemini about specific NCERT topics directly.';
          }
        } catch (err) {
          importerError = `PDF load error: ${err.message}`;
          importerPdfStatus = '';
        }
        render();
      });

      container.querySelector('#bio-run-ai-decode-btn')?.addEventListener('click', async () => {
        if (!importerRawText.trim()) {
          importerError = 'Please paste an NCERT paragraph, enter a topic, or upload a text PDF first.';
          render();
          return;
        }
        if (!getResolvedApiKey()) {
          importerError = 'Configure your GEMINI_API_KEY first, or use the Manual NCERT Line form below.';
          render();
          return;
        }
        importerLoading = true;
        importerError = '';
        render();
        try {
          const decodedLines = await decodeNcertPassageBetweenTheLines({
            chapterId: selectedChapter.id,
            chapterLabel: selectedChapter.label,
            sectionTitle: importerSectionTitle.trim() || 'Decoded NCERT Passage',
            rawText: importerRawText.trim()
          });
          onSaveCustomLines(selectedChapter.id, decodedLines);
          importerRawText = '';
          showImporter = false;
          if (onToast) onToast(`Decoded ${decodedLines.length} NCERT lines into ${selectedChapter.label}!`);
        } catch (err) {
          importerError = err.message;
        } finally {
          importerLoading = false;
          render();
        }
      });

      container.querySelector('#bio-save-manual-line-btn')?.addEventListener('click', () => {
        if (!manualNcertLine.trim()) {
          importerError = 'Enter an NCERT sentence first.';
          render();
          return;
        }
        const entry = {
          id: `bio-man-${selectedChapter.id}-${Date.now().toString(36)}`,
          chapterId: selectedChapter.id,
          sectionTitle: importerSectionTitle.trim() || 'Custom NCERT Note',
          ncertRef: `${selectedChapter.label} · Custom Note`,
          ncertText: manualNcertLine.replace(/\{\{(.*?)\}\}/g, '$1').trim(),
          clozeText: manualNcertLine.trim(),
          betweenTheLines: {
            inference: manualInference.trim() || 'Custom study note',
            mechanism: 'Added manually by student',
            neetTrap: manualTrap.trim() || 'Check NCERT wording carefully',
            quantitative: 'See NCERT reference'
          },
          isCustomImported: true
        };
        onSaveCustomLines(selectedChapter.id, [entry]);
        manualNcertLine = '';
        manualInference = '';
        manualTrap = '';
        showImporter = false;
        if (onToast) onToast('Saved custom NCERT line!');
      });
    }
  }

  render();
}
