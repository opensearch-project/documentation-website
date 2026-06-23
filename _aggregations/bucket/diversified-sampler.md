---
layout: default
title: Diversified sampler
parent: Bucket aggregations
nav_order: 40
redirect_from:
  - /query-dsl/aggregations/bucket/diversified-sampler/
---

# Diversified sampler aggregations

The `diversified_sampler` aggregation is a filtering aggregation that limits subaggregation processing to a sample of top-scoring documents while ensuring the sample contains diverse content. It extends the [`sampler` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/sampler/) by deduplicating documents that share a common field value, preventing any single category from dominating the sample.

This aggregation is useful when you need to ensure fair representation across different groups---for example, preventing a single prolific author from skewing analytics results or ensuring geographic diversity in location-based analysis. It also reduces the cost of expensive subaggregations like `significant_terms` by producing useful results from a smaller, more representative sample.

## Parameters

The `diversified_sampler` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Optional | String | The field used for deduplication. Must produce a single value per document. Mutually exclusive with `script`. |
| `script` | Optional | Object | A script that generates the deduplication value. Mutually exclusive with `field`. |
| `shard_size` | Optional | Integer | The maximum number of top-scoring documents collected on each shard. Default is `100`. |
| `max_docs_per_value` | Optional | Integer | The cap on how many documents sharing the same deduplication value can enter the sample. Default is `1`. |
| `execution_hint` | Optional | String | Controls how deduplication values are managed in memory. See [Execution hint](#execution-hint). |

### Execution hint

The following table lists the valid `execution_hint` values.

| Value | Description |
| :--- | :--- |
| `map` | Holds field values directly in memory. |
| `global_ordinals` | Uses Lucene's ordinal mappings for the field, offering better memory efficiency on high-cardinality fields. |
| `bytes_hash` | Stores a hash of each value rather than the value itself. May improve speed in some scenarios but risks incorrect deduplication from hash collisions. |

OpenSearch may ignore the `execution_hint` if the chosen strategy is not applicable to the field type.
{: .note}


## Example: Deduplicating by field

The following example samples orders from the ecommerce dataset, limiting to 50 documents per `customer_gender` value, and then runs a `terms` subaggregation on the sample to see the category distribution:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "my_sample": {
      "diversified_sampler": {
        "shard_size": 200,
        "field": "customer_gender",
        "max_docs_per_value": 50
      },
      "aggs": {
        "categories": {
          "terms": {
            "field": "category.keyword"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example: Deduplicating by script

You can use a script to generate deduplication values when you need to diversify on a computed or combined field. The following example diversifies by `customer_gender` using a script and limits to 3 documents per value:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "aggs": {
    "my_sample": {
      "diversified_sampler": {
        "shard_size": 200,
        "max_docs_per_value": 3,
        "script": {
          "lang": "painless",
          "source": "doc['customer_gender'].value"
        }
      },
      "aggs": {
        "categories": {
          "terms": {
            "field": "category.keyword"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Example response

```json
{
  "took": 65,
  "timed_out": false,
  "_shards": {
    "total": 1,
    "successful": 1,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 4675,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "my_sample": {
      "doc_count": 6,
      "categories": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [
          {
            "key": "Men's Clothing",
            "doc_count": 3
          },
          {
            "key": "Women's Clothing",
            "doc_count": 3
          },
          {
            "key": "Women's Shoes",
            "doc_count": 2
          },
          {
            "key": "Men's Accessories",
            "doc_count": 1
          }
        ]
      }
    }
  }
}
```

With `max_docs_per_value` set to `3` and two distinct gender values, the sample contains at most 6 documents (3 per value), ensuring balanced representation in the subaggregation results.

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count` | Integer | The total number of documents in the diversified sample. |

## Limitations

- The `field` or `script` must produce a single value per document. Multi-valued fields are not supported and using them causes an error.
- Deduplication is applied independently on each shard, so documents with the same value on different shards are not deduplicated against each other.
- This aggregation cannot be nested under a `terms` aggregation that uses `breadth_first` collect mode because breadth-first collection discards relevance scores that the diversified sampler requires.
- There is no specialized syntax for geographic or date-based diversity values (such as `"7d"` or `"10km"`). To diversify by geographic region or time interval, write a script that buckets the raw values---for example, `(int)(doc['geoip.location'].lat / 10)` for latitude bands or `doc['order_date'].value.dayOfWeek` for day-of-week grouping.
