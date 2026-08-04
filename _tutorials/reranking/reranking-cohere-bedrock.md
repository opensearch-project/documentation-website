---
layout: default
title: Reranking search results using Cohere Rerank on Amazon Bedrock
parent: Reranking search results
nav_order: 95
redirect_from:
  - /vector-search/tutorials/reranking/reranking-cohere-bedrock/
canonical_url: https://docs.opensearch.org/latest/tutorials/reranking/reranking-cohere-bedrock/
---

# Reranking search results using Cohere Rerank on Amazon Bedrock

This tutorial shows you how to implement search result reranking in [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/) and self-managed OpenSearch using the [Cohere Rerank model](https://docs.aws.amazon.com/bedrock/latest/userguide/rerank-supported.html) hosted on Amazon Bedrock.

A [reranking pipeline]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/reranking-search-results/) can rerank search results, providing a relevance score for each document in the search results with respect to the search query. The relevance score is calculated by a cross-encoder model. 

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisites: Test the model on Amazon Bedrock

Before using your model, test it on Amazon Bedrock using the following code:

```python
import json
import boto3
bedrock_region = "your_bedrock_model_region_like_us-west-2"
bedrock_runtime_client = boto3.client("bedrock-runtime", region_name=bedrock_region)

modelId = "cohere.rerank-v3-5:0"
contentType = "application/json"
accept = "*/*"

body = json.dumps({
    "query": "What is the capital city of America?",
    "documents": [
        "Carson City is the capital city of the American state of Nevada.",
        "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan.",
        "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district.",
        "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
    ],
    "api_version": 2
})

response = bedrock_runtime_client.invoke_model(
    modelId=modelId,
    contentType=contentType,
    accept=accept, 
    body=body
)
results = json.loads(response.get('body').read())["results"]
print(json.dumps(results, indent=2))
```
{% include copy.html %}

The response contains the reranking results ordered by relevance score:

```json
[
  {
    "index": 2,
    "relevance_score": 0.7190094
  },
  {
    "index": 0,
    "relevance_score": 0.32418242
  },
  {
    "index": 1,
    "relevance_score": 0.07456104
  },
  {
    "index": 3,
    "relevance_score": 0.06124987
  }
]
```

To sort the results by index, use the following code:

```python
print(json.dumps(sorted(results, key=lambda x: x['index']), indent=2))
```
{% include copy.html %}

The sorted results are as follows:

```json
[
  {
    "index": 0,
    "relevance_score": 0.32418242
  },
  {
    "index": 1,
    "relevance_score": 0.07456104
  },
  {
    "index": 2,
    "relevance_score": 0.7190094
  },
  {
    "index": 3,
    "relevance_score": 0.06124987
  }
]
```

## Step 1: Create a connector and register the model

To create a connector for the model, send the following request. 

