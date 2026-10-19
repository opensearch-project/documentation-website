---
layout: default
title: Common REST parameters
nav_order: 150
redirect_from:
  - /opensearch/common-parameters/
---

# Common REST parameters

OpenSearch REST APIs share the following query parameters, request body conventions, and headers.

Boolean parameters accept only `true` and `false`. OpenSearch rejects other values, such as `yes` or `1`. Numeric parameters accept either a JSON number or a string containing a number, so `"size": 10` and `"size": "10"` are equivalent. For the units accepted by time, byte size, and distance parameters, see [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/).

## Human-readable output

Many APIs, such as the stats APIs, return values that have units, such as sizes and durations. By default, OpenSearch returns these values only in a raw form intended for programs, such as `size_in_bytes`. To also return a human-readable version of each value, add `?human=true` to the request URL. For example, the store size of an index is returned as both `"size": "4.2kb"` and `"size_in_bytes": 4356`. For a list of supported units, see [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/).

The following request returns the index statistics using human-readable values:

```json
GET /products/_stats/store?human=true
```
{% include copy-curl.html %}

## Pretty result

To get back JSON responses in a readable, indented format, add `?pretty=true` to the request URL. Use this parameter only when reading responses manually because it increases the response size.

The following request returns the cluster health in pretty JSON format:

```json
GET /_cluster/health?pretty=true
```
{% include copy-curl.html %}

## YAML output

To return the response in YAML format, add `?format=yaml` to the request URL.

The following request returns the cluster health in YAML format:

```json
GET /_cluster/health?format=yaml
```
{% include copy-curl.html %}

## Content type

To specify the type of content in the request body, use the `Content-Type` key name in the request header. Most operations support JSON, YAML, CBOR, and SMILE formats. If you send a request body in YAML, OpenSearch returns the response in YAML as well. The [Bulk]({{site.url}}{{site.baseurl}}/api-reference/document-apis/bulk/) and [Multi-search]({{site.url}}{{site.baseurl}}/api-reference/search-apis/multi-search/) APIs accept only newline-delimited JSON (`application/x-ndjson`), JSON, and SMILE. OpenSearch rejects requests whose `Content-Type` is not a supported format.

The following request specifies JSON format for the request body:

```bash
curl -H "Content-Type: application/json" -XGET "localhost:9200/products/_search" -d '{"query": {"match_all": {}}}'
```
{% include copy.html %}

## Comments in request bodies

JSON request bodies can contain comments in `/* */` or `//` format. Comments are useful in requests that you store and reuse, such as index or component template definitions. OpenSearch removes comments when it parses the request, so they are not stored and are not returned by APIs such as the Get Index Template API.

The following request creates an index template whose body contains comments:

```json
PUT /_index_template/comment-test
{
  /* Applies to all daily log indexes */
  "index_patterns": ["comment-logs-*"],
  "template": {
    "settings": {
      "number_of_replicas": 0 // Single-node cluster
    }
  }
}
```
{% include copy-curl.html %}

If you send a request body containing `//` comments from a file using cURL, use the `--data-binary` option. The `-d` option removes line breaks from file input, so a `//` comment would turn the rest of the body into a comment.
{: .tip}

## Request body in query string

Some HTTP clients cannot send a body with a `GET` request. In that case, put the body in the `source` query parameter and set `source_content_type` to its media type, for example, `application/json`. OpenSearch rejects a request that contains `source` without `source_content_type`.

The following request searches the `orders-online` index for documents containing a `product` field:

```json
GET /orders-online/_search?source={"query":{"exists":{"field":"product"}}}&source_content_type=application/json
```

When you send this request using cURL or another HTTP client, URL-encode the `source` value.

## Stack traces

By default, error responses do not include the Java stack trace of the exception. To include the stack trace when troubleshooting, add `error_trace=true` to the request URL. The response then contains a `stack_trace` field for the error and for each of its causes.

The following request searches an index that does not exist and returns the error with its stack trace:

```json
GET /no-such-index/_search?error_trace=true
```
{% include copy-curl.html %}

## Filtered responses

To reduce the response size, use the `filter_path` parameter to specify which fields are returned. Pass `filter_path` one or more dot-separated field paths, separated by commas. For example, the following request returns only the search time, the total hit count, and the index of each hit:

```json
GET /sales-*/_search?q=region:west&filter_path=took,hits.total.value,hits.hits._index
```
{% include copy-curl.html %}

The response contains only the requested fields:

```json
{
  "took": 13,
  "hits": {
    "total": {
      "value": 2
    },
    "hits": [
      {
        "_index": "sales-2026-10"
      },
      {
        "_index": "sales-2026-09"
      }
    ]
  }
}
```

