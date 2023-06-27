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

The `field` parameter specifies the name of the field you want to remove. For example, the following example removes the `message` field from a document: 

```json
PUT /_ingest/pipeline/my_pipeline
{
  "description": "A simple ingest pipeline that removes the `message` field.",
  "processors": [
    {
      "remove": {
        "field": "message"
      }
    }
  ]
}
```

#### Remove parameters

The following table lists the required and optional remove parameters.

| Name  | Required  | Description  |
|---|---|---|
| `field`  | Yes  | Specifies the name of the field that you want to remove. |
| `ignore_missing`  | No  | Specifies whether the processor should ignore documents that do not have the specified field. Default is `false`.  |
| `ignore_failure`  | No  |  Specifies whether the processor should continue processing documents even if it fails to remove the specified field. Default is `false`.  |
| `if`  | No  | Conditionally deploys the processor based on the value of the field. The `value` parameter specifies the value that you want to compare the field to. |
| `tag`  | No  | Allows you to identify the processor for debugging and metrics.  |

This example uses all of the options:

```json
{
    "remove": {
        "field": "message",
        "ignore_missing": true,
        "ignore_failure": true,
        "tag": "my_tag"
    }
}
```

In this case, the `message` field is removed from any document that is indexed, if the document does not have the `message` field. If the processor fails to remove the `message` field, it continues processing documents. The processor is also tagged with the `my_tag` tag.

The following example only deploys the `remove` processor if the value of the `message` field is equal to "This is a message:"

```json
{
    "remove": {
        "field": "message"
    },
    "if": {
      "field": "message",
      "value": "This is a message"
    }
}
```