---
layout: default
title: Significant terms
parent: Bucket aggregations
nav_order: 180
redirect_from:
  - /query-dsl/aggregations/bucket/significant-terms/
---

# Significant terms aggregations

The `significant_terms` aggregation identifies terms that occur unusually frequently in a subset of documents (foreground set) compared to a broader reference set (background set). Use this aggregation to retrieve the *most over‑represented* values, for which a plain `terms` aggregation that shows you the *most common* values is not sufficient.

- Foreground set: the documents matched by your query.
- Background set: by default, all documents in the target indexes. You can narrow it with `background_filter`.

Each result bucket includes:

- `key`: The term value.
- `doc_count`: The number of foreground documents containing the term.
- `bg_count`: The number of background documents containing the term.
- `score`: Specifies how strongly the term stands out in the foreground relative to the background. For more information, see [Heuristics and scoring](#heuristics-and-scoring).

If the aggregation returns no buckets, it usually means that the foreground isn't filtered (for example, you used a `match_all` query) or the term distribution in the foreground is the same as in the background.
{: .note}

## Basic example: Identify distinctive terms in high‑value returns for an e-commerce application

Create an index that contains customer orders:

```json
PUT /retail_orders
{
  "mappings": {
    "properties": {
      "status":         { "type": "keyword" },
      "order_total":    { "type": "double" },
      "payment_method": { "type": "keyword" }
    }
  }
}
```
{% include copy-curl.html %}

Ingest sample documents into the index:

```json
POST _bulk
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
        { "term":  { "status": "RETURNED" } },
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

## Multi‑set analysis

You can determine the unusual values for each category by first grouping documents into buckets and then running a `significant_terms` aggregation within each bucket.

### Example: Unusual `cancel_reason` per region

```json
GET /rides/_search
{
  "size": 0,
  "aggs": {
    "by_region": {
      "terms": { "field": "region.keyword", "size": 5 },
      "aggs": {
        "odd_cancellations": {
          "significant_terms": { "field": "cancel_reason.keyword" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

### Example: Hotspots on a map

Suppose that you have a dataset of field incidents at sites across a country. Each document contains a point location `site.location` of type `geo_point` and a categorical field `issue.keyword` (for example, `POWER_OUTAGE`, `FIBER_CUT`, or `VANDALISM`). You want to identify the issue types that are overrepresented within specific map tiles compared to a broader reference set. You can use a `geotile_grid` to divide the map into zoom‑level tiles. Higher `precision` produces smaller tiles, such as street or city blocks, while lower `precision` produces larger tiles, such as city or region. Run a `significant_terms` aggregation within each tile to identify the local outliers.

Segment the data by map tiles and identify the `issue.keyword` values that are unusually frequent in those tiles:

```json
GET field_ops/_search
{
  "size": 0,
  "aggs": {
    "tiles": {
      "geotile_grid": { "field": "site.location", "precision": 6 },
      "aggs": {
        "odd_issues": {
          "significant_terms": { "field": "issue.keyword" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

## Use a `background_filter` to narrow the background set

By default, the background contains the entire index. Use a `background_filter` to restrict background documents for more precise results.

### Example: Compare Toronto to the rest of Canada

```json
GET /news/_search
{
  "size": 0,
  "query": { "term": { "city.keyword": "Toronto" } },
  "aggs": {
    "unusual_topics": {
      "significant_terms": {
        "field": "topic.keyword",
        "background_filter": {
          "term": { "country.keyword": "Canada" }
        }
      }
    }
  }
}
```
{% include copy-curl.html %}

Using a custom background requires additional processing because the background frequency for each candidate term must be computed by applying the filter. This can be slower than using the default index-wide counts.
{: .warning}

## Field type considerations

`significant_terms` aggregations work best on exact-value fields (for example, `keyword` or `numeric`). Running `significant_terms` aggregations on heavily tokenized text can be memory intensive. For analyzed text, consider using [`significant_text` aggregations]({{site.url}}{{site.baseurl}}/aggregations/bucket/significant-text/), which are designed for full-text fields and support the same significance heuristics.

## Heuristics and scoring

The `score` ranks terms based on how much their foreground frequency differs from the background frequency. It has no units and is meaningful only for comparison within the same request and heuristic.

You can select one heuristic per request by specifying it under `significant_terms`. The following heuristics are supported.

### JLH

The Jensen–Shannon Lift Heuristic (JLH) is suitable for most general‑purpose scenarios. It balances both the absolute frequency of a term and its relative overrepresentation compared to the background set, favoring terms that increase both *absolutely* and *relatively*.

```json
"significant_terms": {
  "field": "payment_method.keyword",
  "jlh": {}
}
```

#### JLH scoring

JLH score is calculated as follows:

`fg_pct = doc_count / foreground_total` and `bg_pct = bg_count / background_total`. JLH ≈ `(fg_pct − bg_pct) * (fg_pct / bg_pct)`. 

A term whose frequency increases slightly from a large baseline will score higher than a term with the same absolute increase from a very small background share.

#### Score example calculation using JLH

Suppose that your foreground set (high‑value returns) contains `2,000` orders, and the background set (all orders) contains `120,000` orders. Consider a single term in the `significant_terms` aggregation, which has the following counts:

- `doc_count = 160`
- `bg_count = 3,200`

Percentages of documents containing the term are calculated as follows:

- `fg_pct = 160 / 2000 = 0.08`
- `bg_pct = 3200 / 120000 ≈ 0.026666…`

JLH ≈ `(0.08 − 0.026666…) * (0.08 / 0.026666…) ≈ 0.053333… * 3 ≈ 0.16`

This positive score means that the searched term is notably more prevalent in high‑value returns than overall. Scores are relative: use them to rank terms, not as absolute probabilities.

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

### Chi‑square

Chi-square is a statistical test that measures how much the observed frequency of a term in a subset (foreground) deviates from the expected frequency based on a reference set (background). Similarly to [MI](#mutual-information),  chi-square supports `include_negatives` and `background_is_superset`.

```json
"significant_terms": {
  "field": "error.keyword",
  "chi_square": { "include_negatives": false }
}
```

### Google Normalized Distance

Google Normalized Distance (GND) favors strong co‑occurrence. It is useful for synonym discovery or items that tend to appear together.

```json
"significant_terms": {
  "field": "tag.keyword",
  "gnd": {}
}
```

### Percentage

Percentage sorts terms by the `doc_count`/`bg_count` ratio and identifies the number of foreground hits a term has relative to its background hits. It doesn’t account for the overall sizes of the two sets, so very rare terms can dominate.

```json
"significant_terms": {
  "field": "sku.keyword",
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


