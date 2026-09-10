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
canonical_url: https://docs.opensearch.org/latest/vector-search/optimizing-storage/index/
---

# Optimizing vector storage

Vector search operations can be resource intensive, especially when dealing with large-scale vector datasets. OpenSearch provides several optimization techniques for reducing memory usage. 

{% include cards.html cards=page.storage_cards %}