---
layout: default
title: Template components
parent: Index management in Dashboards
nav_order: 50
---

# Template components
Introduced 2.7
{: .label .label-purple }

Template components allow you to create a single index pattern that matches multiple indexes. This pattern can include wildcards or regular expressions, enabling you to apply the same setting or mapping to multiple indexes simultaneously. 

Using them with [index templates]({{site.url}}{{site.baseurl}}/im-plugin/index-templates/) can be a powerful tool for managing large volumes of data. You can create an index template that defines the basic structure and settings of your indexes, and then use the composite index template to apply the settings to all indexes that match a specific pattern or criteria.

The OpenSearch Dashboards user interface maximizes ease of use for common indexing and data stream administrative operations. Functionality includes Create, Read, Update, Delete (CRUD) and mapping indices, CRUD and mapping aliases, reindexing, open/close indices, shrink indices, and split indices. You also can monitor the actions taken within the user interface through a dashboard and log the audit records. 

## Creating component templates

This documentation is aimed at admin users who manage OpenSearch clusters and assumes you understand [index management in OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/im-dashboards/index/).

To create component templates using the Dashboards interface, follow these steps:

1. From the OpenSearch Dashboards main page, select **Index Management** in the navigation menu.
2. From the Index Management window, select **Templates** > **Template components**.
3. Select **Create** and then define the template component settings. 
4. 

** Working on final naming for the collection of screenshots