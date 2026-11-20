/**
 * Direct browser-to-Gemini REST API client using user-configured GEMINI_API_KEY.
 * Supports:
 *  - Custom NEET Question Generation (MCQ, Assertion-Reason, Statement I/II, Multi-Step Roadmaps)
 *  - Interactive "Ask What-If" Mechanism Tutor
 *  - Custom Study Card / Reaction Generator for any subject
 */

import { loadGeminiConfig, getResolvedModelId, getResolvedApiKey, DEFAULT_GEMINI_MODEL } from './storage.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Fallback chain used when the selected model id is unavailable (404 / "not found" /
 * "no longer available"). gemini-2.5-flash & gemini-2.5-pro were deprecated in Nov 2026.
 */
export const GEMINI_MODEL_FALLBACKS = [
  DEFAULT_GEMINI_MODEL, // gemini-3.1-flash-lite
  'gemini-3.1-flash-lite-preview',
  'gemini-3.5-flash-lite',
  'gemini-2.5-flash-lite'
];

function isModelUnavailableError(status, message = '') {
  const m = message.toLowerCase();
  return (
    status === 404 ||
    m.includes('not found') ||
    m.includes('no longer available') ||
    m.includes('is not supported') ||
    m.includes('deprecated')
  );
}

async function postGenerateContent({ apiKey, modelId, body }) {
  const endpoint = `${GEMINI_API_BASE}/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data?.error?.message || `Gemini API returned HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }
  const text = data?.candidates?.[0]?.content?.parts
    ?.filter((part) => !part.thought)
    .map((part) => part.text || '')
    .join('')
    .trim();
  if (!text) {
    const reason = data?.candidates?.[0]?.finishReason;
    throw new Error(`Gemini returned an empty response${reason ? ` (${reason})` : ''}.`);
  }
  return text;
}

/**
 * Core request with automatic model fallback.
 * `parts` lets callers send multimodal content: [{ text }, { inlineData: { mimeType, data } }].
 */
export async function callGeminiApi({
  prompt,
  parts,
  systemInstruction,
  apiKeyOverride,
  modelOverride,
  jsonMode = false,
  maxOutputTokens = 8192,
  allowFallback = true
}) {
  const config = loadGeminiConfig();
  const apiKey = (apiKeyOverride && apiKeyOverride.trim()) ? apiKeyOverride.trim() : getResolvedApiKey(config);
  const primaryModel = (modelOverride ?? getResolvedModelId(config)).trim();

  if (!apiKey) {
    throw new Error('No GEMINI_API_KEY configured. Click "Gemini API" in the top bar to enter your key.');
  }

  const body = {
    contents: [{ role: 'user', parts: parts || [{ text: prompt }] }],
    generationConfig: { maxOutputTokens }
  };
  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }
  if (jsonMode) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  const chain = allowFallback
    ? [primaryModel, ...GEMINI_MODEL_FALLBACKS.filter((m) => m !== primaryModel)]
    : [primaryModel];

  let lastErr = null;
  for (const modelId of chain) {
    try {
      return await postGenerateContent({ apiKey, modelId, body });
    } catch (err) {
      lastErr = err;
      if (!isModelUnavailableError(err.status, err.message)) throw err;
      // Model unavailable on this key/endpoint: try the next model in the chain.
    }
  }
  throw lastErr || new Error('All Gemini models in the fallback chain failed.');
}

export function parseJsonResponse(rawText) {
  const cleaned = rawText
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
}

export async function testGeminiConnection(apiKey, modelId) {
  const text = await callGeminiApi({
    prompt: 'Reply with exactly: OK',
    apiKeyOverride: apiKey,
    modelOverride: modelId,
    jsonMode: false,
    allowFallback: false
  });
  return { ok: true, modelId, sample: text.slice(0, 60) };
}

