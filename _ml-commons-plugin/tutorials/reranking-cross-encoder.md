---
layout: default
title: Reranking with the MS MARCO cross-encoder
parent: Tutorials
nav_order: 35
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/tutorials/reranking-cross-encoder/
---

# Reranking search results using the MS MARCO cross-encoder model

A [reranking pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/) can rerank search results, providing a relevance score for each document in the search results with respect to the search query. The relevance score is calculated by a cross-encoder model. 

This tutorial illustrates how to use the [Hugging Face `ms-marco-MiniLM-L-6-v2` model](https://huggingface.co/cross-encoder/ms-marco-MiniLM-L-6-v2) in a reranking pipeline. 

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisite

Before you start, deploy the model on Amazon SageMaker. For better performance, use a GPU.

Run the following code to deploy the model on [Amazon SageMaker](https://aws.amazon.com/pm/sagemaker):

```python
import sagemaker
import boto3
from sagemaker.huggingface import HuggingFaceModel
sess = sagemaker.Session()
role = sagemaker.get_execution_role()

hub = {
    'HF_MODEL_ID':'cross-encoder/ms-marco-MiniLM-L-6-v2',
    'HF_TASK':'text-classification'
}
huggingface_model = HuggingFaceModel(
    transformers_version='4.37.0',
    pytorch_version='2.1.0',
    py_version='py310',
    env=hub,
    role=role, 
)
predictor = huggingface_model.deploy(
    initial_instance_count=1, # number of instances
    instance_type='ml.m5.xlarge' # ec2 instance type
)
```
{% include copy.html %}

Note the model inference endpoint; you'll use it to create a connector in the next step.

## Step 1: Create a connector and register the model

First, create a connector for the model, providing the inference endpoint and your AWS credentials:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Sagemaker cross-encoder model",
  "description": "Test connector for Sagemaker cross-encoder model",
  "version": 1,
  "protocol": "aws_sigv4",
  "credential": {
    "access_key": "your_access_key",
    "secret_key": "your_secret_key",
    "session_token": "your_session_token"
  },
  "parameters": {
    "region": "your_sagemkaer_model_region_like_us-west-2",
    "service_name": "sagemaker"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "your_sagemaker_model_inference_endpoint_created_in_last_step",
      "headers": {
        "content-type": "application/json"
      },
      "request_body": "{ \"inputs\": ${parameters.inputs} }",
      "pre_process_function": "\n    String escape(def input) { \n       if (input.contains(\"\\\\\")) {\n        input = input.replace(\"\\\\\", \"\\\\\\\\\");\n      }\n      if (input.contains(\"\\\"\")) {\n        input = input.replace(\"\\\"\", \"\\\\\\\"\");\n      }\n      if (input.contains('\r')) {\n        input = input = input.replace('\r', '\\\\r');\n      }\n      if (input.contains(\"\\\\t\")) {\n        input = input.replace(\"\\\\t\", \"\\\\\\\\\\\\t\");\n      }\n      if (input.contains('\n')) {\n        input = input.replace('\n', '\\\\n');\n      }\n      if (input.contains('\b')) {\n        input = input.replace('\b', '\\\\b');\n      }\n      if (input.contains('\f')) {\n        input = input.replace('\f', '\\\\f');\n      }\n      return input;\n    }\n\n   String query = params.query_text;\n   StringBuilder builder = new StringBuilder('[');\n    \n    for (int i=0; i<params.text_docs.length; i ++) {\n      builder.append('{\"text\":\"');\n      builder.append(escape(query));\n      builder.append('\", \"text_pair\":\"');\n      builder.append(escape(params.text_docs[i]));\n      builder.append('\"}');\n      if (i<params.text_docs.length - 1) {\n        builder.append(',');\n      }\n    }\n    builder.append(']');\n    \n    def parameters = '{ \"inputs\": ' + builder + ' }';\n    return  '{\"parameters\": ' + parameters + '}';\n     ",
      "post_process_function": "\n      \n      def dataType = \"FLOAT32\";\n      \n      \n      if (params.result == null)\n      {\n          return 'no result generated';\n          //return params.response;\n      }\n      def outputs = params.result;\n      \n      \n      def resultBuilder = new StringBuilder('[ ');\n      for (int i=0; i<outputs.length; i++) {\n        resultBuilder.append(' {\"name\": \"similarity\", \"data_type\": \"FLOAT32\", \"shape\": [1],');\n        //resultBuilder.append('{\"name\": \"similarity\"}');\n        \n        resultBuilder.append('\"data\": [');\n        resultBuilder.append(outputs[i].score);\n        resultBuilder.append(']}');\n        if (i<outputs.length - 1) {\n          resultBuilder.append(',');\n        }\n      }\n      resultBuilder.append(']');\n      \n      return resultBuilder.toString();\n    "
    }
  ]
}
```
{% include copy-curl.html %}

Next, use the connector ID from the response to register and deploy the model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Sagemaker Cross-Encoder model",
    "function_name": "remote",
    "description": "test rerank model",
    "connector_id": "your_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID in the response; you'll use it in the following steps.

To test the model, call the Predict API:

```json
POST _plugins/_ml/models/your_model_id/_predict
{
  "parameters": {
    "inputs": [
      {
        "text": "I like you",
        "text_pair": "I hate you"
      },
      {
        "text": "I like you",
        "text_pair": "I love you"
      }
    ]
  }
}
```
{% include copy-curl.html %}

Each item in the `inputs` array comprises a `query_text` and a `text_docs` string, separated by a ` . `

Alternatively, you can test the model as follows:

```json
POST _plugins/_ml/_predict/text_similarity/your_model_id
{
  "query_text": "I like you",
  "text_docs": ["I hate you", "I love you"]
}
```
{% include copy-curl.html %}

The connector `pre_process_function` transforms the input into the format required by the `inputs` parameter shown in the previous Predict API request.

By default, the SageMaker model output is in the following format:

```json
[
  {
    "label": "LABEL_0",
    "score": 0.054037678986787796
  },
  {
    "label": "LABEL_0",
    "score": 0.5877784490585327
  }
]
```

The connector `pre_process_function` transforms the model output into the following format that can be interpreted by the [rerank processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/):

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            0.054037678986787796
          ]
        },
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            0.5877784490585327
          ]
        }
      ],
      "status_code": 200
    }
  ]
}
```

