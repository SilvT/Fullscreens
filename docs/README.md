# Documentation

Technical documentation for the portfolio codebase. Since the live site IS the repo that recruiters are viewing, this folder explains implementation decisions and provides evidence that the site actually works.

---

## What's Here

### [ANIMATION_DECISIONS.md](./ANIMATION_DECISIONS.md)
Why I chose GSAP over CSS animations, what interactions I built, and the technical approach for each animation type. Includes accessibility considerations and performance impact.

**Read this if you want to know**:
- Why scroll-driven animations instead of parallax
- How the flip-board text animation works
- Why some animations are disabled for reduced-motion users
- What I explicitly avoided (and why)

### [PERFORMANCE.md](./PERFORMANCE.md)
Real performance metrics, Lighthouse scores, and what makes the site fast. Covers bundle sizes, loading strategies, and real-world performance data from Vercel Speed Insights.

**Read this if you want to know**:
- Actual Lighthouse scores (desktop and mobile)
- Why the site loads in under 2 seconds on 3G
- What optimisations I applied (and which ones I skipped)
- How lazy loading and code splitting work

### [SCREENSHOTS.md](./SCREENSHOTS.md)

Visual documentation of key portfolio features with capture guidelines. Screenshots provide quick visual proof that features work and demonstrate attention to detail.

**Planned screenshots**:
- Homepage hero with flip-board animation
- Project card scroll transitions
- Project detail page layout
- Mobile responsive views
- Accessibility features (keyboard navigation, focus states)
- Performance metrics from Chrome DevTools

See [SCREENSHOTS.md](./SCREENSHOTS.md) for capture instructions and naming conventions. Screenshots will be saved to [`/docs/screenshots/`](./screenshots/)

---

## Why This Documentation Exists

Most portfolio READMEs just list tech stack and maybe some installation instructions. That's fine for private repos, but this site is public-facing — recruiters click through from the footer link.

This documentation proves:
- I can explain technical decisions clearly
- I understand performance and accessibility trade-offs
- I test and measure what I build
- I think systematically about implementation (not just slapping code together)

---

## Documentation Philosophy

Good docs answer "why" not just "what". Anyone can see the site loads fast. The performance doc explains how I made it fast and what choices I deliberately avoided.

Same with animations — you can see the scroll effects work, but the animation decisions doc explains why GSAP over CSS, why those specific timing curves, why reduced-motion support matters.

Documentation is design work. It shows how you think.
