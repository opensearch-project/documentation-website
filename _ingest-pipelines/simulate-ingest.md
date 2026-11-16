---
layout: default
title: Simulate pipeline
nav_order: 11
redirect_from:
  - /opensearch/rest-api/ingest-apis/simulate-ingest/
  - /api-reference/ingest-apis/simulate-ingest/
---

# Simulate Pipeline API
**Introduced 1.0**
{: .label .label-purple }

The Simulate Pipeline API runs an ingest pipeline against a set of sample documents and returns the transformed documents without indexing them. Use it to test a pipeline before you apply it to your data. You can simulate an existing pipeline or provide a pipeline definition in the request body.

## Endpoints

```json
GET  /_ingest/pipeline/_simulate
POST /_ingest/pipeline/_simulate
GET  /_ingest/pipeline/{pipeline-id}/_simulate
POST /_ingest/pipeline/{pipeline-id}/_simulate
```

## Path parameters

The following table lists the available path parameters. All path parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`pipeline-id` | String | The ID of an existing pipeline to simulate. If not specified, provide the pipeline definition in the `pipeline` request body field.

## Query parameters

The following table lists the available query parameters. All query parameters are optional.

Parameter | Data type | Description
:--- | :--- | :---
`verbose` | Boolean | If `true`, the response contains the result of each processor in the pipeline, including the document after each processor runs. Default is `false`.

## Request body fields

The following table lists the available request body fields.

Field | Data type | Description
:--- | :--- | :---
`docs` | Array of objects | The documents to run through the pipeline. Required.
`pipeline` | Object | The definition of the pipeline to simulate. Contains the same fields as the [Create or Update Pipeline API]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#request-body-fields) request body. Required if the pipeline ID is not specified in the path.

Each object in the `docs` array contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`_source` | Object | The document's JSON body. Required.
`_id` | String | The document ID. Processors can read and modify the ID using the `_id` metadata field. Optional.
`_index` | String | The index name. Processors can read and modify the index name using the `_index` metadata field. Optional.

## Example: Simulating an existing pipeline

The following request runs two documents through the `my-pipeline` pipeline created in the [Create or Update Pipeline API example]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#example-request):

```json
POST /_ingest/pipeline/my-pipeline/_simulate
{
  "docs": [
    {
      "_index": "my-index",
      "_id": "1",
      "_source": {
        "grad_year": 2024,
        "graduated": false,
        "name": "John Doe"
      }
    },
    {
      "_index": "my-index",
      "_id": "2",
      "_source": {
        "grad_year": 2025,
        "graduated": false,
        "name": "Jane Doe"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response contains each document after the pipeline processed it:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "my-index",
        "_id": "1",
        "_source": {
          "name": "JOHN DOE",
          "grad_year": 2023,
          "graduated": true
        },
        "_ingest": {
          "timestamp": "2023-06-20T23:19:54.635306588Z"
        }
      }
    },
    {
      "doc": {
        "_index": "my-index",
        "_id": "2",
        "_source": {
          "name": "JANE DOE",
          "grad_year": 2023,
          "graduated": true
        },
        "_ingest": {
          "timestamp": "2023-06-20T23:19:54.635746046Z"
        }
      }
    }
  ]
}
```

## Example: Viewing the result of each processor

To view the document after each processor runs, set the `verbose` query parameter to `true`:

