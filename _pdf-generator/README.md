# Jekyll PDF Generator

A Jekyll plugin that automatically generates PDF versions of documentation collections during the site build process.

## Overview

This plugin integrates PDF generation directly into the Jekyll build process. When you run `jekyll build`, PDFs are automatically generated for configured documentation collections and placed in the `_site/pdfs/` directory, making them available for deployment alongside the HTML site.

## Requirements

- **wkhtmltopdf**: The plugin uses the `pdfkit` gem, which requires `wkhtmltopdf` to be installed on your system.

### Installing wkhtmltopdf

**macOS:**
```bash
brew install wkhtmltopdf
```

**Ubuntu/Debian:**
```bash
sudo apt-get install wkhtmltopdf
```

**Windows:**
Download from [wkhtmltopdf downloads](https://wkhtmltopdf.org/downloads.html)

## Configuration

PDF generation is configured in `_pdf-generator/config.yml`. This file defines:
- Which collections to convert to PDFs
- PDF output settings (page size, margins, etc.)

To enable/disable PDF generation, set the `enabled` flag in `_config.yml`:

```yaml
pdf_generator:
  enabled: true  # Set to false to disable PDF generation
```

## Usage

PDFs are automatically generated during the Jekyll build process:

```bash
bundle exec jekyll build
```

Generated PDFs will be in `_site/pdfs/` and will be deployed with the site to S3, making them accessible at:
- `https://docs.opensearch.org/pdfs/opensearch-developer-guide.pdf`
- `https://docs.opensearch.org/pdfs/opensearch-getting-started.pdf`
- etc.

## Adding New Collections

To add a new collection for PDF generation, edit `_pdf-generator/config.yml`:

```yaml
collections:
  - name: my-collection
    title: My Collection Title
    filename: my-collection.pdf
    description: Description of the collection
    start_path: /my-collection/
```

## Troubleshooting

If PDF generation fails:
1. Ensure `wkhtmltopdf` is installed and in your PATH
2. Check that the collection's `start_path` points to a valid page
3. Verify the plugin is enabled in `_config.yml`
4. Check Jekyll build logs for error messages

