require 'jekyll'
require 'rouge'

module Rouge
  module Lexers
    class CustomJSON < JSON
      tag 'json'

      prepend :root do
        rule %r/\b(GET|PUT|POST|DELETE|PATCH|HEAD)\b/, Keyword::Reserved
      end
    end
  end
end

Jekyll::Hooks.register :site, :pre_render do |site|
  # Ensure the custom lexer is loaded
end
