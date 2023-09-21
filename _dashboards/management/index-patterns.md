---
layout: default
title: Index patterns
parent: Dashboards Management
nav_order: 10
---

# Index patterns
Updated 2.10
{: .label .label-purple }

You can use index patterns to search, analyze, and visualize your data. An _index pattern_ is a way to define which data to use and how to interact with it in OpenSearch. An index pattern can point to one or more indexes, data streams, or index aliases. For example, an index pattern can point you to your log data from yesterday or all indexes that contain your data. 

Index patterns allow you to define field properties and customize how the data is visualized in OpenSearch Dashboards. To visualize your data, you need to tell OpenSearch from which indexes to retrieve the data. Because it's a common approach to have data stored in multiple indexes, creating an index pattern enables your visualizations retrieve data from any indexes that match the index pattern. 

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/alert-icon.png" class="inline-icon" alt="alert icon" size="m"/>{:/}**Note**<br>
To create or modify index patterns, you must have write permissions. Contact your administrator for support. For more information, refer to [Multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/#give-roles-access-to-tenants).
{: .note}

## Prerequisites

Before you can create an index pattern, your data must be indexed. To learn about indexing your data in OpenSearch, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/). 

## Creating an index pattern

If you added sample data, you have index patterns that you can use to analyze that data. To create an index pattern for your own data, follow these steps:

1. Go to OpenSearch Dashboards, and select **Dashboards Management** > **Index patterns**.
2. Select **Create index pattern**, as shown in the following image:

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/index-patterns-ui.png" alt="Create index pattern UI" width="700"/>

3. Define the index pattern, starting with entering a name for your index pattern in the **Index pattern name** field. Dashboards automatically adds a wildcard, `*`, once you start typing, as that's often how OpenSearch defines the pattern instead of using a single index. When you start typing in the field, the dropdown list displays all the indexes that match your input.
4. Continue to the **Next step**. 
5. Define the time filter name if you want to use time-based data. 
6. Select one or more indexes to associate with your index pattern. 