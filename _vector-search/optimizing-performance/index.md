---
layout: default
title: Optimizing vector search performance
nav_order: 60
has_children: true
has_toc: false
redirect_from:
  - /vector-search/optimizing-performance/
storage_cards:
  - heading: "Vector quantization"
    description: "Reduce vector storage space by quantizing vectors."
    link: "/vector-search/optimizing-performance/knn-vector-quantization/"
  - heading: "Disk-based vector search"
    description: "Uses binary quantization to reduce operational costs of vector workloads."
    link: "/vector-search/optimizing-performance/disk-based-vector-search/"
performance_cards:
  - heading: "Performance tuning"
    description: "Improve indexing and search performance for approximate k-NN (ANN)."
    link: "/vector-search/optimizing-performance/performance-tuning/"
---

# Optimizing vector search performance

Vector search operations can be resource-intensive, especially when dealing with large-scale vector datasets. OpenSearch provides several optimization techniques to reduce memory usage and enhance search performance. 

## Optimizing vector storage

{% include cards.html cards=page.storage_cards %}

## Optimizing performance

{% include cards.html cards=page.performance_cards %}