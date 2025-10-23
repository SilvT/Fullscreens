/**
 * Case Study Modal Module
 * Traditional case study presentation format
 * Separate from projectDetail.js - both can coexist
 */

import gsap from 'gsap';
import projectData from '../../data/projects.json';
import { updateProjectMetaTags, clearProjectMetaTags } from './structuredData.js';

/**
 * Initialize case study modal functionality
 */
export function initCaseStudy() {
  const caseStudyModal = document.querySelector('#case-study-modal');
  const closeButton = document.querySelector('.case-study-close');

  if (!caseStudyModal) {
    console.warn('Case study modal not found');
    return;
  }

  // Handle case study button clicks
  // You can add buttons with class 'open-case-study' and data-project attribute
  document.addEventListener('click', (e) => {
    const caseStudyButton = e.target.closest('.open-case-study');
    if (caseStudyButton) {
      e.preventDefault();
      const projectId = caseStudyButton.getAttribute('data-project');
      if (projectId) {
        openCaseStudy(projectId);
      }
    }
  });

  // Handle close button
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeCaseStudy();
    });
  }

  // Handle ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && caseStudyModal.classList.contains('active')) {
      closeCaseStudy();
    }
  });

  // Handle backdrop click to close
  caseStudyModal.addEventListener('click', (e) => {
    if (e.target === caseStudyModal) {
      closeCaseStudy();
    }
  });

  console.log('✓ Case study modal initialized');
}

/**
 * Open case study modal
 * @param {string} projectId - The project ID
 */
function openCaseStudy(projectId) {
  const caseStudyModal = document.querySelector('#case-study-modal');
  const body = document.body;

  if (!caseStudyModal) return;

  // Get project data
  const project = projectData[projectId];
  if (!project) {
    console.warn(`No data found for project ${projectId}`);
    return;
  }

  // Store current project ID for navigation
  caseStudyModal.setAttribute('data-current-project', projectId);

  // Set theme
  caseStudyModal.setAttribute('data-theme', project.theme);

  // Populate content
  populateCaseStudy(project, projectId);

  // Update breadcrumbs
  updateBreadcrumbs(projectId);

  // Setup keyboard navigation
  setupKeyboardNavigation();

  // Prevent body scroll
  body.style.overflow = 'hidden';

  // Pause About section animations
  pauseAboutAnimations();

  // Update meta tags for this specific project
  updateProjectMetaTags(projectId);

  // Show modal
  caseStudyModal.classList.add('active');

  // Scroll to top
  const modalContent = caseStudyModal.querySelector('.case-study-content');
  if (modalContent) {
    modalContent.scrollTop = 0;
  }

  // Animate in
  gsap.fromTo(
    caseStudyModal.querySelector('.case-study-container'),
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }
  );

  console.log(`Opened case study: ${projectId} (${project.theme})`);
}

/**
 * Populate case study with project data
 * @param {object} project - The project data object
 */
