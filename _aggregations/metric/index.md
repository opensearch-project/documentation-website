---
layout: default
title: Metric aggregations
has_children: true
has_toc: false
nav_order: 2
redirect_from:
  - /opensearch/metric-agg/
  - /query-dsl/aggregations/metric-agg/
  - /aggregations/metric-agg/
  - /query-dsl/aggregations/metric/
---

# Metric aggregations

Metric aggregations let you perform simple calculations such as finding the minimum, maximum, and average values of a field.

## Types of metric aggregations

There are two types of metric aggregations: single-value metric aggregations and multi-value metric aggregations.

### Single-value metric aggregations

Single-value metric aggregations return a single metric, for example, `sum`, `min`, `max`, `avg`, `cardinality`, or `value_count`.

### Multi-value metric aggregations

Multi-value metric aggregations return more than one metric. These include `stats`, `extended_stats`, `matrix_stats`, `percentile`, `percentile_ranks`, `geo_bound`, `top_hits`, and `scripted_metric`.

## Supported metric aggregations

OpenSearch supports the following metric aggregations:

- [Average]({{site.url}}{{site.baseurl}}/aggregations/metric/average/)
- [Cardinality]({{site.url}}{{site.baseurl}}/aggregations/metric/cardinality/)
- [Extended stats]({{site.url}}{{site.baseurl}}/aggregations/metric/extended-stats/)
- [Geobounds]({{site.url}}{{site.baseurl}}/aggregations/metric/geobounds/)
- [Matrix stats]({{site.url}}{{site.baseurl}}/aggregations/metric/matrix-stats/)
- [Maximum]({{site.url}}{{site.baseurl}}/aggregations/metric/maximum/)
- [Minimum]({{site.url}}{{site.baseurl}}/aggregations/metric/minimum/)
- [Percentile ranks]({{site.url}}{{site.baseurl}}/aggregations/metric/percentile-ranks/)
- [Percentile]({{site.url}}{{site.baseurl}}/aggregations/metric/percentile/)
- [Scripted metric]({{site.url}}{{site.baseurl}}/aggregations/metric/scripted-metric/)
- [Stats]({{site.url}}{{site.baseurl}}/aggregations/metric/stats/)
- [Sum]({{site.url}}{{site.baseurl}}/aggregations/metric/sum/)
- [Top hits]({{site.url}}{{site.baseurl}}/aggregations/metric/top-hits/)
- [Value count]({{site.url}}{{site.baseurl}}/aggregations/metric/value-count/)