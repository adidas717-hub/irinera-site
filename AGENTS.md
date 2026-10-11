# Frontend development instructions

## Project context

IRINERA is a static Russian-language travel service site. The current stack is plain HTML, CSS, and browser JavaScript served from the repository root. Preserve this stack, existing URL anchors, form field names, content behavior, and visual identity unless the task explicitly asks for a change.

Before changing UI, inspect `index.html`, `styles.css`, `script.js`, `content/ideas.csv`, and the referenced assets. For redesign work, audit the current interface first and state what is being preserved.

## Design direction

Use the existing warm editorial travel direction as the source of truth: milk/paper surfaces, dark ink, one terracotta accent, Manrope/Inter typography, generous spacing, restrained rounded geometry, and real travel imagery. Keep one page-level theme, one accent, and one consistent radius system.

Follow these anti-pattern checks from Impeccable and Taste Skill:

- Do not introduce generic SaaS layouts, purple mesh gradients, arbitrary glassmorphism, nested cards, or three identical feature cards by default.
- Do not use pure black or pure gray when a tinted neutral fits the established palette.
- Keep hero copy concise: a headline of at most two desktop lines, supporting copy no longer than needed, and a visible primary action.
- Do not add decorative status dots, scroll prompts, fake dashboard UI, ornamental labels over imagery, version/build labels, or numbered eyebrows unless the content has a real semantic purpose.
- Keep navigation labels, URL anchors, form fields, and user-facing functionality stable during visual work.
- Prefer real assets and source-backed content over placeholders. Complete all visible states, including loading, empty, error, focus, hover, mobile, and form-result states.
- Use semantic HTML, keyboard-accessible controls, visible focus states, useful alt text, sufficient contrast, and reduced-motion support.

## Motion

Use motion only when it clarifies hierarchy, feedback, or spatial relationships. Prefer CSS transitions and the existing IntersectionObserver reveal pattern for this static site. Never add a global scroll listener or requestAnimationFrame loop that writes React state.

If the project is later migrated to React, Motion for React is the preferred animation library: install the `motion` package and import from `motion/react`. Use declarative `motion` components, `useInView`, `useScroll`, and `AnimatePresence` where appropriate. Respect `prefers-reduced-motion`; Motion implementations should use `MotionConfig reducedMotion="user"` or `useReducedMotion`, and large transforms/parallax should become opacity or be disabled for reduced-motion users.

Avoid bounce/elastic easing and animation that delays access to content. Keep animations performant and test on mobile.

## Workflow

For frontend changes:

1. Read the current implementation and identify the smallest coherent change.
2. Make the design read explicit before substantial UI work: audience, mood, layout family, motion intensity, and density.
3. Reuse existing tokens and components/classes before introducing new ones.
4. Validate responsive behavior at mobile and desktop widths, keyboard navigation, focus, contrast, reduced motion, and all interactive states.
5. Avoid changing functionality, copy, routes, or data contracts unless the task requires it.
6. Summarize the visual and behavioral changes and the checks performed.

## Source references

- Impeccable: https://github.com/pbakaus/impeccable
- Taste Skill documentation: https://www.tasteskill.dev/docs
- Motion for React documentation: https://motion.dev/docs/react
- Motion installation: https://motion.dev/docs/react-installation
- Motion accessibility: https://motion.dev/docs/react-accessibility
