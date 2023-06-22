---
layout: default
title: CSV
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 40
---

# CSV

The CSV ingest processor is used to parse CSV data and store it as individual fields in a document. 

## Configuration parameters

The CSV processor supports the following parameters.

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field` | Required | Name of the field to extract data from. |
`target_fields` | Required | Name of the field to store the parsed data in. |
`delimiter` | Optional | The delimiter used to separate the fields in the CSV data. |
`quote` | Optional | The character used to quote fields in the CSV data. |
`ignore_missing` | Optional | If set to `true`, the processor will not fail if the field does not exist. Default is `false`. | 
`trim` | Optional | If set to `true`, the processor trims whitespace from the beginning and end of each field. Default is `false`. |
`if` | Optional | Conditional expression that determines whether the processor should be deployed. | 
`on_failure` | Optional | Action to take if an error occurs. | 
`ignore_failure` | Optional | If set to `true`, the processor does not fail if an error occurs. |
`tag` | Optional | Tag that can be used to identify the processor. | 
`description` | Optional | Brief description of the processor. |  

Following is an example of a CSV ingest processor configuration.

#### Example: CSV processor configuration

```json
{
  "description": "Parses the CSV data in the `data` field",
  "processors": [
    {
      "csv": {
        "field": "data",
        "target_fields": ["field1", "field2", "field3"],
        "ignore_missing": true
      }
    }
  ]
}
```
