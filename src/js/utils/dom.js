/**
 * DOM Utility Functions
 * Common DOM manipulation helpers
 */

/**
 * Safely set innerHTML for an element
 * @param {string} selector - CSS selector
 * @param {string} content - HTML content to set
 * @returns {boolean} True if element was found and updated
 */
export function setElementContent(selector, content) {
  const element = document.querySelector(selector);
  if (element) {
    element.innerHTML = content;
    return true;
  }
  return false;
}

/**
 * Create an element with class and optional attributes
 * @param {string} tag - HTML tag name
 * @param {string} className - CSS class name
 * @param {object} attributes - Optional attributes object
 * @returns {HTMLElement} Created element
 */
export function createElement(tag, className = '', attributes = {}) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, delay) {
  let timeout = null;
  return function (...args) {
    if (!timeout) {
      timeout = setTimeout(() => {
        func.apply(this, args);
        timeout = null;
      }, delay);
    }
  };
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Smooth scroll to element with reduced motion support
 * @param {HTMLElement} element - Element to scroll to
 * @param {string} block - Scroll alignment (start, center, end)
 */
export function scrollToElement(element, block = 'start') {
  if (!element) return;

  const behavior = prefersReducedMotion() ? 'auto' : 'smooth';
  element.scrollIntoView({ behavior, block });
}

/**
 * Wait for next animation frame
 * @returns {Promise} Promise that resolves on next frame
 */
export function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}
