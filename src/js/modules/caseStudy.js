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
    console.warn('Case study page not found');
    return;
  }

  // Handle case study button clicks
  // Support both .open-case-study (with data-project) and .cta-button (with href)
  document.addEventListener('click', (e) => {
    const caseStudyButton = e.target.closest('.open-case-study, .cta-button');

    if (caseStudyButton) {
      console.log('[caseStudy] CTA Button clicked! Target:', e.target, 'Button:', caseStudyButton);
      e.preventDefault();

      // DIAGNOSTIC: Find which section this button belongs to
      const parentSection = caseStudyButton.closest('section[data-section="project"]');
      const sectionId = parentSection ? parentSection.id : 'unknown';
      const projectTitle = parentSection ? parentSection.querySelector('.project-title')?.textContent : 'unknown';

      console.log(`[caseStudy] ⚠️ Button is inside section: ${sectionId}, Project: "${projectTitle}"`);

      const href = caseStudyButton.getAttribute('href');
      const dataProjectId = caseStudyButton.getAttribute('data-project-id');
      const dataProject = caseStudyButton.getAttribute('data-project');

      console.log('[caseStudy] Button attributes:', {
        href,
        'data-project-id': dataProjectId,
        'data-project': dataProject
      });

      // Priority order: data-project-id > data-project > href extraction
      let projectId = dataProjectId || dataProject;

      // If not found, try to extract from href attribute
      if (!projectId && href) {
        console.log('[caseStudy] Extracting projectId from href:', href);
        if (href.includes('case-study')) {
          projectId = href.replace('#case-study-', '');
          console.log('[caseStudy] Extracted projectId:', projectId);
        }
      }

      if (projectId) {
        console.log('[caseStudy] Opening case study for projectId:', projectId);
        openCaseStudy(projectId);
      } else {
        console.warn('[caseStudy] No projectId found! Button:', caseStudyButton);
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

  console.log('✓ Case study modal initialized');
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
    console.warn(`No data found for project ${projectId}`);
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
            if (subtitleEl) subtitleEl.textContent = contentData.subtitle;
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
              quote.textContent = storyHook.quote;
              heroOverview.appendChild(quote);

              if (storyHook.context) {
                const context = document.createElement('p');
                context.className = 'cs-story-hook-context';
                context.textContent = storyHook.context;
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
  switch (block.type) {
    case 'two-column-with-sidebar':
      return renderTwoColumnWithSidebar(block);
    case 'text-image-split':
      return renderTextImageSplit(block);
    case 'full-width-text':
      return renderFullWidthText(block);
    case 'full-width-image':
      return renderFullWidthImage(block);
    case 'image-grid':
      return renderImageGrid(block);
    case 'metrics-inline':
      return renderMetricsInline(block);
    case 'gallery':
      return renderGallery(block, project);
    case 'story-hook':
      return renderStoryHook(block);
    case 'timeline-process':
      return renderTimelineProcess(block);
    case 'before-after-comparison':
      return renderBeforeAfterComparison(block);
    case 'key-insight':
      return renderKeyInsight(block);
    default:
      console.warn(`Unknown block type: ${block.type}`);
      return null;
  }
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
      heading.textContent = block.text;
      return heading;

    case 'paragraph':
      const p = document.createElement('p');
      p.className = block.class || 'cs-section-text';
      if (block.html) {
        p.innerHTML = block.html;
      } else {
        p.textContent = block.text;
      }
      return p;

    case 'list':
      const list = document.createElement(block.style || 'ul');
      list.className = 'cs-text-block-list';
      block.items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
      return list;

    default:
      console.warn(`Unknown text block type: ${block.type}`);
      return null;
  }
}

/**
 * Render two-column layout with sidebar
 */
function renderTwoColumnWithSidebar(block) {
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
      heading.textContent = section.heading;
      sectionEl.appendChild(heading);
    }

    // Support new blocks structure
    if (section.blocks) {
      section.blocks.forEach((block) => {
        const blockEl = renderTextBlock(block);
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

      const img = document.createElement('img');
      img.src = section.image.src;
      img.alt = section.image.alt || '';
      img.className = 'cs-inline-img';
      figure.appendChild(img);

      if (section.image.caption) {
        const figcaption = document.createElement('figcaption');
        figcaption.className = 'cs-image-caption';
        figcaption.textContent = section.image.caption;
        figure.appendChild(figcaption);
      }

      sectionEl.appendChild(figure);
    }

    // Full-width image within section
    if (section.imageFull) {
      const figure = document.createElement('figure');
      figure.className = 'cs-inline-image-full';

      const img = document.createElement('img');
      img.src = section.imageFull.src;
      img.alt = section.imageFull.alt || '';
      img.className = 'cs-inline-img-full';
      figure.appendChild(img);

      if (section.imageFull.caption) {
        const figcaption = document.createElement('figcaption');
        figcaption.className = 'cs-image-caption';
        figcaption.textContent = section.imageFull.caption;
        figure.appendChild(figcaption);
      }

      sectionEl.appendChild(figure);
    }

    mainContent.appendChild(sectionEl);
  });

  // Right column - sidebar
  const sidebar = document.createElement('aside');
  sidebar.className = 'cs-sidebar';

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
      h4.textContent = title;
      h4.setAttribute('id', `sidebar-${title.toLowerCase().replace(/\s+/g, '-')}`);
      section.appendChild(h4);

      const dl = document.createElement('dl');
      dl.className = 'cs-sidebar-list';
      dl.setAttribute('aria-labelledby', h4.id);

      items.forEach((item) => {
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

  const img = document.createElement('img');
  img.src = block.src;
  img.alt = block.alt || '';
  img.className = 'cs-full-img';

  link.appendChild(img);
  figure.appendChild(link);

  if (block.caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'cs-image-caption';
    figcaption.textContent = block.caption;
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
      if (image.alt) {
        link.setAttribute('data-title', image.alt);
      }

      const img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt || '';
      img.className = 'cs-grid-img';

      link.appendChild(img);
      figure.appendChild(link);
    }

    if (image.caption) {
      const figcaption = document.createElement('figcaption');
      figcaption.className = 'cs-image-caption';
      figcaption.textContent = image.caption;
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
    heading.textContent = block.heading;
    section.appendChild(heading);
  }

  if (block.text) {
    const paragraphs = block.text.split('\n\n');
    paragraphs.forEach((para) => {
      if (para.trim()) {
        const p = document.createElement('p');
        p.className = 'cs-section-text';
        p.textContent = para.trim();
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
    heading.textContent = block.heading;
    textSide.appendChild(heading);
  }

  if (block.text) {
    const paragraphs = block.text.split('\n\n');
    paragraphs.forEach((para) => {
      if (para.trim()) {
        const p = document.createElement('p');
        p.className = 'cs-section-text';
        p.textContent = para.trim();
        textSide.appendChild(p);
      }
    });
  }

  // Image side
  const imageSide = document.createElement('div');
  imageSide.className = 'cs-image-side';

  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = block.image;
  img.alt = block.alt || '';
  img.className = 'cs-split-img';
  figure.appendChild(img);

  if (block.caption) {
    const figcaption = document.createElement('figcaption');
    figcaption.className = 'cs-image-caption';
    figcaption.textContent = block.caption;
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
  quote.textContent = block.quote;
  content.appendChild(quote);

  // Context
  if (block.context) {
    const context = document.createElement('p');
    context.className = 'cs-story-hook-context';
    context.textContent = block.context;
    content.appendChild(context);
  }

  wrapper.appendChild(content);

  // Optional image
  if (block.image) {
    const figure = document.createElement('figure');
    figure.className = 'cs-story-hook-image';

    const img = document.createElement('img');
    img.src = block.image;
    img.alt = block.imageAlt || '';
    figure.appendChild(img);

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
    heading.textContent = block.heading;
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
    title.textContent = phase.title;
    header.appendChild(title);

    const period = document.createElement('span');
    period.className = 'cs-timeline-phase-period';
    period.textContent = phase.period;
    header.appendChild(period);

    phaseEl.appendChild(header);

    // Highlights
    if (phase.highlights && phase.highlights.length > 0) {
      const highlightsList = document.createElement('ul');
      highlightsList.className = 'cs-timeline-highlights';

      phase.highlights.forEach((highlight) => {
        const li = document.createElement('li');
        li.textContent = highlight;
        highlightsList.appendChild(li);
      });

      phaseEl.appendChild(highlightsList);
    }

    timeline.appendChild(phaseEl);
  });

  wrapper.appendChild(timeline);
  return wrapper;
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
    heading.textContent = block.heading;
    wrapper.appendChild(heading);
  }

  const grid = document.createElement('div');
  grid.className = 'cs-before-after-grid';

  // Before column
  const beforeCol = document.createElement('div');
  beforeCol.className = 'cs-before-after-col cs-before-col';

  const beforeLabel = document.createElement('h3');
  beforeLabel.className = 'cs-before-after-label';
  beforeLabel.textContent = block.before.label || 'Before';
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
    const img = document.createElement('img');
    img.src = block.before.image;
    img.alt = block.before.imageAlt || 'Before state';
    img.className = 'cs-before-after-image';
    beforeCol.appendChild(img);
  }

  grid.appendChild(beforeCol);

  // After column
  const afterCol = document.createElement('div');
  afterCol.className = 'cs-before-after-col cs-after-col';

  const afterLabel = document.createElement('h3');
  afterLabel.className = 'cs-before-after-label';
  afterLabel.textContent = block.after.label || 'After';
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
    const img = document.createElement('img');
    img.src = block.after.image;
    img.alt = block.after.imageAlt || 'After state';
    img.className = 'cs-before-after-image';
    afterCol.appendChild(img);
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
    title.textContent = block.title;
    header.appendChild(title);
  }

  content.appendChild(header);

  // Insight text
  if (block.insight) {
    const insight = document.createElement('p');
    insight.className = 'cs-key-insight-text';
    insight.textContent = block.insight;
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
 * Close case study page
 */
function closeCaseStudy() {
  const caseStudyPage = document.querySelector('#case-study-page');
  const body = document.body;

  if (!caseStudyPage) return;

  // Track case study close
  const currentProjectId = caseStudyPage.getAttribute('data-current-project');
  if (currentProjectId) {
    const project = projectData[currentProjectId];
    if (project) {
      trackCaseStudyInteraction('close', project.title);
    }
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

  console.log('Closed case study page');
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
  const metricsSection = caseStudyPage.querySelector('.cs-metrics');
  const contentContainer = caseStudyPage.querySelector('.cs-content-container');

  if (!sideNav || !navList || !indicator) return;

  // Find all navigable sections - start with metrics, then content blocks
  const sections = [];

  // Add metrics section as first item (01)
  if (metricsSection) {
    sections.push(metricsSection);
  }

  // Add content blocks
  if (contentContainer) {
    const contentBlocks = contentContainer.querySelectorAll('.cs-block, .cs-content-section');
    sections.push(...contentBlocks);
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
    link.textContent = String(index + 1).padStart(2, '0');
    link.href = `#cs-section-${index + 1}`;
    link.dataset.sectionIndex = index;

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


