/**
 * Project Cards Module
 * Dynamically generates project cards from projects.json
 */

import projectData from '../../data/projects.json';
import { PROJECT_ORDER, PROJECT_SLUGS } from '../utils/constants.js';
import { isVideoFile } from '../utils/media.js';
import { nextFrame, scrollToElement } from '../utils/dom.js';
import '@phosphor-icons/web/light';
import 'iconoir/css/iconoir.css';

/**
 * Initialize and render project cards
 * @returns {Promise} Promise that resolves when cards are rendered
 */
export function initProjectCards() {
  return new Promise((resolve) => {
    const projectsContainer = document.querySelector('#projects-container');

    if (!projectsContainer) {
      resolve();
      return;
    }

    projectsContainer.innerHTML = '';

    // Generate cards for each project in the specified order
    PROJECT_ORDER.forEach((projectId) => {
      const project = projectData[projectId];
      if (project) {
        const projectCard = createProjectCard(projectId, project);
        projectsContainer.appendChild(projectCard);
      }
    });

    updateBreadcrumbs();
    attachProjectNavListeners();

    // Wait for DOM to be painted before resolving
    nextFrame().then(resolve);
  });
}

/**
 * Attach event listeners to project navigation buttons
 */
function attachProjectNavListeners() {
  const projectNavButtons = document.querySelectorAll('.project-nav-button');

  projectNavButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = button.getAttribute('data-project-id');
      if (projectId) {
        scrollToProjectCard(projectId);
      }
    });
  });
}

/**
 * Create breadcrumb link element
 * @param {string} projectId - Project ID
 * @param {object} project - Project data
 * @returns {HTMLElement} Link element
 */
function createBreadcrumbLink(projectId, project) {
  const link = document.createElement('a');
  link.href = `#project-${projectId}`;
  link.className = 'breadcrumb-link';
  link.setAttribute('data-project', projectId);
  link.textContent = project.title;

  link.addEventListener('click', (e) => {
    e.preventDefault();
    handleBreadcrumbClick(projectId);
  });

  return link;
}

/**
 * Create breadcrumb separator element
 * @returns {HTMLElement} Separator element
 */
function createBreadcrumbSeparator() {
  const separator = document.createElement('span');
  separator.className = 'breadcrumb-separator';
  separator.textContent = '→';
  return separator;
}

/**
 * Update breadcrumb navigation with project titles from JSON
 */
function updateBreadcrumbs() {
  const breadcrumbsNav = document.querySelector('.breadcrumbs');
  if (!breadcrumbsNav) return;

  breadcrumbsNav.innerHTML = '';

  PROJECT_ORDER.forEach((projectId, index) => {
    const project = projectData[projectId];
    if (!project) return;

    breadcrumbsNav.appendChild(createBreadcrumbLink(projectId, project));

    // Add separator (except for last item)
    if (index < PROJECT_ORDER.length - 1) {
      breadcrumbsNav.appendChild(createBreadcrumbSeparator());
    }
  });
}

/**
 * Handle breadcrumb click with context awareness
 * @param {string} projectId - The project ID to navigate to
 */
function handleBreadcrumbClick(projectId) {
  const detailPage = document.querySelector('#project-detail-page');

  if (!detailPage) return;

  const isDetailPageActive = detailPage.classList.contains('active');

  if (isDetailPageActive) {
    // On detail page: Navigate to another project's detail
    // Trigger a custom event that projectDetail.js can listen to
    window.dispatchEvent(new CustomEvent('openProjectDetail', { detail: { projectId } }));
  } else {
    // On main view: Scroll to the project card
    scrollToProjectCard(projectId);
  }
}

/**
 * Scroll to a specific project card on the main view
 * @param {string} projectId - The project ID to scroll to
 */
function scrollToProjectCard(projectId) {
  const projectSection = document.querySelector(`#project-${projectId}`);
  scrollToElement(projectSection, 'center');
}

/**
 * Create a project card section element
 * @param {string} projectId - The project ID (1, 2, 3, etc.)
 * @param {object} project - The project data object
 * @returns {HTMLElement} The project section element
 */
