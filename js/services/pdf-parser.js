/**
 * Client-Side PDF Parser & Diagram Cropper Engine for Super Study NTA CBT.
 * Uses Mozilla pdf.js (pdfjs-dist v4 ESM) to:
 *  1. Render PDF pages into high-DPI <canvas> bitmaps for Gemini 3.1 Vision & manual cropping.
 *  2. Auto-crop normalized [ymin, xmin, ymax, xmax] bounding boxes returned by Gemini Vision.
 *  3. Crop user-drawn pixel rectangles for diagrams, option figures, or full image questions.
 *  4. Provide an offline text/column-aware fallback extractor when no API key is used.
 */

const PDFJS_LOCAL_MJS = '../vendor/pdf.min.mjs';
const PDFJS_LOCAL_WORKER = new URL('../vendor/pdf.worker.min.mjs', import.meta.url).href;

let pdfjsLibPromise = null;

export async function getPdfJsLib() {
  if (!pdfjsLibPromise) {
    pdfjsLibPromise = import(PDFJS_LOCAL_MJS).then((mod) => {
      if (mod?.GlobalWorkerOptions) {
        mod.GlobalWorkerOptions.workerSrc = PDFJS_LOCAL_WORKER;
      }
      return mod;
    });
  }
  return pdfjsLibPromise;
}

export async function loadPdfDocument(file) {
  const pdfjs = await getPdfJsLib();
  const buffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;
  return {
    pdf,
    numPages: pdf.numPages,
    fileName: file.name || 'uploaded.pdf'
  };
}

function reconstructLinesFromTextContent(textContent, viewportWidth) {
  const items = (textContent?.items || []).filter((it) => typeof it.str === 'string' && it.str.trim());
  if (!items.length) return [];

  // Detect whether page is 2-column (significant spread on both left and right halves)
  const midX = viewportWidth * 0.48;
  const leftCount = items.filter((it) => it.transform[4] < midX - 15).length;
  const rightCount = items.filter((it) => it.transform[4] > midX + 15).length;
  const isTwoCol = leftCount > 15 && rightCount > 15;

  const sortBucket = (bucket) => {
    // Group by Y coordinate (PDF Y goes bottom-to-top)
    const rows = [];
    const sorted = [...bucket].sort((a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);
    for (const item of sorted) {
      const y = item.transform[5];
      const existing = rows.find((r) => Math.abs(r.y - y) <= 4.5);
      if (existing) {
        existing.items.push(item);
      } else {
        rows.push({ y, items: [item] });
      }
    }
    return rows.map((row) => {
      row.items.sort((a, b) => a.transform[4] - b.transform[4]);
      return row.items.map((it) => it.str).join(' ').replace(/\s+/g, ' ').trim();
    });
  };

  if (!isTwoCol) {
    return sortBucket(items);
  }
  const leftItems = items.filter((it) => it.transform[4] < midX);
  const rightItems = items.filter((it) => it.transform[4] >= midX);
  return [...sortBucket(leftItems), ...sortBucket(rightItems)];
}

export async function renderPdfPage(pdf, pageNumber, scale = 1.85) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(viewport.width);
  canvas.height = Math.round(viewport.height);
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: ctx, viewport }).promise;

  let textLines = [];
  try {
    const tc = await page.getTextContent();
    textLines = reconstructLinesFromTextContent(tc, page.getViewport({ scale: 1 }).width);
  } catch {
    textLines = [];
  }

  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
  const base64 = dataUrl.split(',')[1] || '';

  return {
    pageNumber,
    pageIndex: pageNumber - 1,
    canvas,
    dataUrl,
    base64,
    mimeType: 'image/jpeg',
    width: canvas.width,
    height: canvas.height,
    textLines
  };
}

/**
 * Crops a normalized [ymin, xmin, ymax, xmax] bounding box (0..1000 scale)
 * from a rendered PDF page <canvas> into a crisp JPEG/PNG data URL.
 */
