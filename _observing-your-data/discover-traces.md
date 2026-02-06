---
layout: default
title: Discover Traces
nav_order: 45
redirect_from:
  - /observing-your-data/discover-traces/
---

# Discover Traces

Introduced 3.5
{: .label .label-purple }

Discover Traces is an experimental feature in OpenSearch Dashboards that provides an enhanced way to explore and analyze trace data within the Observability plugin. This feature extends the traditional Discover experience by offering specialized capabilities for working with trace data.

## Prerequisites

Before enabling Discover Traces, ensure that you have the following:

- OpenSearch Dashboards 3.5 or later
- Multiple data source feature enabled
- Workspace feature enabled
- Explore feature enabled

Note: The workspace feature is not compatible with multi-tenancy. To enable workspace, you must first disable multi-tenancy by setting `opensearch_security.multitenancy.enabled: false`.
{: .note}

## Enabling Discover Traces

To enable Discover Traces, you need to configure your OpenSearch Dashboards settings by editing the `opensearch_dashboards.yml` configuration file.

### Configuration

Add the following configuration to your `opensearch_dashboards.yml` file:

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

After updating the configuration file, restart OpenSearch Dashboards for the changes to take effect.

## Accessing Discover Traces

After enabling Discover Traces, navigate to an **Observability** workspace. The **Discover Traces** option appears in the left-hand navigation menu under **Discover**. Select **Traces** to access the trace exploration interface.

![Discover Traces page in navigation]({{site.url}}{{site.baseurl}}/images/discover-traces/trace-page.png)

## Setting up trace datasets

When you first access Discover Traces, you'll see an empty state that provides options for setting up your trace datasets.

### Automatic dataset creation

If your data source follows the OpenTelemetry naming conventions, Discover Traces can automatically create trace and log datasets for you. The feature looks for indexes with the following naming patterns:

- **Traces**: `otel-v1-apm-span*`
- **Correlated logs**: `logs-otel-v1*`

When these indexes are detected, select the auto-create option to automatically generate the datasets and establish the correlation relationship between traces and logs.

![Auto-create trace datasets]({{site.url}}{{site.baseurl}}/images/discover-traces/trace-auto-create.png)

### Manual dataset creation

If your indexes use different naming conventions, you'll need to manually create the datasets and configure the correlation relationships between traces and logs. Navigate to the **Datasets** tab, where you can create a dataset with the **Trace** signal type.

![Manual dataset creation]({{site.url}}{{site.baseurl}}/images/discover-traces/dataset-creation.png)

## Exploring trace data

The Discover Traces interface provides comprehensive tools for analyzing span data and understanding trace performance, including:

- **RED metrics**: View rate, error, and duration metrics at the top of the page to quickly assess trace performance and health.
- **Faceted fields**: Use faceted field filters to easily drill down and analyze specific aspects of your traces.
- **Span table**: Browse through spans with sortable columns and quick access to detailed information.

### Trace details flyout

To view detailed information about a specific span, select the timestamp in the span table. This opens the **Trace Details** flyout, which displays:

- The relationship of the selected span within its parent trace
- The hierarchical structure showing how the span relates to other spans in the same trace
- Span attributes and metadata

![Trace details flyout]({{site.url}}{{site.baseurl}}/images/discover-traces/trace-details-flyout.png)

### Trace detail page

From the flyout, you have two options to access the full trace detail page:

- Select the **span ID** from the Discover Traces table to open the full page view.
- Select **Open full page** from the flyout to expand to the full trace details page.

The full page view provides an expanded interface for deeper trace analysis with more screen space for examining span relationships and attributes.

![Discover Traces page with RED metrics and faceted fields]({{site.url}}{{site.baseurl}}/images/discover-traces/trace-detail-page.png)

## Correlating traces with logs

Discover Traces provides seamless integration with log data, allowing you to navigate from traces to related logs with proper context preserved.

### Viewing related logs

In the **Trace Details** flyout, locate the **Related logs** section. Select the **View in Discover Logs** button to navigate to the correlated log entries for the selected trace.

![Related logs button in trace details]({{site.url}}{{site.baseurl}}/images/discover-traces/related-logs.png)

### Log redirection with context

When you select **View in Discover Logs**, OpenSearch Dashboards automatically redirects you to the Discover Logs page with the trace context applied. The logs are filtered to show only entries related to the selected trace, making it easier to troubleshoot issues and understand the full context of trace events.

![Discover Logs page with trace context]({{site.url}}{{site.baseurl}}/images/discover-traces/logs-redirection.png)

This correlation feature streamlines the debugging process by providing a unified view of your telemetry data, helping you identify root causes and understand the complete picture of application behavior.
