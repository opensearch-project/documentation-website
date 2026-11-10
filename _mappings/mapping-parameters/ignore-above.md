---
layout: default
title: Ignore above
parent: Mapping parameters
redirect_from:
  - /field-types/mapping-parameters/ignore-above/
nav_order: 120
has_children: false
has_toc: false
---

# Ignore above mapping parameter

The `ignore_above` mapping parameter sets a maximum length for string values. When a value is longer than the limit, OpenSearch indexes the document but skips that value: it is not added to the index or to [doc values]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/doc-values/), so it does not match queries and does not appear in aggregations or sort results. The original value remains in the [`_source`]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/source/) field and is returned with the document.

Use `ignore_above` to keep unusually long values, such as stack traces or free-form text sent to a field mapped as `keyword`, from increasing the index size and from causing indexing failures.

If you do not specify `ignore_above`, the default is `2147483647`, so all string values are indexed regardless of length. When OpenSearch dynamically maps a string field, it creates a `keyword` subfield for which `ignore_above` is set to `256`.

If a field contains an array of strings, OpenSearch applies the limit to each array element separately. Elements within the limit are indexed, and longer elements are skipped. OpenSearch does not record skipped values in the [`_ignored`]({{site.url}}{{site.baseurl}}/mappings/metadata-fields/ignored/) metadata field, and an [`exists`]({{site.url}}{{site.baseurl}}/query-dsl/term/exists/) query on the field does not match a document whose only value was skipped.

## Example: Without ignore_above

Create an index with a `keyword` field without specifying the `ignore_above` parameter:

```json
PUT /test-no-ignore
{
  "mappings": {
    "properties": {
      "sentence": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document with a long string value:

```json
PUT /test-no-ignore/_doc/1
{
  "sentence": "text longer than 10 characters"
}
```
{% include copy-curl.html %}

Run a term query for the full string:

```json
GET /test-no-ignore/_search
{
  "query": {
    "term": {
      "sentence": "text longer than 10 characters"
    }
  }
}
```
{% include copy-curl.html %}

The document is returned because the `sentence` field was indexed:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "test-no-ignore",
        "_id": "1",
        "_score": 1,
        "_source": {
          "sentence": "text longer than 10 characters"
        }
      }
    ]
  }
}
```

## Example: With ignore_above

Create an index with the `ignore_above` parameter set to `10` on the same field:

```json
PUT /test-ignore
{
  "mappings": {
    "properties": {
      "sentence": {
        "type": "keyword",
        "ignore_above": 10
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the same document with the long string value:

```json
PUT /test-ignore/_doc/1
{
  "sentence": "text longer than 10 characters"
}
```
{% include copy-curl.html %}

Run a term query for the full string:

```json
GET /test-ignore/_search
{
  "query": {
    "term": {
      "sentence": "text longer than 10 characters"
    }
  }
}
```
{% include copy-curl.html %}

No results are returned because the string in the `sentence` field exceeded the `ignore_above` threshold and was not indexed:

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 0,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  }
}
```

To confirm that the document is still in the index, search the index without a query:

```json
GET /test-ignore/_search
```
{% include copy-curl.html %}

The returned hits include the document:

```json
{
  ...
  "hits": {
    "total": {
      "value": 1,
      "relation": "eq"
    },
    "max_score": 1,
    "hits": [
      {
        "_index": "test-ignore",
        "_id": "1",
        "_score": 1,
        "_source": {
          "sentence": "text longer than 10 characters"
        }
      }
    ]
  }
}
```

## Example: Arrays and aggregations

Create an index containing a `product_tags` field that skips any tag longer than 12 characters:

```json
PUT /test-ignore-array
{
  "mappings": {
    "properties": {
      "product_tags": {
        "type": "keyword",
        "ignore_above": 12
      }
    }
  }
}
```
{% include copy-curl.html %}

Index a document in which all tags are within the limit:

```json
PUT /test-ignore-array/_doc/1
{
  "product_tags": ["outdoor", "waterproof"]
}
```
{% include copy-curl.html %}

Index a document containing one tag that exceeds the limit:

```json
PUT /test-ignore-array/_doc/2?refresh=true
{
  "product_tags": ["outdoor", "lightweight-breathable-fabric"]
}
```
{% include copy-curl.html %}

Run a `terms` aggregation on the `product_tags` field:

```json
GET /test-ignore-array/_search
{
  "size": 0,
  "aggs": {
    "tags": {
      "terms": {
        "field": "product_tags"
      }
    }
  }
}
```
{% include copy-curl.html %}

The response shows that both documents match the search, but the `lightweight-breathable-fabric` tag is missing from the aggregation buckets. The `outdoor` tag in the second document is within the limit, so it is still counted:

```json
{
  "took": 9,
  "timed_out": false,
  "terminated_early": true,
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
    "tags": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "outdoor",
          "doc_count": 2
        },
        {
          "key": "waterproof",
          "doc_count": 1
        }
      ]
    }
  }
}
```

## Changing the limit on an existing field

You can change the `ignore_above` value of an existing field using the [Create or Update Index Mappings API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/put-mapping/). The new limit applies only to documents indexed after the change. Documents indexed earlier are not updated, so values skipped under the old limit remain unsearchable until you reindex those documents.

Create an index containing a `sku` field that has an 8-character limit, and then index a document whose `sku` value is 13 characters long:

```json
PUT /test-ignore-update
{
  "mappings": {
    "properties": {
      "sku": {
        "type": "keyword",
        "ignore_above": 8
      }
    }
  }
}
```
{% include copy-curl.html %}

```json
PUT /test-ignore-update/_doc/1?refresh=true
{
  "sku": "SHOE-RUN-0042"
}
```
{% include copy-curl.html %}

Increase the limit to `20`:

```json
PUT /test-ignore-update/_mapping
{
  "properties": {
    "sku": {
      "type": "keyword",
      "ignore_above": 20
    }
  }
}
```
{% include copy-curl.html %}

Index a second document containing the same `sku` value:

```json
PUT /test-ignore-update/_doc/2?refresh=true
{
  "sku": "SHOE-RUN-0042"
}
```
{% include copy-curl.html %}

Search for the `sku` value:

```json
GET /test-ignore-update/_search
{
  "query": {
    "term": {
      "sku": "SHOE-RUN-0042"
    }
  }
}
```
{% include copy-curl.html %}

Only the second document is returned because the first document was indexed while the limit was `8`:

```json
{
  "took": 1,
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
        "_index": "test-ignore-update",
        "_id": "2",
        "_score": 1,
        "_source": {
          "sku": "SHOE-RUN-0042"
        }
      }
    ]
  }
}
```

## Choosing a limit

Lucene cannot store a single `keyword` term or a single `wildcard` doc value longer than 32,766 bytes in UTF-8 encoding. If a value exceeds this size and `ignore_above` does not skip it, OpenSearch rejects the entire document. Setting `ignore_above` protects against this failure because OpenSearch skips the oversized value and indexes the rest of the document.

The `ignore_above` limit and the Lucene limit are measured in different units. OpenSearch measures `ignore_above` in UTF-16 code units. For most text, one code unit is one character, but characters such as emoji take two code units and count as two toward the limit. Lucene measures the term size in UTF-8 bytes. Each UTF-16 code unit takes at most 3 bytes in UTF-8, so setting `ignore_above` to `10922` (32,766 divided by 3) ensures that any value OpenSearch indexes fits within the Lucene limit, regardless of the characters it contains. If your values contain only ASCII characters, which take 1 byte each, you can set the limit as high as `32766`.
