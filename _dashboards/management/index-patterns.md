---
layout: default
title: Index patterns
parent: Dashboards Management
nav_order: 10
has_children: true
---

# Index patterns
Updated 2.10
{: .label .label-purple }

Index patterns allow you to define field properties and customize how the data is visualized in OpenSearch Dashboards. An _index pattern_ is a way to define which data to use and how to interact with it in OpenSearch. An index pattern can point to one or more indexes, data streams, or index aliases. For example, an index pattern can point you to your log data from yesterday or all indexes that contain your data. 

To visualize your data, you need to tell OpenSearch from which indexes to retrieve the data. Because it's a common approach to have data stored in multiple indexes, creating an index pattern enables your visualizations retrieve data from any indexes that match the index pattern. 

In this tutorial, you'll learn to create index patterns.  

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/alert-icon.png" class="inline-icon" alt="alert icon" size="m"/>{:/}**Note**<br>
To create or modify index patterns, you must have write permissions. Contact your administrator for support. For more information, refer to [Multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/#give-roles-access-to-tenants).
{: .note}

## Prerequisites

Before you can create an index pattern, your data must be indexed. To learn about indexing your data in OpenSearch, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/). 

## Creating an index pattern

If you added sample data, you have index patterns that you can use to analyze that data. To create an index pattern for your own data, follow these steps.

### Step 1: Define the index pattern

1. Go to OpenSearch Dashboards, and select **Management** > **Dashboards Management** > **Index patterns**.
2. Select **Create index pattern**.
3. From the **Create index pattern** window, define the index pattern by entering a name for your index pattern in the **Index pattern name** field. Dashboards automatically adds a wildcard, `*`, once you start typing. Using a wildcard is helpful for matching an index pattern to multiple sources or indexes. A dropdown list displaying all the indexes that match your index pattern appears when you start typing. 
4. Select **Next step**.

An example using the index pattern `security*` is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/index-patterns-step1.png" alt="Index pattern step 1 UI " width="700"/>

### Step 2: Configure the settings

1. Select `@timestamp` from the dropdown menu to specify the time field for OpenSearch to use when filtering documents based on time. This field is the timestamp for when the request was received. 
2. Select  **Create index pattern.** An example is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/index-pattern-step2.png" alt="Index pattern step 2 UI " width="700"/>

Once the index pattern has been created, you can view the mapping of the matching indexes. Within the table, you can see the list of fields, along with their data type and how you can use them. An example is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/index-pattern-table.png" alt="Index pattern table UI " width="700"/>

## Next steps

- [Visualize your data]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/)