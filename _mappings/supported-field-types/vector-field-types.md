---
layout: default
title: Vector field types
nav_order: 90
has_children: true
has_toc: false
parent: Supported field types
redirect_from:
  - /field-types/supported-field-types/vector-field-types/
---

# Vector field types

Vector field types are used for vector search and similarity operations in OpenSearch. The following table lists all vetor field types that OpenSearch supports. 

Field data type | Description
:--- | :---
[`knn_vector`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/knn-vector/) | Indexes a dense vector for k-NN search and vector similarity operations.
[`sparse_vector`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/sparse-vector/) | Indexes a sparse vector for neural sparse ANN search.