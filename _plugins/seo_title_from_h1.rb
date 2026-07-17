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

  def self.extract_h1_text(html)
    match = html.match(/<h1[^>]*>(.*?)<\/h1>/m)
    return nil unless match

    text = match[1]
      .gsub(/<a[^>]*class="anchor-heading"[^>]*>.*?<\/a>/m, '') # remove anchor links
      .gsub(/<[^>]+>/, '')   # strip remaining HTML tags
      .gsub('&amp;', '&')
      .gsub('&lt;', '<')
      .gsub('&gt;', '>')
      .gsub('&quot;', '"')
      .gsub('&#39;', "'")
      .gsub(/\s+/, ' ')      # normalize whitespace
      .strip

    text.empty? ? nil : text
  end

  def self.extract_description(html)
    # Get all content after the first H1, find the first prose paragraph
    after_h1 = html.split(/<\/h1>/m, 2)[1]
    return nil unless after_h1

    # Extract text from <p> tags (rendered prose paragraphs)
    after_h1.scan(/<p>(.*?)<\/p>/m).each do |match|
      text = match[0]
        .gsub(/<[^>]+>/, '')   # strip HTML tags
        .gsub('&amp;', '&')
        .gsub('&lt;', '<')
        .gsub('&gt;', '>')
        .gsub('&quot;', '"')
        .gsub('&#39;', "'")
        .gsub(/\s+/, ' ')
        .strip

      # Skip empty paragraphs and very short ones (likely not real descriptions)
      next if text.empty?
      next if text.length < 20

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
    output = output.sub(%r{<title>#{Regexp.escape(old_full_title)}</title>},
                         "<title>#{escape_html(full_seo_title)}</title>")

    output = output.sub(%r{<meta property="og:title" content="#{Regexp.escape(title_fm)}" />},
                         %(<meta property="og:title" content="#{escape_attr(h1_text)}" />))

    output = output.sub(%r{<meta property="twitter:title" content="#{Regexp.escape(title_fm)}" />},
                         %(<meta property="twitter:title" content="#{escape_attr(h1_text)}" />))

    output = output.sub(%r{"headline":"#{Regexp.escape(title_fm)}"},
                         %("headline":"#{escape_json(h1_text)}"))

    output
  end

  def self.replace_description(output, new_desc)
    output.sub(%r{<meta name="description" content="[^"]*" />},
               %(<meta name="description" content="#{escape_attr(new_desc)}" />))
      .sub(%r{<meta property="og:description" content="[^"]*" />},
           %(<meta property="og:description" content="#{escape_attr(new_desc)}" />))
  end

  def self.escape_html(text)
    text.gsub('&', '&amp;').gsub('<', '&lt;').gsub('>', '&gt;')
  end

  def self.escape_attr(text)
    escape_html(text).gsub('"', '&quot;')
  end

  def self.escape_json(text)
    text.gsub('\\', '\\\\').gsub('"', '\\"')
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
