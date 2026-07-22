# frozen_string_literal: true

# Removes the incorrect build-time dates that jekyll-seo-tag emits for reference
# documentation.
#
# Jekyll defaults a collection document's `page.date` to the build
# time (`site.time`) when no `date` is set in front matter. jekyll-seo-tag then
# turns that date into `dateModified`, `datePublished`, and `article:*_time`,
# producing a false, uniform "freshness" signal on every page. This plugin
# removes that markup after render:
#   - Removes the article:published_time and article:modified_time meta tags.
#   - Removes dateModified and datePublished from the JSON-LD block.
#
module SeoSchemaFix
  def self.apply(output)
    output = remove_article_time_meta(output)
    output = fix_og_type(output)
    remove_json_ld_dates(output)
  end

  def self.remove_article_time_meta(output)
    output.gsub(
      /[ \t]*<meta property="article:(?:published|modified)_time" content="[^"]*"[^>]*>\r?\n?/,
      ''
    )
  end

  # jekyll-seo-tag sets og:type to "article" whenever a date is present, in the
  # same block that emits article:*_time. Since we remove those dates (reference
  # docs are not dated articles), flip og:type to "website" so the Open Graph
  # metadata stays consistent. Cosmetic (affects social unfurls, not search).
  def self.fix_og_type(output)
    output.sub(
      %r{<meta property="og:type" content="article" />},
      %(<meta property="og:type" content="website" />)
    )
  end

  def self.remove_json_ld_dates(output)
    output.gsub(%r{(<script type="application/ld\+json">)(.*?)(</script>)}m) do
      "#{Regexp.last_match(1)}#{strip_dates(Regexp.last_match(2))}#{Regexp.last_match(3)}"
    end
  end

  # Removes dateModified/datePublished keys from a JSON-LD body, cleaning up any
  # orphan separators (handles both mid-object and last-key cases).
  def self.strip_dates(body)
    return body unless body.include?('"dateModified"') || body.include?('"datePublished"')

    body.gsub(/"dateModified":"[^"]*",?/, '')
        .gsub(/"datePublished":"[^"]*",?/, '')
        .gsub(/,\s*,/, ',').gsub(/\{\s*,/, '{').gsub(/,\s*\}/, '}')
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  next unless doc.output_ext == '.html'
  next unless doc.output

  doc.output = SeoSchemaFix.apply(doc.output)
end
