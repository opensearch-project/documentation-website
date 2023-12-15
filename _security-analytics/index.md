---
layout: default
title: About Security Analytics
nav_order: 1
has_children: false
has_toc: false
nav_exclude: true
redirect_from:
  - /security-analytics/
---


# About Security Analytics


Security Analytics is a security information and event management (SIEM) solution for OpenSearch, designed to investigate, detect, analyze, and respond to security threats that can jeopardize the success of businesses and organizations and their online operations. These threats include the potential exposure of confidential data, cyber attacks, and other adverse security events. Security Analytics provides an out-of-the-box solution that installs automatically with any OpenSearch distribution. It includes the tools and features necessary for defining detection parameters, generating alerts, and responding effectively to potential threats.


### Resources and information

As part of the OpenSearch Project, Security Analytics exists in the open source community and benefits from the feedback and contributions of that community. To learn more about proposals for its development, options for making contributions, and general information on the platform, see the [Security Analytics repository](https://github.com/opensearch-project/security-analytics) at GitHub.

If you would like to leave feedback that could help improve Security Analytics, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/c/plugins/security-analytics/73).


---
## Components and concepts

Security Analytics includes a number of tools and features elemental to its operation. The major components that compose the plugin are summarized in the following sections.


### Detectors

Detectors are core components that are configured to identify a range of cybersecurity threats corresponding to an ever-growing knowledge base of adversary tactics and techniques maintained by the [MITRE ATT&CK](https://attack.mitre.org/) organization. Detectors use log data to evaluate events occurring in the system. They then apply a set of security rules specified for the detector and determine findings from these events.

For information about configuring detectors, see [Creating detectors]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/).


### Log types

Log types provide the data used to evaluate events occurring in a system. OpenSearch supports several types of logs and provides out-of-the-box mappings for the most common log sources. See [Supported log types]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/log-types/) for a list of log types currently supported by Security Analytics.

Log types are specified during the creation of detectors, including steps for mapping log fields to the detector. Security Analytics also automatically selects an appropriate set of rules based on a specific log type and populates them for the detector.


### Detection rules

The security rules, or threat detection rules, define the conditional logic applied to ingested log data that allows the system to identify an event of interest. Security Analytics uses prepackaged, open source [Sigma rules](https://github.com/SigmaHQ/sigma) as a starting point for describing relevant log events. But with their inherently flexible format and easy portability, Sigma rules provide Security Analytics users with options for importing and customizing the rules. You can take advantage of these options using either OpenSearch Dashboards or the API.

For information about configuring rules, see [Working with rules]({{site.url}}{{site.baseurl}}/security-analytics/usage/rules/).


### Findings

Findings are generated every time a detector matches a rule with a log event. Findings do not necessarily point to imminent threats within the system, but they always isolate an event of interest. Because they represent the result of a specific definition for a detector, findings include a unique combination of select rules, a log type, and a rule severity. As such, you can search for specific findings in the Findings window, and you can filter findings in the list based on severity and log type.

To learn more about findings, see [Working with findings]({{site.url}}{{site.baseurl}}/security-analytics/usage/findings/).


### Alerts

When defining a detector, you can specify certain conditions that will trigger an alert. When an event triggers an alert, the system sends a notification to a preferred channel, such as Amazon Chime, Slack, or email. The alert can be triggered when the detector matches one or multiple rules. Further conditions can be set by rule severity and tags. You can also create a notification message with a customized subject line and message body.

For information about setting up alerts, see [Creating detectors]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/). For information about managing alerts in the Alerts window, see [Working with alerts]({{site.url}}{{site.baseurl}}/security-analytics/usage/alerts/).


### Correlation engine

The correlation engine gives Security Analytics the ability to compare findings from different log types and draw correlations between them. This facilitates understanding of the relationships between findings from different systems in an infrastructure and increases confidence that an event is meaningful and requires attention.

The correlation engine uses correlation rules to define threat scenarios involving different log types. It can then perform queries on logs to match relevant findings from those different log sources. To depict relationships between events occurring in different logs, a correlation graph provides a visual representation of findings, their connections, and the proximity of those connections. While the correlation rules define what threat scenarios to look for, the graph provides a visualization that helps you identify the relationships between different findings in a chain of security events.

To learn more about defining threat scenarios for correlation rules, see [Creating correlation rules]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/correlation-config/). To learn more about using the correlation graph, see [Working with the correlation graph]({{site.url}}{{site.baseurl}}/security-analytics/usage/correlation-graph/).


---
## First steps

To get started with Security Analytics, you need to define detectors, ingest log data, generate findings, define correlation rules, and configure alerts. See [Setting up Security Analytics]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/index/) to begin configuring the platform to meet your objectives.

