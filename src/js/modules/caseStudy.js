/**
 * Case Study Page Module
 * Full-page case study presentation format (like project-detail)
 * Traditional case study layout with breadcrumb navigation
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import projectData from '../../data/projects.json';
import { updateProjectMetaTags, clearProjectMetaTags } from './structuredData.js';
import { initLightbox, refreshLightbox } from './lightbox.js';
import { trackProjectView, trackCaseStudyInteraction } from './analytics.js';
import '@phosphor-icons/web/light';
import 'iconoir/css/iconoir.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Explicit project order to preserve intended display sequence
 * Must match the order in projectCards.js
 * JavaScript sorts numeric object keys numerically (1,2,3,4,5,6)
 * regardless of JSON file order, so we define the order explicitly
 */
const PROJECT_ORDER = ['1', '2', '3', '4'];

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
 * Create a metric card element
 * @param {object} metric - Metric data with value, label, and optional icon
 * @returns {HTMLElement} - Metric card element
 */
function createMetricCard(metric) {
  const card = document.createElement('div');
  card.className = 'cs-metric-card';

  let iconHTML = '';
  if (metric.icon) {
    const iconElement = renderIcon(metric.icon);
    iconHTML = `
      <div class="cs-metric-icon-wrapper">
        <span class="cs-metric-icon">${iconElement}</span>
      </div>
    `;
  }

  card.innerHTML = `
    <div class="cs-metric-content">
      <div class="cs-metric-top">
        ${iconHTML}
        <div class="cs-metric-value">${metric.value}</div>
      </div>
      <div class="cs-metric-label">${metric.label}</div>
    </div>
    <div class="cs-metric-border" aria-hidden="true"></div>

    <!-- Corner Dots -->
    <div class="cs-metric-dot dot-bottom-right">
      <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
        <circle cx="4" cy="4"  r="3.5" stroke-width="1" />
      </svg>
    </div>
    <div class="cs-metric-dot dot-top-right">
      <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3.5"  stroke-width="1" />
      </svg>
    </div>
    <div class="cs-metric-dot dot-bottom-left">
      <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3.5" stroke-width="1" />
      </svg>
    </div>
    <div class="cs-metric-dot dot-top-left">
      <svg fill="none" preserveAspectRatio="none" viewBox="0 0 8 8">
        <circle cx="4" cy="4" fill="#FCFDFD" r="3.5"  stroke-width="1" />
      </svg>
    </div>
  `;

  return card;
}

/**
 * Initialize case study page functionality
 */
export function initCaseStudy() {
  const caseStudyPage = document.querySelector('#case-study-page');
  const closeButton = document.querySelector('.case-study-close');

  if (!caseStudyPage) {
    return;
  }

  // Handle case study button clicks
  // Support both .open-case-study (with data-project) and .cta-button (with href)
  document.addEventListener('click', (e) => {
    const caseStudyButton = e.target.closest('.open-case-study, .cta-button');

    if (caseStudyButton) {
      e.preventDefault();

      // DIAGNOSTIC: Find which section this button belongs to
      const parentSection = caseStudyButton.closest('section[data-section="project"]');
      const sectionId = parentSection ? parentSection.id : 'unknown';
      const projectTitle = parentSection ? parentSection.querySelector('.project-title')?.textContent : 'unknown';


      const href = caseStudyButton.getAttribute('href');
      const dataProjectId = caseStudyButton.getAttribute('data-project-id');
      const dataProject = caseStudyButton.getAttribute('data-project');

      // Priority order: data-project-id > data-project > href extraction
      let projectId = dataProjectId || dataProject;

      // If not found, try to extract from href attribute
      if (!projectId && href) {
        if (href.includes('case-study')) {
          projectId = href.replace('#case-study-', '');
        }
      }

      if (projectId) {
        openCaseStudy(projectId);
      } else {
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
    if (e.key === 'Escape' && caseStudyPage.classList.contains('active')) {
      closeCaseStudy();
    }
  });

  // Handle backdrop click to close
  caseStudyPage.addEventListener('click', (e) => {
    if (e.target === caseStudyPage) {
      closeCaseStudy();
    }
  });

  // Handle scroll to shrink/expand hero
  setupHeroScrollAnimation();

  // Initialize lightbox
  initLightbox('.glightbox');

}

/**
 * Open case study page
 * @param {string} projectId - The project ID
 */
function openCaseStudy(projectId) {
  const caseStudyPage = document.querySelector('#case-study-page');
  const body = document.body;

  if (!caseStudyPage) return;

  // Get project data
  const project = projectData[projectId];
  if (!project) {
    return;
  }

  // Check if modal is already open (navigating between projects)
  const isAlreadyOpen = caseStudyPage.classList.contains('active');

  if (isAlreadyOpen) {
    // Fade out current content first, then switch
    gsap.to('.cs-hero, .cs-metrics, .cs-layout-grid', {
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        // After fade out, update content
        caseStudyPage.setAttribute('data-current-project', projectId);
        caseStudyPage.setAttribute('data-theme', project.theme);

        // Track project navigation
        trackProjectView(project.title, projectId);
        trackCaseStudyInteraction('navigate', project.title);

        populateCaseStudy(project, projectId);
        updateBreadcrumbs(projectId);
        setupKeyboardNavigation();
        updateProjectMetaTags(projectId);
        caseStudyPage.scrollTop = 0;

        // Reset sticky header to expanded state
        const stickyHeader = document.querySelector('.cs-sticky-header');
        if (stickyHeader) {
          stickyHeader.classList.remove('scrolled');
        }

        // Then fade in new content
        gsap.fromTo(
          '.cs-hero, .cs-metrics, .cs-layout-grid',
          { x: 20, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.25,
            ease: 'power2.out',
          }
        );
      }
    });
  } else {
    // First time opening modal
    // Store current project ID for navigation
    caseStudyPage.setAttribute('data-current-project', projectId);

    // Set theme
    caseStudyPage.setAttribute('data-theme', project.theme);

    // Track project view
    trackProjectView(project.title, projectId);
    trackCaseStudyInteraction('open', project.title);

    // Populate content
    populateCaseStudy(project, projectId);

    // Update breadcrumbs
    updateBreadcrumbs(projectId);

    // Setup keyboard navigation
    setupKeyboardNavigation();

    // Update meta tags for this specific project
    updateProjectMetaTags(projectId);

    // Scroll to top
    caseStudyPage.scrollTop = 0;

    // Reset sticky header to expanded state
    const stickyHeader = document.querySelector('.cs-sticky-header');
    if (stickyHeader) {
      stickyHeader.classList.remove('scrolled');
    }

    // First time opening - prevent body scroll and animate modal in
    body.style.overflow = 'hidden';

    // Pause About section animations
    pauseAboutAnimations();

    // Show page
    caseStudyPage.classList.add('active');

    // Animate in with GSAP - CRITICAL: Reset opacity to 1 (it might be 0 from previous close)
    gsap.fromTo(
      caseStudyPage,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      }
    );
  }

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

          // Initialize lightbox after content is loaded
          refreshLightbox();

          // Setup side navigation
          setTimeout(() => setupSideNavigation(), 100);

          // Setup scroll animations
          setTimeout(() => setupScrollAnimations(), 150);
        })
        .catch((error) => {
          console.error('Failed to load case study content:', error);
          contentContainer.innerHTML = '<div class="cs-error">Failed to load case study content. Please try again.</div>';
        });
    } else if (project.contentBlocks) {
      // Use inline content blocks (skip story-hook as it's already in hero)
      contentContainer.innerHTML = '';
      project.contentBlocks.forEach((block) => {
        // Skip story-hook block since it's displayed in hero
        if (block.type === 'story-hook') return;

        const blockElement = renderBlock(block, project);
        if (blockElement) {
          contentContainer.appendChild(blockElement);
        }
      });

      // Initialize lightbox after inline content is rendered
      refreshLightbox();

      // Setup side navigation
      setTimeout(() => setupSideNavigation(), 100);

      // Setup scroll animations
      setTimeout(() => setupScrollAnimations(), 150);
    }
  }
}

/**
 * Lazy load case study content from external JSON file
 * @param {string} contentFile - Path to content JSON file
 * @returns {Promise<object>} - Promise resolving to content data
 */
