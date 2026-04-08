---
layout: default
title: Fail
parent: Ingest processors
nav_order: 100
canonical_url: https://docs.opensearch.org/latest/ingest-pipelines/processors/fail/
---

# Fail processor

The `fail` processor is useful for performing data transformation and enrichment during the indexing process. The primary use case for the `fail` processor is to fail an indexing operation when certain conditions are met.

The following is the syntax for the `fail` processor:

```json
"fail": { 
  "if": "ctx.foo == 'bar'", 
  "message": "Custom error message" 
  }
```
{% include copy.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `fail` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`message` | Required | A custom error message to be included in the failure response.
`description`  | Optional  | A brief description of the processor.  |  
`if` | Optional | A condition for running the processor. |  
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters an error. If set to `true`, then failures are ignored. Default is `false`. |  
`on_failure` | Optional | A list of processors to run if the processor fails. |  
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. |  

## Using the processor

Follow these steps to use the processor in a pipeline.

### Step 1: Create a pipeline

The following query creates a pipeline, named `fail-log-pipeline`, that uses the `fail` processor to intentionally fail the pipeline execution for log events: 

```json
PUT _ingest/pipeline/fail-log-pipeline  
{  
  "description": "A pipeline to test the fail processor for log events",  
  "processors": [  
    {  
      "fail": {  
        "if": "ctx.user_info.contains('password') || ctx.user_info.contains('credit card')",  
        "message": "Document containing personally identifiable information (PII) cannot be indexed!"  
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
POST _ingest/pipeline/fail-log-pipeline/_simulate  
{  
  "docs": [  
    {  
      "_source": {  
        "user_info": "Sensitive information including credit card"  
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
      "error": {
        "root_cause": [
          {
            "type": "fail_processor_exception",
            "reason": "Document containing personally identifiable information (PII) cannot be indexed!"
          }
        ],
        "type": "fail_processor_exception",
        "reason": "Document containing personally identifiable information (PII) cannot be indexed!"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=fail-log-pipeline  
{  
  "user_info": "Sensitive information including credit card"  
} 
```
{% include copy-curl.html %}

#### Response

The request fails to index the log event into the index `testindex1` due to the string `credit card` being present in `user_info`. The following response includes the custom error message specified in the fail processor:

```json

  "error": {
    "root_cause": [
      {
        "type": "fail_processor_exception",
        "reason": "Document containing personally identifiable information (PII) cannot be indexed!"
      }
    ],
    "type": "fail_processor_exception",
    "reason": "Document containing personally identifiable information (PII) cannot be indexed!"
  },
  "status": 500
}
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

Because the log event was not indexed due to the pipeline failure, attempting to retrieve it results in the document not found error `"found": false`:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

#### Document error example

```json
{  
  "_index": "testindex1",  
  "_id": "1",  
  "found": false  
}  
```
