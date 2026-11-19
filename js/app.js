/**
 * Super Study — Main Application Controller
 * Coordinates Multi-Subject switching, Reaction & Mechanism Explorer,
 * Active-Recall masking, Gemini Settings Modal, and workspace tabs.
 */

import { DEFAULT_SUBJECTS, MECHANISM_CATEGORIES } from './data/subjects.js';
import { CLASS11_REACTIONS } from './data/reactions-class11.js';
import { CLASS12_REACTIONS } from './data/reactions-class12.js';
import {
  loadGeminiConfig,
  saveGeminiConfig,
  clearGeminiKey,
  getResolvedModelId,
  loadStudyState,
  saveStudyState,
  exportBackupJson,
  importBackupJson
} from './services/storage.js';
import { testGeminiConnection } from './services/gemini.js';
import { openMechanismPlayer, stopMechanismAutoPlay } from './components/mechanism-player.js';
import { renderTrendsView } from './components/trends-view.js';
import { renderConverterView } from './components/converter-view.js';
import { renderDrillView } from './components/drill-view.js';
import { renderGeminiQuizView } from './components/gemini-quiz.js';
import { renderCustomStudioView } from './components/custom-studio.js';

let studyState = loadStudyState();
let activeTab = 'explorer'; // 'explorer' | 'trends' | 'converter' | 'drills' | 'quiz' | 'studio'
let maskMode = 'none'; // 'none' | 'product' | 'reagent'
let searchQuery = '';

// Explorer filter state
let explorerGroupMode = 'chapters'; // 'chapters' | 'mechanisms' | 'named' | 'bookmarked'
let selectedChapterFilter = 'all';
let selectedMechFilter = 'All Categories';
let selectedClassFilter = 'all'; // 'all' | '11' | '12'

// PWA Install state
let deferredInstallPrompt = null;

function isStandaloneDisplayMode() {
  return (
    (window.matchMedia &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: window-controls-overlay)').matches)) ||
    window.navigator.standalone === true
  );
}

function detectClientPlatform() {
  const ua = navigator.userAgent || '';
  const isIOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isIOS) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'desktop';
}

function syncInstallAppUi() {
  const standalone = isStandaloneDisplayMode();
  document.documentElement.toggleAttribute('data-standalone', standalone);

  const installBtn = document.getElementById('install-app-btn');
  const nativeCta = document.getElementById('install-native-cta');
  if (installBtn) {
    installBtn.hidden = standalone;
    installBtn.classList.toggle('install-ready', Boolean(deferredInstallPrompt));
  }
  if (nativeCta) {
    nativeCta.hidden = !deferredInstallPrompt || standalone;
  }
}

function openInstallModal() {
  const backdrop = document.getElementById('install-modal-backdrop');
  if (!backdrop) return;

  const platform = detectClientPlatform();
  const map = {
    ios: { card: 'install-card-ios', badge: 'badge-ios-detected' },
    android: { card: 'install-card-android', badge: 'badge-android-detected' },
    desktop: { card: 'install-card-desktop', badge: 'badge-desktop-detected' }
  };

  Object.entries(map).forEach(([key, ids]) => {
    const cardEl = document.getElementById(ids.card);
    const badgeEl = document.getElementById(ids.badge);
    const isCurrent = key === platform;
    if (cardEl) cardEl.classList.toggle('active-platform', isCurrent);
    if (badgeEl) badgeEl.hidden = !isCurrent;
  });

  syncInstallAppUi();
  backdrop.hidden = false;
}

