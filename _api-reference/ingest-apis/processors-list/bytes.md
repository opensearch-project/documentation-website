---
layout: default
title: Bytes
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 20
---

# Bytes

The bytes ingest processor converts a human-readable byte value to its equivalent value in bytes. The field can be a scalar or an array. If the field is a scalar, the value will be converted and stored in the field. If the field is an array, all members of the array will be converted.

## Configuration parameters

The byte processor supports the following parameters. 

**Parameter** | **Required** | **Description** |
|-----------|-----------|-----------|
`field` | Required | Name of the field where the data should be converted. |
`target_field` | Required | Name of the field to store the converted value. If not specified, the value will be stored in-place in the `field` field. Default is `field`. |
`ignore_missing` | Optional | If set to true, the processor will not fail if the field does not exist. Default is `false`. |
`if` | Optional | Conditional expression that determines whether the processor should be deployed. |
`ignore_failure` | Optional | If set to true, the processor will not fail if an error occurs. | 
`on_failure` | Optional | Action to take if an error occurs. | 
`tag` | Optional | Tag that can be used to identify the processor. | 
`description` | Optional | Brief description of the processor. |  

Following is an example of a byte ingest processor configuration.

#### Example: Byte processor configuration

```json
{
  "description": "Converts the file size field to bytes",
  "processors": [
    {
      "bytes": {
        "field": "file.size",
        "target_field": "file.size_bytes"
      }
    }
  ]
}
```
