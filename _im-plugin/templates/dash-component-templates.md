---
layout: default
title: Using component templates
parent: Index templates
nav_order: 20
---

# Using component templates
Introduced 2.7
{: .label .label-purple }

Component templates are reusable building blocks that encapsulate aliases, settings, and mappings.

Use component templates to reduce the repetitive effort needed to create multiple templates with similar configurations. See [Using templates]({{site.url}}{{site.baseurl}}/im-plugin/templates/index/). You can create a component template that defines the basic structure and settings of your indexes, then use the component template to compose templates that incorporate those elements.

This page describes how to create and manage component templates in **OpenSearch Dashboards**.


## Prerequisites

This information is for admin users who manage OpenSearch clusters. See [Creating a cluster]({{site.url}}{{site.baseurl}}/tuning-your-cluster/cluster/).

You should be familliar with index management in OpenSearch Dashboards. See [Index Management in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/).

All index operations described here assume that you are on the **Index Management** page.

To navigate to the **Index Management** page, do the following:

1. From the [navigation panel]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/#navigating-the-index-management-ui), select **Management** > **Index Management**.


## Creating a component template

To create a component template, follow these steps:

1. In the **Index Management** bar, choose **Templates**.

  **Component templates** does not appear in the **Index Management** panel until you select **Templates**.
  {: tip}

1. Select **Component templates**.

1. Choose **Create component template**.

1. On the **Create component template** page, name the template and add alias, setting, and mapping configurations. All three configurations are optional. You can define a component template that fully defines an index, or one that defines only one or two configurations.

   To define the component template, do the following:

   1. Name and describe the template.

      To assign the name and description, follow these steps:

      1. In the **Name** box, enter a name.

      1. (Optional) In the **Description – _optional_** box, enter a description. It's good practice to describe the purpose of the component template or the conditions under which it is used.

   1. (Optional) Define aliases. To activate and define aliases for the component template, do the following:

      1. In the **Index alias** panel, select **Use configuration**.
      1. In the **Index alias** combo box, enter or select one or more alias names (for example `current-error-log`).

   1. (Optional) Define index settings. To activate and define settings for the component template, do the following:

      1. In the **Index settings** panel, select **Use configuration**.

      1. In the **Number of primary shards** combo box, select or enter the number of primary shards. You must have at least one primary shard.
      1. In the **Number of replicas** combo box, select or enter the number of replicas.
      1. In the  **Refresh interval** box, enter the interval, for example `5s`. Default is 1 second (`1s`).
      1. (Optional) Expand **Advanced settings** to add additional index settings using the JSON editor. See []

   1. (Optional) Define index mappings. To activate and define mappings for the component template, do the following:

      1. In the **Index mapping** panel, select **Use configuration**.
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

   1. Choose **Create component template** to save the component template.


## Deleting a component template

To delete a component template, follow these steps:

1. Select **Templates** > **Component templates**.

1. Choose the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/trash-icon.png" class="inline-icon" alt="trashcan icon"/>{:/} (trashcan) icon in the row of the component template you want to delete.

1. In the **Delete** confirmation dialog, Select the **Unlink index templates and delete** checkbox.

   The component template is removed from all index templates that were constructed using the component template, subject to the following rules:
   - Values determined by the component template are removed from the index templates.
   - If a value determined by a component template was overridden in an index template, the override value remains.
   - If a value determined by a component template was not overridden in an index template, the value is now undefined in the index template.
   - Values in indexes that were created using the index templates _do not change_. Once an index is created, template changes have no effect on the index.

1. Choose **Apply changes**.


## Modifying a component template

To delete a component template, follow these steps:

1. Select **Templates** > **Component templates**.

1. In the **Name** column, select the component template that you want to modify.

1. (Optional) Toggle **Use configuration** off or on for any of **Index alias**, **Index settings**, or **Index mapping** configurations.

1. (Optional) For any of the configurations that are toggled on, you can do the following:
   - Add values to the configuration. For example, you can add one or more aliases to the **Index alias** configuration.
   - Remove values from the configuration. For example, you can remove the **Number of replicas** value from an **Index settings** configuration.
   - Change values in the configuration. For example, you can change the **Number of replicas** value in an **Index settings** configuration.

1. Choose **Apply changes**.

   New configurations are applied to all index templates that use the component template.


## Associating component templates with index templates

Use component templates to create an index template without retyping alias, setting, or mapping configurations.

This procedure assumes you have begun creating a new template as described in [Creating an index template]({{site.url}}{{site.baseurl}}im-plugin/templates/dash-templates/#creating-an-index-template). The procedure is the same up through [Creating the template definition]({{site.url}}{{site.baseurl}}/im-plugin/templates/dash-templates/#creating-the-template-definition). To use component templates to construct an index template at that point, follow these steps:  

1. In the **Template settings** panel under **Choose a method to define your templates**, choose **Component templates**.

1. In the **Component template** panel, select **Associate component template**.

1. In the **Associate component template** dialog, select the component templates that you want to associate with your index template.

   You can select any number of component templates, including multiple component templates with the same type of configuration. If component templates have conflicting values, _the value of the last component template in the list overwrites previous values_. For example, if an index template has two component templates with index setting configurations, and both configurations define the number of primary shards, only the second configuration applies to the index template.
   
   For this reason, we recommend that you not create index templates that use multiple component templates with the same configuration type. For more advanced applications, such as composing mappings using two or more component templates, take care not to add conflicting configurations.

1. Select **Associate**.

1. (Optional) Override component template values.

   To specify individual values that override values in the component templates, follow these steps:

   1. Select **Override template definition**.
   1. Enter or select alias, settings, or mapping values as in [Creating the template definition]({{site.url}}{{site.baseurl}}/im-plugin/templates/dash-templates/#creating-the-template-definition). The index template will apply these values instead of the ones in the component templates.

1. Select **Create template** (for a new template) or **Save** (if modifying a template).
