# Content Blocks Reference - Complete Guide

This document lists ALL available content block types you can use in your `projects.json` file. These blocks provide a flexible, structured way to build your case study content.

## Table of Contents
- [Side Navigation Control](#side-navigation-control)
- [Main Content Blocks](#main-content-blocks)
  - [Layout Blocks](#layout-blocks)
  - [Media Blocks](#media-blocks)
  - [Metrics & Data Visualization](#metrics--data-visualization)
  - [Storytelling Blocks](#storytelling-blocks)
  - [Column Layout Blocks](#column-layout-blocks)
  - [Special Blocks](#special-blocks)
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

### Best Practices

1. **Logical Grouping**: Group related content blocks under one section title rather than adding `sectionTitle` to every block
2. **Clear Names**: Use concise, descriptive titles (e.g., "The Challenge", "Discovery", "Results")
3. **Strategic Sections**: Aim for 5-8 main sections for optimal navigation experience
4. **Content Flow**: Place image grids, galleries, and supporting visuals between major sections without `sectionTitle`

---

## Main Content Blocks

These are the top-level block types used in the `contentBlocks` array of your project data.

### Layout Blocks

Standard layout blocks for structuring content and text.

#### 1. `two-column-with-sidebar`

Two-column layout with main content on the left and a sticky sidebar on the right.

**Structure:**
```json
{
  "type": "two-column-with-sidebar",
  "sectionTitle": "Optional Section Title",
  "left": [
    {
      "heading": "Section Heading",
      "text": "Plain text content (legacy)",
      "blocks": [ /* array of text blocks - see Text Block Types section */ ],
      "image": {
        "src": "/path/to/image.png",
        "alt": "Image description",
        "caption": "Optional caption",
        "hoverImage": "/path/to/hover-image.png"
      },
      "imageFull": {
        "src": "/path/to/full-width-image.png",
        "alt": "Full width image",
        "caption": "Optional caption",
        "hoverImage": "/path/to/hover-full-image.png"
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
- Optional `hoverImage` property on both `image` and `imageFull` for hover state swapping

---

#### 2. `full-width-text`

Full-width text section with heading and paragraphs.

**Structure:**
```json
{
  "type": "full-width-text",
  "sectionTitle": "Optional Section Title",
  "heading": "Section Heading",
  "text": "Paragraph 1\n\nParagraph 2\n\nParagraph 3"
}
```

**Features:**
- Full-width text block
- Automatic paragraph splitting on `\n\n`
- Optional heading
- HTML support in text

---

#### 3. `text-image-split`

50/50 split layout with text on one side and image on the other.

**Structure (with blocks):**
```json
{
  "type": "text-image-split",
  "sectionTitle": "Optional Section Title",
  "layout": "text-left",
  "heading": "Section Heading",
  "blocks": [
    {
      "type": "paragraph",
      "text": "Your content with <strong>HTML support</strong>."
    },
    {
      "type": "list",
      "style": "ul",
      "items": [
        "First item",
        "Second item",
        "Third item"
      ]
    }
  ],
  "image": "/path/to/image.png",
  "alt": "Image description",
  "caption": "Optional caption",
  "hoverImage": "/path/to/hover-image.png"
}
```

**Structure (legacy text format):**
```json
{
  "type": "text-image-split",
  "layout": "text-left",
  "heading": "Section Heading",
  "text": "Paragraph 1\n\nParagraph 2",
  "image": "/path/to/image.png",
  "alt": "Image description",
  "caption": "Optional caption",
  "hoverImage": "/path/to/hover-image.png"
}
```

**Options:**
- `layout`: `"text-left"` or `"text-right"` (default: `"text-left"`)

**Features:**
- 50/50 split between text and image
- Configurable layout direction
- Supports both `blocks` array (recommended) and `text` field (legacy)
- `blocks` array allows structured content (see Text Block Types section)
- Automatic paragraph splitting when using `text` field
- Optional image caption
- Optional `hoverImage` property for hover state swapping

---

#### 4. `container`

A flexible container that can hold any text blocks. Use it as a generic wrapper or to create custom layouts.

**Structure:**
```json
{
  "type": "container",
  "sectionTitle": "Optional Section Title",
  "class": "optional-css-class",
  "heading": "Optional Container Heading",
  "blocks": [
    {
      "type": "paragraph",
      "text": "Any content here with <strong>full HTML support</strong>."
    },
    {
      "type": "heading",
      "level": "h4",
      "text": "Subheading"
    },
    {
      "type": "list",
      "style": "ol",
      "items": [
        "First item",
        "Second item",
        "Third item"
      ]
    }
  ]
}
```

**Features:**
- Flexible generic container
- Optional custom CSS class
- Optional heading
- Supports all text block types (see Text Block Types section)
- Full HTML support in all text content
- Can be used for custom layouts with inline HTML

---

### Media Blocks

Blocks for displaying images, galleries, and visual content.

#### 5. `full-width-image`

Full-width image block with optional caption and hover state.

**Structure:**
```json
{
  "type": "full-width-image",
  "sectionTitle": "Optional Section Title",
  "src": "/path/to/image.png",
  "alt": "Image description",
  "caption": "Optional image caption",
  "hoverImage": "/path/to/hover-image.png"
}
```

**Features:**
- Image spans the full content width
- Optional caption below the image
- Optional `hoverImage` property for hover state swapping
- Automatic lightbox on click

---

#### 6. `image-grid`

Grid layout for multiple images with optional hover states.

**Structure:**
```json
{
  "type": "image-grid",
  "sectionTitle": "Optional Section Title",
  "columns": 2,
  "images": [
    {
      "src": "/path/to/image1.png",
      "alt": "Image 1 description",
      "caption": "Optional caption",
      "hoverImage": "/path/to/image1-hover.png"
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
- Optional `hoverImage` property per image for hover state swapping
- Automatic video detection (.mov, .mp4, .webm, .ogg) with auto-play/loop
- Lightbox support for all images

---

#### 7. `gallery`

Gallery block for showcasing multiple images.

**Structure:**
```json
{
  "type": "gallery",
  "sectionTitle": "Optional Section Title",
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
- Lightbox navigation between images

---

#### 8. `image-text-columns`

**NOTE:** This block type exists in the codebase but may not be fully documented. Use with caution or prefer other layout blocks.

---

#### 9. `image-carousel`

**NOTE:** This block type exists in the codebase but may not be fully documented. Use with caution or prefer other carousel blocks.

---

### Metrics & Data Visualization

Blocks for displaying metrics, data, and quantitative results.

#### 10. `metrics-inline`

Inline metrics cards with icons, values, and labels.

**Structure:**
```json
{
  "type": "metrics-inline",
  "sectionTitle": "Optional Section Title",
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

#### 11. `metrics-grid`

Grid layout for metrics organized by categories.

**Structure:**
```json
{
  "type": "metrics-grid",
  "sectionTitle": "Optional Section Title",
  "heading": "Project Metrics",
  "metrics": [
    {
      "title": "Design Deliverables",
      "items": [
        "200+ components",
        "400+ design tokens",
        "50+ screen templates"
      ]
    },
    {
      "title": "Impact",
      "items": [
        "70% faster iteration",
        "90% fewer QA cycles",
        "50% reduced development time"
      ]
    }
  ]
}
```

**Features:**
- Categorized metrics with title headers
- Multiple items per category
- Each item becomes a metric card
- Grid layout

---

#### 12. `content-carousel`

Horizontal carousel with navigation for cycling through content slides with metrics.

**Structure:**
```json
{
  "type": "content-carousel",
  "sectionTitle": "Optional Section Title",
  "heading": "Carousel Heading",
  "class": "optional-css-class",
  "items": [
    {
      "title": "Slide 1 Title",
      "items": [
        "Metric 1",
        "Metric 2",
        "Metric 3"
      ]
    },
    {
      "title": "Slide 2 Title",
      "items": [
        {
          "icon": "iconoir:rocket",
          "value": "70%",
          "label": "improvement"
        }
      ]
    }
  ]
}
```

**Features:**
- Horizontal scrolling carousel
- Multiple slides with individual titles
- Supports both simple text items and full metric card objects
- Navigation indicators (dots)
- Click indicators to navigate between slides
- Optional custom CSS class
- Special `stacked-metrics` class for stacked card visualization

---

### Storytelling Blocks

Specialized blocks for narrative-driven case studies that engage readers and highlight key moments.

#### 13. `story-hook`

Opening engagement moment - captures attention with a quote or compelling statement.

**Structure:**
```json
{
  "type": "story-hook",
  "sectionTitle": "Optional Section Title",
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

#### 14. `timeline-process`

Phase-based storytelling showing project evolution over time with horizontal stacking cards.

**Structure:**
```json
{
  "type": "timeline-process",
  "sectionTitle": "Optional Section Title",
  "heading": "The Journey",
  "phases": [
    {
      "sneak": 1,
      "title": "Foundation Phase",
      "period": "Months 1-3",
      "icon": "iconoir:learning",
      "content": [
        {
          "type": "paragraph",
          "text": "Context paragraph for this phase."
        },
        {
          "type": "heading",
          "text": "Key Activities"
        },
        {
          "type": "list",
          "items": [
            "Market research and competitor analysis",
            "Building information architecture",
            "Started documentation practice"
          ]
        },
        {
          "type": "outcome",
          "text": "<strong>Outcome:</strong> Learned the domain and set foundations"
        },
        {
          "type": "highlights",
          "items": [
            "First major milestone",
            "Partnership established"
          ]
        },
        {
          "type": "learnings",
          "text": "<strong>Key Learning:</strong> Early validation saves time"
        }
      ]
    },
    {
      "sneak": 2,
      "title": "Execution",
      "period": "Months 4-8",
      "icon": "iconoir:rocket",
      "content": [
        {
          "type": "paragraph",
          "text": "Built component library from scratch."
        }
      ]
    }
  ]
}
```

**Features:**
- Visual timeline with horizontally stacked, overlapping phase cards
- Progressive overlap: each phase overlaps more than the previous one
- `sneak` property: Shows phase number (1, 2, 3...) prominently on card
- Icons for each phase (using icon system)
- Period labels (e.g., "Months 1-3")
- Interactive: Hover to expand phase details
- Minimized state (`.min`): Only shows sneak number
- Active state: Full content visible
- Content types supported:
  - `paragraph` - Regular text content
  - `heading` - Section headings within phase
  - `list` - Bullet point lists
  - `outcome` - Highlighted outcome statement (blue text)
  - `highlights` - Alternative bullet point style
  - `learnings` - Learnings statement (blue text)
- Great for showing iterative progress

---

#### 15. `timeline-horizontal-scroll`

Horizontal scroll-hijacking timeline for immersive storytelling. As users scroll vertically, the timeline advances horizontally through phases.

**Structure:**
```json
{
  "type": "timeline-horizontal-scroll",
  "sectionTitle": "The Journey",
  "heading": "Project Evolution",
  "phases": [
    {
      "title": "Foundation, Discovery & Early Chaos",
      "period": "Months 1-3",
      "icon": "iconoir:learning",
      "context": "Seven months in, I found myself presenting product architecture to engineers...",
      "content": [
        {
          "type": "heading",
          "text": "The Challenge"
        },
        {
          "type": "highlights",
          "items": [
            "Competitor research (self-driven + Marketing Lead)",
            "<b>Month 2-3:</b> Pulled off for urgent 2-week tablet app",
            "Information architecture for 4 data sources"
          ]
        }
      ],
      "insight": {
        "icon": "iconoir:chat-bubble",
        "text": "Core structure validated. Look & Feel approved. Frontend brought in"
      },
      "learning": {
        "text": "<b>Key Learning:</b> Partnership, Early validation and open communication"
      }
    }
  ]
}
```

**Features:**
- Vertical scroll controls horizontal timeline progression
- Phase tabs at top with customizable icons
- Progress bar showing current position
- Each phase includes:
  - Customizable icon (`icon` property)
  - Title and period
  - Optional context paragraph
  - Flexible content structure (headings, paragraphs, highlights)
  - Bottom insight box with customizable icon (`insight.icon`)
  - Optional learning sidebar
- Smooth transitions between phases
- Sticky container that stays in viewport while scrolling
- Click tabs to jump to specific phases

**Content Types Supported in `content` Array:**
- `heading` - Section heading within a phase
- `paragraph` - Regular paragraph text
- `highlights` - Bulleted list of key points

---

#### 16. `timeline`

Modern timeline rendering using the new timeline system.

**Structure:**
```json
{
  "type": "timeline",
  "sectionTitle": "Optional Section Title",
  "sections": [
    {
      "title": "Phase 1",
      "content": "Phase content..."
    }
  ]
}
```

**Features:**
- Uses the new timeline renderer module
- Modern timeline visualization
- Part of the updated timeline system

**NOTE:** This uses `renderTimelineBlock` which delegates to the modern timeline renderer. See `case-study-new.js` and `timelineRenderer.js` for implementation details.

---

#### 17. `time-carousel`

Time-based carousel for sequential content.

**NOTE:** This block type exists in the codebase. Implementation details may vary. Check the renderer function for exact structure.

---

#### 18. `before-after-comparison`

Side-by-side impact visualization showing transformation.

**Structure:**
```json
{
  "type": "before-after-comparison",
  "sectionTitle": "Optional Section Title",
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
- Images open in lightbox

---

#### 19. `key-insight`

Highlighted callout for important learnings, decisions, or turning points.

**Structure:**
```json
{
  "type": "key-insight",
  "sectionTitle": "Optional Section Title",
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

### Column Layout Blocks

Flexible column-based layouts for structured content presentation.

#### 20. `two-column`

Basic two-column layout.

**NOTE:** This block type exists in the codebase. May be similar to `two-column-text`. Check renderer for exact structure.

---

#### 21. `two-column-text`

A simple two-column text layout without a sidebar. Perfect for side-by-side comparisons or parallel content.

**Structure:**
```json
{
  "type": "two-column-text",
  "sectionTitle": "Optional Section Title",
  "columns": [
    {
      "heading": "Left Column Heading",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Your content here with <strong>HTML support</strong>."
        },
        {
          "type": "heading",
          "level": "h4",
          "text": "Subheading"
        },
        {
          "type": "list",
          "style": "ul",
          "items": [
            "First item",
            "Second item with <em>HTML</em>",
            "Third item"
          ]
        }
      ]
    },
    {
      "heading": "Right Column Heading",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Right column content."
        }
      ]
    }
  ]
}
```

**Features:**
- Two equal-width columns without sidebar
- Each column has its own heading
- Supports all text block types (see Text Block Types section)
- Full HTML support in all text content
- Responsive: stacks on mobile

---

#### 22. `three-column-text`

A three-column text layout. Great for showcasing multiple aspects or comparisons.

**Structure:**
```json
{
  "type": "three-column-text",
  "sectionTitle": "Optional Section Title",
  "columns": [
    {
      "heading": "Column 1",
      "blocks": [
        {
          "type": "paragraph",
          "text": "First column content with <strong>HTML</strong>."
        }
      ]
    },
    {
      "heading": "Column 2",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Second column content."
        }
      ]
    },
    {
      "heading": "Column 3",
      "blocks": [
        {
          "type": "paragraph",
          "text": "Third column content."
        }
      ]
    }
  ]
}
```

**Features:**
- Three equal-width columns
- Each column has its own heading
- Supports all text block types (see Text Block Types section)
- Full HTML support in all text content
- Responsive: stacks on tablet/mobile

---

### Special Blocks

#### 23. `heading`

Standalone heading block for section titles.

**Structure:**
```json
{
  "type": "heading",
  "level": "h2",
  "text": "Section Title"
}
```

**Options:**
- `level`: `"h1"`, `"h2"`, `"h3"`, `"h4"`, `"h5"`, `"h6"` (default: `"h2"`)

---

#### 24. `paragraph`

Standalone paragraph block.

**Structure:**
```json
{
  "type": "paragraph",
  "text": "Your paragraph text with <strong>HTML support</strong>.",
  "class": "optional-css-class"
}
```

**Features:**
- Full HTML support
- Optional custom CSS class
- Special `callout` class for highlighted sections

---

#### 25. `list`

Standalone list block.

**Structure:**
```json
{
  "type": "list",
  "style": "ul",
  "items": [
    "First item",
    "Second item with <strong>HTML</strong>",
    "Third item"
  ]
}
```

**Options:**
- `style`: `"ul"` (bullets) or `"ol"` (numbers)

---

#### 26. `section`

Generic section wrapper.

**NOTE:** This block type exists in the codebase. Use as a generic wrapper for grouping content.

---

## Text Block Types (for nested content)

These block types are used within the `blocks` array of layout blocks like `two-column-with-sidebar`, `two-column-text`, `three-column-text`, `container`, `text-image-split`, and `timeline-process` phases.

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

Paragraph element with full HTML support and optional custom class.

**Structure:**
```json
{
  "type": "paragraph",
  "text": "Text content with <strong>full HTML support</strong>",
  "class": "optional-css-class"
}
```

**Special Classes:**
- `"callout"`: Creates a highlighted callout box with visual emphasis

**Examples:**

Basic paragraph:
```json
{
  "type": "paragraph",
  "text": "Your text with <strong>bold</strong> and <em>italic</em> formatting."
}
```

Callout paragraph:
```json
{
  "type": "paragraph",
  "class": "callout",
  "text": "💡 <strong>Important insight:</strong> This creates a highlighted section."
}
```

**Features:**
- Full HTML support in the `text` field
- Supports `<strong>`, `<em>`, `<a>`, `<br>`, `<code>`, `<div>`, `<span>`, and more
- Custom CSS classes for styling
- Special `callout` class for emphasis

---

### 3. `list`

Ordered or unordered list with full HTML support in items.

**Structure:**
```json
{
  "type": "list",
  "style": "ul",
  "items": [
    "First item",
    "Second item with <strong>HTML formatting</strong>",
    "Third item with <em>emphasis</em>"
  ]
}
```

**Options:**
- `style`: `"ul"` (unordered/bullets) or `"ol"` (ordered/numbered) - default: `"ul"`
- `items`: Array of list item strings with full HTML support

**Features:**
- Full HTML support in all list items
- Both ordered and unordered list styles
- Perfect for feature lists, requirements, steps, or highlights

---

### 4. `outcome`

Special paragraph type for highlighting phase outcomes (used in timeline-process).

**Structure:**
```json
{
  "type": "outcome",
  "text": "<strong>Outcome:</strong> This was the result of this phase."
}
```

**Features:**
- Styled differently from regular paragraphs (blue text)
- Used specifically in `timeline-process` phases
- Full HTML support

---

### 5. `highlights`

Alternative bullet list style for highlighting key points (used in timeline-process and timeline-horizontal-scroll).

**Structure:**
```json
{
  "type": "highlights",
  "items": [
    "Key point 1",
    "Key point 2 with <strong>HTML</strong>",
    "Key point 3"
  ]
}
```

**Features:**
- Special styling for timeline phases
- Full HTML support in items
- Used in `timeline-process` and `timeline-horizontal-scroll`

---

### 6. `learnings`

Special paragraph type for key learnings (used in timeline-process).

**Structure:**
```json
{
  "type": "learnings",
  "text": "<strong>Key Learning:</strong> This is what we learned."
}
```

**Features:**
- Styled differently from regular paragraphs (blue text)
- Used specifically in `timeline-process` phases
- Full HTML support

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

**Where icons are used:**
- `metrics-inline` - metric cards
- `content-carousel` - metric cards in slides
- `timeline-process` - phase markers
- `timeline-horizontal-scroll` - phase tabs and insight boxes
- `key-insight` - callout icon

---

## Complete Examples

### Example 1: Complete Narrative-Driven Case Study

A full case study structure using storytelling blocks:

```json
{
  "contentBlocks": [
    {
      "type": "story-hook",
      "sectionTitle": "The Story",
      "quote": "How did I get here? This wasn't in the job description.",
      "context": "Seven months into my first corporate design role, I found myself presenting a design system to engineers."
    },
    {
      "type": "before-after-comparison",
      "sectionTitle": "The Challenge",
      "heading": "From Chaos to Clarity",
      "before": {
        "label": "The Problem",
        "items": [
          "Manual Excel tracking",
          "6+ fragmented lead sources",
          "No design standards"
        ]
      },
      "after": {
        "label": "The Solution",
        "items": [
          "Unified CRM platform",
          "400+ design tokens",
          "90% fewer QA cycles"
        ]
      }
    },
    {
      "type": "timeline-process",
      "sectionTitle": "The Journey",
      "heading": "Project Evolution",
      "phases": [
        {
          "sneak": 1,
          "title": "Foundation Phase",
          "period": "Months 1-3",
          "icon": "iconoir:learning",
          "content": [
            {
              "type": "paragraph",
              "text": "Started with research and domain learning."
            },
            {
              "type": "list",
              "items": [
                "Market research",
                "IA development",
                "Early prototypes"
              ]
            },
            {
              "type": "outcome",
              "text": "<strong>Outcome:</strong> Validated approach with stakeholders"
            }
          ]
        },
        {
          "sneak": 2,
          "title": "Execution",
          "period": "Months 4-8",
          "icon": "iconoir:rocket",
          "content": [
            {
              "type": "paragraph",
              "text": "Built component library from scratch."
            }
          ]
        }
      ]
    },
    {
      "type": "key-insight",
      "sectionTitle": "Key Decision",
      "icon": "iconoir:light-bulb",
      "title": "Show, Don't Tell",
      "insight": "CEO denied design system proposal. Built it anyway.",
      "result": "15 months later: company-wide adoption, Design Ops team created."
    },
    {
      "type": "metrics-inline",
      "sectionTitle": "Impact",
      "heading": "Results",
      "metrics": [
        {
          "icon": "iconoir:rocket",
          "value": "70%",
          "label": "faster iteration"
        },
        {
          "icon": "iconoir:check-circle",
          "value": "90%",
          "label": "fewer QA cycles"
        }
      ]
    },
    {
      "type": "image-grid",
      "columns": 3,
      "images": [
        {"src": "/assets/screen1.png", "alt": "Screen 1"},
        {"src": "/assets/screen2.png", "alt": "Screen 2"},
        {"src": "/assets/screen3.png", "alt": "Screen 3"}
      ]
    }
  ]
}
```

---

### Example 2: Content Carousel with Metrics

```json
{
  "type": "content-carousel",
  "heading": "Design Deliverables",
  "class": "stacked-metrics",
  "items": [
    {
      "title": "Component Library",
      "items": [
        "200+ components",
        "400+ design tokens",
        "50+ screen templates"
      ]
    },
    {
      "title": "Impact Metrics",
      "items": [
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
    }
  ]
}
```

---

## HTML Support in Text Content

All text fields across all block types support full HTML formatting:

- `<strong>Bold text</strong>`
- `<em>Italic text</em>`
- `<a href="#">Links</a>`
- `<br>` for line breaks
- `<code>Inline code</code>`
- Custom `<div>` and `<span>` with inline styles

This applies to:
- All text blocks (`paragraph`, `heading`, `list` items, `outcome`, `highlights`, `learnings`)
- Column layout blocks (`two-column-text`, `three-column-text`, `container`)
- Timeline content blocks
- Legacy `text` fields in `two-column-with-sidebar`

---

## Responsive Design

All blocks are fully responsive:

- **Desktop**: Shows columns side by side, full layouts
- **Tablet**: Two columns side by side (three-column becomes stacked)
- **Mobile**: All columns stack vertically, simplified layouts

---

## Tips & Best Practices

1. **HTML Support**: All text content supports full HTML formatting. Use `<strong>`, `<em>`, `<br>`, and other HTML tags directly.

2. **Callout Class**: Use `"class": "callout"` on paragraph blocks to create highlighted callout boxes.

3. **Choosing Column Layouts**:
   - Use `two-column-with-sidebar` for main content + sticky reference info
   - Use `two-column-text` for equal-width comparisons
   - Use `three-column-text` for feature showcases
   - Use `container` for flexible custom layouts

4. **Section Navigation**: Only add `sectionTitle` to major content sections (5-8 total). Don't add it to every block.

5. **Storytelling Flow**: Start with `story-hook`, use `before-after-comparison` for impact, `timeline-process` for journey, `key-insight` for key moments.

6. **Hover Images**: Add `hoverImage` to any image to show before/after, active states, or animations.

7. **Video Support**: `image-grid` automatically detects and plays video files (.mov, .mp4, .webm, .ogg).

8. **Lightbox**: All images automatically open in lightbox with navigation.

9. **Icon Libraries**:
   - Iconoir: https://iconoir.com/
   - Phosphor: https://phosphoricons.com/

10. **Timeline Process**: Use `sneak` property (1, 2, 3...) to show phase numbers. Cards stack horizontally with progressive overlap.

11. **Content Carousel**: Use `class: "stacked-metrics"` for stacked card visualization with rotation effect.

12. **Lazy Loading**: Split large case studies using `contentFile` property to load content from separate JSON.

---

## File Location Reference

This block system is implemented in:
- **JSON Data**: `src/data/projects.json` and `public/data/*.json`
- **Main Renderer**: `src/js/modules/caseStudy.js`
- **Timeline Renderer**: `src/js/modules/case-study-new.js`, `src/js/modules/timelineRenderer.js`
- **Styles**: `src/scss/_project-navigation.scss`, `src/scss/_timeline.scss`

---

## Block Type Quick Reference

| Block Type | Purpose | Key Features |
|------------|---------|--------------|
| `two-column-with-sidebar` | Main layout with sidebar | Sections, images, sticky sidebar |
| `full-width-text` | Full-width text section | Auto paragraph splitting |
| `text-image-split` | 50/50 text + image | Configurable layout direction |
| `container` | Flexible wrapper | Custom classes, generic |
| `full-width-image` | Full-width image | Caption, hover state |
| `image-grid` | Image gallery grid | Configurable columns, videos |
| `gallery` | Simple image gallery | Array of image paths |
| `metrics-inline` | Metric cards | Icons, values, labels |
| `metrics-grid` | Categorized metrics | Grouped by category |
| `content-carousel` | Metrics carousel | Slides with navigation |
| `story-hook` | Opening quote | Engagement moment |
| `timeline-process` | Stacked phase cards | Horizontal overlap, interactive |
| `timeline-horizontal-scroll` | Scroll-hijacking timeline | Immersive experience |
| `timeline` | Modern timeline | New timeline system |
| `before-after-comparison` | Side-by-side comparison | Impact visualization |
| `key-insight` | Highlighted callout | Important moments |
| `two-column-text` | Equal columns | Comparisons, parallel content |
| `three-column-text` | Three columns | Features, principles |

---

**Last Updated**: December 2024
