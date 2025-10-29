/**
 * Card Enhancements Module
 * Advanced GSAP animations for project cards
 * - Parallax images
 * - Magnetic CTA buttons
 * - Staggered content reveal
 * - Color transitions
 * - Code-snippet style tag animations
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 1. Parallax effect on project images
 * Images move at different speed than scroll for depth
 */
export function initParallaxImages() {
  if (prefersReducedMotion()) return;

  const images = document.querySelectorAll('.project-image');

  images.forEach((image) => {
    gsap.to(image, {
      yPercent: 15, // Move down 15% from starting position
      ease: 'none',
      scrollTrigger: {
        trigger: image.closest('.section-project'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: true, // Smooth parallax tied to scroll
      },
    });
  });

  console.log('✓ Parallax images initialized');
}

/**
 * 2. Magnetic hover effect on CTA buttons
 * Button follows cursor with smooth spring animation
 */
export function initMagneticButtons() {
  if (prefersReducedMotion()) return;

  const buttons = document.querySelectorAll('.cta-button');

  buttons.forEach((button) => {
    const magneticStrength = 0.3; // How much button moves (30% of distance)
    const magneticRadius = 80; // Activation radius in pixels

    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < magneticRadius) {
        gsap.to(button, {
          x: deltaX * magneticStrength,
          y: deltaY * magneticStrength,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    });
  });

  console.log('✓ Magnetic buttons initialized');
}

/**
 * 3. Staggered content reveal
 * Content appears in sequence: title → description → details → image → tags
 */
export function initStaggeredReveal() {
  if (prefersReducedMotion()) return;

  const sections = document.querySelectorAll('.section-project');
  console.log(`Found ${sections.length} project sections for staggered reveal`);

  sections.forEach((section, index) => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
        markers: false, // Set to true for debugging
        onEnter: () => console.log(`Stagger animation started for section ${index}`),
      },
    });

    // Helper to safely animate if element exists
    const animateIfExists = (selector, props, position) => {
      const element = section.querySelector(selector);
      if (element) {
        timeline.from(element, props, position);
      }
    };

    // Stagger animation sequence
    animateIfExists('.project-title', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
    }, 0);

    animateIfExists('.project-description', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.1);

    animateIfExists('.project-details', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.2);

    animateIfExists('.project-meta', {
      opacity: 0,
      y: 15,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.25);

    animateIfExists('.project-image-wrapper', {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: 'power2.out',
    }, 0.3);

    animateIfExists('.cta-button', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.5);

    animateIfExists('.tags', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.6);
  });

  console.log('✓ Staggered content reveal initialized');
}

/**
 * 4. Enhanced metric counter animation
 * Numbers count up with easing when visible + scale bounce effect
 * Triggers 1 second after scroll settles on the section
 */
export function initMetricCounters() {
  if (prefersReducedMotion()) return;

  const metricsContainers = document.querySelectorAll('.metrics');
  console.log(`Found ${metricsContainers.length} metrics containers`);

  metricsContainers.forEach((container) => {
    const cards = container.querySelectorAll('.metric-card');
    const section = container.closest('section');
    let hasAnimated = false;
    let scrollTimeout;
    let delayedCall;

    if (!section) return;

    // Detect when scroll settles on this section
    const detectScrollSettle = () => {
      // Clear existing timeouts
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (delayedCall) delayedCall.kill();

      // Wait for scroll to stop (5ms of no scrolling - overlap with scroll end)
      scrollTimeout = setTimeout(() => {
        // Check if this section is currently centered in viewport
        const rect = section.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const sectionCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);

        // If section is centered (within 100px tolerance) and hasn't animated yet
        if (distanceFromCenter < 100 && !hasAnimated) {
          // Trigger animations immediately
          hasAnimated = true;
          animateMetrics();
        }
      }, 50);
    };

    // Animation function
    const animateMetrics = () => {
      cards.forEach((card, index) => {
        const metricValue = card.querySelector('.metric-value');
        if (!metricValue) return;

        const targetValue = metricValue.textContent;
        const numericValue = parseFloat(targetValue.replace(/[^0-9.-]/g, ''));

        if (isNaN(numericValue)) return;

        const suffix = targetValue.replace(/[0-9.-]/g, ''); // Extract %, +, etc.

        // Reset to 0
        metricValue.textContent = '0' + suffix;

        // Stagger each card slightly
        gsap.to(card, {
          delay: index * 0.1,
          duration: 0.6,
          scale: 1.1,
          ease: 'back.out(1.7)',
          onStart: () => {
            // Count up numbers with larger scale
            gsap.to(metricValue, {
              textContent: numericValue,
              duration: 2,
              ease: 'power2.out',
              snap: { textContent: 1 },
              onUpdate: function() {
                metricValue.textContent = Math.round(this.targets()[0].textContent) + suffix;
              },
            });
          },
          onComplete: () => {
            // Bounce back to normal size
            gsap.to(card, {
              scale: 1,
              duration: 0.3,
              ease: 'power2.inOut',
            });
          },
        });
      });
    };

    // Listen for scroll events
    window.addEventListener('scroll', detectScrollSettle, { passive: true });

    // Also trigger check on page load (in case section is already centered)
    setTimeout(detectScrollSettle, 100);
  });

  console.log('✓ Enhanced metric counters initialized (triggers immediately on scroll settle)');
}

/**
 * 5. Color transition on scroll
 * Card background subtly shifts as you scroll through it
 */
