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
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

        targetSection.scrollIntoView({ behavior: scrollBehavior });
        updateActiveNav(targetId);
      }
    });
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
      nav.classList.toggle('scrolled', scrollPos > 50);
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
 * Get theme class for section
 * @param {HTMLElement} section - Section element
 * @returns {string|null} Theme class name or null
 */
function getSectionThemeClass(section) {
  const sectionId = section.getAttribute('id');

  if (sectionId === 'contact') return 'section-contact';
  if (section.classList.contains('project-blue')) return 'section-blue';
  if (section.classList.contains('project-green')) return 'section-green';
  if (section.classList.contains('project-neutral')) return 'section-neutral';

  return null;
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

  // Add appropriate theme class
  const themeClass = getSectionThemeClass(section);
  if (themeClass) {
    nav.classList.add(themeClass);
  }

  // Update active nav item based on section
  const targetNavHref = sectionType === 'project' ? '#project-1' : `#${sectionId}`;
  updateActiveNav(targetNavHref);
}

/**
 * Add keyboard navigation support
 */
export function initKeyboardNav() {
  const navItems = document.querySelectorAll('.nav-item');

  navItems.forEach((item) => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
}
