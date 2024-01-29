---
layout: default
title: Dissect
parent: Ingest processors
nav_order: 60
---

# Dissect

The `dissect` processor extracts values from a document text field and maps them to individual fields based on dissect patterns. The processor is well suited for field extractions from log messages with a known structure. Unlike the `grok` processor, `dissect` does not use regular expressions and has a simpler syntax.

## Syntax

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
`field`  | Required  | The name of the field containing the data to be dissected. |
`pattern` | Required | The dissect pattern used to extract data from the specified field. |
`append_separator` | Optional | The separator character or string that separates appended fields. Default is `""` (empty string).
`description`  | Optional  | A brief description of the processor.  |
`if` | Optional | A condition for running the processor. |
`ignore_failure` | Optional | Specifies whether the processor continues execution even if it encounters an error. If set to `true`, the processor failure is ignored. Default is `false`. |
`ignore_missing`  | Optional  | Specifies whether the processor should ignore documents that do not contain the specified field. If set to `true`, the processor does not modify the document if the field does not exist or is `null`. Default is `false`. |
`on_failure` | Optional | A list of processors to run if the processor fails. |
`tag` | Optional | An identifier tag for the processor. Useful for debugging to distinguish between processors of the same type. |

## Using the processor

Follow these steps to use the processor in a pipeline.

**Step 1: Create a pipeline**

The following query creates a pipeline, named `dissect-test`, that uses the `dissect` processor to parse the log line:

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

**Step 2 (Optional): Test the pipeline**

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

**Response**

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

**Step 3: Ingest a document**

The following query ingests a document into an index named `testindex1`:

```json
PUT testindex1/_doc/1?pipeline=dissect-test
{
   "message": "192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] \"POST /login HTTP/1.1\" 200 3456"
}
```
{% include copy-curl.html %}

**Step 4 (Optional): Retrieve the document**

To retrieve the document, run the following query:

```json
GET testindex1/_doc/1
```
{% include copy-curl.html %}

## Dissect patterns

A dissect pattern is a method of telling the `dissect` processor how to parse a string into a structured format. The pattern is defined by the parts of the string that you want to discard. For example, the `%{client_ip} - - [%{timestamp}]` dissect pattern parses the string `"192.168.1.10 - - [03/Nov/2023:15:20:45 +0000] \"POST /login HTTP/1.1\" 200 3456"` into the following fields:

```json
client_ip: "192.168.1.1"
@timestamp: "03/Nov/2023:15:20:45 +0000"
```

A dissect pattern works by matching a string against a set of rules. For example, the first rule discards a single space. Dissect will find this space and then assign the value of `client_ip` to everything up to that space. The next rule matches the `[` and `]` characters and then assigns the value of `@timestamp` to everything in between.

### Building successful dissect patterns

When building a dissect pattern, it is important to pay attention to the parts of the string that you want to discard. If you discard too much of the string, then the `dissect` processor may not be able to successfully parse the remaining data. Conversely, if you do not discard enough of the string, then the processor may create unnecessary fields.

If any `%{keyname}` defined in the pattern does not have a value, then an exception is thrown. You can handle this exception by providing error handling steps in the `on_failure` parameter.

### Empty and named skip keys

