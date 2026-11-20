/**
 * NEET (UG) 2027 CBT — Syllabus registry, unified question schema & test templates.
 *
 * Sections follow the current NTA pattern: Physics, Chemistry, Botany, Zoology.
 * Chapters marked `legacy: true` were removed from the current NMC/NCERT syllabus but
 * still appear in older PYQs; they are excluded from "NEET 2027 syllabus" selections
 * by default.
 *
 * ---------------------------------------------------------------------------
 * Unified CbtQuestion schema (used by every source: PYQ bank, AI, PDF, imports)
 * ---------------------------------------------------------------------------
 * {
 *   id: string,                     // globally unique, e.g. 'pyq-2019-phy-012'
 *   subject: 'physics' | 'chemistry' | 'botany' | 'zoology',
 *   chapterId: string | null,       // id from NEET_SYLLABUS chapters (null = untagged)
 *   classLevel: 11 | 12 | null,
 *   source: 'PYQ' | 'AI' | 'PDF' | 'Import',
 *   examTag: string,                // e.g. 'NEET 2019', 'NEET 2024 (T3)', 'Gemini · Abhyas-style'
 *   year: number | null,
 *   qNo: number | null,             // original question number in the paper
 *   section: 'A' | 'B' | null,      // NEET 2021–2024 Section B (attempt any 10 of 15)
 *   question: string,               // text; LaTeX allowed inside \( \) or $ $
 *   questionImage: string | null,   // relative URL or data: URL (diagram or full question image)
 *   imageOnly: boolean,             // true => questionImage contains stem AND options; options are labels
 *   options: [string, string, string, string],
 *   optionImages: [string|null, string|null, string|null, string|null] | undefined,
 *   correctIndex: 0 | 1 | 2 | 3 | null,  // null => answer key unknown (not scored)
 *   explanation: string
 * }
 */

export const CBT_SECTIONS = [
  { id: 'physics', label: 'Physics', short: 'PHY' },
  { id: 'chemistry', label: 'Chemistry', short: 'CHE' },
  { id: 'botany', label: 'Botany', short: 'BOT' },
  { id: 'zoology', label: 'Zoology', short: 'ZOO' }
];

const ch = (id, classLevel, label, extra = {}) => ({ id, classLevel, label, ...extra });

