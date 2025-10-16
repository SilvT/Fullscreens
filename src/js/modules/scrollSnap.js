/**
 * Scroll Snap Module
 * Implements smooth scroll snapping for full-screen sections
 * Respects prefers-reduced-motion for accessibility
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize scroll snapping functionality
 */
export function initScrollSnap() {
  // Don't apply scroll snap if user prefers reduced motion
  if (prefersReducedMotion()) {
    console.log('Scroll snap disabled: user prefers reduced motion');
    return;
  }

  const sections = gsap.utils.toArray('section');
  const numSections = sections.length;

  // Create ScrollTrigger with snap functionality
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    snap: {
      snapTo: 1 / (numSections - 1), // Snap to each section
      duration: { min: 0.2, max: 0.5 }, // Faster snap animation
      delay: 0.05, // Minimal delay after scroll stops before snapping
      ease: 'power2.inOut', // Snappier easing
      directional: true, // Only snap in scroll direction
    },
    // Smooth scrolling
    scrub: false,
    // Debug markers (set to true for development)
    markers: false,
  });

  console.log('Scroll snap initialized for', numSections, 'sections');
}

/**
 * Disable scroll snap (useful for conditional disabling)
 */
export function disableScrollSnap() {
  const triggers = ScrollTrigger.getAll();
  triggers.forEach((trigger) => {
    if (trigger.vars.snap) {
      trigger.kill();
    }
  });
  console.log('Scroll snap disabled');
}

/**
 * Listen for changes to motion preference and update scroll snap
 */
export function watchMotionPreference() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handleMotionChange = (e) => {
    if (e.matches) {
      // User enabled reduced motion
      disableScrollSnap();
    } else {
      // User disabled reduced motion
      initScrollSnap();
    }
  };

  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleMotionChange);
  } else {
    // Legacy browsers
    mediaQuery.addListener(handleMotionChange);
  }
}
