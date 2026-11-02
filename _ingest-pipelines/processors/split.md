---
layout: default
title: Split
parent: Ingest processors
nav_order: 255
---

# Split ingest processor

The `split` processor is used to split a string field into an array of substrings based on a specified delimiter.

The following is the syntax for the `split` processor:

```json
{
  "split": {
    "field": "field_to_split",
    "separator": "<delimiter>",
    "target_field": "split_field"
  }
}
```
{% include copy.html %}

## Parameters

The following table lists the required and optional parameters for the `split` processor.

Parameter  | Required/Optional  | Description 
:--- | :--- | :--- 
`field` | Required | The field containing the string to be split. 
`separator` | Required | A regular expression that matches the delimiter used to split the string. To split on a character that has a special meaning in regular expressions, such as `.` or `+`, escape it, for example, `\\.`. 
`preserve_trailing` | Optional | If set to `true`, preserves empty trailing fields (for example, `''`) in the resulting array. If set to `false`, then empty trailing fields are removed from the resulting array. Default is `false`. 
`target_field` | Optional | The field where the array of substrings is stored. If not specified, then the field is updated in-place. 
`ignore_missing` | Optional	| Specifies whether the processor should ignore documents that do not contain the specified field. If set to `true`, then the processor ignores missing values in the field and leaves the `target_field` unchanged. Default is `false`.  
`description` | Optional | A brief description of the processor. 
`if` | Optional | A condition for running the processor. 
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters an error. If set to `true`, then failures are ignored. Default is `false`. 
`on_failure` | Optional | A list of processors to run if the processor fails. 
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. For more information, see [Using processor tags for monitoring and debugging]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#using-processor-tags-for-monitoring-and-debugging).

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `split_pipeline` that uses the `split` processor to split the `log_message` field on the comma character and store the resulting array in the `log_parts` field: 

```json
PUT _ingest/pipeline/split_pipeline
{
  "description": "Split log messages by comma",
  "processors": [
    {
      "split": {
        "field": "log_message",
        "separator": ",",
        "target_field": "log_parts"
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
POST _ingest/pipeline/split_pipeline/_simulate
{
  "docs": [
    {
      "_source": {
        "log_message": "error,warning,info"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "log_message": "error,warning,info",
          "log_parts": [
            "error",
            "warning",
            "info"
          ]
        },
        "_ingest": {
          "timestamp": "2024-04-26T22:29:23.207849376Z"
        }
      }
    }
  ]
}
```

### Step 3: Ingest a document

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=split_pipeline
{
  "log_message": "error,warning,info"
}
```
{% include copy-curl.html %}

The request indexes the document into the index `testindex1` and splits the `log_message` field on the comma delimiter and stores the result in the `log_parts` field before indexing, as shown in the following response:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 70,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "_seq_no": 72,
  "_primary_term": 47
}
```

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

The response contains the ingested document, transformed as shown in the response in Step 2.

## Preserving empty trailing fields

By default, the `split` processor removes empty trailing elements from the resulting array. The following request splits the same value with and without `preserve_trailing`:

```json
POST _ingest/pipeline/_simulate
{
  "pipeline": {
    "processors": [
      {
        "split": {
          "field": "colors",
          "separator": ","
        }
      },
      {
        "split": {
          "field": "colors_preserved",
          "separator": ",",
          "preserve_trailing": true
        }
      }
    ]
  },
  "docs": [
    {
      "_source": {
        "colors": "red,green,,",
        "colors_preserved": "red,green,,"
      }
    }
  ]
}
```
{% include copy-curl.html %}

In the response, the `colors` array contains only the two non-empty elements, while the `colors_preserved` array also contains the two empty trailing elements:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "colors": ["red", "green"],
          "colors_preserved": ["red", "green", "", ""]
        },
        "_ingest": {
          "timestamp": "2026-10-14T19:44:03.298240422Z"
        }
      }
    }
  ]
}
```
