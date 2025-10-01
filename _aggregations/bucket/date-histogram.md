---
layout: default
title: Date histogram
parent: Bucket aggregations
nav_order: 20
redirect_from:
  - /query-dsl/aggregations/bucket/date-histogram/
---

# Date histogram aggregations

The `date_histogram` aggregation groups documents into time-based buckets using [date math]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#date-math). Use it to roll up metrics per hour/day/month, chart traffic trends, or fill time series dashboards.

## Choose the right interval

`date_histogram` supports two styles of intervals:

- **`calendar_interval`** — aligns buckets to calendar boundaries, such as days, months, years. Great when you care about real-world calendar periods. Example values: `"day"`, `"1M"`, `"year"`.
- **`fixed_interval`** — uses exact durations measured in [SI units](https://en.wikipedia.org/wiki/International_System_of_Units). Buckets are always the same length, independent of daylight saving or month length. Example values: `"5m"`, `"12h"`, `"30d"`.

The legacy `interval` field is kept for compatibility but is deprecated. Prefer `calendar_interval` or `fixed_interval`.
{: .note}


## Example: Monthly buckets (calendar-aware)

Count documents per calendar month:

```json
GET opensearch_dashboards_sample_data_logs/_search
{
  "size": 0,
  "aggs": {
    "logs_per_month": {
      "date_histogram": {
        "field": "@timestamp",
        "calendar_interval": "1M"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Uniform hourly buckets (fixed duration)

Retrieve exactly one-hour buckets regardless of DST changes:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "by_hour": {
      "date_histogram": {
        "field": "timestamp",
        "fixed_interval": "1h"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Use a time zone

By default, bucketing occurs in UTC. Set `time_zone` to align bucket boundaries to a specific time zone.

Retrieve daily buckets using `Europe/Dublin`:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "by_day_ie": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "day",
        "time_zone": "Europe/Dublin"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Shift bucket start times with `offset`

Use `offset` to move the bucket boundary forward or backward. For example, to define a "reporting day" that runs 06:00–06:00 instead of midnight–midnight:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "by_day_shifted": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "day",
        "offset": "+6h"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Include empty buckets

Set `min_doc_count` to `0` and provide a range with `extended_bounds` to return empty buckets across the whole time window.

Retrieve last 24 hours, one-hour buckets, include hours with no data:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "last_24h": {
      "date_histogram": {
        "field": "timestamp",
        "fixed_interval": "1h",
        "min_doc_count": 0,
        "extended_bounds": {"min": "now-24h", "max": "now"}
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Limit the range strictly

`hard_bounds` constrains the histogram strictly to the min/max timeframe, no buckets are created outside these limits even if data exists there.

Retrieve 30 minute buckets for period between `2025-09-01T00:00:00Z` and `2025-09-01T06:00:00Z`:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "strict_range": {
      "date_histogram": {
        "field": "timestamp",
        "fixed_interval": "30m",
        "hard_bounds": {"min": "2025-09-01T00:00:00Z", "max": "2025-09-01T06:00:00Z"}
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Return a map of buckets using `keyed`

Set `keyed: true` to return buckets as an object keyed by the formatted date string:.

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "per_month": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "1M",
        "format": "yyyy-MM-dd",
        "keyed": true
      }
    }
  }
}
```
{% include copy-curl.html %}

Example response:

```json
{
  "aggregations": {
    "per_month": {
      "buckets": {
        "2025-01-01": {"key_as_string": "2025-01-01", "key": 1735689600000, "doc_count": 3},
        "2025-02-01": {"key_as_string": "2025-02-01", "key": 1738368000000, "doc_count": 2}
      }
    }
  }
}
```

## Example: Treat missing dates as a fixed value

Use the `missing` parameter to assign documents with no value to a synthetic bucket at the provided date:

```json
GET articles/_search
{
  "size": 0,
  "aggs": {
    "published_per_year": {
      "date_histogram": {
        "field": "publish_date",
        "calendar_interval": "year",
        "missing": "2000-01-01"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Sort buckets

Buckets are returned sorted by `_key` ascending by default. Use `order` to change to descending if necessary.

Retrieve buckets with newest month first:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "recent_months": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "1M",
        "order": {"_key": "desc"}
      }
    }
  }
}
```
{% include copy-curl.html %}

Order by bucket count (highest first):

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "busiest_hours": {
      "date_histogram": {
        "field": "timestamp",
        "fixed_interval": "1h",
        "order": {"_count": "desc"}
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Scripted value source

You can use painless script to manipulate the values in multiple ways. For example, use the following request to emit the bucket value in epoch milliseconds. This behaves the same as field: "timestamp", but shows the correct return type for scripts:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "by_hour_script": {
      "date_histogram": {
        "script": {
          "lang": "painless",
          "source": "return doc['timestamp'].value.toInstant().toEpochMilli();"
        },
        "fixed_interval": "1h"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

`date_histogram` supports the following parameters.

| Parameter | Type | Description |
|:--|:--|:--|
| `field` | string | The date/datetime field to bucket on. One of the following is required: `field` or `script`. |
| `calendar_interval` | string | The calendar-aware interval (e.g., `"day"`, `"1M"`, `"year"`). Only singular calendar units are supported. One of the following is required: `calendar_interval`, `fixed_interval` or legacy `interval`. |
| `fixed_interval` | string | The exact-duration interval (e.g., `"5m"`, `"12h"`, `"30d"`). Not for calendar units like months or quarters. One of the following is required: `calendar_interval`, `fixed_interval` or legacy `interval`. |
| `time_zone` | string | The time zone used for bucketing and formatting. Accepts IANA IDs (`"Europe/Dublin"`) or UTC offsets (`"-07:00"`). |
| `format` | string | The output date format used for `key_as_string` (for example, `"yyyy-MM-dd"`). If omitted, mapping defaults apply. |
| `offset` | string | Shifts bucket boundaries by a positive or negative duration (for example, `"+6h"`, `"-30m"`). Calculated after `time_zone` is applied. |
| `min_doc_count` | integer | The minimum number of docs required to return a bucket (default `1`). Set to `0` to include empty buckets. |
| `extended_bounds` | object | Extends the range of buckets beyond your data: `{"min": "<date>", "max": "<date>"}`. Often used with `min_doc_count: 0`. |
| `hard_bounds` | object | Strictly limits buckets to a range: `{"min": "<date>", "max": "<date>"}`. Buckets outside the range are never created. |
| `missing` | date string | Treat docs missing the field as if they had this date value. |
| `keyed` | boolean | When `true`, returns buckets as an object keyed by the formatted date string. |
| `order` | object | Sort buckets by `_key` or `_count`, ascending or descending. |
| `script` | object | Optional script to compute the value to bucket on. Use with care; scripts add overhead. |

