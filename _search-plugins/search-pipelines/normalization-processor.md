---
layout: default
title: Normalization processor
nav_order: 15
has_children: false
parent: Search processors
grand_parent: Search pipelines
---

# Normalization processor

The `normalization_processor` search phase results processor intercepts the query phase results and normalizes and combines the document scores before passing the documents to the fetch phase. 

## Request fields

The following table lists all available request fields.

Field | Data type | Description
:--- | :--- | :---
`normalization.technique` | String | The technique for normalizing scores. Valid values are `min_max`, `L2`. Optional. Default is `min_max`. <!--TODO: what is the default-->
`combination.technique` | String | The technique for combining scores. Valid values are `harmonic_mean`, `arithmetic_mean`, `geometric_mean`. Optional. Default is `arithmetic_mean`. <!--TODO: what is the default-->
`tag` | String | The processor's identifier. 
`description` | String | A description of the processor. 
`ignore_failure` | Boolean | If `true`, OpenSearch [ignores a failure]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/index/#ignoring-processor-failures) of this processor and continues to run the remaining processors in the search pipeline. Optional. Default is `false`.

## Example 

The following example demonstrates using a search pipeline with a `normalization_processor` processor.

### Creating a search pipeline 

The following request creates a search pipeline with a `rename_field` response processor that renames the field `message` to `notification`:

```json
PUT /_search/pipeline/my_pipeline
{
  "phase_results_processors": [
    {
      "normalization-processor": {
        "normalization": {
            "technique": "min_max"
        },
        "combination": {
            "technique": "arithmetic_mean"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Using a search pipeline

Search for documents in `my_index` without a search pipeline:

```json
GET /my_index/_search
```
{% include copy-curl.html %}

The response contains the field `message`:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}
```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "message" : "This is a public message",
          "visibility" : "public"
        }
      }
    ]
  }
}
```
</details>

To search with a pipeline, specify the pipeline name in the `search_pipeline` query parameter:

```json
GET /my_index/_search?search_pipeline=my_pipeline
```
{% include copy-curl.html %}

The `message` field has been renamed to `notification`:

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
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 0.0,
        "_source" : {
          "visibility" : "public",
          "notification" : "This is a public message"
        }
      }
    ]
  }
}
```
</details>

You can also use the `fields` option to search for specific fields in a document:

```json
POST /my_index/_search?pretty&search_pipeline=my_pipeline
{
    "fields":["visibility", "message"]
}
``` 
{% include copy-curl.html %}

In the response, the field `message` has been renamed to `notification`:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}
```json
{
  "took" : 4,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 1,
      "relation" : "eq"
    },
    "max_score" : 0.0,
    "hits" : [
      {
        "_index" : "my_index",
        "_id" : "1",
        "_score" : 0.0,
        "_source" : {
          "visibility" : "public",
          "notification" : "This is a public message"
        },
        "fields" : {
          "visibility" : [
            "public"
          ],
          "notification" : [
            "This is a public message"
          ]
        }
      }
    ]
  }
}

```
</details>