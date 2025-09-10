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

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/index-pattern-table.png" alt="Index pattern table UI " width="700"/>

## Data view field metadata

When OpenSearch Dashboards builds a data view, formerly "index pattern", it stores per-field metadata. The properties below outline what you can do with a field in "Discover" and in visualization editors.

| Property               | Type      | Description    |
|------------|----------|-------------|
| `name`                 | String    | The field’s full name as it appears in mappings.   |
| `displayName`          | String    | The UI label for the field. Defaults to `name` unless customized.     |
| `type`                 | String    | The Dashboards’ logical field type used for display and formatting, for example: `string`, `number`, `date`, `boolean`, `ip`, `geo_point`, `geo_shape`, `object`. It’s derived from the underlying OpenSearch mapping types.         |
| `esTypes`              | String or list of Strings | The underlying OpenSearch mapping type detected for this field, for example: `text`, `keyword`, `long`, `date`.               |
| `searchable`           | Boolean   | The field is indexed for search and can be queried.    |
| `filterable`           | Boolean   | The field supports building exact-match filters in the UI. Typically `true` for keyword, numeric, date, boolean, IP, and scripted fields. Plain `text` fields are usually not filterable.                                                                 |
| `aggregatable`         | Boolean   | The field can be used in aggregations, such as terms, stats, and others. Generally `true` when the field has [`doc values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/) and the type supports them. `text` is not aggregatable unless a `keyword` subfield or `fielddata` is enabled.        |
| `sortable`             | Boolean   | The field can be used for sorting. Typically `true` for fields with [`doc values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/). `text` is not sortable unless `fielddata` is enabled or you sort on a `keyword` subfield.                     |
| `indexed`              | Boolean   | Mirrors whether the field is indexed and can participate in queries.       |
| `readFromDocValues`    | Boolean   | Determines if OpenSearch Dashboards should read values from [`doc values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/) instead of `_source` for efficiency and correct formatting. This is common for `keyword`, `date`, `number`, `boolean`. Not applicable to `text`.              |
| `visualizable`         | Boolean   | The field is eligible to appear as a dimension/metric in visualization editors.                                                                                                    |
| `scripted`             | Boolean   | The field value is computed at query time by a script rather than stored in the index.     |
| `script`               | String    | The script body used for a scripted field.             |
| `lang`                 | String    | The script language for the scripted field.       |
| `subType`              | Object    | The extra structure info: <br>• `subType.multi.parent`: if this is a multi-field, `parent` names the root field (`title`). <br>• `subType.nested.path`: if the field lives inside a `nested` mapping, this provides the nested path. |
| `count`                | number    | The popularity counter used by OpenSearch Dashboards to sort “popular fields” in Discover. Can be adjusted via the fields metadata API. Refreshing fields resets these counters.                                |
| `conflictDescriptions` | Object    | When a data view spans indices where the same field name has different types, this map records the conflicting index and type details so the UI can mark the field as “conflicting” and disable aggregations where unsafe.                                |
| `indexPattern`         | Object    | The reference to the parent data view object this field belongs to.     |
| `$$spec`               | Object    | The internal copy of the raw field spec used by OpenSearch Dashboards. Not intended for external use or automation.   |


## Next steps

- [Understand your data through visuals]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).
- [Dig into your data]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).
