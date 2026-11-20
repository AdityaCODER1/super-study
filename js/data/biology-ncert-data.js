/**
 * NCERT Biology Deep-Understanding Dataset (Class 11 & 12 Botany & Zoology)
 * Grounded strictly in official NCERT Biology textbooks:
 *  - BIOLOGY_CHAPTER_CATALOG: All 32 NEET 2027 NCERT chapters
 *  - NCERT_CHAPTER_MODULES: Line-by-line NCERT sentences with Cloze & 4-layer "Between-the-Lines" insights
 *  - PRECONFIGURED_SETUPS: Interactive understanding labs (Respiration, Photosynthesis, Lac Operon, Human Physio, Cell Cycle)
 *  - WORD_SWAP_DRILLS: Rapid-fire "Spot the NCERT Word-Swap" traps
 *  - PATHWAY_SEQUENCES: Step-ordering challenges for biological cycles
 *  - CHAPTER_REVISION_SNAPSHOTS: Scannable NCERT numbers, scientists, enzymes & traps
 *  - BETWEEN_THE_LINES_QUESTIONS: Curated Assertion-Reason, Statement I/II & Perturbation MCQs
 */

export const BIOLOGY_CHAPTER_CATALOG = [
  // Class 11
  { id: 'bot-living-world', classLevel: 11, discipline: 'botany', unit: 'Diversity in Living World', label: 'Ch 1 (XI): The Living World', highYield: false, setupIds: [] },
  { id: 'bot-classification', classLevel: 11, discipline: 'botany', unit: 'Diversity in Living World', label: 'Ch 2 (XI): Biological Classification', highYield: true, setupIds: [] },
  { id: 'bot-plant-kingdom', classLevel: 11, discipline: 'botany', unit: 'Diversity in Living World', label: 'Ch 3 (XI): Plant Kingdom', highYield: true, setupIds: [] },
  { id: 'zoo-animal-kingdom', classLevel: 11, discipline: 'zoology', unit: 'Diversity in Living World', label: 'Ch 4 (XI): Animal Kingdom', highYield: true, setupIds: [] },
  { id: 'bot-morphology', classLevel: 11, discipline: 'botany', unit: 'Structural Organisation', label: 'Ch 5 (XI): Morphology of Flowering Plants', highYield: true, setupIds: [] },
  { id: 'bot-anatomy', classLevel: 11, discipline: 'botany', unit: 'Structural Organisation', label: 'Ch 6 (XI): Anatomy of Flowering Plants', highYield: true, setupIds: [] },
  { id: 'zoo-structural', classLevel: 11, discipline: 'zoology', unit: 'Structural Organisation', label: 'Ch 7 (XI): Structural Organisation in Animals', highYield: true, setupIds: [] },
  { id: 'bot-cell', classLevel: 11, discipline: 'botany', unit: 'Cell Structure & Function', label: 'Ch 8 (XI): Cell: The Unit of Life', highYield: true, setupIds: [] },
  { id: 'zoo-biomolecules', classLevel: 11, discipline: 'zoology', unit: 'Cell Structure & Function', label: 'Ch 9 (XI): Biomolecules', highYield: true, setupIds: [] },
  { id: 'bot-cell-cycle', classLevel: 11, discipline: 'botany', unit: 'Cell Structure & Function', label: 'Ch 10 (XI): Cell Cycle and Cell Division', highYield: true, setupIds: ['setup-cell-cycle'] },
  { id: 'bot-photosynthesis', classLevel: 11, discipline: 'botany', unit: 'Plant Physiology', label: 'Ch 11 (XI): Photosynthesis in Higher Plants', highYield: true, setupIds: ['setup-photosynthesis'] },
  { id: 'bot-respiration', classLevel: 11, discipline: 'botany', unit: 'Plant Physiology', label: 'Ch 12 (XI): Respiration in Plants', highYield: true, setupIds: ['setup-respiration'] },
  { id: 'bot-growth', classLevel: 11, discipline: 'botany', unit: 'Plant Physiology', label: 'Ch 13 (XI): Plant Growth and Development', highYield: true, setupIds: [] },
  { id: 'zoo-breathing', classLevel: 11, discipline: 'zoology', unit: 'Human Physiology', label: 'Ch 14 (XI): Breathing and Exchange of Gases', highYield: true, setupIds: ['setup-human-physio'] },
  { id: 'zoo-circulation', classLevel: 11, discipline: 'zoology', unit: 'Human Physiology', label: 'Ch 15 (XI): Body Fluids and Circulation', highYield: true, setupIds: ['setup-human-physio'] },
  { id: 'zoo-excretion', classLevel: 11, discipline: 'zoology', unit: 'Human Physiology', label: 'Ch 16 (XI): Excretory Products and their Elimination', highYield: true, setupIds: ['setup-human-physio'] },
  { id: 'zoo-locomotion', classLevel: 11, discipline: 'zoology', unit: 'Human Physiology', label: 'Ch 17 (XI): Locomotion and Movement', highYield: true, setupIds: ['setup-human-physio'] },
  { id: 'zoo-neural', classLevel: 11, discipline: 'zoology', unit: 'Human Physiology', label: 'Ch 18 (XI): Neural Control and Coordination', highYield: true, setupIds: ['setup-human-physio'] },
  { id: 'zoo-chemical', classLevel: 11, discipline: 'zoology', unit: 'Human Physiology', label: 'Ch 19 (XI): Chemical Coordination and Integration', highYield: true, setupIds: [] },
  // Class 12
  { id: 'bot-sexual-reproduction', classLevel: 12, discipline: 'botany', unit: 'Reproduction', label: 'Ch 1 (XII): Sexual Reproduction in Flowering Plants', highYield: true, setupIds: [] },
  { id: 'zoo-human-reproduction', classLevel: 12, discipline: 'zoology', unit: 'Reproduction', label: 'Ch 2 (XII): Human Reproduction', highYield: true, setupIds: [] },
  { id: 'zoo-reproductive-health', classLevel: 12, discipline: 'zoology', unit: 'Reproduction', label: 'Ch 3 (XII): Reproductive Health', highYield: false, setupIds: [] },
  { id: 'bot-inheritance', classLevel: 12, discipline: 'botany', unit: 'Genetics & Evolution', label: 'Ch 4 (XII): Principles of Inheritance and Variation', highYield: true, setupIds: ['setup-cell-cycle'] },
  { id: 'bot-molecular', classLevel: 12, discipline: 'botany', unit: 'Genetics & Evolution', label: 'Ch 5 (XII): Molecular Basis of Inheritance', highYield: true, setupIds: ['setup-lac-molecular'] },
  { id: 'zoo-evolution', classLevel: 12, discipline: 'zoology', unit: 'Genetics & Evolution', label: 'Ch 6 (XII): Evolution', highYield: true, setupIds: [] },
  { id: 'zoo-health', classLevel: 12, discipline: 'zoology', unit: 'Biology in Human Welfare', label: 'Ch 7 (XII): Human Health and Disease', highYield: true, setupIds: [] },
  { id: 'bot-microbes', classLevel: 12, discipline: 'botany', unit: 'Biology in Human Welfare', label: 'Ch 8 (XII): Microbes in Human Welfare', highYield: false, setupIds: [] },
  { id: 'zoo-biotech-principles', classLevel: 12, discipline: 'zoology', unit: 'Biotechnology', label: 'Ch 9 (XII): Biotechnology: Principles and Processes', highYield: true, setupIds: [] },
  { id: 'zoo-biotech-applications', classLevel: 12, discipline: 'zoology', unit: 'Biotechnology', label: 'Ch 10 (XII): Biotechnology and its Applications', highYield: true, setupIds: [] },
  { id: 'bot-organisms', classLevel: 12, discipline: 'botany', unit: 'Ecology', label: 'Ch 11 (XII): Organisms and Populations', highYield: true, setupIds: [] },
  { id: 'bot-ecosystem', classLevel: 12, discipline: 'botany', unit: 'Ecology', label: 'Ch 12 (XII): Ecosystem', highYield: true, setupIds: [] },
  { id: 'bot-biodiversity', classLevel: 12, discipline: 'botany', unit: 'Ecology', label: 'Ch 13 (XII): Biodiversity and Conservation', highYield: false, setupIds: [] }
];

