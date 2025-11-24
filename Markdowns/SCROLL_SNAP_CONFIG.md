# Scroll Snap Configuration Guide

Quick reference for adjusting the scroll snap behavior in your portfolio.

---

## 📍 Current Settings

**File:** [src/js/modules/scrollSnap.js](src/js/modules/scrollSnap.js#L38-L42)

```javascript
snap: {
  snapTo: 1 / (numSections - 1),  // Snap to each section
  duration: { min: 0.2, max: 0.5 }, // Fast snap animation
  delay: 0.05,                      // Minimal delay
  ease: 'power2.inOut',             // Snappy easing
  directional: true,                // Only snap in scroll direction
}
```

---

## 🎛️ Tuning Parameters

### Duration (Animation Speed)

Controls how long the snap animation takes.

| Setting | Duration | Feel |
|---------|----------|------|
| `{ min: 0.1, max: 0.3 }` | Very fast | Instant snap, can feel jarring |
| `{ min: 0.2, max: 0.5 }` | **Fast (current)** | Quick and responsive |
| `{ min: 0.3, max: 0.8 }` | Medium | Smooth and deliberate |
| `{ min: 0.5, max: 1.2 }` | Slow | Gentle, cinematic |

**Recommendation:** Keep between 0.2-0.8s for best UX.

---

### Delay (Wait Time)

Controls how long to wait after scroll stops before snapping.

| Setting | Feel |
|---------|------|
| `0` | Instant snap (can interrupt user) |
| `0.05` | **Minimal delay (current)** - Very responsive |
| `0.1` | Small delay - Good balance |
| `0.2` | Noticeable delay - Gives user time to stop |
| `0.5+` | Long delay - Feels laggy |

**Recommendation:** Keep between 0.05-0.2s. Too short feels aggressive, too long feels unresponsive.

---

### Ease (Animation Curve)

Controls the acceleration curve of the snap.

| Setting | Feel |
|---------|------|
| `'power1.inOut'` | Gentle, smooth |
| `'power2.inOut'` | **Snappy (current)** - Decisive feel |
| `'power3.inOut'` | Very snappy - Almost instant |
| `'expo.inOut'` | Extreme - Very fast start/end |
| `'sine.inOut'` | Soft, natural |

**Recommendation:** `power2.inOut` for modern feel, `sine.inOut` for gentler.

---

### Directional

Controls whether snap respects scroll direction.

| Setting | Behavior |
|---------|----------|
| `true` | **Current** - Only snaps in the direction you're scrolling |
| `false` | Always snaps to nearest section (can snap backward) |

**Recommendation:** Keep `true` for better UX - prevents unexpected backward snaps.

---

## 🔧 Common Adjustments

### Make it faster
```javascript
duration: { min: 0.1, max: 0.3 },
delay: 0,
ease: 'power3.inOut',
```

### Make it smoother
```javascript
duration: { min: 0.4, max: 0.9 },
delay: 0.15,
ease: 'sine.inOut',
```

### Make it more responsive
```javascript
duration: { min: 0.2, max: 0.5 },
delay: 0.05,  // current setting
ease: 'power2.inOut',
```

### Disable snap (for testing)
```javascript
// Comment out the entire snap block
// snap: { ... },
```

Or call `disableScrollSnap()` from JavaScript.

---

## 🎨 Feel Presets

Copy-paste these into [scrollSnap.js](src/js/modules/scrollSnap.js#L36-L42):

### Preset 1: Instant (like macOS Finder)
```javascript
snap: {
  snapTo: 1 / (numSections - 1),
  duration: { min: 0.15, max: 0.3 },
  delay: 0,
  ease: 'power3.inOut',
  directional: true,
}
```

### Preset 2: Balanced (current)
```javascript
snap: {
  snapTo: 1 / (numSections - 1),
  duration: { min: 0.2, max: 0.5 },
  delay: 0.05,
  ease: 'power2.inOut',
  directional: true,
}
```

### Preset 3: Smooth (like Apple.com)
```javascript
snap: {
  snapTo: 1 / (numSections - 1),
  duration: { min: 0.4, max: 0.9 },
  delay: 0.1,
  ease: 'power1.inOut',
  directional: true,
}
```

### Preset 4: Cinematic (slow, deliberate)
```javascript
snap: {
  snapTo: 1 / (numSections - 1),
  duration: { min: 0.6, max: 1.2 },
  delay: 0.2,
  ease: 'sine.inOut',
  directional: true,
}
```

---

## 📱 Mobile Considerations

Mobile devices handle scroll momentum differently:

- **iOS Safari:** Momentum scroll is very smooth. Longer duration (0.4-0.8s) often feels better.
- **Android Chrome:** Varies by device. Test on real hardware.

**Tip:** You can set different snap settings for mobile:

```javascript
const isMobile = window.innerWidth < 768;

const snapConfig = isMobile
  ? { duration: { min: 0.3, max: 0.7 }, delay: 0.1, ease: 'sine.inOut' }
  : { duration: { min: 0.2, max: 0.5 }, delay: 0.05, ease: 'power2.inOut' };

ScrollTrigger.create({
  // ...
  snap: {
    snapTo: 1 / (numSections - 1),
    ...snapConfig,
    directional: true,
  },
});
```

---

## 🧪 Testing Tips

1. **Test with different scroll speeds:**
   - Slow scroll → Should snap gently
   - Fast scroll → Should snap decisively
   - Scroll halfway → Should snap to the section you're heading toward

2. **Test on real devices:**
   - Desktop: Mouse wheel, trackpad, keyboard
   - Mobile: Touch with varying swipe speeds

3. **Test with reduced motion:**
   - Enable OS setting → Snap should be completely disabled

4. **Use markers for debugging:**
   ```javascript
   ScrollTrigger.create({
     // ...
     markers: true,  // Shows visual indicators
   });
   ```

---

## 🚫 Disable Scroll Snap

### Temporary (for testing)
In browser console:
```javascript
ScrollTrigger.getAll().forEach(t => t.vars.snap && t.kill());
```

### Permanent
Comment out in [scrollSnap.js](src/js/modules/scrollSnap.js):
```javascript
export function initScrollSnap() {
  // if (prefersReducedMotion()) {
  //   console.log('Scroll snap disabled: user prefers reduced motion');
  //   return;
  // }

  // Comment out ScrollTrigger.create({ ... })
  return; // Early return to disable
}
```

---

## 📊 Performance Impact

Scroll snap has minimal performance impact:
- No continuous scroll listeners
- GSAP uses `requestAnimationFrame` (GPU-accelerated)
- No layout reflow (only `transform` properties)

**Lighthouse Impact:** <1 point (negligible)

---

## 🔗 Resources

- [GSAP ScrollTrigger Snap Docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger/snap)
- [GSAP Easing Visualizer](https://greensock.com/ease-visualizer)
- [CSS Scroll Snap (alternative approach)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap)

---

## 💡 Pro Tips

1. **Start with longer duration** and reduce until it feels right
2. **Delay should be barely noticeable** (0.05-0.15s sweet spot)
3. **Test on your slowest target device** - if it feels good there, it's good everywhere
4. **Don't over-tune** - users adapt quickly to consistent behavior
5. **Get feedback** from users on different devices

---

**Current Feel:** Fast and responsive (good for portfolio)
**Alternative Feel:** If showing case studies with lots of content, consider slower/smoother preset

**Last Updated:** 2025-10-16
