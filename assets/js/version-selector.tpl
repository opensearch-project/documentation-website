---
permalink: /assets/js/version-selector.js
---
(() => {
{% assign current_array = site.data.versions.current | split: '!' %}
{% assign all_versions = current_array | concat: site.data.versions.past %}
const DOC_VERSIONS = {{ all_versions | jsonify }};
{% include_relative _version-selector.js %}
})();