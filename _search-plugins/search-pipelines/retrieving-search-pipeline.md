---
layout: default
title: Retrieving search pipelines
nav_order: 25
has_children: false
parent: Search pipelines
grand_parent: Search
---

# Retrieving search pipelines

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
