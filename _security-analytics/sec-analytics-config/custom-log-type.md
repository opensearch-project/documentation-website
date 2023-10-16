---
layout: default
title: Creating custom log types
parent: Setting up Security Analytics
nav_order: 18
---


# Creating custom log types

Log types represent the different sources of data used for threat detection in Security Analytics. In addition to the standard [log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/) supported by Security Analytics, you can create custom log types for your threat detectors.

## Creating a custom log type

To create a custom log type: 
1. From the dashboard, select **OpenSearch Plugins** > **Security Analytics**, and then select **Detectors** > **Log types**.
1. Select **Create log type**.
1. Enter a name and, optionally, a description for the log type.
   
   The log type name supports characters a--z (lowercase), 0--9, hyphens, and underscores.
   {: .note }
   
1. Select a category. The categories are listed in [Supported log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/).
1. Select **Create log type** in the lower-right corner of the screen. The screen returns to the **Log types** page, and the new log type appears in the list. Note that the source for the new log type indicates **Custom**.

## Log type API

To perform operations for custom log types using the REST API, see [Log type APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/log-type-api/).

