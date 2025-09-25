---
layout: default
title: Semantic search using AWS CloudFormation and Amazon SageMaker 
parent: Semantic search
grand_parent: Vector search
nav_order: 70
redirect_from:
  - /vector-search/tutorials/semantic-search/semantic-search-cfn-sagemaker/
---

# Semantic search using AWS CloudFormation and Amazon SageMaker 

This tutorial shows you how to implement semantic search in [Amazon OpenSearch Service](https://docs.aws.amazon.com/opensearch-service/) using [AWS CloudFormation](https://docs.aws.amazon.com/opensearch-service/latest/developerguide/cfn-template.html) and Amazon SageMaker. For more information, see [Semantic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/).

If you are using self-managed OpenSearch instead of Amazon OpenSearch Service, create a connector to the Amazon SageMaker model using [the blueprint](https://github.com/opensearch-project/ml-commons/blob/main/docs/remote_inference_blueprints/sagemaker_connector_blueprint.md). For more information about creating a connector, see [Connectors]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/connectors/). 

The CloudFormation integration automates the steps in the [Semantic Search with SageMaker Embedding Model tutorial]({{site.url}}{{site.baseurl}}/vector-search/tutorials/semantic-search/semantic-search-sagemaker/). The CloudFormation template creates an IAM role and invokes an AWS Lambda function to set up an AI connector and model.

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Model input and output requirements

Ensure that your Amazon SageMaker model inputs follow the format required by the [default pre-processing function]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#preprocessing-function). 

The model input must be an array of strings:

```json
["hello world", "how are you"]
```

Additionally, ensure that the model output follows the format required by the [default post-processing function]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/blueprints/#post-processing-function). The model output must be an array of arrays, where each inner array corresponds to the embedding of an input string:

```json
[
  [
    -0.048237994,
    -0.07612697,
    ...
  ],
  [
    0.32621247,
    0.02328475,
    ...
  ]
]
```

If your model input/output is not the same as the required default, you can build your own pre-/post-processing function using a [Painless script]({{site.url}}{{site.baseurl}}/api-reference/script-apis/exec-script/).

### Example: Amazon Bedrock Titan embedding model

For example, the Amazon Bedrock Titan embedding model ([blueprint](https://github.com/opensearch-project/ml-commons/blob/2.x/docs/remote_inference_blueprints/bedrock_connector_titan_embedding_blueprint.md#2-create-connector-for-amazon-bedrock)) input is as follows:

```json
{ "inputText": "your_input_text" }
```

OpenSearch expects the following input format:

```json
{ "text_docs": [ "your_input_text1", "your_input_text2"] }
```

To convert `text_docs` into `inputText`, you must define the following pre-processing function:

```json
"pre_process_function": """
    StringBuilder builder = new StringBuilder();
    builder.append("\"");
    String first = params.text_docs[0];// Get the first doc, ml-commons will iterate all docs
    builder.append(first);
    builder.append("\"");
    def parameters = "{" +"\"inputText\":" + builder + "}"; // This is the Bedrock Titan embedding model input
    return  "{" +"\"parameters\":" + parameters + "}";"""
```
{% include copy.html %}

The default Amazon Bedrock Titan embedding model output has the following format:

```json
{
  "embedding": <float_array>
}
```

However, OpenSearch expects the following format:

```json
{
  "name": "sentence_embedding",
  "data_type": "FLOAT32",
  "shape": [ <embedding_size> ],
  "data": <float_array>
}
```

To transform the Amazon Bedrock Titan embedding model output into the format expected by OpenSearch, you must define the following post-processing function:

```json
"post_process_function": """
      def name = "sentence_embedding";
      def dataType = "FLOAT32";
      if (params.embedding == null || params.embedding.length == 0) {
        return params.message;
      }
      def shape = [params.embedding.length];
      def json = "{" +
                 "\"name\":\"" + name + "\"," +
                 "\"data_type\":\"" + dataType + "\"," +
                 "\"shape\":" + shape + "," +
                 "\"data\":" + params.embedding +
                 "}";
      return json;
    """
```
{% include copy.html %}

## Prerequisite: Create an OpenSearch cluster

Go to the [Amazon OpenSearch Service console](https://console.aws.amazon.com/aos/home) and create an OpenSearch domain.

Note the domain Amazon Resource Name (ARN); you'll use it in the following steps.

## Step 1: Map a backend role

The OpenSearch CloudFormation template uses a Lambda function to create an AI connector with an AWS Identity and Access Management (IAM) role. You must map the IAM role to `ml_full_access` to grant the required permissions. Follow [Step 2.2 of the Semantic Search with SageMaker Embedding Model tutorial]({{site.url}}{{site.baseurl}}/vector-search/tutorials/semantic-search/semantic-search-sagemaker/#step-22-map-a-backend-role) to map a backend role.

The IAM role is specified in the **Lambda Invoke OpenSearch ML Commons Role Name** field in the CloudFormation template. The default IAM role is `LambdaInvokeOpenSearchMLCommonsRole`, so you must map the `arn:aws:iam::your_aws_account_id:role/LambdaInvokeOpenSearchMLCommonsRole` backend role to `ml_full_access`.

For a broader mapping, you can grant all roles `ml_full_access` using a wildcard:  

```
arn:aws:iam::your_aws_account_id:role/*
```  

Because `all_access` includes more permissions than `ml_full_access`, mapping the backend role to `all_access` is also acceptable.

## Step 2: Run the CloudFormation template  

The CloudFormation template integration is available in the [Amazon OpenSearch Service console](https://console.aws.amazon.com/aos/home). From the left navigation pane, select **Integrations**, as shown in the following image.

![Semantic search CloudFormation integration]({{site.url}}{{site.baseurl}}/images/vector-search-tutorials/semantic_search_remote_model_Integration_1.png)  

Choose one of the following options to deploy a model to Amazon SageMaker.

### Option 1: Deploy a pretrained model to Amazon SageMaker  

You can deploy a pretrained Hugging Face sentence transformer embedding model from the [Deep Java Library model repository](https://djl.ai/), as shown in the following image.

![Deploy a pretrained model to Amazon SageMaker]({{site.url}}{{site.baseurl}}/images/vector-search-tutorials/semantic_search_remote_model_Integration_2.png)

Complete the following fields, keeping all other fields at their default values:  

1. Enter your **Amazon OpenSearch Endpoint**.  
2. Use the default **SageMaker Configuration** to start quickly, or you can modify it as needed. For supported Amazon SageMaker instance types, see the [Amazon SageMaker documentation](https://aws.amazon.com/sagemaker/).  
3. Leave the **SageMaker Endpoint Url** field empty. If you provide a URL, the model will not be deployed to Amazon SageMaker, and a new inference endpoint will not be created.  
4. Leave the **Custom Image** field empty. The default image is `djl-inference:0.22.1-cpu-full`. For available images, see the [AWS Deep Learning Containers](https://docs.aws.amazon.com/deep-learning-containers/latest/devguide/deep-learning-containers-images.html).  
5. Leave the **Custom Model Data Url** field empty.  
6. The **Custom Model Environment** field defaults to `djl://ai.djl.huggingface.pytorch/sentence-transformers/all-MiniLM-L6-v2`. For a list of supported models, see [Supported models](#supported-models).  

### Option 2: Use an existing SageMaker inference endpoint  

If you already have a SageMaker inference endpoint, you can configure a model using that endpoint, as shown in the following image.  

![Using an existing SageMaker inference endpoint]({{site.url}}{{site.baseurl}}/images/vector-search-tutorials/semantic_search_remote_model_Integration_3.png)

Complete the following fields, keeping all others at their default values:  

1. Enter your **Amazon OpenSearch Endpoint**.  
2. Enter your **SageMaker Endpoint Url**.  
3. Leave the **Custom Image**, **Custom Model Data Url**, and **Custom Model Environment** fields empty.  

### Output

After deployment, you can find the OpenSearch AI connector and model IDs in the CloudFormation stack **Outputs**.  

If an error occurs, follow these steps to review the logs:

1. Open the Amazon SageMaker console.
1. Navigate to the **CloudWatch Logs** section.
1. Search for **Log Groups** that contain (or are associated with) your CloudFormation stack name.

## Supported models

The following Hugging Face sentence transformer embedding models are available in the [Deep Java Library model repository](https://djl.ai/):

```
djl://ai.djl.huggingface.pytorch/sentence-transformers/LaBSE/
djl://ai.djl.huggingface.pytorch/sentence-transformers/all-MiniLM-L12-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/all-MiniLM-L12-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/all-MiniLM-L6-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/all-MiniLM-L6-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/all-distilroberta-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/all-mpnet-base-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/all-mpnet-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/all-roberta-large-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/allenai-specter/
djl://ai.djl.huggingface.pytorch/sentence-transformers/bert-base-nli-cls-token/
djl://ai.djl.huggingface.pytorch/sentence-transformers/bert-base-nli-max-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/bert-base-nli-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/bert-base-nli-stsb-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/bert-base-wikipedia-sections-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/bert-large-nli-cls-token/
djl://ai.djl.huggingface.pytorch/sentence-transformers/bert-large-nli-max-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/bert-large-nli-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/bert-large-nli-stsb-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/clip-ViT-B-32-multilingual-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/distilbert-base-nli-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/distilbert-base-nli-stsb-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/distilbert-base-nli-stsb-quora-ranking/
djl://ai.djl.huggingface.pytorch/sentence-transformers/distilbert-multilingual-nli-stsb-quora-ranking/
djl://ai.djl.huggingface.pytorch/sentence-transformers/distiluse-base-multilingual-cased-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/facebook-dpr-ctx_encoder-multiset-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/facebook-dpr-ctx_encoder-single-nq-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/facebook-dpr-question_encoder-multiset-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/facebook-dpr-question_encoder-single-nq-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-MiniLM-L-12-v3/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-MiniLM-L-6-v3/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-MiniLM-L12-cos-v5/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-MiniLM-L6-cos-v5/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-bert-base-dot-v5/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-bert-co-condensor/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilbert-base-dot-prod-v3/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilbert-base-tas-b/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilbert-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilbert-base-v3/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilbert-base-v4/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilbert-cos-v5/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilbert-dot-v5/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilbert-multilingual-en-de-v2-tmp-lng-aligned/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilbert-multilingual-en-de-v2-tmp-trained-scratch/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-distilroberta-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-roberta-base-ance-firstp/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-roberta-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/msmarco-roberta-base-v3/
djl://ai.djl.huggingface.pytorch/sentence-transformers/multi-qa-MiniLM-L6-cos-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/multi-qa-MiniLM-L6-dot-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/multi-qa-distilbert-cos-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/multi-qa-distilbert-dot-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/nli-bert-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/nli-bert-large-max-pooling/
djl://ai.djl.huggingface.pytorch/sentence-transformers/nli-distilbert-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/nli-distilroberta-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/nli-roberta-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/nli-roberta-large/
djl://ai.djl.huggingface.pytorch/sentence-transformers/nq-distilbert-base-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-MiniLM-L12-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-MiniLM-L3-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-MiniLM-L6-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-TinyBERT-L6-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-albert-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-albert-small-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-distilroberta-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-multilingual-mpnet-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/paraphrase-xlm-r-multilingual-v1/
djl://ai.djl.huggingface.pytorch/sentence-transformers/quora-distilbert-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/quora-distilbert-multilingual/
djl://ai.djl.huggingface.pytorch/sentence-transformers/roberta-base-nli-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/roberta-base-nli-stsb-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/roberta-large-nli-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/roberta-large-nli-stsb-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/stsb-bert-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/stsb-bert-large/
djl://ai.djl.huggingface.pytorch/sentence-transformers/stsb-distilbert-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/stsb-distilroberta-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/stsb-roberta-base-v2/
djl://ai.djl.huggingface.pytorch/sentence-transformers/stsb-roberta-base/
djl://ai.djl.huggingface.pytorch/sentence-transformers/stsb-roberta-large/
djl://ai.djl.huggingface.pytorch/sentence-transformers/stsb-xlm-r-multilingual/
djl://ai.djl.huggingface.pytorch/sentence-transformers/use-cmlm-multilingual/
djl://ai.djl.huggingface.pytorch/sentence-transformers/xlm-r-100langs-bert-base-nli-stsb-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/xlm-r-bert-base-nli-stsb-mean-tokens/
djl://ai.djl.huggingface.pytorch/sentence-transformers/xlm-r-distilroberta-base-paraphrase-v1/
```