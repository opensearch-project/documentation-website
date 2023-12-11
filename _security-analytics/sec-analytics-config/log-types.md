---
layout: default
title: Supported log types
parent: Setting up Security Analytics
nav_order: 16
---


# Supported log types

Logs contain raw data about events that happen throughout a system and in its separate parts. As of OpenSearch 2.11, log types are grouped by category to help select, filter, and search the log types. 

To navigate to the **Log types** page, select **Log types** under **Detectors** in the **Security Analytics** navigation menu. The page shows the name of the log type, its description, its category, and identifies whether it's a standard OpenSearch-defined log type or a custom log type. The following image shows the **Log types** landing page with the Category column selected and the **Category** filter you can use to filter the list by the category. 

<img src="{{site.url}}{{site.baseurl}}/images/Security/c-log-type.png" alt="The Log types landing page." width="85%">

The following tables show the log types that are currently supported by Security Analytics for ingestion, mapping, and monitoring. 

## Access Management

| Log type | Description | 
|:--- |:--- |
| `ad_ldap` | Active Directory logs that track LDAP queries, errors from the LDAP server, timeout events, and unsecure LDAP binds. |
| `apache_access` | Apache access logs that record data for all requests processed by an Apache HTTP server. |
| `okta` | Okta logs that record Okta events from a range of actions, such as downloading an export file, requesting application access, or revoking privileges. |

### Applications

| Log type | Description | 
|:--- |:--- |
| `gitHub` | GitHub logs that monitor workflows created by [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions). |
| `gworkspace` | Google Workspace logs that monitor log entries such as admin actions, group and group membership actions, and events related to logging in. |  
| `m365` | Microsoft 365 audit logs that collect a range of data for Microsoft 365, including records from call details, performance data, SQL Server, security events, and access control activity. |

### Cloud Services

| Log type | Description | 
|:--- |:--- |
| `ad_ldap` | Active Directory logs that track LDAP queries, errors from the LDAP server, timeout events, and unsecure LDAP binds. |
| `apache_access` | Apache access logs that record data for all requests processed by an Apache HTTP server. |
| `okta` | Okta logs that record Okta events from a range of actions, such as downloading an export file, requesting application access, or revoking privileges. |
| `azure` | Microsoft Azure logs that monitor log data for cloud applications managed by Azure Cloud Services. |
| `cloudtrail` | AWS CloudTrail logs that monitor events for an AWS CloudTrail account. OpenSearch can ingest CloudTrail log data from both [Amazon Simple Storage Service](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) (Amazon S3) accounts and [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) service accounts. | 
| `s3` | Amazon S3 logs that track requests for access to an S3 bucket. |

### Network activity

| Log type | Description | 
|:--- |:--- |
| `dns` | DNS logs that store DNS activity. |
| `network` | Network logs that record events that happen in a system's network, such as login attempts and application events. | 
| `vpcflow` | [VPC Flow Logs](https://docs.aws.amazon.com/prescriptive-guidance/latest/logging-monitoring-for-application-owners/vpc-flow-logs.html) that capture information about the IP traffic going to and from network interfaces in your virtual private cloud (VPC). |

### Security

| Log type | Description | 
|:--- |:--- |
| `waf` | Web Application Firewall (WAF) logs (introduced in OpenSearch 2.11) for users that require monitoring of the WAF use case that's provided out of the box with Security Analytics. The role of WAF is to monitor and filter HTTP traffic between a web application and the internet. WAF prevents common security attacks, such as cross-site scripting (XSS) and SQL Injection (SQi). |
| `linux` | Linux system logs that record Linux syslog events. |
| `zeek` | Zeek monitoring logs created when Zeek detects new network activity. |
| `cisco` | Cisco logs for when a user tries to authenticate to a [Cisco router or firewall](https://www.cisco.com/c/en/us/support/docs/security-vpn/terminal-access-controller-access-control-system-tacacs-/10384-security.html#anc1).


### System activity

| Log type | Description | 
|:--- |:--- |
| `windows` | Windows logs that record events that have happened in the operating system, applications, and other Windows system services. |

### System logs

| Log type | Description | 
|:--- |:--- |
| [`auditd`](https://linux.die.net/man/8/auditd) | The component in a linux system resposnbile for writing audit records. |
| `builtin` | The built in security logs for your current operating system, such as Windows or MacOS. |
| `file_create` | Detects the creation of cron files or files in cron directories. |
| `modsecurity` | Detects multiple blocks by the `mod_security` module, such as a WAF. |
| `network_connection` | Detects any bash or mining connections to a remote IP address. |
| `other` | Detects any malicous behavior according to Sigma rules. For more information, see the [Sigma rules documentation](https://sigmahq.io/docs/basics/rules.html). |
| `process_creation` | Detects when new processes are created according to Sigma rules. |

### Other

| Log type | Description | 
|:--- |:--- |
| Other | `Email` | Logs that record email activity. |



## Page actions

The following list describes the main features found on the **Log types** page and the actions you can take:

* Select the log type **Name** to open the log type's details page. The **Details** tab is shown by default. This tab includes the log type's ID. You can also select the **Detection rules** tab to show all detection rules associated with the log type.
* In the **Actions** column, you can select the trash can icon ({::nomarkdown}<img src="{{site.url}}{{site.baseurl}}/images/alerting/trash-can-icon.png" class="inline-icon" alt="trash can icon"/>{:/}) to delete a custom log type (you cannot delete a standard OpenSearch-defined log type). Follow the prompts to confirm and safely remove the custom log type.
* Select **Create log type** in the upper-right corner of the screen to begin creating a custom log type. The **Create log type** page opens. Continue with the steps in the section that follows to create a custom log type.
* Using the **Category** and **Source** dropdowns, you can sort by the log type category or source, respectively. 

## Related articles
[Creating custom log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/custom-log-type/)


