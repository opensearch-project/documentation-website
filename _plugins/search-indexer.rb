# frozen_string_literal: true

require 'jekyll/hooks'
require 'jekyll/document'
require 'json'

##
# Writes the file that the search index is built from: one record per page, holding the page's URL,
# title, breadcrumb, and text.

module Jekyll::ContentIndexer
  ##
  # Every page to be written out, stored under its own URL. Keyed by URL, not a plain list, because
  # serving the site locally rebuilds it in the same process on every save, and a list would gain
  # another copy of the whole site each time.

  @data = {}

  ##
  # Pattern to identify documents that should be excluded based on their URL.
  # The 404 page and the search page are excluded.

  @excluded_paths = %r{\.(css|js|json|map|xml|txt|yml)$|^/(404|search)\.html$}i.freeze

  ##
  # Pattern to identify block HTML tags (not comprehensive)

  @html_block_tags = %r{\s*<[?/]?(article|blockquote|d[dlt]|div|fieldset|form|h|li|main|nav|[ou]l|p|section|table|t[rd]).*?>\s*}im.freeze

  ##
  # Pattern to identify certain HTML tags whose content should be excluded from indexing

  @html_excluded_tags = %r{\s*<(head|style|script|h1|label|button).*?>.*?</\1>}im.freeze

  ##
  # Pattern to identify the version and status labels above a page's first paragraph

  @html_label_tags = %r{\s*<p[^>]*\sclass="label\b[^"]*"[^>]*>.*?</p>}im.freeze

  ##
  # Pattern to capture the first H1, which becomes the indexed title.

  @h1_tag = %r{<h1[^>]*>(.*?)</h1>}im.freeze

  ##
  # The first breadcrumb for pages in the OpenSearch section: the plain product name
  # Keep this wording the same as `OPENSEARCH_SECTION` in `assets/js/search.js`.

  OPENSEARCH_ROOT = 'OpenSearch'

  ##
  # Initializes the singleton by recording the site

  def self.init(site)
    @site = site
  end

  ##
  # The first one or two breadcrumbs: the section the page belongs to, then the collection within it.
  #
  # Only the OpenSearch section holds more than one collection, so only it needs the second crumb. Each
  # of the other five sections is a single collection.

  def self.section_crumbs(page)
    return [page.data['section-name'].to_s].reject(&:empty?) unless page.data['section'] == 'opensearch'

    label = page.collection&.label if page.instance_of?(Jekyll::Document)
    [OPENSEARCH_ROOT, @site.config.dig('opensearch_collection', 'collections', label, 'name')].compact
  end

  ##
  # The whole breadcrumb, widest first: the section and collection, then up to the three levels of
  # parent page that the navigation allows.
  #
  # The last crumb is left off when it says the same thing as the title, which is the case on the page
  # that introduces a collection: it is named after the collection, so the breadcrumb would end where
  # the heading begins. Case is ignored, because a collection is named in title case in `_config.yml`
  # ("Managing Indexes") and in sentence case on the page ("Managing indexes"). The section crumb
  # always stays: it tells the reader which set of documentation the page belongs to.

  def self.breadcrumb(page, title)
    crumbs = %w[great_grand_parent grand_parent parent].each_with_object(section_crumbs(page)) do |key, levels|
      level = page.data[key].to_s
      levels.push(level) unless level.empty? || levels.include?(level)
    end

    return crumbs if crumbs.length < 2

    crumbs.last.strip.casecmp?(title.to_s.strip) ? crumbs[0..-2] : crumbs
  end

  ##
  # Characters that HTML writes as an escape code. Headings are put back through this so that a title
  # is indexed as `&` rather than as `&amp;`.

  @html_entities = {
    '&amp;' => '&', '&lt;' => '<', '&gt;' => '>', '&quot;' => '"', '&#39;' => "'"
  }.freeze

  ##
  # The page's main heading as plain text, or the front matter `title` when the page has no heading to
  # use.

  def self.extract_heading(page)
    title = page.data['title']
    match = @h1_tag.match(page.content)
    return title if match.nil?

    heading = match[1]
              .gsub(/<[^>]+>/, '')
              .gsub(/&(?:amp|lt|gt|quot|#39);/, @html_entities)
              .gsub(/\s+/, ' ')
              .strip

    heading.empty? ? title : heading
  end

  ##
  # Processes a Document or Page and adds it to the collection

  def self.add(page)
    return if @excluded_paths.match(page.url)

    content = page.content
                  .gsub(@html_excluded_tags, ' ')               # Strip certain HTML blocks
                  .gsub(@html_label_tags, ' ')                  # Strip version and status labels
                  .gsub(/<!--.*?-->/m, ' ')                     # Strip HTML comments
                  .gsub(@html_block_tags, "\n")                 # Strip some block HTML tags, replacing with newline
                  .gsub(%r{\s*<[?/!]?[a-z]+.*?>\s*}im, ' ')     # Strip all remaining HTML tags
                  .gsub(/\s*[\r\n]+\s*/, "\n")                  # Clean line-breaks
                  .gsub(/\s{2,}/, ' ')                          # Trim long spaces
                  .gsub(/\s+([.:;,)!\]?])/, '\1')               # Remove spaces before some punctuations
                  .strip                                        # Trim leading and tailing whitespaces

    return if content.empty?

    url = @site.config['baseurl'] + page.url

    title = extract_heading(page)

    data = {
      url: url,
      title: title,
      content: content,
      ancestors: breadcrumb(page, title),
      type: 'DOCS'
    }

    @data[url] = data
  end

  ##
  # Saves the collection as a JSON file

  def self.save
    File.open(File.join(@site.config['destination'], 'search-index.json'), 'w') do |f|
      f.puts JSON.pretty_generate(@data.values)
    end
  end
end

# Before any Document or Page is processed, initialize the ContentIndexer

Jekyll::Hooks.register :site, :pre_render do |site|
  Jekyll::ContentIndexer.init(site)
end

# Process a Page as soon as its content is ready

Jekyll::Hooks.register :pages, :post_convert do |page|
  Jekyll::ContentIndexer.add(page)
end

# Process a Document as soon as its content is ready

Jekyll::Hooks.register :documents, :post_convert do |document|
  Jekyll::ContentIndexer.add(document)
end

# Save the produced collection after Jekyll is done writing all its stuff

Jekyll::Hooks.register :site, :post_write do |_|
  Jekyll::ContentIndexer.save
end
