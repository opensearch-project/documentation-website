---
layout: default
title: DL model analyzers
parent: Analyzers
nav_order: 130
---

# DL model analyzers

Deep learning (DL) model analyzers are designed to work with [neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/). They implement the same tokenization rules used by machine learning (ML) models, ensuring compatibility with neural sparse search. While traditional OpenSearch analyzers use standard rule-based tokenization (like white space or word boundaries), DL model analyzers use tokenization rules that match specific ML models (like the BERT WordPiece tokenization scheme). This consistent tokenization between indexed documents and search queries is essential for neural sparse search to work correctly.

OpenSearch supports the following DL model analyzers:

* [`bert-uncased`](#the-bert-uncased-analyzer): An analyzer based on the [google-bert/bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased) model tokenizer.
* [`mbert-uncased`](#the-mbert-uncased-analyzer): A multilingual analyzer based on the [google-bert/bert-base-multilingual-uncased](https://huggingface.co/google-bert/bert-base-multilingual-uncased) model tokenizer.

For Japanese text, use the [`mbert-uncased` analyzer](#the-mbert-uncased-analyzer) instead: the `bert-uncased` vocabulary is missing many kana characters, so many Japanese words, such as `パソコン`, are tokenized as `[UNK]` and match no documents.
{: .tip }

## Usage considerations

When using the DL model analyzers, keep the following considerations in mind:

* These analyzers use lazy loading. The first call to these analyzers may take longer because dependencies and related resources are loaded.
* The tokenizers follow the same rules as their corresponding model tokenizers.

## The bert-uncased analyzer

The `bert-uncased` analyzer is based on the [google-bert/bert-base-uncased](https://huggingface.co/google-bert/bert-base-uncased) model and tokenizes text according to the BERT WordPiece tokenization scheme. This analyzer is particularly useful for English language text. 

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

### Half-width and full-width characters

Like the model tokenizer, the `mbert-uncased` analyzer does not normalize half-width and full-width forms. For example, half-width `ｶﾒﾗ` is tokenized as `[UNK]`, so it does not match full-width `カメラ`, and full-width `ＡＢＣ` does not match `abc`. The analyzer also removes Japanese voiced sound marks (dakuten and handakuten), so `パ` and `ハ` produce the same token.

To match half-width and full-width forms, apply Unicode Normalization Form Compatibility Composition (NFKC) to both documents and queries. Normalize documents before they are encoded, for example, by using a `script` processor in the ingest pipeline:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline-sparse
{
  "processors": [
    {
      "script": {
        "source": "ctx.passage_text = Normalizer.normalize(ctx.passage_text, Normalizer.Form.NFKC)"
      }
    },
    {
      "sparse_encoding": {
        "model_id": "<model_id>",
        "field_map": {
          "passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

To normalize queries, create a custom analyzer that applies the [ICU normalization character filter]({{site.url}}{{site.baseurl}}/analyzers/character-filters/icu-normalization/) before the `mbert-uncased` tokenizer. The character filter requires the [`analysis-icu` plugin]({{site.url}}{{site.baseurl}}/analyzers/language-analyzers/icu/#installing-the-icu-plugin):

```json
PUT /my-nlp-index
{
  "settings": {
    "default_pipeline": "nlp-ingest-pipeline-sparse",
    "analysis": {
      "char_filter": {
        "nfkc": {
          "type": "icu_normalizer",
          "name": "nfkc",
          "mode": "compose"
        }
      },
      "analyzer": {
        "mbert_nfkc": {
          "type": "custom",
          "char_filter": ["nfkc"],
          "tokenizer": "mbert-uncased"
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "passage_text": {
        "type": "text"
      },
      "passage_embedding": {
        "type": "rank_features"
      }
    }
  }
}
```
{% include copy-curl.html %}

Then specify the custom analyzer in the `neural_sparse` query:

```json
GET /my-nlp-index/_search
{
  "query": {
    "neural_sparse": {
      "passage_embedding": {
        "query_text": "ｶﾒﾗ",
        "analyzer": "mbert_nfkc"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example

For a complete example of using DL model analyzers in neural sparse search queries, see [Generating sparse vector embeddings automatically]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-with-pipelines/).