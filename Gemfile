# frozen_string_literal: true

source 'https://rubygems.org'

# Manually add csv gem since Ruby 3.4.0 no longer includes it
gem 'csv', '~> 3.0'

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!
gem 'jekyll', '~> 4.3.2'

# This is the default theme for new Jekyll sites. You may change this to anything you like.
gem 'jekyll-redirect-from', '~> 0.16'
gem 'jekyll-remote-theme', '~> 0.4'
gem 'just-the-docs', '~> 0.3.3'

# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.

# gem 'github-pages', group: :jekyll_plugins

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem 'jekyll-last-modified-at'
  gem 'jekyll-sitemap'
  gem 'jekyll-spec-insert', :path => './spec-insert'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

# Performance-booster for watching directories on Windows
gem 'wdm', '~> 0.1.0' if Gem.win_platform?

# Installs webrick dependency for building locally
gem 'webrick', '~> 1.7'

# Link checker
gem 'ruby-enum'
gem 'ruby-link-checker'
gem 'typhoeus'

# Spec Insert
gem 'activesupport', '~> 7'
gem 'mustache', '~> 1'

group :development, :test do
  gem 'rspec'
  gem 'rubocop', '~> 1.44', require: false
  gem 'rubocop-rake', require: false
end
