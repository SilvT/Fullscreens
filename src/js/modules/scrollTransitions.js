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
      pointerEvents: 'none', // CRITICAL: Disable pointer events when hidden
    },
    to: {
      opacity: 1,
      visibility: 'visible',
      pointerEvents: 'auto', // CRITICAL: Enable pointer events when visible
    },
  },

  // Blink effect - blur and fade in/out (original CodePen effect)
  blink: {
    from: {
      opacity: 0,
      visibility: 'hidden',
      filter: 'blur(0.5rem) contrast(4)',
      pointerEvents: 'none', // CRITICAL: Disable pointer events when hidden
    },
    to: {
      opacity: 1,
      visibility: 'visible',
      filter: 'blur(0) contrast(1)',
      pointerEvents: 'auto', // CRITICAL: Enable pointer events when visible
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
    // Show all sections without animations
    gsap.set('.contentbox', { opacity: 1, visibility: 'visible' });
    return;
  }

  currentAnimation = animationType;
  const preset = ANIMATION_PRESETS[animationType] || ANIMATION_PRESETS.blink;

  // Get all sections with data-section attribute (excludes case study sections)
  const sections = gsap.utils.toArray('section[data-section]');


  // IMPORTANT: Make the first section visible immediately on load
  const firstSection = sections[0];
  if (firstSection) {
    const firstContentbox = firstSection.querySelector('.contentbox');
    if (firstContentbox) {
      gsap.set(firstContentbox, {
        opacity: 1,
        visibility: 'visible',
        pointerEvents: 'auto' // CRITICAL: Enable clicks on first section
      });
    }
  }

  sections.forEach((section, index) => {
    const contentbox = section.querySelector('.contentbox');

    if (!contentbox) {
      return;
    }


    // DEBUG: Add click listener to detect which section is being clicked
    section.addEventListener('click', (e) => {
      const sectionId = section.id;
      const projectTitle = section.querySelector('.project-title')?.textContent || 'Unknown';
      const computedZ = window.getComputedStyle(contentbox).zIndex;
      const computedPointer = window.getComputedStyle(contentbox).pointerEvents;
    });

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
        // CRITICAL FIX: Control z-index and pointer-events based on visibility
        onUpdate: (self) => {
          const progress = self.progress;
          // Section is visible when progress is between 0.3 and 0.7 (the middle 40%)
          const isVisible = progress >= 0.3 && progress <= 0.7;

          if (isVisible) {
            // Bring to front and enable clicks
            gsap.set(contentbox, { zIndex: 20, pointerEvents: 'auto' });
          } else {
            // Send to back and disable clicks
            gsap.set(contentbox, { zIndex: 5, pointerEvents: 'none' });
          }
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

  // DEBUG: Verify pointer events after a short delay
  setTimeout(() => {
    sections.forEach((section, idx) => {
      const contentbox = section.querySelector('.contentbox');
      if (contentbox) {
        const computedStyle = window.getComputedStyle(contentbox);
      }
    });
  }, 500);

}

/**
 * Change animation type dynamically
 * @param {string} animationType - The new animation type
 */
export function changeAnimationType(animationType) {
  if (prefersReducedMotion()) {
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