export const NEET_SYLLABUS = {
  physics: [
    ch('phy-units', 11, 'Units and Measurements'),
    ch('phy-1d-motion', 11, 'Motion in a Straight Line'),
    ch('phy-2d-motion', 11, 'Motion in a Plane'),
    ch('phy-nlm', 11, 'Laws of Motion'),
    ch('phy-wep', 11, 'Work, Energy and Power'),
    ch('phy-rotation', 11, 'System of Particles and Rotational Motion'),
    ch('phy-gravitation', 11, 'Gravitation'),
    ch('phy-solids', 11, 'Mechanical Properties of Solids'),
    ch('phy-fluids', 11, 'Mechanical Properties of Fluids'),
    ch('phy-thermal', 11, 'Thermal Properties of Matter'),
    ch('phy-thermo', 11, 'Thermodynamics'),
    ch('phy-ktg', 11, 'Kinetic Theory of Gases'),
    ch('phy-oscillations', 11, 'Oscillations'),
    ch('phy-waves', 11, 'Waves'),
    ch('phy-electrostatics', 12, 'Electric Charges and Fields'),
    ch('phy-capacitance', 12, 'Electrostatic Potential and Capacitance'),
    ch('phy-current', 12, 'Current Electricity'),
    ch('phy-magnetism', 12, 'Moving Charges and Magnetism'),
    ch('phy-mag-matter', 12, 'Magnetism and Matter'),
    ch('phy-emi', 12, 'Electromagnetic Induction'),
    ch('phy-ac', 12, 'Alternating Current'),
    ch('phy-emwaves', 12, 'Electromagnetic Waves'),
    ch('phy-ray-optics', 12, 'Ray Optics and Optical Instruments'),
    ch('phy-wave-optics', 12, 'Wave Optics'),
    ch('phy-dual', 12, 'Dual Nature of Radiation and Matter'),
    ch('phy-atoms', 12, 'Atoms'),
    ch('phy-nuclei', 12, 'Nuclei'),
    ch('phy-semiconductors', 12, 'Semiconductor Electronics'),
    ch('phy-communication', 12, 'Communication Systems', { legacy: true })
  ],
  chemistry: [
    ch('che-basic', 11, 'Some Basic Concepts of Chemistry'),
    ch('che-atom', 11, 'Structure of Atom'),
    ch('che-periodic', 11, 'Classification of Elements and Periodicity'),
    ch('che-bonding', 11, 'Chemical Bonding and Molecular Structure'),
    ch('che-states', 11, 'States of Matter', { legacy: true }),
    ch('che-thermo', 11, 'Chemical Thermodynamics'),
    ch('che-equilibrium', 11, 'Equilibrium (Chemical & Ionic)'),
    ch('che-redox', 11, 'Redox Reactions'),
    ch('che-hydrogen', 11, 'Hydrogen', { legacy: true }),
    ch('che-sblock', 11, 's-Block Elements', { legacy: true }),
    ch('che-goc', 11, 'Organic Chemistry: Basic Principles (GOC)'),
    ch('che-hydrocarbons', 11, 'Hydrocarbons'),
    ch('che-environmental', 11, 'Environmental Chemistry', { legacy: true }),
    ch('che-solid', 12, 'Solid State', { legacy: true }),
    ch('che-solutions', 12, 'Solutions'),
    ch('che-electrochem', 12, 'Electrochemistry'),
    ch('che-kinetics', 12, 'Chemical Kinetics'),
    ch('che-surface', 12, 'Surface Chemistry', { legacy: true }),
    ch('che-metallurgy', 12, 'General Principles of Isolation of Elements', { legacy: true }),
    ch('che-pblock', 12, 'p-Block Elements (Groups 13–18)'),
    ch('che-dfblock', 12, 'd- and f-Block Elements'),
    ch('che-coordination', 12, 'Coordination Compounds'),
    ch('che-haloalkanes', 12, 'Haloalkanes and Haloarenes'),
    ch('che-alcohols', 12, 'Alcohols, Phenols and Ethers'),
    ch('che-carbonyls', 12, 'Aldehydes, Ketones and Carboxylic Acids'),
    ch('che-amines', 12, 'Amines'),
    ch('che-biomolecules', 12, 'Biomolecules'),
    ch('che-polymers', 12, 'Polymers', { legacy: true }),
    ch('che-everyday', 12, 'Chemistry in Everyday Life', { legacy: true }),
    ch('che-practical', 12, 'Principles Related to Practical Chemistry')
  ],
  botany: [
    ch('bot-living-world', 11, 'The Living World'),
    ch('bot-classification', 11, 'Biological Classification'),
    ch('bot-plant-kingdom', 11, 'Plant Kingdom'),
    ch('bot-morphology', 11, 'Morphology of Flowering Plants'),
    ch('bot-anatomy', 11, 'Anatomy of Flowering Plants'),
    ch('bot-cell', 11, 'Cell: The Unit of Life'),
    ch('bot-cell-cycle', 11, 'Cell Cycle and Cell Division'),
    ch('bot-transport', 11, 'Transport in Plants', { legacy: true }),
    ch('bot-mineral', 11, 'Mineral Nutrition', { legacy: true }),
    ch('bot-photosynthesis', 11, 'Photosynthesis in Higher Plants'),
    ch('bot-respiration', 11, 'Respiration in Plants'),
    ch('bot-growth', 11, 'Plant Growth and Development'),
    ch('bot-reproduction-organisms', 12, 'Reproduction in Organisms', { legacy: true }),
    ch('bot-sexual-reproduction', 12, 'Sexual Reproduction in Flowering Plants'),
    ch('bot-inheritance', 12, 'Principles of Inheritance and Variation'),
    ch('bot-molecular', 12, 'Molecular Basis of Inheritance'),
    ch('bot-microbes', 12, 'Microbes in Human Welfare'),
    ch('bot-organisms', 12, 'Organisms and Populations'),
    ch('bot-ecosystem', 12, 'Ecosystem'),
    ch('bot-biodiversity', 12, 'Biodiversity and Conservation'),
    ch('bot-environment', 12, 'Environmental Issues', { legacy: true })
  ],
  zoology: [
    ch('zoo-animal-kingdom', 11, 'Animal Kingdom'),
    ch('zoo-structural', 11, 'Structural Organisation in Animals'),
    ch('zoo-biomolecules', 11, 'Biomolecules'),
    ch('zoo-digestion', 11, 'Digestion and Absorption', { legacy: true }),
    ch('zoo-breathing', 11, 'Breathing and Exchange of Gases'),
    ch('zoo-circulation', 11, 'Body Fluids and Circulation'),
    ch('zoo-excretion', 11, 'Excretory Products and their Elimination'),
    ch('zoo-locomotion', 11, 'Locomotion and Movement'),
    ch('zoo-neural', 11, 'Neural Control and Coordination'),
    ch('zoo-chemical', 11, 'Chemical Coordination and Integration'),
    ch('zoo-human-reproduction', 12, 'Human Reproduction'),
    ch('zoo-reproductive-health', 12, 'Reproductive Health'),
    ch('zoo-evolution', 12, 'Evolution'),
    ch('zoo-health', 12, 'Human Health and Disease'),
    ch('zoo-biotech-principles', 12, 'Biotechnology: Principles and Processes'),
    ch('zoo-biotech-applications', 12, 'Biotechnology and its Applications')
  ]
};

