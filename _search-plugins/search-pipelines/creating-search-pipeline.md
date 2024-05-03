---
layout: default
title: Creating a search pipeline
nav_order: 10
has_children: false
parent: Search pipelines
grand_parent: Search
---

# Creating a search pipeline

Search pipelines are stored in the cluster state. To create a search pipeline, you must configure an ordered list of processors in your OpenSearch cluster. You can have more than one processor of the same type in the pipeline. Each processor has a `tag` identifier that distinguishes it from the others. Tagging a specific processor can be helpful when debugging error messages, especially if you add multiple processors of the same type.

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

## Ignoring processor failures

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

If the processor fails, OpenSearch logs the failure and continues to run all remaining processors in the search pipeline. To check whether there were any failures, you can use [search pipeline metrics]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/search-pipeline-metrics/). 

## Updating a search pipeline

To update a search pipeline dynamically, replace the search pipeline using the Search Pipeline API. 

#### Example request

The following example request upserts `my_pipeline` by adding a `filter_query` request processor and a `rename_field` response processor:

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
