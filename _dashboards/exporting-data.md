---
layout: default
title: Exporting data
nav_order: 72
---

# Exporting data

OpenSearch Dashboards provides several ways to download content. The method depends on what you want to export: the documents themselves, the data behind a visualization, a rendered copy of a dashboard, or the definitions of the objects that you created.

The following table lists the export methods.

| What you want to export | Method | Format |
| :--- | :--- | :--- |
| Documents returned by a search | [Download the search results from Discover](#exporting-search-results) | CSV |
| A single document | [Copy the document from Discover](#exporting-search-results) | JSON |
| The data that a visualization displays | [Download the data from the Inspect panel](#exporting-visualization-data) | CSV |
| A dashboard, visualization, saved search, or notebook as a file to share, on demand or on a schedule | [Generate a report](#generating-reports) | PDF, PNG, CSV, or XLSX |
| Dashboards, visualizations, index patterns, and other saved objects, to back them up or copy them to another instance | [Export saved objects](#exporting-saved-objects) | NDJSON |

## Exporting search results

In **Discover**, filter the documents and choose the fields that you want to export, and then select **Download as CSV**. You can download either the documents visible on the page or all matching documents, up to 10,000. To copy a single document instead, expand the document and copy its JSON representation.

For more information, see [Exporting data in Discover]({{site.url}}{{site.baseurl}}/dashboards/discover/index-discover/#exporting-data).

## Exporting visualization data

To download the data that a visualization displays, follow these steps:

1. Open the visualization:
   - In the **Visualize** application, open the visualization and select **Inspect** on the top menu.
   - On a dashboard, open the panel menu of the visualization and select **Inspect**.
1. Select **Download CSV**.
1. Select one of the following options:
   - **Formatted CSV**: Downloads the data as it appears in the table, using the field formats of the index pattern.
   - **Raw CSV**: Downloads the data as it is stored. For example, dates are downloaded as timestamps.

## Generating reports

A report captures a dashboard, visualization, or notebook as a PDF or PNG file, or the results of a saved search as a CSV or XLSX file. Generate a report once or create a report definition that generates reports on a schedule. To export search results on a schedule or from a script, save the search in **Discover** and generate a CSV or XLSX report from the saved search.

For more information, see [Reporting]({{site.url}}{{site.baseurl}}/dashboards/reporting/).

## Exporting saved objects

Saved objects are the definitions of the dashboards, visualizations, saved searches, index patterns, and other resources that you create in OpenSearch Dashboards. Exporting saved objects downloads these definitions, not the data that they display. Use this method to back up your objects or to import them into another OpenSearch Dashboards instance.

For more information, see [Saved objects]({{site.url}}{{site.baseurl}}/dashboards/management/saved-objects/).
