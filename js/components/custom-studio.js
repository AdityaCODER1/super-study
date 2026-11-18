/**
 * Multi-Subject & Custom Study Studio
 * - Chapter-by-chapter Mastery Progress bars
 * - Create new Custom Subjects
 * - Add Custom Reaction / Concept Cards manually or generate via Gemini API
 * - Export / Import JSON for committing custom subjects/cards to GitHub Pages
 */

import { generateCustomStudyCard } from '../services/gemini.js';
import { MECHANISM_CATEGORIES } from '../data/subjects.js';

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderCustomStudioView(
  container,
  {
    subjects,
    activeSubject,
    reactions,
    mastery,
    bookmarks,
    customReactions,
    onAddCustomSubject,
    onAddCustomReaction,
    onDeleteCustomReaction,
    onExportJson,
    onSwitchSubject,
    onInspectReaction
  }
) {
  let aiTopicPrompt = '';
  let aiTargetChapter = activeSubject.chapters?.[0]?.id || 'custom';
  let aiGenerating = false;
  let aiFeedback = '';

  function render() {
    const masteredCount = reactions.filter((r) => mastery[r.id] === 'mastered').length;
    const reviewCount = reactions.filter((r) => mastery[r.id] === 'review').length;
    const trickyCount = reactions.filter((r) => mastery[r.id] === 'tricky').length;
    const bookmarkedRxns = reactions.filter((r) => bookmarks.includes(r.id));

    const chapterStats = (activeSubject.chapters || []).map((ch) => {
      const chRxns = reactions.filter((r) => r.chapter === ch.id);
      const chMastered = chRxns.filter((r) => mastery[r.id] === 'mastered').length;
      const pct = chRxns.length ? Math.round((chMastered / chRxns.length) * 100) : 0;
      return { ...ch, total: chRxns.length, mastered: chMastered, pct };
    });

    const subjectCustomCards = customReactions.filter((r) => r.subjectId === activeSubject.id);

    container.innerHTML = `
      <div class="section-header">
        <div>
          <h1>Custom Subjects &amp; Mastery Studio</h1>
          <p class="section-subtitle">Track chapter-level mastery, build custom subjects and study cards (manually or via Gemini AI), and export JSON for your GitHub repo.</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn-outline" id="studio-export-btn">Export Full JSON Backup</button>
        </div>
      </div>

      <!-- Mastery Analytics Strip -->
      <div class="two-col-grid" style="margin-bottom:22px;">
        <div class="card predictor-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h2 style="margin:0; font-size:1.12rem;">${escapeHtml(activeSubject.shortName)} Chapter Mastery</h2>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <span class="pill-badge lg">✓ ${masteredCount} Mastered</span>
              <span class="pill-badge warn">↻ ${reviewCount} Review</span>
              <span class="pill-badge danger">★ ${trickyCount} Tricky</span>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:10px;">
            ${chapterStats
              .map(
                (ch) => `
                <div>
                  <div style="display:flex; justify-content:space-between; font-size:0.82rem; font-weight:600; margin-bottom:4px;">
                    <span>${escapeHtml(ch.label)}</span>
                    <span class="mono">${ch.mastered}/${ch.total} (${ch.pct}%)</span>
                  </div>
                  <div class="progress-bar-track">
                    <div class="progress-bar-fill" style="width:${ch.pct}%"></div>
                  </div>
                </div>`
              )
              .join('')}
          </div>
        </div>

        <div class="card predictor-card">
          <h2 style="margin:0; font-size:1.12rem;">Bookmarked Tricky Reactions (${bookmarkedRxns.length})</h2>
          ${
            bookmarkedRxns.length === 0
              ? `<p class="muted-note">No reactions bookmarked yet. Click ☆ on any reaction card or in the SVG Mechanism Player to pin high-trap mechanisms here.</p>`
              : `<div style="display:flex; flex-direction:column; gap:8px; max-height:260px; overflow-y:auto;">
                  ${bookmarkedRxns
                    .map(
                      (r) => `
                      <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:8px 10px; background:var(--bg-subtle); border-radius:8px;">
                        <div>
                          <div style="font-weight:700; font-size:0.86rem;">${escapeHtml(r.title)}</div>
                          <div class="mono" style="font-size:0.76rem; color:var(--text-muted);">${escapeHtml(r.reagents)}</div>
                        </div>
                        <button type="button" class="btn-outline btn-sm studio-inspect-btn" data-rxn-id="${escapeHtml(r.id)}">Inspect</button>
                      </div>`
                    )
                    .join('')}
                </div>`
          }

          <hr class="divider" style="margin:8px 0;" />

          <h3 style="margin:0; font-size:0.98rem;">Subject Hub (${subjects.length} Subjects)</h3>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            ${subjects
              .map(
                (s) => `
                <button type="button" class="btn-sm ${s.id === activeSubject.id ? 'btn-primary' : 'btn-outline'} studio-switch-subj" data-subj-id="${escapeHtml(s.id)}">
                  ${escapeHtml(s.shortName)}
                </button>`
              )
              .join('')}
          </div>
        </div>
      </div>

      <!-- Create Custom Card via Gemini or Manual -->
      <div class="two-col-grid" style="margin-bottom:22px;">
        <div class="card predictor-card">
          <div>
            <span class="pill-badge accent">AI Card Generator</span>
            <h2 style="margin:6px 0 4px; font-size:1.12rem;">Generate Custom Study Card via Gemini</h2>
            <p class="muted-note">Instantly generate a structured mechanism/concept card for <strong>${escapeHtml(activeSubject.shortName)}</strong> (or any other subject).</p>
          </div>

          <div class="form-field">
            <label for="ai-card-chapter">Target Chapter</label>
            <select id="ai-card-chapter">
              ${(activeSubject.chapters || [])
                .map((c) => `<option value="${escapeHtml(c.id)}" ${c.id === aiTargetChapter ? 'selected' : ''}>${escapeHtml(c.label)}</option>`)
                .join('')}
              <option value="custom">General / Custom</option>
            </select>
          </div>

          <div class="form-field">
            <label for="ai-card-topic">Topic / Reaction / Concept Prompt</label>
            <input type="text" id="ai-card-topic" value="${escapeHtml(aiTopicPrompt)}" placeholder="e.g. Perkin Reaction, K2Cr2O7 pH Equilibrium, Krebs Cycle ATP steps" />
          </div>

          ${aiFeedback ? `<div class="settings-feedback ${aiFeedback.startsWith('⚠') ? 'err' : 'ok'}">${escapeHtml(aiFeedback)}</div>` : ''}

          <button type="button" class="btn-primary" id="ai-gen-card-btn" ${aiGenerating ? 'disabled' : ''}>
            ${aiGenerating ? 'Generating Card...' : 'Generate & Add Card with Gemini'}
          </button>

          <hr class="divider" style="margin:8px 0;" />

          <h3 style="margin:0; font-size:1rem;">Add a New Study Subject</h3>
          <form id="new-subject-form" style="display:flex; flex-direction:column; gap:10px;">
            <div class="form-grid">
              <div class="form-field">
                <label for="new-subj-name">Subject Name</label>
                <input type="text" id="new-subj-name" required placeholder="e.g. Human Physiology / Optics" />
              </div>
              <div class="form-field">
                <label for="new-subj-chapters">Initial Chapters (comma-separated)</label>
                <input type="text" id="new-subj-chapters" placeholder="e.g. Digestion, Respiration, Circulation" />
              </div>
            </div>
            <button type="submit" class="btn-outline">Create &amp; Switch to Subject</button>
          </form>
        </div>

        <!-- Manual Custom Reaction / Note Form -->
        <div class="card predictor-card">
          <div>
            <span class="pill-badge lg">Manual Authoring</span>
            <h2 style="margin:6px 0 4px; font-size:1.12rem;">Create Custom Card in ${escapeHtml(activeSubject.shortName)}</h2>
            <p class="muted-note">Add your own reaction, trick formula, or coaching shortcut directly to your study deck.</p>
          </div>

          <form id="manual-card-form" style="display:flex; flex-direction:column; gap:10px;">
            <div class="form-grid">
              <div class="form-field">
                <label for="mc-title">Card Title *</label>
                <input type="text" id="mc-title" required placeholder="e.g. Swarts Fluorination Shortcut" />
              </div>
              <div class="form-field">
                <label for="mc-chapter">Chapter</label>
                <select id="mc-chapter">
                  ${(activeSubject.chapters || [])
                    .map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.label)}</option>`)
                    .join('')}
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-field">
                <label for="mc-category">Category</label>
                <select id="mc-category">
                  ${MECHANISM_CATEGORIES.filter((c) => c !== 'All Categories')
                    .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
                    .join('')}
                </select>
              </div>
              <div class="form-field">
                <label for="mc-mech">Mechanism / Principle Type</label>
                <input type="text" id="mc-mech" placeholder="e.g. SN2 / Radical / Rule" />
              </div>
            </div>

            <div class="form-grid">
              <div class="form-field">
                <label for="mc-reactants">Reactants / Input *</label>
                <input type="text" id="mc-reactants" required placeholder="e.g. R–Br" />
              </div>
              <div class="form-field">
                <label for="mc-reagents">Reagents / Conditions *</label>
                <input type="text" id="mc-reagents" required placeholder="e.g. AgF / Heat" />
              </div>
            </div>

            <div class="form-field">
              <label for="mc-products">Products / Output *</label>
              <input type="text" id="mc-products" required placeholder="e.g. R–F + AgBr↓" />
            </div>

            <div class="form-field">
              <label for="mc-exception">NEET Trap / Exception / RDS Note</label>
              <textarea id="mc-exception" rows="2" placeholder="Key exam callout or exception..."></textarea>
            </div>

            <button type="submit" class="btn-primary">Save Custom Card</button>
          </form>
        </div>
      </div>

      ${
        subjectCustomCards.length > 0
          ? `<div class="card predictor-card">
               <h2 style="margin:0; font-size:1.1rem;">Your Custom Cards in ${escapeHtml(activeSubject.shortName)} (${subjectCustomCards.length})</h2>
               <div style="display:grid; gap:10px;">
                 ${subjectCustomCards
                   .map(
                     (c) => `
                     <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; padding:10px 12px; background:var(--bg-subtle); border-radius:8px; flex-wrap:wrap;">
                       <div>
                         <strong>${escapeHtml(c.title)}</strong>
                         <div class="mono" style="font-size:0.8rem; color:var(--text-secondary);">${escapeHtml(c.reactants)} —(${escapeHtml(c.reagents)})→ ${escapeHtml(c.products)}</div>
                       </div>
                       <div style="display:flex; gap:6px;">
                         <button type="button" class="btn-outline btn-sm studio-inspect-btn" data-rxn-id="${escapeHtml(c.id)}">Inspect</button>
                         <button type="button" class="btn-danger-ghost btn-sm delete-custom-card-btn" data-rxn-id="${escapeHtml(c.id)}">Delete</button>
                       </div>
                     </div>`
                   )
                   .join('')}
               </div>
             </div>`
          : ''
      }
    `;

    container.querySelector('#studio-export-btn').addEventListener('click', onExportJson);

    container.querySelectorAll('.studio-switch-subj').forEach((btn) => {
      btn.addEventListener('click', () => onSwitchSubject(btn.dataset.subjId));
    });

    container.querySelectorAll('.studio-inspect-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const rxn = reactions.find((r) => r.id === btn.dataset.rxnId);
        if (rxn) onInspectReaction(rxn);
      });
    });

    container.querySelectorAll('.delete-custom-card-btn').forEach((btn) => {
      btn.addEventListener('click', () => onDeleteCustomReaction(btn.dataset.rxnId));
    });

    container.querySelector('#ai-card-chapter').addEventListener('change', (e) => {
      aiTargetChapter = e.target.value;
    });
    container.querySelector('#ai-card-topic').addEventListener('input', (e) => {
      aiTopicPrompt = e.target.value;
    });

    container.querySelector('#ai-gen-card-btn').addEventListener('click', async () => {
      if (!aiTopicPrompt.trim()) {
        aiFeedback = '⚠ Please enter a topic or reaction name first.';
        render();
        return;
      }
      aiGenerating = true;
      aiFeedback = '';
      render();
      try {
        const card = await generateCustomStudyCard({
          subjectName: activeSubject.shortName,
          chapterId: aiTargetChapter,
          topicPrompt: aiTopicPrompt.trim()
        });
        card.subjectId = activeSubject.id;
        onAddCustomReaction(card);
        aiTopicPrompt = '';
        aiFeedback = `✓ Added "${card.title}" to ${activeSubject.shortName}!`;
      } catch (err) {
        aiFeedback = `⚠ ${err.message}`;
      } finally {
        aiGenerating = false;
        render();
      }
    });

    container.querySelector('#new-subject-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = container.querySelector('#new-subj-name').value.trim();
      const chaptersRaw = container.querySelector('#new-subj-chapters').value.trim();
      if (!name) return;

      const id = `subj-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
      const chapters = chaptersRaw
        ? chaptersRaw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .map((label, idx) => ({ id: `${id}-ch${idx + 1}`, classLevel: 12, label }))
        : [{ id: `${id}-core`, classLevel: 12, label: `${name} — Core Notes` }];

      onAddCustomSubject({
        id,
        name,
        shortName: name,
        examTarget: 'Custom Study Deck',
        description: `Custom study cards and notes for ${name}.`,
        isCoreOrganic: false,
        chapters,
        starterCards: []
      });
    });

    container.querySelector('#manual-card-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const card = {
        id: `custom-manual-${Date.now()}`,
        subjectId: activeSubject.id,
        chapter: container.querySelector('#mc-chapter').value,
        title: container.querySelector('#mc-title').value.trim(),
        namedReaction: container.querySelector('#mc-title').value.trim(),
        category: container.querySelector('#mc-category').value,
        mechanismType: container.querySelector('#mc-mech').value.trim() || 'Custom Mechanism / Rule',
        reactants: container.querySelector('#mc-reactants').value.trim(),
        reagents: container.querySelector('#mc-reagents').value.trim(),
        conditions: 'Standard / Custom',
        products: container.querySelector('#mc-products').value.trim(),
        rds: container.querySelector('#mc-exception').value.trim() || 'See card summary',
        stereochemistry: 'N/A',
        rearrangementAlert: '',
        ncertExceptions: container.querySelector('#mc-exception').value.trim(),
        fromGroup: 'Custom',
        toGroup: 'Custom',
        neetFrequency: 'Custom',
        isCustom: true,
        svgSteps: []
      };
      onAddCustomReaction(card);
    });
  }

  render();
}
