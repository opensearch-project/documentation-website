---
layout: default
title: Range
parent: Term-level queries
grand_parent: Query DSL
nav_order: 50
---

# Range query

You can search for a range of values in a field with the `range` query.

To search for documents where the `line_id` value is >= 10 and <= 20:

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

Parameter | Behavior
:--- | :---
`gte` | Greater than or equal to.
`gt` | Greater than.
`lte` | Less than or equal to.
`lt` | Less than.

In addition to the range query parameters, you can provide date formats or relation operators such as "contains" or "within." To see the supported field types for range queries, see [Range query optional parameters]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/range/#range-query). To see all date formats, see [Formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#formats).
{: .tip }

Assume that you have a `products` index and you want to find all the products that were added in the year 2019:

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

Specify relative dates by using [date math]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/#date-math).

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

The first date that we specify is the anchor date or the starting point for the date math. Add two trailing pipe symbols. You could then add one day (`+1d`) or subtract two weeks (`-2w`). This math expression is relative to the anchor date that you specify.

You could also round off dates by adding a forward slash to the date or time unit.

To find products added in the last year and rounded off by month:

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
