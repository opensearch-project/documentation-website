---
layout: default
title: Optimizing vector storage
nav_order: 60
has_children: true
has_toc: false
redirect_from:
  - /vector-search/optimizing-storage/
storage_cards:
  - heading: "Vector quantization"
    description: "Reduce vector storage space by quantizing vectors"
    link: "/vector-search/optimizing-storage/knn-vector-quantization/"
  - heading: "Disk-based vector search"
    description: "Uses binary quantization to reduce the operational costs of vector workloads"
    link: "/vector-search/optimizing-storage/disk-based-vector-search/"
---

# Optimizing vector storage

Vector search operations can be resource intensive, especially when dealing with large-scale vector datasets. OpenSearch provides several optimization techniques for reducing memory usage.

{% include cards.html cards=page.storage_cards %}

## Disk-friendly quantization using the opensearch-jvector plugin

The `jvector` engine, provided by the [`opensearch-jvector` plugin]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/opensearch-jvector/), implements DiskANN-style indexing: it stores vectors on disk rather than in memory and builds indexes directly from quantized vectors. This reduces memory use without requiring separate quantization configuration.

Compared with the built-in engines, the `jvector` engine provides the following storage advantages:

- It builds indexes from quantized vectors, reducing the memory required during indexing.
- It refines quantization codebooks incrementally during merges, with no full rebuilds.