async function triggerNativeInstallPrompt() {
  if (!deferredInstallPrompt) {
    openInstallModal();
    return;
  }
  try {
    deferredInstallPrompt.prompt();
    const choiceResult = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    syncInstallAppUi();
    if (choiceResult && choiceResult.outcome === 'accepted') {
      const backdrop = document.getElementById('install-modal-backdrop');
      if (backdrop) backdrop.hidden = true;
    }
  } catch (err) {
    deferredInstallPrompt = null;
    syncInstallAppUi();
    openInstallModal();
  }
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker
    .register('./sw.js', { scope: './' })
    .then(() => {
      const dot = document.getElementById('sw-offline-dot');
      const txt = document.getElementById('sw-offline-status-text');
      if (dot) dot.classList.add('connected');
      if (txt) {
        txt.textContent =
          'Offline study cache active — all NCERT reactions, mechanisms & drills work offline.';
      }
    })
    .catch(() => {
      // Service worker unavailable (e.g. file:// protocol)
    });
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function showToast(message) {
  const region = document.getElementById('toast-region');
  if (!region) return;
  const el = document.createElement('div');
  el.className = 'toast-msg';
  el.textContent = message;
  region.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function getAllSubjects() {
  return [...DEFAULT_SUBJECTS, ...(studyState.customSubjects || [])];
}

function getActiveSubject() {
  const all = getAllSubjects();
  return all.find((s) => s.id === studyState.activeSubjectId) || all[0];
}

function getReactionsForSubject(subject) {
  const custom = (studyState.customReactions || []).filter((r) => r.subjectId === subject.id);
  if (subject.isCoreOrganic) {
    return [...CLASS11_REACTIONS, ...CLASS12_REACTIONS, ...custom];
  }
  return [...(subject.starterCards || []), ...custom];
}

function applyTheme() {
  const isDark = studyState.theme === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('theme-toggle-icon');
  const label = document.getElementById('theme-toggle-label');
  const metaTheme = document.getElementById('meta-theme-color');
  const metaAppleBar = document.getElementById('meta-apple-status-bar');
  if (icon) icon.textContent = isDark ? '☀' : '🌙';
  if (label) label.textContent = isDark ? 'Light' : 'Dark';
  if (metaTheme) metaTheme.setAttribute('content', isDark ? '#12161c' : '#f3f5f8');
  if (metaAppleBar) metaAppleBar.setAttribute('content', isDark ? 'black-translucent' : 'default');
}

function toggleTheme() {
  studyState.theme = studyState.theme === 'dark' ? 'light' : 'dark';
  saveStudyState(studyState);
  applyTheme();
  showToast(`Switched to ${studyState.theme === 'dark' ? 'Dark' : 'Light'} Mode`);
}

function syncGeminiStatusDot() {
  const cfg = loadGeminiConfig();
  const dot = document.getElementById('gemini-status-dot');
  if (dot) {
    dot.classList.toggle('connected', Boolean(cfg.apiKey));
  }
}

function populateSubjectSwitcher() {
  const select = document.getElementById('subject-switcher');
  if (!select) return;
  const all = getAllSubjects();
  select.innerHTML =
    all
      .map(
        (s) =>
          `<option value="${escapeHtml(s.id)}" ${s.id === studyState.activeSubjectId ? 'selected' : ''}>${escapeHtml(s.shortName)}</option>`
      )
      .join('') + `<option value="__add_new__">+ Add / Manage Subjects...</option>`;
}

function toggleBookmark(reactionId) {
  const idx = studyState.bookmarks.indexOf(reactionId);
  let bookmarked = false;
  if (idx >= 0) {
    studyState.bookmarks.splice(idx, 1);
  } else {
    studyState.bookmarks.push(reactionId);
    bookmarked = true;
  }
  saveStudyState(studyState);
  renderActiveTab();
  return bookmarked;
}

function updateMastery(reactionId, status) {
  studyState.mastery[reactionId] = status;
  saveStudyState(studyState);
}

function triggerJsonExport() {
  const json = exportBackupJson(studyState);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `super-study-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Exported Super Study progress & custom cards JSON!');
}

function openSettingsModal() {
  const backdrop = document.getElementById('settings-modal-backdrop');
  const keyInput = document.getElementById('gemini-api-key-input');
  const modelSelect = document.getElementById('gemini-model-select');
  const customGroup = document.getElementById('custom-model-id-group');
  const customInput = document.getElementById('gemini-custom-model-input');
  const feedback = document.getElementById('settings-feedback');

  const cfg = loadGeminiConfig();
  keyInput.value = cfg.apiKey || '';
  modelSelect.value = cfg.model || 'gemini-2.5-flash';
  customInput.value = cfg.customModelId || '';
  customGroup.hidden = modelSelect.value !== 'custom';
  feedback.hidden = true;
  backdrop.hidden = false;
}

function renderExplorerView(container, subject, reactions) {
  const chapters = subject.chapters || [];
  const q = searchQuery.trim().toLowerCase();

  const filtered = reactions.filter((r) => {
    if (selectedClassFilter !== 'all') {
      const chObj = chapters.find((c) => c.id === r.chapter);
      if (!chObj || String(chObj.classLevel) !== selectedClassFilter) return false;
    }
    if (explorerGroupMode === 'chapters' && selectedChapterFilter !== 'all' && r.chapter !== selectedChapterFilter) {
      return false;
    }
    if (explorerGroupMode === 'mechanisms' && selectedMechFilter !== 'All Categories' && r.category !== selectedMechFilter) {
      return false;
    }
    if (explorerGroupMode === 'named' && !r.namedReaction) {
      return false;
    }
    if (explorerGroupMode === 'bookmarked' && !studyState.bookmarks.includes(r.id)) {
      return false;
    }
    if (q) {
      const haystack = [
        r.title,
        r.namedReaction,
        r.category,
        r.mechanismType,
        r.reactants,
        r.reagents,
        r.products,
        r.ncertExceptions,
        r.rearrangementAlert
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    }
    return true;
  });

  const masteredCount = reactions.filter((r) => studyState.mastery[r.id] === 'mastered').length;
  const trickyCount = reactions.filter((r) => studyState.mastery[r.id] === 'tricky').length;

  container.innerHTML = `
    <div class="section-header">
      <div>
        <h1>${escapeHtml(subject.name)}</h1>
        <p class="section-subtitle">${escapeHtml(subject.description)}</p>
      </div>
      <div class="stats-strip">
        <span class="pill-badge lg">Mastered: ${masteredCount}/${reactions.length}</span>
        <span class="pill-badge danger">Tricky: ${trickyCount}</span>
        <span class="pill-badge accent">Bookmarked: ${studyState.bookmarks.length}</span>
      </div>
    </div>

    <div class="explorer-layout">
      <aside class="explorer-sidebar">
        <div>
          <h3 class="sidebar-group-title">Syllabus Class</h3>
          <div class="mode-tabs" style="width:100%; display:grid; grid-template-columns:repeat(3, minmax(0, 1fr));">
            <button type="button" class="mode-tab-btn ${selectedClassFilter === 'all' ? 'active' : ''}" data-cls="all">All</button>
            <button type="button" class="mode-tab-btn ${selectedClassFilter === '11' ? 'active' : ''}" data-cls="11">Class 11</button>
            <button type="button" class="mode-tab-btn ${selectedClassFilter === '12' ? 'active' : ''}" data-cls="12">Class 12</button>
          </div>
        </div>

        ${
          explorerGroupMode === 'mechanisms'
            ? `<div>
                 <h3 class="sidebar-group-title">Mechanism Families</h3>
                 <div class="filter-list">
                   ${MECHANISM_CATEGORIES.map((cat) => {
                     const cnt =
                       cat === 'All Categories'
                         ? reactions.length
                         : reactions.filter((r) => r.category === cat).length;
                     return `
                       <button type="button" class="filter-item ${selectedMechFilter === cat ? 'active' : ''}" data-mech-cat="${escapeHtml(cat)}">
                         <span>${escapeHtml(cat)}</span>
                         <span class="filter-count">${cnt}</span>
                       </button>`;
                   }).join('')}
                 </div>
               </div>`
            : `<div>
                 <h3 class="sidebar-group-title">NCERT Chapters</h3>
                 <div class="filter-list">
                   <button type="button" class="filter-item ${selectedChapterFilter === 'all' ? 'active' : ''}" data-chap="all">
                     <span>All Chapters</span>
                     <span class="filter-count">${reactions.length}</span>
                   </button>
                   ${chapters
                     .map((ch) => {
                       const cnt = reactions.filter((r) => r.chapter === ch.id).length;
                       return `
                         <button type="button" class="filter-item ${selectedChapterFilter === ch.id ? 'active' : ''}" data-chap="${escapeHtml(ch.id)}">
                           <span>${escapeHtml(ch.label)}</span>
                           <span class="filter-count">${cnt}</span>
                         </button>`;
                     })
                     .join('')}
                 </div>
               </div>`
        }
      </aside>

      <div>
        <div class="explorer-toolbar">
          <div class="mode-tabs" role="tablist">
            <button type="button" class="mode-tab-btn ${explorerGroupMode === 'chapters' ? 'active' : ''}" data-gmode="chapters">NCERT Chapters</button>
            <button type="button" class="mode-tab-btn ${explorerGroupMode === 'mechanisms' ? 'active' : ''}" data-gmode="mechanisms">Mechanism Families</button>
            <button type="button" class="mode-tab-btn ${explorerGroupMode === 'named' ? 'active' : ''}" data-gmode="named">Named Reactions</button>
            <button type="button" class="mode-tab-btn ${explorerGroupMode === 'bookmarked' ? 'active' : ''}" data-gmode="bookmarked">Bookmarked (${studyState.bookmarks.length})</button>
          </div>

          <div style="font-size:0.84rem; color:var(--text-secondary);">
            Showing <strong>${filtered.length}</strong> reaction${filtered.length === 1 ? '' : 's'}
            ${q ? ` matching "<strong>${escapeHtml(searchQuery)}</strong>"` : ''}
          </div>
        </div>

        ${
          filtered.length === 0
            ? `<div class="card" style="padding:30px; text-align:center;">
                 <h3 style="margin:0 0 8px;">No matching reactions or cards found</h3>
                 <p class="muted-note" style="margin-bottom:14px;">
                   ${subject.isCoreOrganic ? 'Try clearing your search or switching chapter/mechanism filters.' : `This subject currently has ${reactions.length} card(s). Use the Custom Subjects tab to generate or add study cards!`}
                 </p>
                 <button type="button" class="btn-primary" id="empty-action-btn">
                   ${subject.isCoreOrganic ? 'Reset Filters' : 'Open Custom Subjects & AI Generator'}
                 </button>
               </div>`
            : `<div class="reaction-grid">
                 ${filtered
                   .map((r) => {
                     const status = studyState.mastery[r.id] || 'unseen';
                     const isBookmarked = studyState.bookmarks.includes(r.id);
                     const chObj = chapters.find((c) => c.id === r.chapter);

                     return `
                       <article class="reaction-card">
                         <div class="reaction-card-top">
                           <div>
                             <h2 class="reaction-title">${escapeHtml(r.title)}</h2>
                             <div class="reaction-meta">
                               <span class="pill-badge accent">${escapeHtml(r.namedReaction || r.category)}</span>
                               <span class="pill-badge">${escapeHtml(r.mechanismType)}</span>
                               ${chObj ? `<span class="pill-badge">Class ${chObj.classLevel}</span>` : ''}
                             </div>
                           </div>
                           <button type="button" class="btn-ghost btn-sm card-bookmark-btn" data-rxn-id="${escapeHtml(r.id)}" title="Bookmark tricky reaction">
                             ${isBookmarked ? '★' : '☆'}
                           </button>
                         </div>

                         <div class="equation-box">
                           <div class="eq-part">
                             <span class="eq-label">Reactant</span>
                             <span style="font-weight:700;">${escapeHtml(r.reactants)}</span>
                           </div>

                           <div class="eq-reagent-arrow">
                             <span class="eq-reagent-text ${maskMode === 'reagent' ? 'masked-token' : ''}" data-reveal-toggle>
                               ${escapeHtml(r.reagents)}
                             </span>
                             <span class="eq-cond-text">${escapeHtml(r.conditions || '')}</span>
                           </div>

                           <div class="eq-part">
                             <span class="eq-label">Major Product</span>
                             <span class="${maskMode === 'product' ? 'masked-token' : ''}" data-reveal-toggle style="font-weight:700; color:var(--chem-lg);">
                               ${escapeHtml(r.products)}
                             </span>
                           </div>
                         </div>

                         <div class="callout-list">
                           <div class="callout-row">
                             <span class="callout-key">RDS / Key Rule:</span>
                             <span>${escapeHtml(r.rds)}</span>
                           </div>
                           ${
                             r.rearrangementAlert
                               ? `<div class="callout-row alert-warn">
                                    <span class="callout-key">Alert:</span>
                                    <span>${escapeHtml(r.rearrangementAlert)}</span>
                                  </div>`
                               : ''
                           }
                           ${
                             r.ncertExceptions
                               ? `<div class="callout-row alert-exception">
                                    <span class="callout-key">NCERT Trap:</span>
                                    <span>${escapeHtml(r.ncertExceptions)}</span>
                                  </div>`
                               : ''
                           }
                         </div>

                         <div class="reaction-card-footer">
                           <select class="mastery-select" data-rxn-id="${escapeHtml(r.id)}" data-status="${escapeHtml(status)}" aria-label="Mastery status for ${escapeHtml(r.title)}">
                             <option value="unseen" ${status === 'unseen' ? 'selected' : ''}>Status: Unseen</option>
                             <option value="mastered" ${status === 'mastered' ? 'selected' : ''}>✓ Mastered</option>
                             <option value="review" ${status === 'review' ? 'selected' : ''}>↻ Needs Review</option>
                             <option value="tricky" ${status === 'tricky' ? 'selected' : ''}>★ Tricky</option>
                           </select>

                           <button type="button" class="btn-primary btn-sm inspect-mech-btn" data-rxn-id="${escapeHtml(r.id)}">
                             Inspect SVG Mechanism →
                           </button>
                         </div>
                       </article>`;
                   })
                   .join('')}
               </div>`
        }
      </div>
    </div>
  `;

  // Wire filters & card actions
  container.querySelectorAll('[data-cls]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedClassFilter = btn.dataset.cls;
      renderActiveTab();
    });
  });

  container.querySelectorAll('[data-chap]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedChapterFilter = btn.dataset.chap;
      renderActiveTab();
    });
  });

  container.querySelectorAll('[data-mech-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedMechFilter = btn.dataset.mechCat;
      renderActiveTab();
    });
  });

  container.querySelectorAll('[data-gmode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      explorerGroupMode = btn.dataset.gmode;
      renderActiveTab();
    });
  });

  container.querySelectorAll('[data-reveal-toggle]').forEach((el) => {
    el.addEventListener('click', () => {
      if (el.classList.contains('masked-token')) {
        el.classList.toggle('revealed');
      }
    });
  });

  container.querySelectorAll('.card-bookmark-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      toggleBookmark(btn.dataset.rxnId);
    });
  });

  container.querySelectorAll('.mastery-select').forEach((sel) => {
    sel.addEventListener('change', (e) => {
      updateMastery(sel.dataset.rxnId, e.target.value);
      sel.dataset.status = e.target.value;
      renderActiveTab();
    });
  });

  container.querySelectorAll('.inspect-mech-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rxn = reactions.find((r) => r.id === btn.dataset.rxnId);
      if (rxn) {
        openMechanismPlayer({
          reaction: rxn,
          isBookmarked: studyState.bookmarks.includes(rxn.id),
          onToggleBookmark: toggleBookmark
        });
      }
    });
  });

  const emptyBtn = container.querySelector('#empty-action-btn');
  if (emptyBtn) {
    emptyBtn.addEventListener('click', () => {
      if (subject.isCoreOrganic) {
        searchQuery = '';
        document.getElementById('global-search-input').value = '';
        selectedChapterFilter = 'all';
        selectedMechFilter = 'All Categories';
        selectedClassFilter = 'all';
        explorerGroupMode = 'chapters';
        renderActiveTab();
      } else {
        switchTab('studio');
      }
    });
  }
}

function renderActiveTab() {
  const root = document.getElementById('workspace-root');
  if (!root) return;

  const subject = getActiveSubject();
  const reactions = getReactionsForSubject(subject);

  const inspectRxn = (rxn) =>
    openMechanismPlayer({
      reaction: rxn,
      isBookmarked: studyState.bookmarks.includes(rxn.id),
      onToggleBookmark: toggleBookmark
    });

  if (activeTab === 'explorer') {
    renderExplorerView(root, subject, reactions);
  } else if (activeTab === 'trends') {
    renderTrendsView(root);
  } else if (activeTab === 'converter') {
    renderConverterView(root, { reactions, onInspectReaction: inspectRxn });
  } else if (activeTab === 'drills') {
    renderDrillView(root, {
      reactions,
      mastery: studyState.mastery,
      onUpdateMastery: (id, status) => {
        updateMastery(id, status);
        showToast(`Marked as ${status}`);
      },
      onInspectReaction: inspectRxn
    });
  } else if (activeTab === 'quiz') {
    renderGeminiQuizView(root, {
      subject,
      reactions,
      mastery: studyState.mastery,
      quizStats: studyState.quizStats,
      onRecordAnswer: (isCorrect) => {
        studyState.quizStats.attempted += 1;
        if (isCorrect) {
          studyState.quizStats.correct += 1;
          studyState.quizStats.streak += 1;
        } else {
          studyState.quizStats.streak = 0;
        }
        saveStudyState(studyState);
      },
      onOpenSettings: openSettingsModal
    });
  } else if (activeTab === 'studio') {
    renderCustomStudioView(root, {
      subjects: getAllSubjects(),
      activeSubject: subject,
      reactions,
      mastery: studyState.mastery,
      bookmarks: studyState.bookmarks,
      customReactions: studyState.customReactions,
      onAddCustomSubject: (newSubj) => {
        studyState.customSubjects.push(newSubj);
        studyState.activeSubjectId = newSubj.id;
        saveStudyState(studyState);
        populateSubjectSwitcher();
        showToast(`Created subject "${newSubj.shortName}"`);
        renderActiveTab();
      },
      onAddCustomReaction: (card) => {
        studyState.customReactions.push(card);
        saveStudyState(studyState);
        showToast(`Saved "${card.title}"`);
        renderActiveTab();
      },
      onDeleteCustomReaction: (id) => {
        studyState.customReactions = studyState.customReactions.filter((c) => c.id !== id);
        saveStudyState(studyState);
        showToast('Deleted custom card');
        renderActiveTab();
      },
      onExportJson: triggerJsonExport,
      onSwitchSubject: (subjId) => {
        studyState.activeSubjectId = subjId;
        selectedChapterFilter = 'all';
        saveStudyState(studyState);
        populateSubjectSwitcher();
        renderActiveTab();
      },
      onInspectReaction: inspectRxn
    });
  }
}

function switchTab(tabId, updateHash = true) {
  const validTabs = ['explorer', 'trends', 'converter', 'drills', 'quiz', 'studio'];
  const nextTab = validTabs.includes(tabId) ? tabId : 'explorer';
  activeTab = nextTab;
  if (updateHash && window.location.hash !== `#${nextTab}`) {
    history.replaceState(null, '', `#${nextTab}${window.location.search}`);
  }
  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === nextTab);
  });
  renderActiveTab();
}