function createProjectCard(projectId, project) {
  const currentProjectId = String(projectId);

  const section = document.createElement('section');
  section.id = `project-${currentProjectId}`;
  section.className = `section-project project-${project.theme}`;
  section.setAttribute('data-section', 'project');
  // Store projectId directly on the section element for debugging
  section.setAttribute('data-project-id', currentProjectId);

  // Determine navigation titles (previous and next projects)
  const prevProjectData = getPreviousProject(currentProjectId);
  const nextProjectData = getNextProject(currentProjectId);

  const ctaHref = `#case-study-${currentProjectId}`;

  section.innerHTML = `
    <div class="contentbox">
      <!-- Project Screen -->
      <div class="project-screen">
        ${createTopNavigation(prevProjectData)}

        <div class="project-content">
          <!-- Left Column -->
          <div class="left-column">
            <!-- Group 1: Title + Subtitle -->
            <div class="title-group">
              <h1 class="project-title">${project.title}</h1>
              <h2 class="project-description ${project.theme !== 'blue' ? project.theme : ''}">${project.subtitle}</h2>
            </div>

            <!-- Group 2: Metrics -->
            ${createMetrics(project)}

            <!-- Group 3: Tags + Meta Info -->
            <div class="meta-group">
              ${createTags(project)}
              ${createProjectMeta(project)}
            </div>
          </div>

          <!-- Right Column -->
          <div class="right-column">
            <!-- Group 1: Cover Image -->
            <div class="project-image-wrapper">
              <div class="background-gradient ${project.theme}-gradient"></div>
              <img src="${project.heroImage || (project.images && project.images[0])}" alt="${project.title}" class="project-image project-image-default${project.theme === 'neutral' ? ' contain' : ''}" />
              ${project.cardHoverImage ? (
                isVideoFile(project.cardHoverImage)
                  ? `<video src="${project.cardHoverImage}" class="project-image project-image-hover${project.theme === 'neutral' ? ' contain' : ''}" muted loop playsinline preload="auto"></video>`
                  : `<img src="${project.cardHoverImage}" alt="${project.title} hover" class="project-image project-image-hover${project.theme === 'neutral' ? ' contain' : ''}" />`
              ) : ''}
            </div>

            <!-- Group 2: Storytelling text + CTA -->
            <div class="storytelling-group">
              ${createProjectDetails(project)}
              <div class="cta-buttons-group">
                <!-- ARCHIVED: Case study modal disabled -->
                <!-- <a href="${ctaHref}" class="cta-button" data-project-id="${currentProjectId}">
                  → Read Case Study
                </a> -->
                <a href="/${PROJECT_SLUGS[currentProjectId]}" class="cta-button">
                  → View Case Study
                </a>
              </div>
            </div>
          </div>
        </div>

        ${createBottomNavigation(nextProjectData)}
      </div>
    </div>
  `;

  // Add hover event listeners for video playback if cardHoverImage is a video
  if (project.cardHoverImage && isVideoFile(project.cardHoverImage)) {
    // Need to attach listeners after the element is in the DOM
    setTimeout(() => {
      const wrapper = section.querySelector('.project-image-wrapper');
      const video = section.querySelector('.project-image-hover');

      if (wrapper && video) {
        // Load the first frame immediately to prevent black screen
        video.load();

        // Pause on first frame initially (preload will load metadata and first frame)
        video.addEventListener('loadeddata', () => {
          video.pause();
          video.currentTime = 0;
        }, { once: true });

        wrapper.addEventListener('mouseenter', () => {
          // Only play if video is ready
          if (video.readyState >= 3) { // HAVE_FUTURE_DATA or HAVE_ENOUGH_DATA
            video.play().catch(err => {
              console.log('Video play failed:', err);
            });
          } else {
            // Wait for video to be ready, then play
            video.addEventListener('canplay', () => {
              video.play().catch(err => {
                console.log('Video play failed:', err);
              });
            }, { once: true });
          }
        });

        wrapper.addEventListener('mouseleave', () => {
          video.pause();
          video.currentTime = 0; // Reset to start
        });
      }
    }, 0);
  }

  return section;
}

/**
 * Create top navigation HTML
 * @param {object|null} prevProjectData - Previous project data with id
 * @returns {string} HTML string
 */
function createTopNavigation(prevProjectData) {
  if (!prevProjectData) {
    return '<div class="project-nav top"></div>';
  }

  return `
    <button class="project-nav top project-nav-button" data-project-id="${prevProjectData.id}">
      <h3 class="nav-title">↑ Previous</h3>
      <p class="nav-subtitle">${prevProjectData.project.title}</p>
    </button>
  `;
}

/**
 * Create bottom navigation HTML
 * @param {object|null} nextProjectData - Next project data with id
 * @returns {string} HTML string
 */
function createBottomNavigation(nextProjectData) {
  if (!nextProjectData) {
    return '<button class="project-nav bottom project-nav-button"></button>';
  }

  return `
    <button class="project-nav bottom project-nav-button" data-project-id="${nextProjectData.id}">
      <h3 class="nav-title">↓ Next</h3>
      <p class="nav-subtitle">${nextProjectData.project.title}</p>
    </button>
  `;
}

/**
 * Create project details HTML
 * @param {object} project - Project data
 * @returns {string} HTML string
 */
