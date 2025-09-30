---
layout: default
title: Using semantic highlighting
parent: Vector search
nav_order: 60
---

# Using semantic highlighting

Semantic highlighting enhances search results by identifying and emphasizing the most semantically relevant sentences or passages within documents, based on the query's meaning. Unlike traditional highlighters that rely on exact keyword matches, semantic highlighting uses machine learning (ML) models to understand the context and relevance of text segments. This allows you to pinpoint the most pertinent information within a document, even if the exact search terms aren't present in the highlighted passage. For more information, see [Using the `semantic` highlighter]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight#using-the-semantic-highlighter).

This tutorial guides you through setting up and using semantic highlighting with a neural search query.

Replace the placeholders beginning with the prefix `your_` with your own values.
{: .note}

## Prerequisites

To ensure local basic setup works, specify the following cluster settings:

```json
PUT _cluster/settings
{
  "persistent": {
    "plugins.ml_commons.allow_registering_model_via_url": "true",
    "plugins.ml_commons.only_run_on_ml_node": "false",
    "plugins.ml_commons.model_access_control_enabled": "true"
  }
}
```
{% include copy-curl.html %}

This example uses a simple setup with no dedicated ML nodes and allows running a model on a non-ML node. On clusters with dedicated ML nodes, specify `"only_run_on_ml_node": "true"` for improved performance. For more information, see [ML Commons cluster settings]({{site.url}}{{site.baseurl}}/ml-commons-plugin/cluster-settings/).

## Step 1: Create an index

First, create an index to store your text data and its corresponding vector embeddings. You'll need a `text` field for the original content and a `knn_vector` field for the embeddings:

