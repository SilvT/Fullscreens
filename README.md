# Portfolio 2025

A design systems approach to portfolio code. Built from scratch to demonstrate how I apply systematic thinking to front-end implementation.

I'm a Senior UI Designer who spent the last few years building a design system from the ground up—including a custom Figma-to-GitHub automation pipeline. This portfolio site shows what happens when you apply that same architectural mindset to writing code.

**Live site:** [silviatravieso.com](https://silviatravieso.com)

---

## Why I Built This From Scratch

Most designers use templates. I wanted to show recruiters that I:
- Understand modern web standards and can implement them properly
- Organise code with the same systematic approach I use for design systems
- Know enough about performance, accessibility, and build tooling to have productive conversations with engineers

This isn't a developer portfolio—it's proof that I can bridge design and implementation without needing hand-holding.

---

## Technical Highlights

### Architecture That Reflects Systems Thinking

The codebase is organised like a design system because that's how I think:

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

- **Design tokens**: Colour palette, typography scale (8 sizes), spacing scale (13 values)—all defined as SCSS variables
- **Component architecture**: Each UI element lives in its own partial with clear boundaries
- **Reusable mixins**: Patterns like `touch-target()` and `focus-visible()` ensure consistency
- **Modern SCSS**: Using `@use` (not `@import`) for proper namespacing and no global pollution

The `_mixins.scss` file includes a `metric-card()` mixin with 13 configurable parameters. That's the same level of systematic control I apply to Figma component variants.

### JavaScript: Modular and Maintainable

I refactored this codebase recently (see [REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)) to eliminate duplication and improve clarity:

- **Utils library**: Extracted common patterns into `utils/dom.js`, `utils/media.js`, `utils/constants.js`
- **Single Responsibility Principle**: Each module does one thing (`projectCards.js`, `navigation.js`, `scrollTransitions.js`)
- **Organised initialisation**: Features load in groups (core → content-dependent → UI) with proper async handling
- **Archive folder**: Old code lives in `archive/` rather than commented-out blocks

The main entry point ([src/main.js](src/main.js)) is 189 lines and reads like a table of contents. You can see exactly what the app does without digging through implementation details.

### GSAP for Scroll Animations

Used GSAP with ScrollTrigger for smooth, performant scroll-based animations:
- Scroll-linked section transitions with snap points
- Metric card reveals on viewport intersection
- Flip-board animation for dynamic text
- All animations respect `prefers-reduced-motion`

I'm not a motion designer, but I know enough about GSAP's API to implement what I prototype in Figma.

### Accessibility Built In (WCAG AA)

This portfolio is WCAG AA compliant because accessible design systems are the only kind worth building:

- **Keyboard navigation**: Full focus-visible states, skip-to-main link
- **Motion preferences**: CSS and JavaScript both respect `prefers-reduced-motion`
- **Semantic HTML**: Proper heading hierarchy, ARIA labels, structured data
- **Colour contrast**: All text meets 4.5:1 minimum (verified in `_accessibility.scss`)
- **Touch targets**: 44×44px minimum for mobile (iOS/Android guidelines)

Check [src/js/modules/accessibility.js](src/js/modules/accessibility.js) and [src/scss/_accessibility.scss](src/scss/_accessibility.scss) to see the implementation.

### Performance Considerations

- **Lazy loading**: Images load via IntersectionObserver (not all upfront)
- **Vite build system**: Modern bundler with tree-shaking and fast HMR
- **Throttled scroll/resize handlers**: Using RAF and debouncing to avoid jank
- **Vercel deployment**: CDN-distributed with analytics and speed insights

The entire site loads in under 2 seconds on 3G. I didn't optimise for Lighthouse scores specifically, but systematic choices compound.

### Build Process & Tooling

**Tech stack:**
- Vite (build + dev server)
- SCSS with modern module system
- GSAP for animations
- Vercel for deployment

**Custom build scripts:**
- `generate-ats-content.js`: Auto-generates recruiter-friendly HTML from JSON project data (runs in `prebuild` hook)
- `verify-ats.js`: Validates content structure for ATS scanners
- Multi-page config in `vite.config.js` for project detail pages

I built an ATS optimisation script because I understand that recruiters scan portfolios differently than users browse them. Systematic thinking applies to deployment, not just design.

### Responsive Approach

Breakpoints defined as mixins in `_breakpoints.scss`:
- Mobile-first methodology
- Touch device detection for enhanced tap targets
- High-contrast mode support
- Print styles (yes, some people still print CVs)

No CSS framework—just a well-organised responsive system built on CSS Grid and Flexbox.

---

## Design Systems Connection

This codebase demonstrates the same skills I use for design systems work:

| Design Systems Skill | How It Shows Up Here |
|----------------------|---------------------|
| **Token architecture** | SCSS variables for colours, typography, spacing |
| **Component thinking** | One file per UI element, clear variants |
| **Documentation** | JSDoc comments, clear naming, REFACTORING_SUMMARY.md |
| **Systematic decisions** | Mixins for repeated patterns, utils for shared logic |
| **Accessibility governance** | WCAG AA compliance built into components |
| **Version control** | Archive folder instead of commented code |

When I say "I think systematically," this is what I mean. The same architectural approach that works for Figma libraries works for codebases.

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

The dev server runs on `http://localhost:3000` (configured to open in Firefox because that's my preference).

---

## What This Portfolio Demonstrates

**Not demonstrated here:**
- I'm not a front-end developer
- I won't write production React or maintain a component library codebase
- I don't know advanced webpack config or TypeScript internals

**What is demonstrated:**
- I can implement designs I create without needing a developer to translate
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

*If you're a recruiter and you made it this far: hello! This README is part of the portfolio. I write documentation the same way I write code—systematically.*
