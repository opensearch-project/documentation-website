---
permalink: /assets/js/version-selector.js
---
(() => {
{% assign all_versions = site.data.versions.future | push: site.data.versions.current | concat: site.data.versions.past %}
const DOC_VERSIONS = {{ all_versions | jsonify }};
const LATEST_DOC_VERSION = {{ site.data.versions.current | jsonify }};
{% include_relative _version-selector.js %}
})();