---
layout: default
title: Debugging a search pipeline
nav_order: 25
has_children: false
parent: Search pipelines
---


# Debugging a search pipeline

The `verbose_pipeline` parameter provides detailed information about the data flow and transformations for the search request, search response, and search phase processors in the search pipeline. It helps with troubleshooting and optimizing the pipeline and ensures transparency in handling search requests and responses. 

## Enabling debugging

To enable pipeline debugging, specify `verbose_pipeline=true` as a query parameter in your search request. This functionality is available for all three search pipeline methods:

- [Default search pipeline](#default-search-pipeline)
- [Specific search pipeline](#specific-search-pipeline)
- [Temporary search pipeline](#temporary-search-pipeline)

### Default search pipeline

To use `verbose_pipeline` with a default search pipeline, set the pipeline as the default in the index settings and include `verbose_pipeline=true` in the query:

```json
PUT /my_index/_settings
{
  "index.search.default_pipeline": "my_pipeline"
}
```
{% include copy-curl.html %}

```json
GET /my_index/_search?verbose_pipeline=true
```
{% include copy-curl.html %}

For more information about default search pipelines, see [Setting a default pipeline for all requests in an index]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/using-search-pipeline/#default-search-pipeline).

### Specific search pipeline 

To use `verbose_pipeline` with a specific search pipeline, specify the pipeline ID and include `verbose_pipeline=true` in the query:

```json
GET /my_index/_search?search_pipeline=my_pipeline&verbose_pipeline=true
```
{% include copy-curl.html %}

For more information about using specific search pipelines, see [Specifying an existing pipeline for a request]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/using-search-pipeline/#specifying-an-existing-search-pipeline-for-a-request).

### Temporary search pipeline

To use `verbose_pipeline` with a temporary search pipeline, define the pipeline directly in the request body and include `verbose_pipeline=true` in the query:

```json
POST /my_index/_search?verbose_pipeline=true
{
  "query": {
    "match": { "text_field": "some search text" }
  },
  "search_pipeline": {
    "request_processors": [
      {
        "filter_query": {
          "query": { "term": { "visibility": "public" } }
        }
      }
    ],
    "response_processors": [
      {
        "collapse": {
          "field": "category"
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

For more information about using a temporary search pipeline, see [Using a temporary pipeline for a request]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/using-search-pipeline/#using-a-temporary-search-pipeline-for-a-request).

## Example response

When the `verbose_pipeline` parameter is enabled, the response contains an additional `processor_results` field that provides information about the transformations applied by each processor in the pipeline:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
    "took": 27,
    "timed_out": false,
    "_shards": {
        "total": 1,
        "successful": 1,
        "skipped": 0,
        "failed": 0
    },
    "hits": {
        "total": {
            "value": 1,
            "relation": "eq"
        },
        "max_score": 0.18232156,
        "hits": [
            {
                "_index": "my_index",
                "_id": "1",
                "_score": 0.18232156,
                "_source": {
                    "notification": "This is a public message",
                    "visibility": "public"
                }
            }
        ]
    },
    "processor_results": [
        {
            "processor_name": "filter_query",
            "tag": "tag1",
            "duration_millis": 288541,
            "status": "success",
            "input_data": {
                "verbose_pipeline": true,
                "query": {
                    "bool": {
                        "adjust_pure_negative": true,
                        "must": [
                            {
                                "match": {
                                    "message": {
                                        "auto_generate_synonyms_phrase_query": true,
                                        "query": "this",
                                        "zero_terms_query": "NONE",
                                        "fuzzy_transpositions": true,
                                        "boost": 1.0,
                                        "prefix_length": 0,
                                        "operator": "OR",
                                        "lenient": false,
                                        "max_expansions": 50
                                    }
                                }
                            }
                        ],
                        "boost": 1.0
                    }
                }
            },
            "output_data": {
                "verbose_pipeline": true,
                "query": {
                    "bool": {
                        "filter": [
                            {
                                "term": {
                                    "visibility": {
                                        "boost": 1.0,
                                        "value": "public"
                                    }
                                }
                            }
                        ],
                        "adjust_pure_negative": true,
                        "must": [
                            {
                                "bool": {
                                    "adjust_pure_negative": true,
                                    "must": [
                                        {
                                            "match": {
                                                "message": {
                                                    "auto_generate_synonyms_phrase_query": true,
                                                    "query": "this",
                                                    "zero_terms_query": "NONE",
                                                    "fuzzy_transpositions": true,
                                                    "boost": 1.0,
                                                    "prefix_length": 0,
                                                    "operator": "OR",
                                                    "lenient": false,
                                                    "max_expansions": 50
                                                }
                                            }
                                        }
                                    ],
                                    "boost": 1.0
                                }
                            }
                        ],
                        "boost": 1.0
                    }
                }
            }
        },
        {
            "processor_name": "rename_field",
            "duration_millis": 250042,
            "status": "success",
            "input_data": [
                {
                    "_index": "my_index",
                    "_id": "1",
                    "_score": 0.18232156,
                    "_source": {
                        "message": "This is a public message",
                        "visibility": "public"
                    }
                }
            ],
            "output_data": [
                {
                    "_index": "my_index",
                    "_id": "1",
                    "_score": 0.18232156,
                    "_source": {
                        "notification": "This is a public message",
                        "visibility": "public"
                    }
                }
            ]
        }
    ]
}
```
</details>