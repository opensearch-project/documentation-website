---
layout: default
title: Supported log types
parent: Setting up Security Analytics
nav_order: 16
---


# Supported log types

Logs contain raw data about events that happen throughout a system and in its separate parts. The following table shows the log types that are currently supported by Security Analytics for ingestion, mapping, and monitoring.

| Log type | Description |
| :--- |:--- |
| **Network events** | A log that records events that happen in a system's network, such as login attempts and application events. |
| **DNS logs** | A log that stores Domain Name System (DNS) activity. <br> <br> Security Analytics supports [Open Cybersecurity Schema Framework](https://docs.aws.amazon.com/security-lake/latest/userguide/open-cybersecurity-schema-framework.html) (OCSF) log and event data, which includes the Security Lake log type Route 53. Given that Route 53 is a log that captures DNS activity, its log type should be specified as DNS logs when defining a detector. |
| **Apache access logs** | A log type that is responsible for recording data for all requests processed by an Apache HTTP server. 
| **Windows logs** | Logs that record events that have happened in the operating system, applications, and other system services for Windows.
| **AD/LDAP logs** | Active Directory logs that track such things as LDAP queries, errors from the LDAP server, time-out events, and unsecure LDAP binds.
| **System logs** | Logs that record events happening in the operating system.
| **AWS CloudTrail logs** | Logs that monitor events for an AWS CloudTrail account. OpenSearch can ingest CloudTrail log data from both [AWS Simple Storage Service](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) (S3) accounts and [Amazon Security Lake](https://docs.aws.amazon.com/security-lake/latest/userguide/what-is-security-lake.html) service accounts.  
| **Amazon S3 access logs** | These logs track requests for access to an Amazon S3 bucket.
| **Google Workspace logs** | Logs for Google Workspace that can monitor log entries such as admin actions, group and group membership actions, and events having to do with logging in.   
| **GitHub actions** | Logs that monitor workflows created by [GitHub Actions](https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions).
| **Microsoft 365 logs** | Microsoft 365 audit logs collect a range of data for Microsoft 365 including records from call details, performance data, SQL Server, security events, and access control activity.
| **Okta events** | These logs record Okta events from a range of actions such as downloading an export file, requesting an application access, or revoking privileges. 
| **Microsoft Azure logs** | Logs that monitor log data for cloud applications managed by Microsoft Azure Cloud Services.
| **VPC Flow logs** | [VPC Flow Logs](https://docs.aws.amazon.com/prescriptive-guidance/latest/logging-monitoring-for-application-owners/vpc-flow-logs.html) capture information about the IP traffic going to and from network interfaces in your VPC.

