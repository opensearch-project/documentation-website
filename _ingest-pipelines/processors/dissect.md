---
layout: default
title: Dissect
parent: Ingest processors
nav_order: 55
---

# Dissect

The `dissect` processor extracts values from an event and maps them to individual fields based on user-defined dissect patterns. The processor is well-suited for field extractions from log messages with a known structure.

## Example
The following is the syntax for the `dissect` processor:

```json
{
  "dissect": {
    "field": "source_field",
    "pattern": "%{dissect_pattern}"
  }
}
```
{% include copy-curl.html %}


## Configuration parameters

The following table lists the required and optional parameters for the `dissect` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field to which the data should be dissected. Supports [template snippets]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#template-snippets). |
`dissect_pattern` | Required | The dissect pattern used to extract data from the field specified. |
`append_separator` | Optional | The separator character or string between two or more values. Default is `""` (empty string).
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing`  | Optional  | If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline.**

The following query creates a pipeline, named `dissect-text`, that uses the `dissect` processor to parse the log line:

```json
PUT /_ingest/pipeline/dissect-test
{
  "description": "Pipeline that dissects web server logs",
  "processors": [
    {
      "dissect": {
        "field": "message",
        "pattern": "%{client_ip} - - [%{timestamp}] \"%{http_method} %{url} %{http_version}\" %{response_code} %{response_size}" 
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Step 2 (Optional): Test the pipeline.**

It is recommended that you test your pipeline before you ingest documents.
{: .tip}

To test the pipeline, run the following query:

```json
POST _ingest/pipeline/dissect-test/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "message": "192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] \"POST /login HTTP/1.1\" 200 3456"
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
          "response_code": "200",
          "http_method": "POST",
          "http_version": "HTTP/1.1",
          "client_ip": "192.168.1.10",
          "message": """192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] "POST /login HTTP/1.1" 200 3456""",
          "url": "/login",
          "response_size": "3456",
          "timestamp": "03/Nov/2023:15:20:45 +0000"
        },
        "_ingest": {
          "timestamp": "2023-11-03T22:28:32.830244044Z"
        }
      }
    }
  ]
}
```

**Step 3: Ingest a document.**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=dissect-test
{
   "message": "192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] \"POST /login HTTP/1.1\" 200 3456"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document.**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

## Dissect patterns

A dissect pattern is a way to tell `dissect` how to parse a string into a structured format. The pattern is defined by the parts of the string that you want to discard. For example, the following dissect pattern would parse a string like `"192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] \"POST /login HTTP/1.1\" 200 3456"` into the following fields:

```json
client_ip: "192.168.1.1"
@timestamp: "03/Nov/2023:16:09:05 MDT"
```

The dissect pattern works by matching the string against a set of rules. For example, the first rule is to match a single space. Dissect will find this space and then assign the value of `client_ip` to everything up to that space. The next rule is to match the `[` and `]` characters and then assign the value of `@timestamp` to everything in between.

### Buidling successful dissect patterns

When building dissect pattern, it is important to pay attention to the parts of the string that you want to discard. If you discard too much of the string, then `dissect` may not be able to successfully parse the remaining data. Conversely, if you do not discard enough of the string, then `dissect` may create unnecessary fields.

If any of the `%{keyname}` defined in the pattern do not have a value, then an exception is thrown. You can handle this exception by using the `on_failure` parameter.

### Empty and named skip keys

An empty key `%{}` or a named skip key can be used to match values, but exclude the value from the final document. This can be useful if you want to parse a string, but you do not need to store all of the data.

### Matched values as string data types

By default, all matched values are represented as string data types. If you need to convert a value to a different data type, you can use the [`convert` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/convert/).

### Key modifiers 

The `dissect` processor support key modifiers that can change dissect's default behavior. For example, you can instruct `dissect` to ignore certain fields or append fields. 

The following table lists the key modifiers for the `dissect` processor.

Modifier | Name | Position | Example | Description |
|-----------|-----------|-----------|
`->` | Skip right padding | (far) right | `%{keyname->}` | Tells `dissect` to skip over any repeated characters to the right. For example, `%{timestamp->}` could be used to tell `dissect` to skip over any padding characters, such as two spaces or any varying character padding, that follow `timestamp`. |
 