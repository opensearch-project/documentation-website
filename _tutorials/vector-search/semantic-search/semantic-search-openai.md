---
layout: default
title: Semantic search using OpenAI
parent: Semantic search
grand_parent: Vector search
nav_order: 20
redirect_from:
  - /vector-search/tutorials/semantic-search/semantic-search-openai/
---

# Semantic search using the OpenAI embedding model

This tutorial shows you how to implement semantic search in [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/) using the [OpenAI embedding model](https://platform.openai.com/docs/guides/embeddings). For more information, see [Semantic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/).

If using Python, you can create an OpenAI connector and test the model using the [opensearch-py-ml](https://github.com/opensearch-project/opensearch-py-ml) client CLI. The CLI automates many configuration steps, making setup faster and reducing the chance of errors. For more information about using the CLI, see the [CLI documentation](https://opensearch-project.github.io/opensearch-py-ml/cli/index.html#).
{: .tip}

If using self-managed OpenSearch instead of Amazon OpenSearch Service, create a connector to the OpenAI model using [the blueprint](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/openai_connector_embedding_blueprint.md).

Alternatively, you can set up an embedding model using [the AIConnectorHelper notebook](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/tutorials/aws/AIConnectorHelper.ipynb).
{: .tip}

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisite: Create an OpenSearch cluster

Go to the [Amazon OpenSearch Service console](https://console.aws.amazon.com/aos/home) and create an OpenSearch domain.

Note the domain Amazon Resource Name (ARN); you'll use it in the following steps.

## Step 1: Store the API key in AWS Secrets Manager

Store your OpenAI API key in [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html):

1. Open AWS Secrets Manager.
1. Select **Store a new secret**.
1. Select **Other type of secret**.
1. Create a key-value pair with **my_openai_key** as the key and your OpenAI API key as the value.
1. Name your secret `my_test_openai_secret`.

Note the secret ARN; you'll use it in the following steps.

## Step 2: Create an IAM role

To use the secret created in Step 1, you must create an AWS Identity and Access Management (IAM) role with read permissions for the secret. This IAM role will be configured in the connector and will allow the connector to read the secret.

Go to the IAM console, create a new IAM role named `my_openai_secret_role`, and add the following trust policy and permissions:

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
            "Resource": "your_secret_arn_created_in_step1"
        }
    ]
}
```
{% include copy.html %}

Note the role ARN; you'll use it in the following steps.

## Step 3: Configure an IAM role in Amazon OpenSearch Service

Follow these steps to configure an IAM role in Amazon OpenSearch Service.

### Step 3.1: Create an IAM role for signing connector requests

Generate a new IAM role specifically for signing your Create Connector API request.

Create an IAM role named `my_create_openai_connector_role` with the following trust policy and permissions:

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

You'll use the `your_iam_user_arn` IAM user to assume the role in Step 4.1.

- Permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "your_iam_role_arn_created_in_step2"
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

### Step 3.2: Map a backend role

Follow these steps to map a backend role:

1. Log in to OpenSearch Dashboards and select **Security** on the top menu.
2. Select **Roles**, and then select the **ml_full_access** role. 
3. On the **ml_full_access** role details page, select **Mapped users**, and then select **Manage mapping**. 
4. Enter the IAM role ARN created in Step 3.1 in the **Backend roles** field, as shown in the following image.
    ![Mapping a backend role]({{site.url}}{{site.baseurl}}/images/vector-search-tutorials/mapping_iam_role_arn.png)
4. Select **Map**. 

The IAM role is now successfully configured in your OpenSearch cluster.

## Step 4: Create a connector

Follow these steps to create a connector for the OpenAI model. For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

### Step 4.1: Get temporary credentials

Use the credentials of the IAM user specified in Step 3.1 to assume the role:

```bash
aws sts assume-role --role-arn your_iam_role_arn_created_in_step3.1 --role-session-name your_session_name
```
{% include copy.html %}

Copy the temporary credentials from the response and configure them in `~/.aws/credentials`:

```ini
[default]
AWS_ACCESS_KEY_ID=your_access_key_of_role_created_in_step3.1
AWS_SECRET_ACCESS_KEY=your_secret_key_of_role_created_in_step3.1
AWS_SESSION_TOKEN=your_session_token_of_role_created_in_step3.1
```
{% include copy.html %}

### Step 4.2: Create a connector

Run the following Python code with the temporary credentials configured in `~/.aws/credentials`:
 
```python
import boto3
import requests 
from requests_aws4auth import AWS4Auth

host = 'your_amazon_opensearch_domain_endpoint_created'
region = 'your_amazon_opensearch_domain_region'
service = 'es'

credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

path = '/_plugins/_ml/connectors/_create'
url = host + path

payload = {
  "name": "OpenAI embedding model connector",
  "description": "Connector for OpenAI embedding model",
  "version": "1.0",
  "protocol": "http",
  "credential": {
    "secretArn": "your_secret_arn_created_in_step1",
    "roleArn": "your_iam_role_arn_created_in_step2"
  },
  "parameters": {
    "model": "text-embedding-ada-002"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://api.openai.com/v1/embeddings",
      "headers": {
        "Authorization": "Bearer ${credential.secretArn.my_openai_key}"
      },
      "request_body": "{ \"input\": ${parameters.input}, \"model\": \"${parameters.model}\" }",
      "pre_process_function": "connector.pre_process.openai.embedding",
      "post_process_function": "connector.post_process.openai.embedding"
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
{"connector_id":"OBUSRI0BTaDH9c7tUxfU"}
```

Note the connector ID; you'll use it in the next step.

## Step 5: Create and test the model

Log in to OpenSearch Dashboards, open the DevTools console, and run the following requests to create and test the model.

1. Create a model group:

    ```json
    POST /_plugins/_ml/model_groups/_register
    {
        "name": "OpenAI_embedding_model",
        "description": "Test model group for OpenAI embedding model"
    }
    ```
    {% include copy-curl.html %}

    The response contains the model group ID:

    ```json
    {
      "model_group_id": "ORUSRI0BTaDH9c7t9heA",
      "status": "CREATED"
    }
    ```

2. Register the model:

    ```json
    POST /_plugins/_ml/models/_register
    {
      "name": "OpenAI embedding model",
      "function_name": "remote",
      "description": "test embedding model",
      "model_group_id": "ORUSRI0BTaDH9c7t9heA",
      "connector_id": "OBUSRI0BTaDH9c7tUxfU"
    }
    ```
    {% include copy-curl.html %}

    The response contains the model ID:

    ```json
    {
      "task_id": "OhUTRI0BTaDH9c7tLhcv",
      "status": "CREATED",
      "model_id": "OxUTRI0BTaDH9c7tLhdE"
    }
    ```

3. Deploy the model:

    ```json
    POST /_plugins/_ml/models/OxUTRI0BTaDH9c7tLhdE/_deploy
    ```
    {% include copy-curl.html %}

    The response contains a task ID for the deployment operation:

    ```json
    {
      "task_id": "PkoTRI0BOhavBOmfkCmF",
      "task_type": "DEPLOY_MODEL",
      "status": "COMPLETED"
    }
    ```

4. Test the model:

    ```json
    POST /_plugins/_ml/models/OxUTRI0BTaDH9c7tLhdE/_predict
    {
      "parameters": {
        "input": ["hello world", "how are you"]
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
                -0.014907048,
                0.0013432145,
                -0.01851529,
                ...]
            },
            {
              "name": "sentence_embedding",
              "data_type": "FLOAT32",
              "shape": [
                1536
              ],
              "data": [
                -0.014011521,
                -0.0067330617,
                -0.011700075,
                ...]
            }
          ],
          "status_code": 200
        }
      ]
    }
    ```

## Step 6: Configure semantic search

Follow these steps to configure semantic search.

### Step 6.1: Create an ingest pipeline

First, create an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/) that uses the model to create embeddings from the input text:

```json
PUT /_ingest/pipeline/my_openai_embedding_pipeline
{
    "description": "text embedding pipeline",
    "processors": [
        {
            "text_embedding": {
                "model_id": "your_embedding_model_id_created_in_step5",
                "field_map": {
                    "text": "text_knn"
                }
            }
        }
    ]
}
```
{% include copy-curl.html %}

### Step 6.2: Create a vector index

Next, create a vector index for storing the input text and generated embeddings:

```json
PUT my_index
{
  "settings": {
    "index": {
      "knn.space_type": "cosinesimil",
      "default_pipeline": "my_openai_embedding_pipeline",
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

### Step 6.3: Ingest data

Ingest a sample document into the index:

```json
POST /my_index/_doc/1000001
{
    "text": "hello world."
}
```
{% include copy-curl.html %}

### Step 6.4: Search the index

Run a vector search to retrieve documents from the vector index:

```json
POST /my_index/_search
{
  "query": {
    "neural": {
      "text_knn": {
        "query_text": "hello",
        "model_id": "your_embedding_model_id_created_in_step5",
        "k": 100
      }
    }
  },
  "size": "1",
  "_source": ["text"]
}
```
{% include copy-curl.html %}