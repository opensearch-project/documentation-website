---
layout: default
title: Using semantic highlighting
parent: Tutorials
grand_parent: Vector search
nav_order: 60
---

# Using semantic highlighting

Semantic highlighting enhances search results by identifying and emphasizing the most semantically relevant sentences or passages within documents, based on the query's meaning. Unlike traditional highlighters that rely on exact keyword matches, semantic highlighting uses machine learning (ML) models to understand the context and relevance of text segments. This allows you to pinpoint the most pertinent information within a document, even if the exact search terms aren't present in the highlighted passage.

This tutorial guides you through setting up and using semantic highlighting with a neural search query.

## Prerequisites

Before you begin, ensure you have the following:

1.  An OpenSearch cluster with the `ml-commons` and `neural-search` plugins installed.
2.  A deployed text embedding model suitable for generating vector embeddings from your text data. See [Choosing a model]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/#choosing-a-model).
3.  A deployed sentence transformer or question-answering model specifically designed for semantic highlighting. OpenSearch plans to release pre-trained models suitable for this task. For this tutorial, we'll use placeholder IDs.

## Step 1: Set up the index

First, create an index to store your text data and its corresponding vector embeddings. You'll need a `text` field for the original content and a `knn_vector` field for the embeddings.

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
        "dimension": 768, // Replace with your embedding model's dimension
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
Adjust the `dimension` based on the text embedding model you choose.

## Step 2: Deploy the ML models

You need two types of models for semantic highlighting:

1.  **Text Embedding Model**: To convert the search query and document text into vectors.
2.  **Sentence Highlighting Model**: To analyze the text and identify the most relevant sentence(s).

Deploy these models using the ML Commons plugin.

First, register the text embedding model. Replace `your-text-embedding-model-name`, `your-text-embedding-model-version`, and potentially the `model_group_id` with appropriate values for your chosen model:

```json
POST /_plugins/_ml/models/_register
{
  "name": "huggingface/sentence-transformers/all-MiniLM-L6-v2",
  "version": "1.0.1", 
  "model_group_id": "your-embedding-model-group-id", // Optional: Specify if using model groups
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Then, deploy the text embedding model. Note the `task_id` in the response and use the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/) to monitor the deployment. Once the state is `COMPLETED`, retrieve the `model_id`.

```bash
# Get the model ID from the registration response or Tasks API
TEXT_EMBEDDING_MODEL_ID="<your-text-embedding-model-id>"

POST /_plugins/_ml/models/${TEXT_EMBEDDING_MODEL_ID}/_deploy
```
{% include copy-curl.html %}

Next, register the pre-trained semantic sentence highlighting model:

```json
POST /_plugins/_ml/models/_register
{
  "name": "opensearch/semantic-sentence-highlighter-model-v1",
  "version": "1.0.0",
  "model_group_id": "your-highlighting-model-group-id", // Optional: Specify if using model groups
  "model_format": "TORCH_SCRIPT"
}
```
{% include copy-curl.html %}

Again, note the `task_id` from the registration response. Check the task status using the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/). Once the registration task is `COMPLETED`, retrieve the `model_id` for the highlighting model.

Now, deploy the semantic sentence highlighting model using its `model_id`:

```bash
# Get the model ID from the registration response or Tasks API
SEMANTIC_HIGHLIGHTING_MODEL_ID="<your-semantic-highlighting-model-id>"

POST /_plugins/_ml/models/${SEMANTIC_HIGHLIGHTING_MODEL_ID}/_deploy
```
{% include copy-curl.html %}

Monitor the deployment task using the returned `task_id` and the [Tasks API]({{site.url}}{{site.baseurl}}/ml-commons-plugin/api/tasks-apis/get-task/).

Ensure both models are deployed successfully (state `COMPLETED`) before proceeding.

## Step 3: Configure an ingest pipeline (Optional)

To automatically generate embeddings during indexing, create an ingest pipeline. Replace `your-text-embedding-model-id` with the actual ID of your deployed embedding model.

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
Associate this pipeline with your index:

```json
PUT /neural-search-index/_settings
{
  "index.default_pipeline": "nlp-ingest-pipeline"
}
```

## Step 4: Index data

Now, index some sample documents. If you configured the ingest pipeline, embeddings will be generated automatically.

```json
POST /neural-search-index/_doc/1
{
  "text": "Alzheimer's disease is a progressive neurodegenerative disorder characterized by accumulation of amyloid-beta plaques and neurofibrillary tangles in the brain. Early symptoms include short-term memory impairment, followed by language difficulties, disorientation, and behavioral changes. While traditional treatments such as cholinesterase inhibitors and memantine provide modest symptomatic relief, they do not alter disease progression. Recent clinical trials investigating monoclonal antibodies targeting amyloid-beta, including aducanumab, lecanemab, and donanemab, have shown promise in reducing plaque burden and slowing cognitive decline. Early diagnosis using biomarkers such as cerebrospinal fluid analysis and PET imaging may facilitate timely intervention and improved outcomes."
}

