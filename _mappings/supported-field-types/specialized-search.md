---
layout: default
title: Specialized search field types
nav_order: 95
has_children: true
has_toc: false
parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/specialized-search/
---

# Specialized search field types

Specialized search field types provide advanced search functionality and performance optimizations.

Field data type | Description
:--- | :---
[`semantic`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/semantic/) | Wraps a text or binary field to simplify semantic search setup.
[`rank_feature`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/rank/) | Boosts or decreases the relevance score of documents.
[`rank_features`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/rank/) | Boosts or decreases the relevance score of documents. Used when the list of features is sparse.
[`percolator`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/percolator/) | A field that acts as a stored query for reverse search operations.
[`star_tree`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/star-tree/) | Precomputes aggregations for faster performance using a star-tree index.
[`derived`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/derived/) | A dynamically generated field computed from other fields using a script.