export async function generateCustomQuestions({
  subjectName,
  chaptersText,
  questionType,
  difficulty,
  count,
  weakReactionTitles = [],
  customTopicPrompt = ''
}) {
  const systemInstruction = `You are an expert NEET-UG Organic Chemistry & NCERT Class 11/12 professor.
Generate strictly accurate, high-yield exam questions grounded in NCERT Class 11 & 12 textbooks and NEET UG standards.
NEVER invent non-existent reagents or violate carbocation rearrangement, stereochemistry, or IUPAC rules.
Return ONLY valid JSON matching the exact schema requested.`;

  const weakContext =
    weakReactionTitles.length > 0
      ? `The student marked these reactions as tricky/needs review — prioritize testing them: ${weakReactionTitles.join(', ')}.`
      : '';

  const customFocus = customTopicPrompt.trim()
    ? `Specific student focus request: "${customTopicPrompt.trim()}".`
    : '';

  const prompt = `Generate ${count} custom ${subjectName} practice questions.
Syllabus scope: ${chaptersText}
Question format: ${questionType}
Difficulty tier: ${difficulty}
${weakContext}
${customFocus}

Format guidelines:
- If "Assertion-Reason": include Assertion (A) and Reason (R) cleanly in the question string, and use the standard 4 NEET Assertion-Reason options.
- If "Statement I & II": include Statement I and Statement II cleanly in the question string, and use the standard 4 NEET Statement options.
- If "Multi-Step Roadmap": create an A -> B -> C (or D) reaction chain using explicit reagents over arrows and ask to identify the final/intermediate compound or missing reagent.
- Explain clearly WHY the correct option works (mentioning RDS, carbocation shifts, leaving group, solvent, or NCERT exception) and why common distractors are traps.

Return a JSON array of objects, each with EXACTLY these keys:
[
  {
    "chapter": "short chapter tag",
    "type": "${questionType}",
    "difficulty": "${difficulty}",
    "question": "full question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "detailed mechanism and NCERT reasoning"
  }
]`;

  const raw = await callGeminiApi({
    prompt,
    systemInstruction,
    jsonMode: true
  });

  const parsed = parseJsonResponse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('Unexpected response format from Gemini (expected a JSON array of questions).');
  }

  return parsed.map((q, idx) => ({
    id: `ai-q-${Date.now()}-${idx}`,
    chapter: q.chapter || chaptersText,
    type: q.type || questionType,
    difficulty: q.difficulty || difficulty,
    question: String(q.question || ''),
    options: Array.isArray(q.options) && q.options.length === 4 ? q.options.map(String) : ['A', 'B', 'C', 'D'],
    correctIndex: Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < 4 ? q.correctIndex : 0,
    explanation: String(q.explanation || ''),
    isAiGenerated: true
  }));
}

export async function askMechanismTutor({ reaction, userQuestion }) {
  const systemInstruction = `You are a concise, crystal-clear NEET Chemistry tutor specializing in NCERT Class 11 & 12 organic reaction mechanisms, leaving group trends, stereochemistry, and exam traps.
Use clear bullet points, exact chemical formulas, and highlight any NCERT exceptions.`;

  const contextBlock = reaction
    ? `Reaction Context:
- Title: ${reaction.title} (${reaction.namedReaction || 'NCERT'})
- Reactants: ${reaction.reactants}
- Reagents/Conditions: ${reaction.reagents} (${reaction.conditions})
- Products: ${reaction.products}
- Mechanism Type: ${reaction.mechanismType}
- RDS/Kinetics: ${reaction.rds}
- Stereochemistry: ${reaction.stereochemistry}
- Rearrangement/Alert: ${reaction.rearrangementAlert}
- NCERT Exceptions: ${reaction.ncertExceptions}`
    : 'General NEET Organic Chemistry Question.';

  const prompt = `${contextBlock}

Student's question: ${userQuestion}

Provide a focused, exam-oriented explanation (around 120–220 words).`;

  return callGeminiApi({
    prompt,
    systemInstruction,
    jsonMode: false
  });
}

export async function generateCustomStudyCard({ subjectName, chapterId, topicPrompt }) {
  const systemInstruction = `You are building structured flashcards/study cards for a NEET / STEM student using Super Study.
Return ONLY valid JSON for a single card matching the required schema.`;

  const prompt = `Create 1 high-yield study card for Subject: "${subjectName}", Topic: "${topicPrompt}".
Return a single JSON object with these EXACT keys:
{
  "title": "Concise card title",
  "namedReaction": "Sub-category or Named Law/Reaction",
  "category": "Named Reaction",
  "mechanismType": "Key mechanism, principle, or formula type",
  "reactants": "Starting state / inputs / reactants",
  "reagents": "Reagents / conditions / constants",
  "conditions": "Temp / medium / constraints",
  "products": "Final products / key output / formula",
  "rds": "Rate-determining step or core rule",
  "stereochemistry": "Stereochemistry or spatial rule (or N/A)",
  "rearrangementAlert": "Major exam trap or common mistake",
  "ncertExceptions": "Important NCERT exception or high-yield tip",
  "fromGroup": "Input group",
  "toGroup": "Output group",
  "neetFrequency": "High",
  "svgSteps": [
    {
      "stepTitle": "Step 1: Setup",
      "description": "What happens in step 1",
      "leftSpecies": "Initial species",
      "leftCharge": "Role",
      "centerAction": "Action / Reagent",
      "rightSpecies": "Intermediate / Result",
      "rightCharge": "Outcome",
      "arrows": [{ "type": "full", "from": "left", "to": "right", "label": "Mechanism arrow" }]
    }
  ]
}`;

  const raw = await callGeminiApi({
    prompt,
    systemInstruction,
    jsonMode: true
  });

  const card = parseJsonResponse(raw);
  return {
    id: `custom-ai-${Date.now()}`,
    subjectId: null, // assigned by caller
    chapter: chapterId || 'custom',
    isCustom: true,
    ...card
  };
}

