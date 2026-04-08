---
layout: default
title: Workflow templates
nav_order: 25
canonical_url: https://docs.opensearch.org/latest/automating-configurations/workflow-templates/
---

# Workflow templates

OpenSearch provides several workflow templates for some common machine learning (ML) use cases. Using a template simplifies complex setups and provides many default values for use cases like semantic or conversational search. 

You can specify a workflow template when you call the [Create Workflow API]({{site.url}}{{site.baseurl}}/automating-configurations/api/create-workflow/):

- To use an OpenSearch-provided workflow template, specify the template use case as the `use_case` query parameter (see the [Example](#example)). For a list of OpenSearch-provided templates, see [Supported workflow templates](#supported-workflow-templates).

- To use a custom workflow template, provide the complete template in the request body. For an example of a custom template, see [an example JSON template]({{site.url}}{{site.baseurl}}/automating-configurations/api/create-workflow/#example-request-register-and-deploy-a-remote-model-json) or [an example YAML template]({{site.url}}{{site.baseurl}}/automating-configurations/api/create-workflow/#example-request-register-and-deploy-an-externally-hosted-model-yaml). 

To provision the workflow, specify `provision=true` as a query parameter. 

## Example

In this example, you'll configure the `semantic_search_with_cohere_embedding_query_enricher` workflow template. The workflow created using this template performs the following configuration steps:

- Deploys an externally hosted Cohere model
- Creates an ingest pipeline using the model
- Creates a sample vector index and configures a search pipeline to define the default model ID for that index

### Step 1: Create and provision the workflow

Send the following request to create and provision a workflow using the `semantic_search_with_cohere_embedding_query_enricher` workflow template. The only required request body field for this template is the API key for the Cohere Embed model:

```json
POST /_plugins/_flow_framework/workflow?use_case=semantic_search_with_cohere_embedding_query_enricher&provision=true
{
    "create_connector.credential.key" : "<YOUR API KEY>"
}
```
{% include copy-curl.html %}

OpenSearch responds with a workflow ID for the created workflow:

```json
{
  "workflow_id" : "8xL8bowB8y25Tqfenm50"
}
```

The workflow in the previous step creates a default vector index. The default index name is `my-nlp-index`:

```json
{
  "create_index.name": "my-nlp-index"
}
```

For all default parameter values for this workflow template, see [Cohere Embed semantic search defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/cohere-embedding-semantic-search-defaults.json).

### Step 2: Ingest documents into the index 

To ingest documents into the index created in the previous step, send the following request:

```json
PUT /my-nlp-index/_doc/1
{
  "passage_text": "Hello world",
  "id": "s1"
}
```
{% include copy-curl.html %}

### Step 3: Perform vector search

To perform a vector search on your index, use a [`neural` query]({{site.url}}{{site.baseurl}}/query-dsl/specialized/neural/) clause:

```json
GET /my-nlp-index/_search
{
  "_source": {
    "excludes": [
      "passage_embedding"
    ]
  },
  "query": {
    "neural": {
      "passage_embedding": {
        "query_text": "Hi world",
        "k": 100
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

Each workflow template has a defined schema and a set of APIs with predefined default values for each step. For more information about template parameter defaults, see [Supported workflow templates](#supported-workflow-templates).

### Overriding default values

To override a template's default values, provide the new values in the request body when sending a create workflow request. For example, the following request changes the Cohere model, the name of the `text_embedding` processor output field, and the name of the sparse index of the `semantic_search_with_cohere_embedding` template:

```json
POST /_plugins/_flow_framework/workflow?use_case=semantic_search_with_cohere_embedding
{
    "create_connector.model" : "embed-multilingual-v3.0",
    "text_embedding.field_map.output": "book_embedding",
    "create_index.name": "sparse-book-index"
}
```
{% include copy-curl.html %}

## Viewing workflow resources

The workflow you created provisioned all the necessary resources for semantic search. To view the provisioned resources, call the [Get Workflow Status API]({{site.url}}{{site.baseurl}}/automating-configurations/api/get-workflow-status/) and provide the `workflowID` for your workflow:

```json
GET /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_status
```
{% include copy-curl.html %}

## Supported workflow templates

To use a workflow template, specify it in the `use_case` query parameter when creating a workflow. The following templates are supported:

<details open markdown="block">
  <summary>
    The following templates are supported:
  </summary>

- Model deployment templates:
  - [Amazon Bedrock Titan embedding](#amazon-bedrock-titan-embedding)
  - [Amazon Bedrock Titan multimodal](#amazon-bedrock-titan-multimodal)
  - [Cohere embedding](#cohere-embedding)
  - [Cohere chat](#cohere-chat)
  - [OpenAI embedding](#openai-embedding)
  - [OpenAI chat](#openai-chat)
- Semantic search templates:
  - [Semantic search](#semantic-search)
  - [Semantic search with a query enricher](#semantic-search-with-a-query-enricher)
  - [Semantic search using a local model](#semantic-search-using-a-local-model)
  - [Semantic search using a Cohere embedding model](#semantic-search-using-a-cohere-embedding-model)
  - [Semantic search using Cohere embedding models with a query enricher](#semantic-search-using-cohere-embedding-models-with-a-query-enricher)
  - [Semantic search using Cohere embedding models with reindexing](#semantic-search-using-cohere-embedding-models-with-reindexing)
- Neural sparse search templates:
  - [Neural sparse search](#neural-sparse-search)
- Multimodal search templates:
  - [Multimodal search](#multimodal-search)
  - [Multimodal search using Amazon Bedrock Titan](#multimodal-search-using-amazon-bedrock-titan)
- Hybrid search templates:
  - [Hybrid search](#hybrid-search)
  - [Hybrid search using a local model](#hybrid-search-using-a-local-model)
- Conversational search templates:
  - [Conversational search using an LLM](#conversational-search-using-an-llm)

</details>

## Model deployment templates

The following workflow templates configure model deployment.

### Amazon Bedrock Titan embedding

This workflow creates and deploys an Amazon Bedrock embedding model (by default, `titan-embed-text-v1`).

- **Use case**: `bedrock_titan_embedding_model_deploy`
- **Created components**: A connector and model for the Amazon Bedrock Titan embeddings model
- **Required parameters**: 
  - `create_connector.credential.access_key`
  - `create_connector.credential.secret_key`
  - `create_connector.credential.session_token`
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)

**Note**: Requires AWS credentials and access to Amazon Bedrock.

### Amazon Bedrock Titan multimodal

This workflow creates and deploys an Amazon Bedrock multimodal embedding model (by default, `titan-embed-image-v1`).

- **Use case**: `bedrock_titan_multimodal_model_deploy`
- **Created components**: A connector and model for Amazon Bedrock Titan multimodal embeddings
- **Required parameters**: 
  - `create_connector.credential.access_key`
  - `create_connector.credential.secret_key`
  - `create_connector.credential.session_token`
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/bedrock-titan-multimodal-defaults.json)

**Note**: Requires AWS credentials and access to Amazon Bedrock.

### Cohere embedding

This workflow creates and deploys a Cohere embedding model (by default, `embed-english-v3.0`).

- **Use case**: `cohere_embedding_model_deploy`
- **Created components**: A connector and model for Cohere embedding
- **Required parameters**: 
  - `create_connector.credential.key`
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/cohere-embedding-defaults.json)

**Note**: Requires a Cohere API key.

### Cohere chat

This workflow creates and deploys a Cohere chat model (by default, Cohere Command).

- **Use case**: `cohere_chat_model_deploy`
- **Created components**: A connector and model for Cohere chat
- **Required parameters**: 
  - `create_connector.credential.key`
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/cohere-chat-defaults.json)

**Note**: Requires a Cohere API key.

### OpenAI embedding

This workflow creates and deploys an OpenAI embedding model (by default, `text-embedding-ada-002`).

- **Use case**: `open_ai_embedding_model_deploy`
- **Created components**: A connector and model for OpenAI embeddings
- **Required parameters**: 
  - `create_connector.credential.key`
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/openai-embedding-defaults.json)

**Note**: Requires an OpenAI API key.

### OpenAI chat

This workflow creates and deploys an OpenAI chat model (by default, `gpt-3.5-turbo`).

- **Use case**: `openai_chat_model_deploy`
- **Created components**: A connector and model for OpenAI chat
- **Required parameters**: 
  - `create_connector.credential.key`
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/openai-chat-defaults.json)

**Note**: Requires an OpenAI API key.

## Semantic search templates

The following workflow templates configure semantic search.

### Semantic search

This workflow configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/).

- **Use case**: `semantic_search`
- **Created components**: 
  - An ingest pipeline with a `text_embedding` processor
  - A vector index configured with the pipeline
- **Required parameters**: 
  - `create_ingest_pipeline.model_id`: The model ID of the text embedding model to be used
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/semantic-search-defaults.json)

### Semantic search with a query enricher

This workflow configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) with a default model for neural queries.

- **Use case**: `semantic_search_with_query_enricher`
- **Created components**: 
  - An ingest pipeline with a `text_embedding` processor
  - A vector index configured with the pipeline
  - A [`query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) search processor that sets a default model ID for neural queries.
- **Required parameters**: 
  - `create_ingest_pipeline.model_id`: The model ID of the text embedding model to be used
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/semantic-search-query-enricher-defaults.json)

### Semantic search using a local model

This workflow configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) and deploys a pretrained model.