function populateCaseStudy(project) {
  // Hero section
  const heroTitle = document.querySelector('.cs-hero-title');
  const heroSubtitle = document.querySelector('.cs-hero-subtitle');
  const heroCompany = document.querySelector('.cs-hero-company');
  const heroOverview = document.querySelector('.cs-hero-overview');

  if (heroTitle) heroTitle.textContent = project.title;
  if (heroSubtitle) heroSubtitle.textContent = project.subtitle;
  if (heroCompany) heroCompany.textContent = project.company || '';
  if (heroOverview) heroOverview.textContent = project.cardOverview;

  // Tags
  const tagsContainer = document.querySelector('.cs-hero-tags');
  if (tagsContainer && project.tags) {
    tagsContainer.innerHTML = '';
    project.tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'cs-tag';
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });
  }

  // Metrics
  const metricsContainer = document.querySelector('.cs-metrics-grid');
  if (metricsContainer && project.metrics) {
    metricsContainer.innerHTML = '';
    project.metrics.forEach((metric) => {
      const card = document.createElement('div');
      card.className = 'cs-metric-card';
      card.innerHTML = `
        <div class="cs-metric-value">${metric.value}</div>
        <div class="cs-metric-label">${metric.label}</div>
      `;
      metricsContainer.appendChild(card);
    });
  }

  // Main content sections with blocks (text + images)
  const mainContent = document.querySelector('.cs-main-content');
  if (mainContent && project.sections) {
    mainContent.innerHTML = '';

    project.sections.forEach((section) => {
      const sectionEl = document.createElement('section');
      sectionEl.className = 'cs-content-section';

      const heading = document.createElement('h2');
      heading.className = 'cs-section-heading';
      heading.textContent = section.heading;
      sectionEl.appendChild(heading);

      // Handle blocks (supports both old 'content' format and new 'blocks' format)
      const blocks = section.blocks || [{ type: 'text', content: section.content }];

      blocks.forEach((block) => {
        if (block.type === 'text') {
          // Handle multi-paragraph text content
          const paragraphs = block.content.split('\n\n');
          paragraphs.forEach((para) => {
            if (para.trim()) {
              const p = document.createElement('p');
              p.className = 'cs-section-text';
              p.textContent = para.trim();
              sectionEl.appendChild(p);
            }
          });
        } else if (block.type === 'image') {
          // Handle inline image/graph (within left column)
          const figure = document.createElement('figure');
          figure.className = 'cs-inline-image';

          const img = document.createElement('img');
          img.src = block.src;
          img.alt = block.alt || '';
          img.className = 'cs-inline-img';

          figure.appendChild(img);

          if (block.caption) {
            const figcaption = document.createElement('figcaption');
            figcaption.className = 'cs-image-caption';
            figcaption.textContent = block.caption;
            figure.appendChild(figcaption);
          }

          sectionEl.appendChild(figure);
        } else if (block.type === 'image-full') {
          // Handle full-width image (spans both columns)
          const figure = document.createElement('figure');
          figure.className = 'cs-inline-image-full';

          const img = document.createElement('img');
          img.src = block.src;
          img.alt = block.alt || '';
          img.className = 'cs-inline-img-full';

          figure.appendChild(img);

          if (block.caption) {
            const figcaption = document.createElement('figcaption');
            figcaption.className = 'cs-image-caption';
            figcaption.textContent = block.caption;
            figure.appendChild(figcaption);
          }

          sectionEl.appendChild(figure);
        }
      });

      mainContent.appendChild(sectionEl);
    });
  }

  // Technical sidebar with semantic markup (dl, dt, dd)
  const sidebarContent = document.querySelector('.cs-sidebar-content');
  if (sidebarContent && project.technical) {
    sidebarContent.innerHTML = '';

    Object.entries(project.technical).forEach(([title, items]) => {
      const section = document.createElement('div');
      section.className = 'cs-sidebar-section';

      const h4 = document.createElement('h4');
      h4.className = 'cs-sidebar-title';
      h4.textContent = title;
      h4.setAttribute('id', `sidebar-${title.toLowerCase().replace(/\s+/g, '-')}`);
      section.appendChild(h4);

      // Use definition list for structured data
      const dl = document.createElement('dl');
      dl.className = 'cs-sidebar-list';
      dl.setAttribute('aria-labelledby', h4.id);

      items.forEach((item) => {
        // For items with key-value pairs (e.g., "Role: Designer")
        if (item.includes(':')) {
          const [key, value] = item.split(':').map(s => s.trim());

          const dt = document.createElement('dt');
          dt.textContent = key;
          dt.className = 'cs-sidebar-term';

          const dd = document.createElement('dd');
          dd.textContent = value;
          dd.className = 'cs-sidebar-definition';

          dl.appendChild(dt);
          dl.appendChild(dd);
        } else {
          // For simple list items, use dd only
          const dd = document.createElement('dd');
          dd.textContent = item;
          dd.className = 'cs-sidebar-item';
          dl.appendChild(dd);
        }
      });

      section.appendChild(dl);
      sidebarContent.appendChild(section);
    });
  }

  // Image gallery
  const gallery = document.querySelector('.cs-gallery-grid');
  if (gallery && project.images) {
    gallery.innerHTML = '';

    project.images.forEach((imageSrc, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'cs-gallery-item';

      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = `${project.title} - Image ${index + 1}`;
      img.className = 'cs-gallery-image';

      wrapper.appendChild(img);
      gallery.appendChild(wrapper);
    });
  }
}

