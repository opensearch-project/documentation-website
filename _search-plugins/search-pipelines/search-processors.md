---
layout: default
title: Search processors
nav_order: 50
has_children: true
parent: Search pipelines
grand_parent: Search
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/search-processors/
---

# Search processors

Search processors can be of the following types:

- [Search request processors](#search-request-processors)
- [Search response processors](#search-response-processors)

## Search request processors

The following table lists all supported search request processors.

Processor | Description | Earliest available version
:--- | :--- | :---
[`script`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/script-processor/) | Adds a script that is run on newly indexed documents. | 2.8
[`filter_query`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/filter-query-processor/) | Adds a filtering query that is used to filter requests. | 2.8

## Search response processors

The following table lists all supported search response processors.

Processor | Description | Earliest available version
:--- | :--- | :---
[`rename_field`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rename-field-processor/)| Renames an existing field. | 2.8
[`personalize_search_ranking`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/personalize-search-ranking/) | Uses [Amazon Personalize](https://aws.amazon.com/personalize/) to rerank search results (requires setting up the Amazon Personalize service). | 2.9

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
