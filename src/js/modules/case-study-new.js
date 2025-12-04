/**
 * Case Study New Module
 * Handles rendering timeline blocks from JSON for case studies
 */

import { renderTimeline, initializeTimeline } from './timelineRenderer.js';

/**
 * Render Timeline Block
 * @param {Object} block - Block data from JSON with type: "timeline"
 * @returns {HTMLElement} - Rendered timeline element
 */
export function renderTimelineBlock(block) {
  if (!block || block.type !== 'timeline') {
    console.error('Invalid timeline block data');
    return null;
  }

  // Check if block uses old format (has tabTitle) and convert
  let timelineData = block;
  if (block.sections && block.sections.length > 0 && block.sections[0].tabTitle) {
    console.log('Converting old timeline format to new format');
    timelineData = convertTimelineFormat(block);
  }

  // Generate HTML from JSON using new renderer
  // Pass asBlock: true to skip intro/outro panels when used within a case study
  const timelineContainer = renderTimeline(timelineData, { asBlock: true });

  if (!timelineContainer) {
    console.error('Failed to generate timeline HTML');
    return null;
  }

  // Add section title as data attribute for side navigation if present
  if (block.sectionTitle) {
    timelineContainer.setAttribute('data-section-title', block.sectionTitle);
  }

  // Initialize timeline after a short delay to ensure DOM is ready
  setTimeout(() => {
    initializeTimeline(timelineContainer);
  }, 100);

  return timelineContainer;
}

/**
 * Create timeline-compatible JSON structure from existing ds.json timeline format
 * Converts the existing timeline structure to the new navigation format
 * @param {Object} existingTimeline - Existing timeline data from ds.json
 * @returns {Object} - New timeline structure compatible with timelineNav.js
 */
export function convertTimelineFormat(existingTimeline) {
  if (!existingTimeline || !existingTimeline.sections) {
    return null;
  }

  const newSections = existingTimeline.sections.map((section, index) => {
    // Combine block1 and block2 into content
    let content = '<div class="timeline-content-blocks">';

    if (section.block1) {
      content += `<div class="timeline-content-block">${section.block1}</div>`;
    }

    if (section.block2) {
      content += `<div class="timeline-content-block">${section.block2}</div>`;
    }

    // Add block3 media if exists
    if (section.block3 && section.block3.media && section.block3.media.length > 0) {
      content += '<div class="timeline-content-block timeline-media">';
      section.block3.media.forEach(mediaItem => {
        content += `<img src="${mediaItem.src || mediaItem}" alt="${mediaItem.alt || 'Timeline media'}" loading="lazy">`;
      });
      content += '</div>';
    }

    content += '</div>';

    return {
      title: section.tabTitle,
      label: section.tabSubtitle,
      icon: section.icon,
      content: content
    };
  });

  return {
    type: 'timeline',
    sections: newSections
  };
}
