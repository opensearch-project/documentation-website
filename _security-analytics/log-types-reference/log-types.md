---
layout: default
title: Supported log types
has_children: yes
nav_order: 16
redirect_from:
   - /security-analytics/sec-analytics-config/log-types/
---


# Supported log types


Logs contain raw data about events that happen throughout a system and in its separate parts. As of OpenSearch 2.11, log types are grouped by category to help select, filter, and search the log types. 

The following reference lists all log types supported by Security Analytics and their mappings. 

## Mapping log types

Mappings for each log type contain following fields:

- `raw_field`: How the data appears in the log.
- `ecs`: The Elastic Common Schema (ECS) field. 

To map each log type to the correct field from your data source, find the data source in this reference then use the [Mappings APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/mappings-api/) to map the field based on your log type.

## Navigating to log types

To navigate to the **Log types** page, select **Log types** under **Detectors** in the **Security Analytics** navigation menu. The page shows the name of the log type, its description, its category, and identifies whether it's a standard OpenSearch-defined log type or a custom log type. The following image shows the **Log types** landing page with the Category column selected and the **Category** filter you can use to filter the list by the category. 

<img src="{{site.url}}{{site.baseurl}}/images/Security/c-log-type.png" alt="The Log types landing page." width="85%">


## Page actions

The following list describes the main features found on the **Log types** page and the actions you can take:

* Select the log type **Name** to open the log type's details page. The **Details** tab is shown by default. This tab includes the log type's ID. You can also select the **Detection rules** tab to show all detection rules associated with the log type.
* In the **Actions** column, you can select the trash can icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/alerting/trash-can-icon.png" class="inline-icon" alt="trash can icon"/>{:/}) to delete a custom log type (you cannot delete a standard OpenSearch-defined log type). Follow the prompts to confirm and safely remove the custom log type.
* Select **Create log type** in the upper-right corner of the screen to begin creating a custom log type. The **Create log type** page opens. Continue with the steps in the section that follows to create a custom log type.
* Using the **Category** and **Source** dropdowns, you can sort by the log type category or source, respectively. 

## Related articles
[Creating custom log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/custom-log-type/)


