---
layout: default
title: Get pipeline
nav_order: 12
redirect_from:
  - /opensearch/rest-api/ingest-apis/get-ingest/
  - /api-reference/ingest-apis/get-ingest/
---

# Get pipeline
**Introduced 1.0**
{: .label .label-purple }

Use the get ingest pipeline API operation to retrieve all the information about the pipeline.

## Retrieving information about all pipelines

The following example request returns information about all ingest pipelines:

```json
GET _ingest/pipeline/
```
{% include copy-curl.html %}

## Retrieving information about a specific pipeline

The following example request returns information about a specific pipeline, which for this example is `my-pipeline`: 

```json
GET _ingest/pipeline/my-pipeline
```
{% include copy-curl.html %}

The response contains the pipeline information:

```json
{
  "my-pipeline": {
    "description": "This pipeline processes student data",
    "processors": [
      {
        "set": {
          "description": "Sets the graduation year to 2023",
          "field": "grad_year",
          "value": 2023
        }
      },
      {
        "set": {
          "description": "Sets graduated to true",
          "field": "graduated",
          "value": true
        }
      },
      {
        "uppercase": {
          "field": "name"
        }
      }
    ]
  }
}
```
