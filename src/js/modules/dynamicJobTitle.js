/**
 * Dynamic Job Title Module
 * Rotates through job titles with GSAP animations
 */

import gsap from 'gsap';

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize dynamic job title rotation
 */
export function initDynamicJobTitle() {
  const jobTitles = document.querySelectorAll('.job-title');

  if (jobTitles.length === 0) {
    return;
  }

  // If reduced motion, just show all titles statically
  if (prefersReducedMotion()) {
    jobTitles.forEach((title) => {
      title.classList.remove('hidden', 'visible');
      gsap.set(title, { opacity: 1, y: 0 });
    });
    console.log('Dynamic job title disabled: user prefers reduced motion');
    return;
  }

  let currentIndex = 0;
  const titles = Array.from(jobTitles);

  // Set initial state
  titles.forEach((title, index) => {
    if (index === 0) {
      title.classList.add('visible');
      title.classList.remove('hidden');
      gsap.set(title, { opacity: 1, y: 0 });
    } else {
      title.classList.add('hidden');
      title.classList.remove('visible');
      gsap.set(title, { opacity: 0, y: 20 });
    }
  });

  /**
   * Rotate to next job title
   */
  function rotateTitle() {
    const current = titles[currentIndex];
    const nextIndex = (currentIndex + 1) % titles.length;
    const next = titles[nextIndex];

    // Animate out current title
    gsap.to(current, {
      opacity: 0,
      y: -10,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        current.classList.remove('visible');
        current.classList.add('hidden');
      },
    });

    // Animate in next title
    gsap.fromTo(
      next,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
        onStart: () => {
          next.classList.remove('hidden');
          next.classList.add('visible');
        },
      }
    );

    currentIndex = nextIndex;
  }

  // Rotate every 3 seconds
  const interval = setInterval(rotateTitle, 3000);

  // Store interval ID for cleanup if needed
  window.__jobTitleInterval = interval;

  console.log('Dynamic job title initialized');
}

/**
 * Stop job title rotation (cleanup)
 */
export function stopJobTitleRotation() {
  if (window.__jobTitleInterval) {
    clearInterval(window.__jobTitleInterval);
    console.log('Dynamic job title stopped');
  }
}
