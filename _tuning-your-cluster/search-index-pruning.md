---
layout: default
title: Index-level search pruning
nav_order: 43
has_children: false
---

# Index-level search pruning

Index-level search pruning is an experimental search optimization that allows the coordinating node to skip shard groups before sending `can_match` requests or before query execution when the `can_match` phase is not run. Pruning is based on finalized index-level field-domain metadata stored in cluster state.

A field domain is an index-level summary of the values that can appear in a field for a concrete index. It is not a mapping type and it is not document-level data. Instead, it describes the value range or value set that a trusted producer has determined for a field. For example, a `date_range` field domain for `@timestamp` can describe the earliest and latest timestamp values present in one index.

A finalized field domain is metadata that a producer has marked as complete and safe to use for pruning. OpenSearch only uses finalized field domains because pruning can skip entire shard groups. If a field domain is incomplete, then pruning could incorrectly skip an index that contains matching documents. For example, after an alias rollover, the old index might still receive direct writes, writes through another alias, or late-arriving data. In that case, the `@timestamp` range may still expand, so the field domain should not be finalized yet.

This optimization is especially useful for TSDB and other time-series workloads that search many indices but constrain the query to a small slice of data. For example, a TSDB workload might search a 90-day wildcard pattern, such as `logs-*`, while the query only asks for the last 5 minutes of data. Without index-level pruning, the coordinating node may still need to consider shard groups across all matching indices before later phases determine that most of them cannot match. With finalized field-domain metadata, OpenSearch can skip shard groups for indices whose field domains are disjoint from the query constraint.

Search pruning operates on shard groups, which are the per-shard candidate iterators used by a search request. Marking a shard group as skipped prevents OpenSearch from sending `can_match` or query requests for that shard group. It does not modify index data or index metadata.

This feature is designed to be conservative: OpenSearch prunes a shard group only when it can prove that the shard group cannot match the query. If metadata is missing, malformed, unsupported, or not finalized, OpenSearch keeps the shard group.

This is an experimental feature and may change or be removed in a future version.
{: .note}

## How it works

Index-level search pruning uses two independent pieces:

- **Producer-side metadata publishing**: An OpenSearch component or plugin, such as Index State Management (ISM), publishes field-domain metadata for a concrete index. The metadata is stored in the index's custom metadata under the `index_field_domains` key.
- **Search-side pruning**: During search execution, the coordinating node reads the metadata, extracts mandatory query constraints for configured fields, and marks shard groups as skipped when their field domains are provably disjoint from those constraints.

The search-side flow is as follows:

1. OpenSearch receives a search request and resolves the candidate shard groups.
2. The coordinating node extracts mandatory query constraints for the configured pruning fields.
3. The coordinating node reads finalized field domains for the candidate concrete indexes from cluster state.
4. OpenSearch compares each field domain with the matching query constraint.
5. If the field domain is provably disjoint from the query constraint, OpenSearch marks the shard group as skipped.
6. OpenSearch continues with the `can_match` or query phase for the remaining shard groups.

## Configuring search pruning

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

The following settings control index-level search pruning.

Setting | Data type | Default | Description
:--- | :--- | :--- | :---
`search.index_pruning.enabled` | Boolean | `false` | Enables coordinator-side index pruning before `can_match` or query execution.
`search.index_pruning.min_shards` | Integer | `128` | The minimum number of active shard groups required before OpenSearch attempts pruning.
`search.index_pruning.fields` | List | `[]` | The query fields eligible for pruning. OpenSearch extracts constraints only for these fields.

The `search.index_pruning.fields` setting only controls which query fields OpenSearch examines for pruning constraints. Pruning still requires finalized field-domain metadata for the same field on each candidate concrete index.

## Field-domain metadata

Field-domain metadata is stored in `IndexMetadata.getCustomData("index_field_domains")` as a flat map of string keys and values. The metadata is intended to be written by OpenSearch components or plugins that can safely determine the domain of a field for a concrete index.

The producer-side API is an internal transport action. It is not exposed as a REST API for users to call directly.
{: .note}

