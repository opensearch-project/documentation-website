#!/usr/bin/env node

/**
 * PDF Generation Script for OpenSearch Documentation
 * 
 * This script generates PDF files from the built Jekyll documentation site.
 * It uses Puppeteer to render HTML pages from the _site/ directory.
 * 
 * Usage:
 *   node generate-pdfs.js [--site-dir <dir>] [--output-dir <dir>] [--collection <name>]
 * 
 * Options:
 *   --site-dir: Path to _site directory (default: _site)
 *   --output-dir: Directory to output PDFs (default: pdfs)
 *   --collection: Generate PDF for specific collection only (optional)
 */

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Load configuration
const configPath = path.join(__dirname, 'pdf-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (flag) => {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : null;
};

const siteDir = path.resolve(getArg('--site-dir') || '_site');
const outputDir = getArg('--output-dir') || config.outputDir || 'pdfs';
const specificCollection = getArg('--collection');

// Check if _site directory exists
if (!fs.existsSync(siteDir)) {
  console.error(`Error: Site directory not found: ${siteDir}`);
  console.error('Please build the Jekyll site first: bundle exec jekyll build');
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Convert a URL path to a file path in _site directory
 */
function pathToFile(siteDir, urlPath) {
  // Remove leading slash and ensure it ends with index.html or .html
  let filePath = urlPath.replace(/^\//, '');
  if (filePath.endsWith('/')) {
    filePath = filePath + 'index.html';
  } else if (!filePath.endsWith('.html')) {
    filePath = filePath + '/index.html';
  }
  return path.join(siteDir, filePath);
}

/**
 * Convert a file path to a file:// URL
 */
function fileToUrl(filePath) {
  // Convert to absolute path and use file:// protocol
  const absolutePath = path.resolve(filePath);
  // On Windows, we need to handle drive letters differently
  if (process.platform === 'win32') {
    return `file:///${absolutePath.replace(/\\/g, '/')}`;
  }
  return `file://${absolutePath}`;
}

/**
 * Discover all pages in a collection by scanning _site directory
 */
function discoverPages(siteDir, startPath) {
  const pages = new Set();
  const startFile = pathToFile(siteDir, startPath);
  
  if (!fs.existsSync(startFile)) {
    console.warn(`  Warning: Start file not found: ${startFile}`);
    return Array.from(pages);
  }

  // Read the HTML file to find links
  const visited = new Set();
  const queue = [startPath];

  while (queue.length > 0) {
    const currentPath = queue.shift();
    if (visited.has(currentPath)) continue;
    visited.add(currentPath);

    const filePath = pathToFile(siteDir, currentPath);
    if (!fs.existsSync(filePath)) continue;

    pages.add(currentPath);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      // Extract href attributes from anchor tags
      const hrefRegex = /<a[^>]+href=["']([^"']+)["']/gi;
      const links = [];
      let match;

      while ((match = hrefRegex.exec(content)) !== null) {
        const href = match[1];
        // Skip external links, anchors, and non-HTML links
        if (href.startsWith('http://') || 
            href.startsWith('https://') ||
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.match(/\.(css|js|json|png|jpg|gif|svg|woff|woff2)$/i)) {
          continue;
        }

        // Resolve relative paths
        let resolvedPath;
        if (href.startsWith('/')) {
          resolvedPath = href.endsWith('/') ? href : `${href}/`;
        } else {
          // Relative path - resolve from current path
          const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
          const resolved = path.posix.resolve(currentDir, href);
          resolvedPath = resolved.endsWith('/') ? resolved : `${resolved}/`;
        }

        // Only include paths under the same collection
        if (resolvedPath.startsWith(startPath) && !visited.has(resolvedPath)) {
          links.push(resolvedPath);
        }
      }

      queue.push(...links);
    } catch (error) {
      console.warn(`  Warning: Could not read ${filePath}: ${error.message}`);
    }
  }

  return Array.from(pages).sort();
}

/**
 * Generate PDF for a single collection
 */
async function generateCollectionPDF(browser, collection, siteDir) {
  console.log(`\nGenerating PDF for: ${collection.title}`);
  console.log(`  Collection: ${collection.name}`);
  console.log(`  Start path: ${collection.startPath}`);

  // Discover all pages in the collection
  const pages = discoverPages(siteDir, collection.startPath);
  
  if (pages.length === 0) {
    console.warn(`  Warning: No pages found for collection ${collection.name}`);
    return null;
  }

  console.log(`  Found ${pages.length} pages`);

  const pdfPage = await browser.newPage();

  try {
    const pdfPath = path.join(outputDir, collection.filename);
    const indexFile = pathToFile(siteDir, collection.startPath);
    const indexUrl = fileToUrl(indexFile);
    
    console.log(`  Generating PDF from: ${indexUrl}`);
    
    await pdfPage.goto(indexUrl, { 
      waitUntil: 'networkidle0',
      timeout: config.waitTimeout || 30000 
    });

    // Wait for content to load
    if (config.waitForSelector) {
      try {
        await pdfPage.waitForSelector(config.waitForSelector, { timeout: 10000 });
      } catch (e) {
        // Continue if selector not found
      }
    }

    // Generate PDF
    await pdfPage.pdf({
      path: pdfPath,
      format: config.pdfOptions.format || 'A4',
      printBackground: config.pdfOptions.printBackground !== false,
      margin: config.pdfOptions.margin || {},
      displayHeaderFooter: config.pdfOptions.displayHeaderFooter !== false,
      headerTemplate: config.pdfOptions.headerTemplate || '',
      footerTemplate: config.pdfOptions.footerTemplate || '',
    });

    console.log(`  ✓ Generated: ${pdfPath}`);
    return pdfPath;
  } catch (error) {
    console.error(`  ✗ Error generating PDF for ${collection.name}: ${error.message}`);
    return null;
  } finally {
    await pdfPage.close();
  }
}

/**
 * Main function
 */
async function main() {
  console.log('OpenSearch Documentation PDF Generator');
  console.log('=====================================\n');
  console.log(`Site Directory: ${siteDir}`);
  console.log(`Output Directory: ${outputDir}\n`);

  // Filter collections if specific one is requested
  let collectionsToProcess = config.collections;
  if (specificCollection) {
    collectionsToProcess = config.collections.filter(c => c.name === specificCollection);
    if (collectionsToProcess.length === 0) {
      console.error(`Error: Collection "${specificCollection}" not found in configuration`);
      process.exit(1);
    }
  }

  console.log(`Processing ${collectionsToProcess.length} collection(s)...\n`);

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const results = [];
    
    for (const collection of collectionsToProcess) {
      const pdfPath = await generateCollectionPDF(browser, collection, siteDir);
      if (pdfPath) {
        results.push({
          collection: collection.name,
          title: collection.title,
          filename: collection.filename,
          path: pdfPath
        });
      }
    }

    console.log('\n=====================================');
    console.log('PDF Generation Complete');
    console.log('=====================================\n');
    console.log(`Generated ${results.length} PDF(s):\n`);
    results.forEach(r => {
      console.log(`  ✓ ${r.title}`);
      console.log(`    File: ${r.path}\n`);
    });

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { main };

