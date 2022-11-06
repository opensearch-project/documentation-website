---
layout: default
title: About security analytics
nav_order: 1
has_children: false
has_toc: false
redirect_from:
  - /security-analytics/
---

Security analytics is an experimental plugin for OpenSearch 2.4. Therefore, we do not recommend the use of security analytics in a production environment at this time. For updates on the progress of security analytics or for information on how to make contributions, visit the [security analytics repository](https://github.com/opensearch-project/security-analytics) at GitHub.
{: .warning }


# About security analytics

Security analytics is a security information and event management (SIEM) solution for OpenSearch, designed to investigate, detect, analyze, and respond to security threats that can jeopardize the success of businesses and organizations and their online operations. These threats include the potential exposure of confidential data, cyber attacks, and other adverse security events. Security analytics provides an out-of-the-box solution that installs automatically with any OpenSearch distribution. It includes the tools and features necessary for defining detection parameters, generating alerts, and responding effectively to potential threats.

### Resources and information

As part of the OpenSearch project, security analytics exists in the open source community and benefits from the feedback and contributions of that community. To learn more about proposals for its development, options for making contributions, and general information on the platform, see the [security analytics repository](https://github.com/opensearch-project/security-analytics) at GitHub.

## Components and concepts

Security analytics includes a number of tools and features elemental to its operation. The major components that compose the plugin are summarized in the following sections.

### Detectors

Detectors are core components that are configured to identify a range of cyber security threats corresponding to an ever-growing knowldege base of adversial tactics and techniques maintained by the [MITRE ATT&CK](https://attack.mitre.org/) organization. Detectors use log data to evaluate events occuring in the system. They then apply a set of security rules specified for the detector and determine findings from these events.

For information on configuring detectors, see [Creating detectors](#detectors-config).

### Log types

Log types provide the data used to evaluate events occuring in a system. OpenSearch supports several types of logs and provides out-of-the-box mappings for the most common log sources. Currently supported log sources include:
* Netflow
* DNS logs
* Apache access logs
* Windows logs
* AD/LDAP
* System logs
* Cloud Trail logs
* S3 access logs

Log types are specified during the creation of detectors, including steps for mapping log fields to the detector. Security analytics also automatically selects an appropriate set of rules based on a specific log type and populates them for the detector.

### Rules

Rules, or threat detection rules, define the conditional logic applied to ingested log data that allows the system to identify an event of interest. Security analytics uses pre-packaged, open source [Sigma rules](https://github.com/SigmaHQ/sigma) as a starting point for describing relevant log events. But with its flexible format, Sigma rules easily let security analytics give users options to customize rules. Rules can be customized using either the Dashboards interface or the API.

For information on configuring rules, see [Creating rules](#rules-config).

### Findings

Findings are generated every time a detector matches a rule with a log event. Findings do not necessarily point to imminent threats within the system, but they always isolate an event of interest. Because they represent the result of a specific definition for a detector, findings include a unique combination of a rule, a detector, a log type, and a rule severity. As such, you can search for specific findings in the Findings window, and you can filter findings in the list based on severity and log type.

To learn more about findings, see [Working with findings](#findings).

### Alerts

When defining a detector, you can specify certain conditions that will trigger an alert. When an event triggers an alert, the system sends a notification to a channel—such as Chime, Slack, email, etc.—that you specify during configuration of the alert. The alert can be triggered when the detector matches one or multiple rules. Further conditions can be set by rule severity and tags. You can also create a notification message with a customzied subject line and message body.

For information on setting up alerts, see [Creating detectors](#detectors-config). For information on managing alerts on the Alerts window, see [Working with alerts](#alerts).

## First steps

To get started with security analytics, you need to define detectors, ingest log data, generate findings, and configure alerts. See [Setting up security analytics](#config-index) to begin configuring the platform to your needs and objectives.

