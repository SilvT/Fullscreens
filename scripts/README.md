# ATS-Optimized Content Generation

This system generates recruiter-friendly, machine-readable HTML content from your project JSON files to ensure your portfolio is discoverable by Applicant Tracking Systems (ATS), recruiter tools, and search engines.

## 🎯 What Problem Does This Solve?

**Before:** Your portfolio was dynamically generated with JavaScript. ATS systems and recruiters saw this:
```html
<div id="projects-container"></div>  <!-- Empty! -->
```

**After:** ATS systems now see semantic HTML with all your projects, skills, metrics, and achievements:
```html
<article class="project-summary">
  <h2>Marketing Platform CRM - Product Design Lead</h2>
  <p>Led design for enterprise platform...</p>
  <ul>
    <li><strong>30%</strong> inbox reduction</li>
    <li><strong>50%</strong> time saved</li>
  </ul>
</article>
```

## ✅ What It Generates

### 1. **ATS-Optimized HTML** (Priority #1)
- Semantic HTML structure (`<article>`, `<h2>`, `<ul>`)
- Job titles in prominent positions
- Skills extracted and highlighted
- Metrics with **bold numbers**
- Action-oriented achievements
- All visible to ATS parsers

### 2. **JSON-LD Structured Data** (Smart ATS & SEO)
- Schema.org `Person` markup
- Schema.org `CreativeWork` for each project
- Skills, keywords, and metrics
- Readable by AI recruiters and modern tools

### 3. **Progressive Enhancement**
- Static HTML works without JavaScript
- Your JavaScript enhances/replaces it visually
- Best of both worlds!

## 🚀 How to Use

### Running Manually
```bash
npm run generate:ats
```

### Automatic on Build
The script runs automatically before every build:
```bash
npm run build
# Runs: prebuild → generate-ats-content.js → vite build
```

### Development
```bash
npm run dev
# Does NOT generate ATS content (for faster dev)
# Run manually if testing ATS content
```

## 📁 File Structure

```
scripts/
├── README.md                    # This file
├── ats-config.js                # Configuration (edit this!)
└── generate-ats-content.js      # Main script (don't edit unless extending)

public/data/
├── projects.json                # Your project index
├── mkm-new.json                 # Project detail files
├── mkm-ds.json
└── microsite.json

index.html                       # Gets ATS content injected here
index.html.backup                # Automatic backup
```

## ⚙️ Configuration

Edit [`scripts/ats-config.js`](./ats-config.js) to manage projects.

### Adding a New Project

```javascript
// In scripts/ats-config.js
export default {
  projects: [
    // ... existing projects ...

    // Add new project:
    {
      id: 'new-project',
      title: 'My New Project',
      jsonPath: 'public/data/new-project.json',  // Or null if inline
      indexPath: 'src/data/projects.json',
      projectKey: '5',  // Key in projects.json
      priority: 5       // Display order
    }
  ]
}
```

Then run:
```bash
npm run generate:ats
```

### Customizing ATS Optimization

```javascript
// In scripts/ats-config.js
atsOptimization: {
  emphasizeJobTitles: true,     // Repeat job titles for ATS emphasis
  highlightMetrics: true,        // Bold numbers in metrics
  extractSkills: true,           // Create dedicated skills sections
  useActionVerbs: true,          // "Led", "Designed", "Implemented"
  generateStructuredData: true,  // JSON-LD for smart tools

  // Keywords to emphasize (appear multiple times)
  keywordEmphasis: [
    'Product Design',
    'Design Systems',
    'Figma',
    // Add your target keywords
  ]
}
```

## 🔍 What Gets Extracted

The script intelligently extracts:

| From Your JSON | Becomes ATS Content |
|----------------|---------------------|
| `title` | `<h2>` heading (high SEO value) |
| `jobTitle` / `subtitle` | Job title emphasis |
| `tags` | Skills list + structured data |
| `cardMetrics` / `detailMetrics` | **Bold numbers** in lists |
| `contentBlocks` (timeline) | "Key Contributions" sections |
| `contentBlocks` (sidebar tools) | Technology skills |
| `cardOverview` | Main description |
| `storyTeaser` | Additional context |

## 📊 Generated Structured Data

### Person Schema (You)
```json
{
  "@type": "Person",
  "name": "Silvia Travieso",
  "jobTitle": "UI/UX Designer & Product Designer",
  "hasOccupation": {
    "skills": "Product Design, Design Systems, Figma..."
  },
  "knowsAbout": ["Design Systems", "Figma", "...]
}
```

### CreativeWork Schema (Each Project)
```json
{
  "@type": "CreativeWork",
  "name": "Marketing Platform CRM",
  "author": { "jobTitle": "Product Design Lead" },
  "keywords": "Product Design, Design Systems...",
  "about": [
    { "value": "30%", "description": "inbox reduction" }
  ]
}
```

## 🎨 How It Works with Your JavaScript

The generated content is **visually hidden** but **accessible to crawlers**:

