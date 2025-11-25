/**
 * Project Cards Module
 * Dynamically generates project cards from projects.json
 */

import projectData from '../../data/projects.json';
import '@phosphor-icons/web/light';
import 'iconoir/css/iconoir.css';

/**
 * Explicit project order to preserve intended display sequence
 * JavaScript sorts numeric object keys numerically (1,2,3,4,5,6)
 * regardless of JSON file order, so we define the order explicitly
 */
const PROJECT_ORDER = ['1', '2', '3', '4'];

/**
 * Check if a file is a video based on extension
 * @param {string} filePath - The file path to check
 * @returns {boolean} True if the file is a video
 */
function isVideoFile(filePath) {
  if (!filePath) return false;
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg'];
  const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
  return videoExtensions.includes(extension);
}

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

    // Clear any existing content
    projectsContainer.innerHTML = '';

    // Generate cards for each project in the specified order
    PROJECT_ORDER.forEach((projectId, index) => {
      const project = projectData[projectId];
      if (!project) {
        return;
      }
      const projectCard = createProjectCard(projectId, project, index);
      projectsContainer.appendChild(projectCard);

      // VERIFY: Check the href in the DOM immediately after appending
      const ctaButton = projectCard.querySelector('.cta-button');
      if (ctaButton) {
      }
    });

    // Update breadcrumbs dynamically
    updateBreadcrumbs();

    // Attach event listeners to project navigation buttons
    attachProjectNavListeners();


    // Wait for next frame to ensure DOM has been painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // FINAL VERIFICATION: Check all CTA buttons in the DOM
        const allCtaButtons = document.querySelectorAll('.cta-button');
        allCtaButtons.forEach((btn, idx) => {
          const section = btn.closest('section[data-section="project"]');
          const sectionId = section ? section.id : 'unknown';
        });

        resolve();
      });
    });
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

      // Get project ID from data attribute
      const projectId = button.getAttribute('data-project-id');

      if (projectId) {
        // Always scroll to the project card when clicking nav buttons on main view
        scrollToProjectCard(projectId);
      }
    });
  });

}

/**
 * Find project ID by matching title
 * @param {string} navTitle - Navigation title text (may include arrows)
 * @returns {string|null} Project ID or null if not found
 */
function findProjectIdByTitle(navTitle) {
  // Remove arrow symbols and trim
  const cleanTitle = navTitle.replace(/[↑↓]/g, '').trim();

  // Search through project data
  for (const [projectId, project] of Object.entries(projectData)) {
    if (cleanTitle.includes(project.title) || project.title.includes(cleanTitle)) {
      return projectId;
    }
  }

  return null;
}

/**
 * Update breadcrumb navigation with project titles from JSON
 */
function updateBreadcrumbs() {
  const breadcrumbsNav = document.querySelector('.breadcrumbs');
  if (!breadcrumbsNav) return;

  // Clear existing breadcrumbs
  breadcrumbsNav.innerHTML = '';

  // Use the same explicit project order as card generation
  PROJECT_ORDER.forEach((projectId, index) => {
    const project = projectData[projectId];
    if (!project) return;

    // Create breadcrumb link
    const link = document.createElement('a');
    link.href = `#project-${projectId}`;
    link.className = 'breadcrumb-link';
    link.setAttribute('data-project', projectId);
    link.textContent = project.title;

    // Add context-aware click handler
    link.addEventListener('click', (e) => {
      e.preventDefault();
      handleBreadcrumbClick(projectId);
    });

    breadcrumbsNav.appendChild(link);

    // Add separator (except for last item)
    if (index < PROJECT_ORDER.length - 1) {
      const separator = document.createElement('span');
      separator.className = 'breadcrumb-separator';
      separator.textContent = '→';
      breadcrumbsNav.appendChild(separator);
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

  if (projectSection) {
    projectSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
  }
}

/**
 * Create a project card section element
 * @param {string} projectId - The project ID (1, 2, 3, etc.)
 * @param {object} project - The project data object
 * @param {number} index - The index in the project list
 * @returns {HTMLElement} The project section element
 */
function createProjectCard(projectId, project, index) {

  // CRITICAL: Store projectId in a const to prevent any scoping issues
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
                  ? `<video src="${project.cardHoverImage}" class="project-image project-image-hover${project.theme === 'neutral' ? ' contain' : ''}" muted loop playsinline></video>`
                  : `<img src="${project.cardHoverImage}" alt="${project.title} hover" class="project-image project-image-hover${project.theme === 'neutral' ? ' contain' : ''}" />`
              ) : ''}
            </div>

            <!-- Group 2: Storytelling text + CTA -->
            <div class="storytelling-group">
              ${createProjectDetails(project)}
              <a href="${ctaHref}" class="cta-button" data-project-id="${currentProjectId}">
                → Read Case Study
              </a>
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
        wrapper.addEventListener('mouseenter', () => {
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