function initEventListeners() {
  // Primary tabs
  document.querySelectorAll('.nav-tab').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  window.addEventListener('hashchange', () => {
    const hashTab = window.location.hash.replace('#', '');
    if (hashTab) switchTab(hashTab, false);
  });

  document.getElementById('brand-home-link').addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('explorer');
  });

  // Subject switcher
  document.getElementById('subject-switcher').addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === '__add_new__') {
      populateSubjectSwitcher();
      switchTab('studio');
      return;
    }
    studyState.activeSubjectId = val;
    selectedChapterFilter = 'all';
    saveStudyState(studyState);
    renderActiveTab();
  });

  // Global search
  const searchInput = document.getElementById('global-search-input');
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (activeTab !== 'explorer') switchTab('explorer');
    else renderActiveTab();
  });

  // Keyboard shortcuts: '/' for search, 'd' for Dark/Light Mode, 'Escape' for modals
  document.addEventListener('keydown', (e) => {
    const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);
    if (e.key === '/' && !inInput) {
      e.preventDefault();
      searchInput.focus();
    } else if ((e.key === 'd' || e.key === 'D') && !inInput && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      toggleTheme();
    } else if (e.key === 'Escape') {
      stopMechanismAutoPlay();
      document.getElementById('mechanism-modal-backdrop').hidden = true;
      document.getElementById('settings-modal-backdrop').hidden = true;
      const installBackdrop = document.getElementById('install-modal-backdrop');
      if (installBackdrop) installBackdrop.hidden = true;
    }
  });

  // PWA Install App button & modal listeners
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    syncInstallAppUi();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    syncInstallAppUi();
    const installBackdrop = document.getElementById('install-modal-backdrop');
    if (installBackdrop) installBackdrop.hidden = true;
    showToast('Super Study installed! Launch it anytime from your Home Screen.');
  });

  if (window.matchMedia) {
    const standaloneQuery = window.matchMedia('(display-mode: standalone)');
    if (standaloneQuery.addEventListener) {
      standaloneQuery.addEventListener('change', syncInstallAppUi);
    }
  }

  const installAppBtn = document.getElementById('install-app-btn');
  if (installAppBtn) {
    installAppBtn.addEventListener('click', () => {
      if (deferredInstallPrompt) {
        triggerNativeInstallPrompt();
      } else {
        openInstallModal();
      }
    });
  }

  const triggerNativeBtn = document.getElementById('trigger-native-install-btn');
  if (triggerNativeBtn) {
    triggerNativeBtn.addEventListener('click', triggerNativeInstallPrompt);
  }

  const closeInstallModalBtn = document.getElementById('close-install-modal-btn');
  if (closeInstallModalBtn) {
    closeInstallModalBtn.addEventListener('click', () => {
      document.getElementById('install-modal-backdrop').hidden = true;
    });
  }

  const installModalBackdrop = document.getElementById('install-modal-backdrop');
  if (installModalBackdrop) {
    installModalBackdrop.addEventListener('click', (e) => {
      if (e.target.id === 'install-modal-backdrop') e.target.hidden = true;
    });
  }

  // Masking toggles
  document.querySelectorAll('.mask-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      maskMode = btn.dataset.mask;
      document.querySelectorAll('.mask-btn').forEach((b) => b.classList.toggle('active', b === btn));
      if (activeTab !== 'explorer') switchTab('explorer');
      else renderActiveTab();
    });
  });

  // Theme toggle
  document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);

  // Mechanism modal close
  document.getElementById('close-mech-modal-btn').addEventListener('click', () => {
    stopMechanismAutoPlay();
    document.getElementById('mechanism-modal-backdrop').hidden = true;
  });
  document.getElementById('mechanism-modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'mechanism-modal-backdrop') {
      stopMechanismAutoPlay();
      e.target.hidden = true;
    }
  });

  // Gemini Settings modal
  document.getElementById('open-gemini-settings-btn').addEventListener('click', openSettingsModal);
  document.getElementById('close-settings-modal-btn').addEventListener('click', () => {
    document.getElementById('settings-modal-backdrop').hidden = true;
  });
  document.getElementById('settings-modal-backdrop').addEventListener('click', (e) => {
    if (e.target.id === 'settings-modal-backdrop') e.target.hidden = true;
  });

  document.getElementById('toggle-key-visibility-btn').addEventListener('click', () => {
    const input = document.getElementById('gemini-api-key-input');
    const btn = document.getElementById('toggle-key-visibility-btn');
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = 'Hide';
    } else {
      input.type = 'password';
      btn.textContent = 'Show';
    }
  });

  document.getElementById('gemini-model-select').addEventListener('change', (e) => {
    document.getElementById('custom-model-id-group').hidden = e.target.value !== 'custom';
  });

  document.getElementById('gemini-settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const apiKey = document.getElementById('gemini-api-key-input').value;
    const model = document.getElementById('gemini-model-select').value;
    const customModelId = document.getElementById('gemini-custom-model-input').value;
    const saved = saveGeminiConfig({ apiKey, model, customModelId });
    syncGeminiStatusDot();

    const fb = document.getElementById('settings-feedback');
    fb.hidden = false;
    fb.className = 'settings-feedback ok';
    fb.textContent = `Saved! Active model: ${getResolvedModelId(saved)}`;
    renderActiveTab();
  });

  document.getElementById('test-gemini-btn').addEventListener('click', async () => {
    const apiKey = document.getElementById('gemini-api-key-input').value.trim();
    const model = document.getElementById('gemini-model-select').value;
    const customModelId = document.getElementById('gemini-custom-model-input').value.trim();
    const resolvedModel = model === 'custom' && customModelId ? customModelId : model;

    const fb = document.getElementById('settings-feedback');
    fb.hidden = false;
    fb.className = 'settings-feedback';
    fb.textContent = `Testing ${resolvedModel}...`;

    try {
      const res = await testGeminiConnection(apiKey, resolvedModel);
      fb.className = 'settings-feedback ok';
      fb.textContent = `✓ Connected to ${res.modelId}! Response: "${res.sample}"`;
    } catch (err) {
      fb.className = 'settings-feedback err';
      fb.textContent = `✕ Connection failed: ${err.message}`;
    }
  });

  document.getElementById('clear-gemini-btn').addEventListener('click', () => {
    clearGeminiKey();
    document.getElementById('gemini-api-key-input').value = '';
    syncGeminiStatusDot();
    const fb = document.getElementById('settings-feedback');
    fb.hidden = false;
    fb.className = 'settings-feedback ok';
    fb.textContent = 'API key cleared from browser localStorage.';
    renderActiveTab();
  });

  document.getElementById('export-data-btn').addEventListener('click', triggerJsonExport);

  document.getElementById('import-data-input').addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      studyState = importBackupJson(text);
      applyTheme();
      populateSubjectSwitcher();
      renderActiveTab();
      showToast('Imported study backup successfully!');
      document.getElementById('settings-modal-backdrop').hidden = true;
    } catch (err) {
      const fb = document.getElementById('settings-feedback');
      fb.hidden = false;
      fb.className = 'settings-feedback err';
      fb.textContent = `Import failed: ${err.message}`;
    } finally {
      e.target.value = '';
    }
  });
}

function bootstrap() {
  const params = new URLSearchParams(window.location.search);
  const themeParam = params.get('theme');
  if (themeParam === 'dark' || themeParam === 'light') {
    studyState.theme = themeParam;
  }

  applyTheme();
  syncGeminiStatusDot();
  syncInstallAppUi();
  registerServiceWorker();
  populateSubjectSwitcher();
  initEventListeners();

  const initialTab = window.location.hash.replace('#', '');
  if (initialTab) {
    switchTab(initialTab, false);
  } else {
    renderActiveTab();
  }

  const mechParam = params.get('mech');
  if (mechParam) {
    const reactions = getReactionsForSubject(getActiveSubject());
    const target = reactions.find((r) => r.id === mechParam);
    if (target) {
      openMechanismPlayer({
        reaction: target,
        isBookmarked: studyState.bookmarks.includes(target.id),
        onToggleBookmark: toggleBookmark
      });
    }
  }
}

bootstrap();
