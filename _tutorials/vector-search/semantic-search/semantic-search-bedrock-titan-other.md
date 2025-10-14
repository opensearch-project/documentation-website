---
layout: default
title: Semantic search using Amazon Bedrock Titan in another account
parent: Semantic search
grand_parent: Vector search
nav_order: 50
redirect_from:
  - /vector-search/tutorials/semantic-search/semantic-search-bedrock-titan-other/
canonical_url: https://docs.opensearch.org/latest/tutorials/vector-search/semantic-search/semantic-search-bedrock-titan-other/
---

# Semantic search using Amazon Bedrock Titan in another account

Starting with OpenSearch version 2.15, you must configure a connector to an Amazon Bedrock model hosted in a different account than the account hosting Amazon OpenSearch Service. This tutorial shows you how to implement semantic search in [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/) using the [Amazon Bedrock Titan embedding model](https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html) hosted in another account. For more information, see [Semantic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/).

Amazon Bedrock has a [quota limit](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html). For more information about increasing this limit, see [Increase model invocation capacity with Provisioned Throughput in Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html).
{: .warning}

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

# Overview

In this tutorial, you'll use two AWS accounts: Account A (hosting Amazon OpenSearch Service) and Account B (hosting an Amazon Bedrock model).

To invoke a model hosted in a different account than the account hosting Amazon OpenSearch Service, you must configure two roles in the connector credentials:

- `roleArn`: The role in Account A that is used to assume the external account role in Account B.
- `externalAccountRoleArn`: The role in Account B that is used to invoke the Amazon Bedrock model.

In this tutorial , you'll use the following role names:

- Account A: `my_cross_account_role_accountA`

  Amazon Resource Name (ARN): `arn:aws:iam::<your_aws_account_A>:role/my_cross_account_role_accountA`

- Account B: `my_invoke_bedrock_role_accountB`

  ARN: `arn:aws:iam::<your_aws_account_B>:role/my_invoke_bedrock_role_accountB`

## Prerequisite: Create an OpenSearch cluster

Go to the [Amazon OpenSearch Service console](https://console.aws.amazon.com/aos/home) and create an OpenSearch domain.

Note the domain ARN; you'll use it in the following steps.

## Step 1: Create an IAM role in Account B

To invoke the model on Amazon Bedrock, you must create an AWS Identity and Access Management (IAM) role with appropriate permissions. The connector will use this role to invoke the model.

Go to the IAM console, create a new IAM role named `my_invoke_bedrock_role_accountB`, and add the following trust policy and permissions:

- Custom trust policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::<your_aws_account_A>:role/my_cross_account_role_accountA"
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
            "Resource": "arn:aws:bedrock:*::foundation-model/amazon.titan-embed-text-v1"
        }
    ]
}
```
{% include copy.html %}

Note the role ARN; you'll use it in the following steps.

## 2. Create an IAM role in Account A

Follow these steps to configure an IAM role in Amazon OpenSearch Service.

### Step 2.1: Create an IAM role for assuming externalAccountRoleArn

Create an IAM role for assuming `externalAccountRoleArn` in Account B.

Go to the IAM console, create a new IAM role named  `my_cross_account_role_accountA` , and add the following trust policy and permissions:

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
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "arn:aws:iam::<your_aws_account_B>:role/my_invoke_bedrock_role_accountB"
        }
    ]
}
```
{% include copy.html %}

Note the role ARN; you'll use it in the following steps.

### Step 2.2: Create an IAM role for signing connector requests

Generate a new IAM role specifically for signing your Create Connector API request.

Create an IAM role named `my_create_connector_role_accountA` with the following trust policy and permissions:

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

You'll use the `your_iam_user_arn` IAM user to assume the role in Step 3.

- Permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "arn:aws:iam::<your_aws_account_A>:role/my_cross_account_role_accountA"
        },
        {
            "Effect": "Allow",
            "Action": "es:ESHttpPost",
            "Resource": "your_opensearch_domain_arn_created"
        }
    ]
}
```
{% include copy.html %}

Note this role ARN; you'll use it in the following steps.

### Step 2.3: Map a backend role

Follow these steps to map a backend role:

1. Log in to OpenSearch Dashboards and select **Security** on the top menu.
2. Select **Roles**, and then select the **ml_full_access** role. 
3. On the **ml_full_access** role details page, select **Mapped users**, and then select **Manage mapping**. 
4. Enter the IAM role ARN created in Step 2.2 (`arn:aws:iam::<your_aws_account_A>:role/my_create_connector_role_accountA`) in the **Backend roles** field, as shown in the following image.
    ![Mapping a backend role]({{site.url}}{{site.baseurl}}/images/vector-search-tutorials/mapping_iam_role_arn.png)
5. Select **Map**. 

The IAM role is now successfully configured in your OpenSearch cluster.

## Step 3: Create a connector

Follow these steps to create a connector for the model. For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

Run the following Python code with the temporary credentials fetched from AWS.
 
```python
import boto3
import requests 
from requests_aws4auth import AWS4Auth

host = 'your_amazon_opensearch_domain_endpoint_created'
region = 'your_amazon_opensearch_domain_region'
service = 'es'

