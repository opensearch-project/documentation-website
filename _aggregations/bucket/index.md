---
layout: default
title: Bucket aggregations
has_children: true
has_toc: false
nav_order: 3
redirect_from:
  - /opensearch/bucket-agg/
  - /query-dsl/aggregations/bucket-agg/
  - /query-dsl/aggregations/bucket/
  - /aggregations/bucket-agg/
---

# Bucket aggregations

Bucket aggregations categorize sets of documents as buckets. The type of bucket aggregation determines the bucket for a given document.

You can use bucket aggregations to implement faceted navigation (usually placed as a sidebar on a search result landing page) to help your users filter the results.

## Supported bucket aggregations

OpenSearch supports the following bucket aggregations:

- [Adjacency matrix]({{site.url}}{{site.baseurl}}/aggregations/bucket/adjacency-matrix/)
- [Date histogram]({{site.url}}{{site.baseurl}}/aggregations/bucket/date-histogram/)
- [Date range]({{site.url}}{{site.baseurl}}/aggregations/bucket/date-range/)
- [Diversified sampler]({{site.url}}{{site.baseurl}}/aggregations/bucket/diversified-sampler/)
- [Filter]({{site.url}}{{site.baseurl}}/aggregations/bucket/filter/)
- [Filters]({{site.url}}{{site.baseurl}}/aggregations/bucket/filters/)
- [Geodistance]({{site.url}}{{site.baseurl}}/aggregations/bucket/geo-distance/)
- [Geohash grid]({{site.url}}{{site.baseurl}}/aggregations/bucket/geohash-grid/)
- [Geohex grid]({{site.url}}{{site.baseurl}}/aggregations/bucket/geohex-grid/)
- [Geotile grid]({{site.url}}{{site.baseurl}}/aggregations/bucket/geotile-grid/)
- [Global]({{site.url}}{{site.baseurl}}/aggregations/bucket/global/)
- [Histogram]({{site.url}}{{site.baseurl}}/aggregations/bucket/histogram/)
- [IP range]({{site.url}}{{site.baseurl}}/aggregations/bucket/ip-range/)
- [Missing]({{site.url}}{{site.baseurl}}/aggregations/bucket/missing/)
- [Multi-terms]({{site.url}}{{site.baseurl}}/aggregations/bucket/multi-terms/)
- [Nested]({{site.url}}{{site.baseurl}}/aggregations/bucket/nested/)
- [Range]({{site.url}}{{site.baseurl}}/aggregations/bucket/range/)
- [Reverse nested]({{site.url}}{{site.baseurl}}/aggregations/bucket/reverse-nested/)
- [Sampler]({{site.url}}{{site.baseurl}}/aggregations/bucket/sampler/)
- [Significant terms]({{site.url}}{{site.baseurl}}/aggregations/bucket/significant-terms/)
- [Significant text]({{site.url}}{{site.baseurl}}/aggregations/bucket/significant-text/)
- [Terms]({{site.url}}{{site.baseurl}}/aggregations/bucket/terms/)