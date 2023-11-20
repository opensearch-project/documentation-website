---
layout: default
title: Search methods
has_children: true
nav_order: 10
redirect_from:
  - /opensearch/search-template/
---

# Search methods

OpenSearch supports the following search methods:

- **Traditional search**

    - [Keyword (BM25) search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/keyword-search/): Takes into account only keywords.

- **Vector search**

    - [k-NN search]({{site.url}}{{site.baseurl}}/search-plugins/knn/): Searches for k nearest neighbors to a search term across an index of vectors.

    - [Neural search]({{site.url}}{{site.baseurl}}/search-plugins/neural-search/): Facilitates vector search at ingestion time and at search time.

        - [Text search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/semantic-search/): Uses dense retrieval based on text embedding models to search text data. 
        - [Multimodal search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/multimodal-search/): Uses vision-language embedding models to search text and image data. 
        - [Sparse search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/sparse-search/): Uses sparse retrieval based on sparse embedding models to search text data.

    - [Semantic search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/semantic-search/): Takes into account the meaning of the words in the search context.

    - [Hybrid search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/hybrid-search/): Combines traditional search and vector search to improve search relevance.

    - [Conversational search]({{site.url}}{{site.baseurl}}/search-plugins/search-methods/conversational-search/): Implements a retrieval-augmented generative search. 

## Terminology

It's helpful to understand the following terms before starting this tutorial.

### Semantic search

_Semantic search_: Employs neural search in order to determine the intention of the user's query in the search context and improve search relevance. 

### Neural search

_Neural search_: Facilitates vector search at ingestion time and at search time:
- At ingestion time, neural search uses language models to generate vector embeddings from the text fields in the document. The documents containing both the original text field and the vector embedding of the field are then indexed in a k-NN index, as shown in the following diagram. 

![Neural search at ingestion time diagram]({{site.url}}{{site.baseurl}}/images/neural-search-ingestion.png)
- At search time, when you then use a _neural query_, the query text is passed through a language model, and the resulting vector embeddings are compared with the document text vector embeddings to find the most relevant results, as shown in the following diagram.

![Neural search at search time diagram]({{site.url}}{{site.baseurl}}/images/neural-search-query.png)