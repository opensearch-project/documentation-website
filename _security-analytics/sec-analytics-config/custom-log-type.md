---
layout: default
title: Creating custom log types
parent: Setting up Security Analytics
nav_order: 18
---


# Creating custom log types

Log types represent the different sources of data used for threat detection in Security Analytics. In addition to the standard log types supported by Security Analytics, you can create custom log types for your threat detectors. Follow the steps here to create a custom log type.


## The Log types page

To navigate to the **Log types** page, select **Log types** under **Detectors** in the navigation menu. The image that follows shows the **Log types** landing page.

<img src="{{site.url}}{{site.baseurl}}/images/Security/c-log-type.png" alt="The Log types landing page." width="85%">

The table that lists the log types provides the name of the log type, its description, and identifies whether it's a standard OpenSearch-defined log type or a custom log type. 

* Select the log type **Name** to open the log type's details page. The **Details** tab is shown by default. This tab includes the log type's ID. You can also select the **Detection rules** tab to show all detection rules associated with the log type.
* In the **Actions** column, you can select the trash can icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/alerting/trash-can-icon.png" class="inline-icon" alt="trash can icon"/>{:/}) to delete a custom log type (you cannot delete a standard OpenSearch-defined log type). Follow the prompts to confirm and safely remove the custom log type.
* Select **Create log type** in the top, right corner of the screen to begin creating a custom log type. The **Create log type** page opens. Continue with the steps in the section that follows to create a custom log type.


## Creating a custom log type

After selecting **Create log type** in the **Log types** page, the **Create log type** page opens and provides the necessary fields to create a new log type:

1. Enter a name for the log type.
   
   The log type name supports characters a-z (lower case), 0--9, hyphens, and underscores.
   {: .note }
   
1. Enter a description for the log type.
1. Select **Create log type** in the lower, right corner of the screen. The screen returns to the **Log types** page, and the new log type appears in the list of all log types. Note that the source for the new log type indicates **Custom**.


## Log type API

To perform operations for custom log types using the REST API, see [Log type APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/log-type-api/).

