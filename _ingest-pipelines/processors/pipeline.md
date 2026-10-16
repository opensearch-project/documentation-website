---
layout: default
title: Pipeline
parent: Ingest processors
nav_order: 220
---

# Pipeline processor

The `pipeline` processor allows a pipeline to reference and include another predefined pipeline. This can be useful when you have a set of common processors that need to be shared across multiple pipelines. Instead of redefining those common processors in each pipeline, you can create a separate base pipeline containing the shared processors and then reference that base pipeline from other pipelines using the pipeline processor.

The following is the syntax for the `pipeline` processor:

```json
{
  "pipeline": {
    "name": "general-pipeline"
  }
}
```
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `pipeline` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`name` | Required	| The name of the pipeline to execute. Supports [template snippets](#selecting-a-pipeline-dynamically).
`description` | Optional | A description of the processor's purpose or configuration.
`if` | Optional | Specifies to conditionally execute the processor.
`ignore_failure` | Optional | Specifies to ignore processor failures. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`on_failure` | Optional | Specifies to handle processor failures. See [Handling pipeline failures]({{site.url}}{{site.baseurl}}/ingest-pipelines/pipeline-failures/).
`tag` | Optional | An identifier for the processor. Useful for debugging and metrics. For more information, see [Using processor tags for monitoring and debugging]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#using-processor-tags-for-monitoring-and-debugging).

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a general pipeline named `general-pipeline` and then creates a new pipeline named `outer-pipeline`, which references the `general-pipeline`: 

```json
PUT _ingest/pipeline/general-pipeline  
{  
  "description": "a general pipeline",  
  "processors": [  
    {  
      "uppercase": {  
        "field": "protocol"  
      }  
    },  
    {  
      "remove": {  
        "field": "name"  
      }  
    }  
  ]  
}
```
{% include copy-curl.html %}

```json
PUT _ingest/pipeline/outer-pipeline  
{  
  "description": "an outer pipeline referencing the general pipeline",  
  "processors": [  
    {  
      "pipeline": {  
        "name": "general-pipeline"  
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
POST _ingest/pipeline/outer-pipeline/_simulate
{  
  "docs": [  
    {  
      "_source": {  
        "protocol": "https",  
        "name":"test"  
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
          "protocol": "HTTPS"  
        },  
        "_ingest": {  
          "timestamp": "2024-05-24T02:43:43.700735801Z"  
        }  
      }  
    }  
  ]  
}
```

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
POST testindex1/_doc/1?pipeline=outer-pipeline  
{  
  "protocol": "https",  
  "name": "test"  
}  
```
{% include copy-curl.html %}

#### Response

The request indexes the document into the `testindex1` index with the `protocol` field converted to uppercase and the `name` field removed, as shown in the following response:

```json
{  
  "_index": "testindex1",  
  "_id": "1",  
  "_version": 2,  
  "result": "created",  
  "_shards": {  
    "total": 2,  
    "successful": 2,  
    "failed": 0  
  },  
  "_seq_no": 1,  
  "_primary_term": 1  
}  
```

### Step 4 (Optional): Retrieve the document

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

#### Response

The response shows the document with the `protocol` field converted to uppercase and the `name` field removed:

```json
{  
  "_index": "testindex1",  
  "_id": "1",  
  "_version": 2,  
  "_seq_no": 1,  
  "_primary_term": 1,  
  "found": true,  
  "_source": {  
    "protocol": "HTTPS"  
  }  
}  
```


## Selecting a pipeline dynamically

The `name` parameter supports template snippets, so you can select the pipeline to run based on a field value in the document. The following request creates a pipeline that parses NGINX logs:

```json
PUT _ingest/pipeline/logs-nginx
{
  "processors": [
    {
      "set": {
        "field": "parsed_by",
        "value": "{% raw %}{{_ingest.pipeline}}{% endraw %}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The following request creates a pipeline that runs the pipeline named `logs-` followed by the value of the document's `service` field:

```json
PUT _ingest/pipeline/logs-router
{
  "processors": [
    {
      "set": {
        "field": "routed_by",
        "value": "{% raw %}{{_ingest.pipeline}}{% endraw %}"
      }
    },
    {
      "pipeline": {
        "name": "logs-{% raw %}{{service}}{% endraw %}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Index a document whose `service` field is `nginx`:

```json
PUT logs/_doc/1?pipeline=logs-router
{
  "service": "nginx",
  "message": "GET /index.html 200"
}
```
{% include copy-curl.html %}

Retrieve the document:

```json
GET logs/_doc/1
```
{% include copy-curl.html %}

The response shows that the `logs-router` pipeline ran the `logs-nginx` pipeline:

```json
{
  "_index": "logs",
  "_id": "1",
  "_version": 1,
  "_seq_no": 0,
  "_primary_term": 1,
  "found": true,
  "_source": {
    "parsed_by": "logs-nginx",
    "service": "nginx",
    "message": "GET /index.html 200",
    "routed_by": "logs-router"
  }
}
```

If the resolved pipeline doesn't exist, or if running it would create a cycle in which a pipeline runs itself, the `pipeline` processor fails.

## Accessing the current pipeline name

The `_ingest.pipeline` ingest metadata field contains the ID of the pipeline that is currently running. In the preceding example, the `routed_by` field contains `logs-router` and the `parsed_by` field contains `logs-nginx` because each `set` processor ran in a different pipeline. After the inner pipeline completes, `_ingest.pipeline` again contains the ID of the outer pipeline.
