---
layout: default
title: Reranking search results by a field
parent: Reranking search results
nav_order: 120
redirect_from:
  - /vector-search/tutorials/reranking/reranking-by-field/
---

# Reranking search results by a field using Cohere Rerank

You can rerank search [results by a field]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/#the-by_field-rerank-type). This feature is useful when your documents include a field that is particularly important or when you want to rerank results from an externally hosted model. For more information, see [Reranking search results by a field]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field/).

This tutorial explains how to use the [Cohere Rerank](https://docs.cohere.com/reference/rerank-1) model to rerank search results by a field in self-managed OpenSearch and in [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/).

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Step 1 (self-managed OpenSearch): Create a connector

To create a connector, send the following request:

```json
POST /_plugins/_ml/connectors/_create
{
    "name": "cohere-rerank",
    "description": "The connector to Cohere reranker model",
    "version": "1",
    "protocol": "http",
    "credential": {
        "cohere_key": "your_cohere_api_key"
    },
    "parameters": {
        "model": "rerank-english-v3.0"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://api.cohere.ai/v1/rerank",
            "headers": {
                "Authorization": "Bearer ${credential.cohere_key}"
            },
            "request_body": "{ \"documents\": ${parameters.documents}, \"query\": \"${parameters.query}\", \"model\": \"${parameters.model}\", \"top_n\": ${parameters.top_n} }",
            "post_process_function": """
                def results = params.results;
                def scores = new Double[results.length];
                for (int i = 0; i < results.length; i++) {
                  def index = new BigDecimal(results[i].index.toString()).intValue();
                  scores[index] = results[i].relevance_score;
                }
                def builder = new StringBuilder('{"name": "response", "dataAsMap": {"results": [');
                for (int i = 0; i < scores.length; i++) {
                  if (i > 0) {
                    builder.append(',');
                  }
                  builder.append('{"index": ').append(i).append(', "relevance_score": ').append(scores[i]).append('}');
                }
                builder.append(']}}');
                return builder.toString();
            """
        }
    ]
}
```
{% include copy-curl.html %}

The response contains the connector ID:

```json
{"connector_id":"qp2QP40BWbTmLN9Fpo40"}
```

Note the connector ID; you'll use it in the following steps. Then go to [Step 2](#step-2-register-the-cohere-rerank-model).

## Step 1 (Amazon OpenSearch Service): Create a connector

Follow these steps to create a connector using Amazon OpenSearch Service.

### Prerequisite: Create an OpenSearch cluster

Go to the [Amazon OpenSearch Service console](https://console.aws.amazon.com/aos/home) and create an OpenSearch domain.

Note the domain Amazon Resource Name (ARN) and URL; you'll use them in the following steps.

### Step 1.1: Store the API key in AWS Secrets Manager

Store your Cohere API key in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html):

1. Open AWS Secrets Manager.
1. Select **Store a new secret**.
1. Select **Other type of secret**.
1. Create a key-value pair with **my_cohere_key** as the key and your Cohere API key as the value.
1. Name your secret `my_test_cohere_secret`.

Note the secret ARN; you'll use it in the following steps.

### Step 1.2: Create an IAM role

To use the secret created in Step 1.1, you must create an AWS Identity and Access Management (IAM) role with read permissions for the secret. This IAM role will be configured in the connector and will allow the connector to read the secret.

Go to the IAM console, create a new IAM role named `my_cohere_secret_role`, and add the following trust policy and permissions:

- Custom trust policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "es.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```
{% include copy.html %}

- Permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "secretsmanager:GetSecretValue",
                "secretsmanager:DescribeSecret"
            ],
            "Effect": "Allow",
            "Resource": "your_secret_arn_created_in_step1.1"
        }
    ]
}
```
{% include copy.html %}

Note the role ARN; you'll use it in the following steps.

### Step 1.3: Configure an IAM role in Amazon OpenSearch Service

Follow these steps to configure an IAM role in Amazon OpenSearch Service.

#### Step 1.3.1: Create an IAM role for signing connector requests

Generate a new IAM role specifically for signing your Create Connector API request.

Create an IAM role named `my_create_cohere_connector_role` with the following trust policy and permissions:

- Custom trust policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "your_iam_user_arn"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```
{% include copy.html %}

