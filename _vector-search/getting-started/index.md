---
layout: default
title: Getting started
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /vector-search/getting-started/
quickstart_cards:
  - heading: "Pre-generated embeddings quickstart"
    description: "Use embeddings generated outside of OpenSearch"
    link: "/vector-search/getting-started/pre-generated-embeddings/"
tutorial_cards:
  - heading: "Auto-generated embeddings quickstart"
    description: "Use embeddings automatically generated within OpenSearch"
    link: "/vector-search/getting-started/auto-generated-embeddings/"
  - heading: "Getting started with semantic and hybrid search"
    description: "Learn how to implement semantic and hybrid search"
    link: "/vector-search/getting-started/tutorials/neural-search-tutorial/"
pre_items:
  - heading: "Generate embeddings"
    description: "Generate embeddings outside of OpenSearch using your favorite embedding utility."
  - heading: "Create an OpenSearch index"
    description: "Create an OpenSearch index to upload your embeddings."
    link: "/vector-search/creating-vector-index/#pre-generated-embeddings-or-raw-vectors"
  - heading: "Ingest embeddings"
    description: "Ingest your embeddings into the index."
    link: "/vector-search/ingesting-data/#raw-vector-ingestion"
  - heading: "Search embeddings"
    description: "Search your embeddings using vector search."
    link: "/vector-search/searching-data/#searching-pre-generated-embeddings-or-raw-vectors"
auto_items:
  - heading: "Configure an embedding model"
    description: "Configure a machine learning model that will automatically generate embeddings from your text at ingest time and query time."
    link: "/ml-commons-plugin/integrating-ml-models/"
  - heading: "Create an OpenSearch index"
    description: "Create an OpenSearch index to upload your text."
    link: "/vector-search/creating-vector-index/#auto-generated-embeddings"
  - heading: "Ingest text"
    description: "Ingest your text into the index."
    link: "/vector-search/ingesting-data/#auto-generated-embeddings"
  - heading: "Search text"
    description: "Search your text using vector search. Query text is automatically converted to vector embeddings and compared to document embeddings."
    link: "/vector-search/searching-data/#searching-auto-generated-embeddings"
---

# Getting started with vector search

Vector search, also known as similarity search or nearest neighbor search, is a powerful technique for finding items that are most similar to a given input. Use cases include semantic search to understand user intent, recommendations (for example, an "other songs you might like" feature in a music application), image recognition, and fraud detection. For more background information about vector search, see [Nearest neighbor search](https://en.wikipedia.org/wiki/Nearest_neighbor_search).

## Vector embeddings

Unlike traditional search methods that rely on exact keyword matches, vector search uses _vector embeddings_---numerical representations of data such as text, images, or audio. These embeddings are stored as multi-dimensional vectors, capturing deeper patterns and similarities in meaning, context, or structure. For example, a large language model (LLM) can create vector embeddings from input text, as shown in the following image.

![Generating embeddings from text]({{site.url}}{{site.baseurl}}/images/vector-search/embeddings.png)

## Similarity search

A vector embedding is a vector in a high-dimensional space. Its position and orientation capture meaningful relationships between objects. Vector search finds the most similar results by comparing a query vector to stored vectors and returning the closest matches. OpenSearch uses the k-nearest neighbors (k-NN) algorithm to efficiently identify the most similar vectors. Unlike keyword search, which relies on exact word matches, vector search measures similarity based on distance in this high-dimensional space.

In the following image, the vectors for `Wild West` and `Broncos` are closer to each other, while both are far from `Basketball`, reflecting their semantic differences.

![Similarity search]({{site.url}}{{site.baseurl}}/images/vector-search/vector-similarity.jpg){: width="450px"}

To learn more about the types of vector search that OpenSearch supports, see [Vector search techniques]({{site.url}}{{site.baseurl}}/vector-search/vector-search-techniques/).

## Vector search options

OpenSearch offers two options for implementing vector search:

- [Pre-generated embeddings or raw vectors](#option-1-pre-generated-embeddings): You already have pre-computed embeddings or raw vectors from external tools or services.
  - **Ingestion**: Ingest pre-generated embeddings directly into OpenSearch. 

      ![Pre-generated embeddings ingestion]({{site.url}}{{site.baseurl}}/images/vector-search/raw-vector-ingest.png)
  - **Search**: Perform vector search to find the vectors that are closest to a query vector.

      ![Pre-generated embeddings search]({{site.url}}{{site.baseurl}}/images/vector-search/raw-vector-search.png)

- [Auto-generated embeddings](#option-2-auto-generated-embeddings): OpenSearch automatically generates vector embeddings for you using a machine learning (ML) model.
  - **Ingestion**:  You ingest plain text data, and OpenSearch uses an ML model to generate embeddings dynamically. 

      ![Auto-generated embeddings ingestion]({{site.url}}{{site.baseurl}}/images/vector-search/auto-vector-ingest.png)
  - **Search**: At query time, OpenSearch uses the same ML model to convert your input text to embeddings, and these embeddings are used for vector search.

      ![Auto-generated embeddings search]({{site.url}}{{site.baseurl}}/images/vector-search/auto-vector-search.png)

## Option 1: Pre-generated embeddings

{% include cards.html cards=page.quickstart_cards %}

Working with embeddings generated outside of OpenSearch involves the following steps:

{% include list.html list_items=page.pre_items%}

## Option 2: Auto-generated embeddings

{% include cards.html cards=page.tutorial_cards %}

Working with text that is automatically converted to embeddings within OpenSearch involves the following steps:

{% include list.html list_items=page.auto_items%}

