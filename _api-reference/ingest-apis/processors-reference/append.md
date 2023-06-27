---
layout: default
title: Append
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 10
---

# Append

The `append` proccessor is used to add additional fields or values to a document. The syntax for the `append` processor is: 

```json
{
    "append": {
        "field": "field_name",
        "value": ["value1"]
    }
}
```

## Configuration parameters

The following table lists the required and optional parameters for the `append` processor.

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field` | Required | Name of the field where the data should be appended. |
`value` | Required| Value to be appended. This can be a static value, a dynamic value derived from existing fields, or a value obtained from external lookups. |
`ignore_empty_fields` | Optional | If set to true, empty values will be ignored when appending then to the target field. | 
`fail_on_error` | Optional | If set to true, the processor will fail it an error occurs. The default value is false.
`allow_duplicates` | Optional | If set to false, the processor will not append values that already exist in the target field. The default value is set to true.
`ignore_missing` | Optional | If set to true, the processor will ignore events that lack the target field. The default value is false. 

Following is an examples of adding the `append` processor to an ingest pipeline.

```json
PUT _ingest/pipeline/<pipeline-id>
{
  "description": "A pipeline that appends the current timestamp to the document",
  "processors": [
    {
      "append": {
        "field": "timestamp",
        "value": ["_timestamp"]
      }
    }
  ]
}
```

## Best practices

- **Data validation:** Make sure the values being appended are valid and compatible with the target field's data type and format.
- **Efficiency:** Consider the performance implications of appending large amounts of data to each document and optimize the processor configuration accordingly.
- **Error handling:** Implement proper error handling mechanisms to handle scenarios where appending fails, such as when external lookups or API requests encounter errors.
