/**
 * Portfolio Main Entry Point
 * Modular architecture with GSAP ScrollTrigger
 * WCAG AA accessible with prefers-reduced-motion support
 */

// Prevent browser scroll restoration (fixes reload starting at bottom)
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Scroll to top immediately on page load
window.scrollTo(0, 0);

// Import GSAP and ScrollTrigger
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import styles
import './scss/main.scss';

// Import modules
import { initScrollTransitions, watchMotionPreference as watchTransitionMotion } from './js/modules/scrollTransitions.js';
import { initNavigation, initKeyboardNav } from './js/modules/navigation.js';
import {
  initMetricHoverEffects,
} from './js/modules/metricAnimations.js';
import { initAccessibility, verifyColorContrast } from './js/modules/accessibility.js';
import { initFlipBoardAnimation } from './js/modules/flipBoardAnimation.js';
// import { initProjectDetail } from './js/modules/projectDetail.js'; // ARCHIVED: Not currently in use
// import { initCaseStudy } from './js/modules/caseStudy.js'; // ARCHIVED: Case study modals disabled
import { initScrollHint } from './js/modules/scrollHint.js';
import { initProjectCards } from './js/modules/projectCards.js';
import { initAllCardEnhancements } from './js/modules/cardEnhancements.js';
import { initStructuredData } from './js/modules/structuredData.js';
import { initAnalytics } from './js/modules/analytics.js';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize core features
 * Features that need to run before the DOM is fully ready
 */
function initCoreFeatures() {
  initAccessibility();
  initStructuredData();
  initAnalytics();
}

/**
 * Initialize content-dependent features
 * Features that depend on project cards being rendered
 */
async function initContentFeatures() {
  await initProjectCards();
  initAllCardEnhancements();
  initScrollTransitions('fade');
  watchTransitionMotion();
}

/**
 * Initialize UI features
 * Features that can run independently
 */
function initUIFeatures() {
  initNavigation();
  initKeyboardNav();
  initMetricHoverEffects();
  initFlipBoardAnimation();
  initScrollHint();
  initEllipseVisibility();
  initLazyLoading();
}

/**
 * Initialize portfolio on DOM ready
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Core features first
  initCoreFeatures();

  // Content-dependent features
  await initContentFeatures();

  // UI features
  initUIFeatures();

  // Development-only features
  if (process.env.NODE_ENV === 'development') {
    verifyColorContrast();
  }
});

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01,
  };

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Add loaded class for any additional styling
        img.classList.add('loaded');

        // Stop observing this image
        imageObserver.unobserve(img);
      }
    });
  }, observerOptions);

  // Observe all project images
  document.querySelectorAll('.project-image').forEach((img) => {
    imageObserver.observe(img);
  });
}

/**
 * Handle window resize (throttled)
 */
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

/**
 * Handle visibility change (refresh ScrollTrigger when tab becomes visible)
 */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    ScrollTrigger.refresh();
  }
});

/**
 * Check if a section is visible in the center of viewport
 * @param {HTMLElement} section - The section to check
 * @param {number} windowHeight - Current window height
 * @returns {boolean} True if section is visible in center
 */
function isSectionCentered(section, windowHeight) {
  if (!section) return false;
  const rect = section.getBoundingClientRect();
  return rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2;
}

/**
 * Initialize ellipse visibility control
 * Shows decorative ellipses when About section or Footer is in view
 */
function initEllipseVisibility() {
  const ellipseDecor = document.querySelector('.ellipse-decor');
  const landingSection = document.querySelector('#about-landing');
  const footerSection = document.querySelector('#contact');

  if (!ellipseDecor) return;

  const checkVisibility = () => {
    const windowHeight = window.innerHeight;
    const isVisible =
      isSectionCentered(landingSection, windowHeight) ||
      isSectionCentered(footerSection, windowHeight);

    ellipseDecor.classList.toggle('visible', isVisible);
  };

  // Throttled scroll handler
  let scrollTimeout;
  const handleScroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkVisibility, 10);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initial check with small delay to ensure GSAP snap has finished
  setTimeout(checkVisibility, 100);
}
