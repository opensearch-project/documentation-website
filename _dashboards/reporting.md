---
layout: default
title: Reporting
nav_order: 20
canonical_url: https://docs.opensearch.org/latest/reporting/report-dashboard-index/
---


# Reporting

You can use OpenSearch Dashboards to create PNG, PDF, and CSV reports. To create reports, you must have the correct permissions. For a summary of the predefined roles and the permissions they grant, see the [security plugin]({{site.url}}{{site.baseurl}}/security-plugin/access-control/users-roles#predefined-roles).

CSV reports have a non-configurable 10,000 row limit. They have no explicit size limit (e.g. in MB), but extremely large documents could cause report generation to fail with an out of memory error from the V8 JavaScript engine.
{: .tip }


## Create reports from Discovery, Visualize, or Dashboard

Quickly generate an on-demand report from the current view.

1. From the top menu bar, choose **Reporting**.
1. For dashboards or visualizations, choose **Download PDF** or **Download PNG**. From the Discover page, choose **Download CSV**.

   Reports generate asynchronously in the background and might take a few minutes, depending on the size of the report. A notification appears when your report is ready to download.

1. To create a schedule-based report, choose **Create report definition**. Then proceed to [Create reports using a definition](#create-reports-using-a-definition). This option pre-fills many of the fields for you based on the visualization, dashboard, or data you were viewing.


## Create reports using a definition

Definitions let you generate reports on a periodic schedule.

1. From the navigation panel, choose **Reporting**.
1. Choose **Create**.
1. Under **Report settings**, enter a name and optional description for your report.
1. Choose the **Report Source** (i.e. the page from which the report is generated). You can generate reports from the **Dashboard**, **Visualize**, or **Discover** pages.
1. Select your dashboard, visualization, or saved search. Then choose a time range for the report.
1. Choose an appropriate file format for the report.
1. (Optional) Add a header or footer to the report. Headers and footers are only available for dashboard or visualization reports.
1. Under **Report trigger**, choose either **On-demand** or **Schedule**.

   For scheduled reports, select either **Recurring** or **Cron based**. You can receive reports daily or at some other time interval. Cron expressions give you even more flexiblity. See [Cron expression reference]({{site.url}}{{site.baseurl}}/monitoring-plugins/alerting/cron/) for more information.

1. Choose **Create**.

## Troubleshooting

### Chromium fails to launch with OpenSearch Dashboards

While creating a report for dashboards or visualizations, you might see a the following error:

![OpenSearch Dashboards reporting pop-up error message]({{site.url}}{{site.baseurl}}/images/reporting-error.png)

This problem can occur for two reasons:

- You don't have the correct version of `headless-chrome` to match the operating system on which OpenSearch Dashboards is running. Download the correct version [here](https://github.com/opensearch-project/dashboards-reports/releases/tag/chromium-1.12.0.0).

- You're missing additional dependencies. Install the required dependencies for your operating system from the [additional libraries](https://github.com/opensearch-project/dashboards-reports/blob/main/dashboards-reports/rendering-engine/headless-chrome/README.md#additional-libaries) section.
