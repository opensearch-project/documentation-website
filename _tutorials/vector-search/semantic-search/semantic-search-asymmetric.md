---
layout: default
title: Semantic search using an asymmetric embedding model
parent: Semantic search
grand_parent: Vector search
nav_order: 80
redirect_from:
  - /vector-search/tutorials/semantic-search/semantic-search-asymmetric/
---

# Semantic search using an asymmetric embedding model

This tutorial shows you how to perform semantic search by generating text embeddings using an asymmetric embedding model. The tutorial uses the multilingual `intfloat/multilingual-e5-small` model from Hugging Face. For more information, see [Semantic search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/semantic-search/).

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Step 1: Update cluster settings

To configure your cluster to allow you to register models using external URLs and run models on non-machine learning (ML) nodes, send the following request:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.allow_registering_model_via_url": "true",
    "plugins.ml_commons.only_run_on_ml_node": "false",
    "plugins.ml_commons.model_access_control_enabled": "true",
    "plugins.ml_commons.native_memory_threshold": "99"
  }
}
```
{% include copy-curl.html %}

When registering a model from a URL, make sure the source is trusted. Loading models from untrusted sources can pose security risks. For more information, see [PyTorch security guidelines for untrusted models](https://github.com/pytorch/pytorch/blob/main/SECURITY.md#untrusted-models).
{: .warning}

## Step 2: Prepare the model for use in OpenSearch

In this tutorial, you’ll use the Hugging Face `intfloat/multilingual-e5-small` model. Follow these steps to prepare and compress the model into a zip file for use in OpenSearch.

### Step 2.1: Download the model from Hugging Face

To download the model, use the following steps:

1. Install Git Large File Storage (LFS), if you haven't already:

   ```bash
   git lfs install
   ```
   {% include copy.html %}

2. Clone the model repository:

   ```bash
   git clone https://huggingface.co/intfloat/multilingual-e5-small
   ```
   {% include copy.html %}

The model files are now downloaded into a directory on your local machine.

### Step 2.2: Compress the model files

To upload the model to OpenSearch, you must compress the necessary model files (`model.onnx`, `sentencepiece.bpe.model`, and `tokenizer.json`). You can find these files in the `onnx` directory of the cloned repository.

To compress the files, run the following command in the directory containing them:

```bash
zip -r intfloat-multilingual-e5-small-onnx.zip model.onnx tokenizer.json sentencepiece.bpe.model
```
{% include copy.html %}

The files are now archived in a zip file named `intfloat-multilingual-e5-small-onnx.zip`.

### Step 2.3: Calculate the model file's hash

Before registering the model, you must calculate the SHA-256 hash of the zip file. Run this command to generate the hash:

```bash
shasum -a 256 intfloat-multilingual-e5-small-onnx.zip
```
{% include copy.html %}

Note the hash value; you'll need it during model registration.

### Step 2.4: Serve the model file using a Python HTTP server

To allow OpenSearch to access the model file, you can serve it through HTTP. Because this tutorial uses a local development environment, you can use Python's built-in HTTP server command.

Navigate to the directory containing the zip file and run the following command:

```bash
python3 -m http.server 8080 --bind 0.0.0.0
```
{% include copy.html %}

This will serve the zip file at `http://0.0.0.0:8080/intfloat-multilingual-e5-small-onnx.zip`. After registering the model, you can stop the server by pressing `Ctrl+C`.

## Step 3: Register a model group

Before registering the model itself, you need to create a model group. This helps organize models in OpenSearch. Run the following request to create a new model group:

```json
POST /_plugins/_ml/model_groups/_register
{
  "name": "Asymmetric Model Group",
  "description": "A model group for local asymmetric models"
}
```
{% include copy-curl.html %}

Note the model group ID returned in the response; you'll use it to register the model.

## Step 4: Register the model

Now that you have the model zip file and the model group ID, you can register the model in OpenSearch:

