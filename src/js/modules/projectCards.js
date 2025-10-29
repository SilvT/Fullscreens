/**
 * Project Cards Module
 * Dynamically generates project cards from projects.json
 */

import projectData from '../../data/projects.json';
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
      console.warn('Projects container not found');
      resolve();
      return;
    }

    // Clear any existing content
    projectsContainer.innerHTML = '';

    // Generate cards for each project in the JSON
    Object.entries(projectData).forEach(([projectId, project], index) => {
      const projectCard = createProjectCard(projectId, project, index);
      projectsContainer.appendChild(projectCard);
    });

    // Update breadcrumbs dynamically
    updateBreadcrumbs();

    // Attach event listeners to project navigation buttons
    attachProjectNavListeners();

    console.log(`✓ Generated ${Object.keys(projectData).length} project cards from JSON`);

    // Wait for next frame to ensure DOM has been painted
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        console.log('✓ Project cards rendered and ready for ScrollTrigger');
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
      const navTitle = button.querySelector('.nav-title')?.textContent;

      if (!navTitle) return;

      // Extract project ID from the title by matching against project data
      const projectId = findProjectIdByTitle(navTitle);

      if (projectId) {
        // Always scroll to the project card when clicking nav buttons on main view
        scrollToProjectCard(projectId);
      }
    });
  });

  console.log('✓ Project navigation listeners attached');
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

  // Generate breadcrumbs from project data
  const projectIds = Object.keys(projectData);
  projectIds.forEach((projectId, index) => {
    const project = projectData[projectId];

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
    if (index < projectIds.length - 1) {
      const separator = document.createElement('span');
      separator.className = 'breadcrumb-separator';
      separator.textContent = '→';
      breadcrumbsNav.appendChild(separator);
    }
  });

  console.log('✓ Breadcrumbs updated from JSON');
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
    console.log(`Scrolled to project card: ${projectId}`);
  } else {
    console.warn(`Project section not found: #project-${projectId}`);
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
  const section = document.createElement('section');
  section.id = `project-${projectId}`;
  section.className = `section-project project-${project.theme}`;
  section.setAttribute('data-section', 'project');

  // Determine navigation titles (previous and next projects)
  const prevProject = getPreviousProject(projectId);
  const nextProject = getNextProject(projectId);

  section.innerHTML = `
    <div class="contentbox">
      <!-- Project Screen -->
      <div class="project-screen">
        ${createTopNavigation(prevProject)}

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
              ${project.theme !== 'neutral' ? `<div class="background-gradient ${project.theme}-gradient"></div>` : ''}
              <img src="${project.images[0]}" alt="${project.title}" class="project-image${project.theme === 'neutral' ? ' contain' : ''}" />
            </div>

            <!-- Group 2: Storytelling text + CTA -->
            <div class="storytelling-group">
              ${createProjectDetails(project)}
              <a href="#case-study-${projectId}" class="cta-button">
                → Read Case Study
              </a>
            </div>
          </div>
        </div>

        ${createBottomNavigation(nextProject)}
      </div>
    </div>
  `;

  return section;
}

/**
 * Create top navigation HTML
 * @param {object|null} prevProject - Previous project data
 * @returns {string} HTML string
 */
function createTopNavigation(prevProject) {
  if (!prevProject) {
    return '<div class="project-nav top"></div>';
  }

  return `
    <div class="project-nav top">
      <h3 class="nav-title">↑ ${prevProject.title}</h3>
      <p class="nav-subtitle">${prevProject.subtitle}</p>
    </div>
  `;
}

/**
 * Create bottom navigation HTML
 * @param {object|null} nextProject - Next project data
 * @returns {string} HTML string
 */
function createBottomNavigation(nextProject) {
  if (!nextProject) {
    return '<button class="project-nav bottom project-nav-button"></button>';
  }

  return `
    <button class="project-nav bottom project-nav-button">
      <h3 class="nav-title">↓ ${nextProject.title}</h3>
      <p class="nav-subtitle">${nextProject.subtitle}</p>
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
            ${metric.icon ? `<div class="cs-metric-icon-wrapper"><span class="cs-metric-icon">${renderIcon(metric.icon)}</span></div>` : ''}
            <div class="cs-metric-value">${metric.value}</div>
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
 * @returns {object|null} Previous project data
 */
function getPreviousProject(currentId) {
  const projectIds = Object.keys(projectData);
  const currentIndex = projectIds.indexOf(currentId);

  if (currentIndex <= 0) return null;

  const prevId = projectIds[currentIndex - 1];
  return projectData[prevId];
}

/**
 * Get next project in the list
 * @param {string} currentId - Current project ID
 * @returns {object|null} Next project data
 */
function getNextProject(currentId) {
  const projectIds = Object.keys(projectData);
  const currentIndex = projectIds.indexOf(currentId);

  if (currentIndex === -1 || currentIndex === projectIds.length - 1) return null;

  const nextId = projectIds[currentIndex + 1];
  return projectData[nextId];
}