An empty key `%{}` or a [named skip key](#named-skip-key) can be used to match values but exclude the value from the final document. This can be useful if you want to parse a string but do not need to store all of its parts.

### Converting matched values to a non-string data type

By default, all matched values are represented as string data types. If you need to convert a value to a different data type, you can use the [`convert` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/convert/).

### Key modifiers 

The `dissect` processor supports key modifiers that can change the default processor behavior. These modifiers are always placed to the left or right of the `%{keyname}` and are always enclosed within `%{}`. For example, the `%{+keyname->}` modifier includes the append and right padding modifiers. Key modifiers are useful for combining multiple fields into a single line of output, creating formatted lists of data items, or aggregating values from multiple sources.  

The following table lists the primary modifiers for the `dissect` processor.

Modifier | Name | Position | Example | Description |
|-----------|-----------|-----------|
`->` | Skip right padding | (far) right | `%{keyname->}` | Tells `dissect` to skip over any repeated characters to the right. For example, `%{timestamp->}` could be used to tell `dissect` to skip over any padding characters, such as two spaces or any varying character padding, that follow `timestamp`. |
`+` | Append | left | `%{keyname} %{+keyname}` | Appends two or more fields together. | 
`+` with `/n` | Append with order | left and right | `%{+keyname}/2 %{+keyname/1}` | Appends two or more fields together in the order specified. |
`?` | Named skip key | left | `%{?skipme}` | Skips the matched value in the output. Same behavior as `%{}`. |
`*` and `&` | Reference keys | left | `%{*r1} %{&r1}` | Sets the output key as value of `*` and output value of `&`. |

Detailed descriptions of each key modifier, along with usage examples, are in the following sections.

### Right padding modifier (`->`)

The dissection algorithm is precise and requires that every character in the pattern exactly match the source string. For instance, the pattern `%{hellokey} %{worldkey}` (one space) will match the string "Hello world" (one space) but not the string "Hello  world" (two spaces) because the pattern only has one space while the source string has two.

The right padding modifier can be used to address this issue. By adding the right padding modifier to the pattern `%{helloworldkey->} %{worldkey}`, it will match <code>Hello&nbsp;world</code> (one space), <code>Hello&nbsp;&nbsp;world</code> (two spaces), and even <code>Hello&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;world</code> (ten spaces). 

The right padding modifier is used to allow for the repetition of characters following a `%{keyname->}`. The right padding modifier can be applied to any key along with any other modifiers. It should always be the rightmost modifier, for example, `%{+keyname/1->}` or `%{}`.

#### Example of usage

The following is an example of how to use a right padding modifier:

`%{city->}, %{state} %{zip}`

In this pattern, the right padding modifier `->` is applied to the `%{city}` key. Both addresses contain the same information, but the second entry has an extra word, `City`, in the city field. The right padding modifier allows the pattern to match both of these address entries, even though they have slightly different formats: 

```bash
New York, NY 10017
New York City, NY 10017
```

The following example pipeline uses the right padding modifier with an empty key `%{->}`:

```json
PUT /_ingest/pipeline/dissect-test
{
  "description": "Pipeline that dissects web server logs",
  "processors": [
    {
      "dissect": {
        "field": "message",
        "pattern": "[%{client_ip}]%{->}[%{timestamp}]" 
      }
    }
  ]
}
```
{% include copy-curl.html %}

You can test the pipeline using the following example:

```json
POST _ingest/pipeline/dissect-test/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "message": "[192.168.1.10]   [03/Nov/2023:15:20:45 +0000]"
      }
    }
  ]
}
```
{% include copy-curl.html %}

Your response should be similar to the following:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "client_ip": "192.168.1.10",
          "message": "[192.168.1.10]   [03/Nov/2023:15:20:45 +0000]",
          "timestamp": "03/Nov/2023:15:20:45 +0000"
        },
        "_ingest": {
          "timestamp": "2024-01-22T22:55:42.090569297Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Append modifier (`+`)

The append modifier combines the values of two or more values into a single output value. The values are appended from left to right. You can also specify an optional separator to be inserted between the values. 

#### Example of usage

The following is an example pipeline with an append modifier: 

```json
PUT /_ingest/pipeline/dissect-test
{
  "description": "Pipeline that dissects web server logs",
  "processors": [
    {
      "dissect": {
        "field": "message",
        "pattern": "%{+address}, %{+address} %{+address}",
        "append_separator": "|"
      }
    }
  ]
}
```
{% include copy-curl.html %}

You can test the pipeline using the following example:

```json
POST _ingest/pipeline/dissect-test/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "message": "New York, NY 10017"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The substrings are appended to the `address` field, as shown in the following response:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "address": "New York|NY|10017",
          "message": "New York, NY 10017"
        },
        "_ingest": {
          "timestamp": "2024-01-22T22:30:54.516284637Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Append with order modifier (`+` and `/n`)

The append with order modifier combines the values of two or more keys into a single output value based on the order specified after the `/`. You have the flexibility to customize the separator that separates the appended values. The append modifier is useful for compiling multiple fields into a single formatted output line, constructing structured lists of data items, and consolidating values from various sources.  

#### Example of usage

The following example pipeline uses the append with order modifier to reverse the pattern order defined in the preceding pipeline. This pipeline specifies a separator to insert between the appended fields. If you don't specify a separator, all values will be appended together without a separator.

```json
PUT /_ingest/pipeline/dissect-test
{
  "description": "Pipeline that dissects web server logs",
  "processors": [
    {
      "dissect": {
        "field": "message",
        "pattern": "%{+address/3}, %{+address/2} %{+address/1}",
        "append_separator": "|"
      }
    }
  ]
}
```
{% include copy-curl.html %}

You can test the pipeline using the following example:

```json
POST _ingest/pipeline/dissect-test/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "message": "New York, NY 10017"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The substrings are appended into the `address` field in reverse order, as shown in the following response:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "address": "10017|NY|New York",
          "message": "New York, NY 10017"
        },
        "_ingest": {
          "timestamp": "2024-01-22T22:38:24.305974178Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Named skip key

The named skip key modifier excludes specific matches from the final output by using an empty key `{}` or `?` modifier within the pattern. For example, the following patterns are equivalent: `%{firstName} %{lastName} %{?ignore}` and `%{firstName} %{lastName} %{}`. The named skip key modifier is useful for excluding irrelevant or unnecessary fields from the output.

#### Example of usage

The following pattern uses a named skip key to exclude a field (in this case, `ignore`) from the output. You can assign a descriptive name to the empty key, for example, `%{?ignore}`, to clarify that the corresponding value should be excluded from the final result:

```json
PUT /_ingest/pipeline/dissect-test
{
  "description": "Pipeline that dissects web server logs",
  "processors": [
    {
      "dissect": {
        "field": "message",
        "pattern": "%{firstName} %{lastName} %{?ignore}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

You can test the pipeline using the following example:

```json
POST _ingest/pipeline/dissect-test/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "message": "John Doe M.D."
      }
    }
  ]
}
```
{% include copy-curl.html %}

Your response should be similar to the following:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "firstName": "John",
          "lastName": "Doe",
          "message": "John Doe M.D."
        },
        "_ingest": {
          "timestamp": "2024-01-22T22:41:58.161475555Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}

### Reference keys (`*` and `&`)

Reference keys use parsed values as key/value pairings for structured content. This can use useful when handling systems that partially log data in key/value pairs. By using reference keys, you can preserve the key/value relationship and maintain the integrity of the extracted information. 

#### Example of usage

The following pattern uses a reference key to extract data into a structured format. In this example, `client_ip` and two key/value pairs are extracted for the next values:

```json
PUT /_ingest/pipeline/dissect-test
{
  "description": "Pipeline that dissects web server logs",
  "processors": [
    {
      "dissect": {
        "field": "message",
        "pattern": "%{client_ip} %{*a}:%{&a} %{*b}:%{&b}"
      }
    }
  ]
}
```
{% include copy-curl.html %}

You can test the pipeline using the following example:

```json
POST _ingest/pipeline/dissect-test/_simulate
{
  "docs": [
    {
      "_index": "testindex1",
      "_id": "1",
      "_source": {
        "message": "192.168.1.10 response_code:200 response_size:3456"
      }
    }
  ]
}
```
{% include copy-curl.html %}

The two key/value pairs were extracted into fields, as shown in the following response:

```json
{
  "docs": [
    {
      "doc": {
        "_index": "testindex1",
        "_id": "1",
        "_source": {
          "client_ip": "192.168.1.10",
          "response_code": "200",
          "message": "192.168.1.10 response_code:200 response_size:3456",
          "response_size": "3456"
        },
        "_ingest": {
          "timestamp": "2024-01-22T22:48:51.475535635Z"
        }
      }
    }
  ]
}
```
{% include copy-curl.html %}
