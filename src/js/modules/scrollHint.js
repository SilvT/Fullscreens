/**
 * Scroll Hint Animation Module
 * Ripple animation with "scroll" text
 */

import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

/**
 * Initialize scroll hint animation
 */
export function initScrollHint() {
  const scrollHint = document.querySelector('.scroll-hint');

  if (!scrollHint) {
    return;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    scrollHint.style.display = 'none';
    return;
  }

  // Add hover cursor pointer
  scrollHint.style.cursor = 'pointer';

  // Add click handler to scroll to first project with GSAP smooth scroll
  scrollHint.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const firstProject = document.querySelector('#project-1');

    if (firstProject) {
      // Calculate the target scroll position (center in viewport)
      const targetY = firstProject.offsetTop - (window.innerHeight / 2) + (firstProject.offsetHeight / 2);

      // Use GSAP to animate scrollTop with smooth easing that matches natural scroll
      gsap.to(window, {
        duration: 1.5, // Longer duration for smoother transition
        scrollTo: {
          y: targetY,
          autoKill: false, // Don't kill on user interaction - let transition complete
        },
        ease: 'power2.inOut', // Smooth ease for natural scroll feel
        overwrite: 'auto',
      });
    }
  });

  // Show scroll hint when About section is in view
  showScrollHint();

}

/**
 * Show scroll hint when About section is in view
 */
function showScrollHint() {
  const scrollHint = document.querySelector('.scroll-hint');
  const landingSection = document.querySelector('#about-landing');

  if (!scrollHint || !landingSection) {
    return;
  }

  // Show hint when About section is visible in viewport
  const checkVisibility = () => {
    const rect = landingSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Check if About section is visible in viewport (centered or near center)
    const isVisible = rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2;

    if (isVisible) {
      scrollHint.classList.remove('hidden');
    } else {
      scrollHint.classList.add('hidden');
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
