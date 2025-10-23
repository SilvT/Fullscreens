/**
 * Portfolio Main Entry Point
 * Modular architecture with GSAP ScrollTrigger
 * WCAG AA accessible with prefers-reduced-motion support
 */

// Import GSAP and ScrollTrigger
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Import styles
import './scss/main.scss';

// Import modules
import { initScrollSnap, watchMotionPreference } from './js/modules/scrollSnap.js';
import { initScrollTransitions, watchMotionPreference as watchTransitionMotion } from './js/modules/scrollTransitions.js';
import { initNavigation, initKeyboardNav } from './js/modules/navigation.js';
import {
  initSectionAnimations,
  initTextAnimations,
  initImageAnimations,
  initCTAAnimations,
  initTagAnimations,
} from './js/modules/sectionAnimations.js';
import {
  initMetricAnimations,
  initMetricCounters,
  initMetricHoverEffects,
} from './js/modules/metricAnimations.js';
import { initAccessibility, verifyColorContrast } from './js/modules/accessibility.js';
import { initFlipBoardAnimation } from './js/modules/flipBoardAnimation.js';
import { initProjectDetail } from './js/modules/projectDetail.js';
import { initCaseStudy } from './js/modules/caseStudy.js';
import { initScrollHint } from './js/modules/scrollHint.js';
import { initProjectCards } from './js/modules/projectCards.js';
import { initAllCardEnhancements } from './js/modules/cardEnhancements.js';
import { initStructuredData } from './js/modules/structuredData.js';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize portfolio on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Silvia Travieso Portfolio Loading...');

  // Initialize accessibility features first
  initAccessibility();

  // Initialize structured data (JSON-LD) for SEO and AI scrapers
  initStructuredData();

  // Generate project cards from JSON first, THEN initialize enhancements
  initProjectCards().then(() => {
    console.log('Project cards ready, initializing enhancements...');

    // Initialize all card enhancements AFTER cards are generated
    initAllCardEnhancements();

    // Initialize scroll-driven transitions AFTER cards are ready
    initScrollTransitions('fade');
    watchTransitionMotion();
  });

  // Initialize navigation
  initNavigation();
  initKeyboardNav();

  // TEMPORARY: Disable GSAP scroll snap, use native CSS instead (snappier like CodePen)
  // initScrollSnap();
  // watchMotionPreference();

  // TEMPORARY: Disable individual element animations (conflicts with scroll transitions)
  // initSectionAnimations();
  // initTextAnimations();
  // initImageAnimations();
  // initCTAAnimations();
  // initTagAnimations();

  // Keep metric animations (not conflicting)
  // initMetricAnimations();
  // initMetricCounters(); // Moved to cardEnhancements
  initMetricHoverEffects();

  // Initialize flip-board animation for job titles
  initFlipBoardAnimation();

  // Initialize project detail page
  initProjectDetail();

  // Initialize case study modal (traditional case study format)
  initCaseStudy();

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

  console.log('✓ Portfolio loaded successfully');
  console.log('✓ Sections found:', document.querySelectorAll('[data-section]').length);
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

  console.log('✓ Lazy loading initialized');
}

/**
 * Handle window resize (throttled)
 */
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
    console.log('ScrollTrigger refreshed on resize');
  }, 250);
});

/**
 * Handle visibility change (refresh ScrollTrigger when tab becomes visible)
 */
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    ScrollTrigger.refresh();
    console.log('ScrollTrigger refreshed on visibility change');
  }
});

/**
 * Initialize ellipse visibility control
 * Shows decorative ellipses when About section is in view
 */
function initEllipseVisibility() {
  const ellipseDecor = document.querySelector('.ellipse-decor');
  const landingSection = document.querySelector('#about-landing');

  if (!ellipseDecor || !landingSection) {
    console.warn('Ellipse decoration or landing section not found');
    return;
  }

  // Show ellipses when About section is in viewport
  const checkVisibility = () => {
    const rect = landingSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if About section is visible in viewport (centered or near center)
    const isVisible = rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2;

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

  console.log('✓ Ellipse visibility control initialized');
}