If you are using self-managed OpenSearch, supply your AWS credentials:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock Cohere rerank model",
  "description": "Test connector for Amazon Bedrock Cohere rerank model",
  "version": 1,
  "protocol": "aws_sigv4",
  "credential": {
    "access_key": "your_access_key",
    "secret_key": "your_secret_key",
    "session_token": "your_session_token"
  },
  "parameters": {
    "service_name": "bedrock",
    "endpoint": "bedrock-runtime",
    "region": "your_bedrock_model_region_like_us-west-2",
    "model_name": "cohere.rerank-v3-5:0",
    "api_version": 2
  },
  "actions": [
    {
      "action_type": "PREDICT",
      "method": "POST",
      "url": "https://${parameters. endpoint}.${parameters.region}.amazonaws.com/model/${parameters.model_name}/invoke",
      "headers": {
        "x-amz-content-sha256": "required",
        "content-type": "application/json"
      },
      "pre_process_function": """
        def query_text = params.query_text;
        def text_docs = params.text_docs;
        def textDocsBuilder = new StringBuilder('[');
        for (int i=0; i<text_docs.length; i++) {
          textDocsBuilder.append('"');
          textDocsBuilder.append(text_docs[i]);
          textDocsBuilder.append('"');
          if (i<text_docs.length - 1) {
            textDocsBuilder.append(',');
          }
        }
        textDocsBuilder.append(']');
        def parameters = '{ "query": "' + query_text + '",  "documents": ' + textDocsBuilder.toString() + ' }';
        return  '{"parameters": ' + parameters + '}';
        """,
      "request_body": """
        { 
          "documents": ${parameters.documents},
          "query": "${parameters.query}",
          "api_version": ${parameters.api_version}
        }
        """,
      "post_process_function": """
        if (params.results == null || params.results.length == 0) {
          throw new IllegalArgumentException("Post process function input is empty.");
        }
        def outputs = params.results;
        def relevance_scores = new Double[outputs.length];
        for (int i=0; i<outputs.length; i++) {
          def index = new BigDecimal(outputs[i].index.toString()).intValue();
          relevance_scores[index] = outputs[i].relevance_score;
        }
        def resultBuilder = new StringBuilder('[');
        for (int i=0; i<relevance_scores.length; i++) {
          resultBuilder.append(' {"name": "similarity", "data_type": "FLOAT32", "shape": [1],');
          resultBuilder.append('"data": [');
          resultBuilder.append(relevance_scores[i]);
          resultBuilder.append(']}');
          if (i<outputs.length - 1) {
            resultBuilder.append(',');
          }
        }
        resultBuilder.append(']');
        return resultBuilder.toString();
      """
    }
  ]
}
```
{% include copy-curl.html %}

If you are using Amazon OpenSearch Service, you can provide an AWS Identity and Access Management (IAM) role Amazon Resource Name (ARN) that allows access to Amazon Bedrock:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "Amazon Bedrock Cohere rerank model",
  "description": "Test connector for Amazon Bedrock Cohere rerank model",
  "version": 1,
  "protocol": "aws_sigv4",
  "credential": {
    "roleArn": "your_role_arn_which_allows_access_to_bedrock_model"
  },
  "parameters": {
    "service_name": "bedrock",
    "endpoint": "bedrock-runtime",
    "region": "your_bedrock_model_region_like_us-west-2",
    "model_name": "cohere.rerank-v3-5:0",
    "api_version": 2
},
  "actions": [
    {
      "action_type": "PREDICT",
      "method": "POST",
      "url": "https://${parameters. endpoint}.${parameters.region}.amazonaws.com/model/${parameters.model_name}/invoke",
      "headers": {
        "x-amz-content-sha256": "required",
        "content-type": "application/json"
      },
      "pre_process_function": """
        def query_text = params.query_text;
        def text_docs = params.text_docs;
        def textDocsBuilder = new StringBuilder('[');
        for (int i=0; i<text_docs.length; i++) {
          textDocsBuilder.append('"');
          textDocsBuilder.append(text_docs[i]);
          textDocsBuilder.append('"');
          if (i<text_docs.length - 1) {
            textDocsBuilder.append(',');
          }
        }
        textDocsBuilder.append(']');
        def parameters = '{ "query": "' + query_text + '",  "documents": ' + textDocsBuilder.toString() + ' }';
        return  '{"parameters": ' + parameters + '}';
        """,
      "request_body": """
        { 
          "documents": ${parameters.documents},
          "query": "${parameters.query}",
          "api_version": ${parameters.api_version}
        }
        """,
      "post_process_function": """
        if (params.results == null || params.results.length == 0) {
          throw new IllegalArgumentException("Post process function input is empty.");
        }
        def outputs = params.results;
        def relevance_scores = new Double[outputs.length];
        for (int i=0; i<outputs.length; i++) {
          def index = new BigDecimal(outputs[i].index.toString()).intValue();
          relevance_scores[index] = outputs[i].relevance_score;
        }
        def resultBuilder = new StringBuilder('[');
        for (int i=0; i<relevance_scores.length; i++) {
          resultBuilder.append(' {"name": "similarity", "data_type": "FLOAT32", "shape": [1],');
          resultBuilder.append('"data": [');
          resultBuilder.append(relevance_scores[i]);
          resultBuilder.append(']}');
          if (i<outputs.length - 1) {
            resultBuilder.append(',');
          }
        }
        resultBuilder.append(']');
        return resultBuilder.toString();
      """
    }
  ]
}
```

For more information, see the [AWS documentation](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/ml-amazon-connector.html).

Use the connector ID from the response to register and deploy the model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Amazon Bedrock Cohere rerank model",
    "function_name": "remote",
    "description": "test rerank model",
    "connector_id": "your_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID in the response; you'll use it in the following steps.

Test the model by using the Predict API:

```json
POST _plugins/_ml/models/your_model_id/_predict
{
  "parameters": {
    "query": "What is the capital city of America?",
    "documents": [
      "Carson City is the capital city of the American state of Nevada.",
      "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan.",
      "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district.",
      "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
    ]
  }
}
```
{% include copy-curl.html %}

