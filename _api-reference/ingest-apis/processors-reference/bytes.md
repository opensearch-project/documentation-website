---
layout: default
title: Bytes
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 20
---

# Bytes

The `bytes` processor converts a human-readable byte value to its equivalent value in bytes. The field can be a scalar or an array. If the field is a scalar, the value is converted and stored in the field. If the field is an array, all members of the array are converted.

The syntax for the `bytes` processor is: 

```json
{
    "bytes": {
        "field": "source_field",
        "target_field": "destination_field"
    }
}
```

## Configuration parameters

The following table lists the required and optional parameters for the `bytes` processor.  

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field`  | Required  | Name of the field where the data should be converted.  |
`target_field`  | Required  | Name of the field to store the converted value. If not specified, the value will be stored in-place in the `field` field. Default is `field`.  |
`ignore_missing`  | Optional  | If set to true, the processor will not fail if the field does not exist. Default is `false`. |
`if`  | Optional  | Conditional expression that determines whether the processor should be deployed.  |
`ignore_failure`  | Optional  | If set to true, the processor will not fail if an error occurs.  | 
`on_failure`  | Optional  | Action to take if an error occurs.  | 
`tag`  | Optional  | Tag that can be used to identify the processor.  | 
`description`  | Optional  | Brief description of the processor.  |  

Following is an example of a pipeline using a `bytes` processor.

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

PUT testindex1/_doc/1?pipeline=file_upload
{
  "file_size": "10MB"
}
```

This pipeline, named `file_upload`, has one bytes processor. It converts the `file_size` to its byte equivalent and stores it in a new field `file_size_bytes`. Following is the GET request and response.

```json
GET testindex1/_doc/1
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 3,
  "_seq_no": 2,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "file_size_bytes": 10485760,
    "file_size": "10MB"
  }
}
```