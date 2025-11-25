# Content Blocks Reference

This document lists all available content block types you can use in your `projects.json` file. These blocks provide a flexible, structured way to build your case study content.

## Table of Contents
- [Side Navigation Control](#side-navigation-control)
- [Main Content Blocks](#main-content-blocks)
  - [Layout Blocks](#layout-blocks)
  - [Storytelling Blocks](#storytelling-blocks)
- [Text Block Types (for nested content)](#text-block-types-for-nested-content)
- [Icon System](#icon-system)
- [Complete Examples](#complete-examples)

---

## Side Navigation Control

Case studies include a fixed side navigation that shows numbered sections (01, 02, 03...). You control which blocks appear in this navigation using the `sectionTitle` property.

### How It Works

**With `sectionTitle`**: Block becomes a navigable section
```json
{
  "type": "before-after-comparison",
  "sectionTitle": "The Challenge",
  "heading": "From Manual Chaos to Unified Platform",
  ...
}
```

**Without `sectionTitle`**: Block is not included in navigation
```json
{
  "type": "image-grid",
  "columns": 3,
  "images": [...]
}
```

### Navigation Structure

The side navigation always includes:
1. **Section 01: Impact Metrics** (automatic - the metrics section)
2. **Sections 02+**: Only blocks with `sectionTitle` property

### User Experience

- **Numbers**: Display as "01", "02", "03", etc.
- **Tooltips**: Hovering over numbers shows the section title
- **Click behavior**: Smooth scroll to that section
- **Active indicator**: Animated line showing current section
- **Visibility**: Only shows after user scrolls past hero section
- **Mobile**: Hidden on mobile devices

### Example Navigation Setup

```json
{
  "contentBlocks": [
    {
      "type": "story-hook",
      "sectionTitle": "The Story",
      "quote": "How did I get here?..."
    },
    {
      "type": "before-after-comparison",
      "sectionTitle": "The Challenge",
      "heading": "From Manual Chaos to Unified Platform"
    },
    {
      "type": "two-column-with-sidebar",
      "sectionTitle": "Discovery & Constraints",
      "left": [...]
    },
    {
      "type": "image-grid",
      "columns": 3,
      "images": [...]
    },
    {
      "type": "timeline-process",
      "sectionTitle": "The Process",
      "heading": "The Journey"
    },
    {
      "type": "key-insight",
      "sectionTitle": "Key Decisions",
      "icon": "iconoir:light-bulb"
    },
    {
      "type": "metrics-inline",
      "sectionTitle": "Results & Impact",
      "heading": "The Results"
    },
    {
      "type": "image-grid",
      "sectionTitle": "Final Designs",
      "columns": 3
    }
  ]
}
```

**This creates navigation:**
- 01: Impact Metrics
- 02: The Story
- 03: The Challenge
- 04: Discovery & Constraints
- 05: The Process (image-grid without sectionTitle is skipped)
- 06: Key Decisions
- 07: Results & Impact
- 08: Final Designs

### Best Practices

1. **Logical Grouping**: Group related content blocks under one section title rather than adding `sectionTitle` to every block
2. **Clear Names**: Use concise, descriptive titles (e.g., "The Challenge", "Discovery", "Results")
3. **Strategic Sections**: Aim for 5-8 main sections for optimal navigation experience
4. **Content Flow**: Place image grids, galleries, and supporting visuals between major sections without `sectionTitle`

---

## Main Content Blocks

These are the top-level block types used in the `contentBlocks` array of your project data.

### Layout Blocks

Standard layout blocks for structuring content and media.

### 1. `two-column-with-sidebar`

Two-column layout with main content on the left and a sticky sidebar on the right.

**Structure:**
```json
{
  "type": "two-column-with-sidebar",
  "left": [
    {
      "heading": "Section Heading",
      "text": "Plain text content (legacy)",
      "blocks": [ /* array of text blocks - see Text Block Types section */ ],
      "image": {
        "src": "/path/to/image.png",
        "alt": "Image description",
        "caption": "Optional caption"
      },
      "imageFull": {
        "src": "/path/to/full-width-image.png",
        "alt": "Full width image",
        "caption": "Optional caption"
      }
    }
  ],
  "sidebar": {
    "Technical Details": [
      "Item 1",
      "Item 2",
      "Key: Value"
    ],
    "Role & Timeline": [
      "Product Designer",
      "2024 - 2025"
    ]
  }
}
```

**Features:**
- Main content column with multiple sections
- Each section can have a heading, text/blocks, and optional images
- Sidebar with categorized lists (key-value pairs or simple items)
- `blocks` array allows structured content (see Text Block Types below)
- `text` field supports HTML (for backwards compatibility)
- `image` renders within the column width
- `imageFull` spans the full content width

---

### 2. `full-width-image`

Full-width image block with optional caption.

**Structure:**
```json
{
  "type": "full-width-image",
  "src": "/path/to/image.png",
  "alt": "Image description",
  "caption": "Optional image caption"
}
```

**Features:**
- Image spans the full content width
- Optional caption below the image

---

### 3. `image-grid`

Grid layout for multiple images.

**Structure:**
```json
{
  "type": "image-grid",
  "columns": 2,
  "images": [
    {
      "src": "/path/to/image1.png",
      "alt": "Image 1 description",
      "caption": "Optional caption"
    },
    {
      "src": "/path/to/image2.png",
      "alt": "Image 2 description",
      "caption": "Optional caption"
    }
  ]
}
```

**Features:**
- Configurable column count (default: 2)
- Multiple images with individual captions
- Responsive grid layout

---

### 4. `gallery`

Gallery block for showcasing multiple images.

**Structure:**
```json
{
  "type": "gallery",
  "images": [
    "/path/to/image1.png",
    "/path/to/image2.png",
    "/path/to/image3.png"
  ]
}
```

**Features:**
- Automatic "Gallery" heading
- Simple array of image paths
- Grid layout for images

---

### 5. `metrics-inline`

Inline metrics cards with icons, values, and labels.

**Structure:**
```json
{
  "type": "metrics-inline",
  "heading": "The Results",
  "metrics": [
    {
      "icon": "iconoir:rocket",
      "value": "70%",
      "label": "faster design iteration"
    },
    {
      "icon": "ph:check-circle",
      "value": "90%",
      "label": "implementation accuracy"
    }
  ]
}
```

**Features:**
- Optional heading for the metrics section
- Icon support (Iconoir default, Phosphor Light with `ph:` prefix)
- Decorative borders and corner dots
- Grid layout for metric cards

---

### 6. `full-width-text`

Full-width text section with heading and paragraphs.

**Structure:**
```json
{
  "type": "full-width-text",
  "heading": "Section Heading",
  "text": "Paragraph 1\n\nParagraph 2\n\nParagraph 3"
}
```

**Features:**
- Full-width text block
- Automatic paragraph splitting on `\n\n`
- Optional heading

---

### 7. `text-image-split`

50/50 split layout with text on one side and image on the other.

**Structure:**
```json
{
  "type": "text-image-split",
  "layout": "text-left",
  "heading": "Section Heading",
  "text": "Paragraph 1\n\nParagraph 2",
  "image": "/path/to/image.png",
  "alt": "Image description",
  "caption": "Optional caption"
}
```

**Options:**
- `layout`: `"text-left"` or `"text-right"` (default: `"text-left"`)

**Features:**
- 50/50 split between text and image
- Configurable layout direction
- Automatic paragraph splitting
- Optional image caption

---

### Storytelling Blocks

Specialized blocks for narrative-driven case studies that engage readers and highlight key moments.

### 8. `story-hook`

Opening engagement moment - captures attention with a quote or compelling statement.

**Structure:**
```json
{
  "type": "story-hook",
  "quote": "How did I get here? This wasn't in the job description.",
  "context": "Seven months into my first corporate design role, I found myself standing in front of a room full of engineers.",
  "image": "/path/to/image.jpg",
  "imageAlt": "Presenting to engineers"
}
```

**Features:**
- Large, styled blockquote for immediate engagement
- Optional context paragraph for setup
- Optional supporting image
- Perfect for opening case studies with a compelling moment

---

### 9. `timeline-process`

Phase-based storytelling showing project evolution over time.

**Structure:**
```json
{
  "type": "timeline-process",
  "heading": "The Journey",
  "phases": [
    {
      "title": "Foundation",
      "period": "Months 1-3",
      "icon": "iconoir:learning",
      "highlights": [
        "Market research and competitor analysis",
        "Building information architecture",
        "Started documentation practice"
      ],
      "outcome": "Learned the domain and set foundations"
    },
    {
      "title": "Execution",
      "period": "Months 4-8",
      "icon": "iconoir:rocket",
      "highlights": [
        "Built component library from scratch",
        "Implemented async collaboration system",
        "Delivered MVP features"
      ]
    }
  ]
}
```

**Features:**
- Visual timeline with phase markers
- Icons for each phase (using icon system)
- Period labels (e.g., "Months 1-3")
- Bullet-point highlights per phase
- Optional outcome/learning statement
- Great for showing iterative progress

---

### 10. `before-after-comparison`

Side-by-side impact visualization showing transformation.

**Structure:**
```json
{
  "type": "before-after-comparison",
  "heading": "From Manual Chaos to Unified Platform",
  "before": {
    "label": "The Reality I Walked Into",
    "items": [
      "Manual Excel tracking",
      "Fragmented data sources",
      "No standardization"
    ],
    "image": "/path/to/before.png",
    "imageAlt": "Before state"
  },
  "after": {
    "label": "What We Built",
    "items": [
      "Unified CRM platform",
      "Automated workflows",
      "Design system in place"
    ],
    "image": "/path/to/after.png",
    "imageAlt": "After state"
  }
}
```

**Features:**
- Two-column comparison layout
- Custom labels for before/after states
- Bullet lists highlighting key differences
- Optional images for visual contrast
- Excellent for demonstrating impact and transformation

---

### 11. `key-insight`

Highlighted callout for important learnings, decisions, or turning points.

**Structure:**
```json
{
  "type": "key-insight",
  "icon": "iconoir:light-bulb",
  "title": "Strategic Decision: Design System First",
  "insight": "Observed chaos across projects and pitched a design system approach. CEO initially denied it. My response? Do it anyway and prove the value.",
  "result": "By month 15, CEO approved expansion company-wide. Now serving multiple products with 400+ tokens."
}
```

**Features:**
- Visual callout styling to draw attention
- Icon support for visual categorization
- Title for the insight theme
- Main insight text explaining the situation/decision
- Optional result showing the outcome
- Perfect for highlighting key moments, learnings, or decisions

---

## Text Block Types (for nested content)

These block types are used within the `blocks` array of a `two-column-with-sidebar` section. They provide structured alternatives to raw HTML.

### 1. `heading`

Heading element (h1-h6).

**Structure:**
```json
{
  "type": "heading",
  "level": "h4",
  "text": "The Setup"
}
```

**Options:**
- `level`: `"h1"`, `"h2"`, `"h3"`, `"h4"`, `"h5"`, `"h6"` (default: `"h3"`)

---

### 2. `paragraph`

Paragraph element with optional custom class.

**Structure:**
```json
{
  "type": "paragraph",
  "text": "Plain text content"
}
```

**Or with HTML:**
```json
{
  "type": "paragraph",
  "html": "Text with <strong>HTML</strong> formatting",
  "class": "custom-class"
}
```

**Options:**
- `text`: Plain text content
- `html`: HTML content (use instead of `text`)
- `class`: Optional custom CSS class (default: `"cs-section-text"`)

---

### 3. `list`

Ordered or unordered list.

**Structure:**
```json
{
  "type": "list",
  "style": "ul",
  "items": [
    "1 Backend developer (my primary partner)",
    "1 Frontend developer (8 time zones away)",
    "No Design System culture"
  ]
}
```

**Options:**
- `style`: `"ul"` or `"ol"` (default: `"ul"`)
- `items`: Array of list item strings

---

## Icon System

Icons use a dual-library system with prefixes:

### Default (Iconoir)
```json
{"icon": "rocket"}
{"icon": "check-circle"}
```

### Explicit Iconoir
```json
{"icon": "iconoir:rocket"}
{"icon": "iconoir:check-circle"}
```

### Phosphor Light
```json
{"icon": "ph:rocket"}
{"icon": "phosphor:check-circle"}
```

**Available icon libraries:**
- **Iconoir** (default): https://iconoir.com/
- **Phosphor Light** (with `ph:` prefix): https://phosphoricons.com/

---

## Complete Examples

### Example 1: Basic Two-Column Layout with Structured Blocks

```json
{
  "type": "two-column-with-sidebar",
  "left": [
    {
      "heading": "Project Overview",
      "blocks": [
        {
          "type": "heading",
          "level": "h4",
          "text": "The Setup"
        },
        {
          "type": "paragraph",
          "class": "subtit",
          "text": "Greenfield product, limited team"
        },
        {
          "type": "paragraph",
          "text": "I was assigned to build this platform with:"
        },
        {
          "type": "list",
          "style": "ul",
          "items": [
            "1 Backend developer",
            "1 Frontend developer",
            "No Design System culture"
          ]
        },
        {
          "type": "paragraph",
          "html": "Between backend and myself, we became the <strong>de facto product owners</strong>."
        }
      ]
    }
  ],
  "sidebar": {
    "Technical Details": [
      "Desktop Application",
      "CRM Integration",
      "Real-time Dashboards"
    ],
    "Role & Timeline": [
      "Solo Product Designer",
      "2024 - 2025"
    ]
  }
}
```

### Example 2: Mixed Content Blocks

```json
{
  "contentBlocks": [
    {
      "type": "two-column-with-sidebar",
      "left": [
        {
          "heading": "The Challenge",
          "text": "Marketing data was scattered across departments.",
          "image": {
            "src": "/assets/diagram.png",
            "alt": "Data fragmentation",
            "caption": "Before: Scattered data"
          }
        }
      ],
      "sidebar": {
        "Impact": [
          "4 departments unified",
          "Real-time data sync"
        ]
      }
    },
    {
      "type": "full-width-image",
      "src": "/assets/dashboard.png",
      "alt": "Unified dashboard",
      "caption": "After: Centralized platform"
    },
    {
      "type": "metrics-inline",
      "metrics": [
        {
          "icon": "iconoir:rocket",
          "value": "70%",
          "label": "faster iteration"
        },
        {
          "icon": "iconoir:check-circle",
          "value": "90%",
          "label": "accuracy"
        }
      ]
    },
    {
      "type": "image-grid",
      "columns": 2,
      "images": [
        {"src": "/assets/screen1.png", "alt": "Screen 1"},
        {"src": "/assets/screen2.png", "alt": "Screen 2"}
      ]
    },
    {
      "type": "gallery",
      "images": [
        "/assets/img1.png",
        "/assets/img2.png",
        "/assets/img3.png"
      ]
    }
  ]
}
```

### Example 3: Text-Image Split

```json
{
  "type": "text-image-split",
  "layout": "text-right",
  "heading": "The Solution",
  "text": "We created a unified platform that brought everything together.\n\nThis eliminated fragmentation and improved efficiency.",
  "image": "/assets/solution.png",
  "alt": "Solution overview",
  "caption": "The final solution"
}
```

---

### Example 4: Storytelling Flow

A complete narrative-driven case study using storytelling blocks:

```json
{
  "contentBlocks": [
    {
      "type": "story-hook",
      "quote": "How did I get here? This wasn't in the job description for Mid UI Designer.",
      "context": "Seven months in, I found myself presenting a design system to a room full of engineers.",
      "image": "/assets/presenting-moment.jpg"
    },
    {
      "type": "before-after-comparison",
      "heading": "From Chaos to Clarity",
      "before": {
        "label": "The Problem",
        "items": [
          "Marketing tracking everything via manual Excel",
          "6+ fragmented lead entry points",
          "No design systems or standards"
        ],
        "image": "/assets/before-state.png"
      },
      "after": {
        "label": "The Transformation",
        "items": [
          "Unified CRM across 4 departments",
          "400+ design tokens, 200+ components",
          "90% fewer QA cycles"
        ],
        "image": "/assets/after-state.png"
      }
    },
    {
      "type": "timeline-process",
      "heading": "The Journey",
      "phases": [
        {
          "title": "Foundation",
          "period": "Months 1-3",
          "icon": "iconoir:learning",
          "highlights": [
            "Market research",
            "Learning domain terminology",
            "Building IA with Backend Lead"
          ]
        },
        {
          "title": "Execution",
          "period": "Months 4-8",
          "icon": "iconoir:rocket",
          "highlights": [
            "Building component library",
            "Implementing features",
            "Async collaboration system"
          ]
        },
        {
          "title": "Strategic Impact",
          "period": "Months 9-18",
          "icon": "iconoir:trophy",
          "highlights": [
            "Facebook API approval first try",
            "Design system company-wide adoption",
            "Presenting at developer conference"
          ]
        }
      ]
    },
    {
      "type": "key-insight",
      "icon": "iconoir:light-bulb",
      "title": "Key Learning: Show, Don't Tell",
      "insight": "CEO initially denied design system proposal. Instead of waiting for approval, I built it and proved value through 90% QA reduction.",
      "result": "By month 15, CEO approved expansion company-wide. Design Ops team created."
    }
  ]
}
```

---

## Tips

1. **Backwards Compatibility**: The `text` field with HTML still works in `two-column-with-sidebar`, but the `blocks` array is recommended for better structure.

2. **Mixing Approaches**: You can mix `text` and `blocks` - some sections can use the old `text` field while others use the new `blocks` array.

3. **Image Types**: Use `image` for inline images within a column, and `imageFull` for full-width images within a section.

4. **Video Support**: The `image-grid` block automatically detects video files (.mov, .mp4, .webm, .ogg) and renders them as auto-playing, muted, looping videos instead of static images.

5. **Lazy Loading**: You can split large case studies into separate files using the `contentFile` property in your main project data:
   ```json
   {
     "contentFile": "/data/project-content.json"
   }
   ```

6. **Sidebar Key-Value Pairs**: In the sidebar, items with `:` are automatically parsed as key-value pairs and styled differently.

7. **Icon Names**: Check the respective icon libraries' documentation for available icon names:
   - Iconoir: https://iconoir.com/
   - Phosphor: https://phosphoricons.com/

8. **Paragraphs**: In `full-width-text` and `text-image-split`, paragraphs are automatically created by splitting on `\n\n`.

9. **Storytelling Flow**: Start case studies with `story-hook`, use `before-after-comparison` to show impact, `timeline-process` to show journey, and `key-insight` to highlight important moments.

10. **Empty Sidebars**: If you don't need sidebar content in a `two-column-with-sidebar` block, pass an empty object `{}` - the sidebar will automatically hide.

11. **Section Navigation**: Use the `sectionTitle` property to control which blocks appear in the side navigation. Only add it to major content sections - not every block needs to be navigable. See [Side Navigation Control](#side-navigation-control) for details.

---

## File Location Reference

This block system is implemented in:
- **JSON Data**: [src/data/projects.json](src/data/projects.json)
- **Renderer**: [src/js/modules/caseStudy.js](src/js/modules/caseStudy.js)
- **Styles**: [src/scss/case-study.scss](src/scss/case-study.scss)
