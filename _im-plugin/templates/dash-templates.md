---
layout: default
title: Using templates
parent: Index templates
nav_order: 10
---

# Using templates in OpenSearch Dashboards

[Index templates]({{site.url}}{{site.baseurl}}/opensearch/index-templates/) define index mappings, settings, and aliases. Use templates to create new indexes without entering these configurations repeatedly. For example, if you continuously index log data, you can define an index template so that all of the indexes have the same number of shards and replicas.

This page describes how to create and manage index templates and component templates in **OpenSearch Dashboards**.


## Prerequisites

This information is for admin users who manage OpenSearch clusters. See [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/cluster/).

You should be familliar with index management in OpenSearch Dashboards. [Index Management in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/).

All operations described here assume that you are on the **Index Management** page. To navigate to the **Index Management** page, do the following:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.


## Creating an index template

To create an index template, follow these steps:

1. Select **Templates**.

1. Choose **Create template**.

1. On the **Create template** page, define the template settings and the template definition as described in the following sections.


### Configuring template settings

The **Template settings** panel defines how the template is identified, including its name and the index patterns that it matches. To choose the template settings, follow these steps:

1. In the **Template name** field, enter a name for the template.

1. Select the **Template type**. If the template will be used to create data streams, choose **Data streams**. See []

1. If the template is for a data stream, enter the name of the timestamp field in the **Time field** box.

   Data streams require a timestamp field. This step is not optional if your template is for a data stream.
   {: .note}

1. In the **Index patterns** box, enter one or more index patterns that match the indexes the template applies to. See []

   Separate the index patterns with commas.

1. In the **Priority** box, enter the template priority. The default is 0, which is the lowest allowable priority.

   OpenSearch uses the priority in cases where an index name matches more than one template. It applies the mappings and settings from the template with the highest priority to the index.

1. Select one of two methods to define the template:

   - To define a template from scratch, choose **Simple template**.
   - To base the template on one or more component templates, choose **Component template**. See the instructions for creating a template this way in [Associating component templates with index templates]({{site.url}}{{site.baseurl}}/im-plugin/templates/dash-component-templates/#associating-component-templates-with-index-templates).

   The following procedures assume you've chosen **Simple template**.


### Creating the template definition

In the **Template definition** panel, do the following:

   1. In the **Index alias** combo box, enter or select one or more alias names (for example `current-log`).

1. Under the **Index settings** heading, define the cluster parameters by doing the following:

   1. In the **Number of primary shards** combo box, select or enter the number of primary shards. You must have at least one primary shard.
   1. In the **Number of replicas** combo box, select or enter the number of replicas.
   1. In the  **Refresh interval** box, enter the interval, for example `5s`. Default is 1 second (`1s`).
   1. (Optional) Expand **Advanced settings** to add additional index settings using the JSON editor. See []

1. Under the **Index mapping** heading, define index fields by doing the following:

   1. Choose **Visual editor**.

      We recommend using the JSON editor only to paste an existing JSON mapping configuration.
      {: .note}

   1. Define one or more fields (typed values) and objects (containers for nested fields and objects).

      - To define a field, follow these steps:

        1. Select **Add new field**.
        1. In the **Field name** box, enter the field name.
        1. In the **Field type** drop-down, choose the field type (for example `text`).

      - To define an object, follow these steps:

        1. Select **Add new object**.
        1. In the **Field name** box, enter the object's name.
        1. In the **Field type** drop-down, choose `object`.
        1. To define a nested field or object, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/plus-icon.png" class="inline-icon" alt="plus icon"/>{:/} (plus) icon under **Actions**.
    
1. Choose **Create template**.


## Deleting a template

To delete an index template, follow these steps:

1. Select **Templates**.

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/trash-icon.png" class="inline-icon" alt="trashcan icon"/>{:/} (trashcan) icon in the row of the template you want to delete.

1. In the Delete Templates confirmation dialog text box, enter `delete`.

1. Choose **Delete**.


## Modifying a template

To modify an existing index template, follow these steps:

1. Select **Templates**.

1. In the **Template name** column, select the index template you want to modify.

1. On the template page, choose the *Configuration* tab.

1. Update the template configuration. Change the template parameters as described in [Configuring template settings](#configuring-template-settings) and [Configuring the template definition](#creating-the-template-definition).

1. (Optional) To review your choices, follow these steps:
   1. Select **Preview template** in the lower left corner of the page.
   1. Review the template configuration in the **Preview template** dialog.
   1. Close the Preview template dialog by selecting **Close**.

1. To save your changes, choose **Save** in the lower left corner of the page.

## Applying a template

You apply a template to an index by giving the index a name that matches one of the template's index patterns.

To create an index using a template, follow these steps:

1. Select **Index**.

1. Choose **Create index**.

1. In the **Define index** panel, enter a name name in the **Index name** box that matches an index pattern defined in the template.

   For example, if the template has an index pattern defined as `flight-data-from-templates-*`, then naming the index `flight-data-from-templates-1` applies the pattern.

   If more than one template matches the index pattern, OpenSearch applies the template with the highest priority that .

1. (Optional) Change any alias, setting, or mapping values that you want to override from the template.

   When focus goes to another control in the Create index page, OpenSearch Dashboards applies the template. You can enter a new value and that value is saved, overriding the template value.
   {: .note}

1. At the lower right of the **Create index** page, select **Create**.
