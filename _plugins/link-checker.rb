# frozen_string_literal: true

# Copyright OpenSearch Contributors
# SPDX-License-Identifier: BSD-3-Clause

require 'net/http'
require 'jekyll/hooks'
require 'jekyll/document'
require 'json'
require 'set'
require 'uri'
require 'pathname'
require 'typhoeus'
require 'ruby-link-checker'

##
# This singleton checks links during build to warn or fail upon finding dead links.
#
# `JEKYLL_LINK_CHECKER`, set on the environment, will cause verification of external links
# Valid values: internal, forced, all.
# Usage: `JEKYLL_LINK_CHECKER=internal bundle exec jekyll build --trace`
#
# `JEKYLL_FATAL_LINK_CHECKER`, set on the environment, is the same as `JEKYLL_LINK_CHECKER`
# except that it fails the build if there are broken links. it takes the same valid values
# Usage: `JEKYLL_FATAL_LINK_CHECKER=internal bundle exec jekyll build --trace`

module Jekyll::LinkChecker
  ##
  # The collection that will get stores as the output

  @urls

  ##
  # Pattern to identify documents that should be excluded based on their URL

  @excluded_paths = %r{(\.(css|js|json|map|xml|txt|yml)$|/version-selector\.tpl$)}i.freeze

  ##
  # Pattern to identify certain HTML tags whose content should be excluded from indexing

  @href_matcher = /<a[^>]+href=(['"])(.+?)\1/im.freeze

  ##
  # Pattern to check for external URLs

  @external_matcher = %r{^https?://}.freeze
  @forced_external_matcher = %r{^https?://.*(?=opensearch\.org/)}.freeze

  ##
  # List of domains to ignore
  # playground.opensearch.org is causing an infinite redirect
  # LinkedIn mostly fails with 999 status codes
  @ignored_domains = [
    'localhost',
    'playground.opensearch.org', # inifite redirect, https://github.com/opensearch-project/dashboards-anywhere/issues/172
    'crates.io', # 404s on bots
    'www.cloudflare.com', # 403s on bots
    'example.issue.link', # a fake example link from the template
  ]

  ##
  # Pattern of local paths to ignore
  @ignored_paths = %r{(^/javadocs|^mailto:)}.freeze

  ##
  # Holds the list of failures
  @failures

  ##
  # Build flags driven by environment variables
  @@LINK_CHECKER_STATES = %w[internal forced all]
  @check_links                # Enables the link checker
  @check_forced_external      # Enables checking internal links marked as external e.g. /docs
  @check_external_links       # Enables checking external links
  @should_build_fatally       # indicates the need to fail the build for dead links

  ##
  # Defines the priority of the plugin
  # The hooks are registered with a very low priority to make sure they runs after any content modifying hook
  def self.priority
    10
  end

  ##
  # Initializes the singleton by recording the site
  def self.init(site)
    @site = site
    @urls = {}
    @failures = []

    begin
      @should_build_fatally = true if ENV.key?('JEKYLL_FATAL_LINK_CHECKER')
      check_flag = @should_build_fatally ? ENV['JEKYLL_FATAL_LINK_CHECKER'] : ENV['JEKYLL_LINK_CHECKER']

      unless check_flag
        return Jekyll.logger.info 'LinkChecker:', 'disabled. Enable with JEKYLL_LINK_CHECKER on the environment'
      end

      unless @@LINK_CHECKER_STATES.include?(check_flag)
        Jekyll.logger.info "LinkChecker: [Notice] Could not initialize, Valid values for #{@should_build_fatally ? 'JEKYLL_FATAL_LINK_CHECKER' : 'JEKYLL_LINK_CHECKER'} are #{@@LINK_CHECKER_STATES}"
        return
      end

      @external_link_checker = LinkChecker::Typhoeus::Hydra::Checker.new(
        logger: Jekyll.logger,
        hydra: { max_concurrency: 2 },
        retries: 3,
        user_agent: 'OpenSearch Documentation Website Link Checker/1.0'
      )

      @external_link_checker.on :failure, :error do |result|
        @failures << "#{result}, linked to in #{result.options[:location]}"
      end

      @check_links = true if @@LINK_CHECKER_STATES.include?(check_flag)
      @check_forced_external = true if @@LINK_CHECKER_STATES[1..3].include?(check_flag)
      @check_external_links = true if @@LINK_CHECKER_STATES[2..3].include?(check_flag)

      msg = {
        'internal' => 'internal links',
        'forced' => 'internal and forced external links',
        'all' => 'all links'
      }

      # Process a Page as soon as its content is ready
      Jekyll::Hooks.register :pages, :post_convert, priority: priority do |page|
        process(page)
      end

      # Process a Document as soon as its content is ready
      Jekyll::Hooks.register :documents, :post_convert, priority: priority do |document|
        process(document)
      end

      # Verify gathered links after Jekyll is done writing all its stuff
      Jekyll::Hooks.register :site, :post_write, priority: priority do |site|
        verify(site)
      end

      if @check_links
        Jekyll.logger.info "LinkChecker: [Notice] Initialized successfully and will check #{msg[check_flag]}"
      end
      Jekyll.logger.info 'LinkChecker: [Notice] The build will fail if a dead link is found' if @should_build_fatally
    rescue StandardError => e
      Jekyll.logger.error 'LinkChecker: [Error] Failed to initialize Link Checker'
      raise
    end
  end

  ##
  # Processes a Document or Page and adds the links to a collection
  # It also checks for anchors to parts of the same page/doc

  def self.process(page)
    return unless @check_links
    return if @excluded_paths.match(page.path)

    hrefs = page.content.scan(@href_matcher)
    hrefs.each do |(_, href)|
      relative_path = page.path[0] == '/' ? Pathname.new(page.path).relative_path_from(Dir.getwd) : page.path

      if href.eql? '#'
        next
      elsif href.start_with? '#'
        Jekyll.logger.info relative_path if (page.content =~ /<[a-z0-9-]+[^>]+(?:id|name)="#{href[1..]}"/i).nil?
        if (page.content =~ /<[a-z0-9-]+[^>]+(?:id|name)="#{href[1..]}"/i).nil?
          @failures << "##{href[1..]}, linked in ./#{relative_path}"
        end
      else
        @urls[href] = Set[] unless @urls.key?(href)
        @urls[href] << relative_path
      end
    end
  end

  ##
  # Saves the collection as a JSON file

  def self.verify(_site)
    return unless @check_links

    @base_url_matcher = %r{^#{@site.config["url"]}#{@site.baseurl}(/.*)$}.freeze

    @urls.sort_by { |url, pages| rand }.each do |url, pages|
      location = "./#{pages.to_a.join(', ./')}"
      @failures << "#{url}, linked to in #{location}" unless check(url, location)
    end

    @external_link_checker.run

    unless @failures.empty?
      msg = "Found #{@failures.size} dead link#{@failures.size > 1 ? 's' : ''}:\n#{@failures.join("\n")}"
    end

    if !@failures.empty?
      if @should_build_fatally
        Jekyll.logger.error "\nLinkChecker: [Error] #{msg}\n".red
        raise msg
      else
        Jekyll.logger.warn "\nLinkChecker: [Warning] #{msg}\n".red
      end
    else
      Jekyll.logger.info "\nLinkChecker: [Success] No broken links!\n".green
    end
  end

  ##
  # Check if URL is accessible

  def self.check(url, location)
    match = @base_url_matcher.match(url)
    url = match[1] unless match.nil?

    url = @site.config['url'] + url if url.start_with? '/docs/'

    if @forced_external_matcher =~ url
      return true unless @check_forced_external

      return check_external(url, location)
    end

    if @external_matcher =~ url
      return true unless @check_external_links

      return check_external(url, location)
    end

    check_internal(url, location)
  end

  ##
  # Check if an external URL is accessible

  def self.check_external(url, location)
    url = begin
      URI(url)
    rescue StandardError
      url
    end
    return true if url.is_a?(URI) && @ignored_domains.include?(url.host)

    @external_link_checker.check(url, { location: location })
  end

  ##
  # Check if an internal link is accessible

  def self.check_internal(url, location)
    Jekyll.logger.info "LinkChecker: [Info] Checking #{url}".cyan
    return true if @ignored_paths =~ url

    path, hash = url.split('#')

    unless path =~ %r{\.[^/]{2,}$}
      path << '/' unless path.end_with? '/'
      path << 'index.html' unless path.end_with? 'index.html'
    end

    filename = File.join(@site.config['destination'], path)

    return false unless File.file?(filename)

    content = File.read(filename)
    unless content.include? '<title>Redirecting'
      return true if hash.nil? || hash.empty?

      return !(content =~ /<[a-z0-9-]+[^>]+id="#{hash}"/i).nil?
    end

    match = content.match(@href_matcher)
    if match.nil?
      Jekyll.logger.warn "LinkChecker: [Warning] Cannot check #{url} due to an unfollowable redirect"
      return true
    end

    redirect = match[2]
    redirect << '#' + hash unless hash.nil? || hash.empty?
    check(redirect, location)
  end
end

# Before any Document or Page is processed, initialize the LinkChecker
Jekyll::Hooks.register :site, :pre_render, priority: Jekyll::LinkChecker.priority do |site|
  Jekyll::LinkChecker.init(site)
end
