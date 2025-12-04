/**
 * Timeline Renderer Module
 * Generates HTML structure from JSON data for scroll-spy timeline
 */

import { initTimeline } from './timelineNav.js';

/**
 * Generate complete timeline HTML from JSON data
 * @param {Object} timelineData - Timeline data with sections array
 * @param {Object} options - Rendering options
 * @param {boolean} options.asBlock - If true, skip intro/outro panels (for use within case studies)
 * @returns {HTMLElement} - Complete timeline container with intro, wrapper, and outro
 */
export function renderTimeline(timelineData, options = {}) {
  if (!timelineData || !timelineData.sections || !Array.isArray(timelineData.sections)) {
    console.error('Invalid timeline data structure');
    return null;
  }

  const { asBlock = false } = options;

  // Create main container
  const container = document.createElement('div');
  container.className = asBlock ? 'timeline-container cs-block' : 'timeline-container';

  // Only add intro panel if NOT used as a block
  if (!asBlock) {
    const introPanel = generateIntroPanel();
    container.appendChild(introPanel);
  }

  // Generate timeline wrapper with navigation and sections
  const timelineWrapper = generateTimelineWrapper(timelineData.sections);
  container.appendChild(timelineWrapper);

  // Only add outro panel if NOT used as a block
  if (!asBlock) {
    const outroPanel = generateOutroPanel();
    container.appendChild(outroPanel);
  }

  return container;
}

/**
 * Generate intro panel (static full-screen panel before timeline)
 * @returns {HTMLElement}
 */
function generateIntroPanel() {
  const panel = document.createElement('div');
  panel.className = 'intro-panel';
  panel.innerHTML = `
    <div class="intro-panel__content">
      <h1>Building a Design System from Scratch</h1>
      <p class="intro-panel__subtitle">18 months. Zero precedent. One solo designer.</p>
      <div class="scroll-hint">
        <span>Scroll to explore the journey</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </div>
  `;
  return panel;
}

/**
 * Generate timeline wrapper with navigation and sections
 * @param {Array} sections - Array of section data
 * @returns {HTMLElement}
 */
function generateTimelineWrapper(sections) {
  const wrapper = document.createElement('div');
  wrapper.className = 'timeline-scroll-wrapper';

  // Generate navigation
  const nav = generateNavigation(sections);
  wrapper.appendChild(nav);

  // Create sections container
  const sectionsContainer = document.createElement('div');
  sectionsContainer.className = 'timeline-sections';

  // Generate sections inside container
  sections.forEach((section, index) => {
    const sectionElement = generateSection(section, index);
    sectionsContainer.appendChild(sectionElement);
  });

  wrapper.appendChild(sectionsContainer);

  // Add peek indicator
  const peek = document.createElement('div');
  peek.className = 'timeline-peek';
  wrapper.appendChild(peek);

  return wrapper;
}

/**
 * Generate navigation element from sections data
 * @param {Array} sections - Array of section data
 * @returns {HTMLElement}
 */
function generateNavigation(sections) {
  const nav = document.createElement('nav');
  nav.className = 'timeline-nav';

  const ul = document.createElement('ul');

  sections.forEach((section, index) => {
    const li = document.createElement('li');
    if (index === 0) {
      li.classList.add('active');
    }

    const a = document.createElement('a');
    a.href = `#timeline-section${index + 1}`;

    // Counter (replaces bullet)
    if (section.navCounter) {
      const counter = document.createElement('span');
      counter.className = 'timeline-nav__counter';
      counter.textContent = section.navCounter;
      a.appendChild(counter);
    }

    // Title
    if (section.navTitle) {
      const title = document.createElement('h3');
      title.className = 'timeline-nav__title';
      title.textContent = section.navTitle;
      a.appendChild(title);
    }

    // Label (body)
    if (section.navBody) {
      const label = document.createElement('p');
      label.className = 'timeline-nav__label';
      label.innerHTML = section.navBody;
      a.appendChild(label);
    }

    li.appendChild(a);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  return nav;
}

/**
 * Generate section element from section data
 * @param {Object} section - Section data
 * @param {Number} index - Section index
 * @returns {HTMLElement}
 */
function generateSection(section, index) {
  const sectionElement = document.createElement('section');
  sectionElement.className = 'timeline-section';
  sectionElement.id = `timeline-section${index + 1}`;
  sectionElement.setAttribute('data-section', index);

  // Create content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'timeline-section__content';

  // Add section title if exists
  if (section.sectionTitle) {
    const title = document.createElement('h2');
    title.textContent = section.sectionTitle;
    contentWrapper.appendChild(title);
  }

  // Add section content (HTML string)
  if (section.sectionContent) {
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = section.sectionContent;
    contentWrapper.appendChild(contentDiv);
  }

  sectionElement.appendChild(contentWrapper);
  return sectionElement;
}

/**
 * Generate outro panel (static full-screen panel after timeline)
 * @returns {HTMLElement}
 */
function generateOutroPanel() {
  const panel = document.createElement('div');
  panel.className = 'intro-panel outro-panel';
  panel.innerHTML = `
    <div class="intro-panel__content">
      <h2>The Impact</h2>
      <div class="impact-metrics">
        <div class="metric">
          <span class="metric__value">1,920</span>
          <span class="metric__label">Hours Saved</span>
        </div>
        <div class="metric">
          <span class="metric__value">90%</span>
          <span class="metric__label">QA Reduction</span>
        </div>
        <div class="metric">
          <span class="metric__value">864</span>
          <span class="metric__label">Design Tokens</span>
        </div>
        <div class="metric">
          <span class="metric__value">7</span>
          <span class="metric__label">Projects Onboarded</span>
        </div>
      </div>
      <p class="outro-panel__text">What started as a rejected pitch became the foundation for company-wide design excellence.</p>
    </div>
  `;
  return panel;
}

/**
 * Initialize timeline after rendering
 * Call this after the timeline has been added to the DOM
 * @param {HTMLElement} container - Timeline container element
 */
export function initializeTimeline(container) {
  if (!container) {
    console.error('Timeline container not found');
    return;
  }

  const wrapper = container.querySelector('.timeline-scroll-wrapper');
  if (!wrapper) {
    console.error('Timeline wrapper not found');
    return;
  }

  // Initialize scroll-spy behavior
  initTimeline(wrapper);
}
