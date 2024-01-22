---
layout: default
title: Log enrichment with Data Prepper
parent: Common use cases
nav_order: 50
---

# Log enrichment with Data Prepper

You can perform different types of log enrichment with Data Prepper, including:

- Filtering.
- Extracting key-value pairs from strings.
- Mutating events.
- Mutating strings.
- Converting lists to maps.
- Processing incoming timestamps

## Filtering

Use the [Drop events]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/drop-events/) processor to filter out specific log events before sending them to a sink. For example, say you're collecting web request logs and only want to store unsuccessful requests. You create the following pipeline, which drops any requests where the response is less than 400 so that only log events with HTTP status codes 400 and greater remain.

```json
log-pipeline:
  source:
  ...
  processor:
    - grok:
        match:
          log: [ "%{COMMONAPACHELOG_DATATYPED}" ]
    - drop:
        drop_when: "/response < 400"
  sink:
    - opensearch:
        ...
        index: failure_logs
```
{% include copy-curl.html %}

The `drop_when` option specifies which events to drop from the pipeline.

## Extracting key-value pairs from strings

Log data often includes strings of key-value pairs. One common scenario is an HTTP query string. For example, if a web user queries a URL that can be paginated, the HTTP logs might have the following HTTP query string:

```json
page=3&q=my-search-term
```
{% include copy-curl.html %}

To perform analysis using the search terms, you can extract the value of `q` from a query string. The [Key value]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/key-value/) processor provides robust support for extracting keys and values from strings.

The following example combines the `split_string` and `key_value` processors to extract query parameters from an Apache log line:

```json
pipeline
 ...
  processor:
    - grok:
      match:
        message: [ "%{COMMONAPACHELOG_DATATYPED}" ]
    - split_string:
      entries:
        - source: request
          delimiter: "?"
    - key_value:
      source: "/request/1"
      field_split_characters: "&"
      value_split_characters: "="
      destination: query_params
```
{% include copy-curl.html %}

## Mutating events

The different [Mutate event]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/mutate-event/) processors let you rename, copy, add, and delete event entries.

In this example, the first processor sets the value of the `debug` key to `true` if the key already exists in the event. The second processor only sets the `debug` key to `true` if the key doesn't exist in the event, because `overwrite_if_key_exists` is set to `true`.

```json
...
processor:
  - add_entries:
    entries:
    - key: "debug"
      value: true 
...
processor:
  - add_entries:
    entries:
    - key: "debug"
      value: true 
      overwrite_if_key_exists: true
...
```
{% include copy-curl.html %}

You can also use a format string to construct new entries from existing entries. For example, `${date}-${time}` will create a new entry based on the values of the existing entries `date` and `time`.

For example, the following pipeline adds new event entries dynamically from existing events:

```json
processor:
  - add_entries:
    entries:
    - key: "key_three"
      format: "${key_one}-${key_two}
```
{% include copy-curl.html %}

For example, consider the following incoming event:

```json
{
   "key_one": "value_one",
   "key_two": "value_two"
}
```
{% include copy-curl.html %}

The processor transforms it into an event with a new key `key_three`, which combines values of other keys in the original event, as shown in the following example:

```json
{
   "key_one": "value_one",
   "key_two": "value_two",
   "key_three": "value_one-value_two"
}
```
{% include copy-curl.html %}

## Mutating strings

The various [Mutate string]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/mutate-string/) processors offer tools to manipulate strings in incoming data. For example, if you need to split a string into an array, use the `split_string` processor:

```json
...
processor:
  - split_string:
    entries:
    - source: "message"
      delimiter: "&"
...
```
{% include copy-curl.html %}

The processor will transform a string such as `a&b&c` into `["a", "b", "c"]`.

## Converting lists to maps

The [List-to-map]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/list-to-map/) processor, which is one of the Mutate events processors, converts a list of objects in an event to a map.

For example, consider the following processor configuration:

```json
...
processor:
    - list_to_map:
        key: "name"
        source: "A-car-as-list"
        target: "A-car-as-map"
        value_key: "value"
        flatten: true
...
```
{% include copy-curl.html %}

This processor will convert an event that contains a list of objects like this:

```json
{
  "A-car-as-list": [
    {
      "name": "make",
      "value": "tesla"
    },
    {
      "name": "model",
      "value": "model 3"
    },
    {
      "name": "color",
      "value": "white"
    }
  ]
}
```
{% include copy-curl.html %}

into a map:

```json
{
  "A-car-as-map": {
    "make": "tesla",
    "model": "model 3",
    "color": "white"
  }
}
```
{% include copy-curl.html %}

As another example, say you have an incoming event with the following structure:

