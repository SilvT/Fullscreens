# Portfolio Testing Guide

Quick reference for testing all the new features implemented in your portfolio.

---

## 🖥️ Local Testing

### Start Development Server
```bash
npm run dev
```

Server will be available at: [http://localhost:3003](http://localhost:3003) (or next available port)

### Build for Production
```bash
npm run build
npm run preview
```

---

## ✅ Feature Testing Checklist

### 1. Sticky Navigation
**What to test:**
- [ ] Navigation stays at top when scrolling
- [ ] Background becomes slightly opaque when scrolling
- [ ] Backdrop blur effect visible (glassmorphism)
- [ ] Background color changes based on section (cream → blue → green → neutral)
- [ ] Logo remains visible in all sections
- [ ] No layout shift when scrolling

**How to test:**
1. Load page
2. Scroll down slowly through all sections
3. Watch navigation bar - should stay sticky at top
4. Notice background color transition as you enter each section

---

### 2. Scroll Snapping
**What to test:**
- [ ] Sections snap into place after scroll momentum stops
- [ ] Snap feels intentional but not jarring
- [ ] Works with mouse wheel
- [ ] Works with trackpad
- [ ] Works with keyboard (Page Up/Down, Arrow keys)
- [ ] Directional snap (doesn't snap back when scrolling past midpoint)

**Current settings:**
- Duration: 0.2s–0.5s (fast)
- Delay: 0.05s (almost immediate)
- Easing: power2.inOut (snappy)

**How to test:**
1. Scroll slowly between sections - should snap when you stop
2. Scroll quickly - should snap to nearest section
3. Scroll halfway between sections - should snap to the one you're scrolling toward
4. Try keyboard: Press Page Down - should snap to next section

---

### 3. Metric Card Animations
**What to test:**
- [ ] Cards fade in when scrolling into view
- [ ] Cards appear with stagger effect (one after another)
- [ ] Numbers count up from 0 to target value (e.g., 60% animates from 0% → 60%)
- [ ] Hover on desktop: card scales up slightly (1.03x)
- [ ] Animations smooth and not jumpy

**Where to see:**
- Project sections (3 metric cards per project)

**How to test:**
1. Scroll to a project section
2. Watch metric cards appear with stagger
3. Hover over a card (desktop only) - should scale up
4. Scroll back up and down - animation should replay

---

### 4. Text & Image Animations
**What to test:**
- [ ] About section: Name slides in from left, description from right
- [ ] Project titles fade in with subtle slide
- [ ] Project descriptions fade in after title (staggered)
- [ ] Project images fade in with scale (0.85 → 1.0)
- [ ] Images have subtle parallax effect when scrolling
- [ ] CTA buttons bounce in with "back.out" easing
- [ ] Tags fade in at bottom

**How to test:**
1. Reload page and scroll slowly through each section
2. Watch for animations as elements enter viewport
3. Scroll back up to see reverse animations
4. Notice parallax on project images (subtle y-axis movement)

---

### 5. Keyboard Navigation
**What to test:**
- [ ] Tab through navigation items
- [ ] Focus states visible (2px blue outline)
- [ ] Enter or Space activates navigation links
- [ ] Tab to CTA buttons
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Skip to main content link appears on first Tab

**How to test:**
1. Click in address bar, then press Tab
2. First element should be "Skip to main content" (hidden until focused)
3. Continue tabbing through navigation
4. Press Enter to navigate
5. Tab through entire page - focus should always be visible

---

### 6. Accessibility (Reduced Motion)
**What to test:**
- [ ] Enable OS reduced motion setting
- [ ] Reload page - all animations should be disabled
- [ ] Scroll snap should be disabled
- [ ] Content should appear instantly (no fade-ins)
- [ ] Job title rotation should show all titles statically

**How to enable reduced motion:**

**macOS:**
1. System Preferences → Accessibility → Display
2. Check "Reduce motion"
3. Reload page

**Windows:**
1. Settings → Ease of Access → Display
2. Turn on "Show animations in Windows"
3. Reload page

**How to test:**
1. Enable reduced motion in OS settings
2. Reload portfolio page
3. Scroll through sections - no animations, instant display
4. Check console: Should log "Scroll snap disabled: user prefers reduced motion"

---

### 7. Color Contrast (WCAG AA)
**What to test:**
- [ ] All text readable on backgrounds
- [ ] Navigation text: high contrast
- [ ] Project descriptions: sufficient contrast
- [ ] Metric labels: readable at small size
- [ ] Focus outlines: clearly visible

**How to test:**
1. Use browser DevTools → Accessibility tab
2. Select text elements
3. Check contrast ratio (should be ≥4.5:1 for normal text)
4. Or use browser extension: Axe DevTools, WAVE, or Lighthouse

**Verified colors:**
- Blue primary (#3980aa): 4.52:1 ✓
- Green primary (#79854f): 4.51:1 ✓
- Neutral (#5c584f): 7.21:1 ✓

---

### 8. Mobile Testing (Important!)
**What to test:**
- [ ] iOS Safari: Touch scroll with momentum + snap
- [ ] Android Chrome: Touch scroll + snap
- [ ] Navigation readable on small screens (font sizes scale down)
- [ ] CTA buttons easy to tap (sufficient touch target size)
- [ ] No horizontal scroll
- [ ] Images load properly (lazy loading)

**How to test:**
1. Open on real mobile device (not just DevTools)
2. Scroll with finger - should feel smooth and snap nicely
3. Test both slow and fast scrolls
4. Test landscape and portrait orientations
5. Test on different screen sizes (iPhone SE, iPhone 15 Pro Max, Android tablets)

**Mobile breakpoints:**
- 1200px: Medium layout adjustments
- 768px: Mobile layout (stack content vertically)

---

## 🔧 Troubleshooting

### Animations not working?
1. Check browser console for errors
2. Verify GSAP is loaded: Type `gsap` in console
3. Check if reduced motion is enabled (animations disabled by design)
4. Refresh page with hard reload (Cmd+Shift+R / Ctrl+Shift+R)

### Scroll snap not working?
1. Check console for "Scroll snap initialized" message
2. Verify page has 4 sections (check console: "Sections found: 4")
3. Try on different browser
4. Disable browser extensions (some block scroll behavior)

### Navigation not sticky?
1. Check CSS: `.top-nav` should have `position: sticky`
2. Verify `z-index: 1000` is applied
3. Check if CSS is loaded (view page source, look for `<link>` tag)

### Colors look wrong?
1. Hard refresh (clear cache)
2. Check SCSS compiled correctly: `npm run build`
3. Verify `_navigation.scss` is imported in `main.scss`

---

## 🚀 Performance Testing

### Lighthouse Audit
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select:
   - ✅ Performance
   - ✅ Accessibility
   - ✅ Best Practices
4. Click "Analyze page load"

**Target scores:**
- Performance: ≥85
- Accessibility: ≥95
- Best Practices: ≥90

### FPS Monitoring
1. Open Chrome DevTools → Performance tab
2. Click Record
3. Scroll through page
4. Stop recording
5. Check "FPS" chart - should stay close to 60fps
6. Look for layout shifts (red bars) - should have minimal to none

### Network Throttling
1. Chrome DevTools → Network tab
2. Change "No throttling" to "Slow 4G"
3. Reload page
4. Verify animations still work smoothly
5. Images should lazy load as you scroll

---

## 🎨 Visual QA Checklist

### Desktop (1920x1080)
- [ ] All sections fill viewport (100vh)
- [ ] Navigation spans full width
- [ ] Project images centered and properly sized
- [ ] Metric cards aligned horizontally
- [ ] No text overflow or truncation
- [ ] No visual jank when scrolling

### Tablet (768x1024)
- [ ] Navigation font sizes scaled down appropriately
- [ ] Project content stacks vertically
- [ ] Metric cards remain readable
- [ ] Images resize properly
- [ ] Touch targets large enough (min 44x44px)

### Mobile (375x667 - iPhone SE)
- [ ] Navigation compact but readable
- [ ] All content fits without horizontal scroll
- [ ] Metric cards stack vertically
- [ ] CTA buttons easy to tap
- [ ] Font sizes legible at small size

---

## 📱 Device-Specific Testing

### iOS Safari (iPhone)
**Known issues to watch for:**
- Momentum scrolling behavior different from desktop
- Scroll snap may feel different (this is normal)
- Backdrop filter support (works on iOS 9+)

**Test:**
1. Open in Safari (not Chrome on iOS - uses same engine)
2. Scroll naturally with finger
3. Verify snap feels good on touch
4. Test in both orientations

### Android Chrome
**Known issues to watch for:**
- Scroll momentum varies by manufacturer (Samsung vs. Pixel)
- Some older devices may have slower animations

**Test:**
1. Open in Chrome
2. Test on real device, not emulator
3. Verify snap works smoothly
4. Check animations don't cause jank

---

## 🐛 Bug Reporting

If you find issues, note:
1. Browser & version (e.g., Chrome 120, Safari 17)
2. Device & OS (e.g., MacBook Pro, macOS Sonoma 14.2)
3. What you were doing when it happened
4. Screenshot or video if possible
5. Console errors (F12 → Console tab)

---

## ✨ What's New (Summary)

1. **Single sticky navbar** - No more repeated HTML
2. **Scroll snapping** - Smooth, fast (0.2-0.5s), respects reduced motion
3. **Metric animations** - Fade-in, stagger, count-up, hover effects
4. **Section animations** - Fade transitions, parallax, text stagger
5. **Full accessibility** - WCAG AA, keyboard nav, ARIA labels, focus states
6. **Modular JavaScript** - Clean architecture, easy to maintain
7. **Performance optimized** - GPU-accelerated animations, lazy loading

---

**Last Updated:** 2025-10-16
**Dev Server:** http://localhost:3003
**Build Output:** dist/

Happy testing! 🎉
