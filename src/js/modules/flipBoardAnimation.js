/**
 * Flip-Board Text Animation Module
 * Split-flap departure board with character cycling
 */

// Configuration
const CONFIG = {
  titles: ['UI Designer', 'Design Systems', 'Product Thinking', 'Atomic Design', 'Variables Geek'],
  flipDuration: 100, // ms per character flip (faster for cycling)
  cycleCount: 8, // Number of random characters to cycle through
  staggerDelay: 50, // ms between each character starting
  pauseDuration: 3000, // ms pause after all characters finish
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
 * Split text into individual character spans
 */
function createCharacterSpans(text) {
  return text
    .split('')
    .map((char) => {
      const span = document.createElement('span');
      span.className = 'flip-char';
      span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
      span.setAttribute('aria-hidden', 'true');
      span.dataset.targetChar = char === ' ' ? '\u00A0' : char;
      return span;
    });
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
 * Transition to new title with character cycling
 */
async function transitionToTitle(container, newTitle) {
  const upperTitle = newTitle.toUpperCase();
  const currentChars = Array.from(container.querySelectorAll('.flip-char'));
  const maxLength = Math.max(currentChars.length, upperTitle.length);

  // Ensure we have enough character elements
  while (currentChars.length < maxLength) {
    const span = document.createElement('span');
    span.className = 'flip-char';
    span.textContent = '\u00A0';
    span.setAttribute('aria-hidden', 'true');
    container.appendChild(span);
    currentChars.push(span);
  }

  // Start cycling each character with stagger
  const promises = [];
  for (let i = 0; i < maxLength; i++) {
    await sleep(CONFIG.staggerDelay);

    const targetChar = i < upperTitle.length ? upperTitle[i] : ' ';
    const charElement = currentChars[i];

    // Start cycling this character (don't await - let them run in parallel)
    promises.push(cycleCharacter(charElement, targetChar));
  }

  // Wait for all characters to finish cycling
  await Promise.all(promises);

  // Clean up extra characters if new title is shorter
  if (upperTitle.length < currentChars.length) {
    for (let i = upperTitle.length; i < currentChars.length; i++) {
      currentChars[i].remove();
    }
  }
}

/**
 * Instantly swap text (for reduced motion)
 */
function swapTextInstantly(container, newTitle) {
  container.innerHTML = '';
  const newCharacters = createCharacterSpans(newTitle.toUpperCase());
  newCharacters.forEach((char) => container.appendChild(char));
}

/**
 * Main animation loop
 */
async function animationLoop(container, wrapperElement) {
  let currentIndex = 0;

  // Set initial title
  const initialTitle = CONFIG.titles[currentIndex].toUpperCase();
  const initialCharacters = createCharacterSpans(initialTitle);
  initialCharacters.forEach((char) => container.appendChild(char));
  wrapperElement.setAttribute('aria-label', CONFIG.titles[currentIndex]);

  // If reduced motion, just swap text every few seconds
  if (prefersReducedMotion()) {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % CONFIG.titles.length;
      const nextTitle = CONFIG.titles[currentIndex];
      swapTextInstantly(container, nextTitle);
      wrapperElement.setAttribute('aria-label', nextTitle);
    }, CONFIG.pauseDuration);
    console.log('Flip-board animation disabled: user prefers reduced motion');
    return;
  }

  // Wait before starting animation
  await sleep(CONFIG.pauseDuration);

  // Main loop
  while (true) {
    // Get next title
    currentIndex = (currentIndex + 1) % CONFIG.titles.length;
    const nextTitle = CONFIG.titles[currentIndex];

    // Transition to new title with character cycling
    await transitionToTitle(container, nextTitle);

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

  // Set initial aria-label
  wrapper.setAttribute('aria-label', CONFIG.titles[0]);
  wrapper.setAttribute('role', 'status');
  wrapper.setAttribute('aria-live', 'polite');

  // Start animation loop
  animationLoop(container, wrapper);

  console.log('Flip-board animation initialized');
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
