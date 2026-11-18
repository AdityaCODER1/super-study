/**
 * Built-in Offline NEET Organic Chemistry Question Bank
 * Allows immediate quizzing across Single-Choice MCQs, Statement/Assertion-Reason,
 * and Multi-Step A -> B -> C Synthesis Roadmaps even without a Gemini API key.
 */

export const OFFLINE_QUESTIONS = [
  {
    id: 'oq-1',
    chapter: 'c11-alkenes',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Reaction of 3-methylbut-1-ene with HCl produces a major product via carbocation rearrangement. Identify the major product:',
    options: [
      '1-chloro-3-methylbutane',
      '2-chloro-3-methylbutane',
      '2-chloro-2-methylbutane',
      '2-chloro-2-methylpropane'
    ],
    correctIndex: 2,
    explanation:
      'Protonation at C-1 initially gives the 2° carbocation (CH3)2CH–CH⁺–CH3. A rapid 1,2-hydride shift generates the far more stable 3° carbocation (CH3)2C⁺–CH2CH3, which Cl⁻ captures to yield 2-chloro-2-methylbutane.'
  },
  {
    id: 'oq-2',
    chapter: 'c11-alkenes',
    type: 'Assertion-Reason',
    difficulty: 'NCERT Direct',
    question:
      'Assertion (A): Addition of HCl to propene in the presence of benzoyl peroxide still follows Markovnikov rule.\nReason (R): In the peroxide radical chain mechanism, addition of Cl• is endothermic or H-abstraction from HCl by the 2° radical is endothermic.',
    options: [
      'Both A and R are true and R is the correct explanation of A',
      'Both A and R are true but R is NOT the correct explanation of A',
      'A is true but R is false',
      'Both A and R are false'
    ],
    correctIndex: 0,
    explanation:
      'The Kharasch peroxide effect works ONLY with HBr! For HCl, the second propagation step (R• + H–Cl → R–H + Cl•) is endothermic because the H–Cl bond (431 kJ/mol) is too strong to break rapidly, so the ionic Markovnikov path dominates.'
  },
  {
    id: 'oq-3',
    chapter: 'c12-alcohols',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Which pair of reactants will cleanly give tert-butyl methyl ether via Williamson Ether Synthesis?',
    options: [
      'CH3ONa + (CH3)3C–Br',
      '(CH3)3C–ONa + CH3–Br',
      '(CH3)3C–OH + CH3OH with conc. H2SO4 at 443 K',
      'CH3MgBr + (CH3)3C–OH'
    ],
    correctIndex: 1,
    explanation:
      'Williamson synthesis proceeds via SN2, which requires an unhindered 1° alkyl halide (CH3Br). Reacting CH3ONa with 3° (CH3)3CBr instead forces E2 elimination to give 2-methylpropene (isobutene)!'
  },
  {
    id: 'oq-4',
    chapter: 'c12-alcohols',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'When Anisole (C6H5–O–CH3) is heated with concentrated HI at 373 K, what are the products formed?',
    options: [
      'Iodobenzene + Methanol',
      'Phenol + Iodomethane',
      'Phenol + Methanol',
      'Iodobenzene + Iodomethane'
    ],
    correctIndex: 1,
    explanation:
      'Protonation occurs at the ether oxygen. Because the C(sp²)–O bond between the benzene ring and oxygen has partial double-bond character via resonance, it CANNOT break by SN2 or SN1. Instead, I⁻ attacks the CH3 group (SN2), yielding Phenol + CH3I.'
  },
  {
    id: 'oq-5',
    chapter: 'c12-halo',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Optically active (R)-butan-2-ol reacts with SOCl2 in the absence of pyridine, and separately with SOCl2 in the presence of pyridine. The major products have:',
    options: [
      'Inversion in both cases',
      'Retention without pyridine; Inversion with pyridine',
      'Inversion without pyridine; Retention with pyridine',
      'Complete racemization in both cases'
    ],
    correctIndex: 1,
    explanation:
      'SOCl2 alone proceeds via SNi (internal nucleophilic substitution through an intimate ion pair), giving RETENTION of configuration. Adding Pyridine intercepts HCl to produce free Cl⁻, switching the pathway to backside SN2 INVERSION.'
  },
  {
    id: 'oq-6',
    chapter: 'c12-amines',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'Direct nitration of Aniline using conc. HNO3 + conc. H2SO4 at 288 K unexpectedly yields 47% m-nitroaniline alongside 51% p-nitroaniline because:',
    options: [
      'The –NH2 group is inherently meta-directing',
      'In strongly acidic medium, aniline is protonated to the –NH3⁺ anilinium ion which is meta-directing',
      'm-Nitroaniline is thermodynamically more stable than o/p-isomers',
      'HNO3 oxidizes the ortho positions'
    ],
    correctIndex: 1,
    explanation:
      'In the strongly acidic nitration mixture, a major fraction of aniline converts to the anilinium ion (Ph–NH3⁺). With no lone pair left on nitrogen, –NH3⁺ strongly deactivates and directs incoming NO2⁺ to the meta position.'
  },
  {
    id: 'oq-7',
    chapter: 'c12-amines',
    type: 'Multi-Step Roadmap',
    difficulty: 'Multi-Concept Rank Booster',
    question:
      'Identify the final product [C] in the sequence:\nBenzamide —(Br2 + 4 NaOH)→ [A] —(NaNO2 + HCl, 273 K)→ [B] —(H3PO2 + H2O)→ [C]',
    options: [
      'Aniline',
      'Phenol',
      'Benzene',
      'Bromobenzene'
    ],
    correctIndex: 2,
    explanation:
      'Step 1 (Hofmann Bromamide): Benzamide → Aniline [A] (1 C fewer). Step 2 (Diazotization at 273 K): Aniline → Benzene diazonium chloride [B]. Step 3 (Deamination with H3PO2/H2O): [B] is reduced cleanly to Benzene [C] + N2↑ + H3PO3.'
  },
  {
    id: 'oq-8',
    chapter: 'c11-alkynes',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'What happens when But-1-yne is treated with Sodium in liquid Ammonia (Na / liq. NH3)?',
    options: [
      'cis-But-1-ene is formed',
      'trans-But-2-ene is formed',
      'Sodium but-1-ynide (CH3CH2C≡C⁻Na⁺) + ½ H2↑ is formed',
      'Butane is formed completely'
    ],
    correctIndex: 2,
    explanation:
      'Birch reduction (Na/liq. NH3) gives trans-alkenes from INTERNAL alkynes (like But-2-yne). On a TERMINAL alkyne (But-1-yne), the acidic sp C–H proton reacts immediately with Na/NH2⁻ to form the acetylide salt and H2 gas instead!'
  },
  {
    id: 'oq-9',
    chapter: 'c12-carbonyls',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'Which pair of compounds can be distinguished using Fehling’s solution (positive for one, negative for the other) even though BOTH give a positive Silver Mirror with Tollens’ reagent?',
    options: [
      'Propanone and Ethanal',
      'Ethanal and Benzaldehyde',
      'Propanal and Pentan-3-one',
      'Acetophenone and Benzophenone'
    ],
    correctIndex: 1,
    explanation:
      'Aromatic aldehydes like Benzaldehyde (C6H5CHO) reduce Tollens’ reagent (silver mirror) but DO NOT reduce weaker Fehling’s solution! Ethanal (aliphatic aldehyde) reduces BOTH Tollens’ and Fehling’s.'
  },
  {
    id: 'oq-10',
    chapter: 'c12-carbonyls',
    type: 'Multi-Step Roadmap',
    difficulty: 'Multi-Concept Rank Booster',
    question:
      'Identify [C] in the reaction sequence:\nToluene —(CrO2Cl2 / CS2, then H3O⁺)→ [A] —(HCHO + 50% NaOH)→ [B] (Alcohol product) + HCOO⁻Na⁺',
    options: [
      'Benzoic acid',
      'Benzyl alcohol',
      '2-Phenylethanol',
      'Salicylaldehyde'
    ],
    correctIndex: 1,
    explanation:
      'Etard reaction converts Toluene → Benzaldehyde [A]. Then Cross-Cannizzaro between PhCHO and HCHO in 50% NaOH selectively oxidizes the more reactive HCHO to HCOO⁻Na⁺ and reduces Benzaldehyde to Benzyl alcohol (Ph–CH2OH) [B].'
  },
  {
    id: 'oq-11',
    chapter: 'c11-goc',
    type: 'Statement I & II',
    difficulty: 'NEET Tricky Exception',
    question:
      'Statement I: Kjeldahl’s method cannot be used for nitrogen estimation in Pyridine and Azobenzene.\nStatement II: In Lassaigne’s test, Hydrazine (NH2–NH2) gives an intense Prussian blue coloration with FeSO4 and FeCl3.',
    options: [
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    correctIndex: 2,
    explanation:
      'Statement I is TRUE (nitro, azo, and ring-nitrogen compounds fail Kjeldahl’s method). Statement II is FALSE: Hydrazine contains N but ZERO carbon, so NaCN cannot form during sodium fusion and it fails Lassaigne’s test!'
  },
  {
    id: 'oq-12',
    chapter: 'c11-goc',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Which of the following represents the CORRECT decreasing order of basic strength in AQUEOUS solution?',
    options: [
      '(CH3)3N > (CH3)2NH > CH3NH2 > NH3',
      '(C2H5)2NH > (C2H5)3N > C2H5NH2 > NH3',
      '(C2H5)2NH > C2H5NH2 > (C2H5)3N > NH3',
      'C6H5NH2 > NH3 > CH3NH2'
    ],
    correctIndex: 1,
    explanation:
      'In water, opposing +I effect and H-bond solvation yield: for Ethylamines 2° > 3° > 1° > NH3 ((C2H5)2NH > (C2H5)3N > C2H5NH2 > NH3), whereas for Methylamines it is 2° > 1° > 3° > NH3!'
  },
  {
    id: 'oq-13',
    chapter: 'c11-aromatic',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'Benzene reacts with 1-chloropropane in the presence of anhydrous AlCl3 to give predominantly:',
    options: [
      'n-Propylbenzene',
      'Isopropylbenzene (Cumene)',
      '1,2-Dipropylbenzene',
      'Chlorobenzene'
    ],
    correctIndex: 1,
    explanation:
      'Friedel–Crafts alkylation proceeds via carbocation formation: the initial 1° propyl cation undergoes a rapid 1,2-hydride shift to the 2° isopropyl cation, forming Cumene as the major product.'
  },
  {
    id: 'oq-14',
    chapter: 'c12-alcohols',
    type: 'Multi-Step Roadmap',
    difficulty: 'Multi-Concept Rank Booster',
    question:
      'Identify [A] and [B]:\nCumene —(1. O2, 2. H3O⁺)→ [A] (aromatic) + Acetone.\n[A] —(CHCl3 + aq. NaOH, then H⁺)→ [B]',
    options: [
      '[A] = Benzyl alcohol, [B] = Benzaldehyde',
      '[A] = Phenol, [B] = Salicylic acid',
      '[A] = Phenol, [B] = Salicylaldehyde',
      '[A] = Anisole, [B] = o-Hydroxyacetophenone'
    ],
    correctIndex: 2,
    explanation:
      'Cumene process produces Phenol [A] + Acetone. Phenol then undergoes the Reimer–Tiemann reaction with CHCl3/NaOH (via :CCl2 carbene electrophile) to give Salicylaldehyde (2-hydroxybenzaldehyde) [B].'
  },
  {
    id: 'oq-15',
    chapter: 'c12-carbonyls',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Which of the following compounds gives a POSITIVE Iodoform test (yellow CHI3↓ with I2/NaOH)?',
    options: [
      'Pentan-3-one',
      'Acetic acid (CH3COOH)',
      'Propan-1-ol',
      'Butan-2-ol'
    ],
    correctIndex: 3,
    explanation:
      'Butan-2-ol contains the CH3–CH(OH)– group, which NaOI oxidizes in situ to butan-2-one (CH3–CO–CH2CH3) and cleaves to yellow CHI3↓. Pentan-3-one lacks CH3CO–, propan-1-ol lacks CH3CH(OH)–, and carboxylic acids (CH3COOH) do NOT give iodoform.'
  },
  {
    id: 'oq-16',
    chapter: 'c12-biomolecules',
    type: 'Statement I & II',
    difficulty: 'NCERT Direct',
    question:
      'Statement I: D-(+)-Glucose forms a pentaacetate on reaction with acetic anhydride, yet Glucose pentaacetate does not react with hydroxylamine.\nStatement II: D-(+)-Glucose is oxidized to Saccharic acid (a dicarboxylic acid) by Bromine water.',
    options: [
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    correctIndex: 2,
    explanation:
      'Statement I is TRUE (absence of free –CHO group in cyclic glucose pentaacetate prevents oxime formation). Statement II is FALSE: Bromine water is a mild oxidant and gives Gluconic acid (monocarboxylic); Conc. HNO3 is needed to oxidize both ends to Saccharic acid!'
  },
  {
    id: 'oq-17',
    chapter: 'c12-halo',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Arrange the following leaving groups in order of DECREASING leaving group ability in SN2 reactions in polar protic ethanol:',
    options: [
      'F⁻ > Cl⁻ > Br⁻ > I⁻',
      'I⁻ > Br⁻ > Cl⁻ > F⁻',
      'OH⁻ > Cl⁻ > Br⁻ > I⁻',
      'NH2⁻ > F⁻ > I⁻ > TsO⁻'
    ],
    correctIndex: 1,
    explanation:
      'Weaker bases (conjugate bases of stronger acids) are better leaving groups. Since HI (pKa −10) > HBr (−9) > HCl (−7) >> HF (+3.2), leaving ability follows I⁻ > Br⁻ > Cl⁻ >> F⁻.'
  },
  {
    id: 'oq-18',
    chapter: 'c12-carbonyls',
    type: 'MCQ',
    difficulty: 'Multi-Concept Rank Booster',
    question:
      'A molecule contains BOTH a ketone (–CO–) and an ester (–COOCH3) group, plus a secondary alcohol (–OH). Which reagent selectively reduces ONLY the ketone C=O to –CH2– without hydrolyzing the ester or dehydrating the alcohol?',
    options: [
      'Zn–Hg / Conc. HCl (Clemmensen)',
      'NH2NH2 / KOH, Ethylene glycol, Δ (Wolff–Kishner)',
      'HSCH2CH2SH / BF3 followed by Raney Ni / H2 (Neutral Mozingo)',
      'LiAlH4 / Dry Ether'
    ],
    correctIndex: 2,
    explanation:
      'Clemmensen (conc. HCl) converts the –OH to –Cl or dehydrates it; Wolff–Kishner (hot KOH) saponifies the ester; LiAlH4 reduces both ketone and ester to alcohols! Neutral thioacetal desulfurization (Mozingo) reduces C=O → CH2 under neutral conditions.'
  },
  {
    id: 'oq-19',
    chapter: 'c12-amines',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'Gabriel Phthalimide synthesis is ideal for preparing:',
    options: [
      'Aniline from Chlorobenzene',
      'N-Methylpropanamine (2° amine)',
      'Benzylamine (1° aliphatic/benzylic amine)',
      'tert-Butylamine (from tert-butyl bromide)'
    ],
    correctIndex: 2,
    explanation:
      'Benzyl chloride (PhCH2Cl) undergoes clean SN2 displacement with potassium phthalimide to give Benzylamine (a 1° amine where –NH2 is on an sp³ carbon). Chlorobenzene fails SN2, 3°-BuBr undergoes E2, and 2° amines cannot be made directly.'
  },
  {
    id: 'oq-20',
    chapter: 'c11-alkenes',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Which reagent sequence converts 3,3-dimethylbut-1-ene into 3,3-dimethylbutan-2-ol WITHOUT carbocation rearrangement?',
    options: [
      'Dil. H2SO4 / H2O',
      '1) Hg(OAc)2 / H2O  2) NaBH4',
      '1) B2H6 / THF  2) H2O2 / OH⁻',
      '1) HBr  2) aq. KOH'
    ],
    correctIndex: 1,
    explanation:
      'Oxymercuration–Demercuration gives Markovnikov hydration WITHOUT carbocation rearrangement (yielding 3,3-dimethylbutan-2-ol). Dil. H2SO4 causes a 1,2-methyl shift to 2,3-dimethylbutan-2-ol, while HBO yields 3,3-dimethylbutan-1-ol.'
  },
  {
    id: 'oq-21',
    chapter: 'c11-alkanes',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'During Kolbe’s electrolytic synthesis of ethane using aqueous sodium acetate, what happens to the pH of the electrolyte solution as electrolysis proceeds?',
    options: [
      'pH decreases below 7',
      'pH remains strictly constant at 7',
      'pH increases above 7 due to formation of NaOH at the cathode',
      'pH drops to 0 because acetic acid regenerates'
    ],
    correctIndex: 2,
    explanation:
      'At the cathode, water is reduced (2H2O + 2e⁻ → H2↑ + 2OH⁻), leaving NaOH in solution while acetate is consumed at the anode. Therefore, the pH increases steadily.'
  },
  {
    id: 'oq-22',
    chapter: 'c11-alkanes',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'Which of the following alkanes reacts with acidic KMnO4 to produce a tertiary alcohol?',
    options: [
      'n-Butane',
      '2-Methylpropane (Isobutane)',
      '2,2-Dimethylpropane (Neopentane)',
      'Ethane'
    ],
    correctIndex: 1,
    explanation:
      'Ordinarily alkanes resist oxidation by KMnO4, EXCEPT alkanes containing a tertiary (3°) hydrogen atom! 2-Methylpropane has a 3° H and is oxidized by KMnO4 to 2-methylpropan-2-ol.'
  },
  {
    id: 'oq-23',
    chapter: 'c11-alkynes',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'When Propyne is passed through a red hot iron tube at 873 K, the cyclic trimerization product obtained is:',
    options: [
      'Benzene',
      'Toluene',
      '1,3,5-Trimethylbenzene (Mesitylene)',
      '1,2,3-Trimethylbenzene'
    ],
    correctIndex: 2,
    explanation:
      'Three molecules of ethyne polymerize to Benzene at 873 K in a red-hot Fe tube, while 3 molecules of propyne cyclotrimerize symmetrically to Mesitylene (1,3,5-trimethylbenzene).'
  },
  {
    id: 'oq-24',
    chapter: 'c11-aromatic',
    type: 'Statement I & II',
    difficulty: 'NEET Tricky Exception',
    question:
      'Statement I: In aromatic nitration using conc. HNO3 + conc. H2SO4, HNO3 acts as a Brønsted base.\nStatement II: Aromatic sulfonation shows a primary kinetic isotope effect (kH / kD > 1), whereas nitration shows negligible kinetic isotope effect.',
    options: [
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    correctIndex: 0,
    explanation:
      'Both statements are TRUE! H2SO4 protonates HNO3 (so HNO3 accepts H⁺ = base) to generate NO2⁺. In sulfonation, C–H/C–D bond cleavage in step 2 is partially rate-determining, giving kH/kD > 1.'
  },
  {
    id: 'oq-25',
    chapter: 'c11-aromatic',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Which compound does NOT undergo Friedel–Crafts alkylation with CH3Cl / anhydrous AlCl3?',
    options: [
      'Toluene',
      'Anisole',
      'Aniline',
      'Ethylbenzene'
    ],
    correctIndex: 2,
    explanation:
      'Aniline (C6H5NH2) is a Lewis base and reacts directly with the Lewis acid AlCl3 to form an insoluble salt (C6H5NH2⁺ AlCl3⁻), acquiring a positive charge on nitrogen that strongly deactivates the ring toward SEAr!'
  },
  {
    id: 'oq-26',
    chapter: 'c12-halo',
    type: 'Assertion-Reason',
    difficulty: 'NCERT Direct',
    question:
      'Assertion (A): Chlorobenzene is less reactive than chloromethane toward nucleophilic substitution (aq. KOH).\nReason (R): In chlorobenzene, the C–Cl bond acquires partial double-bond character due to resonance and the carbon is sp² hybridized.',
    options: [
      'Both A and R are true and R is the correct explanation of A',
      'Both A and R are true but R is NOT the correct explanation of A',
      'A is true but R is false',
      'Both A and R are false'
    ],
    correctIndex: 0,
    explanation:
      'Both A and R are true, and R directly explains why haloarenes resist SN1/SN2 nucleophilic substitution under mild conditions.'
  },
  {
    id: 'oq-27',
    chapter: 'c12-halo',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Which alkyl halide reacts FASTEST via SN1 mechanism in aqueous acetone?',
    options: [
      '1-Bromobicyclo[2.2.1]heptane',
      'Benzyl bromide (C6H5CH2Br)',
      '1-Bromopropane',
      'Bromobenzene'
    ],
    correctIndex: 1,
    explanation:
      'Benzyl bromide forms a resonance-stabilized benzylic carbocation (C6H5CH2⁺) instantly. Bridgehead 1-bromobicyclo[2.2.1]heptane cannot flatten to sp² (Bredt’s rule), and bromobenzene cannot ionize.'
  },
  {
    id: 'oq-28',
    chapter: 'c12-halo',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'Reaction of Ethyl bromide with KCN gives [X] as major product, whereas with AgCN it gives [Y] as major product. [X] and [Y] respectively are:',
    options: [
      'Propanenitrile and Ethyl isocyanide',
      'Ethyl isocyanide and Propanenitrile',
      'Propanenitrile in both cases',
      'Ethane and Ethoxyethane'
    ],
    correctIndex: 0,
    explanation:
      'KCN is predominantly ionic and attacks through carbon to give Propanenitrile (CH3CH2CN). AgCN is covalent in nature so only the nitrogen lone pair is free to attack, yielding Ethyl isocyanide (CH3CH2NC).'
  },
  {
    id: 'oq-29',
    chapter: 'c12-alcohols',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'What happens when 2-methylpropan-2-ol (a 3° alcohol) vapors are passed over heated Copper at 573 K?',
    options: [
      '2-Methylpropanal is formed',
      '2-Methylpropan-2-one is formed',
      '2-Methylpropene (an alkene) is formed by dehydration',
      'No reaction occurs'
    ],
    correctIndex: 2,
    explanation:
      'Over Cu at 573 K, 1° alcohols dehydrogenate to aldehydes and 2° alcohols dehydrogenate to ketones. Because 3° alcohols have NO α-hydrogen, they undergo DEHYDRATION to give alkenes (2-methylpropene)!'
  },
  {
    id: 'oq-30',
    chapter: 'c12-alcohols',
    type: 'Multi-Step Roadmap',
    difficulty: 'Multi-Concept Rank Booster',
    question:
      'Identify [C] in the sequence:\nPhenol —(Zn dust, Δ)→ [A] —(CH3Cl / Anhyd. AlCl3)→ [B] —(Alkaline KMnO4, Δ then H3O⁺)→ [C]',
    options: [
      'Salicylic acid',
      'Benzoic acid',
      'Benzaldehyde',
      'Picric acid'
    ],
    correctIndex: 1,
    explanation:
      'Phenol + Zn dust → Benzene [A]. Friedel–Crafts methylation → Toluene [B]. Side-chain oxidation with KMnO4/KOH followed by H3O⁺ oxidizes toluene cleanly to Benzoic acid [C].'
  },
  {
    id: 'oq-31',
    chapter: 'c12-alcohols',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'Which alcohol gives IMMEDIATE turbidity at room temperature with Lucas reagent (Conc. HCl + Anhydrous ZnCl2) even though it is a primary (1°) alcohol?',
    options: [
      'Propan-1-ol',
      '2-Methylpropan-1-ol',
      'Benzyl alcohol (C6H5CH2OH)',
      'Ethanol'
    ],
    correctIndex: 2,
    explanation:
      'Lucas test relies on carbocation stability (SN1). Benzyl alcohol and allyl alcohol generate resonance-stabilized 1° carbocations, giving immediate turbidity just like 3° alcohols!'
  },
  {
    id: 'oq-32',
    chapter: 'c12-carbonyls',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'In the reaction of Semicarbazide (H2N–NH–C(=O)–NH2) with Acetone at pH 3.5, which nitrogen acts as the nucleophile?',
    options: [
      'The amide –NH2 directly attached to C=O',
      'The secondary –NH– attached to C=O',
      'The terminal –NH2 furthest from the C=O group',
      'All three nitrogens react equally'
    ],
    correctIndex: 2,
    explanation:
      'The lone pairs on the amide –NH2 and internal –NH– are delocalized into the C=O group by resonance, reducing their nucleophilicity. Only the terminal hydrazinic –NH2 is free to attack acetone!'
  },
  {
    id: 'oq-33',
    chapter: 'c12-carbonyls',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'Which reagent converts Pent-3-en-2-one or Methyl benzoate into an Aldehyde without reducing isolated C=C double bonds?',
    options: [
      'LiAlH4 in dry ether',
      'DIBAL-H at 195 K followed by H3O⁺',
      'H2 / Raney Ni',
      'Zn–Hg / Conc. HCl'
    ],
    correctIndex: 1,
    explanation:
      'DIBAL-H (Diisobutylaluminium hydride) at 195 K selectively reduces esters and nitriles to aldehydes while leaving isolated C=C double bonds untouched.'
  },
  {
    id: 'oq-34',
    chapter: 'c12-carbonyls',
    type: 'Assertion-Reason',
    difficulty: 'NEET Tricky Exception',
    question:
      'Assertion (A): Formic acid (HCOOH, pKa 3.75) is stronger than Benzoic acid (C6H5COOH, pKa 4.20) and Acetic acid (pKa 4.76).\nReason (R): In Benzoic acid, the phenyl ring exerts a +M resonance donation into the carbonyl carbon, whereas Formic acid lacks any electron-donating alkyl/aryl group.',
    options: [
      'Both A and R are true and R is the correct explanation of A',
      'Both A and R are true but R is NOT the correct explanation of A',
      'A is true but R is false',
      'Both A and R are false'
    ],
    correctIndex: 0,
    explanation:
      'Even though phenyl is sp² (–I), its cross-conjugation (+M donation into C=O) destabilizes the carboxylate slightly relative to HCOOH, making HCOOH > C6H5COOH > CH3COOH!'
  },
  {
    id: 'oq-35',
    chapter: 'c12-carbonyls',
    type: 'Multi-Step Roadmap',
    difficulty: 'Multi-Concept Rank Booster',
    question:
      'Identify [B] in the reaction:\n2 CH3CHO —(dil. NaOH, 293 K)→ [A] —(Δ, −H2O)→ [B]',
    options: [
      'Butan-2-ol',
      'But-2-enal (Crotonaldehyde)',
      '3-Hydroxybutanoic acid',
      'Pent-2-enal'
    ],
    correctIndex: 1,
    explanation:
      'Dilute NaOH triggers Aldol addition of two ethanal molecules to 3-hydroxybutanal [A]. Heating eliminates H2O via E1cb to form the conjugated α,β-unsaturated aldehyde But-2-enal (CH3–CH=CH–CHO) [B].'
  },
  {
    id: 'oq-36',
    chapter: 'c12-amines',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Consider the reaction of an optically active chiral amide (R)-2-phenylpropanamide with Br2 + 4 NaOH (Hofmann Bromamide Degradation). The product amine obtained is:',
    options: [
      'Racemic 1-phenylethanamine',
      '1-phenylethanamine with 100% INVERTED configuration',
      '1-phenylethanamine with 100% RETAINED configuration (and 1 fewer carbon)',
      '2-phenylethanamine with retained configuration'
    ],
    correctIndex: 2,
    explanation:
      'In the rate-determining step of Hofmann Bromamide Degradation, the migrating chiral group shifts intramolecularly with its bonding electron pair to nitrogen with 100% RETENTION of configuration, losing the carbonyl carbon as CO3²⁻.'
  },
  {
    id: 'oq-37',
    chapter: 'c12-amines',
    type: 'MCQ',
    difficulty: 'NCERT Direct',
    question:
      'Azo coupling of Benzene diazonium chloride with Phenol and with Aniline gives orange and yellow dyes respectively. What are the required pH conditions?',
    options: [
      'Strongly acidic (pH 1) for both',
      'Mildly alkaline (pH 9–10) for Phenol; mildly acidic (pH 4–5) for Aniline',
      'Mildly acidic (pH 4–5) for Phenol; mildly alkaline (pH 9–10) for Aniline',
      'Strongly basic (pH 14) for both'
    ],
    correctIndex: 1,
    explanation:
      'Phenol needs mildly alkaline pH 9–10 to generate the strongly activating phenoxide ion (PhO⁻). Aniline needs mildly acidic pH 4–5 (too acidic converts aniline to non-nucleophilic anilinium PhNH3⁺, while too basic turns ArN2⁺ into unreactive diazotate!).'
  },
  {
    id: 'oq-38',
    chapter: 'c11-goc',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Which of the following ortho-substituted benzoic acids is the STRONGEST acid (lowest pKa)?',
    options: [
      'Benzoic acid',
      'p-Methylbenzoic acid',
      'o-Methylbenzoic acid (o-Toluic acid)',
      'p-Methoxybenzoic acid'
    ],
    correctIndex: 2,
    explanation:
      'Due to the Ortho Effect, o-methylbenzoic acid (pKa 3.91) is STRONGER than Benzoic acid (pKa 4.20) despite CH3 being +I/+H! Steric crowding twists –COOH out of ring conjugation and stabilizes the carboxylate.'
  },
  {
    id: 'oq-39',
    chapter: 'c11-goc',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Among the following carbocations, which one has the HIGHEST stability?',
    options: [
      'Benzyl carbocation (C6H5CH2⁺)',
      'tert-Butyl carbocation ((CH3)3C⁺)',
      'Tropylium cation (Cycloheptatrienyl cation, C7H7⁺)',
      'Allyl carbocation (CH2=CH–CH2⁺)'
    ],
    correctIndex: 2,
    explanation:
      'The Tropylium cation (C7H7⁺) is planar, cyclic, fully conjugated, and possesses 6 π-electrons (4n + 2, n = 1) — making it AROMATIC across all 7 carbons!'
  },
  {
    id: 'oq-40',
    chapter: 'c12-biomolecules',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Which of the following statements regarding α-amino acids and proteins is INCORRECT?',
    options: [
      'Glycine is the only naturally occurring optically inactive α-amino acid',
      'At the isoelectric point (pI), an amino acid does not migrate toward either electrode',
      'Dipeptides give a positive violet color in the Biuret test',
      'All natural protein α-amino acids belong to the L-configuration'
    ],
    correctIndex: 2,
    explanation:
      'The Biuret test (CuSO4 + NaOH → violet color) requires AT LEAST TWO peptide bonds (i.e. a tripeptide or higher polypeptide). Dipeptides have only 1 peptide bond and give a NEGATIVE Biuret test!'
  },
  {
    id: 'oq-41',
    chapter: 'c12-carbonyls',
    type: 'Multi-Step Roadmap',
    difficulty: 'Multi-Concept Rank Booster',
    question:
      'Identify the major organic product [B] when Propanoic acid is treated with:\nCH3CH2COOH —(1. Br2 / Red P, 2. H2O)→ [A] —(alc. NH3, excess)→ [B]',
    options: [
      'Propanamide',
      'α-Alanine (2-Aminopropanoic acid)',
      'Ethylamine',
      'Prop-2-enoic acid'
    ],
    correctIndex: 1,
    explanation:
      'Step 1 (HVZ reaction): Propanoic acid + Br2 / Red P gives 2-bromopropanoic acid [A]. Step 2 (SN2 ammonolysis): Excess alc. NH3 replaces α-Br with –NH2 yielding the amino acid α-Alanine [B]!'
  },
  {
    id: 'oq-42',
    chapter: 'c12-alcohols',
    type: 'MCQ',
    difficulty: 'NEET Tricky Exception',
    question:
      'Which reagent can selectively oxidize Cinnamyl alcohol (Ph–CH=CH–CH2OH) to Cinnamaldehyde (Ph–CH=CH–CHO) without oxidizing saturated alcohols or cleaving C=C?',
    options: [
      'Hot acidic KMnO4',
      'MnO2 in acetone/CH2Cl2',
      'O3 followed by H2O2',
      'NaBH4 in methanol'
    ],
    correctIndex: 1,
    explanation:
      'Activated Manganese Dioxide (MnO2) is a classic chemoselective oxidant that oxidizes ONLY allylic and benzylic alcohols to aldehydes/ketones while leaving C=C and saturated –OH groups untouched!'
  }
];

