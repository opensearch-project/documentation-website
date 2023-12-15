---
layout: default
title: Date
nav_order: 25
has_children: false
parent: Date field types
grand_parent: Supported field types
redirect_from:
  - /opensearch/supported-field-types/date/
  - /field-types/date/
---

# Date field type

A date in OpenSearch can be represented as one of the following:

- A long value that corresponds to milliseconds since the epoch (the value must be non-negative). Dates are stored in this form internally.
- A formatted string.
- An integer value that corresponds to seconds since the epoch (the value must be non-negative).

To represent date ranges, there is a date [range field type]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/range/).
{: .note }

## Example

Create a mapping with a date field and two date formats:

```json
PUT testindex
{
  "mappings" : {
    "properties" :  {
      "release_date" : {
        "type" : "date",
        "format" : "strict_date_optional_time||epoch_millis"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Parameters

The following table lists the parameters accepted by date field types. All parameters are optional.

Parameter | Description 
:--- | :--- 
`boost` | A floating-point value that specifies the weight of this field toward the relevance score. Values above 1.0 increase the field's relevance. Values between 0.0 and 1.0 decrease the field's relevance. Default is 1.0.
`doc_values` | A Boolean value that specifies whether the field should be stored on disk so that it can be used for aggregations, sorting, or scripting. Default is `false`.
`format` | The format for parsing dates. Default is `strict_date_time_no_millis||strict_date_optional_time||epoch_millis`.
`ignore_malformed` | A Boolean value that specifies to ignore malformed values and not to throw an exception. Default is `false`.
`index` | A Boolean value that specifies whether the field should be searchable. Default is `true`.
`locale` | A region- and language-specific way of representing the date. Default is [`ROOT`](https://docs.oracle.com/javase/8/docs/api/java/util/Locale.html#ROOT) (a region- and language-neutral locale).
`meta` | Accepts metadata for this field.
[`null_value`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/index#null-value) | A value to be used in place of `null`. Must be of the same type as the field. If this parameter is not specified, the field is treated as missing when its value is `null`. Default is `null`.
`store` | A Boolean value that specifies whether the field value should be stored and can be retrieved separately from the _source field. Default is `false`. 

## Formats

OpenSearch has built-in date formats, but you can also create your own custom formats. You can specify multiple date formats, separated by `||`.

## Default format

As of OpenSearch 2.12, the default date format is `strict_date_time_no_millis||strict_date_optional_time||epoch_millis`. To revert the default format back to `strict_date_optional_time||epoch_millis` (the default format for OpenSearch 2.11 and earlier), set the `opensearch.experimental.optimization.datetime_formatter_caching.enabled` feature flag to `false`. For more information about enabling and disabling feature flags, see [Enabling experimental features]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/experimental/).

## Built-in formats

Most of the date formats have a `strict_` counterpart. When the format starts with `strict_`, the date must have the correct number of digits specified in the format. For example, if the format is set to `strict_year_month_day` ("yyyy-MM-dd"), both month and day have to be two-digit numbers. So, "2020-06-09" is valid, while "2020-6-9" is invalid.

Epoch is defined as 00:00:00 UTC on January 1, 1970.
{: .note }

y: year<br>
Y: [week-based year](https://en.wikipedia.org/wiki/ISO_8601#Week_dates)<br>
M: month<br>
w: ordinal [week of the year](https://en.wikipedia.org/wiki/ISO_8601#Week_dates) from 01 to 53<br> 
d: day<br>
D: ordinal day of the year from 001 to 365 (366 for leap years)<br>
e: ordinal day of the week from 1 (Monday) to 7 (Sunday)<br>
H: hour from 0 to 23<br>
m: minute<br>
s: second<br>
S: fraction of a second<br>
Z: time zone offset (for example, +0400; -0400; -04:00)<br>
{: .note }

### Numeric date formats

Format name and description | Examples
:--- | :---
`epoch_millis` <br> The number of milliseconds since the epoch. Minimum is -2<sup>63</sup>. Maximum is 2<sup>63</sup> &minus; 1. | 1553391286000
`epoch_second` <br> The number of seconds since the epoch. Minimum is -2<sup>63</sup> &divide; 1000. Maximum is (2<sup>63</sup> &minus; 1) &divide; 1000. | 1553391286

### Basic date formats

Components of basic date formats are not separated by a delimiter. For example, "20190323".

Format name and description | Pattern and examples
:--- | :---
**Dates**| 
`basic_date_time` <br> A basic date and time separated by `T`. | "yyyyMMdd`T`HHmmss.SSSZ"<br>"20190323T213446.123-04:00"
`basic_date_time_no_millis` <br> A basic date and time without milliseconds, separated by `T`. | "yyyyMMdd`T`HHmmssZ"<br>"20190323T213446-04:00"
`basic_date` <br> A date with a four-digit year, two-digit month, and two-digit day. | "yyyyMMdd"<br>"20190323" 
**Times** |
`basic_time` <br> A time with a two-digit hour, two-digit minute, two-digit second, three-digit millisecond, and time zone offset. |"HHmmss.SSSZ" <br> "213446.123-04:00"
`basic_time_no_millis` <br> A basic time without milliseconds. | "HHmmssZ" <br> "213446-04:00"
**T times** | 
`basic_t_time` <br> A basic time preceded by `T`. | "`T`HHmmss.SSSZ" <br> "T213446.123-04:00"
`basic_t_time_no_millis` <br> A basic time without milliseconds, preceded by `T`. | "`T`HHmmssZ" <br> "T213446-04:00"
**Ordinal dates** |
`basic_ordinal_date_time` <br> A full ordinal date and time. | "yyyyDDD`T`HHmmss.SSSZ"<br>"2019082T213446.123-04:00"
`basic_ordinal_date_time_no_millis` <br> A full ordinal date and time without milliseconds. | "yyyyDDD`T`HHmmssZ"<br>"2019082T213446-04:00"
`basic_ordinal_date` <br> A date with a four-digit year and three-digit ordinal day of the year. | "yyyyDDD" <br> "2019082"
**Week-based dates** | 
`basic_week_date_time` <br> `strict_basic_week_date_time` <br> A full week-based date and time separated by `T`. | "YYYY`W`wwe`T`HHmmss.SSSZ" <br> "2019W126213446.123-04:00"
`basic_week_date_time_no_millis` <br> `strict_basic_week_date_time_no_millis` <br> A basic week-based year date and time without milliseconds, separated by `T`. | "YYYY`W`wwe`T`HHmmssZ" <br> "2019W126213446-04:00"
`basic_week_date` <br> `strict_basic_week_date` <br> A full week-based date with a four-digit week-based year, two-digit ordinal week of the year, and one-digit ordinal day of the week separated by `W`. | "YYYY`W`wwe" <br> "2019W126"

### Full date formats

Components of full date formats are separated by a `-` delimiter for date and `:` delimiter for time. For example, "2019-03-23T21:34".

Format name and description | Pattern and examples
:--- | :---
**Dates** |
`date_optional_time`<br>`strict_date_optional_time` <br> A generic full date and time. Year is required. Month, day, and time are optional. Time is separated from date by `T`. | Multiple patterns. <br>"2019-03-23T21:34:46.123456789-04:00" <br> "2019-03-23T21:34:46" <br> "2019-03-23T21:34" <br> "2019"
`strict_date_optional_time_nanos` <br>A generic full date and time. Year is required. Month, day, and time are optional. If time is specified, it must contain hours, minutes, and seconds, but fraction of a second is optional. Fraction of a second is one to nine digits long and has nanosecond resolution. Time is separated from date by `T`. | Multiple patterns. <br> "2019-03-23T21:34:46.123456789-04:00" <br> "2019-03-23T21:34:46" <br> "2019" 
`date_time` <br> `strict_date_time` <br> A full date and time separated by `T`. | "yyyy-MM-dd`T`HH:mm:ss.SSSZ" <br> "2019-03-23T21:34:46.123-04:00"
`date_time_no_millis` <br> `strict_date_time_no_millis` <br> A full date and time without milliseconds, separated by `T`. | "yyyy-MM-dd'T'HH:mm:ssZ" <br> "2019-03-23T21:34:46-04:00" 
`date_hour_minute_second_fraction` <br> `strict_date_hour_minute_second_fraction` <br> A full date, two-digit hour, two-digit minute, two-digit second, and one- to nine-digit fraction of a second separated by `T`. | "yyyy-MM-dd`T`HH:mm:ss.SSSSSSSSS"<br>"2019-03-23T21:34:46.123456789" <br> "2019-03-23T21:34:46.1"
`date_hour_minute_second_millis` <br> `strict_date_hour_minute_second_millis` <br> A full date, two-digit hour, two-digit minute, two-digit second, and three-digit millisecond separated by `T`. | "yyyy-MM-dd`T`HH:mm:ss.SSS" <br> "2019-03-23T21:34:46.123" 
`date_hour_minute_second` <br> `strict_date_hour_minute_second` <br> A full date, two-digit hour, two-digit minute, and two-digit second separated by `T`.| "yyyy-MM-dd`T`HH:mm:ss"<br>"2019-03-23T21:34:46" 
`date_hour_minute` <br> `strict_date_hour_minute` <br> A full date, two-digit hour, and two-digit minute. | "yyyy-MM-dd`T`HH:mm" <br> "2019-03-23T21:34"
`date_hour` <br> `strict_date_hour` <br> A full date and two-digit hour, separated by `T`. | "yyyy-MM-dd`T`HH" <br> "2019-03-23T21" 
`date` <br> `strict_date` <br> A four-digit year, two-digit month, and two-digit day. | "yyyy-MM-dd" <br> "2019-03-23" 
`year_month_day` <br> `strict_year_month_day` <br> A four-digit year, two-digit month, and two-digit day. | "yyyy-MM-dd" <br> "2019-03-23" 
`year_month` <br> `strict_year_month` <br> A four-digit year and two-digit month. | "yyyy-MM" <br> "2019-03" 
`year` <br> `strict_year` <br> A four-digit year. | "yyyy" <br> "2019" 
**Times** | 
`time` <br> `strict_time` <br> A two-digit hour, two-digit minute, two-digit second, one- to nine-digit fraction of a second, and time zone offset. | "HH:mm:ss.SSSSSSSSSZ" <br> "21:34:46.123456789-04:00" <br> "21:34:46.1-04:00"
`time_no_millis` <br> `strict_time_no_millis` <br> A two-digit hour, two-digit minute, two-digit second, and time zone offset. | "HH:mm:ssZ" <br> "21:34:46-04:00" 
`hour_minute_second_fraction` <br> `strict_hour_minute_second_fraction` <br> A two-digit hour, two-digit minute, two-digit second, and one- to nine-digit fraction of a second. | "HH:mm:ss.SSSSSSSSS" <br> "21:34:46.1" <br> "21:34:46.123456789" 
`hour_minute_second_millis` <br> `strict_hour_minute_second_millis` <br> A two-digit hour, two-digit minute, two-digit second, and three-digit millisecond. | "HH:mm:ss.SSS" <br> "21:34:46.123" 
`hour_minute_second` <br> `strict_hour_minute_second` <br> A two-digit hour, two-digit minute, and two-digit second. | "HH:mm:ss" <br> "21:34:46" 
`hour_minute` <br> `strict_hour_minute` <br> A two-digit hour and two-digit minute. | "HH:mm" <br> "21:34" 
`hour` <br> `strict_hour` <br> A two-digit hour. | "HH" <br> "21" 
**T times** |
`t_time` <br> `strict_t_time` <br> A two-digit hour, two-digit minute, two-digit second, one- to nine-digit fraction of a second, and time zone offset, preceded by `T`. | "`T`HH:mm:ss.SSSSSSSSSZ"<br>"T21:34:46.123456789-04:00" <br> "T21:34:46.1-04:00"
`t_time_no_millis` <br> `strict_t_time_no_millis` <br> A two-digit hour, two-digit minute, two-digit second, and time zone offset, preceded by `T`. | "`T`HH:mm:ssZ" <br> "T21:34:46-04:00"
**Ordinal dates** |
`ordinal_date_time` <br> `strict_ordinal_date_time` <br> A full ordinal date and time separated by `T`. | "yyyy-DDD`T`HH:mm:ss.SSSZ" <br> "2019-082T21:34:46.123-04:00" 
`ordinal_date_time_no_millis` <br> `strict_ordinal_date_time_no_millis` <br> A full ordinal date and time without milliseconds, separated by `T`. | "yyyy-DDD`T`HH:mm:ssZ" <br> "2019-082T21:34:46-04:00"
`ordinal_date` <br> `strict_ordinal_date`<br> A full ordinal date with a four-digit year and three-digit ordinal day of the year. | "yyyy-DDD" <br> "2019-082"
**Week-based dates** |
`week_date_time` <br> `strict_week_date_time` <br> A full week-based date and time separated by `T`. Week date is a four-digit week-based year, two-digit ordinal week of the year, and one-digit ordinal day of the week. Time is a two-digit hour, two-digit minute, two-digit second, one- to nine-digit fraction of a second, and a time zone offset. | "YYYY-`W`ww-e`T`HH:mm:ss.SSSSSSSSSZ" <br> "2019-W12-6T21:34:46.1-04:00" <br> "2019-W12-6T21:34:46.123456789-04:00"
`week_date_time_no_millis` <br> `strict_week_date_time_no_millis` <br> A full week-based date and time without milliseconds, separated by `T`. Week date is a four-digit week-based year, two-digit ordinal week of the year, and one-digit ordinal day of the week. Time is a two-digit hour, two-digit minute, two-digit second, and time zone offset. | "YYYY-`W`ww-e`T`HH:mm:ssZ" <br> "2019-W12-6T21:34:46-04:00"
`week_date` <br> `strict_week_date` <br> A full week-based date with a four-digit week-based year, two-digit ordinal week of the year, and one-digit ordinal day of the week. | "YYYY-`W`ww-e" <br> "2019-W12-6"
`weekyear_week_day` <br> `strict_weekyear_week_day` <br> A four-digit week-based year, two-digit ordinal week of the year, and one digit day of the week. | "YYYY-'W'ww-e" <br> "2019-W12-6" 
`weekyear_week` <br> `strict_weekyear_week` <br> A four-digit week-based year and two-digit ordinal week of the year. | "YYYY-`W`ww" <br> "2019-W12" 
`weekyear` <br> `strict_weekyear` <br> A four-digit week-based year. | "YYYY" <br> "2019" 

## Custom formats

You can create custom formats for date fields. For example, the following request specifies a date in the common "MM/dd/yyyy" format:

```json
PUT testindex
{
  "mappings" : {
    "properties" :  {
      "release_date" : {
        "type" : "date",
        "format" : "MM/dd/yyyy"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with a date:

```json
PUT testindex/_doc/21 
{
  "release_date" : "03/21/2019"
}
```
{% include copy-curl.html %}

When searching for an exact date, provide that date in the same format:

```json
GET testindex/_search
{
  "query" : {
    "match": {
      "release_date" : {
        "query": "03/21/2019"
      }
    }
  }
}
```
{% include copy-curl.html %}

Range queries by default use the field's mapped format. You can also specify the range of dates in a different format by providing the `format` parameter:

```json
GET testindex/_search
{
  "query": {
    "range": {
      "release_date": {
        "gte": "2019-01-01",
        "lte": "2019-12-31",
        "format": "yyyy-MM-dd"
      }
    }
  }
}
```
{% include copy-curl.html %}

## Date math

The date field type supports using date math to specify durations in queries. For example, the `gt`, `gte`, `lt`, and `lte` parameters in [range queries]({{site.url}}{{site.baseurl}}/query-dsl/term/range/) and the `from` and `to` parameters in [date range aggregations]({{site.url}}{{site.baseurl}}/query-dsl/aggregations/bucket/date-range/) accept date math expressions.

A date math expression contains a fixed date, optionally followed by one or more mathematical expressions. The fixed date may be either `now` (current date and time in milliseconds since the epoch) or a string ending with `||` that specifies a date (for example, `2022-05-18||`). The date must be in the [default format](#default-format) (which is `strict_date_time_no_millis||strict_date_optional_time||epoch_millis` by default).

If you specify multiple date formats in the field mapping, OpenSearch uses the first format to convert the milliseconds since the epoch value to a string. <br>
If a field mapping for a field contains no format, OpenSearch uses the `strict_date_optional_time` format to convert the epoch value to a string.
{: .note}

Date math supports the following mathematical operators.

Operator | Description | Example
:--- | :--- | :---
`+` | Addition | `+1M`: Add 1 month.
`-` | Subtraction | `-1y`: Subtract 1 year.
`/` | Rounding down | `/h`: Round to the beginning of the hour.

Date math supports the following time units:

`y`: Years<br>
`M`: Months<br>
`w`: Weeks<br>
`d`: Days<br>
`h` or `H`: Hours<br>
`m`: Minutes<br>
`s`: Seconds
{: .note }

### Example expressions

The following example expressions illustrate using date math:

- `now+1M`: The current date and time in milliseconds since the epoch, plus 1 month.
- `2022-05-18||/M`: 05/18/2022, rounded to the beginning of the month. Resolves to `2022-05-01`.
- `2022-05-18T15:23||/h`: 15:23 on 05/18/2022, rounded to the beginning of the hour. Resolves to `2022-05-18T15`.
- `2022-05-18T15:23:17.789||+2M-1d/d`: 15:23:17.789 on 05/18/2022 plus 2 months minus 1 day, rounded to the beginning of the day. Resolves to `2022-07-17`.


### Using date math in a range query

The following example illustrates using date math in a [range query]({{site.url}}{{site.baseurl}}/query-dsl/term/range/).

Set up an index with `release_date` mapped as `date`:

```json
PUT testindex 
{
  "mappings" : {
    "properties" :  {
      "release_date" : {
        "type" : "date"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index two documents into the index:

```json
PUT testindex/_doc/1
{
  "release_date": "2022-09-14"
}
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/2
{
  "release_date": "2022-11-15"
}
```
{% include copy-curl.html %}

The following query searches for documents with `release_date` within 2 months and 1 day of 09/14/2022. The lower boundary of the range is rounded to the beginning of the day on 09/14/2022:

```json
GET testindex/_search
{
  "query": {
    "range": {
      "release_date": {
        "gte": "2022-09-14T15:23||/d",
        "lte": "2022-09-14||+2M+1d"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains both documents:

```json
{
  "took" : 1,
  "timed_out" : false,
  "_shards" : {
    "total" : 1,
    "successful" : 1,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : {
      "value" : 2,
      "relation" : "eq"
    },
    "max_score" : 1.0,
    "hits" : [
      {
        "_index" : "testindex",
        "_id" : "2",
        "_score" : 1.0,
        "_source" : {
          "release_date" : "2022-11-14"
        }
      },
      {
        "_index" : "testindex",
        "_id" : "1",
        "_score" : 1.0,
        "_source" : {
          "release_date" : "2022-09-14"
        }
      }
    ]
  }
}
```