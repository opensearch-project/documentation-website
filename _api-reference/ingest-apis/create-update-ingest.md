---
layout: default
title: Create or update ingest pipeline
parent: Ingest APIs
nav_order: 10
redirect_from:
  - /opensearch/rest-api/ingest-apis/create-update-ingest/
---

# Create and update a pipeline

The create ingest pipeline API operation creates or updates an ingest pipeline. Each pipeline requires an ingest definition defining how each processor transforms your data. 

The following is an example of a create pipeline API request and response: 

```json
PUT _ingest/pipeline/12345
{
  "description" : "Example pipeline",
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

```json
{
  "acknowledged" : true
}
```

## Path and HTTP methods

```json
PUT _ingest/pipeline/{id}
```

## Request body fields

Field | Type | Description
:--- | :--- | :---
`description` | String | Description of the ingest pipeline. Optional. 
`processors` | Array | The processor that performs an ingest action on the data. Processors run sequentially. Required.

## URL parameters

All URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
master_timeout | time | How long to wait for a connection to the master node.
timeout | time | How long to wait for the request to return. 
