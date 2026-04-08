---
layout: default
title: Semantic search using AWS CloudFormation and Amazon Bedrock
parent: Semantic search
grand_parent: Vector search
nav_order: 75
redirect_from:
  - /vector-search/tutorials/semantic-search/semantic-search-cfn-bedrock/
canonical_url: https://docs.opensearch.org/latest/tutorials/vector-search/semantic-search/semantic-search-cfn-bedrock/
---

# Semantic search using AWS CloudFormation and Amazon Bedrock 

This tutorial shows you how to implement semantic search in [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/) using [AWS CloudFormation](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cfn-template.html) and Amazon Bedrock. For more information, see [Semantic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/).

If you are using self-managed OpenSearch instead of Amazon OpenSearch Service, create a connector to the Amazon Bedrock models using [the blueprints](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/). For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/). 

The CloudFormation integration automates the steps in the [Semantic search using Amazon Bedrock Titan]({{site.url}}{{site.baseurl}}/vector-search/tutorials/semantic-search/semantic-search-bedrock-cohere/) tutorials. The CloudFormation template creates an AWS Identity and Access Management (IAM) role and invokes an AWS Lambda function to set up an AI connector and model.

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisite: Create an OpenSearch cluster

Go to the [Amazon OpenSearch Service console](https://console.aws.amazon.com/aos/home) and create an OpenSearch domain.

Note the domain Amazon Resource Name (ARN); you'll use it in the following steps.

## Step 1: Map a backend role

The OpenSearch CloudFormation template uses a Lambda function to create an AI connector with an IAM role. You must map the IAM role to `ml_full_access` to grant the required permissions. Follow [Step 2.2 of the Semantic search using Amazon Bedrock Titan tutorial]({{site.url}}{{site.baseurl}}/vector-search/tutorials/semantic-search/semantic-search-bedrock-titan/#step-22-map-a-backend-role) to map a backend role.

The IAM role is specified in the **Lambda Invoke OpenSearch ML Commons Role Name** field in the CloudFormation template. The default IAM role is `LambdaInvokeOpenSearchMLCommonsRole`, so you must map the `arn:aws:iam::your_aws_account_id:role/LambdaInvokeOpenSearchMLCommonsRole` backend role to `ml_full_access`.

For a broader mapping, you can grant all roles `ml_full_access` using a wildcard:  

```
arn:aws:iam::your_aws_account_id:role/*
```  

Because `all_access` includes more permissions than `ml_full_access`, mapping the backend role to `all_access` is also acceptable.

## Step 2: Run the CloudFormation template  

The CloudFormation template integration is available in the [Amazon OpenSearch Service console](https://console.aws.amazon.com/aos/home). From the left navigation pane, select **Integrations**, as shown in the following image.

![Semantic search CloudFormation integration]({{site.url}}{{site.baseurl}}/images/vector-search-tutorials/semantic_search_bedrock_integration_1.png)  

To create a connector, complete the following form.

![Deploy a pretrained model to Amazon Bedrock]({{site.url}}{{site.baseurl}}/images/vector-search-tutorials/semantic_search_bedrock_integration_2.png)

Complete the following fields, keeping all other fields at their default values:  

1. Enter your **Amazon OpenSearch Endpoint**.  
2. In **Model Configuration**, select a **Model** to be deployed. Choose one of the following supported models: 
    - `amazon.titan-embed-text-v1`
    - `amazon.titan-embed-image-v1`
    - `amazon.titan-embed-text-v2:0` 
    - `cohere.embed-english-v3`
    - `cohere.embed-multilingual-v3`
3. Select a **Model Region** (this is the Amazon Bedrock Region).
4. In **AddProcessFunction**, select `true` to enable or `false` to disable the default pre- and post-processing functions in the connector.

## Output

After deployment, you can find the **ConnectorId**, the **ModelId**, and the **BedrockEndpoint** in the **CloudFormation stack Outputs**.  

If an error occurs, follow these steps to review the logs:

1. Navigate to the **CloudWatch Logs** section.
2. Search for **Log Groups** that contain (or are associated with) your CloudFormation stack name.

## Step 3: Configure semantic search

Follow these steps to configure semantic search.

### Step 3.1: Create an ingest pipeline

First, create an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/) that uses the model on Amazon Bedrock to create embeddings from the input text:

```json
PUT /_ingest/pipeline/my_bedrock_embedding_pipeline
{
    "description": "text embedding pipeline",
    "processors": [
        {
            "text_embedding": {
                "model_id": "your_bedrock_embedding_model_id_created_in_step3",
                "field_map": {
                    "text": "text_knn"
                }
            }
        }
    ]
}
```
{% include copy-curl.html %}

### Step 3.2: Create a vector index

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

### Step 3.3: Ingest data

Ingest a sample document into the index:

```json
POST /my_index/_doc/1000001
{
    "text": "hello world."
}
```
{% include copy-curl.html %}

### Step 3.4: Search the index

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