/* ==========================================================================
   NEET 2027 CBT — Multimodal PDF extraction, CBT question generation & tutor
   Default model: gemini-3.1-flash-lite (natively accepts text, images and PDF).
   ========================================================================== */

const CBT_SUBJECTS = ['physics', 'chemistry', 'botany', 'zoology'];

function normalizeCbtQuestion(q, idx, defaults = {}) {
  const subject = CBT_SUBJECTS.includes(String(q.subject || '').toLowerCase())
    ? String(q.subject).toLowerCase()
    : defaults.subject || 'physics';
  const options = Array.isArray(q.options) ? q.options.slice(0, 4).map((o) => String(o ?? '')) : [];
  while (options.length < 4) options.push('');
  const ci = Number(q.correctIndex);
  const box = Array.isArray(q.diagramBox) && q.diagramBox.length === 4 && q.diagramBox.every((n) => Number.isFinite(Number(n)))
    ? q.diagramBox.map(Number)
    : null;
  return {
    id: `${defaults.idPrefix || 'ai'}-${Date.now().toString(36)}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
    subject,
    chapterId: q.chapterId || null,
    classLevel: q.classLevel === 11 || q.classLevel === 12 ? q.classLevel : null,
    source: defaults.source || 'AI',
    examTag: defaults.examTag || 'Gemini AI',
    year: null,
    qNo: Number.isInteger(q.qNo) ? q.qNo : null,
    section: null,
    question: String(q.question || ''),
    questionImage: null,
    imageOnly: false,
    options,
    optionImages: [null, null, null, null],
    correctIndex: Number.isInteger(ci) && ci >= 0 && ci < 4 ? ci : null,
    explanation: String(q.explanation || ''),
    // Transient (PDF only): normalized 0–1000 [ymin, xmin, ymax, xmax] + page index for auto-crop
    diagramBox: box,
    pageIndex: Number.isInteger(q.pageIndex) ? q.pageIndex : defaults.pageIndex ?? null
  };
}

/**
 * Extract NEET MCQs from rendered PDF page images using Gemini vision.
 * @param {{ pageImages: {index:number, base64:string, mimeType?:string}[], defaultSubject?: string,
 *           chapterHints?: string, customInstructions?: string, answerKeyText?: string }} args
 * Returns CbtQuestion[] with transient `diagramBox` + `pageIndex` for auto-cropping.
 */
export async function extractQuestionsFromPdfPages({
  pageImages,
  defaultSubject = '',
  chapterHints = '',
  customInstructions = '',
  answerKeyText = ''
}) {
  const systemInstruction = `You are a meticulous OCR + exam-digitisation engine for Indian NEET (UG) question papers.
Transcribe questions EXACTLY as printed (do not paraphrase). Use LaTeX inside \\( ... \\) for formulas, chemical
formulas with subscripts, units and symbols. Return ONLY valid JSON matching the schema.`;

  const parts = [
    {
      text: `Extract every multiple-choice question visible on the following ${pageImages.length} page image(s).
Each page image is preceded by a label "PAGE <index>".

Rules:
- One object per question. Keep the printed question number in "qNo".
- "options": exactly 4 option texts WITHOUT the (1)/(A) labels. If an option is only a figure, write "[figure]".
- "subject": one of physics | chemistry | botany | zoology${defaultSubject ? ` (default: ${defaultSubject})` : ''}.
- "correctIndex": 0-3 if an answer key / marked answer is visible on the page or provided below; otherwise SOLVE the
  question carefully and give your best answer; use null only if impossible.
- "explanation": short step-by-step justification (2-5 sentences).
- "diagramBox": if the question relies on a figure, graph, circuit, table image, or chemical structure, give its
  bounding box on that page as [ymin, xmin, ymax, xmax] normalised to 0-1000; else null.
- "pageIndex": the PAGE index where the question appears.
- Skip instructions, headers, footers and watermarks. If a question continues across pages, merge it.
${chapterHints ? `- Chapter hints: ${chapterHints}` : ''}
${customInstructions ? `- Extra instructions: ${customInstructions}` : ''}
${answerKeyText ? `Answer key text supplied by the user (question number -> option):\n${answerKeyText}` : ''}

Return: {"questions":[{"qNo":1,"subject":"physics","question":"...","options":["..","..","..",".."],"correctIndex":0,"explanation":"...","diagramBox":null,"pageIndex":0}]}`
    }
  ];

  pageImages.forEach((p) => {
    parts.push({ text: `PAGE ${p.index}` });
    parts.push({ inlineData: { mimeType: p.mimeType || 'image/jpeg', data: p.base64 } });
  });

  const raw = await callGeminiApi({ parts, systemInstruction, jsonMode: true, maxOutputTokens: 32768 });
  const parsed = parseJsonResponse(raw);
  const list = Array.isArray(parsed) ? parsed : parsed.questions;
  if (!Array.isArray(list)) throw new Error('Gemini did not return a questions array.');
  return list.map((q, i) =>
    normalizeCbtQuestion(q, i, { source: 'PDF', examTag: 'PDF Upload', idPrefix: 'pdf', subject: defaultSubject || undefined })
  );
}

/**
 * Generate NEET 2027 CBT questions for a subject + chapter scope.
 * @param {{ subject: string, chapterLabels: string[], count: number,
 *           style: 'pyq'|'abhyas'|'new-pattern', difficulty: string }} args
 */
export async function generateCbtQuestions({ subject, chapterLabels = [], count = 10, style = 'abhyas', difficulty = 'NEET level' }) {
  const styleText = {
    pyq: 'closely mirror the style, difficulty and concept distribution of actual NEET (UG) previous year questions (2016–2026)',
    abhyas: 'mirror NTA Abhyas practice-test style: NCERT line-by-line facts, direct formula application and common NCERT traps',
    'new-pattern': 'use new NEET patterns: Assertion–Reason, Statement I & II, Match List-I with List-II (with coded options), and "how many of the following" counts'
  }[style] || 'NEET level';

  const systemInstruction = `You are a senior NEET (UG) paper setter. Every question must be strictly within the NCERT Class 11-12
syllabus for NEET 2027, factually correct, with exactly one correct option. Use LaTeX inside \\( ... \\) for maths,
units and chemical formulas. Return ONLY valid JSON.`;

  const prompt = `Create ${count} single-correct NEET (UG) MCQs for ${subject.toUpperCase()}.
Chapters in scope: ${chapterLabels.length ? chapterLabels.join('; ') : 'entire NEET 2027 syllabus for this subject'}.
Style: ${styleText}. Difficulty: ${difficulty}.
Spread questions across the chapters. Numerical questions must have clean, verifiable answers.
Return {"questions":[{"chapter":"exact chapter name from the list","question":"...","options":["..","..","..",".."],"correctIndex":0,"explanation":"concise step-by-step solution"}]}`;

  const raw = await callGeminiApi({ prompt, systemInstruction, jsonMode: true, maxOutputTokens: 16384 });
  const parsed = parseJsonResponse(raw);
  const list = Array.isArray(parsed) ? parsed : parsed.questions;
  if (!Array.isArray(list)) throw new Error('Gemini did not return a questions array.');
  const tag = { pyq: 'Gemini · PYQ-style', abhyas: 'Gemini · Abhyas-style', 'new-pattern': 'Gemini · New Pattern' }[style] || 'Gemini AI';
  return list.map((q, i) => ({
    ...normalizeCbtQuestion({ ...q, subject }, i, { source: 'AI', examTag: tag, idPrefix: 'ai', subject }),
    chapterLabel: q.chapter || ''
  }));
}

/** Ask Gemini to explain a CBT question (used in post-test Solution Review). */
export async function askCbtTutor({ question, options, correctIndex, selectedIndex, userQuestion = '' }) {
  const systemInstruction = `You are a concise NEET (UG) tutor. Explain using NCERT concepts, show key steps/formulas,
and point out the trap in the option the student chose if it was wrong. Use LaTeX inside \\( ... \\) for formulas.`;
  const letters = ['1', '2', '3', '4'];
  const prompt = `Question: ${question}
Options: ${options.map((o, i) => `(${letters[i]}) ${o}`).join('  ')}
Official answer: ${correctIndex == null ? 'unknown' : `(${letters[correctIndex]})`}
Student selected: ${selectedIndex == null ? 'not attempted' : `(${letters[selectedIndex]})`}
${userQuestion ? `Student's doubt: ${userQuestion}` : 'Explain the solution.'}
Answer in 120-220 words.`;
  return callGeminiApi({ prompt, systemInstruction, jsonMode: false, maxOutputTokens: 4096 });
}
