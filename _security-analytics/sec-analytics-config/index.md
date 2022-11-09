---
layout: default
title: Setting up security analytics
nav_order: 10
has_children: true
has_toc: false
redirect_from:
  - /security-analytics/sec-analytics-config/
---

# Setting up security analytics

Before security analytics can begin generating findings and sending alerts, administrators must create detectors and make log data available to the system. Once detectors are able to generate findings, you can fine-tune your alerts to focus on specific areas of interest. The following steps outline the basic workflow for setting up components in security analytics.

1. Create security detectors and ingest log data. See [Creating detectors](#detectors-config) for details.
1. Inspect findings generated from detector output and create any additional alerts.
1. If desired, create custom rules by editing pre-packaged rules. See [Creating rules](#rules-config) for details.

## Navigate to security analytics

To get started, select the top menu on the Dashboards home page and then select **Security Analytics**. The Overview page for security analytics is displayed.

<image here>

From the options on the left side of the page, select **Detectors** to begin [creating a detector](#detectors-config).

<image of list>

