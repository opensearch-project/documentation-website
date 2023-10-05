---
layout: default
title: Force merge
parent: Index Management
nav_order: 30
redirect_from:
  - /dashboards/admin-ui-index/forcemerge/
---

# Force merge
Introduced 2.6
{: .label .label-purple }

OpenSearch Dashboards allows you to perform a [force merge]({{site.url}}{{site.baseurl}}/im-plugin/ism/error-prevention/index#force_merge) operation on two or more indexes with **Index Management**.

## Force merging indexes

To perform a force merge operation on two or more indexes, perform the following steps:

1. Under **Index Management**, choose **Indices**.

1. Select the indexes you want to force merge.

1. Choose **Actions**, and then choose **Force merge**, as shown in the following image.

    ![Force Merge]({{site.url}}{{site.baseurl}}/images/admin-ui-index/forcemerge1.png)

1. Under **Configure source index**, specify the indexes you want to force merge.

1. Optionally, under **Advanced settings** you can to choose to **Flush indices** or **Only expunge delete** and then specify the **Max number of segments** to merge to as shown in the following image.

    ![Force Merge]({{site.url}}{{site.baseurl}}/images/admin-ui-index/forcemerge2.png)

## Force merging data streams

To perform a force merge operation on two or more indexes, perform the following steps:

1. Under **Index Management**, choose **Data streams**.

1. Select the data streams you want to force merge.

1. Choose **Actions**, and then choose **Force merge**.

1. Under **Configure source index**, specify the data streams you want to force merge.

1. Optionally, under **Advanced settings** you can to choose to **Flush indices** or **Only expunge delete** and then specify the **Max number of segments** to merge to as shown in the following image.

    ![Force Merge]({{site.url}}{{site.baseurl}}/images/admin-ui-index/forcemerge2.png)
