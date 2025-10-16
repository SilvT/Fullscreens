/**
 * Section Animations Module
 * Handles fade-in, slide, and transition animations for sections
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
 * Initialize section animations
 */
export function initSectionAnimations() {
  if (prefersReducedMotion()) {
    console.log('Section animations disabled: user prefers reduced motion');
    return;
  }

  const sections = document.querySelectorAll('[data-section]');

  sections.forEach((section, index) => {
    // Fade in animation for each section
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
        markers: false,
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out',
    });

    // Fade out previous section as new one enters (subtle)
    if (index > 0) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'top 40%',
        onEnter: () => {
          const prevSection = sections[index - 1];
          gsap.to(prevSection, {
            opacity: 0.7,
            duration: 0.6,
            ease: 'power1.out',
          });
        },
        onLeaveBack: () => {
          const prevSection = sections[index - 1];
          gsap.to(prevSection, {
            opacity: 1,
            duration: 0.6,
            ease: 'power1.out',
          });
        },
      });
    }
  });

  console.log('Section animations initialized');
}

/**
 * Initialize text fade-in animations with stagger
 */
export function initTextAnimations() {
  if (prefersReducedMotion()) {
    return;
  }

  // Animate project titles
  const projectTitles = document.querySelectorAll('.project-title');

  projectTitles.forEach((title) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  // Animate project descriptions with stagger
  const projectDetails = document.querySelectorAll('.project-description, .project-details');

  projectDetails.forEach((detail) => {
    gsap.from(detail, {
      scrollTrigger: {
        trigger: detail,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 15,
      duration: 0.8,
      delay: 0.2,
      ease: 'power2.out',
    });
  });

  // Animate about section content
  const nameWrapper = document.querySelector('.name-wrapper');
  const description = document.querySelector('.description');

  if (nameWrapper) {
    gsap.from(nameWrapper, {
      scrollTrigger: {
        trigger: nameWrapper,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'power2.out',
    });
  }

  if (description) {
    gsap.from(description, {
      scrollTrigger: {
        trigger: description,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      x: 50,
      duration: 1,
      ease: 'power2.out',
    });
  }

  console.log('Text animations initialized');
}

/**
 * Initialize image animations with parallax
 */
export function initImageAnimations() {
  if (prefersReducedMotion()) {
    return;
  }

  const projectImages = document.querySelectorAll('.project-image');

  projectImages.forEach((image) => {
    // Fade in and scale
    gsap.from(image, {
      scrollTrigger: {
        trigger: image,
        start: 'top 85%',
        end: 'top 30%',
        toggleActions: 'play none none reverse',
      },
      scale: 0.85,
      opacity: 0,
      duration: 1.2,
      ease: 'power2.out',
    });

    // Subtle parallax effect
    gsap.to(image, {
      scrollTrigger: {
        trigger: image,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      y: -30,
      ease: 'none',
    });
  });

  console.log('Image animations initialized');
}

/**
 * Initialize CTA button animations
 */
export function initCTAAnimations() {
  if (prefersReducedMotion()) {
    return;
  }

  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach((button) => {
    // Fade in with bounce
    gsap.from(button, {
      scrollTrigger: {
        trigger: button,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)',
    });

    // Hover interactions
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    });

    // Click animation
    button.addEventListener('click', (e) => {
      gsap.fromTo(
        button,
        { scale: 1.05 },
        { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 }
      );
    });
  });

  console.log('CTA animations initialized');
}

/**
 * Initialize tag animations
 */
export function initTagAnimations() {
  if (prefersReducedMotion()) {
    return;
  }

  const tags = document.querySelectorAll('.tags');

  tags.forEach((tagGroup) => {
    gsap.from(tagGroup, {
      scrollTrigger: {
        trigger: tagGroup,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    });
  });

  console.log('Tag animations initialized');
}
