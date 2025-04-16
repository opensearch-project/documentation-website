---
layout: default
title: Format
parent: Mapping parameters
grand_parent: Mapping and field types
nav_order: 50
has_children: false
has_toc: false
---

# Format

The `format` mapping parameter specifies the [built-in date formats]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/#built-in-formats) that a date field can accept during indexing. By defining the expected date formats, you ensure that date values are correctly parsed and stored, facilitating accurate search and aggregation operations.

## Example: Defining a custom date format

Create an `events` index with the `event_date` field configured to a custom `yyyy-MM-dd HH:mm:ss` date format:

```json
PUT events
{
  "mappings": {
    "properties": {
      "event_date": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document using the specified format for the `event_date` field:

```json
PUT events/_doc/1
{
  "event_name": "Conference",
  "event_date": "2025-03-26 15:30:00"
}
```
{% include copy-curl.html %}

## Example: Using multiple date formats

Create an index containing a `log_timestamp` field, which accepts both the custom `yyyy-MM-dd HH:mm:ss` date format and the `epoch_millis` format:

```json
PUT logs
{
  "mappings": {
    "properties": {
      "log_timestamp": {
        "type": "date",
        "format": "yyyy-MM-dd HH:mm:ss||epoch_millis"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the first document using the custom format:

```json
PUT logs/_doc/1
{
  "message": "System rebooted",
  "log_timestamp": "2025-03-26 08:45:00"
}
```
{% include copy-curl.html %}

Index the second document using the millisecond format:

```json
PUT logs/_doc/2
{
  "message": "System updated",
  "log_timestamp": 1711442700000
}
```
{% include copy-curl.html %}

## Built-in date formats

For a comprehensive list of built-in date formats, see [Built-in formats]({{site.url}}{{site.baseurl}}/field-types/supported-field-types/date/#built-in-formats).