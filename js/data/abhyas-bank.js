/**
 * Curated NTA Abhyas & NCERT Line-by-Line Practice Question Bank (Physics, Chemistry, Botany, Zoology).
 * Combines high-yield NTA Abhyas style conceptual/numerical/Statement/Assertion-Reason questions
 * with the built-in Organic Chemistry NCERT Trap bank (from offline-questions.js).
 */

import { OFFLINE_QUESTIONS } from './offline-questions.js';

const ORGANIC_CHAPTER_MAP = {
  'c11-goc': 'che-goc',
  'c11-alkanes': 'che-hydrocarbons',
  'c11-alkenes': 'che-hydrocarbons',
  'c11-alkynes': 'che-hydrocarbons',
  'c11-aromatic': 'che-hydrocarbons',
  'c12-halo': 'che-haloalkanes',
  'c12-alcohols': 'che-alcohols',
  'c12-carbonyls': 'che-carbonyls',
  'c12-amines': 'che-amines',
  'c12-biomolecules': 'che-biomolecules'
};

const CONVERTED_ORGANIC_ABHYAS = OFFLINE_QUESTIONS.map((q) => {
  const chapterId = ORGANIC_CHAPTER_MAP[q.chapter] || 'che-goc';
  const classLevel = q.chapter.startsWith('c11') ? 11 : 12;
  return {
    id: `abh-${q.id}`,
    subject: 'chemistry',
    chapterId,
    classLevel,
    source: 'ABHYAS',
    examTag: `NTA Abhyas / NCERT (${q.type})`,
    year: null,
    qNo: null,
    section: null,
    question: q.question,
    questionImage: null,
    imageOnly: false,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation
  };
});

