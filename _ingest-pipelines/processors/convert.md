---
layout: default
title: Convert
parent: Ingest processors
nav_order: 30
redirect_from:
   - /api-reference/ingest-apis/processors/convert/
---

# Convert
**Introduced 1.0**
{: .label .label-purple }

The `convert` processor converts a field in a document to a different type, for example, a string to an integer or an integer to a string. For an array field, all values in the array are converted. 

## Example
The following is the syntax for the `convert` processor: 

```json
{
    "convert": {
        "field": "field_name",
        "type": "type-value"
    }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `convert` processor.   

Parameter | Required | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field that contains the data to be converted. Supports template snippets. |
`type`  | Required  | The type to convert the field value to. The supported types are `integer`, `long`, `float`, `double`, `string`, `boolean`, `ip`, and `auto`. If the `type` is `boolean`, the value is set to `true` if the field value is a string `true` (ignoring case) and to `false` if  the field value is a string `false` (ignoring case). If the value is not one of the allowed values, an error will occur.  |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing`  | Optional  | If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |
`target_field`  | Optional  | The name of the field in which to store the parsed data. If not specified, the value will be stored in the `field` field. Default is `field`.  |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.** 

The following query creates a pipeline, named `convert-price`, that converts `price` to a floating-point number, stores the converted value in the `price_float` field, and sets the value to `0` if it is less than `0`:

```json
PUT _ingest/pipeline/convert-price
{
  "description": "Pipeline that converts price to floating-point number and sets value to zero if price less than zero",
  "processors": [
    {
      "convert": {
        "field": "price",
        "type": "float",
        "target_field": "price_float"
      }
    },
    {
      "set": {
        "field": "price",
        "value": "0",
        "if": "ctx.price_float < 0"
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
POST _ingest/pipeline/convert-price/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
       "_source": {
        "price": "-10.5"
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
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "price_float": -10.5,
          "price": "0"
        },
        "_ingest": {
          "timestamp": "2023-08-22T15:38:21.180688799Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=convert-price
{
  "price": "10.5"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
