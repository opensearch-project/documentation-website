---
layout: default
title: Date range
parent: Bucket aggregations
nav_order: 30
redirect_from:
  - /query-dsl/aggregations/bucket/date-range/
---

# Date range aggregation

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
| `ranges`| Yes | The non-empty array of range objects. A range that specifies neither `from` nor `to` matches every value. |
| `ranges[].from` | No | Lower inclusive bound. |
| `ranges[].to` | No | Upper exclusive bound. |
| `ranges[].key`| No | The label for the bucket.|
| `format`| No | The date format used to display the bucket boundaries in the `from_as_string` and `to_as_string` response fields and to parse date strings in `from` and `to`, for example, `yyyy-MM-dd`. |
| `time_zone` | No | The IANA time zone or UTC offset used to evaluate date math, rounding, and date strings in `from` and `to` that don't specify an offset, for example, `Europe/Dublin` or `+01:00`. With `Europe/Dublin`, `"from": "2025-10-01"` is evaluated as `2025-10-01T00:00:00+01:00`. |
| `keyed` | No | If `true`, returns the buckets as an object instead of an array. Each bucket is keyed by its `key` value, which is either the custom `key` that you specify for the range or a generated key, such as `*-2025-09-20T00:00:00.000Z`. Default is `false`. |
| `missing` | No | The value to substitute for documents in which the field is missing. |


### Accepted values for `from` and `to`

The following values of `from` and `to` are accepted:

- ISO 8601 strings: `"2025-10-01T00:00:00Z"`, `"2025-10-01"`
- Date math: `"now-7d/d"`, `"now+1M/M"`, `"2025-09-01||/M"`
- Epoch milliseconds: `1756684800000`

If components are omitted in a date string, the missing parts are filled with defaults. For example, `"2025-10"` is treated as the start of October 2025.
{: .note}

## Example setup

The examples on this page use a `my-index` index. Create the index and map the `event_time` field to accept epoch milliseconds:

```json
PUT my-index
{
  "mappings": {
    "properties": {
      "@timestamp": { "type": "date" },
      "event_time": { "type": "date", "format": "epoch_millis" }
    }
  }
}
```
{% include copy-curl.html %}

Index the following documents. Document 6 has no `@timestamp` value:

```json
POST my-index/_bulk?refresh
{ "index": { "_id": "1" } }
{ "@timestamp": "2025-09-10T12:00:00Z", "event_time": 1697400000000 }
{ "index": { "_id": "2" } }
{ "@timestamp": "2025-09-18T09:00:00Z", "event_time": 1697500000000 }
{ "index": { "_id": "3" } }
{ "@timestamp": "2025-09-22T15:00:00Z", "event_time": 1698000000000 }
{ "index": { "_id": "4" } }
{ "@timestamp": "2025-09-26T08:00:00Z" }
{ "index": { "_id": "5" } }
{ "@timestamp": "2025-10-01T07:30:00Z" }
{ "index": { "_id": "6" } }
{ "note": "no timestamp" }
```
{% include copy-curl.html %}

So that the responses on this page don't depend on when you run the examples, the date math in the examples is calculated from the fixed date `2025-10-01` using the `||` separator. To calculate the ranges from the current time, replace `2025-10-01||` with `now`. For example, use `now-7d/d` instead of `2025-10-01||-7d/d`.

## Example: Three sliding windows

