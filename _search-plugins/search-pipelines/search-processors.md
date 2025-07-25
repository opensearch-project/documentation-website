---
layout: default
title: Search processors
nav_order: 40
has_children: true
parent: Search pipelines
grand_parent: Search
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/search-processors/
---

# Search processors

Search processors can be of the following types:

- [Search request processors](#search-request-processors)
- [Search response processors](#search-response-processors)
- [Search phase results processors](#search-phase-results-processors)

## Search request processors

A search request processor intercepts a search request (the query and the metadata passed in the request), performs an operation with or on the search request, and submits the search request to the index.

The following table lists all supported search request processors.

Processor | Description | Earliest available version
:--- | :--- | :---
[`filter_query`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/filter-query-processor/) | Adds a filtering query that is used to filter requests. | 2.8
[`ml_inference`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-request/) | Invokes registered machine learning (ML) models in order to rewrite queries. | 2.16 
[`neural_query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) | Sets a default model for neural search and neural sparse search at the index or field level. | 2.11 (neural), 2.13 (neural sparse)
[`neural_sparse_two_phase_processor`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-sparse-query-two-phase-processor/) | Accelerates the neural sparse query. | 2.15
[`oversample`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/oversample-processor/) | Increases the search request `size` parameter, storing the original value in the pipeline state.  | 2.12
[`script`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/script-processor/) | Adds a script that is run on newly indexed documents. | 2.8

## Search response processors

A search response processor intercepts a search response and search request (the query, results, and metadata passed in the request), performs an operation with or on the search response, and returns the search response.

The following table lists all supported search response processors.

Processor | Description | Earliest available version
:--- | :--- | :---
[`collapse`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/collapse-processor/)| Deduplicates search hits based on a field value, similarly to `collapse` in a search request. | 2.12
[`hybrid_score_explanation`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/explanation-processor/)| Adds detailed scoring information to search results when the `explain` parameter is enabled, providing information about score normalization, combination techniques, and individual score calculations in hybrid queries.  | 2.19
[`ml_inference`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-response/) | Invokes registered machine learning (ML) models in order to incorporate model output as additional search response fields. | 2.16 
[`personalize_search_ranking`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/personalize-search-ranking/) | Uses [Amazon Personalize](https://aws.amazon.com/personalize/) to rerank search results (requires setting up the Amazon Personalize service). | 2.9
[`rename_field`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rename-field-processor/)| Renames an existing field. | 2.8
[`rerank`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/)| Reranks search results using a cross-encoder model. | 2.12
[`retrieval_augmented_generation`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rag-processor/) | Used for retrieval-augmented generation (RAG) in [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/). | 2.10 (generally available in 2.12)
[`sort`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/sort-processor/)| Sorts an array of items in either ascending or descending order. | 2.16
[`split`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/split-processor/)| Splits a string field into an array of substrings based on a specified delimiter. | 2.17
[`truncate_hits`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/truncate-hits-processor/)| Discards search hits after a specified target count is reached. Can undo the effect of the `oversample` request processor.  | 2.12


## Search phase results processors

A search phase results processor runs between search phases at the coordinating node level. It intercepts the results retrieved from one search phase and transforms them before passing them to the next search phase.

The following table lists all supported search phase results processors.

Processor | Description | Earliest available version
:--- | :--- | :---
[`normalization-processor`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/normalization-processor/) | Intercepts the query phase results and normalizes and combines the document scores before passing the documents to the fetch phase. | 2.10

## Viewing available processor types

You can use the Nodes Search Pipelines API to view the available processor types:

```json
GET /_nodes/search_pipelines
```
{% include copy-curl.html %}

The response contains the `search_pipelines` object that lists the available request and response processors:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "cluster_name" : "runTask",
  "nodes" : {
    "36FHvCwHT6Srbm2ZniEPhA" : {
      "name" : "runTask-0",
      "transport_address" : "127.0.0.1:9300",
      "host" : "127.0.0.1",
      "ip" : "127.0.0.1",
      "version" : "3.0.0",
      "build_type" : "tar",
      "build_hash" : "unknown",
      "roles" : [
        "cluster_manager",
        "data",
        "ingest",
        "remote_cluster_client"
      ],
      "attributes" : {
        "testattr" : "test",
        "shard_indexing_pressure_enabled" : "true"
      },
      "search_pipelines" : {
        "request_processors" : [
          {
            "type" : "filter_query"
          },
          {
            "type" : "script"
          }
        ],
        "response_processors" : [
          {
            "type" : "rename_field"
          }
        ]
      }
    }
  }
}
```
</details>

In addition to the processors provided by OpenSearch, additional processors may be provided by plugins.
{: .note}

## Selectively enabling processors

Processors defined by the [search-pipeline-common module](https://github.com/opensearch-project/OpenSearch/blob/2.x/modules/search-pipeline-common/src/main/java/org/opensearch/search/pipeline/common/SearchPipelineCommonModulePlugin.java) are selectively enabled through the following cluster settings: `search.pipeline.common.request.processors.allowed`, `search.pipeline.common.response.processors.allowed`, or `search.pipeline.common.search.phase.results.processors.allowed`. If unspecified, then all processors are enabled. An empty list disables all processors. Removing enabled processors causes pipelines using them to fail after a node restart.