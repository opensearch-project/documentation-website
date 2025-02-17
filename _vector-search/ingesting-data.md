---
layout: default
title: Ingesting data
nav_order: 30
---

# Ingesting data into a vector index

After creating a vector index, you need to either ingest raw vector data or convert data to embeddings while ingesting it.

## Comparison of ingestion methods

The following table compares ingestion for each vector search method.

| Feature                       | Data format          | Ingest pipeline | Vector generation         | Additional fields            |
|-------------------------------|----------------------------|---------------------|---------------------------------|-----------------------------------|
| **Raw vector ingestion**      | Pre-generated vectors      | Not required        | External                        | Optional metadata                |
| **Converting data to embeddings during ingestion** | Text, image, or other data                   | Required            | Internal (during ingestion)     | Original data + embeddings        |

## Raw vector ingestion

When working with raw vectors or embeddings generated outside of OpenSearch, you directly ingest vector data into the `knn_vector` field. No pipeline is required because the vectors are already generated:

```json
POST /my-raw-vector-index/_doc
{
  "my_vector": [0.1, 0.2, 0.3, ..., 0.128],
  "metadata": "Optional additional information"
}
```
{% include copy-curl.html %}

You can also use the [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) to ingest multiple vectors efficiently:

```json
POST /_bulk
{"index": {"_index": "my-raw-vector-index"}}
{"my_vector": [0.1, 0.2, 0.3, ..., 0.128], "metadata": "First item"}
{"index": {"_index": "my-raw-vector-index"}}
{"my_vector": [0.2, 0.3, 0.4, ..., 0.129], "metadata": "Second item"}
```
{% include copy-curl.html %}

## Converting data to embeddings during ingestion

To automatically generate embeddings during ingestion, you first need to set up an ingest pipeline that will convert text to vectors:

```json
PUT /_ingest/pipeline/nlp-ingest-pipeline
{
  "description": "Text to dense vector pipeline",
  "processors": [
    {
      "text_embedding": {
        "model_id": "your-model-id",
        "field_map": {
          "passage_text": "passage_embedding"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

Then, you ingest text data, and the pipeline automatically generates the embeddings:

```json
POST /my-semantic-search-index/_doc
{
  "passage_text": "Your text content here"
}
```
{% include copy-curl.html %}

The pipeline automatically generates and stores the embeddings in the `passage_embedding` field.

## Next steps

- [Searching vector data]({{site.url}}{{site.baseurl}}/vector-search/searching-data/)
- [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/)
- [Ingest pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/)
- [Text embedding processor]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/text-embedding/)
