---
layout: default
title: Auto-interval date histogram
parent: Bucket aggregations
nav_order: 12
canonical_url: https://docs.opensearch.org/latest/aggregations/bucket/auto-interval-date-histogram/
---

# Auto-interval date histogram

Similar to the [date histogram aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/date-histogram/), in which you must specify an interval, the `auto_date_histogram` is a multi-bucket aggregation that automatically creates date histogram buckets based on the number of buckets you provide and the time range of your data. The actual number of buckets returned is always less than or equal to the number of buckets you specify. This aggregation is particularly useful when you are working with time-series data and want to visualize or analyze data over different time intervals without manually specifying the interval size.

## Intervals

The bucket interval is chosen based on the collected data to ensure that the number of returned buckets is less than or equal to the requested number. 

The following table lists the possible returned intervals for each time unit.

| Unit   | Intervals                |
| :--- | :---|
| Seconds| Multiples of 1, 5, 10, and 30                 |
| Minutes| Multiples of 1, 5, 10, and 30                 |
| Hours  | Multiples of 1, 3, and 12                     |
| Days   | Multiples of 1 and 7                         |
| Months | Multiples of 1 and 3                         |
| Years  | Multiples of 1, 5, 10, 20, 50, and 100        |

If an aggregation returns too many buckets (for example, daily buckets), OpenSearch will automatically reduce the number of buckets to ensure a manageable result. Instead of returning the exact number of requested daily buckets, it will reduce them by a factor of about 1/7. For example, if you ask for 70 buckets but the data contains too many daily intervals, OpenSearch might return only 10 buckets, grouping the data into larger intervals (such as weeks) to avoid an overwhelming number of results. This helps optimize the aggregation and prevent excessive detail when too much data is available.

## Example

In the following example, you'll search an index containing blog posts. 

First, create a mapping for this index and specify the `date_posted` field as the `date` type:

```json
PUT blogs
{
  "mappings" : {
    "properties" :  {
      "date_posted" : {
        "type" : "date",
        "format" : "yyyy-MM-dd"
      }
    }
  }
}
```
{% include copy-curl.html %}

Next, index the following documents into the `blogs` index:

```json
PUT blogs/_doc/1
{
  "name": "Semantic search in OpenSearch",
  "date_posted": "2022-04-17"
}
```
{% include copy-curl.html %}

```json
PUT blogs/_doc/2
{
  "name": "Sparse search in OpenSearch",
  "date_posted": "2022-05-02"
}
```
{% include copy-curl.html %}

```json
PUT blogs/_doc/3
{
  "name": "Distributed tracing with Data Prepper",
  "date_posted": "2022-04-25"
}
```
{% include copy-curl.html %}

```json
PUT blogs/_doc/4
{
  "name": "Observability in OpenSearch",
  "date_posted": "2023-03-23"
}

```
{% include copy-curl.html %}

To use the `auto_date_histogram` aggregation, specify the field containing the date or timestamp values. For example, to aggregate blog posts by `date_posted` into two buckets, send the following request:

