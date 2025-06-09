---
layout: default
title: DL model analyzers
parent: Analyzers
nav_order: 150
---

# DL model analyzers

The `ml-commons` plugin provides Deep Learning (DL) model-based analyzers that wrap machine learning models as OpenSearch tokenizers and analyzers.

OpenSearch currently supports the following DL model analyzers:

* [`bert-uncased`](#the-bert-uncased-analyzer): An analyzer based on the [google-bert/bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased) model tokenizer.
* [`mbert-uncased`](#the-mbert-uncased-analyzer): A multilingual analyzer based on the [google-bert/bert-base-multilingual-uncased](https://huggingface.co/google-bert/bert-base-multilingual-uncased) model tokenizer.

The DL model analyzers are designed to work with neural sparse search and should be used accordingly in your search applications.
{: .note}

## Installation

The DL model analyzers are included in the `ml-commons` plugin, which is installed by default in OpenSearch. No additional installation is required.

## Usage considerations

When using the DL model analyzers, keep the following considerations in mind:

* These analyzers use lazy loading. The first call to these analyzers may take longer as dependencies and related resources are loaded.
* The tokenizers follow the same rules as their corresponding model tokenizers.

## The bert-uncased analyzer

The `bert-uncased` analyzer is based on the [google-bert/bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased) model and tokenizes text according to BERT's WordPiece tokenization scheme. This analyzer is particularly useful for English language texts.

To analyze text with the `bert-uncased` analyzer:

```json
POST /_analyze
{
  "analyzer": "bert-uncased",
  "text": "It's fun to contribute to OpenSearch!"
}
```
{% include copy-curl.html %}

## The mbert-uncased analyzer

The `mbert-uncased` analyzer is based on the [google-bert/bert-base-multilingual-uncased](https://huggingface.co/google-bert/bert-base-multilingual-uncased) model, which supports tokenization across multiple languages. This makes it suitable for applications dealing with multilingual content.

To analyze multilingual text:

```json
POST /_analyze
{
  "analyzer": "mbert-uncased",
  "text": "It's fun to contribute to OpenSearch!"
}
```
{% include copy-curl.html %}