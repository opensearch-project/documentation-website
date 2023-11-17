---
layout: default
title: Dissect
parent: Ingest processors
nav_order: 60
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

### Building successful dissect patterns

When building dissect pattern, it is important to pay attention to the parts of the string that you want to discard. If you discard too much of the string, then `dissect` may not be able to successfully parse the remaining data. Conversely, if you do not discard enough of the string, then `dissect` may create unnecessary fields.

If any of the `%{keyname}` defined in the pattern do not have a value, then an exception is thrown. You can handle this exception by using the `on_failure` parameter.

### Empty and named skip keys

An empty key `%{}` or a named skip key can be used to match values, but exclude the value from the final document. This can be useful if you want to parse a string, but you do not need to store all of the data.

### Matched values as string data types

By default, all matched values are represented as string data types. If you need to convert a value to a different data type, you can use the [`convert` processor]({{site.url}}{{site.baseurl}}/ingest-pipelines/processors/convert/).

### Key modifiers 

The `dissect` processor supports key modifiers that can change the dissection's default behavior. These modifiers are always placed to the left or right of the `%{keyname}` and are always enclosed within the `%{}`. For example, the `%{+keyname->}` modifier includes the append and right padding modifiers. Key modifiers are useful for cases such as combining multiple fields into a single line of output, creating formatted lists of data items, or aggregating values from multiple sources.  

The following table lists the key modifiers for the `dissect` processor.

Modifier | Name | Position | Example | Description |
|-----------|-----------|-----------|
`->` | Skip right padding | (far) right | `%{keyname->}` | Tells `dissect` to skip over any repeated characters to the right. For example, `%{timestamp->}` could be used to tell `dissect` to skip over any padding characters, such as two spaces or any varying character padding, that follow `timestamp`. |
`+` | Append | left | `%{keyname} %{+keyname}` | Appends two or more fields together. | 
`+` with `/n` | Append with order | left and right | `%{+keyname}/2 %{+keyname/1}` | Appends two or more fields together in the order specified. |
`?` | Named skip key | left | `%{?skipme}` | Skips the matched value in the output. Same behavior as `%{}`. |
`*` and `&` | Reference keys | left | `%{*r1} %{&r1}` | Sets the output key as value of `*` and output value of `&`. |

Detailed descriptions of each key modifier are in the following sections.

### Right padding modifier (`->`)

The dissection algorithm is precise and requires that every character in the pattern exactly match the source string. For instance, the pattern `%{helloworldkey} %{worldkey}` (one space) will match the string "Hello world" (one space) but not the string "Hello  world" (two spaces) because pattern only has one space while the source string has two.

The right padding modifier can be used to address this issue. By adding the right padding modifier to the pattern `%{helloworldkey->} %{worldkey}`, it will no match `Hello world` (one space), `Hello  world` (two spaces), and even `Hello          world` (ten spaces). 

The right padding modifier is used to allow for the repetition of characters following a `%{keyname->}`. The right padding modifier can be applied to any key along with any other modifiers. It should always be the rightmost modifier, for example, `%{+keyname/1->}`, `%{}`.

#### Example

The following is an example of a right padding modifier and how it is used:

`%{name->} %{city}, %{state} %{zip}`

In this pattern, the right padding modifier `->` is applied to the `%{name}` key. This means that the `%{name}` key will match an sequence of characters, including spaces. This is useful for handling names that may contain spaces, such as "First Last".

The following is an example of how the right padding would be used to extract information from the following address entries: 

```bash
New York, NY 10017
New York City, NY 10017
```

Both addresses contain the same information, but the second entry has an extra word, `City`, in the city field. The right padding modifier allows the pattern to match both of these address entries, even though they have slightly different formats.

### Append modifier (`+`)

The append modifier combines the values of two or more keys into a single output value. The values are appended from left to right. You can also specify an optional separator to be inserted between the values. 

#### Example

The following pattern extracts the values of `key1` and `key2` fields and appends them together, with a space as the separator:

`%{key1} %{key2}`

The output is:

`value1 value2`

You can also specify a custom separator using the `append_separator` parameter. For example, the following pattern uses a comma as the separator: 

`%{key1} %{key2}, append_separator => ","`

The output is:

`value1, value2`

### Append with order modifier (`+` and `/n`)

The append with order modifier combines the values of two or more keys into a single output value, adhering to the a specific order defines by a newline character `/n`. You have the flexibility to customize the separator that separates the appended values. the append modifier is useful for compiling multiple fields into a single formatted output line, constructing structured lists of data items, and consolidating values from various sources.  

#### Example

The following pattern extracts the values of `key1` and `key2` fields and appends them together, with a newline character as the separator:

`%{key1} %key2} /n`

The output is:

```bash
value1
value2
```

You can also specify an alternative separator using the `append_separator` parameter. For example, the following pattern uses a comma as the separator: 

`%{key1} %key2}, append_separator => "," /n`

The outout is:

```bash
value1, value2
```

### Named skip key (`?`)

The named skip key modifier excludes specific matches from the final output by using an empty key, `{%}`, within the pattern. The named skip key modifier is useful for excluding irrelevant or unnecessary fields from the output, focusing on specific information, or streamlining the output for further processing ot analysis. 

#### Example

The following pattern excludes a field (in this case, `ignore`) from the output. You can assign a descriptive name to the empty key, for example, `%{ignore}`, to clarify that the corresponding value should be excluded from the final result.

`%firstName} %{lastName} %{ignore}`

### Reference keys (`*` and `&`)

Reference keys use parsed values as key/value pairings for structured content. This can use useful when handling systems that partially log data in key/value pairs. by using reference keys, you can preserve the key/value relationship and maintain the integrity of the extracted information. 

#### Example

The following pattern extracts data into a structured format, with `%{value}` represented the parsed value and `%{reference_key}` acting as placeholder for the actual key:

`%{value} %{reference_key}`

The output is: 

```bash
value1 value1
value2 value2
value3 value3
```
