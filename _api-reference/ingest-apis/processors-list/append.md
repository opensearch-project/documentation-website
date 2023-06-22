---
layout: default
title: Append
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 10
---

# Append

The append ingest processor enriches incoming data during the ingestion process by appending additional fields or values to each document. The append processor operates on a per-dcoument basis, meaning it processes each incoming document individually. Learn how to use the append processor in your data processing workflows in the following documentation. 

## Configuration parameters

The append processor requires the following configuration parameters to specify the target field or value to append to incoming documents.

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field` | Required | Name of the field where the data should be appended. |
`value` | Required| Value to be appended. This can be a static value, a dynamic value derived from existing fields, or a value obtained from external lookups. |
`fields` | A list of fields from which to copy values. |
`ignore_empty_fields` | Optional | If set to true, empty values will be ignored when appending then to the target field. | 
`fail_on_error` | Optional | If set to true, the processor will fail it an error occurs. The default value is false.
`allow_duplicates` | Optional | If set to false, the processor will not append values that already exist in the target field. The default value is set to true.
`ignore_missing` | Optional | If set to true, the processor will ignore events that lack the target field. The default value is false. 

Following are examples of an append processor configuration and how to add it to an ingest pipeline.

#### Example: Append configuration 

```json
{
  "description": "Appends the current timestamp to the document",
  "processors": [
    {
      "append": {
        "field": "timestamp",
        "value": "{{_timestamp}}"
      }
    }
  ]
}
```

#### Example: Adding the append configuration to an ingest pipeline using the REST API

```json
PUT _ingest/pipeline/<pipeline-id>
{
  "description": "A pipeline that appends the current timestamp to the document",
  "processors": [
    {
      "append": {
        "field": "timestamp",
        "value": "{{_timestamp}}"
      }
    }
  ]
}
```

## Best practices

- **Data validation:** Make sure the values being appended are valid and compatible with the target field's data type and format.
- **Efficiency:** Consider the performance implications of appending large amounts of data to each document and optimize the processor configuration accordingly.
- **Error handling:** Implement proper error handling mechanisms to handle scenarios where appending fails, such as when external lookups or API requests encounter errors.