assume_role_response = boto3.Session().client('sts').assume_role(
  RoleArn="your_iam_role_arn_created_in_step2.2",
  RoleSessionName="your_session_name"
)
credentials = assume_role_response["Credentials"]
awsauth = AWS4Auth(credentials["AccessKeyId"], credentials["SecretAccessKey"], region, service, session_token=credentials["SessionToken"])

path = '/_plugins/_ml/connectors/_create'
url = host + path

bedrock_model_region='your_bedrock_model_region'
payload = {
  "name": "Amazon Bedrock Connector: titan embedding v1",
  "description": "The connector to bedrock Titan embedding model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": bedrock_model_region,
    "service_name": "bedrock"
  },
  "credential": {
    "roleArn": "arn:aws:iam::<your_aws_account_A>:role/my_cross_account_role_accountA",
    "externalAccountRoleArn": "arn:aws:iam::<your_aws_account_B>:role/my_invoke_bedrock_role_accountB"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": f"https://bedrock-runtime.{bedrock_model_region}.amazonaws.com/model/amazon.titan-embed-text-v1/invoke",
      "headers": {
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{ \"inputText\": \"${parameters.inputText}\" }",
      "pre_process_function": "connector.pre_process.bedrock.embedding",
      "post_process_function": "connector.post_process.bedrock.embedding"
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
{"connector_id":"N0qpQY0BOhavBOmfOCnw"}
```

Note the connector ID; you'll use it in the next step.

## Step 4: Create and test the model

Log in to OpenSearch Dashboards, open the DevTools console, and run the following requests to create and test the model.

1. Create a model group:

    ```json
    POST /_plugins/_ml/model_groups/_register
    {
        "name": "Bedrock_embedding_model",
        "description": "Test model group for bedrock embedding model"
    }
    ```
    {% include copy-curl.html %}

    The response contains the model group ID:

    ```json
    {
      "model_group_id": "LxWiQY0BTaDH9c7t9xeE",
      "status": "CREATED"
    }
    ```

2. Register the model:

    ```json
    POST /_plugins/_ml/models/_register
    {
      "name": "bedrock titan embedding model v1",
      "function_name": "remote",
      "description": "test embedding model",
      "model_group_id": "LxWiQY0BTaDH9c7t9xeE",
      "connector_id": "N0qpQY0BOhavBOmfOCnw"
    }
    ```
    {% include copy-curl.html %}

    The response contains the model ID:

    ```json
    {
      "task_id": "O0q3QY0BOhavBOmf1SmL",
      "status": "CREATED",
      "model_id": "PEq3QY0BOhavBOmf1Sml"
    }
    ```

3. Deploy the model:

    ```json
    POST /_plugins/_ml/models/PEq3QY0BOhavBOmf1Sml/_deploy
    ```
    {% include copy-curl.html %}

    The response contains a task ID for the deployment operation:

    ```json
    {
      "task_id": "PUq4QY0BOhavBOmfBCkQ",
      "task_type": "DEPLOY_MODEL",
      "status": "COMPLETED"
    }
    ```

4. Test the model:

    ```json
    POST /_plugins/_ml/models/PEq3QY0BOhavBOmf1Sml/_predict
    {
      "parameters": {
        "inputText": "hello world"
      }
    }
    ```
    {% include copy-curl.html %}

    The response contains the embeddings generated by the model:

    ```json
    {
      "inference_results": [
        {
          "output": [
            {
              "name": "sentence_embedding",
              "data_type": "FLOAT32",
              "shape": [
                1536
              ],
              "data": [
                0.7265625,
                -0.0703125,
                0.34765625,
                ...]
            }
          ],
          "status_code": 200
        }
      ]
    }
    ```

## Step 5: Configure semantic search

Follow these steps to configure semantic search.

### Step 5.1: Create an ingest pipeline

First, create an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/) that uses the model in Amazon SageMaker to create embeddings from the input text:

```json
PUT /_ingest/pipeline/my_bedrock_embedding_pipeline
{
    "description": "text embedding pipeline",
    "processors": [
        {
            "text_embedding": {
                "model_id": "your_bedrock_embedding_model_id_created_in_step4",
                "field_map": {
                    "text": "text_knn"
                }
            }
        }
    ]
}
```
{% include copy-curl.html %}

### Step 5.2: Create a vector index

Next, create a vector index for storing the input text and generated embeddings:

```json
PUT my_index
{
  "settings": {
    "index": {
      "knn.space_type": "cosinesimil",
      "default_pipeline": "my_bedrock_embedding_pipeline",
      "knn": "true"
    }
  },
  "mappings": {
    "properties": {
      "text_knn": {
        "type": "knn_vector",
        "dimension": 1536
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 5.3: Ingest data

Ingest a sample document into the index:

```json
POST /my_index/_doc/1000001
{
    "text": "hello world."
}
```
{% include copy-curl.html %}

### Step 5.4: Search the index

Run a vector search to retrieve documents from the vector index:

```json
POST /my_index/_search
{
  "query": {
    "neural": {
      "text_knn": {
        "query_text": "hello",
        "model_id": "your_embedding_model_id_created_in_step4",
        "k": 100
      }
    }
  },
  "size": "1",
  "_source": ["text"]
}
```
{% include copy-curl.html %}