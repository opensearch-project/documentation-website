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

## Processors

To learn more about available search processors, see [Search processors]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-processors/).

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

## Using search pipelines

To use a pipeline with a query, specify the pipeline name in the `search_pipeline` query parameter:

```json
GET /my_index/_search?search_pipeline=my_pipeline
```
{% include copy-curl.html %}

Alternatively, you can use a temporary pipeline with a request or set a default pipeline for an index. To learn more, see [Using a search pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/using-search-pipeline/).

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

For information about retrieving search pipeline statistics, see [Search pipeline metrics]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-pipeline-metrics/).