---
layout: default
title: Data streams in OpenSearch Dashboards
parent: Data streams
nav_order: 30
redirect_from:
  - /dashboards/admin-ui-index/datastream/
  - /opensearch/data-streams/
---

# Working with data streams in OpenSearch Dashboards
Introduced 2.6
{: .label .label-purple }

For information about data streams, see [Data streams]({{site.url}}{{site.baseurl}}im-plugin/data-streams/index/).

This page shows to use OpenSearch Dashboards to create and manage data streams from the Index Management page. It includes the following procedures:

- [Viewing data streams](#viewing-data-streams)
- [Creating a data stream](#creating-a-data-stream)
- [Deleting a data stream](#deleting-a-data-stream)
- [Rolling over a data stream](#rolling-over-a-data-stream)
- [Refreshing a data stream](#refreshing-a-data-stream)
- [Flushing a data stream](#flushing-a-data-stream)
- [Clearing a data stream cache](#clearing-a-data-stream-cache)
- [Force merging indexes](#force-merging-data-streams).


## Viewing data streams

On the Index Management page, you can view a table of data streams, or you can view data streams in the Indexes table. These options present slightly different information about the data streams.

You can view details of data streams and backing data streams by selecting them from the table.

The following sections describe all data stream viewing options.


### Viewing a table of data streams

To view a table of data streams, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. Select **Data streams** from the **Index Management** panel.

   The table provides the following information about each data stream:

    - **Data stream name**: The name of the data stream.

    - **Status**: One of three replication status codes, as follows:
        - Green: All primary and replica shards are assigned.
        - Yellow: At least one replica shard is not assigned.
        - Red: At least one primary shard is not assigned.

        Status codes are the same as index Health codes in the Indexes table.
        {: .note}

    - **Template**: The index template used to create the data stream.

      Unlike other indexes, data streams must be created using a template.
      {: .note}

    - **Backing indexes count**: The number of backing indexes that contain data for the data stream.

    - **Total size**: The sum of all storage used for the index over all primary and replica shards.


### Viewing data streams in the Indexes table

View data streams in the **Indexes** table. See [Viewing the list of indexes]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-ops/#viewing-the-list-of-indexes) for a description of the **Index** table contents.

To view data streams in the **Indexes** table, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. From the **Index Management** panel, select **Indexes**.

1. In the **Indexes** table header, select **Show data stream indexes**.

   The table displays entries for all backing data streams. An extra column, **Data stream**, appears in the table. The column contains the name of the data stream that the backing stream entry belongs to.

   The table header also now displays a **Data streams** drop-down.

1. (Optional) From the **Data streams** drop-down, select one or more data stream names to filter the table.

   The **Indexes** table contains only backing data streams that belong to one of the data streams selected in the drop-down.


### Viewing a single data stream

To view details of a single data stream, follow these steps:

1. View the **Data stream** table as described in [Viewing a table of data streams](#viewing-a-table-of-data-streams).

1. In the **Data stream name** column, select the name of the data stream that you want to view.

   The page displays two panels of details:

   - **Data stream details** shows the following information:
     - Name of the data stream.
     - The data stream's status (health).
     - The template used to create the data stream.
     - The number of backing indexes.
     - The data stream's time field name.
   - **Backing indexes** shows a table of the data stream's backing indexes. It contains the following columns:
     - Index: The name of the backing index.
     - Health: The health status of the backing index.
     - Managed by policy: Whether the backing index is managed by an index state management (ISM) policy.
     - Status: Whether the backing index is open or closed.
     - Writing index: Whether the backing index is a writing index.
     - Total size: The number of bytes used by the backing index.
     - Size of primaries: The number of bytes used by the backing index's primary shards.
     - Total documents: The number of documents contained in the backing index.
     - Deleted documents: The number of documents deleted from the backing index.
     - Primaries: The number of primary shards used by the backing index.
     - Replicas: The number of replicas used by the backing index.

### Viewing a single backing index

To view details of a single backing index, follow these steps:

1. View the indexes table as described in [Viewing data streams in the index table](#viewing-data-streams-in-the-indexes-table).

1. In the **Index** column, select the name of the backing index that you want to view.

1. The backing index is displayed in the same format as a regular index. See [Viewing a single index]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-ops/#viewing-index-details).


## Creating a data stream

To create a data stream, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Data streams**.

1. Choose **Create data stream**.

1. In the **Define data stream** panel, begin entering a name in the **Data stream name** combo box that matches an index pattern in a data stream index template.

   As you type, the **Data stream name** combo box displays a drop-down containing a list of matching index patterns and corresponding index template names.

1. Select one of the index patterns from the drop-down or continue typing the index pattern.

1. Complete the data stream name with a unique string that matches the index pattern.

   The **Matching template** field populates with the name of the index template containing the index pattern.

   The fields in the **Inherited settings from template** panel are read-only. They display the data stream definition from the index template. The **Index settings** and **Index mapping** are inherited from the template.

1. Choose the **Create data stream** button in the lower right of the **Create data stream** page.


## Deleting a data stream

To delete a data stream, follow these steps:

Deleted data streams are not recoverable.
{: .warning}

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Data streams**.

1. In the **Data stream names** column, select the data stream that you want to delete.

1. Choose **Actions** in the upper right of the **Data streams** panel.

1. From the drop-down, choose **Delete**.

1. In the confirmation dialog, type `delete` in the text box.

1. Choose **Delete**.


## Rolling over a data stream

To perform a rollover operation on a data stream, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Data streams**.

1. Choose **Actions**.

1. From the **Actions** drop-down, choose **Roll over**.

1. In the **Configure source** panel, select the source data stream on which you want to perform the rollover operation from the **Select an alias or data stream** drop-down.

1. Select **Roll over**.

1. (Optional) From the **Data streams** panel, select the data stream that you rolled over.

   Note that there is a new backing index in the **Backing indexes** table on the data stream's details page.


## Refreshing a data stream

Refreshing a data stream makes new operations (since the last refresh) visible to search operations. See the description in [Refresh API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/refresh/).

The refresh operation can be applied only to open data streams.

To refresh one or more data streams, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Data streams**.

1. Select one or more data streams from the **Data streams** table.

1. Select the **Actions** button at the upper right of the **Data streams** panel.

1. Select **Refresh** from the drop-down.

1. In the confirmation dialog, select the **Refresh** button.


## Flushing a data stream

The flush operation performs a Lucene commit, writing segments to disk and starting a new transaction log. See the description in [Flush API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/flush/).

The flush operation can be applied only to open data streams.

To flush one or more data streams, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Data streams**.

1. Select one or more data streams from the **Data streams** list.

1. Select the **Actions** button at the upper right of the **Data streams** panel.

1. Select **Flush** from the drop-down.

1. In the confirmation dialog, select the **Flush** button.


## Clearing a data stream cache

The clear cache operation clears all field, query, and request caches for one or more data streams. See the description in [Clear Cache API]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clear-index-cache/).

The clear cache operation can be applied only to open data streams.

To clear the caches of one or more data streams, follow these steps:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.

1. In the **Index Management** panel, choose **Data streams**.

1. Select one or more data streams from the **Data streams** list.

1. Select the **Actions** button at the upper right of the **Data streams** panel.

1. Select **Clear cache** from the drop-down.

1. In the confirmation dialog, select the **Clear cache** button.

## Force merging data streams

Force merging a data stream is identical to force merging an index. See [Force merging indexes]({{site.url}}{{site.baseurl}}/im-plugin/index-ops/dash-manage/#force-merging-indexes).
