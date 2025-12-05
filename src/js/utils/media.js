/**
 * Media Utility Functions
 * Helpers for working with images and videos
 */

/**
 * Check if a file is a video based on extension
 * @param {string} filePath - The file path to check
 * @returns {boolean} True if the file is a video
 */
export function isVideoFile(filePath) {
  if (!filePath) return false;
  const videoExtensions = ['.mp4', '.webm', '.mov', '.ogg'];
  const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
  return videoExtensions.includes(extension);
}

/**
 * Check if a file is an image based on extension
 * @param {string} filePath - The file path to check
 * @returns {boolean} True if the file is an image
 */
export function isImageFile(filePath) {
  if (!filePath) return false;
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const extension = filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
  return imageExtensions.includes(extension);
}

/**
 * Get file extension from path
 * @param {string} filePath - The file path
 * @returns {string} File extension (lowercase, including dot)
 */
export function getFileExtension(filePath) {
  if (!filePath) return '';
  return filePath.toLowerCase().substring(filePath.lastIndexOf('.'));
}

/**
 * Preload an image
 * @param {string} src - Image source URL
 * @returns {Promise<HTMLImageElement>} Promise that resolves with the image element
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 * @param {Array<string>} sources - Array of image source URLs
 * @returns {Promise<Array<HTMLImageElement>>} Promise that resolves with array of image elements
 */
export function preloadImages(sources) {
  return Promise.all(sources.map(preloadImage));
}
