/**
 * Navigation Module
 * Handles sticky navigation, active states, and section-based styling
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Initialize navigation interactions
 */
export function initNavigation() {
  const nav = document.querySelector('.top-nav');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('[data-section]');

  if (!nav) {
    return;
  }

  // Smooth scroll to sections on nav click
  navItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Check if reduced motion is preferred
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
          // Instant scroll for reduced motion
          targetSection.scrollIntoView({ behavior: 'auto' });
        } else {
          // Smooth scroll
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Update active state immediately for better UX
        updateActiveNav(targetId);
      }
    });
  });

  sections.forEach((section, index) => {
  });

  // Update navigation based on scroll position
  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        updateNavStyles(section);
      },
      onEnterBack: () => {
        updateNavStyles(section);
      },
    });
  });

  // Add/remove scrolled class based on scroll position
  ScrollTrigger.create({
    start: 'top -50',
    end: 'max',
    onUpdate: (self) => {
      const scrollPos = self.scroll();
      if (scrollPos > 50) {
        if (!nav.classList.contains('scrolled')) {
          nav.classList.add('scrolled');
        }
      } else {
        if (nav.classList.contains('scrolled')) {
          nav.classList.remove('scrolled');
        }
      }
    },
  });

}

/**
 * Update active navigation item
 * @param {string} sectionId - ID of the active section
 */
function updateActiveNav(sectionId) {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item) => {
    const href = item.getAttribute('href');

    if (href === sectionId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

/**
 * Update navigation styles based on current section
 * @param {HTMLElement} section - Current section element
 */
function updateNavStyles(section) {
  const nav = document.querySelector('.top-nav');
  const sectionType = section.getAttribute('data-section');
  const sectionId = section.getAttribute('id');


  // Remove all section classes
  nav.classList.remove('section-blue', 'section-green', 'section-neutral', 'section-contact');

  // Check if it's the contact/footer section
  if (sectionId === 'contact') {
    nav.classList.add('section-contact');
  }
  // Add section-specific class based on project theme
  else if (section.classList.contains('project-blue')) {
    nav.classList.add('section-blue');
  } else if (section.classList.contains('project-green')) {
    nav.classList.add('section-green');
  } else if (section.classList.contains('project-neutral')) {
    nav.classList.add('section-neutral');
  } else {
  }


  // Update active nav item based on section
  let targetNavHref = `#${sectionId}`;

  // Map project sections to "works" nav item
  if (sectionType === 'project') {
    targetNavHref = '#project-1'; // Point to first project for "works"
  }

  updateActiveNav(targetNavHref);
}

/**
 * Add keyboard navigation support
 */
export function initKeyboardNav() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item) => {
    // Handle keyboard navigation (Enter and Space)
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

}
