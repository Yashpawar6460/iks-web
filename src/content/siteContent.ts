export const projectInfo = {
  studentName: 'Yash Pawar',
  rollNumber: '47',
  department: 'SOC 13',
  college: 'MIT ADT',
  guide: 'Your Guide / Faculty Name',
  academicYear: '2026–27',
}

export const glossary = [
  { term: 'Varṇa', devanagari: 'वर्ण', meaning: 'A speech sound or written letter; the precise sense depends on context.' },
  { term: 'Dhātu', devanagari: 'धातु', meaning: 'A verbal root used as a base for grammatical derivation.' },
  { term: 'Pratyaya', devanagari: 'प्रत्यय', meaning: 'An affix introduced under stated grammatical conditions.' },
  { term: 'Sandhi', devanagari: 'सन्धि', meaning: 'A conditioned change where sounds meet at a boundary.' },
  { term: 'Sūtra', devanagari: 'सूत्र', meaning: 'A concise rule formulated for economy and systematic use.' },
  { term: 'Pratyāhāra', devanagari: 'प्रत्याहार', meaning: 'A compact notation that denotes a defined group of sounds.' },
]

export const soundGroups = [
  { name: 'Vowels', sanskrit: 'स्वराः', glyphs: 'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ', detail: 'Voiced sounds articulated with an open vocal tract.' },
  { name: 'Gutturals', sanskrit: 'कण्ठ्याः', glyphs: 'क ख ग घ ङ', detail: 'Consonants traditionally associated with the throat or velar region.' },
  { name: 'Palatals', sanskrit: 'तालव्याः', glyphs: 'च छ ज झ ञ', detail: 'Consonants articulated in relation to the hard-palate region.' },
  { name: 'Retroflex', sanskrit: 'मूर्धन्याः', glyphs: 'ट ठ ड ढ ण', detail: 'Consonants formed with the tongue curled toward the roof of the mouth.' },
  { name: 'Dentals', sanskrit: 'दन्त्याः', glyphs: 'त थ द ध न', detail: 'Consonants articulated with the tongue at or near the upper teeth.' },
  { name: 'Labials', sanskrit: 'ओष्ठ्याः', glyphs: 'प फ ब भ म', detail: 'Consonants articulated using the lips.' },
  { name: 'Semivowels', sanskrit: 'अन्तःस्थाः', glyphs: 'य र ल व', detail: 'Approximant sounds that pattern between vowels and consonants.' },
  { name: 'Sibilants', sanskrit: 'ऊष्माणः', glyphs: 'श ष स ह', detail: 'Fricative and breath sounds grouped in the traditional sequence.' },
]

export const sutras = [
  { number: '1.1.1', text: 'वृद्धिरादैच्', transliteration: 'vṛddhir ādaic', explanation: 'The sounds ā, ai and au receive the technical designation vṛddhi.' },
  { number: '1.3.3', text: 'हलन्त्यम्', transliteration: 'hal antyam', explanation: 'A final consonant in a grammatical instruction is designated it, subject to the system’s conditions.' },
  { number: '1.4.14', text: 'सुप्तिङन्तं पदम्', transliteration: 'suptiṅantaṃ padam', explanation: 'A form ending in a nominal sup or verbal tiṅ ending is designated pada.' },
  { number: '6.1.77', text: 'इको यणचि', transliteration: 'iko yaṇ aci', explanation: 'An ik vowel is replaced by its corresponding yaṇ sound when a vowel follows.' },
]

export const derivations = [
  {
    label: 'dadhi + atra', result: 'dadhyatra', devanagari: 'दधि + अत्र → दध्यत्र',
    steps: [
      ['Input', 'dadhi + atra — two forms meet at a vowel boundary.'],
      ['Context', 'Final i belongs to ik; the following a belongs to ac.'],
      ['Rule', 'Aṣṭādhyāyī 6.1.77, iko yaṇ aci, is applicable.'],
      ['Transform', 'The vowel i is replaced by its corresponding semivowel y.'],
      ['Output', 'dadhi + atra is represented here as dadhyatra (दध्यत्र).'],
    ],
  },
  {
    label: 'madhu + atra', result: 'madhvatra', devanagari: 'मधु + अत्र → मध्वत्र',
    steps: [
      ['Input', 'madhu + atra — the final and initial sounds are examined.'],
      ['Context', 'Final u belongs to ik; the following a belongs to ac.'],
      ['Rule', 'The same substitution rule, Aṣṭādhyāyī 6.1.77, applies.'],
      ['Transform', 'The vowel u is replaced by its corresponding semivowel v.'],
      ['Output', 'madhu + atra is represented here as madhvatra (मध्वत्र).'],
    ],
  },
]

export const applications = [
  ['Digital dictionaries', 'Search connected lexical forms and meanings across structured collections.'],
  ['Manuscript digitization', 'Support transcription, cataloguing and access to fragile textual collections.'],
  ['Information retrieval', 'Find passages even when words appear in inflected or combined forms.'],
  ['Morphological analysers', 'Propose roots, stems, features and possible analyses for a form.'],
  ['Translation assistance', 'Offer evidence and alternatives to human translators—not guaranteed answers.'],
  ['Pronunciation tools', 'Connect text with carefully recorded or synthesized speech resources.'],
  ['Language education', 'Make grammatical stages visible, testable and explorable.'],
  ['Knowledge representation', 'Express textual relationships in machine-readable structures.'],
  ['Classical-text preservation', 'Improve discovery, comparison and long-term access.'],
]

export const references = [
  { label: 'Pāṇini, Aṣṭādhyāyī — Sanskrit Library rule data', url: 'https://sanskritlibrary.org/grammatical/' },
  { label: 'George Cardona, Pāṇini: A Survey of Research (Motilal Banarsidass)', url: 'https://www.motilalbanarsidass.com/products/panini-a-survey-of-research' },
  { label: 'Akshar Bharati, Vineet Chaitanya & Rajeev Sangal, Natural Language Processing: A Paninian Perspective', url: 'https://www.phindia.com/Books/BookDetail/9788120309210/NATURAL-LANGUAGE-PROCESSING-A-PANINIAN-PERSPECTIVE-BHARATI-CHAITANYA-SANGAL' },
  { label: 'Gérard Huet, The Sanskrit Heritage Platform', url: 'https://sanskrit.uohyd.ac.in/SKT/index.en.html' },
  { label: 'SanskritShala: A Neural Sanskrit NLP Toolkit (ACL Anthology)', url: 'https://aclanthology.org/2023.acl-demo.9/' },
  { label: 'Noto Serif Devanagari — SIL Open Font License', url: 'https://fonts.google.com/noto/specimen/Noto+Serif+Devanagari' },
  { label: 'Three.js, React Three Fiber, GSAP, Lenis and Framer Motion', url: 'https://threejs.org/' },
]
