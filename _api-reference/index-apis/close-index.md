---
layout: default
title: Close index
parent: Index APIs
nav_order: 30
---

# Close index
Introduced 1.0
{: .label .label-purple }

The close index API operation closes an index. Once an index is closed, you cannot add data to it or search for any data within the index.

## Example

```json
POST /sample-index/_close
```
{% include copy-curl.html %}

## Path and HTTP methods

```
POST /<index-name>/_close
```

## URL parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
&lt;index-name&gt; | String | The index to close. Can be a comma-separated list of multiple index names. Use `_all` or * to close all indices.
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
  "shards_acknowledged": true,
  "indices": {
    "sample-index1": {
      "closed": true
    }
  }
}
```
