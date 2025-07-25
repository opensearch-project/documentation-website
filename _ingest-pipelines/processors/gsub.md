---
layout: default
title: gsub
parent: Ingest processors
nav_order: 130
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/gsub/
---

# Gsub processor

The `gsub` processor performs a regular expression search-and-replace operation on string fields in incoming documents. If the field contains an array of strings, the operation is applied to all elements in the array. However, if the field contains non-string values, the processor throws an exception. Use cases for the `gsub` processor include removing sensitive information from log messages or user-generated content, normalizing data formats or conventions (for example, converting date formats, removing special characters), and extracting or transforming substrings from field values for further processing or analysis.

The following is the syntax for the `gsub` processor:

```json
"gsub": {
  "field": "field_name",
  "pattern": "regex_pattern",
  "replacement": "replacement_string"
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `gsub` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The field to apply the replacement to.
`pattern` | Required | The pattern to be replaced.
`replacement` | Required | The string that will replace the matching patterns.
`target_field` | Optional | The name of the field in which to store the parsed data. If `target_field` is not specified, the parsed data replaces the original data in the `field` field. Default is `field`.
`if` | Optional | A condition for running the processor.
`ignore_missing` | Optional | Specifies whether the processor should ignore documents that do not contain the specified field. Default is `false`.
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters an error. If set to `true`, then failures are ignored. Default is `false`.
`on_failure` | Optional | A list of processors to run if the processor fails.
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `gsub_pipeline` that uses the `gsub` processor to replace all occurrences of the word `error` with the word `warning` in the `message` field:

```json
PUT _ingest/pipeline/gsub_pipeline
{
  "description": "Replaces 'error' with 'warning' in the 'message' field",
  "processors": [
    {
      "gsub": {
        "field": "message",
        "pattern": "error",
        "replacement": "warning"
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
POST _ingest/pipeline/gsub_pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "This is an error message"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The following response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "message": "This is an warning message"
        },
        "_ingest": {
          "timestamp": "2024-05-22T19:47:00.645687211Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `logs`:

```json
PUT logs/_doc/1?pipeline=gsub_pipeline
{
  "message": "This is an error message"
}
```
{% include copy-curl.html %}

#### Response

The following response shows that the request indexed the document into the index named `logs` and that the `gsub` processor replaced all occurrences of the word `error` with the word `warning` in the `message` field:

```json
{
  "_index": "logs",
  "_id": "1",
  "_version": 1,
  "result": "created",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 0,
  "_primary_term": 1
}
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET logs/_doc/1
```
{% include copy-curl.html %}

#### Response

The following response shows the document with the modified `message` field value:

```json
{
  "_index": "logs",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "message": "This is an warning message"
  }
}
```
{% include copy-curl.html %}


