/**
 * Project Constants
 * Shared constants used across the application
 */

/**
 * Project display order
 * Defines the sequence in which projects appear
 */
export const PROJECT_ORDER = ['1', '2', '3', '4'];

/**
 * Project slug mappings for URLs
 * Maps project IDs to their URL slugs
 */
export const PROJECT_SLUGS = {
  '1': 'marketing-management',
  '2': 'design-system',
  '3': 'energy-tracker',
  '4': 'figma-plugin'
};

/**
 * Reverse lookup: slug to project ID
 */
export const SLUG_TO_ID = Object.fromEntries(
  Object.entries(PROJECT_SLUGS).map(([id, slug]) => [slug, id])
);

/**
 * Theme class names
 */
export const THEME_CLASSES = {
  BLUE: 'section-blue',
  GREEN: 'section-green',
  NEUTRAL: 'section-neutral',
  CONTACT: 'section-contact'
};

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  SHORT: 200,
  MEDIUM: 400,
  LONG: 600
};

/**
 * Scroll behavior settings
 */
export const SCROLL_SETTINGS = {
  THROTTLE_DELAY: 10,
  DEBOUNCE_DELAY: 250,
  RESIZE_DEBOUNCE: 250
};
