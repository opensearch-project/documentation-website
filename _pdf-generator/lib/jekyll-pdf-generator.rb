# frozen_string_literal: true

require 'pdfkit'
require 'yaml'
require 'fileutils'
require 'pathname'

module Jekyll
  module PdfGenerator
    # PDF Generator plugin for Jekyll
    class Generator
      def initialize(site)
        @site = site
        @config = load_config
        @pdf_options = build_pdf_options
        configure_pdfkit
      end

      def generate
        return unless enabled?

        Jekyll.logger.info 'PDF Generator:', 'Starting PDF generation...'

        collections = @config['collections'] || []
        return if collections.empty?

        site_dir = @site.dest
        output_dir = File.join(site_dir, 'pdfs')
        FileUtils.mkdir_p(output_dir)

        collections.each do |collection|
          generate_collection_pdf(collection, site_dir, output_dir)
        end

        Jekyll.logger.info 'PDF Generator:', 'PDF generation complete.'
      end

      private

      def enabled?
        @site.config['pdf_generator'] && @site.config['pdf_generator']['enabled'] != false
      end

      def load_config
        config_path = File.join(@site.source, '_pdf-generator', 'config.yml')
        return {} unless File.exist?(config_path)

        YAML.safe_load(File.read(config_path)) || {}
      rescue StandardError => e
        Jekyll.logger.warn 'PDF Generator:', "Error loading config: #{e.message}"
        {}
      end

      def build_pdf_options
        opts = @config['pdf_options'] || {}
        options = {}

        options['page-size'] = opts['page_size'] || 'A4'
        options['margin-top'] = opts['margin_top'] || '20mm'
        options['margin-right'] = opts['margin_right'] || '15mm'
        options['margin-bottom'] = opts['margin_bottom'] || '20mm'
        options['margin-left'] = opts['margin_left'] || '15mm'
        options['print-media-type'] = opts['print_media_type'] != false
        options['disable-smart-shrinking'] = opts['disable_smart_shrinking'] == true
        options['encoding'] = opts['encoding'] || 'UTF-8'
        options['quiet'] = true

        options
      end

      def generate_collection_pdf(collection, site_dir, output_dir)
        collection_name = collection['name']
        filename = collection['filename']
        start_path = collection['start_path']
        title = collection['title'] || collection_name

        Jekyll.logger.info 'PDF Generator:', "Generating PDF for #{title}..."

        # Find the index page for this collection
        index_path = find_index_page(site_dir, start_path)
        unless index_path
          Jekyll.logger.warn 'PDF Generator:', "Index page not found for #{start_path}"
          return
        end

        # Convert to file:// URL
        file_url = "file://#{File.expand_path(index_path)}"

        begin
          # Create PDFKit instance
          kit = PDFKit.new(file_url, @pdf_options)

          # Generate PDF
          pdf_path = File.join(output_dir, filename)
          pdf_data = kit.to_pdf

          # Write PDF file
          File.binwrite(pdf_path, pdf_data)

          Jekyll.logger.info 'PDF Generator:', "✓ Generated: #{filename}"
        rescue StandardError => e
          Jekyll.logger.error 'PDF Generator:', "Error generating PDF for #{title}: #{e.message}"
          Jekyll.logger.error 'PDF Generator:', e.backtrace.join("\n") if @site.config['verbose']
        end
      end

      def find_index_page(site_dir, start_path)
        # Remove leading slash and normalize path
        path = start_path.sub(%r{^/}, '').sub(%r{/$}, '')
        
        # Try index.html first
        index_path = File.join(site_dir, path, 'index.html')
        return index_path if File.exist?(index_path)

        # Try without index.html (if path is already a file)
        file_path = File.join(site_dir, "#{path}.html")
        return file_path if File.exist?(file_path)

        # Try with .html extension
        html_path = File.join(site_dir, path, '.html')
        return html_path if File.exist?(html_path)

        nil
      end

      def configure_pdfkit
        # Try to find wkhtmltopdf in common locations
        wkhtmltopdf_path = find_wkhtmltopdf
        if wkhtmltopdf_path
          PDFKit.configure do |config|
            config.wkhtmltopdf = wkhtmltopdf_path
          end
        end
      end

      def find_wkhtmltopdf
        # Try common locations for wkhtmltopdf
        common_paths = [
          '/usr/local/bin/wkhtmltopdf',
          '/usr/bin/wkhtmltopdf',
          `which wkhtmltopdf 2>/dev/null`.strip
        ].reject(&:empty?)

        common_paths.each do |path|
          return path if File.exist?(path) && File.executable?(path)
        end

        # If not found, let PDFKit use its default detection
        nil
      end
    end
  end
end

# Register Jekyll hook to generate PDFs after site is written
Jekyll::Hooks.register :site, :post_write do |site|
  generator = Jekyll::PdfGenerator::Generator.new(site)
  generator.generate
end