export const NCERT_CHAPTER_MODULES = {
  'bot-respiration': [
    {
      id: 'resp-1',
      chapterId: 'bot-respiration',
      sectionTitle: '1. Do Plants Breathe?',
      ncertRef: 'NCERT Class XI · Respiration in Plants (Intro)',
      ncertText:
        'Yes, plants require O2 for respiration to occur and they also give out CO2. Plants have no specialised organs for gaseous exchange, but they have stomata and lenticels for this purpose.',
      clozeText:
        'Plants require {{O2}} for respiration and give out {{CO2}}. They lack specialised breathing organs, using {{stomata}} and {{lenticels}} for gaseous exchange.',
      betweenTheLines: {
        inference:
          'Unlike animals that circulate O2 via blood/respiratory pigments across long distances, every plant part takes care of its own gas-exchange needs because living cells lie close to the surface or air spaces.',
        mechanism:
          'Thin living parenchyma cells beneath bark/epidermis are interconnected by loose intercellular air spaces providing continuous diffusion paths.',
        neetTrap:
          'NTA asks why plants get along without respiratory organs — 3 NCERT reasons: (1) each plant part handles its own gas exchange, (2) low demand compared to animals, (3) distance for diffusion is small even in bulky stems (living cells are peripheral).',
        quantitative: 'Diffusion distance is short because living cells in stems/roots are organized in thin layers just beneath the surface.'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'glycolysis'
    },
    {
      id: 'resp-2',
      chapterId: 'bot-respiration',
      sectionTitle: '1. Do Plants Breathe?',
      ncertRef: 'NCERT Class XI · Respiration in Plants (ATP & Substrate Rule)',
      ncertText:
        'The compounds that are oxidised during this process are known as respiratory substrates. Usually carbohydrates are oxidised to release energy, but proteins, fats and even organic acids can be used as respiratory substrates in some plants, under certain conditions.',
      clozeText:
        'Usually {{carbohydrates}} are oxidised, but {{proteins}}, {{fats}} and even {{organic acids}} can serve as respiratory substrates under certain conditions.',
      betweenTheLines: {
        inference:
          'Energy inside food is NOT released in a single explosive step; stepwise enzyme-controlled oxidation traps energy as ATP while preventing thermal destruction of the cell.',
        mechanism:
          'Fats enter via glycerol (DHAP) and fatty acids (Acetyl-CoA); proteins enter after deamination into pyruvate, Acetyl-CoA, or Krebs intermediates.',
        neetTrap:
          'NCERT explicitly highlights: "ATP acts as the energy currency of the cell" AND "All the energy contained in respiratory substrates is NOT released free into the cell, or in a single step."',
        quantitative: 'Order of preference in normal physiology: Carbohydrates → Fats → Proteins (only during prolonged starvation).'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'amphibolic'
    },
    {
      id: 'resp-3',
      chapterId: 'bot-respiration',
      sectionTitle: '2. Glycolysis (EMP Pathway)',
      ncertRef: 'NCERT Class XI · Glycolysis',
      ncertText:
        'The scheme of glycolysis was given by Gustav Embden, Otto Meyerhof, and J. Parnas, and is often referred to as the EMP pathway. In anaerobic organisms, it is the only process in respiration.',
      clozeText:
        'Glycolysis was given by {{Embden, Meyerhof, and Parnas}} ({{EMP}} pathway). In {{anaerobic}} organisms, it is the {{only}} process in respiration.',
      betweenTheLines: {
        inference:
          'Even before O2 accumulated on early Earth, primitive cells evolved cytoplasmic glycolysis. That is why every living organism—prokaryote or eukaryote—runs EMP.',
        mechanism:
          'Glycolysis occurs in the cytoplasm (cytosol) and does NOT require molecular O2 at any of its 10 enzymatic steps.',
        neetTrap:
          'Watch the word "only": in anaerobic organisms, EMP + fermentation (which regenerates NAD+) is the sole energy pathway; it does NOT occur in mitochondria.',
        quantitative: '1 Glucose (6C) → 2 Pyruvic Acid (3C) | CO2 released = 0 | O2 consumed = 0.'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'glycolysis'
    },
    {
      id: 'resp-4',
      chapterId: 'bot-respiration',
      sectionTitle: '2. Glycolysis (EMP Pathway)',
      ncertRef: 'NCERT Class XI · Sucrose Entry & Payoff Phase',
      ncertText:
        'In plants, glucose is derived from sucrose, which is the end product of photosynthesis, or from storage carbohydrates. Sucrose is converted into glucose and fructose by the enzyme invertase, and these two monosaccharides readily enter the glycolytic pathway.',
      clozeText:
        'In plants, {{sucrose}} is converted into {{glucose}} and {{fructose}} by the enzyme {{invertase}}, and both readily enter glycolysis via phosphorylation by {{hexokinase}}.',
      betweenTheLines: {
        inference:
          'Because sucrose (a disaccharide) is the phloem transport sugar in plants, plant glycolysis starts with an extra invertase cleavage step before hexokinase phosphorylates BOTH hexoses.',
        mechanism:
          'Hexokinase transfers a phosphate from ATP to Glucose → Glucose-6-P (and Fructose → Fructose-6-P) to trap the sugar inside the cell and raise its chemical reactivity.',
        neetTrap:
          'Question trap: "How many net ATP are formed from 1 molecule of SUCROSE in glycolysis?" Since 1 sucrose yields 2 hexoses (glucose + fructose), net glycolytic ATP = 2 × 2 = 4 ATP (and 4 NADH)!',
        quantitative: 'Per Glucose: ATP used at Hexokinase (step 1) & PFK (step 3) = 2 ATP; ATP produced at 1,3-BPG → 3-PGA (×2) & PEP → Pyruvate (×2) = 4 ATP; Net = 2 ATP + 2 NADH.'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'glycolysis'
    },
    {
      id: 'resp-5',
      chapterId: 'bot-respiration',
      sectionTitle: '2. Glycolysis (EMP Pathway)',
      ncertRef: 'NCERT Class XI · Glycolysis Redox & Substrate-Level Phosphorylation',
      ncertText:
        'Conversion of BPGA to 3-phosphoglyceric acid (PGA) is an energy-yielding process; this energy is trapped by the formation of ATP. Another ATP is synthesised during the conversion of PEP to pyruvic acid.',
      clozeText:
        'Direct ATP synthesis occurs during {{1,3-BPGA → 3-PGA}} and {{PEP → pyruvic acid}}, while {{NADH + H+}} is formed when {{PGAL (3C)}} is oxidised to 1,3-BPGA.',
      betweenTheLines: {
        inference:
          'Look at the oxidation step (PGAL → 1,3-BPGA): inorganic phosphate (H3PO4 / Pi), NOT ATP, donates the second phosphate! That is why an oxidation step can create a high-energy acyl-phosphate bond for free.',
        mechanism:
          'PGAL dehydrogenase oxidises the aldehyde of PGAL using NAD+ and adds inorganic phosphate (Pi) to form 1,3-bisphosphoglycerate (1,3-BPGA), which then donates a phosphate to ADP.',
        neetTrap:
          'Classic NCERT diagram trap: Triose phosphate (3-PGAL) splits from Fructose-1,6-bisphosphate (6C) alongside DHAP (3C), which interconverts to PGAL — so every payoff reaction runs TWICE per glucose!',
        quantitative: '2 × (1 NADH + 2 ATP produced) minus 2 ATP invested = 2 Net ATP + 2 NADH + 2 H+.'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'glycolysis'
    },
    {
      id: 'resp-6',
      chapterId: 'bot-respiration',
      sectionTitle: '3. Fermentation',
      ncertRef: 'NCERT Class XI · Alcoholic & Lactic Acid Fermentation',
      ncertText:
        'In fermentation, say by yeast, the incomplete oxidation of glucose is achieved under anaerobic conditions by sets of reactions where pyruvic acid is converted to CO2 and ethanol. The enzymes, pyruvic acid decarboxylase and alcohol dehydrogenase catalyse these reactions.',
      clozeText:
        'In yeast fermentation, pyruvic acid is converted to {{CO2}} and {{ethanol}} by {{pyruvic acid decarboxylase}} and {{alcohol dehydrogenase}}. Yeasts poison themselves to death when alcohol concentration reaches about {{13%}}.',
      betweenTheLines: {
        inference:
          'WHY does a cell bother converting pyruvate to lactate or ethanol if those reactions yield ZERO ATP? Because glycolysis would immediately stall if all cytosolic NAD+ got locked up as NADH + H+!',
        mechanism:
          'Fermentation exists purely to re-oxidise NADH + H+ back into NAD+ using pyruvate (lactic acid fermentation) or acetaldehyde (alcoholic fermentation) as the terminal electron acceptor.',
        neetTrap:
          'Compare the two fermentations carefully: (1) Lactic acid fermentation (muscles / Lactobacillus) releases NO CO2! (2) Alcoholic fermentation (yeast) releases CO2. (3) NCERT states less than 7% of glucose energy is released, and yeast poisons itself at ~13% alcohol.',
        quantitative: 'Net ATP per glucose in BOTH fermentations = 2 ATP | Energy captured < 7% of total glucose energy | Yeast lethal alcohol threshold ≈ 13%.'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'fermentation'
    },
    {
      id: 'resp-7',
      chapterId: 'bot-respiration',
      sectionTitle: '4. Aerobic Respiration & Krebs Cycle',
      ncertRef: 'NCERT Class XI · Link Reaction (Oxidative Decarboxylation)',
      ncertText:
        'Pyruvate, which is formed by the glycolytic catabolism of carbohydrates in the cytosol, after it enters mitochondrial matrix undergoes oxidative decarboxylation by a complex set of reactions catalysed by pyruvic dehydrogenase.',
      clozeText:
        'After entering the {{mitochondrial matrix}}, pyruvate undergoes {{oxidative decarboxylation}} catalysed by {{pyruvic dehydrogenase}}, which requires {{Mg2+}} and {{coenzyme A}}.',
      betweenTheLines: {
        inference:
          'Pyruvate must cross both outer and inner mitochondrial membranes into the matrix before decarboxylation. Notice it is BOTH oxidised (NAD+ → NADH + H+) AND decarboxylated (loses 1 CO2) simultaneously.',
        mechanism:
          '2 Pyruvate (3C) + 2 CoA + 2 NAD+ —(Pyruvate dehydrogenase, Mg²⁺)→ 2 Acetyl-CoA (2C) + 2 CO2 + 2 NADH + 2 H+.',
        neetTrap:
          'NEET loves asking: "Which cofactors are required for the Link Reaction?" Answer: Coenzyme A, NAD+, and Mg2+ ion. Also note Acetyl-CoA is the common gateway molecule connecting carbs, fats, and proteins.',
        quantitative: 'Per glucose (2 Pyruvates): 2 CO2 released + 2 NADH + H+ formed; 0 direct ATP.'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'krebs'
    },
    {
      id: 'resp-8',
      chapterId: 'bot-respiration',
      sectionTitle: '4. Aerobic Respiration & Krebs Cycle',
      ncertRef: 'NCERT Class XI · Tricarboxylic Acid (TCA) Cycle',
      ncertText:
        'The TCA cycle starts with the condensation of acetyl group with oxaloacetic acid (OAA) and water to yield citric acid. During the conversion of succinyl-CoA to succinic acid a molecule of GTP is synthesised. This is a substrate level phosphorylation.',
      clozeText:
        'Acetyl-CoA (2C) condenses with {{OAA (4C)}} and water via {{citrate synthase}} to form {{citric acid (6C)}}. Conversion of {{succinyl-CoA}} to succinic acid yields {{GTP}} via substrate-level phosphorylation.',
      betweenTheLines: {
        inference:
          'Although Krebs Cycle does not use O2 directly in any reaction, it IMMEDIATELY stops under anaerobic conditions because Matrix NADH and FADH2 cannot be re-oxidised back to NAD+ and FAD without ETS + O2!',
        mechanism:
          'Count the carbon drops per turn: Citrate (6C) → α-Ketoglutarate (5C, loses 1st CO2 + 1st NADH) → Succinyl-CoA (4C, loses 2nd CO2 + 2nd NADH) → Succinic acid (4C, 1 GTP) → Fumarate (4C, 1 FADH2) → Malate (4C) → OAA (4C, 3rd NADH).',
        neetTrap:
          'Super high-yield trap: Every TCA enzyme is soluble in the mitochondrial matrix EXCEPT Succinate Dehydrogenase, which is embedded in the Inner Mitochondrial Membrane (Complex II of ETS)!',
        quantitative: 'Per turn (1 Acetyl-CoA): 3 NADH, 1 FADH2, 1 GTP, 2 CO2. Per Glucose (2 turns): 6 NADH, 2 FADH2, 2 GTP, 4 CO2.'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'krebs'
    },
    {
      id: 'resp-9',
      chapterId: 'bot-respiration',
      sectionTitle: '5. Electron Transport System (ETS) & Oxidative Phosphorylation',
      ncertRef: 'NCERT Class XI · ETS Complexes I–IV & Oxygen',
      ncertText:
        'Although the aerobic process of respiration takes place only in the presence of oxygen, the role of oxygen is limited to the terminal stage of the process. Yet, the presence of oxygen is vital, since it drives the whole process by removing hydrogen from the system. Oxygen acts as the final hydrogen acceptor.',
      clozeText:
        'Oxygen acts as the {{final hydrogen (electron) acceptor}} at Complex IV ({{cytochrome c oxidase}}). {{Ubiquinone}} receives reducing equivalents from both Complex I ({{NADH dehydrogenase}}) and Complex II ({{succinate dehydrogenase}}).',
      betweenTheLines: {
        inference:
          'Oxygen never touches glucose, pyruvate, or citrate! Yet without O2 at Complex IV to form H2O, electrons back up all the way through Cyt c → Complex III → UQ → Complexes I & II, choking Krebs Cycle and Link Reaction.',
        mechanism:
          'Complex I (NADH dehydrogenase, FMN + Fe-S) & Complex II (Succinate dehydrogenase, FAD) both reduce Ubiquinone (UQ → UQH2). UQH2 feeds Complex III (Cytochrome bc1) → Cytochrome c (mobile small protein on outer surface of IMM) → Complex IV (Cyt a + a3 + 2 Cu centres) → ½ O2 + 2H+ → H2O.',
        neetTrap:
          'Memorize exact NCERT locations: Cytochrome c is a small protein attached to the OUTER surface of the inner membrane (acting as a mobile carrier between Complex III and IV). Complex IV has TWO copper centres (CuA and CuB) plus cytochromes a and a3.',
        quantitative: '1 NADH + H+ → 3 ATP (oxidised via Complex I, III, IV) | 1 FADH2 → 2 ATP (enters at Complex II, bypassing Complex I proton pumping).'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'ets'
    },
    {
      id: 'resp-10',
      chapterId: 'bot-respiration',
      sectionTitle: '5. Electron Transport System (ETS) & Oxidative Phosphorylation',
      ncertRef: 'NCERT Class XI · Complex V (ATP Synthase) Chemiosmosis',
      ncertText:
        'The F1 headpiece is a peripheral membrane protein complex and contains the site for synthesis of ATP from ADP and inorganic phosphate. F0 is an integral membrane protein complex that forms the channel through which protons cross the inner membrane. For each ATP produced, 4H+ passes through F0 from the intermembrane space to the matrix down the electrochemical proton gradient.',
      clozeText:
        '{{F1}} is a peripheral membrane complex facing the {{matrix}} where ATP is synthesised, whereas {{F0}} is an integral channel. For each ATP produced, {{4 H+}} pass from the {{intermembrane space}} to the matrix.',
      betweenTheLines: {
        inference:
          'Compare mitochondrial vs chloroplast chemiosmosis! In mitochondria, protons are pumped FROM matrix TO intermembrane space (high H+ in IMS); in chloroplasts, protons accumulate inside the thylakoid LUMEN.',
        mechanism:
          'Proton motive force drives conformational rotation in F1 as 4 H+ flow down their electrochemical gradient from intermembrane space back into the matrix.',
        neetTrap:
          'Note NCERT edition update carefully: Latest NCERT explicitly says 4 H+ pass through F0 per ATP synthesised (older texts said 2 H+). Also F1 faces the matrix, NOT the intermembrane space!',
        quantitative: 'Latest NCERT: 4 H+ through F0 → 1 ATP | 1 NADH pumps ~10 H+ (~3 ATP); 1 FADH2 pumps ~6 H+ (~2 ATP).'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'ets'
    },
    {
      id: 'resp-11',
      chapterId: 'bot-respiration',
      sectionTitle: '6. Respiratory Balance Sheet & 7. Amphibolic Pathway',
      ncertRef: 'NCERT Class XI · Balance Sheet & Amphibolic Nature',
      ncertText:
        'There can be a net gain of 38 ATP molecules during aerobic respiration of one molecule of glucose. Because the respiratory pathway is involved in both anabolism and catabolism, it would hence be better to consider the respiratory pathway as an amphibolic pathway rather than as a catabolic one.',
      clozeText:
        'Theoretical net gain per glucose is {{38 ATP}} (or 36 with shuttle). Because respiration supplies intermediates for both breakdown and synthesis, it is an {{amphibolic}} pathway.',
      betweenTheLines: {
        inference:
          'Why is 38 ATP an "idealized paper calculation"? NCERT lists 4 assumptions: (1) sequential orderly pathway, (2) NADH from glycolysis enters mitochondria and undergoes oxidative phosphorylation, (3) NO intermediates are withdrawn for anabolism, (4) ONLY glucose is being respired.',
        mechanism:
          'In real living cells, pathways operate simultaneously: Acetyl-CoA is pulled out to make fatty acids/gibberellins, Succinyl-CoA for chlorophyll/cytochromes, and α-KG/OAA for amino acids.',
        neetTrap:
          'Watch the Assertion-Reason question: "Respiration is purely catabolic" → FALSE! Breaking down fatty acids to Acetyl-CoA is catabolism, while withdrawing Acetyl-CoA to synthesize fatty acids is anabolism → hence AMPHIBOLIC.',
        quantitative: '38 ATP breakdown: Glycolysis (2 direct + 2 NADH×3 = 8) + Link (2 NADH×3 = 6) + Krebs (2 GTP + 6 NADH×3 + 2 FADH2×2 = 24) = 38 ATP total.'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'amphibolic'
    },
    {
      id: 'resp-12',
      chapterId: 'bot-respiration',
      sectionTitle: '8. Respiratory Quotient (RQ)',
      ncertRef: 'NCERT Class XI · RQ Formula & Values',
      ncertText:
        'The ratio of the volume of CO2 evolved to the volume of O2 consumed in respiration is called the respiratory quotient (RQ) or respiratory ratio. When carbohydrates are used as substrate and are completely oxidised, the RQ will be 1. When fats are used in respiration, the RQ is less than 1. When proteins are respiratory substrates the ratio would be about 0.9.',
      clozeText:
        'RQ = Volume of {{CO2 evolved}} / Volume of {{O2 consumed}}. RQ is {{1}} for carbohydrates, {{0.7}} (less than 1) for tripalmitin fat, and about {{0.9}} for proteins.',
      betweenTheLines: {
        inference:
          'WHY is RQ < 1 for fats like Tripalmitin (C51H98O6)? Because fats are oxygen-poor compared to carbohydrates, so oxidizing them requires extra external O2 relative to the CO2 released!',
        mechanism:
          'Tripalmitin equation in NCERT: 2(C51H98O6) + 145 O2 → 102 CO2 + 98 H2O + energy ⇒ RQ = 102 / 145 = 0.7.',
        neetTrap:
          'Common NEET twists: Anaerobic respiration has RQ = ∞ (CO2 evolved / 0 O2 consumed); Succulent plants at night (CAM) have RQ = 0 (take in O2 without releasing CO2); Organic acids (malic/oxalic acid) have RQ > 1.',
        quantitative: 'Glucose: 6CO2/6O2 = 1.0 | Tripalmitin: 102/145 = 0.7 | Proteins: ~0.9 | Organic acids: >1 | Anaerobic: ∞.'
      },
      linkedSetupId: 'setup-respiration',
      linkedSetupStage: 'amphibolic'
    }
  ],

  'bot-photosynthesis': [
    {
      id: 'photo-1',
      chapterId: 'bot-photosynthesis',
      sectionTitle: '11.4–11.6 Light Reaction & Electron Transport',
      ncertRef: 'NCERT Class XI · Z-Scheme & Water Splitting',
      ncertText:
        'The splitting of water is associated with the PS II; water is split into 2H+, [O] and electrons. This creates oxygen, one of the net products of photosynthesis. The electrons needed to replace those removed from photosystem I are provided by photosystem II.',
      clozeText:
        'Water splitting is associated with {{PS II}} on the {{inner (lumen)}} side of the thylakoid membrane. Electrons removed from {{PS I (P700)}} are replaced by {{PS II (P680)}}.',
      betweenTheLines: {
        inference:
          'PS II sits physically on the inner side of the thylakoid membrane so that water splitting dumps H+ directly into the thylakoid LUMEN—building half the proton gradient before the electron even moves!',
        mechanism:
          'P680 absorbs 680 nm → Pheophytin → Plastoquinone (PQ picks up stromal H+ and drops it into lumen) → Cyt b6f → Plastocyanin (PC, inner lumen side) → P700 → Ferredoxin (Fd) → NADP+ reductase (stromal side).',
        neetTrap:
          'Location traps in NEET: Water-splitting complex = inner lumen side of PS II; NADP+ reductase = outer STROMA side of thylakoid membrane (consumes stromal H+, lowering stromal H+ and raising lumen H+!).',
        quantitative: '2 H2O → 4 H+ + O2 + 4 e⁻ | Cyclic photophosphorylation uses ONLY PS I (P700), happens in stroma lamellae, yields ONLY ATP (no NADPH, no O2).'
      },
      linkedSetupId: 'setup-photosynthesis',
      linkedSetupStage: 'z-scheme'
    },
    {
      id: 'photo-2',
      chapterId: 'bot-photosynthesis',
      sectionTitle: '11.6.3 Chemiosmotic Hypothesis',
      ncertRef: 'NCERT Class XI · Proton Gradient in Chloroplasts',
      ncertText:
        'In chloroplasts, protons in the stroma decrease in number, while in the lumen there is accumulation of protons. This creates a proton gradient across the thylakoid membrane as well as a measurable decrease in pH in the lumen.',
      clozeText:
        'In chloroplasts, protons accumulate in the {{thylakoid lumen}} causing a measurable decrease in {{lumen pH}}. Protons exit via {{CF0}} down the gradient into the {{stroma}} to drive ATP synthesis by CF1.',
      betweenTheLines: {
        inference:
          'THREE distinct mechanisms create the chloroplast proton gradient: (1) water splitting inside lumen, (2) PQ transferring H+ from stroma to lumen during electron transport, (3) NADP+ reductase consuming stromal H+ to form NADPH + H+.',
        mechanism:
          'Breakdown of the proton gradient via CF0 transmembrane channel triggers conformational change in the stromal-facing CF1 particle to synthesize ATP.',
        neetTrap:
          'Contrast carefully: Respiration accumulates H+ in the mitochondrial INTERMEMBRANE SPACE; Photosynthesis accumulates H+ inside the THYLAKOID LUMEN (low pH)!',
        quantitative: 'Stroma lamellae lack PS II and NADP reductase enzyme — hence only cyclic photophosphorylation occurs there.'
      },
      linkedSetupId: 'setup-photosynthesis',
      linkedSetupStage: 'chemiosmosis'
    },
    {
      id: 'photo-3',
      chapterId: 'bot-photosynthesis',
      sectionTitle: '11.7 Calvin Cycle (C3) & 11.8 C4 Hatch-Slack Pathway',
      ncertRef: 'NCERT Class XI · RuBisCO, Regeneration & Kranz Anatomy',
      ncertText:
        'For every CO2 molecule entering the Calvin cycle, 3 molecules of ATP and 2 of NADPH are required. In C4 plants, the bundle sheath cells are rich in an enzyme Ribulose bisphosphate carboxylase-oxygenase (RuBisCO), but lack PEPcase.',
      clozeText:
        'Per CO2 fixed in Calvin cycle: {{3 ATP}} and {{2 NADPH}} are used (so {{18 ATP}} and {{12 NADPH}} per glucose). In C4 plants, mesophyll has {{PEPcase}} (lacks RuBisCO) while bundle sheath has {{RuBisCO}} (lacks PEPcase).',
      betweenTheLines: {
        inference:
          'Why do C4 plants invest 2 EXTRA ATP per CO2 fixed (total 5 ATP + 2 NADPH per CO2 vs 3 ATP + 2 NADPH in C3)? Because pumping C4 malate/aspartate concentrates CO2 around RuBisCO inside thick-walled bundle sheath cells, virtually eliminating wasteful photorespiration!',
        mechanism:
          'C3 RuBP (5C) + CO2 → 2 × 3-PGA (3C). C4 PEP (3C) + HCO3⁻ —(PEPcase, zero oxygenase activity)→ OAA (4C) → Malate → transported to Bundle Sheath → decarboxylated to release CO2 for Calvin Cycle + 3C Pyruvate returned to Mesophyll (costs 2 ATP equivalents to regenerate PEP).',
        neetTrap:
          'Critical enzyme-compartment rule: Mesophyll cells of C4 plants LACK RuBisCO; Bundle Sheath cells LACK PEPcase! C3 plants suffer photorespiration (C2 cycle across Chloroplast → Peroxisome → Mitochondria) under high O2, high light, and high temp.',
        quantitative: '1 Glucose (6 turns): C3 costs 18 ATP + 12 NADPH | C4 costs 30 ATP + 12 NADPH (12 extra ATP for PEP regeneration).'
      },
      linkedSetupId: 'setup-photosynthesis',
      linkedSetupStage: 'c3-c4'
    }
  ],

  'bot-molecular': [
    {
      id: 'mol-1',
      chapterId: 'bot-molecular',
      sectionTitle: '5.4–5.5 Replication & Transcription Polarity',
      ncertRef: 'NCERT Class XII · DNA Polymerase Polarity & Transcription Unit',
      ncertText:
        'The DNA-dependent DNA polymerases catalyse polymerisation only in one direction, that is 5′→3′. Both the strands of DNA are not copied during transcription because if both strands act as a template, they would code for RNA molecule with different sequences, and simultaneously produced complementary dsRNA would prevent translation.',
      clozeText:
        'DNA polymerase polymerises ONLY in {{5′→3′}} direction (continuous on {{3′→5′}} template, discontinuous Okazaki fragments on {{5′→3′}} template). In transcription, the {{3′→5′}} strand acts as {{template strand}} while the {{5′→3′}} strand is the {{coding strand}}.',
      betweenTheLines: {
        inference:
          'WHY is the strand that is NOT copied called the "coding strand"? Because its sequence (except T replaced by U) is IDENTICAL to the newly synthesized mRNA!',
        mechanism:
          'Promoter sits at the 5′-end (upstream) of the coding strand (3′-end of template strand); Terminator sits at the 3′-end (downstream) of the coding strand.',
        neetTrap:
          'Super-common NEET polarity trap: "All reference points while defining a transcription unit are made with the CODING strand (5′→3′)!" And in Eukaryotes: RNA Pol I transcribes rRNAs (28S, 18S, 5.8S); RNA Pol II transcribes hnRNA; RNA Pol III transcribes tRNA, 5srRNA, and snRNAs.',
        quantitative: 'Human haploid genome: 3.3 × 10^9 bp | Diploid: 6.6 × 10^9 bp (length ≈ 2.2 m) | Nucleosome wraps ~200 bp around histone octamer.'
      },
      linkedSetupId: 'setup-lac-molecular',
      linkedSetupStage: 'polarity'
    },
    {
      id: 'mol-2',
      chapterId: 'bot-molecular',
      sectionTitle: '5.8 Regulation of Gene Expression — The Lac Operon',
      ncertRef: 'NCERT Class XII · Jacob and Monod Lac Operon',
      ncertText:
        'In the presence of an inducer, such as lactose or allolactose, the repressor is inactivated by interaction with the inducer. This allows RNA polymerase access to the promoter and transcription proceeds. Regulation of lac operon by repressor is referred to as negative regulation.',
      clozeText:
        'The {{i gene}} synthesises the repressor constitutively. In the presence of {{lactose (allolactose)}}, the repressor is inactivated so RNA polymerase transcribes {{z (β-galactosidase)}}, {{y (permease)}}, and {{a (transacetylase)}}. This repressor control is {{negative regulation}}.',
      betweenTheLines: {
        inference:
          'WAIT — if β-galactosidase and permease are needed to bring lactose in and make allolactose, how does lactose ever enter the cell when the operon is OFF? There is always a very low basal (leaky) level of expression keeping a few permease molecules in the membrane!',
        mechanism:
          'i gene → Repressor mRNA → Active Repressor tetramer → binds Operator (o) in absence of lactose, physically blocking RNA Polymerase at Promoter (p). Inducer (lactose/allolactose) binds Repressor → conformational change → cannot bind Operator → polycistronic mRNA (z, y, a) translated.',
        neetTrap:
          'Look closely at the word "i": i stands for INHIBITOR (repressor), NOT inducer! Also remember: NCERT states "Regulation of lac operon by repressor is NEGATIVE regulation", though it is also under positive control (CAP-cAMP when glucose is absent).',
        quantitative: '3 structural genes on 1 polycistronic mRNA: z (β-gal: lactose → galactose + glucose), y (permease: increases β-galactoside permeability), a (transacetylase).'
      },
      linkedSetupId: 'setup-lac-molecular',
      linkedSetupStage: 'lac-operon'
    }
  ],

  'bot-cell-cycle': [
    {
      id: 'cc-1',
      chapterId: 'bot-cell-cycle',
      sectionTitle: '10.1 Phases of Cell Cycle (2n / 2C → 4C)',
      ncertRef: 'NCERT Class XI · Interphase S Phase Ploidy Rule',
      ncertText:
        'During S phase, the amount of DNA per cell doubles. If the initial amount of DNA is denoted as 2C then it increases to 4C. However, there is no increase in the chromosome number; if the cell had diploid or 2n number of chromosomes at G1, even after S phase the number of chromosomes remains the same, i.e., 2n.',
      clozeText:
        'During {{S phase}}, DNA content doubles ({{2C → 4C}}), while chromosome number stays {{unchanged (2n → 2n)}}. In animal cells, {{centriole}} also duplicates in the {{cytoplasm}} during S phase.',
      betweenTheLines: {
        inference:
          'Why does DNA double while chromosome count stays 2n? Because each chromosome converts from a 1-chromatid structure into a 2-sister-chromatid chromosome joined at ONE centromere (we count chromosomes by centromeres!).',
        mechanism:
          'At Mitosis Anaphase, centromeres split and sister chromatids separate—restoring 2n and 2C per daughter cell. At Meiosis I Anaphase, homologous chromosomes separate (centromeres DO NOT split!), yielding n chromosomes with 2C DNA!',
        neetTrap:
          'Classic NEET numerical trap: If a meiocyte at G1 has 2n = 16 chromosomes and 20 pg DNA (2C), then at G2: 16 chromosomes, 40 pg DNA; after Meiosis I: 8 chromosomes, 20 pg DNA; after Meiosis II: 8 chromosomes, 10 pg DNA!',
        quantitative: 'G1: 2n, 2C | G2: 2n, 4C | After Meiosis I: n, 2C | After Meiosis II: n, 1C | Interphase occupies >95% of cell cycle.'
      },
      linkedSetupId: 'setup-cell-cycle',
      linkedSetupStage: 'interphase'
    },
    {
      id: 'cc-2',
      chapterId: 'bot-cell-cycle',
      sectionTitle: '10.4 Meiosis I — Prophase I Substages',
      ncertRef: 'NCERT Class XI · Leptotene to Diakinesis',
      ncertText:
        'Synapsis occurs in zygotene accompanied by the formation of synaptonemal complex. Crossing over occurs during pachytene catalysed by the enzyme recombinase. Diplotene is recognised by the dissolution of the synaptonemal complex and X-shaped chiasmata. Diakinesis is marked by terminalisation of chiasmata.',
      clozeText:
        'Synapsis & synaptonemal complex: {{Zygotene}}. Crossing over via {{recombinase}} & recombination nodules: {{Pachytene}}. Dissolution of synaptonemal complex & {{chiasmata}}: {{Diplotene}}. {{Terminalisation}} of chiasmata: {{Diakinesis}}.',
      betweenTheLines: {
        inference:
          'Notice the exact cause-and-effect sequence: chromosomes must first pair (Zygotene bivalent/tetrad) BEFORE non-sister chromatids can exchange segments (Pachytene), and only when the protein scaffold dissolves (Diplotene) can you physically see the X-shaped crossover points (chiasmata)!',
        mechanism:
          'In oocytes of some vertebrates, Diplotene can last for months or years (dictyotene arrest).',
        neetTrap:
          'Do NOT mix up: Bivalent/tetrad forms in Zygotene, becomes clearly visible as a tetrad in Pachytene, and chiasmata become visible in Diplotene. Centromeres split in Mitosis Anaphase and Meiosis II Anaphase — NEVER in Meiosis I Anaphase!',
        quantitative: '5 substages in strict order: Leptotene → Zygotene → Pachytene → Diplotene → Diakinesis.'
      },
      linkedSetupId: 'setup-cell-cycle',
      linkedSetupStage: 'prophase1'
    }
  ],

  'zoo-circulation': [
    {
      id: 'circ-1',
      chapterId: 'zoo-circulation',
      sectionTitle: '15.3.2 Cardiac Cycle & 15.3.3 ECG',
      ncertRef: 'NCERT Class XI · Body Fluids & Circulation',
      ncertText:
        'Atrial systole increases the flow of blood into the ventricles by about 30 per cent. Each cardiac cycle lasts 0.8 seconds and stroke volume is approximately 70 mL. On an ECG, the P-wave represents depolarisation of the atria, QRS complex represents depolarisation of ventricles, and T-wave represents repolarisation of ventricles.',
      clozeText:
        'Atrial systole adds {{30%}} of ventricular filling (the other {{70%}} flows passively during joint diastole). One cardiac cycle = {{0.8 s}}, Stroke volume = {{70 mL}}, Cardiac Output ≈ {{5000 mL (5 L/min)}}.',
      betweenTheLines: {
        inference:
          'Because 70% of ventricular blood already enters passively during Joint Diastole (0.4 s) when AV valves are open, atrial contraction merely "tops off" the last 30%!',
        mechanism:
          'First heart sound (Lub) occurs at the START of ventricular systole when AV (tricuspid + bicuspid) valves slam shut. Second heart sound (Dub) occurs at the START of ventricular diastole when Semilunar valves slam shut.',
        neetTrap:
          'ECG-to-mechanical-event trap: Ventricular contraction starts shortly AFTER Q wave (marking beginning of systole), while the END of the T-wave marks the END of ventricular systole. Counting QRS complexes gives heart rate!',
        quantitative: 'Atrial systole: 0.1 s | Ventricular systole: 0.3 s | Joint diastole: 0.4 s | CO = HR (72) × SV (70 mL) = 5040 mL/min.'
      },
      linkedSetupId: 'setup-human-physio',
      linkedSetupStage: 'cardiac'
    }
  ],

  'zoo-excretion': [
    {
      id: 'exc-1',
      chapterId: 'zoo-excretion',
      sectionTitle: '16.4 Mechanism of Concentration of Filtrate',
      ncertRef: 'NCERT Class XI · Counter-Current Mechanism',
      ncertText:
        'The proximity between the Henle’s loop and vasa recta, as well as the counter current in them help in maintaining an increasing osmolarity towards the inner medullary interstitium, i.e., from 300 mOsmolL⁻¹ in the cortex to about 1200 mOsmolL⁻¹ in the inner medulla. This gradient is mainly caused by NaCl and urea.',
      clozeText:
        'Medullary osmolarity rises from {{300 mOsmolL⁻¹}} in cortex to {{1200 mOsmolL⁻¹}} in inner medulla, mainly due to {{NaCl}} and {{urea}}. The descending limb of Loop of Henle is permeable to {{water}} and almost impermeable to electrolytes, whereas the ascending limb is impermeable to {{water}}.',
      betweenTheLines: {
        inference:
          'Why is the descending limb passive to water while the ascending limb actively/passively transports NaCl out without water? Because as filtrate descends, water leaves into the salty medulla (concentrating filtrate to 1200); as it ascends, NaCl exits while water is trapped inside (diluting filtrate back down to ~200 entering DCT)!',
        mechanism:
          'NaCl transported by ascending limb of Henle’s loop is exchanged with descending limb of vasa recta, and returned to interstitium by ascending limb of vasa recta. Small amounts of urea enter the thin segment of ascending limb and recycle back from collecting duct.',
        neetTrap:
          'Remember: PCT reabsorbs 70–80% of electrolytes and water (filtrate remains isotonic at 300 mOsm/L); Loop of Henle generates the medullary gradient (juxtamedullary nephrons with long loops); Collecting duct uses that gradient under ADH to produce urine up to 4× concentrated!',
        quantitative: 'GFR ≈ 125 mL/min (180 L/day) vs Urine ≈ 1.5 L/day (~99% reabsorbed) | Cortex 300 → Inner Medulla 1200 mOsmolL⁻¹.'
      },
      linkedSetupId: 'setup-human-physio',
      linkedSetupStage: 'nephron'
    }
  ],

  'zoo-breathing': [
    {
      id: 'br-1',
      chapterId: 'zoo-breathing',
      sectionTitle: '14.4 Transport of Gases — Oxygen Dissociation Curve',
      ncertRef: 'NCERT Class XI · Breathing & Exchange of Gases',
      ncertText:
        'A sigmoid curve is obtained when percentage saturation of haemoglobin with O2 is plotted against the pO2. In the alveoli, where there is high pO2, low pCO2, lesser H+ concentration and lower temperature, the factors are all favourable for the formation of oxyhaemoglobin.',
      clozeText:
        'Oxyhaemoglobin curve is {{sigmoid}}. Curve shifts {{left}} (association) at alveoli (high {{pO2}}, low {{pCO2}}, low H+, low temp) and shifts {{right}} (dissociation / Bohr effect) at tissues.',
      betweenTheLines: {
        inference:
          'Why is a sigmoid curve vastly superior to a straight line? Because its flat upper plateau (pO2 80–104 mmHg) means Hb remains >95% saturated even if alveolar pO2 dips slightly, while its steep lower slope (pO2 20–40 mmHg) dumps massive O2 to hard-working tissues for small drops in tissue pO2!',
        mechanism:
          'Every 100 mL of oxygenated blood delivers ~5 mL of O2 to tissues under normal physiological conditions, and 100 mL deoxygenated blood delivers ~4 mL of CO2 to alveoli.',
        neetTrap:
          '70% of CO2 is transported as BICARBONATE (HCO3⁻) via RBC carbonic anhydrase (highest concentration of carbonic anhydrase is in RBCs, NOT plasma!), 20–25% as carbamino-haemoglobin, and 7% dissolved in plasma.',
        quantitative: 'Alveoli pO2 = 104, pCO2 = 40 mmHg | Tissues pO2 = 40, pCO2 = 45 mmHg | 1 Hb binds max 4 O2.'
      },
      linkedSetupId: 'setup-human-physio',
      linkedSetupStage: 'cardiac'
    }
  ],

  'zoo-neural': [
    {
      id: 'neu-1',
      chapterId: 'zoo-neural',
      sectionTitle: '18.3 Generation & Conduction of Nerve Impulse',
      ncertRef: 'NCERT Class XI · Resting Potential & Action Potential',
      ncertText:
        'When a neuron is not conducting any impulse, i.e., resting, the axonal membrane is comparatively more permeable to potassium ions (K+) and nearly impermeable to sodium ions (Na+). The sodium-potassium pump transports 3 Na+ outwards for 2 K+ into the cell.',
      clozeText:
        'At rest, axonal membrane is more permeable to {{K+}} and nearly impermeable to {{Na+}}. The {{Na+-K+ pump}} actively transports {{3 Na+ outwards}} for {{2 K+ into}} the cell.',
      betweenTheLines: {
        inference:
          'Because the pump exports 3 positive charges for every 2 imported AND negatively charged intracellular proteins cannot exit, the inside of the resting axon stays negatively polarized (~ −70 mV).',
        mechanism:
          'At threshold stimulus, voltage-gated Na+ channels fly open → rapid Na+ INFLUX reverses polarity (depolarisation: inner side becomes positive, +30 mV) → Na+ channels close, K+ channels open → rapid K+ EFFLUX restores negative interior (repolarisation).',
        neetTrap:
          'Do NOT confuse passive channels vs active pump! Depolarisation = passive rapid INFLUX of Na+ through channels; Resting gradient maintenance = active ATP-consuming Na+/K+ pump (3 Na+ out : 2 K+ in).',
        quantitative: 'Pump stoichiometry: 3 Na+ out : 2 K+ in per ATP | Resting potential ≈ −70 mV.'
      },
      linkedSetupId: 'setup-human-physio',
      linkedSetupStage: 'nerve-muscle'
    }
  ],

  'zoo-locomotion': [
    {
      id: 'loc-1',
      chapterId: 'zoo-locomotion',
      sectionTitle: '17.2.2 Sliding Filament Theory',
      ncertRef: 'NCERT Class XI · Sarcomere Band Changes',
      ncertText:
        'During shortening of the muscle, i.e., contraction, the ‘I’ bands get reduced, whereas the ‘A’ bands retain the length. The HMM component (head and short arm) projects outwards and forms cross arm; Ca2+ binds with a subunit of troponin on actin filaments and removes the masking of active sites for myosin.',
      clozeText:
        'During contraction, {{I-band}} and {{H-zone}} shorten/disappear and Z-lines move closer, while {{A-band}} retains constant length. {{Ca2+}} binds to {{troponin}} on actin to unmask myosin binding sites.',
      betweenTheLines: {
        inference:
          'Why does the A-band NEVER change length? Because the A-band equals the length of the thick MYOSIN filaments, and filaments themselves do NOT shorten—thin actin filaments merely slide over thick myosin!',
        mechanism:
          'Myosin head has BOTH actin-binding site and ATPase active site. ATP hydrolysis energizes cross-bridge power stroke; fresh ATP binding is required to DETACH myosin from actin (why rigor mortis occurs when ATP runs out!).',
        neetTrap:
          'Mnemonic check: "A-band Always stays constant"; "I-band & H-zone shrink (H-zone disappears at maximal contraction)"; "Ca2+ binds TROPONIN (not tropomyosin!)".',
        quantitative: '1 Sarcomere = 1 A-band + two half I-bands (between two successive Z-lines).'
      },
      linkedSetupId: 'setup-human-physio',
      linkedSetupStage: 'nerve-muscle'
    }
  ]
};

/**
 * 5 Pre-Configured Interactive Understanding Setups
 */
export const PRECONFIGURED_SETUPS = [
  {
    id: 'setup-respiration',
    chapterId: 'bot-respiration',
    title: 'Respiration in Plants — 4-Stage Cellular Energetics & RQ Lab',
    eyebrow: 'NCERT Ch 12 (XI) · Complete Pathway Simulator',
    description:
      'Explore where every Carbon, ATP, NADH, FADH2, and H+ comes from across Cytosol, Matrix, and Inner Mitochondrial Membrane—and test how O2 loss, uncouplers, cyanide, or fat substrates reshape the cell.',
    subModules: [
      {
        id: 'glycolysis',
        label: '1. Glycolysis (EMP)',
        compartment: 'Cytoplasm (Cytosol)',
        steps: [
          {
            stepTitle: 'Stage 1A: Energy Investment Phase (Hexokinase & PFK)',
            description:
              'Glucose (6C) enters cytoplasm (or Sucrose is split by Invertase first). Hexokinase and Phosphofructokinase (PFK, pacemaker) consume 2 ATP to form Fructose-1,6-bisphosphate (6C).',
            leftNode: 'Glucose (6C)',
            leftSub: 'Cytosol • 0 ATP yet',
            centerAction: '−2 ATP (Hexokinase & PFK)',
            rightNode: 'Fructose-1,6-BP (6C)',
            rightSub: 'Activated 6C Bisphosphate',
            highlightBanner: 'No O2 required • 2 ATP invested to destabilize symmetric 6C ring',
            carbonTrack: '6C → 6C (0 CO2)',
            ledger: { carbon: 6, atpDirect: -2, nadh: 0, fadh2: 0, co2: 0, hPlusPumped: 0 },
            socraticPrompt: 'Why does PFK (Step 3) act as the committed pacemaker of glycolysis rather than Hexokinase?',
            socraticAnswer: 'Glucose-6-phosphate can still enter starch/glycogen synthesis or the pentose pathway, whereas Fructose-1,6-bisphosphate is committed exclusively to splitting down glycolysis.'
          },
          {
            stepTitle: 'Stage 1B: Splitting & Redox Payoff (PGAL → 1,3-BPGA)',
            description:
              'Fructose-1,6-BP (6C) splits into 3-PGAL (3C) + DHAP (3C, converts to PGAL). Each PGAL (×2) is oxidised using NAD+ and inorganic phosphate (Pi, NOT ATP!) to form 2 × 1,3-BPGA + 2 NADH + 2 H+.',
            leftNode: '2 × PGAL (3C)',
            leftSub: 'Triose Phosphate + 2 Pi',
            centerAction: '+2 NAD+ → 2 NADH + H+',
            rightNode: '2 × 1,3-BPGA (3C)',
            rightSub: 'High-energy Acyl-Phosphate',
            highlightBanner: 'Crucial NCERT detail: Inorganic Pi (H3PO4) adds the 2nd phosphate during oxidation!',
            carbonTrack: '6C → 2 × 3C (0 CO2)',
            ledger: { carbon: 6, atpDirect: -2, nadh: 2, fadh2: 0, co2: 0, hPlusPumped: 0 },
            socraticPrompt: 'Why do all subsequent steps run TWICE per molecule of glucose?',
            socraticAnswer: 'Because aldolase cleaves 6C Fructose-1,6-BP into 3C PGAL and 3C DHAP, and triose phosphate isomerase converts DHAP into a second 3C PGAL.'
          },
          {
            stepTitle: 'Stage 1C: Substrate-Level Phosphorylation to Pyruvate',
            description:
              '1,3-BPGA → 3-PGA generates 2 ATP, and PEP → Pyruvic acid (Pyruvate kinase) generates 2 more ATP. Total gross = 4 ATP; Net direct gain = 2 ATP + 2 NADH + 2 H+.',
            leftNode: '2 × 1,3-BPGA → 2 × PEP',
            leftSub: '4 ADP + 4 Pi',
            centerAction: '+4 ATP (Gross)',
            rightNode: '2 × Pyruvic Acid (3C)',
            rightSub: 'Net: +2 ATP, +2 NADH',
            highlightBanner: 'ZERO CO2 is released during all 10 steps of glycolysis!',
            carbonTrack: '2 × 3C Pyruvate (0 CO2)',
            ledger: { carbon: 6, atpDirect: 2, nadh: 2, fadh2: 0, co2: 0, hPlusPumped: 0 },
            socraticPrompt: 'If 1 molecule of SUCROSE enters glycolysis in a plant cell, what is the net direct ATP and NADH yield?',
            socraticAnswer: 'Invertase splits 1 Sucrose into 1 Glucose + 1 Fructose (two hexoses), yielding 4 Net ATP + 4 NADH + 4 H+!'
          }
        ]
      },
      {
        id: 'krebs',
        label: '2. Link & Krebs Cycle',
        compartment: 'Mitochondrial Matrix',
        steps: [
          {
            stepTitle: 'Stage 2A: Link Reaction (Pyruvate → Acetyl-CoA)',
            description:
              'Pyruvate (3C) crosses into the mitochondrial matrix. Pyruvate dehydrogenase complex (requiring Mg²⁺ and Coenzyme A) performs oxidative decarboxylation: 2 Pyruvate → 2 Acetyl-CoA (2C) + 2 CO2 + 2 NADH.',
            leftNode: '2 × Pyruvate (3C)',
            leftSub: 'Matrix Entry + 2 CoA',
            centerAction: 'Pyruvate DH (Mg²⁺)',
            rightNode: '2 × Acetyl-CoA (2C)',
            rightSub: '+ 2 CO2 + 2 NADH',
            highlightBanner: '1st Decarboxylation site (2 carbons lost as 2 CO2 per glucose)',
            carbonTrack: '2×3C → 2×2C + 2 CO2',
            ledger: { carbon: 4, atpDirect: 2, nadh: 4, fadh2: 0, co2: 2, hPlusPumped: 0 },
            socraticPrompt: 'Why is the Link Reaction called "oxidative decarboxylation"?',
            socraticAnswer: 'Because pyruvate simultaneously loses a carboxyl carbon as CO2 (decarboxylation) and transfers electrons/H+ to NAD+ forming NADH (oxidation).'
          },
          {
            stepTitle: 'Stage 2B: Citrate Formation & Two TCA Decarboxylations',
            description:
              'Acetyl-CoA (2C) + OAA (4C) + H2O → Citrate (6C) via Citrate Synthase. Citrate → Isocitrate → α-Ketoglutarate (5C, releases CO2 + NADH) → Succinyl-CoA (4C, releases CO2 + NADH). (×2 turns per glucose).',
            leftNode: '2 Acetyl-CoA (2C) + OAA (4C)',
            leftSub: '6C Citrate → 5C α-KG',
            centerAction: '−4 CO2, +4 NADH (2 turns)',
            rightNode: '2 × Succinyl-CoA (4C)',
            rightSub: 'All 6 Glucose Carbons now CO2!',
            highlightBanner: 'All 6 carbons of original glucose have now exited as 6 CO2 (2 Link + 4 Krebs)!',
            carbonTrack: '2×2C → 4 CO2 (Total 6 CO2)',
            ledger: { carbon: 0, atpDirect: 2, nadh: 8, fadh2: 0, co2: 6, hPlusPumped: 0 },
            socraticPrompt: 'Wait—in the 1st turn of Krebs, do the 2 CO2 released come from the newly entered Acetyl-CoA or from OAA?',
            socraticAnswer: 'Mechanistically they come from the OAA-derived carboxyl groups during that first turn, while the 2 carbons of Acetyl-CoA stay in the cycle to become OAA for the next turn!'
          },
          {
            stepTitle: 'Stage 2C: GTP Substrate Phosphorylation & OAA Regeneration',
            description:
              'Succinyl-CoA → Succinate yields 2 GTP (ATP) via substrate-level phosphorylation. Succinate → Fumarate generates 2 FADH2 (at IMM-bound Succinate DH). Malate → OAA generates 2 more NADH.',
            leftNode: '2 × Succinyl-CoA (4C)',
            leftSub: '2 GDP + 2 Pi + 2 FAD + 2 NAD+',
            centerAction: '+2 GTP, +2 FADH2, +2 NADH',
            rightNode: '2 × OAA (4C) Regenerated',
            rightSub: 'Ready for next Acetyl-CoA',
            highlightBanner: 'Succinate Dehydrogenase is the ONLY Krebs enzyme embedded in the Inner Membrane!',
            carbonTrack: 'OAA (4C) regenerated',
            ledger: { carbon: 0, atpDirect: 4, nadh: 10, fadh2: 2, co2: 6, hPlusPumped: 0 },
            socraticPrompt: 'Krebs Cycle uses zero O2 directly in its equations—so why does it instantly stop when O2 is absent?',
            socraticAnswer: 'Without O2 as final acceptor in ETS, NADH and FADH2 pile up in reduced form, starving Matrix dehydrogenases of NAD+ and FAD!'
          }
        ]
      },
      {
        id: 'ets',
        label: '3. ETS & Chemiosmosis',
        compartment: 'Inner Mitochondrial Membrane (Cristae)',
        steps: [
          {
            stepTitle: 'Stage 3A: Complexes I & II Feed Ubiquinone (UQ)',
            description:
              '10 NADH enter Complex I (NADH dehydrogenase: FMN, Fe-S) pumping 4 H+/NADH across IMM. 2 FADH2 enter Complex II (Succinate dehydrogenase) transferring electrons to UQ WITHOUT pumping any H+.',
            leftNode: '10 NADH + 2 FADH2',
            leftSub: 'Matrix reducing equivalents',
            centerAction: 'Complex I & II → UQH2',
            rightNode: 'Ubiquinol (UQH2)',
            rightSub: 'Mobile carrier inside IMM',
            highlightBanner: 'FADH2 bypasses Complex I → pumps fewer H+ → makes 2 ATP instead of 3 ATP!',
            carbonTrack: 'Electron Flow Begins',
            ledger: { carbon: 0, atpDirect: 4, nadh: 10, fadh2: 2, co2: 6, hPlusPumped: 40 },
            socraticPrompt: 'Why does 1 NADH produce 3 ATP while 1 FADH2 produces only 2 ATP in NCERT?',
            socraticAnswer: 'NADH enters at Complex I (pumping H+ at Complexes I, III, and IV), whereas FADH2 enters at Complex II which does not pump protons, so it only triggers pumping at Complexes III and IV.'
          },
          {
            stepTitle: 'Stage 3B: Complex III → Cytochrome c → Complex IV → O2',
            description:
              'UQH2 transfers e⁻ to Complex III (Cyt bc1) → small mobile protein Cytochrome c (outer surface of IMM) → Complex IV (Cyt a, a3 + 2 Cu centres) → ½ O2 + 2 H+ → H2O.',
            leftNode: 'UQH2 → Complex III → Cyt c',
            leftSub: 'Mobile Cyt c on outer IMM face',
            centerAction: 'Complex IV + ½ O2 → H2O',
            rightNode: 'High H+ in Intermembrane Space',
            rightSub: 'Terminal H2O formed in Matrix',
            highlightBanner: 'O2 is the terminal H+/e⁻ acceptor; 6 O2 consumed per glucose!',
            carbonTrack: 'Electrochemical Gradient Built',
            ledger: { carbon: 0, atpDirect: 4, nadh: 10, fadh2: 2, co2: 6, hPlusPumped: 112 },
            socraticPrompt: 'Where is Cytochrome c located, and why is its mobility essential?',
            socraticAnswer: 'NCERT notes Cytochrome c is a small protein attached to the OUTER surface of the inner mitochondrial membrane, ferrying electrons one at a time from Complex III to Complex IV.'
          },
          {
            stepTitle: 'Stage 3C: Complex V (F0–F1 ATP Synthase) & Total 38 ATP',
            description:
              'Protons flow down the gradient from Intermembrane Space through F0 channel back into Matrix (4 H+ per ATP per latest NCERT). 10 NADH × 3 = 30 ATP + 2 FADH2 × 2 = 4 ATP + 4 direct = 38 ATP!',
            leftNode: 'Intermembrane Space (High H+)',
            leftSub: '4 H+ pass per ATP via F0',
            centerAction: 'F1 Catalytic Headpiece',
            rightNode: '38 Net ATP (Total)',
            rightSub: '4 Direct + 34 Oxidative ATP',
            highlightBanner: 'F1 faces the Matrix! Latest NCERT: 4 H+ pass through F0 for each ATP synthesized.',
            carbonTrack: 'Complete Glucose Oxidation',
            ledger: { carbon: 0, atpDirect: 4, nadh: 10, fadh2: 2, co2: 6, oxidativeAtp: 34, netAtp: 38, hPlusPumped: 112 },
            socraticPrompt: 'How do mitochondrial and chloroplast ATP synthase orientations compare?',
            socraticAnswer: 'Both F1 and CF1 face the compartment where ATP is immediately needed: F1 faces Mitochondrial Matrix; CF1 faces Chloroplast Stroma (for Calvin Cycle)!'
          }
        ]
      },
      {
        id: 'amphibolic',
        label: '4. Fermentation & Amphibolic/RQ Lab',
        compartment: 'Whole-Cell Integration & RQ Calculator',
        steps: [
          {
            stepTitle: 'Amphibolic Crossroads & Respiratory Quotient (RQ)',
            description:
              'Carbohydrates, Fats (via glycerol → PGAL & fatty acids → Acetyl-CoA), and Proteins (via amino acid deamination) converge on respiration. Intermediates are simultaneously withdrawn for synthesis (amphibolic).',
            leftNode: 'Carbs (RQ=1.0) | Fats (0.7) | Proteins (0.9)',
            leftSub: 'Multiple Substrate Entry Points',
            centerAction: 'Catabolism ⇌ Anabolism',
            rightNode: 'Acetyl-CoA / Krebs Hub',
            rightSub: 'Lipids, Amino Acids, Chlorophyll',
            highlightBanner: 'RQ = Vol. CO2 evolved / Vol. O2 consumed — depends on the substrate being respired!',
            carbonTrack: 'Amphibolic Balance',
            ledger: { carbon: 6, atpDirect: 4, nadh: 10, fadh2: 2, co2: 6, oxidativeAtp: 34, netAtp: 38, hPlusPumped: 112 },
            socraticPrompt: 'Why is the RQ of Tripalmitin fat (0.7) lower than Glucose (1.0), whereas Malic Acid has RQ > 1?',
            socraticAnswer: 'Fats are highly reduced (poor in internal O2), needing far more external O2 per CO2 released; organic acids are already oxygen-rich, needing less external O2 per CO2 released!'
          }
        ]
      }
    ],
    perturbations: [
      {
        id: 'normal',
        label: 'Normal Aerobic (O2 Present)',
        badge: 'Baseline · 38 ATP',
        effectTitle: 'Full Aerobic Oxidation Active',
        effectDetail: 'O2 accepts electrons at Complex IV; all 10 NADH (×3) and 2 FADH2 (×2) produce 34 oxidative ATP + 4 direct = 38 ATP. RQ for glucose = 1.0.',
        overrideLedger: { netAtp: 38, oxidativeAtp: 34, atpDirect: 4, co2: 6, rq: '1.0 (Glucose)' }
      },
      {
        id: 'anaerobic',
        label: 'No O2 (Fermentation)',
        badge: 'Anaerobic · 2 ATP',
        effectTitle: 'ETS, Link Reaction & Krebs HALT — Fermentation Takes Over',
        effectDetail:
          'Without O2 at Complex IV, NADH cannot be oxidised by ETS. Cytosolic pyruvate accepts e⁻ from NADH to regenerate NAD+ (yielding Lactate + 0 CO2 in muscles, or Ethanol + 2 CO2 in yeast). Only 2 Net ATP (<7% energy)!',
        overrideLedger: { netAtp: 2, oxidativeAtp: 0, atpDirect: 2, co2: 2, hPlusPumped: 0, rq: '∞ (Anaerobic)' }
      },
      {
        id: 'uncoupler',
        label: '2,4-DNP (Proton Uncoupler)',
        badge: 'Gradient Leak · Heat',
        effectTitle: 'Electron Transport Continues, ATP Synthase Halts (Energy Lost as Heat!)',
        effectDetail:
          'An uncoupler pokes proton channels across the Inner Mitochondrial Membrane. H+ leaks back into the matrix bypassing F0–F1. O2 is still consumed and NADH/Krebs speed up, but oxidative ATP drops to 0 and heat spikes!',
        overrideLedger: { netAtp: 4, oxidativeAtp: 0, atpDirect: 4, co2: 6, hPlusPumped: 0, rq: '1.0 (Heat Lost)' }
      },
      {
        id: 'cyanide',
        label: 'Cyanide / CO (Complex IV Block)',
        badge: 'Complex IV Blocked',
        effectTitle: 'Electron Traffic Jam at Cyt a–a3',
        effectDetail:
          'Blocking Complex IV stops O2 reduction. Electrons back up across Cyt c → III → UQ → I/II. Both H+ pumping and Krebs cycle stall immediately; cell falls back to 2 ATP glycolysis/fermentation.',
        overrideLedger: { netAtp: 2, oxidativeAtp: 0, atpDirect: 2, co2: 0, hPlusPumped: 0, rq: 'Blocked' }
      },
      {
        id: 'fat-substrate',
        label: 'Substrate = Tripalmitin Fat',
        badge: 'RQ = 0.7',
        effectTitle: 'Fatty Acid β-Oxidation Enters Directly as Acetyl-CoA (Bypasses Glycolysis)',
        effectDetail:
          'Tripalmitin (C51H98O6) requires 145 O2 to release 102 CO2 → RQ = 102/145 = 0.7. Fatty acids cannot enter glycolysis directly; they enter at Acetyl-CoA while glycerol enters at PGAL.',
        overrideLedger: { netAtp: 'High (>100/mol)', oxidativeAtp: 'FADH2 + NADH', co2: 102, rq: '0.70' }
      }
    ],
    hasRespirationCalculator: true
  },

  {
    id: 'setup-photosynthesis',
    chapterId: 'bot-photosynthesis',
    title: 'Photosynthesis — Z-Scheme, Chemiosmosis & C3/C4 Lab',
    eyebrow: 'NCERT Ch 11 (XI) · Light & Dark Reactions',
    description:
      'Visualize electron flow from H2O through PS II and PS I, proton accumulation in the thylakoid lumen, and compare C3 Calvin vs C4 Kranz & Photorespiration.',
    subModules: [
      {
        id: 'z-scheme',
        label: '1. Z-Scheme & Cyclic',
        compartment: 'Grana Thylakoid Membrane vs Stroma Lamellae',
        steps: [
          {
            stepTitle: 'Step 1: PS II (P680) Water Splitting & PQ Proton Shuttle',
            description:
              'PS II (680 nm) excites electrons to Pheophytin → Plastoquinone (PQ). Water-splitting complex on the inner lumen side splits 2 H2O → 4 H+ (lumen) + O2 + 4 e⁻ to refill P680.',
            leftNode: '2 H2O → P680 (PS II)',
            leftSub: 'Inner Thylakoid Lumen Face',
            centerAction: 'PQ carries e⁻ + stromal H+',
            rightNode: 'Cytochrome b6f → PC',
            rightSub: '4 H+ dropped into Lumen',
            highlightBanner: 'Non-cyclic flow uses BOTH PS II and PS I in series (Z-scheme on redox scale)!',
            carbonTrack: 'O2 Evolved + Gradient Started',
            ledger: { psActive: 'PS II + PS I', atp: 'Building H+', nadph: 'Pending', o2: 'Evolved', lumenPh: 'Dropping (Acidic)' },
            socraticPrompt: 'Why do stroma lamellae carry out ONLY cyclic photophosphorylation?',
            socraticAnswer: 'NCERT explicitly states stroma lamellae membranes lack both PS II and NADP reductase enzyme — so excited e⁻ from P700 can only cycle back via Fd → Cyt b6f → PC → P700, generating ATP only.'
          },
          {
            stepTitle: 'Step 2: PS I (P700) → Ferredoxin → NADP+ Reductase',
            description:
              'Plastocyanin (PC) passes e⁻ to P700 (PS I, 700 nm), which excites e⁻ to Ferredoxin (Fd). Stromal NADP+ reductase converts NADP+ + H+ (from stroma) → NADPH + H+.',
            leftNode: 'PC → P700 (PS I) → Fd',
            leftSub: '700 nm excitation',
            centerAction: 'NADP+ Reductase (Stroma)',
            rightNode: 'NADPH + H+ (Stroma)',
            rightSub: 'Consumes Stromal H+',
            highlightBanner: 'Both ATP and NADPH are released into the STROMA right where Calvin Cycle runs!',
            carbonTrack: 'Assimilatory Power Ready',
            ledger: { psActive: 'PS II + PS I', atp: 'Made via CF0–CF1', nadph: 'Made in Stroma', o2: 'Evolved', lumenPh: 'Low pH (High H+)' },
            socraticPrompt: 'How does NADP+ reductase contribute to the proton gradient even though it does NOT pump protons?',
            socraticAnswer: 'Because it sits on the outer stromal side and consumes H+ from the stroma to reduce NADP+, widening the H+ difference between stroma and lumen!'
          }
        ]
      },
      {
        id: 'chemiosmosis',
        label: '2. Thylakoid Chemiosmosis',
        compartment: 'Thylakoid Lumen ↔ Stroma',
        steps: [
          {
            stepTitle: '3-Source Proton Accumulation & CF0–CF1 ATP Synthase',
            description:
              'Lumen H+ rises from (1) water splitting, (2) PQ shuttle across membrane, and (3) stromal H+ removal at NADP+ reductase. Protons exit via CF0 into stroma, rotating CF1 to make ATP.',
            leftNode: 'Thylakoid Lumen (Low pH)',
            leftSub: '3 Proton-Gradient Drivers',
            centerAction: 'H+ efflux via CF0 Channel',
            rightNode: 'CF1 in Stroma → ATP',
            rightSub: 'Calvin Cycle Fuel',
            highlightBanner: 'Unlike mitochondria (H+ in IMS), chloroplasts accumulate H+ inside the THYLAKOID LUMEN!',
            carbonTrack: 'Proton Gradient → ATP',
            ledger: { psActive: 'Non-Cyclic', atp: 'Yes (Stroma)', nadph: 'Yes (Stroma)', o2: 'Yes', lumenPh: 'pH ~ 4.5 (High H+)' },
            socraticPrompt: 'What happens if the thylakoid membrane is punctured or becomes leaky to H+?',
            socraticAnswer: 'Electron transport and O2 evolution continue, NADPH can still form, but the proton gradient collapses so CF0–CF1 ATP synthesis stops immediately!'
          }
        ]
      },
      {
        id: 'c3-c4',
        label: '3. C3 vs C4 & Photorespiration',
        compartment: 'Mesophyll vs Bundle Sheath (Kranz)',
        steps: [
          {
            stepTitle: 'Calvin Cycle (C3) vs Hatch-Slack (C4) & C2 Photorespiration',
            description:
              'C3 fixes CO2 directly with RuBisCO (3 ATP + 2 NADPH per CO2). C4 plants fix HCO3⁻ in Mesophyll via PEPcase (zero O2 binding!) and pump 4C malate to Bundle Sheath RuBisCO (5 ATP + 2 NADPH per CO2, zero photorespiration).',
            leftNode: 'Mesophyll (PEPcase, 3C PEP)',
            leftSub: 'Fixes HCO3⁻ → 4C OAA/Malate',
            centerAction: 'CO2 Pump to Bundle Sheath',
            rightNode: 'Bundle Sheath (RuBisCO)',
            rightSub: 'High CO2 suppresses Oxygenase!',
            highlightBanner: 'Mesophyll = PEPcase (NO RuBisCO); Bundle Sheath = RuBisCO (NO PEPcase).',
            carbonTrack: '1 Glucose = 18 ATP (C3) vs 30 ATP (C4)',
            ledger: { psActive: 'C3 vs C4', atp: '18 (C3) / 30 (C4) per Glucose', nadph: '12 per Glucose', o2: 'Photorespiration in C3', lumenPh: 'Kranz Shield' },
            socraticPrompt: 'If C4 costs 12 MORE ATP per glucose than C3, why do tropical crops like maize and sugarcane still outperform C3?',
            socraticAnswer: 'At high temperature and high light, C3 RuBisCO wastes up to 25%+ of fixed carbon in photorespiration (consuming ATP and releasing CO2 with zero sugar gain), whereas C4 eliminates photorespiration!'
          }
        ]
      }
    ],
    perturbations: [
      {
        id: 'normal',
        label: 'Normal White Light (C3 & C4)',
        badge: 'Non-Cyclic Active',
        effectTitle: 'Both PS II & PS I Active',
        effectDetail: 'Non-cyclic electron flow generates both ATP and NADPH + H+ plus O2 evolution.',
        overrideLedger: { psActive: 'PS II + PS I', atp: 'Synthesized', nadph: 'Synthesized', o2: 'Evolved' }
      },
      {
        id: 'far-red',
        label: 'Only Far-Red Light (>680 nm)',
        badge: 'Cyclic Only (PS I)',
        effectTitle: 'PS II Inactive — Only PS I Cyclic Photophosphorylation Runs',
        effectDetail: 'Above 680 nm, P680 (PS II) cannot excite. Only P700 (PS I) cycles electrons: ATP is formed, while NADPH formation and O2 evolution stop.',
        overrideLedger: { psActive: 'PS I Only (Cyclic)', atp: 'Synthesized', nadph: '0 (Stopped)', o2: '0 (Stopped)' }
      },
      {
        id: 'dcmu',
        label: 'DCMU (Blocks PS II → PQ)',
        badge: 'Non-Cyclic Blocked',
        effectTitle: 'Electron Flow from PS II Blocked',
        effectDetail: 'Water splitting & O2 evolution halt along with NADPH synthesis; PS I cyclic ATP may still run independently.',
        overrideLedger: { psActive: 'PS II Blocked', atp: 'Cyclic Only', nadph: '0 (Stopped)', o2: '0 (Stopped)' }
      },
      {
        id: 'high-o2',
        label: 'High O2 / High Temp (C3 vs C4)',
        badge: 'RuBisCO Oxygenase',
        effectTitle: 'C3 Enters Photorespiration (C2 Cycle); C4 Unfazed!',
        effectDetail: 'In C3 plants, RuBisCO binds O2 forming 1 PGA (3C) + 1 Phosphoglycolate (2C), wasting ATP and releasing CO2 across Chloroplast → Peroxisome → Mitochondria. C4 plants stay protected by PEPcase + Kranz anatomy.',
        overrideLedger: { psActive: 'C3: C2 Waste | C4: Normal', atp: 'Wasted in C3', nadph: '25% loss in C3', o2: 'Consumed by RuBisCO' }
      }
    ]
  },

  {
    id: 'setup-lac-molecular',
    chapterId: 'bot-molecular',
    title: 'Molecular Basis — Lac Operon Switch & Polarity Workbench',
    eyebrow: 'NCERT Ch 5 (XII) · Gene Regulation & Strand Polarity',
    description:
      'Toggle Lactose, Glucose, and regulatory mutations on the Jacob–Monod lac operon (i–p–o–z–y–a) and trace 5′→3′ DNA replication vs transcription polarity.',
    subModules: [
      {
        id: 'lac-operon',
        label: '1. Lac Operon Switch',
        compartment: 'E. coli Cytoplasm & DNA Operon (i – p – o – z – y – a)',
        steps: [
          {
            stepTitle: 'Regulatory Switch: Repressor (i) vs Inducer (Allolactose)',
            description:
              'The i gene constitutively makes Repressor protein. Without lactose, Repressor binds Operator (o) and blocks RNA Polymerase. With lactose (inducer), Repressor is inactivated so z (β-gal), y (permease), and a (transacetylase) transcribe.',
            leftNode: 'i gene → Repressor Protein',
            leftSub: 'Constitutive (always expressed)',
            centerAction: 'Operator (o) Gatekeeper',
            rightNode: 'z, y, a Polycistronic mRNA',
            rightSub: 'β-Gal • Permease • Transacetylase',
            highlightBanner: 'Repressor control of lac operon = NEGATIVE regulation (NCERT explicit!).',
            carbonTrack: 'Inducible Catabolic Operon',
            ledger: { repressorState: 'Bound to Operator', rnaPol: 'Blocked at Promoter', operon: 'SWITCHED OFF', enzymes: 'Basal Trace Only' },
            socraticPrompt: 'Why is the i gene called "i" if lactose is the inducer?',
            socraticAnswer: 'NCERT explicitly notes that the "i" refers to INHIBITOR (the repressor protein), NOT the inducer!'
          }
        ]
      },
      {
        id: 'polarity',
        label: '2. Replication & Transcription Polarity',
        compartment: 'Nucleus / Nucleoid Template Strands',
        steps: [
          {
            stepTitle: 'DNA Polymerase (5′→3′) vs Transcription Unit (3′→5′ Template)',
            description:
              'DNA polymerase reads 3′→5′ template to synthesize 5′→3′ (continuous leading strand vs discontinuous Okazaki lagging strand). RNA polymerase reads the 3′→5′ template strand to build 5′→3′ mRNA matching the 5′→3′ coding strand (with U instead of T).',
            leftNode: 'Template Strand (3′ → 5′)',
            leftSub: 'Promoter at 3′ template end',
            centerAction: 'Polymerase reads 3′→5′, writes 5′→3′',
            rightNode: 'mRNA (5′ → 3′) = Coding Strand',
            rightSub: 'Identical sequence (T → U)',
            highlightBanner: 'Upstream/Downstream & Promoter/Terminator positions are ALWAYS defined relative to the 5′→3′ CODING strand!',
            carbonTrack: 'Polarity Rule: Synthesis ALWAYS 5′→3′',
            ledger: { repressorState: 'Template = 3′→5′', rnaPol: 'Reads 3′→5′ → Writes 5′→3′', operon: 'Coding = 5′→3′', enzymes: 'T in DNA → U in RNA' },
            socraticPrompt: 'If coding strand is 5′-ATGCATGC-3′, what is the transcribed mRNA sequence?',
            socraticAnswer: '5′-AUGCAUGC-3′! No need to reverse-complement from the coding strand—simply swap every T with U!'
          }
        ]
      }
    ],
    perturbations: [
      {
        id: 'normal',
        label: 'Lactose ABSENT (Operon OFF)',
        badge: 'Repressor Bound',
        effectTitle: 'Repressor Binds Operator (o) → Transcription Blocked',
        effectDetail: 'i gene produces active repressor that physically blocks RNA Polymerase from moving past Promoter (p).',
        overrideLedger: { repressorState: 'Active (Bound to o)', rnaPol: 'Blocked', operon: 'OFF', enzymes: 'None (Basal only)' }
      },
      {
        id: 'lactose-on',
        label: 'Lactose PRESENT, Glucose Absent',
        badge: 'Operon MAX ON',
        effectTitle: 'Allolactose Inactivates Repressor → High Expression',
        effectDetail: 'Inducer binds repressor → releases Operator → RNA Polymerase transcribes z, y, a polycistronic mRNA (plus CAP-cAMP boosts transcription when glucose is absent).',
        overrideLedger: { repressorState: 'Inactivated by Inducer', rnaPol: 'Transcribing z, y, a', operon: 'ON (Maximum)', enzymes: 'β-Gal + Perm + Transacetylase' }
      },
      {
        id: 'operator-constitutive',
        label: 'Operator Mutation (oᶜ)',
        badge: 'Always ON (Constitutive)',
        effectTitle: 'Repressor Cannot Bind Mutated Operator',
        effectDetail: 'Even with zero lactose, mutant operator fails to bind repressor → z, y, a are transcribed continuously!',
        overrideLedger: { repressorState: 'Cannot bind oᶜ', rnaPol: 'Unblocked Always', operon: 'CONSTITUTIVE ON', enzymes: 'Always Produced' }
      },
      {
        id: 'super-repressor',
        label: 'Super-Repressor (iˢ) Mutation',
        badge: 'Permanently OFF',
        effectTitle: 'Repressor Cannot Bind Lactose Inducer',
        effectDetail: 'Even when plenty of lactose is added, iˢ repressor stays locked onto Operator → operon cannot turn ON.',
        overrideLedger: { repressorState: 'Locked onto Operator', rnaPol: 'Permanently Blocked', operon: 'PERMANENTLY OFF', enzymes: 'None' }
      }
    ]
  },

  {
    id: 'setup-human-physio',
    chapterId: 'zoo-circulation',
    title: 'Human Physiology — Cardiac/ECG, Nephron & Nerve/Sarcomere Lab',
    eyebrow: 'NCERT Ch 14–18 (XI) · Physiology Simulators',
    description:
      'Switch between Cardiac Cycle & ECG waves, Nephron Counter-Current Osmolarity (300→1200 mOsm/L), and Nerve Impulse / Sarcomere Sliding Filament mechanics.',
    subModules: [
      {
        id: 'cardiac',
        label: '1. Cardiac Cycle & ECG',
        compartment: 'Heart Chambers, Valves & ECG Timeline (0.8 s)',
        steps: [
          {
            stepTitle: 'Phase 1: Joint Diastole (0.4 s) — 70% Passive Filling',
            description:
              'All 4 chambers relaxed. AV (Tricuspid/Bicuspid) valves OPEN; Semilunar valves CLOSED. ~70% of blood flows passively into ventricles. Corresponds to baseline after T-wave.',
            leftNode: 'Atria & Ventricles Relaxed',
            leftSub: 'AV Open • Semilunar Closed',
            centerAction: '0.4 s (70% Passive Fill)',
            rightNode: 'After T-wave baseline',
            rightSub: 'SA Node Firing Next',
            highlightBanner: '70% of ventricular filling happens PASSIVELY before atrial systole even starts!',
            carbonTrack: '0.4 s of 0.8 s cycle',
            ledger: { duration: '0.4 s', valves: 'AV Open, SL Closed', ecgWave: 'TP Segment', sound: 'None (after Dub)', output: '70% Filling' },
            socraticPrompt: 'Why does ventricular filling barely drop even if the SA node triggers a slightly faster beat?',
            socraticAnswer: 'Because 70% of blood flows passively during joint diastole; atrial systole only contributes the final ~30%!'
          },
          {
            stepTitle: 'Phase 2: Atrial Systole (0.1 s) & P-Wave',
            description:
              'SA Node generates action potential → P-wave on ECG (atrial depolarisation) → atria contract, pushing the remaining ~30% blood into ventricles.',
            leftNode: 'SA Node → Atrial Contraction',
            leftSub: 'Increases filling by ~30%',
            centerAction: '0.1 s · P-wave',
            rightNode: 'End-Diastolic Volume (~120 mL)',
            rightSub: 'Impulse reaches AV Node',
            highlightBanner: 'P-wave = Atrial Depolarisation (contraction begins just after P-wave onset).',
            carbonTrack: '0.1 s of 0.8 s cycle',
            ledger: { duration: '0.1 s', valves: 'AV Open, SL Closed', ecgWave: 'P-wave', sound: 'Quiet', output: '+30% Filling' },
            socraticPrompt: 'What happens if the AV node delays impulse conduction slightly?',
            socraticAnswer: 'The brief AV nodal delay allows the atria to finish emptying into the ventricles before ventricular systole begins!'
          },
          {
            stepTitle: 'Phase 3: Ventricular Systole (0.3 s), QRS Complex & Lub/Dub',
            description:
              'QRS = Ventricular depolarisation → ventricular pressure spikes → AV valves slam shut (**LUB** sound) → Semilunar valves forced open → ~70 mL Stroke Volume pumped out. T-wave = Ventricular repolarisation; SL valves slam shut (**DUB**) as diastole returns.',
            leftNode: 'QRS → Ventricular Systole',
            leftSub: 'AV Shut (LUB) → SL Open',
            centerAction: '0.3 s · 70 mL Ejected',
            rightNode: 'T-wave → Diastole (DUB)',
            rightSub: 'CO = 72 × 70 ≈ 5040 mL/min',
            highlightBanner: 'End of T-wave marks the END of Ventricular Systole!',
            carbonTrack: '0.3 s of 0.8 s cycle',
            ledger: { duration: '0.3 s', valves: 'AV Closed, SL Open', ecgWave: 'QRS → T-wave', sound: 'LUB (start) / DUB (end)', output: 'SV 70 mL / CO 5 L' },
            socraticPrompt: 'Which valve closures cause the first (Lub) and second (Dub) heart sounds?',
            socraticAnswer: 'Lub = closure of Tricuspid & Bicuspid (AV) valves at start of ventricular systole; Dub = closure of Semilunar valves at start of ventricular diastole.'
          }
        ]
      },
      {
        id: 'nephron',
        label: '2. Nephron Counter-Current',
        compartment: 'Cortex (300) → Outer Medulla → Inner Medulla (1200 mOsm/L)',
        steps: [
          {
            stepTitle: 'PCT → Descending Loop → Ascending Loop → DCT & Collecting Duct',
            description:
              'PCT reabsorbs 70–80% filtrate iso-osmotically (300 mOsm/L). Descending Loop loses H2O passively (concentrates to 1200). Ascending Loop pumps/diffuses NaCl out while impermeable to H2O (dilutes to ~200). Collecting duct reabsorbs H2O under ADH + recycles urea.',
            leftNode: 'Descending Limb (H2O Out)',
            leftSub: '300 → 1200 mOsmL⁻¹',
            centerAction: 'Vasa Recta + NaCl/Urea Loop',
            rightNode: 'Ascending Limb (NaCl Out)',
            rightSub: '1200 → 200 mOsmL⁻¹ (Dilute)',
            highlightBanner: 'NaCl + Urea build the 300→1200 mOsmolL⁻¹ gradient; Vasa Recta prevents washout!',
            carbonTrack: '180 L/day GFR → 1.5 L/day Urine',
            ledger: { duration: 'GFR 125 mL/min', valves: 'Desc: H2O perm', ecgWave: 'Asc: Salt perm', sound: 'Max Medulla: 1200', output: '4× Concentrated Urine' },
            socraticPrompt: 'Why must the ascending limb of Loop of Henle be IMPERMEABLE to water?',
            socraticAnswer: 'If water followed NaCl out of the ascending limb, the medullary interstitium would be diluted and the osmotic gradient (300→1200 mOsm/L) could never be built!'
          }
        ]
      },
      {
        id: 'nerve-muscle',
        label: '3. Nerve Impulse & Sarcomere',
        compartment: 'Axonal Membrane & Muscle Sarcomere',
        steps: [
          {
            stepTitle: 'Action Potential (3 Na+ out / 2 K+ in) & Sliding Filament Bands',
            description:
              'Axon resting (−70 mV, K+ permeable, 3 Na+ out / 2 K+ in pump) → Stimulus opens Na+ channels (Depolarisation, +30 mV) → K+ efflux (Repolarisation). At muscle, Ca2+ binds Troponin → unmasks actin → Myosin ATPase pulls thin filaments inward: I-band & H-zone shrink, A-band stays CONSTANT!',
            leftNode: 'Resting −70 mV (K+ perm)',
            leftSub: '3 Na+ out : 2 K+ in (ATP)',
            centerAction: 'Na+ Influx (+30 mV) → Ca2+ Release',
            rightNode: 'Actin Slides Over Myosin',
            rightSub: 'I & H shrink • A-band Constant!',
            highlightBanner: 'A-band NEVER changes length; Ca2+ binds Troponin (not Tropomyosin)!',
            carbonTrack: 'Impulse → Contraction',
            ledger: { duration: 'RMP −70 mV', valves: 'Depol: Na+ In', ecgWave: 'Repol: K+ Out', sound: 'A-band: Constant', output: 'I-band & H-zone: Shrink' },
            socraticPrompt: 'Why do muscles become rigid after death (rigor mortis)?',
            socraticAnswer: 'Because fresh ATP binding to the myosin head is required to BREAK the actomyosin cross-bridge; without ATP after death, myosin remains locked to actin!'
          }
        ]
      }
    ],
    perturbations: [
      {
        id: 'normal',
        label: 'Normal Physiology',
        badge: 'Baseline',
        effectTitle: 'Homeostatic Operation',
        effectDetail: 'HR = 72 bpm, CO = 5 L/min; Medullary gradient = 300→1200 mOsm/L; Normal ADH & Acetylcholine transmission.',
        overrideLedger: { output: 'CO 5.0 L/min | Urine 1.5 L/day', sound: 'Lub-Dub Normal' }
      },
      {
        id: 'adh-absent',
        label: 'Zero ADH (Diabetes Insipidus)',
        badge: 'Dilute Urine',
        effectTitle: 'DCT & Collecting Duct Stay Impermeable to Water',
        effectDetail: 'Even though the 300→1200 medullary gradient exists, without ADH (vasopressin), aquaporins are absent → massive volumes of dilute urine!',
        overrideLedger: { output: 'Polyuria (Dilute Urine)', ecgWave: 'Gradient unused!' }
      },
      {
        id: 'sympathetic',
        label: 'Sympathetic / Adrenaline Surge',
        badge: 'CO Increases',
        effectTitle: 'Increases Heart Rate & Ventricular Contraction Strength',
        effectDetail: 'Sympathetic signals accelerate SA node rate and increase Stroke Volume → raising Cardiac Output well above 5 L/min (Parasympathetic/ACh does the opposite).',
        overrideLedger: { output: 'CO ↑ (>10 L/min)', duration: 'Cycle < 0.8 s' }
      }
    ]
  },

  {
    id: 'setup-cell-cycle',
    chapterId: 'bot-cell-cycle',
    title: 'Cell Cycle & Meiosis — 2n / 4C Ploidy & Crossover Tracker',
    eyebrow: 'NCERT Ch 10 (XI) · Chromosome Count vs DNA Content',
    description:
      'Never confuse chromosome number (n) with DNA amount (C) again! Track centromeres vs chromatids from G1 → S → G2 → Mitosis / Meiosis I & II.',
    subModules: [
      {
        id: 'interphase',
        label: '1. Ploidy (2n / 4C) Tracker',
        compartment: 'G1 → S → G2 → Meiosis I → Meiosis II',
        steps: [
          {
            stepTitle: 'G1 Phase (2n, 2C) → S Phase (2n, 4C)',
            description:
              'Suppose a diploid meiocyte starts at G1 with 2n = 16 chromosomes and 2C DNA (e.g., 20 pg). In S phase, DNA replicates to 4C (40 pg), but sister chromatids share ONE centromere — so chromosome count stays 2n = 16!',
            leftNode: 'G1: 2n = 16, DNA = 2C',
            leftSub: '1 Chromatid / Chromosome',
            centerAction: 'S Phase DNA Replication',
            rightNode: 'G2: 2n = 16, DNA = 4C',
            rightSub: '2 Sister Chromatids / Centromere',
            highlightBanner: 'Chromosome number = Number of Centromeres (NEVER doubles in S phase)!',
            carbonTrack: '2n, 2C → 2n, 4C',
            ledger: { chromosomes: '16 (2n)', dnaContent: '4C (Doubled!)', chromatidsPerChr: 2, centromereSplit: 'No', stagePloidy: 'Diploid (2n)' },
            socraticPrompt: 'Does chromosome number double during S phase in Onion root tip (2n = 16)?',
            socraticAnswer: 'NO! At G1, S, and G2, chromosome number stays 16 (2n); only DNA content doubles from 2C to 4C!'
          },
          {
            stepTitle: 'Meiosis I (Reductional: Homologs Separate → n, 2C)',
            description:
              'In Anaphase I, homologous chromosomes separate while sister chromatids remain attached at undivided centromeres! Each daughter cell receives n = 8 chromosomes, each still having 2 chromatids (2C DNA).',
            leftNode: 'Metaphase I (8 Bivalents = 16 Chr)',
            leftSub: '2n = 16, 4C DNA',
            centerAction: 'Anaphase I (No Centromere Split!)',
            rightNode: 'Telophase I (2 Cells: n = 8, 2C)',
            rightSub: 'Reductional Division Complete',
            highlightBanner: 'Meiosis I reduces CHROMOSOME count (2n→n) and brings DNA back from 4C→2C!',
            carbonTrack: '2n, 4C → n, 2C',
            ledger: { chromosomes: '8 (n)', dnaContent: '2C', chromatidsPerChr: 2, centromereSplit: 'NO (Homologs split)', stagePloidy: 'Haploid (n)' },
            socraticPrompt: 'Why is Meiosis II still required after Meiosis I if the cell is already haploid (n)?',
            socraticAnswer: 'Because each of the n chromosomes still contains 2 sister chromatids (2C DNA). Meiosis II splits the centromeres to produce 4 haploid gametes with 1C DNA!'
          },
          {
            stepTitle: 'Meiosis II (Equational: Centromeres Split → n, 1C)',
            description:
              'In Anaphase II, centromeres split (just like Mitosis!), separating sister chromatids. Final result: 4 haploid cells, each with n = 8 chromosomes and 1C DNA (10 pg).',
            leftNode: 'Metaphase II (n = 8, 2C)',
            leftSub: 'Single Metaphase Plate',
            centerAction: 'Anaphase II (Centromeres Split!)',
            rightNode: '4 Gametes (n = 8, 1C)',
            rightSub: '1 Chromatid / Chromosome',
            highlightBanner: 'Compare: Mitosis splits centromeres once (2n,2C); Meiosis splits centromeres ONLY in Anaphase II!',
            carbonTrack: 'n, 2C → n, 1C',
            ledger: { chromosomes: '8 (n)', dnaContent: '1C', chromatidsPerChr: 1, centromereSplit: 'YES (Anaphase II)', stagePloidy: 'Haploid Gamete (n, 1C)' },
            socraticPrompt: 'If a pollen grain (n, 1C) has 10 pg DNA and 12 chromosomes, what were the chromosome & DNA values of its MMC at G2?',
            socraticAnswer: 'MMC is diploid (2n = 24); at G2 its DNA is 4C = 4 × 10 = 40 pg!'
          }
        ]
      },
      {
        id: 'prophase1',
        label: '2. Prophase I Substages',
        compartment: 'Leptotene → Zygotene → Pachytene → Diplotene → Diakinesis',
        steps: [
          {
            stepTitle: '5 Substages: Synapsis, Recombinase, Chiasmata & Terminalisation',
            description:
              'Leptotene (compaction) → Zygotene (synapsis + synaptonemal complex → bivalent/tetrad) → Pachytene (recombinase crossing over between non-sister chromatids) → Diplotene (SC dissolves, X-chiasmata visible) → Diakinesis (terminalisation, nucleolus/nuclear envelope disappear).',
            leftNode: 'Zygotene (Synapsis) → Pachytene (Crossing Over)',
            leftSub: 'Recombinase Enzyme',
            centerAction: 'Diplotene (Chiasmata Visible)',
            rightNode: 'Diakinesis (Terminalisation)',
            rightSub: 'Ready for Metaphase I Spindle',
            highlightBanner: 'Crossing over occurs in PACHYTENE; Chiasmata appear in DIPLOTENE; Terminalisation in DIAKINESIS!',
            carbonTrack: 'Genetic Recombination Locked In',
            ledger: { chromosomes: '2n (Bivalents)', dnaContent: '4C', chromatidsPerChr: 4, centromereSplit: 'No', stagePloidy: 'Prophase I' },
            socraticPrompt: 'Between which two chromatids does crossing over occur in Pachytene?',
            socraticAnswer: 'Between NON-SISTER chromatids of homologous chromosomes (within the tetrad)!'
          }
        ]
      }
    ],
    perturbations: [
      {
        id: 'normal',
        label: 'Normal Mitosis vs Meiosis',
        badge: 'Baseline',
        effectTitle: 'Normal Segregation',
        effectDetail: 'Mitosis preserves 2n, 2C across two daughters; Meiosis yields four n, 1C cells.',
        overrideLedger: { chromosomes: 'n (8) in gametes', dnaContent: '1C', centromereSplit: 'Anaphase II' }
      },
      {
        id: 'colchicine',
        label: 'Colchicine Added (Spindle Poison)',
        badge: 'Polyploidy (4n)',
        effectTitle: 'Blocks Spindle Assembly at Metaphase → Polyploidy!',
        effectDetail: 'DNA replicated to 4C and chromatids split, but without mitotic spindle fibers the cell fails to divide — yielding a tetraploid (4n) cell!',
        overrideLedger: { chromosomes: 'Doubled (4n)', dnaContent: '4C', centromereSplit: 'Arrested at Metaphase' }
      }
    ]
  }
];

export const WORD_SWAP_DRILLS = [
  {
    id: 'ws-resp-1',
    chapterId: 'bot-respiration',
    statement: 'Glycolysis takes place in the mitochondrial matrix of all living organisms and releases 2 molecules of CO2 per glucose.',
    isExactNcert: false,
    swappedWord: 'mitochondrial matrix ... releases 2 molecules of CO2',
    correctWord: 'cytoplasm of the cell ... releases ZERO CO2',
    explanation: 'NCERT Section 12.2: Glycolysis occurs in the cytoplasm of the cell and produces 2 pyruvic acid molecules with ZERO CO2 release.'
  },
  {
    id: 'ws-resp-2',
    chapterId: 'bot-respiration',
    statement: 'In yeast fermentation, pyruvic acid is converted to CO2 and ethanol by pyruvic acid decarboxylase and alcohol dehydrogenase.',
    isExactNcert: true,
    swappedWord: '',
    correctWord: '',
    explanation: '100% Exact NCERT! Both enzymes and both products (CO2 + ethanol) are verbatim from NCERT Respiration in Plants.'
  },
  {
    id: 'ws-resp-3',
    chapterId: 'bot-respiration',
    statement: 'All enzymes of the TCA (Krebs) cycle are located inside the mitochondrial matrix without exception.',
    isExactNcert: false,
    swappedWord: 'without exception',
    correctWord: 'EXCEPT Succinate dehydrogenase, which is embedded in the inner mitochondrial membrane',
    explanation: 'Classic NEET trap! Succinate dehydrogenase is Complex II of the inner mitochondrial membrane, while all other TCA enzymes are soluble in the matrix.'
  },
  {
    id: 'ws-resp-4',
    chapterId: 'bot-respiration',
    statement: 'Cytochrome c is a small mobile protein attached to the inner surface of the inner mitochondrial membrane facing the matrix.',
    isExactNcert: false,
    swappedWord: 'inner surface ... facing the matrix',
    correctWord: 'outer surface of the inner membrane (facing intermembrane space)',
    explanation: 'NCERT explicitly specifies: Cytochrome c is a small protein attached to the OUTER surface of the inner membrane, carrying e⁻ between Complex III and IV.'
  },
  {
    id: 'ws-resp-5',
    chapterId: 'bot-respiration',
    statement: 'For each ATP produced by Complex V (ATP synthase), 4 H+ pass through F0 from the intermembrane space to the matrix down the electrochemical proton gradient.',
    isExactNcert: true,
    swappedWord: '',
    correctWord: '',
    explanation: '100% Exact latest NCERT! 4 H+ pass through F0 from intermembrane space → matrix per ATP synthesized by the matrix-facing F1 headpiece.'
  },
  {
    id: 'ws-resp-6',
    chapterId: 'bot-respiration',
    statement: 'Yeasts poison themselves to death when the concentration of alcohol reaches about 7 per cent.',
    isExactNcert: false,
    swappedWord: '7 per cent',
    correctWord: '13 per cent (<7% is the energy released in fermentation!)',
    explanation: 'Double NCERT number swap! Less than 7% of the energy in glucose is released during fermentation, whereas yeasts poison themselves at ~13% alcohol.'
  },
  {
    id: 'ws-resp-7',
    chapterId: 'bot-respiration',
    statement: 'When tripalmitin (fat) is used as a respiratory substrate, the respiratory quotient (RQ) is 0.7.',
    isExactNcert: true,
    swappedWord: '',
    correctWord: '',
    explanation: '100% Exact NCERT! 2(C51H98O6) + 145 O2 → 102 CO2 + 98 H2O ⇒ RQ = 102/145 = 0.7.'
  },
  {
    id: 'ws-photo-1',
    chapterId: 'bot-photosynthesis',
    statement: 'In C4 plants, mesophyll cells are rich in RuBisCO enzyme while bundle sheath cells lack RuBisCO and contain PEPcase.',
    isExactNcert: false,
    swappedWord: 'mesophyll cells are rich in RuBisCO ... bundle sheath lack RuBisCO',
    correctWord: 'mesophyll has PEPcase (lacks RuBisCO) and bundle sheath has RuBisCO (lacks PEPcase)',
    explanation: 'NCERT reverses the false claim: C4 spatial separation puts PEPcase in Mesophyll and RuBisCO inside thick-walled Bundle Sheath cells.'
  },
  {
    id: 'ws-photo-2',
    chapterId: 'bot-photosynthesis',
    statement: 'The stroma lamellae membranes lack PS II as well as NADP reductase enzyme.',
    isExactNcert: true,
    swappedWord: '',
    correctWord: '',
    explanation: '100% Exact NCERT! That is why stroma lamellae only carry out cyclic photophosphorylation (forming ATP only).'
  },
  {
    id: 'ws-photo-3',
    chapterId: 'bot-photosynthesis',
    statement: 'During photosynthesis in chloroplasts, protons accumulate in the stroma creating a decrease in pH in the stroma.',
    isExactNcert: false,
    swappedWord: 'in the stroma',
    correctWord: 'inside the thylakoid LUMEN',
    explanation: 'Protons accumulate inside the THYLAKOID LUMEN (acidifying the lumen), while stromal protons decrease!'
  },
  {
    id: 'ws-mol-1',
    chapterId: 'bot-molecular',
    statement: 'In the lac operon, the i gene codes for the inducer protein that turns on structural genes z, y, and a.',
    isExactNcert: false,
    swappedWord: 'inducer protein',
    correctWord: 'repressor protein ("i" refers to inhibitor, not inducer)',
    explanation: 'NCERT explicitly warns: "The i gene here does not refer to inducer, rather it is derived from the word inhibitor."'
  },
  {
    id: 'ws-mol-2',
    chapterId: 'bot-molecular',
    statement: 'During transcription, the 3′→5′ DNA strand acts as template while all reference points (promoter/terminator) are made with the 5′→3′ coding strand.',
    isExactNcert: true,
    swappedWord: '',
    correctWord: '',
    explanation: '100% Exact NCERT Molecular Basis of Inheritance!'
  },
  {
    id: 'ws-cc-1',
    chapterId: 'bot-cell-cycle',
    statement: 'During S phase of interphase, both the DNA content and the number of chromosomes double in diploid eukaryotic cells.',
    isExactNcert: false,
    swappedWord: 'both the DNA content and the number of chromosomes double',
    correctWord: 'DNA content doubles (2C→4C), but chromosome number remains UNCHANGED (2n)',
    explanation: 'Classic NCERT trap! Sister chromatids remain attached at one centromere, so chromosome count stays 2n.'
  },
  {
    id: 'ws-cc-2',
    chapterId: 'bot-cell-cycle',
    statement: 'Crossing over occurs in pachytene stage of Prophase I mediated by the enzyme recombinase, whereas chiasmata become visible in diplotene.',
    isExactNcert: true,
    swappedWord: '',
    correctWord: '',
    explanation: '100% Exact NCERT Cell Cycle and Cell Division!'
  },
  {
    id: 'ws-phys-1',
    chapterId: 'zoo-circulation',
    statement: 'Atrial systole accounts for about 70 per cent of the blood flow into the ventricles during a cardiac cycle.',
    isExactNcert: false,
    swappedWord: '70 per cent',
    correctWord: '30 per cent (70% enters passively during joint diastole)',
    explanation: 'NCERT states atrial systole increases ventricular flow by ~30%, while ~70% enters passively during joint diastole.'
  },
  {
    id: 'ws-phys-2',
    chapterId: 'zoo-excretion',
    statement: 'The ascending limb of the Loop of Henle is permeable to water and nearly impermeable to electrolytes.',
    isExactNcert: false,
    swappedWord: 'ascending limb',
    correctWord: 'DESCENDING limb (ascending limb is impermeable to water!)',
    explanation: 'Swapped limbs! Descending = permeable to water (concentrates filtrate); Ascending = impermeable to water, transports NaCl out (dilutes filtrate).'
  },
  {
    id: 'ws-phys-3',
    chapterId: 'zoo-locomotion',
    statement: 'During muscle contraction, the I-band gets reduced whereas the A-band retains its constant length.',
    isExactNcert: true,
    swappedWord: '',
    correctWord: '',
    explanation: '100% Exact NCERT Sliding Filament Theory!'
  }
];

export const PATHWAY_SEQUENCES = [
  {
    id: 'seq-glycolysis',
    chapterId: 'bot-respiration',
    title: 'Glycolysis (EMP Pathway) — Full 10-Step Carbon & Energy Flow',
    hint: 'Start from Glucose (6C), watch the 2 ATP investment steps, 3C cleavage, NADH step, and 2 SLP ATP steps.',
    steps: [
      'Glucose (6C) —(Hexokinase, −1 ATP)→ Glucose-6-phosphate',
      'Glucose-6-phosphate ⇌ Fructose-6-phosphate (Isomerisation)',
      'Fructose-6-phosphate —(PFK, −1 ATP)→ Fructose-1,6-bisphosphate',
      'Fructose-1,6-BP (6C) ⇌ 3-PGAL (3C) + DHAP (3C)',
      '2 × PGAL + 2 Pi + 2 NAD+ → 2 × 1,3-BPGA + 2 NADH + H+',
      '2 × 1,3-BPGA —(+2 ATP SLP)→ 2 × 3-PGA',
      '2 × 3-PGA → 2 × 2-PGA → 2 × PEP (Phosphoenolpyruvate)',
      '2 × PEP —(Pyruvate kinase, +2 ATP SLP)→ 2 × Pyruvic Acid (3C)'
    ]
  },
  {
    id: 'seq-krebs',
    chapterId: 'bot-respiration',
    title: 'Link Reaction & Tricarboxylic Acid (Krebs) Cycle',
    hint: 'Follow carbon count: 3C Pyruvate → 2C Acetyl-CoA + 4C OAA → 6C Citrate → 5C α-KG → 4C intermediates back to OAA.',
    steps: [
      'Pyruvate (3C) —(Pyruvate DH, +NADH, −CO2)→ Acetyl-CoA (2C)',
      'Acetyl-CoA (2C) + OAA (4C) + H2O —(Citrate synthase)→ Citric Acid (6C)',
      'Citric Acid (6C) —(−CO2, +NADH)→ α-Ketoglutaric Acid (5C)',
      'α-Ketoglutaric Acid (5C) —(−CO2, +NADH)→ Succinyl-CoA (4C)',
      'Succinyl-CoA (4C) —(+GTP SLP)→ Succinic Acid (4C)',
      'Succinic Acid (4C) —(IMM Complex II, +FADH2)→ Fumarate → Malic Acid (4C)',
      'Malic Acid (4C) —(+NADH)→ Oxaloacetic Acid (OAA, 4C)'
    ]
  },
  {
    id: 'seq-ets',
    chapterId: 'bot-respiration',
    title: 'Mitochondrial Electron Transport System (ETS) Sequence',
    hint: 'Trace electrons from NADH through Complex I, mobile Ubiquinone, Complex III, mobile Cytochrome c, and Complex IV to O2.',
    steps: [
      'NADH + H+ oxidised by Complex I (NADH dehydrogenase: FMN, Fe-S)',
      'Electrons transferred to mobile Ubiquinone (UQ → UQH2; also fed by Complex II)',
      'UQH2 transfers electrons to Complex III (Cytochrome bc1 complex)',
      'Complex III passes electrons to mobile Cytochrome c (outer IMM surface)',
      'Cytochrome c passes electrons to Complex IV (Cyt a, a3 + 2 Cu centres)',
      'Terminal e⁻ + 2 H+ + ½ O2 → H2O (4 H+ flow through F0–F1 Complex V → ATP)'
    ]
  },
  {
    id: 'seq-prophase1',
    chapterId: 'bot-cell-cycle',
    title: 'Meiosis I — Prophase I Substages',
    hint: 'L-Z-P-D-D: Compaction → Synapsis → Crossing Over → Chiasmata → Terminalisation.',
    steps: [
      'Leptotene: Gradual chromosome compaction becomes visible',
      'Zygotene: Homologous chromosomes pair (synapsis) with synaptonemal complex',
      'Pachytene: Recombination nodules appear; crossing over catalysed by recombinase',
      'Diplotene: Dissolution of synaptonemal complex; X-shaped chiasmata visible',
      'Diakinesis: Terminalisation of chiasmata; nucleolus & nuclear envelope disappear'
    ]
  },
  {
    id: 'seq-cardiac',
    chapterId: 'zoo-circulation',
    title: 'Human Cardiac Cycle & Heart Sound Sequence (0.8 s)',
    hint: 'Follow pressure changes, AV/Semilunar valve snaps, and P–QRS–T waves.',
    steps: [
      'Joint Diastole (0.4 s): AV open, SL closed; ~70% passive ventricular filling',
      'SA Node Fires → P-wave → Atrial Systole (0.1 s) adds remaining ~30% blood',
      'QRS Complex → Ventricular Systole begins; AV valves shut → 1st Sound (LUB)',
      'Semilunar valves forced open; ~70 mL Stroke Volume ejected into Aorta & Pulmonary Artery',
      'T-wave ends → Ventricular Diastole begins; Semilunar valves shut → 2nd Sound (DUB)'
    ]
  },
  {
    id: 'seq-zscheme',
    chapterId: 'bot-photosynthesis',
    title: 'Non-Cyclic Photophosphorylation (Z-Scheme) Electron Flow',
    hint: 'Start at H2O / P680 (PS II) and finish at NADP+ Reductase in the stroma.',
    steps: [
      'Water splitting on inner lumen side of PS II releases 4 H+, O2, and electrons',
      'P680 (PS II) absorbs 680 nm light and passes excited e⁻ to Pheophytin',
      'Plastoquinone (PQ) carries e⁻ + stromal H+ and passes e⁻ to Cytochrome b6f',
      'Plastocyanin (PC) on lumen side delivers e⁻ to P700 (PS I)',
      'P700 absorbs 700 nm light and transfers e⁻ to Ferredoxin (Fd)',
      'Stromal NADP+ reductase transfers e⁻ + stromal H+ to form NADPH + H+'
    ]
  }
];

export const CHAPTER_REVISION_SNAPSHOTS = {
  'bot-respiration': {
    title: 'Respiration in Plants — High-Yield NCERT Cheat Sheet',
    numbers: [
      { label: 'Glycolysis Net Yield (per Glucose)', value: '2 ATP (4 gross − 2 used) + 2 NADH + 2 H+ + 0 CO2' },
      { label: 'Fermentation Energy Captured', value: 'Less than 7% of glucose energy (2 Net ATP)' },
      { label: 'Yeast Alcohol Toxicity Threshold', value: 'About 13% alcohol concentration' },
      { label: 'Krebs Cycle per Turn (1 Acetyl-CoA)', value: '3 NADH + 1 FADH2 + 1 GTP + 2 CO2' },
      { label: 'Protons per ATP at F0–F1 (Latest NCERT)', value: '4 H+ from Intermembrane Space → Matrix' },
      { label: 'Theoretical Net Aerobic Yield', value: '38 ATP per glucose (4 Direct + 34 Oxidative)' },
      { label: 'Respiratory Quotient (RQ) Values', value: 'Carbs = 1.0 | Tripalmitin Fat = 0.7 | Proteins ≈ 0.9 | Organic acids > 1' }
    ],
    scientists: [
      { label: 'EMP Pathway (Glycolysis)', value: 'Gustav Embden, Otto Meyerhof, and J. Parnas' },
      { label: 'TCA / Citric Acid Cycle', value: 'Hans Krebs' }
    ],
    locationsAndTraps: [
      { label: 'Glycolysis & Fermentation', value: 'Cytoplasm (no O2 needed)' },
      { label: 'Link Reaction & Krebs Cycle', value: 'Mitochondrial Matrix (EXCEPT Succinate DH = IMM Complex II)' },
      { label: 'Cytochrome c Location', value: 'Outer surface of Inner Mitochondrial Membrane (mobile between III & IV)' },
      { label: 'Sucrose Entry into EMP', value: 'Split by Invertase into Glucose + Fructose → yields 4 Net ATP in EMP' }
    ]
  },
  'bot-photosynthesis': {
    title: 'Photosynthesis in Higher Plants — High-Yield NCERT Cheat Sheet',
    numbers: [
      { label: 'Reaction Centres', value: 'PS II = P680 (680 nm) | PS I = P700 (700 nm)' },
      { label: 'C3 Calvin Cost (per CO2 / per Glucose)', value: '3 ATP + 2 NADPH per CO2 | 18 ATP + 12 NADPH per Glucose' },
      { label: 'C4 Hatch-Slack Cost (per CO2 / per Glucose)', value: '5 ATP + 2 NADPH per CO2 | 30 ATP + 12 NADPH per Glucose' },
      { label: 'Light Saturation Point', value: '10% of full sunlight (rarely limiting except shade plants)' },
      { label: 'CO2 Compensation / Saturation', value: 'C4 saturates ~360 µL L⁻¹; C3 saturates >450 µL L⁻¹' }
    ],
    scientists: [
      { label: 'Cornelius van Niel', value: 'Proved O2 comes from H2O (purple/green sulphur bacteria used H2S)' },
      { label: 'Blackman (1905)', value: 'Law of Limiting Factors' },
      { label: 'Melvin Calvin / Hatch & Slack', value: 'C3 pathway (3-PGA) / C4 pathway (OAA in Kranz anatomy)' }
    ],
    locationsAndTraps: [
      { label: 'Stroma Lamellae', value: 'Lack PS II and NADP reductase → ONLY Cyclic Photophosphorylation (ATP only)' },
      { label: 'Proton Accumulation Site', value: 'Thylakoid LUMEN (pH drops in lumen, rises in stroma)' },
      { label: 'C4 Enzyme Separation', value: 'Mesophyll has PEPcase (no RuBisCO); Bundle Sheath has RuBisCO (no PEPcase)' }
    ]
  },
  'bot-molecular': {
    title: 'Molecular Basis of Inheritance — High-Yield NCERT Cheat Sheet',
    numbers: [
      { label: 'Human Genome Size', value: 'Haploid: 3.3 × 10⁹ bp | Diploid: 6.6 × 10⁹ bp (~2.2 m long)' },
      { label: 'Nucleosome DNA Length', value: '~200 bp wrapped around positively charged Histone Octamer (Lys & Arg rich)' },
      { label: 'E. coli DNA & Replication Time', value: '4.6 × 10⁶ bp | Replicates in 18 minutes (~2000 bp/s)' },
      { label: 'Genetic Code Triplets', value: '64 codons total: 61 sense + 3 STOP (UAA, UAG, UGA); AUG = Start & Met' }
    ],
    scientists: [
      { label: 'Griffith (1928) / Avery-MacLeod-McCarty (1944)', value: 'Transforming principle → DNA (proven by DNase)' },
      { label: 'Hershey & Chase (1952)', value: '32P (DNA) vs 35S (protein coat) in T2 bacteriophage → DNA is genetic material' },
      { label: 'Meselson & Stahl (1958)', value: '15N/14N CsCl density gradient in E. coli → Semiconservative replication' },
      { label: 'Jacob & Monod', value: 'Lac Operon (Negative regulation by i-gene repressor)' }
    ],
    locationsAndTraps: [
      { label: 'Eukaryotic RNA Polymerases', value: 'Pol I = rRNAs (28S, 18S, 5.8S) | Pol II = hnRNA | Pol III = tRNA, 5srRNA, snRNAs' },
      { label: 'Transcription Strand Polarity', value: 'Template = 3′→5′; mRNA & Coding Strand = 5′→3′ (identical except U vs T)' },
      { label: 'Lac Structural Genes', value: 'z = β-galactosidase | y = permease | a = transacetylase' }
    ]
  },
  'bot-cell-cycle': {
    title: 'Cell Cycle & Cell Division — High-Yield NCERT Cheat Sheet',
    numbers: [
      { label: 'Human Cell Cycle / Yeast Cycle', value: 'Human ~24 hours (M phase ~1 hr, Interphase >95%) | Yeast ~90 min' },
      { label: 'Ploidy Across Meiosis', value: 'G1: 2n, 2C → G2: 2n, 4C → Meiosis I: n, 2C → Meiosis II: n, 1C' }
    ],
    scientists: [
      { label: 'Recombinase Enzyme', value: 'Catalyses crossing over in Pachytene (non-sister chromatids)' }
    ],
    locationsAndTraps: [
      { label: 'S Phase Centriole', value: 'DNA replicates in nucleus; centriole duplicates in cytoplasm (animal cells)' },
      { label: 'Anaphase I vs Anaphase II', value: 'Centromeres DO NOT split in Anaphase I; they split in Mitosis Anaphase & Anaphase II' },
      { label: 'Prophase I Checkpoints', value: 'Synapsis = Zygotene | Crossing Over = Pachytene | Chiasmata = Diplotene | Terminalisation = Diakinesis' }
    ]
  },
  'zoo-circulation': {
    title: 'Body Fluids & Circulation + Excretion — High-Yield NCERT Cheat Sheet',
    numbers: [
      { label: 'Cardiac Cycle & Output', value: '0.8 s (Atrial systole 0.1s, Ventricular 0.3s, Joint diastole 0.4s) | SV = 70 mL | CO ≈ 5 L/min' },
      { label: 'Ventricular Filling Split', value: '70% Passive (Joint Diastole) + 30% Active (Atrial Systole)' },
      { label: 'GFR & Urine Output', value: '125 mL/min (180 L/day) vs 1.5 L urine (~99% reabsorbed)' },
      { label: 'Medullary Osmotic Gradient', value: '300 mOsmL⁻¹ (cortex) → 1200 mOsmL⁻¹ (inner medulla) via NaCl + Urea' }
    ],
    scientists: [
      { label: 'ECG Waves', value: 'P = Atrial depol | QRS = Ventricular depol | T = Ventricular repol' }
    ],
    locationsAndTraps: [
      { label: 'Heart Sounds', value: 'LUB = AV valves close (start of vent. systole) | DUB = Semilunar close (start of vent. diastole)' },
      { label: 'Loop of Henle Permeability', value: 'Descending = Water permeable | Ascending = Impermeable to Water, transports NaCl out' }
    ]
  }
};

export const BETWEEN_THE_LINES_QUESTIONS = [
  {
    id: 'btl-resp-1',
    chapterId: 'bot-respiration',
    type: 'Assertion-Reason',
    ncertRef: 'NCERT Class XI · Ch 12 (Fermentation vs Glycolysis)',
    question:
      '**Assertion (A):** Even though fermentation yields zero additional ATP after glycolysis, anaerobic cells must convert pyruvic acid into lactic acid or ethanol.\n\n**Reason (R):** Glycolysis requires a continuous supply of oxidised NAD+ at the PGAL → 1,3-BPGA step, which fermentation regenerates from NADH + H+.',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A).',
      'Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).',
      '(A) is true, but (R) is false.',
      '(A) is false, but (R) is true.'
    ],
    correctIndex: 0,
    explanation:
      'Between the lines of NCERT 12.3: Fermentation exists solely to re-oxidise NADH + H+ back to NAD+ so that Glyceraldehyde-3-phosphate dehydrogenase in glycolysis does not stall.'
  },
  {
    id: 'btl-resp-2',
    chapterId: 'bot-respiration',
    type: 'Pathway Perturbation',
    ncertRef: 'NCERT Class XI · Ch 12 (ETS & Chemiosmosis)',
    question:
      'If a proton uncoupler (such as 2,4-dinitrophenol) makes the inner mitochondrial membrane freely permeable to H+ ions while oxygen and NADH remain abundant, what is the immediate outcome?',
    options: [
      'Both electron transport (O2 consumption) and oxidative ATP synthesis immediately stop.',
      'Electron transport and O2 consumption continue or accelerate, but oxidative ATP synthesis stops and energy is dissipated as heat.',
      'Complex V reverses and pumps glucose out of the mitochondrial matrix.',
      'Substrate-level phosphorylation in glycolysis yields 38 ATP to compensate.'
    ],
    correctIndex: 1,
    explanation:
      'Chemiosmotic deduction: ETS (Complexes I–IV) continues transferring electrons to O2 without back-pressure, while H+ leaks across the inner membrane bypassing F0–F1 ATP synthase—dropping oxidative phosphorylation to zero and releasing energy as heat.'
  },
  {
    id: 'btl-resp-3',
    chapterId: 'bot-respiration',
    type: 'Statement I & II',
    ncertRef: 'NCERT Class XI · Ch 12 (Sucrose & Krebs Cycle)',
    question:
      '**Statement I:** In plants, one molecule of sucrose entering glycolysis yields 4 net ATP and 4 NADH + 4 H+ at the end of the EMP pathway.\n\n**Statement II:** All enzymes of the Krebs cycle are located in the mitochondrial matrix except succinate dehydrogenase, which is bound to the inner mitochondrial membrane.',
    options: [
      'Both Statement I and Statement II are correct.',
      'Both Statement I and Statement II are incorrect.',
      'Statement I is correct, but Statement II is incorrect.',
      'Statement I is incorrect, but Statement II is correct.'
    ],
    correctIndex: 0,
    explanation:
      'NCERT 12.2 states invertase splits 1 sucrose into 1 glucose + 1 fructose, both entering glycolysis (2 × [2 net ATP + 2 NADH] = 4 ATP + 4 NADH). Statement II is also verbatim NCERT: Succinate dehydrogenase = Complex II in IMM.'
  },
  {
    id: 'btl-resp-4',
    chapterId: 'bot-respiration',
    type: 'Quantitative Deduction',
    ncertRef: 'NCERT Class XI · Ch 12 (Complex V & RQ)',
    question:
      'How many protons (H+) must pass through the F0 channel of ATP synthase from the intermembrane space to the matrix to synthesize the 34 oxidative ATP molecules produced during aerobic respiration of 1 glucose molecule (latest NCERT)?',
    options: ['68 H+', '102 H+', '136 H+', '152 H+'],
    correctIndex: 2,
    explanation:
      'Latest NCERT Section 12.5 explicitly specifies 4 H+ pass through F0 per ATP produced. For 34 oxidative ATP (10 NADH × 3 + 2 FADH2 × 2 = 34 ATP), 34 × 4 = 136 H+ pass through F0! (4 ATP come from substrate-level phosphorylation, not F0–F1).'
  },
  {
    id: 'btl-resp-5',
    chapterId: 'bot-respiration',
    type: 'Assertion-Reason',
    ncertRef: 'NCERT Class XI · Ch 12 (Amphibolic Pathway)',
    question:
      '**Assertion (A):** Although Krebs cycle is an oxygen-independent pathway on paper, it stops immediately when a cell is deprived of oxygen.\n\n**Reason (R):** Without oxygen acting as the terminal electron acceptor at Complex IV, mitochondrial NADH + H+ and FADH2 cannot be re-oxidised to NAD+ and FAD.',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A).',
      'Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).',
      '(A) is true, but (R) is false.',
      '(A) is false, but (R) is true.'
    ],
    correctIndex: 0,
    explanation:
      'Between the lines: None of the TCA enzymes directly consume O2, yet TCA relies entirely on NAD+ and FAD supplied back by O2-driven ETS.'
  },
  {
    id: 'btl-photo-1',
    chapterId: 'bot-photosynthesis',
    type: 'Statement I & II',
    ncertRef: 'NCERT Class XI · Ch 11 (Stroma Lamellae & Chemiosmosis)',
    question:
      '**Statement I:** Isolated stroma lamellae illuminated with 700 nm light can synthesize ATP, but cannot evolve O2 or synthesize NADPH.\n\n**Statement II:** In chloroplasts, proton accumulation occurs inside the thylakoid lumen whereas in mitochondria, protons accumulate in the intermembrane space.',
    options: [
      'Both Statement I and Statement II are correct.',
      'Both Statement I and Statement II are incorrect.',
      'Statement I is correct, but Statement II is incorrect.',
      'Statement I is incorrect, but Statement II is correct.'
    ],
    correctIndex: 0,
    explanation:
      'Stroma lamellae lack PS II and NADP reductase → only cyclic photophosphorylation (ATP only) occurs at 700 nm. Statement II accurately contrasts chloroplast lumen vs mitochondrial intermembrane space.'
  },
  {
    id: 'btl-photo-2',
    chapterId: 'bot-photosynthesis',
    type: 'Quantitative Deduction',
    ncertRef: 'NCERT Class XI · Ch 11 (C3 vs C4 Cost)',
    question:
      'To synthesize ONE molecule of sucrose (12 carbons) in a maize (C4) leaf compared to a wheat (C3) leaf, how many MORE ATP molecules are required by maize?',
    options: ['12 ATP', '24 ATP', '36 ATP', '60 ATP'],
    correctIndex: 1,
    explanation:
      'Watch the substrate trap! 1 Sucrose = 12 CO2 fixed. C3 costs 3 ATP/CO2 (36 ATP); C4 costs 5 ATP/CO2 (60 ATP) due to 2 extra ATP per CO2 to convert Pyruvate → PEP. Difference = 60 − 36 = 24 ATP!'
  },
  {
    id: 'btl-mol-1',
    chapterId: 'bot-molecular',
    type: 'Assertion-Reason',
    ncertRef: 'NCERT Class XII · Ch 5 (Lac Operon)',
    question:
      '**Assertion (A):** In the lac operon, a very low level of expression is continuously present in the cell even in the absence of lactose.\n\n**Reason (R):** Without trace basal expression of permease, lactose could never enter the E. coli cell to trigger induction of the operon.',
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A).',
      'Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).',
      '(A) is true, but (R) is false.',
      '(A) is false, but (R) is true.'
    ],
    correctIndex: 0,
    explanation:
      'Direct NCERT Class XII "Between-the-Lines" footnote! NCERT states: "A very low level of expression of lac operon has to be present in the cell all the time, otherwise lactose cannot enter the cells."'
  },
  {
    id: 'btl-cc-1',
    chapterId: 'bot-cell-cycle',
    type: 'Quantitative Deduction',
    ncertRef: 'NCERT Class XI · Ch 10 (Ploidy vs DNA)',
    question:
      'A diploid plant has 2n = 24 chromosomes and its pollen grain (male gamete) contains 15 pg of DNA. What will be the chromosome number and DNA content in its meiocyte at Metaphase I?',
    options: [
      '12 chromosomes, 30 pg DNA',
      '24 chromosomes, 30 pg DNA',
      '24 chromosomes, 60 pg DNA',
      '48 chromosomes, 60 pg DNA'
    ],
    correctIndex: 2,
    explanation:
      'Pollen grain is haploid (n = 12, 1C = 15 pg). A diploid meiocyte at G1 is 2n = 24, 2C = 30 pg. After S phase (at G2 and Metaphase I), DNA doubles to 4C = 60 pg while chromosome count remains 2n = 24!'
  },
  {
    id: 'btl-circ-1',
    chapterId: 'zoo-circulation',
    type: 'Statement I & II',
    ncertRef: 'NCERT Class XI · Ch 15 (Cardiac Cycle & ECG)',
    question:
      '**Statement I:** Even if the atria failed to contract actively, ventricles would still receive about 70% of their normal blood filling passively during joint diastole.\n\n**Statement II:** The first heart sound (Lub) is produced when the semilunar valves close at the onset of ventricular diastole.',
    options: [
      'Both Statement I and Statement II are correct.',
      'Both Statement I and Statement II are incorrect.',
      'Statement I is correct, but Statement II is incorrect.',
      'Statement I is incorrect, but Statement II is correct.'
    ],
    correctIndex: 2,
    explanation:
      'Statement I is true (~70% enters passively during joint diastole, 30% via atrial systole). Statement II is false: Lub is caused by closure of AV (tricuspid & bicuspid) valves at the start of ventricular systole; Dub is caused by semilunar valve closure.'
  },
  {
    id: 'btl-exc-1',
    chapterId: 'zoo-excretion',
    type: 'Pathway Perturbation',
    ncertRef: 'NCERT Class XI · Ch 16 (Counter-Current & ADH)',
    question:
      'A patient has a healthy Loop of Henle and a normal medullary osmotic gradient (300 → 1200 mOsmolL⁻¹), yet excretes large volumes of dilute urine due to complete absence of ADH. Why?',
    options: [
      'NaCl transport out of the thick ascending limb stops without ADH.',
      'The collecting duct and late DCT remain impermeable to water without ADH, so the medullary gradient cannot draw water out.',
      'Bowman’s capsule stops glomerular filtration.',
      'The descending limb becomes impermeable to NaCl.'
    ],
    correctIndex: 1,
    explanation:
      'The Loop of Henle builds the 300→1200 mOsm/L gradient independently, but ADH is required to make the late DCT and collecting duct water-permeable so water can actually move into the hyperosmotic medulla!'
  }
];
