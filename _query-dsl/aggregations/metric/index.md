---
layout: default
title: Metric aggregations
parent: Aggregations
has_children: true
has_toc: true
nav_order: 2
redirect_from:
  - /opensearch/metric-agg/
  - /query-dsl/aggregations/metric-agg/
  - /aggregations/metric-agg/
---

# Metric aggregations

Metric aggregations let you perform simple calculations such as finding the minimum, maximum, and average values of a field.

## Types of metric aggregations

Metric aggregations are of two types: single-value metric aggregations and multi-value metric aggregations.

### Single-value metric aggregations

Single-value metric aggregations return a single metric. For example, `sum`, `min`, `max`, `avg`, `cardinality`, and `value_count`.

### Multi-value metric aggregations

Multi-value metric aggregations return more than one metric. For example, `stats`, `extended_stats`, `matrix_stats`, `percentile`, `percentile_ranks`, `geo_bound`, `top_hits`, and `scripted_metric`.
