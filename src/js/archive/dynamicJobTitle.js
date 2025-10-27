/**
 * Dynamic Job Title Module
 * Word-by-word reveal with accent elements
 * Inspired by high-end design studios (Halo, Pentagram)
 */

import gsap from 'gsap';

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Split text into words and wrap each in a span
 */
function splitIntoWords(element) {
  const text = element.textContent.trim();
  const words = text.split(/\s+/);

  element.innerHTML = words
    .map((word) => `<span class="word">${word}</span>`)
    .join(' ');

  return element.querySelectorAll('.word');
}

/**
 * Create accent elements (dots, dashes, brackets)
 */
function createAccentElement(type = 'dot') {
  const accent = document.createElement('span');
  accent.className = `accent accent-${type}`;

  switch (type) {
    case 'dot':
      accent.textContent = '•';
      break;
    case 'dash':
      accent.textContent = '—';
      break;
    case 'bracket-open':
      accent.textContent = '[';
      break;
    case 'bracket-close':
      accent.textContent = ']';
      break;
  }

  return accent;
}

/**
 * Add accent elements around a title element
 */
function addAccentElements(titleElement, index) {
  const accentTypes = ['dot', 'dash', 'bracket-open'];
  const accentType = accentTypes[index % accentTypes.length];

  const container = document.createElement('div');
  container.className = 'title-with-accents';

  // Create opening accent
  const openAccent = createAccentElement(accentType);
  openAccent.classList.add('accent-open');

  // Create closing accent
  let closeAccent;
  if (accentType === 'bracket-open') {
    closeAccent = createAccentElement('bracket-close');
  } else {
    closeAccent = createAccentElement(accentType);
  }
  closeAccent.classList.add('accent-close');

  // Wrap title
  const titleWrapper = titleElement.cloneNode(true);
  container.appendChild(openAccent);
  container.appendChild(titleWrapper);
  container.appendChild(closeAccent);

  // Replace original with container
  titleElement.parentNode.replaceChild(container, titleElement);

  return {
    container,
    openAccent,
    closeAccent,
    title: titleWrapper,
  };
}

/**
 * Initialize dynamic job title rotation
 */
export function initDynamicJobTitle() {
  const jobTitles = document.querySelectorAll('.job-title');

  if (jobTitles.length === 0) {
    return;
  }

  // If reduced motion, just show all titles statically
  if (prefersReducedMotion()) {
    jobTitles.forEach((title) => {
      title.classList.remove('hidden', 'visible');
      gsap.set(title, { opacity: 1, y: 0 });
    });
    console.log('Dynamic job title disabled: user prefers reduced motion');
    return;
  }

  let currentIndex = 0;
  const titlesData = [];

  // Process each title: split into words and add accents
  jobTitles.forEach((title, index) => {
    const { container, openAccent, closeAccent, title: titleElement } =
      addAccentElements(title, index);

    const words = splitIntoWords(titleElement);

    titlesData.push({
      container,
      openAccent,
      closeAccent,
      title: titleElement,
      words: Array.from(words),
    });
  });

  // Set initial state
  titlesData.forEach((data, index) => {
    if (index === 0) {
      data.container.classList.add('visible');
      data.container.classList.remove('hidden');

      // Set initial state for words and accents
      gsap.set(data.words, { opacity: 1, letterSpacing: '0em' });
      gsap.set([data.openAccent, data.closeAccent], {
        opacity: 1,
        scale: 1,
      });
    } else {
      data.container.classList.add('hidden');
      data.container.classList.remove('visible');

      // Hide words and accents
      gsap.set(data.words, { opacity: 0, letterSpacing: '0.5em' });
      gsap.set([data.openAccent, data.closeAccent], {
        opacity: 0,
        scale: 0,
      });
    }
  });

  /**
   * Animate title out with word-by-word effect
   */
  function animateOut(data) {
    const timeline = gsap.timeline();

    // Animate each word out in reverse order
    data.words.reverse().forEach((word, index) => {
      timeline.to(
        word,
        {
          opacity: 0,
          letterSpacing: '0.3em',
          duration: 0.3,
          ease: 'power2.in',
        },
        index * 0.05 // Stagger delay
      );
    });

    // Contract accents
    timeline.to(
      [data.openAccent, data.closeAccent],
      {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
      },
      0 // Start with first word
    );

    timeline.call(() => {
      data.container.classList.remove('visible');
      data.container.classList.add('hidden');
      data.words.reverse(); // Restore original order
    });

    return timeline;
  }

  /**
   * Animate title in with word-by-word reveal
   */
  function animateIn(data) {
    const timeline = gsap.timeline();

    timeline.call(() => {
      data.container.classList.remove('hidden');
      data.container.classList.add('visible');
    });

    // Expand accents
    timeline.fromTo(
      [data.openAccent, data.closeAccent],
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      },
      0.1
    );

    // Reveal each word with letter-spacing animation
    data.words.forEach((word, index) => {
      timeline.fromTo(
        word,
        { opacity: 0, letterSpacing: '0.5em' },
        {
          opacity: 1,
          letterSpacing: '0em',
          duration: 0.6,
          ease: 'power2.out',
        },
        0.2 + index * 0.15 // Stagger delay
      );
    });

    return timeline;
  }

  /**
   * Rotate to next job title
   */
  function rotateTitle() {
    const current = titlesData[currentIndex];
    const nextIndex = (currentIndex + 1) % titlesData.length;
    const next = titlesData[nextIndex];

    const timeline = gsap.timeline();

    // Animate out current title
    timeline.add(animateOut(current));

    // Animate in next title
    timeline.add(animateIn(next), '-=0.2'); // Slight overlap

    currentIndex = nextIndex;
  }

  // Rotate every 4 seconds (increased for word-by-word effect)
  const interval = setInterval(rotateTitle, 4000);

  // Store interval ID for cleanup if needed
  window.__jobTitleInterval = interval;

  console.log('Dynamic job title initialized with word-by-word reveal');
}

/**
 * Stop job title rotation (cleanup)
 */
export function stopJobTitleRotation() {
  if (window.__jobTitleInterval) {
    clearInterval(window.__jobTitleInterval);
    console.log('Dynamic job title stopped');
  }
}