/** Flat lookup: chapterId -> { ...chapter, subject } */
export const CHAPTER_INDEX = Object.fromEntries(
  Object.entries(NEET_SYLLABUS).flatMap(([subject, chapters]) =>
    chapters.map((c) => [c.id, { ...c, subject }])
  )
);

export function getChapters(subject, { includeLegacy = false, classLevel = null } = {}) {
  return (NEET_SYLLABUS[subject] || []).filter(
    (c) => (includeLegacy || !c.legacy) && (classLevel == null || c.classLevel === classLevel)
  );
}

export const NEET_MARKING = { correct: 4, incorrect: -1, unattempted: 0 };

/** Default NEET 2027 (180-question compulsory) pattern. */
export const NEET_2027_PATTERN = {
  durationMin: 180,
  perSubject: { physics: 45, chemistry: 45, botany: 45, zoology: 45 }
};

/**
 * Pre-built test templates. `scope` decides chapter eligibility:
 *  - 'full'  : all non-legacy chapters
 *  - 'class11' / 'class12'
 *  - { chapters: [...ids] }
 * `sources` filters the bank: 'PYQ' (text PYQs), 'PAPER' (image-based full papers), 'AI'.
 * `paper` replays an exact year paper (in original order) instead of sampling.
 */
export const PREBUILT_TESTS = [
  {
    id: 'full-mock-pyq',
    group: 'Full Syllabus Mocks',
    title: 'NEET 2027 Full Mock — PYQ + NTA Abhyas Grand Test',
    description: '180 questions sampled across the full NEET 2027 syllabus from real PYQs and NTA Abhyas. 180 minutes, +4/−1.',
    perSubject: { physics: 45, chemistry: 45, botany: 45, zoology: 45 },
    durationMin: 180,
    scope: 'full',
    sources: ['PYQ', 'ABHYAS']
  },
  {
    id: 'full-mock-recent',
    group: 'Full Syllabus Mocks',
    title: 'NEET 2027 Full Mock — Recent Trend (2021–2024 PYQs)',
    description: '180 questions weighted to the most recent four NEET papers.',
    perSubject: { physics: 45, chemistry: 45, botany: 45, zoology: 45 },
    durationMin: 180,
    scope: 'full',
    sources: ['PYQ'],
    yearMin: 2021
  },
  {
    id: 'part-abhyas-sprint',
    group: 'Part Syllabus Tests',
    title: 'NTA Abhyas & NCERT Trap Sprint — Full PCB Mix',
    description: '80 curated NTA Abhyas & NCERT exception questions across Physics, Chemistry, Botany and Zoology. 80 minutes.',
    perSubject: { physics: 20, chemistry: 20, botany: 20, zoology: 20 },
    durationMin: 80,
    scope: 'full',
    sources: ['ABHYAS']
  },
  {
    id: 'part-class11',
    group: 'Part Syllabus Tests',
    title: 'Part Test — Class 11 Complete (PCB)',
    description: '90 questions from Class 11 chapters only (PYQs + NTA Abhyas). 90 minutes.',
    perSubject: { physics: 23, chemistry: 22, botany: 23, zoology: 22 },
    durationMin: 90,
    scope: 'class11',
    sources: ['PYQ', 'ABHYAS']
  },
  {
    id: 'part-class12',
    group: 'Part Syllabus Tests',
    title: 'Part Test — Class 12 Complete (PCB)',
    description: '90 questions from Class 12 chapters only (PYQs + NTA Abhyas). 90 minutes.',
    perSubject: { physics: 23, chemistry: 22, botany: 23, zoology: 22 },
    durationMin: 90,
    scope: 'class12',
    sources: ['PYQ', 'ABHYAS']
  },
  {
    id: 'part-mechanics-goc-cell',
    group: 'Part Syllabus Tests',
    title: 'Unit Test — Mechanics · GOC & Hydrocarbons · Cell & Plant Physiology',
    description: '60 questions on high-weightage Class 11 units. 60 minutes.',
    perSubject: { physics: 15, chemistry: 15, botany: 15, zoology: 15 },
    durationMin: 60,
    scope: {
      chapters: [
        'phy-1d-motion', 'phy-2d-motion', 'phy-nlm', 'phy-wep', 'phy-rotation', 'phy-gravitation',
        'che-goc', 'che-hydrocarbons', 'che-bonding',
        'bot-cell', 'bot-cell-cycle', 'bot-photosynthesis', 'bot-respiration', 'bot-growth',
        'zoo-structural', 'zoo-biomolecules', 'zoo-breathing', 'zoo-circulation', 'zoo-excretion',
        'zoo-locomotion', 'zoo-neural', 'zoo-chemical'
      ]
    },
    sources: ['PYQ', 'ABHYAS']
  },
  {
    id: 'part-electro-physical-genetics',
    group: 'Part Syllabus Tests',
    title: 'Unit Test — Electrodynamics & Modern · Physical/Inorganic · Genetics & Biotech',
    description: '60 questions on high-weightage Class 12 units. 60 minutes.',
    perSubject: { physics: 15, chemistry: 15, botany: 15, zoology: 15 },
    durationMin: 60,
    scope: {
      chapters: [
        'phy-electrostatics', 'phy-capacitance', 'phy-current', 'phy-magnetism', 'phy-emi', 'phy-ac',
        'phy-dual', 'phy-atoms', 'phy-nuclei', 'phy-semiconductors',
        'che-solutions', 'che-electrochem', 'che-kinetics', 'che-pblock', 'che-dfblock', 'che-coordination',
        'bot-inheritance', 'bot-molecular', 'bot-sexual-reproduction',
        'zoo-human-reproduction', 'zoo-reproductive-health', 'zoo-evolution', 'zoo-health',
        'zoo-biotech-principles', 'zoo-biotech-applications'
      ]
    },
    sources: ['PYQ', 'ABHYAS']
  }
];

