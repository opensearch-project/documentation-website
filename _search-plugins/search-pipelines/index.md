---
layout: default
title: Search pipelines
nav_order: 100
has_children: true
has_toc: false
---

# Search pipelines

You can use _search pipelines_ to build new or reuse existing result rerankers, query rewriters, and other components that operate on queries or results. Search pipelines make it easier for you to process search queries and search results within OpenSearch. Moving some of your application functionality into an OpenSearch search pipeline reduces the overall complexity of your application. As part of a search pipeline, you specify a list of processors that perform modular tasks. You can then easily add or reorder these processors to customize search results for your application. 

## Terminology

The following is a list of search pipeline terminology:

* _Search request processor_: A component that takes a search request (the query and the metadata passed in the request), performs an operation with or on the search request, and returns a search request.
* _Search response processor_: A component that takes a search response and search request (the query, results, and metadata passed in the request), performs an operation with or on the search response, and returns a search response.
* _Processor_: Either a search request processor or a search response processor.
* _Search pipeline_: An ordered list of processors that is integrated into OpenSearch. The pipeline intercepts a query, performs processing on the query, sends it to OpenSearch, intercepts the results, performs processing on the results, and returns them to the calling application, as shown in the following diagram. 

![Search processor diagram]({{site.url}}{{site.baseurl}}/images/search-pipelines.png)

Both request and response processing for the pipeline are performed on the coordinator node, so there is no shard-level processing.
{: .note}

## Search request processors

OpenSearch supports the following search request processors:

- [`script`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/script-processor/): Adds a script that is run on newly indexed documents.
- [`filter_query`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/filter-query-processor/): Adds a filtering query that is used to filter requests.

## Search response processors

OpenSearch supports the following search response processors:

- [`rename_field`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rename-field-processor/): Renames an existing field.

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

## Creating a search pipeline

Search pipelines are stored in the cluster state. To create a search pipeline, you must configure an ordered list of processors in your OpenSearch cluster. You can have more than one processor of the same type in the pipeline. Each processor has a `tag` identifier that distinguishes it from the others. Tagging a specific processor can be helpful for debugging error messages, especially if you add multiple processors of the same type.

#### Example request

The following request creates a search pipeline with a `filter_query` request processor that uses a term query to return only public messages and a response processor that renames the field `message` to `notification`:

