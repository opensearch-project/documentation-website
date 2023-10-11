---
layout: default
title: Bedrock connector
has_children: false
nav_order: 63
parent: Connectors
grand_parent: Connecting to remote models 
---

# Bedrock connector

To connect to a model on [Amazon Bedrock](https://aws.amazon.com/bedrock/), you can create a Bedrock connector. The following tutorial illustrates a [multimodal semantic search]({{site.url}}{{site.baseurl}}/search-plugins/neural-multimodal-search/) by text and image using a Bedrock model.

## Prerequisites

Before you start, update cluster settings with the following example configuration:

```json
PUT /_cluster/settings
{
  "persistent": {
    "plugins.ml_commons.native_memory_threshold": 95,
    "plugins.ml_commons.only_run_on_ml_node": false,
    "plugins.ml_commons.allow_registering_model_via_url": true,
    "plugins.ml_commons.model_access_control_enabled": true,
    "plugins.ml_commons.trusted_connector_endpoints_regex": [
      """^https://runtime\.sagemaker\..*[a-z0-9-]\.amazonaws\.com/.*$""",
      """^https://api\.openai\.com/.*$""",
      """^https://api\.cohere\.ai/.*$""",
      """^https://bedrock\..*\.amazonaws.com/.*$"""
    ]
  }
}
```
{% include copy-curl.html %}

The example configuration ensures that you can register and deploy a remote Bedrock model in your OpenSearch cluster. For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/) and [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/).

## Step 1: Register a model group

To register a model group, send the following request:

```json
POST /_plugins/_ml/model_groups/_register
{
 "name": "test_model_group_public",
 "description": "This is a public model group"
}
```
{% include copy-curl.html %}

The response contains the model group ID that you'll use to register a model to this model group:

```json
{
 "model_group_id": "1jriBYsBq7EKuKzZX131",
 "status": "CREATED"
}
```

To learn more about model groups, see [Model access control]({{site.url}}{{site.baseurl}}/ml-commons-plugin/model-access-control/).

## Step 2: Create a Bedrock connector

Create a standalone Bedrock connector by sending the following request:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Bedrock multimodal embedding model",
  "description": "Bedrock multimodal model which supports both text and image embeddings",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "us-east-1",
    "service_name": "bedrock"
  },
  "credential": {
    "access_key": "<REPLACE WITH YOUR BEDROCK ACCESS KEY>", 
    "secret_key": "<REPLACE WITH YOUR BEDROCK SECRET KEY>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock.us-east-1.amazonaws.com/model/amazon.titan-e1m-medium/invoke",
      "headers": {
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{ \"inputText\": \"${parameters.inputText:-null}\", \"inputImage\": \"${parameters.inputImage:-null}\" }",
      "pre_process_function": "\n    StringBuilder parametersBuilder = new StringBuilder(\"{\");\n    if (params.text_docs.length > 0 && params.text_docs[0] != null) {\n      parametersBuilder.append(\"\\\"inputText\\\":\");\n      parametersBuilder.append(\"\\\"\");\n      parametersBuilder.append(params.text_docs[0]);\n      parametersBuilder.append(\"\\\"\");\n      \n      if (params.text_docs.length > 1 && params.text_docs[1] != null) {\n        parametersBuilder.append(\",\");\n      }\n    }\n    \n    \n    if (params.text_docs.length > 1 && params.text_docs[1] != null) {\n      parametersBuilder.append(\"\\\"inputImage\\\":\");\n      parametersBuilder.append(\"\\\"\");\n      parametersBuilder.append(params.text_docs[1]);\n      parametersBuilder.append(\"\\\"\");\n    }\n    parametersBuilder.append(\"}\");\n    \n    return  \"{\" +\"\\\"parameters\\\":\" + parametersBuilder + \"}\";",
      "post_process_function": "\n      def name = \"sentence_embedding\";\n      def dataType = \"FLOAT32\";\n      if (params.embedding == null || params.embedding.length == 0) {\n          return null;\n      }\n      def shape = [params.embedding.length];\n      def json = \"{\" +\n                 \"\\\"name\\\":\\\"\" + name + \"\\\",\" +\n                 \"\\\"data_type\\\":\\\"\" + dataType + \"\\\",\" +\n                 \"\\\"shape\\\":\" + shape + \",\" +\n                 \"\\\"data\\\":\" + params.embedding +\n                 \"}\";\n      return json;\n    "
    }
  ]
}
```
{% include copy-curl.html %}

Note that Bedrock access keys expire in 10--12 hours after creation. To learn more about the parameters in the preceding request, see [Connector blueprints]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/blueprints#configuration-options).

The response contains the connector ID that you'll use to register a model:

```json
{
 "connector_id": "1zrkBYsBq7EKuKzZ6l0c"
}
```

## Step 3: Register the Bedrock model

To register the Bedrock model to the model group created in step 1, provide the model group ID from step 1 and the connector ID from step 2 in the following request:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Bedrock multimodal model",
    "function_name": "remote",
    "model_group_id": "1jriBYsBq7EKuKzZX131",
    "description": "test model",
    "connector_id": "1zrkBYsBq7EKuKzZ6l0c"
}
```
{% include copy-curl.html %}

