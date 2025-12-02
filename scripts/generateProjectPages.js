/**
 * Project Page Generator
 * Generates static HTML files for each project using the same structure as the modal
 * This creates standalone pages that can be accessed directly via URL
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import project data
const projectDataPath = path.join(__dirname, '../src/data/projects.json');
const projectData = JSON.parse(fs.readFileSync(projectDataPath, 'utf-8'));

// Project slugs mapping
const PROJECT_SLUGS = {
  '1': 'marketing-management',
  '2': 'design-system',
  '3': 'energy-tracker',
  '4': 'figma-plugin'
};

const PROJECT_ORDER = ['1', '2', '3', '4'];

/**
 * Generate HTML template for a project page
 */
function generateProjectHTML(projectId, project) {
  const slug = PROJECT_SLUGS[projectId];
  const theme = project.theme || 'blue';

  return `<!DOCTYPE html>
<html lang="en" data-project-id="${projectId}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${project.title} | Silvia Travieso - Product Designer</title>
  <meta name="description" content="${project.cardOverview || project.subtitle}">
  <meta name="keywords" content="${project.tags ? project.tags.join(', ') : ''}">

  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://silviatravieso.com/${slug}">
  <meta property="og:title" content="${project.title} - Product Design Case Study">
  <meta property="og:description" content="${project.subtitle}">
  <meta property="og:image" content="https://silviatravieso.com${project.heroImage}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${project.title} - Product Design Case Study">
  <meta name="twitter:description" content="${project.subtitle}">
  <meta name="twitter:image" content="https://silviatravieso.com${project.heroImage}">

  <!-- Canonical URL -->
  <link rel="canonical" href="https://silviatravieso.com/${slug}">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Fascinate&family=Anonymous+Pro:wght@400;700&family=Noto+Sans:wght@100..900&display=swap" rel="stylesheet">
</head>

<body class="project-page-body">

  <!-- Sticky Navigation -->
  <nav class="top-nav" role="navigation" aria-label="Main navigation">
    <div class="nav-wrapper">
      <div class="navigation">
        <a href="/" class="nav-item">Home</a>
        <a href="/#about-landing" class="nav-item">About</a>
        <a href="/#contact" class="nav-item">Contact</a>
      </div>
      <div class="logo">
        <img src="/17b81efd17076f9f44d848e6169d69edec56397d.png" alt="Silvia Travieso Logo" />
      </div>
    </div>
  </nav>

  <!-- Project Breadcrumbs Navigation (outside of case-study-page for sticky positioning) -->
  <nav class="cs-breadcrumbs cs-breadcrumbs-standalone" aria-label="Case study navigation">
    <!-- Populated by JavaScript -->
  </nav>

  <!-- Case Study Content Container -->
  <div class="case-study-page active" id="project-content" data-theme="${theme}" data-project-id="${projectId}">
    <!-- Sticky Header Container -->
    <div class="cs-sticky-header">
      <!-- Hero Section -->
      <section class="cs-hero">
        <div class="cs-hero-content">
          <div class="cs-hero-header">
            <p class="cs-hero-company"></p>
            <h1 class="cs-hero-title">Loading...</h1>
            <h2 class="cs-hero-subtitle"></h2>
          </div>
          <p class="cs-hero-overview"></p>
          <div class="cs-hero-tags"></div>
        </div>
        <div class="cs-hero-images"></div>
        <div class="cs-hero-metrics"></div>
      </section>
    </div>

    <!-- Metrics Section -->
    <section class="cs-metrics">
      <h3 class="cs-section-title">Impact</h3>
      <div class="cs-metrics-grid"></div>
    </section>

    <!-- Content Blocks Section -->
    <div class="cs-content-container"></div>
  </div>

  <!-- Project Navigation Footer -->
  <footer class="project-navigation-footer">
    <div class="project-nav-container">
      ${generateFooterNavigation(projectId)}
    </div>
  </footer>

  <script type="module" src="/src/js/project-page.js"></script>
</body>
</html>
`;
}

/**
 * Generate footer navigation HTML
 */
function generateFooterNavigation(currentProjectId) {
  const currentIndex = PROJECT_ORDER.indexOf(currentProjectId);
  const prevIndex = currentIndex === 0 ? PROJECT_ORDER.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === PROJECT_ORDER.length - 1 ? 0 : currentIndex + 1;

  const prevProjectId = PROJECT_ORDER[prevIndex];
  const nextProjectId = PROJECT_ORDER[nextIndex];

  const prevProject = projectData[prevProjectId];
  const nextProject = projectData[nextProjectId];

  const prevSlug = PROJECT_SLUGS[prevProjectId];
  const nextSlug = PROJECT_SLUGS[nextProjectId];

  return `
      <a href="/${prevSlug}" class="project-nav-link prev-project">
        <span class="nav-arrow">←</span>
        <span class="nav-label">Previous</span>
        <span class="nav-title">${prevProject.title}</span>
      </a>
      <a href="/" class="project-nav-link back-home">
        <span class="nav-label">All Projects</span>
      </a>
      <a href="/${nextSlug}" class="project-nav-link next-project">
        <span class="nav-label">Next</span>
        <span class="nav-title">${nextProject.title}</span>
        <span class="nav-arrow">→</span>
      </a>
  `;
}

/**
 * Generate all project pages
 */
function generateAllPages() {
  const outputDir = path.join(__dirname, '..');

  console.log('🚀 Generating project pages...\n');

  PROJECT_ORDER.forEach((projectId) => {
    const project = projectData[projectId];
    const slug = PROJECT_SLUGS[projectId];
    const filename = `${slug}.html`;
    const filepath = path.join(outputDir, filename);

    const html = generateProjectHTML(projectId, project);

    fs.writeFileSync(filepath, html, 'utf-8');

    console.log(`✅ Generated: ${filename}`);
    console.log(`   Title: ${project.title}`);
    console.log(`   Theme: ${project.theme || 'blue'}`);
    console.log(`   URL: /${slug}\n`);
  });

  console.log('✨ All project pages generated successfully!');
}

// Run the generator
generateAllPages();
