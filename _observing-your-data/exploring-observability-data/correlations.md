---
layout: default
title: Correlations
nav_order: 60
parent: Exploring observability data
redirect_from:
  - /observability-plugin/correlations/
---

# Correlations
**Introduced 3.5**
{: .label .label-purple }

Correlations allow you to link trace datasets with logs datasets, enabling you to view related log entries when analyzing distributed traces. Correlating datasets helps you quickly identify the root cause of issues by connecting trace spans to their corresponding application logs.

When troubleshooting distributed systems, you often need to correlate data across multiple sources. A trace might show that a request failed, but the detailed error information is in your application logs. Using correlations, you can:

- Link a single trace dataset to up to five logs datasets.
- View related logs directly from the span details panel.
- Navigate seamlessly between trace analysis and log exploration.

## Prerequisites

Before using correlations, ensure that you have fulfilled the following prerequisites:

1. **Enable feature flags**: Add the following settings to your `opensearch_dashboards.yml` file:

   ```yaml
   workspace.enabled: true
   data_source.enabled: true
   explore.enabled: true
   explore.discoverTraces.enabled: true
   datasetManagement.enabled: true
   ```
   {% include copy.html %}

   After updating the configuration file, restart OpenSearch Dashboards for the changes to take effect.

1. **Create datasets**: You must have at least one trace dataset and one logs dataset configured. For detailed instructions, see [Datasets]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/datasets/).

1. **Configure schema mappings**: Your logs datasets must have schema mappings configured. At the minimum, you need to map the **Trace ID** field so that logs can be matched to traces.

## Correlation requirements

For correlations to work correctly, your logs data must include the following fields that can be mapped to trace context.

| Field | Purpose |
|:------|:--------|
| **Trace ID** | Links log entries to specific traces |
| **Span ID** | Links log entries to specific spans |
| **Service name** | Filters logs by service |
| **Timestamp** | Orders log entries chronologically |

If your logs do not follow OpenTelemetry conventions, configure schema mappings in your logs dataset to map your custom field names to these standard fields.

## Creating a trace-to-logs correlation

To create a correlation between a trace dataset and logs datasets, follow these steps:

1. Navigate to **Datasets** in the left navigation.

2. Select the trace dataset you want to correlate with logs.

3. In the dataset details page, select the **Correlated datasets** tab, as shown in the following image.

   ![Trace dataset Correlated datasets tab]({{site.url}}{{site.baseurl}}/images/datasets/correlations-trace-dataset-tab.png)

4. Select **Configure correlation**.

5. In the **Configure correlation** dialog, select up to five logs datasets to correlate with this trace dataset, as shown in the following image.

   ![Configure correlation dialog]({{site.url}}{{site.baseurl}}/images/datasets/correlations-configure-dialog.png)

6. Select **Save** to create the correlation.

7. The correlated logs datasets now appear in the **Correlated datasets** table, as shown in the following image.

   ![Created correlation in table]({{site.url}}{{site.baseurl}}/images/datasets/correlations-created-table.png)

## Viewing correlations in logs datasets

You can view the trace datasets that are correlated with a logs dataset from the logs dataset details:

1. Navigate to **Datasets** in the left navigation.

2. Select a logs dataset that has been correlated with a trace dataset.

3. Select the **Correlated traces** tab to view trace datasets linked with this logs dataset, as shown in the following image.

   ![Logs dataset Correlated traces tab]({{site.url}}{{site.baseurl}}/images/datasets/correlations-logs-dataset-tab.png)

This view is read-only. To modify correlations, you must edit them from the trace dataset.
{: .note}

## Using correlations in the Traces page

After creating correlations, you can access related logs when analyzing traces.

### Viewing related logs in span details

1. Navigate to **Discover** > **Traces**. 

2. Select a trace to view its details.

3. Select a span within the trace to open the **Span details**.

4. In **Span details**, select the **Logs** tab to open **Related logs**, as shown in the following image. The related logs are retrieved by matching the trace ID from the span to log entries in your correlated logs datasets.

   ![Span details with related logs]({{site.url}}{{site.baseurl}}/images/datasets/correlations-span-details-logs.png)

6. Select a log entry to view its full details or navigate to the **Logs** page for further exploration.

## Managing correlations

You can edit or remove correlations from the trace dataset details page.

### Editing correlations

To modify an existing correlation, follow these steps:

1. Navigate to **Datasets** in the left navigation and select the trace dataset you want to modify.
2. Select the **Correlated datasets** tab.
3. Select **Configure correlation** to modify the list of correlated logs datasets.
4. Add or remove datasets as needed.
5. Select **Save** to apply changes.

### Removing correlations

To remove a correlation:

1. Navigate to **Datasets** in the left navigation and select the trace dataset you want to modify.
2. Select the **Correlated datasets** tab.
3. Delete the configured correlations using the delete icon.

## Related documentation

- [Datasets]({{site.url}}{{site.baseurl}}/observing-your-data/exploring-observability-data/datasets/) -- Create and manage datasets
- [Data Prepper]({{site.url}}{{site.baseurl}}/data-prepper/) -- Ingest OpenTelemetry data into OpenSearch
