---
layout: default
title: Advanced settings
parent: Dashboards Management
nav_order: 40
---

# Advanced settings
Updated 2.10
{: .label .label-purple }

Use the **Advanced settings** page to modify settings that govern OpenSearch Dashboards behavior. These settings can be used to customize the look and feel of the application, change the behavior of certain features, and more. A view of the interface is shown in the following image.

<img src="{{site.url}}{{site.baseurl}}/images/dashboards/advanced-settings-ui.png" alt="Advanced settings interface" width="700"/>

To access **Advanced settings**, go to **Dashboards Management** and select **Advanced settings**. The page is divided into several sections, each containing a set of related settings. You can modify these settings by editing their fields. Once you've made the changes, select **Save** to apply them.  

{::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/icons/alert-icon.png" class="inline-icon" alt="alert icon"/>{:/} **Note**<br>Certain settings require you to modify [the `opensearch_dashboards.yml` file](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/config/opensearch_dashboards.yml) and restart OpenSearch Dashboards.
{: .note}

## Required permissions

To modify settings, you must have permission to make changes. See [Multi-tenancy configuration](https://opensearch.org/docs/latest/security/multi-tenancy/multi-tenancy-config/#give-roles-access-to-tenants) for guidance about assigning role access to tenants.
