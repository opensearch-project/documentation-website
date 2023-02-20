---
layout: default
title: Data streams management
parent: Index and snapshot management in OpenSearch Dashboards
nav_order: 20
---

# Data streams management
Introduced 2.6
{: .label .label-purple }

In OpenSearch Dashboards, the **Index Management** application allows you to view and manage [data streams]({{site.url}}{{site.baseurl}}/opensearch/data-streams/).

![Data Streams]({{site.url}}{{site.baseurl}}/images/admin-ui-index/datastreams1.png)

## View data streams

To view data streams and their health status, choose **Data Streams** under **Index management**.

The following are the three data streams health statuses:

- Green: All primary and replica shards are assigned.
- Yellow: At least one replica shard is not assigned.
- Red: At least one primary shard is not assigned.

    ![Data Streams]({{site.url}}{{site.baseurl}}/images/admin-ui-index/datastreams5.png)

## Create data streams

To create data streams, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Choose **Create data stream**.

1. Enter a name for the data stream under **Data stream name**.

1. Ensure that you have a matching index template. This will be populated under **Matching index template** as seen in the image below.

    ![Data Streams]({{site.url}}{{site.baseurl}}/images/admin-ui-index/datastreams3.png)

1. The **Template details** and **Index alias** sections are read only. This will inform you of the backing indexes used in the data stream.

1. Optionally, under **Advanced settings** you can specify the number of primary shards, number of replicas, and the refresh interval, as seen in the following image.

    ![Data Streams]({{site.url}}{{site.baseurl}}/images/admin-ui-index/datastreams4.png)

1. Choose **Create data stream**.

## Delete data streams

To delete data streams, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Select the data stream you would like to delete.

1. Choose **Actions**, then choose **Delete**.

## Rollover data streams

To perform a rollover operation on data streams, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Choose **Actions**, then choose **Rollover**, as seen in the following image.

    ![Rollover]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover1.png)

1. Under **Configure source**, select the source data stream for which you want to preform the rollover operation.

1. Choose **Rollover**, as seen in the following image.

    ![Rollover]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover3.png)

## Force merge data streams

To perform a force merge operation on indexes, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Select the data streams for which you want to perform a force merge operation.

1. Choose **Actions**, then choose **Force merge**.

1. Under **Configure source index**, specify the data streams you want to force merge.

1. Optionally, under **Advanced settings** you can to choose to **Flush indices** or **Only expunge delete**, and specify the **Max number of segments** to merge to.

    ![Force Merge]({{site.url}}{{site.baseurl}}/images/admin-ui-index/forcemerge2.png)