The response contains the model ID for the Bedrock model that you'll use to deploy the model:

```json
{
 "task_id": "OigeBosB_FItE6OoxHiy",
 "status": "CREATED",
 "model_id": "OygeBosB_FItE6OoyXhj"
}
```

To check the status of the operation, provide the task ID to the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/#searching-for-a-task):

```bash
GET /_plugins/_ml/tasks/OigeBosB_FItE6OoxHiy
```
{% include copy-curl.html %}
 
Once the operation finishes, the status changes to `COMPLETED`.

## Step 4: Deploy the Bedrock model

To deploy the Bedrock model, provide its model ID from step 3 in the following request:

```bash
POST /_plugins/_ml/models/OygeBosB_FItE6OoyXhj/_deploy
```
{% include copy-curl.html %}

The response contains the task ID and that you can use to check the status of the deploy operation. Once the operation finishes, the status changes to `COMPLETED`:

```json
{
 "task_id": "PSgfBosB_FItE6OoYniF",
 "task_type": "DEPLOY_MODEL",
 "status": "COMPLETED"
}
```

## Step 5: Create an ingest pipeline for neural search

To create an ingest pipeline for neural search, send the following request:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "A text/image embedding pipeline",
  "processors": [
    {
      "text_image_embedding": {
        "model_id": "OygeBosB_FItE6OoyXhj",
        "embedding": "vector_embedding",
        "field_map": {
          "text": "image_description",
          "image": "image_binary"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

To learn more about multimodal neural search, see [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/neural-multimodal-search/).

## Step 6: Create a k-NN index

Create a k-NN index with the `dimension` parameter that has the same value as the Bedrock model dimension. Map the `image_description` field as [`text`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/text/) and the `image_binary` field as a base-64 [`binary`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/binary/). Neural search will generate vector embeddings from the data in these two fields and will record the embeddings in the `vector_embedding` field, which must be mapped as a [`knn_vector`]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/knn-vector/):

```json
PUT /my-nlp-index
{
  "settings": {
    "index.knn": true,
    "default_pipeline": "nlp-pipeline",
    "number_of_shards": 2
  },
  "mappings": {
    "properties": {
      "vector_embedding": {
        "type": "knn_vector",
        "dimension": 1024,
        "method": {
          "name": "hnsw",
          "engine": "lucene",
          "parameters": {}
        }
      },
      "image_description": {
        "type": "text"
      },
      "image_binary": {
        "type": "binary"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 7: Ingest data into the index

For this multimodal search, you'll ingest documents containing a text and an image field, for example:

```json
POST /my-nlp-index/_doc/1
{
 "image_description": "A man who is riding a wild horse in the rodeo is very near to falling off",
 "image_binary": "iVBORw0KGgoAAAANSUhE..."
}
```
{% include copy-curl.html %}

In the `image_binary` field, make sure to provide the full base-64 binary string corresponding to the image. 

You can bulk upload documents by using the [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/).

## Step 8: Search using neural search

Use [multimodal neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-multimodal-search/) to search by image and text:

```json
GET /my-nlp-index/_search
{
  "size": 10,
  "query": {
    "neural": {
      "vector_embedding": {
        "query_text": "Wild west",
        "query_image": "4AAQSkZJRgABAQAASABIAA...",
        "model_id": "OygeBosB_FItE6OoyXhj",
        "k": 5
      }
    }
  },
  "_source": {
    "exclude": [
      "vector_embedding"
    ]
  }
}
```
{% include copy-curl.html %}

## Next steps

- Learn more about [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).
- Learn more about [connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/connectors/) hosted on external ML platforms.
- Learn more about [semantic search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search/).
- Learn more about [multimodal neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-multimodal-search/).