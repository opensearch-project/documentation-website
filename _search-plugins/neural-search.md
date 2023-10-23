---
layout: default
title: Neural search
nav_order: 200
has_children: true
has_toc: false
redirect_from: 
  - /neural-search-plugin/index/
---

# Neural search

Neural search transforms text into vectors and facilitates vector search both at ingestion time and at search time. During ingestion, neural search transforms document text into vector embeddings and indexes both the text and its vector embeddings in a vector index. When you use a neural query during search, neural search converts the query text into vector embeddings, uses vector search to compare the query and document embeddings, and returns the closest results.

Neural search supports the following search types:

- [Text search]({{site.url}}{{site.baseurl}}/search-plugins/neural-text-search/): Uses dense retrieval based on text embedding models to search text data. 
- [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/neural-multimodal-search/): Uses vision-language embedding models to search text and image data. 
- [Sparse search]({{site.url}}{{site.baseurl}}/search-plugins/neural-sparse-search/): Uses sparse retrieval based on sparse embedding models to search text data.

## Embedding models

Before using neural search, you must set up a machine learning (ML) model. You can either use a pretrained model provided by OpenSearch, upload your own model to OpenSearch, or connect to a foundation model hosted on an external platform. For more information about ML models, see [Using custom models within OpenSearch]({{site.url}}{{site.baseurl}}/ml-commons-plugin/ml-framework/) and [ML Extensibility]({{site.url}}{{site.baseurl}}/ml-commons-plugin/extensibility/index/). For a step-by-step tutorial, see [Semantic search]({{site.url}}{{site.baseurl}}/ml-commons-plugin/semantic-search/).

Before you ingest documents into an index, documents are passed through the ML model, which generates vector embeddings for the document fields. When you send a search request, the query text or image is also passed through the ML model, which generates the corresponding vector embeddings. Then neural search performs a vector search on the embeddings and returns matching documents.