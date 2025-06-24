---
layout: default
title: URL decode
parent: Ingest processors
nav_order: 320
canonical_url: https://docs.opensearch.org/docs/latest/ingest-pipelines/processors/urldecode/
---

# URL decode processor

The `urldecode` processor is useful for decoding URL-encoded strings in log data or other text fields. This can make the data more readable and easier to analyze, especially when working with URLs or query parameters that contain special characters or spaces.

The following is the syntax for the `urldecode` processor:

```json
{
  "urldecode": {
    "field": "field_to_decode",
    "target_field": "decoded_field"
  }
}
```
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `urldecode` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field`  | Required  | The field containing the URL-encoded string to be decoded. |
`target_field`  | Optional  | The field in which the decoded string is stored. If not specified, then the decoded string is stored in the same field as the original encoded string. |
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not contain the specified `field`. If set to `true`, then the processor ignores missing values in the `field` and leaves the `target_field` unchanged. Default is `false`. |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | Specifies whether the processor continues to run even if it encounters an error. If set to `true`, then failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `urldecode_pipeline` that uses the `urldecode` processor to decode the URL-encoded string in the `encoded_url` field and store the decoded string in the `decoded_url` field: 

```json
PUT _ingest/pipeline/urldecode_pipeline
{
  "description": "Decode URL-encoded strings",
  "processors": [
    {
      "urldecode": {
        "field": "encoded_url",
        "target_field": "decoded_url"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 2 (Optional): Test the pipeline

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/urldecode_pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "encoded_url": "https://example.com/search?q=hello%20world"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "decoded_url": "https://example.com/search?q=hello world",
          "encoded_url": "https://example.com/search?q=hello%20world"
        },
        "_ingest": {
          "timestamp": "2024-04-25T23:16:44.886165001Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=url_decode_pipeline
{
  "encoded_url": "https://example.com/search?q=url%20decode%20test"
}
```
{% include copy-curl.html %}

#### Response

The preceding request indexes the document into the index `testindex1` and indexes all documents containing the `encoded_url` field, which is processed by the `urldecode_pipeline` to populate the `decoded_url` field, as shown in the following response:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 67,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 68,
  "_primary_term": 47
}
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

#### Response

The response includes the original `encoded_url` field and the `decoded_url` field:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 67,
  "_seq_no": 68,
  "_primary_term": 47,
  "found": true,
  "_source": {
    "decoded_url": "https://example.com/search?q=url decode test",
    "encoded_url": "https://example.com/search?q=url%20decode%20test"
  }
}
```
{% include copy-curl.html %}
