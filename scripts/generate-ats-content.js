#!/usr/bin/env node

/**
 * ATS-Optimized Content Generator
 *
 * Generates recruiter-friendly, scannable HTML content from JSON project data.
 * Priority: ATS/Recruiter readability > SEO > Visual design
 *
 * This script:
 * 1. Reads project JSON files
 * 2. Extracts key information (job titles, metrics, skills, achievements)
 * 3. Generates semantic HTML optimized for ATS parsing
 * 4. Adds JSON-LD structured data for smart recruiters/AI tools
 * 5. Injects into index.html
 *
 * Usage:
 *   node scripts/generate-ats-content.js
 *   npm run generate:ats
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './ats-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Read and parse JSON file
 */
function readJSON(filePath) {
  try {
    const fullPath = path.join(rootDir, filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`⚠️  Could not read ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Extract skills from various project fields
 * ATS systems look for skill keywords - extract them all
 */
function extractSkills(projectIndex, projectDetail) {
  const skills = new Set();

  // From tags (highest priority - explicit skills)
  if (projectIndex.tags) {
    projectIndex.tags.forEach(tag => skills.add(tag));
  }

  // From content blocks (search for tools, technologies)
  if (projectDetail?.contentBlocks) {
    projectDetail.contentBlocks.forEach(block => {
      // Check sidebar for "Tools Used", "Tech Stack", etc.
      if (block.sidebar) {
        Object.entries(block.sidebar).forEach(([key, values]) => {
          if (key.toLowerCase().includes('tool') ||
              key.toLowerCase().includes('tech') ||
              key.toLowerCase().includes('stack')) {
            if (Array.isArray(values)) {
              values.forEach(v => skills.add(v));
            }
          }
        });
      }
    });
  }

  return Array.from(skills);
}

/**
 * Extract metrics and achievements
 * ATS loves numbers and quantifiable results
 */
function extractMetrics(projectIndex, projectDetail) {
  const metrics = [];

  // Card metrics (quick overview)
  if (projectIndex.cardMetrics) {
    projectIndex.cardMetrics.forEach(metric => {
      metrics.push({
        value: metric.value,
        label: metric.label,
        type: 'card'
      });
    });
  }

  // Detail metrics (more comprehensive)
  if (projectDetail?.detailMetrics || projectIndex.detailMetrics) {
    const detailMetrics = projectDetail?.detailMetrics || projectIndex.detailMetrics;
    detailMetrics.forEach(metric => {
      metrics.push({
        value: metric.value,
        label: metric.label,
        type: 'detail'
      });
    });
  }

  return metrics;
}

/**
 * Extract key achievements and responsibilities from content blocks
 * Focus on action verbs and concrete outcomes
 */
function extractAchievements(projectDetail) {
  const achievements = [];

  if (!projectDetail?.contentBlocks) return achievements;

  projectDetail.contentBlocks.forEach(block => {
    // Look for timeline/process blocks (show progression)
    if (block.type === 'timeline-process' && block.phases) {
      block.phases.forEach(phase => {
        if (phase.highlights) {
          achievements.push({
            category: phase.title,
            items: phase.highlights,
            outcome: phase.outcome
          });
        }
      });
    }

    // Look for problem-solution narratives
    if (block.left) {
      block.left.forEach(section => {
        if (section.heading && section.heading.toLowerCase().includes('solution')) {
          if (section.blocks) {
            section.blocks.forEach(b => {
              if (b.type === 'list' && b.items) {
                achievements.push({
                  category: 'Solutions Delivered',
                  items: b.items
                });
              }
            });
          }
        }
      });
    }
  });

  return achievements;
}

/**
 * Generate clean text from HTML (for meta descriptions)
 */
function stripHTML(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================================================
// HTML GENERATION FUNCTIONS (ATS-OPTIMIZED)
// ============================================================================

/**
 * Generate semantic, ATS-friendly HTML for a single project
 */
function generateProjectHTML(projectIndex, projectDetail, config) {
  const skills = extractSkills(projectIndex, projectDetail);
  const metrics = extractMetrics(projectIndex, projectDetail);
  const achievements = extractAchievements(projectDetail);

  // Job title - critical for ATS (appears multiple times for emphasis)
  const jobTitle = projectDetail?.jobTitle || projectIndex.jobTitle || 'Product Designer';
  const company = projectIndex.company || '';
  const duration = projectDetail?.duration || projectIndex.duration || projectIndex.year || '';

  // Create comprehensive overview (combines multiple sources)
  const overview = projectIndex.cardOverview || projectIndex.shortSubtitle || projectIndex.subtitle || '';
  const storyTeaser = projectIndex.storyTeaser?.text || '';

  return `
    <!-- Project: ${projectIndex.title} -->
    <article class="project-summary ats-optimized"
             itemscope
             itemtype="https://schema.org/CreativeWork"
             data-project-id="${projectIndex.id || ''}"
             role="article"
             aria-label="${projectIndex.title} - ${jobTitle}">

      <!-- Job Title & Company (ATS Priority #1) -->
      <header class="project-header">
        <h2 itemprop="name" class="project-title">
          <strong>${projectIndex.title}</strong> — ${jobTitle}
        </h2>
        ${company ? `<p class="project-company" itemprop="publisher">${company}</p>` : ''}
        ${duration ? `<p class="project-duration"><time itemprop="dateCreated">${duration}</time></p>` : ''}
      </header>

      <!-- Subtitle (Context) -->
      ${projectIndex.subtitle ? `
      <h3 class="project-subtitle" itemprop="alternativeHeadline">
        ${projectIndex.subtitle}
      </h3>
      ` : ''}

      <!-- Overview (ATS Priority #2: Project Description) -->
      <div class="project-overview" itemprop="description">
        <p><strong>Overview:</strong> ${overview}</p>
        ${storyTeaser ? `<p>${storyTeaser}</p>` : ''}
      </div>

      <!-- Skills & Technologies (ATS Priority #3: Keyword Matching) -->
      ${skills.length > 0 ? `
      <div class="project-skills" itemprop="keywords">
        <h4>Skills & Technologies:</h4>
        <ul class="skills-list" role="list">
          ${skills.map(skill => `<li itemprop="skill">${skill}</li>`).join('')}
        </ul>
      </div>
      ` : ''}

      <!-- Metrics & Impact (ATS Priority #4: Quantifiable Results) -->
      ${metrics.length > 0 ? `
      <div class="project-metrics" itemprop="about">
        <h4>Impact & Results:</h4>
        <ul class="metrics-list" role="list">
          ${metrics.map(metric => `
            <li>
              <strong>${metric.value}</strong> — ${metric.label}
            </li>
          `).join('')}
        </ul>
      </div>
      ` : ''}

      <!-- Key Achievements (ATS Priority #5: Responsibilities & Actions) -->
      ${achievements.length > 0 ? `
      <div class="project-achievements">
        <h4>Key Contributions:</h4>
        ${achievements.map(achievement => `
          <div class="achievement-group">
            ${achievement.category ? `<h5>${achievement.category}</h5>` : ''}
            <ul role="list">
              ${achievement.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            ${achievement.outcome ? `<p class="outcome"><em>Outcome: ${achievement.outcome}</em></p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Project Tags (Additional keywords for ATS) -->
      ${projectIndex.tags && projectIndex.tags.length > 0 ? `
      <div class="project-tags">
        <strong>Tags:</strong>
        ${projectIndex.tags.map(tag => `<span class="tag">${tag}</span>`).join(', ')}
      </div>
      ` : ''}

    </article>
  `;
}

/**
 * Generate JSON-LD structured data (for smart ATS and SEO)
 */
function generateStructuredData(projectIndex, projectDetail, personData) {
  const skills = extractSkills(projectIndex, projectDetail);
  const metrics = extractMetrics(projectIndex, projectDetail);
  const jobTitle = projectDetail?.jobTitle || projectIndex.jobTitle || 'Product Designer';

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": projectIndex.title,
    "alternativeHeadline": projectIndex.subtitle,
    "description": projectIndex.cardOverview || projectIndex.subtitle,
    "author": {
      "@type": "Person",
      "name": personData.name,
      "jobTitle": jobTitle,
      "url": personData.url
    },
    "creator": {
      "@type": "Person",
      "name": personData.name,
      "jobTitle": jobTitle
    },
    "keywords": skills.join(', '),
    "dateCreated": projectIndex.year,
    "publisher": {
      "@type": "Organization",
      "name": projectIndex.company || personData.name
    },
    "about": metrics.map(m => ({
      "@type": "QuantitativeValue",
      "value": m.value,
      "description": m.label
    })),
    "workExample": {
      "@type": "CreativeWork",
      "position": jobTitle,
      "description": projectIndex.cardOverview
    }
  };
}

/**
 * Generate Person schema (main portfolio owner)
 */
function generatePersonSchema(projects) {
  // Collect all unique skills across projects
  const allSkills = new Set();
  const allJobTitles = new Set();

  projects.forEach(({ projectIndex, projectDetail }) => {
    const skills = extractSkills(projectIndex, projectDetail);
    skills.forEach(s => allSkills.add(s));

    const jobTitle = projectDetail?.jobTitle || projectIndex.jobTitle;
    if (jobTitle) allJobTitles.add(jobTitle);
  });

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Silvia Travieso",
    "url": "https://silviatravieso.com",
    "jobTitle": "UI/UX Designer & Product Designer",
    "description": "Product Designer specializing in design systems, enterprise applications, and user-centered design. Experience leading end-to-end product design and building scalable design infrastructure.",
    "alumniOf": "Design",
    "hasOccupation": {
      "@type": "Occupation",
      "name": "Product Designer",
      "skills": Array.from(allSkills).join(', '),
      "occupationLocation": {
        "@type": "Place",
        "name": "Remote"
      }
    },
    "knowsAbout": Array.from(allSkills),
    "sameAs": [
      "https://www.linkedin.com/in/silvia-travieso-gonzalez",
      "https://www.behance.net/silviatravieso"
    ]
  };
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

function generateATSContent() {
  console.log('\n🚀 Generating ATS-Optimized Content...\n');
  console.log('Priority: Recruiter Tools > ATS Systems > SEO\n');

  const personData = {
    name: "Silvia Travieso",
    url: "https://silviatravieso.com"
  };

  const projectsHTML = [];
  const structuredDataArray = [];
  const processedProjects = [];

  // Process each project
  config.projects
    .sort((a, b) => a.priority - b.priority)
    .forEach(projectConfig => {
      console.log(`📄 Processing: ${projectConfig.title}`);

      // Load project index
      const projectsIndex = readJSON(projectConfig.indexPath);
      if (!projectsIndex) {
        console.log(`   ⚠️  Skipping - could not read index file`);
        return;
      }

      const projectIndex = projectsIndex[projectConfig.projectKey];
      if (!projectIndex) {
        console.log(`   ⚠️  Skipping - project key "${projectConfig.projectKey}" not found`);
        return;
      }

      // Load detailed content (if available)
      let projectDetail = null;
      if (projectConfig.jsonPath) {
        projectDetail = readJSON(projectConfig.jsonPath);
      } else if (projectIndex.contentBlocks) {
        // Content is inline in projects.json
        projectDetail = projectIndex;
      }

      // Generate HTML
      const html = generateProjectHTML(projectIndex, projectDetail, config.atsOptimization);
      projectsHTML.push(html);

      // Generate structured data
      if (config.atsOptimization.generateStructuredData) {
        const structuredData = generateStructuredData(projectIndex, projectDetail, personData);
        structuredDataArray.push(structuredData);
      }

      processedProjects.push({ projectIndex, projectDetail });

      console.log(`   ✅ Generated ATS-optimized HTML`);
    });

  // Generate Person schema
  const personSchema = generatePersonSchema(processedProjects);

  // Combine all HTML
  const combinedHTML = `
<!--
  ATS-OPTIMIZED CONTENT
  Generated: ${new Date().toISOString()}

  This content is optimized for:
  1. Applicant Tracking Systems (ATS)
  2. Recruiter tools and browser extensions
  3. LinkedIn/job board scrapers
  4. Search engines (SEO)

  Your JavaScript will enhance/replace this content for visual presentation.
-->

<div class="ats-content" role="region" aria-label="Portfolio Projects">
  ${projectsHTML.join('\n')}
</div>

<!-- Structured Data for ATS & SEO -->
${config.atsOptimization.generateStructuredData ? `
<script type="application/ld+json">
${JSON.stringify(personSchema, null, 2)}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": ${JSON.stringify(structuredDataArray, null, 2)}
}
</script>
` : ''}
`;

  console.log(`\n✅ Generated content for ${processedProjects.length} projects`);
  console.log(`📊 Total structured data schemas: ${structuredDataArray.length + 1}`);

  return combinedHTML;
}

// ============================================================================
// INJECT INTO HTML
// ============================================================================

function injectIntoHTML(content) {
  console.log(`\n📝 Injecting into ${config.output.indexHtmlPath}...\n`);

  const htmlPath = path.join(rootDir, config.output.indexHtmlPath);

  // Backup original
  if (config.output.createBackup) {
    const backupPath = htmlPath + config.output.backupSuffix;
    if (fs.existsSync(htmlPath)) {
      fs.copyFileSync(htmlPath, backupPath);
      console.log(`💾 Backup created: ${path.basename(backupPath)}`);
    }
  }

  // Read current HTML
  let html = fs.readFileSync(htmlPath, 'utf-8');

  // Find the target container
  const containerPattern = new RegExp(
    `(<div id="${config.output.targetContainer}"[^>]*>)([\\s\\S]*?)(</div>)`,
    'i'
  );

  const match = html.match(containerPattern);

  if (!match) {
    console.error(`❌ Could not find container: #${config.output.targetContainer}`);
    return false;
  }

  // Replace content
  const newHTML = html.replace(
    containerPattern,
    `$1\n${content}\n  $3`
  );

  // Write back
  fs.writeFileSync(htmlPath, newHTML, 'utf-8');

  console.log(`✅ Content injected successfully`);
  console.log(`📄 Updated: ${config.output.indexHtmlPath}\n`);

  return true;
}

// ============================================================================
// RUN
// ============================================================================

try {
  const content = generateATSContent();
  injectIntoHTML(content);

  console.log('✨ ATS content generation complete!\n');
  console.log('Your portfolio now includes:');
  console.log('  ✅ Semantic HTML readable by ATS systems');
  console.log('  ✅ Keywords optimized for recruiter searches');
  console.log('  ✅ Quantifiable metrics and achievements');
  console.log('  ✅ JSON-LD structured data for smart tools');
  console.log('  ✅ Progressive enhancement (JS enhances, not required)\n');
} catch (error) {
  console.error('❌ Error generating ATS content:', error);
  process.exit(1);
}
