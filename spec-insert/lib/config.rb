# frozen_string_literal: true

require 'pathname'
require 'yaml'
require_relative 'spec_hash'

CONFIG_PATH = './config.yml'.freeze
CONFIG = SpecHash.new(YAML.load_file(CONFIG_PATH))