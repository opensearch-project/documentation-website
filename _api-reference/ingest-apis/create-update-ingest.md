---
layout: default
title: Create or update ingest pipeline
parent: Ingest pipelines
grand_parent: Ingest APIs
nav_order: 10
redirect_from:
  - /opensearch/rest-api/ingest-apis/create-update-ingest/
---

# Create or update a pipeline

To create or update an ingest pipeline, you need to use the `PUT` method to the `/_ingest/pipelines` endpoint.

## Path and HTTP methods
```
PUT _ingest/pipeline/{id}
```

## Request body fields

The body of the request must contain the field `processors`. The field `description` is optional. 

Field | Required | Type | Description
:--- | :--- | :--- | :---
`description` | Optional | String | Description of your ingest pipeline. 
`processors` | Required | Array of processor objects | A processor that transforms documents. Runs in the order specified. Appears in index once ran.

The following is a simple example to create an ingest pipeline with one processor, a `set` processor that sets the `name` field to the value of the `user_id` field:

```json
PUT _ingest/pipeline/set-pipeline
{
  "description" : "A simple ingest pipeline",
  "processors" : [
    {
      "set" : {
        "field": "name",
        "value": "user_id"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following response confirms the pipeline was successfully created.

```json
{
  "acknowledged" : true
}
```

See [Handling ingest pipeline failures](<insert-link>) to learn how to handle pipeline failures. 

