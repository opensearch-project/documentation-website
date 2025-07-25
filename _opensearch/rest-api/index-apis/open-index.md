---
layout: default
title: Open index
parent: Index APIs
grand_parent: REST API reference
nav_order: 40
canonical_url: https://docs.opensearch.org/latest/api-reference/index-apis/open-index/
---

# Open index
Introduced 1.0
{: .label .label-purple }

The open index API operation opens a closed index, letting you add or search for data within the index.

## Example

```json
POST /sample-index/_open
```

## Path and HTTP methods

```
POST /<index-name>/_open
```

## URL parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
&lt;index-name&gt; | String | The index to open. Can be a comma-separated list of multiple index names. Use `_all` or * to open all indices.
allow_no_indices | Boolean | Whether to ignore wildcards that don't match any indices. Default is true.
expand_wildcards | String | Expands wildcard expressions to different indices. Combine multiple values with commas. Available values are all (match all indices), open (match open indices), closed (match closed indices), hidden (match hidden indices), and none (do not accept wildcard expressions). Default is open.
ignore_unavailable | Boolean | If true, OpenSearch does not search for missing or closed indices. Default is false.
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to all or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
master_timeout | Time | How long to wait for a connection to the master node. Default is `30s`.
timeout | Time | How long to wait for a response from the cluster. Default is `30s`.


## Response
```json
{
  "acknowledged": true,
  "shards_acknowledged": true
}
```
