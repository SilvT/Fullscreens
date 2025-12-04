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
 * Initialize portfolio on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize accessibility features first
  initAccessibility();

  // Initialize structured data (JSON-LD) for SEO and AI scrapers
  initStructuredData();

  // Initialize analytics tracking
  initAnalytics();

  // Generate project cards from JSON first, THEN initialize enhancements
  initProjectCards().then(() => {
    // Initialize all card enhancements AFTER cards are generated
    initAllCardEnhancements();

    // Initialize scroll-driven transitions AFTER cards are ready
    initScrollTransitions('fade');
    watchTransitionMotion();
  });

  // Initialize navigation
  initNavigation();
  initKeyboardNav();

  // Metric hover effects
  initMetricHoverEffects();

  // Initialize flip-board animation for job titles
  initFlipBoardAnimation();

  // Initialize project detail page
  // initProjectDetail(); // ARCHIVED: Not currently in use

  // Initialize case study modal (traditional case study format)
  // initCaseStudy(); // ARCHIVED: Case study modals disabled

  // Initialize scroll hint animation
  initScrollHint();

  // Initialize ellipse visibility control
  initEllipseVisibility();

  // Verify color contrast (development only)
  if (process.env.NODE_ENV === 'development') {
    verifyColorContrast();
  }

  // Add intersection observer for lazy loading optimization
  initLazyLoading();
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
 * Initialize ellipse visibility control
 * Shows decorative ellipses when About section or Footer is in view
 */
function initEllipseVisibility() {
  const ellipseDecor = document.querySelector('.ellipse-decor');
  const landingSection = document.querySelector('#about-landing');
  const footerSection = document.querySelector('#contact');

  if (!ellipseDecor) {
    return;
  }

  // Show ellipses when About section or Footer is in viewport
  const checkVisibility = () => {
    const windowHeight = window.innerHeight;
    let isVisible = false;

    // Check About section
    if (landingSection) {
      const aboutRect = landingSection.getBoundingClientRect();
      const aboutVisible = aboutRect.top < windowHeight / 2 && aboutRect.bottom > windowHeight / 2;
      if (aboutVisible) isVisible = true;
    }

    // Check Footer section
    if (footerSection) {
      const footerRect = footerSection.getBoundingClientRect();
      const footerVisible = footerRect.top < windowHeight / 2 && footerRect.bottom > windowHeight / 2;
      if (footerVisible) isVisible = true;
    }

    if (isVisible) {
      ellipseDecor.classList.add('visible');
    } else {
      ellipseDecor.classList.remove('visible');
    }
  };

  // Listen to scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkVisibility, 10);
  }, { passive: true });

  // Initial check with small delay to ensure GSAP snap has finished
  setTimeout(checkVisibility, 100);
}
