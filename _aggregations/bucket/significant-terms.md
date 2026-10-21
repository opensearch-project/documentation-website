---
layout: default
title: Significant terms
parent: Bucket aggregations
nav_order: 180
redirect_from:
  - /query-dsl/aggregations/bucket/significant-terms/
---

# Significant terms aggregation

The `significant_terms` aggregation identifies terms that occur unusually frequently in a subset of documents (foreground set) compared to a broader reference set (background set). By default, the background set targets all documents in the target indexes. You can narrow it with `background_filter`. Use this aggregation to retrieve the *most overrepresented* values, for which a plain `terms` aggregation that shows you the *most common* values is insufficient.

Each result bucket includes:

- `key`: The term value.
- `doc_count`: The number of foreground documents containing the term.
- `bg_count`: The number of background documents containing the term.
- `score`: Specifies how strongly the term stands out in the foreground relative to the background. For more information, see [Heuristics and scoring](#heuristics-and-scoring).

If the aggregation returns no buckets, it usually means that the foreground isn't filtered (for example, you used a `match_all` query) or the term distribution in the foreground is the same as in the background.
{: .note}

## Parameters

The `significant_terms` aggregation takes the following parameters.

| Parameter | Required/Optional | Data type | Description |
| :--- | :--- | :--- | :--- |
| `field` | Required | String | The field to analyze. Use an indexed `keyword`, integer, or other exact-value field. A `text` field can be used only if `fielddata` is enabled for it, which is not recommended. Floating-point fields are not supported. For more information, see [Field type considerations](#field-type-considerations) and [Limitations](#limitations). |
| `size` | Optional | Integer | The number of buckets to return. Default is `10`. |
| `shard_size` | Optional | Integer | The number of candidate terms that each shard returns. By default, each shard returns `2 * (size * 1.5 + 10)` terms. For more information, see [Size and shard size](#size-and-shard-size). |
| `min_doc_count` | Optional | Integer | The minimum number of foreground documents that must contain a term for it to be returned. Default is `3`. |
| `shard_min_doc_count` | Optional | Integer | The minimum number of foreground documents on a shard that must contain a term for the shard to return it as a candidate. Default is `0`. |
| `include` | Optional | String or array | Limits the terms that can create buckets. Accepts a regular expression or an array of exact values. |
| `exclude` | Optional | String or array | Prevents terms from creating buckets. Accepts a regular expression or an array of exact values. |
| `background_filter` | Optional | Object | A query that limits the background set. Default is all documents in the target indexes. For more information, see [Using a background filter to narrow the background set](#using-a-background-filter-to-narrow-the-background-set). |
| `execution_hint` | Optional | String | Controls how terms are collected. Valid values are `map` and `global_ordinals`. OpenSearch selects the best option automatically. For more information, see [Execution hint](#execution-hint). |
| `jlh`, `mutual_information`, `chi_square`, `gnd`, `percentage`, or `script_heuristic` | Optional | Object | The significance heuristic used to score terms. Specify one heuristic per aggregation. Default is `jlh`. For more information, see [Heuristics and scoring](#heuristics-and-scoring). |

## Basic example: Identify distinctive terms in high-value returns for an e-commerce application

Create an index that contains customer orders:

```json
PUT /retail_orders
{
  "mappings": {
    "properties": {
      "status":        { "type": "keyword" },
      "order_total":   { "type": "double" },
      "payment_method": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

Ingest sample documents into the index:

```json
POST _bulk?refresh
{ "index": { "_index": "retail_orders" } }
{ "status":"RETURNED", "order_total": 950, "payment_method":"gift_card" }
{ "index": { "_index": "retail_orders" } }
{ "status":"RETURNED", "order_total": 720, "payment_method":"gift_card" }
{ "index": { "_index": "retail_orders" } }
{ "status":"RETURNED", "order_total": 540, "payment_method":"gift_card" }
{ "index": { "_index": "retail_orders" } }
{ "status":"RETURNED", "order_total": 820, "payment_method":"credit_card" }
{ "index": { "_index": "retail_orders" } }
{ "status":"RETURNED", "order_total": 500, "payment_method":"paypal" }
{ "index": { "_index": "retail_orders" } }
{ "status":"DELIVERED", "order_total": 130, "payment_method":"credit_card" }
{ "index": { "_index": "retail_orders" } }
{ "status":"DELIVERED", "order_total": 75,  "payment_method":"paypal" }
{ "index": { "_index": "retail_orders" } }
{ "status":"DELIVERED", "order_total": 260, "payment_method":"paypal" }
{ "index": { "_index": "retail_orders" } }
{ "status":"DELIVERED", "order_total": 45,  "payment_method":"credit_card" }
{ "index": { "_index": "retail_orders" } }
{ "status":"DELIVERED", "order_total": 310, "payment_method":"credit_card" }
{ "index": { "_index": "retail_orders" } }
{ "status":"DELIVERED", "order_total": 220, "payment_method":"credit_card" }
{ "index": { "_index": "retail_orders" } }
{ "status":"DELIVERED", "order_total": 410, "payment_method":"paypal" }
```
{% include copy-curl.html %}

Run the following query to identify `payment_method` values that are unusually common among orders that were returned and cost over $500, compared to the entire index:

```json
GET /retail_orders/_search
{
  "size": 0,
  "query": {
    "bool": {
      "filter": [
        { "term": { "status": "RETURNED" } },
        { "range": { "order_total": { "gte": 500 } } }
      ]
    }
  },
  "aggs": {
    "payment_signals": {
      "significant_terms": {
        "field": "payment_method"
      }
    }
  }
}
```
{% include copy-curl.html %}

The returned aggregation shows that among the five high-value returns, `gift_card` appears 3 times (60%), compared to 3 out of 12 times in the entire index (25%). As a result, it is flagged as the most overrepresented payment method:

```json
{
  ...
  "hits": {
    "total": {
      "value": 5,
      "relation": "eq"
    },
    "max_score": null,
    "hits": []
  },
  "aggregations": {
    "payment_signals": {
      "doc_count": 5,
      "bg_count": 12,
      "buckets": [
        {
          "key": "gift_card",
          "doc_count": 3,
          "score": 0.84,
          "bg_count": 3
        }
      ]
    }
  }
}
```

## Multi-set analysis

You can determine the unusual values for each category by first grouping documents into buckets and then running a `significant_terms` aggregation within each bucket.

### Example: Unusual cancellation reasons per region

The following example uses a `rides` index containing canceled ride requests. Create the index:

```json
PUT rides
{
  "mappings": {
    "properties": {
      "region": {
        "type": "keyword"
      },
      "cancel_reason": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the following documents, which contain 7 canceled rides downtown, 6 at the airport, and 4 in the suburbs:

```json
POST _bulk?refresh
{ "index": { "_index": "rides", "_id": "1" } }
{ "region": "airport", "cancel_reason": "could_not_find_rider" }
{ "index": { "_index": "rides", "_id": "2" } }
{ "region": "airport", "cancel_reason": "could_not_find_rider" }
{ "index": { "_index": "rides", "_id": "3" } }
{ "region": "airport", "cancel_reason": "could_not_find_rider" }
{ "index": { "_index": "rides", "_id": "4" } }
{ "region": "airport", "cancel_reason": "changed_plans" }
{ "index": { "_index": "rides", "_id": "5" } }
{ "region": "airport", "cancel_reason": "changed_plans" }
{ "index": { "_index": "rides", "_id": "6" } }
{ "region": "airport", "cancel_reason": "long_wait" }
{ "index": { "_index": "rides", "_id": "7" } }
{ "region": "downtown", "cancel_reason": "long_wait" }
{ "index": { "_index": "rides", "_id": "8" } }
{ "region": "downtown", "cancel_reason": "long_wait" }
{ "index": { "_index": "rides", "_id": "9" } }
{ "region": "downtown", "cancel_reason": "long_wait" }
{ "index": { "_index": "rides", "_id": "10" } }
{ "region": "downtown", "cancel_reason": "long_wait" }
{ "index": { "_index": "rides", "_id": "11" } }
{ "region": "downtown", "cancel_reason": "changed_plans" }
{ "index": { "_index": "rides", "_id": "12" } }
{ "region": "downtown", "cancel_reason": "changed_plans" }
{ "index": { "_index": "rides", "_id": "13" } }
{ "region": "downtown", "cancel_reason": "could_not_find_rider" }
{ "index": { "_index": "rides", "_id": "14" } }
{ "region": "suburbs", "cancel_reason": "driver_cancelled" }
{ "index": { "_index": "rides", "_id": "15" } }
{ "region": "suburbs", "cancel_reason": "driver_cancelled" }
{ "index": { "_index": "rides", "_id": "16" } }
{ "region": "suburbs", "cancel_reason": "driver_cancelled" }
{ "index": { "_index": "rides", "_id": "17" } }
{ "region": "suburbs", "cancel_reason": "changed_plans" }
```
{% include copy-curl.html %}

The following request groups rides by region using a `terms` aggregation and, within each region, runs `significant_terms` to identify the cancellation reasons that are disproportionately common in that region:

```json
GET rides/_search
{
  "size": 0,
  "aggs": {
    "by_region": {
      "terms": {
        "field": "region"
      },
      "aggs": {
        "odd_cancellations": {
          "significant_terms": {
            "field": "cancel_reason"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Each region has its own overrepresented reason: downtown riders wait too long, riders at the airport can't be found by drivers, and drivers in the suburbs cancel more often. The suburbs have the fewest rides but the highest score because their reason is the most overrepresented: `driver_cancelled` accounts for three of the four suburban cancellations but only 3 of all 17 cancellations. Reasons that occur in fewer than three rides in a region, such as `could_not_find_rider` downtown, are not returned because of the default `min_doc_count` of `3`:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "aggregations": {
    "by_region": {
      "doc_count_error_upper_bound": 0,
      "sum_other_doc_count": 0,
      "buckets": [
        {
          "key": "downtown",
          "doc_count": 7,
          "odd_cancellations": {
            "doc_count": 7,
            "bg_count": 17,
            "buckets": [
              {
                "key": "long_wait",
                "doc_count": 4,
                "score": 0.5387755102040814,
                "bg_count": 5
              }
            ]
          }
        },
        {
          "key": "airport",
          "doc_count": 6,
          "odd_cancellations": {
            "doc_count": 6,
            "bg_count": 17,
            "buckets": [
              {
                "key": "could_not_find_rider",
                "doc_count": 3,
                "score": 0.5625,
                "bg_count": 4
              }
            ]
          }
        },
        {
          "key": "suburbs",
          "doc_count": 4,
          "odd_cancellations": {
            "doc_count": 4,
            "bg_count": 17,
            "buckets": [
              {
                "key": "driver_cancelled",
                "doc_count": 3,
                "score": 2.4375,
                "bg_count": 3
              }
            ]
          }
        }
      ]
    }
  }
}
```
</details>

### Example: Hotspots on a map

You can use a `geotile_grid` aggregation to divide a map into zoom-level tiles and then run a `significant_terms` aggregation within each tile to identify local outliers. Higher `precision` produces smaller tiles, such as street or city blocks, while lower `precision` produces larger tiles, such as a city or region.

The following example uses a `field_ops` index containing field incidents reported at sites in three cities. Create the index and map `site.location` as a `geo_point`:

```json
PUT field_ops
{
  "mappings": {
    "properties": {
      "site": {
        "properties": {
          "name": {
            "type": "text"
          },
          "location": {
            "type": "geo_point"
          }
        }
      },
      "issue": {
        "type": "keyword"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the following incidents. Power outages occur in every city:

```json
POST _bulk?refresh
{ "index": { "_index": "field_ops", "_id": "1" } }
{ "site": { "name": "Seattle site 1", "location": { "lat": 47.61, "lon": -122.33 } }, "issue": "FIBER_CUT" }
{ "index": { "_index": "field_ops", "_id": "2" } }
{ "site": { "name": "Seattle site 2", "location": { "lat": 47.62, "lon": -122.34 } }, "issue": "FIBER_CUT" }
{ "index": { "_index": "field_ops", "_id": "3" } }
{ "site": { "name": "Seattle site 3", "location": { "lat": 47.63, "lon": -122.35 } }, "issue": "FIBER_CUT" }
{ "index": { "_index": "field_ops", "_id": "4" } }
{ "site": { "name": "Seattle site 4", "location": { "lat": 47.64, "lon": -122.36 } }, "issue": "POWER_OUTAGE" }
{ "index": { "_index": "field_ops", "_id": "5" } }
{ "site": { "name": "Seattle site 5", "location": { "lat": 47.65, "lon": -122.37 } }, "issue": "POWER_OUTAGE" }
{ "index": { "_index": "field_ops", "_id": "6" } }
{ "site": { "name": "Seattle site 6", "location": { "lat": 47.66, "lon": -122.38 } }, "issue": "VANDALISM" }
{ "index": { "_index": "field_ops", "_id": "7" } }
{ "site": { "name": "Denver site 1", "location": { "lat": 39.74, "lon": -104.99 } }, "issue": "VANDALISM" }
{ "index": { "_index": "field_ops", "_id": "8" } }
{ "site": { "name": "Denver site 2", "location": { "lat": 39.75, "lon": -105.0 } }, "issue": "VANDALISM" }
{ "index": { "_index": "field_ops", "_id": "9" } }
{ "site": { "name": "Denver site 3", "location": { "lat": 39.76, "lon": -105.01 } }, "issue": "VANDALISM" }
{ "index": { "_index": "field_ops", "_id": "10" } }
{ "site": { "name": "Denver site 4", "location": { "lat": 39.77, "lon": -105.02 } }, "issue": "POWER_OUTAGE" }
{ "index": { "_index": "field_ops", "_id": "11" } }
{ "site": { "name": "Denver site 5", "location": { "lat": 39.78, "lon": -105.03 } }, "issue": "EQUIPMENT_FAILURE" }
{ "index": { "_index": "field_ops", "_id": "12" } }
{ "site": { "name": "Phoenix site 1", "location": { "lat": 33.45, "lon": -112.07 } }, "issue": "EQUIPMENT_FAILURE" }
{ "index": { "_index": "field_ops", "_id": "13" } }
{ "site": { "name": "Phoenix site 2", "location": { "lat": 33.46, "lon": -112.08 } }, "issue": "EQUIPMENT_FAILURE" }
{ "index": { "_index": "field_ops", "_id": "14" } }
{ "site": { "name": "Phoenix site 3", "location": { "lat": 33.47, "lon": -112.09 } }, "issue": "EQUIPMENT_FAILURE" }
{ "index": { "_index": "field_ops", "_id": "15" } }
{ "site": { "name": "Phoenix site 4", "location": { "lat": 33.48, "lon": -112.1 } }, "issue": "POWER_OUTAGE" }
{ "index": { "_index": "field_ops", "_id": "16" } }
{ "site": { "name": "Phoenix site 5", "location": { "lat": 33.49, "lon": -112.11 } }, "issue": "POWER_OUTAGE" }
```
{% include copy-curl.html %}

The following request divides the sites into tiles and identifies the `issue` values that are unusually frequent in each tile:

```json
GET field_ops/_search
{
  "size": 0,
  "aggs": {
    "tiles": {
      "geotile_grid": {
        "field": "site.location",
        "precision": 6
      },
      "aggs": {
        "odd_issues": {
          "significant_terms": {
            "field": "issue"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Each city falls into its own tile, and each tile has its own overrepresented issue: vandalism in Denver (tile `6/13/24`), equipment failures in Phoenix (tile `6/12/25`), and fiber cuts in Seattle (tile `6/10/22`). Power outages are common everywhere, so they are not returned:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "aggregations": {
    "tiles": {
      "buckets": [
        {
          "key": "6/10/22",
          "doc_count": 6,
          "odd_issues": {
            "doc_count": 6,
            "bg_count": 16,
            "buckets": [
              {
                "key": "FIBER_CUT",
                "doc_count": 3,
                "score": 0.8333333333333333,
                "bg_count": 3
              }
            ]
          }
        },
        {
          "key": "6/13/24",
          "doc_count": 5,
          "odd_issues": {
            "doc_count": 5,
            "bg_count": 16,
            "buckets": [
              {
                "key": "VANDALISM",
                "doc_count": 3,
                "score": 0.84,
                "bg_count": 4
              }
            ]
          }
        },
        {
          "key": "6/12/25",
          "doc_count": 5,
          "odd_issues": {
            "doc_count": 5,
            "bg_count": 16,
            "buckets": [
              {
                "key": "EQUIPMENT_FAILURE",
                "doc_count": 3,
                "score": 0.84,
                "bg_count": 4
              }
            ]
          }
        }
      ]
    }
  }
}
```
</details>

### Example: Significant terms over time

To find how significant terms change over time, use a `date_histogram` aggregation as the parent. This example and the [background filter example](#example-compare-toronto-to-the-rest-of-canada) use a `news` index containing article topics from Canadian and US cities published in October 2025. Create the index:

```json
PUT news
{
  "mappings": {
    "properties": {
      "city": {
        "type": "keyword"
      },
      "country": {
        "type": "keyword"
      },
      "topic": {
        "type": "keyword"
      },
      "publish_date": {
        "type": "date"
      }
    }
  }
}
```
{% include copy-curl.html %}

Index the following documents. Hockey is a common topic across Canada but does not appear in the US articles:

```json
POST _bulk?refresh
{ "index": { "_index": "news", "_id": "1" } }
{ "city": "Toronto", "country": "Canada", "topic": "transit", "publish_date": "2025-10-06" }
{ "index": { "_index": "news", "_id": "2" } }
{ "city": "Toronto", "country": "Canada", "topic": "transit", "publish_date": "2025-10-07" }
{ "index": { "_index": "news", "_id": "3" } }
{ "city": "Toronto", "country": "Canada", "topic": "transit", "publish_date": "2025-10-13" }
{ "index": { "_index": "news", "_id": "4" } }
{ "city": "Toronto", "country": "Canada", "topic": "transit", "publish_date": "2025-10-14" }
{ "index": { "_index": "news", "_id": "5" } }
{ "city": "Toronto", "country": "Canada", "topic": "hockey", "publish_date": "2025-10-15" }
{ "index": { "_index": "news", "_id": "6" } }
{ "city": "Toronto", "country": "Canada", "topic": "hockey", "publish_date": "2025-10-16" }
{ "index": { "_index": "news", "_id": "7" } }
{ "city": "Toronto", "country": "Canada", "topic": "hockey", "publish_date": "2025-10-17" }
{ "index": { "_index": "news", "_id": "8" } }
{ "city": "Toronto", "country": "Canada", "topic": "weather", "publish_date": "2025-10-08" }
{ "index": { "_index": "news", "_id": "9" } }
{ "city": "Vancouver", "country": "Canada", "topic": "hockey", "publish_date": "2025-10-13" }
{ "index": { "_index": "news", "_id": "10" } }
{ "city": "Montreal", "country": "Canada", "topic": "hockey", "publish_date": "2025-10-14" }
{ "index": { "_index": "news", "_id": "11" } }
{ "city": "Calgary", "country": "Canada", "topic": "hockey", "publish_date": "2025-10-15" }
{ "index": { "_index": "news", "_id": "12" } }
{ "city": "Vancouver", "country": "Canada", "topic": "hockey", "publish_date": "2025-10-16" }
{ "index": { "_index": "news", "_id": "13" } }
{ "city": "Montreal", "country": "Canada", "topic": "hockey", "publish_date": "2025-10-17" }
{ "index": { "_index": "news", "_id": "14" } }
{ "city": "Calgary", "country": "Canada", "topic": "hockey", "publish_date": "2025-10-13" }
{ "index": { "_index": "news", "_id": "15" } }
{ "city": "Vancouver", "country": "Canada", "topic": "weather", "publish_date": "2025-10-09" }
{ "index": { "_index": "news", "_id": "16" } }
{ "city": "Montreal", "country": "Canada", "topic": "weather", "publish_date": "2025-10-10" }
{ "index": { "_index": "news", "_id": "17" } }
{ "city": "Calgary", "country": "Canada", "topic": "weather", "publish_date": "2025-10-14" }
{ "index": { "_index": "news", "_id": "18" } }
{ "city": "Vancouver", "country": "Canada", "topic": "weather", "publish_date": "2025-10-15" }
{ "index": { "_index": "news", "_id": "19" } }
{ "city": "Montreal", "country": "Canada", "topic": "transit", "publish_date": "2025-10-20" }
{ "index": { "_index": "news", "_id": "20" } }
{ "city": "Calgary", "country": "Canada", "topic": "elections", "publish_date": "2025-10-06" }
{ "index": { "_index": "news", "_id": "21" } }
{ "city": "Chicago", "country": "United States", "topic": "elections", "publish_date": "2025-10-07" }
{ "index": { "_index": "news", "_id": "22" } }
{ "city": "Boston", "country": "United States", "topic": "elections", "publish_date": "2025-10-08" }
{ "index": { "_index": "news", "_id": "23" } }
{ "city": "Denver", "country": "United States", "topic": "elections", "publish_date": "2025-10-09" }
{ "index": { "_index": "news", "_id": "24" } }
{ "city": "Denver", "country": "United States", "topic": "baseball", "publish_date": "2025-10-24" }
{ "index": { "_index": "news", "_id": "25" } }
{ "city": "Chicago", "country": "United States", "topic": "baseball", "publish_date": "2025-10-20" }
{ "index": { "_index": "news", "_id": "26" } }
{ "city": "Boston", "country": "United States", "topic": "baseball", "publish_date": "2025-10-21" }
```
{% include copy-curl.html %}

The following request groups the articles by week and finds the topics that are unusually common in each week compared to the whole month:

```json
GET news/_search
{
  "size": 0,
  "aggs": {
    "weeks": {
      "date_histogram": {
        "field": "publish_date",
        "calendar_interval": "week"
      },
      "aggs": {
        "trending_topics": {
          "significant_terms": {
            "field": "topic"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Each week has its own trending topic: elections in the first week, hockey in the second, and baseball in the third. In the first week, `weather` is also returned with a lower score because it is somewhat more common in that week than in the whole month:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "aggregations": {
    "weeks": {
      "buckets": [
        {
          "key_as_string": "2025-10-06T00:00:00.000Z",
          "key": 1759708800000,
          "doc_count": 9,
          "trending_topics": {
            "doc_count": 9,
            "bg_count": 26,
            "buckets": [
              {
                "key": "elections",
                "doc_count": 4,
                "score": 0.8395061728395059,
                "bg_count": 4
              },
              {
                "key": "weather",
                "doc_count": 3,
                "score": 0.24444444444444438,
                "bg_count": 5
              }
            ]
          }
        },
        {
          "key_as_string": "2025-10-13T00:00:00.000Z",
          "key": 1760313600000,
          "doc_count": 13,
          "trending_topics": {
            "doc_count": 13,
            "bg_count": 26,
            "buckets": [
              {
                "key": "hockey",
                "doc_count": 9,
                "score": 0.6923076923076923,
                "bg_count": 9
              }
            ]
          }
        },
        {
          "key_as_string": "2025-10-20T00:00:00.000Z",
          "key": 1760918400000,
          "doc_count": 4,
          "trending_topics": {
            "doc_count": 4,
            "bg_count": 26,
            "buckets": [
              {
                "key": "baseball",
                "doc_count": 3,
                "score": 4.125,
                "bg_count": 3
              }
            ]
          }
        }
      ]
    }
  }
}
```
</details>

## Using a background filter to narrow the background set

By default, the background contains the entire index. Use a `background_filter` to restrict background documents for more precise results.

### Example: Compare Toronto to the rest of Canada

The following example uses the `news` index created in the [preceding example](#example-significant-terms-over-time).

The following example filters the foreground to articles from Toronto and sets a `background_filter` that contains only Canadian articles. The `significant_terms` aggregation highlights the topics that are unusually frequent in Toronto compared to the rest of Canada:

```json
GET news/_search
{
  "size": 0,
  "query": {
    "term": {
      "city": "Toronto"
    }
  },
  "aggs": {
    "unusual_topics": {
      "significant_terms": {
        "field": "topic",
        "background_filter": {
          "term": {
            "country": "Canada"
          }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Only `transit` is returned. Without the `background_filter`, the background also contains the US articles, in which hockey never appears, so `hockey` is also returned as significant for Toronto. With the Canadian background, hockey is no more common in Toronto than elsewhere in Canada:

<details markdown="block">
  <summary>
    Response
  </summary>
  {: .text-delta}

```json
{
  "aggregations": {
    "unusual_topics": {
      "doc_count": 8,
      "bg_count": 20,
      "buckets": [
        {
          "key": "transit",
          "doc_count": 4,
          "score": 0.5,
          "bg_count": 5
        }
      ]
    }
  }
}
```
</details>

Using a custom background requires additional processing because the background frequency for each candidate term must be computed by applying the filter. This can be slower than using the default index-wide counts.
{: .warning}

## Field type considerations

`significant_terms` aggregations work best on exact-value fields (for example, `keyword` or `numeric`). Running a `significant_terms` aggregation on a `text` field is not recommended: it requires enabling `fielddata` on the field and loads every unique term into memory, which can use a large amount of memory. For analyzed text, use [`significant_text` aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/significant-text/), which are designed for full-text fields and support the same significance heuristics.

## Heuristics and scoring

The `score` ranks terms based on how much their foreground frequency differs from the background frequency. It has no units and is meaningful only for comparison within the same request and heuristic.

You can select one heuristic per request by specifying it under `significant_terms`. The following heuristics are supported.

### JLH

The JLH heuristic is the default and is suitable for most general-purpose scenarios. It balances both the absolute frequency of a term and its relative overrepresentation compared to the background set, favoring terms that increase both *absolutely* and *relatively*.

```json
"significant_terms": {
  "field": "payment_method",
  "jlh": {}
}
```

#### JLH scoring

The JLH score is calculated as follows:

`fg_pct = doc_count / foreground_total` and `bg_pct = bg_count / background_total`. JLH ≈ `(fg_pct − bg_pct) * (fg_pct / bg_pct)`. 

Because the absolute change is multiplied by the ratio of the foreground and background percentages, the same absolute increase produces a higher score for a term with a small background share than for a term with a large background share. For example, an increase from 1% to 2% of documents scores higher than an increase from 50% to 51%.

If a term's foreground percentage is less than or equal to its background percentage, its JLH score is `0`, so the term is not returned.

#### Score example calculation using JLH

Suppose that your foreground set (high-value returns) contains `2,000` orders, and the background set (all orders) contains `120,000` orders. Consider a single term in the `significant_terms` aggregation, which has the following counts:

- `doc_count = 160`
- `bg_count = 3,200`

Percentages of documents containing the term are calculated as follows:

- `fg_pct = 160 / 2000 = 0.08`
- `bg_pct = 3200 / 120000 ≈ 0.026666…`

JLH ≈ `(0.08 − 0.026666…) * (0.08 / 0.026666…) ≈ 0.053333… * 3 ≈ 0.16`

This positive score means that the searched term is notably more prevalent in high-value returns than it is overall. Scores are relative: use them to rank terms, not as absolute probabilities.

### Mutual information

Mutual information (MI) prefers frequent terms and identifies popular but still distinctive terms. Set `include_negatives: false` to ignore terms that are less common in the foreground than the background. If your background is not a superset of the foreground, set `background_is_superset: false`:

```json
"significant_terms": {
  "field": "product.keyword",
  "mutual_information": {
    "include_negatives": false,
    "background_is_superset": true
  }
}
```

### Chi-square

Chi-square is a statistical test that measures how much the observed frequency of a term in a subset (foreground) deviates from the expected frequency based on a reference set (background). Similarly to [MI](#mutual-information), chi-square supports `include_negatives` and `background_is_superset`:

```json
"significant_terms": {
  "field": "error.keyword",
  "chi_square": { "include_negatives": false }
}
```

### Google Normalized Distance

Google Normalized Distance (GND) favors strong co-occurrence. It is useful for synonym discovery or items that tend to appear together. GND supports the `background_is_superset` parameter:

```json
"significant_terms": {
  "field": "tag.keyword",
  "gnd": { "background_is_superset": true }
}
```

### Percentage

Percentage sorts terms by the `doc_count`/`bg_count` ratio and identifies the number of foreground hits that a term has relative to its background hits. It doesn't account for the overall sizes of the two sets, so very rare terms can dominate. For example, a term that occurs in only one document, which is also in the foreground, has a score of `1`, the highest possible. To prevent single-occurrence terms from dominating the results, increase `min_doc_count` and `shard_min_doc_count`, for example, to `10`:

```json
"significant_terms": {
  "field": "sku.keyword",
  "min_doc_count": 10,
  "shard_min_doc_count": 10,
  "percentage": {}
}
```

### Scripted heuristic

To provide a custom heuristic formula, use the following variables:

- `_subset_freq`: The number of documents containing the term in the foreground set.
- `_superset_freq`: The number of documents containing the term in the background set.
- `_subset_size`: The total number of documents in the foreground set.
- `_superset_size`: The total number of documents in the background set.

The following request runs a `significant_terms` aggregation on `field.keyword` using a custom script heuristic to score terms based on their frequency in the foreground relative to the background:

```json
"significant_terms": {
  "field": "field.keyword",
  "script_heuristic": {
    "script": {
      "lang": "painless",
      "source": "params._subset_freq / (params._superset_freq - params._subset_freq + 1)"
    }
  }
}
```

### Choosing a heuristic

The heuristics differ in the kinds of terms they favor:

- Mutual information favors frequent terms, even if they are also frequent in the background. In natural language text, it can select stopwords, but it rarely selects very rare terms such as misspellings.
- GND favors terms that frequently co-occur with the foreground and avoids stopwords. However, it tends to select very rare terms, such as misspellings.
- Chi-square and JLH fall between these two.

No heuristic is best for every dataset. Try several heuristics on your data and compare the results.

## Size and shard size

The `size` parameter controls how many buckets the aggregation returns. Each shard first selects its own candidate terms using local statistics, and the coordinating node merges the candidates from all shards into the final list. Because a shard cannot know the global frequency of a term, a term that belongs in the final results can be missing, or its counts can be slightly inaccurate.

To reduce these errors, each shard returns more candidates than the requested `size`. By default, it returns `2 * (size * 1.5 + 10)` terms, which is twice as many as a `terms` aggregation returns. More candidates are needed because a term that is significant overall might occur only once or twice on each shard, where it looks the same as a term that is not significant.

To control the number of candidates, set `shard_size`. A `shard_size` value much larger than `size` can improve the quality of the results, but it also increases memory usage and network traffic.

## Minimum document count

The `min_doc_count` parameter excludes terms that occur in fewer than the specified number of foreground documents. The default value of `3` requires some evidence that a term is meaningful: a term found in only one document is often a typo or another one-time occurrence, so setting `min_doc_count` to `1` is generally not recommended.

The `min_doc_count` threshold is applied only after the coordinating node merges the shard results. Each shard selects candidates based on its local scores, so low-frequency terms with high local scores can take the place of terms that would have met `min_doc_count` globally. To return these terms, increase `shard_size`.

The `shard_min_doc_count` parameter filters candidates on each shard before they are sent to the coordinating node. Use it to discard terms, such as misspellings, that are unlikely to reach `min_doc_count` even after the shard counts are merged. Set `shard_min_doc_count` well below `min_doc_count` divided by the number of shards. Otherwise, significant terms can be filtered out on individual shards.

## Filtering values

You can use the `include` and `exclude` parameters to limit the terms for which buckets are created. These parameters accept a regular expression or an array of exact values and work the same way as in the `terms` aggregation. For more information, see [Filtering values to a subset]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms/#filtering-values-to-a-subset).

## Collect mode

To limit memory usage, the `significant_terms` aggregation always computes subaggregations in `breadth_first` mode. For more information about collect modes, see [Collect mode]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms/#collect-mode).

## Execution hint

The `execution_hint` parameter accepts `map` and `global_ordinals` and works the same way as in the `terms` aggregation. OpenSearch selects the mode automatically, so you rarely need to set it. For more information, see [Execution hint]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms/#execution-hint).

## Limitations

The `significant_terms` aggregation has the following limitations:

- The terms must be indexed values. You cannot use a script to generate terms because calculating background frequencies for script-generated terms would require running the script on every document in the index.
- Floating-point fields are not supported. Integer fields, such as account or category numbers, can be useful to analyze, but floating-point fields usually contain quantities, for which individual values are not meaningful terms.
- Don't use `significant_terms` as the top-level aggregation when the query matches all documents. In this case, the foreground and background sets are identical, so no terms stand out.
- Avoid placing large subaggregations under `significant_terms`. Each shard produces many candidate terms, and most of them are discarded after the shard results are merged, so computing subaggregations for all candidates is expensive. Instead, run one search to retrieve the significant terms and a second search that runs the subaggregations on only those terms.
- Document counts are approximate. A `doc_count` value can be too low if some shards did not return the term among their candidates, and a `bg_count` value can be too high because background counts can include deleted documents. To improve accuracy, increase `shard_size`.
