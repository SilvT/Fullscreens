# Portfolio 2025
Hello!!!! 
I'm a Senior UI Designer who spent the last few years building a design system from the ground up (including a custom Figma-to-GitHub automation pipeline). This is my portfolio, built from scratch, to show how I apply that same systematic approach to building front-end code.

**Live site:** [silviatravieso.com](https://silviatravieso.com)

**Documentation**: See the [`/docs`](./docs) folder for detailed technical documentation:
- [Animation Decisions](./docs/ANIMATION_DECISIONS.md) — Why GSAP, what interactions I built, accessibility considerations
- [Performance Metrics](./docs/PERFORMANCE.md) — Lighthouse scores, load times, optimisation decisions

---

## Why I Built This From Scratch

Most designers grab a template and call it done. I wanted to show something different — that I can implement what I design without needing a developer to translate, and that I organise code the same way I organise design systems.

Here's what this actually proves:
- I understand modern web standards well enough to implement them properly
- I think systematically about architecture (whether it's Figma components or SCSS partials)
- I know enough about performance, accessibility, and build tooling to have productive conversations with engineers

This <strong>isn't me pretending to be a front-end developer.</strong> It's proof that I can bridge design and implementation without hand-holding.<br>
<small>I've used Claude Code to help speedrun some of the stages and help smooth out my code and knowledge gaps.</small>

---

## Technical Highlights

### Architecture That Reflects Systems Thinking

The codebase is organised like a design system because that's genuinely how I think:

```
src/
├── scss/
│   ├── __variables.scss      # Design tokens (colours, typography scale, spacing)
│   ├── _mixins.scss           # Reusable patterns (like component variants)
│   ├── _breakpoints.scss      # Responsive system
│   ├── _z-index.scss          # Layering system (z-index tokens)
│   ├── _accessibility.scss    # WCAG AA compliance styles
│   └── _[component].scss      # One file per component (navigation, cards, etc.)
├── js/
│   ├── modules/               # Feature modules (navigation, animations, etc.)
│   └── utils/                 # Shared utilities (DOM helpers, constants)
└── main.js                    # Organised init: Core → Content → UI
```

Every SCSS partial maps to a specific concern. Every JavaScript module has a single responsibility. If you've seen my design system work, this structure will feel familiar.

### SCSS Built Like a Design System

Okay, here's the thing — I don't like to just write CSS. I built it a token-based system:

**Design tokens**: Colour palette, typography scale (8 sizes), spacing scale (13 values) — all defined as SCSS variables. Same principle as design tokens in Figma, just implemented in code.

**Component architecture**: Each UI element lives in its own partial with clear boundaries. Navigation gets `_navigation.scss`. Project cards get `_project-card.scss`, etc. No massive monolithic files.

**Reusable mixins**: Patterns like `touch-target()` and `focus-visible()` ensure consistency across components. The `metric-card()` mixin has 13 configurable parameters — that's the same level of systematic control I apply to Figma component variants.

**Modern SCSS**: Using `@use` (not the deprecated `@import`) for proper namespacing. No global pollution, no naming conflicts.

### JavaScript: Modular and Maintainable

I refactored this codebase recently (see [REFACTORING_SUMMARY.md](/dev-docs/REFACTORING_SUMMARY.md)) to eliminate duplication and improve clarity. What changed:

**Utils library**: Extracted common patterns into `utils/dom.js`, `utils/media.js`, `utils/constants.js`. If multiple modules need the same function, now it lives in until.

**Single Responsibility Principle**: Each module does one thing. `projectCards.js` handles cards. `navigation.js` handles navigation. `scrollTransitions.js` handles scroll animations. No 500-line files trying to do everything.

**Organised initialisation**: Features load in groups (core → content-dependent → UI) with proper async handling. The main entry point ([src/main.js](src/main.js)) is 189 lines and reads like a table of contents. You can see exactly what the app does without digging through implementation details.

**Archive folder**: Old code lives in `archive/` rather than commented-out blocks cluttering the codebase. If it's not in use, it's not in the way.

### JSON-Driven Content Architecture

This is, for me, one of the more interesting bits — the entire portfolio is content-agnostic! Project cards and case study pages are dynamically generated from structured JSON data. In my brain it's the code equivalent to components in Figma.

**How it works:**

Each project lives in `public/data/[project-id].json` with all content, metrics, images, and copy. That's the single source of truth.

[src/js/modules/projectCards.js](src/js/modules/projectCards.js) reads `projects.json` and dynamically renders cards in the specified order. [src/js/project-page.js](src/js/project-page.js) hydrates project detail pages from the same JSON. The content block system lets me define flexible layouts (two-column, story-hook, metrics, image galleries) in JSON that render into HTML.

**Why this matters:**

Zero duplication. Update one JSON file, and changes appear on the card, the detail page, and the ATS-optimised content automatically. Adding a new project means dropping in a new JSON file and updating the `PROJECT_ORDER` constant. That's it.

The data structure is consistent across all projects (enforced by the rendering logic), and the build-time ATS script parses the same JSON to generate SEO-friendly HTML for recruiters.

This is the same "component + data" separation pattern used in design systems. The rendering logic is reusable; the content is swappable.

Example JSON structure:
```json
{
  "title": "Design System from Scratch",
  "subtitle": "18 months. Zero precedent. One solo designer.",
  "detailMetrics": [
    { "icon": "iconoir:refresh-double", "value": "90%", "label": "QA cycles reduced" }
  ],
  "contentBlocks": [
    { "type": "story-hook", "quote": "...", "context": "..." },
    { "type": "two-column-with-sidebar", "left": [...], "sidebar": {...} }
  ]
}
```

The content block renderer ([archive/caseStudy.js](src/js/archive/caseStudy.js)) maps block types to HTML templates — same principle as Figma component variants mapping to props.

### GSAP for Scroll Animations

Used GSAP with ScrollTrigger for smooth, performant scroll-based animations. Scroll-linked section transitions with snap points, metric card reveals on viewport intersection, flip-board animation for dynamic text. All animations respect `prefers-reduced-motion` (because accessible animations are the only kind worth building).

I'm not a motion designer, but I understand GSAP's enough to implement what I prototyped in Figma.

### Accessibility Built In (WCAG AA)

This portfolio is WCAG AA compliant, of course. Why wouldn't it be?. 
Treating accessiblity as a choice should be long gone.

**Keyboard navigation**: Full focus-visible states, skip-to-main link for screen reader users.

**Motion preferences**: Both CSS and JavaScript respect `prefers-reduced-motion`. If someone's disabled animations in their OS, they won't see any scroll-jacking or unnecessary motion here.

**Semantic HTML**: Proper heading hierarchy, ARIA labels where needed, structured data for search engines.

**Colour contrast**: All text meets 4.5:1 minimum (verified in the `_accessibility.scss` comments).

**Touch targets**: 44×44px minimum for mobile, following iOS/Android guidelines.

Check [src/js/modules/accessibility.js](src/js/modules/accessibility.js) and [src/scss/_accessibility.scss](src/scss/_accessibility.scss) to see the implementation. It's not bolted on at the end — it's built into the components.

### Performance Considerations

**Lazy loading**: Images load via IntersectionObserver (not all upfront). Only load what's actually visible.

**Vite build system**: Modern bundler that only updates changed modules (not rebuilding everything), allows for SVG optimisation, and stays lightweight.

**Throttled scroll/resize handlers**: Using RequestAnimationFrame to keep interactions smooth. No janky scroll events hammering the browser.

**Vercel deployment**: CDN-distributed with analytics and speed insights baked in.

The entire site loads in under 2 seconds on 3G. I didn't optimise specifically for Lighthouse scores, but systematic choices compound over time.

### Build Process & Tooling

**Tech stack:**
- Vite (build + dev server)
- SCSS with modern module system
- gLightbox for image isolation
- GSAP for animations
- Vercel for deployment

**Custom build scripts:**

`generate-ats-content.js` auto-generates recruiter-friendly HTML from the JSON project data (runs in the `prebuild` hook). `verify-ats.js` validates content structure for ATS scanners. Multi-page config in `vite.config.js` handles separate entries for project detail pages.

I built the ATS optimisation script because I understand that recruiters scan portfolios differently than users browse them. Systematic thinking applies to deployment, not just design.

### Responsive Approach

Breakpoints defined as mixins in `_breakpoints.scss`. Mobile-first methodology, touch device detection for enhanced tap targets, high-contrast mode support, print styles (yes, some people still print CVs).

No CSS framework — just a well-organised responsive system built on CSS Grid and Flexbox.

---

## Design Systems Connection

Right, so when I say "I apply design systems thinking to code," here's what that actually means:

| Design Systems Skill | How It Shows Up Here |
|----------------------|---------------------|
| **Token architecture** | SCSS variables for colours, typography, spacing |
| **Component thinking** | One file per UI element, clear variants |
| **Data-driven design** | JSON content architecture (component + data separation) |
| **Documentation** | JSDoc comments, clear naming, REFACTORING_SUMMARY.md |
| **Systematic decisions** | Mixins for repeated patterns, utils for shared logic |
| **Accessibility governance** | WCAG AA compliance built into components |
| **Version control** | Archive folder instead of commented code |

The same architectural approach that works for Figma libraries works for codebases. That's the point.

---

## Running Locally

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
npm run preview
```

Dev server runs on `http://localhost:3000`.

---

## What This Portfolio Aims to show

**I'm not:**
- I'm not a front-end developer
- I don't write production React or maintain a component library codebase
- I don't know advanced webpack config or TypeScript internals

**What I am :**
- I can implement designs I create without needing a developer to translate (within reason)
- I understand web standards well enough to make informed design decisions
- I organise code with the same systematic approach I use for design systems
- I can collaborate with engineers because I understand their constraints
- I know enough about accessibility, performance, and build tooling to design responsibly

---

## Tech Stack Summary

- **Build**: Vite 6.4
- **Styling**: SCSS with modern module system
- **Animation**: GSAP 3.13 with ScrollTrigger
- **Icons**: Phosphor Icons + Iconoir
- **Lightbox**: GLightbox
- **Deployment**: Vercel (with analytics)
- **Accessibility**: WCAG AA compliant

---

## File Structure

```
.
├── public/                    # Static assets (images, PDFs, JSON data)
├── scripts/                   # Build scripts (ATS generation, etc.)
├── src/
│   ├── scss/                  # Organised SCSS (tokens, mixins, components)
│   ├── js/
│   │   ├── modules/           # Feature modules
│   │   └── utils/             # Shared utilities
│   └── main.js                # Application entry point
├── index.html                 # Main page
├── [project].html             # Project detail pages
├── vite.config.js             # Build configuration
└── package.json               # Dependencies
```

---

Built by [Silvia Travieso](https://silviatravieso.com) · Senior UI Designer · Design Systems Specialist

*If you're a recruiter reading this — hello! This README is part of the portfolio. I write documentation the same way I write code: systematically, and with the assumption that someone else will need to understand it later.*
