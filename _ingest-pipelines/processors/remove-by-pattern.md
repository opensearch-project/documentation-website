---
layout: default
title: Remove by pattern
parent: Ingest processors
nav_order: 225
redirect_from:
   - /ingest-pipelines/processors/remove_by_pattern/
---

# Remove by pattern processor

The `remove_by_pattern` processor removes the root-level fields from a document by using specified wildcard patterns. 

## Syntax

The following is the syntax for the `remove_by_pattern` processor: 

```json
{
    "remove_by_pattern": {
        "field_pattern": "field_name_prefix*"
    }
}
```
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `remove_by_pattern` processor.

| Parameter  | Required/Optional  | Description  |
|---|---|---|
`field_pattern`  | Optional  | Removes fields that match the specified pattern. All of the metadata fields, such as `_index`, `_version`, `_version_type`, and `_id`, are ignored if they match the pattern. This option only supports the root-level fields in the document. |
`exclude_field_pattern`  | Optional  | Removes fields that do not match the specified pattern. All of the metadata fields, such as `_index`, `_version`, `_version_type`, and `_id`, are ignored if they do not match the pattern. This option only supports the root-level fields in the document. The `field_pattern` and `exclude_field_pattern` options are mutually exclusive. |
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters errors. If set to `true`, the failure is ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline** 

The following query creates a pipeline named `remove_fields_by_pattern` that removes the fields that match the pattern `foo*`: 

```json
PUT /_ingest/pipeline/remove_fields_by_pattern
{
  "description": "Pipeline that removes the fields by patterns.",
  "processors": [
    {
      "remove_by_pattern": {
        "field_pattern": "foo*"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline**

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/remove_fields_by_pattern/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source":{
         "foo1": "foo1",
         "foo2": "foo2",
         "bar": "bar"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Response**

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "bar": "bar"
        },
        "_ingest": {
          "timestamp": "2023-08-24T18:02:13.218986756Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=remove_fields_by_pattern
{
  "foo1": "foo1",
  "foo2": "foo2",
  "bar": "bar"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
