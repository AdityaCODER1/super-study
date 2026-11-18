/**
 * 4-Pillar NEET Organic Chemistry Reference Data:
 *  Pillar 1: Leaving Group Ability, Nucleophilicity vs Basicity, SN1/SN2/E1/E2 Predictor Rules
 *  Pillar 2: Selective Reagent Master Matrix across 10 Functional Groups
 *  Pillar 3: GOC Electronic Effects, Stability, Acidity & Basicity Trends + NCERT Exceptions
 *  Pillar 4: Distinguishing Chemical Tests & Qualitative Analysis Lab
 */

export const TRENDS_DATA = {
  // ==================== PILLAR 1: LEAVING GROUPS & NUCLEOPHILICITY ====================
  leavingGroups: [
    {
      group: '–N2⁺ (Diazonium)',
      conjugateAcid: 'N2 (gas)',
      pKa: '< -10',
      ability: 'Exceptional (World’s Best)',
      relativeRate: '> 10⁶',
      notes: 'Expulsion of ultra-stable N2 gas drives Sandmeyer, Balz-Schiemann, and deamination even on sp² aryl rings.'
    },
    {
      group: '–OTf (Triflate, –OSO2CF3)',
      conjugateAcid: 'CF3SO3H',
      pKa: '-14',
      ability: 'Super Leaving Group',
      relativeRate: '~10⁴ × TsO⁻',
      notes: 'Three strongly electron-withdrawing fluorines stabilize the sulfonate anion.'
    },
    {
      group: '–OTs (Tosylate) / –OMs',
      conjugateAcid: 'p-TsOH',
      pKa: '-2.8',
      ability: 'Excellent',
      relativeRate: '~10³ × Br⁻',
      notes: 'Converts poor –OH into a superb leaving group WITH retention of configuration before SN2 inversion.'
    },
    {
      group: '–I (Iodide)',
      conjugateAcid: 'HI',
      pKa: '-10',
      ability: 'Excellent',
      relativeRate: '30,000',
      notes: 'Weakest C–I bond (~234 kJ/mol) and largest, most polarizable anion; fastest in SN1, SN2, E1, E2.'
    },
    {
      group: '–OH2⁺ (Protonated Alcohol)',
      conjugateAcid: 'H3O⁺',
      pKa: '-1.7',
      ability: 'Very Good',
      relativeRate: 'Comparable to Br⁻',
      notes: 'Leaves as neutral H2O in acid-catalyzed dehydration (E1) and Lucas/HX reactions.'
    },
    {
      group: '–Br (Bromide)',
      conjugateAcid: 'HBr',
      pKa: '-9',
      ability: 'Very Good',
      relativeRate: '10,000',
      notes: 'Balanced reactivity & selectivity; standard substrate for SN2/E2 comparisons.'
    },
    {
      group: '–Cl (Chloride)',
      conjugateAcid: 'HCl',
      pKa: '-7',
      ability: 'Good',
      relativeRate: '200',
      notes: 'Slower than R–Br (~50× slower); activated in Finkelstein with NaI/acetone.'
    },
    {
      group: '–OC(=O)R (Carboxylate)',
      conjugateAcid: 'RCOOH',
      pKa: '4.8',
      ability: 'Moderate / Fair',
      relativeRate: 'Weak in SN2',
      notes: 'Needs acid catalysis or strong nucleophile (ester aminolysis/hydrolysis).'
    },
    {
      group: '–F (Fluoride)',
      conjugateAcid: 'HF',
      pKa: '+3.2',
      ability: 'Very Poor (Exception: SNAr!)',
      relativeRate: '1 (in SN2)',
      notes: 'Very strong C–F bond (~485 kJ/mol). Fails SN1/SN2, YET Ar–F is FASTEST in SNAr (Meisenheimer RDS) due to –I!'
    },
    {
      group: '–OH⁻ / –OR⁻ / –NH2⁻',
      conjugateAcid: 'H2O / ROH / NH3',
      pKa: '15.7 / 16 / 38',
      ability: 'Terrible (Never leave in SN1/SN2!)',
      relativeRate: '~0',
      notes: 'Must first be protonated (H⁺ → –OH2⁺) or converted to tosylate/halide (SOCl2, PBr3) to leave.'
    }
  ],

  solventNucleophilicity: [
    {
      solventType: 'Polar Protic Solvents',
      examples: 'H2O, CH3OH, C2H5OH, CH3COOH, HCOOH',
      hydrogenBonding: 'Yes (O–H / N–H donors)',
      favoredMech: 'SN1 & E1 (stabilizes BOTH C⁺ and leaving X⁻ via ion-dipole/H-bonding)',
      halideOrder: 'I⁻ > Br⁻ > Cl⁻ > F⁻ (Smaller F⁻ is heavily caged by H-bonds → sluggish!)',
      generalTrend: 'Nucleophilicity INCREASES down a group (SH⁻ > OH⁻, I⁻ > F⁻); Basicity is OPPOSITE (F⁻ > I⁻, OH⁻ > SH⁻).'
    },
    {
      solventType: 'Polar Aprotic Solvents',
      examples: 'DMSO, DMF, Acetone, Acetonitrile (CH3CN), HMPA',
      hydrogenBonding: 'No acidic H (solvates cations M⁺ strongly, leaves anions NAKED!)',
      favoredMech: 'SN2 (dramatically boosts anionic nucleophile energy)',
      halideOrder: 'F⁻ > Cl⁻ > Br⁻ > I⁻ (Naked nucleophilicity mirrors basicity!)',
      generalTrend: 'Across same row: Basicity & Nucleophilicity match (CH3⁻ > NH2⁻ > OH⁻ > F⁻) provided steric bulk isn’t excessive.'
    }
  ],

  // ==================== PILLAR 2: SELECTIVE REAGENT MATRIX ====================
  reagentMatrix: [
    {
      reagent: 'LiAlH4 (LAH) / Dry Ether',
      category: 'Strong Reducing Agent',
      alkeneAlkyne: 'No reaction (unless conjugated to Ph–C=C–CHO → C=C also reduced!)',
      alkylHalide: 'R–X → Alkane (1°/2° SN2; 3° gives Alkene)',
      aldehydeKetone: 'RCHO → 1° ROH; RCOR’ → 2° ROH',
      acidEster: 'RCOOH & RCOOR’ → 1° ROH (reduces ALL carbonyl derivatives!)',
      nitrileAmideNitro: 'RCN → RCH2NH2 | RCONH2 → RCH2NH2 | RNO2 → RNH2 (ArNO2 → Ph–N=N–Ph!)',
      neetTrap: 'Violently reacts with H2O/ROH! Cinnamaldehyde (Ph–CH=CH–CHO) + LiAlH4 reduces BOTH C=C and C=O!'
    },
    {
      reagent: 'NaBH4 / MeOH or H2O',
      category: 'Mild Chemoselective Reducer',
      alkeneAlkyne: 'No reaction',
      alkylHalide: 'No reaction (reduces 2°/3° only rarely)',
      aldehydeKetone: 'RCHO → 1° ROH; RCOR’ → 2° ROH',
      acidEster: 'NO REACTION with RCOOH, RCOOR’, or RCONH2 (Reduces RCOCl → 1° ROH)',
      nitrileAmideNitro: 'No reaction with –CN, –CONH2, or –NO2',
      neetTrap: 'Ideal when molecule has BOTH ketone/aldehyde AND ester/acid/alkene — reduces ONLY the aldehyde/ketone (and acid chloride)!'
    },
    {
      reagent: 'DIBAL-H (1 eq, 195 K)',
      category: 'Controlled Hydride Reducer',
      alkeneAlkyne: 'No reaction (spares isolated C=C)',
      alkylHalide: 'No reaction',
      aldehydeKetone: 'Reduces to Alcohol if excess',
      acidEster: 'RCOOR’ → Aldehyde (RCHO) + R’OH (stops at 195 K!)',
      nitrileAmideNitro: 'RCN → Aldehyde (RCHO) after H3O⁺ workup',
      neetTrap: 'NCERT Favorite for Esters & Nitriles → Aldehydes without touching double bonds!'
    },
    {
      reagent: 'B2H6 / THF (Diborane)',
      category: 'Electrophilic Reducer / Hydroboration',
      alkeneAlkyne: 'Alkene → Trialkylborane (+ H2O2/OH⁻ → Anti-Markovnikov Syn Alcohol)',
      alkylHalide: 'No reaction',
      aldehydeKetone: 'Slowly reduces to Alcohol',
      acidEster: 'Selectively reduces –COOH → –CH2OH FASTER than Esters (opposite to NaBH4)!',
      nitrileAmideNitro: 'Reduces –CN → –CH2NH2; leaves –NO2 untouched',
      neetTrap: 'B2H6 is an electron-deficient Lewis acid: prefers electron-rich –COOH over –COOR’ and –NO2!'
    },
    {
      reagent: 'PCC (CrO3·Pyr·HCl / CH2Cl2)',
      category: 'Mild Anhydrous Oxidant',
      alkeneAlkyne: 'No reaction',
      alkylHalide: 'No reaction',
      aldehydeKetone: 'No reaction (stops at Aldehyde!)',
      acidEster: '1° Alcohol → Aldehyde (no over-oxidation); 2° Alcohol → Ketone; 3° → NR',
      nitrileAmideNitro: 'No reaction',
      neetTrap: 'Anhydrous CH2Cl2 prevents aldehyde hydration, so 1° Alcohol stops cleanly at Aldehyde! (Jones CrO3/H2SO4/H2O oxidizes 1° ROH → RCOOH).'
    },
    {
      reagent: 'MnO2 (Acetone / CH2Cl2)',
      category: 'Chemoselective Allylic/Benzylic Oxidant',
      alkeneAlkyne: 'No reaction',
      alkylHalide: 'No reaction',
      aldehydeKetone: 'No reaction',
      acidEster: 'ONLY oxidizes Allylic (C=C–CH2OH) & Benzylic (Ar–CH2OH) alcohols → Aldehyde/Ketone',
      nitrileAmideNitro: 'No reaction',
      neetTrap: 'Leaves normal saturated 1°/2° –OH groups completely untouched in the same molecule!'
    },
    {
      reagent: 'Hot Acidic/Alk. KMnO4',
      category: 'Vigorous Oxidizing Agent',
      alkeneAlkyne: 'Cleaves C=C/C≡C → Ketones, Carboxylic Acids, or CO2 (from =CH2)',
      alkylHalide: 'Alkylbenzene (≥1 benzylic H) → Benzoic Acid (Ph–COOH)',
      aldehydeKetone: 'RCHO → RCOOH (Ketones resist unless forced)',
      acidEster: '1° ROH → RCOOH; 2° ROH → Ketone; 3° ROH → NR',
      nitrileAmideNitro: 'Hydrolyzes/oxidizes side chains; tert-Butylbenzene fails (no benzylic H!)',
      neetTrap: 'Cold dil. alk. KMnO4 (Baeyer’s) stops at Syn-1,2-Diol without breaking the C–C sigma bond!'
    },
    {
      reagent: '1) O3  2) Zn/H2O (vs H2O2)',
      category: 'Ozonolysis Cleavage',
      alkeneAlkyne: 'Alkene + Zn/H2O → Aldehydes/Ketones; + H2O2 → Carboxylic Acids/Ketones; Alkyne → Diketone/Acids',
      alkylHalide: 'No reaction',
      aldehydeKetone: 'No reaction',
      acidEster: 'No reaction',
      nitrileAmideNitro: 'Benzene + 3O3 → 3 moles Glyoxal (OHC–CHO)',
      neetTrap: 'Reductive (Zn/H2O or Me2S) preserves –CHO; Oxidative (H2O2) turns –CHO into –COOH and =CH2 into CO2!'
    },
    {
      reagent: 'Zn–Hg / Conc. HCl vs NH2NH2 / KOH',
      category: 'Carbonyl Deoxygenation (C=O → CH2)',
      alkeneAlkyne: 'Clemmensen acid can add HCl across C=C; Wolff-Kishner spares C=C',
      alkylHalide: 'Wolff-Kishner base causes E2 elimination of R–X; Clemmensen spares R–X',
      aldehydeKetone: 'Both reduce Aldehydes & Ketones → –CH2– (Alkane)',
      acidEster: 'Both spare –COOH; Clemmensen spares –COOR’ (W–K hydrolyzes ester)',
      nitrileAmideNitro: 'Clemmensen turns –OH → –Cl / dehydrates; W–K spares –OH',
      neetTrap: 'Match reagent to protecting sensitive groups: Acid-sensitive = Wolff–Kishner; Base-sensitive = Clemmensen!'
    },
    {
      reagent: 'H2 / Pd-BaSO4+Quinoline vs Na / liq. NH3',
      category: 'Partial Alkyne Reduction',
      alkeneAlkyne: 'Internal Alkyne: Lindlar → cis-Alkene (Syn) | Na/liq.NH3 → trans-Alkene (Anti)',
      alkylHalide: 'Na/NH3 reduces R–X',
      aldehydeKetone: 'Lindlar (with RCOCl) = Rosenmund → RCHO',
      acidEster: 'No reaction',
      nitrileAmideNitro: 'Terminal alkyne + Na/NH3 → Acetylide salt (no alkene!); Lindlar → Terminal Alkene',
      neetTrap: 'Lindlar = Syn (cis); Birch Na/liq.NH3 = Anti (trans)!'
    },
    {
      reagent: 'SOCl2 vs SOCl2 + Pyridine',
      category: 'Halogenating Reagent',
      alkeneAlkyne: 'No reaction',
      alkylHalide: 'No reaction',
      aldehydeKetone: 'No reaction',
      acidEster: 'R–OH → R–Cl (SNi Retention alone vs SN2 Inversion with Pyridine); RCOOH → RCOCl',
      nitrileAmideNitro: 'Primary amide RCONH2 + SOCl2 → R–C≡N (dehydration!)',
      neetTrap: 'Gives gaseous SO2 + HCl byproducts, making it the cleanest lab prep of R–Cl!'
    },
    {
      reagent: 'I2 + NaOH (NaOI)',
      category: 'Haloform / Diagnostic Oxidant',
      alkeneAlkyne: 'No reaction',
      alkylHalide: 'No reaction',
      aldehydeKetone: 'CH3CHO & CH3COR → RCOO⁻Na⁺ + CHI3↓ (Yellow ppt)',
      acidEster: 'Ethanol (CH3CH2OH) & 2°-Alkanols (CH3CH(OH)R) → RCOO⁻Na⁺ + CHI3↓',
      nitrileAmideNitro: 'Acetic acid, Ethyl acetate, and Acetamide FAIL Iodoform test!',
      neetTrap: 'Only CH3–C(=O)–(H/C) or CH3–CH(OH)–(H/C) give yellow CHI3 precipitate!'
    }
  ],

  // ==================== PILLAR 3: GOC ELECTRONIC, STABILITY & ACIDITY/BASICITY TRENDS ====================
  gocTrends: [
    {
      title: 'Inductive Effect Orders (–I & +I)',
      category: 'Electronic Effects',
      order: '–I: –NF3⁺ > –NR3⁺ > –SR2⁺ > –NH3⁺ > –NO2 > –SO3H > –CN > –CHO > –COOH > –F > –Cl > –Br > –I > –OR > –OH > –C≡CH > –NH2 > –Ph > –CH=CH2 > H',
      secondOrder: '+I: –O⁻ > –COO⁻ > –C(CH3)3 > –CH(CH3)2 > –CH2CH3 > –CH3 > –T > –D > –H',
      explanation: 'Inductive effect is permanent σ-bond polarization that decays rapidly after 3–4 carbons. Remember C–D has shorter bond & higher +I than C–H!',
      exceptionAlert: 'NCERT order trap: –F > –Cl > –Br > –I for –I, AND –NO2 > –CN > –COOH > –F! Also –C≡CH (sp, EN 3.25) has stronger –I than –NH2 (sp³, EN 3.04) and Phenyl (sp²).'
    },
    {
      title: 'Mesomeric / Resonance Effect Orders (+M & –M)',
      category: 'Electronic Effects',
      order: '+M (Donating): –O⁻ > –NH2 > –NHR > –NR2 > –OH > –OR > –NHCOR > –OCOR > –Ph > –F > –Cl > –Br > –I',
      secondOrder: '–M (Withdrawing): –NO2 > –CN > –SO3H > –CHO > –COR > –COOCOR > –COOR > –COOH > –CONH2',
      explanation: 'Mesomeric effect operates through π-conjugation at ortho/para positions equally regardless of distance.',
      exceptionAlert: 'Halogens (–F, –Cl, –Br, –I) are the classic paradox: overall DEACTIVATING (–I > +M) yet ORTHO/PARA-DIRECTING (+M stabilizes arenium ion at o/p)!'
    },
    {
      title: 'Carbocation Stability Order (with Aromatic & Cyclopropyl Exceptions)',
      category: 'Intermediate Stability',
      order: 'Cyclopropylmethyl⁺ (tri > di > mono) ≈ Tropylium⁺ (C7H7⁺) > Ph3C⁺ > Ph2CH⁺ > 3° R3C⁺ > PhCH2⁺ ≈ CH2=CH–CH2⁺ > 2° R2CH⁺ > 1° RCH2⁺ > CH3⁺ > CH2=CH⁺ ≈ Ph⁺',
      secondOrder: 'Bridgehead carbocation (e.g. Norbornyl/Bicyclo[2.2.2]octyl) is extremely unstable (Bredt’s Rule).',
      explanation: 'Look for: (1) Aromaticity (2π/6π Hückel), (2) Dancing resonance of cyclopropylmethyl (bent banana bonds!), (3) Resonance (benzylic/allylic), (4) Hyperconjugation (3 × α-H per methyl), (5) Inductive.',
      exceptionAlert: 'CRITICAL NEET TRAP: (CH3)3C⁺ (3° butyl, 9 α-H) is MORE stable than PhCH2⁺ (Benzyl⁺) in gas/solvolysis comparisons! And Methoxymethyl cation (CH3–O–CH2⁺) is extraordinarily stable via complete octet back-bonding from Oxygen lone pair!'
    },
    {
      title: 'Carbanion & Free Radical Stability Orders',
      category: 'Intermediate Stability',
      order: 'Carbanion: Cyclopentadienyl⁻ (6π Aromatic) > Ph3C⁻ > Ph2CH⁻ > PhCH2⁻ ≈ Allyl⁻ > HC≡C⁻ (sp) > CH3⁻ > 1° > 2° > 3°',
      secondOrder: 'Free Radical: Ph3C• > Ph2CH• > PhCH2• ≈ CH2=CH–CH2• > 3° > 2° > 1° > CH3• > Vinyl• / Phenyl•',
      explanation: 'Carbanions are electron-rich (8e⁻) → destabilized by +I alkyl groups (CH3⁻ > 1° > 2° > 3°) and stabilized by –M/–I/sp character. Radicals are electron-deficient (7e⁻) → follow carbocation stability order (3° > 2° > 1°)!',
      exceptionAlert: 'CCl3⁻ is more stable than CF3⁻ because Chlorine uses vacant 3d orbitals for pπ–dπ backbonding (whereas Fluorine has no 2d orbitals)!'
    },
    {
      title: 'Acidic Strength: Carboxylic Acids, Phenols & Ortho Effect',
      category: 'Acidity & Basicity',
      order: 'RSO3H > HCOOH > PhCOOH > CH3COOH > H2CO3 > Phenol > H2O > ROH > HC≡CH > NH3 > R–H',
      secondOrder: 'Substituted Benzoic Acids: o-NO2 > o-OH (Salicylic! pKa 2.98) > p-NO2 > m-NO2 > PhCOOH > p-Me > p-OMe',
      explanation: 'ORTHO EFFECT: Almost ANY ortho-substituted benzoic acid (even +I/–CH3 or –OCH3!) is STRONGER than Benzoic acid because steric hindrance twists –COOH out of the ring plane, blocking cross-conjugation and stabilizing the carboxylate anion via solvation/H-bonding!',
      exceptionAlert: 'CRITICAL EXCEPTIONS: (1) Formic acid (HCOOH, pKa 3.75) > Benzoic acid (pKa 4.20) > Acetic acid (pKa 4.76)! (2) Phenol > H2O > CH3OH > EtOH > 2° ROH > 3° ROH (CH3OH is slightly MORE acidic than H2O!). (3) o-Nitrophenol is slightly WEAKER than p-Nitrophenol due to intramolecular H-bonding!'
    },
    {
      title: 'Basic Strength of Amines: Aqueous vs Gas Phase & SIR Effect',
      category: 'Acidity & Basicity',
      order: 'Aqueous Methylamines: (CH3)2NH (2°) > CH3NH2 (1°) > (CH3)3N (3°) > NH3 | Aqueous Ethylamines: (C2H5)2NH (2°) > (C2H5)3N (3°) > C2H5NH2 (1°) > NH3',
      secondOrder: 'Gas Phase (Both Me & Et): 3° > 2° > 1° > NH3 | General: Guanidine > Aliphatic Amines > NH3 > Benzylamine > Aniline > Diphenylamine > Pyrrole',
      explanation: 'In aqueous solution, basicity is a balance of +I effect (3° > 2° > 1°), Solvation of RNH3⁺ by H-bonding (1° > 2° > 3°), and Steric Hindrance. Mnemonic: Methyl = 213, Ethyl = 231!',
      exceptionAlert: 'ORTHO EFFECT IN ANILINES (SIR — Steric Inhibition of Protonation): ALL ortho-substituted anilines (even o-Toluidine / o-CH3!) are WEAKER bases than Aniline in water! Whereas N,N-dimethyl-2,6-dimethylaniline is MUCH STRONGER than N,N-dimethylaniline (SIR twists –NMe2 out of ring conjugation!).'
    }
  ],

  // ==================== PILLAR 4: DISTINGUISHING CHEMICAL TESTS LAB ====================
  distinguishingTests: [
    {
      id: 'test-lucas',
      testName: 'Lucas Test',
      reagent: 'Conc. HCl + Anhydrous ZnCl2 (298 K)',
      targets: '1°, 2°, 3° Alcohols (via SN1 Carbocation)',
      observations: '3° Alcohol: Immediate turbidity | 2° Alcohol: Turbidity in ~5 mins | 1° Alcohol: No turbidity at room temp (only on heating)',
      exception: 'Allylic & Benzylic 1° alcohols (e.g. Benzyl alcohol, PhCH2OH) give IMMEDIATE turbidity at room temp because their carbocations are resonance-stabilized!'
    },
    {
      id: 'test-victor-meyer',
      testName: 'Victor Meyer Test',
      reagent: '1) Red P + I2  2) AgNO2  3) HNO2 (NaNO2+HCl)  4) KOH',
      targets: '1°, 2°, 3° Alcohols (RBC Mnemonic)',
      observations: '1° Alcohol → Nitrolic acid → BLOOD RED | 2° Alcohol → Pseudonitrol → BLUE | 3° Alcohol → No rxn with HNO2 → COLORLESS',
      exception: 'Mnemonic: R-B-C (1° Red, 2° Blue, 3° Colorless).'
    },
    {
      id: 'test-iodoform',
      testName: 'Iodoform Test',
      reagent: 'I2 + NaOH (or NaOI), warm',
      targets: 'CH3–C(=O)–(H/C) or CH3–CH(OH)–(H/C)',
      observations: 'Yellow crystalline precipitate of CHI3 with medicinal antiseptic odor',
      exception: 'Distinguishes: Ethanol (+) vs Methanol (−); Propanal (−) vs Propanone (+); Pentan-2-one (+) vs Pentan-3-one (−); Acetophenone (+) vs Benzophenone (−).'
    },
    {
      id: 'test-tollens',
      testName: "Tollens' Test (Silver Mirror)",
      reagent: '[Ag(NH3)2]⁺ OH⁻ (Ammoniacal AgNO3), warm',
      targets: 'Aliphatic & Aromatic Aldehydes, HCOOH, α-Hydroxy Ketones (Fructose), Terminal Alkynes (white ppt)',
      observations: 'Bright metallic Silver Mirror on test tube wall (Ag↓)',
      exception: 'Distinguishes ALL Aldehydes (including Benzaldehyde!) from Ketones! Also positive for Formic Acid (HCOOH) and Glucose/Fructose.'
    },
    {
      id: 'test-fehlings',
      testName: "Fehling's / Benedict's Test",
      reagent: 'Fehling A (CuSO4 aq) + Fehling B (Alk. Na/K Tartrate)',
      targets: 'Aliphatic Aldehydes (RCHO), HCOOH, Reducing Sugars',
      observations: 'Reddish-brown precipitate of Cu2O↓',
      exception: 'CRITICAL NCERT DISTINCTION: Benzaldehyde (ArCHO) gives POSITIVE Tollens’ test but NEGATIVE Fehling’s test! (Used to distinguish Ethanal vs Benzaldehyde).'
    },
    {
      id: 'test-24dnp',
      testName: "2,4-DNP (Brady's) Test",
      reagent: '2,4-Dinitrophenylhydrazine',
      targets: 'ALL Aldehydes and Ketones (C=O)',
      observations: 'Yellow, Orange, or Red crystalline hydrazone precipitate',
      exception: 'Distinguishes Carbonyls from Alcohols, Ethers, Acids, Esters. NOTE: D-Glucose FAILS 2,4-DNP due to cyclic hemiacetal!'
    },
    {
      id: 'test-fecl3',
      testName: 'Neutral FeCl3 Test',
      reagent: 'Neutral Ferric Chloride (FeCl3)',
      targets: 'Phenols & Enols (Ar–OH / C=C–OH)',
      observations: 'Violet / Purple / Green / Blue coloration (Phenoxide–Fe³⁺ complex)',
      exception: 'Distinguishes Phenol (Violet) from Alcohols & Carboxylic Acids (Acetic acid gives buff/reddish-brown precipitate on boiling, NOT violet; Salicylic acid gives Violet!).'
    },
    {
      id: 'test-nahco3',
      testName: 'Sodium Bicarbonate (NaHCO3) Effervescence Test',
      reagent: 'Saturated aqueous NaHCO3',
      targets: 'Carboxylic Acids (pKa < 6.3) & Picric Acid / 2,4-Dinitrophenol',
      observations: 'Brisk effervescence of CO2 gas',
      exception: 'Distinguishes Carboxylic Acids (+) from Phenol (−)! EXCEPTION: Picric acid (2,4,6-trinitrophenol, pKa 0.38) IS acidic enough to give brisk CO2 effervescence with NaHCO3!'
    },
    {
      id: 'test-carbylamine',
      testName: 'Carbylamine (Isocyanide) Test',
      reagent: 'CHCl3 + alc. KOH, Δ',
      targets: '1° Aliphatic AND 1° Aromatic Amines ONLY',
      observations: 'Foul-smelling Isocyanide (R–NC / Ph–NC)',
      exception: 'Distinguishes 1° Amines (Aniline/Ethylamine) from 2° & 3° Amines (N-Methylaniline/Diethylamine fail).'
    },
    {
      id: 'test-hinsberg',
      testName: "Hinsberg's Test",
      reagent: 'Benzenesulfonyl Chloride (PhSO2Cl) + excess KOH',
      targets: '1°, 2°, 3° Amines',
      observations: '1°: Forms precipitate soluble in KOH | 2°: Forms precipitate INSOLUBLE in KOH | 3°: Does not react',
      exception: 'Modern NCERT notes Hinsberg reagent is Benzenesulfonyl chloride (earlier p-toluenesulfonyl chloride).'
    },
    {
      id: 'test-azo-dye',
      testName: 'Azo Dye Coupling Test',
      reagent: 'NaNO2 + HCl (273–278 K) → β-Naphthol in NaOH',
      targets: '1° Aromatic Amines (e.g. Aniline) ONLY',
      observations: 'Brilliant Orange-Red Azo Dye precipitate',
      exception: 'Distinguishes Aniline (1° aromatic, gives orange dye) from Ethylamine / Benzylamine (1° aliphatic, gives N2 gas bubbles + alcohol, NO dye!).'
    },
    {
      id: 'test-agno3-halides',
      testName: 'Alcoholic AgNO3 Test',
      reagent: 'Ethanolic AgNO3',
      targets: 'Alkyl Halides vs Vinyl/Aryl Halides',
      observations: '3° / Allylic / Benzylic R–X: Immediate AgX↓ | R–I > R–Br > R–Cl | Aryl/Vinyl halides: NO ppt',
      exception: 'Distinguishes Benzyl chloride (PhCH2Cl → immediate white AgCl↓) from Chlorobenzene (PhCl → NO ppt)!'
    }
  ],

  compoundPairComparisons: [
    { pair: 'Propanal vs Propanone', test: "Tollens' / Fehling's / Iodoform", winnerA: 'Propanal: Silver mirror (+), Red Cu2O (+), Iodoform (−)', winnerB: 'Propanone: Tollens (−), Fehling (−), Yellow CHI3↓ (+)' },
    { pair: 'Benzaldehyde vs Ethanal', test: "Fehling's & Iodoform", winnerA: 'Benzaldehyde: Fehling (−), Iodoform (−), Tollens (+)', winnerB: 'Ethanal: Fehling (+ Red ppt), Iodoform (+ Yellow ppt), Tollens (+)' },
    { pair: 'Phenol vs Benzoic Acid', test: 'NaHCO3 & Neutral FeCl3', winnerA: 'Phenol: NaHCO3 (−), Neutral FeCl3 (Violet color)', winnerB: 'Benzoic Acid: NaHCO3 (+ Brisk CO2), FeCl3 (No violet color)' },
    { pair: 'Ethanol vs Methanol', test: 'Iodoform Test (I2 + NaOH)', winnerA: 'Ethanol: Yellow CHI3↓ (+)', winnerB: 'Methanol: No precipitate (−)' },
    { pair: '1-Propanol vs 2-Propanol', test: 'Lucas Test & Iodoform Test', winnerA: '1-Propanol: No immediate Lucas turbidity, Iodoform (−)', winnerB: '2-Propanol: Lucas turbidity in 5 min, Yellow CHI3↓ (+)' },
    { pair: 'Aniline vs Benzylamine (or Ethylamine)', test: 'HNO2 (273K) + β-Naphthol Azo Dye', winnerA: 'Aniline: Brilliant Orange-Red Azo Dye (+)', winnerB: 'Benzylamine / Ethylamine: Brisk N2↑ gas, NO dye (−)' },
    { pair: 'Aniline vs N-Methylaniline', test: 'Carbylamine & Hinsberg Test', winnerA: 'Aniline (1°): Foul Carbylamine (+), Hinsberg soluble in KOH', winnerB: 'N-Methylaniline (2°): Carbylamine (−), Hinsberg insoluble in KOH' },
    { pair: 'Formic Acid (HCOOH) vs Acetic Acid (CH3COOH)', test: "Tollens' / Fehling's / HgCl2", winnerA: "HCOOH: Reduces Tollens' (Ag mirror) & Fehling's (Cu2O↓)", winnerB: 'CH3COOH: Negative to both' },
    { pair: 'Chlorobenzene vs Benzyl Chloride', test: 'Warm aq. KOH + HNO3 + AgNO3', winnerA: 'Chlorobenzene: No AgCl↓ (sp² C–Cl resonance)', winnerB: 'Benzyl Chloride: Immediate white AgCl↓ (stable PhCH2⁺)' },
    { pair: '1-Butyne vs 2-Butyne', test: 'Ammoniacal AgNO3 / Cu2Cl2', winnerA: '1-Butyne (Terminal): White Ag ppt / Red Cu ppt (+)', winnerB: '2-Butyne (Internal): No precipitate (−)' }
  ]
};
