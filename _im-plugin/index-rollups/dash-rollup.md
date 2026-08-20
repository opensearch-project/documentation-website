---
layout: default
title: Rollups in OpenSearch Dashboards
parent: Index rollups
nav_order: 30
---


# Creating a rollup job in OpenSearch Dashboards 

You can create rollup jobs that compress indexes to summarize historical data. This saves storage space and boosts aggregation performance.

For example, say you collect CPU consumption data every five seconds and store it on a hot node. You can roll up this data to the average CPU consumption per day.

For more information about rollup jobs, see  [Index rollups]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/).

To create a rollup job, follow these steps:

1. In the **Index Management** panel, choose **Rollup jobs**.

1. On the **Rollup jobs** page, choose the **Create rollup job** button.

1. In the **Name** text box, enter a name for the new rollup job.

1. (Optional) In the **Description** text box, enter a description.

1. In the **Source index** combo box, enter or select the index pattern that you want to roll up.

1. In the **Target index** combo box, select the index to receive the rollup results, or enter a name for a new target index. You can use embedded variables in the name.

1. Choose **Next**.

1. On the **Define aggregations and metrics** page, define the time aggregation in the **Time aggregation** panel by following these steps:
   1. Select the timestamp to aggregate from the **Timestamp field** drop-down.
   1. Choose an interval type, either **Fixed** or **Calendar**. Fixed intervals are of equal length. Calendar intervals are based on single calendar entities and can be unequal, for example as with months.
   1. In the **Interval** dropdown, select a number and interval (for Interval type) or a calendar interval (for Calendar type).
   1. In the **Timezone** drop-down, select the time zone that the timestamp is in.

1. In the **Additional aggregation – _optional_** panel, specify one or more fields to aggregate by following these steps:

   1. Select the **Add fields** button.

   1. In the **Add fields** dialog, select one or more field names.

   1. Select **Add**.

   1. In the **Additional aggregations** table, for each numerical field select an aggregation (typically **Terms** or **Histogram**; you probably want **Histogram**) in the **Aggregation method** column.
  
      Keyword fields can only be aggregated by term.
      {: .note}

   1. For each numerical aggregation, enter an interval in the **Interval** column. This is the number of timestamp intervals per histogram bucket as defined in the **Time aggregation** panel.

   1. (Optional) Arrange the order of the fields to optimize rollup performance. Aggregate fields with fewer bucket first, then more buckets. See [Index rollups]({{site.url}}{{site.baseurl}}/im-plugin/index-rollups/index/).
  
1. (Optional) In the **Additional metrics _optional_** panel, select additional numeric fields to aggregate by following these steps:

   1. In the **Additional metrics** panel, select **Add fields**.

   1. Select one or more field names.

   1. Select **Add**.

   1. In the Additional metrics table, for each field, select one or more aggregations to save in the rollup. You can choose **Min**, **Max**, **Sum**, **Avg**, or **Value count**.

      Choosing **All** selects all aggregations for that field.
      {: note}

      Use the **Disable all** and **Enable all** dropdowns to select and deselect an aggregation for all fields in the table.
      {: .tip}

1. In the lower right of the **Define aggregations and metrics** page, choose **Next**.

1. On the **Specify schedule** page, set when the rollup job runs by following these steps:

   1. To make the job run according to its execution schedule when not called by a policy, select **Enable job by default**.

   1. To make the job run continuously, select **Continuous**.

   1. From the **Rollup execution frequency** dropdown, select **Define by fixed interval** or **Define by cron expression**.
      - If you selected fixed interval, select the interval from the number and units boxes in **Rollup interval**.
      - If you selected cron expression, do the following:
        1. Enter a Unix cron expression in the **Define by cron expression** text box.
        1. Set the timezone under which the schedule is governed.

   1. Enter a value in the page per execution combo box. This controls the tradeoff between execution performance and memory cost.

   1. In the **Execution delay – _optional_** control enter the delay time in the number and units boxes.

1. In the lower right of the **Define aggregations and metrics** page, choose **Next**.

1. Review the settings for the rollup job. To edit the rollup job, select **Edit**.

1. Choose **Create**.
