/**
 * Complete NCERT Class 12 Organic Chemistry Reactions & Mechanisms (NEET Syllabus)
 * Covers Haloalkanes & Haloarenes, Alcohols/Phenols/Ethers,
 * Aldehydes/Ketones/Carboxylic Acids, Amines & Diazonium Salts, and Biomolecules.
 */

export const CLASS12_REACTIONS = [
  // ==================== CH 10: HALOALKANES & HALOARENES ====================
  {
    id: 'c12-darzen-socl2',
    chapter: 'c12-halo',
    title: "Darzen's Method (Alcohol + SOCl2: SNi Retention vs Pyridine SN2 Inversion)",
    namedReaction: "Darzen's Process",
    category: 'Substitution (SN1/SN2/SNAr)',
    mechanismType: 'SNi (Internal Return) vs SN2 (with Pyridine)',
    reactants: 'Chiral Alcohol (R–OH)',
    reagents: 'SOCl2 alone (SNi) vs SOCl2 + Pyridine (SN2)',
    conditions: 'Reflux; gaseous byproducts escape',
    products: 'R–Cl + SO2↑ + HCl↑',
    rds: 'Collapse of alkyl chlorosulfite (R–O–S(=O)Cl)',
    stereochemistry: 'SOCl2 alone → 100% RETENTION (SNi); SOCl2 + Pyridine → 100% INVERSION (SN2)!',
    rearrangementAlert: 'Best method to make R–Cl because both byproducts (SO2 and HCl) are gases leaving pure R–Cl!',
    ncertExceptions: 'Remember why Pyridine switches stereochemistry: Pyridine neutralizes HCl to form pyridinium chloride, providing free Cl⁻ to attack from the backside (SN2 inversion)!',
    fromGroup: 'Alcohol',
    toGroup: 'Haloalkane',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Chlorosulfite Ester Formation',
        description: 'Alcohol –OH attacks SOCl2 eliminating HCl to form R–O–SOCl.',
        leftSpecies: 'R–OH + Cl–S(=O)–Cl',
        leftCharge: 'Nucleophile',
        centerAction: '− HCl',
        rightSpecies: 'R–O–S(=O)–Cl',
        rightCharge: 'Alkyl Chlorosulfite',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'S attack' }]
      },
      {
        stepTitle: 'Step 2: Front-Side SNi (Retention) vs Pyridine SN2 (Inversion)',
        description: 'Without base, Cl delivers internally from the same face via a 4-center ion pair (Retention). With Pyridine, free Cl⁻ attacks 180° backside (Inversion).',
        leftSpecies: 'R–O–S(=O)–Cl',
        leftCharge: 'Front-side vs Backside',
        centerAction: '− SO2↑',
        rightSpecies: 'R–Cl (Retention / Inversion)',
        rightCharge: 'Pure Haloalkane',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Cl delivery' }]
      }
    ]
  },
  {
    id: 'c12-finkelstein-swarts',
    chapter: 'c12-halo',
    title: 'Finkelstein (Halide Exchange → R–I) & Swarts Reaction (→ R–F)',
    namedReaction: 'Finkelstein & Swarts Reactions',
    category: 'Named Reaction',
    mechanismType: 'SN2 Halide Exchange driven by Precipitation',
    reactants: 'R–Cl / R–Br',
    reagents: 'Finkelstein: NaI / Dry Acetone | Swarts: AgF, Hg2F2, CoF2, or SbF3',
    conditions: 'Dry Acetone (polar aprotic)',
    products: 'R–I + NaX↓ (Finkelstein) | R–F + AgX↓ (Swarts)',
    rds: 'SN2 displacement driven forward by Le Chatelier’s Principle: NaCl/NaBr are INSOLUBLE in dry acetone while NaI is soluble!',
    stereochemistry: 'Complete Walden Inversion (SN2)',
    rearrangementAlert: 'Finkelstein works for 1° and 2° R–Cl/R–Br; 3° R–X fails SN2.',
    ncertExceptions: 'Only Swarts reaction (heavy metal fluorides) gives clean R–F; direct F2 + alkane is violently explosive.',
    fromGroup: 'Haloalkane',
    toGroup: 'Alkyl Iodide / Fluoride',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Finkelstein: Polar Aprotic SN2 + Precipitation Drive',
        description: 'Naked I⁻ in dry acetone performs backside attack; precipitated NaCl/NaBr shifts equilibrium completely right.',
        leftSpecies: 'I⁻ (in Dry Acetone)',
        leftCharge: 'Naked Nu⁻',
        centerAction: '180° SN2',
        rightSpecies: 'R–I + NaX↓',
        rightCharge: 'Inversion + ppt',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Backside SN2' }]
      }
    ]
  },
  {
    id: 'c12-sn2-vs-sn1',
    chapter: 'c12-halo',
    title: 'SN2 (Bimolecular Inversion) vs SN1 (Unimolecular Carbocation)',
    namedReaction: 'SN1 vs SN2 Nucleophilic Substitution',
    category: 'Substitution (SN1/SN2/SNAr)',
    mechanismType: 'Concerted 1-Step (SN2) vs 2-Step Carbocation (SN1)',
    reactants: 'Alkyl / Allylic / Benzylic Halide (R–X)',
    reagents: 'SN2: Strong Nu⁻ + Polar Aprotic | SN1: Weak Nu⁻ + Polar Protic (H2O/EtOH/Ag⁺)',
    conditions: 'Low temp favors substitution over elimination',
    products: 'R–Nu + X⁻',
    rds: 'SN2: Rate = k[R–X][Nu⁻] (CH3X > 1° > 2° >> 3°) | SN1: Rate = k[R–X] (3° > Benzylic ≈ Allylic > 2° >> 1°)',
    stereochemistry: 'SN2: 100% Walden Inversion | SN1: Racemization (with slight excess inversion via tight ion pair!)',
    rearrangementAlert: 'SN1 ALWAYS allows carbocation rearrangement! Bridgehead halides (e.g. 1-bromobicyclo[2.2.1]heptane) undergo NEITHER SN1 (cannot flatten to sp²) NOR SN2 (blocked backside)!',
    ncertExceptions: 'Vinyl (CH2=CH–Cl) & Aryl halides (Ph–Cl) resist BOTH SN1 and SN2 due to partial double-bond character (resonance) and sp² C–X strength.',
    fromGroup: 'Haloalkane',
    toGroup: 'Alcohol / Nitrile / Ether',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'SN2: Single-Step Pentacoordinate Transition State',
        description: 'Nu⁻ attacks 180° opposite to the C–X bond, inverting the tetrahedral umbrella like wind flipping an umbrella.',
        leftSpecies: 'Nu⁻ + R3C–X',
        leftCharge: 'Backside approach',
        centerAction: 'RDS: [Nu---C---X]‡',
        rightSpecies: 'Nu–CR3 + X⁻',
        rightCharge: '100% Inversion',
        transitionState: 'sp² trigonal bipyramidal TS',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: '180° Inversion' }]
      },
      {
        stepTitle: 'SN1: Stepwise Ionization → Planar Carbocation',
        description: 'Polar protic solvent stabilizes leaving X⁻ in the slow RDS; Nu⁻ attacks top/bottom equally (with slight front shielding by leaving X⁻).',
        leftSpecies: 'R3C–X',
        leftCharge: 'Slow ionization (RDS)',
        centerAction: '− X⁻ → R3C⁺',
        rightSpecies: 'dl-R3C–Nu (Racemic)',
        rightCharge: 'sp² planar C⁺',
        intermediate: 'Tight ion pair yields slightly >50% inversion',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Carbocation capture' }]
      }
    ]
  },
  {
    id: 'c12-ambident-nu',
    chapter: 'c12-halo',
    title: 'Ambident Nucleophiles: KCN vs AgCN & KNO2 vs AgNO2',
    namedReaction: 'Ambident Substitution (HSAB / Bond Character)',
    category: 'Substitution (SN1/SN2/SNAr)',
    mechanismType: 'Ionic Dissociation (C/O attack) vs Covalent Bonding (N attack)',
    reactants: 'R–X',
    reagents: 'KCN / KNO2 (Ionic) vs AgCN / AgNO2 (Covalent)',
    conditions: 'Aqueous ethanol, Δ',
    products: 'KCN → R–CN (Nitrile) | AgCN → R–NC (Isocyanide) || KNO2 → R–O–N=O | AgNO2 → R–NO2',
    rds: 'Ionic K⁺ salts expose the higher electron density / more negative site (C in CN⁻; O in NO2⁻); covalent Ag salts leave only the lone pair on N free!',
    stereochemistry: 'SN2 inversion on 1° R–X',
    rearrangementAlert: 'CLASSIC NEET DIRECT NCERT QUESTION: Distinguish KCN vs AgCN and KNO2 vs AgNO2!',
    ncertExceptions: 'In CN⁻, C–C bond is stronger than C–N bond and negative charge sits primarily on C; in Ag–C≡N:, Ag–C bond is covalent so only Nitrogen’s lone pair can attack.',
    fromGroup: 'Haloalkane',
    toGroup: 'Nitrile / Isocyanide / Nitroalkane',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Ionic KCN/KNO2 vs Covalent AgCN/AgNO2',
        description: 'KCN dissociates cleanly to free [:C≡N:]⁻ (attacks via C → Nitrile); Ag–CN keeps C bonded to Ag so :N attacks (Isocyanide).',
        leftSpecies: 'R–X + K⁺[:C≡N:]⁻',
        leftCharge: 'Ionic: C attacks',
        centerAction: 'vs Ag–C≡N:',
        rightSpecies: 'R–CN (KCN) vs R–NC (AgCN)',
        rightCharge: 'Nitrile vs Isocyanide',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Ambident selectivity' }]
      }
    ]
  },
  {
    id: 'c12-grignard-wurtz-fittig',
    chapter: 'c12-halo',
    title: 'Grignard Reagent (RMgX), Wurtz–Fittig & Fittig Reactions',
    namedReaction: 'Grignard / Wurtz–Fittig / Fittig',
    category: 'Named Reaction',
    mechanismType: 'Carbanion Nucleophile (RMgX) & Aryl–Alkyl Coupling',
    reactants: 'R–X + Mg (dry ether) | Ar–X + R–X + 2Na | 2 Ar–X + 2Na',
    reagents: 'Dry Ether (Strictly Anhydrous!)',
    conditions: 'Moisture-free',
    products: 'RMgX (Rδ⁻) | Ar–R (Wurtz–Fittig) | Ar–Ar Diphenyl (Fittig)',
    rds: 'RMgX acts as a VERY strong base (R⁻) with ANY active H (H2O, ROH, RNH2, RC≡CH, RCOOH → R–H alkane!)',
    stereochemistry: 'Loss of stereochemistry during Mg insertion',
    rearrangementAlert: 'NEVER store or react Grignard with H2O, alcohols, or protic solvents — it instantaneously protonates to R–H!',
    ncertExceptions: 'Ullmann reaction uses Cu powder with 2 Ar–I → Biaryl (Ar–Ar) + CuI2.',
    fromGroup: 'Haloalkane / Haloarene',
    toGroup: 'Grignard / Alkane / Alkylarene / Biaryl',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Polarized C(δ⁻)–Mg(δ⁺)X Bond Reactivity',
        description: 'Grignard behaves as R⁻ equivalent: reacts with active H to form alkane R–H, or attacks electrophilic C=O / CO2.',
        leftSpecies: 'Rδ⁻–Mgδ⁺X',
        leftCharge: 'Carbanion equivalent',
        centerAction: '+ H2O / H–A',
        rightSpecies: 'R–H + Mg(OH)X',
        rightCharge: 'Alkane (Zerewitinoff)',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Proton abstraction' }]
      }
    ]
  },
  {
    id: 'c12-dows-snar',
    chapter: 'c12-halo',
    title: "Dow's Process & SNAr (Addition–Elimination via Meisenheimer Complex)",
    namedReaction: "Dow's Process / SNAr",
    category: 'Substitution (SN1/SN2/SNAr)',
    mechanismType: 'Nucleophilic Aromatic Substitution (Addition–Elimination)',
    reactants: 'Chlorobenzene / Nitrochlorobenzene',
    reagents: 'Aq. NaOH (623 K, 300 atm for PhCl; 443 K for p-nitro; 368 K for 2,4-dinitro; warm H2O alone for 2,4,6-trinitro!)',
    conditions: 'Temperature drops sharply with ortho/para –NO2 groups',
    products: 'Phenol / Nitrophenols / Picric Acid (2,4,6-trinitrophenol)',
    rds: 'Nucleophilic addition of OH⁻ to ipso-carbon forming resonance-stabilized carbanion (Meisenheimer Complex)',
    stereochemistry: 'Aromaticity restored upon Cl⁻ expulsion',
    rearrangementAlert: '–NO2 at META position barely accelerates SNAr because negative charge only delocalizes onto ORTHO and PARA positions!',
    ncertExceptions: 'For Electrophilic Substitution of Chlorobenzene: Halogens are DEACTIVATING (–I > +M) yet ORTHO/PARA-DIRECTING (+M stabilizes ortho/para σ-complex)!',
    fromGroup: 'Haloarene',
    toGroup: 'Phenol',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1 (RDS): Nu⁻ Addition → Meisenheimer Carbanion',
        description: 'OH⁻ attacks carbon bearing Cl; ortho/para –NO2 groups delocalize the ring negative charge lowering Ea dramatically.',
        leftSpecies: 'Ar–Cl + OH⁻',
        leftCharge: 'o/p –NO2 stabilizes δ⁻',
        centerAction: 'Addition (RDS)',
        rightSpecies: '[Meisenheimer Anion]⁻',
        rightCharge: 'Delocalized Carbanion',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'OH⁻ addition' }]
      },
      {
        stepTitle: 'Step 2: Fast Expulsion of Cl⁻ → Phenol',
        description: 'Rearomatization kicks out Cl⁻; in basic medium phenol forms phenoxide, acidified to Phenol.',
        leftSpecies: '[Meisenheimer Anion]⁻',
        leftCharge: 'Carbanion',
        centerAction: '− Cl⁻ then H⁺',
        rightSpecies: 'Ar–OH',
        rightCharge: 'Phenol',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Cl⁻ leaves' }]
      }
    ]
  },

  // ==================== CH 11: ALCOHOLS, PHENOLS & ETHERS ====================
  {
    id: 'c12-grignard-carbonyls',
    chapter: 'c12-alcohols',
    title: 'Grignard + Aldehydes / Ketones / Esters → 1°, 2°, 3° Alcohols',
    namedReaction: 'Grignard Carbonyl Addition',
    category: 'Nucleophilic Addition',
    mechanismType: 'Nucleophilic Addition (followed by Acid Hydrolysis)',
    reactants: 'HCHO (→1°) | RCHO (→2°) | RCOR’ / RCOOR’ (excess RMgX → 3°) | Ethylene Oxide (→1° +2C)',
    reagents: '1) R–MgX / Dry Ether  2) H3O⁺',
    conditions: 'Anhydrous step 1, then acidic workup',
    products: '1°, 2°, or 3° Alcohol',
    rds: 'Attack of nucleophilic Rδ⁻ onto electrophilic carbonyl carbon',
    stereochemistry: 'Racemic mixture if unsymmetrical carbonyl gives chiral 2°/3° alcohol',
    rearrangementAlert: 'Remember NCERT shortcuts: HCHO → 1° alcohol (+1 C); Epoxide → 1° alcohol (+2 C); any other RCHO → 2° alcohol; Ketone or Ester (2 eq RMgX) → 3° alcohol!',
    ncertExceptions: 'With Formate ester (HCOOR’) + 2 eq RMgX → 2° alcohol; Ethyl carbonate (EtO)2C=O + 3 eq RMgX → symmetrical 3° alcohol.',
    fromGroup: 'Aldehyde / Ketone',
    toGroup: 'Alcohol',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Nucleophilic Addition to C=O',
        description: 'Rδ⁻ of Grignard attacks δ⁺ carbonyl carbon while Mg²⁺ coordinates carbonyl oxygen.',
        leftSpecies: 'R’–C(=O)–R” + RMgX',
        leftCharge: 'C=O δ⁺',
        centerAction: 'Dry Ether',
        rightSpecies: 'R’R”R–C–O⁻ Mg²⁺X',
        rightCharge: 'Alkoxide adduct',
        arrows: [{ type: 'full', from: 'right', to: 'left', label: 'R⁻ → C=O' }]
      },
      {
        stepTitle: 'Step 2: Acidic Workup',
        description: 'Dilute H3O⁺ protonates the magnesium alkoxide to yield the alcohol.',
        leftSpecies: 'Alkoxide–MgX',
        leftCharge: 'O⁻',
        centerAction: 'H3O⁺',
        rightSpecies: 'R’R”R–C–OH + Mg(OH)X',
        rightCharge: 'Alcohol',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Protonation' }]
      }
    ]
  },
  {
    id: 'c12-cumene-phenol',
    chapter: 'c12-alcohols',
    title: 'Industrial Phenol Synthesis: Cumene Process',
    namedReaction: 'Cumene–Phenol Process',
    category: 'Named Reaction',
    mechanismType: 'Autoxidation → Acid-Catalyzed 1,2-Phenyl Shift (Hock Rearrangement)',
    reactants: 'Cumene (Isopropylbenzene)',
    reagents: '1) O2 (Air, 400 K)  2) Dil. H2SO4 (H3O⁺)',
    conditions: 'Industrial aerobic oxidation + acid hydrolysis',
    products: 'Phenol + Acetone (CH3COCH3, valuable byproduct!)',
    rds: 'Acid-promoted migration of phenyl ring to electron-deficient oxygen as H2O departs',
    stereochemistry: 'Aromatic ring migrates intact',
    rearrangementAlert: 'NCERT Favorite Mechanism Question: Cumene hydroperoxide undergoes 1,2-PHENYL MIGRATION onto oxygen!',
    ncertExceptions: 'Benzene + Propene / H3PO4 makes Cumene; Cumene hydroperoxide on H3O⁺ cleanly gives BOTH Phenol and Acetone.',
    fromGroup: 'Alkylarene',
    toGroup: 'Phenol',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Benzylic Autoxidation → Cumene Hydroperoxide',
        description: 'O2 inserts selectively into the weak 3° benzylic C–H bond via radical chain.',
        leftSpecies: 'Ph–CH(CH3)2 + O2',
        leftCharge: '3° Benzylic C–H',
        centerAction: 'Radical O2',
        rightSpecies: 'Ph–C(CH3)2–O–O–H',
        rightCharge: 'Cumene Hydroperoxide',
        arrows: [{ type: 'fishhook', from: 'left', to: 'right', label: 'O2 insertion' }]
      },
      {
        stepTitle: 'Step 2: Acid-Catalyzed 1,2-Phenyl Shift → Phenol + Acetone',
        description: 'Protonated –OOH2⁺ loses H2O synchronously as the Phenyl group shifts to O, followed by water attack releasing Phenol and Acetone.',
        leftSpecies: 'Ph–C(Me)2–O–OH2⁺',
        leftCharge: '− H2O',
        centerAction: '1,2-Ph Shift',
        rightSpecies: 'Ph–OH + CH3COCH3',
        rightCharge: 'Phenol + Acetone',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Phenyl shift' }]
      }
    ]
  },
  {
    id: 'c12-alcohol-oxidation-cu573',
    chapter: 'c12-alcohols',
    title: 'Selective Oxidation (PCC vs KMnO4/Jones) & Cu/573 K Action',
    namedReaction: 'Alcohol Oxidation & Catalytic Dehydrogenation',
    category: 'Oxidation',
    mechanismType: 'Chromate Ester Elimination vs Copper Surface Dehydrogenation / Dehydration',
    reactants: '1°, 2°, 3° Alcohols',
    reagents: 'PCC (CrO3·Pyridine·HCl in CH2Cl2) | CrO3/H2SO4 (Jones) or KMnO4 | Cu / 573 K',
    conditions: 'Anhydrous CH2Cl2 for PCC; 573 K for Cu',
    products: '1° + PCC → Aldehyde (1° + KMnO4 → Acid) | 2° → Ketone | 3° + Cu/573K → Alkene (Dehydration!)',
    rds: 'PCC stops cleanly at Aldehyde because absence of H2O prevents aldehyde hydrate formation',
    stereochemistry: 'sp³ C–OH → sp² C=O',
    rearrangementAlert: 'CRITICAL NCERT EXCEPTION: With Cu / 573 K, 1° Alcohol → Aldehyde (Dehydrogenation), 2° Alcohol → Ketone (Dehydrogenation), BUT 3° Alcohol has no α-H so it undergoes DEHYDRATION to Alkene!',
    ncertExceptions: 'Also remember MnO2 selectively oxidizes ONLY allylic & benzylic alcohols to aldehydes/ketones without touching saturated alcohols!',
    fromGroup: 'Alcohol',
    toGroup: 'Aldehyde / Ketone / Acid',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'PCC Anhydrous Selectivity vs Aqueous Oxidation',
        description: 'In anhydrous CH2Cl2, aldehyde cannot hydrate to gem-diol RCH(OH)2, so Cr(VI) stops cleanly at RCHO.',
        leftSpecies: 'R–CH2OH + PCC',
        leftCharge: 'CH2Cl2 (No H2O)',
        centerAction: 'E2-like Cr elimination',
        rightSpecies: 'R–CHO (Stops!)',
        rightCharge: 'KMnO4 → RCOOH',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Controlled oxidation' }]
      }
    ]
  },
  {
    id: 'c12-kolbe-reimer-tiemann',
    chapter: 'c12-alcohols',
    title: "Kolbe's Reaction & Reimer–Tiemann Reaction (Phenols)",
    namedReaction: "Kolbe's & Reimer–Tiemann",
    category: 'Named Reaction',
    mechanismType: 'SEAr via Phenoxide (Electrophiles: CO2 vs Dichlorocarbene :CCl2)',
    reactants: 'Phenol (Ph–OH)',
    reagents: "Kolbe: 1) NaOH 2) CO2 (400 K, 4–7 atm) 3) H⁺ | Reimer-Tiemann: CHCl3 + aq. NaOH (340 K) then H⁺",
    conditions: 'Basic phenoxide activation',
    products: "Salicylic Acid (2-hydroxybenzoic acid) | Salicylaldehyde (2-hydroxybenzaldehyde)",
    rds: "In Reimer–Tiemann, CHCl3 + OH⁻ generates neutral electron-deficient Dichlorocarbene (:CCl2) via α-elimination!",
    stereochemistry: 'Ortho-major due to Na⁺ chelation / intramolecular H-bonding',
    rearrangementAlert: 'Reimer–Tiemann electrophile = :CCl2 (6 valence electrons, neutral carbene)! With CCl4 + NaOH instead of CHCl3, Phenol gives Salicylic acid!',
    ncertExceptions: 'Acetylation of Salicylic acid with (CH3CO)2O / H⁺ gives Aspirin (2-acetoxybenzoic acid)!',
    fromGroup: 'Phenol',
    toGroup: 'Salicylic Acid / Salicylaldehyde',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Reimer–Tiemann Step 1: :CCl2 Carbene Generation',
        description: 'OH⁻ deprotonates CHCl3 to CCl3⁻ which loses Cl⁻ (α-elimination) yielding electrophilic singlet :CCl2.',
        leftSpecies: 'CHCl3 + OH⁻',
        leftCharge: 'α-elimination',
        centerAction: '− H2O, − Cl⁻',
        rightSpecies: ':CCl2',
        rightCharge: 'Neutral Electrophile (6e⁻)',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: ':CCl2 forms' }]
      },
      {
        stepTitle: 'Step 2: Ortho Attack on Phenoxide → Salicylaldehyde',
        description: 'Electron-rich phenoxide attacks :CCl2 at ortho position; alkaline hydrolysis of –CHCl2 then acidification yields Salicylaldehyde.',
        leftSpecies: 'PhO⁻ + :CCl2',
        leftCharge: 'Ortho SEAr',
        centerAction: 'OH⁻ then H⁺',
        rightSpecies: 'o-HO–C6H4–CHO',
        rightCharge: 'Salicylaldehyde',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Ortho formylation' }]
      }
    ]
  },
  {
    id: 'c12-phenol-seAr-zinc',
    chapter: 'c12-alcohols',
    title: 'Phenol Bromination (CS2 vs H2O), Nitration, Zn Dust & Oxidation',
    namedReaction: 'Phenol Electrophilic & Redox Reactions',
    category: 'Electrophilic Aromatic Substitution',
    mechanismType: 'Phenoxide Hyper-Activation (H2O) vs Controlled Phenol (CS2)',
    reactants: 'Phenol',
    reagents: 'Br2/CS2 (273K) vs Br2/H2O | Dil. HNO3 (298K) vs Conc. HNO3 | Zn dust, Δ | Na2Cr2O7/H2SO4',
    conditions: 'Solvent polarity controls mono vs trisubstitution',
    products: 'p-Bromophenol (CS2) vs 2,4,6-Tribromophenol white ppt (H2O) | o/p-Nitrophenol vs Picric acid | Benzene (Zn) | p-Benzoquinone',
    rds: 'In H2O, phenol ionizes to strongly activating phenoxide (–O⁻) causing instant 2,4,6-trisubstitution without Lewis acid!',
    stereochemistry: 'o-Nitrophenol has intramolecular H-bonding (steam volatile, lower BP); p-Nitrophenol has intermolecular H-bonding (higher BP)',
    rearrangementAlert: 'Know how to separate o- and p-nitrophenol: STEAM DISTILLATION (o-nitrophenol distills over first)!',
    ncertExceptions: 'Better yield of Picric acid is obtained by first sulfonating phenol (phenol-2,4-disulfonic acid) then treating with conc. HNO3 (avoids oxidation destruction).',
    fromGroup: 'Phenol',
    toGroup: 'Arene / Halophenol / Nitrophenol / Quinone',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Solvent Control: Polar H2O (Phenoxide) vs Non-Polar CS2',
        description: 'Br2/H2O produces phenoxide ion leading to white ppt of 2,4,6-tribromophenol; low-polarity CS2 stops at monobromination (p-major).',
        leftSpecies: 'Phenol + Br2',
        leftCharge: 'CS2 (273K) vs H2O',
        centerAction: 'Ionization switch',
        rightSpecies: 'p-Bromophenol vs 2,4,6-Tribromophenol↓',
        rightCharge: 'Mono vs White ppt',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Solvent effect' }]
      }
    ]
  },
  {
    id: 'c12-williamson-ether',
    chapter: 'c12-alcohols',
    title: 'Williamson Ether Synthesis & Cleavage of Ethers with HI',
    namedReaction: 'Williamson Synthesis & HI Cleavage',
    category: 'Substitution (SN1/SN2/SNAr)',
    mechanismType: 'SN2 (Williamson) & Acid-Cleavage (SN2 for 1°/2°, SN1 for 3°/Benzylic)',
    reactants: 'R–ONa + R’–X (Williamson) | R–O–R’ + HI (Cleavage)',
    reagents: 'Williamson: Alkoxide + 1° Alkyl Halide | Cleavage: Conc. HI (373 K)',
    conditions: 'Anhydrous / Heat with HI',
    products: 'R–O–R’ | R–OH + R’–I (excess HI converts R–OH → R–I too)',
    rds: 'Williamson MUST use 1° R’–X (if 3° R’–X is used, strong alkoxide causes E2 elimination to ALKENE!). HI cleavage: 1°/2° = SN2 (I⁻ attacks smaller alkyl); 3°/Benzylic = SN1 (forms 3° iodide)!',
    stereochemistry: 'SN2 inversion in Williamson & 1°/2° HI cleavage',
    rearrangementAlert: 'CLASSIC NEET TRAP: To synthesize tert-butyl methyl ether, use (CH3)3CONa + CH3Br (SN2 works!), NOT CH3ONa + (CH3)3CBr (gives Isobutene via E2!).',
    ncertExceptions: 'Anisole (Ph–O–CH3) + HI ALWAYS gives Phenol + CH3I (NEVER Iodobenzene + Methanol, because C(sp²)–O bond has partial double-bond strength!).',
    fromGroup: 'Haloalkane / Alkoxide',
    toGroup: 'Ether / Phenol + Alkyl Iodide',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Williamson Rule: 3° Alkoxide + 1° Halide (SN2)',
        description: 'CH3–Br has unhindered backside for SN2 attack by bulky t-BuO⁻; reversing roles causes E2 elimination.',
        leftSpecies: '(CH3)3C–O⁻ Na⁺ + CH3–Br',
        leftCharge: '1° Halide required',
        centerAction: 'SN2',
        rightSpecies: '(CH3)3C–O–CH3 + NaBr',
        rightCharge: 'tert-Butyl methyl ether',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Backside SN2' }]
      },
      {
        stepTitle: 'HI Cleavage Switch: SN2 (Smaller R) vs SN1 (3°/Benzylic)',
        description: 'After protonation of ether O: if neither side is 3°/benzylic, I⁻ attacks the less hindered group (SN2); if one side is 3°/benzylic, it ionizes to carbocation (SN1) giving 3°-I!',
        leftSpecies: 'R–OH⁺–R’ + I⁻',
        leftCharge: 'Protonated Ether',
        centerAction: 'SN2 vs SN1',
        rightSpecies: '1°/2°: Smaller R–I | 3°: 3° R–I | Ar–O–R: ArOH + R–I',
        rightCharge: 'Regioselective cleavage',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'C–O cleavage' }]
      }
    ]
  },

  // ==================== CH 12: ALDEHYDES, KETONES & CARBOXYLIC ACIDS ====================
  {
    id: 'c12-rosenmund-stephen-etard',
    chapter: 'c12-carbonyls',
    title: 'Aldehyde Synthesis: Rosenmund, Stephen, DIBAL-H & Etard',
    namedReaction: 'Rosenmund / Stephen / DIBAL-H / Etard',
    category: 'Reduction',
    mechanismType: 'Controlled Reduction to Aldehyde (Preventing Alcohol Over-reduction)',
    reactants: 'R–COCl (Rosenmund) | R–CN (Stephen/DIBAL-H) | R–COOR’ (DIBAL-H) | Toluene (Etard)',
    reagents: 'H2/Pd-BaSO4+S (Rosenmund) | SnCl2/HCl then H3O⁺ (Stephen) | DIBAL-H at 195K | CrO2Cl2/CS2 then H3O⁺ (Etard)',
    conditions: 'Poisoned catalyst / 195 K cold / CS2',
    products: 'R–CHO / Benzaldehyde (C6H5CHO)',
    rds: 'BaSO4/Quinoline poisons Pd in Rosenmund; low temp (195 K) freezes tetrahedral intermediate in DIBAL-H',
    stereochemistry: 'Retention of C=C double bonds with DIBAL-H',
    rearrangementAlert: 'Formaldehyde (HCHO) CANNOT be made by Rosenmund reduction because HCOCl is unstable at room temperature!',
    ncertExceptions: 'Toluene + CrO3 / (CH3CO)2O at 273–283 K forms benzylidene diacetate (preventing oxidation to benzoic acid), hydrolyzed to Benzaldehyde!',
    fromGroup: 'Acyl Chloride / Nitrile / Ester / Methylarene',
    toGroup: 'Aldehyde',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Selective Stop at Aldehyde Stage',
        description: 'Poisoned Pd (Rosenmund), SnCl2 iminium intermediate (Stephen), or 195K tetrahedral adduct (DIBAL-H) stops reduction before alcohol forms.',
        leftSpecies: 'R–COCl / R–CN / Ph–CH3',
        leftCharge: 'Precursor',
        centerAction: 'Controlled Reagent',
        rightSpecies: 'R–CHO / Ph–CHO',
        rightCharge: 'Aldehyde',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Controlled stop' }]
      }
    ]
  },
  {
    id: 'c12-nuc-addition-nh3deriv',
    chapter: 'c12-carbonyls',
    title: 'Nucleophilic Addition (HCN, NaHSO3, NH2–Z) & Reactivity Order',
    namedReaction: 'Carbonyl Nucleophilic Addition',
    category: 'Nucleophilic Addition',
    mechanismType: 'Tetrahedral Alkoxide Addition (+ Acid-Catalyzed Dehydration for NH2–Z)',
    reactants: 'Aldehydes & Ketones',
    reagents: 'HCN/OH⁻ | NaHSO3 (white ppt, purification!) | ROH/dry HCl (Acetal) | NH2–Z (NH2OH, NH2NH2, 2,4-DNP, Semicarbazide) at pH ~3.5',
    conditions: 'Weakly acidic pH 3.5–4.5 optimal for NH2–Z',
    products: 'Cyanohydrin | Bisulfite adduct | Acetal/Ketal | Oxime/Hydrazone/2,4-DNP (orange-red ppt)/Semicarbazone',
    rds: 'Reactivity Order: HCHO > CH3CHO > (CH3)2CHCHO > CH3COCH3 > PhCHO > PhCOCH3 (Steric hindrance + +I/+M reduce δ⁺ on C=O!)',
    stereochemistry: 'Racemic cyanohydrin from prochiral aldehyde/unsymmetrical ketone',
    rearrangementAlert: 'pH MUST be controlled (~3.5) for NH2–Z reactions: too acidic protonates NH2–Z (destroying nucleophile); too basic prevents protonation of C=O oxygen!',
    ncertExceptions: 'In Semicarbazide (H2N–NH–C(=O)–NH2), ONLY the hydrazinic –NH2 attacks C=O because the amide –NH2 lone pair is delocalized into C=O by resonance!',
    fromGroup: 'Aldehyde / Ketone',
    toGroup: 'Cyanohydrin / Acetal / Imine / Hydrazone',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1 (RDS): Nucleophilic Attack on Planar sp² C=O',
        description: 'Nucleophile attacks the electrophilic carbonyl carbon at the Bürgi–Dunitz angle (~107°), shifting π-electrons to O.',
        leftSpecies: 'Nu⁻ / H2N–Z',
        leftCharge: 'Nucleophile',
        centerAction: '107° attack',
        rightSpecies: 'R2C(O⁻)–Nu',
        rightCharge: 'sp³ Tetrahedral Intermediate',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Carbonyl addition' }]
      },
      {
        stepTitle: 'Step 2: Protonation or Dehydration (Imine/Oxime)',
        description: 'HCN/NaHSO3 stop at tetrahedral adduct; NH2–Z eliminates H2O to form C=N–Z.',
        leftSpecies: 'R2C(OH)–NH–Z',
        leftCharge: 'Carbinolamine',
        centerAction: '− H2O (pH 3.5)',
        rightSpecies: 'R2C=N–Z',
        rightCharge: 'Oxime / Hydrazone / 2,4-DNP',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'H2O elimination' }]
      }
    ]
  },
  {
    id: 'c12-clemmensen-wolff-kishner',
    chapter: 'c12-carbonyls',
    title: 'Clemmensen vs Wolff–Kishner Deoxygenation (C=O → CH2)',
    namedReaction: 'Clemmensen & Wolff–Kishner Reduction',
    category: 'Reduction',
    mechanismType: 'Acidic Surface Metal Reduction vs Basic Hydrazone N2 Elimination',
    reactants: 'Aldehyde or Ketone (C=O)',
    reagents: 'Clemmensen: Zn–Hg / Conc. HCl | Wolff–Kishner: NH2NH2 then KOH / Ethylene Glycol, Δ',
    conditions: 'Strongly Acidic (Clemmensen) vs Strongly Basic (Wolff–Kishner)',
    products: 'Alkane (–CH2–) + H2O (or N2↑)',
    rds: 'Choice depends strictly on acid- vs base-sensitive functional groups!',
    stereochemistry: 'sp² C=O → sp³ CH2',
    rearrangementAlert: 'DO NOT use Clemmensen if molecule has –OH, alkene, or acid-sensitive acetal (HCl converts –OH → –Cl or dehydrates)! DO NOT use Wolff–Kishner if molecule has base-sensitive –X (E2 elimination) or ester (hydrolysis)!',
    ncertExceptions: 'Use neutral Mozingo reduction (HSCH2CH2SH then Raney Ni/H2) when BOTH acid- and base-sensitive groups exist.',
    fromGroup: 'Aldehyde / Ketone',
    toGroup: 'Alkane',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Chemoselectivity Decision: Acid vs Base Medium',
        description: 'Both reduce C=O → CH2; select Clemmensen for base-sensitive substrates (esters/halides) and Wolff–Kishner for acid-sensitive substrates (alcohols/alkenes).',
        leftSpecies: 'R–C(=O)–R’',
        leftCharge: 'Acidic Zn-Hg vs Basic NH2NH2/KOH',
        centerAction: 'Deoxygenation',
        rightSpecies: 'R–CH2–R’',
        rightCharge: 'Methylene Group',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'C=O → CH2' }]
      }
    ]
  },
  {
    id: 'c12-tollens-fehlings-iodoform',
    chapter: 'c12-carbonyls',
    title: "Tollens' Test, Fehling's Test & Haloform (Iodoform) Reaction",
    namedReaction: "Tollens', Fehling's & Iodoform",
    category: 'Qualitative Test / Analysis',
    mechanismType: 'Mild Oxidation (Ag⁺ / Cu²⁺) & α-Trihalogenation Cleavage',
    reactants: 'Aldehydes / α-Hydroxy Ketones (Tollens/Fehling) | CH3–CO– or CH3–CH(OH)– (Iodoform)',
    reagents: "Tollens': [Ag(NH3)2]⁺OH⁻ | Fehling's: Cu²⁺ + Rochelle Salt | Iodoform: I2 + NaOH (or NaOI)",
    conditions: 'Warm water bath',
    products: "Silver Mirror Ag↓ | Red Cu2O↓ | Yellow CHI3↓ + RCOO⁻Na⁺ (−1 C)",
    rds: 'Enolization/α-iodination followed by nucleophilic OH⁻ cleavage of –CI3⁻',
    stereochemistry: 'Chirality lost at cleaved carbon',
    rearrangementAlert: 'CRITICAL NEET DISTINCTIONS: (1) Benzaldehyde reduces TOLLENS’ (Silver mirror) but does NOT reduce FEHLING’S! (2) Formic acid (HCOOH) ALSO reduces Tollens’ & Fehling’s! (3) α-hydroxy ketones (like Fructose!) give positive Tollens’ & Fehling’s via Lobry de Bruyn tautomerism!',
    ncertExceptions: 'Iodoform positive list: CH3CHO (ONLY aldehyde!), Ethanol (ONLY 1° alcohol!), all 2-alkanones (CH3COR), all 2-alkanols (CH3CH(OH)R), Acetophenone, Pyruvic acid. Does NOT work with Acetic acid or Esters/Amides (CH3CO–NH2/OR)!',
    fromGroup: 'Aldehyde / Methyl Ketone',
    toGroup: 'Carboxylic Acid / CHI3↓',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Iodoform Step 1: Exhaustive α-Iodination → –CI3',
        description: 'Base + I2 replace all three α-protons on the methyl group forming R–CO–CI3.',
        leftSpecies: 'R–C(=O)–CH3 + 3I2 + 3OH⁻',
        leftCharge: 'Methyl Ketone',
        centerAction: 'α-Halogenation',
        rightSpecies: 'R–C(=O)–CI3',
        rightCharge: 'Good LG (CI3⁻)',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Tri-iodination' }]
      },
      {
        stepTitle: 'Step 2: Nucleophilic Acyl Substitution → CHI3↓ Yellow Ppt',
        description: 'OH⁻ attacks C=O, kicking out resonance/inductively stabilized CI3⁻ which immediately takes H⁺ from RCOOH.',
        leftSpecies: 'R–C(=O)–CI3 + OH⁻',
        leftCharge: 'Tetrahedral collapse',
        centerAction: 'H⁺ transfer',
        rightSpecies: 'R–COO⁻Na⁺ + CHI3↓ (Yellow)',
        rightCharge: 'Yellow Crystalline Ppt',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'CI3⁻ cleavage' }]
      }
    ]
  },
  {
    id: 'c12-aldol-condensation',
    chapter: 'c12-carbonyls',
    title: 'Aldol & Cross-Aldol Condensation (α-H Required)',
    namedReaction: 'Aldol Condensation',
    category: 'Rearrangement / Condensation',
    mechanismType: 'Enolate Nucleophilic Addition → E1cb Dehydration',
    reactants: 'Aldehyde or Ketone having at least ONE α-Hydrogen',
    reagents: 'Dil. NaOH / Ba(OH)2 (Aldol) → Heat / Δ (Condensation)',
    conditions: 'Dilute aqueous base (293 K), then Δ',
    products: 'β-Hydroxy aldehyde/ketone (Aldol) → α,β-Unsaturated aldehyde/ketone (on Δ)',
    rds: 'Enolate attack on electrophilic C=O (or dehydration via E1cb to conjugated enone)',
    stereochemistry: 'trans (E)-alkene favored upon dehydration',
    rearrangementAlert: 'Cross-Aldol between TWO different aldehydes BOTH having α-H gives a 4-product mixture! For a clean Cross-Aldol, pair one carbonyl WITHOUT α-H (HCHO, PhCHO, Me3CCHO) with one WITH α-H.',
    ncertExceptions: 'Intramolecular Aldol of 1,5- or 1,6-dicarbonyls forms stable 5- or 6-membered cyclic α,β-unsaturated ketones!',
    fromGroup: 'Aldehyde / Ketone',
    toGroup: 'β-Hydroxy Carbonyl / α,β-Unsaturated Enone',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Enolate Carbanion Formation',
        description: 'Dilute OH⁻ reversibly removes an acidic α-H to form nucleophilic enolate.',
        leftSpecies: 'CH3–CHO + OH⁻',
        leftCharge: 'α-H abstraction',
        centerAction: '− H2O',
        rightSpecies: '[⁻CH2–CHO ↔ CH2=CH–O⁻]',
        rightCharge: 'Enolate Ion',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Enolization' }]
      },
      {
        stepTitle: 'Step 2: Enolate Attack → Aldol → E1cb Dehydration on Δ',
        description: 'Enolate attacks a second aldehyde yielding β-hydroxybutanal; gentle heating removes H2O forming conjugated But-2-enal.',
        leftSpecies: '⁻CH2–CHO + CH3CHO',
        leftCharge: 'C–C bond formation',
        centerAction: 'H2O then Δ (−H2O)',
        rightSpecies: 'CH3–CH=CH–CHO',
        rightCharge: 'α,β-Unsaturated Aldehyde',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Condensation' }]
      }
    ]
  },
  {
    id: 'c12-cannizzaro',
    chapter: 'c12-carbonyls',
    title: 'Cannizzaro & Cross-Cannizzaro Reaction (No α-Hydrogen)',
    namedReaction: 'Cannizzaro Reaction',
    category: 'Named Reaction',
    mechanismType: 'Disproportionation via Hydride (H⁻) Transfer (RDS)',
    reactants: 'Aldehydes LACKING α-Hydrogen (HCHO, PhCHO, CCl3CHO, Me3CCHO)',
    reagents: 'Conc. 50% NaOH / KOH',
    conditions: 'Room temp / Warm conc. alkali',
    products: '1 Alcohol (Reduced) + 1 Carboxylate Salt (Oxidized)',
    rds: 'Intramolecular/intermolecular HYDRIDE (H⁻) transfer from tetrahedral dianion to second aldehyde!',
    stereochemistry: 'Achiral / no isotope exchange with D2O on transferred H',
    rearrangementAlert: 'In Cross-Cannizzaro (e.g., PhCHO + HCHO + conc. NaOH), the MORE electrophilic aldehyde (HCHO) ALWAYS gets oxidized to HCOO⁻Na⁺ while PhCHO reduces to Benzyl alcohol (PhCH2OH)!',
    ncertExceptions: '2-Methylpropanal (has 1 α-H) normally undergoes Aldol, EXCEPT at very high conc. KOH/high temp it can show Cannizzaro-like exceptions — stick to NCERT rule: Aldol = α-H present; Cannizzaro = NO α-H (plus Chloral CCl3CHO + OH⁻ → CHCl3 + HCOO⁻ Haloform cleavage, NOT Cannizzaro!).',
    fromGroup: 'Aldehyde (No α-H)',
    toGroup: 'Alcohol + Carboxylic Acid Salt',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: OH⁻ Addition to Form Hydride Donor',
        description: '50% OH⁻ attacks the carbonyl carbon to form a tetrahedral hydroxyalkoxide (or dianion).',
        leftSpecies: 'Ph–CHO + OH⁻',
        leftCharge: 'Conc. 50% NaOH',
        centerAction: 'Nucleophilic attack',
        rightSpecies: 'Ph–CH(OH)–O⁻',
        rightCharge: 'Hydride Donor',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'OH⁻ adds' }]
      },
      {
        stepTitle: 'Step 2 (RDS): Direct Hydride (H⁻) Transfer',
        description: 'Lone pair pushes down to form C=O, transferring H⁻ directly to a second aldehyde molecule (proven by D2O labeling!).',
        leftSpecies: 'Ph–CH(OH)–O⁻',
        leftCharge: 'H⁻ donor',
        centerAction: 'H⁻ transfer (RDS)',
        rightSpecies: 'Ph–COO⁻Na⁺ + Ph–CH2OH',
        rightCharge: 'Acid Salt + Alcohol',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'H⁻ shift' }]
      }
    ]
  },
  {
    id: 'c12-hvz-acid-prep',
    chapter: 'c12-carbonyls',
    title: 'HVZ Reaction, Side-Chain Oxidation & Phthalimide Heating',
    namedReaction: 'Hell–Volhard–Zelinsky (HVZ) / Side-Chain Oxidation',
    category: 'Named Reaction',
    mechanismType: 'α-Bromination via Enol Acyl Halide & Benzylic Oxidation',
    reactants: 'Carboxylic acid with α-H | Alkylbenzene with benzylic H | Phthalic acid + NH3',
    reagents: 'HVZ: X2 (Cl2/Br2) / Red P then H2O | Alkylbenzene: KMnO4/KOH, Δ then H3O⁺ | NH3, strong Δ',
    conditions: 'Catalytic Red P; Strong heating',
    products: 'α-Halo carboxylic acid | Benzoic Acid (regardless of chain length!) | Phthalimide',
    rds: 'HVZ proceeds via trace acyl bromide enolization; KMnO4 requires at least ONE benzylic H!',
    stereochemistry: 'Racemic α-halo acid',
    rearrangementAlert: 'tert-Butylbenzene (Ph–C(CH3)3) has ZERO benzylic Hydrogens → NO oxidation with KMnO4/KOH! Whereas Ethylbenzene, Cumene, and n-Propylbenzene ALL give Benzoic Acid!',
    ncertExceptions: 'Heating Ammonium Phthalate gives Phthalamide, which on strong heating loses NH3 to give cyclic Phthalimide (starting reagent for Gabriel Phthalimide synthesis)!',
    fromGroup: 'Carboxylic Acid / Alkylarene',
    toGroup: 'α-Halo Acid / Benzoic Acid / Phthalimide',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'HVZ: α-Enolization of Acyl Bromide Intermediate',
        description: 'Red P + Br2 convert a trace of RCH2COOH to RCH2COBr which enolizes readily, gets brominated at α-carbon, then transfers Br/OH back.',
        leftSpecies: 'R–CH2–COOH',
        leftCharge: 'α-H required',
        centerAction: 'Br2 / Red P → H2O',
        rightSpecies: 'R–CH(Br)–COOH',
        rightCharge: 'α-Bromo Acid',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'α-Halogenation' }]
      }
    ]
  },

  // ==================== CH 13: AMINES & DIAZONIUM SALTS ====================
  {
    id: 'c12-gabriel-phthalimide',
    chapter: 'c12-amines',
    title: 'Gabriel Phthalimide Synthesis (Pure 1° Aliphatic Amines Only)',
    namedReaction: 'Gabriel Phthalimide Synthesis',
    category: 'Named Reaction',
    mechanismType: 'SN2 Alkylation of Phthalimide Anion + Hydrazinolysis / Base Hydrolysis',
    reactants: 'Phthalimide + R–X (1° Alkyl Halide)',
    reagents: '1) Ethanolic KOH  2) R–X  3) Aq. NaOH (or NH2NH2)',
    conditions: 'SN2 on unhindered R–X',
    products: 'Pure 1° Aliphatic Amine (R–NH2) + Phthalate Salt',
    rds: 'SN2 attack by resonance-stabilized phthalimide anion on 1° alkyl halide',
    stereochemistry: 'SN2 inversion on R–X',
    rearrangementAlert: 'Aromatic primary amines (Aniline) CANNOT be prepared by Gabriel synthesis because Aryl halides do NOT undergo SN2 nucleophilic substitution with phthalimide anion!',
    ncertExceptions: 'Also fails for 3° alkyl halides (E2 elimination) and avoids 2°/3° amine contamination seen in Hofmann ammonolysis.',
    fromGroup: 'Haloalkane',
    toGroup: 'Amine (1° Aliphatic)',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: Deprotonation → Phthalimide Anion',
        description: 'KOH removes acidic imide proton (pKa ~8.3) creating a clean nitrogen nucleophile.',
        leftSpecies: 'Phthalimide + KOH',
        leftCharge: 'Acidic N–H',
        centerAction: '− H2O',
        rightSpecies: 'K⁺ Phthalimide⁻',
        rightCharge: 'Nucleophile',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Deprotonation' }]
      },
      {
        stepTitle: 'Step 2: SN2 Alkylation & Alkaline Hydrolysis → Pure 1° R–NH2',
        description: 'Phthalimide⁻ attacks 1° R–X (no over-alkylation possible!), then NaOH hydrolyzes both amide bonds releasing pure R–NH2.',
        leftSpecies: 'Phthalimide⁻ + 1° R–X',
        leftCharge: 'SN2 (Aryl-X fails!)',
        centerAction: 'aq. NaOH / Δ',
        rightSpecies: 'R–NH2 + Phthalate²⁻',
        rightCharge: 'Pure 1° Aliphatic Amine',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'SN2 + Hydrolysis' }]
      }
    ]
  },
  {
    id: 'c12-hoffmann-bromamide',
    chapter: 'c12-amines',
    title: 'Hofmann Bromamide Degradation (Step-Down Amine Synthesis)',
    namedReaction: 'Hofmann Bromamide Degradation',
    category: 'Named Reaction',
    mechanismType: 'Intramolecular 1,2-Alkyl Migration to Nitrene-like Nitrogen (Isocyanate)',
    reactants: '1° Amide (R–CONH2)',
    reagents: 'Br2 + 4 NaOH (or 4 KOH) or NaOBr',
    conditions: 'Aqueous or ethanolic alkali, 343 K',
    products: 'R–NH2 (1 Carbon Fewer!) + Na2CO3 + 2 NaBr + 2 H2O',
    rds: 'Concerted 1,2-shift of R group with its bonding pair to N simultaneously as Br⁻ leaves → Alkyl Isocyanate (R–N=C=O)',
    stereochemistry: '100% RETENTION of configuration at the migrating chiral carbon R*!',
    rearrangementAlert: 'Rate increases with ELECTRON-DONATING groups on migrating aryl/alkyl ring! Intermediate is Alkyl Isocyanate (R–N=C=O), NOT free nitrene!',
    ncertExceptions: 'Classic NEET stoichiometry check: Requires 1 mol Br2 + 4 mol NaOH per mole of amide! Gives both aliphatic and aromatic 1° amines (e.g. Benzamide → Aniline).',
    fromGroup: 'Amide',
    toGroup: 'Amine (−1 C)',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Step 1: N-Bromoamide & Base Deprotonation',
        description: 'Amide reacts with Br2/NaOH to give R–CO–NHBr, which is deprotonated by second OH⁻ to [R–CO–N–Br]⁻.',
        leftSpecies: 'R–C(=O)–NH2 + Br2 + 2OH⁻',
        leftCharge: 'N-bromination',
        centerAction: '− Br⁻, − 2H2O',
        rightSpecies: '[R–C(=O)–N⁻–Br]',
        rightCharge: 'Anion',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'N-Br anion' }]
      },
      {
        stepTitle: 'Step 2 (RDS): Concerted 1,2-R Shift → Isocyanate → R–NH2',
        description: 'R migrates with complete stereochemical retention to N as Br⁻ leaves, forming R–N=C=O which hydrolyzes with OH⁻ losing CO3²⁻.',
        leftSpecies: '[R–C(=O)–N⁻–Br]',
        leftCharge: 'Retention of R*',
        centerAction: '1,2-Shift (RDS)',
        rightSpecies: 'R–N=C=O → R–NH2 + CO3²⁻',
        rightCharge: '1° Amine (−1 Carbon)',
        intermediate: 'Isocyanate intermediate R–N=C=O',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Isocyanate route' }]
      }
    ]
  },
  {
    id: 'c12-carbylamine-hinsberg-hno2',
    chapter: 'c12-amines',
    title: "Amine Distinguishing Tests: Carbylamine, Hinsberg's & HNO2",
    namedReaction: "Carbylamine & Hinsberg's Tests",
    category: 'Qualitative Test / Analysis',
    mechanismType: 'Dichlorocarbene Attack (1° only) & Sulfonamide Acidity (Hinsberg)',
    reactants: '1°, 2°, 3° Aliphatic & Aromatic Amines',
    reagents: "Carbylamine: CHCl3 + 3 alc. KOH, Δ | Hinsberg: PhSO2Cl (Benzenesulfonyl chloride) + KOH | HNO2: NaNO2+HCl",
    conditions: '273–278 K for ArN2⁺',
    products: 'Carbylamine: R–NC (Foul smell, 1° ONLY!) | Hinsberg: 1° soluble in KOH, 2° insoluble, 3° no reaction | HNO2: 1° aliph → ROH + N2↑; 1° arom → ArN2⁺Cl⁻',
    rds: '1° Sulfonamide (R–NH–SO2Ph) retains an acidic N–H hydrogen so it dissolves in KOH; 2° (R2N–SO2Ph) has NO N–H so it stays insoluble!',
    stereochemistry: 'N/A',
    rearrangementAlert: 'Carbylamine test works for BOTH 1° Aliphatic AND 1° Aromatic amines (e.g. Aniline → Phenyl isocyanide)! 2° and 3° amines fail completely.',
    ncertExceptions: 'With HNO2: 2° aliphatic/aromatic amines give yellow oily N-nitrosoamines (R2N–N=O, Liebermann test); 3° aromatic amine (N,N-dimethylaniline) undergoes p-nitrosation (green); 3° aliphatic amine forms soluble nitrite salt!',
    fromGroup: 'Amine',
    toGroup: 'Isocyanide / Sulfonamide / Diazonium',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: "Hinsberg's Test Decision Tree (PhSO2Cl)",
        description: 'React amine with Benzenesulfonyl chloride, then test precipitate solubility in aqueous KOH.',
        leftSpecies: 'Ph–SO2–Cl + Amine',
        leftCharge: '1° vs 2° vs 3°',
        centerAction: '+ KOH(aq)',
        rightSpecies: '1°: Soluble | 2°: Insoluble ppt | 3°: No rxn',
        rightCharge: 'Clear distinction',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Sulfonamide test' }]
      }
    ]
  },
  {
    id: 'c12-aniline-sear-exceptions',
    chapter: 'c12-amines',
    title: 'Aniline Reactions: Direct Nitration (47% Meta!), Bromination & Sulfonation',
    namedReaction: 'Aniline SEAr & Acetylation Protection',
    category: 'Electrophilic Aromatic Substitution',
    mechanismType: 'Anilinium Ion Formation (m-Directing) & Acetylation Control',
    reactants: 'Aniline (Ph–NH2)',
    reagents: 'Conc. HNO3+H2SO4 (288K) | Br2/H2O | Ac2O/Pyridine then Br2/CH3COOH | Conc. H2SO4, 453–473K',
    conditions: 'Acid-base equilibrium controls orientation',
    products: 'Nitration: 51% p + 47% m + 2% o | Br2/H2O: 2,4,6-Tribromoaniline↓ | Ac2O route: p-Bromoaniline | H2SO4: Sulfanilic acid (Zwitterion)',
    rds: 'In strong nitrating acid, ~50% of Aniline is protonated to –NH3⁺ (strongly deactivating & META-directing), producing 47% m-nitroaniline!',
    stereochemistry: 'Zwitterion formation in sulfanilic acid (H3N⁺–C6H4–SO3⁻)',
    rearrangementAlert: 'NEVER forget Aniline + Conc. HNO3/H2SO4 = 51% para, 47% META, 2% ortho! And Aniline FAILS Friedel–Crafts alkylation/acylation completely due to PhNH2⁺–AlCl3⁻ salt!',
    ncertExceptions: 'To get pure p-nitroaniline or p-bromoaniline, first protect –NH2 with Ac2O/Pyridine → Acetanilide (–NHCOCH3 moderates activation via lone-pair delocalization into C=O), run SEAr, then hydrolyze with H⁺/OH⁻!',
    fromGroup: 'Aniline',
    toGroup: 'Nitroaniline / Bromoaniline / Sulfanilic Acid',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Direct Nitration Anomaly: Anilinium Ion (47% Meta)',
        description: 'Strong H2SO4 converts Aniline to Anilinium ion (–NH3⁺), which has NO lone pair and directs incoming NO2⁺ to the META position.',
        leftSpecies: 'Ph–NH2 + H⁺',
        leftCharge: 'Protonation',
        centerAction: 'HNO3/H2SO4',
        rightSpecies: '51% para + 47% meta + 2% ortho',
        rightCharge: '47% Meta-nitroaniline!',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Anilinium effect' }]
      }
    ]
  },
  {
    id: 'c12-diazonium-hub',
    chapter: 'c12-amines',
    title: 'Benzene Diazonium Chloride Hub (Sandmeyer, Gattermann, Balz–Schiemann, H3PO2 & Azo Coupling)',
    namedReaction: 'Diazonium Salt Reactions',
    category: 'Named Reaction',
    mechanismType: 'N2⁺ (World’s Best Leaving Group) Radical/Cationic Replacement & Azo SEAr',
    reactants: 'Ar–N2⁺ Cl⁻ (prepared at 273–278 K)',
    reagents: 'Cu2Cl2/HCl or Cu2Br2/HBr or CuCN/KCN (Sandmeyer) | Cu/HCl (Gattermann) | KI (→ArI) | HBF4,Δ (Balz-Schiemann →ArF) | H3PO2+H2O or EtOH (→ArH) | H2O, 283K (→PhOH) | Phenol/pH 9-10 or Aniline/pH 4-5',
    conditions: '273–278 K (keep cold!)',
    products: 'ArCl / ArBr / ArCN / ArI / ArF / Benzene / Phenol / Orange & Yellow Azo Dyes',
    rds: 'Loss of ultra-stable N2 gas drives substitution; in coupling, weak electrophile ArN2⁺ attacks strongly activated Phenol (pH 9–10 → Orange) or Aniline (pH 4–5 → Yellow)',
    stereochemistry: 'Azo dyes retain trans N=N geometry',
    rearrangementAlert: 'Remember Azo Coupling pH rules! Phenol needs mildly ALKALINE medium (pH 9–10 to make Phenoxide); Aniline needs mildly ACIDIC medium (pH 4–5 — too acidic protonates aniline to non-nucleophilic anilinium!).',
    ncertExceptions: 'Use H3PO2 + H2O (or CH3CH2OH) to completely remove –NH2 via diazonium salt (e.g., making 1,3,5-tribromobenzene from 2,4,6-tribromoaniline)!',
    fromGroup: 'Diazonium Salt',
    toGroup: 'Haloarene / Nitrile / Arene / Phenol / Azo Dye',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Sandmeyer / Balz-Schiemann / H3PO2 Replacement',
        description: 'N2⁺ departs effortlessly as N2 gas, allowing synthesis of Ar–F, Ar–I, Ar–CN, and Ar–H routes impossible by direct SEAr.',
        leftSpecies: 'Ar–N≡N⁺ Cl⁻',
        leftCharge: '273–278 K',
        centerAction: '− N2↑',
        rightSpecies: 'Ar–Cl | Ar–I | Ar–F | Ar–H | Ar–OH',
        rightCharge: 'Synthetic Hub',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'N2 expulsion' }]
      },
      {
        stepTitle: 'Azo Dye Coupling (SEAr Retention of N2)',
        description: 'At cold temperature, N2 is retained and ArN2⁺ couples at the para position of Phenoxide (Orange) or Aniline (Yellow).',
        leftSpecies: 'Ar–N2⁺ + Phenol (pH 9–10)',
        leftCharge: 'Weak E⁺',
        centerAction: 'Para coupling',
        rightSpecies: 'p-Hydroxyazobenzene (Orange Dye)',
        rightCharge: 'Aniline pH 4–5 → Yellow Dye',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Azo coupling' }]
      }
    ]
  },

  // ==================== CH 14: BIOMOLECULES ====================
  {
    id: 'c12-glucose-reactions',
    chapter: 'c12-biomolecules',
    title: 'Glucose Structure Proof Reactions & Cyclic Hemiacetal Exceptions',
    namedReaction: 'Glucose Diagnostic Reactions',
    category: 'Qualitative Test / Analysis',
    mechanismType: 'Open-Chain Aldohexose Reactivity vs Cyclic Pyranose Equilibrium',
    reactants: 'D-(+)-Glucose (C6H12O6)',
    reagents: 'HI, Δ | NH2OH | HCN | Br2 water | Conc. HNO3 | Ac2O',
    conditions: 'Mild vs Vigorous oxidation',
    products: 'n-Hexane (HI) | Oxime | Cyanohydrin | Gluconic acid (Br2/H2O) | Saccharic acid (HNO3) | Pentaacetate (Ac2O)',
    rds: 'Br2 water selectively oxidizes ONLY –CHO → –COOH (Gluconic acid); Conc. HNO3 oxidizes BOTH –CHO and 1° –CH2OH → Saccharic acid',
    stereochemistry: 'α- and β-D-Glucopyranose are C-1 Anomers (epimers at anomeric C-1); Mutarotation equilibrates to +52.5°',
    rearrangementAlert: 'CRITICAL NCERT EXCEPTION: Despite having an aldehyde group in open form, Glucose Pentaacetate does NOT react with NH2OH, and Glucose itself FAILS Schiff’s test, NaHSO3, and 2,4-DNP because >99% exists as the cyclic hemiacetal!',
    ncertExceptions: 'Both Glucose and Fructose (ketose!) reduce Tollens’ and Fehling’s reagents (via enediol tautomerism in alkaline medium). Sucrose is a NON-REDUCING sugar (C1-α-glucose linked to C2-β-fructose locks both anomeric carbons)!',
    fromGroup: 'Carbohydrate (Glucose)',
    toGroup: 'n-Hexane / Gluconic Acid / Saccharic Acid',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Diagnostic Oxidation Selectivity: Br2 Water vs Conc. HNO3',
        description: 'Mild Br2 water oxidizes only C-1 aldehyde (Gluconic acid); strong HNO3 oxidizes both C-1 aldehyde and C-6 primary alcohol (Saccharic acid).',
        leftSpecies: 'HOCH2–(CHOH)4–CHO',
        leftCharge: 'D-Glucose',
        centerAction: 'Br2/H2O vs HNO3',
        rightSpecies: 'Gluconic Acid vs Saccharic Acid',
        rightCharge: 'Mono vs Dicarboxylic',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Selective oxidation' }]
      }
    ]
  },
  {
    id: 'c12-hunsdiecker',
    chapter: 'c12-halo',
    title: 'Hunsdiecker Reaction (Silver Carboxylate → 1° Alkyl Bromide, −1 C)',
    namedReaction: 'Hunsdiecker Decarboxylation',
    category: 'Free Radical',
    mechanismType: 'Free Radical Decarboxylative Bromination',
    reactants: 'R–COOAg (Silver salt of Carboxylic Acid)',
    reagents: 'Br2 / CCl4',
    conditions: 'Reflux in dry CCl4',
    products: 'R–Br (1 Carbon Fewer) + CO2↑ + AgBr↓',
    rds: 'Homolytic cleavage of O–Br bond in acyl hypobromite (RCOOBr) → R• + CO2',
    stereochemistry: 'Racemization if α-carbon is chiral',
    rearrangementAlert: 'Yield order of alkyl halide: 1° > 2° > 3°. Using I2 instead of Br2 with 2 moles of RCOOAg gives an ESTER (RCOOR — Birnbaum–Simonini reaction)!',
    ncertExceptions: 'Classic step-down reaction reducing the carbon chain by 1 carbon directly into R–Br.',
    fromGroup: 'Carboxylic Acid',
    toGroup: 'Haloalkane (−1 C)',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Step 1 & 2: Acyl Hypobromite → Radical Decarboxylation',
        description: 'RCOOAg + Br2 forms RCOOBr, which undergoes homolysis, loses CO2, and captures Br•.',
        leftSpecies: 'R–COOAg + Br2',
        leftCharge: 'CCl4, Δ',
        centerAction: '− AgBr↓, − CO2↑',
        rightSpecies: 'R–Br',
        rightCharge: 'Haloalkane (−1 C)',
        arrows: [{ type: 'fishhook', from: 'left', to: 'right', label: 'Radical decarboxylation' }]
      }
    ]
  },
  {
    id: 'c12-fischer-aspirin',
    chapter: 'c12-alcohols',
    title: 'Fischer Esterification & Acetylation (Aspirin Synthesis)',
    namedReaction: 'Fischer Esterification & Aspirin Synthesis',
    category: 'Substitution (SN1/SN2/SNAr)',
    mechanismType: 'Acid-Catalyzed Nucleophilic Acyl Substitution (Tetrahedral Intermediate)',
    reactants: 'Carboxylic Acid + Alcohol | Salicylic Acid + Acetic Anhydride',
    reagents: 'Conc. H2SO4 or dry HCl gas (catalytic)',
    conditions: 'Reflux (reversible — remove H2O or use excess reactant)',
    products: 'Ester (R–COOR’) + H2O | Aspirin (2-Acetoxybenzoic acid) + CH3COOH',
    rds: 'Isotope labeling (¹⁸O in R’–¹⁸OH) proves the –OR’ oxygen stays in the ESTER and the –OH of RCOOH leaves as H2O!',
    stereochemistry: 'Retention of configuration at chiral R’–¹⁸OH carbon',
    rearrangementAlert: 'Rate of esterification depends on steric hindrance: CH3OH > 1° ROH > 2° ROH > 3° ROH; HCOOH > CH3COOH > R2CHCOOH > R3CCOOH!',
    ncertExceptions: 'Aspirin is prepared by acetylating the phenolic –OH of Salicylic acid using (CH3CO)2O / H⁺ (NOT –COOH!).',
    fromGroup: 'Carboxylic Acid / Phenol',
    toGroup: 'Ester / Aspirin',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'Nucleophilic Acyl Substitution (¹⁸O Labeling Proof)',
        description: 'Alcohol oxygen attacks protonated carbonyl carbon; C–OH of carboxylic acid leaves as H2O while alcohol oxygen remains in ester.',
        leftSpecies: 'R–C(=O)–OH + H¹⁸O–R’',
        leftCharge: '¹⁸O remains in ester',
        centerAction: 'H⁺ (Tetrahedral TS)',
        rightSpecies: 'R–C(=O)–¹⁸OR’ + H2O',
        rightCharge: 'Ester + H2O',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Acyl substitution' }]
      }
    ]
  },
  {
    id: 'c12-acid-derivatives-rxns',
    chapter: 'c12-carbonyls',
    title: 'Carboxylic Acid Heating Reactions: Anhydride (P2O5), SOCl2 & Dicarboxylic Acids',
    namedReaction: 'Acid Dehydration & Blanc Rule',
    category: 'Rearrangement / Condensation',
    mechanismType: 'Acyl Substitution & Thermal Cyclization / Decarboxylation',
    reactants: 'Carboxylic Acids & Dicarboxylic Acids (Oxalic, Malonic, Succinic, Glutaric, Adipic)',
    reagents: 'P2O5, Δ | SOCl2 | PCl5 | Heat alone',
    conditions: 'Strong heating',
    products: 'Acid Anhydride (P2O5) | RCOCl (SOCl2) | Oxalic→CO2+CO+H2O | Malonic→CH3COOH+CO2 | Succinic/Glutaric→Cyclic Anhydride | Adipic→Cyclopentanone',
    rds: 'Malonic & β-keto acids lose CO2 rapidly on gentle warming via a 6-membered cyclic transition state!',
    stereochemistry: 'Cyclic 5- or 6-membered rings favored thermodynamically',
    rearrangementAlert: 'Remember Blanc’s Rule (OMG-SA): Oxalic (2C) & Malonic (3C) → Decarboxylate; Succinic (4C) & Glutaric (5C) → Cyclic Anhydrides; Adipic (6C) & Pimelic (7C) → Cyclic Ketones (−CO2−H2O)!',
    ncertExceptions: 'Notice HCOOH + Conc. H2SO4 dehydrates cleanly to pure CO gas + H2O (not anhydride)!',
    fromGroup: 'Carboxylic Acid',
    toGroup: 'Acyl Chloride / Anhydride / Cyclic Ketone',
    neetFrequency: 'High',
    svgSteps: [
      {
        stepTitle: 'Thermal Behavior of Dicarboxylic Acids (Blanc Rule)',
        description: 'Chain length determines whether heating yields CO2 loss, 5/6-membered cyclic anhydride, or cyclic ketone.',
        leftSpecies: 'HOOC–(CH2)n–COOH',
        leftCharge: 'n = 0,1 vs 2,3 vs 4,5',
        centerAction: 'Δ / P2O5',
        rightSpecies: 'Decarboxylation | Cyclic Anhydride | Cycloketone',
        rightCharge: 'Ring-size control',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'Thermal cyclization' }]
      }
    ]
  },
  {
    id: 'c12-amino-acids-zwitterion',
    chapter: 'c12-biomolecules',
    title: 'Amino Acids: Zwitterion, Isoelectric Point (pI), Peptide Bond & Ninhydrin Test',
    namedReaction: 'Zwitterion & Peptide Chemistry',
    category: 'Qualitative Test / Analysis',
    mechanismType: 'Intramolecular Acid–Base Equilibrium & Amide Condensation',
    reactants: 'α-Amino Acid (H2N–CHR–COOH)',
    reagents: 'Aqueous solution (pH variation) | Ninhydrin | CuSO4 + NaOH (Biuret Test)',
    conditions: 'Isoelectric pH (pI = (pKa1 + pKa2)/2)',
    products: 'Zwitterion (H3N⁺–CHR–COO⁻) | Peptide Bond (–CO–NH–) | Ruhemann’s Purple (Ninhydrin) | Violet Biuret Complex',
    rds: 'At isoelectric point (pI), net charge = 0 and solubility is minimum; NO migration in electric field!',
    stereochemistry: 'All naturally occurring protein α-amino acids are L-configuration (and ALL except Glycine are optically active; Cysteine is (R) while others are (S)!)',
    rearrangementAlert: 'CLASSIC NEET FACTS: (1) Only GLYCINE is optically inactive among natural α-amino acids! (2) Proline gives YELLOW color with Ninhydrin (all other α-amino acids give purple)! (3) Biuret test requires ≥2 peptide bonds (Tripeptide+); Dipeptides FAIL Biuret test!',
    ncertExceptions: 'Zwitterion is dipolar so amino acids have high melting points and behave like salts (water-soluble, insoluble in organic solvents).',
    fromGroup: 'Amino Acid',
    toGroup: 'Zwitterion / Peptide',
    neetFrequency: 'Very High',
    svgSteps: [
      {
        stepTitle: 'pH Equilibrium: Cation ↔ Zwitterion (pI) ↔ Anion',
        description: 'In acidic pH < pI, amino acid exists as cation (migrates to cathode); at pI, neutral dipolar zwitterion; at basic pH > pI, anion (migrates to anode).',
        leftSpecies: 'H3N⁺–CHR–COOH (pH < pI)',
        leftCharge: 'Net +1 Cation',
        centerAction: 'OH⁻ / H⁺',
        rightSpecies: 'H3N⁺–CHR–COO⁻ (pI) ↔ H2N–CHR–COO⁻',
        rightCharge: 'Zwitterion ↔ Anion',
        arrows: [{ type: 'full', from: 'left', to: 'right', label: 'pH switching' }]
      }
    ]
  }
];

