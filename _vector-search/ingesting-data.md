---
layout: default
title: Ingesting data
nav_order: 30
---

# Ingesting data into a vector index

After creating a vector index, you need to ingest data according to your chosen vector search approach. This guide outlines the ingestion process for each type of vector search: raw vector ingestion and auto-generated embeddings.

## Comparison of ingestion methods

The following table compares ingestion for each vector search method.

| Feature                       | Data format          | Ingest pipeline | Vector generation         | Additional fields            |
|-------------------------------|----------------------------|---------------------|---------------------------------|-----------------------------------|
| **Raw vector ingestion**      | Pre-generated vectors      | Not required        | External                        | Optional metadata                |
| **Auto-generated embeddings** | Text                   | Required            | Internal (during ingestion)     | Original text + embeddings        |

## Raw vector ingestion

Raw vector ingestion does not require an ingest pipeline because vectors are pre-generated outside of OpenSearch.

When working with pre-generated embeddings, you directly ingest vector data into the `knn_vector` field. No pipeline is required because the vectors are already generated:

```json
POST /my-raw-vector-index/_doc
{
  "my_vector": [0.1, 0.2, 0.3, ..., 0.128],
  "metadata": "Optional additional information"
}
```
{% include copy-curl.html %}

You can also use the Bulk API to ingest multiple vectors efficiently:

```json
POST /_bulk
{"index": {"_index": "my-raw-vector-index"}}
{"my_vector": [0.1, 0.2, 0.3, ..., 0.128], "metadata": "First item"}
{"index": {"_index": "my-raw-vector-index"}}
{"my_vector": [0.2, 0.3, 0.4, ..., 0.129], "metadata": "Second item"}
```
{% include copy-curl.html %}

**Key Characteristics:**
- Direct ingestion of vector arrays
- No transformation during ingestion
- Optional metadata fields
- Supports single document or bulk ingestion


## Auto-generated embeddings

For auto-generated embeddings, you first need to set up an ingest pipeline that will convert text to vectors. Then, you ingest text data, and the pipeline automatically generates the embeddings:

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

After setting up the pipeline, ingest text data:

```json
POST /my-semantic-search-index/_doc
{
  "passage_text": "Your text content here",
  "metadata": "Optional additional information"
}
```
{% include copy-curl.html %}

The pipeline automatically generates and stores the embeddings in the `passage_embedding` field.

**Key Characteristics:**
- Ingest plain text
- Automatic vector generation during ingestion
- Original text preserved
- Pipeline handles transformation

## Best practices

When ingesting data into vector indexes, consider the following best practices:

1. **Batch processing**: Use the Bulk API for better performance when ingesting multiple documents.
2. **Pipeline monitoring**: Monitor pipeline performance and errors, especially for auto-generated embeddings.
3. **Data validation**: Ensure vector dimensions match the index configuration.
4. **Error handling**: Implement proper error handling for failed ingestion attempts.
5. **Resource management**: Monitor system resources during large-scale ingestion, especially with auto-generated embeddings.

## Further reading

- [Bulk API Documentation]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/)
- [Ingest Pipeline Documentation]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/)
- [Text Embedding Processor Documentation]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/processors/text-embedding/)
