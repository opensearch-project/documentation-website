---
layout: default
title: Discover traces
nav_order: 45
---

# Discover traces
**Introduced 3.5**
{: .label .label-purple }

This is an experimental feature and is not recommended for use in a production environment. For updates on the progress of the feature or if you want to leave feedback, join the discussion on the [OpenSearch forum](https://forum.opensearch.org/).    
{: .warning}

The Discover **Traces** page in OpenSearch Dashboards provides an enhanced way to explore and analyze trace data within the Observability plugin. This page extends the traditional Discover experience by offering specialized capabilities for working with trace data.

## Prerequisites

Before using the **Traces** page, ensure that you have the enabled the following:

- [Multiple data sources]({{site.url}}{{site.baseurl}}/dashboards/management/multi-data-sources/)
- [Workspaces]({{site.url}}{{site.baseurl}}/dashboards/workspace/workspace/#enabling-the-workspace-feature)

Note: Workspaces are not compatible with multi-tenancy. To enable workspaces, you must first disable multi-tenancy by setting `opensearch_security.multitenancy.enabled: false`.
{: .note}

## Enabling the Traces page

To enable the **Traces** page, add the following configuration to your `opensearch_dashboards.yml` file:

```yaml
# The new OpenSearch Dashboards Experience
# Enable the following three flags together for the new OpenSearch Dashboards discover features
# ===========================================

# Set the value of this setting to true to enable multiple data source feature.
data_source.enabled: true

# Set the value to true to enable workspace feature
# Please note, workspace will not work with multi-tenancy. To enable workspace feature,
# you need to disable multi-tenancy first with `opensearch_security.multitenancy.enabled: false`
workspace.enabled: true

# Enable the explore feature
explore.enabled: true

# @experimental Set the value to true to enable discover traces
explore.discoverTraces.enabled: true
```

After updating the configuration file, restart OpenSearch Dashboards in order for the changes to take effect.

## Accessing the Traces page

To access the **Traces** page, navigate to an **Observability** workspace. In the left navigation, expand **Discover** and select **Traces**, as shown in the following image.

![Discover Traces page in navigation]({{site.url}}{{site.baseurl}}/images/discover-traces/trace-page.png)

## Configuring trace datasets

To configure trace datasets, use one of the following options.

### Automatic dataset creation

If your data source follows the OpenTelemetry naming conventions, the **Traces** page can automatically create trace and log datasets from your data by searching for indexes with the following naming patterns:

- **Traces**: `otel-v1-apm-span*`
- **Correlated logs**: `logs-otel-v1*`

When these indexes are detected, select the **Create Trace Datasets** button, as shown in the following image, to automatically generate the datasets and establish the correlation relationship between traces and logs.

![Auto-create trace datasets]({{site.url}}{{site.baseurl}}/images/discover-traces/trace-auto-create.png)

### Manual dataset creation

If your indexes use different naming conventions, you must manually create the datasets and configure the correlation relationships between traces and logs. Navigate to the **Datasets** tab and create a dataset with the **Trace** signal type.

## Exploring trace data

The the **Traces** page provides comprehensive tools for analyzing span data and understanding trace performance, including:

- **RED metrics**: View rate, error, and duration metrics at the top of the page to quickly assess trace performance and health.
- **Faceted fields**: Use faceted field filters to filter and analyze specific aspects of your traces.
- **Span table**: Browse spans using sortable columns and quick access to detailed information.

### Viewing a specific span

To view detailed information about a specific span, select the timestamp in the span table. This opens the **Trace Details** flyout, shown in the following image.

![Trace details flyout]({{site.url}}{{site.baseurl}}/images/discover-traces/trace-details-flyout.png)

The **Trace Details** flyout displays the following information:

- The relationship of the selected span within its parent trace.
- The hierarchical structure showing how the span relates to other spans in the same trace.
- The span attributes and metadata.

### Trace detail page

To access the full trace detail page from the **Trace Details** flyout, use one of the following options:

- Select the **span ID** from the the **Traces** page table.
- Select **Open full page** from the flyout.

The full page view provides an expanded interface for deeper trace analysis, featuring a timeline visualization that shows the hierarchical span relationships and durations, along with detailed span information in a side panel, as shown in the following image.

![Discover Traces page with RED metrics and faceted fields]({{site.url}}{{site.baseurl}}/images/discover-traces/trace-detail-page.png)

## Correlating traces with logs

The **Traces** page provides seamless integration with log data, allowing you to navigate from traces to related logs while preserving proper context.

### Viewing related logs

to view the related logs, follow these steps:

1. In the **Trace Details** flyout, locate the **Related logs** section. 
1. Select the **View in Discover Logs** button to navigate to the correlated log entries for the selected trace, as shown in the following image.

![Related logs button in trace details]({{site.url}}{{site.baseurl}}/images/discover-traces/related-logs.png)

### Log redirection with context

When you select **View in Discover Logs**, OpenSearch Dashboards automatically redirects you to the **Logs** page with the trace context applied, as shown in the following image. 

![Discover Logs page with trace context]({{site.url}}{{site.baseurl}}/images/discover-traces/logs-redirection.png)

The logs are filtered to show only entries related to the selected trace, making it easier to troubleshoot issues and understand the full context of trace events. Preserving context streamlines the debugging process by providing a unified view of your telemetry data, helping you identify root causes and understand the complete picture of application behavior.
