---
layout: default
title: Close index
parent: Core index APIs
grand_parent: Index APIs
nav_order: 60
redirect_from:
  - /opensearch/rest-api/index-apis/close-index/
---

# Close Index API
**Introduced 1.0**
{: .label .label-purple }

The close index API operation closes an index. Once an index is closed, you cannot add data to it or search for any data within the index.

OpenSearch blocks all read and write operations on a closed index. Requests that search or index documents in a closed index fail. Because a closed index does not serve requests, OpenSearch does not maintain the in-memory structures used for indexing and searching, which reduces the index's overhead on the cluster. To make the index available again, use the [Open Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/open-index/).

When you close or open an index, the cluster manager restarts the index's shards, which then go through the normal recovery process. OpenSearch continues to replicate the data of closed indexes so that enough shard copies remain available.

Closed indexes still occupy disk space. Closing an index does not free disk space. To reclaim space, delete indexes that you no longer need. To prevent users from closing indexes, set the `cluster.indices.close.enable` cluster setting to `false`. OpenSearch then rejects all requests to close an index. For more information, see [Cluster settings for indexes]({{site.url}}{{site.baseurl}}/install-and-configure/configuring-opensearch/cluster-settings-for-indexes/).
{: .warning}


## Endpoints

```json
POST /{index}/_close
```

## Path parameters

Parameter | Type | Description
:--- | :--- | :---
`index` | String | The index to close. Can be a comma-separated list of multiple index names. Use `_all` or `*` to close all indexes. To prevent closing indexes using `_all` or wildcard expressions, set the `action.destructive_requires_name` cluster setting to `true`.

## Query parameters

All parameters are optional.

Parameter | Type | Description
:--- | :--- | :---
`allow_no_indices` | Boolean | Whether to ignore wildcards that don't match any indexes. Default is `true`.
`expand_wildcards` | String | Expands wildcard expressions to different indexes. Combine multiple values with commas. Available values are all (match all indexes), open (match open indexes), closed (match closed indexes), hidden (match hidden indexes), and none (do not accept wildcard expressions). Default is `open`.
`ignore_unavailable` | Boolean | If true, OpenSearch does not search for missing or closed indexes. Default is `false`.
`wait_for_active_shards` | String | Specifies the number of active shards that must be available before OpenSearch processes the request. Default is 1 (only the primary shard). Set to all or a positive integer. Values greater than 1 require replicas. For example, if you specify a value of 3, the index must have two replicas distributed across two additional nodes for the request to succeed.
`cluster_manager_timeout` | Time | How long to wait for a connection to the cluster manager node. Default is `30s`.
`timeout` | Time | How long to wait for a response from the cluster. Default is `30s`.

## Example requests

<!-- spec_insert_start
component: example_code
rest: POST /sample-index/_close
body: 
-->
{% capture step1_rest %}
POST /sample-index/_close

{% endcapture %}

{% capture step1_python %}


response = client.indices.close(
  index = "sample-index"
)

{% endcapture %}

{% include code-block.html
    rest=step1_rest
    python=step1_python %}
<!-- spec_insert_end -->


## Example response
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

## Required permissions

If you use the Security plugin, make sure you have the appropriate permissions: `indices:admin/close` and `indices:admin/close*`.