You'll use the `your_iam_user_arn` IAM user to assume the role in Step 1.4.

- Permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "your_iam_role_arn_created_in_step1.2"
        },
        {
            "Effect": "Allow",
            "Action": "es:ESHttpPost",
            "Resource": "your_opensearch_domain_arn_created_in_step0/*"
        }
    ]
}
```
{% include copy.html %}

Note this role ARN; you'll use it in the following steps.

#### Step 1.3.2: Map a backend role

Follow these steps to map a backend role:

1. Log in to OpenSearch Dashboards and select **Security** on the top menu.
2. Select **Roles**, and then select the **ml_full_access** role. 
3. On the **ml_full_access** role details page, select **Mapped users**, and then select **Manage mapping**. 
4. Enter the IAM role ARN created in Step 1.3.1 in the **Backend roles** field, as shown in the following image.
    ![Mapping a backend role]({{site.url}}{{site.baseurl}}/images/vector-search-tutorials/mapping_iam_role_arn.png)
5. Select **Map**. 

The IAM role is now successfully configured in your OpenSearch cluster.

### Step 1.4: Create a connector

Follow these steps to create a connector for the model. For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

Run the following Python code with the temporary credentials fetched from AWS.
 
```python
import boto3
import requests 
from requests_aws4auth import AWS4Auth

host = 'your_amazon_opensearch_domain_endpoint_created_in_step0'
region = 'your_amazon_opensearch_domain_region'
service = 'es'

assume_role_response = boto3.Session().client('sts').assume_role(
  RoleArn="your_iam_role_arn_created_in_step1.3.1",
  RoleSessionName="your_session_name"
)
credentials = assume_role_response["Credentials"]

awsauth = AWS4Auth(credentials["AccessKeyId"], credentials["SecretAccessKey"], region, service, session_token=credentials["SessionToken"])

path = '/_plugins/_ml/connectors/_create'
url = host + path

payload = {
    "name": "cohere-rerank",
    "description": "The connector to Cohere reranker model",
    "version": "1",
    "protocol": "http",
    "credential": {
        "secretArn": "your_secret_arn_created_in_step1.1",
        "roleArn": "your_iam_role_arn_created_in_step1.2"
    },
    "parameters": {
        "model": "rerank-english-v3.0"
    },
    "actions": [
        {
            "action_type": "predict",
            "method": "POST",
            "url": "https://api.cohere.ai/v1/rerank",
            "headers": {
                "Authorization": "Bearer ${credential.secretArn.my_cohere_key}"
            },
            "request_body": "{ \"documents\": ${parameters.documents}, \"query\": \"${parameters.query}\", \"model\": \"${parameters.model}\", \"top_n\": ${parameters.top_n} }",
            "post_process_function": """
                def results = params.results;
                def scores = new Double[results.length];
                for (int i = 0; i < results.length; i++) {
                  def index = new BigDecimal(results[i].index.toString()).intValue();
                  scores[index] = results[i].relevance_score;
                }
                def builder = new StringBuilder('{"name": "response", "dataAsMap": {"results": [');
                for (int i = 0; i < scores.length; i++) {
                  if (i > 0) {
                    builder.append(',');
                  }
                  builder.append('{"index": ').append(i).append(', "relevance_score": ').append(scores[i]).append('}');
                }
                builder.append(']}}');
                return builder.toString();
            """
        }
    ]
}

headers = {"Content-Type": "application/json"}

