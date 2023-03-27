---
layout: default
title: The `unsigned_long` field type
parent: Supported field types
nav_order: 15
has_children: false
redirect_from:
  - /opensearch/supported-field-types/unsigned_long/
---

# The `unsigned_long` field type

The `unsigned_long` is a numeric field type that represents an unsigned 64-bit integer. Minimum value is 0. Maximum value of 2^64-1. Here is an example of how to reate a mapping where `counter` is an `unsigned_long` field:


```json
PUT testindex 
{
  "mappings" : {
    "properties" :  {
      "counter" : {
        "type" : "unsigned_long"
      }
    }
  }
}

```
{% include copy-curl.html %}

# Indexing

To index a document with an `unsigned_long` value:

```json
PUT testindex/_doc/1 
{
  "counter" : 10223372036854775807
}
```
{% include copy-curl.html %}

Or using [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) APIs:

```json
POST _bulk
{ "index": { "_index": "testindex", "_id": "1" } }
{ "counter": 10223372036854775807 }
```
{% include copy-curl.html %}

Please notice that if a field of type `unsigned_long` has `store` parameters set to `true` (stored field), it will be stored and returned as a `String`. The `unsigned_long` values do not support decimal part, it will be truncated if supplied.

# Querying

The `unsigned_long` fields support most of the queries that other numeric types support.

```json
POST _search
{
  "query": {
    "term": {
      "counter": {
        "value": 10223372036854775807
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
POST _search
{
  "query": {
    "range": {
      "counter": {
        "gte": 10223372036854775807
      }
    }
  }
}
```
{% include copy-curl.html %}

# Sorting

You could also use `sort` with `unsigned_long` fields to order the search results, for example:

```json
POST _search
{
  "sort" : [
    { 
      "counter" : { 
        "order" : "asc" 
      } 
    }
  ],
  "query": {
    "range": {
      "counter": {
        "gte": 10223372036854775807
      }
    }
  }
}
```
{% include copy-curl.html %}


The `unsigned_long` could not be used as index sort fields (`sort.field` index setting).
{: .warning}

# Aggregations

Like other numeric fields, the `unsigned_long` support aggregations. For `terms` and `multi_terms`, the `unsigned_long` values are used but for other aggregation types, the values are converted to the `double` type (with possible lost of precision).


```json
POST _search
{
  "query": {
    "match_all": {}
  },
  "aggs": {
    "counters": {
      "terms": { 
         "field": "counter" 
      }
    }
  }
}
```
{% include copy-curl.html %}

# Scripting

In scripts, the `unsigned_long` fields are returned as instances of `BigInteger` class. 

```json
POST _search
{
  "query": {
    "bool": {
      "filter": {
        "script": {
          "script": "BigInteger amount = doc['counter'].value; return amount.compareTo(BigInteger.ZERO) > 0;"
        }
      }
    }
  }
}
```
{% include copy-curl.html %}


# Limitations

When aggregations are performed across different numeric types (where one of them is `unsigned_long`), the values are converted to the `double` type and `double` arithmetic is used with high likelihood of precision loss.

The `unsigned_long` could not be used as index sort fields (`sort.field` index setting). The limitation also applies to the scenario when search is done over multiple indices and sorted by the field that has `unsigned_long` type in (at least) one of the indices but different numeric type(s) in others. 