export function cropNormalizedBoxFromCanvas(canvas, boxNorm) {
  if (!canvas || !Array.isArray(boxNorm) || boxNorm.length !== 4) return null;
  let [ymin, xmin, ymax, xmax] = boxNorm.map(Number);
  if ([ymin, xmin, ymax, xmax].some((n) => !Number.isFinite(n))) return null;

  // Add subtle 1.5% padding so labels/axes don't clip
  const padY = 14;
  const padX = 14;
  ymin = Math.max(0, ymin - padY);
  xmin = Math.max(0, xmin - padX);
  ymax = Math.min(1000, ymax + padY);
  xmax = Math.min(1000, xmax + padX);

  const sx = Math.round((xmin / 1000) * canvas.width);
  const sy = Math.round((ymin / 1000) * canvas.height);
  const sw = Math.round(((xmax - xmin) / 1000) * canvas.width);
  const sh = Math.round(((ymax - ymin) / 1000) * canvas.height);

  if (sw < 16 || sh < 16) return null;
  return cropPixelRectFromCanvas(canvas, { x: sx, y: sy, w: sw, h: sh });
}

/**
 * Crops an exact pixel rectangle { x, y, w, h } from a canvas, downscaling slightly
 * if oversized so IndexedDB storage remains snappy.
 */
export function cropPixelRectFromCanvas(canvas, rect) {
  if (!canvas || !rect) return null;
  const sx = Math.max(0, Math.round(rect.x));
  const sy = Math.max(0, Math.round(rect.y));
  const sw = Math.min(canvas.width - sx, Math.round(rect.w));
  const sh = Math.min(canvas.height - sy, Math.round(rect.h));
  if (sw < 12 || sh < 12) return null;

  const maxDim = 1100;
  const ratio = Math.min(1, maxDim / Math.max(sw, sh));
  const dw = Math.max(1, Math.round(sw * ratio));
  const dh = Math.max(1, Math.round(sh * ratio));

  const out = document.createElement('canvas');
  out.width = dw;
  out.height = dh;
  const ctx = out.getContext('2d', { alpha: false });
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, dw, dh);
  ctx.drawImage(canvas, sx, sy, sw, sh, 0, 0, dw, dh);
  return out.toDataURL('image/png');
}

/**
 * Parse pasted answer key text such as:
 *   "1: A, 2: C, 3: 4" or "1.(b) 2.(1) 3-d"
 * Returns Map<number, number> (questionNumber -> 0..3 index).
 */
export function parseAnswerKeyText(text) {
  const map = new Map();
  if (!text || !String(text).trim()) return map;
  const regex = /(\d{1,3})\s*[:.)\-\s]+\s*\(?([A-Da-d1-4])\)?/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const qNo = Number(m[1]);
    const tok = m[2].toUpperCase();
    const idx = ['A', '1'].includes(tok)
      ? 0
      : ['B', '2'].includes(tok)
      ? 1
      : ['C', '3'].includes(tok)
      ? 2
      : ['D', '4'].includes(tok)
      ? 3
      : null;
    if (qNo > 0 && idx !== null) {
      map.set(qNo, idx);
    }
  }
  return map;
}

function guessSubjectFromText(text, fallback = 'physics') {
  const s = text.toLowerCase();
  if (/\b(velocity|acceleration|torque|capacitance|resistor|magnetic|wavelength|lens|refractive|diode|transistor|newton|ohms?|volt)\b/.test(s)) {
    return 'physics';
  }
  if (/\b(molarity|enthalpy|gibbs|equilibrium|hybridisation|orbital|oxide|reaction|reagent|alkene|phenol|aldehyde|amine|ph\s*=)\b/.test(s)) {
    return 'chemistry';
  }
  if (/\b(chloroplast|xylem|phloem|stomata|bryophyte|pteridophyte|angiosperm|pollen|endosperm|photosynthesis|calvin|operon|mendel)\b/.test(s)) {
    return 'botany';
  }
  if (/\b(nephron|sarcomere|alveoli|ecg|pituitary|insulin|spermatogenesis|placenta|plasmid|ecori|antibody|malaria|cockroach)\b/.test(s)) {
    return 'zoology';
  }
  return fallback;
}

