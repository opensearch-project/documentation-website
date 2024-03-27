---
layout: default
title: Default Use Cases
nav_order: 10
---

# Default workflows

As part of our plugin we offer out of the box templates for some common use cases in the ML space. Our first set of predefined templates each execute a set of APIs to configure the starting point for popular ML use cases like semantic and conversational search. 

While each default use case template has a defined schema and set of APIs with predefined defaults for each step, users can overwrite any of these defaults as they choose too. The default use cases are available to be used as part of the [Create Workflow API](https://opensearch.org/docs/latest/automating-configurations/api/create-workflow/), and can be optionally provisioned in the same create call by setting `provision=true`


## Use case tutorial example:

* One of the use cases we offer is `semantic_search_with_cohere_embedding_query_enricher `
* This predefined use case template will deploy a Cohere remote model, create an ingest pipeline with the new model, creates a sample k-NN index and sets up a search pipeline to define the default model ID for that index.
* Only field required here is the API key for cohere


```
POST /_plugins/_flow_framework/workflow?use_case=semantic_search_with_cohere_embedding_query_enricher&provision=true
{
    "create_connector.credential.key" : "<YOUR API KEY>"
}
```


### You are ready to ingest and search now

To ingest documents into the index created in the previous step, send the following requests:
```
PUT /my-nlp-index/_doc/1
{
  "passage_text": "Hello world",
  "id": "s1"
}
```
To perform vector search on your index, use the neural query clause either in the [k-NN plugin API](https://opensearch.org/docs/latest/search-plugins/knn/api/) or [Query DSL](https://opensearch.org/docs/latest/query-dsl/) queries
```
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

### Additional flexibility:

* The workflow we created with the previous use case set up all the necessary resources for sample semantic search, you can view the resources created utilizing the get status API with the `workflowID` that was created: 
    * `GET /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_status`

### Semantic search predefined defaults:

Each use case has unique out of the box defaults based on sample configurations, however any of the given defaults can be overwritten by the user through the request body. The defaults listed are an example for `semantic_search_with_cohere_embedding_query_enricher`:

```
{
    "template.name": "semantic search with cohere embedding",
    "template.description": "Setting up semantic search, with a Cohere embedding model",
    "create_connector.name": "cohere-embedding-connector",
    "create_connector.description": "The connector to Cohere's public embed API",
    "create_connector.protocol": "http",
    "create_connector.model": "embed-english-v3.0",
    "create_connector.input_type": "search_document",
    "create_connector.truncate": "end",
    "create_connector.credential.key": "123",
    "create_connector.actions.url": "https://api.cohere.ai/v1/embed",
    "create_connector.actions.request_body": "{ \"texts\": ${parameters.texts}, \"truncate\": \"${parameters.truncate}\", \"model\": \"${parameters.model}\", \"input_type\": \"${parameters.input_type}\" }",
    "create_connector.actions.pre_process_function": "connector.pre_process.cohere.embedding",
    "create_connector.actions.post_process_function": "connector.post_process.cohere.embedding",
    "register_remote_model.name": "Cohere english embed model",
    "register_remote_model.description": "cohere-embedding-model",
    "create_ingest_pipeline.pipeline_id": "nlp-ingest-pipeline",
    "create_ingest_pipeline.description": "A text embedding pipeline",
    "text_embedding.field_map.input": "passage_text",
    "text_embedding.field_map.output": "passage_embedding",
    "create_index.name": "my-nlp-index",
    "create_index.settings.number_of_shards": "2",
    "create_index.mappings.method.engine": "lucene",
    "create_index.mappings.method.space_type": "l2",
    "create_index.mappings.method.name": "hnsw",
    "text_embedding.field_map.output.dimension": "1024",
    "create_search_pipeline.pipeline_id": "default_model_pipeline"
}
```

### Overwriting parameters:

```
POST /_plugins/_flow_framework/workflow?use_case=semantic_search_with_cohere_embedding_query_enricher
{
    "create_connector.model" : "embed-multilingual-v3.0",
    "create_ingest_pipeline.text_embedding.field_map.output": "book_embedding",
    "create_index.name": "sparse-book-index"
}
```

In the preceding example, we are changing:
* The Cohere model we want to use
* The name of text_embedding processor output field
* The name of the sparse index we create

#### Additional note:

It is important to note that every field listed in the defaults can be overwritten by the user, so different use cases can have more flexibility over the sample index content and other important parameters in configuration

### All available use cases

| use case name                                        | description                                                                                                                                                                                                                                                                       | required parameters | link to defaults |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ---------------- |
| bedrock-titan-embedding_model_deploy                 | Creates and deploys an Amazon Bedrock embedding model, defaulting to titan-embed-text-v1                                                                                                                                                                                          | `create_connector.credential.access_key`, `create_connector.credential.secret_key`, `create_connector.credential.session_token` |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)|
| bedrock-titan-multimodal_model_deploy                | Creates and deploys an Amazon Bedrock multimodal embedding model, defaulting to titan-embed-image-v1                                                                                                                                                                              | `create_connector.credential.access_key`, `create_connector.credential.secret_key`, `create_connector.credential.session_token` |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| cohere-embedding_model_deploy                        | Creates and deploys a Cohere embedding model, defaulting to `embed-english-v3.0`                                                                                                                                                                                                    | `create_connector.credential.key`         |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| cohere-chat_model_deploy                             | Creates and deploys a Cohere chat model, defaulting to command                                                                                                                                                                                                                    | `create_connector.credential.key`         |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| open_ai_embedding_model_deploy                       | Creates and deploys an OpenAI embedding model, defaulting to text-embedding-ada-002                                                                                                                                                                                               | `create_connector.credential.key`         |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| openai-chat_model_deploy                             | Creates and deploys an OpenAI chat model, defaulting to gpt-3.5-turbo                                                                                                                                                                                                             | `create_connector.credential.key`         |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| local_neural_sparse_search_bi_encoder                | Sets up neural sparse search by deploying a pretrained sparse encoding model, creating an ingest pipeline with a sparse encoding processor and creates a sample index to utilize for sparse search with newly created pipeline as default                                         | none            |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| semantic_search                                      | Sets up semantic search by creating an ingest pipeline with a text_embedding processor and a k-NN index, user should supply a model ID to correctly use the template                                                                                                               | `create_ingest_pipeline.model_id`        |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| semantic_search_with_query_enricher                  | Sets up semantic search as `semantic_search` use case does but also attaches a `query_enricher` search processor so model ID is defaulted to on any neural query. User should supply a model ID to correctly use the template.                                                                  | `create_ingest_pipeline.model_id`        |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| semantic_search_with_cohere_embedding_query_enricher | Sets up semantic search with `query_enricher` search processor as `semantic_search_with_query_enricher` use case but also deploys a Cohere embedding model so user can start using semantic search out of the box. All user must provide here is the API key, other parameters can be changed up to the user description | `create_connector.credential.key`         |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| semantic_search_with_cohere_embedding                | Same as `semantic_search_with_cohere_embedding_query_enricher` use case but without any `query_enricher` processor setup                                                                                                                                                                                                             | `create_connector.credential.key`         |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| multi_modal_search                                   | Sets up an ingest pipeline with a text_image_embedding processor and a matching k-NN index for multimodal search. User should provide a model ID                                                                                                                                   | `create_ingest_pipeline.model_id`       |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| multi_modal_search_with_bedrock_titan_multi_modal    | Deploys an Amazon Bedrock multimodal model and sets up an ingest pipeline with a text_image_embedding processor and a matching k-NN index for multimodal search. User should provide there AWS Credentials                                                                         | `create_connector.credential.access_key`, `create_connector.credential.secret_key`, `create_connector.credential.session_token` |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| hybrid_search                                        | Sets up hybrid search by creating an ingest pipeline, a k-NN index and a search pipeline with a normalization processor for appropriate usage. User should provide a model_id                                                                                                      | `create_ingest_pipeline.model_id`        |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |
| conversational_search_with_llm_deploy                | Deploys an LLM model (defaulted to cohere) and sets up a search pipeline with a retrieval_augmented_generation processor for use.                                                                                                                                                 | `create_connector.credential.key`         |[pre-set-defaults-file](https://github.com/opensearch-project/flow-framework/blob/2.13/src/main/resources/defaults/bedrock-titan-embedding-defaults.json)                  |


### Neural sparse use case tutorial example:

One template we offer is neural sparse search with a local pretrained model 

Request:

```
POST /_plugins/_flow_framework/workflow?use_case=local_neural_sparse_search_bi_encoder

```

Response:

```
{
"workflow_id" : "8xL8bowB8y25Tqfenm50"
}
```



The workflow created with the predefined defaults includes:

1. Deploying one of our pretrained sparse encoding models (`amazon/neural-sparse/opensearch-neural-sparse-encoding-v1` is the default one)
2. Creates an ingest pipeline with a sparse encoding processor with the recently deployed model
3. Creates a sample index to utilize that is ready for sparse search and has the recently created pipeline set to default

Once provisioned users can immediately start ingesting into the sample index. Additionally, users can use the GET workflow status API to check out all the resources created by the template: `GET /_plugins/_flow_framework/workflow/8xL8bowB8y25Tqfenm50/_status`


#### Overwriting defaults: 

Each use case has unique out of the box defaults based on sample configurations, however any of the given defaults can be overwritten by the user through the request body. The defaults listed are an example for `semantic_search_with_cohere_embedding_query_enricher`:


#### Neural sparse predefined defaults:

```
{
    "template.name": "local-model-neural-sparse-search",
    "template.description": "Setting up neural sparse search with pretrained local model",
    "register_local_sparse_encoding_model.name": "amazon/neural-sparse/opensearch-neural-sparse-encoding-v1",
    "register_local_sparse_encoding_model.description": "This is a neural sparse encoding model",
    "register_local_sparse_encoding_model.model_format": "TORCH_SCRIPT",
    "register_local_sparse_encoding_model.deploy": "true",
    "register_local_sparse_encoding_model.version": "1.0.1",
    "create_ingest_pipeline.pipeline_id": "nlp-ingest-pipeline-sparse",
    "create_ingest_pipeline.description": "A sparse encoding ingest pipeline",
    "create_ingest_pipeline.text_embedding.field_map.input": "passage_text",
    "create_ingest_pipeline.text_embedding.field_map.output": "passage_embedding",
    "create_index.name": "my-nlp-index"
}
```

#### Overwriting parameters:

```
POST /_plugins/_flow_framework/workflow?use_case=local_neural_sparse_search_bi_encoder
{
    "register_local_sparse_encoding_model.name" : "amazon/neural-sparse/opensearch-neural-sparse-encoding-doc-v1",
    "create_ingest_pipeline.text_embedding.field_map.output": "book_embedding",
    "create_index.name": "sparse-book-index"
}
```

In the preceding example, we are changing:
* The pretrained model we want to use
* The name of text_embedding processor output field
* The name of the sparse index we create
