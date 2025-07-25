---
layout: default
title: Vector DB tool
has_children: false
has_toc: false
nav_order: 110
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/vector-db-tool/
---

<!-- vale off -->
# Vector DB tool
**Introduced 2.13**
{: .label .label-purple }
<!-- vale on -->

The `VectorDBTool` performs dense vector retrieval. For more information about OpenSearch vector database capabilities, see [neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/).

## Step 1: Register and deploy a sparse encoding model

OpenSearch supports several pretrained models. You can use one of those models, use your own custom model, or create a connector for an externally hosted model. For a list of supported pretrained models, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/). For more information about custom models, see [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/). For information about integrating an externally hosted model, see [Connecting to externally hosted models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/). 

In this example, you'll use the `huggingface/sentence-transformers/all-MiniLM-L12-v2` pretrained model for both ingestion and search. To register and deploy the model to OpenSearch, send the following request:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "huggingface/sentence-transformers/all-MiniLM-L12-v2",
  "version": "1.0.2",
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %} 

OpenSearch responds with a task ID for the model registration and deployment task:

```json
{
  "task_id": "M_9KY40Bk4MTqirc5lP8",
  "status": "CREATED"
}
```

You can monitor the status of the task by calling the Tasks API:

```json
GET _plugins/_ml/tasks/M_9KY40Bk4MTqirc5lP8
```
{% include copy-curl.html %} 

Once the model is registered and deployed, the task `state` changes to `COMPLETED` and OpenSearch returns a model ID for the model:

```json
{
  "model_id": "Hv_PY40Bk4MTqircAVmm",
  "task_type": "REGISTER_MODEL",
  "function_name": "TEXT_EMBEDDING",
  "state": "COMPLETED",
  "worker_node": [
    "UyQSTQ3nTFa3IP6IdFKoug"
  ],
  "create_time": 1706767869692,
  "last_update_time": 1706767935556,
  "is_async": true
}
```

## Step 2: Ingest data into an index

First, you'll set up an ingest pipeline to encode documents using the sparse encoding model set up in the previous step:

```json
PUT /_ingest/pipeline/test-pipeline-local-model
{
  "description": "text embedding pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "Hv_PY40Bk4MTqircAVmm",
        "field_map": {
          "text": "embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %} 

Next, create a k-NN index specifying the pipeline as the default pipeline:

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

Last, ingest data into the index by sending a bulk request:

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

## Step 3: Register a flow agent that will run the VectorDBTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following request, providing the model ID for the model set up in Step 1. This model will encode your queries into vector embeddings:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_VectorDB",
  "type": "flow",
  "description": "this is a test agent",
  "tools": [
    {
      "type": "VectorDBTool",
      "parameters": {
        "model_id": "Hv_PY40Bk4MTqircAVmm",
        "index": "my_test_data",
        "embedding_field": "embedding",
        "source_field": ["text"],
        "input": "${parameters.question}"
      }
    }
  ]
}
```
{% include copy-curl.html %} 

For parameter descriptions, see [Register parameters](#register-parameters).

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "9X7xWI0Bpc3sThaJdY9i"
}
```

## Step 4: Run the agent

Before you run the agent, make sure that you add the sample OpenSearch Dashboards `Sample web logs` dataset. To learn more, see [Adding sample data]({{site.url}}{{site.baseurl}}/dashboards/quickstart#adding-sample-data).

Then, run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023"
  }
}
```
{% include copy-curl.html %} 

OpenSearch performs vector search and returns the relevant documents:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """{"_index":"my_test_data","_source":{"text":"Chart and table of population level and growth rate for the Seattle metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\n
          The current metro area population of Seattle in 2023 is 3,519,000, a 0.86% increase from 2022.\\n
          The metro area population of Seattle in 2022 was 3,489,000, a 0.81% increase from 2021.\\n
          The metro area population of Seattle in 2021 was 3,461,000, a 0.82% increase from 2020.\\n
          The metro area population of Seattle in 2020 was 3,433,000, a 0.79% increase from 2019."},"_id":"6","_score":0.8173238}
        {"_index":"my_test_data","_source":{"text":"Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\n
        The current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\n
        The metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\n
        The metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\n
        The metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019."},"_id":"2","_score":0.6641471}
        """
        }
      ]
    }
  ]
}
```

## Register parameters

The following table lists all tool parameters that are available when registering an agent. 

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`model_id` | String | Required | The model ID of the model to use at search time.
`index` | String | Required | The index to search.
`embedding_field` | String | Required | When the model encodes raw text documents, the encoding result is saved in a field. Specify this field as the `embedding_field`. Neural search matches documents to the query by calculating the similarity score between the query text and the text in the document's `embedding_field`.
`source_field` | String | Required | The document field or fields to return. You can provide a list of multiple fields as an array of strings, for example, `["field1", "field2"]`.
`input` | String | Required for flow agent | Runtime input sourced from flow agent parameters. If using a large language model (LLM), this field is populated with the LLM response.
`doc_size` | Integer | Optional | The number of documents to fetch. Default is `2`.
`k` | Integer | Optional | The number of nearest neighbors to search for when performing neural search. Default is `10`.
`nested_path` | String | Optional | The path to the nested object for the nested query. Only used for nested fields. Default is `null`.

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 
