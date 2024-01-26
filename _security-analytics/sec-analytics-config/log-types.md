---
layout: default
title: Working with log types
parent: Setting up Security Analytics
nav_order: 14
redirect_from: 
   - /security-analytics/sec-analytics-config/custom-log-type/
---

# Working with log types

Log types represent the different sources of data used for threat detection in Security Analytics. Log types are useful for categorizing or prepopulating [Detection rules]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/) when creating detectors from your source.

Log types can come from two different sources:

- [Standard log types](#standard-log-types): A list of data sources that Security Analytics automatically preppopulates field mappings and rules for, depending on the data indexed from the source.
- [Custom log types](#creating-custom-log-types): A log type created by the user when your data source is not listed in the [standard] set. [log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/) supported by Security Analytics, you can create custom log types for your threat detectors. 

To navigate to the **Log types** page, select **Log types** under **Detectors** in the **Security Analytics** navigation menu.

## Page actions

The following list describes the main features found on the **Log types** page and the actions you can take, as shown in the following image:

<img src="{{site.url}}{{site.baseurl}}/images/Security/c-log-type.png" alt="The Log types landing page." width="85%">


1. Search through both **Standard** and **Custom** log types. 
   - For a list of **Standard** log types, see [Supported Log Types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/). 
2. Create a [custom log type](#creating-custom-log-types).
3. Select the log type **Name** to open the log type's details page. The **Details** tab is shown by default. This tab includes the log type's ID. You can also select the **Detection rules** tab to show all detection rules associated with the log type.
4. Using the **Category** and **Source** dropdowns, you can sort by the log type category or source, respectively. 
5. In the **Actions** column, you can select the trash can icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/alerting/trash-can-icon.png" class="inline-icon" alt="trash can icon"/>{:/}) to delete a custom log type (you cannot delete a standard OpenSearch-defined log type). Follow the prompts to confirm and safely remove the custom log type.

## Standard log types

As of OpenSearch 2.11, all standard log types are grouped by the following categories to help select, filter, and search the log types:

- **Access Management** includes [AD/LDAP]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/ad-ldap/) , [Apache Access]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/apache-access/), and [Okta](({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/okta/).
- **Applications** includes [GitHub]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/github/), [Google Workspace]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/gworkspace/), and [Microsoft 365]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/m365/).
- **Cloud Services** includes [Azure]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/azure/), [AWS CloudTrail]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/cloudtrail/), and [Amazon S3]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/s3/)
- **Network Activity** includes [DNS]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/dns/), [Network]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/network/), [NetFlow]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/netflow/) and [VPC Flow]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/vpc/).
- **Security** includes [WAF]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/waf/).
- **System Activity** includes [Linux]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/linux/) and [Windows]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/windows/).
- **Other** accounts for log types that don't fit into a specific category. For more information see [Other log types]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/other/).


## Creating custom log types

When you need to connect to a data source not supported by the standard log type, create a custom log type: 

1. From the dashboard, select **OpenSearch Plugins** > **Security Analytics**, and then select **Detectors** > **Log types**.
1. Select **Create log type**.
1. Enter a name and, optionally, a description for the log type.
   
   The log type name supports characters a--z (lowercase), 0--9, hyphens, and underscores.
   {: .note }
   
1. Select a category. The categories are listed in [Supported log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/).
1. Select **Create log type** in the lower-right corner of the screen. The screen returns to the **Log types** page, and the new log type appears in the list. Note that the source for the new log type indicates **Custom**.

## About field mappings

The log type specified when creating dectectors determine which fields are available for mapping. For example, when "Windows logs" is selected as the log type, this parameter, along with the specific detection rules, determines the list of detection field names available for the mapping. Similarly, the selected data source determines the list of log source field names that are available for the mapping.

Security Analytics uses prepackaged Sigma rules for detector creation. It can automatically map important fields for a specific log type to the corresponding fields in the Sigma rules. The **Field Mappings** section when [creating detectors]() presents a view of automatically mapped fields while also providing the option to customize, change, or add new field mappings. When a detector includes customized rules, you can follow this step to manually map detector rule field names to log source field names.

Because the system has the ability to automatically map field names, manually mapping the fields when ECS fields already exist in your document is optional. However, detector rules require some mappings in order to operate, depending on the detector rule. The more fields that can be mapped between detector fields and log source fields, the greater the accuracy of generated findings.



## Log type API

To perform operations for custom log types using the REST API, see [Log type APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/log-type-api/).





