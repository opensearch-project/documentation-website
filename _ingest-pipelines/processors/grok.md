---
layout: default
title: Grok
parent: Ingest processors
nav_order: 120
---

# Grok processor 

The `grok` processor is used to parse and structure unstructured data using pattern matching. You can use the `grok` processor to extract fields from log messages, web server access logs, application logs, and other log data that follows a consistent format.

This documentation describes using the `grok` processor in OpenSearch ingest pipelines. Consider using the [Data Prepper `grok` processor]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/grok/), which runs outside the OpenSearch cluster, if your use case involves large or complex datasets.
{: .note}

## Grok basics

The `grok` processor uses a set of predefined patterns to match parts of the input text. Each pattern consists of a name and a regular expression. For example, the pattern `%{IP:ip_address}` matches an IP address and assigns it to the field `ip_address`. You can combine multiple patterns to create more complex expressions. For example, the pattern `%{IP:client} %{WORD:method} %{URIPATHPARAM:request} %{NUMBER:bytes} %{NUMBER:duration}` matches a line from a web server access log and extracts the client IP address, the HTTP method, the request URI, the number of bytes sent, and the duration of the request.

For a list of available predefined patterns, see [Grok patterns](https://github.com/opensearch-project/OpenSearch/blob/main/libs/grok/src/main/resources/patterns/grok-patterns).
{: .tip}

The `grok` processor is built on the [Oniguruma regular expression library](https://github.com/kkos/oniguruma/blob/master/doc/RE) and supports all the patterns from that library. You can use the built-in [Grok Debugger]({{site.url}}{{site.baseurl}}/dashboards/dev-tools/grok-debugger/) in OpenSearch Dashboards Dev Tools to test and debug your grok expressions.

A pattern reference takes one of the following forms:

- `%{PATTERN_NAME}`: Matches the text but doesn't store it in a field.
- `%{PATTERN_NAME:field_name}`: Stores the matched text as a string in `field_name`.
- `%{PATTERN_NAME:field_name:type}`: Stores the matched text in `field_name`, converted to `type`. Valid types are `int`, `long`, `float`, `double`, and `boolean`.

For example, given the text `3 items 0.25 2048`, the pattern `%{NUMBER} items %{NUMBER:response_time:float} %{NUMBER:body_size:long}` skips the item count, stores `response_time` as a float, and stores `body_size` as a long.

Note that patterns are *not anchored*. For performance and reliability, include a start-of-line anchor (`^`) in your pattern.
{: .note}

## Syntax

The following is the basic syntax for the `grok` processor: 

```json
{
  "grok": {
    "field": "your_message",
    "patterns": ["your_patterns"]
  }
}
```
{% include copy.html %}

## Configuration parameters

To configure the `grok` processor, you have various options that allow you to define patterns, match specific keys, and control the processor's behavior. The following table lists the required and optional parameters for the `grok` processor.

Parameter | Required/Optional | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field containing the text to be parsed. |
`patterns`  | Required  | A list of grok expressions used to match and extract named captures. The first matching expression in the list is returned. | 
`pattern_definitions`  | Optional  | A dictionary of pattern names and pattern tuples used to define custom patterns for the current processor. If a pattern matches an existing name, it overrides the pre-existing definition. |
`trace_match` | Optional | When the parameter is set to `true`, the processor adds the `_grok_match_index` field to the ingest metadata of the processed document (`_ingest._grok_match_index`). This field contains the index of the pattern within the `patterns` array that successfully matched the document. This information can be useful for debugging and understanding which pattern was applied to the document. Default is `false`. |
`capture_all_matches` | Optional | When set to `true`, captures all matches of repeated grok patterns instead of only the first match. For example, given the text `192.168.1.1 10.0.0.1 172.16.0.1` and the pattern `%{IP:ipAddress} %{IP:ipAddress} %{IP:ipAddress}`, all three IP addresses are collected into an array in the `ipAddress` field. Works only with explicitly repeated patterns, not with quantified patterns such as `(%{IP:ipAddress})+`. Default is `false`. |
`description` | Optional | A brief description of the processor. |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters errors. If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing` | Optional | Specifies whether the processor should ignore documents that do not contain the specified field. If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging in order to distinguish between processors of the same type. For more information, see [Using processor tags for monitoring and debugging]({{site.url}}{{site.baseurl}}/ingest-pipelines/create-ingest/#using-processor-tags-for-monitoring-and-debugging). |

## Creating a pipeline

The following steps guide you through creating an [ingest pipeline]({{site.url}}{{site.baseurl}}/ingest-pipelines/index/) with the `grok` processor. 

**Step 1: Create a pipeline** 

The following query creates a pipeline, named `log_line`. It extracts fields from the `message` field of the document using the specified pattern. In this case, it extracts the `clientip`, `timestamp`, and `response_status` fields:

```json
PUT _ingest/pipeline/log_line
{
  "description": "Extract fields from a log line",
  "processors": [
    {
      "grok": {
        "field": "message",
        "patterns": ["^%{IPORHOST:clientip} %{HTTPDATE:timestamp} %{NUMBER:response_status:int}"]
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
        "message": "198.51.100.12 10/Oct/2000:13:55:36 -0700 200"
      }
    }
  ]
}
```
{% include copy-curl.html %}

**Response**

The following response confirms that the pipeline is working as expected:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "message": "198.51.100.12 10/Oct/2000:13:55:36 -0700 200",
          "response_status": 200,
          "clientip": "198.51.100.12",
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

**Step 3: Ingest a document**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=log_line
{
  "message": "198.51.100.12 10/Oct/2000:13:55:36 -0700 200"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

## Custom patterns

Use the default patterns, or add custom patterns to your pipelines using the `pattern_definitions` parameter. Custom grok patterns can be used in a pipeline to extract structured data from log messages that do not match the built-in grok patterns. This can be useful for parsing log messages from custom applications or for parsing log messages that have been modified in some way. Custom patterns adhere to a straightforward structure: each pattern has a unique name and the corresponding regular expression that defines its matching behavior.

The following is an example of how to include a custom pattern in your configuration. In this example, the issue number is between 3 and 4 digits and is parsed into the `issue_number` field and the status is parsed into the `status` field:

```json
PUT _ingest/pipeline/log_line
{
  "processors": [
    {
      "grok": {
        "field": "message",
        "patterns": ["^The issue number %{NUMBER:issue_number} is %{STATUS:status}"],
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

## Retrieving built-in patterns

To view the built-in patterns that you can reference in grok expressions, use the following request:

```json
GET _ingest/processor/grok
```
{% include copy-curl.html %}

The response contains a `patterns` object that maps each pattern name to its regular expression. The following is a truncated example response:

```json
{
  "patterns": {
    "IP": "(?:%{IPV6}|%{IPV4})",
    ...
  }
}
```

To sort the patterns alphabetically by name, set the `s` query parameter to `true`:

```json
GET _ingest/processor/grok?s=true
```
{% include copy-curl.html %}

## Grok watchdog settings

To protect the node from expressions that run for an unexpectedly long time, OpenSearch monitors each grok evaluation using a watchdog thread. If an evaluation runs longer than the allowed time, the watchdog stops it and the `grok` processor returns an error. You can configure the watchdog using the following static settings in `opensearch.yml`:

- `ingest.grok.watchdog.interval` (Static, time unit): The interval between watchdog runs. On each run, the watchdog stops any evaluation that has exceeded `ingest.grok.watchdog.max_execution_time`. Default is `1s`.

- `ingest.grok.watchdog.max_execution_time` (Static, time unit): The maximum amount of time that a grok expression evaluation can run before it is interrupted. Default is `1s`.

## Logging grok processing

When OpenSearch compiles the grok expressions in a processor, which happens when a pipeline is created or loaded or when a pipeline definition is passed to the Simulate Pipeline API, the regular expression compiler can report warnings about the expressions. OpenSearch logs these warnings at the `DEBUG` level. To include them in the OpenSearch logs, increase the log level for the processor:

```json
PUT _cluster/settings
{
  "persistent": {
    "logger.org.opensearch.ingest.common.GrokProcessor": "DEBUG"
  }
}
```
{% include copy-curl.html %}

For more information, see [Logs]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/logs/).

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
        "patterns": ["^%{HTTPDATE:timestamp} %{IPORHOST:clientip}", "%{IPORHOST:clientip} %{HTTPDATE:timestamp} %{NUMBER:response_status:int}"],
        "trace_match": true  
      }  
    }  
  ]  
}  
```
{% include copy-curl.html %}

When you simulate the pipeline, OpenSearch returns the `_ingest` metadata that includes the `_grok_match_index`, as shown in the following output. The index is zero based, so a value of `1` means that the second pattern matched. Because `_grok_match_index` is ingest metadata, it isn't indexed:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "_index",
        "_id": "_id",
        "_source": {
          "message": "198.51.100.12 10/Oct/2000:13:55:36 -0700 200",
          "response_status": 200,
          "clientip": "198.51.100.12",
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

