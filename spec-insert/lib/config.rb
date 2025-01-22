# frozen_string_literal: true

require 'pathname'
require 'yaml'
require_relative 'dot_hash'

CONFIG_PATH = File.expand_path('../config.yml', __dir__).freeze
CONFIG = DotHash.new(YAML.load_file(CONFIG_PATH))
