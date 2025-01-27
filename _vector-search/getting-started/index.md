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
  - heading: "Auto-generated embeddings quickstart"
    description: "Use embeddings automatically generated within OpenSearch"
    link: "/vector-search/getting-started/auto-generated-embeddings/"
tutorial_cards:
  - heading: "Semantic and hybrid search tutorial"
    description: "Learn how to implement semantic and hybrid search"
    link: "/vector-search/getting-started/neural-search-tutorial/"
pre_items:
  - heading: "Generate embeddings"
    description: "Generate embeddings outside of OpenSearch using your favorite embedding utility."
  - heading: "Create an OpenSearch index"
    description: "Create an OpenSearch index to upload your embeddings."
    link: "/vector-search/creating-vector-index/index/#pre-generated-embeddings-or-raw-vectors"
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
    link: "/vector-search/creating-vector-index/index/#auto-generated-embeddings"
  - heading: "Ingest text"
    description: "Ingest your text into the index."
    link: "/vector-search/ingesting-data/#auto-generated-embeddings"
  - heading: "Search text"
    description: "Search your text using vector search. Query text is automatically converted to vector embeddings and compared to document embeddings."
    link: "/vector-search/searching-data/#searching-auto-generated-embeddings"
---

# Getting started with vector search

Vector search, also known as similarity search or nearest neighbor search, is a powerful technique for finding items that are most similar to a given input. Unlike traditional search methods that rely on exact keyword matches, vector search uses _vector embeddings_—--numerical representations of data such as text, images, or audio. These embeddings are transformed into multi-dimensional vectors, capturing deeper patterns and similarities in meaning, context, or structure.

Use cases include semantic search to understand user intent, recommendations (for example, an "other songs you might like" feature in a music application), image recognition, and fraud detection. For more background information about vector search, see [Nearest neighbor search](https://en.wikipedia.org/wiki/Nearest_neighbor_search).

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

---

## Quickstart

{% include cards.html cards=page.quickstart_cards %}

---

## Option 1: Pre-generated embeddings

Work with embeddings generated outside of OpenSearch:

{% include list.html list_items=page.pre_items%}

## Option 2: Auto-generated embeddings

Work with text that is automatically converted to embeddings within OpenSearch:

{% include list.html list_items=page.auto_items%}

---

## Tutorial

For a more in-depth look into vector search using auto-generated embeddings, follow a comprehensive tutorial.

{% include cards.html cards=page.tutorial_cards documentation_link=false %}