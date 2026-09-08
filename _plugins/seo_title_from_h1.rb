# frozen_string_literal: true

# Overrides the SEO <title> and Open Graph/Twitter title meta tags with the
# page's rendered H1 content. This ensures search engines see the full
# descriptive heading (e.g., "Date processor") rather than the shortened nav
# title (e.g., "Date") stored in front matter.
#
# Also replaces the meta description with the first prose paragraph after the
# H1 when the auto-generated excerpt would just repeat the heading text.
module SeoTitleFromH1
  MAX_DESCRIPTION_LENGTH = 160

  # Strips HTML tags, decodes common entities, and normalizes whitespace.
  def self.clean_html_text(html_fragment)
    html_fragment
      .gsub(/<[^>]+>/, '') # strip HTML tags
      .gsub('&amp;', '&')
      .gsub('&lt;', '<')
      .gsub('&gt;', '>')
      .gsub('&quot;', '"')
      .gsub('&#39;', "'")
      .gsub(/\s+/, ' ')    # normalize whitespace
      .strip
  end

  # Returns the page's main content region: the markup after the
  # `id="main-content"` container and before the footer. Scoping this way avoids
  # picking up headings from the footer or other chrome (for example, the
  # visually hidden "OpenSearch Links" footer heading, which would otherwise be
  # used as the title on pages that have no content H1, such as the home page).
  def self.main_content(html)
    after = html.split(/id="main-content"/m, 2)[1]
    return html if after.nil?

    # Drop everything from the footer onward. The theme's footer is a
    # `<div role="contentinfo">` (not a `<footer>` element) and contains a
    # visually hidden "OpenSearch Links" <h1> that must not be mistaken for page
    # content, especially on pages with no content H1 (such as the home page).
    after.split(/<(?:footer\b|div[^>]*role="contentinfo")/m, 2)[0]
  end

  def self.extract_h1_text(html)
    match = main_content(html).match(%r{<h1[^>]*>(.*?)</h1>}m)
    return nil unless match

    # Remove anchor links before cleaning the remaining markup.
    inner = match[1].gsub(%r{<a[^>]*class="anchor-heading"[^>]*>.*?</a>}m, '')
    text = clean_html_text(inner)
    text.empty? ? nil : text
  end

  def self.extract_description(html)
    # Get all content after the first H1 in the main content, then find the
    # first prose paragraph.
    after_h1 = main_content(html).split(%r{</h1>}m, 2)[1]
    return nil unless after_h1

    after_h1.scan(%r{<p>(.*?)</p>}m).each do |match|
      text = clean_html_text(match[0])
      # Skip empty or very short paragraphs (likely not real descriptions).
      next if text.empty? || text.length < 20

      return truncate_description(text)
    end

    nil
  end

  def self.truncate_description(text)
    return text if text.length <= MAX_DESCRIPTION_LENGTH

    truncated = text[0...MAX_DESCRIPTION_LENGTH]
    # Cut at last word boundary
    truncated = truncated.sub(/\s+\S*$/, '')
    "#{truncated}..."
  end

  def self.replace_seo_tags(output, title_fm, h1_text, full_seo_title, site_title)
    old_full_title = site_title.empty? ? title_fm : "#{title_fm} | #{site_title}"
    title_tag = "<title>#{escape_html(full_seo_title)}</title>"
    og = %(<meta property="og:title" content="#{escape_attr(h1_text)}" />)
    tw = %(<meta name="twitter:title" content="#{escape_attr(h1_text)}" />)
    headline = %("headline":"#{escape_json(h1_text)}")

    # Use the block form of `sub` for every replacement so the interpolated
    # content is inserted literally. The string form would interpret sequences
    # like \1, \&, or \0 in the content as regex backreferences and corrupt it.
    # Note: jekyll-seo-tag emits og:title with `property=` but twitter:title with
    # `name=` — match each accordingly.
    output
      .sub(%r{<title>#{Regexp.escape(old_full_title)}</title>}) { title_tag }
      .sub(%r{<meta property="og:title" content="#{Regexp.escape(title_fm)}" />}) { og }
      .sub(%r{<meta name="twitter:title" content="#{Regexp.escape(title_fm)}" />}) { tw }
      .sub(/"headline":"#{Regexp.escape(title_fm)}"/) { headline }
  end

  def self.replace_description(output, new_desc)
    escaped = escape_attr(new_desc)
    meta = %(<meta name="description" content="#{escaped}" />)
    json_ld = %("description":"#{escape_json(new_desc)}")

    # All replacements use the block form of `sub` so the content is inserted
    # literally (the string form would interpret \1, \&, etc. as backreferences).

    # Plain description meta tag, then JSON-LD description.
    output = output
             .sub(%r{<meta name="description" content="[^"]*" />}) { meta }
             .sub(/"description":"[^"]*"/) { json_ld }

    # Open Graph / Twitter description. jekyll-seo-tag emits these as a single
    # combined tag (`<meta name="twitter:description" property="og:description"
    # content="..." />`), so match any meta tag carrying og:description and
    # replace only its content attribute, regardless of attribute order.
    output.sub(/(<meta\b[^>]*\bproperty="og:description"[^>]*\bcontent=")[^"]*(")/m) do
      "#{Regexp.last_match(1)}#{escaped}#{Regexp.last_match(2)}"
    end
  end

  def self.escape_html(text)
    text.gsub('&', '&amp;').gsub('<', '&lt;').gsub('>', '&gt;')
  end

  def self.escape_attr(text)
    escape_html(text).gsub('"', '&quot;')
  end

  def self.escape_json(text)
    # Block form so replacements are inserted literally; in a gsub *string*
    # replacement, "\\\\" would collapse to a single backslash (a no-op).
    text.gsub('\\') { '\\\\' }.gsub('"') { '\\"' }
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  next unless doc.output_ext == '.html'
  next unless doc.output

  h1_text = SeoTitleFromH1.extract_h1_text(doc.output)
  next if h1_text.nil? || h1_text.empty?

  # Replace title if H1 differs from front matter title
  title_fm = doc.data['title'].to_s.strip
  unless title_fm.empty? || title_fm.downcase == h1_text.downcase
    site_title = doc.site.config['title'].to_s
    full_seo_title = site_title.empty? ? h1_text : "#{h1_text} | #{site_title}"
    doc.output = SeoTitleFromH1.replace_seo_tags(doc.output, title_fm, h1_text, full_seo_title, site_title)
  end

  # Replace description with the first prose paragraph after the H1, but only
  # when the page has no explicit `description` in its front matter. A front
  # matter description is already used by jekyll-seo-tag, so leave it as is.
  unless doc.data['description'] && !doc.data['description'].to_s.strip.empty?
    new_desc = SeoTitleFromH1.extract_description(doc.output)
    doc.output = SeoTitleFromH1.replace_description(doc.output, new_desc) if new_desc
  end
end
