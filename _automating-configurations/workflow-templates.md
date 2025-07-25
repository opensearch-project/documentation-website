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
- Creates a sample k-NN index and configures a search pipeline to define the default model ID for that index

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

The workflow in the previous step creates a default k-NN index. The default index name is `my-nlp-index`:

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

The following table lists the supported workflow templates. To use a workflow template, specify it in the `use_case` query parameter when creating a workflow.

| Template use case  | Description | Required parameters | Defaults |
| `bedrock_titan_embedding_model_deploy`  | Creates and deploys an Amazon Bedrock embedding model (by default, `titan-embed-text-v1`).| `create_connector.credential.access_key`, `create_connector.credential.secret_key`, `create_connector.credential.session_token` |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)|
| `bedrock_titan_multimodal_model_deploy` | Creates and deploys an Amazon Bedrock multimodal embedding model (by default, `titan-embed-image-v1`).  | `create_connector.credential.access_key`, `create_connector.credential.secret_key`, `create_connector.credential.session_token` |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-multimodal-defaults.json). |
| `cohere_embedding_model_deploy`| Creates and deploys a Cohere embedding model (by default, `embed-english-v3.0`).   | `create_connector.credential.key`         |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/cohere-embedding-defaults.json)                  |
| `cohere_chat_model_deploy` | Creates and deploys a Cohere chat model (by default, Cohere Command).     | `create_connector.credential.key`         |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/cohere-chat-defaults.json)                  |
| `open_ai_embedding_model_deploy` | Creates and deploys an OpenAI embedding model (by default, `text-embedding-ada-002`).  | `create_connector.credential.key`         |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/openai-embedding-defaults.json)                  |
| `openai_chat_model_deploy`  | Creates and deploys an OpenAI chat model (by default, `gpt-3.5-turbo`).   | `create_connector.credential.key`         |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/openai-chat-defaults.json)                  |
| `local_neural_sparse_search_bi_encoder`  | Configures [neural sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/): <br> - Deploys a pretrained sparse encoding model.<br> - Creates an ingest pipeline with a sparse encoding processor. <br> - Creates a sample index to use for sparse search, specifying the newly created pipeline as the default pipeline.  | None            |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/local-sparse-search-biencoder-defaults.json)                  |
| `semantic_search`                                      | Configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/): <br> - Creates an ingest pipeline with a `text_embedding` processor and a k-NN index <br> You must provide the model ID of the text embedding model to be used. | `create_ingest_pipeline.model_id`        |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/semantic-search-defaults.json)                  |
| `semantic_search_with_query_enricher` | Configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) similarly to the `semantic_search` template. Adds a [`query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) search processor that sets a default model ID for neural queries. You must provide the model ID of the text embedding model to be used. | `create_ingest_pipeline.model_id`        |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/semantic-search-query-enricher-defaults.json)                  |
| `semantic_search_with_cohere_embedding` | Configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) and deploys a Cohere embedding model. You must provide the API key for the Cohere model.  | `create_connector.credential.key`         |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/cohere-embedding-semantic-search-defaults.json)                  |
| `semantic_search_with_cohere_embedding_query_enricher` | Configures [semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/) and deploys a Cohere embedding model. Adds a [`query_enricher`]({{site.url}}{{site.baseurl}}/search-plugins/search-pipelines/neural-query-enricher/) search processor that sets a default model ID for neural queries. You must provide the API key for the Cohere model.  | `create_connector.credential.key`         |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/cohere-embedding-semantic-search-with-query-enricher-defaults.json)                  |
| `multimodal_search`  | Configures an ingest pipeline with a `text_image_embedding` processor and a k-NN index for [multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/multimodal-search/). You must provide the model ID of the multimodal embedding model to be used. | `create_ingest_pipeline.model_id`       |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/multi-modal-search-defaults.json)                  |
| `multimodal_search_with_bedrock_titan`    | Deploys an Amazon Bedrock multimodal model and configures an ingest pipeline with a `text_image_embedding` processor and a k-NN index for [multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/multimodal-search/). You must provide your AWS credentials. | `create_connector.credential.access_key`, `create_connector.credential.secret_key`, `create_connector.credential.session_token` |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/multimodal-search-bedrock-titan-defaults.json)                  |
| `hybrid_search`  | Configures [hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/): <br> - Creates an ingest pipeline, a k-NN index, and a search pipeline with a `normalization_processor`. You must provide the model ID of the text embedding model to be used. | `create_ingest_pipeline.model_id`        |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/hybrid-search-defaults.json)                  |
| `conversational_search_with_llm_deploy`  | Deploys a large language model (LLM) (by default, Cohere Chat) and configures a search pipeline with a `retrieval_augmented_generation` processor for [conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/).  | `create_connector.credential.key`  |[Defaults](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/conversational-search-defaults.json) |


