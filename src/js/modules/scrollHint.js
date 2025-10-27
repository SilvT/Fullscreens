/**
 * Scroll Hint Animation Module
 * Ripple animation with "scroll" text
 */

/**
 * Initialize scroll hint animation
 */
export function initScrollHint() {
  const scrollHint = document.querySelector('.scroll-hint');

  if (!scrollHint) {
    console.warn('Scroll hint element not found');
    return;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    console.log('Reduced motion preferred - scroll hint disabled');
    scrollHint.style.display = 'none';
    return;
  }

  // Add click handler to scroll to first project
  scrollHint.addEventListener('click', () => {
    const firstProject = document.querySelector('#project-1');
    if (firstProject) {
      // Use custom smooth scroll for more control
      const targetPosition = firstProject.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition - (window.innerHeight / 2) + (firstProject.offsetHeight / 2);
      const duration = 1500; // 1.5 seconds for a slower, smoother scroll
      let start = null;

      function smoothScroll(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);

        // Easing function for smoother animation (ease-in-out cubic)
        const easing = progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startPosition + distance * easing);

        if (timeElapsed < duration) {
          requestAnimationFrame(smoothScroll);
        }
      }

      requestAnimationFrame(smoothScroll);
    }
  });

  // Show scroll hint when About section is in view
  showScrollHint();

  console.log('✓ Scroll hint animation initialized');
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
