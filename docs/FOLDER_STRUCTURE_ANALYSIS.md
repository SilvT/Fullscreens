# Folder Structure Analysis & Recommendations

Right, so I've gone through the entire codebase structure. Here's what needs cleaning up, what can be unified, and what should be relocated for better organisation.

---

## Current Issues

### 1. **Root Directory Clutter**

**Problem**: Too many files in the root that should live elsewhere.

**Current root files**:
```
├── content-blocks-kit.html          # Development tool
├── cv-silvia-travieso.html          # Project page
├── design-system.html               # Project page
├── energy-tracker.html              # Project page
├── figma-plugin.html                # Project page
├── marketing-management.html        # Project page
├── index.html                       # Main page (correct location)
├── index.html.backup                # BACKUP FILE (should be deleted or moved)
├── index.html.bak2                  # BACKUP FILE (should be deleted or moved)
├── project-template.html            # Template/development tool
├── logo-filled.svg                  # Asset (should be in /src/assets)
├── logo-outlined.svg                # Asset (should be in /src/assets)
├── favicon.png                      # Asset (could move to /public)
├── REFACTORING_SUMMARY.md           # Already in /Markdowns (duplicate check needed)
```

**What's wrong**:
- Assets (SVGs, favicon) mixed with HTML pages
- Backup files cluttering root
- Development tools (content-blocks-kit.html, project-template.html) in production structure
- Documentation potentially duplicated across `/Markdowns` and `/docs`

---

### 2. **Documentation Spread Across Multiple Locations**

**Problem**: Documentation lives in three different places.

**Current documentation locations**:
```
/Markdowns/                  # Technical implementation docs
├── REFACTORING_SUMMARY.md
├── IMPLEMENTATION_SUMMARY.md
├── SCROLL_SNAP_CONFIG.md
├── TESTING_GUIDE.md
├── CONTENT-BLOCKS-REFERENCE.md
├── IMAGE-SPECIFICATIONS.md
├── ATS-SETUP-COMPLETE.md
├── ARCHIVING-NOTES.md
├── iconoir-list.md
├── mkm case study-action plan.md
└── cv-silvia-travieso-FINAL.md   # Content source file

/docs/                       # New recruiter-facing docs
├── ANIMATION_DECISIONS.md
├── PERFORMANCE.md
├── SCREENSHOTS.md
└── README.md

/scripts/README.md           # Build scripts documentation
```

**What's wrong**:
- No clear distinction between "internal dev docs" and "external recruiter docs"
- REFACTORING_SUMMARY.md referenced in README but actually lives in /Markdowns
- Some Markdown files are content sources (cv, case study plans), not documentation

---

### 3. **Data Files Split Across Locations**

**Problem**: JSON project data lives in two places.

**Current data locations**:
```
/src/data/
├── projects.json            # Main project index
├── marketing.json           # One project (inconsistent naming)
└── archive/                 # Archived data

/public/data/
├── ds.json                  # Design system project
├── microsite.json           # Microsite project
├── mkm-content.json         # Marketing project
├── mkm-ds.json              # Marketing DS project
├── mkm-new.json             # Marketing (what's "new"?)
└── ui-blocks-examples.json  # UI blocks project
```

**What's wrong**:
- Inconsistent: some projects in `/src/data`, some in `/public/data`
- Confusing naming: `mkm-content.json` vs `mkm-ds.json` vs `mkm-new.json` vs `marketing.json`
- No clear pattern for where project JSONs should live

---

### 4. **Unclear Archive Strategy**

**Problem**: Multiple archive folders with unclear purposes.

**Current archive locations**:
```
/archive/                    # Root-level (empty?)
/src/js/archive/             # Archived JavaScript modules
/src/scss/archive/           # Archived SCSS files
/src/data/archive/           # Archived JSON data
```

**What's right**: JavaScript and SCSS archives are good (deprecated code lives with related code).

**What's unclear**: Root `/archive` folder — is it used? What goes there vs module-level archives?

---

### 5. **Inconsistent Asset Organisation**

**Problem**: Assets scattered across `/public`, `/src/assets`, and root.

**Current asset locations**:
```
/public/
├── ds/                      # Design system project images
├── microsite/               # Microsite project images
├── mkm/                     # Marketing project images
├── plugin/                  # Plugin project images
├── cv-silvia-travieso-2025.pdf
├── 17b81efd1707...png       # Random hash-named image
└── favicon.png

/src/assets/                 # Empty (just created)

/ (root)
├── logo-filled.svg
├── logo-outlined.svg
└── favicon.png              # Duplicate?
```

**What's wrong**:
- Logos in root instead of `/src/assets` or `/public`
- Favicon duplicated in root and `/public`?
- `/src/assets` exists but isn't being used
- Mysterious hash-named PNG in `/public`

---

### 6. **HTML Pages Organisation**

**Problem**: All project pages live in root with no structure.

**Current**:
```
/ (root)
├── index.html
├── design-system.html
├── energy-tracker.html
├── figma-plugin.html
├── marketing-management.html
├── cv-silvia-travieso.html
├── content-blocks-kit.html
└── project-template.html
```

