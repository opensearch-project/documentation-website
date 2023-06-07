---
layout: default
title: Create or update ingest pipeline
parent: Ingest APIs
nav_order: 10
redirect_from:
  - /opensearch/rest-api/ingest-apis/create-update-ingest/
---

# Create or update a pipeline

The create ingest pipeline API operation creates or updates an ingest pipeline. Each pipeline requires an ingest definition defining how each processor transforms your data. 

The following is an example of a create pipeline API request: 

```json
PUT _ingest/pipeline/my-pipeline-id
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

## Request body fields

Field | Type | Description
:--- | :--- | :---
`description` | String | Description of the ingest pipeline. Optional. 
`processors` | Array | The processor that performs an ingest action on the data. Processors run sequentially. Required.

## Path parameters

Path parameters are required.

Parameter | Type | Description
:--- | :--- | :---
`pipeline` | String | Pipeline ID or wildcard expression of pipeline IDs used to limit the request. 

## Query parameters

Query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
master_timeout | Time | Period to wait for a connection to the primary node. Defaults to #s.
timeout | Time | Period to wait for a response. Defaults to #s. 

## Next steps

Once you've created or updated a pipeline, use the [get ingest pipeline]({{site.url}}{{site.baseurl}}//api-reference/ingest-apis/get-ingest/) API operation to return all the information about the pipeline.
