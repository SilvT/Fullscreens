/**
 * Structured Data Module
 * Generates and injects JSON-LD structured data for SEO and AI scrapers
 */

import projectData from '../../data/projects.json';

/**
 * Generate Person schema for portfolio owner
 * @returns {object} Person schema
 */
function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Silvia Travieso",
    "jobTitle": "UI/UX Designer",
    "description": "Senior UI/UX Designer specializing in product design, design systems, and B2B applications",
    "url": "https://silviatravieso.com",
    "sameAs": [
      "https://linkedin.com/in/silviatravieso",
      "https://behance.net/silviatravieso"
    ],
    "knowsAbout": [
      "UI/UX Design",
      "Product Design",
      "Design Systems",
      "User Experience",
      "Interface Design",
      "B2B Applications",
      "Dashboard Design",
      "Prototyping",
      "User Research"
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "UI/UX Designer",
      "occupationalCategory": "15-1255.00",
      "skills": "UI Design, UX Design, Product Design, Design Systems, Figma, Prototyping"
    }
  };
}

/**
 * Generate ProfilePage schema for portfolio
 * @returns {object} ProfilePage schema
 */
function generateProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "dateCreated": "2025-01-01T00:00:00+00:00",
    "dateModified": new Date().toISOString(),
    "mainEntity": {
      "@type": "Person",
      "name": "Silvia Travieso",
      "jobTitle": "Senior UI Designer",
      "description": "Senior UI/UX Designer specializing in product design, design systems, and B2B applications"
    }
  };
}

/**
 * Generate CreativeWork schema for a project
 * @param {string} projectId - Project ID
 * @param {object} project - Project data
 * @returns {object} CreativeWork schema
 */
function generateProjectSchema(projectId, project) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `https://silviatravieso.com/#project-${projectId}`,
    "name": project.title,
    "description": project.description,
    "creator": {
      "@type": "Person",
      "name": "Silvia Travieso",
      "jobTitle": "Senior UI Designer"
    },
    "dateCreated": project.year || "2024",
    "keywords": project.tags ? project.tags.join(", ") : "",
    "about": {
      "@type": "SoftwareApplication",
      "applicationCategory": "BusinessApplication"
    }
  };

  // Add role if available
  if (project.role) {
    schema.creator.roleName = project.role;
  }

  // Add metrics as additionalProperty (use detailMetrics for structured data)
  if (project.detailMetrics && project.detailMetrics.length > 0) {
    schema.additionalProperty = project.detailMetrics.map(metric => ({
      "@type": "PropertyValue",
      "name": metric.label,
      "value": metric.value,
      "description": metric.description
    }));
  } else if (project.cardMetrics && project.cardMetrics.length > 0) {
    // Fallback to cardMetrics if detailMetrics not available
    schema.additionalProperty = project.cardMetrics.map(metric => ({
      "@type": "PropertyValue",
      "name": metric.label,
      "value": metric.value,
      "description": metric.description
    }));
  }

  return schema;
}

/**
 * Generate ItemList schema for all projects
 * @returns {object} ItemList schema
 */
function generateProjectsListSchema() {
  const projectEntries = Object.entries(projectData);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Design Projects Portfolio",
    "description": "Collection of UI/UX design projects and case studies",
    "numberOfItems": projectEntries.length,
    "itemListElement": projectEntries.map(([projectId, project], index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "@id": `https://silviatravieso.com/#project-${projectId}`,
        "name": project.title,
        "description": project.description,
        "keywords": project.tags ? project.tags.join(", ") : ""
      }
    }))
  };
}

/**
 * Inject JSON-LD script into the page
 * @param {object} schema - Schema.org structured data
 * @param {string} id - Unique ID for the script tag
 */
function injectStructuredData(schema, id) {
  // Check if script already exists
  let script = document.getElementById(id);

  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Initialize all structured data
 */
export function initStructuredData() {
  // Inject Person schema
  injectStructuredData(generatePersonSchema(), 'schema-person');

  // Inject ProfilePage schema
  injectStructuredData(generateProfilePageSchema(), 'schema-profile');

  // Inject Projects list schema
  injectStructuredData(generateProjectsListSchema(), 'schema-projects-list');

  // Inject individual project schemas
  Object.entries(projectData).forEach(([projectId, project]) => {
    injectStructuredData(
      generateProjectSchema(projectId, project),
      `schema-project-${projectId}`
    );
  });

}

/**
 * Update project meta tags when viewing a specific project
 * @param {string} projectId - Project ID
 */
export function updateProjectMetaTags(projectId) {
  const project = projectData[projectId];
  if (!project) return;

  // Update or create project-specific meta tags
  const metaTags = [
    { property: 'og:type', content: 'portfolio.project' },
    { property: 'og:title', content: `${project.title} - Silvia Travieso` },
    { property: 'og:description', content: project.description },
    { property: 'project:role', content: project.role || 'UI/UX Designer' },
    { property: 'project:company', content: project.company || '' },
    { property: 'project:year', content: project.year || '2024' },
    { property: 'project:skills', content: project.tags ? project.tags.join(', ') : '' }
  ];

  // Add impact metrics if available (prefer detailMetrics)
  const metrics = project.detailMetrics || project.cardMetrics;
  if (metrics && metrics.length > 0) {
    const impactSummary = metrics.map(m => m.value).join(', ');
    metaTags.push({ property: 'project:impact', content: impactSummary });
  }

  metaTags.forEach(({ property, content }) => {
    let meta = document.querySelector(`meta[property="${property}"]`);

    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }

    meta.setAttribute('content', content);
  });
}

/**
 * Remove project-specific meta tags
 */
export function clearProjectMetaTags() {
  const projectMetaSelectors = [
    'meta[property="og:type"][content="portfolio.project"]',
    'meta[property^="project:"]'
  ];

  projectMetaSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(meta => meta.remove());
  });

  // Reset to default
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', 'website');
}
