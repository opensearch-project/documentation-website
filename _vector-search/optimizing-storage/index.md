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

## Opensearch-jvector: Built-in disk-friendly quantization

The `jvector` engine provided by [`opensearch-jvector`]({{site.url}}{{site.baseurl}}/install-and-configure/additional-plugins/opensearch-jvector/) plugin implements DiskANN-style indexing, which stores vectors on disk rather than in memory, and builds indexes directly from quantized vectors. This approach provides substantial memory savings without requiring separate quantization configuration steps.

Key storage advantages of `jvector` compared to the built-in engines:

- **Quantized index construction**: Builds indexes from quantized vectors, reducing memory required during indexing.
- **Incremental merges**: Refines quantization codebooks incrementally during merges instead of requiring full rebuilds, reducing computational overhead.
