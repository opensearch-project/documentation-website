---
layout: default
title: Remove
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 230
---

# Remove

The remove processor is used to remove a field from a document. The syntax for the `remove` processor is: 

```json
{
    "remove": {
        "field": "field_name"
    }
}
```

#### Configuration parameters

The following table lists the required and optional parameters for the `remove` processor.

| Name  | Required  | Description  |
|---|---|---|
| `field`  | Required  | Specifies the name of the field that you want to remove. |
| `ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not have the specified field. Default is `false`.  |
| `ignore_failure`  | Optional  |  Specifies whether the processor should continue processing documents even if it fails to remove the specified field. Default is `false`.  |
| `if`  | Optional  | Conditionally deploys the processor based on the value of the field. The `value` parameter specifies the value that you want to compare the field to. |
| `tag`  | Optional  | Allows you to identify the processor for debugging and metrics.  |
`description`  | Optional  | Brief description of the processor.  |  


Following is an example of an ingest pipeline using the `remove` processor. 

```json
PUT /_ingest/pipeline/remove_ip
{
  "description": "Pipeline that excludes the ip_address field.",
  "processors": [
    {
      "remove": {
        "field": "ip_address"
      }
    }
  ]
}

PUT testindex1/_doc/1?pipeline=remove_ip
{
  "ip_address": "203.0.113.1"
}
```

This pipeline removes the ip_address field from any document that passes through the pipeline. Following is the GET request and response.

```json
GET testindex1/_doc/1
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 10,
  "_seq_no": 9,
  "_primary_term": 1,
  "found": true,
  "_source": {}
}
```