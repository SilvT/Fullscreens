/**
 * Project Page Module
 * Handles standalone project case study pages
 * Uses the same rendering logic as caseStudy.js modal
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectData from '../data/projects.json';
import { updateProjectMetaTags } from './modules/structuredData.js';
import { initLightbox } from './modules/lightbox.js';
import { trackProjectView } from './modules/analytics.js';
import { renderBlock, loadCaseStudyContent, createMetricCard } from './modules/caseStudy.js';
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
 * Populate case study using the same logic as the modal
 * This is adapted from populateCaseStudy() in caseStudy.js
 */
function populateCaseStudy(project) {
  // Hero section
  const heroTitle = document.querySelector('.cs-hero-title');
  const heroSubtitle = document.querySelector('.cs-hero-subtitle');
  const heroCompany = document.querySelector('.cs-hero-company');
  const heroOverview = document.querySelector('.cs-hero-overview');

  if (heroTitle) heroTitle.innerHTML = project.title;
  if (heroSubtitle) heroSubtitle.innerHTML = project.subtitle;
  if (heroCompany) heroCompany.innerHTML = project.company || '';
  if (heroOverview) heroOverview.innerHTML = project.cardOverview;

  // Tags
  const tagsContainer = document.querySelector('.cs-hero-tags');
  if (tagsContainer && project.tags) {
    tagsContainer.innerHTML = '';
    project.tags.forEach((tag) => {
      const span = document.createElement('span');
      span.className = 'cs-tag';
      span.innerHTML = tag;
      tagsContainer.appendChild(span);
    });
  }

  // Hero Image(s)
  const heroImagesContainer = document.querySelector('.cs-hero-images');
  if (heroImagesContainer) {
    heroImagesContainer.innerHTML = '';

    // Support both single heroImage and multiple heroImages
    let imagesToDisplay = [];
    if (project.heroImage) {
      imagesToDisplay = [project.heroImage];
    } else if (project.heroImages) {
      imagesToDisplay = project.heroImages;
    }

    imagesToDisplay.forEach((imageSrc) => {
      // Wrap image in anchor for lightbox
      const link = document.createElement('a');
      link.href = imageSrc;
      link.className = 'glightbox';
      link.setAttribute('data-gallery', 'case-study-gallery');
      link.setAttribute('data-title', `${project.title}`);

      const img = document.createElement('img');
      img.src = imageSrc;
      img.alt = `${project.title} preview`;
      img.loading = 'eager';

      link.appendChild(img);
      heroImagesContainer.appendChild(link);
    });
  }

  // Metrics (use detailMetrics for case study)
  const metricsContainer = document.querySelector('.cs-metrics-grid');
  const heroMetricsContainer = document.querySelector('.cs-hero-metrics');

  if (metricsContainer && project.detailMetrics) {
    metricsContainer.innerHTML = '';
    if (heroMetricsContainer) {
      heroMetricsContainer.innerHTML = '';
    }

    project.detailMetrics.forEach((metric) => {
      const card = createMetricCard(metric);
      metricsContainer.appendChild(card);

      // Clone metric card for hero section
      if (heroMetricsContainer) {
        const heroCard = createMetricCard(metric);
        heroMetricsContainer.appendChild(heroCard);
      }
    });
  }

  // Content Blocks - Support both inline and lazy-loaded content
  const contentContainer = document.querySelector('.cs-content-container');
  if (contentContainer) {
    // Check if content should be lazy-loaded
    if (project.contentFile) {
      // Show loading state
      contentContainer.innerHTML = '<div class="cs-loading">Loading case study content...</div>';

      // Lazy load content from external file
      loadCaseStudyContent(project.contentFile)
        .then((contentData) => {
          contentContainer.innerHTML = '';

          // Merge lazy-loaded content with base project data
          const mergedProject = { ...project, ...contentData };

          // Update hero with full metadata if available
          if (contentData.subtitle) {
            const subtitleEl = document.querySelector('.cs-hero-subtitle');
            if (subtitleEl) subtitleEl.innerHTML = contentData.subtitle;
          }

          // Update hero overview with story-hook content if available
          if (contentData.contentBlocks) {
            const storyHook = contentData.contentBlocks.find(block => block.type === 'story-hook');
            if (storyHook && heroOverview) {
              // Create story-hook styled content in hero
              heroOverview.innerHTML = '';
              heroOverview.className = 'cs-hero-overview cs-story-hook-style';

              const quote = document.createElement('blockquote');
              quote.className = 'cs-story-hook-quote';
              quote.innerHTML = storyHook.quote;
              heroOverview.appendChild(quote);

              if (storyHook.context) {
                const context = document.createElement('p');
                context.className = 'cs-story-hook-context';
                context.innerHTML = storyHook.context;
                heroOverview.appendChild(context);
              }
            }
          }

          // Update metrics with detailMetrics from contentFile if available
          if (contentData.detailMetrics) {
            const metricsContainer = document.querySelector('.cs-metrics-grid');
            const heroMetricsContainer = document.querySelector('.cs-hero-metrics');

            if (metricsContainer) {
              metricsContainer.innerHTML = '';
              if (heroMetricsContainer) {
                heroMetricsContainer.innerHTML = '';
              }

              contentData.detailMetrics.forEach((metric) => {
                const card = createMetricCard(metric);
                metricsContainer.appendChild(card);

                if (heroMetricsContainer) {
                  const heroCard = createMetricCard(metric);
                  heroMetricsContainer.appendChild(heroCard);
                }
              });
            }
          }

          // Render content blocks (skip story-hook as it's already in hero)
          if (contentData.contentBlocks) {
            contentData.contentBlocks.forEach((block) => {
              // Skip story-hook block since it's displayed in hero
              if (block.type === 'story-hook') return;

              const blockElement = renderBlock(block, mergedProject);
              if (blockElement) {
                contentContainer.appendChild(blockElement);
              }
            });
          }

          // Reinitialize lightbox for dynamically loaded images
          setTimeout(() => {
            initLightbox();
            // Setup hero scroll animation after content is loaded
            setupPageHeroScrollAnimation();
          }, 100);
        })
        .catch((error) => {
          console.error('Error loading case study content:', error);
          contentContainer.innerHTML = '<div class="cs-error">Error loading content. Please try again.</div>';
        });
    } else if (project.contentBlocks) {
      // Use inline content blocks
      contentContainer.innerHTML = '';
      project.contentBlocks.forEach((block) => {
        // Skip story-hook block since it's displayed in hero
        if (block.type === 'story-hook') return;

        const blockElement = renderBlock(block, project);
        if (blockElement) {
          contentContainer.appendChild(blockElement);
        }
      });

      // Setup hero scroll animation after inline content is rendered
      setTimeout(() => {
        setupPageHeroScrollAnimation();
      }, 100);
    }
  }
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
 * Update breadcrumb navigation using same structure as modal
 * Adapted from updateBreadcrumbs() in caseStudy.js
 */
function updateBreadcrumbs(currentProjectId) {
  const breadcrumbs = document.querySelector('.cs-breadcrumbs');
  if (!breadcrumbs) return;

  breadcrumbs.innerHTML = '';

  // Use explicit project order to match card display order
  const currentIndex = PROJECT_ORDER.indexOf(currentProjectId);

  // Get previous and next projects
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : PROJECT_ORDER.length - 1;
  const nextIndex = currentIndex < PROJECT_ORDER.length - 1 ? currentIndex + 1 : 0;

  const prevProjectId = PROJECT_ORDER[prevIndex];
  const nextProjectId = PROJECT_ORDER[nextIndex];

  const prevProject = projectData[prevProjectId];
  const nextProject = projectData[nextProjectId];

  const prevSlug = PROJECT_SLUGS[prevProjectId];
  const nextSlug = PROJECT_SLUGS[nextProjectId];

  // Create previous link (styled as button but using anchor for navigation)
  const prevLink = document.createElement('a');
  prevLink.className = 'cs-breadcrumb-nav cs-breadcrumb-prev';
  prevLink.href = `/${prevSlug}`;
  prevLink.innerHTML = `
    <span class="cs-nav-label">← Previous</span>
    <span class="cs-nav-title">${prevProject.title}</span>
  `;
  breadcrumbs.appendChild(prevLink);

  // Create next link
  const nextLink = document.createElement('a');
  nextLink.className = 'cs-breadcrumb-nav cs-breadcrumb-next';
  nextLink.href = `/${nextSlug}`;
  nextLink.innerHTML = `
    <span class="cs-nav-label">Next →</span>
    <span class="cs-nav-title">${nextProject.title}</span>
  `;
  breadcrumbs.appendChild(nextLink);
}

/**
 * Setup hero scroll animation for standalone pages
 * Adapted from setupHeroScrollAnimation() in caseStudy.js
 */
function setupPageHeroScrollAnimation() {
  const projectContent = document.querySelector('#project-content');
  const stickyHeader = document.querySelector('.cs-sticky-header');
  const metricsSection = document.querySelector('.cs-metrics');

  console.log('setupPageHeroScrollAnimation called');
  console.log('projectContent:', projectContent);
  console.log('stickyHeader:', stickyHeader);
  console.log('metricsSection:', metricsSection);

  if (!projectContent || !stickyHeader) {
    console.error('Missing elements for hero scroll animation');
    return;
  }

  let ticking = false;

  // Scroll handler function
  const handleScroll = () => {
    console.log('handleScroll called');

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        console.log('Scroll event - scrollTop:', scrollTop);

        // Shrink sticky header immediately when user starts scrolling
        if (scrollTop > 0) {
          console.log('Adding scrolled class');
          stickyHeader.classList.add('scrolled');
          // Hide original metrics section when hero is scrolled
          if (metricsSection) {
            metricsSection.style.display = 'none';
          }
        } else {
          console.log('Removing scrolled class');
          stickyHeader.classList.remove('scrolled');
          // Show original metrics section when at top
          if (metricsSection) {
            metricsSection.style.display = 'block';
          }
        }

        ticking = false;
      });

      ticking = true;
    }
  };

  // Try both window and document scroll events
  console.log('Attaching scroll listener...');
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('scroll', handleScroll, { passive: true });

  // Test immediately
  console.log('Testing scroll position on init:', window.pageYOffset);
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

  // Get project data from index
  const project = projectData[projectId];

  if (!project) {
    showError('Project not found');
    return;
  }

  // Update page theme
  const container = document.getElementById('project-content');
  if (container && project.theme) {
    container.setAttribute('data-theme', project.theme);
  }

  // Render content using same logic as modal
  populateCaseStudy(project);

  // Update meta tags for SEO
  updateProjectMetaTags(project);

  // Update breadcrumbs
  updateBreadcrumbs(projectId);

  // Initialize lightbox for images
  setTimeout(() => {
    initLightbox();
  }, 500);

  // Track page view
  trackProjectView(projectId, project.title);

  // Note: setupPageHeroScrollAnimation() is called after content loads
  // in populateCaseStudy() to ensure page has scrollable height

  console.log('Project page initialized');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
