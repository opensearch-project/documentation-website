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

  @excluded_paths = %r{(/_faqs/|\.(css|js|json|map|xml|txt|yml|svg|)$)}i.freeze

  ##
  # Pattern to identify certain HTML tags whose content should be excluded from indexing

  @href_matcher = /<a[^>]+href=(['"])(.+?)\1/im.freeze

  ##
  # Pattern to check for external URLs

  @external_matcher = %r{^https?://}.freeze
  @forced_external_matcher = %r{^https?://.*(?=opensearch\.org/)}.freeze

  ##
  # List of domains to ignore
  @ignored_domains = %w[localhost]

  ##
  # Pattern of local paths to ignore
  @ignored_paths = %r{(^/docs$|^mailto:|^/javadocs/)}.freeze

  ##
  # Valid response codes for successful links
  @success_codes = %w[200 302]

  ##
  # Questionable response codes for successful links
  @@questionable_codes = %w[301 308 403]

  ##
  # Retry response codes for links
  @@retry_codes = %w[429]

  ##
  # Holds the list of failures
  @failures

  ##
  # Build flags driven by environment variables
  @@LINK_CHECKER_STATES = %w[internal forced all retry]
  @check_links                # Enables the link checker
  @check_forced_external      # Enables checking internal links marked as external e.g. /docs
  @check_external_links       # Enables checking external links
  @retry_external_links       # Enables retrying external links
  @should_build_fatally       # indicates the need to fail the build for dead links

  ##
  # The retry durations for host to retry
  @retry_timeouts_dict = {}
  @retry_iteration = 0
  @@retry_buffer = 10
  @@max_retry_iterations = 1

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
    @retry_timeouts = {}

    begin
      @should_build_fatally = true if ENV.key?('JEKYLL_FATAL_LINK_CHECKER')
      check_flag = @should_build_fatally ? ENV['JEKYLL_FATAL_LINK_CHECKER'] : ENV['JEKYLL_LINK_CHECKER']

      unless check_flag
        return Jekyll.logger.info 'LinkChecker:',
                                  'disabled. Enable with JEKYLL_LINK_CHECKER on the environment'
      end

      unless @@LINK_CHECKER_STATES.include?(check_flag)
        Jekyll.logger.info "LinkChecker: [Notice] Could not initialize, Valid values for #{@should_build_fatally ? 'JEKYLL_FATAL_LINK_CHECKER' : 'JEKYLL_LINK_CHECKER'} are #{@@LINK_CHECKER_STATES}"
        return
      end

      @check_links = true if @@LINK_CHECKER_STATES.include?(check_flag)
      @check_forced_external = true if @@LINK_CHECKER_STATES[1..3].include?(check_flag)
      @check_external_links = true if @@LINK_CHECKER_STATES[2..3].include?(check_flag)
      @retry_external_links = true if @@LINK_CHECKER_STATES[3].include?(check_flag)

      msg = {
        'internal' => 'internal links',
        'forced' => 'internal and forced external links',
        'all' => 'all links',
        'retry' => 'all links with retry'
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
          @failures << "Process:: ##{href[1..]}, linked in ./#{relative_path}"
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
    retry_hosts = {}

    # Run atleast once
    loop do
      urls = @urls

      # If its a retry
      unless retry_hosts.empty?
        # Get min sleep time in dict of timeouts and sleep
        host_name, min_timeout_obj = @retry_timeouts_dict.min_by { |_k, v| v[:retry_timestamp] }
        now = Process.clock_gettime(Process::CLOCK_MONOTONIC)
        sleep_time = min_timeout_obj[:retry_timestamp] - now + @@retry_buffer

        if sleep_time > 0
          Jekyll.logger.info "LinkChecker: [Info] Going to sleep for #{sleep_time}".cyan
          sleep(sleep_time)
        end

        # Get URLS to retry and clear from retry hash's
        Jekyll.logger.info "LinkChecker: [Info] Retrying links for host #{host_name}".cyan
        urls = retry_hosts[host_name].clone
        @retry_timeouts_dict.delete(host_name)
        retry_hosts.delete(host_name)
      end

      # checl each url
      # - valid URL: should not be failures but or in retry_hosts hash
      # - invalid URL: should be failures but not in retry_hosts hash
      # - retry URL: should not be failures, only in retry_hosts hash
      urls.each do |url, pages|
        Jekyll.logger.info "LinkChecker: [Info] Checking #{url}".cyan

        valid_or_retry, metadata = check(url)
        @failures << "Verify:: #{url}, linked to in ./#{pages.to_a.join(', ./')}" unless valid_or_retry

        next unless @retry_external_links and metadata&.key?(:retry_host_name)

        retry_host_name = metadata[:retry_host_name]
        retry_hosts[retry_host_name] = [] unless retry_hosts.key?(retry_host_name)
        retry_hosts[retry_host_name] << url
      end

      @retry_iteration += 1
      break if !@retry_external_links or (@retry_iteration >= @@max_retry_iterations) or retry_hosts.empty?
    end

    unless @failures.empty?
      msg = "Found #{@failures.size} dead link#{@failures.size > 1 ? 's' : ''}:\n#{@failures.join("\n")}"
    end

    unless retry_hosts.empty?
      retry_msg = retry_hosts.map do |host, urls|
        "Host:#{host}\n#{urls.map { |url| "- #{url}" }.join("\n")}\n"
      end.join("\n")
      msg = "Links we could not retry: \n#{retry_msg} \n#{msg}"
    end

    if !@failures.empty?
      raise msg if @should_build_fatally

      Jekyll.logger.warn "\nLinkChecker: [Warning] #{msg}\n"

    else
      Jekyll.logger.info "\nLinkChecker: [Success] No broken links!\n".green
    end
  end

  ##
  # Check if URL is accessible

  def self.check(url)
    match = @base_url_matcher.match(url)
    url = match[1] unless match.nil?

    url = @site.config['url'] + url if url.start_with? '/docs/'

    if @forced_external_matcher =~ url
      return true unless @check_forced_external

      return check_external(url)
    end

    if @external_matcher =~ url
      return true unless @check_external_links

      return check_external(url)
    end

    check_internal(url)
  end

  ##
  # Check if an external URL is accessible by making a HEAD call

  def self.check_external(url)
    begin
      uri = URI(url)
      return true if @ignored_domains.include? uri.host

      Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
        # http.use_ssl = (uri.scheme == "https")

        request = Net::HTTP::Head.new(uri)

        http.request(request) do |response|
          return true if @success_codes.include? response.code

          if @@retry_codes.include? response.code
            retry_after = response.header['retry-after']

            if retry_after.nil?
              Jekyll.logger.warn "LinkChecker: [Warning] Got #{response.code} from #{url}, cannot retry due to missing retry header"
              return true
            end

            if @retry_external_links
              now = Process.clock_gettime(Process::CLOCK_MONOTONIC)
              retry_timestamp = retry_after.to_i + now # TODO: This could also be a timestamp

              @retry_timeouts_dict[uri.host] = {
                code: response.code,
                retry_timestamp: retry_timestamp
              }

              Jekyll.logger.warn "LinkChecker: [Warning] Got #{response.code} from #{url}, will retry after #{retry_after}s"
              return true, { retry_host_name: uri.host }
            end

            Jekyll.logger.warn "LinkChecker: [Warning] Got #{response.code} from #{url}, will not retry"
            return true

          elsif @@questionable_codes.include? response.code
            Jekyll.logger.warn "LinkChecker: [Warning] Got #{response.code} from #{url}"
            return true
          end

          Jekyll.logger.error "LinkChecker: [Error] Got #{response.code} from #{url}"
          return false
        end
      end
    rescue OpenSSL::SSL::SSLError, Net::OpenTimeout, Errno::ETIMEDOUT, Errno::ECONNREFUSED => e
      Jekyll.logger.error "LinkChecker: [Error] Exception Occurred for URL #{url} #{e.class}. Message: #{e.message}."
      false
    rescue StandardError => e
      # TODO: This should not return false, but instead re raise. We should not have unknown exceptions
      Jekyll.logger.error "LinkChecker: [Error] Unknown Error::URL: #{url}\nError: #{e.class}. Message: #{e.message}."
      false
    end
  end

  ##
  # Check if an internal link is accessible

  def self.check_internal(url)
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
    check(redirect)
  end
end

# Before any Document or Page is processed, initialize the LinkChecker
Jekyll::Hooks.register :site, :pre_render, priority: Jekyll::LinkChecker.priority do |site|
  Jekyll::LinkChecker.init(site)
end
