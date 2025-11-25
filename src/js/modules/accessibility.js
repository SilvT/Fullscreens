/**
 * Accessibility Module
 * Handles motion preferences, ARIA labels, and keyboard navigation
 */

import gsap from 'gsap';

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize accessibility features
 */
export function initAccessibility() {
  watchMotionPreference();
  addSkipToMainLink();
  enhanceKeyboardNavigation();
  addARIALabels();

}

/**
 * Watch for changes in motion preference
 */
function watchMotionPreference() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handleMotionChange = (e) => {
    if (e.matches) {
      disableAllAnimations();
    } else {
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleMotionChange);
  } else {
    mediaQuery.addListener(handleMotionChange);
  }

  // Log initial state
  if (prefersReducedMotion()) {
  }
}

/**
 * Disable all GSAP animations
 */
function disableAllAnimations() {
  gsap.globalTimeline.clear();
  gsap.set('*', { clearProps: 'all' });
}

/**
 * Add skip to main content link for keyboard users
 */
function addSkipToMainLink() {
  const existingSkipLink = document.querySelector('.skip-to-main');

  if (existingSkipLink) {
    return; // Already exists
  }

  const skipLink = document.createElement('a');
  skipLink.href = '#about-landing';
  skipLink.className = 'skip-to-main';
  skipLink.textContent = 'Skip to main content';
  skipLink.setAttribute('aria-label', 'Skip to main content');

  document.body.insertBefore(skipLink, document.body.firstChild);

}

/**
 * Enhance keyboard navigation for all interactive elements
 */
function enhanceKeyboardNavigation() {
  // Add keyboard support for CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach((button) => {
    button.setAttribute('tabindex', '0');
    button.setAttribute('role', 'button');

    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });

}

/**
 * Add missing ARIA labels for better screen reader support
 */
function addARIALabels() {
  // Add ARIA labels to sections
  const sections = document.querySelectorAll('[data-section]');

  sections.forEach((section, index) => {
    const sectionType = section.getAttribute('data-section');

    if (sectionType === 'about') {
      section.setAttribute('aria-label', 'About section');
    } else if (sectionType === 'project') {
      const projectTitle = section.querySelector('.project-title');
      const title = projectTitle ? projectTitle.textContent.trim() : `Project ${index}`;
      section.setAttribute('aria-label', `Project section: ${title}`);
    }
  });

  // Add ARIA labels to metric cards
  const metricCards = document.querySelectorAll('.metric-card');

  metricCards.forEach((card) => {
    const value = card.querySelector('.metric-value')?.textContent.trim();
    const label = card.querySelector('.metric-label')?.textContent.trim();

    if (value && label) {
      card.setAttribute('aria-label', `${value} ${label}`);
    }
  });

  // Add ARIA labels to navigation hints
  const navHints = document.querySelectorAll('.project-nav');

  navHints.forEach((hint) => {
    hint.setAttribute('role', 'note');
    hint.setAttribute('aria-label', 'Navigation hint');
  });

}

/**
 * Verify color contrast (logs warnings for insufficient contrast)
 */
export function verifyColorContrast() {
  // This is a development helper function
  // In production, use tools like axe DevTools or WAVE

}
