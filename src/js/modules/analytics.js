/**
 * Portfolio Analytics Module
 * Tracks key user interactions using Vercel Analytics
 * Following the analytics implementation guide
 */

import { track } from '@vercel/analytics';

/**
 * Track CV/Resume downloads
 * @param {string} format - File format (e.g., 'pdf', 'docx')
 */
export function trackCVDownload(format = 'pdf') {
  track('cv_download', { format });
  console.log('📊 Analytics: CV download tracked', { format });
}

/**
 * Track contact form submissions
 * @param {string} source - Source of the form (e.g., 'portfolio', 'footer')
 */
export function trackContactFormSubmit(source = 'portfolio') {
  track('contact_form_submit', { source });
  console.log('📊 Analytics: Contact form submission tracked', { source });
}

/**
 * Track external link clicks
 * @param {string} platform - Platform name (e.g., 'linkedin', 'behance', 'email')
 * @param {string} url - The URL being clicked
 */
export function trackExternalLinkClick(platform, url) {
  track('external_link_click', {
    platform,
    url
  });
  console.log('📊 Analytics: External link clicked', { platform, url });
}

/**
 * Track project/case study views
 * @param {string} projectName - Name of the project
 * @param {string} projectId - ID of the project
 */
export function trackProjectView(projectName, projectId) {
  track('project_view', {
    project_name: projectName,
    project_id: projectId
  });
  console.log('📊 Analytics: Project view tracked', { projectName, projectId });
}

/**
 * Track case study interactions
 * @param {string} action - Action type (e.g., 'open', 'close', 'scroll_to_end')
 * @param {string} projectName - Name of the project
 */
export function trackCaseStudyInteraction(action, projectName) {
  track('case_study_interaction', {
    action,
    project_name: projectName
  });
  console.log('📊 Analytics: Case study interaction tracked', { action, projectName });
}

/**
 * Track navigation events
 * @param {string} section - Section navigated to (e.g., 'about', 'works', 'contact')
 */
export function trackNavigation(section) {
  track('navigation', { section });
  console.log('📊 Analytics: Navigation tracked', { section });
}

/**
 * Initialize analytics tracking for all interactive elements
 * This function sets up event listeners for automatic tracking
 */
export function initAnalytics() {
  console.log('📊 Initializing portfolio analytics...');

  // Track external links in socials section
  initExternalLinkTracking();

  // Track CV download button
  initCVDownloadTracking();

  // Track navigation clicks
  initNavigationTracking();

  console.log('✓ Portfolio analytics initialized');
}

/**
 * Initialize tracking for external links in the socials section
 */
function initExternalLinkTracking() {
  const socialsSection = document.querySelector('.socials');
  if (!socialsSection) {
    console.warn('Socials section not found for analytics tracking');
    return;
  }

  // Track LinkedIn
  const linkedinLink = socialsSection.querySelector('a[data-name="linkedin"]');
  if (linkedinLink) {
    linkedinLink.addEventListener('click', () => {
      trackExternalLinkClick('linkedin', linkedinLink.href);
    });
  }

  // Track Behance
  const behanceLink = socialsSection.querySelector('a[data-name="behance"]');
  if (behanceLink) {
    behanceLink.addEventListener('click', () => {
      trackExternalLinkClick('behance', behanceLink.href);
    });
  }

  // Track Email
  const emailLink = socialsSection.querySelector('a[data-name="email"]');
  if (emailLink) {
    emailLink.addEventListener('click', () => {
      trackExternalLinkClick('email', emailLink.href);
    });
  }

  console.log('✓ External link tracking initialized');
}

/**
 * Initialize tracking for CV download button
 */
function initCVDownloadTracking() {
  const cvButton = document.querySelector('#cv-download-btn');
  if (!cvButton) {
    console.warn('CV download button not found for analytics tracking');
    return;
  }

  cvButton.addEventListener('click', (e) => {
    e.preventDefault();
    trackCVDownload('pdf');

    // Trigger download
    const link = document.createElement('a');
    link.href = '/cv-silvia-travieso.pdf';
    link.download = 'CV-Silvia-Travieso.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  console.log('✓ CV download tracking initialized');
}

/**
 * Initialize tracking for navigation clicks
 */
function initNavigationTracking() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach(navItem => {
    navItem.addEventListener('click', () => {
      const section = navItem.textContent.trim().toLowerCase();
      trackNavigation(section);
    });
  });

  console.log('✓ Navigation tracking initialized');
}
