---
layout: default
title: Fingerprint
parent: Ingest processors
nav_order: 55
---

# Fingerprint processor

The `fingerprint` processor is used to generate hash value for the specified fields or all fields in a document, the hash value can be used to deduplicate documents within a index and collapse search results.

To generate hash value for the specified fields, field name, the length of field value and field value are concatenated and separated by `|`, e.g: `|field1|3:value1|field2|10:value2|`, for object fields, the field name is flattened, e.g: `|root_field.sub_field1|1:value1|root_field.sub_field2|100:value2|`.

The following is the `fingerprint` processor syntax:

```json
{
  "community_id": {
    "fields": ["foo", "bar"],
    "target_field": "fingerprint",
    "hash_method": "SHA-1@2.16.0"
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `fingerprint` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`fields`  | Optional  | The field list used to generate hash value.  |
`exclude_fields`  | Optional  | All fields other than the fields in this excluding list are used to generate hash value. The `exclude_fields` and `fields` options are mutually exclusive. If `fields` and `exclude_fields` are both empty or null, it means `include all fields`, all fields will be used to generate hash value.|
`hash_method`  | Optional  | One of MD5@2.16.0, SHA-1@2.16.0, SHA-256@2.16.0 or SHA3-256@2.16.0. Defaults to SHA-1@2.16.0. This processor is introduced in 2.16.0, we append the OpenSearch version to the hash method name to ensure that this processor always generates same hash value based on a specific hash method, if the processing logic of this processor changes in future version, then this parameter will support new hash method with new version. |
`target_field`  | Optional  | The name of the field in which to store the hash value. Default target field is `fingerprint`. |
`ignore_missing`  | Optional  | Specifies whether the processor should exit quietly if one of the required fields is missing. Default is `false`. |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | If set to `true`, then failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline**

The following query creates a pipeline named `fingerprint_pipeline` that uses the `fingerprint` processor to generate a hash value for some specified fields in the document: 

```json
PUT /_ingest/pipeline/fingerprint_pipeline
{
  "description": "generate hash value for some specified fields the document",
  "processors": [
    {
      "fingerprint": {
        "fields": ["foo", "bar"]
     }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline**

It is recommended that you test your pipeline before ingesting documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/fingerprint_pipeline/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "foo": "foo",
        "bar": "bar"
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
          "foo": "foo",
          "bar": "bar",
          "fingerprint": "SHA-1@2.16.0:fYeen7hTJ2zs9lpmUnk6nvH54sM="
        },
        "_ingest": {
          "timestamp": "2024-03-11T02:17:22.329823Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=fingerprint_pipeline
{
  "foo": "foo",
  "bar": "bar"
}
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the `testindex1` index:

```json
{
  "_index": "testindex1",
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

**Step 4 (Optional): Retrieve the document**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
