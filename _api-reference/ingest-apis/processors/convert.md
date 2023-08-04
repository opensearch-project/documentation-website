---
layout: default
title: Convert
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 30
---

# Convert

The `convert` processor converts a field in a document to a different type, for example, a string to an integer or an integer to a string. For an array field, all values in the array are converted. The syntax for the `convert` processor is: 

```json
{
    "convert": {
        "field": "field_name",
        "type": "type-value"
    }
}
```

## Configuration parameters

The following table lists the required and optional parameters for the `convert` processor.   

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field`  | Required  | Name of the field whose value to convert.  |
`type`  | Required  | The type to convert the field value to. The supported types are `integer`, `long`, `float`, `double`, `string`, `boolean`, `ip`, and `auto`. If the `type` is `boolean`, the value is set to `true` if the field value is a string `"true"` (ignoring case), and to `false` if  the field value is a string `"false"` (ignoring case). If the value is not one of the allowed values, an error will occur.  |
`description`  | Optional  | Brief description of the processor.  |  
`target_field`  | Optional  | Name of the field to store the converted value. If not specified, the value will be stored in-place in the `field` field. Default is `field`.  |
`if`  | Optional  | Conditional expression that determines whether the processor should be deployed.  |
`ignore_missing` | If set to `true`, the processor will ignore documents that do not have a value for the specified field. Default is `false`.
`ignore_failure`  | Optional  | If set to true, the processor will not fail if an error occurs. Default is `false`.  | 
`on_failure`  | Optional  | Action to take if an error occurs.  | 
`tag`  | Optional  | Tag that can be used to identify the processor.  | 

The following query creates a pipeline, named `convert-price`, that converts `price` to a floating-point number and stores the converted value in the `price_float` field:

```json
PUT _ingest/pipeline/convert-price
{
  "description": "Pipeline that converts price to floating-point number",
  "processors": [
    {
      "convert": {
        "field": "price",
        "type": "string",
        "target_field": "price_float"
      }
    }
  ]
}
```
{% include copy-curl.html %}
```

Ingest a document into the index:

```json
PUT testindex1/_doc/1?pipeline=convert-price
{
  "price": "100"
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

To test the pipeline, run the following query::

```json
POST _ingest/pipeline/user-behavior/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "price_float": "100.00",
        "price":
          "price_float"
      }
    }
  ]
}
```
{% include copy-curl.html %}
```
