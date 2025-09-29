---
layout: default
title: Vector search API
nav_order: 80
has_children: true
has_toc: false
redirect_from:
  - /vector-search/api/knn/
  - /vector-search/api/
  - /search-plugins/knn/api/
---

# Vector search API

In OpenSearch, vector search functionality is provided by the k-NN plugin and Neural Search plugin. The k-NN plugin provides basic k-NN functionality, while the Neural Search plugin provides automatic embedding generation at indexing and search time.

For k-NN plugin APIs, see [k-NN API]({{site.url}}{{site.baseurl}}/vector-search/api/knn/).

In addition to plugin-specific APIs, the following APIs support vector search functionality:

- [k-NN vector]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/)
- [k-NN query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/k-nn/)
- [Neural query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/)
- [Neural sparse query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural-sparse/)
- [Ingest pipelines]({{site.url}}{{site.baseurl}}/ingest-pipelines/)
- Ingest processors:
    - [ML inference]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/ml-inference/)
    - [Sparse encoding]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/sparse-encoding/)
    - [Text chunking]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-chunking/)
    - [Text embedding]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-embedding/)
    - [Text/image embedding]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-image-embedding/)
- [Search pipelines]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/)
- Search processors:
    - [ML inference (request)]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-request/)
    - [ML inference (response)]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-response/)
    - [Neural query enricher]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/)
    - [Neural sparse query two-phase]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/)
    - [Normalization]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/)
    - [Rerank]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/)
    - [Retrieval-augmented generation]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rag-processor/)
    - [Score ranker]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/score-ranker-processor/)