```json
{
  "mylist" : [
    {
      "somekey" : "a",
      "somevalue" : "val-a1",
      "anothervalue" : "val-a2"
    },
    {
      "somekey" : "b",
      "somevalue" : "val-b1",
      "anothervalue" : "val-b2"
    },
    {
      "somekey" : "b",
      "somevalue" : "val-b3",
      "anothervalue" : "val-b4"
    },
    {
      "somekey" : "c",
      "somevalue" : "val-c1",
      "anothervalue" : "val-c2"
    }
  ]
}
```
{% include copy-curl.html %}

You can define the following options in the processor configuration:

```json
...
processor:            
    - list_to_map:
        key: "somekey"
        source: "mylist"
        target: "myobject"
        value_key: "value"
        flatten: true
...
```
{% include copy-curl.html %}

The processor modifies the event by removing `mylist` and adding the new `myobject` object:

```json
{
  "myobject" : {
    "a" : [
      {
        "somekey" : "a",
        "somevalue" : "val-a1",
        "anothervalue" : "val-a2"
      }  
    ],
    "b" : [
      {
        "somekey" : "b",
        "somevalue" : "val-b1",
        "anothervalue" : "val-b2"
      },
      {
        "somekey" : "b",
        "somevalue" : "val-b3",
        "anothervalue" : "val-b4"
      }
    "c" : [
      {
        "somekey" : "c",
        "somevalue" : "val-c1",
        "anothervalue" : "val-c2"
      }  
    ]
  }
}
```
{% include copy-curl.html %}

In many cases, you might want to flatten the array for each key. In these situations, you must choose only one object to remain. The processor offers the choice of either first or last.

```json
...
processor:
    - list_to_map:
        key: "somekey"
        source: "mylist"
        target: "myobject"
        flatten: true
...
```
{% include copy-curl.html %}

The incoming event structure is then flattened accordingly:

```json
{
  "myobject" : {
    "a" : {
      "somekey" : "a",
      "somevalue" : "val-a1",
      "anothervalue" : "val-a2"
    },
    "b" : {
      "somekey" : "b",
      "somevalue" : "val-b1",
      "anothervalue" : "val-b2"
    }
    "c" : {
      "somekey" : "c",
      "somevalue" : "val-c1",
      "anothervalue" : "val-c2"
    }
  }
}
```
{% include copy-curl.html %}

## Processing incoming timestamps

The [Date]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/date/) processor parses the timestamp key from incoming events by converting it to ISO 8601 format.

```json
...
  processor:          
    - date:
        match:
          - key: timestamp
            patterns: ["dd/MMM/yyyy:HH:mm:ss"] 
        destination: "@timestamp"
        source_timezone: "America/Los_Angeles"
        destination_timezone: "America/Chicago"
        locale: "en_US"
...
```
{% include copy-curl.html %}

If the preceding pipeline processes the following event:

```json
{"timestamp": "10/Feb/2000:13:55:36"}
```
{% include copy-curl.html %}

It converts the event into the following format:

```json
{
  "timestamp":"10/Feb/2000:13:55:36",
  "@timestamp":"2000-02-10T15:55:36.000-06:00"
}
```
{% include copy-curl.html %}

### Generating timestamps

The Date processor can generate timestamps for incoming events if you specify `@timestamp` for the `destination` option.

```json
...
    processor:
    - date:
        from_time_received: true
        destination: "@timestamp"
...
```
{% include copy-curl.html %}

### Deriving punctuation patterns

The [Substitute string]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/substitute-string/) processor (which is one of the Mutate string processors) lets you derive a punctuation pattern from incoming events. In the following example pipeline, the processor will scan incoming Apache log events and derive punctuation patterns from them.

```json
processor:  
    - substitute_string:
        entries:
          - source: "message"
            from: "[a-zA-Z0-9_]+"
            to:""
        - source: "message"
            from: "[ ]+"
            to: "_"  
```
{% include copy-curl.html %}

The following incoming Apache HTTP log will generate a punctuation pattern:

```json
[{"message":"10.10.10.11 - admin [19/Feb/2015:15:50:36 -0500] \"GET /big2.pdf HTTP/1.1\" 200 33973115 0.202 \"-\" \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.111 Safari/537.36\""}]

{"message":"..._-_[//:::_-]_\"_/._/.\"_._\"-\"_\"/._(;_)_/._(,_)_/..._/.\""}
```
{% include copy-curl.html %}

You can count these generated patterns by passing them through the [Aggregate]({{site.url}}{{site.baseurl}}/data-prepper/pipelines/configuration/processors/aggregate/) processor with the `count` action.
