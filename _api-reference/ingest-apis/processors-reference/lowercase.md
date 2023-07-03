---
layout: default
title: Lowercase
parent: Ingest processors 
grand_parent: Ingest APIs
nav_order: 210
---

# Lowercase

This processor converts all the text in a specific field to lowercase letters. The syntax for the `lowercase` processor is: 

```json
{
  "lowercase": {
    "field": "field_name"
  }
}
```

#### Configuration parameters

The following table lists the required and optional parameters for the `lowercase` processor.

| Name  | Required  | Description  |
|---|---|---|
| `field`  | Required  | Specifies the name of the field that you want to remove. |
| `target_field`  | Optional  | Specifies the name of the field to store the converted value in. Default is `field`. By default, `field` is updated in-place. |
| `ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not have the specified field. Default is `false`.  |
| `ignore_failure`  | Optional  |  Specifies whether the processor should continue processing documents even if it fails to remove the specified field. Default is `false`.  |
| `on_failure`  | Optional  | Defines the processors to be deployed immediately following the failed processor.  |
| `if`  | Optional  | Conditionally deploys the processor based on the value of the field. The `value` parameter specifies the value that you want to compare the field to. |
| `tag`  | Optional  | Provides an identifier for the processor. Useful for debugging and metrics.  |
`description`  | Optional  | Brief description of the processor.  |  


Following is an example of an ingest pipeline using the `lowercase` processor.

```json
PUT _ingest/pipeline/lowercase-title
{
  "description" : "Pipeline that lowercases the title field",
  "processors" : [
    {
      "lowercase" : {
        "field" : "title"
      }
    }
  ]
}


PUT testindex1/_doc/1?pipeline=lowercase-title
{
  "title": "WAR AND PEACE"
}
```

Following is the GET request and response. 

```json
GET testindex1/_doc/1
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 12,
  "_seq_no": 11,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "title": "war and peace"
  }
}
```
