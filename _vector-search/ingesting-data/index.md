---
layout: default
title: Ingesting data
nav_order: 30
has_children: true
has_toc: false
redirect_from:
  - /vector-search/ingesting-data/
canonical_url: https://docs.opensearch.org/latest/vector-search/ingesting-data/index/
---

# Ingesting data into a vector index

After creating a vector index, you need to either ingest raw vector data or convert data to embeddings while ingesting it.

## Comparison of ingestion methods

The following table compares the two ingestion methods.

| Feature                       | Data format          | Ingest pipeline | Vector generation         | Additional fields            |
|-------------------------------|----------------------------|---------------------|---------------------------------|-----------------------------------|
| **Raw vector ingestion**      | Pre-generated vectors      | Not required        | External                        | Optional metadata                |
| **Converting data to embeddings during ingestion** | Text or image data                   | Required            | Internal (during ingestion)     | Original data + embeddings        |

## Raw vector ingestion

When working with raw vectors or embeddings generated outside of OpenSearch, you directly ingest vector data into the `knn_vector` field. No pipeline is required because the vectors are already generated:

```json
PUT /my-raw-vector-index/_doc/1
{
  "my_vector": [0.1, 0.2, 0.3],
  "metadata": "Optional additional information"
}
```
{% include copy-curl.html %}

You can also use the [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) to ingest multiple vectors efficiently:

```json
PUT /_bulk
{"index": {"_index": "my-raw-vector-index", "_id": 1}}
{"my_vector": [0.1, 0.2, 0.3], "metadata": "First item"}
{"index": {"_index": "my-raw-vector-index", "_id": 2}}
{"my_vector": [0.2, 0.3, 0.4], "metadata": "Second item"}
```
{% include copy-curl.html %}

## Converting data to embeddings during ingestion

After you have [configured an ingest pipeline]({{site.url}}{{site.baseurl}}/vector-search/creating-vector-index/#converting-data-to-embeddings-during-ingestion) that automatically generates embeddings, you can ingest text data directly into your index:

```json
PUT /my-ai-search-index/_doc/1
{
  "input_text": "Example: AI search description"
}
```
{% include copy-curl.html %}

The pipeline automatically generates and stores the embeddings in the `output_embedding` field.

You can also use the [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) to ingest multiple documents efficiently:

```json
PUT /_bulk
{"index": {"_index": "my-ai-search-index", "_id": 1}}
{"input_text": "Example AI search description"}
{"index": {"_index": "my-ai-search-index", "_id": 2}}
{"input_text": "Bulk API operation description"}
```
{% include copy-curl.html %}

## Working with sparse vectors

OpenSearch also supports sparse vectors. For more information, see [Neural sparse search]({{site.url}}{{site.baseurl}}/vector-search/ai-search/neural-sparse-search/).

## Text chunking

For information about splitting large documents into smaller passages before generating embeddings during dense or sparse AI search, see [Text chunking]({{site.url}}{{site.baseurl}}/vector-search/ingesting-data/text-chunking/).

## Next steps

- [Searching vector data]({{site.url}}{{site.baseurl}}/vector-search/searching-data/)
- [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/)
- [Ingest pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/)
- [Text embedding processor]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/text-embedding/)