```json
POST /_plugins/_ml/models/_register
{
    "name": "e5-small-onnx",
    "version": "1.0.0",
    "description": "Asymmetric multilingual-e5-small model",
    "model_format": "ONNX",
    "model_group_id": "your_group_id",
    "model_content_hash_value": "your_model_zip_content_hash_value",
    "model_config": {
        "model_type": "bert",
        "embedding_dimension": 384,
        "framework_type": "sentence_transformers",
        "query_prefix": "query: ",
        "passage_prefix": "passage: ",
        "all_config": "{ \"_name_or_path\": \"intfloat/multilingual-e5-small\", \"architectures\": [ \"BertModel\" ], \"attention_probs_dropout_prob\": 0.1, \"hidden_size\": 384, \"num_attention_heads\": 12, \"num_hidden_layers\": 12, \"tokenizer_class\": \"XLMRobertaTokenizer\" }",
        "additional_config": {
            "space_type": "cosinesimil"
        }
    },
    "url": "http://localhost:8080/intfloat-multilingual-e5-small-onnx.zip"
}
```
{% include copy-curl.html %}

Replace `your_group_id` and `your_model_zip_content_hash_value` with the values from previous steps. This will initiate the model registration process, and you'll receive a task ID in the response.

To check the status of the registration, run the following request:

```json
GET /_plugins/_ml/tasks/your_task_id
```
{% include copy-curl.html %}

Once the task completes, note the model ID; you'll need it for deployment and inference.

## Step 5: Deploy the model

After the model is registered, deploy it by running the following request:

```json
POST /_plugins/_ml/models/your_model_id/_deploy
```
{% include copy-curl.html %}

Use the task ID to check the status of the deployment:

```json
GET /_plugins/_ml/tasks/your_task_id
```
{% include copy-curl.html %}

When the model is successfully deployed, its state changes to **DEPLOYED** and it is ready to use.

## Step 6: Generate embeddings

Now that your model is deployed, you can use it to generate text embeddings for both queries and passages.

### Generating passage embeddings

To generate embeddings for a passage, use the following request:

```json
POST /_plugins/_ml/_predict/text_embedding/your_model_id
{
  "parameters": {
    "content_type": "passage"
  },
  "text_docs": [
    "Today is Friday, tomorrow will be my break day. After that, I will go to the library. When is lunch?"
  ],
  "target_response": ["sentence_embedding"]
}
```
{% include copy-curl.html %}

