/**
 * Project Page Module
 * Handles standalone project case study pages
 * Replaces modal-based navigation with dedicated pages
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectData from '../data/projects.json';
import { updateProjectMetaTags } from './modules/structuredData.js';
import { initLightbox } from './modules/lightbox.js';
import { trackProjectView } from './modules/analytics.js';
import '@phosphor-icons/web/light';
import 'iconoir/css/iconoir.css';
import '../scss/main.scss';

gsap.registerPlugin(ScrollTrigger);

/**
 * Project order configuration (matches homepage)
 */
const PROJECT_ORDER = ['1', '2', '3', '4'];

/**
 * Project slug mappings
 */
const PROJECT_SLUGS = {
  '1': 'marketing-management',
  '2': 'design-system',
  '3': 'energy-tracker',
  '4': 'figma-plugin'
};

/**
 * Reverse lookup for project ID from slug
 */
const SLUG_TO_ID = Object.fromEntries(
  Object.entries(PROJECT_SLUGS).map(([id, slug]) => [slug, id])
);

/**
 * Get project ID from current page
 */
function getCurrentProjectId() {
  // Try from HTML data attribute first
  const htmlElement = document.documentElement;
  const dataId = htmlElement.getAttribute('data-project-id');
  if (dataId) return dataId;

  // Fallback: parse from URL
  const path = window.location.pathname;
  const slug = path.replace(/^\//, '').replace(/\.html$/, '');
  return SLUG_TO_ID[slug] || null;
}

/**
 * Load and render project content
 */
async function loadProjectContent(projectId) {
  const projectIndex = projectData[projectId];

  if (!projectIndex) {
    console.error(`Project not found: ${projectId}`);
    showError('Project not found');
    return null;
  }

  // Load detailed content if available
  let projectDetail = null;
  if (projectIndex.contentFile) {
    try {
      const response = await fetch(projectIndex.contentFile);
      if (response.ok) {
        projectDetail = await response.json();
      }
    } catch (error) {
      console.warn('Could not load project detail file:', error);
    }
  }

  // Use inline content blocks if no separate file
  if (!projectDetail && projectIndex.contentBlocks) {
    projectDetail = projectIndex;
  }

  return { projectIndex, projectDetail };
}

/**
 * Render case study content (adapted from caseStudy.js)
 */
function renderCaseStudy(projectIndex, projectDetail, container) {
  // Import the rendering logic from caseStudy module
  import('./modules/caseStudy.js').then(module => {
    if (module.renderCaseStudyContent) {
      module.renderCaseStudyContent(projectIndex, projectDetail, container);
    } else {
      // Fallback: basic rendering
      renderBasicContent(projectIndex, projectDetail, container);
    }
  }).catch(error => {
    console.error('Error loading case study module:', error);
    renderBasicContent(projectIndex, projectDetail, container);
  });
}

/**
 * Basic content rendering fallback
 */
function renderBasicContent(projectIndex, projectDetail, container) {
  const jobTitle = projectDetail?.jobTitle || projectIndex.jobTitle || 'Product Designer';
  const company = projectIndex.company || '';
  const duration = projectDetail?.duration || projectIndex.duration || projectIndex.year || '';

  container.innerHTML = `
    <div class="cs-header">
      <div class="cs-meta">
        <span class="cs-role">${jobTitle}</span>
        ${company ? `<span class="cs-company">${company}</span>` : ''}
        ${duration ? `<span class="cs-duration">${duration}</span>` : ''}
      </div>
      <h1 class="cs-title">${projectIndex.title}</h1>
      ${projectIndex.subtitle ? `<p class="cs-subtitle">${projectIndex.subtitle}</p>` : ''}
    </div>

    ${projectIndex.heroImage ? `
      <div class="cs-hero-image">
        <img src="${projectIndex.heroImage}" alt="${projectIndex.title}" loading="eager" />
      </div>
    ` : ''}

    <div class="cs-content">
      ${projectIndex.cardOverview ? `
        <div class="cs-overview">
          <h2>Overview</h2>
          <p>${projectIndex.cardOverview}</p>
        </div>
      ` : ''}

      ${projectIndex.cardMetrics && projectIndex.cardMetrics.length > 0 ? `
        <div class="cs-metrics-grid">
          ${projectIndex.cardMetrics.map(metric => renderMetricCard(metric)).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

/**
 * Render metric card
 */
function renderMetricCard(metric) {
  const iconHTML = metric.icon ? renderIcon(metric.icon) : '';

  return `
    <div class="cs-metric-card">
      <div class="cs-metric-content">
        <div class="cs-metric-top">
          ${iconHTML ? `<div class="cs-metric-icon-wrapper"><span class="cs-metric-icon">${iconHTML}</span></div>` : ''}
          <div class="cs-metric-value">${metric.value}</div>
        </div>
        <div class="cs-metric-label">${metric.label}</div>
      </div>
      <div class="cs-metric-border" aria-hidden="true"></div>
    </div>
  `;
}

/**
 * Render icon (supports iconoir and phosphor)
 */
function renderIcon(iconString) {
  if (!iconString) return '';

  if (iconString.includes(':')) {
    const [library, iconName] = iconString.split(':');
    if (library === 'iconoir') {
      return `<i class="iconoir-${iconName}"></i>`;
    } else if (library === 'ph' || library === 'phosphor') {
      return `<i class="ph-light ph-${iconName}"></i>`;
    }
  }

  return `<i class="iconoir-${iconString}"></i>`;
}

/**
 * Show error message
 */
function showError(message) {
  const container = document.getElementById('project-content');
  if (container) {
    container.innerHTML = `
      <div class="cs-error">
        <h2>Error</h2>
        <p>${message}</p>
        <a href="/" class="cs-error-link">Back to Projects</a>
      </div>
    `;
  }
}

/**
 * Update breadcrumb navigation
 */
function updateBreadcrumbs(currentProjectId) {
  const breadcrumbContainer = document.getElementById('breadcrumb-navigation');
  if (!breadcrumbContainer) return;

  breadcrumbContainer.innerHTML = PROJECT_ORDER.map(projectId => {
    const project = projectData[projectId];
    if (!project) return '';

    const slug = PROJECT_SLUGS[projectId];
    const isActive = projectId === currentProjectId;

    return `
      <a href="/${slug}"
         class="breadcrumb-link ${isActive ? 'active' : ''}"
         ${isActive ? 'aria-current="page"' : ''}>
        ${project.title}
      </a>
    `;
  }).join('<span class="breadcrumb-separator">→</span>');
}

/**
 * Initialize smooth scrolling
 */
function initSmoothScrolling() {
  gsap.registerPlugin(ScrollTrigger);

  // Add any GSAP animations here
  // (Keep existing animation logic from caseStudy.js if needed)
}

/**
 * Initialize project page
 */
async function init() {
  const projectId = getCurrentProjectId();

  if (!projectId) {
    showError('Project ID not found');
    return;
  }

  console.log('Loading project:', projectId);

  // Load project data
  const data = await loadProjectContent(projectId);

  if (!data) {
    return; // Error already shown
  }

  const { projectIndex, projectDetail } = data;

  // Update page theme
  const container = document.getElementById('project-content');
  if (container && projectIndex.theme) {
    container.setAttribute('data-theme', projectIndex.theme);
  }

  // Render content
  renderCaseStudy(projectIndex, projectDetail, container);

  // Update meta tags for SEO
  updateProjectMetaTags(projectIndex, projectDetail);

  // Update breadcrumbs
  updateBreadcrumbs(projectId);

  // Initialize lightbox for images
  setTimeout(() => {
    initLightbox();
  }, 500);

  // Track page view
  trackProjectView(projectId, projectIndex.title);

  // Initialize smooth scrolling
  initSmoothScrolling();

  console.log('Project page initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
