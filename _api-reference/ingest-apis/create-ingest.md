---
layout: default
title: Create pipeline
parent: Ingest pipelines
grand_parent: Ingest APIs
nav_order: 10
redirect_from:
  - /opensearch/rest-api/ingest-apis/create-update-ingest/
---

# Create pipeline

Use the create pipeline API operation to create or update pipelines in OpenSearch. Note that the pipeline requires an ingest definition that defines how the processors change the document. 

## Path and HTTP method

To create, or update, an ingest pipeline, you need to use the `PUT` method to the `/_ingest/pipelines` endpoint. Replace `<pipeline-id>` with your pipeline ID.

```json
PUT _ingest/pipeline/<pipeline-id>
```

Here is an example in JSON format that creates an ingest pipeline with using `set` and `uppercase` processors. The `set` processor sets the value of the `grad_year` field to the value of `2023` and the `graduated` field to the value of `true`. The `uppercase` processor converts the `name` field to capital letters.

#### Example request

```json
PUT _ingest/pipeline/my-pipeline
{
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
```
{% include copy-curl.html %}

If a pipeline fails or results in an error, see [Handling pipelines failures]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/pipeline-failures/) to learn more.
{: .note}

## Request body fields

The following table lists the request body fields used to create, or update, a pipeline. The body of the request must contain the field `processors`. The field `description` is optional. 

Field | Required | Type | Description
:--- | :--- | :--- | :---
`processors` | Required | Array of processor objects | A processor that transforms documents. Runs in the order specified. Appears in index once ran.
`description` | Optional | String | Description of your ingest pipeline. 

## Path parameters

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`pipeline-id` | Required | String | The unique identifier, or pipeline ID, assigned to the ingest pipeline. A pipeline id is used in API requests to specify which pipeline should be created or modified.

## Query parameters

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`cluster_manager_timeout` | Optional | Time | Period to wait for a connection to the cluster manager node. Defaults to 30 seconds.
`timeout` | Optional | Time | Period to wait for a response. Defaults to 30 seconds. 

## Template snippets

Some processor parameters support [Mustache](https://mustache.github.io/) template snippets. To get the value of a field, surround the field name in three curly braces, for example, {{{field-name}}}.

#### Example: `set` ingest processor using Mustache template snippet

```json
PUT _ingest/pipeline/my-pipeline
{
  "processors": [
    {
      "set": {
        "description": "Sets the grad_year field to 2023 value",
        "field": "{{{grad_year}}}",
        "value": "{{{2023}}}"
         }
    },
    {
      "set": {
        "description": "Sets graduated to true",
        "field": "{{{graduated}}}",
        "value": "{{{true}}}"
      }
    },
    {
      "uppercase": {
        "field": "name"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Next steps

- [Retrieve information about a pipeline]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/get-ingest/)
