# frozen_string_literal: true

# Automatically sets canonical_url pointing to /latest/ for previous version branches

Jekyll::Hooks.register :site, :post_read do |site|
  next if site.config['doc_version'] == 'latest'

  url = site.config['url'] || ''
  latesturl = site.config['latesturl'] || '/latest'

  # Process regular pages
  site.pages.each do |page|
    next unless page.respond_to?(:output_ext) && page.output_ext == '.html'
    next if page.data['canonical_url']
    next if page.url.include?('/search.html') || page.url.include?('/404.html')

    page.data['canonical_url'] = "#{url}#{latesturl}#{page.url}"
  end

  # Process collection documents
  site.documents.each do |doc|
    next unless doc.respond_to?(:output_ext) && doc.output_ext == '.html'
    next if doc.data['canonical_url']

    doc.data['canonical_url'] = "#{url}#{latesturl}#{doc.url}"
  end
end
