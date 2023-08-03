---
layout: default
title: Bytes
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 20
---

# Bytes

The `bytes` processor converts a human-readable byte value to its equivalent value in bytes. The field can be a scalar or an array. If the field is a scalar, the value is converted and stored in the field. If the field is an array, all values of the array are converted.

The syntax for the `bytes` processor is: 

```json
{
    "bytes": {
        "field": "your_field_name",
    }
}
```

## Configuration parameters

The following table lists the required and optional parameters for the `bytes` processor.  

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field`  | Required  | Name of the field where the data should be converted.  |
`target_field`  | Optional  | Name of the field to store the converted value. If not specified, the value will be stored in-place in the `field` field. Default is `field`.  |
`description`  | Optional  | Brief description of the processor.  |
`ignore_missing`  | Optional  | If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`. |
`if`  | Optional  | Conditional expression that determines whether the processor should be deployed.  |
`ignore_failure`  | Optional  | If set to `true`, the processor will not fail if an error occurs.  | 
`on_failure`  | Optional  | A list of processors to run if the processor fails.  | 
`tag`  | Optional  | Tag that can be used to identify the processor.  | 
  

The following query creates a pipeline, named `file_upload`, that has one bytes processor. It converts the `file_size` to its byte equivalent and stores it in a new field `file_size_bytes`:

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
```

Ingest a document into the index:

```json
PUT testindex1/_doc/1?pipeline=file_upload
{
  "file_size": "10MB"
}
```
{% include copy-curl.html %}
```

To view the ingested document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
```

To test the processor, run the following query:

```json
POST _ingest/pipeline/user-behavior/_simulate
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

The following query creates a pipeline with the bytes processor and one optional parameter, `on_failure`, which uses the `set` processor to set the `error` field with a specific error message:

``json
PUT _ingest/pipeline/file_upload
{
  "description": "Pipeline that converts file size to bytes",
  "processors": [
    {
      "bytes": {
        "field": "file_size",
        "target_field": "file_size_bytes",
        "on_failure": [
          {
            "set": {
              "field": "error",
              "value": "Failed to convert"
            }
          }
        ]
      }
    }
  ]
}
```
{% include copy-curl.html %}
```
