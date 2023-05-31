---
layout: default
title: Unsigned long
parent: Numeric field types
grand_parent: Supported field types
nav_order: 15
has_children: false
---

# Unsigned long field type

The `unsigned_long` field type is a numeric field type that represents an unsigned 64-bit integer with a minimum value of 0 and a maximum value of 2<sup>64</sup> &minus; 1. In the following example, `counter` is mapped as an `unsigned_long` field:


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

## Indexing  

To index a document with an `unsigned_long` value, use the following request:

```json
PUT testindex/_doc/1 
{
  "counter" : 10223372036854775807
}
```
{% include copy-curl.html %}

Alternatively, you can use the [Bulk API]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) as follows:

```json
POST _bulk
{ "index": { "_index": "testindex", "_id": "1" } }
{ "counter": 10223372036854775807 }
```
{% include copy-curl.html %}

If a field of type `unsigned_long` has the `store` parameter set to `true` (that is, the field is a stored field), it will be stored and returned as a string. `unsigned_long` values do not support the decimal part, so, if supplied, the decimal part is truncated.
{: .note}

## Querying

`unsigned_long` fields support most of the queries that other numeric types support. For example, you can use a term query on `unsigned_long` fields:

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

You can also use a range query:

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

## Sorting

You can use `sort` values with `unsigned_long` fields to order the search results, for example:

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


An `unsigned_long` field cannot be used as an index sort field (in the `sort.field` index setting).
{: .warning}

## Aggregations

Like other numeric fields, `unsigned_long` fields support aggregations. For `terms` and `multi_terms` aggregations, `unsigned_long` values are used as is, but for other aggregation types, the values are converted to the `double` type (with possible loss of precision). The following is an example of the `terms` aggregation:

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

## Scripting

In scripts, `unsigned_long` fields are returned as instances of the `BigInteger` class: 

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


## Limitations

Note the following limitations of the `unsigned_long` field type:

- When aggregations are performed across different numeric types and one of the types is `unsigned_long`, the values are converted to the `double` type and `double` arithmetic is used, with high likelihood of precision loss.

- An `unsigned_long` field cannot be used as an index sort field (in the `sort.field` index setting). This limitation also applies when a search is performed on multiple indexes and the results are sorted by the field that has the `unsigned_long` type in at least one of the indexes but a different numeric type or types in others. 