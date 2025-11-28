#!/usr/bin/env node

/**
 * ATS Content Verification Script
 *
 * Analyzes the generated HTML to verify ATS optimization quality.
 * Checks for common ATS requirements and provides a readability score.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('\n🔍 ATS Content Verification\n');
console.log('═'.repeat(60));

// Read the generated HTML
const htmlPath = path.join(rootDir, 'index.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

// Extract ATS content section (improved regex for nested divs)
const atsMatch = html.match(/<div class="ats-content"[^>]*>([\s\S]*?)<\/div>\s*(?=<!--\s*Structured Data)/);

if (!atsMatch) {
  console.error('\n❌ ERROR: No ATS content found in index.html');
  console.error('   Run: npm run generate:ats\n');
  process.exit(1);
}

const atsContent = atsMatch[1];

// Verification checks
const checks = {
  '✅ ATS Content Present': atsContent.length > 100,
  '✅ Job Titles Found': (atsContent.match(/<h2[^>]*>.*?—.*?<\/h2>/gi) || []).length,
  '✅ Skills Sections': (atsContent.match(/<h4>Skills & Technologies:<\/h4>/gi) || []).length,
  '✅ Metrics Highlighted': (atsContent.match(/<strong>\d+%?<\/strong>/gi) || []).length,
  '✅ Achievements Listed': (atsContent.match(/<h4>Key Contributions:<\/h4>/gi) || []).length,
  '✅ Semantic HTML': atsContent.includes('<article') && atsContent.includes('itemscope'),
  '✅ Structured Data': html.includes('application/ld+json') && html.includes('@type": "Person"'),
};

// Keyword analysis
const keywords = [
  'Product Design',
  'Design Systems',
  'Figma',
  'UI/UX',
  'B2B',
  'Enterprise',
  'User Research'
];

const keywordCounts = {};
keywords.forEach(keyword => {
  const regex = new RegExp(keyword, 'gi');
  const matches = atsContent.match(regex) || [];
  keywordCounts[keyword] = matches.length;
});

// Display results
console.log('\n📊 ATS Optimization Checklist:\n');

Object.entries(checks).forEach(([check, result]) => {
  const icon = result ? '✅' : '❌';
  const count = typeof result === 'number' ? ` (${result})` : '';
  console.log(`${icon} ${check}${count}`);
});

console.log('\n📈 Keyword Frequency (for recruiter searches):\n');
Object.entries(keywordCounts).forEach(([keyword, count]) => {
  const bar = '█'.repeat(Math.min(count, 20));
  const status = count >= 3 ? '✅' : count >= 1 ? '⚠️' : '❌';
  console.log(`${status} ${keyword.padEnd(20)} ${bar} ${count}x`);
});

// Content analysis
const projects = (atsContent.match(/<article/g) || []).length;
const skills = (atsContent.match(/<li itemprop="skill">/g) || []).length;
const metrics = (atsContent.match(/<strong>\d+/g) || []).length;
const achievements = (atsContent.match(/<li>.*?<\/li>/g) || []).length;

console.log('\n📝 Content Statistics:\n');
console.log(`   Projects:     ${projects}`);
console.log(`   Skills:       ${skills}`);
console.log(`   Metrics:      ${metrics}`);
console.log(`   Achievements: ${achievements}`);
console.log(`   Word count:   ${atsContent.split(/\s+/).length.toLocaleString()}`);

// Calculate ATS score
const score = Object.values(checks).filter(v => v).length;
const total = Object.keys(checks).length;
const percentage = Math.round((score / total) * 100);

console.log('\n═'.repeat(60));
console.log(`\n🎯 ATS Optimization Score: ${score}/${total} (${percentage}%)\n`);

if (percentage >= 90) {
  console.log('🌟 Excellent! Your content is highly optimized for ATS systems.\n');
} else if (percentage >= 70) {
  console.log('✅ Good! Your content should work well with most ATS systems.\n');
} else if (percentage >= 50) {
  console.log('⚠️  Fair. Consider adding more structured content.\n');
} else {
  console.log('❌ Poor. Run: npm run generate:ats\n');
}

// Recommendations
console.log('💡 Tips for Better ATS Performance:\n');

if (keywordCounts['Product Design'] < 3) {
  console.log('   • Add "Product Design" to more project descriptions');
}
if (keywordCounts['Design Systems'] < 3) {
  console.log('   • Emphasize "Design Systems" expertise more');
}
if (metrics < 10) {
  console.log('   • Add more quantifiable metrics (numbers matter to ATS)');
}
if (skills < 20) {
  console.log('   • List more specific tools/technologies in your JSON');
}

console.log('\n📖 Next Steps:\n');
console.log('   1. View source in browser (Cmd+Option+U)');
console.log('   2. Search for "ats-content" to see generated HTML');
console.log('   3. Test with JavaScript disabled');
console.log('   4. Validate structured data: https://validator.schema.org/');
console.log('   5. Test LinkedIn preview by sharing your URL\n');

console.log('═'.repeat(60));
console.log('\n✨ Verification complete!\n');
