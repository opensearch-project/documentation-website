---
layout: default
title: CSV
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 40
---

# CSV

The `csv` processor is used to parse CSV data and store it as individual fields in a document. The syntax for the `csv` processor is: 

```json
{
  "csv": {
    "field": "field_name",
    "target_fields": ["field1, field2"]
  }
}
```

## Configuration parameters

The following table lists the required and optional parameters for the `csv` processor.

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field`  | Required  | Name of the field to extract data from.  |
`target_fields`  | Required  | Name of the field to store the parsed data in. |
`delimiter`  | Optional  | The delimiter used to separate the fields in the CSV data.  |
`quote`  | Optional  | The character used to quote fields in the CSV data.  |
`ignore_missing`  | Optional | If set to `true`, the processor will not fail if the field does not exist. Default is `true`.  | 
`trim`  | Optional  | If set to `true`, the processor trims whitespace from the beginning and end of each field. Default is `false`.  |
`empty_value`  | Optional  | Represents optional parameters that are not required to be present or are not applicable.  |
`if`  | Optional  | Conditional expression that determines whether the processor should be deployed.  | 
`on_failure`  | Optional | Action to take if an error occurs. | 
`ignore_failure`  | Optional | If set to `true`, the processor does not fail if an error occurs. Default is `false`.  |
`tag`  | Optional  | Tag that can be used to identify the processor.  | 
`description`  | Optional  | Brief description of the processor.  |  

Following is an example of adding the `csv` processor to an ingest pipeline.

```json
PUT _ingest/pipeline/<pipeline-id>
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
