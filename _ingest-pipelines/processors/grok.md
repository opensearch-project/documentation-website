---
layout: default
title: Grok
parent: Ingest processors
grand_parent: Ingest pipelines
nav_order: 140
---

# Grok 

The `grok` processor is used to parse and structure unstructured data using pattern matching. You can use the `grok` processor to extract fields from log messages, web server access logs, application logs, and other log data that follows a consistent format.

## Grok basics

The `grok` processor uses a set of predefined patterns to match parts of the input text. Each pattern consists of a name and a regular expression. For example, the pattern `%{IP:ip_address}` matches an IP address and assigns it to the field `ip_address`. You can combine multiple patterns to create more complex expressions. For example, the pattern `%{IP:client} %{WORD:method} %{URIPATHPARM:request} %{NUMBER:bytes %NUMBER:duration}` matches a line from a web server access log and extracts the client IP address, the HTTP method, the request URI, the number of bytes sent, and the duration of the request.

The `grok` processor is built on the [Oniguruma regular expression library](https://github.com/kkos/oniguruma/blob/master/doc/RE) and supports all the patterns from that library. You can use the [Grok Debugger](https://grokdebugger.com/) tool to test and debug your grok expressions.

## Grok processor syntax

The following is the basic syntax for the `grok` processor: 

```json
{
  "grok": {
    "field": "your_message",
    "patterns": ["your_patterns"]
  }
}
```
{% include copy-curl.html %}

## Configuration parameters

To configure the `grok` processor, you have various options that allow you to define patterns, match specific keys, and control the processor's behavior. The following table lists the required and optional parameters for the `grok` processor.

Parameter | Required | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field containing the text that should be parsed. |
`patterns`  | Required  | A list of grok expressions used to match and extract named captures. The first matching expression in the list is returned. | 
`pattern_definitions`  | Optional  | A dictionary of pattern names and pattern tuples used to define custom patterns for the current processor. If a pattern matches an existing name, it overrides the pre-existing definition. |
`trace_match` | Optional | When the parameter is set to `true`, the processor adds a field named `_grok_match_index` to the processed document. This field contains the index of the pattern within the `patterns` array that successfully matched the document. This information can be useful for debugging and understanding which pattern was applied to the document. Default is `false`. |
`description` | Optional | A brief description of the processor. |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing` | Optional | If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

## Creating a pipeline

The following steps guide you through creating an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/index/) with the `grok` processor. 

**Step 1: Create a pipeline.** 

The following query creates a pipeline, named `log_line`. It extracts fields from the `message` field of the document using the specified pattern. In this case, it extracts the `clientip`, `timestamp`, and `response_status` fields:

```json
PUT _ingest/pipeline/log_line
{
  "description": "Extract fields from a log line",
  "processors": [
    {
      "grok": {
        "field": "message",
        "patterns": ["%{IPORHOST:clientip} %{HTTPDATE:timestamp} %{NUMBER:response_status:int}"]
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline.**

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/alert-icon.png" class="inline-icon" alt="alert icon"/>{:/} **NOTE**<br>It is recommended that you test your pipeline before you ingest documents.
{: .note}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/log_line/_simulate
{
  "docs": [
    {
      "_source": {
        "message": "127.0.0.1 198.126.12 10/Oct/2000:13:55:36 -0700 200"
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The following response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "message": "127.0.0.1 198.126.12 10/Oct/2000:13:55:36 -0700 200",
          "response_status": 200,
          "clientip": "198.126.12",
          "timestamp": "10/Oct/2000:13:55:36 -0700"
        },
        "_ingest": {
          "timestamp": "2023-09-13T21:41:52.064540505Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=log_line
{
  "message": "127.0.0.1 198.126.12 10/Oct/2000:13:55:36 -0700 200"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

## Custom patterns

You can use default patterns, or you can add custom patterns to your pipelines using the `patterns_definitions` parameter. Custom grok patterns can be used in a pipeline to extract structured data from log messages that do not match the built-in grok patterns. This can be useful for parsing log messages from custom applications or for parsing log messages that have been modified in some way. Custom patterns adhere to a straightforward structure: each pattern has a unique name and the corresponding regular expression that defines its matching behavior.

The following is an example of how to include a custom pattern in your configuration. In this example, the issue number is between 3 and 4 digits and is parsed into the `issue_number` field and the status is parsed into the `status` field:

```json
PUT _ingest/pipeline/log_line
{
  "processors": [
    {
      "grok": {
        "field": "message",
        "patterns": ["The issue number %{NUMBER:issue_number} is %{STATUS:status}"],
        "pattern_definitions" : {
          "NUMBER" : "\\d{3,4}",
          "STATUS" : "open|closed"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

## Tracing which patterns matched

To trace which patterns matched and populated the fields, you can use the `trace_match` parameter. The following is an example of how to include this parameter in your configuration:

```json
PUT _ingest/pipeline/log_line  
{  
  "description": "Extract fields from a log line",  
  "processors": [  
    {  
      "grok": {  
        "field": "message",  
        "patterns": ["%{HTTPDATE:timestamp} %{IPORHOST:clientip}", "%{IPORHOST:clientip} %{HTTPDATE:timestamp} %{NUMBER:response_status:int}"],  
        "trace_match": true  
      }  
    }  
  ]  
}  
```
{% include copy-curl.html %}

When you simulate the pipeline, OpenSearch returns the `_ingest` metadata that includes the `grok_match_index`, as shown in the following output:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "message": "127.0.0.1 198.126.12 10/Oct/2000:13:55:36 -0700 200",
          "response_status": 200,
          "clientip": "198.126.12",
          "timestamp": "10/Oct/2000:13:55:36 -0700"
        },
        "_ingest": {
          "_grok_match_index": "1",
          "timestamp": "2023-11-02T18:48:40.455619084Z"
        }
      }
    }
  ]
}
```

