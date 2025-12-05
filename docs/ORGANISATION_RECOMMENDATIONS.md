# Organisation Recommendations

Right, I've analysed the entire codebase structure. Here are concrete, actionable recommendations for cleaning this up — organised by priority and risk level.

---

## ✅ Completed (Phase 1)

- **Backup files deleted**: `index.html.backup` and `index.html.bak2` removed
- **Logos relocated**: Moved to `/public/` (correct location for absolute path references)
- **Duplicate favicon removed**: Root `favicon.png` deleted (kept `/public/favicon.png`)

---

## 🔥 High Priority — Do These Next

### 1. Separate Development Tools from Production Files

**Current problem**: `content-blocks-kit.html` and `project-template.html` are in root with production pages.

**Solution**:
```bash
mkdir dev-tools
mv content-blocks-kit.html dev-tools/
mv project-template.html dev-tools/
```

**Then update `vite.config.js`** to exclude these from build:
```javascript
// Remove from rollupOptions.input:
'content-blocks-kit': path.resolve(__dirname, 'content-blocks-kit.html'),
```

**Why this matters**: Recruiters shouldn't see development scaffolding in the repo root. Keep production-ready files at top level.

---

### 2. Rename `/Markdowns` → `/dev-docs`

**Current problem**: "Markdowns" isn't descriptive. These are internal development docs, not markdown examples.

**Solution**:
```bash
mv Markdowns dev-docs
```

**Then create `/dev-docs/README.md`**:
```markdown
# Development Documentation

Internal technical notes and implementation guides. These docs are for developers working on the codebase.

For recruiter-facing documentation, see [`/docs`](../docs).

## What's Here
- **REFACTORING_SUMMARY.md** — Recent codebase refactoring notes
- **IMPLEMENTATION_SUMMARY.md** — Initial build decisions
- **CONTENT-BLOCKS-REFERENCE.md** — Content block system usage
- **TESTING_GUIDE.md** — Testing procedures
- etc.
```

**Update main README.md** to reference `/dev-docs` for implementation details.

**Why this matters**: Clear separation between "docs recruiters see" (`/docs`) and "docs developers need" (`/dev-docs`).

---

### 3. Move Content Source Files Out of Documentation

**Current problem**: `cv-silvia-travieso-FINAL.md` and `mkm case study-action plan.md` are in `/Markdowns` but they're not documentation — they're content sources.

**Solution**:
```bash
mkdir -p src/content/case-study-plans
mv dev-docs/cv-silvia-travieso-FINAL.md src/content/
mv dev-docs/"mkm case study-action plan.md" src/content/case-study-plans/
```

**Why this matters**: Keeps docs focused on documentation, not content authoring.

---

## ⚠️ Medium Priority — Requires Testing

### 4. Consolidate Project JSON Data

**Current problem**: Project data files are split across `/src/data` and `/public/data` with inconsistent naming.

**Files to unify**:
```
/src/data/
├── projects.json            # Main index
└── marketing.json           # One project

/public/data/
├── ds.json
├── microsite.json
├── mkm-content.json
├── mkm-ds.json
├── mkm-new.json
└── ui-blocks-examples.json
```

**Solution — Option A: Everything in `/public/data/`** (Recommended)

Since project JSONs are fetched at runtime by the browser, they should live in `/public`. Move everything there:

```bash
# Move src/data files to public/data
mv src/data/projects.json public/data/
mv src/data/marketing.json public/data/marketing-management.json

# Rename for consistency
mv public/data/ds.json public/data/design-system.json

# Consolidate mkm-* files into one
# (Manual step: merge mkm-content.json, mkm-ds.json, mkm-new.json
#  into marketing-management.json based on which is most complete)
```

**Update imports** in JavaScript:
```javascript
// Before:
import projectData from '../data/projects.json';

// After:
import projectData from '../../public/data/projects.json';
// Or fetch at runtime instead of import
```

**Why this matters**:
- Single source of truth for project data
- Consistent naming (`[project-slug].json`)
- Clear distinction: `/public` = runtime assets, `/src` = build-time code

**Risk level**: Medium — requires testing that dynamic content loading still works after path changes.

---

### 5. Identify and Resolve Confusing File Names

**Mystery file**: `/public/17b81efd17076f9f44d848e6169d69edec56397d.png`

**Action**:
1. Find where it's referenced in the codebase
2. Rename it to something descriptive (e.g., `og-image.png`, `hero-fallback.png`)
3. Update references

