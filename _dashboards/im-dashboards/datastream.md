---
layout: default
title: Data streams
parent: Index Management
nav_order: 20
redirect_from:
  - /dashboards/admin-ui-index/datastream/
  - /opensearch/data-streams/
---

# Data streams
Introduced 2.6
{: .label .label-purple }

In OpenSearch Dashboards, the **Index Management** application allows you to view and manage [data streams]({{site.url}}{{site.baseurl}}/im-plugin/data-streams/) as shown in the following image.

![Data Streams]({{site.url}}{{site.baseurl}}/images/admin-ui-index/datastreams1.png)

## Viewing a data stream

To view a data stream and its health status, choose **Data streams** under **Index management** as shown in the following image.

![Data Streams]({{site.url}}{{site.baseurl}}/images/admin-ui-index/datastreams5.png)

The following are the three data stream health statuses:

- Green: All primary and replica shards are assigned.
- Yellow: At least one replica shard is not assigned.
- Red: At least one primary shard is not assigned.

## Creating a data stream

To create a data stream, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Choose **Create data stream**.

1. Enter a name for the data stream under **Data stream name**.

1. Ensure that you have a matching index template. This will be populated under **Matching index template**, as shown in the following image.

    ![Data Streams]({{site.url}}{{site.baseurl}}/images/admin-ui-index/datastreams3.png)

1. The **Inherited settings from template** and **Index alias** sections are read-only, and display the backing indexes that are contained in the data stream.

1. The number of primary shards, number of replicas, and the refresh interval are inherited from the template, as shown in the following image.

    ![Data Streams]({{site.url}}{{site.baseurl}}/images/admin-ui-index/datastreams4.png)

1. Choose **Create data stream**.

## Deleting a data stream

To delete a data stream, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Select the data stream that you want to delete.

1. Choose **Actions**, and then choose **Delete**.

## Rolling over a data stream

To perform a rollover operation on a data stream, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Choose **Actions**, and then choose **Roll over**, as shown in the following image.

    ![Rollover]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover1.png)

1. Under **Configure source**, select the source data stream on which you want to perform the rollover operation.

1. Choose **Roll over**, as shown in the following image.

    ![Rollover]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover3.png)

## Force merging data streams

To perform a force merge operation on two or more indexes, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Select the data streams on which you want to perform the force merge operation.

1. Choose **Actions**, and then choose **Force merge**.

1. Under **Configure source index**, specify the data streams you want to force merge.

1. Optionally, under **Advanced settings** you can to choose to **Flush indices** or **Only expunge delete** and then specify the **Max number of segments** to merge to as shown in the following image.

    ![Force Merge]({{site.url}}{{site.baseurl}}/images/admin-ui-index/forcemerge2.png)

## Refreshing a data stream

Refreshing a data stream makes new updates to the index visible to search operations. 

The refresh operation can be applied only to open indexes associated with the specified data streams.

To refresh a data stream, select the data stream from the **Data streams** list under **Index Management**. Then select **Refresh** from the **Actions** dropdown list. 

## Flushing a data stream

The flush operation performs a Lucene commit, writing segments to disk and starting a new translog. 

The flush operation can be applied only to open indexes associated with the specified data streams. 

To flush a data stream, select the data stream from the **Data streams** list under **Index Management**. Then select **Flush** from the **Actions** dropdown list. 

## Clearing a data stream cache

The [clear cache operation]({{site.url}}{{site.baseurl}}/api-reference/index-apis/clear-index-cache/) can be applied only to open indexes associated with the specified data streams. 

To clear a data stream cache, select the index from the **Indices** list under **Index Management**. Then select **Clear cache** from the **Actions** dropdown list. 