---
layout: default
title: Text processing
parent: Common use cases
nav_order: 55
---

# Text processing

OpenSearch Data Prepper provides text processing capabilities with the [`grok processor`]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/grok/). The `grok` processor is based on the [`java-grok`](https://mvnrepository.com/artifact/io.krakens/java-grok) library and supports all compatible patterns. The `java-grok` library is built using the [`java.util.regex`](https://docs.oracle.com/javase/8/docs/api/java/util/regex/package-summary.html) regular expression library.

You can add custom patterns to your pipelines by using the `patterns_definitions` option. When debugging custom patterns, the [Grok Debugger](https://grokdebugger.com/) can be helpful.

## Basic usage

To get started with text processing, create the following pipeline:

```json
patten-matching-pipeline:
  source
    ...
  processor:
    - grok:
        match:
          message: ['%{IPORHOST:clientip} \[%{HTTPDATE:timestamp}\] %{NUMBER:response_status:int}']
  sink:
    - opensearch:
        # Provide an OpenSearch cluster endpoint
```
{% include copy-curl.html %}

An incoming message might contain the following contents:

```json
{"message": "127.0.0.1 198.126.12 [10/Oct/2000:13:55:36 -0700] 200"}
```
{% include copy-curl.html %}

In each incoming event, the pipeline will locate the value in the `message` key and attempt to match the pattern. The keywords `IPORHOST`, `HTTPDATE`, and `NUMBER` are built into the plugin.

When an incoming record matches the pattern, it generates an internal event such as the following with identification keys extracted from the original message:

```json
{ 
  "message":"127.0.0.1 198.126.12 [10/Oct/2000:13:55:36 -0700] 200",
  "response_status":200,
  "clientip":"198.126.12",
  "timestamp":"10/Oct/2000:13:55:36 -0700"
}
```
{% include copy-curl.html %}

The `match` configuration for the `grok` processor specifies which record keys to match against which patterns.

In the following example, the `match` configuration checks incoming logs for a `message` key. If the key exists, it matches the key value against the `SYSLOGBASE` pattern and then against the `COMMONAPACHELOG` pattern. It then checks the logs for a `timestamp` key. If that key exists, it attempts to match the key value against the `TIMESTAMP_ISO8601` pattern.

```json
processor:
  - grok:
      match:
        message: ['%{SYSLOGBASE}', "%{COMMONAPACHELOG}"]
        timestamp: ["%{TIMESTAMP_ISO8601}"]  
```
{% include copy-curl.html %}

By default, the plugin continues until it finds a successful match. For example, if there is a successful match against the value in the `message` key for a `SYSLOGBASE` pattern, the plugin doesn't attempt to match the other patterns. If you want to match logs against every pattern, include the `break_on_match` option.

## Including named and empty captures

Include the `keep_empty_captures` option in your pipeline configuration to include null captures or the `named_captures_only` option to include only named captures. Named captures follow the pattern `%{SYNTAX:SEMANTIC}` while unnamed captures follow the pattern `%{SYNTAX}`.

For example, you can modify the preceding Grok configuration to remove `clientip` from the `%{IPORHOST}` pattern:

```json
processor:
  - grok:
      match:
        message: ['%{IPORHOST} \[%{HTTPDATE:timestamp}\] %{NUMBER:response_status:int}']
```
{% include copy-curl.html %}

The resulting grokked log will look like this:

```json
{
  "message":"127.0.0.1 198.126.12 [10/Oct/2000:13:55:36 -0700] 200",
  "response_status":200,
  "timestamp":"10/Oct/2000:13:55:36 -0700"
}
```
{% include copy-curl.html %}

Notice that the `clientip` key no longer exists because the `%{IPORHOST}` pattern is now an unnamed capture.

However, if you set `named_captures_only` to `false`:

```json
processor:
  - grok:
      match:
        named_captures_only: false
        message: ['%{IPORHOST} \[%{HTTPDATE:timestamp}\] %{NUMBER:message:int}']
```
{% include copy-curl.html %}

Then the resulting grokked log will look like this:

```json
{
  "message":"127.0.0.1 198.126.12 [10/Oct/2000:13:55:36 -0700] 200",
  "MONTH":"Oct",
  "YEAR":"2000",
  "response_status":200,
  "HOUR":"13",
  "TIME":"13:55:36",
  "MINUTE":"55",
  "SECOND":"36",
  "IPORHOST":"198.126.12",
  "MONTHDAY":"10",
  "INT":"-0700",
  "timestamp":"10/Oct/2000:13:55:36 -0700"
}
```
{% include copy-curl.html %}

Note that the `IPORHOST` capture now shows up as a new key, along with some internal unnamed captures like `MONTH` and `YEAR`. The `HTTPDATE` keyword is currently using these patterns, which you can see in the default patterns file.

## Overwriting keys

Include the `keys_to_overwrite` option to specify which existing record keys to overwrite if there is a capture with the same key value.

For example, you can modify the preceding Grok configuration to replace `%{NUMBER:response_status:int}` with `%{NUMBER:message:int}` and add `message` to the list of keys to overwrite:

```json
processor:
  - grok:
      match:
        keys_to_overwrite: ["message"]
        message: ['%{IPORHOST:clientip} \[%{HTTPDATE:timestamp}\] %{NUMBER:message:int}']
```
{% include copy-curl.html %}

In the resulting grokked log, the original message is overwritten with the number `200`:

```json
{ 
  "message":200,
  "clientip":"198.126.12",
  "timestamp":"10/Oct/2000:13:55:36 -0700"
}
```
{% include copy-curl.html %}

## Using custom patterns

Include the `pattern_definitions` option in your Grok configuration to specify custom patterns.

The following configuration creates custom regex patterns named `CUSTOM_PATTERN-1` and `CUSTOM_PATTERN-2`. By default, the plugin continues until it finds a successful match.

```json
processor:
  - grok:
      pattern_definitions:
        CUSTOM_PATTERN_1: 'this-is-regex-1'
        CUSTOM_PATTERN_2: '%{CUSTOM_PATTERN_1} REGEX'
      match:
        message: ["%{CUSTOM_PATTERN_2:my_pattern_key}"]
```
{% include copy-curl.html %}

If you specify `break_on_match` as `false`, the pipeline attempts to match all patterns and extract keys from the incoming events:

```json
processor:
  - grok:
      pattern_definitions:
        CUSTOM_PATTERN_1: 'this-is-regex-1'
        CUSTOM_PATTERN_2: 'this-is-regex-2'
        CUSTOM_PATTERN_3: 'this-is-regex-3'
        CUSTOM_PATTERN_4: 'this-is-regex-4'
      match:
        message: [ "%{PATTERN1}”, "%{PATTERN2}" ]
        log: [ "%{PATTERN3}", "%{PATTERN4}" ]
        break_on_match: false
```
{% include copy-curl.html %}

You can define your own custom patterns to use for pipeline pattern matching. In the previous example, `my_pattern` will be extracted after matching the custom patterns.

## Storing captures with a parent key

Include the `target_key` option in your Grok configuration to wrap all record captures in an additional outer key value.

For example, you can modify the preceding Grok configuration to add a target key named `grokked`:

```json
processor:
   - grok:
       target_key: "grokked"
       match:
         message: ['%{IPORHOST} \[%{HTTPDATE:timestamp}\] %{NUMBER:response_status:int}']
```

The resulting grokked log will look like this:

```json
{ 
  "message":"127.0.0.1 198.126.12 [10/Oct/2000:13:55:36 -0700] 200",
  "grokked": {
     "response_status":200,
     "clientip":"198.126.12",
     "timestamp":"10/Oct/2000:13:55:36 -0700"
  }
}
```
