---
layout: default
title: Significant terms
parent: Bucket aggregations
nav_order: 180
redirect_from:
  - /query-dsl/aggregations/bucket/significant-terms/
---

# Significant terms aggregations

`significant_terms` helps you surface terms that are unusually frequent in a subset of documents (foreground set) compared to a broader reference set (background set). It’s the right choice when a plain `terms` aggregation shows you the *most common* values, but you want the *most over‑represented* values.

- Foreground set: the documents matched by your query.
- Background set: by default, all documents in the target indexes. You can narrow it with `background_filter`.

Each result bucket includes:

- `key`: the term value.
- `doc_count`: the number of foreground docs containing the term.
- `bg_count`: the number of background docs containing the term.
- `score`: how strongly the term stands out in the foreground relative to the background, see [Heuristics and scoring](#heuristics-and-scoring) for further details.

If the aggregation returns no buckets, you likely didn’t filter the foreground, for example using `match_all`, or the foreground has the same distribution of terms as the background.
{: .note}

## Basic example: Find out what's distinctive about high‑value returns

Create index mapping::

```json
PUT retail_orders
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

Index sample documents:

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

You can use the following query to ask, among orders that were *returned and cost over 500*, which `payment_method` values are unusually common compared to the whole index?

```json
GET retail_orders/_search
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

The returned aggregation demonstrates that among the 5 high value returns, `gift_card` occurs 3 times (60%) and 3/12 times in the whole index (25%), so it’s flagged as the most over represented payment method:

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

You can compute "what’s unusual" per category by first splitting documents into buckets, then running `significant_terms` inside each bucket.

### Example: Unusual `cancel_reason` per region

```json
GET rides/_search
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

You have a dataset with field incidents for sites across a country. Each document has a point location `site.location` with type `geo_point` and a categorical field `issue.keyword`, for example `POWER_OUTAGE`, `FIBER_CUT`, `VANDALISM`. And you want to spot which issue types are over‑represented inside particular map tiles compared to a broader reference set. You can use `geotile_grid` that divides the map into zoom‑level tiles, higher `precision` means smaller tiles, such as street or city blocks, lower `precision` means larger tiles, for example city or region. Then run `significant_terms` inside each tile to find the local outliers.

The following request segments by tiles and queries which `issue.keyword` is unusually frequent in those tiles:

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

## Focus the background with `background_filter`

By default, the background is the entire index. Sometimes you want a **narrower reference set**.

### Example: Toronto verses the rest of Canada

```json
GET news/_search
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

A custom background requires extra work, each candidate term’s background frequency must be computed by filtering, which can be slower than using the index‑wide counts.
{: .warning}

## Free‑text fields and keyword fields

`significant_terms` works best on exact value fields, for example, `keyword`, `numeric`. Running it on heavily tokenized text can be memory‑intensive. For analyzed text, consider [`significant_text`]({{site.url}}{{site.baseurl}}/aggregations/bucket/significant-text/) instead, which is designed for free‑text and supports the same significance heuristics.

## Heuristics and scoring

The `score` ranks terms by how much their foreground frequency departs from the background frequency. It has no units and is meaningful only for comparison within the same request and heuristic.

You can choose one heuristic per request by adding its object under `significant_terms`.

### JLH (balanced absolute × relative lift)

Good general‑purpose choice. Favors terms that increase both *absolutely* and *relatively*.

```json
"significant_terms": {
  "field": "payment_method.keyword",
  "jlh": {}
}
```

#### JLH scoring

JLH score is calculated as follows:

`fg_pct = doc_count / foreground_total` and `bg_pct = bg_count / background_total`. JLH ≈ `(fg_pct − bg_pct) * (fg_pct / bg_pct)`. A term whose share rises a little but from a much bigger baseline will rank higher than one with the same absolute rise from a tiny background share.

#### Score example calculation using JLH

If your foreground (high‑value returns) has `2,000` orders and the background (all orders) has `120,000`. One bucket reports:

- `doc_count = 160`
- `bg_count = 3,200`

Percentages:

- `fg_pct = 160 / 2000 = 0.08`
- `bg_pct = 3200 / 120000 ≈ 0.026666…`

JLH ≈ `(0.08 − 0.026666…) * (0.08 / 0.026666…) ≈ 0.053333… * 3 ≈ 0.16`

This positive score means searched term is notably more prevalent in high‑value returns than overall. Scores are relative, therefore use them to rank terms, not as absolute probabilities.

### Mutual information

Mutual information (MI) prefers frequent terms, it can pick up popular but still distinctive terms. Set `include_negatives: false` to ignore terms that are less common in the foreground than the background. If your background is not a superset of the foreground, set `background_is_superset: false`. See following example:

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

Similar to [MI](#mutual-information). Also supports `include_negatives` and `background_is_superset`.

```json
"significant_terms": {
  "field": "error.keyword",
  "chi_square": { "include_negatives": false }
}
```

### Google Normalized Distance

Google Normalized Distance (GND) favors strong co‑occurrence. Useful for synonym discovery or items that tend to appear together.

```json
"significant_terms": {
  "field": "tag.keyword",
  "gnd": {}
}
```

### Percentage

Sorts terms by the ratio `doc_count`/`bg_count`, displays how many foreground hits a term has relative to its background hits, but it doesn’t account for the overall sizes of the two sets, so very rare terms can dominate.

```json
"significant_terms": {
  "field": "sku.keyword",
  "percentage": {}
}
```

### Scripted heuristic

Supply a custom formula using the following variables:

- `_subset_freq`: term docs in the foreground
- `_superset_freq`: term docs in the background
- `_subset_size`: foreground size
- `_superset_size`: background size

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


