---
layout: default
title: Transforms in OpenSearch Dashboards
parent: Index transforms
nav_order: 30
---


# Creating a Transform Job in OpenSearch Dashboards

You can create transform jobs that create realized views. These are a summarized view of selected fields that enable you to query or visualize the data.

For example, say you have airline data that’s scattered across multiple fields and categories, and you want to view a summary of the data that’s organized by airline, quarter, and price. You can use a transform job to create a new index that’s organized by those categories. For more information about transform jobs, see  [Index transforms]({{site.url}}{{site.baseurl}}/im-plugin/index-transforms/index/).

To create a transform job, follow these steps:

1. In the **Index Management** panel, choose **Transform Jobs**.

1. On the **Transform jobs** page, choose the **Create transform job** button.

1. In the **Name** text box, enter a name for the new transform job.

1. (Optional) In the **Description – _optional_** text box, enter a description.

1. In the **Source index** combo box, enter or select the index that you want to transform.

1. (Optional) Under the **Source index filter _optional_** heading, select the **Edit data filter** link to filter the source index data before applying the transform. To then edit the data filter, follow these steps:

   1. In the Edit data filter dialog, enter the data filter using Query DSL. See [Query DSL]({{site.url}}{{site.baseurl}}/query-dsl/).

      For example, the following Query DSL expression filters all tickets costing less than $1000 from the sample flight data:

      ```json
      {
        "bool": {
          "filter": [
            { "range": { "AvgTicketPrice": { "gte": "1000" }}}
          ]
        }
      }
      ```

   1. Select **Save**.

1. In the **Target index** combo box, select the index to receive the transform results, or enter a name for a new target index.

1. Choose **Next**.

1. On the **Define transform** page, define the transform by following these steps:
   1. Select the **N columns hidden** link.
   1. In the fields drop-down, select the fields that you want in the transformed index.

      Select the **Hide all** link, then select the fields you want to add.
      {: .tip}

   1. For each of the fields in the **Original fields with sample data** table, follow these steps:
      1. Select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/add-filter-icon.png" class="inline-icon" alt="plus icon"/>{:/} icon to add a transform of the field.
      1. In the **Transform options** pop-up menu, select a grouping or aggregation. The aggregated field is added to the **Transformed fields preview based on sample data** table.

1. Select **Next**.
      
1. On the **Specify schedule** page, set when the transform job runs by following these steps:

   1. To make the job run according to its execution schedule when not called by a policy, select **Enable job by default**.

   1. To make the job run continuously, select **Continuous**.

   1. In the **Transform execution interval **combo box, enter an interval value.
   
   1. In the units drop-down, select **Minutes**, **Hours**, or **Days**.

   1. (Optional) Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand) **Advanced** to specify the number of pages per execution.
      1. Enter a value in the **Pages per execution** combo box. This controls the tradeoff between execution performance and memory cost.

1. Select **Next**.

1. On the **Review and Create** page, review the settings for the transform job. To edit a job, select the **Edit** button in the panel you want to edit.

1. Choose **Create**.

