---
layout: default
title: IP range
parent: Bucket aggregations
nav_order: 110
redirect_from:
  - /query-dsl/aggregations/bucket/ip-range/
---

# IP range aggregations

The `ip_range` aggregation groups documents into buckets based on IP address ranges. It operates on fields mapped as `ip` type and supports both explicit `from`/`to` boundaries and [CIDR](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing) notation using the `mask` parameter.

## Parameters

The `ip_range` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The `ip` field to aggregate on. |
| `ranges` | Required | Array | A list of IP ranges. Each range can specify `from` and/or `to` (explicit boundaries), or `mask` (CIDR notation). Optionally include `key` to name the bucket. |
| `keyed` | Optional | Boolean | When `true`, returns buckets as an object keyed by range name instead of an array. Default is `false`. |

## Example setup

To try the examples on this page, create an index containing an `ip` field:

```json
PUT /network_logs
{
  "mappings": {
    "properties": {
      "ip": { "type": "ip" },
      "status": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

Index some documents:

```json
POST /network_logs/_bulk?refresh=true
{"index":{}}
{"ip": "10.0.0.1", "status": "ok"}
{"index":{}}
{"ip": "10.0.0.50", "status": "ok"}
{"index":{}}
{"ip": "10.0.0.100", "status": "error"}
{"index":{}}
{"ip": "10.0.0.200", "status": "ok"}
{"index":{}}
{"ip": "10.0.1.5", "status": "ok"}
{"index":{}}
{"ip": "10.0.1.100", "status": "error"}
{"index":{}}
{"ip": "172.16.0.1", "status": "ok"}
{"index":{}}
{"ip": "172.16.0.50", "status": "ok"}
{"index":{}}
{"ip": "192.168.1.1", "status": "ok"}
{"index":{}}
{"ip": "192.168.1.100", "status": "error"}
```
{% include copy-curl.html %}

## Example: Explicit IP ranges

The following example partitions network log entries into three IP ranges using `from` and `to` boundaries:

```json
GET /network_logs/_search
{
  "size": 0,
  "aggs": {
    "ip_ranges": {
      "ip_range": {
        "field": "ip",
        "ranges": [
          { "to": "10.0.1.0" },
          { "from": "10.0.1.0", "to": "172.16.0.0" },
          { "from": "172.16.0.0" }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The buckets are returned as an array with auto-generated keys based on the range boundaries. The `from` value is inclusive and the `to` value is exclusive:

```json
{
  ...
  "aggregations": {
    "ip_ranges": {
      "buckets": [
        {
          "key": "*-10.0.1.0",
          "to": "10.0.1.0",
          "doc_count": 4
        },
        {
          "key": "10.0.1.0-172.16.0.0",
          "from": "10.0.1.0",
          "to": "172.16.0.0",
          "doc_count": 2
        },
        {
          "key": "172.16.0.0-*",
          "from": "172.16.0.0",
          "doc_count": 4
        }
      ]
    }
  }
}
```

## Example: CIDR masks with keyed response

You can define ranges using CIDR notation and assign custom keys. Setting `keyed` to `true` returns an object instead of an array. The following example groups traffic by RFC 1918 private address classes:

```json
GET /network_logs/_search
{
  "size": 0,
  "aggs": {
    "ip_ranges": {
      "ip_range": {
        "field": "ip",
        "ranges": [
          { "key": "private_a", "mask": "10.0.0.0/8" },
          { "key": "private_b", "mask": "172.16.0.0/12" },
          { "key": "private_c", "mask": "192.168.0.0/16" }
        ],
        "keyed": true
      }
    }
  }
}
```
{% include copy-curl.html %}

With CIDR notation, the response includes the computed `from` and `to` boundaries derived from the mask. Because `keyed` is `true`, buckets are returned as an object with custom keys instead of an array:

```json
{
  ...
  "aggregations": {
    "ip_ranges": {
      "buckets": {
        "private_a": {
          "from": "10.0.0.0",
          "to": "11.0.0.0",
          "doc_count": 6
        },
        "private_b": {
          "from": "172.16.0.0",
          "to": "172.32.0.0",
          "doc_count": 2
        },
        "private_c": {
          "from": "192.168.0.0",
          "to": "192.169.0.0",
          "doc_count": 2
        }
      }
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `buckets` | Array or Object | The IP range buckets. Returned as an array by default, or as an object when `keyed` is `true`. |
| `buckets.key` | String | The auto-generated range label (for example, `*-10.0.1.0` or `10.0.0.0/24`), or a custom key if specified. |
| `buckets.from` | String | The lower bound IP address of the range (inclusive). |
| `buckets.to` | String | The upper bound IP address of the range (exclusive). |
| `buckets.doc_count` | Integer | The number of documents with an IP address in this range. |
