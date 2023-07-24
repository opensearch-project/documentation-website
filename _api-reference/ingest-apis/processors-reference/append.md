---
layout: default
title: Append
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 10
---

# Append

The `append` processor is used to add values to a field:
- If the field is an array, the `append` processor appends the specified values to that array.
- If the field is a scalar field, the `append` processor converts it to an array and appends the specified values to that array.
- If the field does not exist, the `append` processor creates an array with the specified values.

The syntax for the `append` processor is: 

```json
{
    "append": {
        "field": "field_name",
        "value": ["value1", "value2", "{{value3}}"]
    }
}
```

## Parameters

The following table lists the required and optional parameters for the `append` processor.

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field`  | Required  | Name of the field where the data should be appended. Supports template snippets.|
`value`  | Required  | Value to be appended. This can be a static value, a dynamic value derived from existing fields, or a value obtained from external lookups. Supports template snippets. |
`ignore_empty_fields`  | Optional  | If set to true, empty values will be ignored when appending then to the target field.  | 
`allow_duplicates`  | Optional  | If set to false, the processor will not append values that already exist in the target field. The default value is set to true.  |
`ignore_missing`  | Optional  | If set to true, the processor will ignore events that lack the target field. The default value is false.  |
`description`  | Optional  | Brief description of the processor.  |  

Following is an example of an ingest pipeline using the `append` processor.

```json
PUT _ingest/pipeline/user-behavior
{
  "description": "Pipeline that appends event type",
  "processors": [
    {
      "append": {
        "field": "event_types",
        "value": "{{event_type}}"
      }
    }
  ]
}

PUT testindex1/_doc/1?pipeline=user-behavior
{
  "event_type": "page_view"
}
```

This pipeline, named `user-behavior`, has one append processor. It appends the `event_type` of each new document ingested into OpenSearch to an array field `event_types`. Following is the GET request and response.

```json
GET testindex1/_doc/1
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 2,
  "_seq_no": 1,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "event_type": "page_view",
    "event_types": [
      "page_view"
    ]
  }
}
```

## Best practices

- **Data validation:** Make sure the values being appended are valid and compatible with the target field's data type and format.
- **Efficiency:** Consider the performance implications of appending large amounts of data to each document and optimize the processor configuration accordingly.
- **Error handling:** Implement proper error handling mechanisms to handle scenarios where appending fails, such as when external lookups or API requests encounter errors.
