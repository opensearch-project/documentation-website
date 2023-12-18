---
layout: default
title: Oversample
nav_order: 17
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Oversample processor

The `oversample` request processor multiplies the `size` parameter of the search request by a specified `sample_factor` (>= 1.0), saving the 
original value in the `original_size` pipeline variable. The `oversample` processor is designed to work with the 
[`truncate_hits` response processor]({{site.url}}{{site.baseurl}}/search-plugins/truncate-hits-processor/) but may be used on its own.

## Request fields

The following table lists all request fields.

Field | Data type | Description
:--- | :--- | :---
`sample_factor` | Float | The multiplicative factor (>= 1.0) that will be applied to the `size` parameter before processing the search request. Required.
`context_prefix` | String | May be used to scope the `original_size` variable in order to avoid collisions. Optional.
`tag` | String | The processor's identifier. Optional.
`description` | String | A description of the processor. Optional.
`ignore_failure` | Boolean | If `true`, OpenSearch [ignores any failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/creating-search-pipeline/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.


## Example

The following example demonstrates using a search pipeline with an `oversample` processor.

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

The following request creates a search pipeline named `my_pipeline` with an `oversample` request processor that requests 50% more hits than specified in `size`:

```json
PUT /_search/pipeline/my_pipeline 
{
  "request_processors": [
    {
      "oversample" : {
        "tag" : "oversample_1",
        "description" : "This processor will multiply `size` by 1.5.",
        "sample_factor" : 1.5
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
  "size": 5
}
```
{% include copy-curl.html %}

The response contains five hits:

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

To search with a pipeline, specify the pipeline name in the `search_pipeline` query parameter:

```json
POST /my_index/_search?search_pipeline=my_pipeline
{
  "size": 5
}
```
{% include copy-curl.html %}

The response contains 8 documents (5 * 1.5 = 7.5, rounded up to 8):

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
