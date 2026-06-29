# PDF Generator for OpenSearch Documentation

This plugin generates a single, consolidated downloadable PDF per developer
guide (plus an optional full-documentation PDF), modeled on the single-PDF
developer guides published by AWS.

## File Structure

All PDF generator code is contained in the `_pdf_generator/` directory:
- `pdf_generator.rb` - Main plugin implementation
- `README.md` - This documentation file

A minimal loader file exists in `_plugins/pdf_generator_loader.rb` to ensure Jekyll loads the plugin (Jekyll requires plugins to be in `_plugins` or be gems).

## Overview

The PDF generator merges every page of a guide into one cohesive PDF (cover
page, table of contents, then each page as a continuous chapter) and saves it
to the `pdfs/` directory in the site destination.

PDF generation does **not** run during the normal Jekyll build. It is gated
behind the `ENABLE_PDF_GENERATION=true` environment variable and runs only in
the dedicated `.github/workflows/pdf-generation.yml` CI workflow, so it never
adds to the standard build time. The `grover` gem is likewise installed only
when `ENABLE_PDF_GENERATION=true` (see the `Gemfile`).

## Running locally

```sh
ENABLE_PDF_GENERATION=true bundle install
ENABLE_PDF_GENERATION=true bundle exec jekyll build --future
# PDFs are written to _site/pdfs/
```

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
  # Optional: one PDF containing all guides (single "full documentation" file)
  full_documentation:
    enabled: true
    filename: "opensearch-documentation.pdf"
    guides_order:
      - getting-started
      - install-and-configure
      - api-reference
```

### Configuration Options

- `enabled`: Set to `true` to enable PDF generation, `false` to disable
- `collections`: Array of collection names to generate PDFs for (PDF filename will be `{collection-name}.pdf`)
- `guides`: Array of guide configurations with:
  - `name`: Display name for the guide
  - `collection`: Collection name to generate PDF from
  - `filename`: Output PDF filename (optional, defaults to `{name}.pdf`)
  - `start_page`: Optional URL or path to start from (for partial guides)
- `full_documentation`: Optional. When enabled, generates one additional PDF containing all guides in a single file (addresses the "single documentation PDF" use case). Options:
  - `enabled`: Set to `true` to generate the combined PDF
  - `filename`: Output filename (default: `opensearch-documentation.pdf`)
  - `guides_order`: Array of collection names defining the order of guides in the combined PDF. If omitted, order is taken from the `guides` list.

## How It Works

1. The `pdf-generation` CI workflow runs `jekyll build` with `ENABLE_PDF_GENERATION=true`
2. The plugin identifies the configured collections/guides
3. After all pages are rendered, it collects and cleans the rendered HTML for each guide
4. The cleaned pages are merged into one HTML document and rendered to a single PDF using Grover (Puppeteer-based PDF generation)
5. PDFs are saved to `_site/pdfs/` and uploaded as a workflow artifact

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

