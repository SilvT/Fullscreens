/**
 * Flip-Board Text Animation Module
 * Split-flap departure board with character cycling
 */

// Configuration
const CONFIG = {
  titles: ['UI Designer', 'Design Systems', 'Product Thinking', 'Atomic Design', 'Variables Geek','Vibe Coder'],
  flipDuration: 200, // ms per character flip (even slower)
  cycleCount: 8, // Number of random characters to cycle through
  staggerDelay: 120, // ms between each character starting (much slower stagger)
  pauseDuration: 6000, // ms pause after all characters finish (longer pause - 6 seconds)
};

// Character set for cycling (uppercase letters, numbers, space)
const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ*0123456789*!?@<>+- '.split('');

/**
 * Check if user prefers reduced motion
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Sleep helper for async timing
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get random character from charset
 */
function getRandomChar() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

/**
 * Split text into individual character spans with line break after first word
 */
function createCharacterSpans(text) {
  const words = text.split(' ');
  const elements = [];

  words.forEach((word, wordIndex) => {
    word.split('').forEach((char) => {
      const span = document.createElement('span');
      span.className = 'flip-char';
      span.textContent = char;
      span.setAttribute('aria-hidden', 'true');
      span.dataset.targetChar = char;
      elements.push(span);
    });

    // Add line break after first word
    if (wordIndex === 0) {
      const br = document.createElement('br');
      elements.push(br);
    }
  });

  return elements;
}

/**
 * Animate a single character flip
 */
async function flipCharacter(charElement) {
  charElement.classList.add('flipping');
  await sleep(CONFIG.flipDuration);
  charElement.classList.remove('flipping');
}

/**
 * Cycle a single character through random chars before settling on target
 */
async function cycleCharacter(charElement, targetChar) {
  const upperTarget = targetChar.toUpperCase();

  // Cycle through random characters
  for (let i = 0; i < CONFIG.cycleCount; i++) {
    const randomChar = getRandomChar();
    charElement.textContent = randomChar;
    await flipCharacter(charElement);
  }

  // Final flip to target character
  charElement.textContent = upperTarget;
  await flipCharacter(charElement);
}

/**
 * Transition to new title with character cycling (two-line layout)
 */
async function transitionToTitle(container, newTitle, cursorElement) {
  const upperTitle = newTitle.toUpperCase();
  const words = upperTitle.split(' ');

  // Hide cursor during animation
  if (cursorElement) {
    cursorElement.classList.remove('visible');
  }

  // Clear container and rebuild with two lines
  container.innerHTML = '';

  const promises = [];
  let charIndex = 0;

  words.forEach((word, wordIndex) => {
    word.split('').forEach((targetChar) => {
      const span = document.createElement('span');
      span.className = 'flip-char';
      span.textContent = getRandomChar();
      span.setAttribute('aria-hidden', 'true');
      container.appendChild(span);

      // Start cycling this character with stagger
      const delay = charIndex * CONFIG.staggerDelay;
      promises.push(
        sleep(delay).then(() => cycleCharacter(span, targetChar))
      );

      charIndex++;
    });

    // Add line break after first word
    if (wordIndex === 0) {
      const br = document.createElement('br');
      container.appendChild(br);
    }
  });

  // Append cursor at the end
  if (cursorElement) {
    container.appendChild(cursorElement);
  }

  // Wait for all characters to finish cycling
  await Promise.all(promises);

  // Show cursor after animation completes
  if (cursorElement) {
    cursorElement.classList.add('visible');
  }
}

/**
 * Instantly swap text (for reduced motion) with two-line layout
 */
function swapTextInstantly(container, newTitle) {
  container.innerHTML = '';
  const newElements = createCharacterSpans(newTitle.toUpperCase());
  newElements.forEach((element) => container.appendChild(element));
}

/**
 * Main animation loop
 */
async function animationLoop(container, wrapperElement, cursorElement) {
  let currentIndex = 0;

  // Set initial title
  const initialTitle = CONFIG.titles[currentIndex].toUpperCase();
  const initialCharacters = createCharacterSpans(initialTitle);
  initialCharacters.forEach((char) => container.appendChild(char));

  // Add cursor at the end initially
  if (cursorElement) {
    container.appendChild(cursorElement);
  }

  wrapperElement.setAttribute('aria-label', CONFIG.titles[currentIndex]);

  // If reduced motion, just swap text every few seconds
  if (prefersReducedMotion()) {
    // Hide cursor for reduced motion
    if (cursorElement) {
      cursorElement.classList.remove('visible');
    }

    setInterval(() => {
      currentIndex = (currentIndex + 1) % CONFIG.titles.length;
      const nextTitle = CONFIG.titles[currentIndex];
      swapTextInstantly(container, nextTitle);
      wrapperElement.setAttribute('aria-label', nextTitle);
    }, CONFIG.pauseDuration);
    console.log('Flip-board animation disabled: user prefers reduced motion');
    return;
  }

  // Show cursor initially after a short delay
  await sleep(500);
  if (cursorElement) {
    cursorElement.classList.add('visible');
  }

  // Wait before starting animation
  await sleep(CONFIG.pauseDuration);

  // Main loop
  while (true) {
    // Get next title
    currentIndex = (currentIndex + 1) % CONFIG.titles.length;
    const nextTitle = CONFIG.titles[currentIndex];

    // Transition to new title with character cycling
    await transitionToTitle(container, nextTitle, cursorElement);

    // Update aria-label for accessibility
    wrapperElement.setAttribute('aria-label', nextTitle);

    // Pause before next cycle
    await sleep(CONFIG.pauseDuration);
  }
}

/**
 * Initialize flip-board animation
 */
export function initFlipBoardAnimation() {
  const wrapper = document.querySelector('.dynamic-job-title');

  if (!wrapper) {
    console.warn('Flip-board animation: .dynamic-job-title not found');
    return;
  }

  // Clear existing content
  wrapper.innerHTML = '';

  // Create flip-board container
  const container = document.createElement('div');
  container.className = 'flip-board-container';
  wrapper.appendChild(container);

  // Create cursor element
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.setAttribute('aria-hidden', 'true');

  // Set initial aria-label
  wrapper.setAttribute('aria-label', CONFIG.titles[0]);
  wrapper.setAttribute('role', 'status');
  wrapper.setAttribute('aria-live', 'polite');

  // Start animation loop with cursor
  animationLoop(container, wrapper, cursor);

  console.log('Flip-board animation initialized with pulsating cursor');
}

/**
 * Stop animation (cleanup)
 */
export function stopFlipBoardAnimation() {
  // Note: The animation loop runs indefinitely with async/await
  // To properly stop it, we'd need to track the loop and use a flag
  // For now, this is a placeholder for future cleanup if needed
  console.log('Flip-board animation stopped');
}
