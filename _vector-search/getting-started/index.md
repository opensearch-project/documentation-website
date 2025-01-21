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
    link: "/vector-search/querying-data/#searching-pre-generated-embeddings-or-raw-vectors"
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
    link: "/vector-search/querying-data/#searching-auto-generated-embeddings"
---

# Getting started with vector search

You can either upload pre-generated embeddings to OpenSearch or have OpenSearch automatically generate embeddings from your text.

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

For a more in-depth look into text-to-embedding search, follow a comprehensive tutorial.

{% include cards.html cards=page.tutorial_cards documentation_link=false %}