OpenSearch represents each metadata entry as a `FieldDomain`. A `FieldDomain` is a generic abstraction for index-level field metadata; different implementations can describe different kinds of field domains. The initial supported implementation is `DateRangeFieldDomain`, which is stored with the `date_range` type. Future implementations can add support for other field-domain types without changing the search pruning workflow.

The following example shows the metadata shape for a `date_range` field domain:

```text
fields.@timestamp.type = date_range
fields.@timestamp.min = 1714521600000
fields.@timestamp.max = 1717200000000
fields.@timestamp.finalized = true
fields.@timestamp.source = ism_rollover
fields.@timestamp.resolution = milliseconds
```

The following table describes the supported `date_range` metadata fields.

Field | Required | Description
:--- | :--- | :---
`fields.<field>.type` | Yes | The field-domain type. For date range domains, use `date_range`.
`fields.<field>.min` | Yes | The inclusive lower bound for the field in the concrete index. The value must be a numeric `long`.
`fields.<field>.max` | Yes | The inclusive upper bound for the field in the concrete index. The value must be a numeric `long`.
`fields.<field>.finalized` | Yes | Whether the metadata is complete and trusted for pruning. Search pruning uses only domains with a value of `true`.
`fields.<field>.resolution` | Yes | The date resolution used to interpret numeric bounds, for example, `milliseconds`.
`fields.<field>.source` | No | An optional identifier for the component that produced the metadata.
`fields.<field>.format` | No | An optional date format used when parsing query range values if the query does not specify a format.

## Producer API

OpenSearch includes an internal transport action for publishing field-domain metadata:

```text
indices:admin/field_domains/put
```

The action targets one concrete index by name and UUID, validates the field-domain metadata on the cluster manager node, and merges the metadata into the target index's `index_field_domains` custom metadata.

The producer action is intended for server-side OpenSearch components or plugins. Search core does not depend on any specific producer. For example, an index-management component can publish finalized date range domains after it has made an old index read-only and computed trustworthy bounds for that index.

## Pruning behavior

OpenSearch attempts pruning only when all of the following conditions are true:

- `search.index_pruning.enabled` is `true`.
- The request contains a query.
- The request does not use point in time (PIT).
- The number of active shard groups is greater than or equal to `search.index_pruning.min_shards`.
- `search.index_pruning.fields` contains at least one field.
- The query contains a supported mandatory constraint for a configured pruning field.
- The target concrete index contains finalized field-domain metadata for that field.

OpenSearch keeps the shard group when any of the following conditions occur:

- The field-domain metadata is missing, malformed, unsupported, or not finalized.
- The shard group targets a remote cluster.
- No registered evaluator can prove that the field domain and query constraint are disjoint.
- Every active shard group would be pruned.

The last fallback preserves existing zero-shard response semantics.

## Query constraints

The search-side implementation is generic, but the initial built-in evaluator supports pruning `date_range` field domains using mandatory range queries. The query extractor converts supported range queries on configured fields into query constraints. The date range evaluator then parses the query bounds, including supported date math such as `now-2m`, and compares them with the index's `DateRangeFieldDomain`.

The query extractor follows only mandatory query clauses:

- `must`
- `filter`

It does not prune based on optional or negative clauses, such as `should` or `must_not`, because those clauses are not required for every matching document.

If OpenSearch cannot safely interpret a query constraint, then it keeps the shard group. For example, unsupported range-query options or parsing failures do not cause pruning.

For example, the following query can be used for pruning if `@timestamp` is configured in `search.index_pruning.fields`:

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

Date math expressions, such as `now-2m`, are evaluated using the search request's start time, so all pruning decisions for a request use a consistent clock.

## Producer correctness

Only publish field-domain metadata when the metadata is complete for the concrete index. For example, rolling over an alias does not, by itself, prove that the old index can no longer receive writes. Direct writes, writes through another alias, or late-arriving data can still expand the field domain.

For pruning to remain correct, producers should publish finalized metadata only after they have ensured that the field domain is complete and stable for the index.
