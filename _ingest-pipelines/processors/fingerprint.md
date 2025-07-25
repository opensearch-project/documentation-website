---
layout: default
title: Fingerprint
parent: Ingest processors
nav_order: 105
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/fingerprint/
---

# Fingerprint processor
Introduced 2.16
{: .label .label-purple }

The `fingerprint` processor is used to generate a hash value for either certain specified fields or all fields in a document. The hash value can be used to deduplicate documents within an index and collapse search results.

For each field, the field name, the length of the field value, and the field value itself are concatenated and separated by the pipe character `|`. For example, if the field name is `field1` and the value is `value1`, then the concatenated string would be `|field1|3:value1|field2|10:value2|`. For object fields, the field name is flattened by joining the nested field names with a period `.`. For instance, if the object field is `root_field` with a sub-field `sub_field1` having the value `value1` and another sub-field `sub_field2` with the value `value2`, then the concatenated string would be `|root_field.sub_field1|1:value1|root_field.sub_field2|100:value2|`.

The following is the syntax for the `fingerprint` processor:

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
`fields`  | Optional  | A list of fields used to generate a hash value.  |
`exclude_fields`  | Optional  | Specifies the fields to be excluded from hash value generation. It is mutually exclusive with the `fields` parameter; if both `exclude_fields` and `fields` are empty or null, then all fields are included in the hash value calculation. |
`hash_method`  | Optional  | Specifies the hashing algorithm to be used, with options being `MD5@2.16.0`, `SHA-1@2.16.0`, `SHA-256@2.16.0`, or `SHA3-256@2.16.0`. Default is `SHA-1@2.16.0`. The version number is appended to ensure consistent hashing across OpenSearch versions, and new versions will support new hash methods. |
`target_field`  | Optional  | Specifies the name of the field in which the generated hash value will be stored. If not provided, then the hash value is stored in the `fingerprint` field by default. |
`ignore_missing`  | Optional  | Specifies whether the processor should exit quietly if one of the required fields is missing. Default is `false`. |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | If set to `true`, then failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline**

The following query creates a pipeline named `fingerprint_pipeline` that uses the `fingerprint` processor to generate a hash value for specified fields in the document: 

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
