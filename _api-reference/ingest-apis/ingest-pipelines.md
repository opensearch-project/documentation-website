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

Use the create pipeline API operation to create or update pipelines in OpenSearch. Note that the pipeline requires an ingest definition that defines how the processors change the document.

### Path and HTTP method
```json
PUT _ingest/pipeline/<pipeline-id>
```

### Request body fields

The following table lists the request body fields used to create, or update, a pipeline.

Field | Required | Type | Description
:--- | :--- | :--- | :---
`description` | Optional | String | Description of the ingest pipeline. 
`processors` | Required | Array | An ordered list of processors that perform sequential transformations on the documents

### Parameters

The following table lists the parameters used with creating, or updating, a pipeline.

Parameter | Required | Type | Description
:--- | :--- | :--- | :---
`pipeline-id` | Required | String | The unique identifier, or pipeline ID, assigned to the ingest pipeline. A pipeline id is used in API requests to specify which pipeline should be created or modified.  
`cluster_manager_timeout` | Optional | Time | Period to wait for a connection to the cluster manager node. Defaults to 30 seconds.
`timeout` | Optional | Time | Period to wait for a response. Defaults to 30 seconds. 

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

### Example: Specify a pipeline in the path

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
}]
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

### Example: Verbose mode

When the previous request is run with the `verbose` parameter set to `true`, the response shows the sequence of transformations made on each document. For example, for the document with the ID `1`, the response contains the results of applying each processor in the pipeline in turn:

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

### Example: Specify a pipeline in the request body

Alternatively, you can specify a pipeline directly in the request body without creating a pipeline first:

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

## Get information about a pipeline

Use the get ingest pipeline API operation to return information about a pipeline.

### Retrieving information about all pipelines

The following example request returns information about all ingest pipelines:

```json
GET _ingest/pipeline/
```
{% include copy-curl.html %}

### Retrieving information about a specific pipeline

The following example request returns information about a specific pipeline: 

```json
GET _ingest/pipeline/my-pipeline
```
{% include copy-curl.html %}

The response contains the pipeline information:

```json
{
  "my-pipeline": {
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
}
```

## Delete a pipeline

Use the following requests to delete pipelines. 

### Delete a specific pipeline

```json
DELETE /_ingest/pipeline/pipeline-id
```
{% include copy-curl.html %}

### Delete all pipelines

```json
DELETE /_ingest/pipeline/*
```
{% include copy-curl.html %}

To delete all pipelines in a cluster, the asterisk (*) is necessary.

## Create a pipeline on an existing index

_<Do we want to include a section on creating a pipeline on an existing index?>

## Next steps

- Learn more about [ingest processors]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/ingest-processors/)
