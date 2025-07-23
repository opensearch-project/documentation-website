---
layout: default
title: RAG using DeepSeek-R1 on Amazon Bedrock
parent: RAG
grand_parent: Generative AI
nav_order: 130
redirect_from:
  - /vector-search/tutorials/rag/rag-deepseek-r1-bedrock/
  - /tutorials/vector-search/rag/rag-deepseek-r1-bedrock/
---

# RAG using DeepSeek-R1 on Amazon Bedrock

This tutorial shows you how to implement retrieval-augmented generation (RAG) using [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/) and the [DeepSeek-R1 model](https://huggingface.co/deepseek-ai/DeepSeek-R1).

If you are using self-managed OpenSearch instead of Amazon OpenSearch Service, create a connector to the DeepSeek-R1 model using [the blueprint](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/deepseek_connector_chat_blueprint.md). For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/). Then go directly to [Step 4](#step-4-create-and-test-the-model).

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisites

Before you start, fulfill the following prerequisites.

When configuring Amazon settings, only change the values mentioned in this tutorial. Keep all other settings at their default values.
{: .important}

### Deploy DeepSeek-R1 to Amazon Bedrock

Deploy DeepSeek-R1 on Amazon Bedrock. For more information, see [Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html). Note the Amazon Bedrock DeepSeek-R1 model Amazon Resource Name (ARN); you'll use it in the following steps.

### Create an OpenSearch cluster

Go to the [Amazon OpenSearch Service console](https://console.aws.amazon.com/aos/home) and create an OpenSearch domain.

Note the domain ARN and URL; you'll use them in the following steps.

## Step 1: Create an IAM role for Amazon Bedrock access

To invoke the DeepSeek-R1 model on Amazon Bedrock, you must create an AWS Identity and Access Management (IAM) role with appropriate permissions. The connector will use this role to invoke the model.

Go to the IAM console, create a new IAM role named `my_invoke_bedrock_deepseek_model_role`, and add the following trust policy and permissions:

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
                "bedrock:InvokeModel"
            ],
            "Effect": "Allow",
            "Resource": "your_DeepSeek_R1_model_ARN"
        }
    ]
}
```
{% include copy.html %}

Note the role ARN; you'll use it in the following steps.

## Step 2: Configure an IAM role in Amazon OpenSearch Service

Follow these steps to configure an IAM role in Amazon OpenSearch Service.

### Step 2.1: Create an IAM role for signing connector requests

Generate a new IAM role specifically for signing your Create Connector API request.

Create an IAM role named `my_create_bedrock_deepseek_connector_role` with the following trust policy and permissions:

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

You'll use the `your_iam_user_arn` IAM user to assume the role in Step 3.1.

- Permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "iam:PassRole",
      "Resource": "your_iam_role_arn_created_in_step1"
    },
    {
      "Effect": "Allow",
      "Action": "es:ESHttpPost",
      "Resource": "your_opensearch_domain_arn"
    }
  ]
}
```
{% include copy.html %}

Note this role ARN; you'll use it in the following steps.

### Step 2.2: Map a backend role

Follow these steps to map a backend role:

1. Log in to OpenSearch Dashboards and select **Security** on the top menu.
2. Select **Roles**, and then select the **ml_full_access** role. 
3. On the **ml_full_access** role details page, select **Mapped users**, and then select **Manage mapping**. 
4. Enter the IAM role ARN created in Step 2.1 in the **Backend roles** field, as shown in the following image.
    ![Mapping a backend role]({{site.url}}{{site.baseurl}}/images/vector-search-tutorials/mapping_iam_role_arn.png)
5. Select **Map**. 

The IAM role is now successfully configured in your OpenSearch cluster.

## Step 3: Create a connector

Follow these steps to create a connector for the DeepSeek-R1 model. For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

### Step 3.1: Get temporary credentials

Use the credentials of the IAM user specified in Step 2.1 to assume the role:

```bash
aws sts assume-role --role-arn your_iam_role_arn_created_in_step2.1 --role-session-name your_session_name
```
{% include copy.html %}

