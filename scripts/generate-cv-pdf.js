#!/usr/bin/env node

/**
 * Generate PDF from CV HTML
 * Creates an exact replica of the HTML CV as a PDF file
 */

import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function generateCVPDF() {
  console.log('\n📄 Generating CV PDF...\n');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1200,
      height: 1600,
      deviceScaleFactor: 2
    });

    // Load the CV HTML file
    const cvHtmlPath = path.join(rootDir, 'cv-silvia-travieso.html');
    const fileUrl = `file://${cvHtmlPath}`;

    console.log(`📖 Loading CV from: ${cvHtmlPath}`);
    await page.goto(fileUrl, {
      waitUntil: 'networkidle0'
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Generate PDF with A4 dimensions
    const pdfPath = path.join(rootDir, 'public', 'cv-silvia-travieso.pdf');

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false
    });

    console.log(`✅ PDF generated successfully!`);
    console.log(`📁 Location: ${pdfPath}\n`);

    // Get file size
    const fs = await import('fs');
    const stats = fs.statSync(pdfPath);
    const fileSizeInKB = (stats.size / 1024).toFixed(2);
    console.log(`📊 File size: ${fileSizeInKB} KB\n`);

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run the script
generateCVPDF();