POST /neural-search-index/_doc/2
{
  "text": "Major depressive disorder is characterized by persistent feelings of sadness, anhedonia, and neurovegetative symptoms affecting sleep, appetite, and energy levels. First-line pharmacological treatments include selective serotonin reuptake inhibitors (SSRIs) and serotonin-norepinephrine reuptake inhibitors (SNRIs), with response rates of approximately 60-70%. Cognitive-behavioral therapy demonstrates comparable efficacy to medication for mild to moderate depression and may provide more durable benefits. Treatment-resistant depression may respond to augmentation strategies including atypical antipsychotics, lithium, or thyroid hormone. Electroconvulsive therapy remains the most effective intervention for severe or treatment-resistant depression, while newer modalities such as transcranial magnetic stimulation and ketamine infusion offer promising alternatives with fewer side effects."
}

POST /neural-search-index/_doc/3
{
   "text" : "Cardiovascular disease remains the leading cause of mortality worldwide, accounting for approximately one-third of all deaths. Risk factors include hypertension, diabetes mellitus, smoking, obesity, and family history. Recent advancements in preventive cardiology emphasize lifestyle modifications such as Mediterranean diet, regular exercise, and stress reduction techniques. Pharmacological interventions including statins, beta-blockers, and ACE inhibitors have significantly reduced mortality rates. Emerging treatments focus on inflammation modulation and precision medicine approaches targeting specific genetic profiles associated with cardiac pathologies."
}
```

## Step 5: Perform semantic highlighting

Combine a neural search query with the semantic highlighter.

1.  Use a `neural` query to find documents semantically similar to your query text, using the text embedding model.
2.  Add a `highlight` section.
3.  Inside `highlight.fields`, specify the `text` field (or whichever field contains the content you want to highlight).
4.  Set the `type` for this field to `semantic`.
5.  Add a global `highlight.options` object.
6.  Inside `options`, provide the `model_id` of your deployed sentence highlighting model.

Replace the placeholder model IDs (`TEXT_EMBEDDING_MODEL_ID` and `SEMANTIC_HIGHLIGHTING_MODEL_ID`) with the actual IDs obtained after successful deployment in Step 2.

```json
# Make sure to replace these variables with your actual deployed model IDs
TEXT_EMBEDDING_MODEL_ID="<your-text-embedding-model-id>"
SEMANTIC_HIGHLIGHTING_MODEL_ID="<your-semantic-highlighting-model-id>"

POST /neural-search-index/_search
{
  "_source": {
    "excludes": ["text_embedding"] // Exclude the large embedding from the source
  },
  "query": {
    "neural": {
      "text_embedding": {
        "query_text": "treatments for neurodegenerative diseases",
        "model_id": "${TEXT_EMBEDDING_MODEL_ID}", 
        "k": 5 // Number of nearest neighbors to retrieve
      }
    }
  },
  "highlight": {
    "fields": {
      "text": {
        "type": "semantic" // Specify semantic highlighter
      }
    },
    "options": {
      "model_id": "${SEMANTIC_HIGHLIGHTING_MODEL_ID}" 
    }
  }
}
```
{% include copy-curl.html %}

## Step 6: Interpret the results

The search results will include a `highlight` object within each hit. The specified `text` field inside `highlight` will contain the original text, but with the most semantically relevant sentence(s) wrapped in `<em>` tags by default.

```json
{
  "took": 712,
  "timed_out": false,
  "_shards": { ... },
  "hits": {
    "total": { "value": 3, "relation": "eq" },
    "max_score": 0.4841726,
    "hits": [
      {
        "_index": "neural-search-index",
        "_id": "1",
        "_score": 0.4841726,
        "_source": {
          "text": "Alzheimer's disease is a progressive neurodegenerative disorder characterized by accumulation of amyloid-beta plaques and neurofibrillary tangles in the brain. Early symptoms include short-term memory impairment, followed by language difficulties, disorientation, and behavioral changes. While traditional treatments such as cholinesterase inhibitors and memantine provide modest symptomatic relief, they do not alter disease progression. Recent clinical trials investigating monoclonal antibodies targeting amyloid-beta, including aducanumab, lecanemab, and donanemab, have shown promise in reducing plaque burden and slowing cognitive decline. Early diagnosis using biomarkers such as cerebrospinal fluid analysis and PET imaging may facilitate timely intervention and improved outcomes."
        },
        "highlight": {
          "text": [
            // Highlighted sentence may differ based on the exact model used
            "Alzheimer's disease is a progressive neurodegenerative disorder ... <em>Recent clinical trials investigating monoclonal antibodies targeting amyloid-beta, including aducanumab, lecanemab, and donanemab, have shown promise in reducing plaque burden and slowing cognitive decline.</em> Early diagnosis using biomarkers ..."
          ]
        }
      },
      {
        "_index": "neural-search-index",
        "_id": "2",
        "_score": 0.45079497,
        // ... source for document 2 ...
        "highlight": {
          "text": [
             // Highlighted sentence for document 2
            "Major depressive disorder is characterized by persistent feelings of sadness... <em>Cognitive-behavioral therapy demonstrates comparable efficacy to medication for mild to moderate depression and may provide more durable benefits.</em> Treatment-resistant depression may respond to augmentation strategies..."
          ]
        }
      },
      // ... other hits ...
    ]
  }
}
```

The `semantic` highlighter identifies the sentence that best captures the essence of the query ("treatments for neurodegenerative diseases" in this case) within the context of each retrieved document. This allows users to quickly locate the most relevant information without needing to read the entire document text. You can customize the highlight tags using the `pre_tags` and `post_tags` parameters if needed. 