**Multiple marketing JSONs**:
- `mkm-content.json`
- `mkm-ds.json`
- `mkm-new.json`
- `/src/data/marketing.json`

**Action**:
1. Determine which is canonical (check timestamps, content completeness)
2. Merge/consolidate into `marketing-management.json`
3. Delete redundant files

---

## 📋 Low Priority — Nice to Have

### 6. Clean Up Root `/archive` Folder

**Check if used**:
```bash
ls -la archive/
```

If empty or contains nothing critical:
```bash
rm -rf archive/
```

**Why**: Unused directories add confusion. Git history is the real archive.

---

### 7. Standardise Icon Reference File

**Current**: `iconoir-list.md` in `/dev-docs`

**Consider**: Move to `/dev-docs/references/` if you add more reference files (typography scales, colour tokens, etc.)

---

## 🎯 Proposed Final Structure (After All Changes)

```
/
├── index.html
├── design-system.html
├── energy-tracker.html
├── figma-plugin.html
├── marketing-management.html
├── cv-silvia-travieso.html
├── package.json
├── vite.config.js
├── README.md
│
├── /public/                         # Static assets (served as-is)
│   ├── favicon.png
│   ├── logo-filled.svg
│   ├── logo-outlined.svg
│   ├── cv-silvia-travieso-2025.pdf
│   │
│   ├── /data/                       # All project JSON (unified)
│   │   ├── projects.json
│   │   ├── design-system.json
│   │   ├── microsite.json
│   │   ├── marketing-management.json
│   │   ├── energy-tracker.json
│   │   ├── figma-plugin.json
│   │   └── ui-blocks-examples.json
│   │
│   └── /[project-images]/
│       ├── ds/
│       ├── microsite/
│       ├── mkm/
│       └── plugin/
│
├── /src/                            # Source code
│   ├── main.js
│   ├── /scss/
│   ├── /js/
│   │   ├── /modules/
│   │   ├── /utils/
│   │   ├── /archive/
│   │   ├── project-page.js
│   │   └── content-blocks-kit.js
│   │
│   └── /content/                    # Content source files
│       ├── cv-silvia-travieso.md
│       └── /case-study-plans/
│
├── /scripts/                        # Build scripts
│   ├── README.md
│   ├── generate-ats-content.js
│   └── verify-ats.js
│
├── /docs/                           # Recruiter-facing documentation
│   ├── README.md
│   ├── ANIMATION_DECISIONS.md
│   ├── PERFORMANCE.md
│   ├── SCREENSHOTS.md
│   ├── FOLDER_STRUCTURE_ANALYSIS.md
│   ├── ORGANISATION_RECOMMENDATIONS.md  ← You are here
│   └── /screenshots/
│
├── /dev-docs/                       # Developer documentation
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
├── /dev-tools/                      # Development-only tools
│   ├── content-blocks-kit.html
│   └── project-template.html
│
└── /dist/                           # Build output (gitignored)
```

---

## Implementation Order

**Week 1 (Low Risk)**:
1. ✅ Delete backups
2. ✅ Move logos to `/public`
3. ✅ Remove duplicate favicon
4. Move dev tools to `/dev-tools/`
5. Rename `/Markdowns` → `/dev-docs`
6. Create `/dev-docs/README.md`
7. Move content source files to `/src/content/`

**Week 2 (Requires Testing)**:
1. Consolidate JSON data in `/public/data/`
2. Update JavaScript imports
3. Test dynamic content loading
4. Merge/consolidate marketing JSON files
5. Rename mystery PNG file

**Week 3 (Polish)**:
1. Delete unused `/archive` if empty
2. Update main README with new folder references
3. Add `.gitignore` entries if needed

---

## Questions to Answer Before Proceeding

1. **Marketing JSON files**: Which is the canonical version — `mkm-content.json`, `mkm-ds.json`, `mkm-new.json`, or `/src/data/marketing.json`?

2. **Mystery PNG**: What is `/public/17b81efd1707...png` used for? Can it be renamed?

3. **Empty archive**: Is root `/archive/` folder used for anything?

4. **Projects index**: Should `projects.json` stay in `/src/data` (build-time) or move to `/public/data` (runtime)? Currently it's imported, but could be fetched.

---

## Main README Update Needed

Once `/dev-docs` is created, update the main README:

```markdown
**Documentation**:
- [`/docs`](./docs) — Recruiter-facing technical documentation (animation decisions, performance metrics)
- [`/dev-docs`](./dev-docs) — Developer notes and implementation guides
```

---

Want me to implement the high-priority changes (move dev tools, rename Markdowns, create /src/content)?
