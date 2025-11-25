/**
 * Metric Card Animations Module
 * Handles hover effects for metric cards
 * Note: Scroll animations moved to scrollTransitions.js
 * Note: Counter animations moved to cardEnhancements.js
 */

import gsap from 'gsap';

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Add hover effects to metric cards
 */
export function initMetricHoverEffects() {
  if (prefersReducedMotion()) {
    return;
  }

  const metricCards = document.querySelectorAll('.metric-card');

  metricCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.03,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
  });

}