Copy the temporary credentials from the response and configure them in `~/.aws/credentials`:

```ini
[default]
AWS_ACCESS_KEY_ID=your_access_key_of_role_created_in_step2.1
AWS_SECRET_ACCESS_KEY=your_secret_key_of_role_created_in_step2.1
AWS_SESSION_TOKEN=your_session_token_of_role_created_in_step2.1
```
{% include copy.html %}

### Step 3.2: Create a connector

Run the following Python code with the temporary credentials configured in `~/.aws/credentials`:

```python
import boto3
import requests 
from requests_aws4auth import AWS4Auth

host = 'your_amazon_opensearch_domain_endpoint'
region = 'your_amazon_opensearch_domain_region'
service = 'es'

credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

path = '/_plugins/_ml/connectors/_create'
url = host + path

payload = {
  "name": "DeepSeek R1 model connector",
  "description": "Connector for my Bedrock DeepSeek model",
  "version": "1.0",
  "protocol": "aws_sigv4",
  "credential": {
    "roleArn": "your_iam_role_arn_created_in_step1"
  },
  "parameters": {
    "service_name": "bedrock",
    "region": "your_bedrock_model_region",
    "model_id": "your_deepseek_bedrock_model_arn",
    "temperature": 0,
    "max_gen_len": 4000
  },
  "actions": [
    {
      "action_type": "PREDICT",
      "method": "POST",
      "url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/${parameters.model_id}/invoke",
      "headers": {
        "content-type": "application/json"
      },
      "request_body": "{ \"prompt\": \"<｜begin▁of▁sentence｜><｜User｜>${parameters.inputs}<｜Assistant｜>\", \"temperature\": ${parameters.temperature}, \"max_gen_len\": ${parameters.max_gen_len} }",
      "post_process_function": "\n      return '{' +\n               '\"name\": \"response\",'+\n               '\"dataAsMap\": {' +\n                  '\"completion\":\"' + escape(params.generation) + '\"}' +\n             '}';\n    "
    }
  ]
}

headers = {"Content-Type": "application/json"}

r = requests.post(url, auth=awsauth, json=payload, headers=headers)
print(r.status_code)
print(r.text)
```
{% include copy.html %}

The script outputs a connector ID:

```json
{"connector_id":"HnS5sJQBVQUimUskjpFl"}
```

Note the connector ID; you'll use it in the next step.

## Step 4: Create and test the model

Log in to OpenSearch Dashboards, open the DevTools console, and run the following requests to create and test the DeepSeek-R1 model.

1. Create a model group:

    ```json
    POST /_plugins/_ml/model_groups/_register
    {
        "name": "Bedrock DeepSeek model",
        "description": "Test model group for Bedrock DeepSeek model"
    }
    ```
    {% include copy-curl.html %}

    The response contains the model group ID:

    ```json
    {
      "model_group_id": "Vylgs5QBts7fa6bylR0v",
      "status": "CREATED"
    }
    ```

2. Register the model:

    ```json
    POST /_plugins/_ml/models/_register
    {
      "name": "Bedrock DeepSeek R1 model",
      "function_name": "remote",
      "description": "DeepSeek R1 model on Bedrock",
      "model_group_id": "Vylgs5QBts7fa6bylR0v",
      "connector_id": "KHS7s5QBVQUimUskoZGp"
    }
    ```
    {% include copy-curl.html %}

    The response contains the model ID:

    ```json
    {
      "task_id": "hOS7s5QBFSAM-Wczv7KD",
      "status": "CREATED",
      "model_id": "heS7s5QBFSAM-Wczv7Kb"
    }
    ```

3. Deploy the model:

    ```json
    POST /_plugins/_ml/models/heS7s5QBFSAM-Wczv7Kb/_deploy
    ```
    {% include copy-curl.html %}

    The response contains a task ID for the deployment operation:

    ```json
    {
      "task_id": "euRhs5QBFSAM-WczTrI6",
      "task_type": "DEPLOY_MODEL",
      "status": "COMPLETED"
    }
    ```

