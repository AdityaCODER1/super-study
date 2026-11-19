/**
 * Lightweight, zero-dependency, XSS-safe Markdown & Chemistry renderer for Gemini API outputs.
 * Supports:
 *  - Block elements: Headings, bullet lists (- / * / •), numbered lists (1. / 1)),
 *    blockquotes (>), markdown tables, fenced code blocks (```), horizontal rules, and paragraphs.
 *  - Inline elements: Bold (**text** / __text__), italic (*text* / _text_), bold+italic (***text***),
 *    inline code (`code`), strikethrough (~~text~~), and reaction arrows (->, -->, <=>).
 *  - Chemistry LaTeX cleanup: Converts common inline LaTeX tokens emitted by Gemini
 *    (e.g., $\rightarrow$, $\Delta$, $S_N1$, $S_N2$, $\text{CH}_3\text{Br}$) into clean Unicode.
 */

const SUBSCRIPT_MAP = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '+': '₊',
  '-': '₋'
};

const SUPERSCRIPT_MAP = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻'
};

function toSubscript(str) {
  return String(str).replace(/[0-9+-]/g, (ch) => SUBSCRIPT_MAP[ch] || ch);
}

function toSuperscript(str) {
  return String(str).replace(/[0-9+-]/g, (ch) => SUPERSCRIPT_MAP[ch] || ch);
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Normalizes common LaTeX chemistry tokens that Gemini occasionally emits in plain/markdown responses.
 */
function normalizeChemistryLatex(input) {
  let text = String(input ?? '');

  const replaceLatexCommands = (s) =>
    s
      .replace(/\\(?:text|mathrm|mathbf|mathit)\{([^{}]*)\}/g, '$1')
      .replace(/\\(?:longrightarrow|rightarrow|to)\b/g, '→')
      .replace(/\\(?:rightleftharpoons|leftrightharpoons)\b/g, '⇌')
      .replace(/\\leftrightarrow\b/g, '↔')
      .replace(/\\uparrow\b/g, '↑')
      .replace(/\\downarrow\b/g, '↓')
      .replace(/\\Delta\b/g, 'Δ')
      .replace(/\\alpha\b/g, 'α')
      .replace(/\\beta\b/g, 'β')
      .replace(/\\gamma\b/g, 'γ')
      .replace(/\\delta\b/g, 'δ')
      .replace(/\\pi\b/g, 'π')
      .replace(/\\sigma\b/g, 'σ')
      .replace(/\\omega\b/g, 'ω')
      .replace(/\\nu\b/g, 'ν')
      .replace(/\\mu\b/g, 'μ')
      .replace(/\\times\b/g, '×')
      .replace(/\\cdot\b/g, '·')
      .replace(/\\pm\b/g, '±')
      .replace(/\\approx\b/g, '≈')
      .replace(/\\neq\b/g, '≠')
      .replace(/\\leq\b/g, '≤')
      .replace(/\\geq\b/g, '≥')
      .replace(/\\circ\b/g, '°');

  // Clean inline $...$ math expressions
  text = text.replace(/\$([^$\n]+)\$/g, (_, inner) => {
    let cleaned = replaceLatexCommands(inner);
    cleaned = cleaned
      .replace(/\bS_\{?N\}?\s*([12i])\b/gi, 'SN$1')
      .replace(/\bE_\{?([12])\}?(cb)?\b/g, 'E$1$2')
      .replace(/\^\{([0-9+-]+)\}/g, (__, sup) => toSuperscript(sup))
      .replace(/\^([0-9+-])/g, (__, sup) => toSuperscript(sup))
      .replace(/_\{([0-9+-]+)\}/g, (__, sub) => toSubscript(sub))
      .replace(/_([0-9])/g, (__, sub) => toSubscript(sub))
      .replace(/[{}]/g, '');
    return cleaned;
  });

  return replaceLatexCommands(text);
}

/**
 * Formats inline Markdown syntax on an already HTML-escaped string.
 */
function formatEscapedInline(escapedStr) {
  const codeTokens = [];

  // 1. Extract and protect inline `code` spans
  let working = escapedStr.replace(/`([^`\n]+?)`/g, (_, codeContent) => {
    const idx = codeTokens.length;
    codeTokens.push(`<code class="md-inline-code">${codeContent}</code>`);
    return `\x00INLINECODE_${idx}\x00`;
  });

  // 2. Prettify reaction arrows outside code spans
  working = working
    .replace(/&lt;==&gt;|&lt;=&gt;|&lt;--&gt;/g, '⇌')
    .replace(/--&gt;|-&gt;/g, '→');

  // 3. Bold + Italic (***text*** or ___text___)
  working = working
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');

  // 4. Bold (**text** or __text__)
  working = working
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>');

  // 5. Italic (*text* or word-bounded _text_)
  working = working
    .replace(/\*([^\s*](?:[^*\n]*?[^\s*])?)\*/g, '<em>$1</em>')
    .replace(/(^|[\s(])_([^\s_](?:[^_\n]*?[^\s_])?)_(?=$|[\s.,;:!?)])/g, '$1<em>$2</em>');

  // 6. Strikethrough (~~text~~)
  working = working.replace(/~~([^\n~]+?)~~/g, '<del>$1</del>');

  // 7. Restore inline code spans
  working = working.replace(/\x00INLINECODE_(\d+)\x00/g, (_, idx) => codeTokens[Number(idx)] || '');

  return working;
}

/**
 * Renders inline-only Markdown (ideal for MCQ options, titles, and short card callout fields).
 */
export function renderInlineMarkdown(rawText) {
  if (rawText === null || rawText === undefined) return '';
  const normalized = normalizeChemistryLatex(String(rawText));
  const escaped = escapeHtml(normalized);
  return formatEscapedInline(escaped);
}

function isTableSeparator(line) {
  return /^\s*\|?\s*:?-{2,}:?\s*(?:\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
}

function splitTableCells(line) {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => formatEscapedInline(escapeHtml(cell.trim())));
}

/**
 * Renders full block + inline Markdown into sanitized HTML.
 */
export function renderMarkdown(rawText) {
  if (rawText === null || rawText === undefined) return '';
  const str = String(rawText).replace(/\r\n?/g, '\n').trim();
  if (!str) return '';

  // 1. Extract fenced code blocks (```...```) before line-by-line parsing
  const codeBlocks = [];
  const withCodePlaceholders = str.replace(/```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g, (_, _lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre class="md-code-block"><code>${escapeHtml(code.replace(/\n$/, ''))}</code></pre>`);
    return `\n\x00CODEBLOCK_${idx}\x00\n`;
  });

  // 2. Normalize inline LaTeX chemistry notation
  const normalized = normalizeChemistryLatex(withCodePlaceholders);
  const lines = normalized.split('\n');
  const htmlBlocks = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip blank lines
    if (!trimmed) {
      i++;
      continue;
    }

    // Fenced code block placeholder
    const codeMatch = trimmed.match(/^\x00CODEBLOCK_(\d+)\x00$/);
    if (codeMatch) {
      htmlBlocks.push(codeBlocks[Number(codeMatch[1])] || '');
      i++;
      continue;
    }

    // Horizontal rule (---, ***, ___)
    if (/^(?:[-*_]\s*){3,}$/.test(trimmed)) {
      htmlBlocks.push('<hr class="md-hr" />');
      i++;
      continue;
    }

    // Heading (# to ######)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+?)\s*#*$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const tag = level <= 2 ? 'h3' : 'h4';
      const cls = level <= 2 ? 'md-heading md-h3' : 'md-heading md-h4';
      htmlBlocks.push(`<${tag} class="${cls}">${formatEscapedInline(escapeHtml(headingMatch[2]))}</${tag}>`);
      i++;
      continue;
    }

    // Markdown Table
    if (trimmed.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1])) {
      const headerCells = splitTableCells(lines[i]);
      i += 2; // Skip header and separator row
      const bodyRows = [];
      while (i < lines.length && lines[i].trim().includes('|') && !/^\s*$/.test(lines[i])) {
        bodyRows.push(splitTableCells(lines[i]));
        i++;
      }
      const thead = `<thead><tr>${headerCells.map((c) => `<th>${c}</th>`).join('')}</tr></thead>`;
      const tbody = bodyRows.length
        ? `<tbody>${bodyRows.map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>`
        : '';
      htmlBlocks.push(`<div class="md-table-wrap"><table class="md-table">${thead}${tbody}</table></div>`);
      continue;
    }

    // Blockquote (> ...)
    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      htmlBlocks.push(`<blockquote class="md-blockquote">${renderMarkdown(quoteLines.join('\n'))}</blockquote>`);
      continue;
    }

    // Unordered list (- item, * item, • item)
    const ulMatch = line.match(/^\s*[-*•]\s+(.+)$/);
    if (ulMatch) {
      const items = [];
      while (i < lines.length) {
        const curr = lines[i];
        const m = curr.match(/^\s*[-*•]\s+(.+)$/);
        if (m) {
          items.push(formatEscapedInline(escapeHtml(m[1].trim())));
          i++;
          continue;
        }
        // Allow single blank line between bullet items if next line is also a bullet
        if (!curr.trim() && i + 1 < lines.length && /^\s*[-*•]\s+(.+)$/.test(lines[i + 1])) {
          i++;
          continue;
        }
        break;
      }
      htmlBlocks.push(`<ul class="md-list">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`);
      continue;
    }

    // Ordered list (1. item or 1) item)
    const olMatch = line.match(/^\s*(\d+)[.)]\s+(.+)$/);
    if (olMatch) {
      const items = [];
      while (i < lines.length) {
        const curr = lines[i];
        const m = curr.match(/^\s*(\d+)[.)]\s+(.+)$/);
        if (m) {
          items.push({
            num: Number(m[1]),
            html: formatEscapedInline(escapeHtml(m[2].trim()))
          });
          i++;
          continue;
        }
        // Allow single blank line between numbered items if next line is also a numbered item
        if (!curr.trim() && i + 1 < lines.length && /^\s*(\d+)[.)]\s+(.+)$/.test(lines[i + 1])) {
          i++;
          continue;
        }
        break;
      }
      htmlBlocks.push(
        `<ol class="md-list">${items.map((item) => `<li value="${item.num}">${item.html}</li>`).join('')}</ol>`
      );
      continue;
    }

    // Standard paragraph (collect consecutive non-special lines)
    const paraLines = [];
    while (i < lines.length) {
      const curr = lines[i];
      const currTrim = curr.trim();
      if (
        !currTrim ||
        /^\x00CODEBLOCK_\d+\x00$/.test(currTrim) ||
        /^(?:[-*_]\s*){3,}$/.test(currTrim) ||
        /^(#{1,6})\s+/.test(currTrim) ||
        /^>\s?/.test(currTrim) ||
        /^\s*[-*•]\s+/.test(curr) ||
        /^\s*\d+[.)]\s+/.test(curr) ||
        (currTrim.includes('|') && i + 1 < lines.length && isTableSeparator(lines[i + 1]))
      ) {
        break;
      }
      paraLines.push(formatEscapedInline(escapeHtml(currTrim)));
      i++;
    }

    if (paraLines.length > 0) {
      htmlBlocks.push(`<p class="md-p">${paraLines.join('<br />')}</p>`);
    } else {
      i++;
    }
  }

  return htmlBlocks.join('');
}