/**
 * Offline regex/heuristic question extractor for PDFs (works with zero API key).
 * Pairs cleanly with manual drag-to-crop diagrams inside the PDF Cropper Studio.
 */
export function extractQuestionsOfflineFromPages(renderedPages, { defaultSubject = '', answerKeyText = '' } = {}) {
  const allLines = renderedPages.flatMap((p) => p.textLines.map((line) => ({ pageIndex: p.pageIndex, line })));
  const ansMap = parseAnswerKeyText(answerKeyText);

  // Also scan bottom lines of the PDF for inline answer keys like "Ans. 1.(a) 2.(c)"
  const fullText = allLines.map((x) => x.line).join('\n');
  const inlineKeyMatch = fullText.match(/(?:answer\s*key|answers?)[:\s]+([\s\S]{10,1200})$/i);
  if (inlineKeyMatch) {
    const autoMap = parseAnswerKeyText(inlineKeyMatch[1]);
    autoMap.forEach((v, k) => {
      if (!ansMap.has(k)) ansMap.set(k, v);
    });
  }

  const questions = [];
  let current = null;

  const qStartRe = /^(?:Q\.?\s*)?(\d{1,3})[.)]\s+(.+)$/i;
  const optRe = /^\(?([1-4A-Da-d])[.)]\s+(.+)$/;
  const inlineOptsSplit = /\s+(?=\(?[1-4A-Da-d][.)]\s)/g;

  const flushCurrent = () => {
    if (!current || !current.stem.trim()) return;
    if (current.options.length === 0) {
      // Try splitting inline options if they appeared on the same line
      const parts = current.stem.split(inlineOptsSplit);
      if (parts.length >= 3) {
        current.stem = parts[0].trim();
        for (const p of parts.slice(1)) {
          const om = p.trim().match(optRe);
          if (om) current.options.push(om[2].trim());
        }
      }
    }
    const opts = current.options.slice(0, 4);
    while (opts.length < 4) opts.push(`Option (${opts.length + 1})`);
    const qNo = current.qNo;
    const subj = defaultSubject || guessSubjectFromText(`${current.stem} ${opts.join(' ')}`);
    questions.push({
      id: `pdf-off-${Date.now().toString(36)}-${questions.length}`,
      subject: subj,
      chapterId: null,
      classLevel: null,
      source: 'PDF',
      examTag: 'PDF Upload (Offline)',
      year: null,
      qNo,
      section: null,
      question: current.stem.trim(),
      questionImage: null,
      imageOnly: false,
      options: opts,
      optionImages: [null, null, null, null],
      correctIndex: ansMap.has(qNo) ? ansMap.get(qNo) : null,
      explanation: ansMap.has(qNo) ? `Answer key: Option (${ansMap.get(qNo) + 1}).` : '',
      pageIndex: current.pageIndex
    });
  };

  for (const { pageIndex, line } of allLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^(?:answer\s*key|solutions?|hints?)\b/i.test(trimmed)) break;

    const qm = trimmed.match(qStartRe);
    if (qm) {
      flushCurrent();
      current = {
        qNo: Number(qm[1]),
        stem: qm[2].trim(),
        options: [],
        pageIndex
      };
      continue;
    }

    if (!current) continue;

    // Check if line contains multiple options like "(1) foo  (2) bar"
    const subParts = trimmed.split(inlineOptsSplit).map((s) => s.trim()).filter(Boolean);
    if (subParts.length >= 2 && optRe.test(subParts[0])) {
      for (const part of subParts) {
        const om = part.match(optRe);
        if (om) current.options.push(om[2].trim());
      }
      continue;
    }

    const om = trimmed.match(optRe);
    if (om && current.options.length < 4) {
      current.options.push(om[2].trim());
    } else if (current.options.length === 0) {
      current.stem += `\n${trimmed}`;
    } else {
      const last = current.options.length - 1;
      current.options[last] += ` ${trimmed}`;
    }
  }
  flushCurrent();

  return questions;
}
