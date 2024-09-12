---
layout: default
title: Batch ingestion
parent: Offline Batch Ingest APIs
grand_parent: ML Commons APIs
nav_order: 11
---


# Batch ingestion

Use this API to ingest data into your OpenSearch cluster from your files in remote file servers like S3, OpenAI etc. This is usually used together with the [Batch Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/batch-predict/) to ingest the text embedded results from remote LLM models into your KNN cluster for neural search. This API immediately returns a [task ID]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/), while the backend job runs asynchronously in the ml-commons plugin to ingest data offline. 

For information about offline batch prediction to use a remove model batch API, see [Batch Predict]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/batch-predict/).

As of version 2.17, we have only verified the batch ingestion API with SageMaker, Bedrock, and OpenAI.

For instructions on how set up offline batch ingestion, see the following:


## Path and HTTP methods

```json
POST /_plugins/_ml/_batch_ingestion
```

## Prerequisites

Before using the Batch Ingestion API, prepare your data on a file server like S3. For instance, the output of a SageMaker text embedding model batch API is saved in a file at s3://offlinebatch/output/sagemaker_batch.json.out. The data is in JSONL format, with each line representing a text-embedding result. The file's content format is shown below.

```
{"SageMakerOutput":[[-0.017166402,0.055771016,...],[-0.06422759,-0.004301484,...],"content":["this is chapter 1","harry potter"],"id":1}
{"SageMakerOutput":[[-0.017455402,0.023771016,...],[-0.02322759,-0.009101284,...],"content":["this is chapter 2","draco malfoy"],"id":1}
...
...

```

#### Example request of ingesting a single file

When using an S3 file as the source for offline batch ingestion, you must specify the field mapping for the index to indicate where each piece of data is ingested. For example, for a KNN index with fields like id, chapter_embedding, chapter, title_embedding, and title, you need to define the corresponding jsonPath for each. If no jsonPath is provided for a field, that field in the KNN index will be set to null.

```
PUT /my-nlp-index
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "id": {
        "type": "text"
      },
      "chapter_embedding": {
        "type": "knn_vector",
        "dimension": 384,
        "method": {
          "engine": "nmslib",
          "space_type": "cosinesimil",
          "name": "hnsw",
          "parameters": {
            "ef_construction": 512,
            "m": 16
          }
        }
      },
      "chapter": {
        "type": "text"
      },
      "title_embedding": {
        "type": "knn_vector",
        "dimension": 384,
        "method": {
          "engine": "nmslib",
          "space_type": "cosinesimil",
          "name": "hnsw",
          "parameters": {
            "ef_construction": 512,
            "m": 16
          }
        }
      },
      "title": {
        "type": "text"
      }
    }
  }
}
```

You can also specify fields to be ingested directly into your index without making any changes to the source file. For example, in the offline batch ingestion request below, the element with the jsonPath $.id from the source file is ingested directly into the id field of your index. To ingest this data from the S3 file, send the following request to your OpenSearch endpoint.

```json
POST /_plugins/_ml/_batch_ingestion
{
  "index_name": "my-nlp-index",
  "field_map": {
    "chapter": "$.content[0]",
    "title": "$.content[1]",
    "chapter_embedding": "$.SageMakerOutput[0]",
    "title_embedding": "$.SageMakerOutput[1]",
    "_id": "$.id"
  },
  "ingest_fields": ["$.id"],
  "credential": {
    "region": "us-east-1",
    "access_key": "<your access key>",
    "secret_key": "<your secret key>",
    "session_token": "<your session token>"
  },
  "data_source": {
    "type": "s3",
    "source": ["s3://offlinebatch/output/sagemaker_batch.json.out"]
  }
}

```
{% include copy-curl.html %}

The response contains a task ID that you'll use in the next steps:

```json
# expected response
{
  "task_id": "cbsPlpEBMHcagzGbOQOx",
  "task_type": "BATCH_INGEST",
  "status": "CREATED"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Once the ingestion is complete, the task `state` changes to `COMPLETED`.


#### Example request of ingesting multiple files

You can also ingest data from multiple files. The example below ingests data from three OpenAI files. The formats of the OpenAI Batch API input and output files are shown below
##### Input file: 
```
{"custom_id": "request-1", "method": "POST", "url": "/v1/embeddings", "body": {"model": "text-embedding-ada-002", "input": [ "What is the meaning of life?", "The food was delicious and the waiter..."]}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/embeddings", "body": {"model": "text-embedding-ada-002", "input": [ "What is the meaning of work?", "The travel was fantastic and the view..."]}}
{"custom_id": "request-3", "method": "POST", "url": "/v1/embeddings", "body": {"model": "text-embedding-ada-002", "input": [ "What is the meaning of friend?", "The old friend was far away and the time..."]}}
...
```
##### Output file:
```
{"id": "batch_req_ITKQn29igorXCAGp6wzYs5IS", "custom_id": "request-1", "response": {"status_code": 200, "request_id": "10845755592510080d13054c3776aef4", "body": {"object": "list", "data": [{"object": "embedding", "index": 0, "embedding": [0.0044326545, ... ...]}, {"object": "embedding", "index": 1, "embedding": [0.002297497, ... ... ]}], "model": "text-embedding-ada-002", "usage": {"prompt_tokens": 15, "total_tokens": 15}}}, "error": null}
...
...

```

If you have run the Batch API in OpenAI for text embedding and want to ingest the model input, output files, along with some metadata into your index, send the following offline ingestion request to ml-commons. Ensure you use source[file-index] to identify the file's location in the source array in the request body. In the example, source[0] refers to the first file in the data_source.source array, and so on. 

The request below ingests seven fields into your index: five are specified in the field_map section, and two in the ingest_fields. The format follows the pattern sourcefile.jsonPath, indicating the jsonPath for each file. In the field_map, $.body.input[0] is used as the jsonPath to ingest data into the question field from the second file in the source array. In the ingest_fields, it lists all elements from the source files that will be ingested directly into your index.

```
POST /_plugins/_ml/_batch_ingestion
{
  "index_name": "my-nlp-index-openai",
  "field_map": {
    "question": "source[1].$.body.input[0]",
    "answer": "source[1].$.body.input[1]",
    "question_embedding":"source[0].$.response.body.data[0].embedding",
    "answer_embedding":"source[0].$.response.body.data[1].embedding",
    "_id": ["source[0].$.custom_id", "source[1].$.custom_id"]
  },
  "ingest_fields": ["source[2].$.custom_field1", "source[2].$.custom_field2"],
  "credential": {
    "openAI_key": "<you openAI key>"
  },
  "data_source": {
    "type": "openAI",
    "source": ["file-<your output file id>", "file-<your input file id>", "file-<your other file>"]
  }
}
```
{% include copy-curl.html %}

In the request, make sure to define the _id field in the field_map, as it is necessary to map each data entry from the three different files. 

The response contains a task ID that you'll use in the next steps:

```json
# expected response
{
  "task_id": "cbsPlpEBMHcagzGbOQOx",
  "task_type": "BATCH_INGEST",
  "status": "CREATED"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Once the ingestion is complete, the task `state` changes to `COMPLETED`.
