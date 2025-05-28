---
layout: default
title: Join
parent: Ingest processors
nav_order: 160
---

# Join processor

The `join` processor concatenates the elements of an array into a single string value, using a specified separator between each element. It throws an exception if the provided input is not an array.

The following is the syntax for the `join` processor:

```json
{
  "join": {
    "field": "field_name",
    "separator": "separator_string"
  }
}
```
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `join` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field` | Required | The name of the field to which the join operator is applied. Must be an array.
`separator` | Required | A string separator to use when joining field values. If not specified, then the values are concatenated without a separator.
`target_field` | Optional | The field to assign the cleaned value to. If not specified, then the field is updated in place.
`description` | Optional | A description of the processor's purpose or configuration.
`if` | Optional | Specifies to conditionally execute the processor.
`ignore_failure` | Optional | Specifies to ignore failures for the processor. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure` | Optional | Specifies to handle failures for the processor. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`tag` | Optional | An identifier for the processor. Useful for debugging and metrics.

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline named `example-join-pipeline` that uses the `join` processor to concatenate all the values of the `uri`  field, separating them with the specified separator `/`: 

```json
PUT _ingest/pipeline/example-join-pipeline  
{  
  "description": "Example pipeline using the join processor",  
  "processors": [  
    {  
      "join": {  
        "field": "uri",  
        "separator": "/"  
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
POST _ingest/pipeline/example-join-pipeline/_simulate  
{  
  "docs": [  
    {  
      "_source": {  
        "uri": [  
          "app",  
          "home",  
          "overview"  
        ]  
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
        "_index": "_index",  
        "_id": "_id",  
        "_source": {  
          "uri": "app/home/overview"  
        },  
        "_ingest": {  
          "timestamp": "2024-05-24T02:16:01.00659117Z"  
        }  
      }  
    }  
  ]  
}  
```
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
POST testindex1/_doc/1?pipeline=example-join-pipeline  
{  
  "uri": [  
    "app",  
    "home",  
    "overview"  
  ]  
} 
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}
