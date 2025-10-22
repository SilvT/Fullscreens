/**
 * Scroll Transitions Module
 * Implements scroll-driven animations for fixed content sections
 * Inspired by CSS view-timeline animations but using GSAP for cross-browser support
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animation presets
const ANIMATION_PRESETS = {
  // Simple fade - just opacity, no blur or contrast
  fade: {
    from: {
      opacity: 0,
      visibility: 'hidden',
    },
    to: {
      opacity: 1,
      visibility: 'visible',
    },
  },

  // Blink effect - blur and fade in/out (original CodePen effect)
  blink: {
    from: {
      opacity: 0,
      visibility: 'hidden',
      filter: 'blur(0.5rem) contrast(4)',
    },
    to: {
      opacity: 1,
      visibility: 'visible',
      filter: 'blur(0) contrast(1)',
    },
  },

  // Horizontal slide
  horizontalSlide: {
    from: {
      opacity: 1,
      visibility: 'visible',
      x: '100%',
    },
    to: {
      opacity: 1,
      visibility: 'visible',
      x: '0%',
    },
  },

  // Zoom effect
  zoom: {
    from: {
      opacity: 0,
      visibility: 'hidden',
      filter: 'blur(5rem)',
      scale: 0,
    },
    to: {
      opacity: 1,
      visibility: 'visible',
      filter: 'blur(0)',
      scale: 1,
    },
  },

  // Vertical slide (backwards scroll)
  verticalSlide: {
    from: {
      opacity: 1,
      visibility: 'visible',
      y: '-100%',
    },
    to: {
      opacity: 1,
      visibility: 'visible',
      y: '0%',
    },
  },
};

// Default animation to use
let currentAnimation = 'blink';

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Initialize scroll-driven transitions for sections
 * @param {string} animationType - The type of animation to use
 */
export function initScrollTransitions(animationType = 'blink') {
  // Don't apply animations if user prefers reduced motion
  if (prefersReducedMotion()) {
    console.log('Scroll transitions disabled: user prefers reduced motion');
    // Show all sections without animations
    gsap.set('.contentbox', { opacity: 1, visibility: 'visible' });
    return;
  }

  currentAnimation = animationType;
  const preset = ANIMATION_PRESETS[animationType] || ANIMATION_PRESETS.blink;

  // Get all sections (both landing and project sections)
  const sections = gsap.utils.toArray('section');

  console.log(`Found ${sections.length} sections to animate`);

  // IMPORTANT: Make the first section visible immediately on load
  const firstSection = sections[0];
  if (firstSection) {
    const firstContentbox = firstSection.querySelector('.contentbox');
    if (firstContentbox) {
      gsap.set(firstContentbox, { opacity: 1, visibility: 'visible' });
      console.log('First section set to visible');
    }
  }

  sections.forEach((section, index) => {
    const contentbox = section.querySelector('.contentbox');

    if (!contentbox) {
      console.warn('No contentbox found for section:', section.id);
      return;
    }

    console.log('Setting up scroll transition for:', section.id);

    // Create timeline for this section
    // Content fades in as section enters, visible at center, fades out as section leaves
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top bottom', // When section top hits viewport bottom
        end: 'bottom top', // When section bottom hits viewport top
        scrub: true, // Instant scrubbing (no delay)
        markers: false, // Disable debug markers
        id: `section-${index}`,
        // Ensure content is visible when section is snapped at top
        onUpdate: (self) => {
          // When section is at snap position (top: 0), progress should be ~0.5 (visible)
          // This helps with the scroll-up issue
        },
      },
    });

    // Optimized animation timing:
    // 0-0.3: Fast fade IN (30% of scroll range) - appears quickly
    // 0.3-0.7: Fully visible and stable (40% of scroll range) - stays visible longer
    // 0.7-1: Fade OUT (30% of scroll range)
    tl.fromTo(
      contentbox,
      {
        ...preset.from,
      },
      {
        ...preset.to,
        duration: 0.3, // Faster fade in
        ease: 'power2.out',
      },
      0
    ).to(
      contentbox,
      {
        ...preset.to, // Stay fully visible
        duration: 0.4, // Hold visible state longer
        ease: 'none',
      },
      0.3
    ).to(
      contentbox,
      {
        ...preset.from,
        duration: 0.3, // Fade out
        ease: 'power2.in',
      },
      0.7
    );
  });

  console.log(`✓ Scroll transitions initialized with "${animationType}" animation for ${sections.length} sections`);
}

/**
 * Change animation type dynamically
 * @param {string} animationType - The new animation type
 */
export function changeAnimationType(animationType) {
  if (prefersReducedMotion()) {
    console.log('Animation changes disabled: user prefers reduced motion');
    return;
  }

  // Kill all existing ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.animation) {
      trigger.kill();
    }
  });

  // Re-initialize with new animation
  initScrollTransitions(animationType);
  console.log(`✓ Switched to "${animationType}" animation`);
}

/**
 * Disable scroll transitions
 */
export function disableScrollTransitions() {
  ScrollTrigger.getAll().forEach((trigger) => {
    if (trigger.animation) {
      trigger.kill();
    }
  });

  // Show all sections
  gsap.set('.contentbox', { opacity: 1, visibility: 'visible', clearProps: 'all' });
  console.log('Scroll transitions disabled');
}

/**
 * Listen for changes to motion preference
 */
export function watchMotionPreference() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const handleMotionChange = (e) => {
    if (e.matches) {
      disableScrollTransitions();
    } else {
      initScrollTransitions(currentAnimation);
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleMotionChange);
  } else {
    mediaQuery.addListener(handleMotionChange);
  }
}