The following example produces three buckets (the last 7 days, the previous 7 days, and older), using date math and the `yyyy-MM-dd` output `format`:

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
          {
            "from": "2025-10-01||-7d/d",
            "to": "2025-10-01||+1d/d",
            "key": "last_7d"
          },
          {
            "from": "2025-10-01||-14d/d",
            "to": "2025-10-01||-7d/d",
            "key": "prev_7d"
          },
          {
            "to": "2025-10-01||-14d/d",
            "key": "older"
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the three buckets:

```json
{
  "aggregations": {
    "by_range": {
      "buckets": [
        {
          "key": "older",
          "to": 1758067200000.0,
          "to_as_string": "2025-09-17",
          "doc_count": 1
        },
        {
          "key": "prev_7d",
          "from": 1758067200000.0,
          "from_as_string": "2025-09-17",
          "to": 1758672000000.0,
          "to_as_string": "2025-09-24",
          "doc_count": 2
        },
        {
          "key": "last_7d",
          "from": 1758672000000.0,
          "from_as_string": "2025-09-24",
          "to": 1759363200000.0,
          "to_as_string": "2025-10-02",
          "doc_count": 2
        }
      ]
    }
  }
}
```

## Example: Bucket for the last 10 days with a custom string format

The following request creates a single bucket that covers the 10 days before October 1, 2025, and the whole day of October 1. The bucket starts at the beginning of the day 10 days earlier (`-10d/d`) and ends at the beginning of the following day (`+1d/d`, exclusive).

The `format` determines how the bucket boundaries are displayed in the `from_as_string` and `to_as_string` response fields. It is also used to parse date strings in `from` and `to`, so the date in each boundary must use the same format. In this example, the format is `yyyy-MM`, so the boundaries start with `2025-10`, which is parsed as October 1, 2025:

```json
GET my-index/_search
{
  "size": 0,
  "aggs": {
    "last_10_days": {
      "date_range": {
        "field": "@timestamp",
        "format": "yyyy-MM",
        "ranges": [
          {
            "from": "2025-10||-10d/d",
            "to": "2025-10||+1d/d"
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains documents 3, 4, and 5. The `from_as_string` and `to_as_string` fields use the `yyyy-MM` format:

```json
{
  "aggregations": {
    "last_10_days": {
      "buckets": [
        {
          "key": "2025-09-2025-10",
          "from": 1758412800000.0,
          "from_as_string": "2025-09",
          "to": 1759363200000.0,
          "to_as_string": "2025-10",
          "doc_count": 3
        }
      ]
    }
  }
}
```

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
          {
            "from": "2025-10-01||/d",
            "to": "2025-10-01||+1d/d",
            "key": "today"
          },
          {
            "to": "2025-10-01||/d",
            "key": "before_today"
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains a `today` bucket and a `before_today` bucket:

```json
{
  "aggregations": {
    "keyed_ranges": {
      "buckets": {
        "before_today": {
          "to": 1759276800000.0,
          "to_as_string": "2025-10-01T00:00:00.000Z",
          "doc_count": 4
        },
        "today": {
          "from": 1759276800000.0,
          "from_as_string": "2025-10-01T00:00:00.000Z",
          "to": 1759363200000.0,
          "to_as_string": "2025-10-02T00:00:00.000Z",
          "doc_count": 1
        }
      }
    }
  }
}
```

## Example: Epoch milliseconds with a time zone

When the field value is provided in epoch milliseconds, you can still provide `from` and `to` parameters as numbers. In the following request, `time_zone` affects date math and boundary evaluation:

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
          {
            "from": "1697328000000",
            "to": "1697932800000",
            "key": "week_sample"
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The `time_zone` is applied to the boundaries even though they are epoch milliseconds. In October 2023, Dublin was one hour ahead of UTC, so both boundaries in the response are one hour (`3600000` milliseconds) earlier than the values in the request:

```json
{
  "aggregations": {
    "local_ranges": {
      "buckets": [
        {
          "key": "week_sample",
          "from": 1697324400000.0,
          "from_as_string": "1697324400000",
          "to": 1697929200000.0,
          "to_as_string": "1697929200000",
          "doc_count": 2
        }
      ]
    }
  }
}
```

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
          {
            "to": "2000-01-01",
            "key": "undated_or_old"
          },
          {
            "from": "2000-01-01",
            "key": "dated_recent"
          }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

Document 6, which has no `@timestamp` value, is counted in the `undated_or_old` bucket:

```json
{
  "aggregations": {
    "dated_or_undated": {
      "buckets": [
        {
          "key": "undated_or_old",
          "to": 946684800000.0,
          "to_as_string": "2000-01-01T00:00:00.000Z",
          "doc_count": 1
        },
        {
          "key": "dated_recent",
          "from": 946684800000.0,
          "from_as_string": "2000-01-01T00:00:00.000Z",
          "doc_count": 5
        }
      ]
    }
  }
}
```
