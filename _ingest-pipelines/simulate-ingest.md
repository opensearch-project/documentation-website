---
layout: default
title: Simulate pipeline
nav_order: 11
redirect_from:
  - /opensearch/rest-api/ingest-apis/simulate-ingest/
  - /api-reference/ingest-apis/simulate-ingest/
---

# Simulate pipeline
**Introduced 1.0**
{: .label .label-purple }

Use the simulate ingest pipeline API operation to run or test the pipeline.

## Path and HTTP methods

The following requests **simulate the latest ingest pipeline created**:

```
GET _ingest/pipeline/_simulate
POST _ingest/pipeline/_simulate
```
{% include copy-curl.html %}

The following requests **simulate a single pipeline based on the pipeline ID**:

```
GET _ingest/pipeline/<pipeline-id>/_simulate
POST _ingest/pipeline/<pipeline-id>/_simulate
```
{% include copy-curl.html %}

## Request body fields

The following table lists the request body fields used to run a pipeline.

Field | Required | Type | Description
:--- | :--- | :--- | :---
`docs` | Required | Array | The documents to be used to test the pipeline.
`pipeline` | Optional | Object | The pipeline to be simulated. If the pipeline identifier is not included, then the response simulates the latest pipeline created.

The `docs` field can include subfields listed in the following table.

Field | Required | Type | Description
:--- | :--- | :--- | :---
`source` | Required | Object | The document's JSON body.
`id` | Optional | String | A unique document identifier. The identifier cannot be used elsewhere in the index.
`index` | Optional | String | The index where the document's transformed data appears.

## Query parameters 

The following table lists the query parameters for running a pipeline. 

Parameter | Type | Description
:--- | :--- | :---
`verbose` | Boolean | Verbose mode. Display data output for each processor in the executed pipeline.

#### Example: Specify a pipeline in the path

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

The request returns the following response:

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

#### Example: Verbose mode

When the previous request is run with the `verbose` parameter set to `true`, the response shows the sequence of transformations for each document. For example, for the document with the ID `1`, the response contains the results of applying each processor in the pipeline in sequence:

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
          "description": "Sets 'graduated' to true",
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

#### Example: Specify a pipeline in the request body

Alternatively, you can specify a pipeline directly in the request body without first creating a pipeline:

```json
POST /_ingest/pipeline/_simulate
{
  "pipeline" :
  {
    "description": "Splits text on whitespace characters",
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

#### Response

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
