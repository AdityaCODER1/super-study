/**
 * Complete NCERT Class 11 Organic Chemistry Reactions & Mechanisms (NEET Syllabus)
 * Covers:
 *  - Ch 12: General Organic Chemistry (Carbocation Rearrangements, Keto-Enol Tautomerism)
 *  - Ch 12: Qualitative & Quantitative Analysis (Lassaigne's Test, Kjeldahl, Dumas, Carius)
 *  - Ch 13: Alkanes (Wurtz, Kolbe Electrolysis, Decarboxylation, Halogenation, Controlled Oxidation, Aromatization)
 *  - Ch 13: Alkenes (Dehydration, Dehydrohalogenation E2, HX + Peroxide, Hydration, Ozonolysis, Baeyer's, Hydroboration, Oxymercuration)
 *  - Ch 13: Alkynes (Dehydrohalogenation, Terminal Acidic Tests, Lindlar vs Birch, Kucherov Hydration, Cyclic Polymerization)
 *  - Ch 13: Aromatic Hydrocarbons (Nitration, Halogenation, Sulfonation, Friedel-Crafts Alkylation/Acylation, Gattermann-Koch, BHC)
 */

export const CLASS11_REACTIONS = [
  // ==================== CH 12: GOC & ANALYSIS ====================
  {
    id: 'c11-carbocation-rearrange',
    chapter: 'c11-goc',
    title: 'Carbocation Rearrangement (1,2-Hydride, Methyl & Ring Expansion)',
    namedReaction: 'Wagner-Meerwein Shift',
    category: 'Rearrangement / Condensation',
    mechanismType: '1,2-Sigmatropic Shift',
    reactants: '2° Carbocation adjacent to 3°/4° carbon or strained 4-membered ring',
    reagents: 'Spontaneous intramolecular shift (H⁻, CH3⁻, or C–C bond)',
    conditions: 'Polar protic medium / Acidic hydration / SN1 / E1',
    products: 'More stable 3° / Resonance-stabilized / 5- or 6-membered ring Carbocation',
    rds: 'Migration occurs faster than nucleophilic capture when ΔG‡ is lower; migratory aptitude: H⁻ > Ph⁻ > Et⁻ > Me⁻ (or ring strain release)',
    stereochemistry: 'Planar sp² carbocation formed at new center',
    rearrangementAlert: 'CRITICAL NEET RULE: Always check for 1,2-shift or ring expansion (3→4 or 4→5 or 5→6) whenever a discrete carbocation forms!',
    ncertExceptions: 'Ring expansion from cyclobutylcarbinyl (4-ring + CH2⁺) to cyclopentyl cation (5-ring) relieves ~26 kcal/mol angle strain even though 2°→2°.',
    fromGroup: 'Unstable Carbocation',
    toGroup: 'Stable Carbocation',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Formation of Less Stable 2° Carbocation',
        description: 'Loss of leaving group or protonation of alkene generates a 2° carbocation adjacent to a branched carbon.',
        leftSpecies: '(CH3)3C–CH⁺–CH3',
        leftCharge: '2° Carbocation (6e⁻)',
        centerAction: 'Empty 2p orbital',
        rightSpecies: 'Adjacent –CH3 / –H',
        rightCharge: 'σ C–C / C–H donor',
        intermediate: 'Vacant p-orbital overlaps with adjacent σ-bond (hyperconjugation)',
        arrows: [{ type: 'full', from: 'right', to: 'left', label: 'σ → p overlap' }]
      },
      {
        stepTitle: 'Step 2: 1,2-Methyl (or Hydride) Shift',
        description: 'The adjacent substituent migrates WITH its bonding electron pair to the positively charged carbon.',
        leftSpecies: '(CH3)2C⁺–CH(CH3)2',
        leftCharge: '3° Carbocation',
        centerAction: '1,2-CH3⁻ shift',
        rightSpecies: '7 α-H Hyperconjugation',
        rightCharge: 'Thermodynamic sink',
        transitionState: '3-center 2-electron bridged TS',
        intermediate: 'Stabilized 3° Carbocation ready for Nu⁻ attack or β-H loss',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: '1,2-shift' }]
      }
    ]
  },
  {
    id: 'c11-tautomerism',
    chapter: 'c11-goc',
    title: 'Keto–Enol Tautomerism (Acid & Base Catalyzed)',
    namedReaction: 'Prototropic Tautomerism',
    category: 'Rearrangement / Condensation',
    mechanismType: 'Intramolecular Proton Migration (via Enol / Enolate)',
    reactants: 'Carbonyl compound with ≥1 α-Hydrogen',
    reagents: 'Trace H3O⁺ or OH⁻',
    conditions: 'Dynamic equilibrium',
    products: 'Enol form (–C=C–OH)',
    rds: 'Enol content increases with H-bonding (acetylacetone ~76%) and aromaticity (phenol ~100%)',
    stereochemistry: 'Loss of chirality at α-carbon (sp³ → sp² → racemization)',
    rearrangementAlert: 'Compound MUST have an sp³ α-CH (bridgehead α-H fails Bredt’s rule!).',
    ncertExceptions: 'Phenol exists ~100% in enol form due to aromatic stabilization; 1,3-dicarbonyls favor enol via intramolecular 6-membered H-bonding.',
    fromGroup: 'Ketone / Aldehyde',
    toGroup: 'Enol',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Base-Catalyzed Deprotonation at α-Carbon',
        description: 'OH⁻ abstracts the acidic α-H to form a resonance-stabilized enolate carbanion.',
        leftSpecies: 'HO⁻',
        leftCharge: 'Base (δ⁻)',
        centerAction: 'Removes α-H⁺',
        rightSpecies: 'H–CH2–C(=O)–R',
        rightCharge: 'α-H (pKa ~19)',
        intermediate: '[CH2=C(O⁻)–R ↔ ⁻CH2–C(=O)–R] Enolate',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'α-H abstraction' }]
      },
      {
        stepTitle: 'Protonation at Oxygen → Enol',
        description: 'Water protonates the negatively charged oxygen of the enolate to give the enol tautomer.',
        leftSpecies: 'CH2=C(O⁻)–R',
        leftCharge: 'Oxyanion',
        centerAction: 'H–OH',
        rightSpecies: 'CH2=C(OH)–R',
        rightCharge: 'Enol form',
        intermediate: 'Conjugated or H-bonded enols dominate equilibrium',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'O-protonation' }]
      }
    ]
  },
  {
    id: 'c11-lassaigne',
    chapter: 'c11-goc',
    title: "Lassaigne's Test (Detection of N, S, Halogens)",
    namedReaction: "Lassaigne's Sodium Fusion",
    category: 'Qualitative Test / Analysis',
    mechanismType: 'Ionic Fusion & Coordination Complexation',
    reactants: 'Organic Compound (C, H, N, S, X) + Na metal',
    reagents: 'Fuse red hot → Extract in H2O → FeSO4 / FeCl3 (for N) or Na-nitroprusside (for S)',
    conditions: 'Red hot fusion, then aqueous test',
    products: 'Prussian Blue Fe4[Fe(CN)6]3 (N) | Violet [Fe(CN)5NOS]⁴⁻ (S) | Blood Red [Fe(SCN)]²⁺ (N+S)',
    rds: 'Converts covalent organic N, S, X into water-soluble ionic NaCN, Na2S, NaX',
    stereochemistry: 'N/A',
    rearrangementAlert: 'With excess Na, NaSCN breaks into NaCN + Na2S! Boil extract with conc. HNO3 before AgNO3 halogen test to expel HCN & H2S.',
    ncertExceptions: 'Hydrazine (NH2–NH2) contains N but NO carbon, so it fails Lassaigne’s test (cannot form NaCN)! Diazo salts lose N2 gas before fusing.',
    fromGroup: 'Organic N/S/X',
    toGroup: 'Colored Complex / AgX↓',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Sodium Fusion Extract (SFE)',
        description: 'Metallic sodium reduces covalent heteroatoms into ionic salts.',
        leftSpecies: 'Na + C + N + S + X',
        leftCharge: 'Red hot fusion',
        centerAction: 'e⁻ transfer',
        rightSpecies: 'NaCN, Na2S, NaX, NaSCN',
        rightCharge: 'Ionic SFE',
        intermediate: 'Boiled in distilled water and filtered',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Mineralization' }]
      },
      {
        stepTitle: 'Step 2: Complex Formation (Prussian Blue / Blood Red)',
        description: 'CN⁻ forms ferrocyanide with Fe²⁺ then Prussian Blue with Fe³⁺; SCN⁻ gives blood-red [Fe(SCN)]²⁺.',
        leftSpecies: '6CN⁻ + Fe²⁺ → [Fe(CN)6]⁴⁻',
        leftCharge: 'Ligand coordination',
        centerAction: '+ Fe³⁺ / H⁺',
        rightSpecies: 'Fe4[Fe(CN)6]3 (Prussian Blue)',
        rightCharge: 'Intense Blue',
        intermediate: 'Sulfur + Nitroprusside [Fe(CN)5NO]²⁻ → Violet [Fe(CN)5NOS]⁴⁻',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Fe³⁺ capture' }]
      }
    ]
  },
  {
    id: 'c11-kjeldahl',
    chapter: 'c11-goc',
    title: "Kjeldahl's Method for Nitrogen Estimation",
    namedReaction: "Kjeldahl's Estimation",
    category: 'Qualitative Test / Analysis',
    mechanismType: 'Acid Digestion & Back-Titration',
    reactants: 'Organic Nitrogen Compound',
    reagents: 'Conc. H2SO4 (+ CuSO4/K2SO4) → Excess NaOH → Standard H2SO4',
    conditions: 'Heat digestion',
    products: '(NH4)2SO4 → NH3 gas → %N = (1.4 × M × 2 × V) / m',
    rds: 'Conversion of organic N quantitatively into ammonium sulfate',
    stereochemistry: 'N/A',
    rearrangementAlert: 'NEVER applicable to Nitro compounds (–NO2), Azo compounds (–N=N–), or Nitrogen inside a ring (Pyridine, Quinoline)!',
    ncertExceptions: 'NCERT favorite MCQ: Which compound cannot be estimated by Kjeldahl’s method? Answer: Nitrobenzene, Azobenzene, Pyridine. Use Dumas method instead (gives N2 gas for all!).',
    fromGroup: 'Organic Amine/Amide',
    toGroup: 'NH3 / %N',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Digestion & Ammonia Liberation',
        description: 'Conc. H2SO4 oxidizes C/H to CO2/H2O and converts N to (NH4)2SO4, which is then basified.',
        leftSpecies: 'Org-N + Conc. H2SO4',
        leftCharge: 'Digestion',
        centerAction: 'NaOH(aq), Δ',
        rightSpecies: 'NH3↑ + Na2SO4',
        rightCharge: 'Trapped in std H2SO4',
        intermediate: 'Back-titrate unreacted acid with standard NaOH',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'NH3 liberation' }]
      }
    ]
  },

  // ==================== CH 13: ALKANES ====================
  {
    id: 'c11-wurtz',
    chapter: 'c11-alkanes',
    title: 'Wurtz Reaction (Coupling of Alkyl Halides)',
    namedReaction: 'Wurtz Reaction',
    category: 'Named Reaction',
    mechanismType: 'Free Radical / Carbanion Coupling',
    reactants: '2 R–X (1° or 2° Alkyl Halide)',
    reagents: '2 Na / Dry Ether',
    conditions: 'Anhydrous dry ether (moisture destroys Na/RNa)',
    products: 'R–R (Symmetrical Alkane with even carbons) + 2 NaX',
    rds: 'Single-electron transfer from Na to R–X forming R• / R⁻Na⁺',
    stereochemistry: 'Loss of stereochemistry via radical / disproportionate minor alkene',
    rearrangementAlert: '3° Alkyl Halides (like t-BuBr) fail Wurtz coupling and instead undergo E2 elimination to give Isobutene + Isobutane!',
    ncertExceptions: 'Cannot prepare Methane (CH4). Unsymmetrical R–X + R’–X yields a 3-alkane mixture (R–R, R’–R’, R–R’) hard to separate. Use Corey-House (R2CuLi + R’X) for odd-carbon alkanes.',
    fromGroup: 'Haloalkane',
    toGroup: 'Alkane',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Electron Transfer & Radical Formation',
        description: 'Sodium donates an electron to the C–X σ* orbital, cleaving X⁻ and generating an alkyl radical.',
        leftSpecies: 'R–X + Na•',
        leftCharge: '1e⁻ donor',
        centerAction: 'SET',
        rightSpecies: 'R• + Na⁺X⁻',
        rightCharge: 'Alkyl Radical',
        intermediate: 'Or second e⁻ forms R⁻Na⁺ (organosodium)',
        arrows: [{ type: 'fishhook', from: 'left', to: 'right', label: '1e⁻ transfer' }]
      },
      {
        stepTitle: 'Step 2: Radical Coupling (or SN2 by R⁻Na⁺)',
        description: 'Two alkyl radicals dimerize (or R⁻ attacks R–X via SN2) to form the symmetrical alkane R–R.',
        leftSpecies: 'R• + •R (or R⁻Na⁺)',
        leftCharge: 'Nucleophile / Radical',
        centerAction: 'Dry Ether',
        rightSpecies: 'R–R + 2NaX',
        rightCharge: 'Symmetrical Alkane',
        intermediate: '3° R–X undergoes disproportionation (alkene + alkane)',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'C–C coupling' }]
      }
    ]
  },
  {
    id: 'c11-kolbe-electrolysis',
    chapter: 'c11-alkanes',
    title: "Kolbe's Electrolytic Decarboxylation",
    namedReaction: "Kolbe's Electrolysis",
    category: 'Named Reaction',
    mechanismType: 'Free Radical Decarboxylation at Anode',
    reactants: '2 R–COO⁻ Na⁺ / K⁺ (aq)',
    reagents: 'Electrolysis (Pt electrodes)',
    conditions: 'Aqueous solution',
    products: 'R–R + 2CO2↑ (at Anode) + H2↑ + 2NaOH (at Cathode)',
    rds: 'Loss of CO2 from carboxylate radical RCOO• → R•',
    stereochemistry: 'Racemization if α-carbon is chiral',
    rearrangementAlert: 'pH of the solution INCREASES during electrolysis because NaOH accumulates at the cathode!',
    ncertExceptions: 'Cannot prepare Methane (CH4) cleanly. With Sodium Succinate → Ethene; with Sodium Maleate/Fumarate → Ethyne!',
    fromGroup: 'Carboxylic Acid Salt',
    toGroup: 'Alkane',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Anode: Oxidation & Decarboxylation',
        description: 'Carboxylate loses 1 electron at the anode, immediately losing stable CO2 gas to yield R•.',
        leftSpecies: '2 R–COO⁻',
        leftCharge: 'Anode (−2e⁻)',
        centerAction: '− 2CO2↑',
        rightSpecies: '2 R• → R–R',
        rightCharge: 'Coupled Alkane',
        intermediate: 'CO2 + R–R evolve at Anode',
        arrows: [{ type: 'fishhook', from: 'left', to: 'right', label: 'Oxidation + coupling' }]
      },
      {
        stepTitle: 'Cathode: Water Reduction',
        description: 'Water is reduced preferentially over Na⁺ to release H2 gas and OH⁻.',
        leftSpecies: '2H2O + 2e⁻',
        leftCharge: 'Cathode',
        centerAction: 'Reduction',
        rightSpecies: 'H2↑ + 2OH⁻',
        rightCharge: 'pH > 7',
        intermediate: 'H2 evolves at Cathode; solution turns alkaline',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'H2 liberation' }]
      }
    ]
  },
  {
    id: 'c11-sodalime-decarb',
    chapter: 'c11-alkanes',
    title: 'Soda-Lime Decarboxylation',
    namedReaction: 'Decarboxylation',
    category: 'Named Reaction',
    mechanismType: 'Carbanion Intermediate (Step-down by 1 Carbon)',
    reactants: 'R–COONa',
    reagents: 'NaOH + CaO (3:1 Soda-lime)',
    conditions: 'Heat (Δ)',
    products: 'R–H (1 Carbon fewer) + Na2CO3',
    rds: 'C–C bond cleavage generating Carbanion R⁻ (Rate ∝ Stability of R⁻)',
    stereochemistry: 'Protonation gives alkane',
    rearrangementAlert: 'CaO keeps NaOH dry and prevents glass etching. Rate is fastest for β-keto acids (even on mild heating without soda-lime!) and –NO2/–CF3 substituted acetates.',
    ncertExceptions: 'Unlike Wurtz and Kolbe, Soda-lime decarboxylation CAN produce Methane (from Sodium Acetate)!',
    fromGroup: 'Carboxylic Acid Salt',
    toGroup: 'Alkane',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1 (RDS): Carbanion Generation',
        description: 'C–C cleavage releases CO3²⁻ and forms carbanion R⁻; more stable R⁻ = faster reaction.',
        leftSpecies: 'R–C(=O)O⁻ + NaOH',
        leftCharge: 'Carboxylate',
        centerAction: 'CaO, Δ (RDS)',
        rightSpecies: 'R⁻ + Na2CO3',
        rightCharge: 'Carbanion R⁻',
        intermediate: 'Rate: CCl3COO⁻ > CH3COO⁻; 1° > 2° > 3°',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'C–C cleavage' }]
      },
      {
        stepTitle: 'Step 2: Fast Proton Capture',
        description: 'The strongly basic carbanion immediately abstracts H⁺ from H2O/NaOH.',
        leftSpecies: 'R⁻',
        leftCharge: 'Strong Base',
        centerAction: '+ H2O',
        rightSpecies: 'R–H + OH⁻',
        rightCharge: 'Alkane (−1 C)',
        intermediate: 'Step-down alkane with 1 fewer carbon',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Protonation' }]
      }
    ]
  },
  {
    id: 'c11-alkane-halogenation',
    chapter: 'c11-alkanes',
    title: 'Free-Radical Halogenation of Alkanes',
    namedReaction: 'Free Radical Substitution',
    category: 'Free Radical',
    mechanismType: 'Chain Initiation, Propagation, Termination',
    reactants: 'R–H (Alkane)',
    reagents: 'Cl2 or Br2',
    conditions: 'hν (UV light) or 573–773 K',
    products: 'R–Cl / R–Br + HX',
    rds: 'Hydrogen abstraction by X• (Reactivity: F2 > Cl2 > Br2 > I2; Ease of H abstraction: 3° > 2° > 1° > CH4)',
    stereochemistry: 'Racemization at chiral carbon (planar radical intermediate)',
    rearrangementAlert: 'Br2 is ~1600× more selective for 3° H than Cl2 (relative Cl2 selectivity 3°:2°:1° ≈ 5 : 3.8 : 1).',
    ncertExceptions: 'Iodination is reversible and endothermic; requires oxidizing agent like HIO3 or HNO3 to consume HI! Fluorination is explosive.',
    fromGroup: 'Alkane',
    toGroup: 'Haloalkane',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Initiation: Homolytic Cleavage',
        description: 'UV light splits weak Cl–Cl or Br–Br bond symmetrically into two halogen radicals.',
        leftSpecies: 'Cl–Cl',
        leftCharge: '58 kcal/mol',
        centerAction: 'hν',
        rightSpecies: '2 Cl•',
        rightCharge: '7 valence e⁻',
        intermediate: 'Chain initiator radicals',
        arrows: [{ type: 'fishhook', from: 'left', to: 'right', label: 'Homolysis' }]
      },
      {
        stepTitle: 'Propagation: H-Abstraction (RDS) & Capture',
        description: 'Cl• abstracts the weakest C–H (3° > 2° > 1°) to form planar R•, which then reacts with Cl2.',
        leftSpecies: 'R–H + Cl•',
        leftCharge: 'Planar R•',
        centerAction: '−HCl / +Cl2',
        rightSpecies: 'R–Cl + Cl•',
        rightCharge: 'Racemic product',
        intermediate: 'Chain continues until termination',
        arrows: [{ type: 'fishhook', from: 'left', to: 'right', label: 'Chain propagation' }]
      }
    ]
  },
  {
    id: 'c11-alkane-oxidation-aromatization',
    chapter: 'c11-alkanes',
    title: 'Controlled Oxidation & Aromatization of Alkanes',
    namedReaction: 'Catalytic Oxidation / Aromatization',
    category: 'Oxidation',
    mechanismType: 'Catalytic Surface Redox / Dehydrocyclization',
    reactants: 'CH4 (or n-Hexane / Isobutane)',
    reagents: 'Cu/523K/100atm (→MeOH) | Mo2O3 (→HCHO) | KMnO4 (3°H→3°OH) | Cr2O3/V2O5/Mo2O3 on Al2O3, 773K',
    conditions: 'High T / Catalyst',
    products: 'CH3OH / HCHO / 3°-Alcohol / Benzene (from n-Hexane) or Toluene (from n-Heptane)',
    rds: 'Catalytic C–H activation; KMnO4 oxidizes ONLY alkanes having 3° H atom!',
    stereochemistry: 'Retention for KMnO4 oxidation of 3° C–H',
    rearrangementAlert: 'Know all 4 NCERT controlled oxidations of CH4 + KMnO4 on 3° alkane!',
    ncertExceptions: 'Alkanes generally resist KMnO4, EXCEPT 2-methylpropane (3° H) → 2-methylpropan-2-ol! n-Hexane + Cr2O3/Al2O3 at 773 K, 10–20 atm → Benzene.',
    fromGroup: 'Alkane',
    toGroup: 'Alcohol / Aldehyde / Arene',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Catalytic Selectivity Map',
        description: 'Different catalysts stop methane oxidation at alcohol, aldehyde, or acid stages; Cr2O3/Al2O3 aromatizes C6+ alkanes.',
        leftSpecies: 'CH4 + O2 / n-Hexane',
        leftCharge: 'Alkane',
        centerAction: 'Cu | Mo2O3 | Cr2O3',
        rightSpecies: 'CH3OH | HCHO | C6H6',
        rightCharge: 'Controlled Product',
        intermediate: 'Alkanes with 3° H + KMnO4 → 3° Alcohol',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Catalytic control' }]
      }
    ]
  },

  // ==================== CH 13: ALKENES ====================
  {
    id: 'c11-alkene-dehydration',
    chapter: 'c11-alkenes',
    title: 'Acid-Catalyzed Dehydration of Alcohols',
    namedReaction: 'E1 Dehydration',
    category: 'Elimination (E1/E2)',
    mechanismType: 'E1 (via Carbocation + Rearrangement)',
    reactants: 'Alcohol (R–CH2–CH(OH)–R’)',
    reagents: 'Conc. H2SO4 (443 K) or H3PO4 or Al2O3 (623 K)',
    conditions: 'Heat (443 K for 1°; 373 K for 2°; 358 K for 3°)',
    products: 'More substituted Alkene (Zaitsev Major) + H2O',
    rds: 'Loss of H2O from protonated alcohol R–OH2⁺ → Carbocation (Rate: 3° > 2° > 1°)',
    stereochemistry: 'Trans-alkene favored over cis-alkene',
    rearrangementAlert: 'CARBOCATION REARRANGEMENT ALERT: 3,3-dimethylbutan-2-ol gives 2,3-dimethylbut-2-ene as major product via 1,2-methyl shift!',
    ncertExceptions: 'Watch temperature for Ethanol + H2SO4: 443 K gives Ethene (E1), whereas 413 K gives Diethyl Ether (SN2)!',
    fromGroup: 'Alcohol',
    toGroup: 'Alkene',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Rapid Protonation of –OH',
        description: 'Poor leaving group –OH⁻ is converted into excellent leaving group –OH2⁺.',
        leftSpecies: 'R–CH2–CH(OH)–R’',
        leftCharge: 'Poor LG (–OH)',
        centerAction: '+ H⁺',
        rightSpecies: 'R–CH2–CH(OH2⁺)–R’',
        rightCharge: 'Good LG (H2O)',
        intermediate: 'Oxonium ion',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'O protonation' }]
      },
      {
        stepTitle: 'Step 2 (RDS): Loss of Water → Carbocation (+ Shift)',
        description: 'H2O departs forming a carbocation, which rearranges via 1,2-H⁻/CH3⁻ shift or ring expansion if possible.',
        leftSpecies: 'R–CH2–CH(OH2⁺)–R’',
        leftCharge: 'C–O cleavage',
        centerAction: '− H2O (RDS)',
        rightSpecies: 'Most Stable Carbocation',
        rightCharge: 'Rearranged C⁺',
        transitionState: 'C–O breaking TS',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'H2O leaves' }]
      },
      {
        stepTitle: 'Step 3: Deprotonation → Zaitsev Alkene',
        description: 'HSO4⁻ or H2O removes β-H to give the most substituted (most stable) alkene.',
        leftSpecies: 'R–CH(H)–C⁺H–R’',
        leftCharge: 'Carbocation',
        centerAction: '− H⁺',
        rightSpecies: 'R–CH=CH–R’',
        rightCharge: 'Zaitsev Alkene',
        intermediate: 'More α-H = lower ΔH_hydrogenation = major product',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'β-H loss' }]
      }
    ]
  },
  {
    id: 'c11-dehydrohalogenation-e2',
    chapter: 'c11-alkenes',
    title: 'Dehydrohalogenation of Alkyl Halides (Zaitsev vs Hofmann)',
    namedReaction: 'β-Elimination (E2)',
    category: 'Elimination (E1/E2)',
    mechanismType: 'Concerted Anti-Periplanar E2',
    reactants: 'Alkyl Halide (R–CH2–CH(X)–R’)',
    reagents: 'alc. KOH / Δ (Zaitsev) vs t-BuO⁻K⁺ / Δ (Hofmann)',
    conditions: 'Alcoholic base, Heat',
    products: 'Alkene (More substituted with alc. KOH; Less substituted with bulky base or R–F)',
    rds: 'Single concerted bimolecular transition state: Rate = k[R–X][Base]',
    stereochemistry: 'Strictly Anti-periplanar (H and X at 180° dihedral angle)',
    rearrangementAlert: 'NO carbocation formed → NO carbocation rearrangement in E2!',
    ncertExceptions: 'Leaving group reactivity: R–I > R–Br > R–Cl > R–F. However, R–F (poor LG) and quaternary ammonium salts (R–NR3⁺) yield HOFMANN (less substituted) alkene due to carbanion-like TS!',
    fromGroup: 'Haloalkane',
    toGroup: 'Alkene',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Concerted Anti-Periplanar E2 Transition State',
        description: 'Base abstracts β-H (180° anti to X) simultaneously as C=C π-bond forms and X⁻ departs.',
        leftSpecies: 'HO⁻ / t-BuO⁻',
        leftCharge: 'Base (δ⁻)',
        centerAction: 'Concerted TS‡',
        rightSpecies: 'Alkene + X⁻ + ROH',
        rightCharge: 'Rate ∝ [R–X][B⁻]',
        transitionState: '[HO---H---C=C---X]‡',
        intermediate: 'Unhindered base → Zaitsev; Bulky t-BuO⁻ → Hofmann',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Anti-periplanar elimination' }]
      }
    ]
  },
  {
    id: 'c11-markovnikov-hx',
    chapter: 'c11-alkenes',
    title: 'Electrophilic Addition of HX (Markovnikov Rule)',
    namedReaction: 'Markovnikov Addition',
    category: 'Electrophilic Addition',
    mechanismType: 'Carbocation Intermediate',
    reactants: 'Unsymmetrical Alkene (CH3–CH=CH2)',
    reagents: 'HCl, HBr, or HI (No peroxide)',
    conditions: 'Dark / Polar or inert solvent',
    products: '2-Haloalkane (X⁻ attaches to carbon with fewer H atoms / more stable C⁺)',
    rds: 'Protonation of π-bond to form the more stable carbocation',
    stereochemistry: 'Non-stereoselective (syn + anti mixture via planar carbocation)',
    rearrangementAlert: 'Carbocation rearrangement occurs! E.g. 3-methylbut-1-ene + HCl gives 2-chloro-2-methylbutane (Major), NOT 2-chloro-3-methylbutane.',
    ncertExceptions: 'With CF3–CH=CH2 + HBr: –CF3 strongly destabilizes adjacent C⁺ via –I, so Br⁻ goes to terminal CH2 (apparent Anti-Markovnikov even without peroxide!).',
    fromGroup: 'Alkene',
    toGroup: 'Haloalkane',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1 (RDS): π-Bond Protonation → Stable Carbocation',
        description: 'Electrophilic H⁺ adds to the alkene carbon that yields the more stable carbocation (3° > 2° > 1°).',
        leftSpecies: 'R–CH=CH2',
        leftCharge: 'π-Nucleophile',
        centerAction: '+ H–X (RDS)',
        rightSpecies: 'R–CH⁺–CH3 + X⁻',
        rightCharge: '2° Carbocation',
        intermediate: 'Check for 1,2-H⁻/Me⁻ shift or ring expansion!',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'π → H⁺' }]
      },
      {
        stepTitle: 'Step 2: Halide Capture',
        description: 'Nucleophile X⁻ attacks the planar carbocation from either top or bottom face.',
        leftSpecies: 'X⁻',
        leftCharge: 'Nucleophile',
        centerAction: 'Fast attack',
        rightSpecies: 'R–CH(X)–CH3',
        rightCharge: 'Markovnikov Product',
        intermediate: 'Racemic mixture if chiral center forms',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Nu⁻ attack' }]
      }
    ]
  },
  {
    id: 'c11-kharasch-peroxide',
    chapter: 'c11-alkenes',
    title: 'Anti-Markovnikov Addition (Kharasch Peroxide Effect)',
    namedReaction: 'Peroxide / Kharasch Effect',
    category: 'Free Radical',
    mechanismType: 'Free Radical Chain Addition',
    reactants: 'Unsymmetrical Alkene (CH3–CH=CH2)',
    reagents: 'HBr + Benzoyl Peroxide (PhCOO)2 or H2O2 / hν',
    conditions: 'Peroxide present (ONLY works with HBr!)',
    products: '1-Bromoalkane (CH3–CH2–CH2Br)',
    rds: 'Addition of Br• to less substituted alkene carbon to give the more stable 2° carbon radical',
    stereochemistry: 'Non-stereoselective free radical addition',
    rearrangementAlert: 'NO carbocation formed → NO rearrangement!',
    ncertExceptions: 'CLASSIC NEET FAVORITE: Peroxide effect works ONLY with HBr! HCl fails (C–Cl formation is exothermic, H-abstraction from HCl is endothermic) and HI fails (I• addition to alkene is endothermic, I• dimerizes to I2).',
    fromGroup: 'Alkene',
    toGroup: 'Haloalkane',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Initiation: Peroxide → Ph• → Br•',
        description: 'Homolysis of O–O bond generates PhCOO•/Ph• which abstracts H from HBr to release Br•.',
        leftSpecies: '(PhCOO)2 + HBr',
        leftCharge: 'Peroxide O–O weak',
        centerAction: 'Δ / hν',
        rightSpecies: 'Br• + PhCOOH',
        rightCharge: 'Chain-carrying Br•',
        arrows: [{ type: 'fishhook', from: 'left', to: 'right', label: 'H-abstraction' }]
      },
      {
        stepTitle: 'Propagation: Br• Adds to Less Hindered Carbon',
        description: 'Br• attacks terminal CH2 to form the more stable 2° free radical (3° > 2° > 1°), then abstracts H from HBr.',
        leftSpecies: 'R–CH=CH2 + Br•',
        leftCharge: 'Free Radical',
        centerAction: '→ R–CH•–CH2Br',
        rightSpecies: 'R–CH2–CH2Br + Br•',
        rightCharge: 'Anti-Markovnikov',
        intermediate: 'Both propagation steps are exothermic ONLY for HBr',
        arrows: [{ type: 'fishhook', from: 'left', to: 'right', label: '2° Radical route' }]
      }
    ]
  },
  {
    id: 'c11-oxymercuration-vs-hbo',
    chapter: 'c11-alkenes',
    title: 'Oxymercuration–Demercuration vs Hydroboration–Oxidation',
    namedReaction: 'OMDM vs HBO',
    category: 'Electrophilic Addition',
    mechanismType: 'Bridged Mercurinium Ion (OMDM) vs Concerted 4-Membered TS (HBO)',
    reactants: 'Unsymmetrical Alkene (R–CH=CH2)',
    reagents: 'OMDM: 1) Hg(OAc)2/H2O 2) NaBH4 | HBO: 1) B2H6/THF 2) H2O2/OH⁻',
    conditions: 'Room temp / THF',
    products: 'OMDM: Markovnikov Alcohol (NO rearrangement) | HBO: Anti-Markovnikov Alcohol (Syn, NO rearrangement)',
    rds: 'Neither pathway forms a free carbocation — ZERO carbocation rearrangement!',
    stereochemistry: 'OMDM: Anti addition (overall) | HBO: Strictly Syn addition of H and OH',
    rearrangementAlert: 'Compare 3 pathways for Alkene → Alcohol: (1) H3O⁺ = Markovnikov WITH rearrangement; (2) OMDM = Markovnikov NO rearrangement; (3) HBO = Anti-Markovnikov Syn NO rearrangement.',
    ncertExceptions: 'In HBO, Boron adds to the less sterically hindered carbon and H transfers simultaneously from BH3/B2H6; H2O2/OH⁻ replaces B with OH with complete retention of configuration.',
    fromGroup: 'Alkene',
    toGroup: 'Alcohol',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'OMDM: Cyclic Mercurinium Ion + Anti H2O Attack',
        description: 'Hg(OAc)⁺ forms a 3-membered bridged ion; H2O attacks the more δ⁺ substituted carbon without rearrangement; NaBH4 replaces HgOAc with H.',
        leftSpecies: 'R–CH=CH2 + Hg(OAc)2',
        leftCharge: 'Bridged Hg⁺ ion',
        centerAction: 'H2O then NaBH4',
        rightSpecies: 'R–CH(OH)–CH3',
        rightCharge: 'Markovnikov (No shift)',
        intermediate: 'No free C⁺ → Zero rearrangement',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Markovnikov + No shift' }]
      },
      {
        stepTitle: 'HBO: Concerted 4-Center Syn Addition',
        description: 'BH3 adds H and B syn across the double bond in one concerted step (B on less hindered carbon), then H2O2/OH⁻ oxidizes C–B to C–OH.',
        leftSpecies: 'R–CH=CH2 + BH3',
        leftCharge: '4-center cyclic TS',
        centerAction: 'H2O2 / OH⁻',
        rightSpecies: 'R–CH2–CH2OH',
        rightCharge: 'Syn Anti-Markovnikov',
        transitionState: '4-membered [C–B / C–H]‡',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Syn Anti-Markovnikov' }]
      }
    ]
  },
  {
    id: 'c11-ozonolysis',
    chapter: 'c11-alkenes',
    title: 'Reductive vs Oxidative Ozonolysis of Alkenes',
    namedReaction: 'Ozonolysis',
    category: 'Oxidation',
    mechanismType: '1,3-Dipolar Cycloaddition → Molozonide → Ozonide',
    reactants: 'Alkene (R1R2C=CR3R4)',
    reagents: '1) O3 / CH2Cl2 (195 K)  2) Zn/H2O or Me2S (Reductive) vs H2O2 (Oxidative)',
    conditions: 'Low temp ozonide cleavage',
    products: 'Reductive: Aldehydes / Ketones | Oxidative: Carboxylic Acids (from =CH–) / Ketones / CO2 (from =CH2)',
    rds: 'Cleavage of C=C double bond completely',
    stereochemistry: 'Double bond broken',
    rearrangementAlert: 'Shortcut: Cut C=C in half and cap each carbon with =O! For Oxidative workup, oxidize any =CH–R further to –COOH and =CH2 to CO2.',
    ncertExceptions: 'Useful to locate double bond position. Propene gives Ethanal + Methanal (reductive) or Acetic acid + CO2 + H2O (oxidative). Benzene gives 3 moles of Glyoxal (CHO–CHO).',
    fromGroup: 'Alkene',
    toGroup: 'Aldehyde / Ketone / Acid',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Molozonide → Ozonide Formation',
        description: 'O3 adds across C=C to form unstable molozonide which rearranges to a cyclic 1,2,4-trioxolane (ozonide).',
        leftSpecies: 'R2C=CHR’ + O3',
        leftCharge: '1,3-Dipole',
        centerAction: '195 K',
        rightSpecies: 'Cyclic Ozonide',
        rightCharge: 'Peroxide bridge',
        intermediate: 'Isolated intermediate cleaved in step 2',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Cycloaddition' }]
      },
      {
        stepTitle: 'Step 2: Reductive (Zn/H2O) vs Oxidative (H2O2) Cleavage',
        description: 'Zn/H2O traps H2O2 byproduct as Zn(OH)2 preserving aldehydes; H2O2 oxidizes aldehydes to carboxylic acids.',
        leftSpecies: 'Ozonide',
        leftCharge: 'Reductive: Zn/H2O',
        centerAction: 'C=O + O=C',
        rightSpecies: 'R2C=O + O=CHR’ (or R’COOH)',
        rightCharge: 'Carbonyls / Acids',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'O–O cleavage' }]
      }
    ]
  },
  {
    id: 'c11-baeyer-br2',
    chapter: 'c11-alkenes',
    title: "Bromination (Br2/CCl4) vs Baeyer's Reagent (Cold dil. KMnO4)",
    namedReaction: "Unsaturation Tests (Baeyer's & Br2)",
    category: 'Qualitative Test / Analysis',
    mechanismType: 'Anti Bromonium Ion vs Syn Cyclic Manganate Ester',
    reactants: 'Alkene',
    reagents: 'Br2/CCl4 (Reddish-brown → Colorless) | Cold dil. alk. KMnO4 (Pink → Brown MnO2↓)',
    conditions: '273–298 K',
    products: 'vic-Dibromide (Anti) | vic-Diol (Syn)',
    rds: 'Both are standard NCERT tests for unsaturation (C=C / C≡C)',
    stereochemistry: 'cis-2-butene + Br2/CCl4 → Racemic (±) 2,3-dibromobutane (CAR = Anti); cis-2-butene + Baeyer’s → Meso-2,3-butanediol (CSA = Syn)!',
    rearrangementAlert: 'Remember the stereochemistry mnemonics: CAR (Cis + Anti → Racemic) and TAM (Trans + Anti → Meso); CSM (Cis + Syn → Meso) and TSR (Trans + Syn → Racemic)!',
    ncertExceptions: 'Hot acidic KMnO4 / K2Cr2O7 oxidatively cleaves alkenes into ketones, carboxylic acids, or CO2 (from =CH2).',
    fromGroup: 'Alkene',
    toGroup: 'vic-Dihalide / Diol',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Br2/CCl4: Cyclic Bromonium Ion → Anti Attack',
        description: 'Br2 forms a bridged bromonium ion; second Br⁻ attacks exclusively from the opposite (anti) face.',
        leftSpecies: 'Alkene + Br2/CCl4',
        leftCharge: 'Cyclic Br⁺ bridge',
        centerAction: 'Anti Br⁻ attack',
        rightSpecies: 'trans/anti-vic-Dibromide',
        rightCharge: 'Decolorizes Br2',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Anti addition' }]
      },
      {
        stepTitle: "Baeyer's Test: Syn Cyclic Manganate Ester",
        description: 'Permanganate adds syn across C=C forming a cyclic ester, hydrolyzed to a syn vic-diol + MnO2.',
        leftSpecies: 'Alkene + Cold KMnO4/OH⁻',
        leftCharge: 'Purple MnO4⁻',
        centerAction: 'Syn cycloaddition',
        rightSpecies: 'Syn-1,2-Diol + MnO2↓',
        rightCharge: 'Pink decolorized',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Syn dihydroxylation' }]
      }
    ]
  },

  // ==================== CH 13: ALKYNES ====================
  {
    id: 'c11-alkyne-prep-acidic',
    chapter: 'c11-alkynes',
    title: 'Alkyne Preparation (vic-Dihalide + NaNH2) & Terminal Acidic Tests',
    namedReaction: 'Double Dehydrohalogenation & Acetylide Tests',
    category: 'Elimination (E1/E2)',
    mechanismType: 'Stepwise E2 + Acid-Base Deprotonation (sp C–H pKa ~25)',
    reactants: 'vic-Dihalide (or Terminal Alkyne R–C≡C–H)',
    reagents: '1) alc. KOH, Δ  2) NaNH2 (liq. NH3) | Tests: Ammoniacal AgNO3 / Cu2Cl2',
    conditions: 'Strong amide base needed for 2nd vinylic HBr elimination',
    products: 'Alkyne | White Ag-acetylide↓ / Red Cu-acetylide↓',
    rds: '2nd elimination from vinyl bromide requires NaNH2 because alc. KOH is too weak',
    stereochemistry: 'Linear sp carbons (180°)',
    rearrangementAlert: 'NaNH2 isomerizes internal alkynes to terminal alkynes at elevated temps (forms insoluble Na-acetylide salt)!',
    ncertExceptions: 'Only TERMINAL alkynes (–C≡C–H) give White ppt with Tollens’ (ammoniacal AgNO3) and Red ppt with ammoniacal Cu2Cl2; 2-butyne gives NO ppt!',
    fromGroup: 'vic-Dihalide',
    toGroup: 'Alkyne',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Step 1 & 2: Sequential E2 Eliminations',
        description: 'alc. KOH removes first HX to give vinyl halide; stronger NaNH2 removes second HX to yield alkyne.',
        leftSpecies: 'R–CH(Br)–CH2Br',
        leftCharge: 'vic-Dibromide',
        centerAction: 'alc. KOH → NaNH2',
        rightSpecies: 'R–C≡C–H',
        rightCharge: 'Terminal Alkyne',
        intermediate: 'Vinyl bromide intermediate requires NaNH2',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Double E2' }]
      }
    ]
  },
  {
    id: 'c11-lindlar-vs-birch',
    chapter: 'c11-alkynes',
    title: "Lindlar's Catalyst (cis-Alkene) vs Birch Reduction (trans-Alkene)",
    namedReaction: 'Lindlar vs Birch Reduction',
    category: 'Reduction',
    mechanismType: 'Syn Surface Hydrogenation vs Anti Radical-Anion Reduction',
    reactants: 'Internal Alkyne (R–C≡C–R’)',
    reagents: 'H2 / Pd-CaCO3 + Quinoline/S (Lindlar) vs Na / liq. NH3 (Birch)',
    conditions: '1 atm / 195–240 K',
    products: 'cis-Alkene (Lindlar) vs trans-Alkene (Na/liq. NH3)',
    rds: 'Quinoline poisons Pd so reduction stops at cis-alkene; Birch uses trans-vinyl radical equilibrium',
    stereochemistry: 'Stereospecific: Lindlar = 100% Syn (cis); Na/liq. NH3 = 100% Anti (trans)',
    rearrangementAlert: 'On a TERMINAL alkyne (R–C≡CH), Na/liq. NH3 does NOT reduce it — it forms Sodium Acetylide (R–C≡C⁻Na⁺ + ½H2↑)!',
    ncertExceptions: 'Classic NEET trap: Terminal alkyne + Na/liq. NH3 yields acetylide salt rather than alkene; use Lindlar’s catalyst to get terminal alkene from terminal alkyne!',
    fromGroup: 'Alkyne',
    toGroup: 'Alkene',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Lindlar Route: Syn Surface Delivery',
        description: 'Both H atoms are delivered from the poisoned Pd surface to the same face of the triple bond.',
        leftSpecies: 'R–C≡C–R’ + H2',
        leftCharge: 'Pd / BaSO4 or CaCO3',
        centerAction: '+ Quinoline (Poison)',
        rightSpecies: 'cis-R–CH=CH–R’',
        rightCharge: 'Syn Addition',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Syn H2' }]
      },
      {
        stepTitle: 'Birch Route: Anti Radical-Anion Mechanism',
        description: 'Solvated electrons reduce alkyne to a trans-vinyl radical anion minimizing R–R repulsion, protonated by NH3.',
        leftSpecies: 'R–C≡C–R’ + 2Na',
        leftCharge: 'Solvated e⁻ in NH3',
        centerAction: 'trans-vinyl anion',
        rightSpecies: 'trans-R–CH=CH–R’',
        rightCharge: 'Anti Addition',
        intermediate: 'Terminal alkyne instead loses acidic H⁺!',
        arrows: [{ type: 'fishhook', from: 'left', to: 'right', label: 'Anti e⁻/H⁺' }]
      }
    ]
  },
  {
    id: 'c11-kucherov-hydration',
    chapter: 'c11-alkynes',
    title: 'Kucherov Hydration of Alkynes & Cyclic Polymerization',
    namedReaction: "Kucherov's Reaction",
    category: 'Electrophilic Addition',
    mechanismType: 'Hg²⁺-Catalyzed Markovnikov Hydration + Keto-Enol Tautomerism',
    reactants: 'Ethyne / Propyne',
    reagents: 'Dil. H2SO4 + HgSO4 (333 K) | Polymerization: Red hot Fe tube (873 K)',
    conditions: 'Warm aqueous acid (333 K) or 873 K Fe',
    products: 'Ethyne → Ethanal (Acetaldehyde); Other Alkynes → Ketones | 3 C2H2 → Benzene',
    rds: 'Markovnikov addition of H2O gives unstable enol which tautomerizes to carbonyl',
    stereochemistry: 'Achiral carbonyl product',
    rearrangementAlert: 'Ethyne is the ONLY alkyne that produces an Aldehyde (CH3CHO); all higher terminal/internal alkynes yield KETONES!',
    ncertExceptions: '3 moles of Propyne in red hot Fe tube at 873 K polymerize symmetrically to Mesitylene (1,3,5-trimethylbenzene)!',
    fromGroup: 'Alkyne',
    toGroup: 'Aldehyde / Ketone / Arene',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Markovnikov Addition to Enol',
        description: 'Hg²⁺ activates the triple bond and H2O attacks the more substituted carbon to form vinyl alcohol (enol).',
        leftSpecies: 'R–C≡CH + H2O',
        leftCharge: 'Hg²⁺ / H⁺',
        centerAction: '333 K',
        rightSpecies: 'R–C(OH)=CH2',
        rightCharge: 'Unstable Enol',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Markovnikov OH' }]
      },
      {
        stepTitle: 'Step 2: Rapid Keto–Enol Tautomerism',
        description: 'Enol tautomerizes irreversibly to the much stronger C=O carbonyl compound.',
        leftSpecies: 'R–C(OH)=CH2',
        leftCharge: 'Enol',
        centerAction: 'Tautomerism',
        rightSpecies: 'R–C(=O)–CH3',
        rightCharge: 'Ketone (or CH3CHO if R=H)',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'H⁺ shift' }]
      }
    ]
  },

  // ==================== CH 13: AROMATIC HYDROCARBONS ====================
  {
    id: 'c11-sear-nitration-sulfonation',
    chapter: 'c11-aromatic',
    title: 'Electrophilic Aromatic Substitution: Nitration, Halogenation & Sulfonation',
    namedReaction: 'SEAr (Arenium Ion Mechanism)',
    category: 'Electrophilic Aromatic Substitution',
    mechanismType: 'Two-Step SEAr via σ-Complex (Wheland Intermediate)',
    reactants: 'Benzene (or Substituted Arene)',
    reagents: 'Nitration: Conc. HNO3+Conc. H2SO4 (323–333 K) | Halogenation: X2/Anhyd. FeX3 | Sulfonation: Fuming H2SO4 (SO3)',
    conditions: 'Lewis / Brønsted acid catalysis',
    products: 'Nitrobenzene / Halobenzene / Benzenesulfonic acid',
    rds: 'Formation of non-aromatic carbocationic σ-complex (loss of aromaticity); NO Kinetic Isotope Effect for Nitration/Halogenation!',
    stereochemistry: 'Planar sp² ring restored upon deprotonation',
    rearrangementAlert: 'Nitration electrophile = NO2⁺ (Nitronium ion; here HNO3 acts as BASE and H2SO4 as ACID!). Sulfonation electrophile = neutral SO3 and shows a strong Kinetic Isotope Effect (reversible!).',
    ncertExceptions: 'In Sulfonation, C–D bond cleaves slower than C–H because step 2 (deprotonation) is partially rate-determining; sulfonation is reversible on heating with dil. H2SO4/steam!',
    fromGroup: 'Arene',
    toGroup: 'Nitroarene / Haloarene / Sulfonic Acid',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Electrophile Generation',
        description: 'H2SO4 protonates HNO3 to form H2NO3⁺ which loses H2O to give linear sp-hybridized NO2⁺.',
        leftSpecies: 'HO–NO2 + H2SO4',
        leftCharge: 'HNO3 acts as Base',
        centerAction: '− H2O',
        rightSpecies: 'NO2⁺ + HSO4⁻',
        rightCharge: 'Electrophile (NO2⁺)',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'NO2⁺ generation' }]
      },
      {
        stepTitle: 'Step 2 (RDS): Formation of Arenium Ion (σ-Complex)',
        description: 'Benzene π-electrons attack NO2⁺, temporarily breaking aromaticity to form a resonance-stabilized cyclohexadienyl cation.',
        leftSpecies: 'C6H6 + NO2⁺',
        leftCharge: 'Aromatic → Non-aromatic',
        centerAction: 'RDS',
        rightSpecies: '[C6H6–NO2]⁺',
        rightCharge: 'σ-Complex (3 resonance forms)',
        transitionState: 'Loss of 36 kcal/mol resonance energy',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'π → NO2⁺' }]
      },
      {
        stepTitle: 'Step 3: Fast Deprotonation Restores Aromaticity',
        description: 'HSO4⁻ abstracts the proton from the sp³ carbon, rapidly restoring the aromatic ring.',
        leftSpecies: '[C6H6–NO2]⁺ + HSO4⁻',
        leftCharge: 'Arenium Ion',
        centerAction: 'Fast −H⁺',
        rightSpecies: 'C6H5–NO2 + H2SO4',
        rightCharge: 'Nitrobenzene',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Re-aromatization' }]
      }
    ]
  },
  {
    id: 'c11-friedel-crafts',
    chapter: 'c11-aromatic',
    title: 'Friedel–Crafts Alkylation & Acylation (Rearrangements & Failures)',
    namedReaction: 'Friedel–Crafts Reaction',
    category: 'Electrophilic Aromatic Substitution',
    mechanismType: 'Carbocation (Alkylation) vs Resonance-Stabilized Acylium Ion (Acylation)',
    reactants: 'Benzene + R–X (Alkylation) or R–COCl / Ac2O (Acylation)',
    reagents: 'Anhydrous AlCl3',
    conditions: 'Dry inert solvent / CS2',
    products: 'Alkylbenzene (with rearrangement!) vs Aryl Ketone (NO rearrangement!)',
    rds: 'Electrophilic attack by R⁺ (or AlCl4⁻-complexed Rδ⁺) or Acylium Ion R–C≡O⁺',
    stereochemistry: 'Aromatic substitution',
    rearrangementAlert: 'Benzene + CH3CH2CH2Cl / Anhyd. AlCl3 gives ISOPROPYLBENZENE (Cumene) as major product via 1,2-hydride shift! Use Acylation + Clemmensen/Wolff-Kishner to synthesize pure n-propylbenzene!',
    ncertExceptions: 'CRITICAL FAILURES: (1) Strongly deactivated rings (Nitrobenzene, –CF3, –NR3⁺, –CHO, –COOH) FAIL Friedel-Crafts completely (Nitrobenzene is even used as solvent!). (2) Aniline & Phenol FAIL because –NH2/–OH coordinate strongly to Lewis acid AlCl3 forming deactivating salts!',
    fromGroup: 'Arene',
    toGroup: 'Alkylarene / Aryl Ketone',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Alkylation: Carbocation Formation & 1,2-Hydride Shift',
        description: 'AlCl3 pulls Cl⁻ from n-propyl chloride; concurrent 1,2-H⁻ shift yields more stable isopropyl cation.',
        leftSpecies: 'CH3CH2CH2Cl + AlCl3',
        leftCharge: '1° → 2° shift',
        centerAction: '1,2-H⁻ shift',
        rightSpecies: '(CH3)2CH⁺ + AlCl4⁻',
        rightCharge: '2° Carbocation',
        intermediate: 'Attacks benzene → Cumene (Major) + polyalkylation',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Rearrangement' }]
      },
      {
        stepTitle: 'Acylation: Acylium Ion (No Rearrangement & No Polyacylation)',
        description: 'RCOCl + AlCl3 forms linear, resonance-stabilized acylium ion R–C≡O⁺; deactivating –COR group prevents second acylation.',
        leftSpecies: 'R–C(=O)Cl + AlCl3',
        leftCharge: 'Acyl Chloride',
        centerAction: '− AlCl4⁻',
        rightSpecies: '[R–C≡O⁺ ↔ R–C⁺=O]',
        rightCharge: 'Acylium Ion',
        intermediate: 'Produces mono-acylated ketone cleanly',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Acylium attack' }]
      }
    ]
  },
  {
    id: 'c11-gattermann-koch-bhc',
    chapter: 'c11-aromatic',
    title: 'Gattermann–Koch Formylation & Benzene + Cl2/UV (BHC)',
    namedReaction: 'Gattermann–Koch / Gammaxene Synthesis',
    category: 'Named Reaction',
    mechanismType: 'SEAr (Formyl Cation) vs Free Radical Addition',
    reactants: 'Benzene',
    reagents: 'CO + HCl / Anhyd. AlCl3 + CuCl (Gattermann–Koch) | 3 Cl2 / UV light, 500 K (BHC)',
    conditions: 'High pressure (Gattermann–Koch) vs UV 500 K (BHC)',
    products: 'Benzaldehyde (C6H5CHO) | BHC / Gammaxene / Lindane (C6H6Cl6)',
    rds: 'Formation of [HCO]⁺AlCl4⁻ in Gattermann–Koch; homolytic Cl• addition destroys aromaticity under UV',
    stereochemistry: 'BHC is a mixture of stereoisomers (γ-isomer = Lindane)',
    rearrangementAlert: 'Notice contrast: Benzene + Cl2 + Anhyd. FeCl3 (dark) = Chlorobenzene (Substitution); Benzene + Excess Cl2 + UV (no catalyst) = C6H6Cl6 (Addition)!',
    ncertExceptions: 'Gattermann-Koch fails on Phenol & Aniline derivatives; use Reimer-Tiemann or Gattermann (HCN+HCl) for phenols.',
    fromGroup: 'Arene',
    toGroup: 'Aldehyde / Hexachlorocyclohexane',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Gattermann–Koch: In-Situ Formyl Chloride Equivalent',
        description: 'CO + HCl + AlCl3/CuCl generate electrophilic [H–C≡O⁺] which formylates benzene directly to benzaldehyde.',
        leftSpecies: 'C6H6 + CO + HCl',
        leftCharge: 'Anhyd. AlCl3 / CuCl',
        centerAction: 'SEAr',
        rightSpecies: 'C6H5–CHO + HCl',
        rightCharge: 'Benzaldehyde',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Formylation' }]
      }
    ]
  },
  {
    id: 'c11-dumas-carius',
    chapter: 'c11-goc',
    title: 'Dumas Method (N2) & Carius Method (Halogens, S, P)',
    namedReaction: 'Dumas & Carius Quantitative Estimation',
    category: 'Qualitative Test / Analysis',
    mechanismType: 'Oxidative Combustion (CuO / Fuming HNO3)',
    reactants: 'Organic Compound containing N, X, S, or P',
    reagents: 'Dumas: CuO / Δ (over KOH) | Carius: Fuming HNO3 + AgNO3 (X) or BaCl2 (S)',
    conditions: 'Combustion tube (Dumas) / Sealed Carius tube (500 K)',
    products: 'Dumas: Free N2 gas (works for ALL N compounds!) | Carius: AgX↓ (Halogens) / BaSO4↓ (Sulfur)',
    rds: 'Dumas converts even nitro, azo, and pyridine N quantitatively into N2 gas (collected over KOH to absorb CO2)',
    stereochemistry: 'N/A',
    rearrangementAlert: 'Remember: Dumas works for EVERY nitrogen compound including –NO2, –N=N–, and Pyridine (where Kjeldahl fails)!',
    ncertExceptions: 'In Carius estimation of Phosphorus, MgNH4PO4 precipitates and is ignited to Mg2P2O7 (Magnesium pyrophosphate)!',
    fromGroup: 'Organic N/X/S/P',
    toGroup: 'N2 / AgX↓ / BaSO4↓',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Dumas & Carius Mineralization',
        description: 'CuO oxidizes C→CO2, H→H2O, and N→N2 (collected over KOH); fuming HNO3 converts X→AgX↓ and S→H2SO4→BaSO4↓.',
        leftSpecies: 'Org-(N, X, S)',
        leftCharge: 'CuO or Fuming HNO3',
        centerAction: 'Quantitative Δ',
        rightSpecies: 'N2↑ | AgX↓ | BaSO4↓',
        rightCharge: 'Gravimetric / Volumetric',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Complete oxidation' }]
      }
    ]
  },
  {
    id: 'c11-corey-house',
    chapter: 'c11-alkanes',
    title: 'Corey–House Alkane Synthesis (Odd & Unsymmetrical Alkanes)',
    namedReaction: 'Corey–House Synthesis',
    category: 'Named Reaction',
    mechanismType: 'Organocuprate (Gilman Reagent R2CuLi) SN2 Coupling',
    reactants: 'R2CuLi (from R–X + 2Li → RLi + CuI) + R’–X',
    reagents: 'Dry Ether / THF (195–273 K)',
    conditions: 'R’–X must be 1° (or Methyl/Vinyl/Aryl) for clean coupling',
    products: 'R–R’ (Pure symmetrical OR unsymmetrical/odd-carbon alkane!)',
    rds: 'Nucleophilic attack by R2Cu⁻ on unhindered R’–X (works even when R is 2° or 3° if R’–X is 1°!)',
    stereochemistry: 'Inversion at R’–X center',
    rearrangementAlert: 'Superior to Wurtz reaction because it cleanly synthesizes ODD-carbon alkanes (e.g. Propane from Me2CuLi + EtBr) without 3-alkane side products!',
    ncertExceptions: 'Cannot couple a 3° R’–X with R2CuLi (use the 3° group inside R2CuLi and keep R’–X as CH3Br/1°!).',
    fromGroup: 'Haloalkane',
    toGroup: 'Alkane',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Gilman Reagent R2CuLi + Unhindered R’–X',
        description: 'Lithium dialkylcuprate transfers one R group cleanly to 1° R’–X giving single pure alkane R–R’.',
        leftSpecies: 'R2CuLi + R’–X (1°)',
        leftCharge: 'Gilman Reagent',
        centerAction: 'Dry Ether',
        rightSpecies: 'R–R’ + R–Cu + LiX',
        rightCharge: 'Odd/Even Alkane',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Coupling' }]
      }
    ]
  },
  {
    id: 'c11-vic-dehalogenation',
    chapter: 'c11-alkenes',
    title: 'Dehalogenation of vic-Dihalides & gem-Dihalides',
    namedReaction: 'Zinc Dust Dehalogenation',
    category: 'Elimination (E1/E2)',
    mechanismType: 'Anti E2-like Reductive Elimination',
    reactants: 'vic-Dihalide (R–CHX–CHX–R’) or gem-Dihalide (2 moles)',
    reagents: 'Zn dust / CH3OH or EtOH (or NaI / Acetone)',
    conditions: 'Warm',
    products: 'Alkene (from vic-dihalide) | Symmetrical Alkene (from 2 gem-dihalide)',
    rds: 'Zn donates 2e⁻ converting vic-dibromide cleanly to C=C + ZnBr2',
    stereochemistry: 'Anti-periplanar elimination (meso-2,3-dibromobutane + Zn → trans-2-butene; dl → cis-2-butene!)',
    rearrangementAlert: 'Important NCERT contrast: vic-Dihalide + Zn dust → Alkene; vic-Dihalide + alc. KOH + NaNH2 → Alkyne!',
    ncertExceptions: 'Used to protect and regenerate a C=C double bond (brominate with Br2/CCl4, run reaction elsewhere, regenerate C=C with Zn dust!).',
    fromGroup: 'vic-Dihalide',
    toGroup: 'Alkene',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Anti Reductive Elimination with Zn',
        description: 'Zn attacks Br generating C=C π-bond and kicking out the anti-Br⁻ simultaneously.',
        leftSpecies: 'R–CH(Br)–CH(Br)–R’ + Zn',
        leftCharge: 'Anti geometry',
        centerAction: 'CH3OH, Δ',
        rightSpecies: 'R–CH=CH–R’ + ZnBr2',
        rightCharge: 'Alkene',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: '− ZnBr2' }]
      }
    ]
  }
];