- **Use case**: `semantic_search_with_local_model`
- **Created components**:
  - A pretrained model (by default, `huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2`)
  - An ingest pipeline with a `text_embedding` processor
  - A vector index configured with the pipeline
  - A [`query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) search processor that sets a default model ID for neural queries.
- **Required parameters**: None
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/semantic-search-with-local-model-defaults.json)

**Note**: Uses a local pretrained model with a default configuration.

### Semantic search using a Cohere embedding model

This workflow configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) and deploys a Cohere embedding model.

- **Use case**: `semantic_search_with_cohere_embedding`
- **Created components**:
  - A Cohere embedding model (by default, `embed-english-v3.0`) connector and deployment
  - An ingest pipeline with a `text_embedding` processor
  - A vector index configured with the pipeline
- **Required parameters**:
  - `create_connector.credential.key`: API key for the Cohere model
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/cohere-embedding-semantic-search-defaults.json)

**Note**: Requires a Cohere API key.

### Semantic search using Cohere embedding models with a query enricher

This workflow configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/), deploys a Cohere embedding model, and adds a query enricher search processor.

- **Use case**: `semantic_search_with_cohere_embedding_query_enricher`
- **Created components**:
  - A Cohere embedding model connector and deployment
  - An ingest pipeline with a `text_embedding` processor
  - A vector index configured with the pipeline
  - A [`query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) search processor that sets a default model ID for neural queries.
