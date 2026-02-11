---
layout: default
title: Semantic search using an asymmetric embedding model
parent: Semantic search
grand_parent: Vector search
nav_order: 80
redirect_from:
  - /vector-search/tutorials/semantic-search/semantic-search-asymmetric/
canonical_url: https://docs.opensearch.org/latest/tutorials/vector-search/semantic-search/semantic-search-asymmetric/
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
        "all_config": "{ \"_name_or_path\": \"intfloat/multilingual-e5-small\", \"architectures\": [ \"BertModel\" ], \"attention_probs_dropout_prob\": 0.1, \"hidden_size\": 384, \"num_attention_heads\": 12, \"num_hidden_layers\": 12, \"tokenizer_class\": \"XLMRobertaTokenizer\" }"
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

Now you'll run semantic search using the generated embeddings. First, you'll create an ingest pipeline
using an ML inference processor to create document embeddings during ingestion. Then you'll create a search pipeline to generate query embeddings using
the same asymmetric embedding model. 

## Step 7.1: Create a vector index

To create a vector index, send the following request:

```json
PUT nyc_facts
{
  "settings": {
    "index": {
      "default_pipeline": "asymmetric_embedding_ingest_pipeline",
      "knn": true,
      "knn.algo_param.ef_search": 100
    }
  },
  "mappings": {
    "properties":  {
      "fact_embedding": {
        "type": "knn_vector",
        "dimension": 384,
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "nmslib",
          "parameters": {
            "ef_construction": 128,
            "m": 24
          }
        } 
      }
    }
  }
}
```
{% include copy-curl.html %}

### Step 7.2: Create an ingest pipeline

To create an ingest pipeline for generating document embeddings, send the following request:

```json
PUT _ingest/pipeline/asymmetric_embedding_ingest_pipeline
{
	"description": "ingest passage text and generate a embedding using an asymmetric model",
	"processors": [
		{
			"ml_inference": {

				"model_input": "{\"text_docs\":[\"${input_map.text_docs}\"],\"target_response\":[\"sentence_embedding\"],\"parameters\":{\"content_type\":\"query\"}}",
				"function_name": "text_embedding",
				"model_id": "{{ _.model_id }}",
				"input_map": [
					{
						"text_docs": "description"
					}
				],
				"output_map": [
					{
						"fact_embedding": "$.inference_results[0].output[0].data",
						"embedding_size": "$.inference_results.*.output.*.shape[0]"
					}
				]
			}
		}
	]
}
```
{% include copy-curl.html %}

### 2.3 Test the pipeline

Test the pipeline by running the following request:

```json
POST /_ingest/pipeline/asymmetric_embedding_ingest_pipeline/_simulate
{
   "docs": [
	  {
         "_index": "my-index",
         "_id": "1",
         "_source": {
             "title": "Central Park",
             "description": "A large public park in the heart of New York City, offering a wide range of recreational activities."
         }
		}
	]
}
```
{% include copy-curl.html %}

The response contains the embeddings generated by the model:

```json
{
   "docs": [
      {
         "doc": {
             "_index": "my-index",
             "_id": "1",
             "_source": {
                 "description": "A large public park in the heart of New York City, offering a wide range of recreational activities.",
                 "fact_embedding": [
                     [
                         0.06344555,
                         0.30067796,
                         ...
                         0.014804064,
                         -0.022822019						
                     ]
                 ],
                 "title": "Central Park",
                 "embedding_size": [
                     384.0
                 ]
             },
             "_ingest": {
                 "timestamp": "2024-12-16T20:59:07.152169Z"
             }
         }
      }
	]
}
```

### Step 7.4: Ingest data

When you perform bulk ingestion, the ingest pipeline will generate embeddings for each document: 

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

### Step 7.5: Create a search pipeline

Create a search pipeline that converts your query into embeddings and runs a vector search on the index to return the best-matching documents:

```json
PUT /_search/pipeline/asymmetric_embedding_search_pipeline
{
   "description": "ingest passage text and generate a embedding using an asymmetric model",
   "request_processors": [
      {
        "ml_inference": {
            "query_template": "{\"size\": 3,\"query\": {\"knn\": {\"fact_embedding\": {\"vector\": ${query_embedding},\"k\": 4}}}}",
            "function_name": "text_embedding",
            "model_id": "{{ _.model_id }}",
            "model_input": "{ \"text_docs\": [\"${input_map.query}\"], \"target_response\": [\"sentence_embedding\"], \"parameters\" : {\"content_type\" : \"query\" } }",
            "input_map": [
               {
                  "query": "query.term.fact_embedding.value"
               }
            ],
            "output_map": [
               {
                  "query_embedding": "$.inference_results[0].output[0].data",
                  "embedding_size": "$.inference_results.*.output.*.shape[0]"
               }
            ]
         }
      }
   ]
}
```
{% include copy-curl.html %}

### Step 7.6: Run a query

Run a query using the search pipeline created in the previous step:

```json
GET /nyc_facts/_search?search_pipeline=asymmetric_embedding_search_pipeline
{
  "query": {
    "term": {
      "fact_embedding": {
        "value": "What are some places for sports in NYC?",
       "boost": 1 
      }
    }
  }
}
```

The response contains the top three matching documents: 

```json
{
  "took": 22,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": 0.12496973,
    "hits": [
      {
        "_index": "nyc_facts",
        "_id": "hb9X0ZMBICPs-TP0ijZX",
        "_score": 0.12496973,
        "_source": {
          "fact_embedding": [
            ...
          ],
          "embedding_size": [
            384.0
          ],
          "description": "A large public park in the heart of New York City, offering a wide range of recreational activities.",
          "title": "Central Park"
        }
      },
      {
        "_index": "nyc_facts",
        "_id": "ir9X0ZMBICPs-TP0ijZX",
        "_score": 0.114651985,
        "_source": {
          "fact_embedding": [
            ...
          ],
          "embedding_size": [
            384.0
          ],
          "description": "Home to the New York Yankees, this baseball stadium is a historic landmark in the Bronx.",
          "title": "Yankee Stadium"
        }
      },
      {
        "_index": "nyc_facts",
        "_id": "j79X0ZMBICPs-TP0ijZX",
        "_score": 0.110090025,
        "_source": {
          "fact_embedding": [
            ...
          ],
          "embedding_size": [
            384.0
          ],
          "description": "A famous complex of commercial buildings in Manhattan, home to the NBC studios and the annual ice skating rink.",
          "title": "Rockefeller Center"
        }
      }
    ]
  }
}
```
---

## References

- Wang, Liang, et al. (2024). *Multilingual E5 Text Embeddings: A Technical Report*. arXiv preprint arXiv:2402.05672. [Link](https://arxiv.org/abs/2402.05672)