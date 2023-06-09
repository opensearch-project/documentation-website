---
layout: default
title: Create or update ingest pipeline
parent: Ingest APIs
nav_order: 10
redirect_from:
  - /opensearch/rest-api/ingest-apis/create-update-ingest/
---

# Create or update a pipeline

Creating an ingest pipeline is a vital step in streamlining your data processing workflow. For example, you can enhance data quality, automate data processing tasks, and ensure your data is prepared and optimized for downstream use. 

Use the following path and HTTP method to create or update pipelines in OpenSearch.

#### Path and HTTP method
```json
PUT _ingest/pipeline/{id}
```

The following is an example of a create pipeline API request: 

```json
PUT _ingest/pipeline/{id}
{
  "description" : "Optional description of the pipeline",
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

Field | Required | Type | Description
:--- | :--- | :--- | :---
`description` | Optional | String | Description of the ingest pipeline. 
`processors` | Required | Array | The processor that performs a transformation on the documents. Processors run sequentially. 

## Path parameters

Path parameters are required.

Parameter | Type | Description
:--- | :--- | :---
`pipeline` | String | The unique identifier, or pipeline id, assigned to the ingest pipeline. A pipeline id is used in API requests to specify which pipeline should be created or modified.  

## Query parameters

Query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`cluster_manager_timeout` | Time | Period to wait for a connection to the cluster manager node. Defaults to 30 seconds.
`timeout` | Time | Period to wait for a response. Defaults to 30 seconds. 

## Next steps

Once you've created or updated a pipeline, use the [get ingest pipeline]({{site.url}}{{site.baseurl}}//api-reference/ingest-apis/get-ingest/) API operation to return all the information about the pipeline.
