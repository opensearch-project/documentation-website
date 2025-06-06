---
layout: default
title: Semantic search using Cohere Embed on Amazon Bedrock
parent: Semantic search
grand_parent: Vector search
nav_order: 35
redirect_from:
  - /vector-search/tutorials/semantic-search/semantic-search-bedrock-cohere/
---

# Semantic search using Cohere Embed on Amazon Bedrock

This tutorial shows you how to implement semantic search in [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/) using the [Cohere Embed model](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-embed.html). For more information, see [Semantic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/).

If using Python, you can create a Cohere connector and test the model using the [opensearch-py-ml](https://github.com/opensearch-project/opensearch-py-ml) client CLI. The CLI automates many configuration steps, making setup faster and reducing the chance of errors. For more information about using the CLI, see the [CLI documentation](https://opensearch-project.github.io/opensearch-py-ml/cli/index.html#).
{: .tip}

If using self-managed OpenSearch instead of Amazon OpenSearch Service, create a connector to the model on Amazon Bedrock using [the blueprint](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_cohere_cohere.embed-english-v3_blueprint.md). For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

The easiest way to set up an embedding model in Amazon OpenSearch Service is by using [AWS CloudFormation](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cfn-template.html). Alternatively, you can set up an embedding model using [the AIConnectorHelper notebook](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/tutorials/aws/AIConnectorHelper.ipynb).
{: .tip}

Amazon Bedrock has a [quota limit](https://docs.aws.amazon.com/bedrock/latest/userguide/quotas.html). For more information about increasing this limit, see [Increase model invocation capacity with Provisioned Throughput in Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/prov-throughput.html).
{: .warning}

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisite: Create an OpenSearch cluster

Go to the [Amazon OpenSearch Service console](https://console.aws.amazon.com/aos/home) and create an OpenSearch domain.

Note the domain Amazon Resource Name (ARN); you'll use it in the following steps.

## Step 1: Create an IAM role to invoke the model on Amazon Bedrock

To invoke the model on Amazon Bedrock, you must create an AWS Identity and Access Management (IAM) role with appropriate permissions. The connector will use this role to invoke the model.

Go to the IAM console, create a new IAM role named `my_invoke_bedrock_cohere_role`, and add the following trust policy and permissions:

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
            "Resource": "arn:aws:bedrock:*::foundation-model/cohere.embed-english-v3"
        }
    ]
}
```
{% include copy.html %}

If you need a model with multilingual support, you can use the `cohere.embed-multilingual-v3` model.
{: .tip}

Note the role ARN; you'll use it in the following steps.

## Step 2: Configure an IAM role in Amazon OpenSearch Service

Follow these steps to configure an IAM role in Amazon OpenSearch Service.

### Step 2.1: Create an IAM role for signing connector requests

Generate a new IAM role specifically for signing your Create Connector API request.

Create an IAM role named `my_create_bedrock_cohere_connector_role` with the following trust policy and permissions:

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

Follow these steps to create a connector for the model. For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/).

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
  "name": "Amazon Bedrock Cohere Connector: embedding v3",
  "description": "The connector to Bedrock Cohere embedding model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
    "region": "your_bedrock_model_region",
    "service_name": "bedrock",
    "input_type":"search_document",
    "truncate": "END"
  },
  "credential": {
    "roleArn": "your_iam_role_arn_created_in_step1"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.your_bedrock_model_region.amazonaws.com/model/cohere.embed-english-v3/invoke",
      "headers": {
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{ \"texts\": ${parameters.texts}, \"truncate\": \"${parameters.truncate}\", \"input_type\": \"${parameters.input_type}\" }",
      "pre_process_function": "connector.pre_process.cohere.embedding",
      "post_process_function": "connector.post_process.cohere.embedding"
    }
  ]
}

headers = {"Content-Type": "application/json"}

r = requests.post(url, auth=awsauth, json=payload, headers=headers)
print(r.text)
```
{% include copy.html %}

For more information, see the [Cohere blueprint](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/cohere_connector_embedding_blueprint.md).

The script outputs a connector ID:

```json
{"connector_id":"1p0u8o0BWbTmLN9F2Y7m"}
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
      "model_group_id": "050q8o0BWbTmLN9Foo4f",
      "status": "CREATED"
    }
    ```

2. Register the model:

    ```json
    POST /_plugins/_ml/models/_register
    {
      "name": "Bedrock Cohere embedding model v3",
      "function_name": "remote",
      "description": "test embedding model",
      "model_group_id": "050q8o0BWbTmLN9Foo4f",
      "connector_id": "0p0p8o0BWbTmLN9F-o4G"
    }
    ```
    {% include copy-curl.html %}

    The response contains the model ID:

    ```json
    {
      "task_id": "TRUr8o0BTaDH9c7tSRfx",
      "status": "CREATED",
      "model_id": "VRUu8o0BTaDH9c7t9xet"
    }
    ```

3. Deploy the model:

    ```json
    POST /_plugins/_ml/models/VRUu8o0BTaDH9c7t9xet/_deploy
    ```
    {% include copy-curl.html %}

    The response contains a task ID for the deployment operation:

    ```json
    {
      "task_id": "1J0r8o0BWbTmLN9FjY6I",
      "task_type": "DEPLOY_MODEL",
      "status": "COMPLETED"
    }
    ```

4. Test the model:

    ```json
    POST /_plugins/_ml/models/VRUu8o0BTaDH9c7t9xet/_predict
    {
      "parameters": {
        "texts": ["hello world"]
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
                1024
              ],
              "data": [
                -0.02973938,
                -0.023651123,
                -0.06021118,
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
PUT /_ingest/pipeline/my_bedrock_cohere_embedding_pipeline
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
      "default_pipeline": "my_bedrock_cohere_embedding_pipeline",
      "knn": "true"
    }
  },
  "mappings": {
    "properties": {
      "text_knn": {
        "type": "knn_vector",
        "dimension": 1024
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