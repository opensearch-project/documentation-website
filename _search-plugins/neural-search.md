---
layout: default
title: Neural search
nav_order: 25
has_children: false
has_toc: false
redirect_from: 
  - /neural-search-plugin/index/
---

# Neural search

Neural search transforms text into vectors and facilitates vector search both at ingestion time and at search time. During ingestion, neural search transforms document text into vector embeddings and indexes both the text and its vector embeddings in a vector index. When you use a neural query during search, neural search converts the query text into vector embeddings, uses vector search to compare the query and document embeddings, and returns the closest results.

Before you ingest documents into an index, documents are passed through a machine learning (ML) model, which generates vector embeddings for the document fields. When you send a search request, the query text or image is also passed through the ML model, which generates the corresponding vector embeddings. Then neural search performs a vector search on the embeddings and returns matching documents.

## Prerequisite

Before using neural search, you must set up an ML model. When selecting a model, you have the following options:

- Use a pretrained model provided by OpenSearch. For more information, see [OpenSearch-provided pretrained models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/).

- Upload your own model to OpenSearch. For more information, see [Custom local models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/custom-local-models/).

- Connect to a foundation model hosted on an external platform. For more information, see [Connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/remote-models/index/).


## Tutorial

For a step-by-step tutorial, see [Neural search tutorial]({{site.url}}{{site.baseurl}}/search-plugins/neural-search-tutorial/).

## Using an ML model for neural search

Once you set up an ML model, choose one of the following search methods to use your model for neural search.

### Semantic search

Semantic search uses dense retrieval based on text embedding models to search text data. For detailed setup instructions, see [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/semantic-search/). 

### Hybrid search

Hybrid search combines keyword and neural search to improve search relevance. For detailed setup instructions, see [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/hybrid-search/).

### Multimodal search

Multimodal search uses neural search with multimodal embedding models to search text and image data. For detailed setup instructions, see [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/multimodal-search/).

### Sparse search

Sparse search uses neural search with sparse retrieval based on sparse embedding models to search text data. For detailed setup instructions, see [Sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

### Conversational search

With conversational search, you can ask questions in natural language, receive a text response, and ask additional clarifying questions. For detailed setup instructions, see [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/conversational-search/).