```json
PUT /_search/pipeline/my_pipeline 
{
  "request_processors": [
    {
      "filter_query" : {
        "tag" : "tag1",
        "description" : "This processor is going to restrict to publicly visible documents",
        "query" : {
          "term": {
            "visibility": "public"
          }
        }
      }
    }
  ],
  "response_processors": [
    {
      "rename_field": {
        "field": "message",
        "target_field": "notification"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Ignoring processor failures

By default, a search pipeline stops if one of its processors fails. If you want the pipeline to continue running when a processor fails, you can set the `ignore_failure` parameter for that processor to `true` when creating the pipeline:

```json
"filter_query" : {
  "tag" : "tag1",
  "description" : "This processor is going to restrict to publicly visible documents",
  "ignore_failure": true,
  "query" : {
    "term": {
      "visibility": "public"
    }
  }
}
```

If the processor fails, OpenSearch logs the failure and continues to run all remaining processors in the search pipeline. To check whether there were any failures, you can use [search pipeline metrics](#search-pipeline-metrics). 

## Using a temporary search pipeline for a request

As an alternative to creating a search pipeline, you can define a temporary search pipeline to be used for only the current query:

```json
POST /my-index/_search
{
  "query" : {
    "match" : {
      "text_field" : "some search text"
    }
  },
  "pipeline" : {
    "request_processors": [
      {
        "filter_query" : {
          "tag" : "tag1",
          "description" : "This processor is going to restrict to publicly visible documents",
          "query" : {
            "term": {
              "visibility": "public"
            }
          }
        }
      }
    ],
    "response_processors": [
      {
        "rename_field": {
          "field": "message",
          "target_field": "notification"
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

With this syntax, the pipeline does not persist and is used only for the query for which it is specified.

## Retrieving search pipelines

To retrieve the details of an existing search pipeline, use the Search Pipeline API. 

To view all search pipelines, use the following request:

```json
GET /_search/pipeline
```
{% include copy-curl.html %}

The response contains the pipeline that you set up in the previous section:
<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "my_pipeline" : {
    "request_processors" : [
      {
        "filter_query" : {
          "tag" : "tag1",
          "description" : "This processor is going to restrict to publicly visible documents",
          "query" : {
            "term" : {
              "visibility" : "public"
            }
          }
        }
      }
    ]
  }
}
```
</details>

To view a particular pipeline, specify the pipeline name as a path parameter:

```json
GET /_search/pipeline/my_pipeline
```
{% include copy-curl.html %}

You can also use wildcard patterns to view a subset of pipelines, for example:

```json
GET /_search/pipeline/my*
```
{% include copy-curl.html %}


## Using a search pipeline

To use a pipeline with a query, specify the pipeline name in the `search_pipeline` query parameter:

```json
GET /my_index/_search?search_pipeline=my_pipeline
```
{% include copy-curl.html %}

For a complete example of using a search pipeline with a `filter_query` processor, see [`filter_query` processor example]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/filter-query-processor#example).

## Default search pipeline

For convenience, you can set a default search pipeline for an index. Once your index has a default pipeline, you don't need to specify the `search_pipeline` query parameter in every search request.

### Setting a default search pipeline for an index

To set a default search pipeline for an index, specify the `index.search.default_pipeline` in the index's settings:

```json
PUT /my_index/_settings 
{
  "index.search.default_pipeline" : "my_pipeline"
}
```
{% include copy-curl.html %}

After setting the default pipeline for `my_index`, you can try the same search for all documents:

```json
GET /my_index/_search
```
{% include copy-curl.html %}

The response contains only the public document, indicating that the pipeline was applied by default:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "took" : 19,
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
          "message" : "This is a public message",
          "visibility" : "public"
        }
      }
    ]
  }
}
```
</details>

### Disabling the default pipeline for a request

If you want to run a search request without applying the default pipeline, you can set the `search_pipeline` query parameter to `_none`:

```json
GET /my_index/_search?search_pipeline=_none
```
{% include copy-curl.html %}

### Removing the default pipeline

To remove the default pipeline from an index, set it to `null` or `_none`:

```json
PUT /my_index/_settings 
{
  "index.search.default_pipeline" : null
}
```
{% include copy-curl.html %}

```json
PUT /my_index/_settings 
{
  "index.search.default_pipeline" : "_none"
}
```
{% include copy-curl.html %}

## Updating a search pipeline

To update a search pipeline dynamically, replace the search pipeline using the Search Pipeline API. 

#### Example request

The following request upserts `my_pipeline` by adding a `filter_query` request processor and a `rename_field` response processor:

```json
PUT /_search/pipeline/my_pipeline
{
  "request_processors": [
    {
      "filter_query": {
        "tag": "tag1",
        "description": "This processor returns only publicly visible documents",
        "query": {
          "term": {
            "visibility": "public"
          }
        }
      }
    }
  ],
  "response_processors": [
    {
      "rename_field": {
        "field": "message",
        "target_field": "notification"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Search pipeline versions

When creating your pipeline, you can specify a version for it in the `version` parameter:

```json
PUT _search/pipeline/my_pipeline
{
  "version": 1234,
  "request_processors": [
    {
      "script": {
        "source": """
           if (ctx._source['size'] > 100) {
             ctx._source['explain'] = false;
           }
         """
      }
    }
  ]
}
```
{% include copy-curl.html %}

The version is provided in all subsequent responses to `get pipeline` requests:

```json
GET _search/pipeline/my_pipeline
```

The response contains the pipeline version:

<details open markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "my_pipeline": {
    "version": 1234,
    "request_processors": [
      {
        "script": {
          "source": """
           if (ctx._source['size'] > 100) {
             ctx._source['explain'] = false;
           }
         """
        }
      }
    ]
  }
}
```
</details>

## Search pipeline metrics

To view search pipeline metrics, use the [Nodes Stats API]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/):

```json
GET /_nodes/stats/search_pipeline
```
{% include copy-curl.html %}

The response contains statistics for all search pipelines:

```json
{
  "_nodes" : {
    "total" : 1,
    "successful" : 1,
    "failed" : 0
  },
  "cluster_name" : "runTask",
  "nodes" : {
    "CpvTK7KuRD6Oww8TTp8g2Q" : {
      "timestamp" : 1689007282929,
      "name" : "runTask-0",
      "transport_address" : "127.0.0.1:9300",
      "host" : "127.0.0.1",
      "ip" : "127.0.0.1:9300",
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
      "search_pipeline" : {
        "total_request" : {
          "count" : 5,
          "time_in_millis" : 158,
          "current" : 0,
          "failed" : 0
        },
        "total_response" : {
          "count" : 2,
          "time_in_millis" : 1,
          "current" : 0,
          "failed" : 0
        },
        "pipelines" : {
          "public_info" : {
            "request" : {
              "count" : 3,
              "time_in_millis" : 71,
              "current" : 0,
              "failed" : 0
            },
            "response" : {
              "count" : 0,
              "time_in_millis" : 0,
              "current" : 0,
              "failed" : 0
            },
            "request_processors" : [
              {
                "filter_query:abc" : {
                  "type" : "filter_query",
                  "stats" : {
                    "count" : 1,
                    "time_in_millis" : 0,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              },
              {
                "filter_query" : {
                  "type" : "filter_query",
                  "stats" : {
                    "count" : 4,
                    "time_in_millis" : 2,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              }
            ],
            "response_processors" : [ ]
          },
          "guest_pipeline" : {
            "request" : {
              "count" : 2,
              "time_in_millis" : 87,
              "current" : 0,
              "failed" : 0
            },
            "response" : {
              "count" : 2,
              "time_in_millis" : 1,
              "current" : 0,
              "failed" : 0
            },
            "request_processors" : [
              {
                "script" : {
                  "type" : "script",
                  "stats" : {
                    "count" : 2,
                    "time_in_millis" : 86,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              },
              {
                "filter_query:abc" : {
                  "type" : "filter_query",
                  "stats" : {
                    "count" : 1,
                    "time_in_millis" : 0,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              },
              {
                "filter_query" : {
                  "type" : "filter_query",
                  "stats" : {
                    "count" : 3,
                    "time_in_millis" : 0,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              }
            ],
            "response_processors" : [
              {
                "rename_field" : {
                  "type" : "rename_field",
                  "stats" : {
                    "count" : 2,
                    "time_in_millis" : 1,
                    "current" : 0,
                    "failed" : 0
                  }
                }
              }
            ]
          }
        }
      }
    }
  }
}
```

For descriptions of each field in the response, see the [Nodes Stats search pipeline section]({{site.url}}{{site.baseurl}}/api-reference/nodes-apis/nodes-stats/#search_pipeline). 