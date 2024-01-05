---
layout: default
title: Open index
parent: Index APIs
nav_order: 55
redirect_from:
  - /opensearch/rest-api/index-apis/open-index/
---

# Open index
**Introduced 1.0**
{: .label .label-purple }

The open index API operation opens a closed index, letting you add or search for data within the index.

## Example

```json
POST /sample-index/_open
```
{% include copy-curl.html %}

## Path and HTTP methods

```
POST /<index-name>/_open
```

## URL parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
&lt;index-name&gt; | String | The index to open. Can be a comma-separated list of multiple index names. Use `_all` or * to open all indexes.
allow_no_indices | Boolean | Whether to ignore wildcards that don't match any indexes. Default is true.
expand_wildcards | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are all (match all indexes), open (match open indexes), closed (match closed indexes), hidden (match hidden indexes), and none (do not accept wildcard expressions). Default is open.
ignore_unavailable | Boolean | If true, OpenSearch does not search for missing or closed indexes. Default is false.
wait_for_active_shards | String | Specifies the number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to all or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
cluster_manager_timeout | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
timeout | Time | How long to wait for a response from the cluster. Default is `30s`.
wait_for_completion | Boolean | When set to `false`, the request returns immediately instead of after the operation is finished. To monitor the operation status, use the [Tasks API]({{site.url}}{{site.baseurl}}/api-reference/tasks/) with the task ID returned by the request. Default is `true`.
task_execution_timeout | Time | The explicit task execution timeout. Only useful when wait_for_completion is set to `false`. Default is `1h`.


## Response
```json
{
  "acknowledged": true,
  "shards_acknowledged": true
}
```
