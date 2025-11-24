# Project Detail Archiving Notes

## Summary
The `project-detail` functionality has been archived as it's no longer in use. All functionality is now handled by the `case-study` system.

## What Was Archived
1. **JavaScript**: `src/js/modules/projectDetail.js` → `src/js/archive/projectDetail.js`
2. **Styles**: `src/scss/project-detail.scss` → `src/scss/archive/project-detail.scss`
3. **HTML**: Commented out in `index.html` (lines 157-174)

## Feature Coverage Comparison

### Project Detail (ARCHIVED)
- Fixed overlay page with 5-column grid layout
- Static grid: 2 cols (written) + 1 col (technical) + 2 cols (images)
- Simple content structure
- Basic close button and breadcrumbs

### Case Study (ACTIVE)
- ✅ Fixed overlay page (full-screen)
- ✅ Close button with same styling
- ✅ Breadcrumbs navigation
- ✅ Sticky header with hero section
- ✅ Flexible content block system (supports many block types)
- ✅ Theme variations (blue, green, neutral)
- ✅ Image galleries with lightbox
- ✅ Metrics display
- ✅ Story-hook for narrative engagement
- ✅ Timeline, before/after, two-column layouts, and more

## Why Case Study is Better
- **Flexible Block System**: Can render any content type dynamically
- **Better Storytelling**: Includes story-hook, timelines, key insights
- **More Interactive**: Lightbox galleries, expandable sections
- **Better Mobile Support**: Responsive layout optimizations
- **Sticky Header**: Hero stays visible while scrolling
- **Richer Content**: Supports complex layouts (sidebars, grids, full-width images)

## What Functionality is NOT Lost
Every feature from project-detail exists in case-study:
- [x] Close button → `case-study-close`
- [x] Breadcrumbs → `cs-breadcrumbs`
- [x] Title/Subtitle → `cs-hero-title`, `cs-hero-subtitle`
- [x] Content sections → Flexible content blocks system
- [x] Technical info → Can use sidebars in two-column blocks
- [x] Images → `cs-hero-images`, image blocks, galleries
- [x] Theme support → `data-theme` attribute

## Safe to Delete?
**YES** - The archived files can be safely deleted in the future if needed. All functionality is covered by case-study.

## How to Restore (if needed)
1. Uncomment HTML in `index.html` (lines 157-174)
2. Uncomment imports in `src/main.js` (lines 30, 75)
3. Uncomment import in `src/scss/main.scss` (line 8)
4. Move files back from archive folders

---
*Archived on: 2025-11-23*
*Reason: Replaced by more flexible case-study system*
