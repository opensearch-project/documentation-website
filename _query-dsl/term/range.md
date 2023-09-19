---
layout: default
title: Range
parent: Term-level queries
grand_parent: Query DSL
nav_order: 50
---

# Range query

You can search for a range of values in a field with the `range` query.

To search for documents in which the `line_id` value is >= 10 and <= 20, use the following request:

```json
GET shakespeare/_search
{
  "query": {
    "range": {
      "line_id": {
        "gte": 10,
        "lte": 20
      }
    }
  }
}
```
{% include copy-curl.html %}

## Operators

The field parameter in the range query accepts the following optional operator parameters:

- `gte`: Greater than or equal to
- `gt`: Greater than
- `lte`: Less than or equal to
- `lt`: Less than

## Date fields

You can use range queries on fields containing dates. For example, assume that you have a `products` index and you want to find all the products that were added in the year 2019:

```json
GET products/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "2019/01/01",
        "lte": "2019/12/31"
      }
    }
  }
}
```
{% include copy-curl.html %}

For more information about supported date formats, see [Formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#formats).

### Format

To use a date format other than the field's mapped format in a query, specify it in the `format` field.

For example, if the `products` index maps the `created` field as `strict_date_optional_time`, you can specify a different format for a query date as follows:

```json
GET /products/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "01/01/2022",
        "lte": "31/12/2022",
        "format":"dd/MM/yyyy"
      }
    }
  }
}
```
{% include copy-curl.html %}

### Missing date components

OpenSearch populates missing date components with the following values:

- `MONTH_OF_YEAR`: `01`
- `DAY_OF_MONTH`: `01`
- `HOUR_OF_DAY`: `23`
- `MINUTE_OF_HOUR`: `59`
- `SECOND_OF_MINUTE`: `59`
- `NANO_OF_SECOND`: `999_999_999`

If the year is missing, it is not populated. 

For example, consider the following request that specifies only the year in the start date:

```json
GET /products/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "2022",
        "lte": "2022-12-31"
      }
    }
  }
}
```
{% include copy-curl.html %}

The start date is populated with the default values, so the `gte` parameter used is `2022-01-01T23:59:59.999999999Z`.

### Relative dates

You can specify relative dates by using [date math]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#date-math).

To subtract 1 year and 1 day from the specified date, use the following query:

```json
GET products/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "2019/01/01||-1y-1d"
      }
    }
  }
}
```
{% include copy-curl.html %}

In the preceding example, `2019/01/01` is the anchor date (the starting point) for the date math. After the two pipe characters (`||`), you are specifying a mathematical expression relative to the anchor date. In this example, you are subtracting 1 year (`-1y`) and 1 day (`-1d`). 

You can also round off dates by adding a forward slash to the date or time unit.

To find products added within the last year, rounded off by month, use the following query:

```json
GET products/_search
{
  "query": {
    "range": {
      "created": {
        "gte": "now-1y/M"
      }
    }
  }
}
```
{% include copy-curl.html %}

The keyword `now` refers to the current date and time.
{: .tip}

### Rounding relative dates

The following table specifies how relative dates are rounded.

Parameter | Rounding rule | Example: The value `2022-05-18||/M` is rounded to
:--- | :--- | :---
`gt` | Rounds up to the first millisecond that is not in the rounding interval. | `2022-06-01T00:00:00.000`
`gte` | Rounds down to the first millisecond. | `2022-05-01T00:00:00.000`
`lt` | Rounds down to the last millisecond before the rounded date. | `2022-04-30T23:59:59.999`
`lte` | Rounds up to the last millisecond in the rounding interval. | `2022-05-31T23:59:59.999`

### Time zone

By default, dates are assumed to be in [Coordinated Universal Time (UTC)](https://en.wikipedia.org/wiki/Coordinated_Universal_Time). If you specify a `time_zone` parameter in the query, the provided date values are converted to UTC. You can specify the `time_zone` parameter as a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset), such as `-04:00`, or an [IANA time zone ID](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), such as `America/New_York`. For example, the following query specifies that the `gte` date provided in the query is in the `-04:00` time zone:

```json
GET /products/_search
{
  "query": {
    "range": {
      "created": {
        "time_zone": "-04:00",        
        "gte": "2022-04-17T06:00:00" 
      }
    }
  }
}
```
{% include copy-curl.html %}

The `gte` parameter in the preceding query is converted to `2022-04-17T10:00:00 UTC`, which is the UTC equivalent of `2022-04-17T06:00:00-04:00`.   

The `time_zone` parameter does not affect the `now` value because `now` always corresponds to the current system time in UTC.
{: .note}

## Parameters

The query accepts the name of the field (`<field>`) as a top-level parameter:

```json
GET _search
{
  "query": {
    "range": {
      "<field>": {
        "gt": 10,
        ... 
      }
    }
  }
}
```
{% include copy-curl.html %}


In addition to [operators](#operators), you can specify the following optional parameters for the `<field>`.

Parameter | Data type | Description
:--- | :--- | :---
`format` | String | A [format]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#formats) for dates in this query. Default is the field's mapped format.
`relation` | String | Indicates how the range query matches values for [`range`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/range/) fields. Valid values are:<br> - `INTERSECTS` (default): Matches documents whose `range` field value intersects the range provided in the query.  <br> - `CONTAINS`: Matches documents whose `range` field value contains the entire range provided in the query. <br> - `WITHIN`: Matches documents whose `range` field value is entirely within the range provided in the query.
`boost` | Floating-point | Boosts the query by the given multiplier. Useful for searches that contain more than one query. Values in the [0, 1) range decrease relevance, and values greater than 1 increase relevance. Default is `1`. 
`time_zone` | String | The time zone used to convert [`date`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/) values to UTC in the query. Valid values are ISO 8601 [UTC offsets](https://en.wikipedia.org/wiki/List_of_UTC_offsets) and [IANA time zone IDs](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). For more information, see [Time zone](#time-zone).

If [`search.allow_expensive_queries`]({{site.url}}{{site.baseurl}}/query-dsl/index/#expensive-queries) is set to `false`, range queries on [`text`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/text/) and [`keyword`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/keyword/) fields are not run.
{: .important}
