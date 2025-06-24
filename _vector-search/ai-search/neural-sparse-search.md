---
layout: default
title: Neural sparse search
parent: AI search
nav_order: 50
has_children: true
redirect_from:
  - /search-plugins/neural-sparse-search/
  - /search-plugins/sparse-search/
  - /search-plugins/neural-sparse-search/
canonical_url: https://docs.opensearch.org/docs/latest/vector-search/ai-search/neural-sparse-search/
---

# Neural sparse search
Introduced 2.11
{: .label .label-purple }

[Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) relies on dense retrieval that is based on text embedding models. However, dense methods use k-NN search, which consumes a large amount of memory and CPU resources. An alternative to semantic search, neural sparse search is implemented using an inverted index and is thus as efficient as BM25. Neural sparse search is facilitated by sparse embedding models. When you perform a neural sparse search, it creates a sparse vector (a list of `token: weight` key-value pairs representing an entry and its weight) and ingests data into a rank features index.

To further boost search relevance, you can combine neural sparse search with dense [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) using a [hybrid query]({{site.url}}{{site.baseurl}}/query-dsl/compound/hybrid/).

You can configure neural sparse search in the following ways:

- Generate vector embeddings automatically: Configure an ingest pipeline to generate and store sparse vector embeddings from document text at ingestion time. At query time, input plain text, which will be automatically converted into vector embeddings for search. For complete setup steps, see [Generating sparse vector embeddings automatically]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-with-pipelines/).
- Ingest raw sparse vectors and search using sparse vectors directly. For complete setup steps, see [Neural sparse search using raw vectors]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-with-raw-vectors/).

To learn more about splitting long text into passages for neural sparse search, see [Text chunking]({{site.url}}{{site.baseurl}}/search-plugins/text-chunking/).

## Accelerating neural sparse search

Starting with OpenSearch version 2.15, you can significantly accelerate the search process by creating a search pipeline with a `neural_sparse_two_phase_processor`. 

To create a search pipeline with a two-phase processor for neural sparse search, use the following request: 

```json
PUT /_search/pipeline/two_phase_search_pipeline
{
  "request_processors": [
    {
      "neural_sparse_two_phase_processor": {
        "tag": "neural-sparse",
        "description": "Creates a two-phase processor for neural sparse search."
      }
    }
  ]
}
```
{% include copy-curl.html %}

Then choose the index you want to configure with the search pipeline and set the `index.search.default_pipeline` to the pipeline name, as shown in the following example:

```json
PUT /my-nlp-index/_settings 
{
  "index.search.default_pipeline" : "two_phase_search_pipeline"
}
```
{% include copy-curl.html %}

For information about `two_phase_search_pipeline`, see [Neural sparse query two-phase processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/).

## Text chunking

For information about splitting large documents into smaller passages before generating embeddings, see [Text chunking]({{site.url}}{{site.baseurl}}/vector-search/ingesting-data/text-chunking/).

## Further reading

- Learn more about how sparse encoding models work and explore OpenSearch neural sparse search benchmarks in [Improving document retrieval with sparse semantic encoders](https://opensearch.org/blog/improving-document-retrieval-with-sparse-semantic-encoders/).
- Learn the fundamentals of neural sparse search and its efficiency in [A deep dive into faster semantic sparse retrieval in OpenSearch 2.12](https://opensearch.org/blog/A-deep-dive-into-faster-semantic-sparse-retrieval-in-OS-2.12/).
- Explore our [tutorials]({{site.url}}{{site.baseurl}}/vector-search/tutorials/) to learn how to build AI search applications. 
