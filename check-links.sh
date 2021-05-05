# Checks for broken link in the documentation.
# Run `bundle exec jekyll serve` first.
# Uses https://github.com/stevenvachon/broken-link-checker
# I have no idea why we have to exclude the ISM section, but that's the only way I can get this to run. - ae
blc http://127.0.0.1:4000/docs/ -ro --filter-level 0 --exclude http://127.0.0.1:4000/docs/docs/ism/ --exclude http://localhost:5601/
