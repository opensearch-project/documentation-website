# frozen_string_literal: true

# Loader for PDF Generator plugin
# This file ensures the PDF generator plugin is loaded from _pdf_generator directory
# The PDF generator handles missing grover gem gracefully, so this will not fail if grover is unavailable
begin
  require_relative "../_pdf_generator/pdf_generator"
rescue LoadError => e
  # If the PDF generator file itself can't be loaded, that's a real error
  # But if grover is missing, the PDF generator will handle it gracefully
  if e.message.include?("grover") || e.message.include?("cannot load such file -- grover")
    # If it's just grover missing, we can continue - PDF generation will be disabled
    # Define a dummy constant so the code doesn't break
    module Jekyll
      class PdfGenerator < Generator
        def generate(site)
          # No-op when grover is not available
        end
      end
    end
    # Set the constant that the PDF generator expects
    GROVER_AVAILABLE = false unless defined?(GROVER_AVAILABLE)
  else
    # Re-raise if it's a different error
    raise e
  end
end

