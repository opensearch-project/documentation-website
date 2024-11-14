---
layout: default
title: Mappings use cases
parent: Mappings and fields types
nav_order: 5
nav_exclude: true
---

# Mappings use cases

Mappings provide control over how data is indexed and queried, enabling optimized performance and efficient storage for a range of use cases.

---

## Example: Ignoring malformed IP addresses

The following example shows you how to create a mapping specifying that OpenSearch should ignore any documents containing malformed IP addresses that do not conform to the [`ip`]({{site.url}}{{site.baseurl}}/opensearch/supported-field-types/ip/) data type. You can accomplish this by setting the `ignore_malformed` parameter to `true`.

### Create an index with an `ip` mapping

To create an index with an `ip` mapping, use a PUT request:

```json
PUT /test-index 
{
  "mappings" : {
    "properties" :  {
      "ip_address" : {
        "type" : "ip",
        "ignore_malformed": true
      }
    }
  }
}
```
{% include copy-curl.html %}

Then add a document with a malformed IP address:

```json
PUT /test-index/_doc/1 
{
  "ip_address" : "malformed ip address"
}
```
{% include copy-curl.html %}

When you query the index, the `ip_address` field will be ignored. You can query the index using the following request:

```json
GET /test-index/_search
```
{% include copy-curl.html %}

#### Response

```json
{
  "took": 14,
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
        "_index": "test-index",
        "_id": "1",
        "_score": 1,
        "_ignored": [
          "ip_address"
        ],
        "_source": {
          "ip_address": "malformed ip address"
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

---

## Mapping string fields to `text` and `keyword` types

To create an index named `movies1` with a dynamic template that maps all string fields to both the `text` and `keyword` types, you can use the following request:

```json
PUT movies1
{
  "mappings": {
    "dynamic_templates": [
      {
        "strings": {
          "match_mapping_type": "string",
          "mapping": {
            "type": "text",
            "fields": {
              "keyword": {
                "type":  "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    ]
  }
}
```
{% include copy-curl.html %}

This dynamic template ensures that any string fields in your documents will be indexed as both a full-text `text` type and a `keyword` type.
