/**
 * Scroll Hint Animation Module
 * Animates arrow along curved path with bounce effect
 */

import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register plugin
gsap.registerPlugin(MotionPathPlugin);

/**
 * Initialize scroll hint animation
 */
export function initScrollHint() {
  const scrollHint = document.querySelector('.scroll-hint');
  const arrow = document.querySelector('#scroll-arrow');
  const path = document.querySelector('#scroll-path');
  const text = document.querySelector('#scroll-text');

  if (!scrollHint || !arrow || !path || !text) {
    console.warn('Scroll hint elements not found');
    return;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Reduced motion preferred - scroll hint disabled');
    return;
  }

  // Show scroll hint on landing page
  showScrollHint();

  // Get the path length for stroke-dasharray animation
  const pathLength = path.getTotalLength();

  // Set initial stroke-dasharray (path is hidden initially)
  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength
  });

  // Create the main animation timeline
  const timeline = gsap.timeline({ repeat: -1 });

  // 1. Move arrow along the path from top to bottom (slower = 8 seconds)
  // Like CodePen: arrow (plug) follows the path (loop)
  // Bottom straight edge of arrow aligns with and slides along the path
  // Stop at 0.98 (98%) to stop ~10px before the path ends
  // Simultaneously reveal the path as arrow moves down
  timeline.to(arrow, {
    duration: 8, // Slower animation
    ease: 'power1.inOut',
    motionPath: {
      path: '#scroll-path',
      align: '#scroll-path',
      alignOrigin: [0.5, 1], // Bottom edge of arrow (y=1 is 100% = bottom)
      autoRotate: 90, // Rotate 90deg more than path tangent so bottom edge aligns perpendicular
      start: 0,
      end: 0.98 // Stop at 98% of path (before it ends)
    }
  }, 0); // Start at time 0

  // Reveal path stroke as arrow moves (sync with arrow motion)
  timeline.to(path, {
    strokeDashoffset: pathLength * 0.02, // Reveal to 98% (sync with arrow end: 0.98)
    duration: 8, // Match arrow duration
    ease: 'power1.inOut'
  }, 0); // Start at time 0 (same time as arrow)

  // Text appears when arrow reaches the end (at 8 seconds)
  timeline.to(text, {
    opacity: 1,
    duration: 0.4,
    ease: 'power1.out'
  }, 8); // Start when arrow motion ends

  // 2. Softer, longer bounces at the end
  // First bounce (biggest, softer)
  timeline.to(arrow, {
    duration: 0.6,
    ease: 'power1.out', // Softer easing
    y: '-=15'
  }, '+=0.3');

  timeline.to(arrow, {
    duration: 0.6,
    ease: 'power1.in',
    y: '+=15'
  });

  // Second bounce
  timeline.to(arrow, {
    duration: 0.5,
    ease: 'power1.out',
    y: '-=12'
  });

  timeline.to(arrow, {
    duration: 0.5,
    ease: 'power1.in',
    y: '+=12'
  });

  // Third bounce
  timeline.to(arrow, {
    duration: 0.45,
    ease: 'power1.out',
    y: '-=9'
  });

  timeline.to(arrow, {
    duration: 0.45,
    ease: 'power1.in',
    y: '+=9'
  });

  // Fourth bounce
  timeline.to(arrow, {
    duration: 0.4,
    ease: 'power1.out',
    y: '-=6'
  });

  timeline.to(arrow, {
    duration: 0.4,
    ease: 'power1.in',
    y: '+=6'
  });

  // Fifth bounce (smallest)
  timeline.to(arrow, {
    duration: 0.35,
    ease: 'power1.out',
    y: '-=3'
  });

  timeline.to(arrow, {
    duration: 0.35,
    ease: 'power1.in',
    y: '+=3'
  });

  // 3. Longer pause at bottom before looping (total bounce time ~7 seconds)
  timeline.to(arrow, {
    duration: 2.5
  });

  // Fade out text before loop restarts
  timeline.to(text, {
    opacity: 0,
    duration: 0.3,
    ease: 'power1.in'
  }, '-=0.5'); // Start 0.5 seconds before the pause ends

  console.log('✓ Scroll hint animation initialized');
}

/**
 * Show scroll hint (similar to ellipse visibility)
 */
function showScrollHint() {
  const scrollHint = document.querySelector('.scroll-hint');
  const landingSection = document.querySelector('#about-landing');

  if (!scrollHint || !landingSection) {
    return;
  }

  // Show hint only when at the top
  const checkScroll = () => {
    if (window.scrollY === 0) {
      scrollHint.classList.add('visible');
    } else {
      scrollHint.classList.remove('visible');
    }
  };

  // Listen to scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkScroll, 10);
  }, { passive: true });

  // Initial check
  checkScroll();
}
