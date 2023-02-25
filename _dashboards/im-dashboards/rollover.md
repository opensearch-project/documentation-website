---
layout: default
title: Roll over
parent: Index management in Dashboards
nav_order: 40
redirect_from:
  - /dashboards/admin-ui-index/rollover/
---

# Roll over
Introduced 2.6
{: .label .label-purple }

OpenSearch Dashboards allows you to perform an [index roll over]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/index/#rollover) operation with **Index Management**.

## Data streams

To perform a roll over operation on a data stream, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Choose **Actions**, and then choose **Roll over**, as shown in the following image.

    ![Roll over]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover1.png)

1. Under **Configure source**, select the source data stream on which you want to perform the rollover operation.

1. Choose **Roll over**, as shown in the following image.

    ![Roll over]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover3.png)

## Aliases

To perform a roll over operation on an alias, perform the following steps:

1. Under **Index Management**, choose **Aliases**.

1. Choose **Actions**, and then choose **Roll over**, as shown in the following image.

    ![Roll over]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover2.png)

1. Under **Configure source**, select the source alias on which you want to perform the roll over operation.

1. If the alias does not contain a write index, you will be prompted to assign a write index, as shown in the following image. 

    ![Roll over]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover4.png)

1. Under **Configure a new roll over index** and on the **Define index** pane, specify an index name and an optional index alias.

1. Under **Index settings**, specify the number of primary shards, the number of replicas, and the refresh interval, as shown in the following image.

    ![Roll over]({{site.url}}{{site.baseurl}}/images/admin-ui-index/rollover5.png)

1. Choose **Roll over**.
