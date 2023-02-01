---
layout: default
title: Setting up Security Analytics
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /security-analytics/sec-analytics-config/
---

# Setting up Security Analytics

Before Security Analytics can begin generating findings and sending alerts, administrators must create detectors and make log data available to the system. Once detectors are able to generate findings, you can fine-tune your alerts to focus on specific areas of interest. The following steps outline the basic workflow for setting up components in Security Analytics.

1. Create security detectors and alerts, and ingest log data. See [Creating detectors]({{site.url}}{{site.baseurl}}/security-analytics/sec-analytics-config/detectors-config/) for details.
1. Inspect findings generated from detector output and create any additional alerts.
1. If desired, create custom rules by duplicating and then modifying pre-packaged rules. See [Customizing rules]({{site.url}}{{site.baseurl}}/security-analytics/usage/rules/#customizing-rules) for details.

## Navigate to Security Analytics

1. To get started, select the top menu on the Dashboards home page and then select **Security Analytics**. The Overview page for Security Analytics is displayed.
1. From the options on the left side of the page, select **Detectors** to begin creating a detector.

<img src="{{site.url}}{{site.baseurl}}/images/Security/secanalytics-det-nav.png" alt="Navigating to create a detector page" width="70%">
