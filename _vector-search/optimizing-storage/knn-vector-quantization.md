---
layout: default
title: Vector quantization
parent: Optimizing vector storage
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/knn/knn-vector-quantization/
outside_cards:
  - heading: "Byte vectors"
    description: "Quantize vectors into byte vectors"
    link: "/mappings/supported-field-types/knn-memory-optimized/#byte-vectors"
  - heading: "Binary vectors"
    description: "Quantize vectors into binary vector"
    link: "/mappings/supported-field-types/knn-memory-optimized/#binary-vectors"
inside_cards:
  - heading: "Lucene scalar quantization"
    description: "Use built-in scalar quantization for the Lucene engine"
    link: "/vector-search/optimizing-storage/lucene-scalar-quantization/"
  - heading: "Faiss 16-bit scalar quantization"
    description: "Use built-in scalar quantization for the Faiss engine"
    link: "/vector-search/optimizing-storage/faiss-16-bit-quantization/"
  - heading: "Faiss product quantization"
    description: "Use built-in product quantization for the Faiss engine"
    link: "/vector-search/optimizing-storage/faiss-product-quantization/"
  - heading: "Binary quantization"
    description: "Use built-in binary quantization for the Faiss engine"
    link: "/vector-search/optimizing-storage/binary-quantization/"
---

# Vector quantization

By default, OpenSearch supports the indexing and querying of vectors of type `float`, where each dimension of the vector occupies 4 bytes of memory. For use cases that require ingestion on a large scale, keeping `float` vectors can be expensive because OpenSearch needs to construct, load, save, and search graphs (for the native `faiss` and `nmslib` [deprecated] engines). To reduce the memory footprint, you can use vector quantization.

OpenSearch supports many varieties of quantization. In general, the level of quantization will provide a trade-off between the accuracy of the nearest neighbor search and the size of the memory footprint consumed by the vector search. 

## Quantize vectors outside of OpenSearch

Quantize vectors outside of OpenSearch before ingesting them into an OpenSearch index.

{% include cards.html cards=page.outside_cards %}

## Quantize vectors within OpenSearch

Use OpenSearch built-in quantization to quantize vectors.

{% include cards.html cards=page.inside_cards %}