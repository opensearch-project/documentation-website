require 'yaml'
config = YAML.load_file('_config.yml')
puts "Plugins: #{config['plugins']}"
puts "Gems: #{config['gems']}"
