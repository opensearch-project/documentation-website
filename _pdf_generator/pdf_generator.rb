# frozen_string_literal: true

require "jekyll"
require "grover"
require "fileutils"
require "uri"

##
# Jekyll Generator Plugin for PDF Generation
# Generates PDF versions of documentation collections during Jekyll build
module Jekyll
  class PdfGenerator < Generator
    safe true
    priority :lowest

    # Class variable to store PDF jobs across generator and hook
    @@pdf_jobs = []

    def generate(site)
      return unless site.config["pdf_generator"] && site.config["pdf_generator"]["enabled"]

      @site = site
      @pdf_config = site.config["pdf_generator"]
      @destination = site.config["destination"]
      
      # Ensure PDFs directory exists
      pdfs_dir = File.join(@destination, "pdfs")
      FileUtils.mkdir_p(pdfs_dir) unless File.directory?(pdfs_dir)

      # Clear previous jobs
      @@pdf_jobs.clear
      
      # Generate PDFs for configured collections
      prepare_collection_pdfs if @pdf_config["collections"]
      
      # Generate PDFs for configured guides
      prepare_guide_pdfs if @pdf_config["guides"]
    end

    def self.pdf_jobs
      @@pdf_jobs
    end

    private

    def prepare_collection_pdfs
      @pdf_config["collections"].each do |collection_name|
        collection = @site.collections[collection_name]
        next unless collection && collection.docs.any?

        # Get all documents in the collection, sorted by nav_order or path
        docs = collection.docs.select { |doc| doc.data["title"] && !doc.data["nav_exclude"] }
        docs.sort_by! { |doc| [doc.data["nav_order"] || 9999, doc.path] }

        # Schedule PDF generation for after rendering
        pdf_filename = "#{collection_name}.pdf"
        @@pdf_jobs << {
          title: collection_name,
          documents: docs,
          filename: pdf_filename,
          site: @site,
          pdf_config: @pdf_config,
          destination: @destination
        }
      end
    end

    def prepare_guide_pdfs
      @pdf_config["guides"].each do |guide_config|
        guide_name = guide_config["name"] || guide_config["collection"]
        collection_name = guide_config["collection"]
        start_page = guide_config["start_page"]
        
        collection = @site.collections[collection_name]
        next unless collection && collection.docs.any?

        # Find starting page if specified
        docs = collection.docs.select { |doc| doc.data["title"] && !doc.data["nav_exclude"] }
        
        if start_page
          start_doc = docs.find { |doc| doc.url == start_page || doc.path.include?(start_page) }
          if start_doc
            # Build document tree starting from this page
            docs = build_document_tree(start_doc, docs)
          end
        end

        docs.sort_by! { |doc| [doc.data["nav_order"] || 9999, doc.path] }

        # Schedule PDF generation
        pdf_filename = guide_config["filename"] || "#{guide_name.downcase.gsub(/\s+/, '-')}.pdf"
        @@pdf_jobs << {
          title: guide_name,
          documents: docs,
          filename: pdf_filename,
          site: @site,
          pdf_config: @pdf_config,
          destination: @destination
        }
      end
    end

    def build_document_tree(start_doc, all_docs)
      # Simple implementation: start from the start_doc and include all following docs
      # More sophisticated tree building can be added based on parent/child relationships
      start_index = all_docs.index(start_doc)
      return [start_doc] unless start_index

      [start_doc] + all_docs[(start_index + 1)..-1].to_a
    end

    def generate_pdf_for_documents(title, docs, pdf_filename)
      return if docs.empty?

      Jekyll.logger.info "PDF Generator:", "Generating PDF: #{pdf_filename} (#{docs.size} pages)"

      # Build HTML content for PDF
      html_content = build_pdf_html(title, docs)

      # Generate PDF using Grover
      begin
        grover = Grover.new(html_content, pdf_options)
        pdf_data = grover.to_pdf

        # Save PDF file
        pdf_path = File.join(@destination, "pdfs", pdf_filename)
        File.binwrite(pdf_path, pdf_data)
        
        Jekyll.logger.info "PDF Generator:", "Generated PDF: #{pdf_path}"
      rescue => e
        Jekyll.logger.error "PDF Generator:", "Failed to generate PDF #{pdf_filename}: #{e.message}"
        Jekyll.logger.debug "PDF Generator:", e.backtrace.join("\n")
      end
    end

    def build_pdf_html(title, docs)
      # Build complete HTML document with all pages
      html_parts = []
      
      # HTML header
      html_parts << <<~HTML
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>#{escape_html(title)}</title>
          <style>
            #{pdf_styles}
          </style>
        </head>
        <body>
      HTML

      # Add cover page
      html_parts << build_cover_page(title)

      # Add table of contents
      html_parts << build_table_of_contents(docs)

      # Add content from all documents
      docs.each_with_index do |doc, index|
        html_parts << build_document_section(doc, index + 1, docs.size)
      end

      # HTML footer
      html_parts << <<~HTML
        </body>
        </html>
      HTML

      html_parts.join("\n")
    end

    def build_cover_page(title)
      <<~HTML
        <div class="cover-page">
          <h1 class="cover-title">#{escape_html(title)}</h1>
          <p class="cover-subtitle">OpenSearch Documentation</p>
          <p class="cover-version">Version #{@site.config["opensearch_major_minor_version"] || "latest"}</p>
          <p class="cover-date">Generated: #{Time.now.strftime("%B %d, %Y")}</p>
        </div>
        <div style="page-break-after: always;"></div>
      HTML
    end

    def build_table_of_contents(docs)
      toc_html = <<~HTML
        <div class="toc-page">
          <h1>Table of Contents</h1>
          <ul class="toc-list">
      HTML

      docs.each_with_index do |doc, index|
        doc_title = doc.data["title"] || "Untitled"
        toc_html << %(<li><a href="#section-#{index + 1}">#{escape_html(doc_title)}</a></li>\n)
      end

      toc_html << <<~HTML
          </ul>
        </div>
        <div style="page-break-after: always;"></div>
      HTML

      toc_html
    end

    def build_document_section(doc, section_number, total_sections)
      # Read the rendered HTML file from destination
      # At post_write time, all files have been written to disk
      content = ""
      
      # Get the output path for this document
      output_path = doc.destination(@destination)
      
      # Read the rendered HTML file
      if File.exist?(output_path)
        content = File.read(output_path)
      elsif doc.respond_to?(:content)
        # Fallback: use converted content (markdown to HTML, but no layout)
        content = doc.content.to_s
        # Wrap in basic HTML structure if it's just content
        if content !~ /<html/i
          content = "<div>#{content}</div>"
        end
      end
      
      # Clean up content - remove script tags and interactive elements
      content = content.gsub(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/mi, "")
      content = content.gsub(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/mi, "")
      
      # Extract main content from HTML - try to find the main content area
      # Remove common HTML structure elements
      content = extract_main_content(content)
      
      section_html = <<~HTML
        <div class="document-section" id="section-#{section_number}">
          <div class="section-header">
            <h1 class="section-title">#{escape_html(doc.data["title"] || "Untitled")}</h1>
            <p class="section-meta">Page #{section_number} of #{total_sections}</p>
          </div>
          <div class="section-content">
            #{content}
          </div>
        </div>
        <div style="page-break-after: always;"></div>
      HTML

      section_html
    end

    def extract_main_content(html)
      return "" if html.nil? || html.empty?
      
      # Remove entire head section
      html = html.gsub(/<head[^>]*>.*?<\/head>/mi, "")
      
      # Remove header/nav elements (entire elements)
      html = html.gsub(/<header[^>]*>.*?<\/header>/mi, "")
      html = html.gsub(/<nav[^>]*>.*?<\/nav>/mi, "")
      html = html.gsub(/<aside[^>]*>.*?<\/aside>/mi, "")
      html = html.gsub(/<footer[^>]*>.*?<\/footer>/mi, "")
      
      # Remove side-bar and navigation divs (multiline match)
      html = html.gsub(/<div[^>]*class=["'][^"']*side-bar[^"']*["'][^>]*>.*?<\/div>/mi, "")
      html = html.gsub(/<div[^>]*class=["'][^"']*site-nav[^"']*["'][^>]*>.*?<\/div>/mi, "")
      html = html.gsub(/<div[^>]*class=["'][^"']*site-header[^"']*["'][^>]*>.*?<\/div>/mi, "")
      html = html.gsub(/<div[^>]*class=["'][^"']*toc-wrap[^"']*["'][^>]*>.*?<\/div>/mi, "")
      
      # Try to extract main content area - look for main-content or main-content-wrap
      # Using multiline and dotall matching
      if html =~ /<div[^>]*class=["'][^"']*main-content[^"']*["'][^>]*>(.*?)<\/div>/mi
        html = $1
      elsif html =~ /<div[^>]*id=["'][^"']*main-content[^"']*["'][^>]*>(.*?)<\/div>/mi
        html = $1
      elsif html =~ /<main[^>]*>(.*?)<\/main>/mi
        html = $1
      elsif html =~ /<div[^>]*id=["'][^"']*main[^"']*["'][^>]*>(.*?)<\/div>/mi
        html = $1
      end
      
      # Remove breadcrumb navigation
      html = html.gsub(/<nav[^>]*aria-label=["']Breadcrumb["'][^>]*>.*?<\/nav>/mi, "")
      html = html.gsub(/<div[^>]*class=["'][^"']*breadcrumb[^"']*["'][^>]*>.*?<\/div>/mi, "")
      
      # Remove any remaining script/style tags
      html = html.gsub(/<script[^>]*>.*?<\/script>/mi, "")
      html = html.gsub(/<style[^>]*>.*?<\/style>/mi, "")
      
      # Remove SVG elements (icons, etc.)
      html = html.gsub(/<svg[^>]*>.*?<\/svg>/mi, "")
      
      # Clean up extra whitespace
      html = html.gsub(/\s+/, " ")
      html = html.gsub(/>\s+</, "><")
      
      html.strip
    end

    def pdf_styles
      <<~CSS
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #333;
          background: #fff;
        }

        .cover-page {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          text-align: center;
          padding: 2cm;
        }

        .cover-title {
          font-size: 36pt;
          font-weight: bold;
          margin-bottom: 20pt;
          color: #005f8c;
        }

        .cover-subtitle {
          font-size: 18pt;
          margin-bottom: 10pt;
          color: #666;
        }

        .cover-version {
          font-size: 14pt;
          margin-top: 30pt;
          color: #888;
        }

        .cover-date {
          font-size: 12pt;
          margin-top: 10pt;
          color: #888;
        }

        .toc-page {
          padding: 2cm;
        }

        .toc-page h1 {
          font-size: 24pt;
          margin-bottom: 20pt;
          color: #005f8c;
        }

        .toc-list {
          list-style: none;
          padding-left: 0;
        }

        .toc-list li {
          margin: 8pt 0;
          padding: 4pt 0;
          border-bottom: 1px solid #eee;
        }

        .toc-list a {
          color: #005f8c;
          text-decoration: none;
          font-size: 12pt;
        }

        .toc-list a:hover {
          text-decoration: underline;
        }

        .document-section {
          padding: 2cm;
        }

        .section-header {
          border-bottom: 2px solid #005f8c;
          padding-bottom: 10pt;
          margin-bottom: 20pt;
        }

        .section-title {
          font-size: 24pt;
          font-weight: bold;
          color: #005f8c;
          margin-bottom: 5pt;
        }

        .section-meta {
          font-size: 9pt;
          color: #888;
          margin-top: 5pt;
        }

        .section-content {
          margin-top: 20pt;
        }

        .section-content h1 {
          font-size: 20pt;
          margin-top: 20pt;
          margin-bottom: 10pt;
          color: #005f8c;
          page-break-after: avoid;
        }

        .section-content h2 {
          font-size: 16pt;
          margin-top: 16pt;
          margin-bottom: 8pt;
          color: #005f8c;
          page-break-after: avoid;
        }

        .section-content h3 {
          font-size: 14pt;
          margin-top: 12pt;
          margin-bottom: 6pt;
          color: #333;
          page-break-after: avoid;
        }

        .section-content h4 {
          font-size: 12pt;
          margin-top: 10pt;
          margin-bottom: 5pt;
          color: #333;
        }

        .section-content p {
          margin: 8pt 0;
          text-align: justify;
        }

        .section-content ul,
        .section-content ol {
          margin: 8pt 0;
          padding-left: 30pt;
        }

        .section-content li {
          margin: 4pt 0;
        }

        .section-content code {
          background: #f5f5f5;
          padding: 2pt 4pt;
          border-radius: 3pt;
          font-family: "Courier New", monospace;
          font-size: 10pt;
        }

        .section-content pre {
          background: #f5f5f5;
          padding: 10pt;
          border-radius: 5pt;
          overflow-x: auto;
          margin: 10pt 0;
          page-break-inside: avoid;
        }

        .section-content pre code {
          background: none;
          padding: 0;
        }

        .section-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 10pt 0;
          page-break-inside: avoid;
        }

        .section-content table th,
        .section-content table td {
          border: 1px solid #ddd;
          padding: 6pt;
          text-align: left;
        }

        .section-content table th {
          background: #f5f5f5;
          font-weight: bold;
        }

        .section-content blockquote {
          border-left: 4px solid #005f8c;
          padding-left: 10pt;
          margin: 10pt 0;
          color: #666;
          font-style: italic;
        }

        .section-content img {
          max-width: 100%;
          height: auto;
          margin: 10pt 0;
          page-break-inside: avoid;
        }

        @media print {
          .section-content {
            orphans: 3;
            widows: 3;
          }

          .section-content h1,
          .section-content h2,
          .section-content h3 {
            page-break-after: avoid;
          }

          .section-content pre,
          .section-content table {
            page-break-inside: avoid;
          }
        }
      CSS
    end

    def pdf_options
      {
        format: "A4",
        margin: {
          top: "1cm",
          right: "1.5cm",
          bottom: "1cm",
          left: "1.5cm"
        },
        print_background: true,
        display_header_footer: true,
        header_template: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">OpenSearch Documentation</div>',
        footer_template: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
        prefer_css_page_size: true
      }
    end

    def escape_html(text)
      return "" if text.nil?
      text.to_s
        .gsub("&", "&amp;")
        .gsub("<", "&lt;")
        .gsub(">", "&gt;")
        .gsub('"', "&quot;")
        .gsub("'", "&#39;")
    end
  end
end

# Hook to generate PDFs after all files are written
Jekyll::Hooks.register :site, :post_write do |site|
  next unless site.config["pdf_generator"] && site.config["pdf_generator"]["enabled"]
  
  # Process all queued PDF generations
  Jekyll::PdfGenerator.pdf_jobs.each do |pdf_job|
    generator = Jekyll::PdfGenerator.new(site.config)
    generator.instance_variable_set(:@site, pdf_job[:site])
    generator.instance_variable_set(:@pdf_config, pdf_job[:pdf_config])
    generator.instance_variable_set(:@destination, pdf_job[:destination])
    
    generator.send(:generate_pdf_for_documents, pdf_job[:title], pdf_job[:documents], pdf_job[:filename])
  end
end

