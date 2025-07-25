---
layout: default
title: The Overview page
parent: Using Security Analytics
nav_order: 25
canonical_url: https://docs.opensearch.org/latest/security-analytics/usage/overview/
---

# The Overview page

When you select **Security Analytics** from the top menu, the Overview page is displayed. The Overview page consists of five sections:
* Findings and alert count
* Top recent alerts
* Top recent findings
* Most frequent detection rules
* Detectors

Each section provides a summary description for each element of Security Analytics, along with controls that let you take action for each item.

## Overview and getting started

The upper-right corner of the Overview page contains two control buttons for refreshing information and getting started with Security Analytics. You can select the **Refresh** button to refresh all of the information on the page. You can also select the **Getting started** link to expand the Get started with Security Analytics window, which inludes a summary of the steps for set up as well as control buttons that allow you to jump to any of the steps.
<img src="{{site.url}}{{site.baseurl}}/images/Security/get-started.png" alt="The getting started quick launch window">
* In step 1 of setup, select **Create detector** to define a detector. 
* In step 2, select **View findings** to go to the Findings page. For more on findings, see [Working with findings]({{site.url}}{{site.baseurl}}/security-analytics/usage/findings/)
* In step 3, select **Manage rules** to go to the Rules page. For more on rules, see [Working with rules]({{site.url}}{{site.baseurl}}/security-analytics/usage/rules/)

## Findings and alert count

The Findings and alert count section provides a graph showing data on the latest findings. Use the **Group by** dropdown menu to select between all findings and findings by log type.

## Top recent alerts

Top recent alerts displays recent alerts by time, trigger name, and alert severity. Select **View alerts** to go to the Alerts page.

## Top recent findings

Top recent findings displays recent findings by time, rule name, rule severity, and detector. Select **View all findings** to go to the Findings page.

## Most frequent detection rules

This section provides a graphical representation of detection rules that trigger findings most often and how they compare to others as a percentage of the whole. Rules are also listed to the right side of the graph.

## Detectors

Detectors displays a list of available detectors by detector name, status (active/inactive), and log type. Select **View all detectors** to go to the Detectors page. Select **Create detector** to go directly to the Define detector page.

