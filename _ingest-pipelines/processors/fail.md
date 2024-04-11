---
layout: default
title: Fail
parent: Ingest processors
nav_order: 100
---

# Fail processor

The `fail` processor can be useful for testing and debugging log ingestion pipelines. It allows you to intentionally fail the pipeline execution and observe the behavior or error handling mechanisms in your log ingestion and analysis systems. This can help you identify and resolve issues related to pipeline configuration, data transformation, or other aspects of log processing.

The following is the syntax for the `fail` processor:

```json
"fail": {
  "message": "Custom error message"
}
```
{% include copy-curl.html %}

## Configuration parameters

The following table lists the required and optional parameters for the `fail` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`message` | Optional | Custom error message to be included in the failure response.

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
      "grok": {
        "field": "message",
        "patterns": ["%{COMBINEDAPACHELOG}"]
      }
    },
    {
      "fail": {
        "message": "Intentionally failing the pipeline for testing"
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
      "_index": "test-fail-pipeline",
      "_id": "1",
      "_source": {
        "message": "127.0.0.1 - - [23/Apr/2023:11:59:59 +0000] \"GET /sample.html HTTP/1.1\" 200 612 \"-\" \"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36\""
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
            "reason": "Intentionally failing the pipeline for testing"
          }
        ],
        "type": "fail_processor_exception",
        "reason": "Intentionally failing the pipeline for testing"
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Step 3: Ingest a document 

The following query ingests a document into an index named `logstash-logs`:

```json
POST logstash-logs/_doc/?pipeline=fail-log-pipeline
{
  "message": "127.0.0.1 - - [23/Apr/2023:11:59:59 +0000] \"GET /sample.html HTTP/1.1\" 200 612 \"-\" \"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36\""
}
```
{% include copy-curl.html %}

#### Response

The request will fail to index the log event into the index `logstash-logs` due to the intentional failure in the pipeline. The response will include the custom error message specified in the fail processor.

```json
{
  "error": {
    "root_cause": [
      {
        "type": "fail_processor_exception",
        "reason": "Intentionally failing the pipeline for testing"
      }
    ],
    "type": "fail_processor_exception",
    "reason": "Intentionally failing the pipeline for testing"
  },
  "status": 500
}
```
{% include copy-curl.html %}

### Step 4 (Optional): Retrieve the document

Since the log event was not indexed due to the pipeline failure, attempting to retrieve it will result in a document not found error.

```json
GET logstash-logs/_doc/_search
```
{% include copy-curl.html %}

#### Document error example

```json
{
  "error": {
    "root_cause": [
      {
        "type": "index_not_found_exception",
        "reason": "no such index [logstash-logs]",
        "index": "logstash-logs",
        "resource.id": "logstash-logs",
        "resource.type": "index_expression",
        "index_uuid": "_na_"
      }
    ],
    "type": "index_not_found_exception",
    "reason": "no such index [logstash-logs]",
    "index": "logstash-logs",
    "resource.id": "logstash-logs",
    "resource.type": "index_expression",
    "index_uuid": "_na_"
  },
  "status": 404
}
```
