# PDF Generator for OpenSearch Documentation

This plugin generates PDF versions of documentation collections during the Jekyll build process.

## File Structure

All PDF generator code is contained in the `_pdf_generator/` directory:
- `pdf_generator.rb` - Main plugin implementation
- `README.md` - This documentation file

A minimal loader file exists in `_plugins/pdf_generator_loader.rb` to ensure Jekyll loads the plugin (Jekyll requires plugins to be in `_plugins` or be gems).

## Overview

The PDF generator creates downloadable PDF files for documentation collections and guides. PDFs are generated automatically during the Jekyll build and are saved to the `pdfs/` directory in the site destination.

## Configuration

PDF generation is configured in `_config.yml` under the `pdf_generator` section:

```yaml
pdf_generator:
  enabled: true
  # Generate PDFs for entire collections
  collections:
    - getting-started
    - install-and-configure
    - api-reference
  # Generate PDFs for specific guides (more granular control)
  guides:
    - name: "Getting Started Guide"
      collection: getting-started
      filename: "getting-started-guide.pdf"
    - name: "Installation Guide"
      collection: install-and-configure
      filename: "installation-guide.pdf"
```

### Configuration Options

- `enabled`: Set to `true` to enable PDF generation, `false` to disable
- `collections`: Array of collection names to generate PDFs for (PDF filename will be `{collection-name}.pdf`)
- `guides`: Array of guide configurations with:
  - `name`: Display name for the guide
  - `collection`: Collection name to generate PDF from
  - `filename`: Output PDF filename (optional, defaults to `{name}.pdf`)
  - `start_page`: Optional URL or path to start from (for partial guides)

## How It Works

1. During Jekyll build, the PDF generator plugin identifies configured collections/guides
2. After all pages are rendered, the plugin collects the rendered HTML content
3. HTML is cleaned and formatted for PDF output
4. PDFs are generated using Grover (Puppeteer-based PDF generation)
5. PDFs are saved to `_site/pdfs/` directory

## Dependencies

- `grover` gem: Ruby wrapper for Puppeteer (requires Node.js and Chrome/Chromium)
- `puppeteer`: Node.js package (installed automatically by grover)

## Accessing Generated PDFs

Generated PDFs are available at:
- Local build: `http://localhost:4000/pdfs/{filename}.pdf`
- Production: `https://docs.opensearch.org/pdfs/{filename}.pdf`

## Troubleshooting

### PDF Generation Fails

1. Ensure `grover` gem is installed: `bundle install`
2. Ensure Node.js is installed (required for Puppeteer)
3. Check Jekyll build logs for error messages
4. Verify collection names in configuration match actual collection names

### PDF Content Issues

- The plugin automatically extracts main content and removes navigation elements
- If content is missing, check that documents have `title` and are not excluded with `nav_exclude: true`
- Documents are sorted by `nav_order` if available

## Customization

PDF styling can be customized by modifying the `pdf_styles` method in `pdf_generator.rb`.

PDF options (page size, margins, headers/footers) can be customized in the `pdf_options` method.