**What's wrong**:
- Production pages mixed with development tools
- No indication which files are templates vs actual pages
- Vite config handles multi-page builds, but structure doesn't reflect this

---

## Recommended Structure

### **Phase 1: Move Assets (Immediate)**

```bash
# Move logos to src/assets
mv logo-filled.svg src/assets/
mv logo-outlined.svg src/assets/

# Check if root favicon.png is duplicate of public/favicon.png
# If yes, delete root version
# If no, move to public/
```

**Update references**: Search codebase for `logo-filled.svg` and `logo-outlined.svg` paths and update imports.

---

### **Phase 2: Organise Development Tools**

Create `/dev-tools/` folder for development-only files:

```bash
mkdir dev-tools
mv content-blocks-kit.html dev-tools/
mv project-template.html dev-tools/
```

**Reasoning**: Separates production HTML from templates/kits used during development.

**Vite config update**: Remove these from build config (they're tools, not pages to deploy).

---

### **Phase 3: Clean Up Backups**

```bash
# Option A: Delete if no longer needed
rm index.html.backup index.html.bak2

# Option B: Move to archive if you want to keep them
mkdir -p archive/html-backups
mv index.html.backup index.html.bak2 archive/html-backups/
```

**Recommendation**: Delete them. Git history keeps all versions anyway.

---

### **Phase 4: Unify Documentation**

**Proposal**: Keep two doc locations with clear purposes.

**`/docs/` — External (Recruiter-Facing)**
```
/docs/
├── README.md
├── ANIMATION_DECISIONS.md
├── PERFORMANCE.md
├── SCREENSHOTS.md
└── screenshots/
```
**Purpose**: Documentation for recruiters viewing the GitHub repo.

**`/Markdowns/` → Rename to `/dev-docs/` — Internal (Developer Notes)**
```
/dev-docs/
├── README.md                    # NEW: Explains what's here
├── REFACTORING_SUMMARY.md       # Keep
├── IMPLEMENTATION_SUMMARY.md    # Keep
├── SCROLL_SNAP_CONFIG.md        # Keep
├── TESTING_GUIDE.md             # Keep
├── CONTENT-BLOCKS-REFERENCE.md  # Keep
├── IMAGE-SPECIFICATIONS.md      # Keep
├── ATS-SETUP-COMPLETE.md        # Keep
├── ARCHIVING-NOTES.md           # Keep
└── iconoir-list.md              # Keep (icon reference)
```

**Move content files elsewhere**:
```bash
# These aren't docs, they're content sources
mv Markdowns/cv-silvia-travieso-FINAL.md src/content/
mv Markdowns/mkm\ case\ study-action\ plan.md src/content/case-study-plans/
```

**Reasoning**:
- Clear separation: recruiters see `/docs`, developers see `/dev-docs`
- Content source files (CV markdown, case study plans) don't belong in documentation folders

---

### **Phase 5: Consolidate Data Files**

**Decision needed**: Where should JSON project data live?

**Option A: Everything in `/public/data/`** (Recommended)
```
/public/data/
├── projects.json            # Index
├── design-system.json       # Rename from ds.json
├── energy-tracker.json      # NEW (currently doesn't exist?)
├── figma-plugin.json        # NEW
├── microsite.json
├── marketing-management.json  # Unify mkm-* files into this
└── ui-blocks-examples.json
```

**Reasoning**:
- Public data (served to browser) should live in `/public`
- `/src/data` would be for build-time-only data (none currently)
- Consistent naming: `[project-slug].json`

**Cleanup actions**:
```bash
# Consolidate marketing project JSONs
# (Manually merge mkm-content.json, mkm-ds.json, mkm-new.json)
# into marketing-management.json

# Rename for consistency
mv public/data/ds.json public/data/design-system.json

# Delete /src/data if empty after moving projects.json
```

---

### **Phase 6: Clarify Archive Strategy**

**Proposal**:
- **Keep**: Module-level archives (`/src/js/archive`, `/src/scss/archive`)
- **Delete**: Root `/archive` if empty
- **Create**: `/archive/old-versions/` if you need to keep major iteration backups

**Guideline**:
- Code archives live with related code (`src/js/archive` for old JS)
- Full project backups (if needed) go in `/archive/old-versions/`
- Don't duplicate — Git history is the archive

---

## Proposed Final Structure

```
/
├── index.html                       # Main page (keep in root)
├── design-system.html               # Project pages (keep in root for Vite)
├── energy-tracker.html
├── figma-plugin.html
├── marketing-management.html
├── cv-silvia-travieso.html
├── package.json
├── vite.config.js
├── README.md
├── .gitignore
│
├── /public/                         # Static assets served as-is
│   ├── favicon.png
│   ├── cv-silvia-travieso-2025.pdf
│   ├── /data/                       # All project JSON (unified location)
│   │   ├── projects.json
│   │   ├── design-system.json
│   │   ├── microsite.json
│   │   ├── marketing-management.json
│   │   ├── energy-tracker.json
│   │   ├── figma-plugin.json
│   │   └── ui-blocks-examples.json
│   │
│   └── /[project-slug]/             # Project images by slug
│       ├── ds/
│       ├── microsite/
│       ├── mkm/
│       └── plugin/
│
├── /src/                            # Source code
│   ├── main.js
│   ├── /assets/                     # Source assets (logos, icons)
│   │   ├── logo-filled.svg
│   │   └── logo-outlined.svg
│   │
│   ├── /scss/                       # Styles
│   │   ├── main.scss
│   │   ├── _variables.scss
│   │   └── /archive/
│   │
│   ├── /js/                         # JavaScript modules
│   │   ├── /modules/
│   │   ├── /utils/
│   │   ├── /archive/
│   │   ├── project-page.js
│   │   └── content-blocks-kit.js
│   │
│   └── /content/                    # NEW: Content source files
│       ├── cv-silvia-travieso.md
│       └── /case-study-plans/
│
├── /scripts/                        # Build scripts
│   ├── README.md
│   ├── generate-ats-content.js
│   ├── verify-ats.js
│   └── ats-config.js
│
├── /docs/                           # Recruiter-facing documentation
│   ├── README.md
│   ├── ANIMATION_DECISIONS.md
│   ├── PERFORMANCE.md
│   ├── SCREENSHOTS.md
│   └── /screenshots/
│
├── /dev-docs/                       # Developer documentation (renamed from Markdowns)
│   ├── README.md
│   ├── REFACTORING_SUMMARY.md
│   ├── IMPLEMENTATION_SUMMARY.md
│   ├── SCROLL_SNAP_CONFIG.md
│   ├── TESTING_GUIDE.md
│   ├── CONTENT-BLOCKS-REFERENCE.md
│   ├── IMAGE-SPECIFICATIONS.md
│   ├── ATS-SETUP-COMPLETE.md
│   ├── ARCHIVING-NOTES.md
│   └── iconoir-list.md
│
├── /dev-tools/                      # NEW: Development-only tools
│   ├── content-blocks-kit.html
│   └── project-template.html
│
└── /dist/                           # Build output (gitignored)
```

---

## Implementation Checklist

### Immediate (Low Risk)

- [x] Create `/src/assets/` directory
- [ ] Move `logo-filled.svg` and `logo-outlined.svg` to `/src/assets/`
- [ ] Update imports in HTML/SCSS files
- [ ] Delete or archive `index.html.backup` and `index.html.bak2`
- [ ] Check if root `favicon.png` is duplicate of `public/favicon.png`

### Phase 2 (Medium Priority)

- [ ] Create `/dev-tools/` directory
- [ ] Move `content-blocks-kit.html` and `project-template.html` to `/dev-tools/`
- [ ] Update Vite config to exclude dev-tools from build
- [ ] Rename `/Markdowns/` to `/dev-docs/`
- [ ] Create `/dev-docs/README.md` explaining internal docs
- [ ] Create `/src/content/` directory
- [ ] Move `cv-silvia-travieso-FINAL.md` and case study plans to `/src/content/`

### Phase 3 (Requires Testing)

- [ ] Consolidate JSON data files in `/public/data/`
  - [ ] Merge `mkm-content.json`, `mkm-ds.json`, `mkm-new.json` into `marketing-management.json`
  - [ ] Rename `ds.json` → `design-system.json`
  - [ ] Move `/src/data/projects.json` to `/public/data/` (if it should be public)
  - [ ] Update imports in JavaScript modules
  - [ ] Test that dynamic content loading still works
- [ ] Delete `/src/data/` if empty
- [ ] Delete root `/archive/` if empty

### Phase 4 (Documentation Update)

- [ ] Update main README to reference `/dev-docs` for implementation notes
- [ ] Update REFACTORING_SUMMARY.md path in README (currently points to wrong location)
- [ ] Add note to `/dev-docs/README.md` explaining purpose

---

## Risky Changes to Avoid

**Don't move project HTML pages** (`design-system.html`, etc.) into subfolders unless you:
1. Update Vite config `rollupOptions.input` paths
2. Update all internal links
3. Test build output paths
4. Update deployment config

**Why**: Vite multi-page builds expect HTML entry points. Moving them requires config changes and thorough testing.

---

## Questions to Answer Before Proceeding

1. **Root `/archive` folder**: Is it used? Can it be deleted?
2. **Favicon duplication**: Is `/favicon.png` the same as `/public/favicon.png`?
3. **Data consolidation**: Should `projects.json` stay in `/src/data` or move to `/public/data`?
4. **Marketing JSON files**: Which is canonical: `mkm-content.json`, `mkm-ds.json`, or `mkm-new.json`?
5. **Hash-named image**: What is `/public/17b81efd1707...png` and can it be renamed or deleted?

---

## Next Steps

Start with Phase 1 (assets) since it's low-risk and immediately improves organisation. Test thoroughly after each phase before moving to the next.

Want me to implement any of these phases?
