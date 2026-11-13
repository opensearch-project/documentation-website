---
layout: default
title: Reporting
nav_order: 75
has_children: true
has_toc: false
redirect_from:
  - /dashboards/reporting/
  - /reporting/
  - /reporting/index/
---

# Reporting

Use reporting to generate PDF, PNG, CSV, and XLSX reports from dashboards, visualizations, saved searches, and notebooks, either on demand or on a schedule. OpenSearch Dashboards renders every report, so reporting requires a running OpenSearch Dashboards instance even when you generate reports using the API or the CLI.

To download search results or saved objects without creating a report, see [Exporting data]({{site.url}}{{site.baseurl}}/dashboards/exporting-data/).

## Report definitions and reports

Reporting uses two concepts:

- A **report definition** is a saved configuration that specifies which dashboard, visualization, saved search, or notebook to capture, the file format, the time range, and an optional schedule. You can reuse a report definition to generate reports on demand or on a recurring schedule.
- A **report** is the generated file produced from a report definition or a one-time download.

Deleting a report definition does not delete the reports generated from it.

## Report sources and file formats

The available file formats depend on the report source. Dashboards, visualizations, and notebooks are captured as rendered images. Saved searches are exported as the rows returned by the query.

| Report source | File formats |
| :--- | :--- |
| Dashboard | PDF, PNG |
| Visualization | PDF, PNG |
| Notebook | PDF, PNG |
| Saved search | CSV, XLSX |

To download the data behind a visualization, see [Exporting visualization data]({{site.url}}{{site.baseurl}}/dashboards/exporting-data/#exporting-visualization-data).

CSV and XLSX reports contain up to 10,000 rows by default. To change this limit, set the record limit when you create a report definition. Reports have no explicit size limit, but extremely large documents can cause report generation to fail with an out-of-memory error from the V8 JavaScript engine.
{: .tip }

## Choosing a method

The following table lists the ways to generate reports.

| Method | Use it to | Requires the Reporting plugin |
| :--- | :--- | :--- |
| [OpenSearch Dashboards]({{site.url}}{{site.baseurl}}/dashboards/reporting/report-dashboard-index/) | Generate reports from the page that you are viewing, and create and manage report definitions. | Yes |
| [Reporting CLI]({{site.url}}{{site.baseurl}}/dashboards/reporting/rep-cli-index/) | Generate reports from scripts, cron jobs, or AWS Lambda functions, and send them by email using Amazon SES or SMTP. | Only for CSV reports |
| [Reporting API]({{site.url}}{{site.baseurl}}/dashboards/reporting/api/) | Create report definitions and generate reports programmatically. | Yes |

## Access control

To create reports, you must have the correct permissions. For a summary of the predefined roles and the permissions they grant, see [Predefined roles]({{site.url}}{{site.baseurl}}/security/access-control/users-roles/#predefined-roles).

When resource sharing is enabled for reporting, owners of report definitions and reports, and users with sharing permissions, can grant access to specific users, roles, and backend roles. For more information, see [Report definition access control]({{site.url}}{{site.baseurl}}/dashboards/reporting/report-definition-access-control/) and [Report instance access control]({{site.url}}{{site.baseurl}}/dashboards/reporting/report-instance-access-control/).
