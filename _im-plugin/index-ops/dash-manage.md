---
layout: default
title: Index management operations
parent: Index operations
nav_order: 20
redirect_from:
  - /dashboards/admin-ui-index/index-management/
---

# Managing indexes in OpenSearch Dashboards

Introduced 2.5
{: .label .label-purple }

OpenSearch automatically performs such transaction- and memory-related operations as flushing index caches, refreshing data from the transaction log, and managing index caches. You can also perform these operations manually on one or more indexes from the **Index Management** page as described in the following procedures.

In **Index Management** page of OpenSearch Dashboards, you can perform most of the operations available in the [Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/index/), including the following:

- [Refreshing an index](#refreshing-an-index)
- [Flushing indexes](#flushing-indexes)
- [Clearing an index cache](#clearing-an-index-cache)
- [Force merging indexes](#force-merging-indexes)
- [Shrinking an index](#shrinking-an-index)
- [Splitting an index](#splitting-an-index)

You cannot clone an index in OpenSearch Dasboards. Use the [Clone Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clone/) to clone an index.
{: .note}

[UI topics](#ui-topics) briefly discusses considerations specific to performing these operations in OpenSearch Dashboards, including the following:

- [Security](#security-integration)
- [Error messaging](#error-messages)
- [Checking the status of long-running operations](#checking-the-status-of-long-running-operations).


## Refreshing an index

Refreshing an index makes new operations (since the last refresh) visible to search operations. See the description in [Refresh API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/refresh/).

The refresh operation can be applied only to open indexes.

To refresh one or more indexes, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. (Optional) Select one or more indexes from the **Indexes** list.

   If you do not select any indexes, all indexes are refreshed.

1. Select the **Actions** button at the upper right of the Indexes panel.

1. Select **Refresh** from the drop-down.

1. In the confirmation dialog, select the **Refresh** button.


## Flushing indexes

The flush operation performs a Lucene commit, writing segments to disk and starting a new transaction log. See the description in [Flush API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/).

The flush operation can be applied only to open indexes.

To flush one or more indexes, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. (Optional) Select one or more indexes from the **Indexes** list.

   If you do not select any indexes, all indexes are flushed.

1. Select the **Actions** button at the upper right of the Indexes panel.

1. Select **Flush** from the drop-down.

1. In the confirmation dialog, select the **Flush** button.


## Clearing an index cache

The clear cache operation clears all field, query, and request caches for one or more indexes. See the description in [Clear Cache API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clear-index-cache/).

The clear cache operation can be applied only to open indexes.

To clear the caches of one or more indexes, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. (Optional) Select one or more indexes from the **Indexes** list.

   If you do not select any indexes, all index caches are cleared.

1. Select the **Actions** button at the upper right of the Indexes panel.

1. Select **Clear cache** from the drop-down.

1. In the confirmation dialog, select the **Clear cache** button.


## Force merging indexes

In OpenSearch, indexed data is stored on segments. Periodically, the system merges smaller segments into larger ones in the background. Additionally, you can force a such a merge operation on one or more indexes at any time. See [Force merge API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/)

To perform a force merge operation on two or more indexes, data streams, or alias backing indexes, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Indexes**, **Data streams**, or **Aliases**.

1. Choose **Actions**.

1. From the **Actions** drop-down, choose **Force merge**.

1. In the **Configure source index** panel, enter or select the indexes, backing indexes (for aliases), or data streams that you want to force merge in the **Select source indexes or data streams** combo box.

1. (Optional) Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) icon in the **Advanced settings** panel.

   1. Set one or more advanced options:

      - **Index segments**: Select **Manually set number of segments** to specify the number of segments to merge to. To fully merge indexes, set the number of segments to 1.
      - Select **Flush indexes** to flush indexes after the force merge. See the description in [Flush API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/).
      - Select **Remove deleted documents** to expunge deleted documents. See [Force merge API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/force-merge/).
      - **Notifications**: You can set notifications for the force merge depending on outcome. Select one or both of **Has failed / timed out** or **Has completed**.

1. Choose the **Force merge** button in the lower right of the **Force merge** page.


## Shrinking an Index

You can reduce the number of primary shards in an existing index by migrating data to a new index with fewer shards. See [Shrink Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shrink-index/).

### Prerequisites

Before you can shrink an index, it must meet the following conditions:

- The index must have index _blocks_ set to _write_. This is another way of saying that the index is read-only. See [Blocks API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/blocks/).
- A copy of every shard in the index (both primary and replica) must reside on the same node. Use shard allocation filtering to move shards to the same node. See [Shard allocation filtering]({{site.url}}{{site.baseurl}}/api-reference/index-apis/shard-allocation/).
- The cluster health status must be green.
- The target index’s primary shard count must be a factor of the source index’s primary shard count. For example, an index with 8 primary shards can be shrunk into 4, 2, or 1 primary shard. An index with a prime number of shards (such as 7) can only be shrunk into 1 primary shard.
- The target index must not already exist.
- The source index must have more primary shards than the target index.
- The source index must not contain more than 2,147,483,519 documents across all shards that will be merged into a single target shard, because this is the maximum number of documents a single Lucene shard can hold.
- The node handling the shrink process must have sufficient free disk space to accommodate a second copy of the existing index.

### Procedure

To shrink an index, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Indexes**.

1. From the **Indexes** table, select the index you want to shrink.

1. Choose the **Actions** button.

1. From the drop-down list, select **Shrink**.

1. In the **Configure target index** panel, enter a name for the target in the **Target index** name box.

1. In the **Number of primary shards** box, enter the new shard count.

1. In the **Number of replicas** box, enter the number of replicas.

1. (Optional) In the **Index alias - _optional_** combo box, enter or select one or more aliases for the target index.

1. (Optional) Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Advanced** to specify additional notifications. See [**Sending additional notifications**]({{site.url}}{{site.baseurl}}/im-plugin/notifications/dash-notifications/#sending-additional-notifications).


## Splitting an index

The split index operation moves an existing read-only index into a new index, splitting each primary shard into a number of primary shards in the new index. This is useful when an index has outgrown its original shard count and needs additional data volume or query load capacity.

For more about how a split works, see [Split Index API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/split/).

### Prerequisites

Before you can split an index, it must meet the following conditions:

- The index must have index _blocks_ set to _write_. This is another way of saying that the index is read-only. See [Blocks API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/blocks/). The interface prompts you to block write operations when splitting an index in OpenSearch Dashboards.
- The cluster health status must be green.
- The target index must not already exist.
- The source index must have fewer primary shards than the target index.
- The number of primary shards in the target index must be a multiple of the source index’s primary shard count. For example, an index with 2 primary shards can be split into 4, 6, 8, or any other multiple of 2. An index with a single primary shard can be split into any number of shards.
- The node handling the split process must have sufficient free disk space to accommodate a second copy of the existing index.


### Procedure

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui) in OpenSearch Dashboards, select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Indexes**.

1. From the **Indexes** table, select the index you want to split.

1. Choose the **Actions** button.

1. From the drop-down list, select **Split**.

1. In the **Configure target index** panel, enter a name for the target in the **Target index name** box.

1. In the **Number of primary shards** box, enter the new shard count.

1. In the **Number of replicas** box, enter the number of replicas.

1. (Optional) In the **Index alias - _optional_** combo box, enter or select one or more aliases for the target index.

1. (Optional) Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Advanced** to specify additional notifications. See [Sending additional notifications]({{site.url}}{{site.baseurl}}/im-plugin/notifications/dash-notifications/#sending-additional-notifications).



## Creating jobs

You can create scheduled jobs to help you maintain indexes. These include:

- _Rollup jobs_ to compress older data. See [Index rollups]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/).
- _Transform jobs_ to create materialized data for queries and visualizations. See [Index transforms]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/index/).

To create a rollup job using OpenSearch Dashboards, see [Creating a rollup job]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/dash-rollup/).

To create a transform job using OpenSearch Dashboards, see [Creating a transform job]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/dash-transforms/).


### Next steps

You can specify the index rollup job as an ISM action. This allows you to roll up an index after a certain event such as a rollover, index age reaching a certain point, index becoming read-only, and so on. You can also have rollover and index rollup jobs running in sequence, where the rollover first moves the current index to a warm node and then the index rollup job creates a new index with the minimized data on the hot node.

You can enable and disable rollup jobs by choosing the corresponding buttons on the **Rollup Jobs** page.

Likewise, you can specify the index transform job as an ISM action. You might for example periodically summarize data into a view that is represented by a dashboard on your cluster.

See [Index state management with OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-plugin/ism/dash-ism/) for information about using ISM actions.


## UI topics

The following sections describe differences between using OpenSearch Dashboards and using the OpenSearch APIs to perform index operations.


### Security integration

Permission control is managed with existing [permissions]({{site.url}}{{site.baseurl}}/security-plugin/access-control/permissions/) or action groups that are enforced at the API level. There is currently no permission control available in OpenSearch Dashboards. If you have permission to access the ISM plugin, then you can view new pages. You can make changes if you have permission to run the related APIs.

### Error messages

If an ISM operation fails immediately, the plugin notifies you with an error message.

For long-running operations, the plugin notifies you at the time of failure.

You can also check the index status on the **Indexes** page at any time. See [Checking the status of long-running operations](#checking-the-status-of-long-running-operations).


## Checking the status of long-running operations

Some index operations take time to complete (usually more than 30 seconds, but up to minutes or even hours).

To check the status of a long-running index operation in OpenSearch Dashboards, follow these steps:

1. In the Index Management panel, select **Indexes**.

1. In the **Indexes** table, find the index that you performed the operation on.

1. Look at the **Status** column to see the state of the operation.

   You can check the status of the reindex, shrink, and split operations because they are one-time, non-recursive operations.