```json
POST /_ingest/pipeline/my-pipeline/_simulate?verbose=true
{
  "docs": [
    {
      "_index": "my-index",
      "_id": "1",
      "_source": {
        "grad_year": 2024,
        "graduated": false,
        "name": "John Doe"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response contains the results of applying each processor in the pipeline in sequence:

```json
{
  "docs": [
    {
      "processor_results": [
        {
          "processor_type": "set",
          "status": "success",
          "description": "Sets the graduation year to 2023",
          "doc": {
            "_index": "my-index",
            "_id": "1",
            "_source": {
              "name": "John Doe",
              "grad_year": 2023,
              "graduated": false
            },
            "_ingest": {
              "pipeline": "my-pipeline",
              "timestamp": "2023-06-20T23:23:26.656564631Z"
            }
          }
        },
        {
          "processor_type": "set",
          "status": "success",
          "description": "Sets graduated to true",
          "doc": {
            "_index": "my-index",
            "_id": "1",
            "_source": {
              "name": "John Doe",
              "grad_year": 2023,
              "graduated": true
            },
            "_ingest": {
              "pipeline": "my-pipeline",
              "timestamp": "2023-06-20T23:23:26.656564631Z"
            }
          }
        },
        {
          "processor_type": "uppercase",
          "status": "success",
          "doc": {
            "_index": "my-index",
            "_id": "1",
            "_source": {
              "name": "JOHN DOE",
              "grad_year": 2023,
              "graduated": true
            },
            "_ingest": {
              "pipeline": "my-pipeline",
              "timestamp": "2023-06-20T23:23:26.656564631Z"
            }
          }
        }
      ]
    }
  ]
}
```

## Example: Simulating a pipeline defined in the request body

To test a pipeline without creating it, provide the pipeline definition in the request body:

```json
POST /_ingest/pipeline/_simulate
{
  "pipeline" :
  {
    "description": "Splits comma-separated text into fields",
    "processors": [
      {
        "csv" : {
          "field" : "name",
          "separator": ",",
          "target_fields": ["last_name", "first_name"],
          "trim": true
        }
      },
      {
      "uppercase": {
        "field": "last_name"
      }
    }
    ]
  },
  "docs": [
    {
      "_index": "second-index",
      "_id": "1",
      "_source": {
        "name": "Doe,John"
      }
    },
    {
      "_index": "second-index",
      "_id": "2",
      "_source": {
        "name": "Doe, Jane"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The request returns the following response:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "second-index",
        "_id": "1",
        "_source": {
          "name": "Doe,John",
          "last_name": "DOE",
          "first_name": "John"
        },
        "_ingest": {
          "timestamp": "2023-08-24T19:20:44.816219673Z"
        }
      }
    },
    {
      "doc": {
        "_index": "second-index",
        "_id": "2",
        "_source": {
          "name": "Doe, Jane",
          "last_name": "DOE",
          "first_name": "Jane"
        },
        "_ingest": {
          "timestamp": "2023-08-24T19:20:44.816492381Z"
        }
      }
    }
  ]
}
```

## Response body fields

The response contains the `docs` array, with one object for each document in the request, in the same order as the request. If a processor dropped a document, the array contains `null` for that document. Each object in the array contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`doc` | Object | The document after the pipeline processed it, including its `_index`, `_id`, `_source`, and `_ingest` metadata. Returned when `verbose` is `false` and the document was processed successfully.
`error` | Object | The error that caused the pipeline to fail for this document. Returned if processing failed. In this case, `doc` isn't returned.
`processor_results` | Array of objects | The result of each processor, in the order in which the processors ran. Returned only when `verbose` is `true`.

Each object in the `processor_results` array contains the following fields.

Field | Data type | Description
:--- | :--- | :---
`processor_type` | String | The processor type, for example, `set`.
`status` | String | The processor result. Valid values are `success`, `error` (the processor failed; if it defines `on_failure`, the results of the `on_failure` processors follow), `error_ignored` (the processor failed and `ignore_failure` is `true`), `skipped` (the processor's `if` condition returned `false`), and `dropped` (the processor dropped the document).
`description` | String | The processor description. Returned only if the processor has a description.
`tag` | String | The processor tag. Returned only if the processor has a tag.
`if` | Object | The processor's `if` condition (`condition`) and its result (`result`). Returned only if the processor has a condition.
`doc` | Object | The document after this processor ran.
`error` | Object | The error returned by the processor. Returned if the status is `error`.
`ignored_error` | Object | The error that the processor ignored. Returned if the status is `error_ignored`.

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `cluster:admin/ingest/pipeline/simulate`.
