/**
 * IndexedDB Persistence Layer for NEET 2027 NTA CBT Test Center.
 * Stores:
 *  - custom_questions: Uploaded PDF questions (with cropped diagrams), saved AI questions & JSON imports
 *  - active_session: Live auto-saved CBT exam state for crash/refresh recovery
 *  - test_attempts: Completed test submissions, subject analytics & mistake logs
 */

const DB_NAME = 'super_study_cbt_db_v1';
const DB_VERSION = 1;
const STORES = {
  QUESTIONS: 'custom_questions',
  SESSION: 'active_session',
  ATTEMPTS: 'test_attempts'
};

const memFallback = {
  [STORES.QUESTIONS]: new Map(),
  [STORES.SESSION]: new Map(),
  [STORES.ATTEMPTS]: new Map()
};

let dbPromise = null;

function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') {
      resolve(null);
      return;
    }
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORES.QUESTIONS)) {
          const qs = db.createObjectStore(STORES.QUESTIONS, { keyPath: 'id' });
          qs.createIndex('batchId', 'batchId', { unique: false });
          qs.createIndex('subject', 'subject', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORES.SESSION)) {
          db.createObjectStore(STORES.SESSION, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORES.ATTEMPTS)) {
          db.createObjectStore(STORES.ATTEMPTS, { keyPath: 'id' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return dbPromise;
}

async function idbGetAll(storeName) {
  const db = await openDb();
  if (!db) return Array.from(memFallback[storeName].values());
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => resolve([]);
  });
}

async function idbGet(storeName, key) {
  const db = await openDb();
  if (!db) return memFallback[storeName].get(key) || null;
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

async function idbPutMany(storeName, items) {
  const db = await openDb();
  if (!db) {
    items.forEach((item) => memFallback[storeName].set(item.id || item.key, structuredClone(item)));
    return;
  }
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    items.forEach((item) => store.put(item));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbDelete(storeName, key) {
  const db = await openDb();
  if (!db) {
    memFallback[storeName].delete(key);
    return;
  }
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

async function idbClear(storeName) {
  const db = await openDb();
  if (!db) {
    memFallback[storeName].clear();
    return;
  }
  return new Promise((resolve) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

/* ---------------- Custom Questions (PDF / AI Saved / Imports) ---------------- */

export async function getCustomQuestions() {
  const all = await idbGetAll(STORES.QUESTIONS);
  return all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function saveCustomQuestions(questions, batchMeta = {}) {
  const now = Date.now();
  const batchId = batchMeta.batchId || `batch-${now}`;
  const batchName = batchMeta.batchName || `Custom Import (${new Date(now).toLocaleDateString()})`;
  const normalized = questions.map((q, idx) => ({
    ...q,
    id: q.id || `cust-${now}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
    batchId: q.batchId || batchId,
    batchName: q.batchName || batchName,
    createdAt: q.createdAt || now
  }));
  await idbPutMany(STORES.QUESTIONS, normalized);
  return { batchId, batchName, count: normalized.length, questions: normalized };
}

export async function deleteCustomQuestion(id) {
  await idbDelete(STORES.QUESTIONS, id);
}

export async function deleteCustomBatch(batchId) {
  const all = await getCustomQuestions();
  const targets = all.filter((q) => q.batchId === batchId);
  await Promise.all(targets.map((q) => idbDelete(STORES.QUESTIONS, q.id)));
}

export async function clearAllCustomQuestions() {
  await idbClear(STORES.QUESTIONS);
}

/* ---------------- Active In-Progress Session Auto-Save ---------------- */

export async function getActiveSession() {
  return idbGet(STORES.SESSION, 'current');
}

export async function saveActiveSession(session) {
  if (!session) return;
  await idbPutMany(STORES.SESSION, [{ ...session, key: 'current', updatedAt: Date.now() }]);
}

export async function clearActiveSession() {
  await idbDelete(STORES.SESSION, 'current');
}

/* ---------------- Completed Test Attempts & Analytics History ---------------- */

export async function getTestAttempts() {
  const all = await idbGetAll(STORES.ATTEMPTS);
  return all.sort((a, b) => (b.finishedAt || 0) - (a.finishedAt || 0));
}

export async function saveTestAttempt(attempt) {
  const record = {
    ...attempt,
    id: attempt.id || `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    finishedAt: attempt.finishedAt || Date.now()
  };
  await idbPutMany(STORES.ATTEMPTS, [record]);
  return record;
}

export async function deleteTestAttempt(id) {
  await idbDelete(STORES.ATTEMPTS, id);
}

/* ---------------- JSON Bank Export / Import ---------------- */

export async function exportCbtDataJson() {
  const [customQuestions, testAttempts] = await Promise.all([getCustomQuestions(), getTestAttempts()]);
  return JSON.stringify(
    {
      app: 'Super Study NTA CBT',
      version: 1,
      exportedAt: new Date().toISOString(),
      customQuestions,
      testAttempts
    },
    null,
    2
  );
}

export async function importCbtQuestionsJson(jsonText) {
  const parsed = JSON.parse(jsonText);
  const rawList = Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed.customQuestions)
    ? parsed.customQuestions
    : Array.isArray(parsed.questions)
    ? parsed.questions
    : null;
  if (!rawList || rawList.length === 0) {
    throw new Error('JSON must be an array of questions or contain a "customQuestions" / "questions" array.');
  }
  const validSubjects = new Set(['physics', 'chemistry', 'botany', 'zoology']);
  const batchId = `import-${Date.now()}`;
  const cleaned = rawList.map((q, idx) => {
    const subj = String(q.subject || 'physics').toLowerCase();
    const opts = Array.isArray(q.options) ? q.options.slice(0, 4).map(String) : ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    while (opts.length < 4) opts.push('');
    const ci = Number(q.correctIndex);
    return {
      id: q.id || `${batchId}-${idx}`,
      subject: validSubjects.has(subj) ? subj : subj === 'biology' ? 'botany' : 'physics',
      chapterId: q.chapterId || null,
      classLevel: q.classLevel === 11 || q.classLevel === 12 ? q.classLevel : null,
      source: q.source || 'Import',
      examTag: q.examTag || 'JSON Import',
      year: q.year || null,
      qNo: q.qNo || idx + 1,
      section: q.section || null,
      question: String(q.question || ''),
      questionImage: q.questionImage || null,
      imageOnly: Boolean(q.imageOnly),
      options: opts,
      optionImages: Array.isArray(q.optionImages) ? q.optionImages : undefined,
      correctIndex: Number.isInteger(ci) && ci >= 0 && ci < 4 ? ci : null,
      explanation: String(q.explanation || ''),
      batchId,
      batchName: q.batchName || `Imported JSON (${rawList.length} Qs)`
    };
  });
  await idbPutMany(STORES.QUESTIONS, cleaned);
  return cleaned.length;
}
