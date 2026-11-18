/**
 * Client-side localStorage persistence for Super Study.
 * Stores GEMINI_API_KEY configuration, mastery states, bookmarks,
 * custom subjects, custom reaction cards, and JSON export/import snapshots.
 */

const GEMINI_KEY_STORAGE = 'super_study_gemini_config_v1';
const STUDY_STATE_STORAGE = 'super_study_state_v1';

const DEFAULT_GEMINI_CONFIG = {
  apiKey: '',
  model: 'gemini-2.5-flash',
  customModelId: ''
};

const DEFAULT_STUDY_STATE = {
  theme: 'light',
  activeSubjectId: 'organic-chemistry',
  mastery: {}, // { [reactionId]: 'mastered' | 'review' | 'tricky' | 'unseen' }
  bookmarks: [], // array of reactionId
  customSubjects: [], // user-created subjects
  customReactions: [], // user-created or AI-generated reaction/study cards
  quizStats: {
    attempted: 0,
    correct: 0,
    streak: 0
  }
};

export function loadGeminiConfig() {
  try {
    const raw = localStorage.getItem(GEMINI_KEY_STORAGE);
    if (!raw) return { ...DEFAULT_GEMINI_CONFIG };
    return { ...DEFAULT_GEMINI_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_GEMINI_CONFIG };
  }
}

export function saveGeminiConfig(config) {
  const clean = {
    apiKey: (config.apiKey || '').trim(),
    model: config.model || 'gemini-2.5-flash',
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

export function getResolvedModelId(config = loadGeminiConfig()) {
  if (config.model === 'custom' && config.customModelId) {
    return config.customModelId.trim();
  }
  return config.model || 'gemini-2.5-flash';
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
      quizStats: { ...DEFAULT_STUDY_STATE.quizStats, ...(parsed.quizStats || {}) }
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
    version: 1,
    studyState: {
      theme: state.theme,
      activeSubjectId: state.activeSubjectId,
      mastery: state.mastery,
      bookmarks: state.bookmarks,
      customSubjects: state.customSubjects,
      customReactions: state.customReactions,
      quizStats: state.quizStats
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
    quizStats: { ...DEFAULT_STUDY_STATE.quizStats, ...(incoming.quizStats || {}) }
  };
  saveStudyState(merged);
  return merged;
}
