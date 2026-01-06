---
layout: default
title: Agents and tools tutorial
parent: Agents and tools
grand_parent: ML Commons APIs
nav_order: 10
---

# Agents and tools tutorial
**Introduced 2.13**
{: .label .label-purple }

The following tutorial illustrates creating a flow agent for retrieval-augmented generation (RAG). A flow agent runs its configured tools sequentially, in the order specified. In this example, you'll create an agent with two tools:

1. `VectorDBTool`: The agent will use this tool to retrieve OpenSearch documents relevant to the user question. You'll ingest supplementary information into an OpenSearch index. To facilitate vector search, you'll deploy a text embedding model that translates text into vector embeddings. OpenSearch will translate the ingested documents into embeddings and store them in the index. When you provide a user question to the agent, the agent will construct a query from the question, run vector search on the OpenSearch index, and pass the relevant retrieved documents to the `MLModelTool`.
1. `MLModelTool`: The agent will run this tool to connect to a large language model (LLM) and send the user query augmented with OpenSearch documents to the model. In this example, you'll use the [Anthropic Claude model hosted on Amazon Bedrock](https://aws.amazon.com/bedrock/claude/). The LLM will then answer the question based on its knowledge and the provided documents.

## Prerequisites

To use the memory feature, first configure the following cluster settings. This tutorial assumes that you have no dedicated machine learning (ML) nodes:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.only_run_on_ml_node": "false",
    "plugins.ml_commons.memory_feature_enabled": "true"
  }
}
```
{% include copy-curl.html %}

For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).

## Step 1: Register and deploy a text embedding model

You need a text embedding model to facilitate vector search. For this tutorial, you'll use one of the OpenSearch-provided pretrained models. When selecting a model, note its dimensionality because you'll need to provide it when creating an index. 

In this tutorial, you'll use the `huggingface/sentence-transformers/all-MiniLM-L12-v2` model, which generates 384-dimensional dense vector embeddings. To register and deploy the model, send the following request:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "huggingface/sentence-transformers/all-MiniLM-L12-v2",
  "version": "1.0.2",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Registering a model is an asynchronous task. OpenSearch returns a task ID for this task:

```json
{
  "task_id": "aFeif4oB5Vm0Tdw8yoN7",
  "status": "CREATED"
}
```

You can check the status of the task by calling the [Get ML Task API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/):

```json
GET /_plugins/_ml/tasks/aFeif4oB5Vm0Tdw8yoN7
```
{% include copy-curl.html %}

Once the task is complete, the task state changes to `COMPLETED` and the ML Tasks API response includes a model ID for the deployed model:

```json
{
  "model_id": "aVeif4oB5Vm0Tdw8zYO2",
  "task_type": "REGISTER_MODEL",
  "function_name": "TEXT_EMBEDDING",
  "state": "COMPLETED",
  "worker_node": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "create_time": 1694358489722,
  "last_update_time": 1694358499139,
  "is_async": true
}
```

## Step 2: Create an ingest pipeline

To translate text into vector embeddings, you'll set up an ingest pipeline. The pipeline translates the `text` field and writes the resulting vector embeddings into the `embedding` field. Create the pipeline by specifying the `model_id` from the previous step in the following request:

```json
PUT /_ingest/pipeline/test-pipeline-local-model
{
  "description": "text embedding pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "aVeif4oB5Vm0Tdw8zYO2",
        "field_map": {
          "text": "embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 3: Create a vector index and ingest data

Now you'll ingest supplementary data into an OpenSearch index. In OpenSearch, vectors are stored in a vector index. You can create a [vector index]({{site.url}}{{site.baseurl}}/search-plugins/knn/knn-index/) by sending the following request:

```json
PUT my_test_data
{
  "mappings": {
    "properties": {
      "text": {
        "type": "text"
      },
      "embedding": {
        "type": "knn_vector",
        "dimension": 384
      }
    }
  },
  "settings": {
    "index": {
      "knn.space_type": "cosinesimil",
      "default_pipeline": "test-pipeline-local-model",
      "knn": "true"
    }
  }
}
```
{% include copy-curl.html %}

Then, ingest data into the index by using a bulk request:

```json
POST _bulk
{"index": {"_index": "my_test_data", "_id": "1"}}
{"text": "Chart and table of population level and growth rate for the Ogden-Layton metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\nThe current metro area population of Ogden-Layton in 2023 is 750,000, a 1.63% increase from 2022.\nThe metro area population of Ogden-Layton in 2022 was 738,000, a 1.79% increase from 2021.\nThe metro area population of Ogden-Layton in 2021 was 725,000, a 1.97% increase from 2020.\nThe metro area population of Ogden-Layton in 2020 was 711,000, a 2.16% increase from 2019."}
{"index": {"_index": "my_test_data", "_id": "2"}}
{"text": "Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."}
{"index": {"_index": "my_test_data", "_id": "3"}}
{"text": "Chart and table of population level and growth rate for the Chicago metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Chicago in 2023 is 8,937,000, a 0.4% increase from 2022.\\nThe metro area population of Chicago in 2022 was 8,901,000, a 0.27% increase from 2021.\\nThe metro area population of Chicago in 2021 was 8,877,000, a 0.14% increase from 2020.\\nThe metro area population of Chicago in 2020 was 8,865,000, a 0.03% increase from 2019."}
{"index": {"_index": "my_test_data", "_id": "4"}}
{"text": "Chart and table of population level and growth rate for the Miami metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Miami in 2023 is 6,265,000, a 0.8% increase from 2022.\\nThe metro area population of Miami in 2022 was 6,215,000, a 0.78% increase from 2021.\\nThe metro area population of Miami in 2021 was 6,167,000, a 0.74% increase from 2020.\\nThe metro area population of Miami in 2020 was 6,122,000, a 0.71% increase from 2019."}
{"index": {"_index": "my_test_data", "_id": "5"}}
{"text": "Chart and table of population level and growth rate for the Austin metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Austin in 2023 is 2,228,000, a 2.39% increase from 2022.\\nThe metro area population of Austin in 2022 was 2,176,000, a 2.79% increase from 2021.\\nThe metro area population of Austin in 2021 was 2,117,000, a 3.12% increase from 2020.\\nThe metro area population of Austin in 2020 was 2,053,000, a 3.43% increase from 2019."}
{"index": {"_index": "my_test_data", "_id": "6"}}
{"text": "Chart and table of population level and growth rate for the Seattle metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\nThe current metro area population of Seattle in 2023 is 3,519,000, a 0.86% increase from 2022.\\nThe metro area population of Seattle in 2022 was 3,489,000, a 0.81% increase from 2021.\\nThe metro area population of Seattle in 2021 was 3,461,000, a 0.82% increase from 2020.\\nThe metro area population of Seattle in 2020 was 3,433,000, a 0.79% increase from 2019."}
```
{% include copy-curl.html %}

## Step 4: Create a connector to an externally hosted model

You'll need an LLM to generate responses to user questions. An LLM is too large for an OpenSearch cluster, so you'll create a connection to an externally hosted LLM. For this example, you'll create a connector to the Anthropic Claude model hosted on Amazon Bedrock:

```json
POST /_plugins/_ml/connectors/_create
{
  "name": "BedRock test claude Connector",
  "description": "The connector to BedRock service for claude model",
  "version": 1,
  "protocol": "aws_sigv4",
  "parameters": {
      "region": "us-east-1",
      "service_name": "bedrock",
      "anthropic_version": "bedrock-2023-05-31",
      "endpoint": "bedrock.us-east-1.amazonaws.com",
      "auth": "Sig_V4",
      "content_type": "application/json",
      "max_tokens_to_sample": 8000,
      "temperature": 0.0001,
      "response_filter": "$.completion"
  },
  "credential": {
      "access_key": "<bedrock_access_key>",
      "secret_key": "<bedrock_secret_key>",
      "session_token": "<bedrock_session_token>"
  },
  "actions": [
    {
      "action_type": "predict",
      "method": "POST",
      "url": "https://bedrock-runtime.us-east-1.amazonaws.com/model/anthropic.claude-v2/invoke",
      "headers": { 
        "content-type": "application/json",
        "x-amz-content-sha256": "required"
      },
      "request_body": "{\"prompt\":\"${parameters.prompt}\", \"max_tokens_to_sample\":${parameters.max_tokens_to_sample}, \"temperature\":${parameters.temperature},  \"anthropic_version\":\"${parameters.anthropic_version}\" }"
    }
  ]
}
```
{% include copy-curl.html %}

The response contains the connector ID for the newly created connector:

```json
{
  "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```

## Step 5: Register and deploy the externally hosted model

Like the text embedding model, an LLM needs to be registered and deployed to OpenSearch. To set up the externally hosted model, first create a model group for this model:

```json
POST /_plugins/_ml/model_groups/_register
{
    "name": "test_model_group_bedrock",
    "description": "This is a public model group"
}
```
{% include copy-curl.html %}

The response contains the model group ID that you’ll use to register a model to this model group:

```json
{
 "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
 "status": "CREATED"
}

```

Next, register and deploy the externally hosted Claude model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
    "name": "Bedrock Claude V2 model",
    "function_name": "remote",
    "model_group_id": "wlcnb4kBJ1eYAeTMHlV6",
    "description": "test model",
    "connector_id": "a1eMb4kBJ1eYAeTMAljY"
}
```
{% include copy-curl.html %}

Similarly to [Step 1](#step-1-register-and-deploy-a-text-embedding-model), the response contains a task ID that you can use to check the status of the deployment. Once the model is deployed, the status changes to `COMPLETED` and the response includes the model ID for the Claude model:

```json
{
  "model_id": "NWR9YIsBUysqmzBdifVJ",
  "task_type": "REGISTER_MODEL",
  "function_name": "remote",
  "state": "COMPLETED",
  "worker_node": [
    "4p6FVOmJRtu3wehDD74hzQ"
  ],
  "create_time": 1694358489722,
  "last_update_time": 1694358499139,
  "is_async": true
}
```

To test the LLM, send the following predict request:

```json
POST /_plugins/_ml/models/NWR9YIsBUysqmzBdifVJ/_predict
{
  "parameters": {
    "prompt": "\n\nHuman:hello\n\nAssistant:"
  }
}
```
{% include copy-curl.html %}

## Step 6: Register and execute an agent

Finally, you'll use the text embedding model created in Step 1 and the Claude model created in Step 5 to create a flow agent. This flow agent will run a `VectorDBTool` and then an `MLModelTool`. The `VectorDBTool` is configured with the model ID for the text embedding model created in Step 1 for vector search. The `MLModelTool` is configured with the Claude model created in step 5:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_RAG",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "type": "VectorDBTool",
      "parameters": {
        "model_id": "aVeif4oB5Vm0Tdw8zYO2",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": ["text"],
        "input": "${parameters.question}"
      }
    },
    {
      "type": "MLModelTool",
      "description": "A general tool to answer any question",
      "parameters": {
        "model_id": "NWR9YIsBUysqmzBdifVJ",
        "prompt": "\n\nHuman:You are a professional data analyst. You will always answer a question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say you don't know. \n\n Context:\n${parameters.VectorDBTool.output}\n\nHuman:${parameters.question}\n\nAssistant:"
      }
    }
  ]
}
```
{% include copy-curl.html %}

OpenSearch returns an agent ID for the newly created agent:

```json
{
  "agent_id": "879v9YwBjWKCe6Kg12Tx"
}
```

You can inspect the agent by sending a request to the `agents` endpoint and providing the agent ID:

```json
GET /_plugins/_ml/agents/879v9YwBjWKCe6Kg12Tx
```
{% include copy-curl.html %}

To execute the agent, send the following request. When registering the agent, you configured it to take in `parameters.question`, so you need to provide this parameter in the request. This parameter represents a human-generated user question:

```json
POST /_plugins/_ml/agents/879v9YwBjWKCe6Kg12Tx/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023"
  }
}
```
{% include copy-curl.html %}

The LLM does not have the recent information in its knowledge base, so it infers the response to the question based on the ingested data, demonstrating RAG:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "result": """ Based on the given context, the key information is:

The metro area population of Seattle in 2021 was 3,461,000.
The metro area population of Seattle in 2023 is 3,519,000.

To calculate the population increase from 2021 to 2023:

Population in 2023 (3,519,000) - Population in 2021 (3,461,000) = 58,000

Therefore, the population increase of Seattle from 2021 to 2023 is 58,000."""
        }
      ]
    }
  ]
}
```