Alternatively, you can test the model as follows:

```json
POST _plugins/_ml/_predict/text_similarity/your_model_id
{
  "query_text": "What is the capital city of America?",
  "text_docs": [
    "Carson City is the capital city of the American state of Nevada.",
    "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan.",
    "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district.",
    "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
  ]
}
```
{% include copy-curl.html %}

The connector `pre_process_function` transforms the input into the format required by the previously shown parameters.

By default, the Amazon Bedrock Rerank API output has the following format:

```json
[
  {
    "index": 2,
    "relevance_score": 0.7190094
  },
  {
    "index": 0,
    "relevance_score": 0.32418242
  },
  {
    "index": 1,
    "relevance_score": 0.07456104
  },
  {
    "index": 3,
    "relevance_score": 0.06124987
  }
]
```

The connector `post_process_function` transforms the model's output into a format that the [rerank processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/) can interpret and orders the results by index. This adapted format is as follows:

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
            0.32418242
          ]
        },
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            0.07456104
          ]
        },
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            0.7190094
          ]
        },
        {
          "name": "similarity",
          "data_type": "FLOAT32",
          "shape": [
            1
          ],
          "data": [
            0.06124987
          ]
        }
      ],
      "status_code": 200
    }
  ]
}
```

The response contains four `similarity` objects. For each `similarity` object, the `data` array contains a relevance score for each document with respect to the query. The `similarity` objects are provided in the order of the input documents---the first object pertains to the first document. This differs from the default output of the Cohere Rerank model, which orders documents by relevance score. The document order is changed in the `connector.post_process.cohere.rerank` post-processing function so that the output is compatible with a reranking pipeline.

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

Create a reranking pipeline with the Cohere Rerank model:

```json
PUT /_search/pipeline/rerank_pipeline_bedrock
{
    "description": "Pipeline for reranking with Bedrock Cohere rerank model",
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

If you provide multiple field names in `document_fields`, the values of all fields are first concatenated, and then reranking is performed.
{: .note}

### Step 2.3: Test the reranking

To limit the number of returned results, you can specify the `size` parameter. For example, set `"size": 2` to return the top two documents.

First, test the query without using the reranking pipeline:

```json
POST my-test-data/_search
{
  "query": {
    "match": {
      "passage_text": "What is the capital city of America?"
    }
  },
  "highlight": {
    "pre_tags": ["<strong>"],
    "post_tags": ["</strong>"],
    "fields": {"passage_text": {}}
  },
  "_source": false,
  "fields": ["passage_text"]
}
```
{% include copy-curl.html %}

The first document in the response is `Carson City is the capital city of the American state of Nevada`, which is incorrect:

```json
{
  "took": 2,
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
    "max_score": 2.5045562,
    "hits": [
      {
        "_index": "my-test-data",
        "_id": "1",
        "_score": 2.5045562,
        "fields": {
          "passage_text": [
            "Carson City is the capital city of the American state of Nevada."
          ]
        },
        "highlight": {
          "passage_text": [
            "Carson <strong>City</strong> <strong>is</strong> <strong>the</strong> <strong>capital</strong> <strong>city</strong> <strong>of</strong> <strong>the</strong> American state <strong>of</strong> Nevada."
          ]
        }
      },
      {
        "_index": "my-test-data",
        "_id": "2",
        "_score": 0.5807494,
        "fields": {
          "passage_text": [
            "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan."
          ]
        },
        "highlight": {
          "passage_text": [
            "<strong>The</strong> Commonwealth <strong>of</strong> <strong>the</strong> Northern Mariana Islands <strong>is</strong> a group <strong>of</strong> islands in <strong>the</strong> Pacific Ocean.",
            "Its <strong>capital</strong> <strong>is</strong> Saipan."
          ]
        }
      },
      {
        "_index": "my-test-data",
        "_id": "3",
        "_score": 0.5261191,
        "fields": {
          "passage_text": [
            "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district."
          ]
        },
        "highlight": {
          "passage_text": [
            "(also known as simply Washington or D.C., and officially as <strong>the</strong> District <strong>of</strong> Columbia) <strong>is</strong> <strong>the</strong> <strong>capital</strong>",
            "<strong>of</strong> <strong>the</strong> United States.",
            "It <strong>is</strong> a federal district."
          ]
        }
      },
      {
        "_index": "my-test-data",
        "_id": "4",
        "_score": 0.5083029,
        "fields": {
          "passage_text": [
            "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
          ]
        },
        "highlight": {
          "passage_text": [
            "<strong>Capital</strong> punishment (<strong>the</strong> death penalty) has existed in <strong>the</strong> United States since beforethe United States",
            "As <strong>of</strong> 2017, <strong>capital</strong> punishment <strong>is</strong> legal in 30 <strong>of</strong> <strong>the</strong> 50 states."
          ]
        }
      }
    ]
  }
}
```

Next, test the query using the reranking pipeline:

```json
POST my-test-data/_search?search_pipeline=rerank_pipeline_bedrock
{
  "query": {
    "match": {
      "passage_text": "What is the capital city of America?"
    }
  },
  "ext": {
    "rerank": {
      "query_context": {
         "query_text": "What is the capital city of America?"
      }
    }
  },
  "highlight": {
    "pre_tags": ["<strong>"],
    "post_tags": ["</strong>"],
    "fields": {"passage_text": {}}
  },
  "_source": false,
  "fields": ["passage_text"]
}
```
{% include copy-curl.html %}

The first document in the response is `"Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district."`, which is correct:

```json
{
  "took": 2,
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
    "max_score": 0.7190094,
    "hits": [
      {
        "_index": "my-test-data",
        "_id": "3",
        "_score": 0.7190094,
        "fields": {
          "passage_text": [
            "Washington, D.C. (also known as simply Washington or D.C., and officially as the District of Columbia) is the capital of the United States. It is a federal district."
          ]
        },
        "highlight": {
          "passage_text": [
            "(also known as simply Washington or D.C., and officially as <strong>the</strong> District <strong>of</strong> Columbia) <strong>is</strong> <strong>the</strong> <strong>capital</strong>",
            "<strong>of</strong> <strong>the</strong> United States.",
            "It <strong>is</strong> a federal district."
          ]
        }
      },
      {
        "_index": "my-test-data",
        "_id": "1",
        "_score": 0.32418242,
        "fields": {
          "passage_text": [
            "Carson City is the capital city of the American state of Nevada."
          ]
        },
        "highlight": {
          "passage_text": [
            "Carson <strong>City</strong> <strong>is</strong> <strong>the</strong> <strong>capital</strong> <strong>city</strong> <strong>of</strong> <strong>the</strong> American state <strong>of</strong> Nevada."
          ]
        }
      },
      {
        "_index": "my-test-data",
        "_id": "2",
        "_score": 0.07456104,
        "fields": {
          "passage_text": [
            "The Commonwealth of the Northern Mariana Islands is a group of islands in the Pacific Ocean. Its capital is Saipan."
          ]
        },
        "highlight": {
          "passage_text": [
            "<strong>The</strong> Commonwealth <strong>of</strong> <strong>the</strong> Northern Mariana Islands <strong>is</strong> a group <strong>of</strong> islands in <strong>the</strong> Pacific Ocean.",
            "Its <strong>capital</strong> <strong>is</strong> Saipan."
          ]
        }
      },
      {
        "_index": "my-test-data",
        "_id": "4",
        "_score": 0.06124987,
        "fields": {
          "passage_text": [
            "Capital punishment (the death penalty) has existed in the United States since beforethe United States was a country. As of 2017, capital punishment is legal in 30 of the 50 states."
          ]
        },
        "highlight": {
          "passage_text": [
            "<strong>Capital</strong> punishment (<strong>the</strong> death penalty) has existed in <strong>the</strong> United States since beforethe United States",
            "As <strong>of</strong> 2017, <strong>capital</strong> punishment <strong>is</strong> legal in 30 <strong>of</strong> <strong>the</strong> 50 states."
          ]
        }
      }
    ]
  },
  "profile": {
    "shards": []
  }
}
```

To avoid writing the query twice, use the `query_text_path` instead of `query_text`, as follows:

```json
POST my-test-data/_search?search_pipeline=rerank_pipeline_bedrock
{
  "query": {
    "match": {
      "passage_text": "What is the capital city of America?"
    }
  },
  "ext": {
    "rerank": {
      "query_context": {
         "query_text_path": "query.match.passage_text.query"
      }
    }
  },
  "highlight": {
    "pre_tags": ["<strong>"],
    "post_tags": ["</strong>"],
    "fields": {"passage_text": {}}
  },
  "_source": false,
  "fields": ["passage_text"]
}
```
{% include copy-curl.html %}