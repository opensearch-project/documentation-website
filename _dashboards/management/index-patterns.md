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

When OpenSearch Dashboards builds a _data view_ (formerly called _index pattern_), it stores per-field metadata. Depending on a field’s properties, you can perform different actions on the field in Discover and in visualization editors. The following table describes the field properties.

| Property               | Type      | Description    |
|------------|----------|-------------|
| `name`                 | String    | The field's full name as it appears in mappings.   |
| `displayName`          | String    | The UI label for the field. Defaults to `name` unless customized.     |
| `type`                 | String    | The Dashboards' logical field type used for display and formatting, for example: `string`, `number`, `date`, `boolean`, `ip`, `geo_point`, `geo_shape`, `object`. The logical type is derived from the underlying OpenSearch mapping type.         |
| `esTypes`              | String or list of Strings | The underlying OpenSearch mapping type detected for this field, for example: `text`, `keyword`, `long`, `date`.               |
| `searchable`           | Boolean   | Whether the field is indexed for search and can be queried.    |
| `filterable`           | Boolean   | Whether the field supports building exact-match filters in the UI. Typically `true` for keyword, numeric, date, Boolean, IP, and scripted fields. Plain `text` fields are usually not filterable.                                                                 |
| `aggregatable`         | Boolean   | Whether the field can be used in aggregations, such as `terms`, `stats`, and others. Typically `true` when the field has [`doc_values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/) enabled and the field type supports them. A `text` field is not aggregatable unless it contains a `keyword` subfield or `fielddata` is enabled on the field.        |
| `sortable`             | Boolean   | Whether the field can be used for sorting. Typically `true` for fields with [`doc_values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/) enabled. A `text` field is not sortable unless `fielddata` is enabled or you sort on its `keyword` subfield.                     |
| `indexed`              | Boolean   | Whether the field is indexed and can be used in queries.       |
| `readFromDocValues`    | Boolean   | Whether OpenSearch Dashboards should read values from [`doc_values`]({{site.url}}{{site.baseurl}}/field-types/mapping-parameters/doc-values/) instead of `_source` for efficiency and correct formatting. This is common for `keyword`, `date`, `number`, and `boolean` fields. Not applicable to `text` fields.              |
| `visualizable`         | Boolean   | Whether the field is eligible to appear as a dimension or metric in visualization editors.                                                                                                    |
| `scripted`             | Boolean   | Whether the field value is computed at query time by a script rather than stored in the index.     |
| `script`               | String    | The script body for a scripted field.             |
| `lang`                 | String    | The script language for the scripted field.       |
| `subType`              | Object    | Extra structural information: <br>• `subType.multi.parent`: For multi-fields, identifies the parent field (for example, for the `title.keyword` field the parent is `title`). <br>• `subType.nested.path`: For nested fields, specifies the nested path. |
| `count`                | number    | The popularity counter used by OpenSearch Dashboards to rank the fields for the **Popular fields** list in **Discover**. Can be adjusted using the fields metadata API. Refreshing fields resets these counters.                                |
| `conflictDescriptions` | Object    | Stores details for data views that span indiexes in which the same field name has different types. The map records the conflicting indexes and their types so the UI can label the field as conflicting and disable unsafe aggregations.                                |
| `indexPattern`         | Object    | The reference to the parent data view object this field belongs to.     |
| `$$spec`               | Object    | The internal copy of the raw field specification used by OpenSearch Dashboards. Not intended for external use or automation.   |


## Next steps

- [Understand your data through visuals]({{site.url}}{{site.baseurl}}/dashboards/visualize/viz-index/).
- [Dig into your data]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/).
