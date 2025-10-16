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
import { initDynamicJobTitle } from './js/modules/dynamicJobTitle.js';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize portfolio on DOM ready
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎨 Silvia Travieso Portfolio Loading...');

  // Initialize accessibility features first
  initAccessibility();

  // Initialize navigation
  initNavigation();
  initKeyboardNav();

  // Initialize scroll snapping
  initScrollSnap();
  watchMotionPreference();

  // Initialize animations
  initSectionAnimations();
  initTextAnimations();
  initImageAnimations();
  initCTAAnimations();
  initTagAnimations();

  // Initialize metric animations
  initMetricAnimations();
  initMetricCounters();
  initMetricHoverEffects();

  // Initialize dynamic job title
  initDynamicJobTitle();

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
