---
layout: default
title: Convert
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 10
---

# Convert

The convert ingest processor converts a field in a document to a different type. The supported types are `integer`, `long`, `float`, `double`, `string`, `boolean`, `ip`, and `auto`.

Specifying `boolean` will set the field to `true` if its string value is equal to `true` (ignore case), to false if its string value is equal to `false` (ignore case), or it will throw an exception otherwise.

## Configuration parameters

The byte processor supports the following parameter options. The parameters `field` and `type` are required. All others are optional. 

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field` | Required | Name of the field where the data should be converted. |
`target_field` | Optional | Name of the field to store the converted value. If not specified, the value will be stored in-place in the `field` field. Default is `field`. |
`type` | Required | 
`ignore_missing` | Optional | If set to true, the processor will not fail if the field does not exist. Default is `false`. |
`if` | Optional | Conditional expression that determines whether the processor should be deployed. |
`ignore_failure` | Optional | If set to true, the processor will not fail if an error occurs. | 
`on_failure` | Optional | Action to take if an error occurs. | 
`tag` | Optional | Tag that can be used to identify the processor. | 
`description` | Optional | Brief description of the processor. |  

Following is an example of a convert ingest processor configuration.

#### Example: Convert processor configuration

```json
{
  "description": "Converts the file size field to an integer",
  "processors": [
    {
      "convert": {
        "field": "file.size",
        "type": "integer"
      }
    }
  ]
}
```