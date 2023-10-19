---
layout: default
title: Bytes
parent: Ingest processors
nav_order: 20
redirect_from:
   - /api-reference/ingest-apis/processors/bytes/
---

# Bytes
**Introduced 1.0**
{: .label .label-purple }

The `bytes` processor converts a human-readable byte value to its equivalent value in bytes. The field can be a scalar or an array. If the field is a scalar, the value is converted and stored in the field. If the field is an array, all values of the array are converted.

### Example
The following is the syntax for the `bytes` processor: 

```json
{
    "bytes": {
        "field": "your_field_name"
    }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `bytes` processor.  

Parameter | Required | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field where the data should be converted. Supports template snippets. |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing`  | Optional  | If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`target_field`  | Optional  | The name of the field in which to store the parsed data. If not specified, the value will be stored in place in the `field` field. Default is `field`.  |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.** 

The following query creates a pipeline, named `file_upload`, that has one `bytes` processor. It converts the `file_size` to its byte equivalent and stores it in a new field named `file_size_bytes`:

```json
PUT _ingest/pipeline/file_upload
{
  "description": "Pipeline that converts file size to bytes",
  "processors": [
    {
      "bytes": {
        "field": "file_size",
        "target_field": "file_size_bytes"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline.** 

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/file_upload/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "file_size_bytes": "10485760",
        "file_size":
          "10MB"
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
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "event_types": [
            "event_type"
          ],
          "file_size_bytes": "10485760",
          "file_size": "10MB"
        },
        "_ingest": {
          "timestamp": "2023-08-22T16:09:42.771569211Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=file_upload
{
  "file_size": "10MB"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.** 

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
