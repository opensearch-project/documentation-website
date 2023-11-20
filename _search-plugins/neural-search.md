---
layout: default
title: Neural search
nav_order: 30
has_children: false
has_toc: false
redirect_from: 
  - /neural-search-plugin/index/
---

# Neural search

Neural search transforms text into vectors and facilitates vector search both at ingestion time and at search time. During ingestion, neural search transforms document text into vector embeddings and indexes both the text and its vector embeddings in a vector index. When you use a neural query during search, neural search converts the query text into vector embeddings, uses vector search to compare the query and document embeddings, and returns the closest results.

Before you ingest documents into an index, documents are passed through a machine learning (ML) model, which generates vector embeddings for the document fields. When you send a search request, the query text or image is also passed through the ML model, which generates the corresponding vector embeddings. Then neural search performs a vector search on the embeddings and returns matching documents.

## Prerequisite

Before using neural search, you must set up an ML model. You can either use a pretrained model provided by OpenSearch, upload your own model to OpenSearch, or connect to a foundation model hosted on an external platform. For more information about ML models, see [Using ML models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/) and [Connecting to remote models]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/index/). For a step-by-step tutorial, see [Semantic search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search/).

## Set up neural search

Once you set up an ML model, choose one of the following search methods to learn how to use your model for neural search.

### Semantic search

Neural text search uses dense retrieval based on text embedding models to search text data. For detailed setup steps, see [Text search]({{site.url}}{{site.baseurl}}/search-plugins/neural-text-search/). 

### Hybrid search

Hybrid search combines keyword and neural search to improve search relevance. For detailed setup steps, see [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/hybrid-search/).

### Multimodal search

Multimodal search uses neural search with multimodal embedding models to search text and image data. For detailed setup steps, see  [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/multimodal-search/).

### Sparse search

Sparse search uses neural search with sparse retrieval based on sparse embedding models to search text data. For detailed setup steps, see [Sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/).

### Conversational search

Conversational search lets you ask questions in natural language, receive a text response, and follow up the text response with additional clarifying questions. For detailed setup steps, see [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/conversational-search/).