```scss
// From src/scss/_ats-content.scss
.ats-content {
  position: absolute;
  left: -10000px;  // Off-screen but readable by ATS
  // NOT display:none - that would hide from ATS!
}
```

Your JavaScript sees the container and renders fancy cards. ATS systems see semantic HTML.

### No-JS Fallback
If JavaScript fails or is disabled:
```scss
.no-js .ats-content {
  position: static;  // Show the ATS content
  // Looks basic but works!
}
```

## 🧪 Testing ATS Compatibility

### 1. **View Source** (What ATS Sees)
```bash
# In browser:
View → Developer → View Source
# Look for: <div class="ats-content">
```

### 2. **Disable JavaScript**
```bash
# Chrome DevTools:
Cmd+Shift+P → "Disable JavaScript"
# Refresh page - you'll see the ATS content
```

### 3. **LinkedIn Preview Tool**
Share your URL on LinkedIn and check the preview card.

### 4. **Google Rich Results Test**
https://search.google.com/test/rich-results
Paste your URL to validate structured data.

### 5. **ATS Simulator**
Use tools like:
- Jobscan ATS Resume Checker
- Applicant Tracking System Scanners
- Save page as text-only and review

## 🔄 Workflow Examples

### Scenario 1: Content Update
```bash
# 1. Edit your JSON
vim public/data/mkm-new.json

# 2. Regenerate ATS content
npm run generate:ats

# 3. Verify
git diff index.html

# 4. Build and deploy
npm run build
git commit -am "Update project content"
git push
```

### Scenario 2: New Project
```bash
# 1. Create JSON file
public/data/new-project.json

# 2. Add to projects index
# Edit: src/data/projects.json
{
  "6": {
    "title": "New Project",
    // ... project data
  }
}

# 3. Add to ATS config
# Edit: scripts/ats-config.js
{
  id: 'new-project',
  projectKey: '6',
  // ...
}

# 4. Generate
npm run generate:ats

# 5. Deploy
npm run build && git push
```

## 🚧 Troubleshooting

### Content Not Showing
```bash
# Check if script ran
ls -la index.html.backup  # Should exist

# Check injection point
grep "projects-container" index.html
```

### Missing Project
```bash
# Run with debug (see console output)
node scripts/generate-ats-content.js

# Check config matches projects.json
cat scripts/ats-config.js
cat src/data/projects.json
```

### Skills Not Extracted
The script looks for:
- `tags` array in projects.json
- `sidebar` sections with "Tools", "Tech Stack", "Skills"
- Add these to your JSON if missing

### Structured Data Errors
```bash
# Validate JSON-LD
# Copy from View Source → <script type="application/ld+json">
# Paste into: https://validator.schema.org/
```

## 📈 Benefits by Tool Type

| Tool Type | What They See | Benefit |
|-----------|---------------|---------|
| **Basic ATS** | Semantic HTML, keywords | ✅ Parses job titles, skills, metrics |
| **Smart ATS** | HTML + JSON-LD | ✅ Rich data extraction |
| **LinkedIn Scraper** | HTML + OG tags | ✅ Nice preview cards |
| **Job Boards** | HTML content | ✅ Can import portfolio |
| **Google** | HTML + Schema.org | ✅ Better search ranking |
| **AI Recruiters** | Structured data | ✅ Can summarize your work |
| **Screen Readers** | Semantic HTML | ✅ Accessible to disabled recruiters |

## 🎓 Key Concepts

### Why Not `display: none`?
```css
/* ❌ BAD - ATS ignores this */
.hidden { display: none; }

/* ✅ GOOD - ATS can still see */
.ats-content {
  position: absolute;
  left: -10000px;
}
```

### Progressive Enhancement
```
Layer 1: Semantic HTML (ATS sees this)
Layer 2: CSS (basic styling if JS fails)
Layer 3: JavaScript (fancy interactive version)
```

### Structured Data = Machine-Readable Resume
Think of JSON-LD as your resume in a format AI can read.

## 🔮 Future Enhancements

This system is designed to grow. Future additions:

```javascript
// Potential features:
- PDF export from ATS content
- Sitemap.xml generation
- RSS feed for projects
- JSON Resume format export
- Multi-language support
- Blog post generation
```

## 🆘 Need Help?

1. **Check the config**: `scripts/ats-config.js`
2. **Run manually**: `npm run generate:ats`
3. **View output**: `View Source` in browser
4. **Check backup**: `index.html.backup`
5. **Validate**: https://validator.schema.org/

## 📝 Quick Reference

```bash
# Generate ATS content
npm run generate:ats

# Build with ATS content
npm run build

# Add new project
1. Edit scripts/ats-config.js
2. Run: npm run generate:ats

# Test ATS content
1. View Source
2. Search for "ats-content"
3. Disable JavaScript in DevTools
```

---

**Generated content is optimized for:**
- ✅ Applicant Tracking Systems (ATS)
- ✅ Recruiter browser extensions
- ✅ LinkedIn/job board scrapers
- ✅ Search engines (Google, Bing)
- ✅ AI recruiting tools
- ✅ Screen readers (accessibility)