r = requests.post(url, auth=awsauth, json=payload, headers=headers)
print(r.text)
```
{% include copy.html %}

The script outputs a connector ID:

```json
{"connector_id":"qp2QP40BWbTmLN9Fpo40"}
```

Note the connector ID; you'll use it in the next step.

## Step 2: Register the Cohere Rerank model

After successfully creating a connector using either the self-managed OpenSearch or Amazon OpenSearch Service method, you can register the Cohere Rerank model. 

Use the connector ID from Step 1 to create a model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "cohere rerank model",
    "function_name": "remote",
    "description": "test rerank model",
    "connector_id": "your_connector_id"
}
```
{% include copy-curl.html %}

Note the model ID; you'll use it in the following steps.

## Step 3: Test the model

To test the model, send the following request:

```json
POST /_plugins/_ml/models/your_model_id/_predict
{
  "parameters": {
	"top_n" : 100,
    "query": "What day is it?",
	"documents" : ["Monday", "Tuesday", "apples"]
  }
}
```
{% include copy-curl.html %}

Cohere Rerank returns the results sorted by relevance score, each with the `index` of its document in the input. The connector `post_process_function` puts the results back in the order of the input documents and keeps only the `index` and `relevance_score` of each result. The response contains one result for each document, in the order of the input documents:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "dataAsMap": {
            "results": [
              {
                "index": 0,
                "relevance_score": 0.22908688
              },
              {
                "index": 1,
                "relevance_score": 0.22438706
              },
              {
                "index": 2,
                "relevance_score": 0.035440832
              }
            ]
          }
        }
      ],
      "status_code": 200
    }
  ]
}
```

Because the results are in the order of the input documents, the search pipeline that you create in the next step can assign each search hit its own relevance score and then reorder the hits by that score.

## Step 4: Rerank the search results

Follow these steps to rerank the search results.

### Step 4.1: Create an index

To create an index, send the following request:

```json
POST _bulk
{ "index": { "_index": "nyc_facts", "_id": 1 } }
{ "fact_title": "Population of New York", "fact_description": "New York City has an estimated population of over 8.3 million people as of 2023, making it the most populous city in the United States." }
{ "index": { "_index": "nyc_facts", "_id": 2 } }
{ "fact_title": "Statue of Liberty", "fact_description": "The Statue of Liberty, a symbol of freedom, was gifted to the United States by France in 1886 and stands on Liberty Island in New York Harbor." }
{ "index": { "_index": "nyc_facts", "_id": 3 } }
{ "fact_title": "New York City is a Global Financial Hub", "fact_description": "New York City is home to the New York Stock Exchange (NYSE) and Wall Street, which are central to the global finance industry." }
{ "index": { "_index": "nyc_facts", "_id": 4 } }
{ "fact_title": "Broadway", "fact_description": "Broadway is a major thoroughfare in New York City known for its theaters. It's also considered the birthplace of modern American theater and musicals." }
{ "index": { "_index": "nyc_facts", "_id": 5 } }
{ "fact_title": "Central Park", "fact_description": "Central Park, located in Manhattan, spans 843 acres and is one of the most visited urban parks in the world, offering green spaces, lakes, and recreational areas." }
{ "index": { "_index": "nyc_facts", "_id": 6 } }
{ "fact_title": "Empire State Building", "fact_description": "The Empire State Building, completed in 1931, is an iconic Art Deco skyscraper that was the tallest building in the world until 1970." }
{ "index": { "_index": "nyc_facts", "_id": 7 } }
{ "fact_title": "Times Square", "fact_description": "Times Square, often called 'The Cross-roads of the World,' is known for its bright lights, Broadway theaters, and New Year's Eve ball drop." }
{ "index": { "_index": "nyc_facts", "_id": 8 } }
{ "fact_title": "Brooklyn Bridge", "fact_description": "The Brooklyn Bridge, completed in 1883, connects Manhattan and Brooklyn and was the first suspension bridge to use steel in its construction." }
{ "index": { "_index": "nyc_facts", "_id": 9 } }
{ "fact_title": "New York City Public Library", "fact_description": "The New York Public Library, founded in 1895, has over 50 million items in its collections and serves as a major cultural and educational resource." }
{ "index": { "_index": "nyc_facts", "_id": 10 } }
{ "fact_title": "New York's Chinatown", "fact_description": "New York's Chinatown, one of the largest in the world, is known for its vibrant culture, food, and history. It plays a key role in the city's Chinese community." }
```
{% include copy-curl.html %}

### Step 4.2: Create a reranking pipeline

To create a reranking pipeline, send the following request:

```json
PUT /_search/pipeline/cohere_pipeline
{
  "response_processors": [
    {
      "ml_inference": {
        "model_id": "your_model_id",
        "input_map": [
          {
            "documents": "fact_description",
            "query": "_request.ext.query_context.query_text",
            "top_n": "_request.ext.query_context.top_n"
          }
        ],
        "output_map": [
          {
            "relevance_score": "results[*].relevance_score"
          }
        ],
        "full_response_path": false,
        "ignore_missing": false,
        "ignore_failure": false,
        "one_to_one": false,
        "override": false,
        "model_config": {}
      }
    },
    {
      "rerank": {
        "by_field": {
          "target_field": "relevance_score",
          "remove_target_field": false,
          "keep_previous_score": false,
          "ignore_failure": false
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 4.3: Test the pipeline

To test the pipeline, send a query related to the indexed documents and set `top_n` to a value greater than or equal to `size` so that the model returns a score for every hit:

```json
GET nyc_facts/_search?search_pipeline=cohere_pipeline
{
  "query": {
    "match_all": {}
  },
  "size": 5,
  "ext": {
    "rerank": {
      "query_context": {
        "query_text": "Where do people go to see a show?",
        "top_n" : "10"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the hits sorted by relevance score. The `Broadway` document, which is the most relevant to the query, is first:

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
      "value": 10,
      "relation": "eq"
    },
    "max_score": 0.29558104,
    "hits": [
      {
        "_index": "nyc_facts",
        "_id": "4",
        "_score": 0.29558104,
        "_source": {
          "fact_title": "Broadway",
          "fact_description": "Broadway is a major thoroughfare in New York City known for its theaters. It's also considered the birthplace of modern American theater and musicals.",
          "relevance_score": 0.29558104
        }
      },
      {
        "_index": "nyc_facts",
        "_id": "5",
        "_score": 0.06037975,
        "_source": {
          "fact_title": "Central Park",
          "fact_description": "Central Park, located in Manhattan, spans 843 acres and is one of the most visited urban parks in the world, offering green spaces, lakes, and recreational areas.",
          "relevance_score": 0.06037975
        }
      },
      {
        "_index": "nyc_facts",
        "_id": "1",
        "_score": 0.045238655,
        "_source": {
          "fact_title": "Population of New York",
          "fact_description": "New York City has an estimated population of over 8.3 million people as of 2023, making it the most populous city in the United States.",
          "relevance_score": 0.045238655
        }
      },
      {
        "_index": "nyc_facts",
        "_id": "3",
        "_score": 0.037036795,
        "_source": {
          "fact_title": "New York City is a Global Financial Hub",
          "fact_description": "New York City is home to the New York Stock Exchange (NYSE) and Wall Street, which are central to the global finance industry.",
          "relevance_score": 0.037036795
        }
      },
      {
        "_index": "nyc_facts",
        "_id": "2",
        "_score": 0.034103718,
        "_source": {
          "fact_title": "Statue of Liberty",
          "fact_description": "The Statue of Liberty, a symbol of freedom, was gifted to the United States by France in 1886 and stands on Liberty Island in New York Harbor.",
          "relevance_score": 0.034103718
        }
      }
    ]
  },
  "profile": {
    "shards": []
  }
}
```

## Related documentation

- [Reranking search results by a field]({{site.url}}{{site.baseurl}}/search-plugins/search-relevance/rerank-by-field/)
- [Rerank processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rerank-processor/)
- [ML inference search response processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/ml-inference-search-response/)
- [Connectors for third-party ML platforms]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/)
