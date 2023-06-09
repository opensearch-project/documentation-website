---
layout: default
title: Get ingest pipeline
parent: Ingest APIs
nav_order: 15
redirect_from:
  - /opensearch/rest-api/ingest-apis/get-ingest/
---

# Get ingest pipeline

After creating a pipeline, use the get ingest pipeline API operation to return all the information about the pipeline.

## Examples

The following examples return a specific pipeline or all pipelines.

### Return a specific pipeline

```
GET _ingest/pipeline/pipeline-id
```
{% include copy-curl.html %}

### Return all ingest pipelines

```
GET _ingest/pipeline
```
{% include copy-curl.html %}

#### Example response

```json
{
  "pipeline-id" : {
    "description" : "Example description",
    "processors" : [
      {
        "set" : {
          "field" : "field-name",
          "value" : "value"
        }
      }
    ]
  }
}
```

## Query parameters

Query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | Period to wait for a connection to the cluster manager node. Defaults to 30s.
