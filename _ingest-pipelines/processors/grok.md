---
layout: default
title: Grok
parent: Ingest processors
grand_parent: Ingest pipelines
nav_order: 140
---

# Grok 

The `grok` processor is used to parse and extract structured data from unstructured data. It is useful in log analytics and data processing pipelines where data is often in a raw and unformatted state. 

The `grok` processor uses a combination of pattern matching and regular expressions to identify and extract information from the input text. The processor supports a range of predefined patterns for common data types such as timestamps, IP addresses, and usernames. The `grok` processor can perform transformations on extracted data, such as converting a timestamp to a proper date field.

The following is the syntax for the `grok` processor: 

```json
{
  "grok": {
    "field": "your_message",
    "patterns": ["your_patterns"]
  }
}
```
{% include copy-curl.html %}

The `grok` processor is built on the [Oniguruma regular expression library](https://github.com/kkos/oniguruma/blob/master/doc/RE). It enhances regular expressions by naming and renaming patterns for intricate matches. Its syntax variants are `%{SYNTAX:SEMANTIC}`, `%{SYNTAX}`, and `%{SYNTAX:SEMANTIC:TYPE}`. The following bullets provide a breakdown of these variants:

- `SYNTAX`: The pattern, for example, `NUMBER` matches `3.44`, and `IP` matches `55.3.244.1`.
- `SEMANTIC`: The label for the matched text, for example, naming `3.44` as `duration` or `55.3.244.1` as `client_IP`.
- `TYPE`: Converts the named field to types such as `int`, `long`, `double`, `float`, or `boolean`.

## Configuration parameters

To configure the `grok` processor, you have various options that allow you to define patterns, match specific keys, and control the processor's behavior. The following table lists the required and optional parameters for the `grok` processor.

Parameter | Required | Description |
|-----------|-----------|-----------|
`field`  | Required  | The name of the field to which the data should be parsed. |
`patterns`  | Required  | A list of grok expressions used to match and extract named captures. The first expression in the list that matches is returned. | 
`pattern_definitions`  | Optional  | A dictionary of pattern names and pattern tuples (a pair of a pattern name, which is a string that identifies the pattern, and a pattern, which is the string that specifies the pattern itself) is used to define custom patterns for the current processor. If a pattern matches an existing name, it overrides the pre-existing definition. |
`trace_match` | Optional | When the parameter is set to `true`, the processor adds a field named `_grok_match_index` to the processed document. This field contains the index of the pattern within the `patterns` array that successfully matched the document. This information can be useful for debugging and understanding which pattern was applied to the document. Default is `false`. |
`description` | Optional | A brief description of the processor. |
`if` | Optional | A condition for running this processor. |
`ignore_failure` | Optional | If set to `true`, failures are ignored. Default is `false`. |
`ignore_missing` | Optional | If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

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

## Grok patterns

You can use default patterns, or you can add custom patterns to your pipelines using the `patterns_definitions` parameter. The [Grok Debugger](https://grokdebugger.com/) can help you test and debug grok patterns before using them in your [ingest pipelines]({{site.url}}{{site.baseurl}}/api-reference/ingest-apis/index/). The [Grok Constructor](https://grokconstructor.appspot.com/) can help you test and construct regular expressions for the Grok filter that parses logfile lines in [Logstash](/tools/logstash/index/). 

### Using with custom patterns

Custom grok patterns can be used in a pipeline to extract structured data from log messages that do not match the built-in grok patterns. This can be useful for parsing log messages from custom applications or for parsing log messages that have been modified in some way. Custom patterns adhere to a straightforward structure: each pattern has a unique name and the corresponding regular expression that defines its matching behavior.These custom patterns can be incorporated into the `grok` processor using the `pattern_definitons` parameter. This parameter accepts a dictionary where the keys represent the pattern names and the values represent the corresponding regular expressions.

The following is an example of how to include a custom pattern in your configuration. In this example, `MY_CUSTOM_PATTERN` is defined and subsequently used in the `patterns` list, which tells grok to look for this pattern in the log message. The pattern is a regular expression that matches any sequence of alphanumeric characters and captures the matched characters into the `my_field`.

```json
{
   "processors":[
      {
         "grok":{
            "field":"message",
            "patterns":[
               "%{MY_CUSTOM_PATTERN:my_field}"
            ],
            "pattern_definitions":{
               "MY_CUSTOM_PATTERN":"([a-zA-Z0-9]+)"
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
        "patterns": ["%{IPORHOST:clientip} %{HTTPDATE:timestamp} %{NUMBER:response_status:int}"],
        "trace_match": true
      }
    }
  ]
}
```
{% include copy-curl.html %}

#### Response

The following response shows the output of the pipeline: 

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
          "_grok_match_index": "0",
          "timestamp": "2023-10-23T19:18:37.14624097Z"
        }
      }
    }
  ]
}
```
