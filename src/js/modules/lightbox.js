/**
 * Lightbox Module
 * Handles image gallery lightbox functionality using GLightbox
 */

import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

let lightboxInstance = null;

/**
 * Initialize lightbox for all gallery images
 * @param {string} selector - CSS selector for images to enable lightbox on
 * @returns {object} GLightbox instance
 */
export function initLightbox(selector = '.glightbox') {
  // Destroy existing instance if it exists
  if (lightboxInstance) {
    lightboxInstance.destroy();
  }

  // Initialize GLightbox
  lightboxInstance = GLightbox({
    selector: selector,
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
    zoomable: true,
    draggable: true,
    closeButton: true,
    closeOnOutsideClick: true,

    // Keyboard navigation
    keyboardNavigation: true,

    // Mobile settings
    moreLength: 0, // Don't truncate descriptions

    // Custom skin/theme
    skin: 'portfolio-lightbox',

    // Callbacks
    onOpen: () => {
      document.body.style.overflow = 'hidden';
    },

    onClose: () => {
      document.body.style.overflow = '';
    }
  });

  return lightboxInstance;
}

/**
 * Refresh lightbox to pick up new images
 * Useful when dynamically adding images to the DOM
 */
export function refreshLightbox() {
  if (lightboxInstance) {
    lightboxInstance.reload();
  }
}

/**
 * Destroy lightbox instance
 */
export function destroyLightbox() {
  if (lightboxInstance) {
    lightboxInstance.destroy();
    lightboxInstance = null;
  }
}

/**
 * Prepare image elements for lightbox
 * Wraps images in <a> tags with proper attributes if needed
 * @param {NodeList|Array} images - Image elements to prepare
 */
export function prepareLightboxImages(images) {
  images.forEach((img) => {
    // Skip if already wrapped
    if (img.parentElement.tagName === 'A' && img.parentElement.classList.contains('glightbox')) {
      return;
    }

    // Get image source
    const src = img.src || img.getAttribute('data-src');
    const alt = img.alt || '';

    // Create wrapper link
    const link = document.createElement('a');
    link.href = src;
    link.className = 'glightbox';
    link.setAttribute('data-gallery', 'case-study-gallery');

    if (alt) {
      link.setAttribute('data-title', alt);
    }

    // Wrap image
    img.parentNode.insertBefore(link, img);
    link.appendChild(img);
  });
}
