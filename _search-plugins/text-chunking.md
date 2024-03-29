---
layout: default
title: Text chunking
nav_order: 65
---

# haining text chunking and embedding processors
Introduced 2.13
{: .label .label-purple }

To split long text into passages, you can use a `text_chunking` processor as a preprocessing step for a `text_embedding` or `sparse_encoding` processor in order to obtain embeddings for each chunked passage. For more information about the processor parameters, see [Text chunking processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/text-chunking/). Before you start, follow the steps outlined in the [pretrained model documentation]({{site.url}}{{site.baseurl}}/ml-commons-plugin/pretrained-models/) to register an embedding model. The following example preprocesses text by splitting it into passages and then produces embeddings using the `text_embedding` processor.

## Step 1: Create a pipeline

The following example request creates an ingest pipeline that converts the text in the `passage_text` field into chunked passages, which will be stored in the `passage_chunk` field. The text in the `passage_chunk` field is then converted into text embeddings, and the embeddings are stored in the `passage_embedding` field:

```json
PUT _ingest/pipeline/text-chunking-embedding-ingest-pipeline
{
  "description": "A text chunking and embedding ingest pipeline",
  "processors": [
    {
      "text_chunking": {
        "algorithm": {
          "fixed_token_length": {
            "token_limit": 10,
            "overlap_rate": 0.2,
            "tokenizer": "standard"
          }
        },
        "field_map": {
          "passage_text": "passage_chunk"
        }
      }
    },
    {
      "text_embedding": {
        "model_id": "LMLPWY4BROvhdbtgETaI",
        "field_map": {
          "passage_chunk": "passage_chunk_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Step 2: Create an index for ingestion

In order to use the ingest pipeline, you need to create a k-NN index. The `passage_chunk_embedding` field must be of a `nested` type. The `knn.dimension` field must contain the number of dimensions for your model:

```json
PUT testindex
{
  "settings": {
    "index": {
      "knn": true
    }
  },
  "mappings": {
    "properties": {
      "text": {
        "type": "text"
      },
      "passage_chunk_embedding": {
        "type": "nested",
        "properties": {
          "knn": {
            "type": "knn_vector",
            "dimension": 768
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Step 3: Ingest documents into the index

To ingest a document into the index created in the previous step, send the following request:

```json
POST testindex/_doc?pipeline=text-chunking-embedding-ingest-pipeline
{
  "passage_text": "This is an example document to be chunked. The document contains a single paragraph, two sentences and 24 tokens by standard tokenizer in OpenSearch."
}
```
{% include copy-curl.html %}

## Step 4: Search the index using neural search

You can use a `nested` query to perform vector search on your index. We recommend setting `score_mode` to `max`, where the document score is set to the maximum of the scores from all passage embeddings:

```json
GET testindex/_search
{
  "query": {
    "nested": {
      "score_mode": "max",
      "path": "passage_chunk_embedding",
      "query": {
        "neural": {
          "passage_chunk_embedding.knn": {
            "query_text": "document",
            "model_id": "-tHZeI4BdQKclr136Wl7"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Cascaded text chunking processors

You can chain multiple chunking processors together. For example, to split documents into paragraphs, apply the `delimiter` algorithm and specify the parameter as `\n\n`. To prevent a paragraph from exceeding the token limit, append another chunking processor that uses the `fixed_token_length` algorithm. You can configure the ingest pipeline for this example as follows:

```json
PUT _ingest/pipeline/text-chunking-cascade-ingest-pipeline
{
  "description": "A text chunking pipeline with cascaded algorithms",
  "processors": [
    {
      "text_chunking": {
        "algorithm": {
          "delimiter": {
            "delimiter": "\n\n"
          }
        },
        "field_map": {
          "passage_text": "passage_chunk1"
        }
      }
    },
    {
      "text_chunking": {
        "algorithm": {
          "fixed_token_length": {
            "token_limit": 500,
            "overlap_rate": 0.2,
            "tokenizer": "standard"
          }
        },
        "field_map": {
          "passage_chunk1": "passage_chunk2"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}