```json
GET /blogs/_search
{
  "size": 0,
  "aggs": {
    "histogram": {
      "auto_date_histogram": {
        "field": "date_posted",
        "buckets": 2
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

The response shows that the blog posts were aggregated into two buckets. The interval was automatically set to 1 year, with all three 2022 blog posts collected in one bucket and the 2023 blog post in another:

```json
{
  "took": 20,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "histogram": {
      "buckets": [
        {
          "key_as_string": "2022-01-01",
          "key": 1640995200000,
          "doc_count": 3
        },
        {
          "key_as_string": "2023-01-01",
          "key": 1672531200000,
          "doc_count": 1
        }
      ],
      "interval": "1y"
    }
  }
}
```

## Returned buckets

Each bucket contains the following information:

```json
{
  "key_as_string": "2023-01-01",
  "key": 1672531200000,
  "doc_count": 1
}
```

In OpenSearch, dates are internally stored as 64-bit integers representing timestamps in milliseconds since the epoch. In the aggregation response, each bucket `key` is returned as such a timestamp. The `key_as_string` value shows the same timestamp but formatted as a date string based on the [`format`](#date-format) parameter. The `doc_count` field contains the number of documents in the bucket.

## Parameters

Auto-interval date histogram aggregations accept the following parameters.

Parameter | Data type | Description
:--- | :--- | :--- 
`field` | String | The field on which to aggregate. The field must contain the date or timestamp values. Either `field` or `script` is required.
`buckets` | Integer | The desired number of buckets. The returned number of buckets is less than or equal to the desired number. Optional. Default is `10`.
`minimum_interval` | String | The minimum interval to be used. Specifying a minimum interval can make the aggregation process more efficient. Valid values are `year`, `month`, `day`, `hour`, `minute`, and `second`. Optional.
`time_zone` | String | Specifies to use a time zone other than the default (UTC) for bucketing and rounding. You can specify the `time_zone` parameter as a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset), such as `-04:00`, or an [IANA time zone ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), such as `America/New_York`. Optional. Default is `UTC`. For more information, see [Time zone](#time-zone).
`format` | String | The format for returning dates representing bucket keys. Optional. Default is the format specified in the field mapping. For more information, see [Date format](#date-format).
`script` | String | A document-level or value-level script for aggregating values into buckets. Either `field` or `script` is required.
`missing` | String | Specifies how to handle documents in which the field value is missing. By default, such documents are ignored. If you specify a date value in the `missing` parameter, all documents in which the field value is missing are collected into the bucket with the specified date.

## Date format

If you don't specify the `format` parameter, the format defined in the field mapping is used (as seen in the preceding response). To modify the format, specify the `format` parameter:

```json
GET /blogs/_search
{
  "size": 0,
  "aggs": {
    "histogram": {
      "auto_date_histogram": {
        "field": "date_posted",
        "format": "yyyy-MM-dd HH:mm:ss"
      }
    }
  }
}
```
{% include copy-curl.html %}

The `key_as_string` field is now returned in the specified format:

```json
{
  "key_as_string": "2023-01-01 00:00:00",
  "key": 1672531200000,
  "doc_count": 1
}
```

Alternatively, you can specify one of the built-in date [formats]({{site.url}}{{site.baseurl}}/mappings/supported-field-types/date/#formats):

```json
GET /blogs/_search
{
  "size": 0,
  "aggs": {
    "histogram": {
      "auto_date_histogram": {
        "field": "date_posted",
        "format": "basic_date_time_no_millis"
      }
    }
  }
}
```
{% include copy-curl.html %}

The `key_as_string` field is now returned in the specified format:

```json
{
  "key_as_string": "20230101T000000Z",
  "key": 1672531200000,
  "doc_count": 1
}
```

## Time zone

By default, dates are stored and processed in UTC. The `time_zone` parameter allows you to specify a different time zone for bucketing. You can specify the `time_zone` parameter as a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset), such as `-04:00`, or an [IANA time zone ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), such as `America/New_York`.

As an example, index the following documents into an index:

```json
PUT blogs1/_doc/1
{
  "name": "Semantic search in OpenSearch",
  "date_posted": "2022-04-17T01:00:00.000Z"
}
```
{% include copy-curl.html %}

```json
PUT blogs1/_doc/2
{
  "name": "Sparse search in OpenSearch",
  "date_posted": "2022-04-17T04:00:00.000Z"
}
```
{% include copy-curl.html %}

First, run an aggregation without specifying a time zone: 

```json
GET /blogs1/_search
{
  "size": 0,
  "aggs": {
    "histogram": {
      "auto_date_histogram": {
        "field": "date_posted",
        "buckets": 2,
        "format": "yyyy-MM-dd HH:mm:ss"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains two 3-hour buckets, starting at midnight UTC on April 17, 2022:

```json
{
  "took": 6,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "histogram": {
      "buckets": [
        {
          "key_as_string": "2022-04-17 01:00:00",
          "key": 1650157200000,
          "doc_count": 1
        },
        {
          "key_as_string": "2022-04-17 04:00:00",
          "key": 1650168000000,
          "doc_count": 1
        }
      ],
      "interval": "3h"
    }
  }
}
```

Now, specify a `time_zone` of `-02:00`: 

```json
GET /blogs1/_search
{
  "size": 0,
  "aggs": {
    "histogram": {
      "auto_date_histogram": {
        "field": "date_posted",
        "buckets": 2,
        "format": "yyyy-MM-dd HH:mm:ss",
        "time_zone": "-02:00"
      }
    }
  }
}
```

The response contains two buckets in which the start time is shifted by 2 hours and starts at 23:00 on April 16, 2022:

```json
{
  "took": 17,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 2,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "histogram": {
      "buckets": [
        {
          "key_as_string": "2022-04-16 23:00:00",
          "key": 1650157200000,
          "doc_count": 1
        },
        {
          "key_as_string": "2022-04-17 02:00:00",
          "key": 1650168000000,
          "doc_count": 1
        }
      ],
      "interval": "3h"
    }
  }
}
```

When using time zones with daylight saving time (DST) changes, the sizes of buckets that are near the transition may differ slightly from the sizes of neighboring buckets. 
{: .note}