```json
PUT neural-search-index
{
  "settings": {
    "index.knn": true
  },
  "mappings": {
    "properties": {
      "text": {
        "type": "text"
      },
      "text_embedding": {
        "type": "knn_vector",
        "dimension": 384, 
        "method": {
          "name": "hnsw",
          "space_type": "l2",
          "engine": "faiss",
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

The `dimension` field must contain your chosen embedding model's dimension.

## Step 2: Register and deploy the ML models

You need two types of models for semantic highlighting:

1.  **Text embedding model**: To convert the search query and document text into vectors.
2.  **Sentence highlighting model**: To analyze the text and identify the most relevant sentences.

First, register and deploy a text embedding model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "huggingface/sentence-transformers/all-MiniLM-L6-v2",
  "version": "1.0.2", 
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

This API returns a `task_id` for the deployment operation. Use the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/) to monitor the deployment status:

```json
GET /_plugins/_ml/tasks/<your-task-id>
```
{% include copy-curl.html %}

Once the `state` changes to `COMPLETED`, the Tasks API returns the model ID for the deployed model. Note the text embedding model ID; you'll use it in the following steps.

Next, register a pretrained semantic sentence highlighting model:

```json
POST /_plugins/_ml/models/_register?deploy=true
{
  "name": "amazon/sentence-highlighting/opensearch-semantic-highlighter-v1",
  "version": "1.0.0",
  "model_format": "TORCH_SCRIPT",
  "function_name": "QUESTION_ANSWERING"
}
```
{% include copy-curl.html %}

Monitor the deployment status using the Tasks API. Note the semantic highlighting model ID; you'll use it in the following steps.

For production environments, consider using a remote model instead of a locally deployed model. Remote models offer better scalability, resource isolation, and support for advanced features like batch inference. For information about deploying remote models, see [Remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/overview/).
{: .tip}

## Step 2.5 (Optional): Enable batch inference for semantic highlighting

**Introduced 3.3**
{: .label .label-purple }

For improved performance when highlighting multiple documents, you can enable batch inference mode. This mode processes all documents in a single ML inference call instead of one call per document.

Batch inference requires a remote model with batch processing capabilities. Local models do not support batch inference for semantic highlighting. For production environments, we recommend using remote models for better scalability and performance.
{: .note}

First, enable the system-generated semantic highlighter processor factory in cluster settings:

```json
PUT _cluster/settings
{
  "persistent": {
    "search.pipeline.enabled_system_generated_factories": ["semantic-highlighter"]
  }
}
```
{% include copy-curl.html %}

This is a one-time setup step. Once enabled, you can use the `batch_inference` option in your highlight queries with remote models that support batch processing.

## Step 3 (Optional): Configure an ingest pipeline 

To automatically generate embeddings during indexing, create an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/):

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "A pipeline to generate text embeddings",
  "processors": [
    {
      "text_embedding": {
        "model_id": "your-text-embedding-model-id",
        "field_map": {
          "text": "text_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

Set this pipeline as the default pipeline for your index:

```json
PUT /neural-search-index/_settings
{
  "index.default_pipeline": "nlp-ingest-pipeline"
}
```
{% include copy-curl.html %}

## Step 4: Index data

Now, index some sample documents. If you configured the ingest pipeline, embeddings will be generated automatically:

```json
POST /neural-search-index/_doc/1
{
  "text": "Alzheimer's disease is a progressive neurodegenerative disorder characterized by accumulation of amyloid-beta plaques and neurofibrillary tangles in the brain. Early symptoms include short-term memory impairment, followed by language difficulties, disorientation, and behavioral changes. While traditional treatments such as cholinesterase inhibitors and memantine provide modest symptomatic relief, they do not alter disease progression. Recent clinical trials investigating monoclonal antibodies targeting amyloid-beta, including aducanumab, lecanemab, and donanemab, have shown promise in reducing plaque burden and slowing cognitive decline. Early diagnosis using biomarkers such as cerebrospinal fluid analysis and PET imaging may facilitate timely intervention and improved outcomes."
}
```
{% include copy-curl.html %}

```json
POST /neural-search-index/_doc/2
{
  "text": "Major depressive disorder is characterized by persistent feelings of sadness, anhedonia, and neurovegetative symptoms affecting sleep, appetite, and energy levels. First-line pharmacological treatments include selective serotonin reuptake inhibitors (SSRIs) and serotonin-norepinephrine reuptake inhibitors (SNRIs), with response rates of approximately 60-70%. Cognitive-behavioral therapy demonstrates comparable efficacy to medication for mild to moderate depression and may provide more durable benefits. Treatment-resistant depression may respond to augmentation strategies including atypical antipsychotics, lithium, or thyroid hormone. Electroconvulsive therapy remains the most effective intervention for severe or treatment-resistant depression, while newer modalities such as transcranial magnetic stimulation and ketamine infusion offer promising alternatives with fewer side effects."
}
```
{% include copy-curl.html %}

```json
POST /neural-search-index/_doc/3
{
   "text" : "Cardiovascular disease remains the leading cause of mortality worldwide, accounting for approximately one-third of all deaths. Risk factors include hypertension, diabetes mellitus, smoking, obesity, and family history. Recent advancements in preventive cardiology emphasize lifestyle modifications such as Mediterranean diet, regular exercise, and stress reduction techniques. Pharmacological interventions including statins, beta-blockers, and ACE inhibitors have significantly reduced mortality rates. Emerging treatments focus on inflammation modulation and precision medicine approaches targeting specific genetic profiles associated with cardiac pathologies."
}
```
{% include copy-curl.html %}

## Step 5: Perform semantic highlighting

Combine a neural search query with the semantic highlighter:

1.  Use a `neural` query to find documents semantically similar to your query text using the text embedding model.
2.  Add a `highlight` section.
3.  In `highlight.fields`, specify the `text` field (or another field containing the content you want to highlight).
4.  Set the `type` for this field to `semantic`.
5.  Add a global `highlight.options` object.
6.  In `options`, provide the `model_id` of your deployed sentence highlighting model.

Use the following request to retrieve the top five matching documents (specified in the `k` parameter). Replace the placeholder model IDs (`TEXT_EMBEDDING_MODEL_ID` and `SEMANTIC_HIGHLIGHTING_MODEL_ID`) with the model IDs obtained after successful deployment in Step 2:

```json
POST /neural-search-index/_search
{
  "_source": {
    "excludes": ["text_embedding"] // Exclude the large embedding from the source
  },
  "query": {
    "neural": {
      "text_embedding": {
        "query_text": "treatments for neurodegenerative diseases",
        "model_id": "<your-text-embedding-model-id>", 
        "k": 2
      }
    }
  },
  "highlight": {
    "fields": {
      "text": {
        "type": "semantic"
      }
    },
    "options": {
      "model_id": "<your-semantic-highlighting-model-id>" 
    }
  }
}
```
{% include copy-curl.html %}

## Step 6: Interpret the results

The search results include a `highlight` object within each hit. The specified `text` field in the `highlight` object contains the original text, with the most semantically relevant sentences wrapped in `<em>` tags by default:

```json
{
  "took": 711,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": 0.52716815,
    "hits": [
      {
        "_index": "neural-search-index",
        "_id": "1",
        "_score": 0.52716815,
        "_source": {
          "text": "Alzheimer's disease is a progressive neurodegenerative disorder ..." // Shortened for brevity
        },
        "highlight": {
          "text": [
            // Highlighted sentence may differ based on the exact model used
            "Alzheimer's disease is a progressive neurodegenerative disorder characterized by accumulation of amyloid-beta plaques and neurofibrillary tangles in the brain. Early symptoms include short-term memory impairment, followed by language difficulties, disorientation, and behavioral changes. While traditional treatments such as cholinesterase inhibitors and memantine provide modest symptomatic relief, they do not alter disease progression. <em>Recent clinical trials investigating monoclonal antibodies targeting amyloid-beta, including aducanumab, lecanemab, and donanemab, have shown promise in reducing plaque burden and slowing cognitive decline.</em> Early diagnosis using biomarkers such as cerebrospinal fluid analysis and PET imaging may facilitate timely intervention and improved outcomes."
          ]
        }
      },
      {
        "_index": "neural-search-index",
        "_id": "2",
        "_score": 0.4364841,
        "_source": {
          "text": "Major depressive disorder is characterized by persistent feelings of sadness ..." // Shortened for brevity
        },
        "highlight": {
          "text": [
             // Highlighted sentence for document 2
            "Major depressive disorder is characterized by persistent feelings of sadness, anhedonia, and neurovegetative symptoms affecting sleep, appetite, and energy levels. First-line pharmacological treatments include selective serotonin reuptake inhibitors (SSRIs) and serotonin-norepinephrine reuptake inhibitors (SNRIs), with response rates of approximately 60-70%. <em>Cognitive-behavioral therapy demonstrates comparable efficacy to medication for mild to moderate depression and may provide more durable benefits.</em> Treatment-resistant depression may respond to augmentation strategies including atypical antipsychotics, lithium, or thyroid hormone. Electroconvulsive therapy remains the most effective intervention for severe or treatment-resistant depression, while newer modalities such as transcranial magnetic stimulation and ketamine infusion offer promising alternatives with fewer side effects."          ]
        }
      }
    ]
  }
}
```

The `semantic` highlighter identifies the sentence determined by the model to be semantically relevant to the query ("treatments for neurodegenerative diseases") within the context of each retrieved document. You can customize the highlight tags using the `pre_tags` and `post_tags` parameters if needed. For more information, see [Changing the highlighting tags]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/highlight/#changing-the-highlighting-tags).

### Using batch inference mode

**Introduced 3.3**
{: .label .label-purple }

For better performance when highlighting multiple documents, add `"batch_inference": true` to the highlight options. This feature requires a remote model with batch processing capabilities and the system processor factory to be enabled (see Step 2.5).

```json
POST /neural-search-index/_search
{
  "_source": {
    "excludes": ["text_embedding"]
  },
  "query": {
    "neural": {
      "text_embedding": {
        "query_text": "treatments for neurodegenerative diseases",
        "model_id": "<your-text-embedding-model-id>",
        "k": 5
      }
    }
  },
  "highlight": {
    "fields": {
      "text": {
        "type": "semantic"
      }
    },
    "options": {
      "model_id": "<your-remote-semantic-highlighting-model-id>",
      "batch_inference": true
    }
  }
}
```
{% include copy-curl.html %}

Batch inference mode reduces the number of ML model calls from one per document to one per batch, significantly improving performance for multi-document results.

**Requirements for batch inference:**
- Remote model with batch processing capabilities (local models are not supported)
- System processor factory enabled in cluster settings
- OpenSearch 3.3 or later

For production environments, using batch inference with remote models is the recommended best practice for optimal performance and scalability.
{: .tip}
