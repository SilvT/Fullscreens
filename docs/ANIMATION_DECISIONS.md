# Animation Decisions

Right, so animations in a portfolio are tricky — too much and you look like you're showing off, too little and the site feels flat. Here's what I built and why.

---

## Why GSAP (Not CSS Animations)

**The short answer**: Cross-browser consistency and scroll-driven animations.

CSS animations are brilliant for simple stuff (hovers, transitions), but scroll-linked animations are still janky in pure CSS. The `view-timeline` spec exists, but browser support is patchy and the API is still shifting.

GSAP with ScrollTrigger gives me:
- **Reliable scrubbing**: Animations tied exactly to scroll position (no lag, no jumping)
- **Fine control over timing**: I can define precisely when things fade in/out during scroll
- **Reduced motion support**: Easy to disable all GSAP animations when `prefers-reduced-motion` is detected
- **Performance**: GSAP optimises for 60fps and uses hardware acceleration automatically

**What I'm not doing**: Using GSAP for things CSS can handle perfectly well (like hover states or simple fades). That would be overkill.

---

## Animations Implemented

### 1. Scroll-Driven Section Transitions

**File**: [src/js/modules/scrollTransitions.js](../src/js/modules/scrollTransitions.js)

**What it does**: As you scroll through the portfolio, project sections fade in when they enter the viewport and fade out when they leave. The active section is always centred and fully visible.

**Technical approach**:
- ScrollTrigger watches each `section[data-section]` element
- Timeline controls opacity, visibility, z-index, and pointer-events
- Animation preset: `fade` (simple opacity transition — no blur or excessive effects)
- Timing split: 30% fade in, 40% fully visible, 30% fade out

**Why this timing**:
- Fast fade-in (30%) means sections appear quickly — no waiting around
- Long visible window (40%) gives you time to read and interact without the content disappearing mid-click
- Smooth fade-out (30%) prevents jarring transitions

**Critical fix**: Pointer-events management. Initially, hidden sections were still clickable (layered on top of visible ones). Now pointer-events are explicitly disabled when sections aren't visible and z-index is dynamically controlled based on scroll position.

**Accessibility**:
- Completely disabled when `prefers-reduced-motion: reduce` is detected
- First section is immediately visible on load (no waiting for scroll to trigger)
- All sections remain keyboard-navigable (the fade doesn't break tab order)

### 2. Flip-Board Text Animation

**File**: [src/js/modules/flipBoardAnimation.js](../src/js/modules/flipBoardAnimation.js)

**What it does**: The dynamic job title cycles through terms like "UI Designer", "Design Systems", "Product Thinking" with a split-flap departure board effect — each character flips through random letters before settling on the target.

**Why this animation**:
- It's distinctive (most portfolios use typed.js or simple fades)
- It demonstrates technical fluency without being gratuitous
- The mechanical aesthetic fits the "systematic thinking" positioning

**Technical approach**:
- Characters split into individual `<span>` elements
- Each character cycles through 8 random chars from `CHARSET` before landing on the target
- Staggered start: each character begins cycling 120ms after the previous one (creates the wave effect)
- Pure JavaScript async/await loop (no external libraries)

**Performance consideration**: Uses CSS transforms for the flip animation (hardware-accelerated) rather than manipulating layout properties.

**Accessibility**:
- When `prefers-reduced-motion` is active, text swaps instantly (no flip animation)
- ARIA live region announces title changes for screen readers
- Visual cursor hidden in reduced motion mode

**Config tuning**:
- `flipDuration: 200ms` (fast enough to feel mechanical, slow enough to read)
- `pauseDuration: 6000ms` (long enough to actually read the current title)
- `cycleCount: 8` (enough randomness to look good, not so much it drags on)

### 3. Metric Card Hover Effects

**File**: [src/js/modules/metricAnimations.js](../src/js/modules/metricAnimations.js)

**What it does**: Metric cards scale up slightly (1.03×) on hover.

**Why GSAP for this**: Honestly? Consistency. Since GSAP is already loaded for scroll animations, using it for hovers means all animations respect the same reduced-motion preferences and use the same easing curves.

Could this be CSS? Absolutely. But having one animation system makes the codebase easier to maintain.

### 4. Lazy Loading with IntersectionObserver

**File**: [src/main.js](../src/main.js) (lines 98-123)

**What it does**: Images only load when they're about to enter the viewport (50px margin).

**Why this counts as animation**: It's about performance perception. Users don't wait for 20 images to download upfront — the page feels faster because visible content loads first.

**Technical approach**:
- IntersectionObserver watches all `.project-image` elements
- 50px rootMargin means images start loading just before they're visible (no blank flashes)
- Threshold 0.01 means even a tiny sliver triggers the load
- Once loaded, observer disconnects (no ongoing performance cost)

Not GSAP, but it's part of the overall animation/performance strategy.

---

## What I Explicitly Avoided

**Parallax effects**: Overdone in portfolios. They rarely add value and often break on mobile.

**Page transition libraries**: Barba.js, Swup, etc. are cool but unnecessary for a single-page portfolio with a few detail pages.

**Loading screens**: If your site needs a loading animation, your site is too slow. Fix the performance instead.

**Auto-playing video backgrounds**: Please. No.

**Scroll-jacking**: The scroll animations don't fight the user's input — they respond to it. You're still in control of scrolling speed.

---

## Performance Impact

**GSAP bundle size**: ~50KB minified + gzipped (ScrollTrigger included). Not nothing, but reasonable for what it delivers.

**Animation performance**: All scroll animations run at 60fps on modern devices. GSAP uses `requestAnimationFrame` and GPU-accelerated properties (opacity, transform) exclusively.

**Reduced motion**: When `prefers-reduced-motion: reduce` is detected, GSAP animations are completely disabled (not just slowed down). Users see instant transitions or static content — no motion whatsoever.

**Mobile performance**: Scroll animations work smoothly on mobile because they use `scrub: true` (instant syncing with scroll, no delay). Tested on iPhone SE and older Android devices.

---

## Testing Animations

Want to see the animations in action? Here's what to test:

1. **Scroll through the homepage**: Sections should fade in/out smoothly as you scroll
2. **Watch the flip-board text**: Should cycle through titles every 6 seconds with staggered character flips
3. **Hover over metric cards**: Subtle scale-up on hover (desktop only)
4. **Enable reduced motion** (macOS: System Preferences → Accessibility → Display → Reduce motion):
   - All scroll fades should disappear (sections instantly visible)
   - Flip-board should swap text instantly (no character cycling)
   - Metric hovers should still work (they're subtle enough to be acceptable)

---

## Why Not More Animation?

I could have added parallax, 3D transforms, custom cursors, elaborate page transitions — but none of that would have demonstrated better design thinking. It would have just been noise.

The animations here serve specific purposes:
- **Scroll fades**: Guide attention and create rhythm through the portfolio
- **Flip-board**: Show technical implementation skills in a memorable way
- **Lazy loading**: Improve performance perception

Everything else is visual design, typography, and layout. Animation is a tool, not the point.

---

## Animation Philosophy

Animations should:
- **Enhance comprehension** (not distract from content)
- **Feel responsive** (immediate feedback to user actions)
- **Respect preferences** (disable completely when motion sensitivity is indicated)
- **Perform well** (60fps minimum, hardware-accelerated where possible)
- **Be maintainable** (one animation system, clear configuration, modular code)

That's it. If an animation doesn't meet those criteria, it doesn't ship.
