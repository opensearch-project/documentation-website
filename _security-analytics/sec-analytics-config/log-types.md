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
| **DNS logs** | A log that stores Domain Name System (DNS) activity. <br> <br> Security Analytics supports Open Cybersecurity Schema Framework (OCSF) log and event data, which includes the Security Lake log type Route 53. Given that Route 53 is a log that captures DNS activity, its log type should be specified as DNS logs when defining a detector. |
| **Apache access logs** | A log type that is responsible for recording data for all requests processed by an Apache HTTP server. 
| **Windows logs** | 
| **AD/LDAP logs** | 
| **System logs** | 
| **AWS CloudTrail logs** | 
| **Amazon S3 access logs** | 
| **Google Workspace logs** | 
| **GitHub actions** | 
| **Microsoft 365 logs** | 
| **Okta events** | 
| **Microsoft Azure logs** | 
| **VPC Flow logs** | 

