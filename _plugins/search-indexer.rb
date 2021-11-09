# frozen_string_literal: true

require "jekyll/hooks"
require "jekyll/document"
require "json"

##
# This singleton facilitates production of an indexable JSON representation of the content to populate a data source
# to provide search functionality.

module Jekyll::ContentIndexer

  ##
  # The collection that will get stores as the output

  @data = []

  ##
  # Pattern to identify documents that should be excluded based on their URL

  @excluded_paths = /\.(css|js|json|map|xml|txt|yml)$/i.freeze

  ##
  # Pattern to identify block HTML tags (not comprehensive)

  @html_block_tags = /\s*<[?\/]?(article|blockquote|d[dlt]|div|fieldset|form|h|li|main|nav|[ou]l|p|section|table|t[rd]).*?>\s*/im.freeze

  ##
  # Pattern to identify certain HTML tags whose content should be excluded from indexing

  @html_excluded_tags = /\s*<(head|style|script|h1).*?>.*?<\/\1>/im.freeze

  ##
  # Initializes the singleton by recording the site

  def self.init(site)
    @site = site
  end

  ##
  # Processes a Document or Page and adds it to the collection

  def self.add(page)
    return if @excluded_paths.match(page.url)

    content = page.content
                  .gsub(@html_excluded_tags, ' ')             # Strip certain HTML blocks
                  .gsub(@html_block_tags, "\n")               # Strip some block HTML tags, replacing with newline
                  .gsub(/\s*<[?\/!]?[a-z]+.*?>\s*/im, ' ')    # Strip all remaining HTML tags
                  .gsub(/\s*[\r\n]+\s*/, "\n")                # Clean line-breaks
                  .gsub(/\s{2,}/, ' ')                        # Trim long spaces
                  .gsub(/\s+([.:;,)!\]?])/, '\1')             # Remove spaces before some punctuations
                  .strip                                      # Trim leading and tailing whitespaces

    return if content.empty?

    url = @site.config["baseurl"] + page.url

    # Produce a breadcrumb
    ancestors = []
    if page.instance_of?(Jekyll::Document)
      ancestors.push(@site.config.dig("just_the_docs", "collections", page.collection&.label, "name"))
    end

    ancestors.push(page.data["grand_parent"]) unless
      page.data["grand_parent"].nil? ||
      page.data["grand_parent"]&.empty? ||
      ancestors.include?(page.data["grand_parent"])     # Make sure collection name is not added

    ancestors.push(page.data["parent"]) unless
      page.data["parent"].nil? ||
        page.data["parent"]&.empty? ||
        ancestors.include?(page.data["parent"])         # Make sure collection name is not added

    data = {
      url: url,
      title: page.data["title"],
      content: content,
      ancestors: ancestors,
      type: "DOCS"
    }

    @data.push(data)
  end

  ##
  # Saves the collection as a JSON file

  def self.save
    File.open(File.join(@site.config["destination"], "search-index.json"), 'w') do |f|
      f.puts JSON.pretty_generate(@data)
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
  Jekyll::ContentIndexer.save()
end