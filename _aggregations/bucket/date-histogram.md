---
layout: default
title: Date histogram
parent: Bucket aggregations
nav_order: 20
redirect_from:
  - /query-dsl/aggregations/bucket/date-histogram/
---

# Date histogram aggregation

The `date_histogram` aggregation groups documents in a [date]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/) field into time-based buckets. Use it to roll up metrics per hour, day, or month, chart traffic trends, or fill time series dashboards.

## Choosing an interval

The `date_histogram` aggregation supports two interval styles:

- The `calendar_interval` parameter aligns buckets to calendar boundaries, such as days, months, or years. Use it when focusing on real-world calendar periods, for example, `day`, `1M`, or `year`.
- The `fixed_interval` parameter uses exact durations measured in [SI units](https://en.wikipedia.org/wiki/International_System_of_Units). Buckets are always the same length, independent of daylight saving time or month length, for example, `5m`, `12h`, or `30d`.

### Calendar intervals

Calendar intervals account for months of different lengths and for days that are shorter or longer because of daylight saving time changes. Each interval in the following table has two equivalent names. A calendar interval can't be a multiple. For example, `2d` returns an error. For a multi-day bucket, use `fixed_interval`.

| Interval | Description |
| :--- | :--- |
| `minute`, `1m` | Starts at 00 seconds of each minute. |
| `hour`, `1h` | Starts at 00 minutes and 00 seconds of each hour. |
| `day`, `1d` | Starts at the beginning of each day, usually midnight, in the specified time zone. |
| `week`, `1w` | Starts on Monday of each week. |
| `month`, `1M` | Starts on the first day of each month. |
| `quarter`, `1q` | Starts on the first day of each quarter: January 1, April 1, July 1, or October 1. |
| `year`, `1y` | Starts on January 1 of each year. |

### Fixed intervals

Fixed intervals are always the same number of milliseconds, so you can specify any multiple of a unit, such as `90m` or `12h`. Because the length of a month or quarter varies, these units are not accepted as fixed intervals. Fractional values, such as `2.5d`, are not supported. To specify a fractional interval, use a smaller unit, for example, `60h`. For the abbreviations you can use in intervals, see [Units]({{site.url}}{{site.baseurl}}/api-reference/units/).

The following table lists the accepted units for fixed intervals.

| Unit | Description |
| :--- | :--- |
| `ms` | Milliseconds. |
| `s` | Seconds. Each second is 1,000 milliseconds. |
| `m` | Minutes. Each minute is 60 seconds. |
| `h` | Hours. Each hour is 60 minutes. |
| `d` | Days. Each day is exactly 24 hours, regardless of daylight saving time changes. |

Fixed-interval buckets are aligned to the start of the Unix epoch, not to the start of the day. For example, with a `fixed_interval` of `90m`, buckets start at times such as 07:30 and 09:00 UTC. To shift the bucket start times, use the [`offset`](#example-shift-bucket-start-times-using-an-offset) parameter.

### Bucket keys

Each bucket contains a `key`, which is the bucket's start time as the number of milliseconds since the Unix epoch, and a `key_as_string`, which is the same time formatted as a date string. The `key_as_string` uses the date format specified in the `format` parameter. If you don't specify `format`, OpenSearch uses the date format from the field mapping.

OpenSearch places each document in a bucket by rounding its date value down to the start of the interval. If you specify a `time_zone`, OpenSearch converts the value to local time, rounds it down, and converts the result back to UTC. The `key` is always in UTC milliseconds, while the `key_as_string` is shown in the requested time zone.

The `date_histogram` aggregation also works on [`date_range`]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/range/) fields. A document is counted in every bucket that its range overlaps. For example, a booking from March 31 to April 2 is counted in the daily buckets for March 31, April 1, and April 2.

The legacy `interval` field is kept for compatibility but is deprecated. Use `calendar_interval` or `fixed_interval` instead.
{: .note}


## Parameters

The `date_histogram` aggregation supports the following parameters.

| Parameter | Required | Type | Description |
|:--|:--|:--|:--|
| `field` | One of the following is required: `field` or `script`. | String | The date field to bucket on. |
| `calendar_interval` | One of the following is required: `calendar_interval`, `fixed_interval`, or legacy `interval`. | String | The calendar-aware interval (for example, `day`, `1M`, `year`). Only singular calendar units are supported. |
| `fixed_interval` | One of the following is required: `calendar_interval`, `fixed_interval`, or legacy `interval`. | String | The fixed interval, for example, `5m`, `12h`, `30d`. Not for calendar units like months or quarters. |
| `time_zone` | Optional | String | The time zone used for bucketing and formatting. Accepts a time zone, such as `Europe/Dublin`, or UTC offsets, such as `-07:00`. |
| `format` | Optional | String | The output date format used for `key_as_string`, for example, `yyyy-MM-dd`. If omitted, mapping defaults apply. |
| `offset` | Optional | String | Shifts bucket boundaries by a positive or negative interval, for example, `+8h`, `-30m`. Calculated after `time_zone` is applied. |
| `min_doc_count` | Optional | Integer | The minimum number of documents required in order to return a bucket. Default is `0`, which includes empty buckets between the first and last documents. To include empty buckets beyond the range of the data, use `extended_bounds`. |
| `extended_bounds` | Optional | Object | Extends the range of buckets beyond your data: `{"min": "<date>", "max": "<date>"}`. |
| `hard_bounds` | Optional | Object | Strictly limits buckets to a range: `{"min": "<date>", "max": "<date>"}`. Buckets outside the range are never created. |
| `missing` | Optional | Date string | Treats documents missing the field as if they had this date value. |
| `keyed` | Optional | Boolean | When `true`, returns buckets as an object keyed by the formatted date string. |
| `order` | Optional | Object | Sorts buckets by `_key` or `_count`, ascending or descending. |
| `script` | One of the following is required: `field` or `script`. | Object | A script that generates the date value for each document or, when used with `field`, modifies each field value. Scripts run on every matching document, so they add overhead. For more information, see [Example: Use a script](#example-use-a-script). |

## Example setup

The examples on this page use a `my-logs` index containing timestamps around the start of daylight saving time in Europe on March 30, 2025. Create the index:

```json
PUT my-logs
{
  "mappings": {
    "properties": {
      "timestamp": { "type": "date" }
    }
  }
}
```
{% include copy-curl.html %}

Index the following documents:

```json
POST my-logs/_bulk?refresh
{ "index": { "_id": "1" } }
{ "timestamp": "2025-03-31T08:10:00Z" }
{ "index": { "_id": "2" } }
{ "timestamp": "2025-03-31T08:40:00Z" }
{ "index": { "_id": "3" } }
{ "timestamp": "2025-03-31T10:05:00Z" }
{ "index": { "_id": "4" } }
{ "timestamp": "2025-03-31T23:30:00Z" }
{ "index": { "_id": "5" } }
{ "timestamp": "2025-04-01T05:15:00Z" }
{ "index": { "_id": "6" } }
{ "timestamp": "2025-04-01T14:20:00Z" }
{ "index": { "_id": "7" } }
{ "timestamp": "2025-04-02T09:00:00Z" }
```
{% include copy-curl.html %}

## Example: Monthly buckets (calendar interval)

The following request counts documents per calendar month:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "logs_per_month": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "1M"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains one bucket for March and one for April:

```json
{
  "aggregations": {
    "logs_per_month": {
      "buckets": [
        {
          "key_as_string": "2025-03-01T00:00:00.000Z",
          "key": 1740787200000,
          "doc_count": 4
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 3
        }
      ]
    }
  }
}
```

## Example: Uniform hourly buckets (fixed interval)

The following request retrieves buckets with a fixed interval of exactly 1 hour, regardless of daylight saving time changes:

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

The response contains 50 hourly buckets, from `2025-03-31T08:00:00.000Z` through `2025-04-02T09:00:00.000Z`. Because `min_doc_count` defaults to `0`, the response includes empty buckets for the hours between the first and last documents.

## Example: Use a time zone

By default, bucketing occurs in UTC. Set `time_zone` to align bucket boundaries to a specific time zone.

The following request retrieves daily buckets using `Europe/Dublin`:

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

After March 30, 2025, Dublin is one hour ahead of UTC, so document 4 (`2025-03-31T23:30:00Z`) falls on April 1 in Dublin time. In UTC, the three daily buckets contain 4, 2, and 1 documents. In Dublin time, they contain 3, 3, and 1 documents. Each `key_as_string` shows midnight in Dublin (`+01:00`), while each `key` is the same moment in UTC milliseconds:

```json
{
  "aggregations": {
    "by_day_ie": {
      "buckets": [
        {
          "key_as_string": "2025-03-31T00:00:00.000+01:00",
          "key": 1743375600000,
          "doc_count": 3
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000+01:00",
          "key": 1743462000000,
          "doc_count": 3
        },
        {
          "key_as_string": "2025-04-02T00:00:00.000+01:00",
          "key": 1743548400000,
          "doc_count": 1
        }
      ]
    }
  }
}
```

>   In time zones that observe daylight saving time, buckets that include a time change can be shorter or longer than the requested interval. For example, in the `Europe/Dublin` time zone:
>
>   - The daily bucket for March 30, 2025, when clocks moved forward, covers only 23 hours, and the daily bucket for October 26, 2025, when clocks moved back, covers 25 hours.
>   - Hourly buckets are not lengthened when clocks move back. Instead, the repeated hour appears as two separate buckets with the same local time and different offsets, such as `2025-10-26T01:00:00.000+01:00` and `2025-10-26T01:00:00.000Z`.
>   - If a bucket boundary falls on a local time that doesn't exist because clocks moved forward, the boundary moves to the next valid time. For example, with an `offset` of `+1h`, the March 30 bucket starts at 02:00 instead of 01:00.
{: .warning}

Test your aggregations around time changes to make sure that the buckets match your expectations, and keep all servers and clients synchronized with a reliable time source, such as NTP.
{: .tip}

## Example: Shift bucket start times using an offset

Use the `offset` parameter to move the bucket boundary forward or backward, for example, to define a "reporting day" that runs 08:00–08:00 instead of midnight–midnight:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "by_day_shifted": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "day",
        "offset": "+8h"
      }
    }
  }
}
```
{% include copy-curl.html %}

Documents 1--5 were recorded between 08:00 on March 31 and 08:00 on April 1, so they are all counted in the reporting day that starts on March 31:

```json
{
  "aggregations": {
    "by_day_shifted": {
      "buckets": [
        {
          "key_as_string": "2025-03-31T08:00:00.000Z",
          "key": 1743408000000,
          "doc_count": 5
        },
        {
          "key_as_string": "2025-04-01T08:00:00.000Z",
          "key": 1743494400000,
          "doc_count": 1
        },
        {
          "key_as_string": "2025-04-02T08:00:00.000Z",
          "key": 1743580800000,
          "doc_count": 1
        }
      ]
    }
  }
}
```

## Example: Include empty buckets in a fixed time window

By default, `min_doc_count` is `0`, so the histogram includes empty buckets between the first and last matching documents. To return empty buckets for an entire time window, including the beginning and end of the window where there are no documents, provide the window in `extended_bounds`. The `extended_bounds` parameter only adds buckets and does not filter documents, so limit the documents to the same window using a `range` query.

The following request retrieves hourly buckets for 06:00–12:00 on March 31, 2025, including hours with no data:

```json
GET my-logs/_search
{
  "size": 0,
  "query": {
    "range": {
      "timestamp": {
        "gte": "2025-03-31T06:00:00Z",
        "lt": "2025-03-31T12:00:00Z"
      }
    }
  },
  "aggs": {
    "morning": {
      "date_histogram": {
        "field": "timestamp",
        "fixed_interval": "1h",
        "extended_bounds": {
          "min": "2025-03-31T06:00:00Z",
          "max": "2025-03-31T11:00:00Z"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains a bucket for every hour in the window, including the empty buckets at 06:00, 07:00, 09:00, and 11:00:

```json
{
  "aggregations": {
    "morning": {
      "buckets": [
        {
          "key_as_string": "2025-03-31T06:00:00.000Z",
          "key": 1743400800000,
          "doc_count": 0
        },
        {
          "key_as_string": "2025-03-31T07:00:00.000Z",
          "key": 1743404400000,
          "doc_count": 0
        },
        {
          "key_as_string": "2025-03-31T08:00:00.000Z",
          "key": 1743408000000,
          "doc_count": 2
        },
        {
          "key_as_string": "2025-03-31T09:00:00.000Z",
          "key": 1743411600000,
          "doc_count": 0
        },
        {
          "key_as_string": "2025-03-31T10:00:00.000Z",
          "key": 1743415200000,
          "doc_count": 1
        },
        {
          "key_as_string": "2025-03-31T11:00:00.000Z",
          "key": 1743418800000,
          "doc_count": 0
        }
      ]
    }
  }
}
```

## Example: Strictly limit the range

`hard_bounds` strictly limits the histogram to the specified minimum and maximum time range. No buckets are created outside these bounds, even if data falls beyond them.

The following request retrieves buckets with a fixed interval of 30 minutes for the period between `2025-03-31T08:00:00Z` and `2025-03-31T11:00:00Z`:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "strict_range": {
      "date_histogram": {
        "field": "timestamp",
        "fixed_interval": "30m",
        "hard_bounds": {
          "min": "2025-03-31T08:00:00Z",
          "max": "2025-03-31T11:00:00Z"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains buckets only within the bounds. Documents outside the bounds, such as document 4, are not counted:

```json
{
  "aggregations": {
    "strict_range": {
      "buckets": [
        {
          "key_as_string": "2025-03-31T08:00:00.000Z",
          "key": 1743408000000,
          "doc_count": 1
        },
        {
          "key_as_string": "2025-03-31T08:30:00.000Z",
          "key": 1743409800000,
          "doc_count": 1
        },
        {
          "key_as_string": "2025-03-31T09:00:00.000Z",
          "key": 1743411600000,
          "doc_count": 0
        },
        {
          "key_as_string": "2025-03-31T09:30:00.000Z",
          "key": 1743413400000,
          "doc_count": 0
        },
        {
          "key_as_string": "2025-03-31T10:00:00.000Z",
          "key": 1743415200000,
          "doc_count": 1
        }
      ]
    }
  }
}
```

## Example: Return a map of buckets

Set `keyed: true` to return buckets as an object keyed by the formatted date string:

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

The response contains an object keyed by month:

```json
{
  "aggregations": {
    "per_month": {
      "buckets": {
        "2025-03-01": {
          "key_as_string": "2025-03-01",
          "key": 1740787200000,
          "doc_count": 4
        },
        "2025-04-01": {
          "key_as_string": "2025-04-01",
          "key": 1743465600000,
          "doc_count": 3
        }
      }
    }
  }
}
```

## Example: Treat missing dates as a fixed value

Use the `missing` parameter to assign documents with no value to a bucket at the provided date. These documents are counted in the same bucket as documents that have that date. The following example uses a `news-articles` index in which one article has no `published_on`. Create the index and add the documents:

```json
PUT news-articles
{
  "mappings": {
    "properties": {
      "title": { "type": "text" },
      "published_on": { "type": "date" }
    }
  }
}
```
{% include copy-curl.html %}

```json
POST news-articles/_bulk?refresh
{ "index": { "_id": "1" } }
{ "title": "Cluster sizing basics", "published_on": "2023-06-12" }
{ "index": { "_id": "2" } }
{ "title": "Tuning shard allocation", "published_on": "2024-02-20" }
{ "index": { "_id": "3" } }
{ "title": "Snapshot strategies", "published_on": "2024-09-05" }
{ "index": { "_id": "4" } }
{ "title": "Draft: Upgrading to OpenSearch 3" }
```
{% include copy-curl.html %}

The following request counts articles per year and places the article without a `published_on` value in the year 2022:

```json
GET news-articles/_search
{
  "size": 0,
  "aggs": {
    "published_per_year": {
      "date_histogram": {
        "field": "published_on",
        "calendar_interval": "year",
        "missing": "2022-01-01"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains a bucket for 2022 with the undated article:

```json
{
  "aggregations": {
    "published_per_year": {
      "buckets": [
        {
          "key_as_string": "2022-01-01T00:00:00.000Z",
          "key": 1640995200000,
          "doc_count": 1
        },
        {
          "key_as_string": "2023-01-01T00:00:00.000Z",
          "key": 1672531200000,
          "doc_count": 1
        },
        {
          "key_as_string": "2024-01-01T00:00:00.000Z",
          "key": 1704067200000,
          "doc_count": 2
        }
      ]
    }
  }
}
```

## Example: Sort buckets

By default, buckets are returned sorted by `_key` in ascending order. Use the `order` parameter to change to descending if necessary. The `order` parameter also accepts subaggregation paths in the same way as the `terms` aggregation. For more information, see [Sort order]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms/#sort-order).

The following request retrieves buckets with the most recent month first:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "recent_months": {
      "date_histogram": {
        "field": "timestamp",
        "calendar_interval": "1M",
        "order": {
          "_key": "desc"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The following request orders hourly buckets by document count, highest first. It sets `min_doc_count` to `1` so that the empty hours are not included:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "busiest_hours": {
      "date_histogram": {
        "field": "timestamp",
        "fixed_interval": "1h",
        "min_doc_count": 1,
        "order": {
          "_count": "desc"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The first bucket in the response is `2025-03-31T08:00:00.000Z`, which contains two documents.

## Example: Use a script

You can use a Painless script to generate or modify the date value used for bucketing. For more information, see [Painless scripting language]({{site.url}}{{site.baseurl}}/scripting/painless/). Scripts run for every matching document, so they add overhead.

The `date_histogram` aggregation supports two kinds of scripts:

- A document-level script, specified in `script` without `field`, calculates the date value from the document. The script can return a date object or a number of epoch milliseconds.
- A value script, specified in `script` together with `field`, modifies each value of the field. The field value is available to the script as `_value`, in epoch milliseconds.

The following request uses a document-level script that returns the `timestamp` value, which produces the same buckets as specifying `"field": "timestamp"`:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "by_hour_script": {
      "date_histogram": {
        "script": {
          "lang": "painless",
          "source": "doc['timestamp'].value"
        },
        "fixed_interval": "1h"
      }
    }
  }
}
```
{% include copy-curl.html %}

The following request uses a value script to shift each `timestamp` value forward by one hour (3,600,000 milliseconds) before bucketing. As a result, document 4 (`2025-03-31T23:30:00Z`) is counted on April 1:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "by_day_plus_one_hour": {
      "date_histogram": {
        "field": "timestamp",
        "script": {
          "lang": "painless",
          "source": "_value + 3600000"
        },
        "calendar_interval": "day"
      }
    }
  }
}
```
{% include copy-curl.html %}

The daily buckets contain 3, 3, and 1 documents, compared to 4, 2, and 1 without the script:

```json
{
  "aggregations": {
    "by_day_plus_one_hour": {
      "buckets": [
        {
          "key_as_string": "2025-03-31T00:00:00.000Z",
          "key": 1743379200000,
          "doc_count": 3
        },
        {
          "key_as_string": "2025-04-01T00:00:00.000Z",
          "key": 1743465600000,
          "doc_count": 3
        },
        {
          "key_as_string": "2025-04-02T00:00:00.000Z",
          "key": 1743552000000,
          "doc_count": 1
        }
      ]
    }
  }
}
```

## Example: Aggregate by day of the week

To count documents by day of the week, regardless of the date, use a `terms` aggregation with a script that returns the day of the week:

```json
GET my-logs/_search
{
  "size": 0,
  "aggs": {
    "day_of_week": {
      "terms": {
        "script": {
          "lang": "painless",
          "source": "doc['timestamp'].value.dayOfWeekEnum.value"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The bucket keys are day numbers, where `1` is Monday and `7` is Sunday. The response shows four documents on Monday (March 31), two on Tuesday, and one on Wednesday:

```json
{
  "aggregations": {
    "day_of_week": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "1",
          "doc_count": 4
        },
        {
          "key": "2",
          "doc_count": 2
        },
        {
          "key": "3",
          "doc_count": 1
        }
      ]
    }
  }
}
```
