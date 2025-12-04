/**
 * ATS Content Generation Configuration
 *
 * This file defines which projects to process and where to output them.
 * To add new projects, simply add entries to the projects array.
 */

export default {
  // Projects to generate ATS-optimized content for
  projects: [
    {
      id: 'mkm-new',
      title: 'Marketing Management Platform',
      jsonPath: 'public/data/mkm-new.json',
      indexPath: 'src/data/projects.json',
      projectKey: '1', // Key in projects.json
      priority: 1 // Display order (1 = highest)
    },
    {
      id: 'design-system',
      title: 'Design System from Scratch',
      jsonPath: 'public/data/mkm-ds.json',
      indexPath: 'src/data/projects.json',
      projectKey: '2',
      priority: 2
    },
    {
      id: 'energy-tracker',
      title: 'Energy Switching Tracker',
      jsonPath: 'public/data/microsite.json',
      indexPath: 'src/data/projects.json',
      projectKey: '3',
      priority: 3
    },
    {
      id: 'figma-plugin',
      title: 'Figma Design Distributor Plugin',
      jsonPath: null, // Uses inline content from projects.json
      indexPath: 'src/data/projects.json',
      projectKey: '4',
      priority: 4
    }
  ],

  // Output configuration
  output: {
    // Where to inject the generated HTML
    indexHtmlPath: 'index.html',
    targetContainer: 'ats-content-placeholder',

    // Backup original before modifying
    createBackup: true,
    backupSuffix: '.backup'
  },

  // ATS Optimization settings (prioritize recruiter readability)
  atsOptimization: {
    // Include job titles in headers
    emphasizeJobTitles: true,

    // Extract and highlight metrics
    highlightMetrics: true,

    // Create dedicated skills sections
    extractSkills: true,

    // Add action verbs to responsibilities
    useActionVerbs: true,

    // Generate JSON-LD structured data
    generateStructuredData: true,

    // Extract portfolio images and visual samples
    includePortfolioSamples: true,

    // Include design process and methodology sections
    includeDesignProcess: true,

    // Include deliverables and outputs
    includeDeliverables: true,

    // Include collaboration and teamwork
    includeCollaboration: true,

    // Keywords to emphasize (will appear in multiple places)
    keywordEmphasis: [
      // Core Role Keywords
      'Product Design',
      'Product Designer',
      'UI/UX Designer',
      'Design Systems',
      'UI/UX',

      // Skills & Tools
      'User Research',
      'Figma',
      'Wireframes',
      'Prototypes',
      'High-fidelity Mockups',
      'Visual Design',

      // Industry & Domain
      'Enterprise',
      'B2B',
      'B2C',
      'CRM',
      'SaaS',

      // Process & Methodology
      'User-Centered Design',
      'Design Thinking',
      'Agile',
      'Usability Testing',
      'User Testing',
      'Iterative Design',
      'Design Sprint',

      // Collaboration & Soft Skills
      'Cross-functional',
      'Stakeholder Management',
      'Leadership',
      'Mentorship',

      // Deliverables
      'Design Documentation',
      'Component Library',
      'Design Tokens',
      'User Flows',
      'Journey Maps',

      // Technical
      'Responsive Design',
      'Accessibility',
      'WCAG',
      'Frontend Collaboration',
      'Design Handoff'
    ]
  },

  // SEO configuration (secondary priority)
  seo: {
    // Generate meta descriptions per project
    generateMetaDescriptions: true,

    // Add schema.org markup
    addSchemaOrg: true,

    // Include OpenGraph tags
    addOpenGraph: true
  }
};
