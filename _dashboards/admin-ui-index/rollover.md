---
layout: default
title: Rollover management
parent: Index and snapshot management in OpenSearch Dashboards
nav_order: 40
---

# Rollover management
Introduced 2.6
{: .label .label-purple }

OpenSearch Dashboards allows you to perform an [index rollover]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/index/#rollover) operation with **Index Management**.

## Data Steams

To perform a rollover operation on data streams, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Choose **Actions**, then choose **Rollover** as seen in the following image.

    ![Rollover]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover1.png)

1. Under **Configure source**, select the source data stream you would like to preform the rollover operation.

1. Choose **Rollover** as seen in the following image.

    ![Rollover]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover3.png)

## Aliases

To perform a rollover operation on aliases, perform the following steps:

1. Under **Index Management**, choose **Aliases**.

1. Choose **Actions**, then choose **Rollover** as seen in the following image.

    ![Rollover]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover2.png)

1. Under **Configure source**, select the source alias you would like to preform the rollover operation on.

1. If the alias does not contain a write index, you will be prompted to assign a write index as seen in the following image. 

    ![Rollover]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover4.png)

1. Under **Configure a new rollover index** and the **Define index** section, specify an index name and an optional index alias.

1. Under **Index settings** specify the number of primary shards, the number of replicas, and the refresh interval as seen in the following image.

    ![Rollover]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover5.png)

1. Finally, choose **Rollover**.
