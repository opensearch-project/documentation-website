---
layout: default
title: Date
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 50
---

# Date

The `date` processor is used to parse dates from fields in a document annd store them as a timestamp. The syntax for the `date` processor is:

```json
{
  "date": {
    "field": "date_field",
    "target_field": ["parsed_date"],
    "formats": ["yyyy/MM/dd HH:mm:ss", "ISO8601"]
  }
}
```

## Configuration parameters

The following table lists the required and optional parameters for the `date` processor.

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field`  | Required  | Name of the field to extract data from.  |
`target_field`  | Optional  | Name of the field to store the parsed data in.  |
`formats`  | Required | The format of the date in the `field` field. The default format is `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`.  |
`locale`  | Optional  | The locale to use when parsing the date. Default is English.  |
`timezone `  | Optional  | The timezone to use when parsing the date. Default is UTC.  |
`ignore_missing` | Optional  | If set to `true`, the processor will not fail if the field does not exist. Default is `false`.  | 
`if`  | Optional  | Conditional expression that determines whether the processor should be deployed.  | 
`on_failure`  | Optional  | Action to take if an error occurs. | 
`ignore_failure`  | Optional  | If set to `true`, the processor does not fail if an error occurs.  |
`tag`  | Optional  | Tag that can be used to identify the processor.  | 
`description`  | Optional  | Brief description of the processor.  |  

Following is an example of adding the `date` processor to an ingest pipeline.

```json
PUT /_ingest/pipeline/date_processor
{
  "description": "A pipeline that parses timestamps to dates",
  "processors": [
    {
      "date": {
        "field" : "date_field",
        "target_field" : "timestamp",
        "formats" : ["dd/MM/yyyy HH:mm:ss"],
        "timezone" : "UTC"
      }
    }
  ]
}
```
