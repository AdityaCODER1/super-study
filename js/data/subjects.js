/**
 * Multi-subject registry for Super Study.
 * Organic Chemistry is pre-loaded with complete NCERT Class 11 & 12 reactions,
 * mechanisms, trends, and tests. Other NEET/custom subjects include starter cards
 * and can be expanded via the Custom Study Studio or Gemini AI Generator.
 */

export const DEFAULT_SUBJECTS = [
  {
    id: 'organic-chemistry',
    name: 'Organic Chemistry (NEET NCERT 11 & 12)',
    shortName: 'Organic Chemistry',
    examTarget: 'NEET UG / NCERT Class 11 & 12',
    description:
      'Complete NCERT Class 11 & 12 organic reactions, curved-arrow mechanisms, leaving group & reagent trends, GOC orders, and distinguishing lab tests.',
    isCoreOrganic: true,
    chapters: [
      { id: 'c11-goc', classLevel: 11, label: 'Ch 12 (XI): GOC & Purification / Analysis' },
      { id: 'c11-alkanes', classLevel: 11, label: 'Ch 13 (XI): Hydrocarbons — Alkanes' },
      { id: 'c11-alkenes', classLevel: 11, label: 'Ch 13 (XI): Hydrocarbons — Alkenes' },
      { id: 'c11-alkynes', classLevel: 11, label: 'Ch 13 (XI): Hydrocarbons — Alkynes' },
      { id: 'c11-aromatic', classLevel: 11, label: 'Ch 13 (XI): Aromatic Hydrocarbons' },
      { id: 'c12-halo', classLevel: 12, label: 'Ch 10 (XII): Haloalkanes & Haloarenes' },
      { id: 'c12-alcohols', classLevel: 12, label: 'Ch 11 (XII): Alcohols, Phenols & Ethers' },
      { id: 'c12-carbonyls', classLevel: 12, label: 'Ch 12 (XII): Aldehydes, Ketones & Carboxylic Acids' },
      { id: 'c12-amines', classLevel: 12, label: 'Ch 13 (XII): Amines & Diazonium Salts' },
      { id: 'c12-biomolecules', classLevel: 12, label: 'Ch 14 (XII): Biomolecules (Carbohydrates & Amino Acids)' }
    ]
  },
  {
    id: 'inorganic-chemistry',
    name: 'Inorganic Chemistry (NCERT Blocks & Coordination)',
    shortName: 'Inorganic Chemistry',
    examTarget: 'NEET UG / NCERT Class 11 & 12',
    description:
      'Custom study space for p-Block, d/f-Block trends, Coordination Compounds, and Chemical Bonding exceptions.',
    isCoreOrganic: false,
    chapters: [
      { id: 'inorg-bonding', classLevel: 11, label: 'Chemical Bonding & VSEPR' },
      { id: 'inorg-pblock', classLevel: 12, label: 'p-Block Elements & Oxoacids' },
      { id: 'inorg-dfblock', classLevel: 12, label: 'd & f Block Trends (KMnO4 / K2Cr2O7)' },
      { id: 'inorg-coord', classLevel: 12, label: 'Coordination Compounds & CFT' }
    ],
    starterCards: [
      {
        id: 'inorg-1',
        chapter: 'inorg-dfblock',
        title: 'KMnO4 Oxidizing Action in Acidic, Neutral & Alkaline Media',
        namedReaction: 'Disproportionation & Redox',
        category: 'Redox',
        mechanismType: 'Electron Transfer',
        reactants: 'MnO4⁻ + I⁻ (or Fe²⁺ / C2O4²⁻)',
        reagents: 'H⁺ (Acidic) vs H2O (Faintly Alkaline)',
        conditions: '298 K',
        products: 'Mn²⁺ (in H⁺) vs MnO2 (in neutral/alkaline)',
        rds: 'n-factor: 5 in acidic, 3 in neutral, 1 in strong alkaline (MnO4²⁻)',
        stereochemistry: 'N/A',
        rearrangementAlert: 'With I⁻: Acidic medium forms I2, while neutral/faintly alkaline medium oxidizes I⁻ all the way to IO3⁻ (Iodate)!',
        ncertExceptions: 'Classic NEET trap: Acidified KMnO4 oxidizes H2C2O4 to CO2 (only on warming ~333 K initially), and oxidizes I⁻ to I2.',
        fromGroup: 'Permanganate',
        toGroup: 'Mn²⁺ / MnO2',
        neetFrequency: 'Very High',
        svgSteps: [
          {
            stepTitle: 'Acidic Medium Reduction (n = 5)',
            description: 'In dilute H2SO4, purple MnO4⁻ accepts 5 electrons to form colorless Mn²⁺.',
            leftSpecies: 'MnO4⁻ + 8H⁺',
            leftCharge: '+7 Mn',
            centerAction: '+ 5e⁻',
            rightSpecies: 'Mn²⁺ + 4H2O',
            rightCharge: '+2 Mn',
            intermediate: 'Color change: Deep Purple → Colorless',
            arrows: [{ type: 'full', from: 'left', to: 'right', label: '5e⁻ gain' }]
          },
          {
            stepTitle: 'Neutral / Faintly Alkaline Reduction (n = 3)',
            description: 'In neutral or weakly alkaline medium, MnO4⁻ precipitates brown MnO2 and converts I⁻ to IO3⁻.',
            leftSpecies: '2MnO4⁻ + H2O + I⁻',
            leftCharge: '+7 Mn',
            centerAction: '3e⁻/Mn',
            rightSpecies: '2MnO2↓ + 2OH⁻ + IO3⁻',
            rightCharge: '+4 Mn',
            intermediate: 'Brown precipitate of MnO2',
            arrows: [{ type: 'full', from: 'left', to: 'right', label: '3e⁻ transfer' }]
          }
        ]
      }
    ]
  },
  {
    id: 'physical-chemistry',
    name: 'Physical Chemistry (Formulas & Thermodynamics)',
    shortName: 'Physical Chemistry',
    examTarget: 'NEET UG / NCERT Class 11 & 12',
    description:
      'Custom study cards for Chemical Kinetics, Electrochemistry, Equilibrium, Thermodynamics, and Solutions.',
    isCoreOrganic: false,
    chapters: [
      { id: 'phys-thermo', classLevel: 11, label: 'Thermodynamics & Equilibrium' },
      { id: 'phys-electro', classLevel: 12, label: 'Electrochemistry & Nernst Equation' },
      { id: 'phys-kinetics', classLevel: 12, label: 'Chemical Kinetics & Arrhenius' }
    ],
    starterCards: [
      {
        id: 'phys-1',
        chapter: 'phys-electro',
        title: 'Nernst Equation at 298 K',
        namedReaction: 'Cell Potential Calculation',
        category: 'Electrochemistry',
        mechanismType: 'Thermodynamic Relation',
        reactants: 'E°cell, Reaction Quotient Q, electrons n',
        reagents: '2.303 RT / F = 0.0591 V at 298 K',
        conditions: 'T = 298 K',
        products: 'Ecell = E°cell − (0.0591 / n) log10(Q)',
        rds: 'At equilibrium, Ecell = 0 and Q = Kc ⇒ E°cell = (0.0591/n) log Kc',
        stereochemistry: 'N/A',
        rearrangementAlert: 'Remember ΔG° = −nFE°cell (extensive property, whereas E°cell is intensive and NOT multiplied by stoichiometric coefficients).',
        ncertExceptions: 'Watch n value carefully in disproportionation or half-cell combination questions!',
        fromGroup: 'E°cell',
        toGroup: 'Ecell / ΔG° / Kc',
        neetFrequency: 'Very High',
        svgSteps: [
          {
            stepTitle: 'Write Balanced Redox & Find n',
            description: 'Balance electrons transferred between anode (oxidation) and cathode (reduction) to determine n.',
            leftSpecies: 'aA + bB',
            leftCharge: 'Q = [C]^c[D]^d / [A]^a[B]^b',
            centerAction: 'n e⁻',
            rightSpecies: 'cC + dD',
            rightCharge: 'ΔG° = −nFE°',
            intermediate: 'Omit pure solids & pure liquids from Q',
            arrows: [{ type: 'full', from: 'left', to: 'right', label: 'n electrons' }]
          }
        ]
      }
    ]
  },
  {
    id: 'biology',
    name: 'Biology (NCERT Botany & Zoology)',
    shortName: 'Biology',
    examTarget: 'NEET UG / NCERT Class 11 & 12',
    description:
      'Custom study space for NCERT line-by-line cycles (Glycolysis, Krebs, Calvin, Lac Operon, Immunity, Endocrine).',
    isCoreOrganic: false,
    chapters: [
      { id: 'bio-physio', classLevel: 11, label: 'Plant & Human Physiology' },
      { id: 'bio-genetics', classLevel: 12, label: 'Genetics & Molecular Basis' }
    ],
    starterCards: []
  },
  {
    id: 'physics',
    name: 'Physics (Mechanics, Electrodynamics & Modern)',
    shortName: 'Physics',
    examTarget: 'NEET UG / NCERT Class 11 & 12',
    description:
      'Custom study space for key formulas, sign conventions, and high-yield NEET Physics derivations.',
    isCoreOrganic: false,
    chapters: [
      { id: 'phy-mech', classLevel: 11, label: 'Mechanics & Gravitation' },
      { id: 'phy-modern', classLevel: 12, label: 'Modern Physics & Optics' }
    ],
    starterCards: []
  }
];

export const MECHANISM_CATEGORIES = [
  'All Categories',
  'Named Reaction',
  'Substitution (SN1/SN2/SNAr)',
  'Elimination (E1/E2)',
  'Electrophilic Addition',
  'Nucleophilic Addition',
  'Electrophilic Aromatic Substitution',
  'Free Radical',
  'Oxidation',
  'Reduction',
  'Rearrangement / Condensation',
  'Qualitative Test / Analysis'
];