function createProjectDetails(project) {
  // Use cardOverview if available, otherwise fall back to first section's content
  const overviewText = project.cardOverview || project.sections.find(s => s.heading === 'Project Overview')?.content;

  if (!overviewText) return '';

  // Split content by double newlines to create paragraphs
  const paragraphs = overviewText.split('\n\n').map(p => p.trim()).filter(p => p);

  return `
    <p class="project-details">
      ${paragraphs.join('<br><br>')}
    </p>
  `;
}

/**
 * Render icon based on library prefix
 * @param {string} iconString - Icon string with optional prefix (e.g., "iconoir:check" or "ph:rocket" or "check")
 * @returns {string} HTML string for icon
 */
function renderIcon(iconString) {
  if (!iconString) return '';

  // Check for prefix
  if (iconString.includes(':')) {
    const [library, iconName] = iconString.split(':');

    if (library === 'iconoir') {
      return `<i class="iconoir-${iconName}"></i>`;
    } else if (library === 'ph' || library === 'phosphor') {
      return `<i class="ph-light ph-${iconName}"></i>`;
    }
  }

  // Default to Iconoir if no prefix
  return `<i class="iconoir-${iconString}"></i>`;
}

/**
 * Create metrics section HTML
 * @param {object} project - Project data
 * @returns {string} HTML string
 */
function createMetrics(project) {
  // Extract cardMetrics from project data in JSON (for project cards)
  const metrics = project.cardMetrics || [];

  if (!metrics || metrics.length === 0) return '';

  const themeClass = project.theme !== 'blue' ? project.theme : '';

  return `
    <div class="metrics ${themeClass}">
      ${metrics.map(metric => `
        <div class="metric-card">
          <div class="cs-metric-content">
            <div class="cs-metric-top">
              ${metric.icon ? `<div class="cs-metric-icon-wrapper"><span class="cs-metric-icon">${renderIcon(metric.icon)}</span></div>` : ''}
              <div class="cs-metric-value">${metric.value}</div>
            </div>
            <div class="cs-metric-label">${metric.label}</div>
          </div>
          <div class="cs-metric-border" aria-hidden="true"></div>
          <div class="cs-metric-dot dot-bottom-right">
            <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3.5" stroke-width="1" />
            </svg>
          </div>
          <div class="cs-metric-dot dot-top-right">
            <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3.5" stroke-width="1" />
            </svg>
          </div>
          <div class="cs-metric-dot dot-bottom-left">
            <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
              <circle cx="4" cy="4" r="3.5" stroke-width="1" />
            </svg>
          </div>
          <div class="cs-metric-dot dot-top-left">
            <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
              <circle cx="4" cy="4" fill="#FCFDFD" r="3.5" stroke-width="1" />
            </svg>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * Create project meta information HTML
 * @param {object} project - Project data
 * @returns {string} HTML string
 */
function createProjectMeta(project) {
  const jobTitle = project.jobTitle || 'Product Designer';
  const year = project.year || '2024';
  const company = project.company || '';

  const themeClass = project.theme !== 'blue' ? project.theme : '';

  return `
    <p class="project-meta ${themeClass}">${jobTitle} > ${year}${company ? ' > ' + company : ''}</p>
  `;
}

/**
 * Create tags section HTML
 * @param {object} project - Project data
 * @returns {string} HTML string
 */
function createTags(project) {
  // Read tags from JSON
  const tags = project.tags || [];

  if (!tags || tags.length === 0) return '';

  const themeClass = project.theme !== 'blue' ? project.theme : '';

  return `
    <div class="tags ${themeClass}">
      <span class="tag-label">Tags</span>
      <div class="tag-list">
        <span>|</span>
        ${tags.map(tag => `<span>${tag}</span><span>|</span>`).join('')}
      </div>
    </div>
  `;
}

/**
 * Get previous project in the list
 * @param {string} currentId - Current project ID
 * @returns {object|null} Previous project data with id
 */
function getPreviousProject(currentId) {
  const currentIndex = PROJECT_ORDER.indexOf(currentId);

  if (currentIndex <= 0) return null;

  const prevId = PROJECT_ORDER[currentIndex - 1];
  return { id: prevId, project: projectData[prevId] };
}

/**
 * Get next project in the list
 * @param {string} currentId - Current project ID
 * @returns {object|null} Next project data with id
 */
function getNextProject(currentId) {
  const currentIndex = PROJECT_ORDER.indexOf(currentId);

  if (currentIndex === -1 || currentIndex === PROJECT_ORDER.length - 1) return null;

  const nextId = PROJECT_ORDER[currentIndex + 1];
  return { id: nextId, project: projectData[nextId] };
}

