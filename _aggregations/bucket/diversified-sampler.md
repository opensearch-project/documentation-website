---
layout: default
title: Diversified sampler
parent: Bucket aggregations
nav_order: 40
redirect_from:
  - /query-dsl/aggregations/bucket/diversified-sampler/
---

# Diversified sampler aggregation

The `diversified_sampler` aggregation is a filtering aggregation that limits subaggregation processing to a sample of top-scoring documents while ensuring the sample contains diverse content. It extends the [`sampler` aggregation]({{site.url}}{{site.baseurl}}/aggregations/bucket/sampler/) by deduplicating documents that share a common field value, preventing any single category from dominating the sample.

Because the sample contains only the top-scoring documents, the subaggregation results focus on the most relevant matches and are not diluted by a long tail of weak matches. This aggregation is also useful when you need to ensure fair representation across different groups---for example, preventing a single prolific author from skewing analytics results or ensuring geographic diversity in location-based analysis. It also reduces the cost of expensive subaggregations like `significant_terms` by producing useful results from a smaller, more representative sample.

## Parameters

The `diversified_sampler` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Optional | String | The field used for deduplication. Must produce a single value per document. Either `field` or `script` is required. |
| `script` | Optional | Object | A script that generates the deduplication value. Either `field` or `script` is required. If you specify both, the script acts as a value script and receives the field value as `_value`. |
| `shard_size` | Optional | Integer | The maximum number of top-scoring documents collected on each shard. Default is `100`. |
| `max_docs_per_value` | Optional | Integer | The cap on how many documents sharing the same deduplication value can enter the sample on each shard. Default is `1`, so the sample contains at most one document for each value. |
| `execution_hint` | Optional | String | Controls how deduplication values are managed in memory. See [Execution hint](#execution-hint). |

### Execution hint

The following table lists the valid `execution_hint` values.

| Value | Description |
| :--- | :--- |
| `map` | Holds field values directly in memory. |
| `global_ordinals` | Uses Lucene's ordinal mappings for the field, offering better memory efficiency on high-cardinality fields. |
| `bytes_hash` | Stores a hash of each value rather than the value itself. May improve speed in some scenarios, but if two different values have the same hash, OpenSearch treats them as one value, which can shrink the sample. |

By default, OpenSearch uses `global_ordinals` if the field has ordinals and `map` otherwise. All three options produce the same sample unless `bytes_hash` treats two different values as duplicates because their hashes collide. They differ only in the type of value held in memory, and each option holds up to `shard_size` values. OpenSearch ignores the `execution_hint` if the chosen option does not apply to the field type, and an unrecognized value causes the request to fail.


The `diversified_sampler` aggregation can be nested under a `terms` aggregation. If the `terms` aggregation uses the `breadth_first` collect mode, OpenSearch replays the relevance scores of the deferred documents, so the sample is still based on the top-scoring documents.
{: .note}

## Example: Deduplicating by field

A sample of the top-matching documents can be dominated by a few prolific sources, such as a customer who places many similar orders. In the sample ecommerce data, one customer placed 103 of the 646 orders containing a dress. A plain `sampler` with a `shard_size` of `100` contains orders from only 16 customers.

The following example samples the top-matching orders containing a dress but allows only one order for each `customer_id`, so that the subaggregations reflect many customers equally:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "query": {
    "match": {
      "products.product_name": "dress"
    }
  },
  "aggs": {
    "unbiased_sample": {
      "diversified_sampler": {
        "shard_size": 100,
        "field": "customer_id"
      },
      "aggs": {
        "customers": {
          "cardinality": {
            "field": "customer_id"
          }
        },
        "top_manufacturers": {
          "terms": {
            "field": "manufacturer.keyword",
            "size": 3
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The sample contains 22 orders, one from each of the 22 customers who ordered a dress:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "aggregations": {
    "unbiased_sample": {
      "doc_count": 22,
      "top_manufacturers": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 17,
        "buckets": [
          {
            "key": "Tigress Enterprises",
            "doc_count": 7
          },
          {
            "key": "Low Tide Media",
            "doc_count": 6
          },
          {
            "key": "Oceanavigations",
            "doc_count": 6
          }
        ]
      },
      "customers": {
        "value": 22
      }
    }
  }
}
```
</details>

## Example: Deduplicating by script

Use a script to diversify on a combination of values. The following example allows at most three orders for each combination of `customer_gender` and `day_of_week`:

```json
GET /opensearch_dashboards_sample_data_ecommerce/_search
{
  "size": 0,
  "query": {
    "match": {
      "products.product_name": "dress"
    }
  },
  "aggs": {
    "unbiased_sample": {
      "diversified_sampler": {
        "shard_size": 100,
        "max_docs_per_value": 3,
        "script": {
          "lang": "painless",
          "source": "doc['customer_gender'].value + '-' + doc['day_of_week'].value"
        }
      },
      "aggs": {
        "by_day": {
          "terms": {
            "field": "day_of_week",
            "size": 7
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

The sample contains 27 orders: at most three for each combination of gender and day of the week. Because each day can contain orders from both female and male customers, some days contain more than three orders:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "aggregations": {
    "unbiased_sample": {
      "doc_count": 27,
      "by_day": {
        "doc_count_error_upper_bound": 0,
        "sum_other_doc_count": 0,
        "buckets": [
          {
            "key": "Thursday",
            "doc_count": 5
          },
          {
            "key": "Friday",
            "doc_count": 4
          },
          {
            "key": "Sunday",
            "doc_count": 4
          },
          {
            "key": "Tuesday",
            "doc_count": 4
          },
          {
            "key": "Wednesday",
            "doc_count": 4
          },
          {
            "key": "Monday",
            "doc_count": 3
          },
          {
            "key": "Saturday",
            "doc_count": 3
          }
        ]
      }
    }
  }
}
```
</details>

## Response body fields

The following table lists the response body fields.

| Field | Data type | Description |
| :--- | :--- | :--- |
| `doc_count` | Integer | The total number of documents in the diversified sample. |

## Limitations

The `diversified_sampler` aggregation has the following limitations:

- The `field` or `script` must produce a single value per document. Using a multi-valued field, such as `manufacturer.keyword` in the sample ecommerce data, causes the request to fail. To diversify on all values of a multi-valued field, use a script that combines them into one value, for example, `doc['manufacturer.keyword'].hashCode()`.
- Deduplication is applied independently on each shard, so documents with the same value on different shards are not deduplicated against each other.
- There is no specialized syntax for geographic or date-based diversity values (such as `7d` or `10km`). To diversify by geographic region or time interval, write a script that buckets the raw values---for example, `(int)(doc['geoip.location'].lat / 10)` for latitude bands or `doc['order_date'].value.dayOfWeek` for day-of-week grouping.
