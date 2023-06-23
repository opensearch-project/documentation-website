---
layout: default
title: Date
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 50
---

# Date

The date ingest processor is used to parse dates from fields in a document annd store them as a timestamp. 

## Configuration parameters

The date processor supports the following parameters.

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field` | Required | Name of the field to extract data from. |
`target_field` | Optional | Name of the field to store the parsed data in. |
`format` | Required | The format of the date in the `field` field. The default format is `yyyy-MM-dd'T'HH:mm:ss.SSSZZ`. |
`locale` | Optional | The locale to use when parsing the date. The default locale is <what is the default?> |
`timezone ` | Optional | The timezone to use when parsing the date. |
`ignore_missing` | Optional | If set to `true`, the processor will not fail if the field does not exist. Default is `false`. | 
`if` | Optional | Conditional expression that determines whether the processor should be deployed. | 
`on_failure` | Optional | Action to take if an error occurs. | 
`ignore_failure` | Optional | If set to `true`, the processor does not fail if an error occurs. |
`tag` | Optional | Tag that can be used to identify the processor. | 
`description` | Optional | Brief description of the processor. |  

Following is an example of a date ingest processor configuration.

#### Example: Date processor configuration

```json
{
  "description": "Parses the date string in the `date_string` field and stores parsed date in the `date_timestamp` field",
  "processors": [
    {
      "date": {
        "field": "date_string",
        "target_field": ["date_timestamp"],
        "format": "yyyy-MM-dd'T'HH:mm:ss.SSSZZ",
        "locale": "en-US",
        "ignore_missing": true
      }
    }
  ]
}
```
