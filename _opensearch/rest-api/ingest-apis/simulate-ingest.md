---
layout: default
title: Simulate an ingest pipeline
parent: Ingest APIs
grand_parent: REST API reference
nav_order: 13
---

# Simulate a pipeline

Simulates an ingest pipeline with any example documents set you specify.

## Example

```
POST /_ingest/pipeline/{id}/_simulate
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

## Path and HTTP methods

Simulate the last ingest pipeline created

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

Parameter | Type | Description
:--- | :--- | :---
verbose | boolean | Verbose mode. Display data output for each processor in executed pipeline

## Request body fields

Field | Type | Description
:--- | :--- | :---
`pipeline` | object | The pipeline you want to simulate. When included without the pipeline `{id}` inside the request path, the response simulates the last pipeline created
`docs` | array of objects | The documents you want to use to test the pipeline

The `docs` field can include the following subfields:

Field | Type | Description
:--- | :--- | :---
`id` (Optional) | string | An optional identifier for the document. Cannot be used elsewhere in the index
`index` (Optional) | string |The index where the documents transformed data will be stored
`source` | object | The documents JSON body

## Response

### Specify pipeline in request body

```json
{
  "docs" : [
    {
      "doc" : {
        "_index" : "index",
        "_type" : "_doc",
        "_id" : "id",
        "_source" : {
          "location" : "new-new",
          "field2" : "_value"
        },
        "_ingest" : {
          "timestamp" : "2022-02-03T23:12:11.337706671Z"
        }
      }
    },
    {
      "doc" : {
        "_index" : "index",
        "_type" : "_doc",
        "_id" : "id",
        "_source" : {
          "location" : "new-new",
          "field2" : "_value"
        },
        "_ingest" : {
          "timestamp" : "2022-02-03T23:12:11.337721296Z"
        }
      }
    }
  ]
}
```

### Specify pipeline ID inside path

```json
{
  "docs" : [
    {
      "doc" : {
        "_index" : "index",
        "_type" : "_doc",
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
        "_type" : "_doc",
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

With the `verbose` parameter set to `true`, the response shows how each processor transform the specified document. 

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
            "_type" : "_doc",
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
            "_type" : "_doc",
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