- **Required parameters**:
  - `create_connector.credential.key`: API key for the Cohere model
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/cohere-embedding-semantic-search-with-query-enricher-defaults.json)

**Note**: Requires a Cohere API key. 

### Semantic search using Cohere embedding models with reindexing

This workflow configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) with a Cohere embedding model and reindexes an existing index.

- **Use case**: `semantic_search_with_reindex`
- **Created components**:
  - A Cohere embedding model connector and deployment
  - A vector index configured with the pipeline
  - A reindexing process
- **Required parameters**:
  - `create_connector.credential.key`: API key for the Cohere model
  - `reindex.source_index`: The source index to be reindexed
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/semantic-search-with-reindex-defaults.json)

**Note**: Reindexes a source index into a newly configured k-NN index using a Cohere embedding model.

## Neural sparse search templates

The following workflow template configures [neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

### Neural sparse search

This workflow configures [neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

- **Use case**: `local_neural_sparse_search_bi_encoder`
- **Created components**: 
  - A locally hosted pretrained sparse encoding model (by default, `amazon/neural-sparse/opensearch-neural-sparse-encoding-v1`)
  - An ingest pipeline with a `sparse_encoding` processor
  - A vector index configured with the pipeline
- **Required parameters**: None
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/local-sparse-search-biencoder-defaults.json)

## Multimodal search templates

The following workflow templates configure [multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/multimodal-search/).

### Multimodal search

This workflow configures [multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/multimodal-search/).

- **Use case**: `multimodal_search`
- **Created components**: 
  - An ingest pipeline with a `text_image_embedding` processor
  - A vector index configured with the pipeline
- **Required parameters**: 
  - `create_ingest_pipeline.model_id`: The model ID of the multimodal embedding model to be used
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/multi-modal-search-defaults.json)

### Multimodal search using Amazon Bedrock Titan

This workflow deploys an Amazon Bedrock multimodal model and configures a multimodal search pipeline.

- **Use case**: `multimodal_search_with_bedrock_titan`
- **Created components**:
  - An Amazon Bedrock Titan multimodal embedding model connector and deployment
  - An ingest pipeline with a `text_image_embedding` processor
  - A vector index for multimodal search configured with the pipeline
- **Required parameters**:
  - `create_connector.credential.access_key`
  - `create_connector.credential.secret_key`
  - `create_connector.credential.session_token`
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/multimodal-search-bedrock-titan-defaults.json)

**Note**: Requires AWS credentials and access to Amazon Bedrock.

## Hybrid search templates

The following workflow templates configure [hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/).

### Hybrid search

This workflow configures [hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/).

- **Use case**: `hybrid_search`
- **Created components**: 
  - An ingest pipeline
  - A vector index configured with the pipeline
  - A search pipeline with a `normalization_processor`
- **Required parameters**: 
  - `create_ingest_pipeline.model_id`: The model ID of the text embedding model to be used
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/hybrid-search-defaults.json)

### Hybrid search using a local model

This workflow configures hybrid search and deploys a pretrained model.

- **Use case**: `hybrid_search_with_local_model`
- **Created components**:
  - A pretrained model (by default, `huggingface/sentence-transformers/paraphrase-MiniLM-L3-v2`)
  - An ingest pipeline
  - A vector index configured with the pipeline
  - A search pipeline with a `normalization_processor`
- **Required parameters**: None
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/hybrid-search-with-local-model-defaults.json)

**Note**: Uses a local pretrained model for hybrid search configuration.

## Conversational search templates

The following workflow template configures [conversational search with RAG]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/).

### Conversational search using an LLM

This workflow deploys a large language model and configures a conversational search pipeline.

- **Use case**: `conversational_search_with_llm_deploy`
- **Created components**:
  - A chat model (by default, Cohere Command) connector and deployment
  - A search pipeline with a `retrieval_augmented_generation` processor
- **Required parameters**:
  - `create_connector.credential.key`: API key for the LLM
- [Defaults](https://github.com/opensearch-project/flow-framework/blob/main/src/main/resources/defaults/conversational-search-defaults.json)

**Note**: Requires an API key for the chosen language model.
