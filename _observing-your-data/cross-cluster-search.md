---
layout: default
title: Using observability apps for cross-cluster search
nav_order: 180
redirect_from:
  - /observing-your-data/cross-cluster-replication/
---

# Using observability apps for cross-cluster search

Using cross-cluster search, you can query indexes in remote OpenSearch clusters from [Event analytics]({{site.url}}{{site.baseurl}}/observing-your-data/event-analytics/) or from the Logs page in an Observability workspace. You run a Piped Processing Language (PPL) query on the local cluster, and the local cluster forwards it to the remote clusters and returns the combined results.

## Prerequisites

Before you query a remote cluster, make sure that you meet the following prerequisites:

- The local cluster can reach the transport port (by default, `9300`) of at least one node in the remote cluster.
- If the Security plugin is enabled, the user has PPL permissions on the local cluster and read permissions for the queried indexes on the remote cluster. For more information, see [Setting permissions]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/#setting-permissions).

## Connecting to a remote cluster

On the local cluster, register the remote cluster by providing a name for it and the address of one or more of its nodes:

```json
PUT _cluster/settings
{
  "persistent": {
    "cluster.remote": {
      "my-remote-cluster": {
        "seeds": ["<remote-node-address>:9300"]
      }
    }
  }
}
```
{% include copy-curl.html %}

To verify the connection, send the following request:

```json
GET _remote/info
```
{% include copy-curl.html %}

When the connection succeeds, the response contains `"connected": true` for the remote cluster. For more information about the response, see [Remote cluster information]({{site.url}}{{site.baseurl}}/api-reference/cluster-api/remote-info/).

For more information about connecting clusters, including node role requirements and sample Docker, Kubernetes, and proxy setups, see [Cross-cluster search]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/).

## Querying a remote cluster

In a PPL query, specify a remote index as `<remote-cluster-name>:<index-name>`. You can query more than one cluster in a single query, as shown in the following table.

| Query | Searches |
|:---|:---|
| `source = my-remote-cluster:application-logs` | The `application-logs` index in `my-remote-cluster` |
| `source = *:application-logs` | The `application-logs` index in every connected remote cluster |
| `source = application-logs, my-remote-cluster:application-logs` | The `application-logs` index in both the local cluster and `my-remote-cluster` |

### Using Event analytics

To query a remote cluster in Event analytics, follow these steps:

1. On the top menu, go to **Observability** > **Logs**, and then select **Event Explorer**.
1. In the query bar, enter a PPL query that specifies the remote index. For example, the following query returns server errors from the `application-logs` index in `my-remote-cluster`:

   ```sql
   source = my-remote-cluster:application-logs | where status >= 500 | fields @timestamp, service, status, message
   ```
   {% include copy.html %}

1. Select a time range, and then select **Run**.

### Using an Observability workspace

In an Observability workspace, you can query a remote cluster on the [Logs]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/discover-logs/) page. Datasets cannot contain remote indexes, so you specify the remote index in the query instead.

To query a remote cluster in an Observability workspace, follow these steps:

1. In your Observability workspace, go to **Logs**.
1. Select a dataset.
1. In the query editor, replace the `source` with the remote index, for example, `source = my-remote-cluster:application-logs | where status >= 500`.
1. Select a time range, and then run the query.

## Common issues

This section describes common issues and their solutions.

### The query fails with a `no such index` error

If a PPL query on a remote index fails with a `no such index` error even though the index exists on the remote cluster, create an empty index on the local cluster that has the same name and mappings as the remote index. The query returns documents from the remote cluster, not from the local index.

## Related documentation

- For setup examples and security configuration, see [Cross-cluster search]({{site.url}}{{site.baseurl}}/search-plugins/cross-cluster-search/).
- For PPL limitations and authentication details for cross-cluster queries, see [Cross-cluster search in the SQL plugin documentation](https://github.com/opensearch-project/sql/blob/main/docs/user/ppl/admin/cross_cluster_search.md).
