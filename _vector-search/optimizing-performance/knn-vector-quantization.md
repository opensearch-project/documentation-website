---
layout: default
title: Vector quantization
parent: Optimizing vector search performance
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /search-plugins/knn/knn-vector-quantization/
outside_cards:
  - heading: "Byte vectors"
    description: "Quantize vectors outside of OpenSearch before ingesting them into an OpenSearch index."
    link: "/field-types/supported-field-types/knn-vector#byte-vectors"
inside_cards:
  - heading: "Lucene scalar quantization"
    description: "Use built-in scalar quantization for the Lucene engine."
    link: "/vector-search/optimizing-performance/lucene-scalar-quantization/"
  - heading: "Faiss 16-bit scalar quantization"
    description: "Use built-in scalar quantization for the Faiss engine."
    link: "/vector-search/optimizing-performance/faiss-16-bit-quantization/"
  - heading: "Faiss product quantization"
    description: "Use built-in product quantization for the Faiss engine."
    link: "/vector-search/optimizing-performance/faiss-product-quantization/"
  - heading: "Binary quantization"
    description: "Use built-in binary quantization for the Faiss engine."
    link: "/vector-search/optimizing-performance/binary-quantization/"
---

# Vector quantization

By default, OpenSearch supports the indexing and querying of vectors of type `float`, where each dimension of the vector occupies 4 bytes of memory. For use cases that require ingestion on a large scale, keeping `float` vectors can be expensive because OpenSearch needs to construct, load, save, and search graphs (for native `nmslib` and `faiss` engines). To reduce the memory footprint, you can use vector quantization.

OpenSearch supports many varieties of quantization. In general, the level of quantization will provide a trade-off between the accuracy of the nearest neighbor search and the size of the memory footprint consumed by the vector search. 

## Quantize vectors outside of OpenSearch

{% include cards.html cards=page.outside_cards %}

## Quantize vectors within OpenSearch

{% include cards.html cards=page.inside_cards %}