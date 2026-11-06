# From Sūtra to Computation

A cinematic, scroll-driven Indian Knowledge Systems project about Sanskrit, Pāṇinian grammar and computational linguistics. The site uses React, TypeScript, React Three Fiber, GSAP/ScrollTrigger, Lenis and Framer Motion.

## Run the website

```bash
npm install
npm run dev
npm run build
```

Open the local URL printed by Vite. The production output is written to `dist/`.

## Edit project content

Student metadata, glossary items, sūtra examples, derivation data, applications and references are stored in `src/content/siteContent.ts`.

The interactive derivations are intentionally limited demonstrations of Aṣṭādhyāyī 6.1.77. Their English explanations are pedagogical paraphrases, not substitutes for a traditional commentary.

## Active 3D models

Only the optimized models loaded by the production website are retained:

- `old_book_sanskrit.glb` — opening palm-leaf manuscript
- `stained_glass_sun_mandala.glb` — interactive sound mandala
- `lord_krishna_divine_warrior_form.glb` — artistic figure for the Pāṇini section
- `nandi_bull.glb` — Nandi sculpture
- `ganapati__ganesha.glb` — Ganesha with golden backlight
- `hindu_god_spear.glb` — rotating finale model

They are stored in `public/models/optimized/`.

## Accessibility and fallbacks

The document includes a skip link, semantic headings, keyboard-operated controls, visible focus styles, responsive touch targets, light and dark themes, a reactive reduced-motion preference and a static fallback if WebGL is unavailable. No educational claim depends solely on animation.

## Sources and licences

- Pāṇini rule text and numbering: Sanskrit Library grammatical data.
- Grammar scholarship: George Cardona, *Pāṇini: A Survey of Research*.
- Computational comparison: Akshar Bharati, Vineet Chaitanya and Rajeev Sangal, *Natural Language Processing: A Paninian Perspective*.
- Computational resources: Sanskrit Heritage Platform and SanskritShala.
- Noto Serif Devanagari, DM Sans and DM Serif Display: SIL Open Font License.
- Three.js, React Three Fiber/Drei, React, GSAP, Lenis, Motion and Lucide retain their respective licences.
