---
layout: default
title: Vector search with MMR
nav_order: 60
parent: Specialized vector search
has_children: false
has_math: true
---

# Vector search with MMR

The maximal marginal relevance (MMR) search helps balance relevance and diversity in search results. Instead of returning only the most similar documents, MMR selects results that are both relevant to the query and different from each other. This improves the coverage of the result set and reduces redundancy, which is especially useful in vector search scenarios.

MMR re-ranking balances two competing objectives:

 - Relevance: How well a document matches the query.

 - Diversity: How different a document is from the documents already selected.

The algorithm computes a score for each candidate document using the following principle:

```json
MMR = (1 − λ) * relevance_score − λ * max(similarity_with_selected_docs)
```

Where:

 - λ is the diversity parameter (closer to 1 means higher diversity).

 - relevance_score measures similarity between the query vector and the candidate document vector.

 - similarity_with_selected_docs measures similarity between the candidate and already selected documents.

By adjusting the diversity parameter, you can control the tradeoff between highly relevant results and more diverse coverage in the result set.

# Prerequisites

To use MMR, you must enable [system-generated search processor factories]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/system-generated-search-processors/). Set the `cluster.search.enabled_system_generated_factories` setting (by default it is an empty list) to either `*` or explicitly include the required factories:

```json
PUT _cluster/settings
{
  "persistent": {
    "cluster.search.enabled_system_generated_factories": [
      "mmr_over_sample_factory",
      "mmr_rerank_factory"
    ]
  }
}
```
{% include copy-curl.html %}

# Parameters

The mmr extension in the search API supports the following parameters:

| Parameter                 | Data type | Required                                  | Description                                                                                                                                                                                 |
| ------------------------- | --------- | ----------------------------------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `diversity`               | float     | No                                        | Controls the weight of diversity in the re-ranking process. Valid values range from `0` to `1`. A value of `1` prioritizes maximum diversity, and `0` disables diversity. Default is `0.5`. |
| `candidates`              | integer   | No                                        | Specifies how many candidate documents to oversample before re-ranking. Default is `3 * query size`.                                                                                        |
| `vector_field_path`       | string    | Optional, but required for remote indices | Path to the vector field used for MMR re-ranking. If not provided, OpenSearch resolves it automatically from the search request.                                                            |
| `vector_field_data_type`  | string    | Optional, but required for remote indices | Data type of the vector field. Used to parse the field and calculate similarity. If not provided, OpenSearch resolves it from the index mapping.                                            |
| `vector_field_space_type` | string    | Optional, but required for remote indices | Used to decide the similarity function for the vector field, such as cosine similarity or Euclidean distance. If not provided, OpenSearch resolves it from the index mapping.               |   


# Example request

The following example shows how to use the mmr extension with a k-NN query:

```json
POST /my-index/_search
{
  "query": {
    "knn": {
      "my_vector_field": {
        "vector": [0.12, 0.54, 0.91],
        "k": 10
      }
    }
  },
  "ext": {
    "mmr": {
      "diversity": 0.7
    }
  }
}

```
{% include copy-curl.html %}

The following example shows how to use the mmr extension with a neural query:
```json
POST /my-index/_search
{
  "query": {
    "neural": {
      "my_vector_field": {
        "query_text": "query text",
        "model_id": "<your model id>"
      }
    }
  },
  "ext": {
    "mmr": {
      "diversity": 0.6,
      "candidates": 50,
      "vector_field_path": "my_vector_field",
      "vector_field_data_type": "float",
      "vector_field_space_type": "l2"
    }
  }
}
```

When querying across multiple indices, ensure that the data type, and space type are aligned. Since that info decides the similarity function we use to calculate the similarity between docs.
{: .note}

# Limitations

## MMR Query Type Restriction:
MMR currently only supports knn or neural queries as the top-level query in a search request. If knn or neural is nested inside another query type (such as a bool query or hybrid query), MMR is not supported.

## Required Explicit Vector Field Details
You must explicitly provide the vector field details—`vector_field_path, vector_field_data_type, and vector_field_space_type`—when querying remote indices.

Reason: Unlike a local index where OpenSearch can automatically resolve this metadata from the index mapping, the system cannot reliably fetch this information from the remote cluster. Providing these details ensures correct parsing of the vector data and accurate similarity calculations.