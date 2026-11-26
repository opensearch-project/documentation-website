---
layout: default
title: Multi-terms
parent: Bucket aggregations
nav_order: 130
redirect_from:
  - /query-dsl/aggregations/bucket/multi-terms/
  - /query-dsl/aggregations/multi-terms/
---

# Multi-terms aggregation

The `multi_terms` aggregation creates buckets based on the combination of values from multiple fields. Each bucket represents a unique composite key, and documents are grouped by matching all specified term values simultaneously. This is useful when you need to find the top combinations ranked by document count or by a metric subaggregation.

The `multi_terms` aggregation consumes more memory than a single `terms` aggregation because it builds composite keys across multiple fields.
{: .note}

## Parameters

The `multi_terms` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `terms` | Required | Array | An array of objects, each specifying a field or script that provides one part of the composite key. |
| `size` | Optional | Integer | The number of composite buckets to return. Default is `10`. |
| `shard_size` | Optional | Integer | The number of candidate buckets collected from each shard. Higher values improve accuracy at the cost of memory. Must be greater than or equal to `size`. Default is higher than `size` to improve accuracy. |
| `min_doc_count` | Optional | Integer | The minimum document count required for a bucket to appear in the response. Default is `1`. |
| `order` | Optional | Object | Controls how buckets are sorted. Accepts `_count`, `_key`, or the name of a subaggregation metric. Default is `{"_count": "desc"}`. |
| `show_term_doc_count_error` | Optional | Boolean | When `true`, includes an error estimate for each term's document count. Default is `false`. |

Each object in the `terms` array supports the following parameters.

| Parameter | Data type | Description |
| :--- | :--- | :--- |
| `field` | String | The field to aggregate on. Must be a `keyword`, `numeric`, `ip`, `boolean`, or `date` field. Either `field` or `script` is required. |
| `script` | Object | A script that generates the values to aggregate on. Either `field` or `script` is required. When used with `field`, the script acts as a value script and receives the field value as `_value`. |
| `missing` | String or number | The value to use for documents that do not contain the field. By default, documents that do not contain the field are excluded from the aggregation. |
| `exclude` | String or array of strings | The values to exclude from the aggregation. Specify an array of exact values or a regular expression. |
| `format` | String | The format of the term in `key_as_string`, such as a date format for a `date` field. |
| `time_zone` | String | The time zone used to format `date` values, such as `+05:00` or `America/New_York`. Default is `UTC`. |
| `value_type` | String | The data type of the values produced by a `script`, such as `long` or `string`. |

## Example: Grouping by multiple fields

The following example identifies the most popular product categories for each gender by grouping orders on both `customer_gender` and `category` simultaneously. This query reveals the gender-category pairs that generate the most orders:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "gender_category": {
      "multi_terms": {
        "terms": [
          { "field": "customer_gender" },
          { "field": "category.keyword" }
        ],
        "size": 5
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains composite key buckets ordered by descending document count:

```json
{
  ...
  "aggregations": {
    "gender_category": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 756,
      "buckets": [
        {
          "key": [
            "MALE",
            "Men's Clothing"
          ],
          "key_as_string": "MALE|Men's Clothing",
          "doc_count": 1963
        },
        {
          "key": [
            "FEMALE",
            "Women's Clothing"
          ],
          "key_as_string": "FEMALE|Women's Clothing",
          "doc_count": 1903
        },
        {
          "key": [
            "FEMALE",
            "Women's Shoes"
          ],
          "key_as_string": "FEMALE|Women's Shoes",
          "doc_count": 1136
        },
        {
          "key": [
            "MALE",
            "Men's Shoes"
          ],
          "key_as_string": "MALE|Men's Shoes",
          "doc_count": 921
        },
        {
          "key": [
            "FEMALE",
            "Women's Accessories"
          ],
          "key_as_string": "FEMALE|Women's Accessories",
          "doc_count": 730
        }
      ]
    }
  }
}
```

## Example: Ordering by a subaggregation metric

The following example finds the gender-category combinations that produce the highest average order values:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "gender_category": {
      "multi_terms": {
        "terms": [
          { "field": "customer_gender" },
          { "field": "category.keyword" }
        ],
        "size": 3,
        "order": { "avg_price": "desc" }
      },
      "aggs": {
        "avg_price": {
          "avg": { "field": "taxful_total_price" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The response ranks buckets by the `avg_price` subaggregation rather than document count:

```json
{
  ...
  "aggregations": {
    "gender_category": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 5252,
      "buckets": [
        {
          "key": [
            "MALE",
            "Women's Accessories"
          ],
          "key_as_string": "MALE|Women's Accessories",
          "doc_count": 100,
          "avg_price": {
            "value": 101.21328125
          }
        },
        {
          "key": [
            "MALE",
            "Men's Shoes"
          ],
          "key_as_string": "MALE|Men's Shoes",
          "doc_count": 921,
          "avg_price": {
            "value": 97.41267983170466
          }
        },
        {
          "key": [
            "FEMALE",
            "Women's Shoes"
          ],
          "key_as_string": "FEMALE|Women's Shoes",
          "doc_count": 1136,
          "avg_price": {
            "value": 92.8513836927817
          }
        }
      ]
    }
  }
}
```

## Example: Handling documents with missing fields

By default, a document that does not contain one of the `terms` fields is excluded from the aggregation. To include these documents, specify a `missing` value for the field.

Create an index containing two `keyword` fields:

```json
PUT /products
{
  "mappings": {
    "properties": {
      "brand": { "type": "keyword" },
      "color": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

Index three documents. The second document does not contain a `color` field, and the third document does not contain a `brand` field:

```json
POST /products/_bulk?refresh=true
{ "index": {} }
{ "brand": "Acme", "color": "red" }
{ "index": {} }
{ "brand": "Acme" }
{ "index": {} }
{ "color": "blue" }
```
{% include copy-curl.html %}

The following request groups products by brand and color, assigning the value `unknown` to documents that do not contain a `color` field:

```json
GET /products/_search
{
  "size": 0,
  "aggs": {
    "brand_color": {
      "multi_terms": {
        "terms": [
          { "field": "brand" },
          { "field": "color", "missing": "unknown" }
        ]
      }
    }
  }
}
```
{% include copy-curl.html %}

The response contains a bucket for the document without a `color` field, using `unknown` as its color. The document without a `brand` field does not appear in any bucket because no `missing` value is specified for `brand`:

```json
{
  ...
  "aggregations": {
    "brand_color": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": [
            "Acme",
            "red"
          ],
          "key_as_string": "Acme|red",
          "doc_count": 1
        },
        {
          "key": [
            "Acme",
            "unknown"
          ],
          "key_as_string": "Acme|unknown",
          "doc_count": 1
        }
      ]
    }
  }
}
```

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count_error_upper_bound` | Integer | The maximum potential error in document counts for any bucket not included in the response. |
| `sum_other_doc_count` | Integer | The total document count of all buckets that did not make it into the top `size` results. |
| `buckets` | Array | The composite key buckets, sorted according to `order`. |
| `buckets.key` | Array | An array of values representing the composite key for this bucket, in the same order as the `terms` list. |
| `buckets.key_as_string` | String | The composite key formatted as a pipe-delimited string. |
| `buckets.doc_count` | Integer | The number of documents matching this key combination. |
