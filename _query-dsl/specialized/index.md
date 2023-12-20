---
layout: default
title: Specialized queries
has_children: true
nav_order: 65
has_toc: false
---

# Specialized queries

OpenSearch supports the following specialized queries:

- `distance_feature`: Calculates document scores based on the dynamically calculated distance between the origin and a document's `date`, `date_nanos`, or `geo_point` fields. This query can skip non-competitive hits.

- `more_like_this`: Finds documents similar to the provided text, document, or collection of documents.

- [`neural`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/): Used for vector field search in [neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/).

- [`neural_sparse`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/): Used for vector field search in [sparse neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

- `percolate`: Finds queries (stored as documents) that match the provided document.

- `rank_feature`: Calculates scores based on the values of numeric features. This query can skip non-competitive hits.

- `script`: Uses a script as a filter.

- [`script_score`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script-score/): Calculates a custom score for matching documents using a script.

- `wrapper`: Accepts other queries as JSON or YAML strings.
