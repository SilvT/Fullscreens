// Import GSAP and ScrollTrigger
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio loaded');

  initScrollAnimations();
  initNavigationInteractions();
  initDynamicJobTitle();
});

/**
 * Initialize GSAP ScrollTrigger animations
 */
function initScrollAnimations() {
  // Animate sections on scroll
  const sections = document.querySelectorAll('[data-section]');

  sections.forEach((section, index) => {
    // Fade in animation for each section
    gsap.from(section, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse',
        markers: false // Set to true for debugging
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out'
    });
  });

  // Animate project images
  const projectImages = document.querySelectorAll('.project-image');

  projectImages.forEach((image) => {
    gsap.from(image, {
      scrollTrigger: {
        trigger: image,
        start: 'top 85%',
        end: 'top 30%',
        toggleActions: 'play none none reverse',
        markers: false
      },
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });
  });

  // Animate project content from left
  const contentMins = document.querySelectorAll('.content-min');

  contentMins.forEach((content) => {
    gsap.from(content, {
      scrollTrigger: {
        trigger: content,
        start: 'top 75%',
        end: 'top 25%',
        toggleActions: 'play none none reverse',
        markers: false
      },
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });
  });

  // Animate metrics cards
  const metricCards = document.querySelectorAll('.metric-card');

  metricCards.forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
        markers: false
      },
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: index * 0.1,
      ease: 'power2.out'
    });
  });

  // Parallax effect for project images
  projectImages.forEach((image) => {
    gsap.to(image, {
      scrollTrigger: {
        trigger: image.closest('.project-image-wrapper'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        markers: false
      },
      y: -50,
      ease: 'none'
    });
  });

  // Animate navigation on scroll
  const navs = document.querySelectorAll('.top-nav');

  navs.forEach((nav) => {
    ScrollTrigger.create({
      trigger: nav.closest('section'),
      start: 'top top',
      end: 'bottom top',
      onEnter: () => {
        gsap.to(nav, {
          backgroundColor: 'rgba(237, 241, 243, 0.95)',
          duration: 0.3
        });
      },
      onLeaveBack: () => {
        gsap.to(nav, {
          backgroundColor: 'transparent',
          duration: 0.3
        });
      }
    });
  });

  // Animate CTA buttons
  const ctaButtons = document.querySelectorAll('.cta-button');

  ctaButtons.forEach((button) => {
    gsap.from(button, {
      scrollTrigger: {
        trigger: button,
        start: 'top 90%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
        markers: false
      },
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)'
    });
  });

  // Animate tags
  const tags = document.querySelectorAll('.tags');

  tags.forEach((tag) => {
    gsap.from(tag, {
      scrollTrigger: {
        trigger: tag,
        start: 'top 90%',
        end: 'top 60%',
        toggleActions: 'play none none reverse',
        markers: false
      },
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // About section animations
  const aboutName = document.querySelector('.name');
  const aboutDescription = document.querySelector('.description');

  if (aboutName) {
    gsap.from(aboutName, {
      scrollTrigger: {
        trigger: aboutName,
        start: 'top 80%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
        markers: false
      },
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });
  }

  if (aboutDescription) {
    gsap.from(aboutDescription, {
      scrollTrigger: {
        trigger: aboutDescription,
        start: 'top 80%',
        end: 'top 40%',
        toggleActions: 'play none none reverse',
        markers: false
      },
      x: 50,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: 'power2.out'
    });
  }
}

/**
 * Initialize navigation interactions
 */
function initNavigationInteractions() {
  const navLinks = document.querySelectorAll('.nav-item');

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Update active state
        document.querySelectorAll('.nav-item').forEach((item) => {
          item.classList.remove('active');
        });
        link.classList.add('active');

        // Smooth scroll to section
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Update active navigation on scroll
  const sections = document.querySelectorAll('[data-section]');

  sections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => updateActiveNav(section),
      onEnterBack: () => updateActiveNav(section)
    });
  });
}

/**
 * Update active navigation item based on current section
 */
function updateActiveNav(section) {
  const sectionType = section.getAttribute('data-section');

  // Find corresponding nav link
  let targetHref = '#about';

  if (sectionType === 'about') {
    targetHref = '#about';
  } else if (sectionType === 'project') {
    targetHref = '#works';
  }

  // Update all navigation items in all nav bars
  document.querySelectorAll('.navigation').forEach((nav) => {
    const links = nav.querySelectorAll('.nav-item');
    links.forEach((link) => {
      if (link.getAttribute('href') === targetHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
}

/**
 * Initialize dynamic job title animation
 */
function initDynamicJobTitle() {
  const jobTitles = document.querySelectorAll('.dynamic-job-title .job-title');

  if (jobTitles.length === 0) return;

  let currentIndex = 1; // Start with "Designer" visible

  // Animate job titles rotation
  const rotateTitles = () => {
    // Fade out current
    gsap.to(jobTitles[currentIndex], {
      opacity: 0,
      y: -10,
      duration: 0.5,
      ease: 'power2.in',
      onComplete: () => {
        // Move to next title
        currentIndex = (currentIndex + 1) % jobTitles.length;

        // Fade in next
        gsap.fromTo(jobTitles[currentIndex],
          {
            opacity: 0,
            y: 10
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          }
        );
      }
    });
  };

  // Rotate every 3 seconds
  setInterval(rotateTitles, 3000);
}

/**
 * Handle CTA button interactions
 */
const ctaButtons = document.querySelectorAll('.cta-button');

ctaButtons.forEach((button) => {
  button.addEventListener('mouseenter', () => {
    gsap.to(button, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  });

  button.addEventListener('click', (e) => {
    e.preventDefault();

    // Animate button press
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    });

    // Here you can add logic to navigate to case study
    console.log('Navigate to case study:', button.getAttribute('href'));
  });
});

/**
 * Smooth scroll for all anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Only handle internal navigation links
    if (href.startsWith('#about') || href.startsWith('#works') || href.startsWith('#contact')) {
      e.preventDefault();

      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Add intersection observer for lazy loading optimization
const observerOptions = {
  root: null,
  rootMargin: '50px',
  threshold: 0.01
};

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;

      // Add loaded class for any additional styling
      img.classList.add('loaded');

      // Stop observing this image
      imageObserver.unobserve(img);
    }
  });
}, observerOptions);

// Observe all project images
document.querySelectorAll('.project-image').forEach((img) => {
  imageObserver.observe(img);
});

// Log for debugging
console.log('GSAP ScrollTrigger initialized');
console.log('Sections found:', document.querySelectorAll('[data-section]').length);
