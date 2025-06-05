# SPDX-License-Identifier: Apache-2.0
#
# The OpenSearch Contributors require contributions made to
# this file be licensed under the Apache-2.0 license or a
# compatible open source license.

# frozen_string_literal: true

module Api
  # An API Operation
  class Operation
    # @return [SpecHash] Operation Spec
    attr_reader :spec
    # @return [String] URL
    attr_reader :url
    # @return [String] HTTP Verb
    attr_reader :http_verb
    # @return [String] Operation Group
    attr_reader :group
    # @return [String] API Action
    attr_reader :action
    # @return [String] API Namespace
    attr_reader :namespace

    # @param [SpecHash] spec Operation Spec
    # @param [String] url
    # @param [String] http_verb
    def initialize(spec, url, http_verb)
      @spec = spec
      @url = url
      @http_verb = http_verb.upcase
      @group = spec['x-operation-group']
      @action, @namespace = @group.split('.').reverse
    end
  end
end
