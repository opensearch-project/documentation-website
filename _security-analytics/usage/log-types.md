---
layout: default
title: Creating log types
parent: Setting up Security Analytics
nav_order: 18
redirect_from: 
   - /security-analytics/sec-analytics-config/custom-log-type/
---

# Using log types

Log types represent the different sources of data used for threat detection in Security Analytics. In addition to the standard [log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/) supported by Security Analytics, you can create custom log types for your threat detectors.

To navigate to the **Log types** page, select **Log types** under **Detectors** in the **Security Analytics** navigation menu, as shown in the following image.


## Page actions

The following list describes the main features found on the **Log types** page and the actions you can take, as shown in the following image:

<img src="{{site.url}}{{site.baseurl}}/images/Security/c-log-type.png" alt="The Log types landing page." width="85%">


1. Search through both **Standard** and **Custom** log types. For a list of **Standard** log types, see [Supported Log Types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/).
2. Select the log type **Name** to open the log type's details page. The **Details** tab is shown by default. This tab includes the log type's ID. You can also select the **Detection rules** tab to show all detection rules associated with the log type.
3. Using the **Category** and **Source** dropdowns, you can sort by the log type category or source, respectively. 
4. Select **Create log type** in the upper-right corner of the screen to begin creating a custom log type. The **Create log type** page opens. Continue with the steps in the section that follows to create a custom log type.
5. In the **Actions** column, you can select the trash can icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/alerting/trash-can-icon.png" class="inline-icon" alt="trash can icon"/>{:/}) to delete a custom log type (you cannot delete a standard OpenSearch-defined log type). Follow the prompts to confirm and safely remove the custom log type.



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

