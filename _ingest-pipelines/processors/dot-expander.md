---
layout: default
title: Dot expander
parent: Ingest processors
nav_order: 65
---

# Dot expander 

The `dot_expander` processor is a tool that helps you work with hierarchical data. It transforms fields containing dots into object fields, making them accessible to other processors in the pipeline. Without this transformation, fields with dots cannot be processed.

The following is the syntax for the `dot_expander` processor:

```json
{
  "dot_expander": {
    "field": "field.to.expand" 
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `dot_expander` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field`  | Required  | The field to expand into an object field. |
`path` | Optional | The field is only required if the field to be expanded is nested within another object field. This is because the `field` parameter only recognizes leaf fields, which are fields that are not nested within any other objects. |
`description`  | Optional  | A brief description of the processor. |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline
 
The following query creates a dot expander processor that will expand two fields named `user.address.city` and `user.address.state` into nested objects:

```json
PUT /_ingest/pipeline/dot-expander
{
    "description": "Dot expander processor",
    "processors": [
        {
            "dot_expander": {
                "field": "user.address.city"
            }
        },
        {
            "dot_expander": {
                "field": "user.address.state"
            }
        }
    ]
}
```
{% include copy-curl.html %}

### Step 2 (Optional): Test the pipeline

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/dot-expander/_simulate  
{  
  "docs": [  
    {  
      "_index": "testindex1",  
      "_id": "1",  
      "_source": {  
        "user.address.city": "New York",  
        "user.address.state": "NY"  
      }  
    }  
  ]  
}
```
{% include copy-curl.html %}

#### Response

The following example response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "user": {
            "address": {
              "city": "New York",
              "state": "NY"
            }
          }
        },
        "_ingest": {
          "timestamp": "2024-01-04T21:00:42.053781253Z"
        }
      }
    }
  ]
}
```

### Step 3: Ingest a document

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=dot-expander  
{  
  "user.address.city": "Denver",  
  "user.address.state": "CO"  
}
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

#### Response

The following response confirms that the specified fields were expanded into nested fields:

```json
{
  "_index": "testindex1",
  "_id": "1",
  "_version": 63,
  "_seq_no": 62,
  "_primary_term": 33,
  "found": true,
  "_source": {
    "user": {
      "address": {
        "city": "Denver",
        "state": "CO"
      }
    }
  }
}
```

## Nested fields

If a field is nested within a structure without dots, you can use the `path` parameter to traverse the non-dotted structure. For example, if you have the field `user.address`, you can use the `dot_expander processor` to expand it into an object field named `user` with a nested field named `address`, as shown in the following example: 

```json
{
    "dot_expander": {
        "path": "user.address",
        "field": "<insert-field>"
    }
}
```

Then take for example the following document: 

```json
<insert-code-example>
```

The `dot_expander` processor transforms the document into:

```json
<insert-code-example>
```

To ensure proper expansion of the `user.address.city` and `user.address.state` fields and handle conflicts with pre-existing fields, use a similar configuration as the following document: 

```json
<insert-code-example>
```

To ensure the correct expansion of the `city` and `state` fields, the following pipeline uses the `rename` processor to prevent conflicts and allow for proper handling of scalar fields during expansion.

```json
{
    "processors": [
      {
        "rename": {
            "field": "user.address",
            "target_field": "user.address.original"
        }
      },
      {
        "dot_expander": {
            "field": "user.address.original"
        }
      }  
    ]
}
```
