---
layout: default
title: Optimizing vector storage
nav_order: 60
has_children: true
has_toc: false
redirect_from:
  - /vector-search/optimizing-storage/
---

# Optimizing vector storage

Vector search operations can be memory-intensive, especially when dealing with large-scale vector datasets. OpenSearch provides several optimization techniques to reduce memory usage while maintaining search performance. This section covers different approaches to optimize vector storage and search operations.

## Available optimization techniques

OpenSearch supports the following vector storage optimization methods:

1. **Vector quantization techniques**
   - Byte vectors
   - Lucene scalar quantization
   - Faiss 16-bit scalar quantization
   - Product quantization (PQ)
   - Binary quantization (BQ)

2. **Disk-based vector search**
   - Reduces operational costs for vector workloads
   - Uses binary quantization for compression
   - Provides significant memory savings with minimal impact on search quality

## Choosing an optimization method

The choice of optimization method depends on your specific requirements:

| Method | Best for | Memory Savings | Impact on Search Quality |
|--------|----------|----------------|-------------------------|
| Disk-based search | Low-memory environments | Highest (32x reduction) | Minimal impact with rescoring |
| Vector quantization | Balanced approach | Varies (2x-32x reduction) | Varies by technique |

### When to use disk-based search
- Limited memory environments
- Large-scale vector operations
- When willing to accept slightly increased search latency

### When to use vector quantization
- Need fine-grained control over compression
- Specific accuracy requirements
- Different memory-performance trade-off needs

## Next steps

- Learn about [Vector quantization]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-vector-quantization/) techniques
- Explore [Disk-based vector search]({{site.url}}{{site.baseurl}}/search-plugins/knn/disk-based-vector-search/)
