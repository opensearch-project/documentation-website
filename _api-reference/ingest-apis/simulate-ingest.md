---
layout: default
title: Simulate an ingest pipeline
parent: Ingest APIs
nav_order: 20
redirect_from:
  - /opensearch/rest-api/ingest-apis/simulate-ingest/
---

# Simulate a pipeline

The simulate pipeline API runs a pipeline against a set of documents.

```
POST /_ingest/pipeline/pipeline-id/_simulate
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

## Example requests

Requests to simulate the latest ingest pipeline created:

```
GET _ingest/pipeline/_simulate
POST _ingest/pipeline/_simulate
```

Requests to simulate a single pipeline based on the pipeline identifier.

```
GET _ingest/pipeline/pipeline-id/_simulate
POST _ingest/pipeline/pipeline-id/_simulate
```

## Path parameters

Parameter | Type | Description
:--- | :--- | :---
`pipeline` | String | Pipeline identifier or wildcard expression of pipeline identifiers used to limit the request. 

## Query parameters 

Query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`verbose` | Boolean | Verbose mode. Display data output for each processor in the executed pipeline.

## Request body fields

Field | Type | Description
:--- | :--- | :---
`pipeline` | Object | The pipeline to be simulated. If the pipeline identifier is not included, then the response simulates the latest pipeline created. Optional.
`docs` | Array | The documents to be used to test the pipeline. Required.

The `docs` field can include the following subfields:

Field | Type | Description
:--- | :--- | :---
`id` | String | A unique identifier for a document. The identifier cannot be used elsewhere in the index. Optional.
`index` | String | The index where the document's transformed data appears. Optional.
`source` | Object | The document's JSON body. Required.

## Example response

Responses vary based on the path and HTTP method you choose. 

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

### Specify pipeline identifier in an HTTP path

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

### Receive a verbose response 

When the `verbose` parameter is set to `true`, the response shows the prcoessor results, that is, how the processor transformed the data. 

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
