# frozen_string_literal: true

require 'pathname'
require 'yaml'
require_relative 'spec_hash'

CONFIG_PATH = File.expand_path('../config.yml', __dir__).freeze
CONFIG = SpecHash.new(YAML.load_file(CONFIG_PATH))