export function initColorTransitions() {
  if (prefersReducedMotion()) return;

  const sections = document.querySelectorAll('.section-project');

  sections.forEach((section) => {
    const contentbox = section.querySelector('.contentbox');
    if (!contentbox) return;

    const isBlue = section.classList.contains('project-blue');
    const isGreen = section.classList.contains('project-green');

    let startColor, endColor;

    if (isBlue) {
      startColor = '#EDF1F3'; // Lighter blue
      endColor = '#D8E5ED'; // Slightly darker blue
    } else if (isGreen) {
      startColor = '#E8EBE0'; // Lighter green
      endColor = '#D5DBCC'; // Slightly darker green
    } else {
      startColor = '#F5F3F0'; // Cream
      endColor = '#EAE7E2'; // Slightly darker cream
    }

    gsap.to(contentbox, {
      backgroundColor: endColor,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
      },
    });
  });

  console.log('✓ Color transitions initialized');
}

/**
 * 6. Code-snippet style tag animation
 * Tags appear like old computer terminal typing - letter by letter with blinking cursor
 */
export function initCodeSnippetTags() {
  if (prefersReducedMotion()) return;

  const tagContainers = document.querySelectorAll('.tags');

  tagContainers.forEach((container) => {
    const tagList = container.querySelector('.tag-list');
    if (!tagList) return;

    const tags = Array.from(tagList.children);
    const section = container.closest('section');
    let hasAnimated = false;
    let scrollTimeout;

    if (!section) return;

    // Hide individual tags initially (not the container)
    tags.forEach(tag => {
      tag.style.opacity = '0';
      tag.style.visibility = 'hidden';
    });

    // Detect when scroll settles on this section
    const detectScrollSettle = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const rect = section.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const sectionCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);

        // If section is centered and hasn't animated yet
        if (distanceFromCenter < 100 && !hasAnimated) {
          hasAnimated = true;
          // Add delay before starting tag animation (1 second = double the previous 0.5s)
          gsap.delayedCall(1, animateTags);
        }
      }, 5);
    };

    // Typewriter animation function
    const animateTags = () => {
      // Store original text and dimensions (tags already hidden from init)
      const originalTexts = tags.map(tag => tag.textContent);

      // Temporarily show all tags to measure their final widths
      tags.forEach(tag => {
        tag.style.visibility = 'visible';
        tag.style.opacity = '1';
      });

      // Store exact widths for each tag
      const tagWidths = tags.map(tag => tag.offsetWidth);

      // Hide them again and set their exact widths
      tags.forEach((tag, index) => {
        tag.style.visibility = 'hidden';
        tag.style.opacity = '0';
        tag.style.width = tagWidths[index] + 'px';
        tag.style.display = 'inline-block';
      });

      // Create single cursor element with zero width
      const cursor = document.createElement('span');
      cursor.textContent = '|';
      cursor.style.opacity = '0';
      cursor.style.animation = 'blink 0.5s infinite';
      cursor.style.position = 'absolute';
      cursor.style.pointerEvents = 'none';

      // Insert cursor container at the beginning of tag list
      if (tags.length > 0) {
        tagList.style.position = 'relative';
        tagList.appendChild(cursor);
      }

      let currentTagIndex = 0;

      const typeNextTag = () => {
        if (currentTagIndex >= tags.length) {
          // All done - remove cursor
          cursor.remove();
          return;
        }

        const tag = tags[currentTagIndex];
        const text = originalTexts[currentTagIndex];
        const isSeparator = text.trim() === '|';

        // Position cursor absolutely at the tag's position
        const tagRect = tag.getBoundingClientRect();
        const listRect = tagList.getBoundingClientRect();
        cursor.style.left = (tagRect.left - listRect.left) + 'px';
        cursor.style.top = '0';

        // Show cursor and pulse
        cursor.style.opacity = '1';

        const pulseTime = isSeparator ? 10 : 1000; // 10ms for separators (was 5), 1000ms for words (was 500)

        setTimeout(() => {
          // Hide cursor immediately when typing starts
          cursor.style.opacity = '0';

          if (isSeparator) {
            // Separators just appear instantly
            tag.style.opacity = '1';
            tag.style.visibility = 'visible';
            tag.textContent = text;
            currentTagIndex++;
            setTimeout(typeNextTag, 10); // Doubled from 5ms
          } else {
            // Words type letter by letter
            tag.style.opacity = '1';
            tag.style.visibility = 'visible';
            tag.textContent = '';

            let letterIndex = 0;
            const typeInterval = setInterval(() => {
              if (letterIndex < text.length) {
                tag.textContent += text[letterIndex];
                letterIndex++;
              } else {
                clearInterval(typeInterval);
                // Move to next tag
                currentTagIndex++;
                // Small pause before next tag
                setTimeout(typeNextTag, 200); // Doubled from 100ms
              }
            }, 100); // Doubled from 50ms per letter
          }
        }, pulseTime);
      };

      // Start typing first tag
      typeNextTag();
    };

    // Listen for scroll events
    window.addEventListener('scroll', detectScrollSettle, { passive: true });
    setTimeout(detectScrollSettle, 100);
  });

  // Add cursor blink animation to stylesheet if not exists
  if (!document.getElementById('cursor-blink-style')) {
    const style = document.createElement('style');
    style.id = 'cursor-blink-style';
    style.textContent = `
      @keyframes blink {
        0%, 49% { opacity: 1; }
        50%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  console.log('✓ Typewriter tag animations initialized with delay');
}

/**
 * Initialize all card enhancements
 */
export function initAllCardEnhancements() {
  initParallaxImages();
  initMagneticButtons();
  // TEMPORARY: Disable staggered reveal (conflicts with scroll transitions)
  // initStaggeredReveal();
  initMetricCounters();
  initColorTransitions();
  // Disabled: Tag typewriter animation
  // initCodeSnippetTags();

  console.log('✨ All card enhancements initialized');
}
