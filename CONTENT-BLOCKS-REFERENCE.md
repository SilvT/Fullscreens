# Content Blocks Reference

This document lists all available content block types you can use in your `projects.json` file. These blocks provide a flexible, structured way to build your case study content.

## Table of Contents
- [Main Content Blocks](#main-content-blocks)
- [Text Block Types (for nested content)](#text-block-types-for-nested-content)
- [Icon System](#icon-system)
- [Complete Examples](#complete-examples)

---

## Main Content Blocks

These are the top-level block types used in the `contentBlocks` array of your project data.

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

## Tips

1. **Backwards Compatibility**: The `text` field with HTML still works in `two-column-with-sidebar`, but the `blocks` array is recommended for better structure.

2. **Mixing Approaches**: You can mix `text` and `blocks` - some sections can use the old `text` field while others use the new `blocks` array.

3. **Image Types**: Use `image` for inline images within a column, and `imageFull` for full-width images within a section.

4. **Sidebar Key-Value Pairs**: In the sidebar, items with `:` are automatically parsed as key-value pairs and styled differently.

5. **Icon Names**: Check the respective icon libraries' documentation for available icon names:
   - Iconoir: https://iconoir.com/
   - Phosphor: https://phosphoricons.com/

6. **Paragraphs**: In `full-width-text` and `text-image-split`, paragraphs are automatically created by splitting on `\n\n`.

---

## File Location Reference

This block system is implemented in:
- **JSON Data**: [src/data/projects.json](src/data/projects.json)
- **Renderer**: [src/js/modules/caseStudy.js](src/js/modules/caseStudy.js)
- **Styles**: [src/scss/case-study.scss](src/scss/case-study.scss)
