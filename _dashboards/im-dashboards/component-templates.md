---
layout: default
title: Component templates
parent: Index management in Dashboards
nav_order: 50
---

# Component templates
Introduced 2.7
{: .label .label-purple }

This documentation is aimed at admin users who manage OpenSearch clusters and are familiar with [index management in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/im-dashboards/index/).
{: .note}

Component templates allow you to create a single index pattern that matches multiple indexes. This pattern can include wildcards or regular expressions, enabling you to apply the same setting or mapping to multiple indexes simultaneously.

Using them with [index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/) can be a powerful tool for managing large volumes of data. You can create an index template that defines the basic structure and settings of your indexes, and then use the component templates to apply the settings to all indexes that match a specific pattern or criteria.    

The OpenSearch Dashboards user interface (UI) maximizes ease of use for common indexing and data stream administrative operations such as create, read, update, delete (CRUD) and mapping indexes; CRUD and mapping aliases; reindexing; and open/close, shrink, and split indexes, along with the monitoring of actions and logging of audit records. 

<insert short demo>

## Key terms

Before starting with this tutorial, it's helpful to understand the following terms:

- *Component template* refers to a reusable building block with settings, mappings, and aliases that can be attached to an index template.
- *Index template* refers to a predefined structure used to organize and store data in a database or search index.

## Creating component templates

To create template components using the UI, follow these steps:

1. From the OpenSearch Dashboards main page, select **Index Management** in the navigation menu.
2. From the Index Management window, select **Templates** > **Template components**.
3. Select **Create** and then define the template component settings. 

Note that when you create component templates, those templates apply only to new index templates that you create, not existing index templates.

## Defining component templates settings

You can use predefined template components that come with OpenSearch Dashboards or customize them either from scratch or by modifying existing templates. Predefined component templates include preconfigured charts, tables, and graphs and are a good starting point for users who are new to OpenSearch Dashboards. Customized template components can be tailored to your specific requirements and preferences and can help you create reports and visualizations that are unique to your specific needs.  

To define setting in your template components, follow these steps:  

1. Determine the key data elements that need to be included in your indexes.
2. 

** Working on final naming for the collection of screenshots 
    *Component templates* was the latest as of 4/6 demo.  