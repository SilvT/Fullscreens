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
  const eraserPath = document.querySelector('#scroll-path-eraser');
  const text = document.querySelector('#scroll-text');

  if (!scrollHint || !arrow || !path || !eraserPath || !text) {
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

  // Get the path lengths
  const pathLength = path.getTotalLength();
  const eraserPathLength = eraserPath.getTotalLength();

  // Set initial state for blue path (hidden, thin)
  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
    strokeWidth: 2 // Start thin
  });

  // Set initial state for eraser path (hidden, will grow from top)
  gsap.set(eraserPath, {
    strokeDasharray: eraserPathLength,
    strokeDashoffset: eraserPathLength,
    strokeWidth: 3 // Start slightly thicker to cover
  });

  // Create the main animation timeline
  const timeline = gsap.timeline({ repeat: -1 });

  // 1. Move arrow along the path from top to bottom (4 seconds to reach bottom)
  timeline.to(arrow, {
    duration: 4, // Arrow reaches bottom at 50% of animation
    ease: 'power1.inOut',
    motionPath: {
      path: '#scroll-path',
      align: '#scroll-path',
      alignOrigin: [0.5, 1], // Bottom edge of arrow
      autoRotate: 90, // Rotate perpendicular to path
      start: 0,
      end: 0.98 // Stop at 98% of path
    }
  }, 0); // Start at time 0

  // 2. Phase 1 (0-4s): Reveal blue path as arrow moves down AND gradually thicken
  timeline.to(path, {
    strokeDashoffset: pathLength * 0.02, // Reveal to 98%
    strokeWidth: 4, // Thicken from 2 to 4 as it reveals
    duration: 4,
    ease: 'power1.inOut'
  }, 0); // Start at time 0 (synced with arrow)

  // Also thicken eraser slightly during phase 1 to maintain coverage
  timeline.to(eraserPath, {
    strokeWidth: 5, // Thicken from 3 to 5
    duration: 4,
    ease: 'power1.inOut'
  }, 0);

  // 3. Phase 2 (4-8s): Reveal eraser path from top, covering 90% of blue path
  // Eraser reveals from top to 90% of path length
  timeline.to(eraserPath, {
    strokeDashoffset: eraserPathLength * 0.1, // Reveal 90% from top, leave 10% at bottom
    duration: 4,
    ease: 'power1.inOut'
  }, 4); // Start at 4 seconds (when arrow reaches bottom)

  // 4. Continue thickening BOTH paths as mask covers the blue one (4-8s)
  timeline.to(path, {
    strokeWidth: 6, // Blue path: 4 → 6 (gets thicker at bottom)
    opacity: 1, // Increase opacity to match arrow (0.3 → 1)
    duration: 4,
    ease: 'power1.inOut'
  }, 4); // Start at 4 seconds (same time as eraser)

  timeline.to(eraserPath, {
    strokeWidth: 7, // Eraser: 5 → 7 (stays thicker to cover)
    duration: 4,
    ease: 'power1.inOut'
  }, 4);

  // Text appears when arrow reaches the end (at 8 seconds)
  timeline.to(text, {
    opacity: 1,
    duration: 0.4,
    ease: 'power1.out'
  }, 8); // Start when arrow motion ends

  // 2. Softer, longer bounces at the end - arrow, blue path, AND eraser mask all bounce together
  // First bounce (biggest, softer)
  timeline.to([arrow, path, eraserPath], {
    duration: 0.6,
    ease: 'power1.out', // Softer easing
    y: '-=15'
  }, '+=0.3');

  timeline.to([arrow, path, eraserPath], {
    duration: 0.6,
    ease: 'power1.in',
    y: '+=15'
  });

  // Second bounce
  timeline.to([arrow, path, eraserPath], {
    duration: 0.5,
    ease: 'power1.out',
    y: '-=12'
  });

  timeline.to([arrow, path, eraserPath], {
    duration: 0.5,
    ease: 'power1.in',
    y: '+=12'
  });

  // Third bounce
  timeline.to([arrow, path, eraserPath], {
    duration: 0.45,
    ease: 'power1.out',
    y: '-=9'
  });

  timeline.to([arrow, path, eraserPath], {
    duration: 0.45,
    ease: 'power1.in',
    y: '+=9'
  });

  // Fourth bounce
  timeline.to([arrow, path, eraserPath], {
    duration: 0.4,
    ease: 'power1.out',
    y: '-=6'
  });

  timeline.to([arrow, path, eraserPath], {
    duration: 0.4,
    ease: 'power1.in',
    y: '+=6'
  });

  // Fifth bounce (smallest)
  timeline.to([arrow, path, eraserPath], {
    duration: 0.35,
    ease: 'power1.out',
    y: '-=3'
  });

  timeline.to([arrow, path, eraserPath], {
    duration: 0.35,
    ease: 'power1.in',
    y: '+=3'
  });

  // 3. Extended pause at bottom - keep bouncing state visible for 3 seconds
  timeline.to(arrow, {
    duration: 3
  });

  // 4. Final gap of 3 seconds before loop restarts (text stays visible)
  timeline.to(arrow, {
    duration: 3
  });

  // Fade out text at the very end, right before loop restarts
  timeline.to(text, {
    opacity: 0,
    duration: 0.3,
    ease: 'power1.in'
  }, '-=0.3'); // Start 0.3 seconds before loop restarts

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
