---
layout: default
title: Ingest pipelines
parent: Ingest APIs
nav_order: 10
redirect_from:
  - /opensearch/rest-api/ingest-apis/create-update-ingest/
  - /api-reference/ingest-apis/create-update-ingest/
  - /api-reference/ingest-apis/get-ingest/
  - /api-reference/ingest-apis/simulate-ingest/
  - /api-reference/ingest-apis/delete-ingest/
---

# Ingest pipelines

Ingest pipelines in OpenSearch can only be managed using ingest API operations. When using ingest in production environments, your cluster should contain at least one node with the node roles permission set to `ingest`. For more information about setting up node roles within a cluster, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).

To get started, open **Dev Tools**. From the console, you can create, update, test, and delete your pipelines.

## Create or update an ingest pipeline

Creating an ingest pipeline is a vital step in streamlining your data processing workflow. For example, you can enhance data quality, automate data processing tasks, and ensure your data is prepared and optimized for downstream use. Use create pipeline API to create or update pipelines in OpenSearch.

### Path and HTTP method
```json
PUT _ingest/pipeline/pipeline-id
```

The following is an example request to create a pipeline. 

```json
PUT _ingest/pipeline/pipeline-id
{
  "description": "Optional pipeline description",
  "processors": [
    {
      "set": {
        "description": "Optional processor description",
        "field": "my-long-field",
        "value": 10
      }
    },
    {
      "set": {
        "description": "Set 'my-boolean-field' to true",
        "field": "my-boolean-field",
        "value": true
      }
    },
    {
      "lowercase": {
        "field": "my-keyword-field"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The request results in the following reponse.

```json
{
  "acknowledged": true
}
```

### Request body fields

Field | Required | Type | Description
:--- | :--- | :--- | :---
`description` | Optional | String | Description of the ingest pipeline. 
`processors` | Required | Array | The processor that performs a transformation on the documents. Processors run sequentially. 

### Parameters

Path parameters are required, and query parameters are optional.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`pipeline` | Required | String | The unique identifier, or pipeline id, assigned to the ingest pipeline. A pipeline id is used in API requests to specify which pipeline should be created or modified.  
`cluster_manager_timeout` | Optional | Time | Period to wait for a connection to the cluster manager node. Defaults to 30 seconds.
`timeout` | Optional | Time | Period to wait for a response. Defaults to 30 seconds. 


## Simulate a pipeline

Test or validate your pipeline using the simulate pipeline API.

### Path and HTTP method

The following request simulate the latest ingest pipeline created.

```
GET _ingest/pipeline/_simulate
POST _ingest/pipeline/_simulate
```

The following request simulate a single pipeline based on the pipeline identifier.

```
GET _ingest/pipeline/pipeline-id/_simulate
POST _ingest/pipeline/pipeline-id/_simulate
```

The following is an example request.

```json
POST _ingest/pipeline/my-pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "my-keyword-field": "LET"
      }
    },
    {
      "_source": {
        "my-keyword-field": "GO"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The request returns the following response.

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "my-keyword-field": "let",
          "my-long-field": 10,
          "my-boolean-field": true
        },
        "_ingest": {
          "timestamp": "2023-06-09T22:52:24.829853388Z"
        }
      }
    },
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "my-keyword-field": "go",
          "my-long-field": 10,
          "my-boolean-field": true
        },
        "_ingest": {
          "timestamp": "2023-06-09T22:52:24.82991768Z"
        }
      }
    }
  ]
}
```

### Query parameters 

Query parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`verbose` | Boolean | Verbose mode. Display data output for each processor in the executed pipeline.

### Request body fields

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

## 

### Receive a verbose response 

When the `verbose` parameter is set to `true`, the response shows the processor results, that is, how the processor transformed the data. 

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


## Get information about a pipeline

Use the get ingest pipeline API operation to return information about a pipeline.

## Path and HTTP methods

The following example request returns information about a specific pipeline. 

```json
GET _ingest/pipeline/pipeline-id
```
{% include copy-curl.html %}

The following example request returns information about all ingest pipelines.

```
GET _ingest/pipeline
```
{% include copy-curl.html %}

The following is an example response.

```json
{
  "pipeline-id" : {
    "description" : "Optional description of the pipeline",
    "processors" : [
      {
        "set" : {
          "field" : "field-name",
          "value" : "value"
        }
      }
    ]
  }
}
```

## Delete a pipeline

