---
layout: default
title: Working with log types
parent: Setting up Security Analytics
nav_order: 14
redirect_from: 
   - /security-analytics/sec-analytics-config/custom-log-type/
canonical_url: https://docs.opensearch.org/docs/latest/security-analytics/sec-analytics-config/log-types/
---

# Working with log types

Log types represent the different data sources used for threat detection in Security Analytics. Log types are useful for categorizing or prepopulating [detection rules]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/) when creating detectors from your source.

Security Analytics supports the following log types:

- [Standard log types](#standard-log-types): Security Analytics automatically generates a list of data sources, along with their field mappings and rules, based on the data indexed from each source.
- [Custom log types](#creating-custom-log-types): When your data cannot be categorized as one of the [standard log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/), you can create a user-defined log type. For enhanced threat detection, Security Analytics supports the integration of custom log types.

To navigate to the **Log types** page, select **Log types** under **Detectors** in the **Security Analytics** navigation menu.

## Page actions

The main **Log types** UI features and actions are shown in the following image. These features are described in the list following the image. 

<img src="{{site.url}}{{site.baseurl}}/images/Security/c-log-type.png" alt="The Log types landing page." width="85%">


1. Search **Standard** and **Custom** log types. 
   - For a list of **Standard** log types, see [Supported log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/). 
2. Create a [custom log type](#creating-custom-log-types).
3. Select the log type **Name** to open the details page. The **Details** tab is shown by default. This tab includes the log type's ID. You can also select the **Detection rules** tab to show all detection rules associated with the log type.
4. Select the **Category** or **Source** dropdown menu to sort by log type category or source. 
5. From the **Actions** column, select the {::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/alerting/trash-can-icon.png" class="inline-icon" alt="trash can icon"/>{:/} icon to delete a custom log type (you cannot delete a standard OpenSearch-defined log type). Then follow the prompts to confirm and delete it.

## Standard log types

As of OpenSearch 2.11, all standard log types are grouped by the following categories:

- **Access Management** includes [AD/LDAP]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/ad-ldap/), [Apache Access]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/apache-access/), and [Okta]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/okta/).
- **Applications** includes [GitHub]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/github/), [Google Workspace]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/gworkspace/), and [Microsoft 365]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/m365/).
- **Cloud Services** includes [Azure]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/azure/), [AWS CloudTrail]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/cloudtrail/), and [Amazon S3]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/s3/).
- **Network Activity** includes [DNS]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/dns/), [Network]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/network/), [NetFlow]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/netflow/), and [VPC Flow]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/vpc/).
- **Security** includes [WAF]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/waf/).
- **System Activity** includes [Linux]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/linux/) and [Windows]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/windows/).
- **Other** includes accounts for log types that are not contained in a specific category. For more information, refer to [Other log types]({{site.url}}{{site.baseurl}}/security-analytics/log-types-reference/other/).


## Creating custom log types

When connecting to a data source not supported by a standard log type, create a custom log type by following these steps: 

1. In OpenSearch Dashboards, select **OpenSearch Plugins** > **Security Analytics**, and then select **Detectors** > **Log types**.
1. Select **Create log type**.
1. Enter a name and, optionally, a description for the log type.
   
   The log type name supports characters a--z (lowercase), 0--9, hyphens, and underscores.
   {: .note }
   
1. Select a category. The categories are listed in the [Supported log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/) documentation.
1. Select **Create log type** in the lower-right corner of the screen. The screen returns to the **Log types** page. The new log type appears in the list. Note that the source for the new log type indicates **Custom**.

## About field mappings

The log type specified when creating a detector determines which fields are available for mapping. For example, when **Windows logs** is selected, this parameter and the specific detection rules determine the list of detection field names available for the mapping. Similarly, the selected data source determines the list of log source field names that are available for the mapping.

Security Analytics uses prepackaged Sigma rules for detector creation. It can automatically map important fields of a particular log type to the relevant fields in Sigma rules. The **Field Mappings** section shows fields that have been mapped automatically. In this section, you can customize, change, or add new field mappings. When a detector includes customized rules, you can manually map detector rule field names to log source field names.

Because the system can automatically map field names, it is optional to manually map the fields when `ecs` fields exist in a document. Detector rules, however, require certain mappings in order to operate. These mapping depend on the detector rule. The more fields that can be mapped between detector fields and log source fields, the greater the accuracy of generated findings.



## Log type APIs

Use the log type APIs to perform custom log type operations using the REST API. For more information, refer to the [log type APIs]({{site.url}}{{site.baseurl}}/security-analytics/api-tools/log-type-api/) documentation.





