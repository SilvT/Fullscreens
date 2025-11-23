# Image Specifications for Portfolio Project Cards

## Aspect Ratio Overview

The `.project-image-wrapper` uses different aspect ratios across devices to optimize layout and visual presentation.

### Desktop/Tablet (≥769px)
- **Container**: 50vw width × 350px height
- **Calculated Aspect Ratio**: ~2:1 to 2.75:1 (varies by viewport)
- **Recommended Aspect Ratio**: **5:2** (2.5:1)

### Mobile (≤768px)
- **Container**: 100vw width × 250px height
- **Calculated Aspect Ratio**: ~1.5:1 to 1.66:1 (varies by viewport)
- **Recommended Aspect Ratio**: **3:2** (1.5:1)

---

## Recommended Image Dimensions

### Desktop/Tablet Images
**Aspect Ratio: 5:2** (2.5:1)

| Resolution | Dimensions | Use Case |
|------------|------------|----------|
| Standard   | 1000×400px | Base desktop/tablet |
| Retina     | 1200×480px | High-DPI displays |
| Large      | 1500×600px | 4K displays (optional) |

**Alternative: 21:8** (2.625:1) for ultra-wide
- Standard: 960×365px
- Retina: 1920×730px

### Mobile Images
**Aspect Ratio: 3:2** (1.5:1)

| Resolution | Dimensions | Use Case |
|------------|------------|----------|
| Standard   | 375×250px | iPhone SE, small phones |
| Medium     | 414×276px | iPhone Plus, larger phones |
| Retina     | 750×500px | High-DPI mobile displays |

---

## Implementation: CSS Aspect Ratio

Use the CSS `aspect-ratio` property with responsive breakpoints:

```scss
.project-image {
  aspect-ratio: 5 / 2;
  object-fit: cover;

  @include breakpoint(mobile) {
    aspect-ratio: 3 / 2;
  }
}
```

**Image files needed:**
- `project-{id}-desktop.jpg` (1200×480px, 5:2 ratio)
- `project-{id}-mobile.jpg` (750×500px, 3:2 ratio)

---

## Viewport Calculations

### Desktop Calculations (Common Viewports)

| Viewport | Width (50vw) | Height | Ratio |
|----------|-------------|--------|-------|
| 1920px   | 960px       | 350px  | 2.74:1 |
| 1440px   | 720px       | 350px  | 2.06:1 |
| 1366px   | 683px       | 350px  | 1.95:1 |

### Mobile Calculations (Common Viewports)

| Viewport | Width (100vw) | Height | Ratio |
|----------|--------------|--------|-------|
| 390px    | 390px        | 250px  | 1.56:1 |
| 375px    | 375px        | 250px  | 1.50:1 |
| 414px    | 414px        | 250px  | 1.66:1 |

---

## File Naming Convention

### Recommended Structure
```
/src/assets/projects/
  ├── project-1-desktop.jpg (1200×480px, 5:2)
  ├── project-1-mobile.jpg  (750×500px, 3:2)
  ├── project-2-desktop.jpg
  ├── project-2-mobile.jpg
  └── ...
```

### Alternative Structure (with retina)
```
/src/assets/projects/
  ├── project-1-desktop.jpg     (1000×400px)
  ├── project-1-desktop@2x.jpg  (2000×800px)
  ├── project-1-mobile.jpg      (375×250px)
  ├── project-1-mobile@2x.jpg   (750×500px)
  └── ...
```

---

## Image Optimization Guidelines

### Format Recommendations
- **WebP**: Modern browsers (best compression)
- **JPEG**: Fallback for older browsers
- **AVIF**: Next-gen format (optional, cutting-edge)

### Quality Settings
- **Desktop**: 80-85% quality (good balance)
- **Mobile**: 75-80% quality (smaller file size priority)

### Compression Tools
- [Squoosh](https://squoosh.app/) - Online image optimizer
- [ImageOptim](https://imageoptim.com/) - Mac app
- [TinyPNG](https://tinypng.com/) - Web service

### Recommended Workflow
1. Export design mockups at recommended dimensions
2. Convert to WebP format for ~30% smaller file size
3. Keep JPEG fallback for browser compatibility
4. Test across viewport sizes to verify aspect ratios

---

## Quick Reference

**Desktop/Tablet:** 1200×480px (5:2 ratio)
**Mobile:** 750×500px (3:2 ratio)
**Format:** WebP with JPEG fallback
**Quality:** 80% (desktop), 75% (mobile)

---

## Current Implementation

As of the latest update, project images use:
- Fixed height containers (350px desktop, 250px mobile)
- Fluid width (50vw desktop, 100vw mobile)
- `object-fit: cover` for image scaling

To implement aspect-ratio optimization, update `.project-image` in `project-card.scss` with the recommended CSS from Option 1 above.
