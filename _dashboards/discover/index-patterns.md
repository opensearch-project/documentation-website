---
layout: default
title: Index patterns
parent: Discover
nav_order: 10
---

# Index patterns

You can use index patterns to search, analyze, and visualize your data. An _index pattern_ is a way to define which data to use and how to interact with it. It can point to one or more indexes, data streams, or index aliases. For example, an index pattern can point you to your log data from yesterday or all indexes that contain your data. Index patterns allow you to define field properties and customize how the data is displayed in OpenSearch Dashboards.

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/alert-icon.png" class="inline-icon" alt="alert icon" size="m"/>{:/}**Note**<br>
To create or modify index patterns, you must have write permissions. Contact your administrator for support. For more information, refer to [Multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/#give-roles-access-to-tenants).
{: .note}

## Creating an index pattern

If you added sample data, you have index patterns that you can use to analyze that data. To create an index pattern for your own data, follow these steps:

1. Go to OpenSearch Dashboards, and select **Dashboards Management** > **Index patterns**.
2. Select **Create index pattern**, as shown in the following image:

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/create-index-pattern.png" alt="Create index pattern UI" width="700"/>

3. Enter a name for your index pattern in the **Index pattern name** field. When you start typing in the field, the dropdown list displays all the indexes that match your input.
4. Select **Next step**. 
5. Select one or more indexes to associate with your index pattern.
6. Define the time filter name if you want to use time-based data. 
7. Select 