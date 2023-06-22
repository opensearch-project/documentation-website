---
layout: default
title: CSV
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 30
---

# CSV

The CSV ingest processor is used to parse CSV data and store it as individual fields in a document. 

## Configuration parameters

The CSV processor supports the following parameters.

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