const CORE_ABHYAS_QUESTIONS = [
  // ================= PHYSICS (20 verified high-yield NTA Abhyas questions) =================
  {
    id: 'abh-phy-01',
    subject: 'physics',
    chapterId: 'phy-units',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'In an experiment, the percentage errors in the measurement of physical quantities \\(A, B, C\\) and \\(D\\) are \\(1\\%, 2\\%, 3\\%\\) and \\(4\\%\\) respectively. The maximum percentage error in \\(X = \\frac{A^2 B^{1/2}}{C^{1/3} D^3}\\) is:',
    options: ['16%', '14%', '12%', '10%'],
    correctIndex: 0,
    explanation:
      '\\(\\frac{\\Delta X}{X}\\% = 2(1\\%) + \\frac{1}{2}(2\\%) + \\frac{1}{3}(3\\%) + 3(4\\%) = 2 + 1 + 1 + 12 = 16\\%\\).'
  },
  {
    id: 'abh-phy-02',
    subject: 'physics',
    chapterId: 'phy-1d-motion',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'A particle moves along a straight line such that its displacement \\(x\\) (in metres) at time \\(t\\) (in seconds) is given by \\(t = \\sqrt{x} + 3\\). The displacement of the particle when its velocity is zero is:',
    options: ['\\(0\\text{ m}\\)', '\\(3\\text{ m}\\)', '\\(6\\text{ m}\\)', '\\(9\\text{ m}\\)'],
    correctIndex: 0,
    explanation:
      '\\(\\sqrt{x} = t - 3 \\implies x = (t - 3)^2\\). Velocity \\(v = \\frac{dx}{dt} = 2(t - 3)\\), which is zero at \\(t = 3\\text{ s}\\). At \\(t = 3\\text{ s}\\), displacement \\(x = (3 - 3)^2 = 0\\text{ m}\\).'
  },
  {
    id: 'abh-phy-03',
    subject: 'physics',
    chapterId: 'phy-2d-motion',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'A projectile is fired at an angle such that its horizontal range is \\(4\\sqrt{3}\\) times its maximum height. The angle of projection is:',
    options: ['\\(30^\\circ\\)', '\\(45^\\circ\\)', '\\(60^\\circ\\)', '\\(15^\\circ\\)'],
    correctIndex: 0,
    explanation:
      '\\(R = \\frac{4H}{\\tan\\theta}\\). Given \\(R = 4\\sqrt{3}H \\implies \\tan\\theta = \\frac{1}{\\sqrt{3}} \\implies \\theta = 30^\\circ\\).'
  },
  {
    id: 'abh-phy-04',
    subject: 'physics',
    chapterId: 'phy-nlm',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'A block of mass \\(2\\text{ kg}\\) rests on a rough inclined plane making an angle of \\(30^\\circ\\) with the horizontal. The coefficient of static friction between the block and the plane is \\(0.7\\). The frictional force on the block is (\\(g = 9.8\\text{ m s}^{-2}\\)):',
    options: ['\\(9.8\\text{ N}\\)', '\\(0.7 \\times 9.8\\sqrt{3}\\text{ N}\\)', '\\(9.8\\sqrt{3}\\text{ N}\\)', '\\(0.7 \\times 9.8\\text{ N}\\)'],
    correctIndex: 0,
    explanation:
      'Limiting friction \\(f_L = \\mu mg\\cos30^\\circ = 0.7 \\times 2 \\times 9.8 \\times 0.866 \\approx 11.88\\text{ N}\\). Downward component \\(mg\\sin30^\\circ = 2 \\times 9.8 \\times 0.5 = 9.8\\text{ N} < f_L\\). Thus static friction equals \\(mg\\sin30^\\circ = 9.8\\text{ N}\\).'
  },
  {
    id: 'abh-phy-05',
    subject: 'physics',
    chapterId: 'phy-wep',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'If the momentum of a body increases by \\(20\\%\\), the percentage increase in its kinetic energy is:',
    options: ['44%', '40%', '20%', '36%'],
    correctIndex: 0,
    explanation:
      '\\(K = \\frac{p^2}{2m}\\). When \\(p\' = 1.2p\\), \\(K\' = (1.2)^2 K = 1.44K\\), an increase of \\(44\\%\\).'
  },
  {
    id: 'abh-phy-06',
    subject: 'physics',
    chapterId: 'phy-rotation',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'A solid sphere rolls down an inclined plane without slipping. The ratio of its rotational kinetic energy to its total kinetic energy is:',
    options: ['\\(2:7\\)', '\\(5:7\\)', '\\(2:5\\)', '\\(1:3\\)'],
    correctIndex: 0,
    explanation:
      'For a solid sphere, \\(k^2/R^2 = 2/5\\). \\(\\frac{K_{\\text{rot}}}{K_{\\text{total}}} = \\frac{k^2/R^2}{1 + k^2/R^2} = \\frac{2/5}{7/5} = \\frac{2}{7}\\).'
  },
  {
    id: 'abh-phy-07',
    subject: 'physics',
    chapterId: 'phy-gravitation',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'At what height above the Earth’s surface is the acceleration due to gravity equal to \\(1/9\\) of its value on the surface (radius of Earth = \\(R\\))?',
    options: ['\\(2R\\)', '\\(3R\\)', '\\(8R\\)', '\\(R/2\\)'],
    correctIndex: 0,
    explanation:
      '\\(g\' = \\frac{g}{(1 + h/R)^2} = \\frac{g}{9} \\implies 1 + \\frac{h}{R} = 3 \\implies h = 2R\\).'
  },
  {
    id: 'abh-phy-08',
    subject: 'physics',
    chapterId: 'phy-fluids',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'Eight identical spherical drops of mercury of radius \\(r\\) coalesce to form a single big drop. If surface tension of mercury is \\(T\\), the energy released in the process is:',
    options: ['\\(16\\pi r^2 T\\)', '\\(8\\pi r^2 T\\)', '\\(32\\pi r^2 T\\)', '\\(4\\pi r^2 T\\)'],
    correctIndex: 0,
    explanation:
      'Big drop radius \\(R = 8^{1/3}r = 2r\\). Surface area decreases from \\(8(4\\pi r^2) = 32\\pi r^2\\) to \\(4\\pi (2r)^2 = 16\\pi r^2\\). Energy released \\(= T\\Delta A = 16\\pi r^2 T\\).'
  },
  {
    id: 'abh-phy-09',
    subject: 'physics',
    chapterId: 'phy-thermo',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'Statement I: In an adiabatic expansion of an ideal gas, the temperature of the gas decreases.\nStatement II: During adiabatic expansion, positive work is done by the gas at the expense of its internal energy.\nChoose the most appropriate answer:',
    options: [
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    correctIndex: 0,
    explanation:
      'For adiabatic process, \\(\\Delta Q = 0 \\implies \\Delta U = -\\Delta W\\). Positive expansion work lowers \\(U = nC_v T\\), cooling the gas.'
  },
  {
    id: 'abh-phy-10',
    subject: 'physics',
    chapterId: 'phy-waves',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'A closed organ pipe and an open organ pipe of the same length produce \\(2\\text{ beats s}^{-1}\\) when sounded in their fundamental modes. If the length of the open pipe is halved and that of the closed pipe is doubled, the number of beats produced per second will be:',
    options: ['\\(7\\)', '\\(4\\)', '\\(2\\)', '\\(8\\)'],
    correctIndex: 0,
    explanation:
      'Initially \\(f_{\\text{open}} = \\frac{v}{2L}\\), \\(f_{\\text{closed}} = \\frac{v}{4L}\\), so \\(\\frac{v}{2L} - \\frac{v}{4L} = \\frac{v}{4L} = 2\\text{ Hz}\\). After changes: \\(f\'_{\\text{open}} = \\frac{v}{2(L/2)} = \\frac{v}{L} = 8\\text{ Hz}\\), \\(f\'_{\\text{closed}} = \\frac{v}{4(2L)} = \\frac{v}{8L} = 1\\text{ Hz}\\). Beat frequency \\(= 8 - 1 = 7\\text{ Hz}\\).'
  },
  {
    id: 'abh-phy-11',
    subject: 'physics',
    chapterId: 'phy-electrostatics',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'A charge \\(q\\) is placed at the centre of one face of a cube of side \\(a\\). The total electric flux passing through the cube is:',
    options: ['\\(\\frac{q}{2\\varepsilon_0}\\)', '\\(\\frac{q}{6\\varepsilon_0}\\)', '\\(\\frac{q}{\\varepsilon_0}\\)', '\\(\\frac{q}{8\\varepsilon_0}\\)'],
    correctIndex: 0,
    explanation:
      'By symmetry, placing an identical adjacent cube encloses \\(q\\) completely at the shared face. Total flux through two cubes is \\(q/\\varepsilon_0\\), so through one cube is \\(q/(2\\varepsilon_0)\\).'
  },
  {
    id: 'abh-phy-12',
    subject: 'physics',
    chapterId: 'phy-capacitance',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'A parallel plate air capacitor has capacitance \\(C\\). When it is half filled with a dielectric of dielectric constant \\(K = 5\\) (covering half the area of the plates, full separation), the percentage increase in capacitance is:',
    options: ['200%', '400%', '250%', '100%'],
    correctIndex: 0,
    explanation:
      'Two halves in parallel: \\(C\' = \\frac{C}{2} + \\frac{KC}{2} = \\frac{1+5}{2}C = 3C\\). Increase is \\(\\frac{3C - C}{C} \\times 100 = 200\\%\\).'
  },
  {
    id: 'abh-phy-13',
    subject: 'physics',
    chapterId: 'phy-current',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'A wire of resistance \\(R\\) is stretched uniformly so that its length increases by \\(10\\%\\) without change in volume. Its new resistance is:',
    options: ['\\(1.21 R\\)', '\\(1.10 R\\)', '\\(1.20 R\\)', '\\(0.81 R\\)'],
    correctIndex: 0,
    explanation:
      'At constant volume, \\(R \\propto L^2\\). Thus \\(R\' = (1.1)^2 R = 1.21 R\\).'
  },
  {
    id: 'abh-phy-14',
    subject: 'physics',
    chapterId: 'phy-magnetism',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'An electron and a proton enter a uniform magnetic field perpendicularly with the same kinetic energy. The ratio of the radius of the circular path of the electron to that of the proton (\\(r_e / r_p\\)) is:',
    options: ['\\(\\sqrt{m_e / m_p}\\)', '\\(m_e / m_p\\)', '\\(\\sqrt{m_p / m_e}\\)', '\\(1 : 1\\)'],
    correctIndex: 0,
    explanation:
      '\\(r = \\frac{\\sqrt{2mK}}{qB}\\). Since \\(K, q, B\\) are identical, \\(r \\propto \\sqrt{m}\\), so \\(r_e / r_p = \\sqrt{m_e / m_p}\\).'
  },
  {
    id: 'abh-phy-15',
    subject: 'physics',
    chapterId: 'phy-ac',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'In a series LCR circuit, \\(R = 300\\,\\Omega\\), \\(L = 0.9\\text{ H}\\), \\(C = 2\\,\\mu\\text{F}\\), and \\(\\omega = 1000\\text{ rad s}^{-1}\\). The impedance of the circuit is:',
    options: ['\\(500\\,\\Omega\\)', '\\(400\\,\\Omega\\)', '\\(900\\,\\Omega\\)', '\\(300\\,\\Omega\\)'],
    correctIndex: 0,
    explanation:
      '\\(X_L = \\omega L = 900\\,\\Omega\\); \\(X_C = \\frac{1}{\\omega C} = \\frac{1}{1000 \\times 2\\times 10^{-6}} = 500\\,\\Omega\\). \\(Z = \\sqrt{R^2 + (X_L - X_C)^2} = \\sqrt{300^2 + 400^2} = 500\\,\\Omega\\).'
  },
  {
    id: 'abh-phy-16',
    subject: 'physics',
    chapterId: 'phy-ray-optics',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'An equiconvex lens of focal length \\(20\\text{ cm}\\) (made of glass \\(\\mu = 1.5\\)) is cut into two equal plano-convex lenses along a plane perpendicular to its principal axis. The focal length of each half is:',
    options: ['\\(40\\text{ cm}\\)', '\\(20\\text{ cm}\\)', '\\(10\\text{ cm}\\)', '\\(80\\text{ cm}\\)'],
    correctIndex: 0,
    explanation:
      'Cutting perpendicular to the principal axis halves the power of each piece (only one curved face instead of two), so focal length doubles from \\(20\\text{ cm}\\) to \\(40\\text{ cm}\\).'
  },
  {
    id: 'abh-phy-17',
    subject: 'physics',
    chapterId: 'phy-wave-optics',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'In Young’s double slit experiment, two coherent waves of intensities \\(I\\) and \\(4I\\) interfere. The ratio of maximum intensity to minimum intensity in the interference pattern is:',
    options: ['\\(9:1\\)', '\\(5:3\\)', '\\(4:1\\)', '\\(25:9\\)'],
    correctIndex: 0,
    explanation:
      '\\(\\frac{I_{\\max}}{I_{\\min}} = \\left(\\frac{\\sqrt{I_1}+\\sqrt{I_2}}{\\sqrt{I_1}-\\sqrt{I_2}}\\right)^2 = \\left(\\frac{1+2}{2-1}\\right)^2 = \\frac{9}{1}\\).'
  },
  {
    id: 'abh-phy-18',
    subject: 'physics',
    chapterId: 'phy-dual',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'An \\(\\alpha\\)-particle and a proton are accelerated from rest through the same potential difference \\(V\\). The ratio of their de Broglie wavelengths \\(\\lambda_p / \\lambda_\\alpha\\) is:',
    options: ['\\(2\\sqrt{2} : 1\\)', '\\(\\sqrt{2} : 1\\)', '\\(4 : 1\\)', '\\(1 : 2\\sqrt{2}\\)'],
    correctIndex: 0,
    explanation:
      '\\(\\lambda = \\frac{h}{\\sqrt{2mqV}}\\). With \\(m_\\alpha = 4m_p\\) and \\(q_\\alpha = 2q_p\\), \\(\\frac{\\lambda_p}{\\lambda_\\alpha} = \\sqrt{\\frac{m_\\alpha q_\\alpha}{m_p q_p}} = \\sqrt{4 \\times 2} = 2\\sqrt{2}\\).'
  },
  {
    id: 'abh-phy-19',
    subject: 'physics',
    chapterId: 'phy-nuclei',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'The half-life of a radioactive substance is \\(20\\text{ minutes}\\). The time interval between \\(33\\%\\) decay and \\(67\\%\\) decay of the same sample is approximately:',
    options: ['\\(20\\text{ min}\\)', '\\(40\\text{ min}\\)', '\\(10\\text{ min}\\)', '\\(30\\text{ min}\\)'],
    correctIndex: 0,
    explanation:
      'Remaining fraction drops from \\(67\\%\\) (about \\(2/3\\)) to \\(33\\%\\) (about \\(1/3\\)), which is halving of the sample! Hence the interval equals one half-life \\(= 20\\text{ min}\\).'
  },
  {
    id: 'abh-phy-20',
    subject: 'physics',
    chapterId: 'phy-semiconductors',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Physics',
    question:
      'Assertion (A): In a full-wave rectifier, the ripple frequency of the output is twice the input AC mains frequency.\nReason (R): Both positive and negative half-cycles of the input AC signal produce unidirectional pulses in the load.\nChoose the correct option:',
    options: [
      'Both A and R are true and R is the correct explanation of A',
      'Both A and R are true but R is NOT the correct explanation of A',
      'A is true but R is false',
      'A is false but R is true'
    ],
    correctIndex: 0,
    explanation:
      'A full-wave rectifier conducts during both half-cycles, producing two output pulses per input period, doubling the fundamental ripple frequency (e.g., 100 Hz for 50 Hz AC).'
  },

  // ================= CHEMISTRY (Physical & Inorganic NTA Abhyas, 20 Qs; Organic covered via 42 converted cards) =================
  {
    id: 'abh-che-01',
    subject: 'chemistry',
    chapterId: 'che-basic',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'The number of water molecules present in \\(1\\text{ drop}\\) of water having a volume of \\(0.018\\text{ mL}\\) at \\(298\\text{ K}\\) (density \\(= 1\\text{ g mL}^{-1}\\)) is:',
    options: ['\\(6.022 \\times 10^{20}\\)', '\\(6.022 \\times 10^{23}\\)', '\\(6.022 \\times 10^{19}\\)', '\\(1.8 \\times 10^{20}\\)'],
    correctIndex: 0,
    explanation:
      'Mass \\(= 0.018\\text{ g}\\). Moles \\(= \\frac{0.018}{18} = 10^{-3}\\text{ mol}\\). Molecules \\(= 10^{-3} \\times 6.022 \\times 10^{23} = 6.022 \\times 10^{20}\\).'
  },
  {
    id: 'abh-che-02',
    subject: 'chemistry',
    chapterId: 'che-atom',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'The total number of radial nodes and angular nodes present in a \\(4d\\) orbital are respectively:',
    options: ['1 and 2', '2 and 2', '2 and 1', '1 and 3'],
    correctIndex: 0,
    explanation:
      'For \\(4d\\): \\(n = 4, l = 2\\). Radial nodes \\(= n - l - 1 = 4 - 2 - 1 = 1\\); Angular nodes \\(= l = 2\\).'
  },
  {
    id: 'abh-che-03',
    subject: 'chemistry',
    chapterId: 'che-periodic',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'Which of the following represents the correct order of negative electron gain enthalpy (magnitude) of halogens?',
    options: ['\\(\\text{Cl} > \\text{F} > \\text{Br} > \\text{I}\\)', '\\(\\text{F} > \\text{Cl} > \\text{Br} > \\text{I}\\)', '\\(\\text{Cl} > \\text{Br} > \\text{F} > \\text{I}\\)', '\\(\\text{I} > \\text{Br} > \\text{Cl} > \\text{F}\\)'],
    correctIndex: 0,
    explanation:
      'Due to small size of the \\(2p\\) subshell in fluorine and strong inter-electronic repulsion, chlorine has a more negative electron gain enthalpy than fluorine: \\(\\text{Cl} > \\text{F} > \\text{Br} > \\text{I}\\).'
  },
  {
    id: 'abh-che-04',
    subject: 'chemistry',
    chapterId: 'che-bonding',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'Among the following species, which pair is isostructural and has linear geometry?',
    options: ['\\(\\text{XeF}_2\\) and \\(\\text{I}_3^-\\)', '\\(\\text{SF}_4\\) and \\(\\text{XeF}_4\\)', '\\(\\text{BF}_3\\) and \\(\\text{ClF}_3\\)', '\\(\\text{SO}_2\\) and \\(\\text{CO}_2\\)'],
    correctIndex: 0,
    explanation:
      'Both \\(\\text{XeF}_2\\) and \\(\\text{I}_3^-\\) have steric number 5 (\\(sp^3d\\) hybridisation) with 2 bond pairs and 3 equatorial lone pairs, giving linear geometry.'
  },
  {
    id: 'abh-che-05',
    subject: 'chemistry',
    chapterId: 'che-thermo',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'For a reaction \\(\\Delta H = +35.5\\text{ kJ mol}^{-1}\\) and \\(\\Delta S = +83.6\\text{ J K}^{-1}\\text{ mol}^{-1}\\). Above what temperature will the reaction become spontaneous?',
    options: ['\\(425\\text{ K}\\)', '\\(298\\text{ K}\\)', '\\(325\\text{ K}\\)', '\\(510\\text{ K}\\)'],
    correctIndex: 0,
    explanation:
      'Spontaneous when \\(\\Delta G < 0 \\implies T > \\frac{\\Delta H}{\\Delta S} = \\frac{35500}{83.6} \\approx 424.6\\text{ K}\\).'
  },
  {
    id: 'abh-che-06',
    subject: 'chemistry',
    chapterId: 'che-equilibrium',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'The \\(K_{sp}\\) of \\(\\text{Ag}_2\\text{CrO}_4\\) is \\(4 \\times 10^{-12}\\) at \\(298\\text{ K}\\). Its molar solubility in pure water is:',
    options: ['\\(10^{-4}\\text{ mol L}^{-1}\\)', '\\(2 \\times 10^{-4}\\text{ mol L}^{-1}\\)', '\\(10^{-6}\\text{ mol L}^{-1}\\)', '\\(4 \\times 10^{-4}\\text{ mol L}^{-1}\\)'],
    correctIndex: 0,
    explanation:
      'For \\(A_2B\\) salt, \\(K_{sp} = (2s)^2(s) = 4s^3 = 4 \\times 10^{-12} \\implies s^3 = 10^{-12} \\implies s = 10^{-4}\\text{ M}\\).'
  },
  {
    id: 'abh-che-07',
    subject: 'chemistry',
    chapterId: 'che-redox',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'Which of the following species cannot undergo disproportionation reaction?',
    options: ['\\(\\text{ClO}_4^-\\)', '\\(\\text{ClO}^-\\)', '\\(\\text{ClO}_2^-\\)', '\\(\\text{ClO}_3^-\\)'],
    correctIndex: 0,
    explanation:
      'In \\(\\text{ClO}_4^-\\), chlorine is already in its highest possible oxidation state (\\(+7\\)), so it cannot be further oxidised and hence cannot disproportionate.'
  },
  {
    id: 'abh-che-08',
    subject: 'chemistry',
    chapterId: 'che-solutions',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'Which aqueous solution will exhibit the highest boiling point (assuming 100% dissociation)?',
    options: ['\\(0.1\\text{ M } \\text{Al}_2(\\text{SO}_4)_3\\)', '\\(0.1\\text{ M } \\text{Na}_2\\text{SO}_4\\)', '\\(0.1\\text{ M } \\text{KCl}\\)', '\\(0.1\\text{ M glucose}\\)'],
    correctIndex: 0,
    explanation:
      '\\(\\Delta T_b = i K_b m\\). Van’t Hoff factor \\(i = 5\\) for \\(\\text{Al}_2(\\text{SO}_4)_3\\), compared to 3 for \\(\\text{Na}_2\\text{SO}_4\\), 2 for \\(\\text{KCl}\\), and 1 for glucose.'
  },
  {
    id: 'abh-che-09',
    subject: 'chemistry',
    chapterId: 'che-electrochem',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'Given \\(E^\\circ_{\\text{Zn}^{2+}/\\text{Zn}} = -0.76\\text{ V}\\) and \\(E^\\circ_{\\text{Cu}^{2+}/\\text{Cu}} = +0.34\\text{ V}\\). The standard Gibbs free energy change \\(\\Delta G^\\circ\\) for the Daniell cell reaction \\(\\text{Zn} + \\text{Cu}^{2+} \\to \\text{Zn}^{2+} + \\text{Cu}\\) (\\(F = 96500\\text{ C mol}^{-1}\\)) is:',
    options: ['\\(-212.3\\text{ kJ mol}^{-1}\\)', '\\(-106.15\\text{ kJ mol}^{-1}\\)', '\\(+212.3\\text{ kJ mol}^{-1}\\)', '\\(-424.6\\text{ kJ mol}^{-1}\\)'],
    correctIndex: 0,
    explanation:
      '\\(E^\\circ_{\\text{cell}} = 0.34 - (-0.76) = 1.10\\text{ V}\\), \\(n = 2\\). \\(\\Delta G^\\circ = -nFE^\\circ = -2 \\times 96500 \\times 1.10 = -212,300\\text{ J} = -212.3\\text{ kJ mol}^{-1}\\).'
  },
  {
    id: 'abh-che-10',
    subject: 'chemistry',
    chapterId: 'che-kinetics',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'For a first-order reaction, the time required for \\(99.9\\%\\) completion is approximately how many times its half-life (\\(t_{1/2}\\))?',
    options: ['10 times', '2 times', '5 times', '3.3 times'],
    correctIndex: 0,
    explanation:
      '\\(t_{99.9\\%} = \\frac{2.303}{k}\\log_{10}(1000) = 3 \\times \\frac{2.303}{k}\\), while \\(t_{1/2} = \\frac{0.693}{k}\\). Ratio \\(\\approx \\frac{3 \\times 2.303}{0.693} \\approx 10\\).'
  },
  {
    id: 'abh-che-11',
    subject: 'chemistry',
    chapterId: 'che-pblock',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'The basicity of orthophosphorous acid (\\(\\text{H}_3\\text{PO}_3\\)) and hypophosphorous acid (\\(\\text{H}_3\\text{PO}_2\\)) are respectively:',
    options: ['2 and 1', '3 and 1', '2 and 2', '3 and 2'],
    correctIndex: 0,
    explanation:
      'Only –OH hydrogens are ionisable. \\(\\text{H}_3\\text{PO}_3\\) has two P–OH and one P–H bond (dibasic = 2); \\(\\text{H}_3\\text{PO}_2\\) has one P–OH and two P–H bonds (monobasic = 1).'
  },
  {
    id: 'abh-che-12',
    subject: 'chemistry',
    chapterId: 'che-dfblock',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'Which of the following lanthanoid ions is diamagnetic in aqueous solution? (Atomic numbers: La = 57, Ce = 58, Eu = 63, Yb = 70)',
    options: ['\\(\\text{La}^{3+}\\) and \\(\\text{Yb}^{2+}\\)', '\\(\\text{Ce}^{3+}\\) and \\(\\text{Eu}^{2+}\\)', '\\(\\text{Eu}^{3+}\\) and \\(\\text{Yb}^{3+}\\)', '\\(\\text{Gd}^{3+}\\) and \\(\\text{La}^{3+}\\)'],
    correctIndex: 0,
    explanation:
      '\\(\\text{La}^{3+}\\) has \\(4f^0\\) and \\(\\text{Yb}^{2+}\\) has \\(4f^{14}\\) (zero unpaired electrons), so both are diamagnetic.'
  },
  {
    id: 'abh-che-13',
    subject: 'chemistry',
    chapterId: 'che-coordination',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'The hybridisation and magnetic behaviour of \\([\\text{Ni}(\\text{CN})_4]^{2-}\\) and \\([\\text{NiCl}_4]^{2-}\\) are respectively:',
    options: [
      '\\(dsp^2\\) diamagnetic, and \\(sp^3\\) paramagnetic',
      '\\(sp^3\\) paramagnetic, and \\(dsp^2\\) diamagnetic',
      'Both \\(sp^3\\) paramagnetic',
      '\\(dsp^2\\) paramagnetic, and \\(sp^3\\) diamagnetic'
    ],
    correctIndex: 0,
    explanation:
      '\\(\\text{Ni}^{2+}\\) is \\(d^8\\). Strong field \\(\\text{CN}^-\\) pairs the electrons giving square planar \\(dsp^2\\) (diamagnetic). Weak field \\(\\text{Cl}^-\\) leaves 2 unpaired electrons giving tetrahedral \\(sp^3\\) (paramagnetic).'
  },
  {
    id: 'abh-che-14',
    subject: 'chemistry',
    chapterId: 'che-practical',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'In Lassaigne’s test, the Prussian blue colour obtained for detection of nitrogen is due to the formation of:',
    options: [
      '\\(\\text{Fe}_4[\\text{Fe}(\\text{CN})_6]_3\\)',
      '\\(\\text{Na}_4[\\text{Fe}(\\text{CN})_5\\text{NOS}]\\)',
      '\\([\\text{Fe}(\\text{SCN})]^{2+}\\)',
      '\\(\\text{Fe}_2[\\text{Fe}(\\text{CN})_6]\\)'
    ],
    correctIndex: 0,
    explanation:
      'Ferric ferrocyanide, \\(\\text{Fe}_4[\\text{Fe}(\\text{CN})_6]_3\\), gives the characteristic Prussian blue precipitate.'
  },
  {
    id: 'abh-che-15',
    subject: 'chemistry',
    chapterId: 'che-goc',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Chemistry',
    question:
      'Statement I: Tropolone is an aromatic compound that obeys Hückel’s \\((4n+2)\\pi\\) rule.\nStatement II: Cyclooctatetraene is anti-aromatic and planar.\nChoose the correct option:',
    options: [
      'Statement I is correct but Statement II is incorrect',
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    correctIndex: 0,
    explanation:
      'Tropolone has a resonance-stabilised 7-membered tropylium-like \\(6\\pi\\) electron ring (aromatic). Cyclooctatetraene adopts a non-planar tub shape to avoid anti-aromaticity (non-aromatic).'
  },

  // ================= BOTANY (20 NCERT line-by-line NTA Abhyas questions) =================
  {
    id: 'abh-bot-01',
    subject: 'botany',
    chapterId: 'bot-living-world',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'Which of the following is the correct descending order of taxonomic categories in the Linnaean hierarchy?',
    options: [
      'Kingdom → Phylum/Division → Class → Order → Family → Genus → Species',
      'Kingdom → Class → Phylum → Order → Family → Genus → Species',
      'Kingdom → Division → Order → Class → Family → Genus → Species',
      'Kingdom → Division → Class → Family → Order → Genus → Species'
    ],
    correctIndex: 0,
    explanation:
      'NCERT Class 11 Ch 1: Kingdom → Phylum/Division → Class → Order → Family → Genus → Species.'
  },
  {
    id: 'abh-bot-02',
    subject: 'botany',
    chapterId: 'bot-classification',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'Statement I: Viroids discovered by T.O. Diener in 1971 contain free low-molecular-weight RNA without a protein coat.\nStatement II: Prions are abnormally folded proteins that cause bovine spongiform encephalopathy (BSE) in cattle.\nChoose the correct answer:',
    options: [
      'Both Statement I and Statement II are correct',
      'Both Statement I and Statement II are incorrect',
      'Statement I is correct but Statement II is incorrect',
      'Statement I is incorrect but Statement II is correct'
    ],
    correctIndex: 0,
    explanation:
      'Both statements are exact NCERT Class 11 Ch 2 facts: Viroids = free RNA (cause Potato spindle tuber disease); Prions = infectious misfolded proteins (BSE / CJD).'
  },
  {
    id: 'abh-bot-03',
    subject: 'botany',
    chapterId: 'bot-plant-kingdom',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'In which group of plants is the dominant phase of the life cycle gametophytic, while the sporophyte is dependent on the gametophyte?',
    options: ['Bryophytes', 'Pteridophytes', 'Gymnosperms', 'Angiosperms'],
    correctIndex: 0,
    explanation:
      'In Bryophytes (mosses and liverworts), the main plant body is the haploid gametophyte; the sporophyte stays attached to and nourished by it.'
  },
  {
    id: 'abh-bot-04',
    subject: 'botany',
    chapterId: 'bot-morphology',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'Match List I with List II regarding aestivation:\nA. Valvate  — I. Cassia\nB. Twisted  — II. Calotropis\nC. Imbricate — III. Pea\nD. Vexillary — IV. China rose\nChoose the correct match:',
    options: [
      'A-II, B-IV, C-I, D-III',
      'A-II, B-I, C-IV, D-III',
      'A-IV, B-II, C-I, D-III',
      'A-III, B-IV, C-I, D-II'
    ],
    correctIndex: 0,
    explanation:
      'NCERT Ch 5: Valvate = Calotropis; Twisted = China rose, Lady’s finger, Cotton; Imbricate = Cassia, Gulmohur; Vexillary (papilionaceous) = Pea, Bean.'
  },
  {
    id: 'abh-bot-05',
    subject: 'botany',
    chapterId: 'bot-anatomy',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'Which of the following is TRUE about the vascular bundles of a monocot stem?',
    options: [
      'Conjoint, closed, scattered, with water-containing cavities in xylem',
      'Conjoint, open, arranged in a ring with pith',
      'Radial, exarch xylem with 2–4 xylem bundles',
      'Conjoint, open, scattered with bundle sheath of parenchyma'
    ],
    correctIndex: 0,
    explanation:
      'Monocot stems have scattered, conjoint, closed vascular bundles surrounded by a sclerenchymatous bundle sheath and possess lysigenous water cavities in protoxylem; phloem parenchyma is absent.'
  },
  {
    id: 'abh-bot-06',
    subject: 'botany',
    chapterId: 'bot-cell',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'Which cell organelle is part of the endomembrane system and is the primary site for synthesis of glycoproteins and glycolipids?',
    options: ['Golgi apparatus', 'Peroxisome', 'Smooth ER', 'Mitochondria'],
    correctIndex: 0,
    explanation:
      'NCERT Class 11 Ch 8: Golgi apparatus is the important site of formation of glycoproteins and glycolipids.'
  },
  {
    id: 'abh-bot-07',
    subject: 'botany',
    chapterId: 'bot-cell-cycle',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'If a diploid cell has \\(2n = 16\\) chromosomes and \\(2C\\) DNA content at G1 phase, what will be the chromosome number and DNA content after S phase?',
    options: ['16 chromosomes and 4C DNA', '32 chromosomes and 4C DNA', '16 chromosomes and 2C DNA', '32 chromosomes and 2C DNA'],
    correctIndex: 0,
    explanation:
      'During S phase, DNA content doubles from \\(2C\\) to \\(4C\\), but chromosome number (centromere count) remains unchanged at \\(2n = 16\\).'
  },
  {
    id: 'abh-bot-08',
    subject: 'botany',
    chapterId: 'bot-photosynthesis',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'During non-cyclic photophosphorylation, electrons lost by PS II (P680) are replaced directly by:',
    options: ['Photolysis (splitting) of water', 'Cyclic flow from ferredoxin', 'NADPH oxidation', 'PS I reaction centre P700'],
    correctIndex: 0,
    explanation:
      'The water-splitting complex associated with PS II oxidises \\(2\\text{H}_2\\text{O} \\to 4\\text{H}^+ + \\text{O}_2 + 4e^-\\), supplying electrons continuously to P680.'
  },
  {
    id: 'abh-bot-09',
    subject: 'botany',
    chapterId: 'bot-respiration',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'In the mitochondrial Electron Transport System (ETS), Complex IV refers to:',
    options: [
      'Cytochrome c oxidase (containing cytochromes a and a3, and two copper centres)',
      'NADH dehydrogenase',
      'Succinate dehydrogenase',
      'Cytochrome bc1 complex'
    ],
    correctIndex: 0,
    explanation:
      'Complex I = NADH dehydrogenase; Complex II = Succinate dehydrogenase; Complex III = Cytochrome bc1; Complex IV = Cytochrome c oxidase (cyt a, a3, 2 Cu centres).'
  },
  {
    id: 'abh-bot-10',
    subject: 'botany',
    chapterId: 'bot-growth',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'Which plant growth regulator promotes bolting (internode elongation just prior to flowering) in beet, cabbages and many plants with rosette habit?',
    options: ['Gibberellins', 'Auxins', 'Cytokinins', 'Abscisic acid'],
    correctIndex: 0,
    explanation:
      'NCERT Class 11 Ch 15: Gibberellins promote bolting in rosette plants such as beet and cabbage.'
  },
  {
    id: 'abh-bot-11',
    subject: 'botany',
    chapterId: 'bot-sexual-reproduction',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'In over \\(60\\%\\) of angiosperms, pollen grains are shed at the 2-celled stage. In the remaining species, the generative cell divides mitotically to give two male gametes before shedding (3-celled stage). Which statement is FALSE about angiosperm pollen?',
    options: [
      'Exine is made of cellulose and pectin and is easily degraded by strong acids',
      'Sporopollenin can withstand high temperatures, strong acids and alkali',
      'Germ pores are regions on exine where sporopollenin is absent',
      'Vegetative cell is larger with abundant food reserve and an irregularly shaped nucleus'
    ],
    correctIndex: 0,
    explanation:
      'Exine is made of sporopollenin (the most resistant organic material known); the intine is the inner thin continuous layer made of cellulose and pectin.'
  },
  {
    id: 'abh-bot-12',
    subject: 'botany',
    chapterId: 'bot-sexual-reproduction',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'A typical angiosperm embryo sac at maturity is:',
    options: ['8-nucleate and 7-celled', '7-nucleate and 8-celled', '8-nucleate and 8-celled', '7-nucleate and 7-celled'],
    correctIndex: 0,
    explanation:
      '3 antipodal cells (3 nuclei) + 1 central cell (2 polar nuclei) + 1 egg cell + 2 synergids (3 nuclei) = 7 cells and 8 nuclei.'
  },
  {
    id: 'abh-bot-13',
    subject: 'botany',
    chapterId: 'bot-inheritance',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'In a Mendelian dihybrid cross between round-yellow (RRYY) and wrinkled-green (rryy) pea plants, the proportion of F2 plants that are heterozygous for BOTH characters is:',
    options: ['4/16', '2/16', '1/16', '9/16'],
    correctIndex: 0,
    explanation:
      'The double heterozygote RrYy occurs in 4 out of 16 F2 combinations (ratio 1:2:1:2:4:2:1:2:1).'
  },
  {
    id: 'abh-bot-14',
    subject: 'botany',
    chapterId: 'bot-molecular',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'In the Lac Operon of E. coli, when lactose is present in the medium, allolactose acts as an inducer by:',
    options: [
      'Binding to the repressor protein produced by the i gene and inactivating it',
      'Binding directly to the operator sequence to activate RNA polymerase',
      'Phosphorylating beta-galactosidase to accelerate transcription',
      'Cleaving the promoter sequence of the lacZ gene'
    ],
    correctIndex: 0,
    explanation:
      'The inducer (allolactose/lactose) binds to the active repressor protein, changing its conformation so it can no longer bind the operator, allowing RNA polymerase to transcribe lacZ, lacY and lacA.'
  },
  {
    id: 'abh-bot-15',
    subject: 'botany',
    chapterId: 'bot-molecular',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'During DNA replication, the enzyme DNA-dependent DNA polymerase catalyses polymerisation ONLY in the direction:',
    options: ["5' → 3'", "3' → 5'", "Both 5' → 3' and 3' → 5'", "Either 3' → 5' on leading or 5' → 3' on lagging strand"],
    correctIndex: 0,
    explanation:
      'All DNA polymerases polymerise exclusively in the 5′ → 3′ direction, resulting in continuous synthesis on the 3′ → 5′ template and discontinuous Okazaki fragments on the 5′ → 3′ template.'
  },
  {
    id: 'abh-bot-16',
    subject: 'botany',
    chapterId: 'bot-microbes',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'Match the bioactive molecule with its microbial source:\nA. Cyclosporin A — I. Monascus purpureus\nB. Statins — II. Trichoderma polysporum\nC. Streptokinase — III. Aspergillus niger\nD. Citric acid — IV. Streptococcus\nSelect the correct match:',
    options: [
      'A-II, B-I, C-IV, D-III',
      'A-I, B-II, C-IV, D-III',
      'A-II, B-IV, C-I, D-III',
      'A-III, B-I, C-IV, D-II'
    ],
    correctIndex: 0,
    explanation:
      'Cyclosporin A (immunosuppressant) ← Trichoderma polysporum; Statins (blood-cholesterol lowering) ← Monascus purpureus; Streptokinase (clot buster) ← Streptococcus; Citric acid ← Aspergillus niger.'
  },
  {
    id: 'abh-bot-17',
    subject: 'botany',
    chapterId: 'bot-organisms',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'In the Verhulst-Pearl Logistic Growth equation \\(\\frac{dN}{dt} = rN\\left(\\frac{K - N}{K}\\right)\\), the population growth rate becomes zero when:',
    options: ['\\(N = K\\)', '\\(N = K/2\\)', '\\(r = 0\\) only', '\\(N = 0\\) and \\(K\\to\\infty\\)'],
    correctIndex: 0,
    explanation:
      'When population density \\(N\\) reaches carrying capacity \\(K\\), \\((K-N)/K = 0\\), so \\(dN/dt = 0\\) (asymptote of the sigmoid curve).'
  },
  {
    id: 'abh-bot-18',
    subject: 'botany',
    chapterId: 'bot-ecosystem',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'Which step of decomposition occurs simultaneously inside the soil as water-soluble inorganic nutrients percolate down and precipitate as unavailable salts?',
    options: ['Leaching', 'Fragmentation', 'Humification', 'Mineralisation'],
    correctIndex: 0,
    explanation:
      'NCERT Class 12 Ecology: Leaching is the process by which water-soluble inorganic nutrients go down into the soil horizon and get precipitated as unavailable salts.'
  },
  {
    id: 'abh-bot-19',
    subject: 'botany',
    chapterId: 'bot-biodiversity',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'On a logarithmic scale, the species-area relationship \\(\\log S = \\log C + Z \\log A\\) shows a steeper slope (\\(Z = 0.6\\text{ to }1.2\\)) when analysed for:',
    options: [
      'Very large areas like entire continents (e.g., frugivorous birds & mammals in tropical forests)',
      'Small regions within Britain or California birds',
      'Molluscs in New York State',
      'Freshwater phytoplankton ponds'
    ],
    correctIndex: 0,
    explanation:
      'Typically \\(Z\\) lies between 0.1 and 0.2 regardless of taxonomic group/region, EXCEPT for very large areas like entire continents where \\(Z\\) becomes steeper (0.6 to 1.2; 1.15 for frugivorous birds & mammals in tropical forests).'
  },
  {
    id: 'abh-bot-20',
    subject: 'botany',
    chapterId: 'bot-cell',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Botany',
    question:
      'Assertion (A): Mitochondria and chloroplasts are called semi-autonomous organelles.\nReason (R): Both possess their own circular double-stranded DNA, 70S ribosomes, and RNA to synthesise some of their proteins.\nChoose the correct option:',
    options: [
      'Both A and R are true and R is the correct explanation of A',
      'Both A and R are true but R is NOT the correct explanation of A',
      'A is true but R is false',
      'A is false but R is true'
    ],
    correctIndex: 0,
    explanation:
      'Both mitochondria and chloroplasts carry circular dsDNA and 70S ribosomes (endosymbiotic origin), allowing partial autonomy in protein synthesis.'
  },

  // ================= ZOOLOGY (20 NCERT line-by-line NTA Abhyas questions) =================
  {
    id: 'abh-zoo-01',
    subject: 'zoology',
    chapterId: 'zoo-animal-kingdom',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Which of the following statements is INCORRECT regarding Ctenophores (comb jellies)?',
    options: [
      'They reproduce both asexually and sexually with indirect development',
      'Body bears eight external rows of ciliated comb plates for locomotion',
      'Bioluminescence is well-marked in ctenophores',
      'Fertilisation is external and they are exclusively marine, radially symmetrical and diploblastic'
    ],
    correctIndex: 0,
    explanation:
      'NCERT Class 11 Ch 4: In Ctenophora, reproduction takes place ONLY by sexual means (not asexual).'
  },
  {
    id: 'abh-zoo-02',
    subject: 'zoology',
    chapterId: 'zoo-structural',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'In cockroach (Periplaneta americana), which structure helps in grinding food particles inside the alimentary canal?',
    options: ['Gizzard (Proventriculus) with six chitinous teeth', 'Crop', 'Hepatic caeca', 'Malpighian tubules'],
    correctIndex: 0,
    explanation:
      'The crop stores food, and it is followed by the gizzard (proventriculus) lined by six highly chitinous plates called teeth that grind the food.'
  },
  {
    id: 'abh-zoo-03',
    subject: 'zoology',
    chapterId: 'zoo-biomolecules',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Inhibition of succinic dehydrogenase by malonate (which closely resembles the substrate succinate in structure) is a classic example of:',
    options: ['Competitive inhibition', 'Non-competitive inhibition', 'Allosteric activation', 'Feedback repression'],
    correctIndex: 0,
    explanation:
      'Malonate is a structural analogue of succinate and competes for the active site of succinic dehydrogenase — increasing apparent \\(K_m\\) without changing \\(V_{\\max}\\).'
  },
  {
    id: 'abh-zoo-04',
    subject: 'zoology',
    chapterId: 'zoo-breathing',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Vital Capacity (VC) of the lungs is defined as:',
    options: ['ERV + TV + IRV', 'TV + IRV', 'ERV + RV', 'TLC − IRV'],
    correctIndex: 0,
    explanation:
      'Vital capacity is the maximum volume of air a person can breathe in after a forced expiration (or breathe out after a forced inspiration) = ERV + TV + IRV.'
  },
  {
    id: 'abh-zoo-05',
    subject: 'zoology',
    chapterId: 'zoo-circulation',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'In a standard ECG, the end of the T-wave marks:',
    options: [
      'The end of ventricular systole (return of ventricles from excited to normal state)',
      'Depolarisation of the atria',
      'Beginning of ventricular systole',
      'Atrial repolarisation only'
    ],
    correctIndex: 0,
    explanation:
      'NCERT Class 11 Ch 18: P-wave = atrial depolarisation; QRS = ventricular depolarisation; T-wave = ventricular repolarisation, and the end of T-wave marks the end of systole.'
  },
  {
    id: 'abh-zoo-06',
    subject: 'zoology',
    chapterId: 'zoo-excretion',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Which part of the nephron allows passage of small amounts of urea into the medullary interstitium to keep up osmolarity?',
    options: [
      'Collecting duct',
      'Proximal convoluted tubule (PCT)',
      'Descending limb of Loop of Henle',
      'Distal convoluted tubule (DCT)'
    ],
    correctIndex: 0,
    explanation:
      'NCERT Class 11 Ch 19: The collecting duct allows passage of small amounts of urea into the medullary interstitium to maintain the osmolarity gradient.'
  },
  {
    id: 'abh-zoo-07',
    subject: 'zoology',
    chapterId: 'zoo-locomotion',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'During muscle contraction, which of the following bands/zones decreases in length while the A-band remains unchanged?',
    options: ['Both I-band and H-zone shorten', 'Only A-band shortens', 'I-band widens and H-zone disappears', 'M-line and Z-line both disappear'],
    correctIndex: 0,
    explanation:
      'As thin actin filaments slide inward over thick myosin filaments, Z-lines move closer, shortening the I-band and shrinking/disappearing the H-zone, while the A-band length stays constant.'
  },
  {
    id: 'abh-zoo-08',
    subject: 'zoology',
    chapterId: 'zoo-neural',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'During the resting state of an axonal membrane, the sodium-potassium pump actively transports:',
    options: [
      '\\(3\\text{ Na}^+\\) outwards for \\(2\\text{ K}^+\\) into the cell',
      '\\(2\\text{ Na}^+\\) outwards for \\(3\\text{ K}^+\\) into the cell',
      '\\(3\\text{ K}^+\\) outwards for \\(2\\text{ Na}^+\\) into the cell',
      '\\(1\\text{ Na}^+\\) inwards for \\(1\\text{ K}^+\\) outwards'
    ],
    correctIndex: 0,
    explanation:
      'NCERT Ch 21: The \\(\\text{Na}^+-\\text{K}^+\\) ATPase pump exports \\(3\\text{ Na}^+\\) ions out of the neuron for every \\(2\\text{ K}^+\\) ions pumped into the axoplasm.'
  },
  {
    id: 'abh-zoo-09',
    subject: 'zoology',
    chapterId: 'zoo-chemical',
    classLevel: 11,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Which of the following pairs of hormones act through intracellular receptors (regulating gene expression) rather than second messengers like cAMP or \\(\\text{Ca}^{2+}\\)?',
    options: ['Cortisol and Thyroxine (iodothyronines)', 'Epinephrine and Glucagon', 'FSH and LH', 'Insulin and Oxytocin'],
    correctIndex: 0,
    explanation:
      'Steroid hormones (cortisol, estrogen, progesterone, testosterone) and iodothyronines (thyroxine) cross the plasma membrane and bind intracellular/nuclear receptors.'
  },
  {
    id: 'abh-zoo-10',
    subject: 'zoology',
    chapterId: 'zoo-human-reproduction',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'The hormone(s) produced ONLY during pregnancy in human females include:',
    options: ['hCG, hPL and Relaxin', 'Estrogen and Progesterone', 'Oxytocin and Prolactin', 'LH and FSH'],
    correctIndex: 0,
    explanation:
      'NCERT Class 12 Ch 3: hCG (human chorionic gonadotropin), hPL (human placental lactogen), and relaxin are produced in women only during pregnancy.'
  },
  {
    id: 'abh-zoo-11',
    subject: 'zoology',
    chapterId: 'zoo-human-reproduction',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'How many spermatozoa and ova are formed respectively from 100 primary spermatocytes and 100 primary oocytes?',
    options: ['400 spermatozoa and 100 ova', '100 spermatozoa and 100 ova', '200 spermatozoa and 100 ova', '400 spermatozoa and 400 ova'],
    correctIndex: 0,
    explanation:
      'Each primary spermatocyte produces 4 haploid spermatozoa (100 × 4 = 400), whereas each primary oocyte produces only 1 functional ovum (plus polar bodies; 100 × 1 = 100).'
  },
  {
    id: 'abh-zoo-12',
    subject: 'zoology',
    chapterId: 'zoo-reproductive-health',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Which assisted reproductive technology (ART) involves transferring an embryo with MORE than 8 blastomeres directly into the uterus?',
    options: ['IUT (Intra Uterine Transfer)', 'ZIFT (Zygote Intra Fallopian Transfer)', 'GIFT (Gamete Intra Fallopian Transfer)', 'AI (Artificial Insemination)'],
    correctIndex: 0,
    explanation:
      'Zygote or early embryos up to 8 blastomeres → Fallopian tube (ZIFT); embryos with > 8 blastomeres → uterus (IUT).'
  },
  {
    id: 'abh-zoo-13',
    subject: 'zoology',
    chapterId: 'zoo-evolution',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'In a population in Hardy-Weinberg equilibrium, the frequency of a recessive allele \\(q\\) is \\(0.4\\). What is the percentage of heterozygous carriers in the population?',
    options: ['48%', '16%', '36%', '24%'],
    correctIndex: 0,
    explanation:
      '\\(p = 1 - q = 0.6\\). Heterozygote frequency \\(= 2pq = 2(0.6)(0.4) = 0.48 = 48\\%\\).'
  },
  {
    id: 'abh-zoo-14',
    subject: 'zoology',
    chapterId: 'zoo-evolution',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Which hominid ancestor first used hides to protect their body, buried their dead, and had a cranial capacity of around \\(1400\\text{ cc}\\)?',
    options: ['Neanderthal man', 'Homo habilis', 'Homo erectus', 'Australopithecus'],
    correctIndex: 0,
    explanation:
      'NCERT Ch 7: Neanderthal man (1400 cc brain size, lived near east and central Asia 1,00,000–40,000 years back) used hides to protect their body and buried their dead.'
  },
  {
    id: 'abh-zoo-15',
    subject: 'zoology',
    chapterId: 'zoo-health',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Which of the following is a pair of viral diseases?',
    options: ['Common cold and AIDS', 'Typhoid and Tuberculosis', 'Malaria and Amoebiasis', 'Pneumonia and Ringworm'],
    correctIndex: 0,
    explanation:
      'Common cold (Rhinovirus) and AIDS (HIV retrovirus) are viral; Typhoid/TB/Pneumonia are bacterial; Malaria/Amoebiasis are protozoan; Ringworm is fungal.'
  },
  {
    id: 'abh-zoo-16',
    subject: 'zoology',
    chapterId: 'zoo-health',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Colostrum (mother’s initial milk) provides passive immunity to the newborn infant primarily because it is rich in which antibody?',
    options: ['IgA', 'IgG', 'IgE', 'IgM'],
    correctIndex: 0,
    explanation:
      'Colostrum contains abundant secretory IgA antibodies (natural passive immunity), while IgG crosses the placenta during pregnancy.'
  },
  {
    id: 'abh-zoo-17',
    subject: 'zoology',
    chapterId: 'zoo-biotech-principles',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'If a foreign DNA fragment is ligated at the BamHI site of the tetracycline resistance gene in plasmid pBR322, the recombinant transformants will:',
    options: [
      'Grow on ampicillin-containing medium, but NOT on tetracycline-containing medium',
      'Grow on tetracycline-containing medium, but NOT on ampicillin-containing medium',
      'Grow on both ampicillin and tetracycline media',
      'Fail to grow on either antibiotic medium'
    ],
    correctIndex: 0,
    explanation:
      'Insertional inactivation of \\(\\text{tet}^R\\) makes recombinants susceptible to tetracycline while retaining ampicillin resistance (\\(\\text{amp}^R\\)).'
  },
  {
    id: 'abh-zoo-18',
    subject: 'zoology',
    chapterId: 'zoo-biotech-principles',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'Which sequence of three steps correctly describes a single cycle of Polymerase Chain Reaction (PCR)?',
    options: [
      'Denaturation → Primer Annealing → Extension (by Taq polymerase)',
      'Annealing → Denaturation → Extension',
      'Extension → Denaturation → Annealing',
      'Denaturation → Ligation → Primer Annealing'
    ],
    correctIndex: 0,
    explanation:
      'Each PCR cycle consists of: (1) Denaturation (~94 °C), (2) Annealing of primers (~50–60 °C), and (3) Extension (~72 °C) using thermostable Taq DNA polymerase.'
  },
  {
    id: 'abh-zoo-19',
    subject: 'zoology',
    chapterId: 'zoo-biotech-applications',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'To protect tobacco plants against the nematode Meloidogyne incognita, RNA interference (RNAi) silences a specific mRNA using complementary:',
    options: ['dsRNA produced by sense and anti-sense RNA strands', 'Single-stranded DNA primer', 'CryIAb protoxin crystal', 'Restriction endonuclease EcoRI'],
    correctIndex: 0,
    explanation:
      'Using Agrobacterium vectors, nematode-specific genes are introduced so the host produces both sense and anti-sense RNA, forming dsRNA that triggers RNAi and silences the parasite’s mRNA.'
  },
  {
    id: 'abh-zoo-20',
    subject: 'zoology',
    chapterId: 'zoo-biotech-applications',
    classLevel: 12,
    source: 'ABHYAS',
    examTag: 'NTA Abhyas · Zoology',
    question:
      'In mature human insulin, the A-peptide and B-peptide chains are linked together by disulphide bridges, whereas which peptide is removed during maturation of pro-insulin?',
    options: ['C-peptide', 'D-peptide', 'Alpha-peptide', 'Signal leader peptide only'],
    correctIndex: 0,
    explanation:
      'Pro-insulin contains an extra stretch called the C-peptide, which is cleaved off during maturation and is absent in mature functional insulin (Eli Lilly engineered A and B chains separately).'
  }
];

const BALANCED_CORE_ABHYAS = CORE_ABHYAS_QUESTIONS.map((q, idx) => {
  const joined = q.options.join(' ').toLowerCase();
  if (/(both a and r|both statement|all of|none of|\(1\) and \(2\))/.test(joined)) return q;
  const targetIdx = idx % 4;
  if (targetIdx === q.correctIndex) return q;
  const opts = [...q.options];
  const [correctOpt] = opts.splice(q.correctIndex, 1);
  opts.splice(targetIdx, 0, correctOpt);
  return { ...q, options: opts, correctIndex: targetIdx };
});

export const ABHYAS_BANK = [...BALANCED_CORE_ABHYAS, ...CONVERTED_ORGANIC_ABHYAS];