The response contains two `similarity` outputs. For each `similarity` output, the `data` array contains a relevance score for each document against the query. The `similarity` outputs are provided in the order of the input documents: The first similarity result pertains to the first document.

## Step 2: Configure a reranking pipeline

Follow these steps to configure a reranking pipeline.

### Step 2.1: Ingest test data

Send a bulk request to ingest test data:

```json
POST _bulk
{ "index": { "_index": "my-test-data" } }
{ "passage_text" : "Carson City is the capital city of the American state of Nevada." }
{ "index": { "_index": "my-test-data" } }
{ "passage_text" : "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan." }
{ "index": { "_index": "my-test-data" } }
{ "passage_text" : "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district." }
{ "index": { "_index": "my-test-data" } }
{ "passage_text" : "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states." }
```
{% include copy-curl.html %}

### Step 2.2: Create a reranking pipeline

Create a reranking pipeline using the MS MARCO cross-encoder model:

```json
PUT /_search/pipeline/rerank_pipeline_sagemaker
{
    "description": "Pipeline for reranking with Sagemaker cross-encoder model",
    "response_processors": [
        {
            "rerank": {
                "ml_opensearch": {
                    "model_id": "your_model_id_created_in_step1"
                },
                "context": {
                    "document_fields": ["passage_text"]
                }
            }
        }
    ]
}
```
{% include copy-curl.html %}

If you provide multiple field names in `document_fields`, then the values of all fields are first concatenated, after which reranking is performed.
{: .note}

### Step 2.3: Test the reranking

To limit the number of returned results, you can specify the `size` parameter. For example, set `"size": 4` to return the top four documents:

```json
GET my-test-data/_search?search_pipeline=rerank_pipeline_sagemaker
{
  "query": {
    "match_all": {}
  },
  "size": 4,
  "ext": {
    "rerank": {
      "query_context": {
         "query_text": "What is the capital of the United States?"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the four most relevant documents:

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 0.9997217,
    "hits": [
      {
        "_index": "my-test-data",
        "_id": "U0xye5AB9ZeWZdmDjWZn",
        "_score": 0.9997217,
        "_source": {
          "passage_text": "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "VExye5AB9ZeWZdmDjWZn",
        "_score": 0.55655104,
        "_source": {
          "passage_text": "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "UUxye5AB9ZeWZdmDjWZn",
        "_score": 0.115356825,
        "_source": {
          "passage_text": "Carson City is the capital city of the American state of Nevada."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "Ukxye5AB9ZeWZdmDjWZn",
        "_score": 0.00021142483,
        "_source": {
          "passage_text": "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan."
        }
      }
    ]
  },
  "profile": {
    "shards": []
  }
}
```

To compare these results to results without reranking, run the search without a reranking pipeline:

```json
GET my-test-data/_search
{
  "query": {
    "match_all": {}
  },
  "ext": {
    "rerank": {
      "query_context": {
         "query_text": "What is the capital of the United States?"
      }
    }
  }
}
```
{% include copy-curl.html %}

The first document in the response pertains to Carson City, which is not the capital of the United States:

```json
{
  "took": 1,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "my-test-data",
        "_id": "UUxye5AB9ZeWZdmDjWZn",
        "_score": 1,
        "_source": {
          "passage_text": "Carson City is the capital city of the American state of Nevada."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "Ukxye5AB9ZeWZdmDjWZn",
        "_score": 1,
        "_source": {
          "passage_text": "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "U0xye5AB9ZeWZdmDjWZn",
        "_score": 1,
        "_source": {
          "passage_text": "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district."
        }
      },
      {
        "_index": "my-test-data",
        "_id": "VExye5AB9ZeWZdmDjWZn",
        "_score": 1,
        "_source": {
          "passage_text": "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
        }
      }
    ]
  }
}
```