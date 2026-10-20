---
layout: default
title: RAG tool
has_children: false
has_toc: false
nav_order: 65
parent: Tools
grand_parent: Agents and tools
---

<!-- vale off -->
# RAG tool
**Introduced 2.13**
{: .label .label-purple }
<!-- vale on -->

The `RAGTool` performs retrieval-augmented generation (RAG). For more information about RAG, see [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/).

RAG calls a large language model (LLM) and supplements its knowledge by providing relevant OpenSearch documents along with the user question. To retrieve relevant documents from an OpenSearch index, you'll need a text embedding model that facilitates vector search.

The RAG tool supports the following search methods:

- [Neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/): Dense vector retrieval, which uses a text embedding model.
- [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/): Sparse vector retrieval, which uses a sparse encoding model.

## Before you start

To register and deploy a text embedding model and an LLM and ingest data into an index, perform Steps 1--5 of the [Agents and tools tutorial]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents-tools-tutorial/).

The following example uses neural search. To configure neural sparse search and deploy a sparse encoding model, see [Neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

<!-- vale off -->
## Step 1: Register a flow agent that will run the RAGTool
<!-- vale on -->

A flow agent runs a sequence of tools in order and returns the last tool's output. Content generation is enabled by default, so the `RAGTool` sends the retrieved documents and the question to the LLM. To create a flow agent, send the following request, providing the text embedding model ID in the `embedding_model_id` parameter and the LLM model ID in the `inference_model_id` parameter:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_RagTool",
  "type": "flow",
  "description": "this is a test flow agent",
  "tools": [
  {
    "type": "RAGTool",
    "description": "A description of the tool",
    "parameters": {
      "embedding_model_id": "Hv_PY40Bk4MTqircAVmm",
      "inference_model_id": "SNzSY40B_1JGmyB0WbfI",
      "index": "my_test_data",
      "embedding_field": "embedding",
      "query_type": "neural",
      "source_field": [
        "text"
      ],
      "input": "${parameters.question}",
      "prompt": "You are a professional data analyst. You will always answer question based on the given context first. If the answer is not directly shown in the context, you will analyze the data and find the answer. If you don't know the answer, just say don't know. \n\nContext:\n${parameters.output_field}\n\nQuestion: ${parameters.question}"
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

To create a conversational agent containing a `RAGTool`, see [Conversational agents]({{site.url}}{{site.baseurl}}/ml-commons-plugin/agents-tools/agents/conversational/).

## Step 2: Run the agent

Run the agent by sending the following request:

```json
POST /_plugins/_ml/agents/9X7xWI0Bpc3sThaJdY9i/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023"
  }
}
```
{% include copy-curl.html %} 

OpenSearch performs vector search, sends the retrieved documents and the question to the LLM, and returns the LLM response:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "Using the context, Seattle's metro area population was:\n\n- 2021: 3,461,000\n- 2023: 3,519,000\n\n**Increase from 2021 to 2023:** 3,519,000 − 3,461,000 = **58,000 people**\n\nThat is about a 1.68% increase over the two years (58,000 ÷ 3,461,000)."
        }
      ]
    }
  ]
}
```

## Step 3 (Optional): Return the retrieved documents without content generation

To return the retrieved documents without calling the LLM, set `enable_content_generation` to `false` in the tool parameters. The LLM parameters `inference_model_id` and `prompt` are not needed in this case. Register a flow agent by sending the following request:

```json
POST /_plugins/_ml/agents/_register
{
  "name": "Test_Agent_For_RagTool_Search_Only",
  "type": "flow",
  "description": "this is a test flow agent",
  "tools": [
  {
    "type": "RAGTool",
    "description": "A description of the tool",
    "parameters": {
      "embedding_model_id": "Hv_PY40Bk4MTqircAVmm",
      "index": "my_test_data",
      "embedding_field": "embedding",
      "query_type": "neural",
      "source_field": [
        "text"
      ],
      "input": "${parameters.question}",
      "enable_content_generation": false
    }
  }
]
}
```
{% include copy-curl.html %}

OpenSearch responds with an agent ID:

```json
{
  "agent_id": "Gn8yWI0Bpc3sThaJeZ2k"
}
```

Run the agent using the same question:

```json
POST /_plugins/_ml/agents/Gn8yWI0Bpc3sThaJeZ2k/_execute
{
  "parameters": {
    "question": "what's the population increase of Seattle from 2021 to 2023"
  }
}
```
{% include copy-curl.html %}

The `result` field contains the retrieved documents, one search hit per line:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "response",
          "result": "{\"_index\":\"my_test_data\",\"_source\":{\"text\":\"Chart and table of population level and growth rate for the Seattle metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\\\nThe current metro area population of Seattle in 2023 is 3,519,000, a 0.86% increase from 2022.\\\\nThe metro area population of Seattle in 2022 was 3,489,000, a 0.81% increase from 2021.\\\\nThe metro area population of Seattle in 2021 was 3,461,000, a 0.82% increase from 2020.\\\\nThe metro area population of Seattle in 2020 was 3,433,000, a 0.79% increase from 2019.\"},\"_id\":\"6\",\"_score\":0.8882475}\n{\"_index\":\"my_test_data\",\"_source\":{\"text\":\"Chart and table of population level and growth rate for the New York City metro area from 1950 to 2023. United Nations population projections are also included through the year 2035.\\\\nThe current metro area population of New York City in 2023 is 18,937,000, a 0.37% increase from 2022.\\\\nThe metro area population of New York City in 2022 was 18,867,000, a 0.23% increase from 2021.\\\\nThe metro area population of New York City in 2021 was 18,823,000, a 0.1% increase from 2020.\\\\nThe metro area population of New York City in 2020 was 18,804,000, a 0.01% decline from 2019.\"},\"_id\":\"2\",\"_score\":0.7471547}\n"
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
`embedding_model_id` | String | Required | The model ID of the model to use for generating vector embeddings.
`inference_model_id` | String | Required if `enable_content_generation` is `true` | The model ID of the LLM to use for inference.
`index` | String | Required | The index from which to retrieve relevant documents to pass to the LLM.
`embedding_field` | String | Required | When the model encodes raw text documents, the encoding result is saved in a field. Specify this field as the `embedding_field`. Neural search matches documents to the query by calculating the similarity score between the query text and the text in the document's `embedding_field`.
`source_field` | String | Required | The document field or fields to return. You can provide a list of multiple fields as an array of strings, for example, `["field1", "field2"]`.
`input` | String | Required for flow agent | Runtime input sourced from flow agent parameters. If using an LLM, this field is populated with the LLM response.
`query_type` | String | Optional | Specifies the type of query to run to perform neural search. Valid values are `neural` (for dense retrieval) and `neural_sparse` (for sparse retrieval). Default is `neural`.
`doc_size` | Integer | Optional | The number of documents to fetch. Default is `2`.
`prompt` | String | Optional | The prompt to provide to the LLM. To insert the retrieved documents into the prompt, use the `${parameters.output_field}` placeholder.
`k` | Integer | Optional | The number of nearest neighbors to search for when performing neural search. Default is 10.
`enable_content_generation` | Boolean | Optional | If `true`, returns results generated by an LLM. If `false`, returns results directly without LLM-assisted content generation. Default is `true`.
`nested_path` | String | Optional | The path to the nested object for the nested query. Only used for nested fields. Default is `null`.

## Execute parameters

The following table lists all tool parameters that are available when running the agent.

Parameter	| Type | Required/Optional | Description	
:--- | :--- | :--- | :---
`question` | String | Required | The natural language question to send to the LLM. 

## Testing the tool

You can run this tool either as part of an agent workflow or independently using the [Execute Tool API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/execute-tool/). The Execute Tool API is useful for testing individual tools or performing standalone operations.