Filters support the following syntax:

- `*` matches any field name or part of a field name. For example, `metadata.indices.sales-*.state` returns the state of every index whose name starts with `sales-`.
- `**` matches any number of path levels, so you can select a field without knowing its full path. For example, in a Nodes Stats API response, `nodes.**.heap_used_percent` returns the heap usage of each node, which is nested under the node ID, `jvm`, and `mem` objects.
- A filter that starts with `-` excludes the matching fields.

When you combine inclusive and exclusive filters, OpenSearch applies the exclusive filters first and then the inclusive filters. The following request returns the hits but removes the `_index` and `_score` fields from each one:

```json
GET /sales-*/_search?q=region:west&filter_path=hits.hits,-hits.hits._index,-hits.hits._score
```
{% include copy-curl.html %}

The response contains the ID and source of each hit:

```json
{
  "hits": {
    "hits": [
      {
        "_id": "4xWKNqEBmqWRVflA9hH6",
        "_source": {
          "region": "west",
          "amount": 950
        }
      },
      {
        "_id": "4hWKNqEBmqWRVflA9hGr",
        "_source": {
          "region": "west",
          "amount": 1200
        }
      }
    ]
  }
}
```

The `filter_path` parameter returns `_source` as a whole and cannot select fields inside it. To return only some document fields, combine `filter_path` with [source filtering]({{site.url}}{{site.baseurl}}/search-plugins/searching-data/retrieve-specific-fields/#using-source-filtering). The following request returns only the ID and the `amount` field of each hit:

```json
GET /sales-*/_search?q=region:west&filter_path=hits.hits._id,hits.hits._source&_source_includes=amount
```
{% include copy-curl.html %}

The response contains the `amount` field from each document's source:

```json
{
  "hits": {
    "hits": [
      {
        "_id": "4xWKNqEBmqWRVflA9hH6",
        "_source": {
          "amount": 950
        }
      },
      {
        "_id": "4hWKNqEBmqWRVflA9hGr",
        "_source": {
          "amount": 1200
        }
      }
    ]
  }
}
```

## Flat settings

APIs that return settings, such as the Get Settings API, return them as nested objects by default. To return each setting as a single key in dot notation, for example, `index.number_of_shards`, add `flat_settings=true` to the request URL. Flat settings are easier to search for and to copy into other requests.

The following request returns the settings of the `orders-online` index in flat format:

```json
GET /orders-online/_settings?flat_settings=true
```
{% include copy-curl.html %}

The response contains one key for each setting:

```json
{
  "orders-online": {
    "settings": {
      "index.creation_date": "1791912174739",
      "index.number_of_replicas": "0",
      "index.number_of_shards": "1",
      "index.provided_name": "orders-online",
      "index.replication.type": "DOCUMENT",
      "index.uuid": "-m06DdVxT72bWledrDZ8sA",
      "index.version.created": "137307827"
    }
  }
}
```

<!-- vale off -->
## X-Opaque-Id header
<!-- vale on -->

You can specify an opaque identifier for any request using the `X-Opaque-Id` header. OpenSearch uses this identifier to track tasks, deduplicate deprecation warnings in server-side logs, and distinguish between callers sending requests to your cluster. Do not specify a unique value per request.

The following request adds an opaque ID to the request:

```bash
curl -H "X-Opaque-Id: my-curl-client-1" -XGET localhost:9200/_tasks
```
{% include copy.html %}

<!-- vale off -->
## X-Request-Id header
<!-- vale on -->

You can specify a unique identifier for a search request using the `X-Request-Id` header. This identifier is used to track individual search requests and can be referenced in logs, such as slow logs, for troubleshooting and analysis. The value must be a 32-character hexadecimal string. 

The following request adds a request ID to a search request:

```bash
curl -X GET "http://localhost:9200/_search" \
  -H "Content-Type: application/json" \
  -H "X-Request-Id: 19d538d7c42d09240be001d1e4ff6201" \
  -d '{"query": {"match_all": {}}}'
```
{% include copy.html %}

## Related documentation

- [Index name syntax]({{site.url}}{{site.baseurl}}/api-reference/index-name-syntax/)
- [Supported units]({{site.url}}{{site.baseurl}}/api-reference/units/)
- [Cron expressions]({{site.url}}{{site.baseurl}}/api-reference/cron-expressions/)
- [Date math in range queries]({{site.url}}{{site.baseurl}}/query-dsl/term/range/)
- [Fuzziness]({{site.url}}{{site.baseurl}}/query-dsl/fuzziness/)
