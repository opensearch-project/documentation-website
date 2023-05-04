---
permalink: /assets/js/version-selector.js
---
(() => {
{% if site.data.versions.all contains site.data.versions.current %}
{% assign all_versions = site.data.versions.all %}
{% else %}
{% assign current_array = site.data.versions.all | split: '!' %}
{% assign all_versions = current_array | concat: site.data.versions.all %}
{% endif %}
const DOC_VERSIONS = {{ all_versions | jsonify }};
const DOC_VERSIONS_ARCHIVED = {{ site.data.versions.archived | jsonify }};
{% if site.data.versions.latest %}
const DOC_VERSION_LATEST = {{ site.data.versions.latest | jsonify }};
{% else %}
const DOC_VERSION_LATEST = {{ site.data.versions.current | jsonify }};
{% endif %}
{% include_relative _version-selector.js %}
})();
