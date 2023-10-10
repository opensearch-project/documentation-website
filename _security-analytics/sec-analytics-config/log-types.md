---
layout: default
title: Supported log types
parent: Setting up Security Analytics
nav_order: 16
---


# Supported log types

Logs contain raw data about events that happen throughout a system and in its separate parts. As of OpenSearch 2.11, log types are grouped by category to help select, filter, and search the log types. 

To navigate to the **Log types** page, select **Log types** under **Detectors** in the **Security Analytics** navigation menu. The page shows the name of the log type, its description, it's category, and identifies whether it's a standard OpenSearch-defined log type or a custom log type. The following image shows the **Log types** landing page with the Category column selected, and where you can filter the list by the category. 

<img src="{{site.url}}{{site.baseurl}}/images/Security/c-log-type.png" alt="The Log types landing page." width="85%">

The following table shows the log types that are currently supported by Security Analytics for ingestion, mapping, and monitoring. 

| Category | Log type | Description | 
| :--- |:--- |:--- |
| Access Management | `Ad_ldap` | Active Directory logs that track such things as LDAP queries, errors from the LDAP server, time-out events, and unsecure LDAP binds. |
| Access Management | `Apache_access` | A log type that is responsible for recording data for all requests processed by an Apache HTTP server. |
| Access Management | `Okta` | These logs record Okta events from a range of actions such as downloading an export file, requesting an application access, or revoking privileges. |
| Applications | `GitHub` | Logs that monitor workflows created by [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions). |
| Applications| `Gworkspace` | Logs for Google Workspace that can monitor log entries such as admin actions, group and group membership actions, and events having to do with logging in. |  
| Applications| `M365` | Microsoft 365 audit logs collect a range of data for Microsoft 365 including records from call details, performance data, SQL Server, security events, and access control activity. |
| Cloud Services | `Azure` | Logs that monitor log data for cloud applications managed by Microsoft Azure Cloud Services. |
| Cloud Services | `CloudTrail` | Logs that monitor events for an AWS CloudTrail account. OpenSearch can ingest CloudTrail log data from both [AWS Simple Storage Service](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) (S3) accounts and [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) service accounts. | 
| Cloud Services | `S3` | These logs track requests for access to an Amazon S3 bucket. |
| Network Activity| `Dns` | A log that stores Domain Name System (DNS) activity. Security Analytics supports [Open Cybersecurity Schema Framework](https://docs.aws.amazon.com/security-lake/latest/userguide/open-cybersecurity-schema-framework.html) (OCSF) log and event data, which includes the Security Lake log type Route 53. Given that Route 53 is a log that captures DNS activity, its log type should be specified as DNS logs when defining a detector. |
| Network Activity | `Network` | A log that records events that happen in a system's network, such as login attempts and application events. | 
| Network Activity | `vpcflow` | [VPC Flow Logs](https://docs.aws.amazon.com/prescriptive-guidance/latest/logging-monitoring-for-application-owners/vpc-flow-logs.html) capture information about the IP traffic going to and from network interfaces in your VPC. |
| Security | `Waf` |  The role of WAF (Web Application Firewall) is to monitor and filter HTTP traffic between a web application and the internet. It is tasked wth preventing common security attacks such as cross-site scripting (XSS), SQL Injection (SQi), and so on. This new log type (introduced in OpenSearch 2.11) is for users that require monitoring for the WAF use case out-of-the box from the Security plugin. |
| System Activity | `Linux` | Logs that record events on Linux. |
| System Activity | `Windows` | Logs that record events that have happened in the operating system, applications, and other system services for Windows. |
| Other | `Email` | Logs that record email activity. |


## Page actions

The following list describes the main features found on the **Log types** page and the actions you can take:

* Select the log type **Name** to open the log type's details page. The **Details** tab is shown by default. This tab includes the log type's ID. You can also select the **Detection rules** tab to show all detection rules associated with the log type.
* In the **Actions** column, you can select the trash can icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/alerting/trash-can-icon.png" class="inline-icon" alt="trash can icon"/>{:/}) to delete a custom log type (you cannot delete a standard OpenSearch-defined log type). Follow the prompts to confirm and safely remove the custom log type.
* Select **Create log type** in the upper-right corner of the screen to begin creating a custom log type. The **Create log type** page opens. Continue with the steps in the section that follows to create a custom log type.
* Using the **Category** and **Source** dropdowns, you can sort by the log type category or source, respectively. 

## Related articles
[Creating custom log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/custom-log-type/)


