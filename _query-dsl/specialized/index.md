---
layout: default
title: Specialized queries
has_children: true
nav_order: 60
has_toc: false
redirect_from:
  - /query-dsl/specialized/
---

# Specialized queries

Specialized queries provide advanced scoring, filtering, and utility functions beyond standard full-text and term queries.

For AI and vector search queries (k-NN, Neural, Neural sparse, Agentic, Template), see [AI and vector search queries]({{site.url}}{{site.baseurl}}/query-dsl/ai-vector-search/).

| Query type | Description |
| :--- | :--- |
| [`distance_feature`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/distance-feature/) | Calculates document scores based on the dynamically calculated distance between the origin and a document's `date`, `date_nanos`, or `geo_point` fields. This query can skip non-competitive hits. |
| [`more_like_this`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/more-like-this/) | Finds documents similar to the provided text, document, or collection of documents. |
| [`percolate`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/percolate/) | Finds queries (stored as documents) that match the provided document. |
| [`rank_feature`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/rank-feature/) | Calculates scores based on the values of numeric features. This query can skip non-competitive hits. |
| [`script`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script/) | Uses a script as a filter. |
| [`script_score`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/script-score/) | Calculates a custom score for matching documents using a script. |
| [`wrapper`]({{site.url}}{{site.baseurl}}/query-dsl/specialized/wrapper/) | Accepts other queries as JSON or YAML strings. |
