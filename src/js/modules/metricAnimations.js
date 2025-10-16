/**
 * Metric Card Animations Module
 * Handles animations for metric cards with fade-in, scale, and stagger effects
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize metric card animations
 */
export function initMetricAnimations() {
  if (prefersReducedMotion()) {
    console.log('Metric animations disabled: user prefers reduced motion');
    return;
  }

  const metricsContainers = document.querySelectorAll('.metrics');

  metricsContainers.forEach((container) => {
    const cards = container.querySelectorAll('.metric-card');

    // Animate each card with stagger
    cards.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          markers: false,
        },
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: index * 0.12, // Stagger delay
        ease: 'power2.out',
      });
    });
  });

  console.log('Metric card animations initialized');
}

/**
 * Animate number count-up for metrics
 * Only animates numeric values (e.g., "60%", "x1.5")
 */
export function initMetricCounters() {
  if (prefersReducedMotion()) {
    return;
  }

  const metricValues = document.querySelectorAll('.metric-value');

  metricValues.forEach((element) => {
    const text = element.textContent.trim();

    // Extract numeric value from text
    const numericMatch = text.match(/[\d.]+/);

    if (numericMatch) {
      const targetValue = parseFloat(numericMatch[0]);
      const prefix = text.substring(0, numericMatch.index);
      const suffix = text.substring(numericMatch.index + numericMatch[0].length);

      // Store original text
      const originalText = text;

      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        once: false, // Only animate once
        onEnter: () => {
          // Reset to 0 before animating
          const displayObj = { value: 0 };

          gsap.to(displayObj, {
            value: targetValue,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: () => {
              // Format number (handle decimals)
              let formattedValue;
              if (text.includes('.')) {
                formattedValue = displayObj.value.toFixed(1);
              } else {
                formattedValue = Math.round(displayObj.value);
              }

              element.textContent = prefix + formattedValue + suffix;
            },
            onComplete: () => {
              // Ensure final value is exact
              element.textContent = originalText;
            },
          });
        },
      });
    }
  });

  console.log('Metric counters initialized');
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

  console.log('Metric hover effects initialized');
}
