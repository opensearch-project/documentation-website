---
layout: default
title: Simulate an ingest pipeline
parent: Ingest APIs
nav_order: 13
redirect_from:
  - /opensearch/rest-api/ingest-apis/simulate-ingest/
---

# Simulate a pipeline

Simulates an ingest pipeline with any example documents you specify.

## Example

```
POST /_ingest/pipeline/35678/_simulate
{
  "docs": [
    {
      "_index": "index",
      "_id": "id",
      "_source": {
        "location": "document-name"
      }
    },
    {
      "_index": "index",
      "_id": "id",
      "_source": {
        "location": "document-name"
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Path and HTTP methods

Simulate the last ingest pipeline created.

```
GET _ingest/pipeline/_simulate
POST _ingest/pipeline/_simulate
```

Simulate a single pipeline based on the pipeline's ID.

```
GET _ingest/pipeline/{id}/_simulate
POST _ingest/pipeline/{id}/_simulate
```

## URL parameters

All URL parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
verbose | boolean | Verbose mode. Display data output for each processor in executed pipeline.

## Request body fields

Field | Required | Type | Description
:--- | :--- | :--- | :---
`pipeline` | Optional | object | The pipeline you want to simulate. When included without the pipeline `{id}` inside the request path, the response simulates the last pipeline created.
`docs` | Required | array of objects | The documents you want to use to test the pipeline.

The `docs` field can include the following subfields:

Field | Required | Type | Description
:--- | :--- | :---
`id` | Optional |string | An optional identifier for the document. The identifier cannot be used elsewhere in the index.
`index` | Optional | string | The index where the document's transformed data appears.
`source` | Required | object | The document's JSON body.

## Response

Responses vary based on which path and HTTP method you choose. 

### Specify pipeline in request body

```json
{
  "docs" : [
    {
      "doc" : {
        "_index" : "index",
        "_id" : "id",
        "_source" : {
          "location" : "new-new",
          "field2" : "_value"
        },
        "_ingest" : {
          "timestamp" : "2022-02-07T18:47:57.479230835Z"
        }
      }
    },
    {
      "doc" : {
        "_index" : "index",
        "_id" : "id",
        "_source" : {
          "location" : "new-new",
          "field2" : "_value"
        },
        "_ingest" : {
          "timestamp" : "2022-02-07T18:47:57.47933496Z"
        }
      }
    }
  ]
}
```

### Specify pipeline ID inside HTTP path

```json
{
  "docs" : [
    {
      "doc" : {
        "_index" : "index",
        "_id" : "id",
        "_source" : {
          "field-name" : "value",
          "location" : "document-name"
        },
        "_ingest" : {
          "timestamp" : "2022-02-03T21:47:05.382744877Z"
        }
      }
    },
    {
      "doc" : {
        "_index" : "index",
        "_id" : "id",
        "_source" : {
          "field-name" : "value",
          "location" : "document-name"
        },
        "_ingest" : {
          "timestamp" : "2022-02-03T21:47:05.382803544Z"
        }
      }
    }
  ]
}
```

### Receive verbose response 

With the `verbose` parameter set to `true`, the response shows how each processor transforms the specified document. 

```json
{
  "docs" : [
    {
      "processor_results" : [
        {
          "processor_type" : "set",
          "status" : "success",
          "doc" : {
            "_index" : "index",
            "_id" : "id",
            "_source" : {
              "field-name" : "value",
              "location" : "document-name"
            },
            "_ingest" : {
              "pipeline" : "35678",
              "timestamp" : "2022-02-03T21:45:09.414049004Z"
            }
          }
        }
      ]
    },
    {
      "processor_results" : [
        {
          "processor_type" : "set",
          "status" : "success",
          "doc" : {
            "_index" : "index",
            "_id" : "id",
            "_source" : {
              "field-name" : "value",
              "location" : "document-name"
            },
            "_ingest" : {
              "pipeline" : "35678",
              "timestamp" : "2022-02-03T21:45:09.414093212Z"
            }
          }
        }
      ]
    }
  ]
}
```