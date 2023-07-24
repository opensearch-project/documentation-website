---
layout: default
title: Convert
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 30
---

# Convert

The `convert` processor converts a field in a document to a different type, for example, a string to an integer  or an integer to a string. For an array field, all values in the array are converted. The syntax for the `convert` processor is: 

```json
{
    "convert": {
        "field": "field_name",
        "type": "target_type"
    }
}
```

## Configuration parameters

The following table lists the required and optional parameters for the `convert` processor.   

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field`  | Required  | Name of the field whose value to convert.  |
`type`  | Required  | The type to convert the field value to. The supported types are `integer`, `long`, `float`, `double`, `string`, `boolean`, `ip`, and `auto`. If the `type` is `boolean`, the value is set to `true` if the field value is a string `"true"` (ignoring case), and to `false` if  the field value is a string `"false"` (ignoring case). For all other  values, an exception is thrown.  |
`target_field`  | Optional  | Name of the field to store the converted value. If not specified, the value will be stored in-place in the `field` field. Default is `field`.  |
`ignore_missing`  | Optional  | If set to true, the processor will not fail if the field does not exist. Default is `false`.  |
`if`  | Optional  | Conditional expression that determines whether the processor should be deployed.  |
`ignore_failure`  | Optional  | If set to true, the processor will not fail if an error occurs.  | 
`on_failure`  | Optional  | Action to take if an error occurs.  | 
`tag`  | Optional  | Tag that can be used to identify the processor.  | 
`description`  | Optional  | Brief description of the processor.  |  

Following is an example of adding the `convert` processor to an ingest pipeline.

```json
PUT _ingest/pipeline/convert-age
{
  "description": "Pipeline that converts age to an integer",
  "processors": [
    {
      "convert": {
        "field": "age",
        "target_field": "age_int",
        "type": "integer"
      }
    }
  ]
}

PUT testindex1/_doc/1?pipeline=convert-age
{
  "age": "20"
}
```

This pipeline converts the `file_size` field from a string to an integer, making it possible to perform numerical operations and aggregations on the `file_size` field. Following is the GET request and response.

```json
GET testindex1/_doc/1
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 17,
  "_seq_no": 16,
  "_primary_term": 2,
  "found": true,
  "_source": {
    "age_int": 20,
    "age": "20"
  }
}
```
