---
layout: default
title: Vector search with MMR reranking
nav_order: 60
parent: Specialized vector search
has_children: false
has_math: true
canonical_url: https://docs.opensearch.org/latest/vector-search/specialized-operations/vector-search-mmr/
---

# Vector search with MMR reranking
**Introduced 3.3**
{: .label .label-purple }

The maximal marginal relevance (MMR) search helps balance relevance and diversity in search results. Instead of returning only the most similar documents, MMR selects results that are both relevant to the query and different from each other. This improves the coverage of the result set and reduces redundancy, which is especially useful in vector search scenarios.

MMR reranking balances two competing objectives:

 - Relevance: How well a document matches the query.

 - Diversity: How different a document is from the documents already selected.

The algorithm computes a score for each candidate document using the following formula:

$$MMR = (1 − \lambda) \times \text{relevance_score} - \lambda \times max(\text{similarity_with_selected_docs})$$,

where:

 - $$\lambda$$ is the diversity parameter (closer to 1 means higher diversity).

 - $$\text{relevance_score}$$ measures similarity between the query vector and the candidate document vector.

 - $$\text{similarity_with_selected_docs}$$ measures similarity between the candidate and already selected documents.

By adjusting $$\lambda$$, you can control the trade-off between highly relevant results and more diverse coverage in the result set.

# Prerequisites

To use MMR, you must enable [system-generated search processor factories]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/system-generated-search-processors/). Set the `cluster.search.enabled_system_generated_factories` setting (by default, an empty list) to `*` (all factories) or explicitly include the required factories:

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

The `mmr` object is provided in the `ext` object of the Search API request body and supports the following parameters.

| Parameter                 | Data type | Required/Optional                                 | Description                                                                                                                                                                                 |
| ------------------------- | --------- | ----------------------------------------- |---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `diversity`               | Float     | Optional                                        | Controls the weight of diversity ($$\lambda$$) in the reranking process. Valid values range from `0` to `1`, inclusive. A value of `1` prioritizes maximum diversity; `0` disables diversity. Default is `0.5`. |
| `candidates`              | Integer   | Optional                                        | The number of candidate documents to retrieve before applying MMR reranking. Default is `3 * size`, where `size` is the query's `size` parameter (the requested number of results to return).                                                                                        |
| `vector_field_path`       | String    | Optional (required for remote indexes) | The path to the vector field used for MMR reranking. If not provided, OpenSearch resolves it automatically from the search request.                                                            |
| `vector_field_data_type`  | String    | Optional (required for remote indexes) | The data type of the vector field. Used to parse the field and calculate similarity. If not provided, OpenSearch resolves it from the index mapping.                                            |
| `vector_field_space_type` | String    | Optional (required for remote indexes) | Used to determine the similarity function for the vector field, such as cosine similarity or Euclidean distance. If not provided, OpenSearch resolves it from the index mapping.               |   


# Example request

The following example shows how to use the `mmr` parameter in a `knn` query:

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

The following example shows how to use the `mmr` parameter in a `neural` query:

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
{% include copy-curl.html %}

When querying multiple indexes, all vector fields must have matching data types and space types. These settings determine the similarity function used for document comparisons.
{: .note}

# Limitations

The following limitations apply to vector search with MMR reranking:

- **Supported query types**: MMR supports only a `knn` or `neural` query as the top-level query in a search request. If a `knn` or `neural` query is nested inside another query type (such as a `bool` query or `hybrid` query), MMR is not supported.

- **Remote index requirements**: When querying remote indexes, you must explicitly provide vector field information (`vector_field_path`, `vector_field_data_type`, and `vector_field_space_type`). Unlike a local index for which OpenSearch can automatically resolve this metadata from the index mapping, the system cannot reliably fetch this information from the remote cluster. Providing these details ensures correct parsing of the vector data and accurate similarity calculations.

## Related documentation

- [System-generated search processors]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/system-generated-search-processors/)