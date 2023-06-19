---
layout: default
title: Date nanoseconds
nav_order: 35
has_children: false
parent: Date field types
grand_parent: Supported field types
---

# Date nanoseconds field type

The `date_nanos` field type is similar to the [`date`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date/) field type in that it holds a date. However, `date` stores the date in millisecond resolution, while `date_nanos` stores the date in nanosecond resolution. Dates are stored as `long` values that correspond to nanoseconds since the epoch. Therefore, the range of supported dates is approximately 1970--2262.

Queries on `date_nanos` fields are converted to range queries on the field value's `long` representation. Then the stored fields and aggregation results are converted to a string using the format set on the field. 

The `date_nanos` field supports all [formats]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date#formats) and [parameters]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/date#parameters) that `date` supports. You can use multiple formats separated by `||`.
{: .note}

For `date_nanos` fields, you can use the `strict_date_optional_time_nanos` format to preserve nanosecond resolution. If you don't specify the format when mapping a field as `date_nanos`, the default format is `strict_date_optional_time||epoch_millis` that lets you pass values in either `strict_date_optional_time` or `epoch_millis` format. The `strict_date_optional_time` format supports dates in nanosecond resolution, but the `epoch_millis` format supports dates in millisecond resolution only.

## Example

Create a mapping with the `date` field of type `date_nanos` that has the `strict_date_optional_time_nanos` format:

```json
PUT testindex/_mapping
{
  "properties": {
      "date": {
        "type": "date_nanos",
        "format" : "strict_date_optional_time_nanos"
      }
    }
}
```
{% include copy-curl.html %}

Index two documents into the index:

```json
PUT testindex/_doc/1
{ "date": "2022-06-15T10:12:52.382719622Z" }
```
{% include copy-curl.html %}

```json
PUT testindex/_doc/2
{ "date": "2022-06-15T10:12:52.382719624Z" }
```
{% include copy-curl.html %}

You can use a range query to search for a date range:

```json
GET testindex/_search
{
  "query": {
    "range": {
      "date": {
        "gte": "2022-06-15T10:12:52.382719621Z",
        "lte": "2022-06-15T10:12:52.382719623Z"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains the document whose date is in the specified range:

```json
{
  "took": 43,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 1,
        "_source": {
          "date": "2022-06-15T10:12:52.382719622Z"
        }
      }
    ]
  }
}
```

When querying documents with `date_nanos` fields, you can use `fields` or `docvalue_fields`:

```json
GET testindex/_search
{
  "fields": ["date"]
}
```
{% include copy-curl.html %}

```json
GET testindex/_search
{
  "docvalue_fields" : [
    {
      "field" : "date"
    }
  ]
}
```
{% include copy-curl.html %}

The response to either of the preceding queries contains both indexed documents:

```json
{
  "took": 4,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 1,
        "_source": {
          "date": "2022-06-15T10:12:52.382719622Z"
        },
        "fields": {
          "date": [
            "2022-06-15T10:12:52.382719622Z"
          ]
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 1,
        "_source": {
          "date": "2022-06-15T10:12:52.382719624Z"
        },
        "fields": {
          "date": [
            "2022-06-15T10:12:52.382719624Z"
          ]
        }
      }
    ]
  }
}
```

You can sort on a `date_nanos` field as follows:

```json
GET testindex/_search
{
  "sort": { 
    "date": "asc"
  } 
}
```
{% include copy-curl.html %}

The response contains the sorted documents:

```json
{
  "took": 5,
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
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": null,
        "_source": {
          "date": "2022-06-15T10:12:52.382719622Z"
        },
        "sort": [
          1655287972382719700
        ]
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": null,
        "_source": {
          "date": "2022-06-15T10:12:52.382719624Z"
        },
        "sort": [
          1655287972382719700
        ]
      }
    ]
  }
}
```

You can also use a Painless script to access the nanoseconds part of the field:

```json
GET testindex/_search
{
  "script_fields" : {
    "my_field" : {
      "script" : {
        "lang" : "painless",
        "source" : "doc['date'].value.nano" 
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains only the nanosecond parts of the fields:

```json
{
  "took": 4,
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
    "max_score": 1,
    "hits": [
      {
        "_index": "testindex",
        "_id": "1",
        "_score": 1,
        "fields": {
          "my_field": [
            382719622
          ]
        }
      },
      {
        "_index": "testindex",
        "_id": "2",
        "_score": 1,
        "fields": {
          "my_field": [
            382719624
          ]
        }
      }
    ]
  }
}
```