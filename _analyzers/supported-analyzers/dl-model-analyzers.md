---
layout: default
title: DL model analyzers
parent: Analyzers
nav_order: 130
---

# DL model analyzers

Deep learning (DL) model analyzers are designed to work with [neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/). They implement the same tokenization rules used by machine learning (ML) models, ensuring compatibility with neural sparse search. While traditional OpenSearch analyzers use standard rule-based tokenization (like white space or word boundaries), DL model analyzers use tokenization rules that match specific ML models (like BERT's WordPiece tokenization scheme). This consistent tokenization between indexed documents and search queries is essential for neural sparse search to work correctly.

OpenSearch supports the following DL model analyzers:

* [`bert-uncased`](#the-bert-uncased-analyzer): An analyzer based on the [google-bert/bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased) model tokenizer.
* [`mbert-uncased`](#the-mbert-uncased-analyzer): A multilingual analyzer based on the [google-bert/bert-base-multilingual-uncased](https://huggingface.co/google-bert/bert-base-multilingual-uncased) model tokenizer.

## Usage considerations

When using the DL model analyzers, keep the following considerations in mind:

* These analyzers use lazy loading. The first call to these analyzers may take longer because dependencies and related resources are loaded.
* The tokenizers follow the same rules as their corresponding model tokenizers.

## The bert-uncased analyzer

The `bert-uncased` analyzer is based on the [google-bert/bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased) model and tokenizes text according to BERT's WordPiece tokenization scheme. This analyzer is particularly useful for English language text.

To analyze text with the `bert-uncased` analyzer, specify it in the `analyzer` field:

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

To analyze multilingual text, specify the `mbert-uncased` analyzer in the request:

```json
POST /_analyze
{
  "analyzer": "mbert-uncased",
  "text": "It's fun to contribute to OpenSearch!"
}
```
{% include copy-curl.html %}

## Example

For a complete example of using DL model analyzers in neural sparse search queries, see [Generating sparse vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/).