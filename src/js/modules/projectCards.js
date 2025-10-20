/**
 * Project Cards Module
 * Dynamically generates project cards from projects.json
 */

import projectData from '../../data/projects.json';

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
    projectSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
          <!-- Content Min -->
          <div class="content-min">
            <h1 class="project-title">${project.title}</h1>

            <h2 class="project-description ${project.theme !== 'blue' ? project.theme : ''}">${project.subtitle}</h2>

            ${createProjectDetails(project)}

            ${createMetrics(project)}

            ${createProjectMeta(project)}
          </div>

          <!-- Left Content (Image + CTA) -->
          <div class="left-content">
            <div class="project-image-wrapper">
              ${project.theme !== 'neutral' ? `<div class="background-gradient ${project.theme}-gradient"></div>` : ''}
              <img src="${project.images[0]}" alt="${project.title}" class="project-image${project.theme === 'neutral' ? ' contain' : ''}" />
            </div>

            <a href="#case-study-${projectId}" class="cta-button">
              → read → case study
            </a>

            ${createTags(project)}
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
  // Get the first section's content (Project Overview)
  const overview = project.sections.find(s => s.heading === 'Project Overview');

  if (!overview) return '';

  // Split content by double newlines to create paragraphs
  const paragraphs = overview.content.split('\n\n').map(p => p.trim()).filter(p => p);

  return `
    <p class="project-details">
      ${paragraphs.join('<br><br>')}
    </p>
  `;
}

/**
 * Create metrics section HTML
 * @param {object} project - Project data
 * @returns {string} HTML string
 */
function createMetrics(project) {
  // Extract metrics from project data
  // For now, using hardcoded metrics structure
  // TODO: Add metrics to JSON schema
  const metrics = getMetricsForProject(project.title);

  if (!metrics || metrics.length === 0) return '';

  const themeClass = project.theme !== 'blue' ? project.theme : '';

  return `
    <div class="metrics ${themeClass}">
      ${metrics.map(metric => `
        <div class="metric-card">
          <p class="metric-value">${metric.value}</p>
          <p class="metric-label">${metric.label}</p>
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
  const roleTimeline = project.technical['Role & Timeline'];
  if (!roleTimeline || roleTimeline.length === 0) return '';

  // Extract company, role, and timeline
  const role = roleTimeline.find(item => !item.includes('202') && !item.includes('Solo'));
  const timeline = roleTimeline.find(item => item.includes('202'));
  const company = getCompanyForProject(project.title);

  const themeClass = project.theme !== 'blue' ? project.theme : '';

  return `
    <p class="project-meta ${themeClass}">${company ? company + ' - ' : ''}${role || 'Product Designer'} · ${timeline || '2024'}</p>
  `;
}

/**
 * Create tags section HTML
 * @param {object} project - Project data
 * @returns {string} HTML string
 */
function createTags(project) {
  // Default tags based on technical details
  const tags = ['Product Design', 'UI/UX', 'Design Systems', 'B2B', '0→1'];
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

/**
 * Get metrics for a specific project
 * TODO: Move this data to projects.json
 * @param {string} projectTitle - Project title
 * @returns {Array} Array of metric objects
 */
function getMetricsForProject(projectTitle) {
  const metricsMap = {
    'Marketing Management': [
      { value: 'x1.5', label: 'expected customer growth' },
      { value: '60%', label: 'faster complaint resolution (Facebook-CRM integration)' },
      { value: '4', label: 'departments workflows centralised' }
    ],
    'MkM - Design System': [
      { value: '40%', label: 'front-end independence via design systems docs' },
      { value: '70%', label: 'faster design iteration through reusable components' },
      { value: 'CEO', label: 'buy-in & proof of concept.' }
    ],
    'Tomato Energy Microsite': [
      { value: '40%', label: 'front-end independence via design systems docs' },
      { value: '70%', label: 'faster design iteration through reusable components' },
      { value: 'CEO', label: 'buy-in & proof of concept.' }
    ]
  };

  return metricsMap[projectTitle] || [];
}

/**
 * Get company name for a specific project
 * TODO: Add company to projects.json
 * @param {string} projectTitle - Project title
 * @returns {string} Company name
 */
function getCompanyForProject(projectTitle) {
  const companyMap = {
    'Marketing Management': 'Senapt LTD',
    'MkM - Design System': 'Senapt LTD',
    'Tomato Energy Microsite': ''
  };

  return companyMap[projectTitle] || '';
}
