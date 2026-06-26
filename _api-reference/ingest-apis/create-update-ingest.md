---
layout: default
title: Create or update ingest pipeline
parent: Ingest APIs
nav_order: 11
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/create-ingest/
---

# Create and update a pipeline

The create ingest pipeline API operation creates or updates an ingest pipeline. Each pipeline requires an ingest definition defining how each processor transforms your documents. 

## Example

```
PUT _ingest/pipeline/12345
{
  "description" : "A description for your pipeline",
  "processors" : [
    {
      "set" : {
        "field": "field-name",
        "value": "value"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Path and HTTP methods
```
PUT _ingest/pipeline/{id}
```

## Request body fields

Field | Required | Type | Description
:--- | :--- | :--- | :---
description | Optional | string | Description of your ingest pipeline. 
processors | Required | Array of processor objects | A processor that transforms documents. Runs in the order specified. Appears in index once ran.

```json
{
  "description" : "A description for your pipeline",
  "processors" : [
    {
      "set" : {
        "field": "field-name",
        "value": "value"
      }
    }
  ]
}
```

## URL parameters

All URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | How long to wait for a connection to the master node.
timeout | time | How long to wait for the request to return. 

## Response

```json
{
  "acknowledged" : true
}
```






