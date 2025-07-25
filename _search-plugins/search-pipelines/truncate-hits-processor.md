---
layout: default
title: Truncate hits
nav_order: 150
has_children: false
parent: Search processors
grand_parent: Search pipelines
canonical_url: https://docs.opensearch.org/latest/search-plugins/search-pipelines/truncate-hits-processor/
---

# Truncate hits processor
Introduced 2.12
{: .label .label-purple }

The `truncate_hits` response processor discards returned search hits after a given hit count is reached. The `truncate_hits` processor is designed to work with the [`oversample` request processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/oversample-processor/) but may be used on its own.

The `target_size` parameter (which specifies where to truncate) is optional. If it is not specified, then OpenSearch uses the `original_size` variable set by the
`oversample` processor (if available).

The following is a common usage pattern:

1. Add the `oversample` processor to a request pipeline to fetch a larger set of results.
1. In the response pipeline, apply a reranking processor (which may promote results from beyond the originally requested top N) or the `collapse` processor (which may discard results after deduplication).
1. Apply the `truncate` processor to return (at most) the originally requested number of hits.

## Request body fields

The following table lists all request fields.

Field | Data type | Description
:--- | :--- | :---
`target_size` | Integer | The maximum number of search hits to return (>=0). If not specified, the processor will try to read the `original_size` variable and will fail if it is not available. Optional.
`context_prefix` | String | May be used to read the `original_size` variable from a specific scope in order to avoid collisions. Optional.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.
`ignore_failure` | Boolean | If `true`, OpenSearch [ignores any failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

## Example

The following example demonstrates using a search pipeline with a `truncate` processor.

### Setup

Create an index named `my_index` containing many documents:

```json
POST /_bulk
{ "create":{"_index":"my_index","_id":1}}
{ "doc": { "title" : "document 1" }}
{ "create":{"_index":"my_index","_id":2}}
{ "doc": { "title" : "document 2" }}
{ "create":{"_index":"my_index","_id":3}}
{ "doc": { "title" : "document 3" }}
{ "create":{"_index":"my_index","_id":4}}
{ "doc": { "title" : "document 4" }}
{ "create":{"_index":"my_index","_id":5}}
{ "doc": { "title" : "document 5" }}
{ "create":{"_index":"my_index","_id":6}}
{ "doc": { "title" : "document 6" }}
{ "create":{"_index":"my_index","_id":7}}
{ "doc": { "title" : "document 7" }}
{ "create":{"_index":"my_index","_id":8}}
{ "doc": { "title" : "document 8" }}
{ "create":{"_index":"my_index","_id":9}}
{ "doc": { "title" : "document 9" }}
{ "create":{"_index":"my_index","_id":10}}
{ "doc": { "title" : "document 10" }}
```
{% include copy-curl.html %}

### Creating a search pipeline

The following request creates a search pipeline named `my_pipeline` with a `truncate_hits` response processor that discards hits after the first five:

```json
PUT /_search/pipeline/my_pipeline 
{
  "response_processors": [
    {
      "truncate_hits" : {
        "tag" : "truncate_1",
        "description" : "This processor will discard results after the first 5.",
        "target_size" : 5
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

Search for documents in `my_index` without a search pipeline:

```json
POST /my_index/_search
{
  "size": 8
}
```
{% include copy-curl.html %}

The response contains eight hits:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took" : 13,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 1"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 2"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 3"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "4",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 4"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "5",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 5"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "6",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 6"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "7",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 7"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "8",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 8"
          }
        }
      }
    ]
  }
}
```
</details>

To search with a pipeline, specify the pipeline name in the `search_pipeline` query parameter:

```json
POST /my_index/_search?search_pipeline=my_pipeline
{
  "size": 8
}
```
{% include copy-curl.html %}

The response contains only 5 hits, even though 8 were requested and 10 were available:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took" : 3,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 1"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 2"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 3"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "4",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 4"
          }
        }
      },
      {
        "_index" : "my_index",
        "_id" : "5",
        "_score" : 1.0,
        "_source" : {
          "doc" : {
            "title" : "document 5"
          }
        }
      }
    ]
  }
}
```
</details>

## Oversample, collapse, and truncate hits

The following is a more realistic example in which you use `oversample` to request many candidate documents, use `collapse` to remove documents that duplicate a particular field (to get more diverse results), and then use `truncate` to return the originally requested document count (to avoid returning a large result payload from the cluster).


### Setup

Create many documents containing a field that you'll use for collapsing:

```json
POST /_bulk
{ "create":{"_index":"my_index","_id":1}}
{ "title" : "document 1", "color":"blue" }
{ "create":{"_index":"my_index","_id":2}}
{ "title" : "document 2", "color":"blue" }
{ "create":{"_index":"my_index","_id":3}}
{ "title" : "document 3", "color":"red" }
{ "create":{"_index":"my_index","_id":4}}
{ "title" : "document 4", "color":"red" }
{ "create":{"_index":"my_index","_id":5}}
{ "title" : "document 5", "color":"yellow" }
{ "create":{"_index":"my_index","_id":6}}
{ "title" : "document 6", "color":"yellow" }
{ "create":{"_index":"my_index","_id":7}}
{ "title" : "document 7", "color":"orange" }
{ "create":{"_index":"my_index","_id":8}}
{ "title" : "document 8", "color":"orange" }
{ "create":{"_index":"my_index","_id":9}}
{ "title" : "document 9", "color":"green" }
{ "create":{"_index":"my_index","_id":10}}
{ "title" : "document 10", "color":"green" }
``` 
{% include copy-curl.html %}

Create a pipeline that collapses only on the `color` field:

```json
PUT /_search/pipeline/collapse_pipeline
{
  "response_processors": [
    {
      "collapse" : {
        "field": "color"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Create another pipeline that oversamples, collapses, and then truncates results:

```json
PUT /_search/pipeline/oversampling_collapse_pipeline
{
  "request_processors": [
    {
      "oversample": {
        "sample_factor": 3
      }
    }
  ],
  "response_processors": [
    {
      "collapse" : {
        "field": "color"
      }
    },
    {
      "truncate_hits": {
        "description": "Truncates back to the original size before oversample increased it."
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Collapse without oversample

In this example, you request the top three documents before collapsing on the `color` field. Because the first two documents have the same `color`, the second one is discarded, and the request returns the first and third documents:

```json
POST /my_index/_search?search_pipeline=collapse_pipeline
{
  "size": 3
}
```
{% include copy-curl.html %}


<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "title" : "document 1",
          "color" : "blue"
        }
      },
      {
        "_index" : "my_index",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "title" : "document 3",
          "color" : "red"
        }
      }
    ]
  },
  "profile" : {
    "shards" : [ ]
  }
}
```
</details>


### Oversample, collapse, and truncate

Now you will use the `oversampling_collapse_pipeline`, which requests the top 9 documents (multiplying the size by 3), deduplicates by `color`, and then returns the top 3 hits:

```json
POST /my_index/_search?search_pipeline=oversampling_collapse_pipeline
{
  "size": 3
}
```
{% include copy-curl.html %}


<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took" : 2,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 10,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "title" : "document 1",
          "color" : "blue"
        }
      },
      {
        "_index" : "my_index",
        "_id" : "3",
        "_score" : 1.0,
        "_source" : {
          "title" : "document 3",
          "color" : "red"
        }
      },
      {
        "_index" : "my_index",
        "_id" : "5",
        "_score" : 1.0,
        "_source" : {
          "title" : "document 5",
          "color" : "yellow"
        }
      }
    ]
  },
  "profile" : {
    "shards" : [ ]
  }
}
```
</details>


