---
layout: default
title: Generating embeddings
parent: Tutorials
nav_order: 5
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/tutorials/generate-embeddings/
---

# Generating embeddings for arrays of objects

This tutorial illustrates how to generate embeddings for arrays of objects.

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Step 1: Register an embedding model

For this tutorial, you will use the [Amazon Bedrock Titan Embedding model](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html). 

First, follow the [Amazon Bedrock Titan blueprint example](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_titan_embedding_blueprint.md) to register and deploy the model. 

Test the model, providing the model ID:

```json
POST /_plugins/_ml/models/your_embedding_model_id/_predict
{
    "parameters": {
        "inputText": "hello world"
    }
}
```
{% include copy-curl.html %}

The response contains inference results:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [ 1536 ],
          "data": [0.7265625, -0.0703125, 0.34765625, ...]
        }
      ],
      "status_code": 200
    }
  ]
}
```

## Step 2: Create an ingest pipeline

Follow the next set of steps to create an ingest pipeline for generating embeddings.

### Step 2.1: Create a k-NN index

First, create a k-NN index:

```json
PUT my_books
{
  "settings" : {
      "index.knn" : "true",
      "default_pipeline": "bedrock_embedding_foreach_pipeline"
  },
  "mappings": {
    "properties": {
      "books": {
        "type": "nested",
        "properties": {
          "title_embedding": {
            "type": "knn_vector",
            "dimension": 1536
          },
          "title": {
            "type": "text"
          },
          "description": {
            "type": "text"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 2.2: Create an ingest pipeline

Then create an inner ingest pipeline to generate an embedding for one array element.

This pipeline contains three processors:

- `set` processor: The `text_embedding` processor is unable to identify the `_ingest._value.title` field. You must copy `_ingest._value.title` to a non-existing temporary field so that the `text_embedding` processor can process it.
- `text_embedding` processor: Converts the value of the temporary field to an embedding.
- `remove` processor: Removes the temporary field.

To create such a pipeline, send the following request:

```json
PUT _ingest/pipeline/bedrock_embedding_pipeline
{
  "processors": [
    {
      "set": {
        "field": "title_tmp",
        "value": "{{_ingest._value.title}}"
      }
    },
    {
      "text_embedding": {
        "model_id": your_embedding_model_id,
        "field_map": {
          "title_tmp": "_ingest._value.title_embedding"
        }
      }
    },
    {
      "remove": {
        "field": "title_tmp"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Create an ingest pipeline with a `foreach` processor that will apply the `bedrock_embedding_pipeline` to each element of the `books` array:

```json
PUT _ingest/pipeline/bedrock_embedding_foreach_pipeline
{
  "description": "Test nested embeddings",
  "processors": [
    {
      "foreach": {
        "field": "books",
        "processor": {
          "pipeline": {
            "name": "bedrock_embedding_pipeline"
          }
        },
        "ignore_failure": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 2.3: Simulate the pipeline

First, you'll test the pipeline on an array that contains two book objects, both with a `title` field:

```json
POST _ingest/pipeline/bedrock_embedding_foreach_pipeline/_simulate
{
  "docs": [
    {
      "_index": "my_books",
      "_id": "1",
      "_source": {
        "books": [
          {
            "title": "first book",
            "description": "This is first book"
          },
          {
            "title": "second book",
            "description": "This is second book"
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response contains generated embeddings for both objects in their `title_embedding` fields:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "my_books",
        "_id": "1",
        "_source": {
          "books": [
            {
              "title": "first book",
              "title_embedding": [-1.1015625, 0.65234375, 0.7578125, ...],
              "description": "This is first book"
            },
            {
              "title": "second book",
              "title_embedding": [-0.65234375, 0.21679688, 0.7265625, ...],
              "description": "This is second book"
            }
          ]
        },
        "_ingest": {
          "_value": null,
          "timestamp": "2024-05-28T16:16:50.538929413Z"
        }
      }
    }
  ]
}
```

Next, you'll test the pipeline on an array that contains two book objects, one with a `title` field and one without:

```json
POST _ingest/pipeline/bedrock_embedding_foreach_pipeline/_simulate
{
  "docs": [
    {
      "_index": "my_books",
      "_id": "1",
      "_source": {
        "books": [
          {
            "title": "first book",
            "description": "This is first book"
          },
          {
            "description": "This is second book"
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}

The response contains generated embeddings for the object that contains the `title` field:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "my_books",
        "_id": "1",
        "_source": {
          "books": [
            {
              "title": "first book",
              "title_embedding": [-1.1015625, 0.65234375, 0.7578125, ...],
              "description": "This is first book"
            },
            {
              "description": "This is second book"
            }
          ]
        },
        "_ingest": {
          "_value": null,
          "timestamp": "2024-05-28T16:19:03.942644042Z"
        }
      }
    }
  ]
}
```
### Step 2.4: Test data ingestion

Ingest one document:

```json
PUT my_books/_doc/1
{
  "books": [
    {
      "title": "first book",
      "description": "This is first book"
    },
    {
      "title": "second book",
      "description": "This is second book"
    }
  ]
}
```
{% include copy-curl.html %}

Get the document:

```json
GET my_books/_doc/1
```
{% include copy-curl.html %}

The response contains the generated embeddings:

```json
{
  "_index": "my_books",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "books": [
      {
        "description": "This is first book",
        "title": "first book",
        "title_embedding": [-1.1015625, 0.65234375, 0.7578125, ...]
      },
      {
        "description": "This is second book",
        "title": "second book",
        "title_embedding": [-0.65234375, 0.21679688, 0.7265625, ...]
      }
    ]
  }
}      
```

You can also ingest several documents in bulk and test the generated embeddings by calling the Get Document API:

```json
POST _bulk
{ "index" : { "_index" : "my_books" } }
{ "books" : [{"title": "first book", "description": "This is first book"}, {"title": "second book", "description": "This is second book"}] }
{ "index" : { "_index" : "my_books" } }
{ "books" : [{"title": "third book", "description": "This is third book"}, {"description": "This is fourth book"}] }
```
{% include copy-curl.html %}