/**
 * Close case study modal
 */
function closeCaseStudy() {
  const caseStudyModal = document.querySelector('#case-study-modal');
  const body = document.body;

  if (!caseStudyModal) return;

  // Animate out
  gsap.to(caseStudyModal.querySelector('.case-study-container'), {
    opacity: 0,
    y: 30,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      caseStudyModal.classList.remove('active');
      body.style.overflow = '';

      // Resume About section animations
      resumeAboutAnimations();

      // Clear project-specific meta tags
      clearProjectMetaTags();
    },
  });

  console.log('Closed case study modal');
}

/**
 * Update breadcrumbs navigation
 * @param {string} currentProjectId - Current project ID
 */
function updateBreadcrumbs(currentProjectId) {
  const breadcrumbs = document.querySelector('.cs-breadcrumbs');
  if (!breadcrumbs) return;

  breadcrumbs.innerHTML = '';

  // Get all project IDs
  const projectIds = Object.keys(projectData);

  projectIds.forEach((projectId) => {
    const project = projectData[projectId];

    // Create breadcrumb link
    const link = document.createElement('button');
    link.className = 'cs-breadcrumb-link';
    link.setAttribute('data-project', projectId);
    link.textContent = project.title;

    if (projectId === currentProjectId) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }

    // Click handler
    link.addEventListener('click', () => {
      if (projectId !== currentProjectId) {
        openCaseStudy(projectId);
      }
    });

    breadcrumbs.appendChild(link);

    // Add separator (except for last item)
    if (projectId !== projectIds[projectIds.length - 1]) {
      const separator = document.createElement('span');
      separator.className = 'cs-breadcrumb-separator';
      separator.textContent = '/';
      separator.setAttribute('aria-hidden', 'true');
      breadcrumbs.appendChild(separator);
    }
  });
}

/**
 * Setup keyboard arrow navigation
 */
function setupKeyboardNavigation() {
  const caseStudyModal = document.querySelector('#case-study-modal');
  if (!caseStudyModal) return;

  // Remove previous listener if exists
  if (caseStudyModal._keyboardHandler) {
    document.removeEventListener('keydown', caseStudyModal._keyboardHandler);
  }

  // Create new handler
  const keyboardHandler = (e) => {
    if (!caseStudyModal.classList.contains('active')) return;

    const currentProjectId = caseStudyModal.getAttribute('data-current-project');
    const projectIds = Object.keys(projectData);
    const currentIndex = projectIds.indexOf(currentProjectId);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      // Next project
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % projectIds.length;
      openCaseStudy(projectIds[nextIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      // Previous project
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + projectIds.length) % projectIds.length;
      openCaseStudy(projectIds[prevIndex]);
    }
  };

  // Store handler reference for cleanup
  caseStudyModal._keyboardHandler = keyboardHandler;

  // Add listener
  document.addEventListener('keydown', keyboardHandler);
}

/**
 * Pause About section decorative animations
 */
function pauseAboutAnimations() {
  // Hide ellipse decoration
  const ellipseDecor = document.querySelector('.ellipse-decor');
  if (ellipseDecor) {
    ellipseDecor.classList.remove('visible');
  }

  // Hide scroll hint
  const scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    scrollHint.style.opacity = '0';
  }
}

/**
 * Resume About section decorative animations
 */
function resumeAboutAnimations() {
  // Check if About section is currently in view
  const aboutSection = document.querySelector('#about');
  if (!aboutSection) return;

  const rect = aboutSection.getBoundingClientRect();
  const isInView = rect.top < window.innerHeight && rect.bottom > 0;

  if (isInView) {
    // Show ellipse decoration
    const ellipseDecor = document.querySelector('.ellipse-decor');
    if (ellipseDecor) {
      ellipseDecor.classList.add('visible');
    }

    // Show scroll hint
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) {
      scrollHint.style.opacity = '1';
    }
  }
}
