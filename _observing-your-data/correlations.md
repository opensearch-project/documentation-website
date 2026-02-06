---
layout: default
title: Correlations
nav_order: 43
redirect_from:
  - /observability-plugin/correlations/
---

# Correlations
Introduced 3.5
{: .label .label-purple }

Correlations allow you to link trace datasets with logs datasets, enabling you to view related log entries when analyzing distributed traces. This feature helps you quickly identify the root cause of issues by connecting trace spans to their corresponding application logs.

## Overview

When troubleshooting distributed systems, you often need to correlate data across multiple sources. A trace might show that a request failed, but the detailed error information is in your application logs. Correlations bridge this gap by allowing you to:

- Link a single trace dataset to up to five logs datasets.
- View related logs directly from the span details panel.
- Navigate seamlessly between trace analysis and log exploration.

## Prerequisites

Before creating correlations, ensure the following:

1. **Feature flags enabled**: Add the following settings to your `opensearch_dashboards.yml` file:

   ```yaml
   workspace.enabled: true
   data_source.enabled: true
   explore.enabled: true
   explore.discoverTraces.enabled: true
   datasetManagement.enabled: true
   ```
   {% include copy.html %}

2. **Datasets created**: You must have at least one trace dataset and one logs dataset configured. See [Datasets]({{site.url}}{{site.baseurl}}/observing-your-data/datasets/) for instructions.

3. **Schema mappings configured**: Your logs datasets must have schema mappings configured for the correlation to work. At minimum, you need to map the **Trace ID** field so that logs can be matched to traces.

## Creating a trace-to-logs correlation

To create a correlation between a trace dataset and logs datasets, follow these steps:

1. Navigate to **Management** > **Datasets**.

2. Select the trace dataset you want to correlate with logs.

3. In the dataset details page, select the **Correlated datasets** tab.

   ![Trace dataset Correlated datasets tab]({{site.url}}{{site.baseurl}}/images/datasets/correlations-trace-dataset-tab.png)

4. Select **Configure correlation** to open the configuration dialog.

5. In the dialog, select up to five logs datasets to correlate with this trace dataset.

   ![Configure correlation dialog]({{site.url}}{{site.baseurl}}/images/datasets/correlations-configure-dialog.png)

6. Select **Save** to create the correlation.

7. The correlated logs datasets now appear in the table.

   ![Created correlation in table]({{site.url}}{{site.baseurl}}/images/datasets/correlations-created-table.png)

## Viewing correlations from logs datasets

You can also view correlation associations from the logs dataset perspective:

1. Navigate to **Management** > **Datasets**.

2. Select a logs dataset that has been correlated with a trace dataset.

3. Select the **Correlated traces** tab to see which trace datasets are linked.

   ![Logs dataset Correlated traces tab]({{site.url}}{{site.baseurl}}/images/datasets/correlations-logs-dataset-tab.png)

This view is read-only. To modify correlations, you must edit them from the trace dataset.
{: .note}

## Using correlations in Discover traces

After creating correlations, you can access related logs when analyzing traces.

### Viewing related logs from span details

1. Navigate to **Discover** > **Traces** 

2. Select a trace to view its details.

3. Select a span within the trace to open the span details panel.

4. In the span details panel, locate the **Related logs** section.

   ![Span details with related logs]({{site.url}}{{site.baseurl}}/images/datasets/correlations-span-details-logs.png)

5. The related logs are retrieved by matching the trace ID from the span to log entries in your correlated logs datasets.

6. Select a log entry to view its full details or navigate to the Discover logs for further exploration.

## Requirements for correlation

For correlations to work correctly, your logs data must include fields that can be mapped to trace context:

| Field | Purpose | 
|:------|:--------|
| **Trace ID** | Links log entries to specific traces | 
| **Span ID** | Links log entries to specific spans |
| **Service name** | Filters logs by service |
| **Timestamp** | Orders log entries chronologically |

If your logs do not follow OpenTelemetry conventions, configure schema mappings in your logs dataset to map your custom field names to these standard fields.

## Managing correlations

You can edit or remove correlations from the trace dataset details page.

### Editing correlations

To modify an existing correlation:

1. Navigate to the trace dataset details page.
2. Select the **Correlated datasets** tab.
3. Select **Configure correlation** to modify the list of correlated logs datasets.
4. Add or remove datasets as needed.
5. Select **Save** to apply changes.

### Removing correlations

To remove a correlation:

1. Navigate to the trace dataset details page.
2. Select the **Correlated datasets** tab.
3. Delete the configured correlations using delete icon.

## Related documentation

- [Datasets]({{site.url}}{{site.baseurl}}/observing-your-data/datasets/) -- Create and manage datasets
- [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) -- Ingest OpenTelemetry data into OpenSearch
