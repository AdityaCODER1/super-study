/**
 * Client-side localStorage persistence for Super Study.
 * Stores GEMINI_API_KEY configuration, mastery states, bookmarks,
 * custom subjects, custom reaction cards, and JSON export/import snapshots.
 */

const GEMINI_KEY_STORAGE = 'super_study_gemini_config_v1';
const STUDY_STATE_STORAGE = 'super_study_state_v1';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite';
const LEGACY_DEPRECATED_MODELS = new Set(['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash']);

const DEFAULT_GEMINI_CONFIG = {
  apiKey: '',
  model: DEFAULT_GEMINI_MODEL,
  customModelId: ''
};

const DEFAULT_STUDY_STATE = {
  theme: 'light',
  cbtTheme: null, // null => follow app theme, or explicit 'light' | 'dark' for NTA portal
  activeSubjectId: 'organic-chemistry',
  mastery: {}, // { [reactionId]: 'mastered' | 'review' | 'tricky' | 'unseen' }
  bookmarks: [], // array of reactionId / bioLineId
  customSubjects: [], // user-created subjects
  customReactions: [], // user-created or AI-generated reaction/study cards
  quizStats: {
    attempted: 0,
    correct: 0,
    streak: 0
  },
  // Biology NCERT Mastery Suite persistence
  bioLineMastery: {}, // { [lineId]: 'mastered' | 'review' | 'tricky' | 'unseen' }
  bioCustomModules: {}, // { [chapterId]: Array<NcertLineEntry> }
  bioDoubtNotebook: [], // Array<{ id, chapterId, ncertLineRef, question, answer, createdAt, pinned }>
  bioSetupProgress: {} // { [setupId]: { completedCheckpoints: string[], notes: string } }
};

export function getRuntimeFallbackApiKey() {
  try {
    if (typeof window === 'undefined') return '';
    const raw = window.__SUPER_STUDY_RUNTIME_KEY__;
    if (!raw || typeof raw !== 'object' || !raw.d || !raw.k) return '';
    const bytes = Uint8Array.from(atob(raw.d), (c) => c.charCodeAt(0));
    const mask = String(raw.k);
    let out = '';
    for (let i = 0; i < bytes.length; i++) {
      out += String.fromCharCode(bytes[i] ^ mask.charCodeAt(i % mask.length));
    }
    return out.trim();
  } catch {
    return '';
  }
}

export function loadGeminiConfig() {
  try {
    const raw = localStorage.getItem(GEMINI_KEY_STORAGE);
    if (!raw) return { ...DEFAULT_GEMINI_CONFIG };
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_GEMINI_CONFIG, ...parsed };
    if (LEGACY_DEPRECATED_MODELS.has(merged.model)) {
      merged.model = DEFAULT_GEMINI_MODEL;
    }
    return merged;
  } catch {
    return { ...DEFAULT_GEMINI_CONFIG };
  }
}

export function saveGeminiConfig(config) {
  const clean = {
    apiKey: (config.apiKey || '').trim(),
    model: config.model || DEFAULT_GEMINI_MODEL,
    customModelId: (config.customModelId || '').trim()
  };
  localStorage.setItem(GEMINI_KEY_STORAGE, JSON.stringify(clean));
  return clean;
}

export function clearGeminiKey() {
  const current = loadGeminiConfig();
  current.apiKey = '';
  localStorage.setItem(GEMINI_KEY_STORAGE, JSON.stringify(current));
  return current;
}

export function getResolvedApiKey(config = loadGeminiConfig()) {
  return (config.apiKey || '').trim() || getRuntimeFallbackApiKey();
}

export function getResolvedModelId(config = loadGeminiConfig()) {
  if (config.model === 'custom' && config.customModelId) {
    return config.customModelId.trim();
  }
  if (!config.model || LEGACY_DEPRECATED_MODELS.has(config.model)) {
    return DEFAULT_GEMINI_MODEL;
  }
  return config.model;
}

function getInitialThemePreference() {
  try {
    if (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }
  } catch {
    // Ignore matchMedia errors
  }
  return 'light';
}

export function loadStudyState() {
  try {
    const raw = localStorage.getItem(STUDY_STATE_STORAGE);
    if (!raw) {
      return {
        ...structuredClone(DEFAULT_STUDY_STATE),
        theme: getInitialThemePreference()
      };
    }
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_STUDY_STATE),
      ...parsed,
      mastery: { ...(parsed.mastery || {}) },
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      customSubjects: Array.isArray(parsed.customSubjects) ? parsed.customSubjects : [],
      customReactions: Array.isArray(parsed.customReactions) ? parsed.customReactions : [],
      quizStats: { ...DEFAULT_STUDY_STATE.quizStats, ...(parsed.quizStats || {}) },
      bioLineMastery: { ...(parsed.bioLineMastery || {}) },
      bioCustomModules: parsed.bioCustomModules && typeof parsed.bioCustomModules === 'object' ? parsed.bioCustomModules : {},
      bioDoubtNotebook: Array.isArray(parsed.bioDoubtNotebook) ? parsed.bioDoubtNotebook : [],
      bioSetupProgress: parsed.bioSetupProgress && typeof parsed.bioSetupProgress === 'object' ? parsed.bioSetupProgress : {}
    };
  } catch {
    return {
      ...structuredClone(DEFAULT_STUDY_STATE),
      theme: getInitialThemePreference()
    };
  }
}

export function saveStudyState(state) {
  localStorage.setItem(STUDY_STATE_STORAGE, JSON.stringify(state));
}

export function exportBackupJson(state) {
  const payload = {
    exportedAt: new Date().toISOString(),
    app: 'Super Study',
    version: 2,
    studyState: {
      theme: state.theme,
      activeSubjectId: state.activeSubjectId,
      mastery: state.mastery,
      bookmarks: state.bookmarks,
      customSubjects: state.customSubjects,
      customReactions: state.customReactions,
      quizStats: state.quizStats,
      bioLineMastery: state.bioLineMastery || {},
      bioCustomModules: state.bioCustomModules || {},
      bioDoubtNotebook: state.bioDoubtNotebook || [],
      bioSetupProgress: state.bioSetupProgress || {}
    }
  };
  return JSON.stringify(payload, null, 2);
}

export function importBackupJson(jsonText) {
  const parsed = JSON.parse(jsonText);
  const incoming = parsed.studyState || parsed;
  if (!incoming || typeof incoming !== 'object') {
    throw new Error('Invalid Super Study JSON backup format.');
  }
  const merged = {
    ...structuredClone(DEFAULT_STUDY_STATE),
    ...incoming,
    mastery: { ...(incoming.mastery || {}) },
    bookmarks: Array.isArray(incoming.bookmarks) ? incoming.bookmarks : [],
    customSubjects: Array.isArray(incoming.customSubjects) ? incoming.customSubjects : [],
    customReactions: Array.isArray(incoming.customReactions) ? incoming.customReactions : [],
    quizStats: { ...DEFAULT_STUDY_STATE.quizStats, ...(incoming.quizStats || {}) },
    bioLineMastery: { ...(incoming.bioLineMastery || {}) },
    bioCustomModules: incoming.bioCustomModules && typeof incoming.bioCustomModules === 'object' ? incoming.bioCustomModules : {},
    bioDoubtNotebook: Array.isArray(incoming.bioDoubtNotebook) ? incoming.bioDoubtNotebook : [],
    bioSetupProgress: incoming.bioSetupProgress && typeof incoming.bioSetupProgress === 'object' ? incoming.bioSetupProgress : {}
  };
  saveStudyState(merged);
  return merged;
}
