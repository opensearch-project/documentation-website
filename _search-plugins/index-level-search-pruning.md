---
layout: default
title: Index-level search pruning
parent: Improving search performance
nav_order: 35
has_children: false
---

# Index-level search pruning
**Introduced 3.9**
{: .label .label-purple }

Index-level search pruning lets OpenSearch rule out whole indexes before it sends requests to their shards.

Consider a time-series workload in which `logs-*` expands to 90 daily indexes and a dashboard queries the last 5 minutes. OpenSearch initially considers the shards of all 90 indexes. The `can_match` phase filters out shards that cannot hold a matching document, but it determines this by sending a request to each shard, so the search still requires a round trip per shard, even though only one of the 90 indexes can hold matching documents.

Index-level search pruning makes this determination on the coordinating node. If an index has a recorded range for the queried field---for example, `logs-2026-06-01` holds only timestamps from June 1---OpenSearch excludes that index from a query for the last 5 minutes without sending a request to any of its shards.

Pruning depends on the recorded range, called a _field domain_. A field domain contains the minimum and maximum values for a `date` or `date_nanos` field in an index, so it is always a time range. For `@timestamp` in a daily index, the field domain is the earliest and latest timestamp in that index. OpenSearch stores each field domain in cluster state, which the coordinating node already keeps in memory, so it can compare ranges locally.

Because a field domain is a snapshot of an index's values, it is valid only while the index remains write blocked. If an index still accepted writes, a new document could fall outside the field domain, and pruning would skip an index that holds matching documents, silently dropping results from the search. This makes pruning particularly useful for time-series data, where older indexes are typically write blocked after rollover.

A _shard group_ is the set of copies of one shard that a search can target, including a primary shard and its replicas. A search reads from one copy in each group. For example, an index with 5 primary shards and 1 replica per shard has 10 shard copies but 5 shard groups. Pruning skips the shard groups of indexes whose field domains fall entirely outside the query's range. When an index has no field domain or its field domain is unusable, OpenSearch searches the shard group.


## Configuring search pruning

To use pruning, first enable the cluster settings. Then publish field domains for the indexes that you want to prune.

### Enabling search pruning

Index-level search pruning is disabled by default. To enable it, configure the pruning settings using the Cluster Settings API:

```json
PUT _cluster/settings
{
  "persistent": {
    "search.index_pruning.enabled": true,
    "search.index_pruning.min_shards": 32,
    "search.index_pruning.fields": ["@timestamp"]
  }
}
```
{% include copy-curl.html %}

For more information about pruning settings, see [Search settings]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/search-settings/#index-pruning-settings).

### Publishing field domains

Each index that you want OpenSearch to prune must have a field domain for the field that your queries filter on, and that field must be listed in `search.index_pruning.fields`. To publish one, add the Index State Management (ISM) [`publish_field_domains`]({{site.url}}{{site.baseurl}}/im-plugin/ism/policies/#publish-field-domains) action to a policy state, after a `read_only` action. ISM then computes the field's minimum and maximum values for that index and stores them.

Publish field domains only for indexes that remain write blocked.
{: .important}

## Limitations

Pruning does not apply to searches that use Point in Time (PIT) or to shard groups on remote clusters. As a result, pruning does not reduce the number of remote shard groups searched in a cross-cluster search.

If pruning would exclude every shard group, OpenSearch searches all shard groups instead.

## Query constraints

Pruning applies to `range` queries in `must` and `filter` clauses on the configured fields. Optional and negative clauses, such as `should` and `must_not`, do not trigger pruning because matching documents are not required to satisfy them.

The following query is eligible for pruning when `@timestamp` is configured in `search.index_pruning.fields`. OpenSearch resolves date math expressions, such as `now-2m`, once (at the request start time) and uses that value for every index it evaluates:

```json
GET logs-*/_search
{
  "query": {
    "bool": {
      "filter": [
        {
          "range": {
            "@timestamp": {
              "gte": "now-2m",
              "lte": "now"
            }
          }
        }
      ]
    }
  }
}
```
{% include copy-curl.html %}
