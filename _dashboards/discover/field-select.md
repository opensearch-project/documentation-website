---
layout: default
title: Field select tool
parent: Exploring data with Discover
grand_parent: Exploring data
nav_order: 40
---

# Using the field select tool

By default, the Discover application's **Results** list displays all fields for every document in the list. In the field select tool, you can select which data fields appear in the **Results** list.

The field select tool is in the vertical panel to the immediate left of the [Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/) application pane. It is available only in the **Discover** application.


## Navigating the field select tool

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/field-select-collapsed-callouts.png" alt="Field select tool"  width="44%">

The following components make up the field select tool.

- The **Index patterns** dropdown (A) presents all available index patterns. The selected index pattern determines what data are loaded and therefore which fields are available in the field select tool.
- The **Search field names** (B) box narrows the fields available in the select tool by matching field names to your search string.
- The **Filter by type** dropdown (C) narrows the fields available based on data properties such as data type and searchability.
- The **Selected fields** list (D) is a collapsible list of all selected fields.
- The **Popular fields** list (E) is a collapsible list of recently selected fields.
- The **Available fields** list (F) is a collapsible list of all fields that have not been selected.

The **Selected fields**, **Popular fields**, and **Available fields** lists are mutually exclusive. A field appears in only one of these collapsible lists.
{: .important}


## Selecting an index pattern

Before exploring and visualizing data, you must select an index pattern.

An index pattern is equivalent to a table view in a traditional relational database system. It defines the data set that you are interested in exploring and visualizing. For information about creating index patterns, see [Index patterns]({{site.url}}{{site.baseurl}}/images/dashboards/field-select-collapsed-callouts.png).

To select an index pattern:

In the field select tool, select an index pattern from the **Index patterns** dropdown.


## Selecting fields to display

To select a field for display in the **Results** list:

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand icon) **Available fields** to expand the **Available fields**. 

   If the field has been used recently, it might be in the **Popular fields** list instead of **Available fields**.
   {: .note}

1. (Optional) [Use the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/funnel-icon.png" class="inline-icon" alt="funnel icon"/>{:/} **Filter by type**](#filtering-fields-by-type   ) popover to narrow the available fields by type.

1. (Optional) Enter text in the **Search field names** box to narrow the list of available fields.

1. Select a field in the **Available fields** or **Popular fields** list.

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/green-plus-icon.png" class="inline-icon" alt="green plus icon"/>{:/} (add field) icon of the selected field.

   The field is added as a column in the **Results** list in the **Discover** application pane.

## Removing fields

To remove a field from display in the **Results** list:

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/arrow-right-icon.png" class="inline-icon" alt="expand icon"/>{:/} (expand icon) **Selected fields** to expand the **Selected fields**.
   
1. Choose a field in the **Selected fields** list.

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/red-cross-icon.png" class="inline-icon" alt="red cross icon"/>{:/} (remove) icon of the selected field.

   The field is removed from the **Results** list in the **Discover** application pane.

   If the removed field was the last selected field, the **Results** list defaults back to displaying all fields.
   {: .note}


## Filtering fields by type

Often the list of available fields is long. To avoid scrolling through the list you can filter fields in the field select tool by data type and by whether they are aggregatable or searchable.

The number to the right of {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/funnel-icon.png" class="inline-icon" alt="funnel icon"/>{:/} **Filter by type** indicates the number of active type filters.
{: .tip}

### Filtering fields by data type

To narrow the fields in the field select tool by data type:

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/funnel-icon.png" class="inline-icon" alt="funnel icon"/>{:/} **Filter by type**.

1. In the **Filter by type** popover, select a data type from the **Type** dropdown.

   The fields are restricted to the selected type.

   Fields are restricted in all the lists: **Selected fields**, **Popular fields**,and **Available fields**.
   {: .note}

### Filtering fields by property

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/funnel-icon.png" class="inline-icon" alt="funnel icon"/>{:/} **Filter by type**.

1. In the **Filter by type** popover, select an **Aggregatable** option. For example, selecing **yes** filters out all non-aggregatable fields.

1. In the **Filter by type** popover, select a **Searchable** option. For example, selecing **yes** filters out all non-searchable fields.

   Searchable fields are fields that are included in the inverted index and are available for search; for more information see [Index]({{site.url}}{{site.baseurl}}/mappings/mapping-parameters/index-parameter).

### Filtering missing fields

To filter out fields with missing data:

1. Select {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/funnel-icon.png" class="inline-icon" alt="funnel icon"/>{:/} **Filter by type**.

1. In the **Filter by type** popover, activate on the **Hide missing fields** toggle.