The response contains the generated embeddings:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [384],
          "data": [0.0419328, 0.047480892, ..., 0.31158513, 0.21784715]
        }
      ]
    }
  ]
}
```
{% include copy-curl.html %}

### Generating query embeddings

Similarly, you can generate embeddings for a query:

```json
POST /_plugins/_ml/_predict/text_embedding/your_model_id
{
  "parameters": {
    "content_type": "query"
  },
  "text_docs": ["What day is it today?"],
  "target_response": ["sentence_embedding"]
}
```
{% include copy-curl.html %}

The response contains the generated embeddings:

```json
{
  "inference_results": [
    {
      "output": [
        {
          "name": "sentence_embedding",
          "data_type": "FLOAT32",
          "shape": [384],
          "data": [0.2338349, -0.13603798, ..., 0.37335885, 0.10653384]
        }
      ]
    }
  ]
}
```
{% include copy-curl.html %}

# Step 7: Run semantic search

Now you'll run semantic search using the `semantic` field type.

## Step 7.1: Create an index containing a semantic field

Create an index containing a `semantic` field that references the deployed asymmetric model. OpenSearch automatically generates embeddings during ingestion and search using the specified model:

```json
PUT nyc_facts
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "title": {
        "type": "text"
      },
      "description": {
        "type": "semantic",
        "model_id": "your_model_id"
      }
    }
  }
}
```
{% include copy-curl.html %}

Replace `your_model_id` with the model ID from Step 4. Because the model is configured with `passage_prefix` and `query_prefix`, the `semantic` field automatically applies the appropriate prefix when generating embeddings for documents (`passage` content type) and queries (`query` content type).

### Step 7.2: Ingest data

Ingest documents into the index. The `semantic` field automatically generates passage embeddings for the `description` field during ingestion:

```json
POST /_bulk
{ "index": { "_index": "nyc_facts" } }
{ "title": "Central Park", "description": "A large public park in the heart of New York City, offering a wide range of recreational activities." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Empire State Building", "description": "An iconic skyscraper in New York City offering breathtaking views from its observation deck." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Statue of Liberty", "description": "A colossal neoclassical sculpture on Liberty Island, symbolizing freedom and democracy in the United States." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Brooklyn Bridge", "description": "A historic suspension bridge connecting Manhattan and Brooklyn, offering pedestrian walkways with great views." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Times Square", "description": "A bustling commercial and entertainment hub in Manhattan, known for its neon lights and Broadway theaters." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Yankee Stadium", "description": "Home to the New York Yankees, this baseball stadium is a historic landmark in the Bronx." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "The Bronx Zoo", "description": "One of the largest zoos in the world, located in the Bronx, featuring diverse animal exhibits and conservation efforts." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "New York Botanical Garden", "description": "A large botanical garden in the Bronx, known for its diverse plant collections and stunning landscapes." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Flushing Meadows-Corona Park", "description": "A major park in Queens, home to the USTA Billie Jean King National Tennis Center and the Unisphere." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Citi Field", "description": "The home stadium of the New York Mets, located in Queens, known for its modern design and fan-friendly atmosphere." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Rockefeller Center", "description": "A famous complex of commercial buildings in Manhattan, home to the NBC studios and the annual ice skating rink." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Queens Botanical Garden", "description": "A peaceful, beautiful botanical garden located in Flushing, Queens, featuring seasonal displays and plant collections." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Arthur Ashe Stadium", "description": "The largest tennis stadium in the world, located in Flushing Meadows-Corona Park, Queens, hosting the U.S. Open." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Wave Hill", "description": "A public garden and cultural center in the Bronx, offering stunning views of the Hudson River and a variety of nature programs." }
{ "index": { "_index": "nyc_facts" } }
{ "title": "Louis Armstrong House", "description": "The former home of jazz legend Louis Armstrong, located in Corona, Queens, now a museum celebrating his life and music." }
```
{% include copy-curl.html %}

### Step 7.3: Run a query

Run a semantic search query using the `neural` query type. OpenSearch automatically generates the query embedding with the appropriate query prefix and searches against the underlying vector field:

```json
GET /nyc_facts/_search
{
  "_source": {
    "excludes": [
      "description_semantic_info"
    ]
  },
  "query": {
    "neural": {
      "description": {
        "query_text": "What are some places for sports in NYC?",
        "k": 3
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the top three matching documents:

```json
{
  "took": 45,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 3,
      "relation": "eq"
    },
    "max_score": 0.921239,
    "hits": [
      {
        "_index": "nyc_facts",
        "_id": "SqziBZ4BzPm71JsNgo5J",
        "_score": 0.921239,
        "_source": {
          "description": "A large public park in the heart of New York City, offering a wide range of recreational activities.",
          "title": "Central Park"
        }
      },
      {
        "_index": "nyc_facts",
        "_id": "U6ziBZ4BzPm71JsNgo5J",
        "_score": 0.9106568,
        "_source": {
          "description": "The home stadium of the New York Mets, located in Queens, known for its modern design and fan-friendly atmosphere.",
          "title": "Citi Field"
        }
      },
      {
        "_index": "nyc_facts",
        "_id": "T6ziBZ4BzPm71JsNgo5J",
        "_score": 0.91063917,
        "_source": {
          "description": "Home to the New York Yankees, this baseball stadium is a historic landmark in the Bronx.",
          "title": "Yankee Stadium"
        }
      }
    ]
  }
}
```
---

## References

- Wang, Liang, et al. (2024). *Multilingual E5 Text Embeddings: A Technical Report*. arXiv preprint arXiv:2402.05672. [Link](https://arxiv.org/abs/2402.05672)