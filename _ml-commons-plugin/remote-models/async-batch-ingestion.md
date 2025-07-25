---
layout: default
title: Asynchronous batch ingestion
nav_order: 90
parent: Connecting to externally hosted models 
grand_parent: Integrating ML models
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/remote-models/async-batch-ingestion/
---


# Asynchronous batch ingestion
**Introduced 2.17**
{: .label .label-purple }

[Batch ingestion]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/batch-ingestion/) configures an ingest pipeline, which processes documents one by one. For each document, batch ingestion calls an externally hosted model to generate text embeddings from the document text and then ingests the document, including text and embeddings, into an OpenSearch index.

An alternative to this real-time process, _asynchronous_ batch ingestion, ingests both documents and their embeddings generated outside of OpenSearch and stored on a remote file server, such as Amazon Simple Storage Service (Amazon S3) or OpenAI. Asynchronous ingestion returns a task ID and runs asynchronously to ingest data offline into your k-NN cluster for neural search. You can use asynchronous batch ingestion together with the [Batch Predict API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/model-apis/batch-predict/) to perform inference asynchronously. The batch predict operation takes an input file containing documents and calls an externally hosted model to generate embeddings for those documents in an output file. You can then use asynchronous batch ingestion to ingest both the input file containing documents and the output file containing their embeddings into an OpenSearch index.

As of OpenSearch 2.17, the Asynchronous Batch Ingestion API is supported by Amazon SageMaker, Amazon Bedrock, and OpenAI.
{: .note}

## Prerequisites

Before using asynchronous batch ingestion, you must generate text embeddings using a model of your choice and store the output on a file server, such as Amazon S3. For example, you can store the output of a Batch API call to an Amazon SageMaker text embedding model in a file with the Amazon S3 output path `s3://offlinebatch/output/sagemaker_batch.json.out`. The output is in JSONL format, with each line representing a text embedding result. The file contents have the following format:

```
{"SageMakerOutput":[[-0.017166402,0.055771016,...],[-0.06422759,-0.004301484,...],"content":["this is chapter 1","harry potter"],"id":1}
{"SageMakerOutput":[[-0.017455402,0.023771016,...],[-0.02322759,-0.009101284,...],"content":["this is chapter 2","draco malfoy"],"id":1}
...
```

## Ingesting data from a single file

First, create a k-NN index into which you'll ingest the data. The fields in the k-NN index represent the structure of the data in the source file. 

In this example, the source file holds documents containing titles and chapters, along with their corresponding embeddings. Thus, you'll create a k-NN index with the fields `id`, `chapter_embedding`, `chapter`, `title_embedding`, and `title`:

```json
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
          "engine": "faiss",
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
          "engine": "faiss",
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
{% include copy-curl.html %}

When using an S3 file as the source for asynchronous batch ingestion, you must map the fields in the source file to fields in the index in order to indicate into which index each piece of data is ingested. If no JSON path is provided for a field, that field will be set to `null` in the k-NN index.

In the `field_map`, indicate the location of the data for each field in the source file. You can also specify fields to be ingested directly into your index without making any changes to the source file by adding their JSON paths to the `ingest_fields` array. For example, in the following asynchronous batch ingestion request, the element with the JSON path `$.id` from the source file is ingested directly into the `id` field of your index. To ingest this data from the Amazon S3 file, send the following request to your OpenSearch endpoint:

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

The response contains a task ID for the ingestion task:

```json
{
  "task_id": "cbsPlpEBMHcagzGbOQOx",
  "task_type": "BATCH_INGEST",
  "status": "CREATED"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Once ingestion is complete, the task `state` changes to `COMPLETED`.


## Ingesting data from multiple files

You can also ingest data from multiple files by specifying the file locations in the `source`. The following example ingests data from three OpenAI files. 

The OpenAI Batch API input file is formatted as follows:

```
{"custom_id": "request-1", "method": "POST", "url": "/v1/embeddings", "body": {"model": "text-embedding-ada-002", "input": [ "What is the meaning of life?", "The food was delicious and the waiter..."]}}
{"custom_id": "request-2", "method": "POST", "url": "/v1/embeddings", "body": {"model": "text-embedding-ada-002", "input": [ "What is the meaning of work?", "The travel was fantastic and the view..."]}}
{"custom_id": "request-3", "method": "POST", "url": "/v1/embeddings", "body": {"model": "text-embedding-ada-002", "input": [ "What is the meaning of friend?", "The old friend was far away and the time..."]}}
...
```

The OpenAI Batch API output file is formatted as follows:

```
{"id": "batch_req_ITKQn29igorXCAGp6wzYs5IS", "custom_id": "request-1", "response": {"status_code": 200, "request_id": "10845755592510080d13054c3776aef4", "body": {"object": "list", "data": [{"object": "embedding", "index": 0, "embedding": [0.0044326545, ... ...]}, {"object": "embedding", "index": 1, "embedding": [0.002297497, ... ... ]}], "model": "text-embedding-ada-002", "usage": {"prompt_tokens": 15, "total_tokens": 15}}}, "error": null}
...
```

If you have run the Batch API in OpenAI for text embedding and want to ingest the model input and output files along with some metadata into your index, send the following asynchronous ingestion request. Make sure to use `source[file-index]` to identify the file's location in the source array in the request body. For example, `source[0]` refers to the first file in the `data_source.source` array. 

The following request ingests seven fields into your index: Five are specified in the `field_map` section and two are specified in `ingest_fields`. The format follows the pattern `sourcefile.jsonPath`, indicating the JSON path for each file. In the field_map, `$.body.input[0]` is used as the JSON path to ingest data into the `question` field from the second file in the `source` array. The `ingest_fields` array lists all elements from the `source` files that will be ingested directly into your index:

```json
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

In the request, make sure to define the `_id` field in the `field_map`. This is necessary in order to map each data entry from the three separate files. 

The response contains a task ID for the ingestion task:

```json
{
  "task_id": "cbsPlpEBMHcagzGbOQOx",
  "task_type": "BATCH_INGEST",
  "status": "CREATED"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Once ingestion is complete, the task `state` changes to `COMPLETED`.

For request field descriptions, see [Asynchronous Batch Ingestion API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/async-batch-ingest/).