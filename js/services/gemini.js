/**
 * Direct browser-to-Gemini REST API client using user-configured GEMINI_API_KEY.
 * Supports:
 *  - Custom NEET Question Generation (MCQ, Assertion-Reason, Statement I/II, Multi-Step Roadmaps)
 *  - Interactive "Ask What-If" Mechanism Tutor
 *  - Custom Study Card / Reaction Generator for any subject
 */

import { loadGeminiConfig, getResolvedModelId } from './storage.js';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function callGeminiApi({ prompt, systemInstruction, apiKeyOverride, modelOverride, jsonMode = false }) {
  const config = loadGeminiConfig();
  const apiKey = (apiKeyOverride ?? config.apiKey ?? '').trim();
  const modelId = (modelOverride ?? getResolvedModelId(config)).trim();

  if (!apiKey) {
    throw new Error('No GEMINI_API_KEY configured. Click "Gemini API" in the top bar to enter your key.');
  }

  const endpoint = `${GEMINI_API_BASE}/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: jsonMode ? 0.5 : 0.65,
      maxOutputTokens: 4096
    }
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  if (jsonMode) {
    body.generationConfig.responseMimeType = 'application/json';
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errMsg = data?.error?.message || `Gemini API returned HTTP ${response.status}`;
    throw new Error(errMsg);
  }

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || '')
    .join('')
    .trim();

  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}

function parseJsonResponse(rawText) {
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
    jsonMode: false
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
