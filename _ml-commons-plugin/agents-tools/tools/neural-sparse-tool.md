---
layout: default
title: Neural Sparse Search tool
has_children: false
has_toc: false
nav_order: 50
parent: Tools
grand_parent: Agents and tools
canonical_url: https://docs.opensearch.org/latest/ml-commons-plugin/agents-tools/tools/neural-sparse-tool/
---

<!-- vale off -->
# Neural Sparse Search tool
**Introduced 2.13**
{: .label .label-purple }
<!-- vale on -->

The `NeuralSparseSearchTool` performs sparse vector retrieval. For more information about neural sparse search, see [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

## Step 1: Register and deploy a sparse encoding model

OpenSearch supports several pretrained sparse encoding models. You can either use one of those models or your own custom model. For a list of supported pretrained models, see [Sparse encoding models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#sparse-encoding-models). For more information, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/) and [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/). 

In this example, you'll use the `amazon/neural-sparse/opensearch-neural-sparse-encoding-v1` pretrained model for both ingestion and search. To register and deploy the model to OpenSearch, send the following request:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-v1",
  "version": "1.0.1",
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
  "model_id": "Nf9KY40Bk4MTqirc6FO7",
  "task_type": "REGISTER_MODEL",
  "function_name": "SPARSE_ENCODING",
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
PUT /_ingest/pipeline/pipeline-sparse
{
  "description": "An sparse encoding ingest pipeline",
  "processors": [
    {
      "sparse_encoding": {
        "model_id": "Nf9KY40Bk4MTqirc6FO7",
        "field_map": {
          "passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %} 

Next, create an index specifying the pipeline as the default pipeline:

```json
PUT index_for_neural_sparse
{
  "settings": {
    "default_pipeline": "pipeline-sparse"
  },
  "mappings": {
    "properties": {
      "passage_embedding": {
        "type": "rank_features"
      },
      "passage_text": {
        "type": "text"
      }
    }
  }
}
```
{% include copy-curl.html %} 

Last, ingest data into the index by sending a bulk request:

```json
POST _bulk
{ "index" : { "_index" : "index_for_neural_sparse", "_id" : "1" } }
{ "passage_text" : "company AAA has a history of 123 years" }
{ "index" : { "_index" : "index_for_neural_sparse", "_id" : "2" } }
{ "passage_text" : "company AAA has over 7000 employees" }
{ "index" : { "_index" : "index_for_neural_sparse", "_id" : "3" } }
{ "passage_text" : "Jack and Mark established company AAA" }
{ "index" : { "_index" : "index_for_neural_sparse", "_id" : "4" } }
{ "passage_text" : "company AAA has a net profit of 13 millions in 2022" }
{ "index" : { "_index" : "index_for_neural_sparse", "_id" : "5" } }
{ "passage_text" : "company AAA focus on the large language models domain" }
```
{% include copy-curl.html %} 

## Step 3: Register a flow agent that will run the NeuralSparseSearchTool

A flow agent runs a sequence of tools in order and returns the last tool's output. To create a flow agent, send the following request, providing the model ID for the model set up in Step 1. This model will encode your queries into sparse vector embeddings:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Neural_Sparse_Agent_For_RAG",
  "type": "flow",
  "tools": [
    {
      "type": "NeuralSparseSearchTool",
      "parameters": {
        "description":"use this tool to search data from the knowledge base of company AAA",
        "model_id": "Nf9KY40Bk4MTqirc6FO7",
        "index": "index_for_neural_sparse",
        "embedding_field": "passage_embedding",
        "source_field": ["passage_text"],
        "input": "${parameters.question}",
        "doc_size":2
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
    "question":"how many employees does AAA have?"
  }
}
```
{% include copy-curl.html %} 

OpenSearch returns the inference results:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": """{"_index":"index_for_neural_sparse","_source":{"passage_text":"company AAA has over 7000 employees"},"_id":"2","_score":30.586042}
{"_index":"index_for_neural_sparse","_source":{"passage_text":"company AAA has a history of 123 years"},"_id":"1","_score":16.088133}
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
`model_id` | String | Required | The model ID of the sparse encoding model to use at search time.
`index` | String | Required | The index to search.
`embedding_field` | String | Required | When the neural sparse model encodes raw text documents, the encoding result is saved in a field. Specify this field as the `embedding_field`. Neural sparse search matches documents to the query by calculating the similarity score between the query text and the text in the document's `embedding_field`.
`source_field` | String | Required | The document field or fields to return. You can provide a list of multiple fields as an array of strings, for example, `["field1", "field2"]`.
`input` | String | Required for flow agent | Runtime input sourced from flow agent parameters. If using a large language model (LLM), this field is populated with the LLM response.
`name` | String  | Optional | The tool name. Useful when an LLM needs to select an appropriate tool for a task.
`description` | String | Optional | A description of the tool. Useful when an LLM needs to select an appropriate tool for a task.
`doc_size` | Integer | Optional | The number of documents to fetch. Default is `2`.

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 
