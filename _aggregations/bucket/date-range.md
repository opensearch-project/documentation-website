---
layout: default
title: Date range
parent: Bucket aggregations
nav_order: 30
redirect_from:
  - /query-dsl/aggregations/bucket/date-range/
---

# Date range aggregations

Use the `date_range` aggregation to group documents into buckets defined by date boundaries. The `date_range` aggregation behaves like the numeric `range` aggregation but accepts date math in addition to [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) dates and epoch milliseconds.

Note the following details:

- `from` is inclusive, `to` is exclusive.
- To create an open-ended bucket, omit `from` or `to`.
- Date math supports rounding: for example, `now-7d/d` (start of the day, 7 days ago).

## Parameters

The following is a table of parameters accepted by `date_range` aggregations.

| Parameter | Required | Description |
| --- | --- | --- |
| `field` | Yes | The date field to aggregate on. |
| `ranges`| Yes | The non-empty array of range objects. Each object must specify at least one boundary, `from` and/or `to`. |
| `ranges[].from` | One of `from` or `to` is required. | Lower inclusive bound. |
| `ranges[].to` | One of `from` or `to` is required. | Upper exclusive bound. |
| `ranges[].key`| No | The label for the bucket.|
| `format`| No | Controls the `*_as_string` fields in the response, for example, `yyyy-MM-dd`. |
| `time_zone` | No | The IANA zone or UTC offset used when evaluating date math or rounding, for example,`Europe/Dublin`, `+01:00`. |
| `keyed` | No | If `true`, returns an object with the key `key` instead of an array. |
| `missing` | No | The value to substitute for documents in which the field is missing. |


### Accepted values for `from` and `to`

The following values of `from` and `to` are accepted:

- ISO 8601 strings: `"2025-10-01T00:00:00Z"`, `"2025-10-01"`
- Date math: `"now-7d/d"`, `"now+1M/M"`, `"2025-09-01||/M"`
- Epoch milliseconds: `1756684800000`

If components are omitted in a date string, the missing parts are filled with defaults. For example, `"2025-10"` is treated as the start of October 2025.
{: .note}

## Example: Three sliding windows

The following example produces three buckets (last 7 days, previous 7 days, and older), using date math and `yyyy-MM-dd` output `format`:

```json
GET my-index/_search
{
  "size": 0,
  "aggs": {
    "by_range": {
      "date_range": {
        "field": "@timestamp",
        "format": "yyyy-MM-dd",
        "ranges": [
          { "from": "now-7d/d",  "to": "now+1d/d", "key": "last_7d" },
          { "from": "now-14d/d", "to": "now-7d/d", "key": "prev_7d" },
          { "to": "now-14d/d",                      "key": "older"  }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

Example response:

```json
"aggregations": {
    "by_range": {
      "buckets": [
        {
          "key": "older",
          "to": 1758067200000,
          "to_as_string": "2025-09-17",
          "doc_count": 1
        },
        {
          "key": "prev_7d",
          "from": 1758067200000,
          "from_as_string": "2025-09-17",
          "to": 1758672000000,
          "to_as_string": "2025-09-24",
          "doc_count": 2
        },
        {
          "key": "last_7d",
          "from": 1758672000000,
          "from_as_string": "2025-09-24",
          "to": 1759363200000,
          "to_as_string": "2025-10-02",
          "doc_count": 2
        }
      ]
    }
  }
```

## Example: Bucket for the last 10 days with a custom string format

The following request creates a single bucket that covers the last 10 calendar days. It starts at the beginning of the day 10 days ago (`now-10d/d`) and ends at the beginning of tomorrow (`now+1d/d`, exclusive). The `format` only affects the `*_as_string` fields in the response---not document matching:

```json
GET my-index/_search
{
  "size": 0,
  "aggs": {
    "last_10_days": {
      "date_range": {
        "field": "@timestamp",
        "format": "yyyy-MM",
        "ranges": [ { "from": "now-10d/d", "to": "now+1d/d" } ]
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Keyed response and custom keys

The following request returns an object organized by your labels for easier downstream processing:

```json
GET my-index/_search
{
  "size": 0,
  "aggs": {
    "keyed_ranges": {
      "date_range": {
        "field": "@timestamp",
        "keyed": true,
        "ranges": [
          { "from": "now-1d/d", "to": "now+1d/d", "key": "today" },
          { "to": "now-1d/d", "key": "before_today" }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

Example response:

```json
"aggregations": {
    "keyed_ranges": {
      "buckets": {
        "before_today": {
          "to": 1759190400000,
          "to_as_string": "2025-09-30T00:00:00.000Z",
          "doc_count": 4
        },
        "today": {
          "from": 1759190400000,
          "from_as_string": "2025-09-30T00:00:00.000Z",
          "to": 1759363200000,
          "to_as_string": "2025-10-02T00:00:00.000Z",
          "doc_count": 1
        }
      }
    }
  }
```

## Example: Epoch milliseconds with a time zone

When the field value is provided in epoch milliseconds, you can still provide `from` and `to` parameters as numbers. For example, in the following request, `time_zone` affects date math and boundary evaluation:

```json
GET my-index/_search
{
  "size": 0,
  "aggs": {
    "local_ranges": {
      "date_range": {
        "field": "event_time",
        "time_zone": "Europe/Dublin",
        "format": "epoch_millis",
        "ranges": [
          { "from": "1697328000000", "to": "1697932800000", "key": "week_sample" }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Handling missing dates

Use `missing` to route documents without a value into a bucket by substituting a default:

```json
GET my-index/_search
{
  "size": 0,
  "aggs": {
    "dated_or_undated": {
      "date_range": {
        "field": "@timestamp",
        "missing": "1970-01-01",
        "ranges": [
          { "to": "2000-01-01", "key": "undated_or_old" },
          { "from": "2000-01-01", "key": "dated_recent" }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}