async function loadCaseStudyContent(contentFile) {
  try {
    // Add cache-buster in development mode only
    // This forces the browser to fetch fresh content on each modal open
    // In production, files are cached normally for performance
    const cacheBuster = import.meta.env.DEV ? `?t=${Date.now()}` : '';
    const response = await fetch(`${contentFile}${cacheBuster}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading case study content:', error);
    throw error;
  }
}

/**
 * Render a content block based on type
 * @param {object} block - Block configuration
 * @param {object} project - Project data for context
 * @returns {HTMLElement|null} - Rendered block element
 */
function renderBlock(block, project) {
  let element = null;

  switch (block.type) {
    case 'two-column-with-sidebar':
      element = renderTwoColumnWithSidebar(block, project);
      break;
    case 'two-column':
      element = renderTwoColumn(block);
      break;
    case 'two-column-text':
      // Legacy support - alias for two-column
      element = renderTwoColumnText(block);
      break;
    case 'three-column-text':
      element = renderThreeColumnText(block);
      break;
    case 'text-image-split':
      element = renderTextImageSplit(block);
      break;
    case 'full-width-text':
      element = renderFullWidthText(block);
      break;
    case 'full-width-image':
      element = renderFullWidthImage(block);
      break;
    case 'image-grid':
      element = renderImageGrid(block);
      break;
    case 'metrics-inline':
      element = renderMetricsInline(block);
      break;
    case 'metrics-grid':
      element = renderMetricsGrid(block);
      break;
    case 'content-carousel':
      element = renderContentCarousel(block);
      break;
    case 'gallery':
      element = renderGallery(block, project);
      break;
    case 'story-hook':
      element = renderStoryHook(block);
      break;
    case 'timeline-process':
      element = renderTimelineProcess(block);
      break;
    case 'timeline-horizontal-scroll':
      element = renderTimelineHorizontalScroll(block);
      break;
    case 'before-after-comparison':
      element = renderBeforeAfterComparison(block);
      break;
    case 'key-insight':
      element = renderKeyInsight(block);
      break;
    case 'container':
      element = renderContainer(block);
      break;
    case 'image-text-columns':
      element = renderImageTextColumns(block);
      break;
    case 'image-carousel':
      element = renderImageCarousel(block);
      break;
    default:
      return null;
  }

  // Add section title as data attribute if present
  if (element && block.sectionTitle) {
    element.setAttribute('data-section-title', block.sectionTitle);
  }

  return element;
}

/**
 * Render individual text blocks (heading, paragraph, list)
 * @param {object} block - Block configuration
 * @returns {HTMLElement|null} - Rendered block element
 */
function renderTextBlock(block) {
  switch (block.type) {
    case 'heading':
      const heading = document.createElement(block.level || 'h3');
      heading.className = 'cs-text-block-heading';
      // Support HTML in headings
      if (block.html) {
        heading.innerHTML = block.html;
      } else if (block.text) {
        heading.innerHTML = block.text;
      }
      return heading;

    case 'paragraph':
      const p = document.createElement('p');
      p.className = block.class || 'cs-section-text';
      // Support HTML in paragraphs
      if (block.html) {
        p.innerHTML = block.html;
      } else if (block.text) {
        p.innerHTML = block.text;
      }
      return p;

    case 'list':
      const list = document.createElement(block.style || 'ul');
      list.className = 'cs-text-block-list';
      block.items.forEach((item) => {
        const li = document.createElement('li');
        li.innerHTML = item;
        list.appendChild(li);
      });
      return list;

    case 'section':
      // Handle nested section with heading and blocks
      const section = document.createElement('div');
      section.className = 'cs-text-block-section';

      if (block.heading) {
        const sectionHeading = document.createElement('h3');
        sectionHeading.className = 'cs-text-block-heading';
        sectionHeading.innerHTML = block.heading;
        section.appendChild(sectionHeading);
      }

      if (block.blocks) {
        block.blocks.forEach((childBlock) => {
          const childElement = renderTextBlock(childBlock);
          if (childElement) {
            section.appendChild(childElement);
          }
        });
      }

      return section;

    default:
      return null;
  }
}

/**
 * Render two-column layout with sidebar
 * @param {object} block - Block configuration
 * @param {object} project - Project data for context
 */
function renderTwoColumnWithSidebar(block, project) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-block-two-column';

  const layoutGrid = document.createElement('div');
  layoutGrid.className = 'cs-layout-grid';

  // Left column - main content
  const mainContent = document.createElement('div');
  mainContent.className = 'cs-main-content';

  block.left.forEach((section) => {
    const sectionEl = document.createElement('section');
    sectionEl.className = 'cs-content-section';

    if (section.heading) {
      const heading = document.createElement('h2');
      heading.className = 'cs-section-heading';
      heading.innerHTML = section.heading;
      sectionEl.appendChild(heading);
    }

    // Support new blocks structure
    if (section.blocks) {
      section.blocks.forEach((block) => {
        // Try rendering as a full block first (handles container, etc.)
        let blockEl = renderBlock(block, project);
        // If not a full block type, try text block (heading, paragraph, list)
        if (!blockEl) {
          blockEl = renderTextBlock(block);
        }
        if (blockEl) {
          sectionEl.appendChild(blockEl);
        }
      });
    }
    // Fallback to old text structure for backwards compatibility
    else if (section.text) {
      const div = document.createElement('div');
      div.className = 'cs-section-text';
      div.innerHTML = section.text;
      sectionEl.appendChild(div);
    }

    // Inline image (column width)
    if (section.image) {
      const figure = document.createElement('figure');
      figure.className = 'cs-inline-image';

      // Wrap image in anchor for lightbox
      const link = document.createElement('a');
      link.href = section.image.src;
      link.className = 'glightbox';
      link.setAttribute('data-gallery', 'case-study-gallery');

      if (section.image.caption) {
        link.setAttribute('data-description', section.image.caption);
      }

      if (section.image.alt) {
        link.setAttribute('data-title', section.image.alt);
      }

      const img = createImageWithHover(section.image, 'cs-inline-img');
      link.appendChild(img);
      figure.appendChild(link);

      if (section.image.caption) {
        const figcaption = document.createElement('figcaption');
        figcaption.className = 'cs-image-caption';
        figcaption.innerHTML = section.image.caption;
        figure.appendChild(figcaption);
      }

      sectionEl.appendChild(figure);
    }

    // Full-width image within section
    if (section.imageFull) {
      const figure = document.createElement('figure');
      figure.className = 'cs-inline-image-full';

      // Wrap image in anchor for lightbox
      const link = document.createElement('a');
      link.href = section.imageFull.src;
      link.className = 'glightbox';
      link.setAttribute('data-gallery', 'case-study-gallery');

      // Add caption as description for lightbox
      if (section.imageFull.caption) {
        link.setAttribute('data-description', section.imageFull.caption);
      }

      if (section.imageFull.alt) {
        link.setAttribute('data-title', section.imageFull.alt);
      }

      const img = createImageWithHover(section.imageFull, 'cs-inline-img-full');

      link.appendChild(img);
      figure.appendChild(link);

      if (section.imageFull.caption) {
        const figcaption = document.createElement('figcaption');
        figcaption.className = 'cs-image-caption';
        figcaption.innerHTML = section.imageFull.caption;
        figure.appendChild(figcaption);
      }

      sectionEl.appendChild(figure);
    }

    mainContent.appendChild(sectionEl);
  });

  // Right column - sidebar
  const sidebar = document.createElement('aside');
  sidebar.className = 'cs-sidebar';

  // Add custom class if provided
  if (block.sidebarClass) {
    sidebar.className += ' ' + block.sidebarClass;
  }

  const sidebarContent = document.createElement('div');
  sidebarContent.className = 'cs-sidebar-content';

  // Check if sidebar has content
  const hasSidebarContent = block.sidebar && Object.keys(block.sidebar).length > 0;

  if (!hasSidebarContent) {
    sidebar.classList.add('cs-sidebar--empty');
  }

  if (hasSidebarContent) {
    Object.entries(block.sidebar).forEach(([title, items]) => {
      const section = document.createElement('div');
      section.className = 'cs-sidebar-section';

      const h4 = document.createElement('h4');
      h4.className = 'cs-sidebar-title';
      h4.innerHTML = title;
      h4.setAttribute('id', `sidebar-${title.toLowerCase().replace(/\s+/g, '-')}`);
      section.appendChild(h4);

      const dl = document.createElement('dl');
      dl.className = 'cs-sidebar-list';
      dl.setAttribute('aria-labelledby', h4.id);

      items.forEach((item) => {
        if (item.includes(':')) {
          const [key, value] = item.split(':').map(s => s.trim());
          const dt = document.createElement('dt');
          dt.innerHTML = key;
          dt.className = 'cs-sidebar-term';
          const dd = document.createElement('dd');
          dd.innerHTML = value;
          dd.className = 'cs-sidebar-definition';
          dl.appendChild(dt);
          dl.appendChild(dd);
        } else {
          const dd = document.createElement('dd');
          dd.innerHTML = item;
          dd.className = 'cs-sidebar-item';
          dl.appendChild(dd);
        }
      });

      section.appendChild(dl);
      sidebarContent.appendChild(section);
    });
  }

  sidebar.appendChild(sidebarContent);

  layoutGrid.appendChild(mainContent);
  layoutGrid.appendChild(sidebar);
  wrapper.appendChild(layoutGrid);

  return wrapper;
}

/**
 * Render full-width image block
 */
function renderFullWidthImage(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-block-full-image';

  const figure = document.createElement('figure');
  figure.className = 'cs-full-width-image';

  // Wrap image in anchor for lightbox
  const link = document.createElement('a');
  link.href = block.src;
  link.className = 'glightbox';
  link.setAttribute('data-gallery', 'case-study-gallery');
  if (block.alt) {
    link.setAttribute('data-title', block.alt);
  }

  const img = createImageWithHover(block, 'cs-full-img');

  link.appendChild(img);
  figure.appendChild(link);

  if (block.caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'cs-image-caption';
    figcaption.innerHTML = block.caption;
    figure.appendChild(figcaption);
  }

  wrapper.appendChild(figure);
  return wrapper;
}

/**
 * Check if file is a video based on extension
 * @param {string} src - File path
 * @returns {boolean} True if video file
 */
function isVideoFile(src) {
  const videoExtensions = ['.mov', '.mp4', '.webm', '.ogg'];
  return videoExtensions.some(ext => src.toLowerCase().endsWith(ext));
}

/**
 * Create image element with optional hover image swap
 * @param {object} imageData - Image data object with src, alt, hoverImage, etc.
 * @param {string} className - CSS class for the img element
 * @returns {HTMLElement} - Image element (or wrapper if hover image exists)
 */
function createImageWithHover(imageData, className = '') {
  const img = document.createElement('img');
  img.src = imageData.src;
  img.alt = imageData.alt || '';
  if (className) img.className = className;

  // If hoverImage exists, add hover functionality
  if (imageData.hoverImage) {
    const originalSrc = imageData.src;
    const hoverSrc = imageData.hoverImage;

    img.addEventListener('mouseenter', () => {
      img.src = hoverSrc;
    });

    img.addEventListener('mouseleave', () => {
      img.src = originalSrc;
    });

    // Add data attribute for CSS styling if needed
    img.setAttribute('data-has-hover', 'true');
  }

  return img;
}

/**
 * Render image grid block
 */
function renderImageGrid(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-block-image-grid';

  const grid = document.createElement('div');
  grid.className = `cs-image-grid cs-image-grid-${block.columns || 2}`;

  block.images.forEach((image) => {
    const figure = document.createElement('figure');
    figure.className = 'cs-image-grid-item';

    // Check if it's a video file
    if (isVideoFile(image.src)) {
      const video = document.createElement('video');
      video.src = image.src;
      video.className = 'cs-grid-video';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('autoplay', '');
      video.setAttribute('muted', '');
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');
      if (image.alt) {
        video.setAttribute('aria-label', image.alt);
      }
      figure.appendChild(video);
    } else {
      // Wrap image in anchor for lightbox
      const link = document.createElement('a');
      link.href = image.src;
      link.className = 'glightbox';
      link.setAttribute('data-gallery', 'case-study-gallery');
      link.setAttribute('data-grid-image', 'true');

      // Add caption as description for lightbox
      if (image.caption) {
        link.setAttribute('data-description', image.caption);
      }

      if (image.alt) {
        link.setAttribute('data-title', image.alt);
      }

      const img = createImageWithHover(image, 'cs-grid-img');

      link.appendChild(img);
      figure.appendChild(link);
    }

    if (image.caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.className = 'cs-image-caption';
      figcaption.innerHTML = image.caption;
      figure.appendChild(figcaption);
    }

    grid.appendChild(figure);
  });

  wrapper.appendChild(grid);
  return wrapper;
}

/**
 * Render inline metrics block
 */
function renderMetricsInline(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-block-metrics-inline';

  const metricsGrid = document.createElement('div');
  metricsGrid.className = 'cs-metrics-inline-grid';

  block.metrics.forEach((metric) => {
    const card = createMetricCard(metric);
    metricsGrid.appendChild(card);
  });

  wrapper.appendChild(metricsGrid);
  return wrapper;
}

/**
 * Render metrics grid block
 * Creates individual metric cards using the metric-card mixin for each item
 */
function renderMetricsGrid(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-block-metrics-grid';

  if (block.heading) {
    const heading = document.createElement('h2');
    heading.className = 'cs-section-heading';
    heading.textContent = block.heading;
    wrapper.appendChild(heading);
  }

  const metricsGrid = document.createElement('div');
  metricsGrid.className = 'cs-metrics-grid';

  block.metrics.forEach((metric) => {
    // Create individual cards for each item within the metric
    metric.items.forEach((item) => {
      const card = createMetricCard({
        label: metric.title,
        value: item
      });
      metricsGrid.appendChild(card);
    });
  });

  wrapper.appendChild(metricsGrid);
  return wrapper;
}

/**
 * Render content carousel block
 * Creates a horizontal carousel with navigation for cycling through content blocks
 */
function renderContentCarousel(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-block-content-carousel';

  if (block.heading) {
    const heading = document.createElement('h2');
    heading.className = 'cs-section-heading';
    heading.textContent = block.heading;
    wrapper.appendChild(heading);
  }

  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'cs-carousel-container';

  // Navigation buttons
  const prevBtn = document.createElement('button');
  prevBtn.className = 'cs-carousel-nav cs-carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.innerHTML = '<i class="iconoir-nav-arrow-left"></i>';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'cs-carousel-nav cs-carousel-next';
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.innerHTML = '<i class="iconoir-nav-arrow-right"></i>';

  // Carousel track
  const track = document.createElement('div');
  track.className = 'cs-carousel-track';

  // Create slides from items
  block.items.forEach((item, index) => {
    const slide = document.createElement('div');
    slide.className = 'cs-carousel-slide';
    if (index === 0) slide.classList.add('active');

    // Title
    const title = document.createElement('h3');
    title.className = 'cs-carousel-slide-title';
    title.textContent = item.title;
    slide.appendChild(title);

    // Metrics grid for items
    if (item.items && item.items.length > 0) {
      const metricsGrid = document.createElement('div');
      metricsGrid.className = 'cs-carousel-metrics-grid';

      item.items.forEach((metricItem) => {
        let card;

        // Check if item is an object with icon/value/label or just a string
        if (typeof metricItem === 'object' && metricItem !== null) {
          // Full metric card format with icon, value, and label
          card = createMetricCard({
            icon: metricItem.icon,
            value: metricItem.value,
            label: metricItem.label
          });
        } else {
          // Simple text format - use category title as label
          card = createMetricCard({
            label: item.title,
            value: metricItem
          });
        }

        metricsGrid.appendChild(card);
      });

      slide.appendChild(metricsGrid);
    }

    track.appendChild(slide);
  });

  carouselContainer.appendChild(prevBtn);
  carouselContainer.appendChild(track);
  carouselContainer.appendChild(nextBtn);

  // Indicators
  const indicators = document.createElement('div');
  indicators.className = 'cs-carousel-indicators';

  block.items.forEach((_, index) => {
    const indicator = document.createElement('button');
    indicator.className = 'cs-carousel-indicator';
    if (index === 0) indicator.classList.add('active');
    indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
    indicator.dataset.index = index;
    indicators.appendChild(indicator);
  });

  wrapper.appendChild(carouselContainer);
  wrapper.appendChild(indicators);

  // Initialize carousel behavior
  setTimeout(() => initializeCarousel(wrapper, block.items.length), 100);

  return wrapper;
}

/**
 * Initialize carousel navigation and indicators
 */
function initializeCarousel(wrapper, totalSlides) {
  let currentSlide = 0;
  const slides = wrapper.querySelectorAll('.cs-carousel-slide');
  const indicators = wrapper.querySelectorAll('.cs-carousel-indicator');
  const prevBtn = wrapper.querySelector('.cs-carousel-prev');
  const nextBtn = wrapper.querySelector('.cs-carousel-next');

  function goToSlide(index) {
    // Remove active class from current slide and indicator
    slides[currentSlide].classList.remove('active');
    indicators[currentSlide].classList.remove('active');

    // Update current slide
    currentSlide = index;

    // Add active class to new slide and indicator
    slides[currentSlide].classList.add('active');
    indicators[currentSlide].classList.add('active');
  }

  // Previous button
  prevBtn.addEventListener('click', () => {
    const newIndex = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    goToSlide(newIndex);
  });

  // Next button
  nextBtn.addEventListener('click', () => {
    const newIndex = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
    goToSlide(newIndex);
  });

  // Indicator clicks
  indicators.forEach((indicator) => {
    indicator.addEventListener('click', () => {
      const index = parseInt(indicator.dataset.index);
      goToSlide(index);
    });
  });

  // Track if carousel is in viewport
  let isInViewport = false;

  // Intersection Observer to detect when carousel is visible
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -20% 0px', // Trigger when carousel is in middle 60% of viewport
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isInViewport = entry.isIntersecting;
      if (isInViewport) {
        wrapper.setAttribute('data-carousel-active', 'true');
      } else {
        wrapper.removeAttribute('data-carousel-active');
      }
    });
  }, observerOptions);

  observer.observe(wrapper);

  // Global keyboard navigation hijacking
  const handleGlobalKeydown = (e) => {
    if (isInViewport && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      // Prevent default behavior (modal navigation)
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'ArrowLeft') {
        prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        nextBtn.click();
      }
    }
  };

  // Add global listener with capture phase to intercept before modal handlers
  document.addEventListener('keydown', handleGlobalKeydown, true);

  // Clean up observer and event listener when needed
  wrapper.carouselCleanup = () => {
    observer.disconnect();
    document.removeEventListener('keydown', handleGlobalKeydown, true);
  };
}

/**
 * Render gallery block
 */
function renderGallery(block, project) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-block-gallery';

  const gallery = document.createElement('div');
  gallery.className = 'cs-gallery';

  const title = document.createElement('h3');
  title.className = 'cs-section-title';
  title.textContent = 'Gallery';
  gallery.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'cs-gallery-grid';

  block.images.forEach((imageSrc, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'cs-gallery-item';

    // Wrap image in anchor for lightbox
    const link = document.createElement('a');
    link.href = imageSrc;
    link.className = 'glightbox';
    link.setAttribute('data-gallery', 'case-study-gallery');
    link.setAttribute('data-title', `${project.title} - Image ${index + 1}`);

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = `${project.title} - Image ${index + 1}`;
    img.className = 'cs-gallery-image';

    link.appendChild(img);
    wrapper.appendChild(link);
    grid.appendChild(wrapper);
  });

  gallery.appendChild(grid);
  wrapper.appendChild(gallery);
  return wrapper;
}

/**
 * Render full-width text block
 */
function renderFullWidthText(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-block-full-text';

  const section = document.createElement('section');
  section.className = 'cs-full-text-section';

  if (block.heading) {
    const heading = document.createElement('h2');
    heading.className = 'cs-section-heading';
    heading.innerHTML = block.heading;
    section.appendChild(heading);
  }

  if (block.text) {
    const paragraphs = block.text.split('\n\n');
    paragraphs.forEach((para) => {
      if (para.trim()) {
        const p = document.createElement('p');
        p.className = 'cs-section-text';
        p.innerHTML = para.trim();
        section.appendChild(p);
      }
    });
  }

  wrapper.appendChild(section);
  return wrapper;
}

/**
 * Render text-image split block
 */
function renderTextImageSplit(block) {
  const wrapper = document.createElement('div');
  wrapper.className = `cs-block cs-block-text-image cs-layout-${block.layout || 'text-left'}`;

  const grid = document.createElement('div');
  grid.className = 'cs-text-image-grid';

  // Text side
  const textSide = document.createElement('div');
  textSide.className = 'cs-text-side';

  if (block.heading) {
    const heading = document.createElement('h2');
    heading.className = 'cs-section-heading';
    heading.innerHTML = block.heading;
    textSide.appendChild(heading);
  }

  // Support new blocks structure
  if (block.blocks) {
    block.blocks.forEach((childBlock) => {
      // Try rendering as a full block first (handles three-column-text, container, etc.)
      let blockEl = renderBlock(childBlock);
      // If not a full block type, try text block (heading, paragraph, list)
      if (!blockEl) {
        blockEl = renderTextBlock(childBlock);
      }
      if (blockEl) {
        textSide.appendChild(blockEl);
      }
    });
  }
  // Fallback to old text structure for backwards compatibility
  else if (block.text) {
    const paragraphs = block.text.split('\n\n');
    paragraphs.forEach((para) => {
      if (para.trim()) {
        const p = document.createElement('p');
        p.className = 'cs-section-text';
        p.innerHTML = para.trim();
        textSide.appendChild(p);
      }
    });
  }

  // Image side
  const imageSide = document.createElement('div');
  imageSide.className = 'cs-image-side';

  const figure = document.createElement('figure');

  // Wrap image in anchor for lightbox
  const link = document.createElement('a');
  link.href = block.image;
  link.className = 'glightbox';
  link.setAttribute('data-gallery', 'case-study-gallery');

  if (block.caption) {
    link.setAttribute('data-description', block.caption);
  }

  if (block.alt) {
    link.setAttribute('data-title', block.alt);
  }

  // Create image data object for createImageWithHover
  const imageData = {
    src: block.image,
    alt: block.alt || '',
    hoverImage: block.hoverImage
  };

  const img = createImageWithHover(imageData, 'cs-split-img');
  link.appendChild(img);
  figure.appendChild(link);

  if (block.caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'cs-image-caption';
    figcaption.innerHTML = block.caption;
    figure.appendChild(figcaption);
  }

  imageSide.appendChild(figure);

  // Append in order based on layout
  if (block.layout === 'text-right') {
    grid.appendChild(imageSide);
    grid.appendChild(textSide);
  } else {
    grid.appendChild(textSide);
    grid.appendChild(imageSide);
  }

  wrapper.appendChild(grid);
  return wrapper;
}

/**
 * Render story-hook block - Opening engagement moment
 */
function renderStoryHook(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-story-hook';

  const content = document.createElement('div');
  content.className = 'cs-story-hook-content';

  // Quote
  const quote = document.createElement('blockquote');
  quote.className = 'cs-story-hook-quote';
  quote.innerHTML = block.quote;
  content.appendChild(quote);

  // Context
  if (block.context) {
    const context = document.createElement('p');
    context.className = 'cs-story-hook-context';
    context.innerHTML = block.context;
    content.appendChild(context);
  }

  wrapper.appendChild(content);

  // Optional image
  if (block.image) {
    const figure = document.createElement('figure');
    figure.className = 'cs-story-hook-image';

    // Wrap image in anchor for lightbox
    const link = document.createElement('a');
    link.href = block.image;
    link.className = 'glightbox';
    link.setAttribute('data-gallery', 'case-study-gallery');
    if (block.imageAlt) {
      link.setAttribute('data-title', block.imageAlt);
    }

    const img = document.createElement('img');
    img.src = block.image;
    img.alt = block.imageAlt || '';
    link.appendChild(img);
    figure.appendChild(link);

    wrapper.appendChild(figure);
  }

  return wrapper;
}

/**
 * Render timeline-process block - Phase storytelling
 */
function renderTimelineProcess(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-timeline-process';

  if (block.heading) {
    const heading = document.createElement('h2');
    heading.className = 'cs-timeline-heading';
    heading.innerHTML = block.heading;
    wrapper.appendChild(heading);
  }

  const timeline = document.createElement('div');
  timeline.className = 'cs-timeline';

  block.phases.forEach((phase) => {
    const phaseEl = document.createElement('div');
    phaseEl.className = 'cs-timeline-phase';

    // Icon
    if (phase.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = `cs-timeline-icon iconoir-${phase.icon.replace('iconoir:', '')}`;
      iconSpan.innerHTML = `<i class="${phase.icon}"></i>`;
      phaseEl.appendChild(iconSpan);
    }

    // Phase header
    const header = document.createElement('div');
    header.className = 'cs-timeline-phase-header';

    const title = document.createElement('h3');
    title.className = 'cs-timeline-phase-title';
    title.innerHTML = phase.title;
    header.appendChild(title);

    const period = document.createElement('span');
    period.className = 'cs-timeline-phase-period';
    period.innerHTML = phase.period;
    header.appendChild(period);

    phaseEl.appendChild(header);

    /**
     * FLEXIBLE CONTENT STACK
     * Supports two formats:
     *
     * 1. Structured content array (preferred):
     *    content: [
     *      { type: 'p', text: '...' },
     *      { type: 'highlights', items: [...] },
     *      { type: 'list', items: [...] },
     *      { type: 'outcome', text: '...' },
     *      { type: 'learnings', text: '...' }
     *    ]
     *
     * 2. Legacy format (backwards compatibility):
     *    highlights: [...],
     *    outcome: '...',
     *    learnings: '...'
     */
    if (Array.isArray(phase.content)) {
      // New structured format
      phase.content.forEach((item) => {
        switch (item.type) {
          case 'p':
          case 'paragraph': {
            const p = document.createElement('p');
            p.className = 'cs-timeline-paragraph';
            p.innerHTML = item.text;
            phaseEl.appendChild(p);
            break;
          }

          case 'heading': {
            const h4 = document.createElement('h4');
            h4.className = 'cs-timeline-sub-heading';
            h4.innerHTML = item.text;
            phaseEl.appendChild(h4);
            break;
          }

          case 'highlights': {
            const ul = document.createElement('ul');
            ul.className = 'cs-timeline-highlights';
            item.items.forEach((txt) => {
              const li = document.createElement('li');
              li.innerHTML = txt;
              ul.appendChild(li);
            });
            phaseEl.appendChild(ul);
            break;
          }

          case 'list': {
            const ul = document.createElement('ul');
            ul.className = 'cs-timeline-list';
            item.items.forEach((txt) => {
              const li = document.createElement('li');
              li.innerHTML = txt;
              ul.appendChild(li);
            });
            phaseEl.appendChild(ul);
            break;
          }

          case 'outcome': {
            const outcome = document.createElement('p');
            outcome.className = 'cs-timeline-outcome';
            outcome.innerHTML = item.text;
            phaseEl.appendChild(outcome);
            break;
          }

          case 'learnings': {
            const learn = document.createElement('p');
            learn.className = 'cs-timeline-learnings';
            learn.innerHTML = item.text;
            phaseEl.appendChild(learn);
            break;
          }
        }
      });
    } else {
      // Legacy format - direct properties on phase object
      // Handle highlights array
      if (phase.highlights && Array.isArray(phase.highlights)) {
        const ul = document.createElement('ul');
        ul.className = 'cs-timeline-highlights';
        phase.highlights.forEach((txt) => {
          const li = document.createElement('li');
          li.innerHTML = txt;
          ul.appendChild(li);
        });
        phaseEl.appendChild(ul);
      }

      // Handle outcome string
      if (phase.outcome) {
        const outcome = document.createElement('p');
        outcome.className = 'cs-timeline-outcome';
        outcome.innerHTML = phase.outcome;
        phaseEl.appendChild(outcome);
      }

      // Handle learnings string
      if (phase.learnings) {
        const learn = document.createElement('p');
        learn.className = 'cs-timeline-learnings';
        learn.innerHTML = phase.learnings;
        phaseEl.appendChild(learn);
      }
    }

    timeline.appendChild(phaseEl);
  });

  wrapper.appendChild(timeline);
  return wrapper;
}

/**
 * Render timeline-horizontal-scroll block - Horizontal scroll-hijacking timeline
 */
function renderTimelineHorizontalScroll(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-timeline-horizontal-scroll';
  wrapper.setAttribute('data-scroll-hijack', 'true');

  if (block.heading) {
    const heading = document.createElement('h2');
    heading.className = 'cs-timeline-hs-heading';
    heading.innerHTML = block.heading;
    wrapper.appendChild(heading);
  }

  // Timeline container (will be horizontally scrolled)
  const container = document.createElement('div');
  container.className = 'cs-timeline-hs-container';

  // Phase tabs navigation
  const tabsNav = document.createElement('div');
  tabsNav.className = 'cs-timeline-hs-tabs';

  block.phases.forEach((phase, index) => {
    const tab = document.createElement('button');
    tab.className = 'cs-timeline-hs-tab';
    if (index === 0) tab.classList.add('active');
    tab.setAttribute('data-phase-index', index);

    // Icon
    if (phase.icon) {
      const iconSpan = document.createElement('span');
      iconSpan.className = 'cs-timeline-hs-tab-icon';
      iconSpan.innerHTML = renderIcon(phase.icon);
      tab.appendChild(iconSpan);
    }

    // Title and period
    const textWrapper = document.createElement('div');
    textWrapper.className = 'cs-timeline-hs-tab-text';

    const title = document.createElement('span');
    title.className = 'cs-timeline-hs-tab-title';
    title.innerHTML = phase.title;
    textWrapper.appendChild(title);

    if (phase.period) {
      const period = document.createElement('span');
      period.className = 'cs-timeline-hs-tab-period';
      period.innerHTML = phase.period;
      textWrapper.appendChild(period);
    }

    tab.appendChild(textWrapper);
    tabsNav.appendChild(tab);
  });

  // Progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'cs-timeline-hs-progress-bar';
  const progressFill = document.createElement('div');
  progressFill.className = 'cs-timeline-hs-progress-fill';
  progressBar.appendChild(progressFill);
  tabsNav.appendChild(progressBar);

  container.appendChild(tabsNav);

  // Phases content (horizontal scroll container)
  const phasesWrapper = document.createElement('div');
  phasesWrapper.className = 'cs-timeline-hs-phases-wrapper';

  const phasesContainer = document.createElement('div');
  phasesContainer.className = 'cs-timeline-hs-phases';

  block.phases.forEach((phase, index) => {
    const phaseEl = document.createElement('div');
    phaseEl.className = 'cs-timeline-hs-phase';
    if (index === 0) phaseEl.classList.add('active');
    phaseEl.setAttribute('data-phase-index', index);

    // Wrap context and content in a container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'cs-timeline-hs-content-container';

    // Context paragraph (optional)
    if (phase.context) {
      const context = document.createElement('p');
      context.className = 'cs-timeline-hs-context';
      context.innerHTML = phase.context;
      contentContainer.appendChild(context);
    }

    // Flexible content stack with section grouping
    if (Array.isArray(phase.content)) {
      let currentSection = null;

      phase.content.forEach((item, index) => {
        // Create new section when we encounter a heading
        if (item.type === 'heading') {
          // Close previous section if exists
          if (currentSection) {
            contentContainer.appendChild(currentSection);
          }

          // Create new section wrapper
          currentSection = document.createElement('div');
          currentSection.className = 'cs-timeline-hs-section';

          const h4 = document.createElement('h4');
          h4.className = 'cs-timeline-hs-sub-heading';
          h4.innerHTML = item.text;
          currentSection.appendChild(h4);
        } else {
          // If no current section, create one (for content without heading)
          if (!currentSection) {
            currentSection = document.createElement('div');
            currentSection.className = 'cs-timeline-hs-section';
          }

          switch (item.type) {
            case 'paragraph': {
              const p = document.createElement('p');
              p.className = 'cs-timeline-hs-paragraph';
              p.innerHTML = item.text;
              currentSection.appendChild(p);
              break;
            }

            case 'highlights': {
              const ul = document.createElement('ul');
              ul.className = 'cs-timeline-hs-highlights';
              item.items.forEach((txt) => {
                const li = document.createElement('li');
                li.innerHTML = txt;
                ul.appendChild(li);
              });
              currentSection.appendChild(ul);
              break;
            }
          }
        }

        // Append last section at the end
        if (index === phase.content.length - 1 && currentSection) {
          contentContainer.appendChild(currentSection);
        }
      });
    }

    // Append content container to phase
    phaseEl.appendChild(contentContainer);

    // Wrap insight and learning in a container
    if (phase.insight || phase.learning || phase.action) {
      const bottomContainer = document.createElement('div');
      bottomContainer.className = 'cs-timeline-hs-bottom-container';

      // Insight box at bottom (with customizable icon)
      if (phase.insight) {
        const insightBox = document.createElement('div');
        insightBox.className = 'cs-timeline-hs-insight';

        // Icon
        if (phase.insight.icon) {
          const iconSpan = document.createElement('span');
          iconSpan.className = 'cs-timeline-hs-insight-icon';
          iconSpan.innerHTML = renderIcon(phase.insight.icon);
          insightBox.appendChild(iconSpan);
        }

        const insightText = document.createElement('p');
        insightText.className = 'cs-timeline-hs-insight-text';
        insightText.innerHTML = phase.insight.text;
        insightBox.appendChild(insightText);

        bottomContainer.appendChild(insightBox);
      }

      // Learning sidebar (optional)
      if (phase.learning) {
        const learningSidebar = document.createElement('div');
        learningSidebar.className = 'cs-timeline-hs-learning';
        learningSidebar.innerHTML = phase.learning.text;
        bottomContainer.appendChild(learningSidebar);
      }

      // Action element (optional - for buttons, CTAs, etc.)
      if (phase.action) {
        const actionContainer = document.createElement('div');
        actionContainer.className = 'cs-timeline-hs-action';
        actionContainer.innerHTML = phase.action.html || phase.action;
        bottomContainer.appendChild(actionContainer);
      }

      phaseEl.appendChild(bottomContainer);
    }

    phasesContainer.appendChild(phaseEl);
  });

  phasesWrapper.appendChild(phasesContainer);
  container.appendChild(phasesWrapper);
  wrapper.appendChild(container);

  // Setup horizontal scroll behavior after render
  setTimeout(() => setupHorizontalScrollTimeline(wrapper, block.phases.length), 100);

  return wrapper;
}

/**
 * Setup horizontal scroll hijacking for timeline
 * @param {HTMLElement} wrapper - Timeline wrapper element
 * @param {number} phaseCount - Number of phases
 */
function setupHorizontalScrollTimeline(wrapper, phaseCount) {
  const caseStudyPage = document.querySelector('#case-study-page');
  if (!caseStudyPage) return;

  const tabs = wrapper.querySelectorAll('.cs-timeline-hs-tab');
  const phases = wrapper.querySelectorAll('.cs-timeline-hs-phase');
  const progressFill = wrapper.querySelector('.cs-timeline-hs-progress-fill');

  let currentPhase = 0;

  // Click tab to navigate
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      setPhase(index);
    });
  });

  function setPhase(index) {
    currentPhase = Math.max(0, Math.min(index, phaseCount - 1));

    // Update active states
    tabs.forEach((tab, i) => {
      if (i === currentPhase) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    phases.forEach((phase, i) => {
      if (i === currentPhase) {
        phase.classList.add('active');
      } else {
        phase.classList.remove('active');
      }
    });

    // Update progress bar
    const progress = (currentPhase / (phaseCount - 1)) * 100;
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  // Scroll hijacking logic
  caseStudyPage.addEventListener('scroll', () => {
    const rect = wrapper.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Check if timeline is in viewport
    const isInView = rect.top < viewportHeight && rect.bottom > 0;

    if (isInView) {
      // Calculate scroll progress through this section
      const sectionHeight = rect.height;
      const scrollOffset = viewportHeight - rect.top;
      const progress = Math.max(0, Math.min(1, scrollOffset / sectionHeight));

      // Map progress to phases
      const phaseProgress = progress * (phaseCount - 1);
      const targetPhase = Math.floor(phaseProgress);

      if (targetPhase !== currentPhase) {
        setPhase(targetPhase);
      }
    }
  });

  // Initialize first phase
  setPhase(0);
}


/**
 * Render before-after-comparison block - Impact visualization
 */
function renderBeforeAfterComparison(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-before-after';

  if (block.heading) {
    const heading = document.createElement('h2');
    heading.className = 'cs-before-after-heading';
    heading.innerHTML = block.heading;
    wrapper.appendChild(heading);
  }

  const grid = document.createElement('div');
  grid.className = 'cs-before-after-grid';

  // Before column
  const beforeCol = document.createElement('div');
  beforeCol.className = 'cs-before-after-col cs-before-col';

  const beforeLabel = document.createElement('h3');
  beforeLabel.className = 'cs-before-after-label';
  beforeLabel.innerHTML = block.before.label || 'Before';
  beforeCol.appendChild(beforeLabel);

  if (block.before.items && block.before.items.length > 0) {
    const beforeList = document.createElement('ul');
    beforeList.className = 'cs-before-after-list cs-before-list';

    block.before.items.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="iconoir-xmark"></i><span>${item}</span>`;
      beforeList.appendChild(li);
    });

    beforeCol.appendChild(beforeList);
  }

  if (block.before.image) {
    // Wrap image in anchor for lightbox
    const link = document.createElement('a');
    link.href = block.before.image;
    link.className = 'glightbox';
    link.setAttribute('data-gallery', 'case-study-gallery');
    link.setAttribute('data-title', block.before.imageAlt || 'Before state');

    const img = document.createElement('img');
    img.src = block.before.image;
    img.alt = block.before.imageAlt || 'Before state';
    img.className = 'cs-before-after-image';
    link.appendChild(img);
    beforeCol.appendChild(link);
  }

  grid.appendChild(beforeCol);

  // After column
  const afterCol = document.createElement('div');
  afterCol.className = 'cs-before-after-col cs-after-col';

  const afterLabel = document.createElement('h3');
  afterLabel.className = 'cs-before-after-label';
  afterLabel.innerHTML = block.after.label || 'After';
  afterCol.appendChild(afterLabel);

  if (block.after.items && block.after.items.length > 0) {
    const afterList = document.createElement('ul');
    afterList.className = 'cs-before-after-list cs-after-list';

    block.after.items.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="iconoir-check"></i><span>${item}</span>`;
      afterList.appendChild(li);
    });

    afterCol.appendChild(afterList);
  }

  if (block.after.image) {
    // Wrap image in anchor for lightbox
    const link = document.createElement('a');
    link.href = block.after.image;
    link.className = 'glightbox';
    link.setAttribute('data-gallery', 'case-study-gallery');
    link.setAttribute('data-title', block.after.imageAlt || 'After state');

    const img = document.createElement('img');
    img.src = block.after.image;
    img.alt = block.after.imageAlt || 'After state';
    img.className = 'cs-before-after-image';
    link.appendChild(img);
    afterCol.appendChild(link);
  }

  grid.appendChild(afterCol);
  wrapper.appendChild(grid);

  return wrapper;
}

/**
 * Render key-insight block - Callout/highlight moment
 */
function renderKeyInsight(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-key-insight';

  const content = document.createElement('div');
  content.className = 'cs-key-insight-content';

  // Icon and title in header
  const header = document.createElement('div');
  header.className = 'cs-key-insight-header';

  if (block.icon) {
    const icon = document.createElement('span');
    icon.className = `cs-key-insight-icon ${block.icon}`;
    icon.innerHTML = `<i class="${block.icon}"></i>`;
    header.appendChild(icon);
  }

  if (block.title) {
    const title = document.createElement('h3');
    title.className = 'cs-key-insight-title';
    title.innerHTML = block.title;
    header.appendChild(title);
  }

  content.appendChild(header);

  // Insight text
  if (block.insight) {
    const insight = document.createElement('p');
    insight.className = 'cs-key-insight-text';
    insight.innerHTML = block.insight;
    content.appendChild(insight);
  }

  // Result
  if (block.result) {
    const result = document.createElement('p');
    result.className = 'cs-key-insight-result';
    result.innerHTML = `<strong>→ Result:</strong> ${block.result}`;
    content.appendChild(result);
  }

  wrapper.appendChild(content);
  return wrapper;
}

/**
 * Render two-column block (supports text and images)
 * @param {object} block - Block configuration with columns array
 * @returns {HTMLElement} - Rendered two-column element
 */
function renderTwoColumn(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-block-two-column';

  const grid = document.createElement('div');
  grid.className = 'cs-two-column-grid';

  // Render each column
  if (block.columns && block.columns.length > 0) {
    block.columns.forEach((column) => {
      const columnEl = document.createElement('div');
      columnEl.className = 'cs-column';

      // Column heading
      if (column.heading) {
        const heading = document.createElement('h3');
        heading.className = 'cs-column-heading';
        heading.innerHTML = column.heading;
        columnEl.appendChild(heading);
      }

      // Column blocks (supports both full blocks and text blocks)
      if (column.blocks) {
        column.blocks.forEach((block) => {
          // Try rendering as a full block first (handles image-carousel, etc.)
          let blockEl = renderBlock(block);
          // If not a full block type, try text block (heading, paragraph, list)
          if (!blockEl) {
            blockEl = renderTextBlock(block);
          }
          if (blockEl) {
            columnEl.appendChild(blockEl);
          }
        });
      }

      // Column image (optional)
      if (column.image) {
        const figure = document.createElement('figure');
        figure.className = 'cs-column-image';

        // Wrap image in anchor for lightbox
        const link = document.createElement('a');
        link.href = column.image;
        link.className = 'glightbox';
        link.setAttribute('data-gallery', 'case-study-gallery');

        if (column.alt) {
          link.setAttribute('data-title', column.alt);
        }

        if (column.caption) {
          link.setAttribute('data-description', column.caption);
        }

        const imageData = {
          src: column.image,
          alt: column.alt || '',
          hoverImage: column.hoverImage
        };

        const img = createImageWithHover(imageData, 'cs-column-img');
        link.appendChild(img);
        figure.appendChild(link);

        if (column.caption) {
          const figcaption = document.createElement('figcaption');
          figcaption.className = 'cs-image-caption';
          figcaption.innerHTML = column.caption;
          figure.appendChild(figcaption);
        }

        columnEl.appendChild(figure);
      }

      grid.appendChild(columnEl);
    });
  }

  wrapper.appendChild(grid);
  return wrapper;
}

/**
 * Legacy alias for backward compatibility
 */
function renderTwoColumnText(block) {
  return renderTwoColumn(block);
}

/**
 * Render three-column text block
 * @param {object} block - Block configuration with columns array
 * @returns {HTMLElement} - Rendered three-column element
 */
function renderThreeColumnText(block) {
  const wrapper = document.createElement('div');
  wrapper.className = `cs-block cs-block-three-column-text${block.class ? ' ' + block.class : ''}`;

  const grid = document.createElement('div');
  grid.className = 'cs-three-column-grid';

  // Render each column
  if (block.columns && block.columns.length > 0) {
    block.columns.forEach((column) => {
      const columnEl = document.createElement('div');
      columnEl.className = `cs-text-column${column.class ? ' ' + column.class : ''}`;

      // Column heading
      if (column.heading) {
        const heading = document.createElement('h3');
        heading.className = 'cs-column-heading';
        heading.innerHTML = column.heading;
        columnEl.appendChild(heading);
      }

      // Column blocks
      if (column.blocks) {
        column.blocks.forEach((block) => {
          const blockEl = renderTextBlock(block);
          if (blockEl) {
            columnEl.appendChild(blockEl);
          }
        });
      }

      grid.appendChild(columnEl);
    });
  }

  wrapper.appendChild(grid);
  return wrapper;
}

/**
 * Render container block - Generic div wrapper for flexible layouts
 * @param {object} block - Block configuration with blocks array
 * @returns {HTMLElement} - Rendered container element
 */
function renderContainer(block) {
  const wrapper = document.createElement('div');
  wrapper.className = `cs-block cs-container${block.class ? ' ' + block.class : ''}`;

  // Optional heading
  if (block.heading) {
    const heading = document.createElement('h3');
    heading.className = 'cs-container-heading';
    heading.innerHTML = block.heading;
    wrapper.appendChild(heading);
  }

  // Render nested blocks
  if (block.blocks) {
    block.blocks.forEach((childBlock) => {
      // Handle raw HTML blocks
      if (childBlock.html) {
        const div = document.createElement('div');
        div.innerHTML = childBlock.html;
        wrapper.appendChild(div);
      } else {
        // Handle structured text blocks (heading, paragraph, list)
        const blockEl = renderTextBlock(childBlock);
        if (blockEl) {
          wrapper.appendChild(blockEl);
        }
      }
    });
  }

  return wrapper;
}

/**
 * Render image-text-columns block - Two columns with images on left, text on right
 * @param {object} block - Block configuration
 * @returns {HTMLElement} - Rendered image-text-columns element
 */
function renderImageTextColumns(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-image-text-columns';

  const grid = document.createElement('div');
  grid.className = 'cs-image-text-grid';

  // Images column
  const imagesCol = document.createElement('div');
  imagesCol.className = 'cs-images-column';

  // Images wrapper
  const imagesWrapper = document.createElement('div');
  imagesWrapper.className = 'cs-images-wrapper';

  if (block.images && block.images.length > 0) {
    block.images.forEach((image, index) => {
      // Wrap image in lightbox anchor
      const link = document.createElement('a');
      link.href = image.src || image;
      link.className = 'glightbox';
      link.setAttribute('data-gallery', 'case-study-gallery');
      link.setAttribute('data-title', image.alt || '');

      const img = document.createElement('img');
      img.src = image.src || image;
      img.alt = image.alt || '';

      // Add class for hover behavior on second image
      if (index === 1 && block.images.length === 2) {
        link.classList.add('cs-image-hover');
      }

      link.appendChild(img);
      imagesWrapper.appendChild(link);
    });
  }

  imagesCol.appendChild(imagesWrapper);

  // Caption for all images (optional) - supports both 'caption' and legacy 'imagesCaption'
  if (block.caption || block.imagesCaption) {
    const caption = document.createElement('p');
    caption.className = 'cs-images-caption';
    caption.innerHTML = block.caption || block.imagesCaption;
    imagesCol.appendChild(caption);
  }

  grid.appendChild(imagesCol);

  // Text column
  const textCol = document.createElement('div');
  textCol.className = 'cs-text-column';

  if (block.heading) {
    const heading = document.createElement('h3');
    heading.innerHTML = block.heading;
    textCol.appendChild(heading);
  }

  // Support both simple text and blocks structure
  if (block.blocks && block.blocks.length > 0) {
    // Render multiple blocks (paragraphs, lists, etc.)
    block.blocks.forEach((childBlock) => {
      const blockEl = renderTextBlock(childBlock);
      if (blockEl) {
        textCol.appendChild(blockEl);
      }
    });
  } else if (block.text) {
    // Fallback to simple text
    const p = document.createElement('p');
    p.innerHTML = block.text;
    textCol.appendChild(p);
  }

  grid.appendChild(textCol);
  wrapper.appendChild(grid);

  return wrapper;
}

/**
 * Render image carousel block - Simple auto-rotating image stack
 * @param {object} block - Block configuration
 * @returns {HTMLElement} - Rendered carousel element
 */
function renderImageCarousel(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'cs-block cs-image-carousel';

  const carouselContainer = document.createElement('div');
  carouselContainer.className = 'cs-carousel-container';

  if (block.images && block.images.length > 0) {
    block.images.forEach((image, index) => {
      const slide = document.createElement('div');
      slide.className = 'cs-carousel-slide';
      if (index === 0) slide.classList.add('active');

      // Wrap image in lightbox anchor
      const link = document.createElement('a');
      link.href = image.src || image;
      link.className = 'glightbox';
      link.setAttribute('data-gallery', 'case-study-gallery');

      const alt = image.alt || block.alt || '';
      if (alt) {
        link.setAttribute('data-title', alt);
      }

      const imageData = {
        src: image.src || image,
        alt: alt,
        hoverImage: image.hoverImage
      };

      const img = createImageWithHover(imageData, 'cs-carousel-img');
      link.appendChild(img);
      slide.appendChild(link);

      carouselContainer.appendChild(slide);
    });

    // Add caption if provided
    if (block.caption) {
      const caption = document.createElement('p');
      caption.className = 'cs-carousel-caption cs-image-caption';
      caption.innerHTML = block.caption;
      wrapper.appendChild(caption);
    }

    // Start auto-rotation
    let currentIndex = 0;
    const slides = carouselContainer.querySelectorAll('.cs-carousel-slide');
    const interval = block.interval || 3000; // Default 3 seconds

    setInterval(() => {
      slides[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add('active');
    }, interval);
  }

  wrapper.appendChild(carouselContainer);
  return wrapper;
}

/**
 * Close case study page
 */
function closeCaseStudy() {
  const caseStudyPage = document.querySelector('#case-study-page');
  const body = document.body;
  const sideNav = document.querySelector('.cs-side-nav');

  if (!caseStudyPage) return;

  // Track case study close
  const currentProjectId = caseStudyPage.getAttribute('data-current-project');
  if (currentProjectId) {
    const project = projectData[currentProjectId];
    if (project) {
      trackCaseStudyInteraction('close', project.title);
    }
  }

  // Hide side navigation
  if (sideNav) {
    sideNav.classList.remove('active');
  }

  // Animate out (like project-detail)
  gsap.to(caseStudyPage, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: () => {
      caseStudyPage.classList.remove('active');
      body.style.overflow = '';

      // Resume About section animations
      resumeAboutAnimations();

      // Clear project-specific meta tags
      clearProjectMetaTags();
    },
  });

}

/**
 * Update breadcrumbs navigation
 * @param {string} currentProjectId - Current project ID
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

  // Create previous button
  const prevButton = document.createElement('button');
  prevButton.className = 'cs-breadcrumb-nav cs-breadcrumb-prev';
  prevButton.setAttribute('data-project', prevProjectId);
  prevButton.innerHTML = `
    <span class="cs-nav-label">← Previous</span>
    <span class="cs-nav-title">${prevProject.title}</span>
  `;
  prevButton.addEventListener('click', () => openCaseStudy(prevProjectId));
  breadcrumbs.appendChild(prevButton);

  // Create next button
  const nextButton = document.createElement('button');
  nextButton.className = 'cs-breadcrumb-nav cs-breadcrumb-next';
  nextButton.setAttribute('data-project', nextProjectId);
  nextButton.innerHTML = `
    <span class="cs-nav-label">Next →</span>
    <span class="cs-nav-title">${nextProject.title}</span>
  `;
  nextButton.addEventListener('click', () => openCaseStudy(nextProjectId));
  breadcrumbs.appendChild(nextButton);
}

/**
 * Setup keyboard arrow navigation
 */
function setupKeyboardNavigation() {
  const caseStudyPage = document.querySelector('#case-study-page');
  if (!caseStudyPage) return;

  // Remove previous listener if exists
  if (caseStudyPage._keyboardHandler) {
    document.removeEventListener('keydown', caseStudyPage._keyboardHandler);
  }

  // Create new handler
  const keyboardHandler = (e) => {
    if (!caseStudyPage.classList.contains('active')) return;

    const currentProjectId = caseStudyPage.getAttribute('data-current-project');
    // Use explicit project order to match card display order
    const currentIndex = PROJECT_ORDER.indexOf(currentProjectId);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      // Next project
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % PROJECT_ORDER.length;
      openCaseStudy(PROJECT_ORDER[nextIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      // Previous project
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + PROJECT_ORDER.length) % PROJECT_ORDER.length;
      openCaseStudy(PROJECT_ORDER[prevIndex]);
    }
  };

  // Store handler reference for cleanup
  caseStudyPage._keyboardHandler = keyboardHandler;

  // Add listener
  document.addEventListener('keydown', keyboardHandler);
}

/**
 * Setup hero scroll animation
 * Shrinks sticky header (breadcrumbs + close button + hero) when scrolling down
 */
function setupHeroScrollAnimation() {
  const caseStudyPage = document.querySelector('#case-study-page');
  const stickyHeader = document.querySelector('.cs-sticky-header');
  const metricsSection = document.querySelector('.cs-metrics');

  if (!caseStudyPage || !stickyHeader) return;

  let ticking = false;

  caseStudyPage.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = caseStudyPage.scrollTop;

        // Shrink sticky header immediately when user starts scrolling
        if (scrollTop > 0) {
          stickyHeader.classList.add('scrolled');
          // Hide original metrics section when hero is scrolled
          if (metricsSection) {
            metricsSection.style.display = 'none';
          }
        } else {
          stickyHeader.classList.remove('scrolled');
          // Show original metrics section when back at top
          if (metricsSection) {
            metricsSection.style.display = 'block';
          }
        }

        ticking = false;
      });

      ticking = true;
    }
  });
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


/**
 * Setup side navigation for case study content
 * Generates numbered nav items for each content block and tracks scroll position
 */
function setupSideNavigation() {
  const caseStudyPage = document.querySelector('#case-study-page');
  if (!caseStudyPage) return;

  // Side nav is now outside case-study-page for true fixed positioning
  const sideNav = document.querySelector('.cs-side-nav');
  const navList = document.querySelector('.cs-side-nav-list');
  const indicator = document.querySelector('.cs-side-nav-indicator');
  const contentContainer = caseStudyPage.querySelector('.cs-content-container');

  if (!sideNav || !navList || !indicator) return;

  // Find all navigable sections - only blocks with sectionTitle
  const sections = [];
  const sectionTitles = [];

  // Add content blocks that have sectionTitle attribute
  if (contentContainer) {
    const allBlocks = contentContainer.querySelectorAll('.cs-block');
    allBlocks.forEach((block) => {
      const sectionTitle = block.getAttribute('data-section-title');
      if (sectionTitle) {
        sections.push(block);
        sectionTitles.push(sectionTitle);
      }
    });
  }

  if (sections.length === 0) return;

  // Clear existing nav items
  navList.innerHTML = '';

  // Generate nav items
  sections.forEach((section, index) => {
    // Add ID to section for anchoring
    section.id = `cs-section-${index + 1}`;

    // Create nav item
    const li = document.createElement('li');
    li.className = 'cs-side-nav-item';

    const link = document.createElement('a');
    link.className = 'cs-side-nav-link';
    link.href = `#cs-section-${index + 1}`;
    link.dataset.sectionIndex = index;

    // Create label element for section title
    if (sectionTitles[index]) {
      const label = document.createElement('span');
      label.className = 'cs-side-nav-label';
      label.textContent = sectionTitles[index];
      link.appendChild(label);
    }

    // Create number element
    const number = document.createElement('span');
    number.className = 'cs-side-nav-number';
    number.textContent = String(index + 1).padStart(2, '0');
    link.appendChild(number);

    // Smooth scroll on click
    link.addEventListener('click', (e) => {
      e.preventDefault();
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    li.appendChild(link);
    navList.appendChild(li);
  });

  // Show side nav only when hero is collapsed
  const checkHeroCollapse = () => {
    const scrollTop = caseStudyPage.scrollTop;
    if (scrollTop > 0) {
      sideNav.classList.add('active');
    } else {
      sideNav.classList.remove('active');
    }
  };

  // Setup scroll tracking with GSAP
  updateSideNavIndicator();

  // Listen to scroll events
  caseStudyPage.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      checkHeroCollapse();
      updateSideNavIndicator();
    });
  }, { passive: true });

  // Update on resize
  window.addEventListener('resize', updateSideNavIndicator);

  function updateSideNavIndicator() {
    const navLinks = navList.querySelectorAll('.cs-side-nav-link');
    const scrollTop = caseStudyPage.scrollTop;
    const viewportHeight = caseStudyPage.clientHeight;
    const scrollCenter = scrollTop + (viewportHeight / 2);

    let activeIndex = 0;
    let minDistance = Infinity;

    // Find which section is closest to center of viewport
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = scrollTop + rect.top;
      const sectionCenter = sectionTop + (rect.height / 2);
      const distance = Math.abs(scrollCenter - sectionCenter);

      if (distance < minDistance) {
        minDistance = distance;
        activeIndex = index;
      }
    });

    // Update active state
    navLinks.forEach((link, index) => {
      if (index === activeIndex) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Animate indicator with GSAP
    const activeLink = navLinks[activeIndex];
    if (activeLink) {
      const activeLinkRect = activeLink.getBoundingClientRect();
      const navListRect = navList.getBoundingClientRect();
      const offsetY = activeLinkRect.top - navListRect.top;

      gsap.to(indicator, {
        y: offsetY,
        height: activeLinkRect.height,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }
}

/**
 * Initialize case study for standalone pages
 * @param {number} projectId - The project ID to load
 */
export async function initCaseStudyStandalone(projectId) {
  try {
    // Load projects data
    const response = await fetch('/data/projects.json');
    const projects = await response.json();

    // Find the project by ID
    const project = projects.find(p => p.id === projectId);
    if (!project) {
      console.error(`Project with ID ${projectId} not found`);
      return;
    }

    // Populate case study
    populateCaseStudy(project);

    // Initialize GLightbox after content is loaded
    setTimeout(() => {
      if (typeof GLightbox !== 'undefined') {
        GLightbox({
          selector: '.glightbox',
          touchNavigation: true,
          loop: true,
          closeButton: true,
          closeOnOutsideClick: true,
          slideEffect: 'fade',
          descPosition: 'bottom',
          onOpen: () => {
            // Add navigation indicators for image grid elements
            const lightboxElement = document.querySelector('.glightbox-container');
            if (lightboxElement) {
              const currentSlide = lightboxElement.querySelector('.gslide-image');

              // Check if current image is part of an image grid
              const isGridImage = currentSlide?.closest('.cs-image-grid');
              if (isGridImage) {
                lightboxElement.classList.add('has-navigation');
              }
            }
          },
          onSlideChanged: () => {
            // Update navigation indicator visibility based on slide type
            const lightboxElement = document.querySelector('.glightbox-container');
            if (lightboxElement) {
              const currentSlide = document.querySelector('.gslide.current');
              const isGridImage = currentSlide?.querySelector('[data-grid-image]');

              if (isGridImage) {
                lightboxElement.classList.add('has-navigation');
              } else {
                lightboxElement.classList.remove('has-navigation');
              }
            }
          }
        });
      }

      // Setup scroll animations for standalone page
      setupScrollAnimationsStandalone();
    }, 100);

  } catch (error) {
    console.error('Error loading case study:', error);
  }
}

/**
 * Setup scroll-triggered animations for standalone pages
 */
function setupScrollAnimationsStandalone() {
  // Animate metric cards
  const metricCards = document.querySelectorAll('.cs-metric-card');
  if (metricCards.length > 0) {
    gsap.set(metricCards, {
      opacity: 0,
      y: 30
    });

    metricCards.forEach((card, index) => {
      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'power2.out'
          });
        }
      });
    });
  }

  // Animate timeline phases
  const timelinePhases = document.querySelectorAll('.cs-timeline-phase');
  if (timelinePhases.length > 0) {
    gsap.set(timelinePhases, {
      opacity: 0,
      x: -30
    });

    timelinePhases.forEach((phase, index) => {
      ScrollTrigger.create({
        trigger: phase,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(phase, {
            opacity: 1,
            x: 0,
            duration: 0.7,
            delay: index * 0.15,
            ease: 'power2.out'
          });
        }
      });
    });
  }
}


