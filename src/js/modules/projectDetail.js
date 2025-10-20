/**
 * Project Detail Page Module
 * Handles opening/closing project detail pages and navigation
 */

import gsap from 'gsap';
import projectData from '../../data/projects.json';

/**
 * Initialize project detail page functionality
 */
export function initProjectDetail() {
  const detailPage = document.querySelector('#project-detail-page');
  const closeButton = document.querySelector('.project-detail-close');

  if (!detailPage) {
    console.warn('Project detail page not found');
    return;
  }

  // Handle CTA button clicks (e.g., "read case study")
  // Using event delegation since buttons are dynamically generated
  document.addEventListener('click', (e) => {
    const ctaButton = e.target.closest('.cta-button');
    if (ctaButton) {
      e.preventDefault();
      const href = ctaButton.getAttribute('href');

      // Extract project info from the href
      if (href && href.includes('case-study')) {
        const projectId = href.replace('#case-study-', '');
        openProjectDetail(projectId);
      }
    }
  });

  // Handle close button
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      closeProjectDetail();
    });
  }

  // Listen for custom event from breadcrumb clicks (handled in projectCards.js)
  window.addEventListener('openProjectDetail', (e) => {
    const { projectId } = e.detail;
    openProjectDetail(projectId);
  });

  // Handle ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && detailPage.classList.contains('active')) {
      closeProjectDetail();
    }
  });

  console.log('✓ Project detail functionality initialized');
}

/**
 * Open project detail page
 * @param {string} projectId - The project ID (1, 2, or 3)
 */
function openProjectDetail(projectId) {
  const detailPage = document.querySelector('#project-detail-page');
  const body = document.body;

  if (!detailPage) return;

  // Get project data
  const project = projectData[projectId];
  if (!project) {
    console.warn(`No data found for project ${projectId}`);
    return;
  }

  // Set theme
  detailPage.setAttribute('data-theme', project.theme);

  // Update content
  populateProjectContent(project);

  // Update active breadcrumb
  updateActiveBreadcrumb(projectId);

  // Prevent body scroll
  body.style.overflow = 'hidden';

  // Show detail page with animation
  detailPage.classList.add('active');

  // Animate in with GSAP
  gsap.fromTo(
    detailPage,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }
  );

  console.log(`Opened project detail: ${projectId} (${project.theme})`);
}

/**
 * Populate modal with project content
 * @param {object} project - The project data object
 */
function populateProjectContent(project) {
  // Update title and subtitle
  const titleElement = document.querySelector('.detail-title');
  const subtitleElement = document.querySelector('.detail-subtitle');

  if (titleElement) titleElement.textContent = project.title;
  if (subtitleElement) subtitleElement.textContent = project.subtitle;

  // Update written content sections
  const writtenContent = document.querySelector('.detail-written-content');
  if (writtenContent) {
    // Clear existing content after title/subtitle
    const existingSections = writtenContent.querySelectorAll('.detail-section-title, .detail-text');
    existingSections.forEach(el => el.remove());

    // Add new sections
    project.sections.forEach(section => {
      const heading = document.createElement('h3');
      heading.className = 'detail-section-title';
      heading.textContent = section.heading;
      writtenContent.appendChild(heading);

      // Handle multi-paragraph content
      const paragraphs = section.content.split('\n\n');
      paragraphs.forEach(para => {
        if (para.trim()) {
          const p = document.createElement('p');
          p.className = 'detail-text';
          p.textContent = para.trim();
          writtenContent.appendChild(p);
        }
      });
    });
  }

  // Update technical sections
  const technicalContainer = document.querySelector('.detail-technical');
  if (technicalContainer) {
    technicalContainer.innerHTML = '';

    Object.entries(project.technical).forEach(([title, items]) => {
      const h4 = document.createElement('h4');
      h4.className = 'technical-title';
      h4.textContent = title;
      technicalContainer.appendChild(h4);

      const ul = document.createElement('ul');
      ul.className = 'technical-list';
      items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      technicalContainer.appendChild(ul);
    });
  }

  // Update images
  const imagesContainer = document.querySelector('.detail-images');
  if (imagesContainer && project.images) {
    imagesContainer.innerHTML = '';

    project.images.forEach((imageSrc, index) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'detail-image-wrapper';

      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = `${project.title} - Image ${index + 1}`;
      img.className = 'detail-image';

      wrapper.appendChild(img);
      imagesContainer.appendChild(wrapper);
    });
  }
}

/**
 * Close project detail page
 */
function closeProjectDetail() {
  const detailPage = document.querySelector('#project-detail-page');
  const body = document.body;

  if (!detailPage) return;

  // Animate out with GSAP
  gsap.to(detailPage, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      detailPage.classList.remove('active');
      body.style.overflow = '';
    },
  });

  console.log('Closed project detail');
}

/**
 * Update active breadcrumb based on current project
 * @param {string} projectId - The project ID
 */
function updateActiveBreadcrumb(projectId) {
  const breadcrumbLinks = document.querySelectorAll('.breadcrumb-link');

  breadcrumbLinks.forEach((link) => {
    const linkProjectId = link.getAttribute('data-project');

    if (linkProjectId === projectId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Navigate to main page section
 * @param {string} sectionId - The section ID to navigate to
 */
export function navigateToSection(sectionId) {
  closeProjectDetail();

  // Wait for close animation to complete
  setTimeout(() => {
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 300);
}