/** Year-wise original papers (built dynamically from the bank manifest). */
export const PAPER_REPLAYS = [
  { id: 'paper-2026', year: 2026, title: 'NEET (UG) 2026 — Original Paper', durationMin: 180, kind: 'image' },
  { id: 'paper-2025', year: 2025, title: 'NEET (UG) 2025 — Original Paper (Code 45)', durationMin: 180, kind: 'image' },
  { id: 'paper-2024', year: 2024, title: 'NEET (UG) 2024 — Original Paper (Code T3, with Section B)', durationMin: 200, kind: 'image' },
  { id: 'paper-2023', year: 2023, title: 'NEET (UG) 2023 — PYQ Paper', durationMin: 200, kind: 'text' },
  { id: 'paper-2021', year: 2021, title: 'NEET (UG) 2021 — PYQ Paper', durationMin: 180, kind: 'text' },
  { id: 'paper-2020', year: 2020, title: 'NEET (UG) 2020 — PYQ Paper', durationMin: 180, kind: 'text' },
  { id: 'paper-2019', year: 2019, title: 'NEET (UG) 2019 — PYQ Paper', durationMin: 180, kind: 'text' },
  { id: 'paper-2018', year: 2018, title: 'NEET (UG) 2018 — PYQ Paper', durationMin: 180, kind: 'text' },
  { id: 'paper-2017', year: 2017, title: 'NEET (UG) 2017 — PYQ Paper', durationMin: 180, kind: 'text' },
  { id: 'paper-2016', year: 2016, title: 'NEET (UG) 2016 — PYQ Paper', durationMin: 180, kind: 'text' }
];