4. Test the model:

    ```json
    POST /_plugins/_ml/models/heS7s5QBFSAM-Wczv7Kb/_predict
    {
      "parameters": {
        "inputs": "hello"
      }
    }
    ```
    {% include copy-curl.html %}

    The response contains the text generated by the model:

    ```json
    {
      "inference_results": [
        {
          "output": [
            {
              "name": "response",
              "dataAsMap": {
                "completion": """<think>\n\n</think>\n\nHello! How can I assist you today? 😊"""
              }
            }
          ],
          "status_code": 200
        }
      ]
    }
    ```

## Step 5: Configure RAG

Follow these steps to configure RAG.

### Step 5.1: Create a search pipeline

Create a search pipeline with a [RAG processor]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/rag-processor/):

```json
PUT /_search/pipeline/my-conversation-search-pipeline-deepseek
{
  "response_processors": [
    {
      "retrieval_augmented_generation": {
        "tag": "Demo pipeline",
        "description": "Demo pipeline Using DeepSeek R1",
        "model_id": "heS7s5QBFSAM-Wczv7Kb",
        "context_field_list": [
          "text"
        ],
        "system_prompt": "You are a helpful assistant.",
        "user_instructions": "Generate a concise and informative answer in less than 100 words for the given question"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 5.2: Create a vector database

Follow steps 1 and 2 of [this tutorial]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/) to create an embedding model and a vector index. Then ingest sample data into the index:

```json
POST _bulk
{"index": {"_index": "my-nlp-index", "_id": "1"}}
{"text": "Chart and table of population level and growth rate for the Ogden-Layton metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of Ogden-Layton in 2023 is 750,000, a 1.63% increase from 2022.\nThe metro area population of Ogden-Layton in 2022 was 738,000, a 1.79% increase from 2021.\nThe metro area population of Ogden-Layton in 2021 was 725,000, a 1.97% increase from 2020.\nThe metro area population of Ogden-Layton in 2020 was 711,000, a 2.16% increase from 2019."}
{"index": {"_index": "my-nlp-index", "_id": "2"}}
{"text": "Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."}
{"index": {"_index": "my-nlp-index", "_id": "3"}}
{"text": "Chart and table of population level and growth rate for the Chicago metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Chicago in 2023 is 8,937,000, a 0.4% increase from 2022.\\nThe metro area population of Chicago in 2022 was 8,901,000, a 0.27% increase from 2021.\\nThe metro area population of Chicago in 2021 was 8,877,000, a 0.14% increase from 2020.\\nThe metro area population of Chicago in 2020 was 8,865,000, a 0.03% increase from 2019."}
{"index": {"_index": "my-nlp-index", "_id": "4"}}
{"text": "Chart and table of population level and growth rate for the Miami metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Miami in 2023 is 6,265,000, a 0.8% increase from 2022.\\nThe metro area population of Miami in 2022 was 6,215,000, a 0.78% increase from 2021.\\nThe metro area population of Miami in 2021 was 6,167,000, a 0.74% increase from 2020.\\nThe metro area population of Miami in 2020 was 6,122,000, a 0.71% increase from 2019."}
{"index": {"_index": "my-nlp-index", "_id": "5"}}
{"text": "Chart and table of population level and growth rate for the Austin metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Austin in 2023 is 2,228,000, a 2.39% increase from 2022.\\nThe metro area population of Austin in 2022 was 2,176,000, a 2.79% increase from 2021.\\nThe metro area population of Austin in 2021 was 2,117,000, a 3.12% increase from 2020.\\nThe metro area population of Austin in 2020 was 2,053,000, a 3.43% increase from 2019."}
{"index": {"_index": "my-nlp-index", "_id": "6"}}
{"text": "Chart and table of population level and growth rate for the Seattle metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Seattle in 2023 is 3,519,000, a 0.86% increase from 2022.\\nThe metro area population of Seattle in 2022 was 3,489,000, a 0.81% increase from 2021.\\nThe metro area population of Seattle in 2021 was 3,461,000, a 0.82% increase from 2020.\\nThe metro area population of Seattle in 2020 was 3,433,000, a 0.79% increase from 2019."}
```
{% include copy-curl.html %}

### Step 5.3: Search the index

Run a vector search to retrieve documents from the vector database and use the DeepSeek model for RAG:

```json
GET /my-nlp-index/_search?search_pipeline=my-conversation-search-pipeline-deepseek
{
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "What's the population increase of New York City from 2021 to 2023? How is the trending comparing with Miami?",
        "model_id": "heS7s5QBFSAM-Wczv7Kb",
        "k": 5
      }
    }
  },
  "size": 2,
  "_source": [
    "text"
  ],
  "ext": {
    "generative_qa_parameters": {
      "llm_model": "bedrock/claude",
      "llm_question": "What's the population increase of New York City from 2021 to 2023? How is the trending comparing with Miami?",
      "context_size": 5,
      "timeout": 15
    }
  }
}
```
{% include copy-curl.html %}

The response includes both the relevant documents retrieved from the vector search (in the `hits` array) and the generated answer from the DeepSeek model (in the `ext.retrieval_augmented_generation` object):

```json
{
  "took": 5,
  "timed_out": false,
  "_shards": {
    "total": 5,
    "successful": 5,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 6,
      "relation": "eq"
    },
    "max_score": 0.04107812,
    "hits": [
      {
        "_index": "my-nlp-index",
        "_id": "4",
        "_score": 0.04107812,
        "_source": {
          "text": """Chart and table of population level and growth rate for the Miami metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of Miami in 2023 is 6,265,000, a 0.8% increase from 2022.\nThe metro area population of Miami in 2022 was 6,215,000, a 0.78% increase from 2021.\nThe metro area population of Miami in 2021 was 6,167,000, a 0.74% increase from 2020.\nThe metro area population of Miami in 2020 was 6,122,000, a 0.71% increase from 2019."""
        }
      },
      {
        "_index": "my-nlp-index",
        "_id": "2",
        "_score": 0.03810156,
        "_source": {
          "text": """Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."""
        }
      }
    ]
  },
  "ext": {
    "retrieval_augmented_generation": {
      "answer": """You are a helpful assistant.\nGenerate a concise and informative answer in less than 100 words for the given question\nSEARCH RESULT 1: Chart and table of population level and growth rate for the Miami metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of Miami in 2023 is 6,265,000, a 0.8% increase from 2022.\nThe metro area population of Miami in 2022 was 6,215,000, a 0.78% increase from 2021.\nThe metro area population of Miami in 2021 was 6,167,000, a 0.74% increase from 2020.\nThe metro area population of Miami in 2020 was 6,122,000, a 0.71% increase from 2019.\nSEARCH RESULT 2: Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019.\nQUESTION: What's the population increase of New York City from 2021 to 2023? How is the trending comparing with Miami?\nOkay, I need to figure out the population increase of New York City from 2021 to 2023 and compare it with Miami's growth. Let me start by looking at the data provided.

From SEARCH RESULT 2, in 2021, NYC's population was 18,823,000, and in 2022, it was 18,867,000. Then in 2023, it's 18,937,000. So, from 2021 to 2022, it increased by 44,000, and from 2022 to 2023, it went up by 70,000. Adding those together, the total increase from 2021 to 2023 is 114,000.

Now, looking at Miami's data in SEARCH RESULT 1, in 2021, the population was 6,167,000, and in 2023, it's 6,265,000. That's an increase of 98,000 over the same period. 

Comparing the two, NYC's increase is higher than Miami's. NYC went up by 114,000, while Miami was 98,000. Also, NYC's growth rate is a bit lower than Miami's. NYC's average annual growth rate is around 0.37%, whereas Miami's is about 0.75%. So, while NYC's population increased more in total, Miami's growth rate is higher. I should present this clearly, highlighting both the total increase and the growth rates to show the comparison accurately.
</think>

From 2021 to 2023, New York City's population increased by 114,000, compared to Miami's increase of 98,000. While NYC's total growth is higher, Miami's annual growth rate (0.75%) is notably faster than NYC's (0.37%)."""
    }
  }
}
```