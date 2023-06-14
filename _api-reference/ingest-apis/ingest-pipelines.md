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

Ingest pipelines in OpenSearch are managed by using ingest API operations. When using ingest in production environments, your cluster should contain at least one node with the node roles permission set to `ingest`. For more information about setting up node roles within a cluster, see [Cluster formation]({{site.url}}{{site.baseurl}}/opensearch/cluster/).

## Create or update an ingest pipeline

Creating an ingest pipeline is a vital step in streamlining your data processing workflow. For example, you can enhance data quality, automate data processing tasks, and ensure your data is prepared and optimized for downstream use. 

Use the create pipeline API operation to create or update pipelines in OpenSearch. Note that the pipeline requires an ingest definition that defines how the processors change the document.

### Path and HTTP method
```json
PUT _ingest/pipeline/pipeline-id
```

### Request body fields

The following table lists the request body fields used to create, or update, a pipeline.

Field | Required | Type | Description
:--- | :--- | :--- | :---
`description` | Optional | String | Description of the ingest pipeline. 
`processors` | Required | Array | The processor that performs a transformation on the documents. Processors run sequentially. 

### Parameters

The following table lists the parameters used with creating, or updating, a pipeline.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`pipeline` | Required | String | The unique identifier, or pipeline id, assigned to the ingest pipeline. A pipeline id is used in API requests to specify which pipeline should be created or modified.  
`cluster_manager_timeout` | Optional | Time | Period to wait for a connection to the cluster manager node. Defaults to 30 seconds.
`timeout` | Optional | Time | Period to wait for a response. Defaults to 30 seconds. 

#### Example request and reponse

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

The request results in the following reponse, which confirms the pipeline was successfully created.

```json
{
  "acknowledged": true
}
```

If the pipeline fails to complete, check _<How do we troubleshoot a pipeline that fails to complete? What examples do we include?>_

## Simulate a pipeline

Run or test a pipeline using the simulate pipeline API operation.

### Path and HTTP methods

The following requests simulate the latest ingest pipeline created.

```
GET _ingest/pipeline/_simulate
POST _ingest/pipeline/_simulate
```

The following requests simulate a single pipeline based on the pipeline identifier.

```
GET _ingest/pipeline/pipeline-id/_simulate
POST _ingest/pipeline/pipeline-id/_simulate
```

### Request body fields

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

### Query parameters 

The following table lists the query parameters for running a pipeline. 

Parameter | Type | Description
:--- | :--- | :---
`verbose` | Boolean | Verbose mode. Display data output for each processor in the executed pipeline.

#### Example request

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

#### Example verbose response 

When the `verbose` parameter is set to `true`, the response shows how the processor transformed the data, that is, the processor results. 

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

Use the following requests to delete pipelines. 

#### Example HTTP methods

**Delete a specific pipeline**

```json
DELETE /_ingest/pipeline/pipeline-id
```
{% include copy-curl.html %}

**Delete all pipelines**

```json
DELETE /_ingest/pipeline/*
```
{% include copy-curl.html %}

To delete all pipelines in a cluster, the asterisk (*) is necessary.

## Create a pipeline on an existing index

_<Do we want to include a section on creating a pipeline on an existing index?>

## Next steps

- Learn more about [ingest processors]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-processors/)
