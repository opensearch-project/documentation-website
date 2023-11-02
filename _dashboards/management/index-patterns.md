---
layout: default
title: Index patterns
parent: Dashboards Management
nav_order: 10
---

# Index patterns

Index patterns are essential for accessing OpenSearch data. An _index pattern_ references one or more indexes, data streams, or index aliases. For example, an index pattern can point you to your log data from yesterday or all indexes that contain that data. 

If you store data in multiple indexes, creating an index pattern enables your visualizations to retrieve data from all indexes that match the index pattern. You need to create index patterns to define how data is retrieved and fields are formatted so that you can query, search, and display data. 

## Get started

In this tutorial, you'll learn to create index patterns.  

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/alert-icon.png" class="inline-icon" alt="alert icon" size="m"/>{:/}**Note**<br>
To create or modify index patterns, you must have create, manage, and delete permissions. Contact your administrator for support. For more information, refer to [Multi-tenancy configuration]({{site.url}}{{site.baseurl}}/security/multi-tenancy/multi-tenancy-config/#give-roles-access-to-tenants).
{: .note}

## Prerequisites

Before you can create an index pattern, your data must be indexed. To learn about indexing your data in OpenSearch, see [Managing indexes]({{site.url}}{{site.baseurl}}/im-plugin/index/). 

## Best practices

Consider the following best practices when creating index patterns:

- **Make your index patterns specific.** Instead of creating an index pattern that matches all indexes, create an index pattern that matches all indexes starting with a certain prefix, for example, `my-index-`. The more specific your index patterns, the better it will be to query and analyze your data.
- **Use wildcards sparingly.** Wildcards can be useful for matching multiple indexes, but they can also make it more difficult to manage your index patterns. Try to use wildcards as specifically as possible.
- **Test your index patterns.** Make sure to test your index patterns to ensure that they match the correct indexes. 

## Creating an index pattern

If you added sample data, you have index patterns that you can use to analyze that data. To create an index pattern for your own data, follow these steps.

### Step 1: Define the index pattern

1. Go to OpenSearch Dashboards, and select **Management** > **Dashboards Management** > **Index patterns**.
2. Select **Create index pattern**.
3. From the **Create index pattern** window, define the index pattern by entering a name for your index pattern in the **Index pattern name** field. Dashboards automatically adds a wildcard, `*`, once you start typing. Using a wildcard is helpful for matching an index pattern to multiple sources or indexes. A dropdown list displaying all the indexes that match your index pattern appears when you start typing. 
4. Select **Next step**.

An example of step 1 is shown in the following image. Note that the index pattern `security*` matches three indexes. By defining the pattern with a wildcard `*`, you can query and visualize all the data in your indexes.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/index-patterns-step1.png" alt="Index pattern step 1 UI " width="700"/>

### Step 2: Configure the settings

1. Select `@timestamp` from the dropdown menu to specify the time field for OpenSearch to use when filtering documents based on time. Selecting this time filter determines which field the time filter is applied to. It can be the timestamp of a request or any relevant timestamp field. If you don't want to use a time filter, select that option from the dropdown menu. If you select this option, OpenSearch returns all of the data in the indexes that match the pattern.

2. Select **Create index pattern.** An example is shown in the following image.

    <img src="{{site.url}}{{site.baseurl}}/images/dashboards/index-pattern-step2.png" alt="Index pattern step 2 UI " width="700"/>

Once the index pattern has been created, you can view the mapping of the matching indexes. Within the table, you can see the list of fields, along with their data type and properties. An example is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}//images/dashboards/index-pattern-table.png" alt="Index pattern table UI " width="700"/>

## Next steps

- [Understand your data through visuals]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).
- [Dig into your data]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).
