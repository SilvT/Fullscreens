/**
 * Timeline Navigation Module
 * Based on CodePen structure with GSAP ScrollTrigger scroll-hijacking
 * https://codepen.io/nailaahmad/pen/MyZXVE
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialize Timeline with Scroll Hijacking
 * @param {HTMLElement} wrapper - The timeline wrapper element
 */
export function initTimeline(wrapper) {
  if (!wrapper) {
    console.error('Timeline wrapper not found');
    return;
  }

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    initMobileTimeline(wrapper);
    return;
  }

  const sectionsContainer = wrapper.querySelector('.timeline-sections');
  const sections = Array.from(wrapper.querySelectorAll('.timeline-section'));
  const navItems = Array.from(wrapper.querySelectorAll('.timeline-nav li'));
  const navWrapper = wrapper.querySelector('.timeline-nav');
  const peekIndicator = wrapper.querySelector('.timeline-peek');

  if (!sectionsContainer || sections.length === 0) {
    console.error('Timeline sections not found');
    return;
  }

  // State
  let currentSection = 0;
  let isAnimating = false;
  let scrollAccumulator = 0;
  let lastScrollY = 0;
  let scrollTriggerInstance = null;

  const SCROLL_THRESHOLD = 10;
  const ANIMATION_DURATION = 0.3;
  const totalSections = sections.length;

  // Calculate scroll distance
  const scrollDistancePerSection = window.innerHeight * 0.8;
  const totalScrollDistance = scrollDistancePerSection * totalSections;

  // Initialize: Position all sections
  sections.forEach((section, index) => {
    if (index === 0) {
      gsap.set(section, { y: '0%' });
    } else {
      gsap.set(section, { y: '100%' });
    }
  });

  // Set initial active state
  updateNavigation(0);
  updatePeekIndicator();
  updateNavVisibility();

  // Add global scroll listener for nav visibility
  window.addEventListener('scroll', updateNavVisibility, { passive: true });

  /**
   * Switch to a specific section
   */
  function switchToSection(targetIndex) {
    if (isAnimating || targetIndex === currentSection || targetIndex < 0 || targetIndex >= totalSections) {
      return;
    }

    isAnimating = true;
    const isGoingDown = targetIndex > currentSection;

    const currentEl = sections[currentSection];
    const targetEl = sections[targetIndex];

    // Animate current section out
    gsap.to(currentEl, {
      y: isGoingDown ? '-100%' : '100%',
      duration: ANIMATION_DURATION,
      ease: 'power2.inOut'
    });

    // Set target starting position and animate in
    gsap.fromTo(targetEl,
      { y: isGoingDown ? '100%' : '-100%' },
      {
        y: '0%',
        duration: ANIMATION_DURATION,
        ease: 'power2.inOut',
        onComplete: () => {
          currentSection = targetIndex;
          updateNavigation(currentSection);
          updatePeekIndicator();
          isAnimating = false;
          scrollAccumulator = 0;
        }
      }
    );
  }

  /**
   * Update navigation active state (like CodePen)
   */
  function updateNavigation(activeIndex) {
    navItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * Update peek indicator visibility
   */
  function updatePeekIndicator() {
    if (!peekIndicator) return;

    if (currentSection < totalSections - 1) {
      peekIndicator.classList.add('visible');
    } else {
      peekIndicator.classList.remove('visible');
    }
  }

  /**
   * Update navigation visibility based on wrapper position
   * Hide nav when outside .timeline-scroll-wrapper boundaries
   */
  function updateNavVisibility() {
    if (!navWrapper) return;

    // Get wrapper rect for accurate positioning during pinning
    const wrapperRect = wrapper.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Show navigation when wrapper is in viewport (accounting for pinning)
    // Hide when wrapper is above viewport (intro) or below (outro)
    const isWrapperInView = wrapperRect.top <= viewportHeight && wrapperRect.bottom >= viewportHeight * 0.5;

    if (isWrapperInView) {
      navWrapper.classList.add('visible');
    } else {
      navWrapper.classList.remove('visible');
    }
  }

  /**
   * Handle scroll within pinned container
   */
  function handleScroll(self) {
    if (isAnimating) return;

    const currentScrollY = self.scroll();
    const delta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Accumulate scroll
    scrollAccumulator += Math.abs(delta);

    // Check threshold
    if (scrollAccumulator >= SCROLL_THRESHOLD) {
      if (delta > 0 && currentSection < totalSections - 1) {
        // Scroll down
        switchToSection(currentSection + 1);
      } else if (delta < 0 && currentSection > 0) {
        // Scroll up
        switchToSection(currentSection - 1);
      }
      scrollAccumulator = 0;
    }
  }

  // Create ScrollTrigger to pin the wrapper
  scrollTriggerInstance = ScrollTrigger.create({
    trigger: wrapper,
    start: 'top top',
    end: `+=${totalScrollDistance}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    onUpdate: handleScroll,
    onEnter: () => {
      lastScrollY = 0;
      scrollAccumulator = 0;
    }
  });

  // Navigation click handlers (keep behavior from CodePen)
  navItems.forEach((item, index) => {
    const link = item.querySelector('a');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isAnimating && index !== currentSection) {
          switchToSection(index);
        }
      });
    }
  });

  // Keyboard navigation
  function handleKeydown(e) {
    const rect = wrapper.getBoundingClientRect();
    const isInView = rect.top <= 100 && rect.bottom > window.innerHeight * 0.5;

    if (!isInView) return;

    if (e.key === 'ArrowDown' && currentSection < totalSections - 1 && !isAnimating) {
      e.preventDefault();
      switchToSection(currentSection + 1);
    } else if (e.key === 'ArrowUp' && currentSection > 0 && !isAnimating) {
      e.preventDefault();
      switchToSection(currentSection - 1);
    }
  }

  document.addEventListener('keydown', handleKeydown);

  // Cleanup
  return () => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }
    document.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('scroll', updateNavVisibility);
  };
}

/**
 * Mobile timeline - simple click navigation
 */
function initMobileTimeline(wrapper) {
  const sections = Array.from(wrapper.querySelectorAll('.timeline-section'));
  const navItems = Array.from(wrapper.querySelectorAll('.timeline-nav li'));

  if (sections.length === 0 || navItems.length === 0) return;

  let currentSection = 0;

  // Set initial state
  sections.forEach((section, index) => {
    section.style.display = index === 0 ? 'flex' : 'none';
  });

  navItems.forEach((item, index) => {
    if (index === 0) item.classList.add('active');
  });

  // Click handlers
  navItems.forEach((item, index) => {
    const link = item.querySelector('a');
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (index === currentSection) return;

        // Hide current
        sections[currentSection].style.display = 'none';
        navItems[currentSection].classList.remove('active');

        // Show target
        sections[index].style.display = 'flex';
        navItems[index].classList.add('active');

        currentSection = index;

        // Scroll to wrapper
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });
}

/**
 * Generate Timeline HTML from JSON
 * @param {Object} timelineData - Timeline data from JSON
 * @returns {HTMLElement} - Generated timeline wrapper
 */
export function generateTimelineHTML(timelineData) {
  if (!timelineData || !timelineData.sections) {
    console.error('Invalid timeline data');
    return null;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'timeline-scroll-wrapper';

  // Create navigation
  const nav = document.createElement('nav');
  nav.className = 'timeline-nav';
  nav.setAttribute('aria-label', 'Timeline navigation');

  const navList = document.createElement('ul');

  // Create sections container
  const sectionsContainer = document.createElement('div');
  sectionsContainer.className = 'timeline-sections';

  // Generate navigation and sections
  timelineData.sections.forEach((section, index) => {
    // Navigation item
    const navItem = document.createElement('li');
    if (index === 0) navItem.classList.add('active');

    const navLink = document.createElement('a');
    navLink.href = `#timeline-section-${index}`;

    const bullet = document.createElement('span');
    bullet.className = 'timeline-nav__bullet';
    navLink.appendChild(bullet);

    const navContent = document.createElement('div');
    navContent.className = 'timeline-nav__content';

    const title = document.createElement('span');
    title.className = 'timeline-nav__title';
    title.textContent = section.title;
    navContent.appendChild(title);

    const label = document.createElement('span');
    label.className = 'timeline-nav__label';
    label.textContent = section.label;
    navContent.appendChild(label);

    navLink.appendChild(navContent);
    navItem.appendChild(navLink);
    navList.appendChild(navItem);

    // Section
    const sectionEl = document.createElement('div');
    sectionEl.className = 'timeline-section';
    sectionEl.id = `timeline-section-${index}`;
    sectionEl.setAttribute('data-section', index);

    const sectionContent = document.createElement('div');
    sectionContent.className = 'timeline-section__content';
    sectionContent.innerHTML = section.content;

    sectionEl.appendChild(sectionContent);
    sectionsContainer.appendChild(sectionEl);
  });

  nav.appendChild(navList);

  // Peek indicator
  const peek = document.createElement('div');
  peek.className = 'timeline-peek';

  wrapper.appendChild(nav);
  wrapper.appendChild(sectionsContainer);
  wrapper.appendChild(peek);

  // Transition section (after timeline)
  const transition = document.createElement('div');
  transition.className = 'timeline-transition';
  transition.innerHTML = `
    <div class="timeline-transition__content">
      <h3>Continue Reading</h3>
      <p>Scroll to continue through the case study</p>
    </div>
  `;

  // Return both wrapper and transition
  const container = document.createElement('div');
  container.appendChild(wrapper);
  container.appendChild(transition);

  return container;
}
