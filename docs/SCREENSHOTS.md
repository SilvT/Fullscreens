# Portfolio Screenshots

Visual documentation of key features and implementation details. Useful for recruiters who want to see specific aspects without navigating the live site.

---

## Screenshots to Add

### Homepage Features

**Hero Section with Flip-Board Animation**
- Shows the dynamic job title cycling effect
- Demonstrates the split-flap character animation
- Useful for: Showing the custom JavaScript implementation

**Project Card Scroll Transitions**
- Captures the fade-in/fade-out effect as sections enter/leave viewport
- Shows centered section positioning
- Useful for: Demonstrating GSAP ScrollTrigger implementation

**About Section**
- Shows typography hierarchy and layout
- Demonstrates design token application (spacing, colours, font scales)
- Useful for: Design systems thinking applied to layout

### Project Detail Pages

**Case Study Layout**
- Shows content block system (two-column, story-hook, metrics)
- Demonstrates JSON-driven content rendering
- Useful for: Data-driven architecture explanation

**Metric Cards**
- Shows custom metric card mixin implementation
- Demonstrates systematic component design
- Useful for: SCSS mixins and reusable patterns

**Breadcrumb Navigation**
- Shows project navigation between case studies
- Demonstrates dynamic breadcrumb generation from JSON
- Useful for: JavaScript module organisation

### Mobile Responsive Views

**Mobile Homepage**
- Shows responsive breakpoint implementation
- Demonstrates mobile-first approach
- Useful for: Responsive design methodology

**Mobile Project Detail**
- Shows touch-target sizing (44×44px minimum)
- Demonstrates mobile-optimised layouts
- Useful for: Accessibility compliance (iOS/Android guidelines)

### Accessibility Features

**Keyboard Navigation Focus States**
- Shows focus-visible styles on interactive elements
- Demonstrates skip-to-main link
- Useful for: WCAG AA compliance evidence

**Reduced Motion Mode**
- Side-by-side comparison of animations on/off
- Shows instant transitions when `prefers-reduced-motion` is active
- Useful for: Accessibility-first animation approach

### Performance Evidence

**Lighthouse Scores (Desktop)**
- Full Lighthouse report showing 95+ performance, 100s across accessibility/best practices/SEO
- Useful for: Performance metrics validation

**Lighthouse Scores (Mobile)**
- Mobile Lighthouse report showing 90+ performance
- Useful for: Mobile performance evidence

**Network Waterfall**
- Chrome DevTools network tab showing load order
- Shows lazy loading in action (images loading on scroll)
- Useful for: Performance optimisation strategy

**Vercel Speed Insights Dashboard**
- Real User Monitoring data showing Core Web Vitals
- Shows actual performance across real users globally
- Useful for: Real-world performance vs lab metrics

---

## How to Capture Screenshots

### For Feature Demonstrations

1. **Desktop**: Full-width browser window at 1440px width (standard laptop resolution)
2. **Mobile**: Use Chrome DevTools device emulation (iPhone 12 Pro or Pixel 5)
3. **High-DPI**: Capture at 2× resolution for crisp GitHub display
4. **Format**: PNG for UI screenshots, JPEG for full-page captures

### For Performance Metrics

1. **Lighthouse**: Chrome DevTools → Lighthouse tab → Run audit → Screenshot the report
2. **Network tab**: DevTools → Network → Hard reload → Screenshot the waterfall after page load
3. **Vercel Insights**: Dashboard → Speed Insights → Screenshot the Core Web Vitals graph

### For Accessibility Testing

1. **Keyboard focus**: Tab through the page, screenshot an element with focus-visible ring
2. **Screen reader**: Use VoiceOver (Mac) or NVDA (Windows), screenshot with accessibility tree visible
3. **Reduced motion**: System Preferences → Accessibility → Display → Enable "Reduce motion", reload page, capture

---

## Naming Convention

Use descriptive filenames with consistent naming:

```
homepage-hero-flipboard.png
project-cards-scroll-fade.png
mobile-responsive-layout.png
keyboard-focus-navigation.png
lighthouse-desktop-scores.png
network-waterfall-lazy-loading.png
```

Save all screenshots to `/docs/screenshots/` directory.

---

## Why Screenshots Matter

Recruiters often skim repos before diving deep. Screenshots provide:
- **Quick visual proof** that features actually work
- **Evidence of testing** (Lighthouse scores, accessibility tools)
- **Design quality demonstration** (layouts, typography, spacing)
- **Technical credibility** (performance metrics, network optimisation)

Well-captured screenshots are documentation — they show you test what you build and care about the details.

---

## Alternative: Video Demos

For animations (flip-board, scroll transitions), short video clips might work better than static screenshots:

1. **Record with QuickTime** (Mac) or OBS (cross-platform)
2. **Keep clips under 10 seconds** (focused on one interaction)
3. **Export as MP4 or GIF** (GIFs are larger but auto-play on GitHub)
4. **Host videos on Vimeo/YouTube** if file size is too large for the repo

Consider adding a `DEMOS.md` with embedded videos for key interactions.

---

**Status**: Screenshots pending — placeholder documentation created.
