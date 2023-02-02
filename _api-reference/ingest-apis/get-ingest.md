---
layout: default
title: Get ingest pipeline
parent: Ingest APIs
nav_order: 10
---

## Get ingest pipeline

After you create a pipeline, use the get ingest pipeline API operation to return all the information about a specific ingest pipeline.

## Example

```
GET _ingest/pipeline/12345
```
{% include copy-curl.html %}

## Path and HTTP methods

Return all ingest pipelines.

```
GET _ingest/pipeline
```

Returns a single ingest pipeline based on the pipeline's ID.

```
GET _ingest/pipeline/{id}
```

## URL parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | How long to wait for a connection to the master node.

## Response

```json
{
  "pipeline-id" : {
    "description" : "A description for your pipeline",
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