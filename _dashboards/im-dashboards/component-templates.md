---
layout: default
title: Component templates
parent: Index management in Dashboards
nav_order: 50
---

# Component templates
Introduced 2.7
{: .label .label-purple }

Component templates allow you to create a single index pattern that matches multiple indexes. This pattern can include wildcards or regular expressions, enabling you to apply the same setting or mapping to multiple indexes simultaneously.

Using them with [index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/) can be a powerful tool for managing large volumes of data. You can create an index template that defines the basic structure and settings of your indexes, and then use the component templates to apply the settings to all indexes that match a specific pattern or criteria.

You can create component templates from the Index Management user interface (UI). The UI maximizes ease of use for common indexing and data stream administrative operations such as create, read, update, delete (CRUD) and mapping indexes; CRUD and mapping aliases; reindexing; and open/close, shrink, and split indexes, along with the monitoring of actions and logging of audit records. 

**short demo - currently building GIF**

## Prerequisites

This tutorial is aimed at admin users who [manage OpenSearch clusters]({{site.url}}{{site.baseurl}}/tuning-your-cluster/cluster/) and are familiar with [index management in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/).

## Key terms

Before starting with this tutorial, it's helpful to understand the following terms:

- *Component template* refers to a reusable building block with settings, mappings, and aliases that can be attached to an index template.
- *Index template* refers to a predefined structure used to organize and store data in a database or search index.

## Creating component templates from the Index Management UI

You can use predefined component templates that come with OpenSearch Dashboards or customize them either from scratch or by modifying existing templates. Predefined component templates include preconfigured charts, tables, and graphs and are a good starting point for users who are new to OpenSearch Dashboards. Customized template components can be tailored to your specific requirements and preferences and can help you create reports and visualizations that are unique to your specific needs.  

To create template components using the UI, follow these steps:

1. From the OpenSearch Dashboards main page, select **Index Management** in the navigation menu.
1. From the Index Management window, select **Templates** > **Component templates**.
1. Select **Create** and then define the component template settings. 
1. To configure aliases, settings, and mappings, toggle on **Use configuration**. 

    ![Component template use configuration]({{site.url}}{{site.baseurl}}/images/admin-ui-index/component_use_config.png)

1. Enter details in the aliases, settings, and mappings fields.
1. Select **Create component template**.

When you create component templates, those templates apply only to new index templates that you create, not existing index templates.
{: .note }

## Associating component templates with index templates

To associate a component template to an index template, follow these steps:  

1. From the **Index Management** navigation menu, select **Templates**.
1. From the Templates window, select **Create template**.
1. Select **Component template** as the method to define your template.
1. From the **Component template** pane, select **Associate component template**.

    ![Component template use configuration]({{site.url}}{{site.baseurl}}/images/admin-ui-index/associate_component.png)

1. From the **Associate component template** pop-up window, select the component templates that you want to associate to your index template.
1. Select **Associate**.
1. Select **Preview template** to view the template settings.
1. Select **Create template**.